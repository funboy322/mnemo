"use client";
import * as React from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { LessonPlayer } from "./lesson-player";
import type { LessonContent } from "@/lib/schemas";

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
      if (!r.ok) throw new Error(d.error || d.message || "Generation failed");
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
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto w-full">
      <Link
        href={`/course/${props.courseId}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> {t.toCourse}
      </Link>

      <div className="rounded-card bg-white border-2 border-zinc-200 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-wider text-brand-600 font-bold mb-2">
          {t.newLesson}
        </p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">{props.title}</h1>
        <p className="mt-2 text-zinc-600 leading-relaxed">{props.summary}</p>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2">
            {t.whatYoullLearn}
          </p>
          <ul className="space-y-1.5">
            {props.objectives.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-zinc-700">
                <span className="text-brand-500 mt-1">•</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="mt-6 text-sm text-red-600 font-medium animate-shake">
            {error}
          </div>
        )}

        <Button onClick={load} disabled={loading} size="lg" className="w-full mt-8">
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t.preparingMaterial}
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              {t.startButton}
            </>
          )}
        </Button>
        {loading && (
          <p className="text-xs text-zinc-500 text-center mt-3 animate-pulse">
            {t.preparingHint}
          </p>
        )}
      </div>
    </div>
  );
}
