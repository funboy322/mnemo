"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";

type Props = {
  exercise: Extract<Exercise, { type: "fill_blank" }>;
  answered: boolean;
  onAnswer: (correct: boolean, userAnswer: unknown) => void;
};

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,!?;:]+$/g, "");
}

/**
 * Split on the FIRST blank only — even if AI produces multiple `___`,
 * we render a single input. Subsequent placeholders are folded into the trailing text.
 */
function splitOnceAtBlank(sentence: string): [string, string] {
  const match = sentence.match(/_{2,}/);
  if (!match || match.index === undefined) return [sentence, ""];
  const before = sentence.slice(0, match.index);
  const after = sentence.slice(match.index + match[0].length).replace(/_{2,}/g, "___");
  return [before, after];
}

export function ExerciseFillBlank({ exercise, answered, onAnswer }: Props) {
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [before, after] = splitOnceAtBlank(exercise.sentence);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function check() {
    if (!value.trim()) return;
    const accepted = [exercise.answer, ...(exercise.acceptableAlternatives ?? [])].map(normalize);
    const correct = accepted.includes(normalize(value));
    onAnswer(correct, value);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
        Заполни пропуск
      </p>
      <div className="rounded-card bg-white border-2 border-zinc-200 p-5 sm:p-6 text-lg sm:text-xl leading-relaxed text-zinc-900">
        <span>{before}</span>
        <span className="inline-block min-w-[120px] mx-1 align-middle">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={answered}
            className={cn(
              "h-10 text-base sm:text-lg inline-block w-auto px-3 text-center",
              answered && "border-brand-400 bg-brand-50",
            )}
            placeholder="..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
          />
        </span>
        <span>{after}</span>
      </div>

      {exercise.hint && !answered && (
        <p className="mt-3 text-sm text-zinc-500 italic">💡 {exercise.hint}</p>
      )}

      {!answered && (
        <Button
          onClick={check}
          disabled={!value.trim()}
          size="lg"
          className="w-full mt-8"
        >
          Проверить
        </Button>
      )}
    </div>
  );
}
