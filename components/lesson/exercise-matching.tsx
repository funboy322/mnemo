"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { cn, shuffled } from "@/lib/utils";
import type { Exercise } from "@/lib/schemas";

type Props = {
  exercise: Extract<Exercise, { type: "matching" }>;
  answered: boolean;
  onAnswer: (correct: boolean, userAnswer: unknown) => void;
};

type Match = { leftIdx: number; rightIdx: number };

export function ExerciseMatching({ exercise, answered, onAnswer }: Props) {
  const t = useT();
  const lefts = React.useMemo(
    () => exercise.pairs.map((p, i) => ({ id: `L${i}`, text: p.left, pairIndex: i })),
    [exercise.pairs],
  );
  const rights = React.useMemo(
    () => shuffled(
      exercise.pairs.map((p, i) => ({ id: `R${i}`, text: p.right, pairIndex: i })),
      exercise.pairs.length + 7,
    ),
    [exercise.pairs],
  );

  const [matches, setMatches] = React.useState<Match[]>([]);
  const [selectedLeft, setSelectedLeft] = React.useState<number | null>(null);
  const [selectedRight, setSelectedRight] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (selectedLeft === null || selectedRight === null) return;
    const leftIdx = selectedLeft;
    const rightIdx = selectedRight;
    setMatches((prev) => {
      const filtered = prev.filter((m) => m.leftIdx !== leftIdx && m.rightIdx !== rightIdx);
      return [...filtered, { leftIdx, rightIdx }];
    });
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [selectedLeft, selectedRight]);

  function leftMatched(i: number) {
    return matches.find((m) => m.leftIdx === i);
  }
  function rightMatched(i: number) {
    return matches.find((m) => m.rightIdx === i);
  }
  function pairCorrect(m: Match) {
    return lefts[m.leftIdx].pairIndex === rights[m.rightIdx].pairIndex;
  }

  function clearSelection() {
    setSelectedLeft(null);
    setSelectedRight(null);
  }

  function check() {
    if (matches.length !== exercise.pairs.length) return;
    const allCorrect = matches.every(pairCorrect);
    onAnswer(allCorrect, matches);
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-3">
        {t.matchPrompt}
      </p>
      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-6">{exercise.prompt}</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {lefts.map((l, i) => {
            const m = leftMatched(i);
            const matchIdx = m ? matches.indexOf(m) : -1;
            return (
              <MatchTile
                key={l.id}
                text={l.text}
                selected={selectedLeft === i}
                matched={!!m}
                matchIdx={matchIdx}
                correct={answered && m ? pairCorrect(m) : null}
                disabled={answered}
                onClick={() => {
                  if (m) {
                    setMatches((prev) => prev.filter((x) => x !== m));
                    clearSelection();
                  } else {
                    setSelectedLeft(i);
                  }
                }}
              />
            );
          })}
        </div>
        <div className="space-y-2">
          {rights.map((r, i) => {
            const m = rightMatched(i);
            const matchIdx = m ? matches.indexOf(m) : -1;
            return (
              <MatchTile
                key={r.id}
                text={r.text}
                selected={selectedRight === i}
                matched={!!m}
                matchIdx={matchIdx}
                correct={answered && m ? pairCorrect(m) : null}
                disabled={answered}
                onClick={() => {
                  if (m) {
                    setMatches((prev) => prev.filter((x) => x !== m));
                    clearSelection();
                  } else {
                    setSelectedRight(i);
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {!answered && (
        <Button
          onClick={check}
          disabled={matches.length !== exercise.pairs.length}
          size="lg"
          className="w-full mt-8"
        >
          {t.check}
        </Button>
      )}
    </div>
  );
}

const MATCH_COLORS = [
  "border-blue-400 bg-blue-50 text-blue-900",
  "border-purple-400 bg-purple-50 text-purple-900",
  "border-pink-400 bg-pink-50 text-pink-900",
  "border-amber-400 bg-amber-50 text-amber-900",
  "border-teal-400 bg-teal-50 text-teal-900",
];

function MatchTile({
  text,
  selected,
  matched,
  matchIdx,
  correct,
  disabled,
  onClick,
}: {
  text: string;
  selected: boolean;
  matched: boolean;
  matchIdx: number;
  correct: boolean | null;
  disabled: boolean;
  onClick: () => void;
}) {
  let style = "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300";
  if (selected) style = "border-brand-400 bg-brand-50 text-brand-900";
  else if (matched && correct === null) style = MATCH_COLORS[matchIdx % MATCH_COLORS.length];
  else if (matched && correct === true) style = "border-brand-500 bg-brand-50 text-brand-900";
  else if (matched && correct === false) style = "border-red-500 bg-red-50 text-red-900";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border-2 p-3.5 text-sm sm:text-base font-medium transition-all",
        "btn-3d disabled:cursor-not-allowed",
        style,
      )}
    >
      {text}
    </button>
  );
}
