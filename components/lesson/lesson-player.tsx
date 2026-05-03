"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useUserId } from "../user-provider";
import { useT } from "../locale-provider";
import { ProgressBar } from "../ui/progress-bar";
import { X, Heart, Volume2, VolumeX } from "lucide-react";
import type { LessonContent, ContentBlock, Exercise } from "@/lib/schemas";
import { sfx, isMuted, setMuted, unlockAudio } from "@/lib/audio";
import { ExerciseRenderer } from "./exercise-renderer";
import { TipPanel } from "./tip-panel";
import { Feedback } from "./feedback";
import { CompletionScreen } from "./completion-screen";
import { OutOfHearts } from "./out-of-hearts";
import { XpPop } from "./xp-pop";
import { cn } from "@/lib/utils";

const MAX_HEARTS = 3;
const XP_PER_CORRECT = 2;

type Step =
  | { kind: "tip"; tipIdx: number }
  | { kind: "exercise"; exIdx: number };

/**
 * Interleave tips and exercises Duolingo-style. We always start with a tip
 * (when available) so the learner has context before exercise 1, then
 * distribute remaining tips evenly among the exercises.
 */
function buildSteps(blocks: ContentBlock[], exercises: Exercise[]): Step[] {
  const steps: Step[] = [];
  const n = exercises.length;
  const m = blocks.length;
  if (m === 0) {
    for (let i = 0; i < n; i++) steps.push({ kind: "exercise", exIdx: i });
    return steps;
  }
  // Each tip k goes BEFORE exercise at floor(k * n / m).
  const tipBefore = new Map<number, number>();
  for (let k = 0; k < m; k++) {
    tipBefore.set(Math.floor((k * n) / m), k);
  }
  for (let i = 0; i < n; i++) {
    if (tipBefore.has(i)) {
      steps.push({ kind: "tip", tipIdx: tipBefore.get(i)! });
    }
    steps.push({ kind: "exercise", exIdx: i });
  }
  return steps;
}

type Phase =
  | { kind: "step"; index: number; answered: null | { correct: boolean; userAnswer: unknown } }
  | { kind: "complete" }
  | { kind: "failed" };

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

  const steps = React.useMemo(
    () => buildSteps(content.blocks, content.exercises),
    [content.blocks, content.exercises],
  );

  const [phase, setPhase] = React.useState<Phase>({ kind: "step", index: 0, answered: null });
  const [hearts, setHearts] = React.useState(MAX_HEARTS);
  const [score, setScore] = React.useState(0);
  const [xpEarned, setXpEarned] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [muted, setMutedState] = React.useState(false);
  const [xpTrigger, setXpTrigger] = React.useState(0);

  const totalExercises = content.exercises.length;

  // Sync mute state from localStorage on mount
  React.useEffect(() => {
    setMutedState(isMuted());
  }, []);

  // Resume audio context on first user gesture
  React.useEffect(() => {
    const onFirstGesture = () => {
      unlockAudio();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);
    window.addEventListener("keydown", onFirstGesture);
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, []);

  // Submit completion exactly once when phase becomes "complete"
  React.useEffect(() => {
    if (phase.kind !== "complete" || submitted || !userId) return;
    setSubmitted(true);
    sfx.complete();
    fetch(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, score, totalExercises }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.xpEarned != null) setXpEarned(d.xpEarned);
      })
      .catch(() => {});
  }, [phase.kind, submitted, userId, lessonId, score, totalExercises]);

  // Compute progress: (completed steps) / total steps
  const stepsDone =
    phase.kind === "step"
      ? phase.index + (phase.answered ? 1 : 0)
      : phase.kind === "complete"
        ? steps.length
        : 0; // failed: doesn't matter, we render OutOfHearts and return early
  const progressPct = (stepsDone / Math.max(steps.length, 1)) * 100;

  function toggleMute() {
    const m = !muted;
    setMutedState(m);
    setMuted(m);
  }

  function advance() {
    if (phase.kind !== "step") return;
    const nextIdx = phase.index + 1;
    if (nextIdx >= steps.length) {
      setPhase({ kind: "complete" });
    } else {
      setPhase({ kind: "step", index: nextIdx, answered: null });
    }
  }

  function onAnswer(correct: boolean, userAnswer: unknown) {
    if (phase.kind !== "step" || phase.answered) return;
    const step = steps[phase.index];
    if (step.kind !== "exercise") return;

    if (correct) {
      sfx.correct();
      setScore((s) => s + 1);
      setXpTrigger((n) => n + 1);
    } else {
      sfx.wrong();
      const nextHearts = Math.max(0, hearts - 1);
      setHearts(nextHearts);
      if (nextHearts === 0) {
        setTimeout(() => setPhase({ kind: "failed" }), 800);
      }
    }
    setPhase({ ...phase, answered: { correct, userAnswer } });
  }

  function retry() {
    setPhase({ kind: "step", index: 0, answered: null });
    setHearts(MAX_HEARTS);
    setScore(0);
    setSubmitted(false);
    setXpEarned(0);
  }

  if (phase.kind === "failed") {
    return <OutOfHearts courseId={courseId} onRetry={retry} />;
  }
  if (phase.kind === "complete") {
    return (
      <CompletionScreen
        courseId={courseId}
        score={score}
        total={totalExercises}
        hearts={hearts}
        xpEarned={xpEarned}
      />
    );
  }

  const currentStep = steps[phase.index];
  const isExercise = currentStep.kind === "exercise";
  const currentExerciseIndex = steps
    .slice(0, phase.index + 1)
    .filter((s) => s.kind === "exercise").length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="px-4 sm:px-6 py-4 border-b-2 border-zinc-100 bg-white sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push(`/course/${courseId}`)}
            className="text-zinc-400 hover:text-zinc-700 transition-colors"
            aria-label={t.exitLesson}
          >
            <X className="h-6 w-6" />
          </button>
          <ProgressBar value={progressPct} className="flex-1" />
          <button
            onClick={toggleMute}
            className="text-zinc-400 hover:text-zinc-700 transition-colors"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-1 text-red-500 font-bold tabular-nums">
            <Heart className={cn("h-5 w-5 fill-current transition-transform", hearts < MAX_HEARTS && "animate-pop")} key={hearts} />
            <span>{hearts}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto" key={phase.index}>
          {isExercise && (
            <div className="animate-slide-up">
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-4 flex items-center justify-between">
                <span>{t.exerciseN(currentExerciseIndex, totalExercises)}</span>
                <span className="text-zinc-300 normal-case font-medium text-[11px]">{title}</span>
              </p>
              <ExerciseRenderer
                exercise={content.exercises[currentStep.exIdx]}
                answered={phase.answered !== null}
                onAnswer={onAnswer}
              />
            </div>
          )}
          {currentStep.kind === "tip" && (
            <TipPanel block={content.blocks[currentStep.tipIdx]} onContinue={advance} />
          )}
        </div>
      </div>

      {phase.kind === "step" && phase.answered && isExercise && (
        <Feedback
          correct={phase.answered.correct}
          exercise={content.exercises[currentStep.exIdx]}
          onContinue={advance}
        />
      )}

      <XpPop amount={XP_PER_CORRECT} trigger={xpTrigger} />
    </div>
  );
}
