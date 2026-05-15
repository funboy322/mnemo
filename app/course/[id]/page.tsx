import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse } from "@/lib/repository";
import { CoursePath } from "@/components/course-path";
import { labelLevelKey } from "@/lib/utils";
import { getServerT } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getCourse(id);
  if (!data) return { title: "Not found" };
  return {
    title: data.course.title,
    description: data.course.description,
    openGraph: { title: data.course.title, description: data.course.description },
  };
}

/**
 * Course page — Quiet direction.
 *
 * The previous version had a saturated brand-gradient hero box with a
 * giant decorative emoji. Quiet replaces it with a plain mono-caps
 * eyebrow ("LESSONS · LEVEL · LANGUAGE"), the emoji on its own line at
 * normal size as the course identity (per the spec, emoji is the
 * course's only image), the title in Inter Tight 500, then a short
 * description and the path of lesson nodes.
 */
export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getCourse(id);
  if (!data) notFound();
  const t = await getServerT();

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-2xl mx-auto w-full">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-8 transition-colors"
      >
        ← {t.myCoursesTitle}
      </Link>

      <div>
        <div className="eyebrow">
          {t.lessonsCount(data.lessons.length)} · {t[labelLevelKey(data.course.level)]}
        </div>
        <div className="text-[44px] sm:text-[56px] leading-none mt-4" aria-hidden>
          {data.course.emoji}
        </div>
        <h1 className="mt-5 font-display font-medium text-[28px] sm:text-[40px] leading-[1.08] tracking-[-0.025em] text-ink">
          {data.course.title}
        </h1>
        <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.55] text-ink-soft max-w-prose">
          {data.course.description}
        </p>
      </div>

      <div className="mt-12 sm:mt-16">
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
