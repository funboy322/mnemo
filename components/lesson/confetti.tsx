"use client";
import * as React from "react";

const PIECES = ["🎉", "🎊", "⭐", "✨", "🏆", "💫", "🌟"];
const COUNT = 30;

type Piece = {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  size: number;
};

function makePiece(id: number): Piece {
  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  return {
    id,
    emoji: PIECES[id % PIECES.length],
    left: rand(0, 100),
    delay: rand(0, 1.2),
    duration: rand(2.5, 4.5),
    drift: rand(-100, 100),
    rotate: rand(-540, 540),
    size: rand(1.2, 2.2),
  };
}

/**
 * Pure-CSS confetti — no canvas, no dependency. Falls from above viewport,
 * drifts horizontally, rotates, and fades. Auto-cleans after animation.
 */
export function Confetti() {
  const [pieces, setPieces] = React.useState<Piece[]>([]);

  React.useEffect(() => {
    setPieces(Array.from({ length: COUNT }, (_, i) => makePiece(i)));
    const t = setTimeout(() => setPieces([]), 6000);
    return () => clearTimeout(t);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-3rem] block"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            ["--drift" as string]: `${p.drift}px`,
            ["--rotate" as string]: `${p.rotate}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
