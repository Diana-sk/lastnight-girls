import { NextRequest, NextResponse } from "next/server";
import { expireReservations } from "@/lib/expire";

// Ежедневная проверка истёкших резервов (09:13 по UTC — см. vercel.json;
// на Hobby-плане Vercel cron чаще раза в день запускать нельзя).
// Дополнительно та же проверка запускается при открытии админ-панели.
// Vercel автоматически шлёт заголовок Authorization: Bearer $CRON_SECRET.
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
    const result = await expireReservations();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Cron expire-reservations error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
