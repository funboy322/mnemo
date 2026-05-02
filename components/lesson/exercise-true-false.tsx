"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  exercise: Extract<Exercise, { type: "true_false" }>;
  answered: boolean;
  onAnswer: (correct: boolean, userAnswer: unknown) => void;
};

export function ExerciseTrueFalse({ exercise, answered, onAnswer }: Props) {
  const [choice, setChoice] = React.useState<boolean | null>(null);

  function check() {
    if (choice === null) return;
    onAnswer(choice === exercise.isTrue, choice);
  }

  // Keyboard: 1/T = true, 2/F = false, Enter = check
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
      <p className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
        Правда или нет?
      </p>
      <div className="rounded-card bg-white border-2 border-zinc-200 p-6 sm:p-8 text-lg sm:text-xl leading-relaxed text-zinc-900 text-center font-medium">
        {exercise.statement}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <ChoiceButton
          label="Правда"
          icon={<CheckCircle2 className="h-6 w-6" />}
          selected={choice === true}
          correct={isCorrectChoice(true)}
          wrong={isWrongChoice(true)}
          disabled={answered}
          onClick={() => setChoice(true)}
        />
        <ChoiceButton
          label="Неправда"
          icon={<XCircle className="h-6 w-6" />}
          selected={choice === false}
          correct={isCorrectChoice(false)}
          wrong={isWrongChoice(false)}
          disabled={answered}
          onClick={() => setChoice(false)}
        />
      </div>

      {!answered && (
        <Button
          onClick={check}
          disabled={choice === null}
          size="lg"
          className="w-full mt-8"
        >
          Проверить
        </Button>
      )}
    </div>
  );
}

function ChoiceButton({
  label,
  icon,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
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
        "rounded-2xl border-2 p-5 font-bold transition-all flex items-center justify-center gap-2 btn-3d",
        !correct && !wrong && selected && "border-brand-400 bg-brand-50 text-brand-900",
        !correct && !wrong && !selected && "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700",
        correct && "border-brand-500 bg-brand-50 text-brand-900",
        wrong && "border-red-500 bg-red-50 text-red-900",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
