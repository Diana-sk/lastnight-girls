import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  sendMessageToUser,
  notifyOrganizerParticipantLinked,
} from "@/lib/telegram";

// Вебхук Telegram-бота. Telegram шлёт сюда обновления (POST),
// если задан через setWebhook с secret_token.
// secret_token сверяем с CRON_SECRET — один серверный секрет на оба механизма.
export const maxDuration = 30;

// Neon (serverless Postgres) может разорвать соединение из пула (P1017) —
// повторяем операцию на свежем коннекте.
async function withDbRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastErr = err;
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code?: string }).code
          : undefined;
      const transient = code === "P1017" || code === "P1001" || code === "P2024";
      if (!transient || i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 600 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const token = req.headers.get("x-telegram-bot-api-secret-token");
    if (token !== secret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  let update: {
    message?: {
      text?: string;
      chat?: { id: number };
      from?: { username?: string; first_name?: string };
    };
  };
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const msg = update.message;
  if (!msg?.chat?.id || typeof msg.text !== "string") {
    return NextResponse.json({ ok: true });
  }

  const chatId = msg.chat.id;
  const username = msg.from?.username?.toLowerCase();
  const firstName = msg.from?.first_name || "девушка";

  // Реагируем только на /start (с необязательным параметром, например /start LNG-029)
  const startMatch = msg.text.match(/^\/start(?:@\w+)?(?:\s+(\S+))?\s*$/);
  if (!startMatch) {
    return NextResponse.json({ ok: true });
  }
  const payload = startMatch[1];

  try {
    // Ищем заявку: сначала по номеру из deep-ссылки, иначе по никнейму
    let application = null;
    if (payload && /^LNG-\d+$/i.test(payload)) {
      application = await withDbRetry(() =>
        prisma.application.findFirst({
          where: {
            applicationId: payload.toUpperCase(),
            status: { notIn: ["REJECTED", "CANCELLED", "REFUNDED"] },
          },
          orderBy: { createdAt: "desc" },
        })
      );
    }
    if (!application && username) {
      const normalized = `@${username}`;
      application = await withDbRetry(() =>
        prisma.application.findFirst({
          where: {
            telegram: normalized,
            status: { notIn: ["REJECTED", "CANCELLED", "REFUNDED"] },
          },
          orderBy: { createdAt: "desc" },
        })
      );
    }

    if (!application) {
      await sendMessageToUser(
        chatId,
        [
          `🖤 Привет, ${firstName}!`,
          "",
          "Я бот закрытой вечеринки LAST NIGHT OF THE YEAR GIRLS.",
          username
            ? "Я не нашёл активную заявку с твоим ником в Telegram. Убедись, что в анкете указан именно этот ник, или напиши организатору."
            : "У тебя не задан ник в Telegram — я не смогу найти твою заявку. Поставь ник в настройках Telegram и запусти меня снова.",
          "",
          "Если уже подавала заявку — напиши организатору, она поможет 🥂",
        ].join("\n")
      );
      return NextResponse.json({ ok: true });
    }

    // Привязываем chat_id (один раз — при первом запуске бота)
    if (application.participantChatId !== String(chatId)) {
      await withDbRetry(() =>
        prisma.application.update({
          where: { id: application.id },
          data: { participantChatId: String(chatId) },
        })
      );

      await notifyOrganizerParticipantLinked({
        applicationId: application.applicationId,
        name: application.name,
        telegram: application.telegram,
      });
    }

    // Сообщение зависит от реального статуса заявки, чтобы не обещать
    // «подтверждение», которого организатор ещё не давал.
    const statusLine: Record<string, string> = {
      NEW: "Она принята и ждёт рассмотрения — как только организатор примет решение, ответ придёт сюда.",
      UNDER_REVIEW: "Она сейчас на рассмотрении — как только организатор примет решение, ответ придёт сюда.",
      WAITLIST: "Ты в листе ожидания — если освободится место, организатор напишет сюда.",
      APPROVED: "Она одобрена! Организатор скоро отправит реквизиты для оплаты.",
      PAYMENT_PENDING: "Она одобрена — ждём оплату. Реквизиты уже у тебя в переписке с организатором.",
      PAID: "Оплата подтверждена — до встречи на вечеринке!",
      REFUND_PENDING: "По заявке идёт возврат средств — организатор напишет сюда.",
      EXPIRED: "Резерв места истёк. Если хочешь вернуться — напиши организатору.",
    };

    await sendMessageToUser(
      chatId,
      [
        `🖤 Привет, ${firstName}!`,
        "",
        `Твоя заявка <b>${application.applicationId}</b> привязана к этому чату.`,
        statusLine[application.status],
        "Все новости и ответ организатора придут сюда. Следи за сообщениями 🥂",
        "",
        "LAST NIGHT OF THE YEAR GIRLS",
      ].join("\n")
    );
  } catch (err) {
    console.error("Telegram webhook error:", err);
  }

  return NextResponse.json({ ok: true });
}
