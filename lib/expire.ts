import { prisma } from "@/lib/db";
import { notifyOrganizerReservationExpired } from "@/lib/telegram";

// Ищет заявки с истёкшим 48-часовым резервом, переводит их в EXPIRED
// и уведомляет организатора (один раз на заявку — через expiryNotifiedAt).
// Вызывается ежедневным кроном (vercel.json) и при открытии админ-панели.
export async function expireReservations(): Promise<{ checked: number; notified: number }> {
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

  return { checked: expired.length, notified };
}
