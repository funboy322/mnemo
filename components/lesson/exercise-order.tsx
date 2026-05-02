"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { cn, shuffled } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";
import { ChevronUp, ChevronDown, X } from "lucide-react";

type Props = {
  exercise: Extract<Exercise, { type: "order" }>;
  answered: boolean;
  onAnswer: (correct: boolean, userAnswer: unknown) => void;
};

type Item = { id: number; text: string };

export function ExerciseOrder({ exercise, answered, onAnswer }: Props) {
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
      <p className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
        Расставь по порядку
      </p>
      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-6">{exercise.prompt}</h3>

      <div className="rounded-card border-2 border-dashed border-zinc-300 bg-white p-3 min-h-[12rem]">
        {chosen.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-8">
            Нажимай на варианты ниже, чтобы добавить их сюда
          </p>
        ) : (
          <ol className="space-y-2">
            {chosen.map((it, i) => {
              const isCorrect = answered && it.id === i;
              const isWrong = answered && it.id !== i;
              return (
                <li key={it.id}>
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-2xl border-2 p-3",
                      !answered && "border-brand-400 bg-brand-50 text-brand-900",
                      isCorrect && "border-brand-500 bg-brand-50 text-brand-900",
                      isWrong && "border-red-400 bg-red-50 text-red-900",
                    )}
                  >
                    <span className="h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-lg bg-white text-zinc-700 border-2 border-zinc-200 font-black text-xs">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-medium text-sm sm:text-base">{it.text}</span>
                    {!answered && (
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                          aria-label="Вверх"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(i, 1)}
                          disabled={i === chosen.length - 1}
                          className="text-zinc-400 hover:text-zinc-700 disabled:opacity-30"
                          aria-label="Вниз"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {!answered && (
                      <button
                        type="button"
                        onClick={() => unpick(it)}
                        className="text-zinc-400 hover:text-red-600"
                        aria-label="Убрать"
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
              className="rounded-2xl border-2 border-zinc-200 bg-white px-3.5 py-2 text-sm sm:text-base font-medium text-zinc-800 hover:border-zinc-300 btn-3d disabled:cursor-not-allowed"
            >
              {it.text}
            </button>
          ))}
        </div>
      )}

      {!answered && (
        <Button
          onClick={check}
          disabled={chosen.length !== correctOrder.length}
          size="lg"
          className="w-full mt-8"
        >
          Проверить
        </Button>
      )}
    </div>
  );
}
