import { cn } from "@/lib/utils";

/**
 * ProgressBar — Quiet direction.
 *
 * 3px tall track (was 12px). Track color is rule (warm divider), fill
 * is ink. Used in the lesson player header and in course cards. Tone is
 * deliberately understated — Quiet doesn't trumpet progress with
 * brand-saturated bars.
 */
export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-[3px] w-full rounded-full bg-rule overflow-hidden", className)}>
      <div
        className="h-full bg-ink rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
