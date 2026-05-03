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

export function ExerciseMultipleChoice({ exercise, answered, onAnswer }: Props) {
  const t = useT();
  const [selected, setSelected] = React.useState<number | null>(null);

  function check() {
    if (selected === null) return;
    onAnswer(selected === exercise.correctIndex, selected);
  }

  // Keyboard: 1-4 selects option, Enter checks
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
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug">
        {exercise.question}
      </h2>

      <div className="grid sm:grid-cols-2 gap-3 mt-6">
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
                "text-left rounded-2xl border-2 p-4 font-medium transition-all",
                "btn-3d disabled:cursor-not-allowed",
                !answered && isSelected && "border-brand-400 bg-brand-50 text-brand-900",
                !answered && !isSelected && "border-zinc-200 bg-white hover:border-zinc-300",
                isCorrect && "border-brand-500 bg-brand-50 text-brand-900",
                isWrong && "border-red-500 bg-red-50 text-red-900",
              )}
            >
              <span className="inline-flex items-center gap-3">
                <span className={cn(
                  "h-7 w-7 rounded-lg border-2 inline-flex items-center justify-center text-xs font-black",
                  !answered && isSelected ? "border-brand-500 text-brand-700" : "border-zinc-300 text-zinc-500",
                  isCorrect && "border-brand-600 bg-brand-500 text-white",
                  isWrong && "border-red-600 bg-red-500 text-white",
                )}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </span>
            </button>
          );
        })}
      </div>

      {!answered && (
        <Button
          onClick={check}
          disabled={selected === null}
          size="lg"
          className="w-full mt-8"
        >
          {t.check}
        </Button>
      )}
    </div>
  );
}
