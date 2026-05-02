"use client";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";
import { CheckCircle2, XCircle } from "lucide-react";

export function Feedback({
  correct,
  exercise,
  onContinue,
}: {
  correct: boolean;
  exercise: Exercise;
  onContinue: () => void;
}) {
  const explanation = getExplanation(exercise);
  return (
    <div
      className={cn(
        "border-t-2 p-5 sm:p-6 sticky bottom-0 z-30 animate-slide-up",
        correct ? "bg-brand-50 border-brand-200" : "bg-red-50 border-red-200",
      )}
    >
      <div className="max-w-2xl mx-auto flex items-start gap-4">
        <div className="hidden sm:block">
          {correct ? (
            <CheckCircle2 className="h-12 w-12 text-brand-600" />
          ) : (
            <XCircle className="h-12 w-12 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className={cn("text-xl font-black", correct ? "text-brand-700" : "text-red-700")}>
            {correct ? "Верно!" : "Неверно"}
          </h3>
          {!correct && <CorrectAnswer exercise={exercise} />}
          {explanation && (
            <p className={cn("mt-1 text-sm leading-relaxed", correct ? "text-brand-800" : "text-red-800")}>
              {explanation}
            </p>
          )}
        </div>
        <Button
          variant={correct ? "primary" : "danger"}
          size="md"
          onClick={onContinue}
          className="self-center shrink-0"
        >
          Дальше
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

function CorrectAnswer({ exercise }: { exercise: Exercise }) {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <p className="text-sm text-red-900 mt-1">
          Правильный ответ: <b>{exercise.options[exercise.correctIndex]}</b>
        </p>
      );
    case "fill_blank":
      return (
        <p className="text-sm text-red-900 mt-1">
          Правильно: <b>{exercise.answer}</b>
        </p>
      );
    case "true_false":
      return (
        <p className="text-sm text-red-900 mt-1">
          Правильный ответ: <b>{exercise.isTrue ? "Правда" : "Неправда"}</b>
        </p>
      );
    case "order":
      return (
        <ol className="text-sm text-red-900 mt-1 list-decimal pl-4 space-y-0.5">
          {exercise.items.map((it, i) => <li key={i}>{it}</li>)}
        </ol>
      );
    case "matching":
      return (
        <ul className="text-sm text-red-900 mt-1 space-y-0.5">
          {exercise.pairs.map((p, i) => (
            <li key={i}><b>{p.left}</b> → {p.right}</li>
          ))}
        </ul>
      );
  }
}
