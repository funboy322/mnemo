"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUserId } from "./user-provider";
import { useT, useLocale } from "./locale-provider";
import { Loader2 } from "lucide-react";
import { LOCALE_FLAGS, LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n";
import type { Language } from "@/lib/schemas";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const DEPTHS = [5, 8, 12] as const;

export function TopicForm() {
  const router = useRouter();
  const userId = useUserId();
  const t = useT();
  const uiLocale = useLocale();

  const [topic, setTopic] = React.useState("");
  const [level, setLevel] = React.useState<typeof LEVELS[number]>("beginner");
  const [depth, setDepth] = React.useState<typeof DEPTHS[number]>(5);
  const [language, setLanguage] = React.useState<Language>(uiLocale);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync course language with UI locale changes (until user explicitly picks)
  React.useEffect(() => {
    setLanguage(uiLocale);
  }, [uiLocale]);

  const suggestions = [t.suggestion1, t.suggestion2, t.suggestion3, t.suggestion4, t.suggestion5, t.suggestion6];

  const levelLabels: Record<typeof LEVELS[number], string> = {
    beginner: t.levelBeginner,
    intermediate: t.levelIntermediate,
    advanced: t.levelAdvanced,
  };
  const depthLabels: Record<typeof DEPTHS[number], string> = {
    5: t.depth5,
    8: t.depth8,
    12: t.depth12,
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!userId) return;
    if (topic.trim().length < 2) {
      setError(t.errorTooShort);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          input: { topic: topic.trim(), level, depth, language },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.courseId) {
        throw new Error(data.error || data.message || t.errorGenerationFailed);
      }
      router.push(`/course/${data.courseId}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-card bg-white border-2 border-zinc-200 p-4 sm:p-5 shadow-sm">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t.topicPlaceholder}
          className="border-0 h-14 text-lg px-2 focus:ring-0 focus:border-transparent"
          disabled={loading}
        />
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SelectGroup
            label={t.levelLabel}
            value={level}
            options={LEVELS.map((v) => ({ value: v, label: levelLabels[v] }))}
            onChange={(v) => setLevel(v as typeof level)}
            disabled={loading}
          />
          <SelectGroup
            label={t.depthLabel}
            value={String(depth)}
            options={DEPTHS.map((d) => ({ value: String(d), label: depthLabels[d] }))}
            onChange={(v) => setDepth(Number(v) as typeof depth)}
            disabled={loading}
          />
          <SelectGroup
            label={t.langLabel}
            value={language}
            options={SUPPORTED_LOCALES.map((lc) => ({
              value: lc,
              label: `${LOCALE_FLAGS[lc]} ${LOCALE_LABELS[lc]}`,
            }))}
            onChange={(v) => setLanguage(v as Language)}
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 font-medium animate-shake">{error}</div>
      )}

      <Button type="submit" size="lg" disabled={loading || !userId} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {t.generating}
          </>
        ) : (
          t.createCourse
        )}
      </Button>

      {loading && (
        <p className="text-sm text-zinc-500 text-center animate-pulse">{t.generatingHint}</p>
      )}

      {!loading && (
        <div className="pt-2">
          <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2 text-center">
            {t.orPickIdea}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTopic(s)}
                className="text-sm px-3 py-1.5 rounded-full bg-white border-2 border-zinc-200 text-zinc-700 hover:border-brand-300 hover:text-brand-700 transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

function SelectGroup({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-1.5 px-1">{label}</p>
      <div className="flex gap-1.5 bg-zinc-100 p-1 rounded-2xl">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={`flex-1 text-xs sm:text-sm font-bold py-2 rounded-xl transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
                active ? "bg-white text-brand-700 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
