"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";

type Props = {
  exercise: Extract<Exercise, { type: "true_false" }>;
  answered: boolean;
  onAnswer: (correct: boolean, userAnswer: unknown) => void;
};

/**
 * True/false — Quiet direction. No CheckCircle / XCircle icons (those
 * pre-judge the answer with green/red imagery). Plain labels, ink
 * selection, green accent on correct, strikethrough on wrong.
 */
export function ExerciseTrueFalse({ exercise, answered, onAnswer }: Props) {
  const t = useT();
  const [choice, setChoice] = React.useState<boolean | null>(null);

  function check() {
    if (choice === null) return;
    onAnswer(choice === exercise.isTrue, choice);
  }

  React.useEffect(() => {
    if (answered) return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const k = e.key.toLowerCase();
      if (k === "1" || k === "t" || k === "p" || k === "д") {
        e.preventDefault();
        setChoice(true);
      } else if (k === "2" || k === "f" || k === "н") {
        e.preventDefault();
        setChoice(false);
      } else if (e.key === "Enter" && choice !== null) {
        e.preventDefault();
        check();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, choice]);

  function isCorrectChoice(opt: boolean) {
    return answered && opt === exercise.isTrue;
  }
  function isWrongChoice(opt: boolean) {
    return answered && choice === opt && opt !== exercise.isTrue;
  }

  return (
    <div>
      <p className="eyebrow mb-3">{t.trueFalsePrompt}</p>
      <div className="card-quiet p-6 sm:p-8 font-display font-medium text-[18px] sm:text-[22px] leading-relaxed text-ink text-center">
        {exercise.statement}
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-6">
        <ChoiceButton
          label={t.trueLabel}
          selected={choice === true}
          correct={isCorrectChoice(true)}
          wrong={isWrongChoice(true)}
          disabled={answered}
          onClick={() => setChoice(true)}
        />
        <ChoiceButton
          label={t.falseLabel}
          selected={choice === false}
          correct={isCorrectChoice(false)}
          wrong={isWrongChoice(false)}
          disabled={answered}
          onClick={() => setChoice(false)}
        />
      </div>

      {!answered && (
        <Button onClick={check} disabled={choice === null} size="lg" className="w-full mt-8">
          {t.check}
        </Button>
      )}
    </div>
  );
}

function ChoiceButton({
  label,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-[14px] border p-5 font-display font-medium text-[15px] sm:text-[16px] transition-colors",
        !correct && !wrong && selected && "border-ink bg-surface text-ink",
        !correct && !wrong && !selected && "border-rule bg-surface text-ink-soft hover:border-ink-muted",
        correct && "border-green bg-green-soft text-ink",
        wrong && "border-ink-muted bg-surface text-ink-muted line-through",
      )}
    >
      {label}
    </button>
  );
}
