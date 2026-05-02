import { NextRequest, NextResponse } from "next/server";
import { getCourse, getCompletedLessonIds } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const userId = req.nextUrl.searchParams.get("userId") ?? "";
  const data = getCourse(id);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const completed = userId ? getCompletedLessonIds(userId, id) : new Set<string>();
  return NextResponse.json({
    course: data.course,
    lessons: data.lessons.map((l) => ({
      id: l.id,
      position: l.position,
      title: l.title,
      summary: l.summary,
      objectives: l.objectives,
      hasContent: l.content !== null && l.content !== undefined,
      completed: completed.has(l.id),
    })),
  });
}
