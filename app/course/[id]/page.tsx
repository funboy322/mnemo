import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse } from "@/lib/repository";
import { CoursePath } from "@/components/course-path";
import { labelLevelKey } from "@/lib/utils";
import { getServerT } from "@/lib/i18n";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = getCourse(id);
  if (!data) return { title: "Not found" };
  return {
    title: data.course.title,
    description: data.course.description,
    openGraph: { title: data.course.title, description: data.course.description },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getCourse(id);
  if (!data) notFound();
  const t = await getServerT();

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-10 max-w-2xl mx-auto w-full">
      <Link
        href="/dashboard"
        className="reveal inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 mb-4 transition-colors"
        style={{ animationDelay: "0ms" }}
      >
        <ArrowLeft className="h-4 w-4" /> {t.myCoursesTitle}
      </Link>

      <div
        className="reveal rounded-card bg-gradient-to-br from-brand-500 to-brand-700 text-white p-6 sm:p-10 mb-10 relative overflow-hidden"
        style={{ animationDelay: "80ms" }}
      >
        {/* Huge background emoji for atmosphere */}
        <div
          className="absolute -top-6 -right-6 text-[14rem] leading-none opacity-[0.07] pointer-events-none select-none"
          aria-hidden
        >
          {data.course.emoji}
        </div>
        <div className="text-5xl sm:text-6xl mb-4 relative z-10" aria-hidden>
          {data.course.emoji}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight relative z-10">
          {data.course.title}
        </h1>
        <p className="mt-3 text-white/85 leading-relaxed text-sm sm:text-base max-w-prose relative z-10">
          {data.course.description}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] bg-white/15 px-3 py-1.5 rounded-full relative z-10">
          <span>{t.lessonsCount(data.lessons.length)}</span>
          <span className="opacity-50">·</span>
          <span>{t[labelLevelKey(data.course.level)]}</span>
        </div>
      </div>

      <div className="reveal" style={{ animationDelay: "200ms" }}>
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
    </div>
  );
}
