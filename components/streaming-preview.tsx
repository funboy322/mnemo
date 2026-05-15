"use client";
import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import type { CourseOutline } from "@/lib/schemas";
import { useT } from "./locale-provider";

type Partial<T> = { [P in keyof T]?: T[P] };

/**
 * StreamingPreview — Quiet direction.
 *
 * Shows the course outline streaming in lesson by lesson. The previous
 * version had a saturated white card with a Brain icon, brand-tinted
 * row backgrounds, and a "Powered by Gemma 4" badge. Quiet replaces
 * with a flat surface card, a single ink "drafting" line at the top, no
 * icons, ink-on-bone lesson rows, and a quiet footnote.
 *
 * Stages of generation cycle by elapsed time so the user sees movement
 * instead of a dead spinner.
 */
const STAGES: { atMs: number; key: keyof Stages }[] = [
  { atMs: 0, key: "reading" },
  { atMs: 6_000, key: "reasoning" },
  { atMs: 14_000, key: "drafting" },
  { atMs: 25_000, key: "polishing" },
  { atMs: 40_000, key: "finishing" },
];

type Stages = {
  reading: string;
  reasoning: string;
  drafting: string;
  polishing: string;
  finishing: string;
};

const STAGE_COPY_EN: Stages = {
  reading: "Reading your topic",
  reasoning: "Designing the curriculum",
  drafting: "Drafting lesson titles",
  polishing: "Polishing the wording",
  finishing: "Finalizing",
};

const STAGE_COPY_RU: Stages = {
  reading: "Разбираю тему",
  reasoning: "Проектирую учебный план",
  drafting: "Пишу названия уроков",
  polishing: "Шлифую формулировки",
  finishing: "Завершаю",
};

const STAGE_COPY_TR: Stages = {
  reading: "Konuyu okuyorum",
  reasoning: "Müfredatı tasarlıyorum",
  drafting: "Başlıkları yazıyorum",
  polishing: "İfadeleri rötuşluyorum",
  finishing: "Sonlandırıyorum",
};

const STAGE_COPY_ES: Stages = {
  reading: "Leyendo el tema",
  reasoning: "Diseñando el currículo",
  drafting: "Redactando títulos",
  polishing: "Puliendo el texto",
  finishing: "Finalizando",
};

const STAGE_COPY_HI: Stages = {
  reading: "विषय पढ़ रहा हूँ",
  reasoning: "पाठ्यक्रम डिज़ाइन कर रहा हूँ",
  drafting: "शीर्षक लिख रहा हूँ",
  polishing: "शब्दों को निखार रहा हूँ",
  finishing: "अंतिम रूप दे रहा हूँ",
};

const STAGE_COPY_AR: Stages = {
  reading: "أقرأ موضوعك",
  reasoning: "أصمم المنهج",
  drafting: "أكتب العناوين",
  polishing: "أصقل الصياغة",
  finishing: "أُنهي",
};

function getStageCopy(locale: string): Stages {
  switch (locale) {
    case "ru":
      return STAGE_COPY_RU;
    case "tr":
      return STAGE_COPY_TR;
    case "es":
      return STAGE_COPY_ES;
    case "hi":
      return STAGE_COPY_HI;
    case "ar":
      return STAGE_COPY_AR;
    default:
      return STAGE_COPY_EN;
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
      <div className="card-quiet p-6 sm:p-8 relative overflow-hidden">
        {/* Status line */}
        <div className="eyebrow flex items-center gap-2">
          {!done && !error ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{stage.label}</span>
            </>
          ) : error ? (
            <span className="text-ink-soft normal-case tracking-normal">{error}</span>
          ) : (
            <>
              <Check className="h-3 w-3 text-green" strokeWidth={3} />
              <span className="text-green">ready · {topic}</span>
            </>
          )}
        </div>

        {/* Header: emoji + title + description */}
        <div className="flex items-start gap-4 mt-5 sm:mt-6 min-h-[68px]">
          <div className="text-[40px] sm:text-[48px] shrink-0 leading-none">
            {partial?.emoji ? (
              <span className="animate-pop inline-block">{partial.emoji}</span>
            ) : (
              <span className="text-ink-muted">·</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-medium text-[22px] sm:text-[28px] leading-[1.1] tracking-[-0.02em] text-ink min-h-[1.5em]">
              {partial?.title ?? (
                <span className="inline-block h-7 w-3/4 rounded bg-rule animate-pulse align-middle" />
              )}
            </h2>
            <p className="text-[13.5px] sm:text-[14.5px] text-ink-soft mt-2 leading-relaxed">
              {partial?.description ?? (
                <>
                  <span className="inline-block h-3 w-full rounded bg-rule animate-pulse" />
                  <span className="inline-block h-3 w-5/6 rounded bg-rule animate-pulse mt-1" />
                </>
              )}
            </p>
          </div>
        </div>

        {/* Lesson rows — flat ink number + title */}
        <div className="mt-6 sm:mt-7 space-y-2">
          {Array.from({ length: depth }).map((_, i) => {
            const lesson = lessons[i];
            const ready = !!lesson?.title;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 py-2.5 border-b border-rule last:border-b-0 transition-colors ${
                  ready ? "" : "opacity-50"
                }`}
              >
                <span
                  className={`font-mono text-[11px] font-medium pt-1 shrink-0 w-5 ${
                    ready ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  {ready ? (
                    <div className="animate-slide-up">
                      <p className="font-display font-medium text-[14.5px] text-ink leading-tight">
                        {lesson.title}
                      </p>
                      {lesson.summary && (
                        <p className="text-[12.5px] text-ink-soft mt-1 leading-[1.45]">
                          {lesson.summary}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="inline-block h-3 w-1/2 rounded bg-rule animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!done && !error && (
          <p className="mt-6 font-mono text-[10.5px] tracking-[0.16em] text-ink-muted text-center uppercase">
            open weights · self-hostable · {t.poweredByGemma}
          </p>
        )}
      </div>
    </div>
  );
}
