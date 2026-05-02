"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUserId } from "./user-provider";
import { Loader2 } from "lucide-react";

const LEVELS = [
  { value: "beginner", label: "Новичок" },
  { value: "intermediate", label: "Средний" },
  { value: "advanced", label: "Продвинутый" },
] as const;

const DEPTHS = [5, 8, 12] as const;

export function TopicForm({ suggestions = [] as string[] }: { suggestions?: string[] }) {
  const router = useRouter();
  const userId = useUserId();
  const [topic, setTopic] = React.useState("");
  const [level, setLevel] = React.useState<typeof LEVELS[number]["value"]>("beginner");
  const [depth, setDepth] = React.useState<typeof DEPTHS[number]>(5);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!userId) return;
    if (topic.trim().length < 2) {
      setError("Введи тему хотя бы из 2 символов");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          input: { topic: topic.trim(), level, depth, language: "ru" },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.courseId) {
        throw new Error(data.error || "Не удалось создать курс");
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
          placeholder="Например: Как работает нейросеть LLM"
          className="border-0 h-14 text-lg px-2 focus:ring-0 focus:border-transparent"
          disabled={loading}
        />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <SelectGroup
            label="Уровень"
            value={level}
            options={LEVELS.map((l) => ({ value: l.value, label: l.label }))}
            onChange={(v) => setLevel(v as typeof level)}
            disabled={loading}
          />
          <SelectGroup
            label="Длина"
            value={String(depth)}
            options={DEPTHS.map((d) => ({ value: String(d), label: `${d} уроков` }))}
            onChange={(v) => setDepth(Number(v) as typeof depth)}
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 font-medium animate-shake">{error}</div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading || !userId}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Генерируем курс...
          </>
        ) : (
          "Создать курс"
        )}
      </Button>

      {loading && (
        <p className="text-sm text-zinc-500 text-center animate-pulse">
          Это может занять 10–30 секунд. AI готовит структуру и темы уроков.
        </p>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="pt-2">
          <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold mb-2 text-center">
            Или выбери идею
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
      <p className="text-xs uppercase tracking-wider font-bold text-zinc-400 mb-1.5 px-1">
        {label}
      </p>
      <div className="flex gap-1.5 bg-zinc-100 p-1 rounded-2xl">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={`flex-1 text-sm font-bold py-2 rounded-xl transition-all ${
                active
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
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
