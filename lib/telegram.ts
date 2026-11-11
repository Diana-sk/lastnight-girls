// Telegram Bot utilities for LAST NIGHT OF THE YEAR GIRLS
// Примечание: api.telegram.org может быть недоступен без VPN.
// Все отправки — с таймаутом и без проброса ошибок наружу,
// чтобы недоступность Telegram никогда не ломала заявки.
// Если есть прокси/зеркало бот-API, задайте TELEGRAM_API_BASE в .env.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ORGANIZER_CHAT_ID = process.env.ORGANIZER_CHAT_ID!;
const API_BASE = process.env.TELEGRAM_API_BASE || "https://api.telegram.org";
const BASE_URL = `${API_BASE.replace(/\/$/, "")}/bot${BOT_TOKEN}`;

async function sendMessage(chatId: string | number, text: string, parseMode = "HTML") {
  try {
    const res = await fetch(`${BASE_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
      signal: AbortSignal.timeout(6000),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram error:", data.description);
    }
    return data;
  } catch (err) {
    console.error("Failed to send Telegram message:", err);
  }
}

// Публичная обёртка — для ответов бота пользователям (вебхук).
export async function sendMessageToUser(chatId: string | number, text: string) {
  return sendMessage(chatId, text);
}

// ─── TO ORGANIZER ──────────────────────────────────────────────

export async function notifyOrganizerNewApplication(app: {
  applicationId: string;
  name: string;
  age: number;
  telegram: string;
  contact: string;
  wishes?: string | null;
  allergies?: string | null;
  foodWishes?: string | null;
  secretChapter?: string | null;
}) {
  const secretChapterLabels: Record<string, string> = {
    yes: "да",
    no: "нет",
    unsure: "затрудняется",
  };
  const text = `
🔔 <b>Новая заявка!</b>

📋 ID: <code>${app.applicationId}</code>
👤 Имя: ${app.name}
🔢 Возраст: ${app.age}
📱 Telegram: ${app.telegram}
📞 Контакт: ${app.contact}
${app.allergies ? `⚠️ Аллергии: ${app.allergies}` : ""}
${app.foodWishes ? `🍽️ Пожелания к закускам: ${app.foodWishes}` : ""}
${app.secretChapter ? `🌙 Секретная глава (00:00–06:00): ${secretChapterLabels[app.secretChapter] || app.secretChapter}` : ""}
${app.wishes ? `💬 Пожелания: ${app.wishes}` : ""}

👉 Зайди в <a href="${process.env.NEXT_PUBLIC_ADMIN_URL}/admin">админ-панель</a> для рассмотрения.
  `.trim();

  await sendMessage(ORGANIZER_CHAT_ID, text);
}

export async function notifyOrganizerPaymentConfirmed(app: {
  applicationId: string;
  name: string;
  telegram: string;
}) {
  const text = `
✅ <b>Оплата подтверждена!</b>

📋 ID: <code>${app.applicationId}</code>
👤 Имя: ${app.name}
📱 Telegram: ${app.telegram}

💰 Сумма: 3 500 ₽
  `.trim();

  await sendMessage(ORGANIZER_CHAT_ID, text);
}

export async function notifyOrganizerReservationExpired(app: {
  applicationId: string;
  name: string;
  telegram: string;
}) {
  const text = `
⏰ <b>Резерв истёк!</b>

📋 ID: <code>${app.applicationId}</code>
👤 Имя: ${app.name}
📱 Telegram: ${app.telegram}

Место освобождено автоматически.
  `.trim();

  await sendMessage(ORGANIZER_CHAT_ID, text);
}

export async function notifyOrganizerParticipantLinked(app: {
  applicationId: string;
  name: string;
  telegram: string;
}) {
  const text = `
🔗 <b>Участница на связи!</b>

📋 ID: <code>${app.applicationId}</code>
👤 Имя: ${app.name}
📱 Telegram: ${app.telegram}

Она запустила бота — chat_id привязан к заявке автоматически. Теперь все уведомления дойдут до неё.
  `.trim();

  await sendMessage(ORGANIZER_CHAT_ID, text);
}

// ─── TO PARTICIPANT ────────────────────────────────────────────

// Подтверждение получения заявки. Telegram позволяет писать пользователю
// только после того, как она сама запустила бота (/start) — поэтому chat_id
// ищется по предыдущим заявкам этого же ника; если не найден, сообщение
// просто не отправится (пользователь получит весточку при первом /start).
export async function notifyParticipantApplicationReceived(
  chatId: string | number,
  name: string,
  applicationId: string,
  isWaitlist = false
) {
  const text = `
🖤 Привет, ${name}!

Мы получили твою заявку на <b>LAST NIGHT OF THE YEAR GIRLS</b>.

📋 Номер заявки: <code>${applicationId}</code>

${isWaitlist
  ? "Все основные места сейчас заняты — ты в листе ожидания. Если освободится место, мы напишем тебе первым делом."
  : "Организатор рассмотрит её в ближайшее время и свяжется с тобой здесь."}

Следи за сообщениями! 🥂
  `.trim();

  await sendMessage(chatId, text);
}

export async function notifyParticipantApproved(
  chatId: string | number,
  name: string,
  applicationId: string
) {
  const text = `
🎉 <b>${name}, твоя заявка одобрена!</b>

📋 ID: <code>${applicationId}</code>

Для оплаты и подтверждения места переведи <b>3 500 ₽</b> через СБП:

📱 Номер телефона: <code>+7 950 029-89-46</code>
💳 Система: СБП (Система быстрых платежей)
💰 Сумма: <b>3 500 рублей</b> ровно

В комментарии к переводу укажи свой номер заявки: <code>${applicationId}</code>

⏰ Место зарезервировано за тобой на <b>48 часов</b>.
После перевода напиши организатору для подтверждения.

🖤 LAST NIGHT OF THE YEAR GIRLS
  `.trim();

  await sendMessage(chatId, text);
}

export async function notifyParticipantRejected(
  chatId: string | number,
  name: string
) {
  const text = `
💔 ${name}, к сожалению, на этот раз не получилось.

Организатор рассмотрел твою заявку, но все места уже заняты или ты не прошла отбор.

Спасибо, что проявила интерес к вечеринке 🖤
  `.trim();

  await sendMessage(chatId, text);
}

export async function notifyParticipantWaitlist(
  chatId: string | number,
  name: string,
  applicationId: string
) {
  const text = `
🕐 <b>${name}, ты в листе ожидания!</b>

📋 ID: <code>${applicationId}</code>

Все основные места сейчас заняты, но ты следующая в очереди. Если кто-то откажется — мы сразу свяжемся с тобой.

🖤 LAST NIGHT OF THE YEAR GIRLS
  `.trim();

  await sendMessage(chatId, text);
}

export async function notifyParticipantPaymentConfirmed(
  chatId: string | number,
  name: string
) {
  const text = `
✅ <b>${name}, оплата подтверждена!</b>

Ты в списке участниц <b>LAST NIGHT OF THE YEAR GIRLS</b> 🖤

📅 19 декабря 2026, 20:00
📍 Санкт-Петербург (адрес пришлём за 2 недели до мероприятия)

До встречи! 🥂✨
  `.trim();

  await sendMessage(chatId, text);
}

export async function notifyParticipantReservationExpired(
  chatId: string | number,
  name: string
) {
  const text = `
⏰ ${name}, время оплаты истекло.

К сожалению, 48 часов прошли, и место было освобождено. Если ты хочешь попробовать снова — напиши организатору.

🖤 LAST NIGHT OF THE YEAR GIRLS
  `.trim();

  await sendMessage(chatId, text);
}
