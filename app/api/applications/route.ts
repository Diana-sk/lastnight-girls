import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyOrganizerNewApplication } from "@/lib/telegram";

// Counter for generating LNG-XXX IDs
async function generateApplicationId(): Promise<string> {
  const count = await prisma.application.count();
  const num = (count + 1).toString().padStart(3, "0");
  return `LNG-${num}`;
}

// GET - check if registrations are open (public)
export async function GET() {
  try {
    const [paidCount, settings] = await Promise.all([
      prisma.application.count({ where: { status: "PAID" } }),
      prisma.setting.findMany(),
    ]);

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
    const { name, age, telegram, contact, wishes, allergies, foodWishes, agreeRules, agreePrivacy } = body;

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
    const [paidCount, settings] = await Promise.all([
      prisma.application.count({ where: { status: "PAID" } }),
      prisma.setting.findMany(),
    ]);

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
    const existing = await prisma.application.findFirst({
      where: {
        telegram: telegram.toLowerCase().replace("@", ""),
        status: { notIn: ["REJECTED", "CANCELLED", "REFUNDED"] },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Заявка с этим Telegram уже существует." }, { status: 400 });
    }

    const applicationId = await generateApplicationId();
    const cleanTelegram = telegram.startsWith("@") ? telegram : `@${telegram}`;

    const application = await prisma.application.create({
      data: {
        applicationId,
        name: name.trim(),
        age: parseInt(age),
        telegram: cleanTelegram,
        contact: contact.trim(),
        wishes: wishes?.trim() || null,
        allergies: allergies?.trim() || null,
        foodWishes: foodWishes?.trim() || null,
        status: isFull ? "WAITLIST" : "NEW",
        isWaitlist: isFull,
      },
    });

    // Notify organizer
    await notifyOrganizerNewApplication({
      applicationId: application.applicationId,
      name: application.name,
      age: application.age,
      telegram: application.telegram,
      contact: application.contact,
      wishes: application.wishes,
      allergies: application.allergies,
      foodWishes: application.foodWishes,
    });

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
