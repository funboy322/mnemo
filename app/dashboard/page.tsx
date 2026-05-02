"use client";
import * as React from "react";
import Link from "next/link";
import { useUserId } from "@/components/user-provider";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Flame, Zap, Trophy, Plus, Target, Check } from "lucide-react";
import { labelLevel } from "@/lib/utils";

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
type MeData = { stats: Stats; courses: CourseRow[]; dailyGoalMet: boolean };

export default function DashboardPage() {
  const userId = useUserId();
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
        <div className="h-32 rounded-card bg-zinc-100 animate-pulse" />
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-card bg-zinc-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, courses, dailyGoalMet } = data;
  const completedCourses = courses.filter((c) => c.progressPct === 100).length;

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-3xl mx-auto w-full">
      <div className="rounded-card bg-gradient-to-br from-brand-500 to-brand-700 text-white p-6 sm:p-8">
        <p className="text-xs uppercase tracking-wider font-bold text-white/70">
          Твой прогресс
        </p>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <BigStat
            icon={<Flame className="h-6 w-6 fill-current" />}
            value={stats.currentStreak}
            label="дней подряд"
          />
          <BigStat
            icon={<Zap className="h-6 w-6 fill-current" />}
            value={stats.totalXp}
            label="опыта"
          />
          <BigStat
            icon={<Trophy className="h-6 w-6 fill-current" />}
            value={stats.longestStreak}
            label="рекорд"
          />
        </div>
      </div>

      <div className={`mt-4 rounded-card border-2 p-4 sm:p-5 flex items-center gap-4 ${
        dailyGoalMet
          ? "bg-brand-50 border-brand-200"
          : "bg-amber-50 border-amber-200"
      }`}>
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
          dailyGoalMet ? "bg-brand-500 text-white" : "bg-amber-100 text-amber-700"
        }`}>
          {dailyGoalMet ? <Check className="h-6 w-6" /> : <Target className="h-6 w-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold ${dailyGoalMet ? "text-brand-900" : "text-amber-900"}`}>
            {dailyGoalMet ? "Цель на сегодня выполнена" : "Цель: 1 урок сегодня"}
          </p>
          <p className={`text-sm ${dailyGoalMet ? "text-brand-700" : "text-amber-700"}`}>
            {dailyGoalMet
              ? "Streak в безопасности. Можно продолжать или отдохнуть."
              : "Пройди один урок, чтобы продлить streak."}
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-zinc-900">Мои курсы</h2>
          {courses.length > 0 && (
            <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold mt-0.5">
              {courses.length} {pluralize(courses.length, "курс", "курса", "курсов")}
              {completedCourses > 0 && ` · ${completedCourses} ${pluralize(completedCourses, "пройден", "пройдено", "пройдено")}`}
            </p>
          )}
        </div>
        <Button asChild size="sm">
          <Link href="/">
            <Plus className="h-4 w-4" />
            Новый курс
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="mt-6 rounded-card border-2 border-dashed border-zinc-300 p-10 text-center">
          <div className="text-4xl">📚</div>
          <p className="text-zinc-500 mt-3 font-medium">Пока ни одного курса.</p>
          <Button asChild size="md" className="mt-5">
            <Link href="/">Создать первый курс</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course: c }: { course: CourseRow }) {
  const isComplete = c.progressPct === 100;
  return (
    <Link
      href={`/course/${c.id}`}
      className="group rounded-card bg-white border-2 border-zinc-200 p-5 hover:border-brand-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl shrink-0">{c.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 group-hover:text-brand-700 line-clamp-2">{c.title}</h3>
          <p className="text-xs uppercase tracking-wider text-zinc-400 mt-1 font-bold">
            {labelLevel(c.level)}
          </p>
        </div>
        {isComplete && (
          <Trophy className="h-5 w-5 text-yellow-500 fill-current shrink-0" />
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-zinc-500">{c.completedLessons}/{c.totalLessons} уроков</span>
          <span className={isComplete ? "text-brand-600" : "text-zinc-700"}>{c.progressPct}%</span>
        </div>
        <ProgressBar value={c.progressPct} />
      </div>
    </Link>
  );
}

function BigStat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center text-yellow-300 mb-1">{icon}</div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs text-white/80 font-medium mt-0.5">{label}</p>
    </div>
  );
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
