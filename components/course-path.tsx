"use client";
import * as React from "react";
import Link from "next/link";
import { useUserId } from "./user-provider";
import { useT } from "./locale-provider";
import { Check, Lock, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type LessonItem = {
  id: string;
  position: number;
  title: string;
  summary: string;
};

type LessonState = "completed" | "current" | "locked";

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
          (d.lessons || []).filter((l: { completed: boolean; id: string }) => l.completed).map((l: { id: string }) => l.id),
        );
        setCompletedIds(ids);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [courseId, userId]);

  function stateFor(lesson: LessonItem): LessonState {
    if (completedIds.has(lesson.id)) return "completed";
    const prev = lessons.find((l) => l.position === lesson.position - 1);
    if (!prev || completedIds.has(prev.id) || lesson.position === 0) return "current";
    return "locked";
  }

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-12 bottom-12 w-1 bg-zinc-200 -translate-x-1/2 rounded-full" />
      <div className="space-y-3 relative">
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
  // gentle zig-zag like Duolingo path: 0, 60, 30, -30, -60, -30, 0, 30, 60, 30, 0
  const pattern = [0, 60, 30, -30, -60, -30, 0, 30, 60, 30, 0, -30];
  return pattern[idx % pattern.length];
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

  return (
    <div className="relative flex justify-center min-h-[5rem]" ref={ref}>
      <div style={{ transform: `translateX(${offsetX}px)` }} className="relative flex flex-col items-center">
        <button
          type="button"
          onClick={() => !isLocked && setOpen((o) => !o)}
          disabled={isLocked}
          className={cn(
            "lesson-node relative h-20 w-20 rounded-full flex items-center justify-center text-white font-black text-2xl border-4",
            isLocked && "bg-zinc-200 border-zinc-300 text-zinc-400 cursor-not-allowed shadow-none",
            isDone && "bg-yellow-400 border-yellow-500",
            state === "current" && "bg-brand-500 border-brand-600 ring-4 ring-brand-200/60",
          )}
          aria-label={lesson.title}
        >
          {isLocked ? (
            <Lock className="h-7 w-7" />
          ) : isDone ? (
            <Star className="h-9 w-9 fill-current" />
          ) : (
            <Play className="h-8 w-8 fill-current ml-1" />
          )}
        </button>
        <p className={cn(
          "mt-2 text-sm font-bold text-center max-w-[180px]",
          isLocked ? "text-zinc-400" : "text-zinc-700",
        )}>
          {lesson.title}
        </p>

        {open && !isLocked && (
          <div className="absolute top-full mt-3 z-20 w-72 animate-pop">
            <div className="rounded-card bg-white border-2 border-zinc-200 p-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-zinc-400">
                {t.lessonNumber(lesson.position + 1)}
                {isDone && (
                  <span className="inline-flex items-center gap-1 text-brand-600">
                    <Check className="h-3 w-3" /> {t.lessonCompleted}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-zinc-900 mt-1">{lesson.title}</h4>
              <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{lesson.summary}</p>
              <Link
                href={`/course/${courseId}/lesson/${lesson.id}`}
                className="mt-4 inline-flex w-full items-center justify-center h-11 rounded-2xl bg-brand-500 text-white font-bold uppercase tracking-wide btn-3d btn-3d-brand"
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
