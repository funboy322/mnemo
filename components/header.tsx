"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserId } from "./user-provider";
import { useT, useLocale, useSetLocale } from "./locale-provider";
import * as React from "react";
import { Flame, Zap, Target, Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_FLAGS } from "@/lib/i18n";

type Stats = {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
};
type MeData = { stats: Stats; dailyGoalMet: boolean };

export function Header() {
  const userId = useUserId();
  const pathname = usePathname();
  const t = useT();
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

  // Hide global header inside lesson player
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
                title={data.dailyGoalMet ? t.dailyGoalDoneTitle : t.dailyGoalTitle}
              >
                <Target className="h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-orange-500" title={t.streakTitle}>
                <Flame className="h-5 w-5 fill-current" />
                <span>{data.stats.currentStreak}</span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-yellow-500" title={t.xpTitle}>
                <Zap className="h-5 w-5 fill-current" />
                <span>{data.stats.totalXp}</span>
              </Link>
            </>
          )}
          <LanguageSwitcher />
          <Link href="/dashboard" className="hidden sm:inline-block text-zinc-500 hover:text-zinc-900">
            {t.myCourses}
          </Link>
        </div>
      </div>
    </header>
  );
}

function LanguageSwitcher() {
  const current = useLocale();
  const setLocale = useSetLocale();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors h-9 px-2 rounded-lg hover:bg-zinc-100"
        aria-label="Language"
        aria-expanded={open}
      >
        <Globe className="h-5 w-5" />
        <span className="hidden sm:inline">{LOCALE_FLAGS[current]}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-44 rounded-2xl border-2 border-zinc-200 bg-white shadow-xl py-1 animate-pop">
          {SUPPORTED_LOCALES.map((lc) => {
            const isActive = lc === current;
            return (
              <button
                key={lc}
                type="button"
                onClick={() => {
                  if (!isActive) setLocale(lc);
                  else setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-left transition-colors",
                  isActive ? "text-brand-700" : "text-zinc-700 hover:bg-zinc-50",
                )}
              >
                <span className="text-lg">{LOCALE_FLAGS[lc]}</span>
                <span className="flex-1">{LOCALE_LABELS[lc]}</span>
                {isActive && <Check className="h-4 w-4 text-brand-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
