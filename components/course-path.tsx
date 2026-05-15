"use client";
import * as React from "react";
import Link from "next/link";
import { useUserId } from "./user-provider";
import { useT } from "./locale-provider";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { prefetchAllLessons } from "@/lib/prefetch";

type LessonItem = {
  id: string;
  position: number;
  title: string;
  summary: string;
};

type LessonState = "completed" | "current" | "locked";

/**
 * CoursePath — Quiet direction.
 *
 * The Duolingo-style zigzag is preserved, but every visual element is
 * pulled back to Quiet's vocabulary: flat 56px circles instead of
 * pressed 3D 80px buttons, a thin 1px rule line as the connecting path,
 * no fluorescent ring around the current node. The signature green dot
 * only appears on completed/current states.
 */
export function CoursePath({ courseId, lessons }: { courseId: string; lessons: LessonItem[] }) {
  const userId = useUserId();
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set());
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!userId) return;
    fetch(`/api/courses/${courseId}?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        const ids = new Set<string>(
          (d.lessons || [])
            .filter((l: { completed: boolean; id: string }) => l.completed)
            .map((l: { id: string }) => l.id),
        );
        setCompletedIds(ids);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [courseId, userId]);

  React.useEffect(() => {
    prefetchAllLessons(courseId);
  }, [courseId]);

  function stateFor(lesson: LessonItem): LessonState {
    if (completedIds.has(lesson.id)) return "completed";
    const prev = lessons.find((l) => l.position === lesson.position - 1);
    if (!prev || completedIds.has(prev.id) || lesson.position === 0) return "current";
    return "locked";
  }

  return (
    <div className="relative">
      {/* Thin connecting rule line down the middle */}
      <div
        className="absolute left-1/2 top-[40px] bottom-[40px] w-px bg-rule -translate-x-1/2"
        aria-hidden
      />
      <div className="space-y-7 relative">
        {lessons.map((lesson, idx) => {
          const state = loaded ? stateFor(lesson) : "locked";
          const offset = lessonOffset(idx);
          return (
            <LessonNode
              key={lesson.id}
              lesson={lesson}
              state={state}
              offsetX={offset}
              courseId={courseId}
            />
          );
        })}
      </div>
    </div>
  );
}

function lessonOffset(idx: number): number {
  // Gentle zigzag — narrower than before so Quiet stays calm.
  const pattern = [0, 48, 24, -24, -48, -24, 0, 24, 48, 24, 0, -24];
  return pattern[idx % pattern.length];
}

function offsetTransform(offset: number): string {
  if (offset === 0) return "translateX(0)";
  const sign = offset < 0 ? "-" : "";
  const abs = Math.abs(offset);
  return `translateX(${sign}clamp(${abs / 2}px, ${abs / 5}vw, ${abs}px))`;
}

function LessonNode({
  lesson,
  state,
  offsetX,
  courseId,
}: {
  lesson: LessonItem;
  state: LessonState;
  offsetX: number;
  courseId: string;
}) {
  const t = useT();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const isLocked = state === "locked";
  const isDone = state === "completed";
  const isCurrent = state === "current";

  return (
    <div
      className={cn("relative flex justify-center min-h-[68px]", open && "z-40")}
      ref={ref}
    >
      <div
        style={{ transform: offsetTransform(offsetX) }}
        className="relative flex flex-col items-center"
      >
        <button
          type="button"
          onClick={() => !isLocked && setOpen((o) => !o)}
          disabled={isLocked}
          className={cn(
            "h-14 w-14 rounded-full border flex items-center justify-center transition-colors",
            isLocked && "bg-bone border-rule text-ink-muted cursor-not-allowed",
            isDone && "bg-green-soft border-green text-green",
            isCurrent && "bg-green border-green text-surface hover:brightness-95",
          )}
          aria-label={lesson.title}
        >
          {isDone ? (
            <Check className="h-5 w-5" strokeWidth={3} />
          ) : isCurrent ? (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="14" viewBox="0 0 16 18" aria-hidden>
              <path
                d="M3 7h10v9H3zM5 7V4a3 3 0 0 1 6 0v3"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <p
          className={cn(
            "mt-2.5 text-[12.5px] font-medium text-center max-w-[160px] leading-tight",
            isLocked ? "text-ink-muted" : "text-ink",
          )}
        >
          {lesson.title}
        </p>

        {open && !isLocked && (
          <div className="absolute top-full mt-3 z-20 w-72 animate-pop">
            <div className="rounded-[14px] bg-surface border border-rule p-4">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                {t.lessonNumber(lesson.position + 1)}
                {isDone && (
                  <span className="inline-flex items-center gap-1 text-green">
                    <Check className="h-3 w-3" strokeWidth={3} /> {t.lessonCompleted}
                  </span>
                )}
              </div>
              <h4 className="font-display font-medium text-[15px] text-ink mt-1.5 leading-tight">
                {lesson.title}
              </h4>
              <p className="text-[13px] text-ink-soft mt-1.5 leading-relaxed">
                {lesson.summary}
              </p>
              <Link
                href={`/course/${courseId}/lesson/${lesson.id}`}
                className="btn-primary w-full mt-4"
              >
                {isDone ? t.replay : t.startLesson}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
