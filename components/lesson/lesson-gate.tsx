"use client";
import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { LessonPlayer } from "./lesson-player";
import type { LessonContent } from "@/lib/schemas";

/**
 * LessonGate — Quiet direction.
 *
 * Shows the lesson title + objectives, then lazy-loads the generated
 * content on tap. The previous version had a saturated white card with
 * shadow; Quiet replaces it with a flat 1px-bordered card on bone
 * background. The "New lesson" eyebrow uses Quiet's mono caps style.
 */
export function LessonGate(props: {
  courseId: string;
  lessonId: string;
  title: string;
  summary: string;
  objectives: string[];
  initialContent: LessonContent | null;
  courseTitle: string;
}) {
  const t = useT();
  const [content, setContent] = React.useState<LessonContent | null>(props.initialContent);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/lessons/${props.lessonId}`);
      const d = await r.json();
      if (!r.ok) {
        console.error("Lesson load failed:", d);
        throw new Error(d.message || d.error || "Generation failed");
      }
      setContent(d.lesson.content);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (content) {
    return (
      <LessonPlayer
        courseId={props.courseId}
        lessonId={props.lessonId}
        title={props.title}
        content={content}
      />
    );
  }

  return (
    <div className="px-4 sm:px-6 py-10 sm:py-14 max-w-2xl mx-auto w-full">
      <Link
        href={`/course/${props.courseId}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink mb-8 transition-colors"
      >
        ← {t.toCourse}
      </Link>

      <div className="card-quiet p-6 sm:p-8">
        <p className="eyebrow">{t.newLesson}</p>
        <h1 className="mt-3 font-display font-medium text-[24px] sm:text-[32px] leading-[1.1] tracking-[-0.02em] text-ink">
          {props.title}
        </h1>
        <p className="mt-3 text-[15px] sm:text-[16px] text-ink-soft leading-relaxed">
          {props.summary}
        </p>

        <div className="mt-6 pt-6 border-t border-rule">
          <p className="eyebrow-tight mb-3">{t.whatYoullLearn}</p>
          <ul className="space-y-2">
            {props.objectives.map((o) => (
              <li
                key={o}
                className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-ink-soft leading-relaxed"
              >
                <span className="text-green mt-1.5 leading-none">·</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="mt-6 text-[13.5px] text-ink-soft border-l-2 border-ink pl-3 py-1 animate-shake">
            {error}
          </div>
        )}

        <Button onClick={load} disabled={loading} size="lg" className="w-full mt-8">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.preparingMaterial}
            </>
          ) : (
            <>{t.startButton} →</>
          )}
        </Button>
        {loading && (
          <p className="text-[12px] text-ink-muted text-center mt-3 font-mono tracking-[0.06em]">
            {t.preparingHint}
          </p>
        )}
      </div>
    </div>
  );
}
