"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { Confetti } from "./confetti";

/**
 * CompletionScreen — Quiet direction.
 *
 * The old version had emoji trophy + yellow/brand/red colored stat
 * cards. Quiet replaces with a clean centered hero: small eyebrow
 * eyebrow, italic-moment headline, 3-column flat stats, single primary
 * CTA. Confetti remains for perfect scores — the only flash of color
 * the design tolerates, and only as a one-time reward, not chrome.
 */
export function CompletionScreen({
  courseId,
  score,
  total,
  hearts,
  xpEarned,
}: {
  courseId: string;
  score: number;
  total: number;
  hearts: number;
  xpEarned: number;
}) {
  const t = useT();
  const accuracy = Math.round((score / Math.max(total, 1)) * 100);
  const isPerfect = accuracy === 100;
  const headline = isPerfect ? t.perfect : accuracy >= 80 ? t.great : accuracy >= 50 ? t.passed : t.goodJob;
  const subheading = isPerfect
    ? t.perfectSub
    : accuracy >= 80
      ? t.greatSub
      : accuracy >= 50
        ? t.passedSub
        : t.goodJobSub;

  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {isPerfect && <Confetti />}
      <div className="max-w-md w-full text-center animate-pop relative z-10">
        <div className="eyebrow">{isPerfect ? "perfect score" : "lesson complete"}</div>
        <h1 className="mt-3 font-display font-medium text-[32px] sm:text-[40px] leading-[1.05] tracking-[-0.025em] text-ink">
          {headline}
        </h1>
        <p className="mt-3 text-[15px] sm:text-[16px] text-ink-soft leading-relaxed">{subheading}</p>

        <div className="mt-8 grid grid-cols-3 border-t border-b border-rule">
          <Stat label={t.xp} value={`+${xpEarned}`} divider />
          <Stat label={t.accuracy} value={`${accuracy}%`} divider />
          <Stat label={t.hearts} value={`${hearts}/3`} />
        </div>

        <Button asChild size="lg" className="w-full mt-8">
          <Link href={`/course/${courseId}`}>{t.continueCourse}</Link>
        </Button>
        <Button asChild variant="outline" size="md" className="w-full mt-3">
          <Link href="/dashboard">{t.toMyCourses}</Link>
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  return (
    <div className={`px-2 py-5 ${divider ? "border-r border-rule" : ""}`}>
      <div className="font-display font-normal text-[28px] leading-none tracking-[-0.02em] text-ink">
        {value}
      </div>
      <div className="mt-2 font-mono text-[10px] font-medium tracking-[0.16em] uppercase text-ink-muted">
        {label}
      </div>
    </div>
  );
}
