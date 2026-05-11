"use client";
import * as React from "react";
import Link from "next/link";
import { useUserId } from "@/components/user-provider";
import { useT } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Flame, Zap, Trophy, Plus, Target, Check, Sparkles } from "lucide-react";
import { labelLevelKey } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";

type CourseRow = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  level: string;
  topic: string;
  createdAt: number | string;
  totalLessons: number;
  completedLessons: number;
  progressPct: number;
};
type Stats = { totalXp: number; currentStreak: number; longestStreak: number };
type MeData = { stats: Stats; courses: CourseRow[]; dailyGoalMet: boolean; reviewDueCount: number };

export default function DashboardPage() {
  const userId = useUserId();
  const t = useT();
  const [data, setData] = React.useState<MeData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;
    fetch(`/api/me?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading || !data) {
    return (
      <div className="px-4 py-12 max-w-3xl mx-auto w-full">
        <div className="h-40 rounded-card bg-zinc-100 animate-pulse" />
        <div className="h-20 rounded-card bg-zinc-100 animate-pulse mt-4" />
        <div className="grid sm:grid-cols-2 gap-3 mt-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-card bg-zinc-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, courses, dailyGoalMet, reviewDueCount } = data;
  const completedCourses = courses.filter((c) => c.progressPct === 100).length;
  const showReview = reviewDueCount > 0;

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-3xl mx-auto w-full">
      {/* Stats hero — bigger numbers, more presence */}
      <div
        className="reveal rounded-card bg-gradient-to-br from-brand-500 to-brand-700 text-white p-6 sm:p-8 relative overflow-hidden"
        style={{ animationDelay: "0ms" }}
      >
        {/* Decorative numeral */}
        <div className="absolute -bottom-12 -right-6 text-[16rem] leading-none font-black opacity-[0.06] pointer-events-none select-none">
          {stats.totalXp}
        </div>
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/70 relative z-10">
          {t.yourProgress}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4 relative z-10">
          <BigStat
            icon={<Flame className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />}
            value={stats.currentStreak}
            label={t.daysInARow}
          />
          <BigStat
            icon={<Zap className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />}
            value={stats.totalXp}
            label={t.experienceLong}
          />
          <BigStat
            icon={<Trophy className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />}
            value={stats.longestStreak}
            label={t.bestStreak}
          />
        </div>
      </div>

      {/* Daily goal callout */}
      <div
        className={`reveal mt-4 rounded-card border-2 p-4 sm:p-5 flex items-center gap-4 ${
          dailyGoalMet ? "bg-brand-50 border-brand-200" : "bg-amber-50 border-amber-200"
        }`}
        style={{ animationDelay: "100ms" }}
      >
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
            dailyGoalMet ? "bg-brand-500 text-white" : "bg-amber-100 text-amber-700"
          }`}
        >
          {dailyGoalMet ? <Check className="h-6 w-6" /> : <Target className="h-6 w-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold ${dailyGoalMet ? "text-brand-900" : "text-amber-900"}`}>
            {dailyGoalMet ? t.dailyGoalDone : t.dailyGoalNotDone}
          </p>
          <p className={`text-sm mt-0.5 ${dailyGoalMet ? "text-brand-700" : "text-amber-700"}`}>
            {dailyGoalMet ? t.dailyGoalDoneSub : t.dailyGoalNotDoneSub}
          </p>
        </div>
      </div>

      {/* Review card — only when there's something due */}
      {showReview && (
        <Link
          href="/review"
          className="reveal mt-4 block rounded-card bg-gradient-to-br from-amber-400 to-orange-500 text-white p-5 sm:p-6 flex items-center gap-4 hover:from-amber-500 hover:to-orange-600 transition-all relative overflow-hidden group"
          style={{ animationDelay: "150ms" }}
        >
          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Sparkles className="h-6 w-6 fill-current" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-lg">{t.reviewTitle}</p>
            <p className="text-sm text-white/90 mt-0.5">
              {t.reviewDueCount(reviewDueCount)}
            </p>
          </div>
          <span className="text-2xl shrink-0">→</span>
        </Link>
      )}

      {/* Courses */}
      <div
        className="reveal mt-10 flex items-end justify-between gap-4"
        style={{ animationDelay: "200ms" }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
            {t.myCoursesTitle}
          </h2>
          {courses.length > 0 && (
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-bold mt-1">
              {t.coursesPlural(courses.length)}
              {completedCourses > 0 && ` · ${t.completedPlural(completedCourses)}`}
            </p>
          )}
        </div>
        <Button asChild size="sm">
          <Link href="/">
            <Plus className="h-4 w-4" />
            {t.newCourse}
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <div
          className="reveal mt-6 rounded-card border-2 border-dashed border-zinc-300 p-12 text-center bg-white"
          style={{ animationDelay: "300ms" }}
        >
          <div className="text-5xl mb-4">📚</div>
          <p className="text-zinc-700 font-bold text-lg">{t.noCoursesYet}</p>
          <Button asChild size="md" className="mt-6">
            <Link href="/">{t.createFirst}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-5">
          {courses.map((c, i) => (
            <CourseCard key={c.id} course={c} t={t} delayMs={300 + i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course: c,
  t,
  delayMs,
}: {
  course: CourseRow;
  t: Dict;
  delayMs: number;
}) {
  const isComplete = c.progressPct === 100;
  return (
    <Link
      href={`/course/${c.id}`}
      className="reveal group rounded-card bg-white border-2 border-zinc-200 p-5 hover:border-brand-300 hover:shadow-md transition-all relative overflow-hidden"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {/* Large faded emoji as background flourish */}
      <span className="absolute -top-2 -right-2 text-7xl opacity-[0.06] pointer-events-none select-none">
        {c.emoji}
      </span>

      <div className="flex items-start gap-3 relative">
        <div className="text-3xl shrink-0">{c.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug">
            {c.title}
          </h3>
          <p className="text-xs uppercase tracking-wider text-zinc-400 mt-1 font-bold">
            {t[labelLevelKey(c.level)]}
          </p>
        </div>
        {isComplete && (
          <Trophy className="h-5 w-5 text-yellow-500 fill-current shrink-0" />
        )}
      </div>

      <div className="mt-4 relative">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-zinc-500">
            {t.lessonsOf(c.completedLessons, c.totalLessons)}
          </span>
          <span className={isComplete ? "text-brand-600" : "text-zinc-700"}>
            {c.progressPct}%
          </span>
        </div>
        <ProgressBar value={c.progressPct} />
      </div>
    </Link>
  );
}

function BigStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center text-yellow-300 mb-1">{icon}</div>
      <p className="text-3xl sm:text-4xl font-black tracking-tight">{value}</p>
      <p className="text-[11px] sm:text-xs text-white/80 font-bold uppercase tracking-wider mt-1 leading-tight">
        {label}
      </p>
    </div>
  );
}
