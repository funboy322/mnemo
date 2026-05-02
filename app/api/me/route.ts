import { NextRequest, NextResponse } from "next/server";
import { getUserStats, listUserCoursesWithProgress, hasActivityToday } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") ?? "";
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const stats = getUserStats(userId);
  const courses = listUserCoursesWithProgress(userId);
  const dailyGoalMet = hasActivityToday(userId);
  return NextResponse.json({ stats, courses, dailyGoalMet });
}
