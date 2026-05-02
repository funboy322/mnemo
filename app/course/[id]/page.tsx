import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse } from "@/lib/repository";
import { CoursePath } from "@/components/course-path";
import { labelLevel } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = getCourse(id);
  if (!data) return { title: "Курс не найден" };
  return {
    title: data.course.title,
    description: data.course.description,
    openGraph: {
      title: data.course.title,
      description: data.course.description,
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getCourse(id);
  if (!data) notFound();

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-10 max-w-2xl mx-auto w-full">
      <div className="rounded-card bg-gradient-to-br from-brand-500 to-brand-700 text-white p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="text-5xl mb-3" aria-hidden>{data.course.emoji}</div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{data.course.title}</h1>
        <p className="mt-2 text-white/85 leading-relaxed">{data.course.description}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/15 px-3 py-1.5 rounded-full">
          <span>{data.lessons.length} уроков</span>
          <span className="opacity-50">·</span>
          <span>{labelLevel(data.course.level)}</span>
        </div>
      </div>

      <CoursePath
        courseId={id}
        lessons={data.lessons.map((l) => ({
          id: l.id,
          position: l.position,
          title: l.title,
          summary: l.summary,
        }))}
      />
    </div>
  );
}
