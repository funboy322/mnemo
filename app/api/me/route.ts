import { NextRequest, NextResponse } from "next/server";
import {
  getUserStats,
  listUserCoursesWithProgress,
  hasActivityToday,
  countLessonsDueForReview,
} from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") ?? "";
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const [stats, courses, dailyGoalMet, reviewDueCount] = await Promise.all([
    getUserStats(userId),
    listUserCoursesWithProgress(userId),
    hasActivityToday(userId),
    countLessonsDueForReview(userId),
  ]);
  return NextResponse.json({ stats, courses, dailyGoalMet, reviewDueCount });
}
