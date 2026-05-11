"use client";
import * as React from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";
import type { CourseOutline } from "@/lib/schemas";
import { useT } from "./locale-provider";

type Partial<T> = { [P in keyof T]?: T[P] };

export function StreamingPreview({
  topic,
  depth,
  partial,
  done,
  error,
}: {
  topic: string;
  depth: number;
  partial: Partial<CourseOutline> | null;
  done: boolean;
  error: string | null;
}) {
  const t = useT();
  const lessons = (partial?.lessons ?? []) as Array<{
    title?: string;
    summary?: string;
    objectives?: string[];
  }>;

  return (
    <div className="reveal" style={{ animationDelay: "0ms" }}>
      <div className="rounded-card bg-white border-2 border-zinc-200 p-6 sm:p-8 relative overflow-hidden">
        {/* Status line */}
        <div className="flex items-center gap-2 mb-6">
          {!done && !error ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
              <span className="text-xs uppercase tracking-wider font-bold text-brand-700">
                {t.generating}
              </span>
            </>
          ) : error ? (
            <span className="text-xs uppercase tracking-wider font-bold text-red-600">
              {error}
            </span>
          ) : (
            <>
              <Check className="h-4 w-4 text-brand-600" />
              <span className="text-xs uppercase tracking-wider font-bold text-brand-600">
                {t.lessonCompleted} · {topic}
              </span>
            </>
          )}
        </div>

        {/* Header: emoji + title + description */}
        <div className="flex items-start gap-4 mb-6 min-h-[80px]">
          <div className="text-5xl shrink-0 w-12 h-12 flex items-center justify-center">
            {partial?.emoji ? (
              <span className="animate-pop inline-block">{partial.emoji}</span>
            ) : (
              <span className="text-3xl text-zinc-300">✦</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 min-h-[2.5rem]">
              {partial?.title ?? (
                <span className="inline-block h-8 w-3/4 rounded bg-zinc-100 animate-pulse align-middle" />
              )}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 leading-relaxed min-h-[1.5rem]">
              {partial?.description ?? (
                <>
                  <span className="inline-block h-3 w-full rounded bg-zinc-100 animate-pulse" />
                  <span className="inline-block h-3 w-5/6 rounded bg-zinc-100 animate-pulse mt-1" />
                </>
              )}
            </p>
          </div>
        </div>

        {/* Lesson slots */}
        <div className="space-y-2">
          {Array.from({ length: depth }).map((_, i) => {
            const lesson = lessons[i];
            const ready = !!lesson?.title;
            const partial = ready && !lesson?.summary;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-2xl border-2 transition-all ${
                  ready
                    ? "border-brand-100 bg-brand-50/30"
                    : "border-zinc-100 bg-zinc-50/50"
                }`}
              >
                <span
                  className={`h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-lg text-xs font-black ${
                    ready
                      ? "bg-brand-500 text-white"
                      : "bg-zinc-200 text-zinc-400"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {ready ? (
                    <div className="animate-slide-up">
                      <p className="font-bold text-sm text-zinc-900">{lesson.title}</p>
                      {lesson.summary && (
                        <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                          {lesson.summary}
                        </p>
                      )}
                      {partial && (
                        <span className="inline-block h-2 w-32 rounded bg-zinc-100 animate-pulse mt-1.5" />
                      )}
                    </div>
                  ) : (
                    <>
                      <span className="inline-block h-3 w-1/2 rounded bg-zinc-100 animate-pulse" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
