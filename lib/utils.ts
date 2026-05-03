import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic Fisher-Yates shuffle. Same `seed` always returns same permutation —
 * critical so React doesn't re-shuffle on every re-render.
 */
export function shuffled<T>(arr: readonly T[], seed = 1): T[] {
  const a = arr.slice();
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level labeling now handled by `lib/i18n.ts` (Dict.levelBeginner etc).
// Keep this helper as a fallback for places without locale context.
export function labelLevelKey(level: string): "levelBeginner" | "levelIntermediate" | "levelAdvanced" {
  if (level === "intermediate") return "levelIntermediate";
  if (level === "advanced") return "levelAdvanced";
  return "levelBeginner";
}
