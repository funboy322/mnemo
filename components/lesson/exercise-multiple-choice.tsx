"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";

type Props = {
  exercise: Extract<Exercise, { type: "multiple_choice" }>;
  answered: boolean;
  onAnswer: (correct: boolean, userAnswer: unknown) => void;
};

/**
 * Multiple choice — Quiet direction.
 *
 * Old: 4 colored cards with btn-3d shadows, red wrong / green right.
 * New: 4 flat 1px-rule cards. Selected = ink border + ink letter chip.
 *      Correct = green border + green letter chip. Wrong = ink with
 *      strikethrough — Quiet does not paint mistakes red.
 */
export function ExerciseMultipleChoice({ exercise, answered, onAnswer }: Props) {
  const t = useT();
  const [selected, setSelected] = React.useState<number | null>(null);

  function check() {
    if (selected === null) return;
    onAnswer(selected === exercise.correctIndex, selected);
  }

  React.useEffect(() => {
    if (answered) return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 4) {
        e.preventDefault();
        setSelected(num - 1);
      } else if (e.key === "Enter" && selected !== null) {
        e.preventDefault();
        check();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, selected]);

  return (
    <div>
      <h2 className="font-display font-medium text-[20px] sm:text-[26px] text-ink leading-snug tracking-[-0.015em]">
        {exercise.question}
      </h2>

      <div className="grid sm:grid-cols-2 gap-2.5 mt-6">
        {exercise.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = answered && i === exercise.correctIndex;
          const isWrong = answered && isSelected && i !== exercise.correctIndex;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setSelected(i)}
              className={cn(
                "text-left rounded-[14px] border p-4 font-display font-normal text-[15px] transition-colors disabled:cursor-not-allowed",
                !answered && isSelected && "border-ink bg-surface text-ink",
                !answered && !isSelected && "border-rule bg-surface text-ink-soft hover:border-ink-muted",
                isCorrect && "border-green bg-green-soft text-ink",
                isWrong && "border-ink-muted bg-surface text-ink-muted line-through",
              )}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={cn(
                    "h-7 w-7 rounded-full border inline-flex items-center justify-center text-[11px] font-mono font-medium",
                    !answered && isSelected && "border-ink text-ink",
                    !answered && !isSelected && "border-rule text-ink-muted",
                    isCorrect && "border-green bg-green text-surface",
                    isWrong && "border-ink-muted text-ink-muted",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </span>
            </button>
          );
        })}
      </div>

      {!answered && (
        <Button onClick={check} disabled={selected === null} size="lg" className="w-full mt-8">
          {t.check}
        </Button>
      )}
    </div>
  );
}
