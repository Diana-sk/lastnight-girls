import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminToken, unauthorized, withDbRetry } from "../route";
import {
  notifyParticipantApproved,
  notifyParticipantRejected,
  notifyParticipantPaymentConfirmed,
  notifyOrganizerPaymentConfirmed,
} from "@/lib/telegram";
import { ApplicationStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(req)) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const { action, adminNotes, participantChatId } = body;

    const application = await withDbRetry(() =>
      prisma.application.findUnique({
        where: { id },
        include: { payments: true },
      })
    );

    if (!application) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
    }

    // chat_id участницы: приоритет — ручной ввод из админки,
    // иначе автопривязка из бота (participantChatId в заявке)
    const effectiveChatId = participantChatId || application.participantChatId || null;

    const updateData: {
      status?: ApplicationStatus;
      reservedUntil?: Date | null;
      adminNotes?: string | null;
    } = {};

    if (typeof adminNotes === "string") {
      updateData.adminNotes = adminNotes;
    }

    const now = new Date();

    switch (action) {
      case "approve": {
        updateData.status = "APPROVED";
        // 48 hours reservation
        updateData.reservedUntil = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        if (effectiveChatId) {
          await notifyParticipantApproved(
            effectiveChatId,
            application.name,
            application.applicationId
          );
        }
        break;
      }

      case "reject": {
        updateData.status = "REJECTED";
        updateData.reservedUntil = null;
        if (effectiveChatId) {
          await notifyParticipantRejected(effectiveChatId, application.name);
        }
        break;
      }

      case "send_payment": {
        updateData.status = "PAYMENT_PENDING";
        if (effectiveChatId) {
          await notifyParticipantApproved(
            effectiveChatId,
            application.name,
            application.applicationId
          );
        }
        break;
      }

      case "confirm_payment": {
        updateData.status = "PAID";
        updateData.reservedUntil = null;

        // Check if there is an existing pending payment, otherwise create one
        const existingPayment = application.payments.find(
          (p) => p.status === "PENDING"
        );

        if (existingPayment) {
          await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
              status: "CONFIRMED",
              confirmedAt: now,
              confirmedBy: "admin",
            },
          });
        } else {
          await prisma.payment.create({
            data: {
              applicationId: application.id,
              amount: 3500,
              status: "CONFIRMED",
              confirmedAt: now,
              confirmedBy: "admin",
            },
          });
        }

        if (effectiveChatId) {
          await notifyParticipantPaymentConfirmed(effectiveChatId, application.name);
        }

        await notifyOrganizerPaymentConfirmed({
          applicationId: application.applicationId,
          name: application.name,
          telegram: application.telegram,
        });
        break;
      }

      case "refund_pending": {
        updateData.status = "REFUND_PENDING";
        break;
      }

      case "refund_complete": {
        updateData.status = "REFUNDED";
        // Mark all payments as refunded
        await prisma.payment.updateMany({
          where: { applicationId: application.id },
          data: { status: "REFUNDED" },
        });
        break;
      }

      case "cancel": {
        updateData.status = "CANCELLED";
        updateData.reservedUntil = null;
        break;
      }

      case "update_notes": {
        // Only notes updated
        break;
      }

      default:
        return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
    }

    const updatedApp = await withDbRetry(() =>
      prisma.application.update({
        where: { id },
        data: updateData,
        include: { payments: true },
      })
    );

    return NextResponse.json({
      success: true,
      application: updatedApp,
    });
  } catch (err) {
    console.error("Admin action error:", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
