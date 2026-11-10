import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyOrganizerNewApplication } from "@/lib/telegram";

// Neon (serverless Postgres) может разорвать соединение из пула (P1017) —
// повторяем операцию на свежем коннекте.
async function withDbRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
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
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr;
}

// Counter for generating LNG-XXX IDs
async function generateApplicationId(): Promise<string> {
  const count = await prisma.application.count();
  const num = (count + 1).toString().padStart(3, "0");
  return `LNG-${num}`;
}

// GET - check if registrations are open (public)
export async function GET() {
  try {
    const [paidCount, settings] = await withDbRetry(() =>
      Promise.all([
        prisma.application.count({ where: { status: "PAID" } }),
        prisma.setting.findMany(),
      ]),
    );

    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    const maxSpots = parseInt(settingsMap.max_spots || "15");
    const acceptUntil = settingsMap.accept_until
      ? new Date(settingsMap.accept_until)
      : new Date("2026-12-05T23:59:59");

    const now = new Date();
    const isExpired = now > acceptUntil;
    const isFull = paidCount >= maxSpots;

    return NextResponse.json({
      spotsLeft: Math.max(0, maxSpots - paidCount),
      totalSpots: maxSpots,
      paidCount,
      isOpen: !isExpired,
      isFull,
      isWaitlist: isFull && !isExpired,
      acceptUntil: acceptUntil.toISOString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - submit application
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, age, telegram, contact, wishes, allergies, foodWishes, secretChapter, agreeRules, agreePrivacy } = body;

    // Validation
    if (!name || !age || !telegram || !contact) {
      return NextResponse.json({ error: "Заполни все обязательные поля." }, { status: 400 });
    }

    if (!agreeRules || !agreePrivacy) {
      return NextResponse.json({ error: "Необходимо согласие с правилами и политикой конфиденциальности." }, { status: 400 });
    }

    if (parseInt(age) < 18) {
      return NextResponse.json({ error: "Мероприятие только для участниц от 18 лет." }, { status: 400 });
    }

    // Check if accepting applications
    const [paidCount, settings] = await withDbRetry(() =>
      Promise.all([
        prisma.application.count({ where: { status: "PAID" } }),
        prisma.setting.findMany(),
      ]),
    );

    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    const maxSpots = parseInt(settingsMap.max_spots || "15");
    const acceptUntil = settingsMap.accept_until
      ? new Date(settingsMap.accept_until)
      : new Date("2026-12-05T23:59:59");

    const now = new Date();
    if (now > acceptUntil) {
      return NextResponse.json({ error: "Приём заявок завершён." }, { status: 400 });
    }

    const isFull = paidCount >= maxSpots;

    // Check for duplicate telegram
    const existing = await withDbRetry(() =>
      prisma.application.findFirst({
        where: {
          telegram: telegram.toLowerCase().replace("@", ""),
          status: { notIn: ["REJECTED", "CANCELLED", "REFUNDED"] },
        },
      }),
    );
    if (existing) {
      return NextResponse.json({ error: "Заявка с этим Telegram уже существует." }, { status: 400 });
    }

    const applicationId = await withDbRetry(generateApplicationId);
    const cleanTelegram = telegram.startsWith("@") ? telegram : `@${telegram}`;

    const application = await withDbRetry(() =>
      prisma.application.create({
        data: {
          applicationId,
          name: name.trim(),
          age: parseInt(age),
          telegram: cleanTelegram,
          contact: contact.trim(),
          wishes: wishes?.trim() || null,
          allergies: allergies?.trim() || null,
          foodWishes: foodWishes?.trim() || null,
          secretChapter: ["yes", "no", "unsure"].includes(secretChapter) ? secretChapter : null,
          status: isFull ? "WAITLIST" : "NEW",
          isWaitlist: isFull,
        },
      }),
    );

    // Notify organizer (в фоне — не блокируем ответ участнице)
    void notifyOrganizerNewApplication({
      applicationId: application.applicationId,
      name: application.name,
      age: application.age,
      telegram: application.telegram,
      contact: application.contact,
      wishes: application.wishes,
      allergies: application.allergies,
      foodWishes: application.foodWishes,
      secretChapter: application.secretChapter,
    }).catch((err) => console.error("Telegram notify failed:", err));

    return NextResponse.json({
      success: true,
      applicationId: application.applicationId,
      isWaitlist: isFull,
      message: isFull
        ? "Ты добавлена в лист ожидания! Мы свяжемся с тобой, если освободится место."
        : "Спасибо за заявку! Мы рассмотрим её и свяжемся с тобой в Telegram.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Произошла ошибка. Попробуй ещё раз." }, { status: 500 });
  }
}
