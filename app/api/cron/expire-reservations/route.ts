import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyOrganizerReservationExpired } from "@/lib/telegram";

// Проверка истёкших резервов. Вызывается Vercel Cron (см. vercel.json)
// каждый час. Vercel автоматически шлёт заголовок Authorization: Bearer $CRON_SECRET.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const allowed = secret
    ? auth === `Bearer ${secret}`
    : process.env.NODE_ENV !== "production";
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const expired = await prisma.application.findMany({
      where: {
        status: { in: ["APPROVED", "PAYMENT_PENDING"] },
        reservedUntil: { not: null, lt: now },
        expiryNotifiedAt: null,
      },
    });

    let notified = 0;
    for (const app of expired) {
      await prisma.application.update({
        where: { id: app.id },
        data: {
          status: "EXPIRED",
          reservedUntil: null,
          expiryNotifiedAt: now,
        },
      });

      await notifyOrganizerReservationExpired({
        applicationId: app.applicationId,
        name: app.name,
        telegram: app.telegram,
      });
      notified++;
    }

    return NextResponse.json({ checked: expired.length, notified });
  } catch (err) {
    console.error("Cron expire-reservations error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
