import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse, getLesson } from "@/lib/repository";
import { LessonGate } from "@/components/lesson/lesson-gate";
import type { LessonContent } from "@/lib/schemas";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) return { title: "Урок не найден" };
  return {
    title: lesson.title,
    description: lesson.summary,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: courseId, lessonId } = await params;
  const course = getCourse(courseId);
  const lesson = getLesson(lessonId);
  if (!course || !lesson) notFound();

  return (
    <LessonGate
      courseId={courseId}
      lessonId={lessonId}
      title={lesson.title}
      summary={lesson.summary}
      objectives={lesson.objectives as string[]}
      initialContent={(lesson.content as LessonContent | null) ?? null}
      courseTitle={course.course.title}
    />
  );
}
