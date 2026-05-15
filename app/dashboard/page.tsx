"use client";
import * as React from "react";
import Link from "next/link";
import { useUserId } from "@/components/user-provider";
import { useT, useLocale } from "@/components/locale-provider";
import { EmText } from "@/components/em-text";
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
type MeData = {
  stats: Stats;
  courses: CourseRow[];
  dailyGoalMet: boolean;
  reviewDueCount: number;
};

/**
 * Dashboard — Quiet direction.
 *
 * The previous version had a saturated brand-gradient hero with three
 * icon-headed stats, a daily-goal callout, and an amber-gradient review
 * card. Quiet replaces all of that with: a weekday eyebrow, the
 * "Welcome {em}back.{/em}" italic-moment headline, a flat 3-column stat
 * row with 1px rule dividers, a single subtle review card (if anything
 * is due), and a clean course shelf.
 *
 * Daily-goal callout is dropped. The streak dot + xp number in the
 * header carry the same info without taking dashboard real estate.
 */
export default function DashboardPage() {
  const userId = useUserId();
  const t = useT();
  const locale = useLocale();
  const [data, setData] = React.useState<MeData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return;
    fetch(`/api/me?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [userId]);

  const weekday = React.useMemo(() => {
    try {
      return new Date().toLocaleDateString(locale, { weekday: "long" });
    } catch {
      return "";
    }
  }, [locale]);

  if (loading || !data) {
    return (
      <div className="px-4 sm:px-6 py-12 sm:py-14 max-w-[1040px] mx-auto w-full">
        <div className="h-6 w-32 bg-rule rounded animate-pulse" />
        <div className="h-14 w-2/3 bg-rule rounded mt-3 animate-pulse" />
        <div className="mt-10 h-24 bg-rule/40 rounded animate-pulse" />
        <div className="mt-14 h-7 w-40 bg-rule rounded animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-surface border border-rule rounded-[16px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, courses, reviewDueCount } = data;
  const completedCourses = courses.filter((c) => c.progressPct === 100).length;
  const showReview = reviewDueCount > 0;

  return (
    <div className="px-4 sm:px-6 py-10 sm:py-14 max-w-[1040px] mx-auto w-full">
      {/* Greeting — eyebrow + italic-moment headline */}
      <div>
        <div className="eyebrow capitalize">{weekday}</div>
        <h1 className="mt-2 sm:mt-2.5 font-display font-medium text-[32px] sm:text-[56px] leading-[1.05] tracking-[-0.032em] text-ink">
          <EmText>{t.welcomeBack}</EmText>
        </h1>
      </div>

      {/* Stats row — quiet numerals, no icons */}
      <div className="mt-8 sm:mt-10 grid grid-cols-3 border-t border-b border-rule">
        <StatCell value={stats.currentStreak} label={t.statDayStreak} divider />
        <StatCell value={stats.totalXp.toLocaleString()} label={t.statXpEarned} divider />
        <StatCell value={stats.longestStreak} label={t.statBestStreak} />
      </div>

      {/* Review card — surface, single accent */}
      {showReview && (
        <Link
          href="/review"
          className="card-quiet block mt-6 px-5 sm:px-6 py-5 grid grid-cols-[1fr_auto] gap-4 items-center"
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-11 h-11 rounded-full bg-green-soft flex items-center justify-center font-display font-semibold text-[18px] text-green shrink-0">
              {reviewDueCount}
            </div>
            <div className="min-w-0">
              <div className="font-display font-medium text-[15px] sm:text-[17px] text-ink leading-tight">
                <em>{t.reviewTitle}</em> — {t.reviewDueCount(reviewDueCount)}
              </div>
              <div className="mt-0.5 font-mono text-[11px] tracking-[0.06em] text-ink-muted uppercase">
                4 min · spaced repetition
              </div>
            </div>
          </div>
          <span className="btn-ink">{t.reviewStart} →</span>
        </Link>
      )}

      {/* Shelf header */}
      <div className="mt-12 sm:mt-14 flex items-baseline justify-between gap-4">
        <h2 className="font-display font-medium text-[20px] sm:text-[28px] tracking-[-0.02em] text-ink">
          {t.yourShelf}
          {courses.length > 0 && (
            <span className="ml-3 font-mono text-[11px] sm:text-[12px] font-medium tracking-[0.06em] text-ink-muted">
              {courses.length}
              {completedCourses > 0 && ` · ${completedCourses} ${completedCourses === 1 ? "finished" : "finished"}`}
            </span>
          )}
        </h2>
        <Link href="/" className="btn-outline">
          + {t.newCourse}
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="mt-5 card-quiet p-10 sm:p-12 text-center">
          <p className="text-ink-soft text-[15px] sm:text-[16px]">{t.noCoursesYet}</p>
          <Link href="/" className="btn-primary inline-flex mt-6">
            {t.createFirst}
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCell({
  value,
  label,
  divider,
}: {
  value: number | string;
  label: string;
  divider?: boolean;
}) {
  return (
    <div
      className={`px-4 sm:px-7 py-5 sm:py-6 ${divider ? "border-r border-rule" : ""}`}
    >
      <div className="font-display font-normal text-[32px] sm:text-[48px] leading-none tracking-[-0.03em] text-ink">
        {value}
      </div>
      <div className="mt-2 font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-ink-muted">
        {label}
      </div>
    </div>
  );
}

function CourseCard({ course: c, t }: { course: CourseRow; t: Dict }) {
  const sealed = c.progressPct === 100;
  return (
    <Link
      href={`/course/${c.id}`}
      className="card-quiet block p-[18px] pb-4"
    >
      {/* Emoji + Finished pill */}
      <div className="flex justify-between items-start">
        <div className="text-[26px] leading-none">{c.emoji}</div>
        {sealed && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full bg-green-soft text-green font-mono text-[10px] font-semibold tracking-[0.12em] uppercase">
            <span className="w-1 h-1 rounded-full bg-green" />
            {t.lessonCompleted}
          </span>
        )}
      </div>
      <div className="mt-3.5 font-display font-medium text-[15px] sm:text-[18px] leading-[1.25] tracking-[-0.015em] text-ink line-clamp-2">
        {c.title}
      </div>
      <div className="mt-1 text-[12.5px] sm:text-[13px] text-ink-muted">
        {t[labelLevelKey(c.level)]}
      </div>
      <div className="mt-4 flex items-center justify-between text-[12.5px] sm:text-[13px]">
        <span className="text-ink-soft">
          {c.completedLessons} / {c.totalLessons}
        </span>
        <span
          className={`font-mono text-[12px] font-medium ${
            sealed ? "text-green" : "text-ink-muted"
          }`}
        >
          {c.progressPct}%
        </span>
      </div>
      <div className="mt-1.5 h-[3px] bg-rule rounded-full overflow-hidden">
        <div
          className={`h-full ${sealed ? "bg-green" : "bg-ink"} rounded-full transition-all`}
          style={{ width: `${c.progressPct}%` }}
        />
      </div>
    </Link>
  );
}
