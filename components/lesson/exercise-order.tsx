"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { cn, shuffled } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";
import { ChevronUp, ChevronDown, X } from "lucide-react";

type Props = {
  exercise: Extract<Exercise, { type: "order" }>;
  answered: boolean;
  onAnswer: (correct: boolean, userAnswer: unknown) => void;
};

type Item = { id: number; text: string };

/**
 * Order — Quiet direction. Drop zone is 1px dashed rule on bone (was a
 * brand-tinted card). Selected items get an ink border instead of
 * brand-50 fill. Wrong items in answered state get strikethrough and
 * ink-muted color, not red.
 */
export function ExerciseOrder({ exercise, answered, onAnswer }: Props) {
  const t = useT();
  const correctOrder = React.useMemo(
    () => exercise.items.map((text, id) => ({ id, text })),
    [exercise.items],
  );
  const [pool, setPool] = React.useState<Item[]>(() =>
    shuffled(correctOrder, exercise.items.length * 13),
  );
  const [chosen, setChosen] = React.useState<Item[]>([]);

  function pick(it: Item) {
    setPool((p) => p.filter((x) => x.id !== it.id));
    setChosen((c) => [...c, it]);
  }
  function unpick(it: Item) {
    setChosen((c) => c.filter((x) => x.id !== it.id));
    setPool((p) => [...p, it]);
  }
  function move(idx: number, dir: -1 | 1) {
    setChosen((c) => {
      const next = c.slice();
      const j = idx + dir;
      if (j < 0 || j >= next.length) return c;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }

  function check() {
    if (chosen.length !== correctOrder.length) return;
    const isCorrect = chosen.every((it, i) => it.id === i);
    onAnswer(isCorrect, chosen.map((c) => c.text));
  }

  return (
    <div>
      <p className="eyebrow mb-3">{t.orderPrompt}</p>
      <h3 className="font-display font-medium text-[18px] sm:text-[22px] text-ink mb-6 leading-snug tracking-[-0.015em]">
        {exercise.prompt}
      </h3>

      <div className="rounded-[16px] border border-dashed border-rule bg-surface p-3 min-h-[12rem]">
        {chosen.length === 0 ? (
          <p className="text-[13px] text-ink-muted text-center py-10">{t.pickToAddHere}</p>
        ) : (
          <ol className="space-y-2">
            {chosen.map((it, i) => {
              const isCorrect = answered && it.id === i;
              const isWrong = answered && it.id !== i;
              return (
                <li key={it.id}>
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-[14px] border p-3",
                      !answered && "border-ink bg-surface text-ink",
                      isCorrect && "border-green bg-green-soft text-ink",
                      isWrong && "border-ink-muted bg-surface text-ink-muted line-through",
                    )}
                  >
                    <span className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-full bg-ink text-surface font-mono text-[11px] font-medium">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-display font-normal text-[14px] sm:text-[15px]">
                      {it.text}
                    </span>
                    {!answered && (
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          className="h-7 w-7 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30 rounded"
                          aria-label={t.moveUp}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(i, 1)}
                          disabled={i === chosen.length - 1}
                          className="h-7 w-7 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30 rounded"
                          aria-label={t.moveDown}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {!answered && (
                      <button
                        type="button"
                        onClick={() => unpick(it)}
                        className="h-9 w-9 inline-flex items-center justify-center text-ink-muted hover:text-ink rounded-lg"
                        aria-label={t.remove}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {pool.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {pool.map((it) => (
            <button
              key={it.id}
              type="button"
              disabled={answered}
              onClick={() => pick(it)}
              className="rounded-full border border-rule bg-surface px-3.5 py-2 font-display font-normal text-[13.5px] text-ink-soft hover:border-ink hover:text-ink disabled:cursor-not-allowed transition-colors"
            >
              {it.text}
            </button>
          ))}
        </div>
      )}

      {!answered && (
        <Button onClick={check} disabled={chosen.length !== correctOrder.length} size="lg" className="w-full mt-8">
          {t.check}
        </Button>
      )}
    </div>
  );
}
