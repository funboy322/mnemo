"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useT } from "../locale-provider";
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

function splitOnceAtBlank(sentence: string): [string, string] {
  const match = sentence.match(/_{2,}/);
  if (!match || match.index === undefined) return [sentence, ""];
  const before = sentence.slice(0, match.index);
  const after = sentence.slice(match.index + match[0].length).replace(/_{2,}/g, "___");
  return [before, after];
}

/**
 * Fill-blank — Quiet direction. Surface card, single rule border,
 * underline-style inline input. No saturated highlights.
 */
export function ExerciseFillBlank({ exercise, answered, onAnswer }: Props) {
  const t = useT();
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
      <p className="eyebrow mb-3">{t.fillBlankPrompt}</p>
      <div className="card-quiet p-5 sm:p-7 text-[18px] sm:text-[22px] font-display font-normal leading-[1.5] text-ink">
        <span>{before}</span>
        <span className="inline-block min-w-[120px] mx-1 align-middle">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={answered}
            className={cn(
              "h-9 text-[16px] sm:text-[18px] inline-block w-auto px-2 text-center font-display border-0 border-b-2 border-rule rounded-none bg-transparent focus:border-ink focus:ring-0",
              answered && "border-green text-green",
            )}
            placeholder="…"
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
        <p className="mt-3 text-[13px] text-ink-muted">{exercise.hint}</p>
      )}

      {!answered && (
        <Button onClick={check} disabled={!value.trim()} size="lg" className="w-full mt-8">
          {t.check}
        </Button>
      )}
    </div>
  );
}
