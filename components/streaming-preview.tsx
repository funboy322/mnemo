"use client";
import * as React from "react";
import { Sparkles, Check, Loader2, Brain } from "lucide-react";
import type { CourseOutline } from "@/lib/schemas";
import { useT } from "./locale-provider";

type Partial<T> = { [P in keyof T]?: T[P] };

/**
 * Stages shown to the user during Gemma 4's long reasoning pass. These are
 * advisory — Gemma's `thoughtsTokenCount` is real, but we don't get
 * progress signals from the API. The messages cycle by elapsed time so the
 * user sees movement instead of a dead spinner.
 */
const STAGES: { atMs: number; key: keyof Stages }[] = [
  { atMs: 0, key: "reading" },
  { atMs: 10_000, key: "reasoning" },
  { atMs: 28_000, key: "drafting" },
  { atMs: 50_000, key: "polishing" },
  { atMs: 80_000, key: "finishing" },
];

type Stages = {
  reading: string;
  reasoning: string;
  drafting: string;
  polishing: string;
  finishing: string;
};

const STAGE_COPY_EN: Stages = {
  reading: "Reading your topic...",
  reasoning: "Reasoning through curriculum design...",
  drafting: "Drafting lesson titles...",
  polishing: "Polishing the wording...",
  finishing: "Almost done, finalizing JSON...",
};

const STAGE_COPY_RU: Stages = {
  reading: "Разбираю твою тему...",
  reasoning: "Проектирую учебный план...",
  drafting: "Пишу названия уроков...",
  polishing: "Шлифую формулировки...",
  finishing: "Почти всё, финализирую структуру...",
};

const STAGE_COPY_TR: Stages = {
  reading: "Konuyu okuyorum...",
  reasoning: "Müfredat tasarımını düşünüyorum...",
  drafting: "Ders başlıklarını yazıyorum...",
  polishing: "İfadeleri rötuşluyorum...",
  finishing: "Neredeyse bitti, sonlandırıyorum...",
};

const STAGE_COPY_ES: Stages = {
  reading: "Leyendo tu tema...",
  reasoning: "Diseñando el plan de estudios...",
  drafting: "Redactando los títulos de las lecciones...",
  polishing: "Puliendo el texto...",
  finishing: "Casi listo, finalizando...",
};

const STAGE_COPY_HI: Stages = {
  reading: "आपका विषय पढ़ रहा हूँ...",
  reasoning: "पाठ्यक्रम डिज़ाइन कर रहा हूँ...",
  drafting: "पाठ शीर्षक लिख रहा हूँ...",
  polishing: "शब्दों को निखार रहा हूँ...",
  finishing: "बस हो गया, अंतिम रूप दे रहा हूँ...",
};

const STAGE_COPY_AR: Stages = {
  reading: "أقرأ موضوعك...",
  reasoning: "أصمم خطة المنهج...",
  drafting: "أكتب عناوين الدروس...",
  polishing: "أصقل الصياغة...",
  finishing: "اقتربنا من النهاية، أُنهي البنية...",
};

function getStageCopy(locale: string): Stages {
  switch (locale) {
    case "ru": return STAGE_COPY_RU;
    case "tr": return STAGE_COPY_TR;
    case "es": return STAGE_COPY_ES;
    case "hi": return STAGE_COPY_HI;
    case "ar": return STAGE_COPY_AR;
    default: return STAGE_COPY_EN;
  }
}

function useStage(active: boolean, locale: string): { label: string; index: number } {
  const copy = getStageCopy(locale);
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 1000);
    return () => clearInterval(id);
  }, [active]);

  // Pick the latest stage whose threshold has passed
  let stage: keyof Stages = "reading";
  let index = 0;
  for (let i = 0; i < STAGES.length; i++) {
    if (elapsed >= STAGES[i].atMs) {
      stage = STAGES[i].key;
      index = i;
    }
  }
  return { label: copy[stage], index };
}

export function StreamingPreview({
  topic,
  depth,
  partial,
  done,
  error,
}: {
  topic: string;
  depth: number;
  partial: Partial<CourseOutline> | null;
  done: boolean;
  error: string | null;
}) {
  const t = useT();
  const locale = (typeof document !== "undefined" ? document.documentElement.lang : "en") || "en";
  const stage = useStage(!done && !error, locale);
  const lessons = (partial?.lessons ?? []) as Array<{
    title?: string;
    summary?: string;
    objectives?: string[];
  }>;

  return (
    <div className="reveal" style={{ animationDelay: "0ms" }}>
      <div className="rounded-card bg-white border-2 border-zinc-200 p-6 sm:p-8 relative overflow-hidden">
        {/* Status line */}
        <div className="flex items-center gap-2 mb-2">
          {!done && !error ? (
            <>
              <Brain className="h-4 w-4 text-brand-500 animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-bold text-brand-700">
                Gemma 4 · open-weights
              </span>
            </>
          ) : error ? (
            <span className="text-xs uppercase tracking-wider font-bold text-red-600">
              {error}
            </span>
          ) : (
            <>
              <Check className="h-4 w-4 text-brand-600" />
              <span className="text-xs uppercase tracking-wider font-bold text-brand-600">
                {t.lessonCompleted} · {topic}
              </span>
            </>
          )}
        </div>

        {/* Stage message (rotates while generating) */}
        {!done && !error && (
          <div className="flex items-center gap-2 mb-6 min-h-[1.25rem]">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
            <span
              key={stage.index}
              className="text-sm text-zinc-600 animate-slide-up"
            >
              {stage.label}
            </span>
          </div>
        )}

        {/* Header: emoji + title + description */}
        <div className="flex items-start gap-4 mb-6 min-h-[80px]">
          <div className="text-5xl shrink-0 w-12 h-12 flex items-center justify-center">
            {partial?.emoji ? (
              <span className="animate-pop inline-block">{partial.emoji}</span>
            ) : (
              <span className="text-3xl text-zinc-300">✦</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 min-h-[2.5rem]">
              {partial?.title ?? (
                <span className="inline-block h-8 w-3/4 rounded bg-zinc-100 animate-pulse align-middle" />
              )}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 leading-relaxed min-h-[1.5rem]">
              {partial?.description ?? (
                <>
                  <span className="inline-block h-3 w-full rounded bg-zinc-100 animate-pulse" />
                  <span className="inline-block h-3 w-5/6 rounded bg-zinc-100 animate-pulse mt-1" />
                </>
              )}
            </p>
          </div>
        </div>

        {/* Lesson slots */}
        <div className="space-y-2">
          {Array.from({ length: depth }).map((_, i) => {
            const lesson = lessons[i];
            const ready = !!lesson?.title;
            const isLoading = ready && !lesson?.summary;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-2xl border-2 transition-all ${
                  ready ? "border-brand-100 bg-brand-50/30" : "border-zinc-100 bg-zinc-50/50"
                }`}
              >
                <span
                  className={`h-7 w-7 shrink-0 inline-flex items-center justify-center rounded-lg text-xs font-black ${
                    ready ? "bg-brand-500 text-white" : "bg-zinc-200 text-zinc-400"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {ready ? (
                    <div className="animate-slide-up">
                      <p className="font-bold text-sm text-zinc-900">{lesson.title}</p>
                      {lesson.summary && (
                        <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                          {lesson.summary}
                        </p>
                      )}
                      {isLoading && (
                        <span className="inline-block h-2 w-32 rounded bg-zinc-100 animate-pulse mt-1.5" />
                      )}
                    </div>
                  ) : (
                    <span className="inline-block h-3 w-1/2 rounded bg-zinc-100 animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!done && !error && (
          <p className="mt-5 text-[11px] uppercase tracking-wider text-zinc-400 text-center font-bold">
            Open-weights reasoning — typically 60s. Costs nothing to self-host.
          </p>
        )}
      </div>
    </div>
  );
}
