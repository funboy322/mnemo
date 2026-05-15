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

/**
 * Matching — Quiet direction.
 *
 * The old version used 5 different pastel colors (blue/purple/pink/
 * amber/teal) to indicate which pairs were matched. Quiet forbids
 * multi-hue palettes: one accent only. We replace the rainbow with a
 * mono-caps NUMBER badge in the top-right of each matched tile — "1",
 * "2", "3" — so the learner can still visually pair up tiles, without
 * the carnival of colors.
 */
export function ExerciseMatching({ exercise, answered, onAnswer }: Props) {
  const t = useT();
  const lefts = React.useMemo(
    () => exercise.pairs.map((p, i) => ({ id: `L${i}`, text: p.left, pairIndex: i })),
    [exercise.pairs],
  );
  const rights = React.useMemo(
    () =>
      shuffled(
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
      <p className="eyebrow mb-3">{t.matchPrompt}</p>
      <h3 className="font-display font-medium text-[18px] sm:text-[22px] text-ink mb-6 leading-snug tracking-[-0.015em]">
        {exercise.prompt}
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
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
  let style = "border-rule bg-surface text-ink-soft hover:border-ink-muted";
  if (selected) style = "border-ink bg-surface text-ink";
  else if (matched && correct === null) style = "border-ink bg-surface text-ink";
  else if (matched && correct === true) style = "border-green bg-green-soft text-ink";
  else if (matched && correct === false) style = "border-ink-muted bg-surface text-ink-muted";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative w-full text-left rounded-[14px] border p-3.5 font-display font-normal text-[14px] sm:text-[15px] transition-colors disabled:cursor-not-allowed",
        style,
      )}
    >
      {/* Numbered pair badge — replaces the old colored fills */}
      {matched && (
        <span className="absolute top-2 right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-ink text-surface font-mono text-[10px] font-medium">
          {matchIdx + 1}
        </span>
      )}
      <span className="pr-6">{text}</span>
    </button>
  );
}
