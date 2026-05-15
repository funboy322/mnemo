"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserId } from "../user-provider";
import { useT } from "../locale-provider";
import { Button } from "../ui/button";
import { ProgressBar } from "../ui/progress-bar";
import { ExerciseRenderer } from "../lesson/exercise-renderer";
import { Feedback } from "../lesson/feedback";
import { CompletionScreen } from "../lesson/completion-screen";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";

const MAX_HEARTS = 3;

type ReviewItem = {
  exercise: Exercise;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
};

type Phase =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "intro" }
  | { kind: "exercise"; index: number; answered: null | { correct: boolean; userAnswer: unknown } }
  | { kind: "complete" };

/**
 * ReviewPlayer — Quiet direction. Matches the lesson player chrome:
 * bone bg, 1px rule, ink hearts dots, no saturated brand fills.
 */
export function ReviewPlayer() {
  const router = useRouter();
  const userId = useUserId();
  const t = useT();
  const [items, setItems] = React.useState<ReviewItem[]>([]);
  const [phase, setPhase] = React.useState<Phase>({ kind: "loading" });
  const [hearts, setHearts] = React.useState(MAX_HEARTS);
  const [score, setScore] = React.useState(0);
  const [xpEarned, setXpEarned] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!userId) return;
    fetch(`/api/review/exercises?userId=${userId}&limit=5`)
      .then((r) => r.json())
      .then((d) => {
        if (!d?.items || d.items.length === 0) {
          setPhase({ kind: "empty" });
        } else {
          setItems(d.items);
          setPhase({ kind: "intro" });
        }
      })
      .catch(() => setPhase({ kind: "empty" }));
  }, [userId]);

  const total = items.length;
  const exerciseDone =
    phase.kind === "exercise" ? phase.index + (phase.answered ? 1 : 0) : phase.kind === "complete" ? total : 0;
  const progressPct = (exerciseDone / Math.max(total, 1)) * 100;

  React.useEffect(() => {
    if (phase.kind !== "complete" || submitted || !userId) return;
    setSubmitted(true);
    fetch("/api/review/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, score, totalExercises: total }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.xpEarned != null) setXpEarned(d.xpEarned);
      })
      .catch(() => {});
  }, [phase.kind, submitted, userId, score, total]);

  function start() {
    setPhase({ kind: "exercise", index: 0, answered: null });
  }

  function onAnswer(correct: boolean, userAnswer: unknown) {
    if (phase.kind !== "exercise" || phase.answered) return;
    if (correct) setScore((s) => s + 1);
    else setHearts((h) => Math.max(0, h - 1));
    setPhase({ ...phase, answered: { correct, userAnswer } });
  }

  function next() {
    if (phase.kind !== "exercise") return;
    const nextIdx = phase.index + 1;
    if (nextIdx >= total) setPhase({ kind: "complete" });
    else setPhase({ kind: "exercise", index: nextIdx, answered: null });
  }

  if (phase.kind === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    );
  }

  if (phase.kind === "empty") {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="max-w-md">
          <div className="eyebrow">{t.reviewTitle}</div>
          <h1 className="mt-3 font-display font-medium text-[28px] sm:text-[36px] tracking-[-0.02em] text-ink">
            Nothing to {''}<em>review</em> yet
          </h1>
          <p className="mt-3 text-[15px] text-ink-soft leading-relaxed">{t.reviewEmpty}</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/dashboard">{t.toMyCourses}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (phase.kind === "complete") {
    return (
      <CompletionScreen
        courseId="dashboard"
        score={score}
        total={total}
        hearts={hearts}
        xpEarned={xpEarned}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="px-4 sm:px-6 py-4 border-b border-rule bg-bone sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-ink-muted hover:text-ink transition-colors"
            aria-label={t.exitLesson}
          >
            <X className="h-5 w-5" />
          </button>
          <ProgressBar value={progressPct} className="flex-1" />
          <div className="flex items-center gap-1" aria-label={`${hearts} hearts remaining`}>
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i < hearts ? "bg-ink" : "bg-rule",
                )}
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {phase.kind === "intro" && (
            <div className="animate-slide-up text-center py-6">
              <div className="eyebrow">{t.reviewTitle}</div>
              <h1 className="mt-3 font-display font-medium text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.025em] text-ink">
                <em>Tonight</em> — {total} cards
              </h1>
              <p className="mt-3 text-[15px] sm:text-[16px] text-ink-soft max-w-md mx-auto leading-relaxed">
                {t.reviewSubtitle}
              </p>
              <Button onClick={start} size="lg" className="mt-8 min-w-[200px]">
                {t.reviewStart} →
              </Button>
            </div>
          )}

          {phase.kind === "exercise" && items[phase.index] && (
            <div key={phase.index} className="animate-slide-up">
              <p className="eyebrow mb-1">{t.exerciseN(phase.index + 1, total)}</p>
              <p className="text-[11.5px] text-ink-muted mb-6 font-mono tracking-[0.06em]">
                {t.reviewSourceLesson}:{" "}
                <Link
                  href={`/course/${items[phase.index].courseId}/lesson/${items[phase.index].lessonId}`}
                  className="text-ink-soft hover:text-ink underline underline-offset-2 decoration-rule"
                >
                  {items[phase.index].lessonTitle}
                </Link>
              </p>
              <ExerciseRenderer
                exercise={items[phase.index].exercise}
                answered={phase.answered !== null}
                onAnswer={onAnswer}
              />
            </div>
          )}
        </div>
      </div>

      {phase.kind === "exercise" && phase.answered && (
        <Feedback
          correct={phase.answered.correct}
          exercise={items[phase.index].exercise}
          onContinue={next}
        />
      )}
    </div>
  );
}
