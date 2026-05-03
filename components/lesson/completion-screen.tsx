"use client";
import * as React from "react";
import Link from "next/link";
import { Trophy, Zap, Target, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import { Confetti } from "./confetti";

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
  const headline = isPerfect
    ? t.perfect
    : accuracy >= 80
      ? t.great
      : accuracy >= 50
        ? t.passed
        : t.goodJob;
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
        <div className="text-7xl mb-4">{isPerfect ? "🏆" : accuracy >= 80 ? "🎉" : "✨"}</div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900">{headline}</h1>
        <p className="text-zinc-600 mt-2">{subheading}</p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          <Stat
            icon={<Zap className="h-5 w-5 text-yellow-500 fill-current" />}
            label={t.xp}
            value={`+${xpEarned}`}
            tint="bg-yellow-50 border-yellow-200"
          />
          <Stat
            icon={<Target className="h-5 w-5 text-brand-600 fill-current" />}
            label={t.accuracy}
            value={`${accuracy}%`}
            tint="bg-brand-50 border-brand-200"
          />
          <Stat
            icon={<Heart className="h-5 w-5 text-red-500 fill-current" />}
            label={t.hearts}
            value={`${hearts}/3`}
            tint="bg-red-50 border-red-200"
          />
        </div>

        {isPerfect && (
          <div className="mt-6 inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 px-4 py-2 rounded-full font-bold">
            <Trophy className="h-5 w-5" />
            {t.withoutMistakes}
          </div>
        )}

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

function Stat({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: string; tint: string }) {
  return (
    <div className={`rounded-2xl border-2 p-3 ${tint}`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xs uppercase tracking-wider font-bold text-zinc-500">{label}</p>
      <p className="text-xl font-black text-zinc-900 mt-0.5">{value}</p>
    </div>
  );
}
