"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useT, useLocale } from "./locale-provider";
import { useUserId } from "./user-provider";
import { StreamingPreview } from "./streaming-preview";
import { EmText } from "./em-text";
import { PhotoUpload } from "./photo-upload";
import { prefetchFirstLesson } from "@/lib/prefetch";
import type { CourseOutline, Language } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Partial<T> = { [P in keyof T]?: T[P] };
type Level = "beginner" | "intermediate" | "advanced";
type Depth = 5 | 8 | 12;
type InputMode = "topic" | "photo";

/**
 * CreateCourse — the canonical "what do you want to learn" composition.
 *
 * Used by both the Landing (returning users) and the Onboarding (new
 * users — wrapped in <Onboarding>). Quiet collapses landing-step-1 and
 * onboarding-step-1 into the same surface, because they're the same job.
 *
 * The signature italic moment is the H1. The photo path is reachable via
 * a small text link below the CTA — quiet, not a big tab switch.
 */
export function CreateCourse({ mode }: { mode: "landing" | "onboarding" }) {
  const router = useRouter();
  const userId = useUserId();
  const t = useT();
  const locale = useLocale();

  const [inputMode, setInputMode] = React.useState<InputMode>("topic");
  const [topic, setTopic] = React.useState("");
  const [level, setLevel] = React.useState<Level>("beginner");
  const [depth, setDepth] = React.useState<Depth>(8);

  const [streaming, setStreaming] = React.useState(false);
  const [partial, setPartial] = React.useState<Partial<CourseOutline> | null>(null);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (streaming) {
    return (
      <main className="px-4 sm:px-6 py-12 max-w-2xl mx-auto w-full">
        <StreamingPreview topic={topic} depth={depth} partial={partial} done={done} error={error} />
      </main>
    );
  }

  async function startCourse() {
    if (!userId || topic.trim().length < 2) return;
    setStreaming(true);

    try {
      const res = await fetch("/api/courses/stream", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          input: {
            topic: topic.trim(),
            level,
            depth,
            language: locale as Language,
          },
        }),
      });
      if (!res.ok || !res.body) throw new Error(t.errorGenerationFailed);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let courseId: string | null = null;

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 2);
          if (!line.startsWith("data:")) continue;
          const json = JSON.parse(line.slice(5).trim()) as {
            partial?: Partial<CourseOutline>;
            done?: boolean;
            courseId?: string;
            error?: string;
          };
          if (json.error) throw new Error(json.error);
          if (json.partial) setPartial(json.partial);
          if (json.done && json.courseId) {
            courseId = json.courseId;
            setDone(true);
          }
        }
      }

      if (courseId) {
        prefetchFirstLesson(courseId);
        setTimeout(() => router.push(`/course/${courseId}`), 900);
      }
    } catch (err) {
      setError((err as Error).message);
      setStreaming(false);
    }
  }

  const canSubmit = topic.trim().length >= 2;
  const eyebrowText = mode === "onboarding" ? t.onboardStep(1, 1) : t.poweredByGemma;

  if (inputMode === "photo") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-[560px]">
          <div className="eyebrow text-center mb-3">{eyebrowText}</div>
          <h1 className="text-center font-display font-medium text-[32px] sm:text-[48px] leading-[1.05] tracking-[-0.03em] text-ink">
            <EmText>{t.onboardTopicTitle}</EmText>
          </h1>
          <p className="mt-4 text-center text-[15px] sm:text-[16px] leading-[1.5] text-ink-soft max-w-[420px] mx-auto">
            {t.onboardTopicSub}
          </p>
          <div className="mt-8">
            <PhotoUpload />
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setInputMode("topic")}
              className="text-[13px] text-ink-muted hover:text-ink-soft transition-colors underline underline-offset-4 decoration-rule hover:decoration-ink-soft"
            >
              ← {t.fromTopicBack ?? "back to typing a topic"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-[720px] text-center">
        <div className="eyebrow">{eyebrowText}</div>

        <h1 className="mt-3 font-display font-medium text-[40px] sm:text-[64px] leading-[1.05] tracking-[-0.035em] text-ink">
          <EmText>{t.onboardTopicTitle}</EmText>
        </h1>

        <p className="mt-5 mx-auto max-w-[480px] text-[16px] sm:text-[18px] leading-[1.5] text-ink-soft">
          {t.onboardTopicSub}
        </p>

        <div className="mt-10 max-w-[580px] mx-auto">
          <input
            autoFocus={mode === "onboarding"}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t.topicPlaceholder}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) startCourse();
            }}
            className="w-full bg-surface border border-rule rounded-[16px] px-[20px] sm:px-[26px] py-[18px] sm:py-[20px] font-display font-normal text-[18px] sm:text-[22px] text-ink placeholder:text-ink-muted text-center focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5 justify-center max-w-[600px] mx-auto">
          {[t.suggestion1, t.suggestion2, t.suggestion3, t.suggestion4, t.suggestion5, t.suggestion6].map(
            (s) => {
              const isActive = topic === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTopic(s)}
                  className={cn(
                    "px-3.5 py-[7px] rounded-full text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-ink text-surface border border-ink"
                      : "bg-transparent text-ink-soft border border-rule hover:border-ink",
                  )}
                >
                  {s}
                </button>
              );
            },
          )}
        </div>

        <div className="mt-9 inline-flex items-stretch gap-1 p-1 bg-surface border border-rule rounded-[14px]">
          <SettingGroup
            label={t.levelLabel}
            options={[
              { value: "beginner", label: t.levelBeginner },
              { value: "intermediate", label: t.levelIntermediate },
              { value: "advanced", label: t.levelAdvanced },
            ]}
            value={level}
            onChange={(v) => setLevel(v as Level)}
          />
          <div className="w-px bg-rule" />
          <SettingGroup
            label={t.depthLabel}
            options={[
              { value: "5", label: "5" },
              { value: "8", label: "8" },
              { value: "12", label: "12" },
            ]}
            value={String(depth)}
            onChange={(v) => setDepth(Number(v) as Depth)}
            mono
          />
        </div>

        <div className="mt-9">
          <button type="button" onClick={startCourse} disabled={!canSubmit} className="btn-primary">
            {t.onboardStart} →
          </button>
          <div className="mt-3.5 font-mono text-[11px] tracking-[0.06em] text-ink-muted">
            free · open weights · ready in ~30s
          </div>
        </div>

        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={() => setInputMode("photo")}
            className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink-soft transition-colors underline underline-offset-4 decoration-rule hover:decoration-ink-soft"
          >
            {t.orPhotograph ?? "or photograph a page →"}
          </button>
        </div>
      </div>
    </main>
  );
}

function SettingGroup({
  label,
  options,
  value,
  onChange,
  mono,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div className="px-2 py-1.5">
      <div className="font-mono text-[9.5px] font-medium tracking-[0.18em] uppercase text-ink-muted mb-1 text-left">
        {label}
      </div>
      <div className="flex gap-0.5">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                "px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors",
                mono ? "font-mono" : "font-display",
                active ? "bg-ink text-surface" : "bg-transparent text-ink-soft hover:text-ink",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
