import { NextRequest, NextResponse } from "next/server";
import { getLesson, getCourse, saveLessonContent, getLessonsByCourse } from "@/lib/repository";
import { generateLessonContent } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const lesson = await getLesson(id);
  if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (lesson.content) {
    return NextResponse.json({ lesson });
  }

  const courseData = await getCourse(lesson.courseId);
  if (!courseData) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  const allLessons = await getLessonsByCourse(lesson.courseId);
  const previousTitles = allLessons
    .filter((l) => l.position < lesson.position)
    .map((l) => l.title);

  try {
    const content = await generateLessonContent({
      courseTitle: courseData.course.title,
      courseTopic: courseData.course.topic,
      level: courseData.course.level,
      language: courseData.course.language,
      lesson: {
        title: lesson.title,
        summary: lesson.summary,
        objectives: lesson.objectives as string[],
      },
      previousLessonTitles: previousTitles,
      lessonNumber: lesson.position + 1,
      totalLessons: allLessons.length,
    });
    await saveLessonContent(id, content);
    return NextResponse.json({ lesson: { ...lesson, content, generatedAt: new Date() } });
  } catch (err) {
    console.error("Lesson generation failed:", err);
    return NextResponse.json({ error: "Generation failed", message: (err as Error).message }, { status: 500 });
  }
}
