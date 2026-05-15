"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";

/**
 * OutOfHearts — Quiet direction. No red HeartCrack icon, no red round
 * badge. Plain eyebrow + italic-moment-free hero (the screen is already
 * an emotional beat, doesn't need extra typography flourish).
 */
export function OutOfHearts({ courseId, onRetry }: { courseId: string; onRetry: () => void }) {
  const t = useT();
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full text-center animate-pop">
        <div className="eyebrow">out of hearts</div>
        <h1 className="mt-3 font-display font-medium text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.02em] text-ink">
          {t.outOfHeartsTitle}
        </h1>
        <p className="mt-3 text-[15px] sm:text-[16px] text-ink-soft leading-relaxed">
          {t.outOfHeartsBody}
        </p>

        <Button onClick={onRetry} size="lg" className="w-full mt-8">
          {t.retryLesson} →
        </Button>
        <Button asChild variant="outline" size="md" className="w-full mt-3">
          <Link href={`/course/${courseId}`}>← {t.backToCourse}</Link>
        </Button>
      </div>
    </div>
  );
}
