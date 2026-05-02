"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserId } from "./user-provider";
import * as React from "react";
import { Flame, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

type Stats = {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
};
type MeData = { stats: Stats; dailyGoalMet: boolean };

export function Header() {
  const userId = useUserId();
  const pathname = usePathname();
  const [data, setData] = React.useState<MeData | null>(null);

  React.useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const load = () =>
      fetch(`/api/me?userId=${userId}`)
        .then((r) => r.json())
        .then((d) => {
          if (!cancelled && d?.stats) setData(d);
        })
        .catch(() => {});
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [userId]);

  // Hide global header inside lesson player — it has its own minimal header (close + progress + hearts)
  if (pathname && /^\/course\/[^/]+\/lesson\//.test(pathname)) {
    return null;
  }

  return (
    <header className="border-b-2 border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-2xl bg-brand-500 text-white text-lg">
            ✦
          </span>
          <span className="text-zinc-900">curio</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4 text-sm font-bold">
          {data?.stats && (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  data.dailyGoalMet ? "text-brand-500" : "text-zinc-300 hover:text-zinc-500",
                )}
                title={data.dailyGoalMet ? "Дневная цель выполнена" : "Дневная цель: пройди 1 урок"}
              >
                <Target className="h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-orange-500" title="Серия дней подряд">
                <Flame className="h-5 w-5 fill-current" />
                <span>{data.stats.currentStreak}</span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-yellow-500" title="Опыт">
                <Zap className="h-5 w-5 fill-current" />
                <span>{data.stats.totalXp}</span>
              </Link>
            </>
          )}
          <Link
            href="/dashboard"
            className="hidden sm:inline-block text-zinc-500 hover:text-zinc-900 ml-1"
          >
            Мои курсы
          </Link>
        </div>
      </div>
    </header>
  );
}
