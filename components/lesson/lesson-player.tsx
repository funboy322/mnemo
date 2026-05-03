"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useUserId } from "../user-provider";
import { useT } from "../locale-provider";
import { Button } from "../ui/button";
import { ProgressBar } from "../ui/progress-bar";
import { X, Heart } from "lucide-react";
import type { LessonContent } from "@/lib/schemas";
import { ContentBlocks } from "./content-blocks";
import { ExerciseRenderer } from "./exercise-renderer";
import { Feedback } from "./feedback";
import { CompletionScreen } from "./completion-screen";

type Phase =
  | { kind: "intro" }
  | { kind: "exercise"; index: number; answered: null | { correct: boolean; userAnswer: unknown } }
  | { kind: "complete" };

const MAX_HEARTS = 3;

export function LessonPlayer({
  courseId,
  lessonId,
  title,
  content,
}: {
  courseId: string;
  lessonId: string;
  title: string;
  content: LessonContent;
}) {
  const router = useRouter();
  const userId = useUserId();
  const t = useT();
  const [phase, setPhase] = React.useState<Phase>({ kind: "intro" });
  const [hearts, setHearts] = React.useState(MAX_HEARTS);
  const [score, setScore] = React.useState(0);
  const [xpEarned, setXpEarned] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);

  const total = content.exercises.length;
  const exerciseDone =
    phase.kind === "exercise" ? phase.index + (phase.answered ? 1 : 0) : phase.kind === "complete" ? total : 0;
  const progressPct = (exerciseDone / Math.max(total, 1)) * 100;

  React.useEffect(() => {
    if (phase.kind !== "complete" || submitted || !userId) return;
    setSubmitted(true);
    fetch(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, score, totalExercises: total }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.xpEarned != null) setXpEarned(d.xpEarned);
      })
      .catch(() => {});
  }, [phase.kind, submitted, userId, lessonId, score, total]);

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
    if (nextIdx >= total) {
      setPhase({ kind: "complete" });
    } else {
      setPhase({ kind: "exercise", index: nextIdx, answered: null });
    }
  }

  if (phase.kind === "complete") {
    return (
      <CompletionScreen
        courseId={courseId}
        score={score}
        total={total}
        hearts={hearts}
        xpEarned={xpEarned}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="px-4 sm:px-6 py-4 border-b-2 border-zinc-100 bg-white sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push(`/course/${courseId}`)}
            className="text-zinc-400 hover:text-zinc-700 transition-colors"
            aria-label={t.exitLesson}
          >
            <X className="h-6 w-6" />
          </button>
          <ProgressBar value={progressPct} className="flex-1" />
          <div className="flex items-center gap-1 text-red-500 font-bold">
            <Heart className="h-5 w-5 fill-current" />
            <span>{hearts}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          {phase.kind === "intro" && (
            <div className="animate-slide-up">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mb-6">{title}</h1>
              <ContentBlocks blocks={content.blocks} />
              <Button onClick={start} size="lg" className="w-full mt-8">
                {t.toExercises}
              </Button>
            </div>
          )}

          {phase.kind === "exercise" && (
            <div key={phase.index} className="animate-slide-up">
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-4">
                {t.exerciseN(phase.index + 1, total)}
              </p>
              <ExerciseRenderer
                exercise={content.exercises[phase.index]}
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
          exercise={content.exercises[phase.index]}
          onContinue={next}
        />
      )}
    </div>
  );
}

