"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";
import type { Dict } from "@/lib/i18n";

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Feedback — Quiet direction.
 *
 * The old version was a saturated brand-tinted (correct) or red-tinted
 * (wrong) sticky panel with CheckCircle / XCircle icons. Quiet replaces
 * it with a single bone bg + top rule line, ink text, and a small mono-
 * caps verdict eyebrow ("correct" / "not quite"). No emoji, no icons,
 * no red — wrong feedback is calm and instructive.
 */
export function Feedback({
  correct,
  exercise,
  onContinue,
}: {
  correct: boolean;
  exercise: Exercise;
  onContinue: () => void;
}) {
  const t = useT();
  const explanation = getExplanation(exercise);

  const phrase = React.useMemo(
    () => (correct ? pickRandom(t.correctPhrases) : pickRandom(t.wrongPhrases)),
    [correct, t.correctPhrases, t.wrongPhrases],
  );

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onContinue();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);

  return (
    <div
      className={cn(
        "border-t border-rule bg-bone p-5 sm:p-6 sticky bottom-0 z-30 animate-slide-up",
        correct ? "border-t-green" : "border-t-rule",
      )}
    >
      <div className="max-w-2xl mx-auto flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="eyebrow mb-1.5">
            {correct ? <span className="text-green">correct</span> : <span className="text-ink-muted">not quite</span>}
          </div>
          <h3 className="font-display font-medium text-[18px] sm:text-[22px] text-ink leading-snug">
            {phrase}
          </h3>
          {!correct && <CorrectAnswer exercise={exercise} t={t} />}
          {explanation && (
            <p className="mt-2 text-[13.5px] sm:text-[14px] leading-relaxed text-ink-soft">
              {explanation}
            </p>
          )}
        </div>
        <Button onClick={onContinue} className="self-center shrink-0">
          {t.next} →
        </Button>
      </div>
    </div>
  );
}

function getExplanation(ex: Exercise): string | null {
  if (ex.type === "multiple_choice") return ex.explanation;
  if (ex.type === "fill_blank") return ex.explanation;
  if (ex.type === "true_false") return ex.explanation;
  if (ex.type === "order") return ex.explanation;
  return null;
}

function CorrectAnswer({ exercise, t }: { exercise: Exercise; t: Dict }) {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <p className="text-[13.5px] text-ink mt-2">
          {t.correctAnswerIs} <span className="font-medium">{exercise.options[exercise.correctIndex]}</span>
        </p>
      );
    case "fill_blank":
      return (
        <p className="text-[13.5px] text-ink mt-2">
          {t.correctlyIs} <span className="font-medium">{exercise.answer}</span>
        </p>
      );
    case "true_false":
      return (
        <p className="text-[13.5px] text-ink mt-2">
          {t.correctAnswerIs}{" "}
          <span className="font-medium">{exercise.isTrue ? t.trueLabel : t.falseLabel}</span>
        </p>
      );
    case "order":
      return (
        <ol className="text-[13.5px] text-ink mt-2 list-decimal pl-4 space-y-0.5">
          {exercise.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      );
    case "matching":
      return (
        <ul className="text-[13.5px] text-ink mt-2 space-y-0.5">
          {exercise.pairs.map((p, i) => (
            <li key={i}>
              <span className="font-medium">{p.left}</span> → {p.right}
            </li>
          ))}
        </ul>
      );
  }
}
