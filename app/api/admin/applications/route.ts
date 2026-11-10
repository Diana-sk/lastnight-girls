import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { expireReservations } from "@/lib/expire";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Neon (serverless Postgres) может разорвать соединение из пула (P1017) —
// повторяем операцию на свежем коннекте.
export async function withDbRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
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
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastErr;
}

export function verifyAdminToken(req: NextRequest): boolean {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return false;
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Нет доступа." }, { status: 401 });
}

// GET all applications with filters
export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorized();

  // Фоном помечаем истёкшие резервы — админ сразу видит актуальные статусы
  void withDbRetry(() => expireReservations()).catch((err) =>
    console.error("expireReservations on dashboard:", err)
  );

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { telegram: { contains: search, mode: "insensitive" } },
      { applicationId: { contains: search, mode: "insensitive" } },
    ];
  }

  const [applications, total, paidCount, settings] = await withDbRetry(() =>
    Promise.all([
      prisma.application.findMany({
        where,
        include: { payments: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
      prisma.application.count({ where: { status: "PAID" } }),
      prisma.setting.findMany(),
    ])
  );

  const settingsMap = Object.fromEntries(settings.map((s: { key: string; value: string }) => [s.key, s.value]));
  const maxSpots = parseInt(settingsMap.max_spots || "15");

  const totalRevenue = await withDbRetry(() =>
    prisma.payment.aggregate({
      where: { status: "CONFIRMED" },
      _sum: { amount: true },
    })
  );

  return NextResponse.json({
    applications,
    total,
    page,
    paidCount,
    spotsLeft: Math.max(0, maxSpots - paidCount),
    maxSpots,
    totalRevenue: totalRevenue._sum.amount || 0,
  });
}
