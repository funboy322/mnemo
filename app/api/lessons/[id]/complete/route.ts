import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getLesson, recordLessonComplete } from "@/lib/repository";

export const runtime = "nodejs";

const BodySchema = z.object({
  userId: z.string().min(1),
  score: z.number().int().min(0),
  totalExercises: z.number().int().min(1),
});

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const lesson = getLesson(id);
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  const result = recordLessonComplete({
    userId: parsed.data.userId,
    courseId: lesson.courseId,
    lessonId: id,
    score: parsed.data.score,
    totalExercises: parsed.data.totalExercises,
  });

  return NextResponse.json(result);
}
