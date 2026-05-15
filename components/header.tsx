"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserContext } from "./user-provider";
import { useT, useLocale, useSetLocale } from "./locale-provider";
import * as React from "react";
import { Globe, Check, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { SUPPORTED_LOCALES, LOCALE_LABELS, LOCALE_FLAGS } from "@/lib/i18n";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { isClerkEnabled } from "@/lib/auth-config";
import { QuietWordmark } from "./quiet-mark";

type Stats = {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
};
type MeData = { stats: Stats; dailyGoalMet: boolean };

/**
 * Header — Quiet direction.
 *
 * Left: QuietWordmark (mark + lowercase "mnemo").
 * Right: streak (green dot + number + mono caps "day streak"), XP (mono
 * number + mono caps "xp"), language switcher, sign in (ink pill).
 *
 * The single accent (green) appears only as the streak dot. Flame + Zap
 * icons from the old Duolingo-style header are gone: Quiet replaces
 * gamification "HUD" energy with restrained monochrome metadata.
 */
export function Header() {
  const { userId, isAuthed, pendingGuestId, clearPendingGuestId } = useUserContext();
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

  // First sign-in: migrate guest data into authed userId, then refetch stats
  const migrating = React.useRef(false);
  React.useEffect(() => {
    if (!isAuthed || !userId || !pendingGuestId || migrating.current) return;
    if (pendingGuestId === userId) {
      clearPendingGuestId();
      return;
    }
    migrating.current = true;
    fetch("/api/migrate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fromUserId: pendingGuestId, toUserId: userId }),
    })
      .then((r) => r.json())
      .then(() => {
        clearPendingGuestId();
        return fetch(`/api/me?userId=${userId}`).then((r) => r.json());
      })
      .then((d) => {
        if (d?.stats) setData(d);
      })
      .catch(() => {})
      .finally(() => {
        migrating.current = false;
      });
  }, [isAuthed, userId, pendingGuestId, clearPendingGuestId]);

  if (pathname && (/^\/course\/[^/]+\/lesson\//.test(pathname) || pathname === "/review")) {
    return null;
  }

  return (
    <header className="border-b border-rule bg-bone sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
        <Link href="/" aria-label="Mnemo home" className="inline-flex">
          <QuietWordmark size={20} />
        </Link>
        <div className="flex items-center gap-5 sm:gap-7">
          {data?.stats && (
            <>
              {/* Streak — green dot (the only color accent), ink number,
                  mono caps label */}
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-[13.5px] text-ink-soft hover:text-ink transition-colors"
                title={t.streakTitle}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green" />
                <span className="font-medium text-ink">{data.stats.currentStreak}</span>
                <span
                  className="font-mono text-[11px] text-ink-muted tracking-[0.06em] uppercase"
                  aria-hidden
                >
                  day streak
                </span>
              </Link>
              {/* XP — mono number, mono caps "xp" label */}
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 text-[13.5px] text-ink-soft hover:text-ink transition-colors"
                title={t.xpTitle}
              >
                <span className="font-mono font-medium text-ink">
                  {data.stats.totalXp.toLocaleString()}
                </span>
                <span
                  className="font-mono text-[11px] text-ink-muted tracking-[0.06em] uppercase"
                  aria-hidden
                >
                  xp
                </span>
              </Link>
              {/* Mobile-compact: single combined pill */}
              <Link
                href="/dashboard"
                className="sm:hidden inline-flex items-center gap-2 text-[13.5px] text-ink-soft"
              >
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green" />
                  <span className="font-medium text-ink">{data.stats.currentStreak}</span>
                </span>
                <span className="font-mono font-medium text-ink">
                  {data.stats.totalXp.toLocaleString()}
                </span>
              </Link>
            </>
          )}
          <LanguageSwitcher />
          {isClerkEnabled() && <ClerkAuthControls isAuthed={isAuthed} t={t} />}
        </div>
      </div>
    </header>
  );
}

function ClerkAuthControls({ isAuthed, t }: { isAuthed: boolean; t: ReturnType<typeof useT> }) {
  const { isLoaded } = useUser();
  if (!isLoaded) return null;
  if (isAuthed) {
    return <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />;
  }
  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="btn-ink inline-flex items-center gap-1.5"
        title={t.saveProgress}
        aria-label={t.signIn}
      >
        <LogIn className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t.signIn}</span>
      </button>
    </SignInButton>
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
        className="flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors h-9 px-1.5 rounded-lg"
        aria-label="Language"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">{LOCALE_FLAGS[current]}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-40 w-44 rounded-xl border border-rule bg-surface py-1 animate-pop">
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
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors",
                  isActive ? "text-green" : "text-ink-soft hover:bg-bone",
                )}
              >
                <span className="text-base">{LOCALE_FLAGS[lc]}</span>
                <span className="flex-1">{LOCALE_LABELS[lc]}</span>
                {isActive && <Check className="h-3.5 w-3.5 text-green" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
