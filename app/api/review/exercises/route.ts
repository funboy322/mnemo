import { NextRequest, NextResponse } from "next/server";
import { getReviewExercises } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "5"), 10);
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const items = getReviewExercises(userId, limit);
  return NextResponse.json({ items });
}
