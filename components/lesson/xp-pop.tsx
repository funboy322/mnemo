"use client";
import * as React from "react";
import { Zap } from "lucide-react";

/**
 * Floating "+N XP" pop on correct answer. Appears at the cursor area
 * and floats upward while fading. Self-cleans after animation ends.
 */
export function XpPop({ amount, trigger }: { amount: number; trigger: number }) {
  const [keyframes, setKeyframes] = React.useState<{ id: number; xp: number }[]>([]);

  React.useEffect(() => {
    if (trigger === 0) return;
    const id = trigger;
    setKeyframes((prev) => [...prev, { id, xp: amount }]);
    const t = setTimeout(() => {
      setKeyframes((prev) => prev.filter((k) => k.id !== id));
    }, 1400);
    return () => clearTimeout(t);
  }, [trigger, amount]);

  if (keyframes.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center" aria-hidden>
      {keyframes.map((k) => (
        <span
          key={k.id}
          className="absolute inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400 text-yellow-900 font-black text-sm shadow-lg"
          style={{ animation: "xp-pop 1.3s ease-out forwards" }}
        >
          <Zap className="h-4 w-4 fill-current" />
          +{k.xp} XP
        </span>
      ))}
    </div>
  );
}
