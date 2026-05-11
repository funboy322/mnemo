"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useT, useLocale } from "./locale-provider";
import { useUserId } from "./user-provider";
import { ArrowLeft, ArrowRight, Heart, Briefcase, Sparkles, GraduationCap, Brain, Coffee, Flame, Mountain } from "lucide-react";
import { StreamingPreview } from "./streaming-preview";
import { useRouter } from "next/navigation";
import type { CourseOutline, Language } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 3;
const ONBOARDED_KEY = "mnemo.onboarded";

type Partial<T> = { [P in keyof T]?: T[P] };
type Why = "curious" | "work" | "growth" | "exam" | "fun";
type Goal = 1 | 3 | 5;

export function shouldShowOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDED_KEY) !== "1";
}

export function markOnboarded() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDED_KEY, "1");
}

export function Onboarding({ onSkip }: { onSkip: () => void }) {
  const router = useRouter();
  const userId = useUserId();
  const t = useT();
  const locale = useLocale();

  const [step, setStep] = React.useState(1);
  const [topic, setTopic] = React.useState("");
  const [why, setWhy] = React.useState<Why | null>(null);
  const [goal, setGoal] = React.useState<Goal>(1);

  // Streaming state for final step
  const [streaming, setStreaming] = React.useState(false);
  const [partial, setPartial] = React.useState<Partial<CourseOutline> | null>(null);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canContinue =
    (step === 1 && topic.trim().length >= 2) ||
    (step === 2 && why !== null) ||
    step === 3;

  const skipBtn = (
    <button
      type="button"
      onClick={() => {
        markOnboarded();
        onSkip();
      }}
      className="text-sm font-bold text-zinc-400 hover:text-zinc-700 transition-colors"
    >
      {t.onboardSkip}
    </button>
  );

  if (streaming) {
    return (
      <div className="px-4 sm:px-6 py-12 max-w-2xl mx-auto w-full">
        <StreamingPreview
          topic={topic}
          depth={5}
          partial={partial}
          done={done}
          error={error}
        />
      </div>
    );
  }

  async function startCourse() {
    if (!userId) return;
    setStreaming(true);
    markOnboarded();

    // Save the goal in localStorage so dashboard can show it later
    try {
      localStorage.setItem("mnemo.dailyGoal", String(goal));
      if (why) localStorage.setItem("mnemo.why", why);
    } catch {}

    try {
      const res = await fetch("/api/courses/stream", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          userId,
          input: {
            topic: topic.trim(),
            level: "beginner",
            depth: 5,
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
        setTimeout(() => router.push(`/course/${courseId}`), 900);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="px-4 sm:px-6 pt-6 pb-2 max-w-2xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i + 1 < step && "w-8 bg-brand-500",
                i + 1 === step && "w-12 bg-brand-500",
                i + 1 > step && "w-8 bg-zinc-200",
              )}
            />
          ))}
        </div>
        {skipBtn}
      </div>

      <div className="flex-1 px-4 sm:px-6 py-8 max-w-2xl mx-auto w-full">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand-600 mb-3">
          {t.onboardStep(step, TOTAL_STEPS)}
        </p>

        {step === 1 && (
          <div key="step-1" className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
              {t.onboardTopicTitle}
            </h1>
            <p className="mt-3 text-zinc-600 leading-relaxed">{t.onboardTopicSub}</p>

            <Input
              autoFocus
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.topicPlaceholder}
              className="mt-8 h-16 text-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter" && canContinue) setStep(2);
              }}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {[t.suggestion1, t.suggestion2, t.suggestion3, t.suggestion4, t.suggestion5, t.suggestion6].map((s) => (
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

        {step === 2 && (
          <div key="step-2" className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
              {t.onboardWhyTitle}
            </h1>
            <p className="mt-3 text-zinc-600 leading-relaxed">{t.onboardWhySub}</p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              <WhyCard
                value="curious"
                current={why}
                onClick={setWhy}
                icon={<Brain className="h-6 w-6" />}
                label={t.onboardWhyCurious}
              />
              <WhyCard
                value="work"
                current={why}
                onClick={setWhy}
                icon={<Briefcase className="h-6 w-6" />}
                label={t.onboardWhyWork}
              />
              <WhyCard
                value="growth"
                current={why}
                onClick={setWhy}
                icon={<Heart className="h-6 w-6" />}
                label={t.onboardWhyGrowth}
              />
              <WhyCard
                value="exam"
                current={why}
                onClick={setWhy}
                icon={<GraduationCap className="h-6 w-6" />}
                label={t.onboardWhyExam}
              />
              <WhyCard
                value="fun"
                current={why}
                onClick={setWhy}
                icon={<Coffee className="h-6 w-6" />}
                label={t.onboardWhyFun}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="step-3" className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
              {t.onboardGoalTitle}
            </h1>
            <p className="mt-3 text-zinc-600 leading-relaxed">{t.onboardGoalSub}</p>

            <div className="mt-8 space-y-3">
              <GoalCard
                value={1}
                current={goal}
                onClick={setGoal}
                icon={<Coffee className="h-6 w-6" />}
                title={t.onboardGoalCasual}
                desc={t.onboardGoalCasualDesc}
                minutes={t.onboardMinPerDay(5)}
              />
              <GoalCard
                value={3}
                current={goal}
                onClick={setGoal}
                icon={<Flame className="h-6 w-6" />}
                title={t.onboardGoalRegular}
                desc={t.onboardGoalRegularDesc}
                minutes={t.onboardMinPerDay(15)}
              />
              <GoalCard
                value={5}
                current={goal}
                onClick={setGoal}
                icon={<Mountain className="h-6 w-6" />}
                title={t.onboardGoalSerious}
                desc={t.onboardGoalSeriousDesc}
                minutes={t.onboardMinPerDay(25)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 bg-white/80 backdrop-blur sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {t.onboardBack}
            </button>
          ) : (
            <span />
          )}
          {step < TOTAL_STEPS ? (
            <Button
              size="lg"
              onClick={() => setStep(step + 1)}
              disabled={!canContinue}
              className="min-w-[160px]"
            >
              {t.onboardContinue}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="lg" onClick={startCourse} className="min-w-[200px]">
              <Sparkles className="h-4 w-4" /> {t.onboardStart}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function WhyCard({
  value,
  current,
  onClick,
  icon,
  label,
}: {
  value: Why;
  current: Why | null;
  onClick: (v: Why) => void;
  icon: React.ReactNode;
  label: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        "rounded-card border-2 p-5 flex items-center gap-3 text-left transition-all btn-3d",
        active
          ? "border-brand-500 bg-brand-50 text-brand-900"
          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
      )}
    >
      <span
        className={cn(
          "h-12 w-12 rounded-2xl inline-flex items-center justify-center shrink-0",
          active ? "bg-brand-500 text-white" : "bg-zinc-100 text-zinc-600",
        )}
      >
        {icon}
      </span>
      <span className="font-bold">{label}</span>
    </button>
  );
}

function GoalCard({
  value,
  current,
  onClick,
  icon,
  title,
  desc,
  minutes,
}: {
  value: Goal;
  current: Goal;
  onClick: (v: Goal) => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
  minutes: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        "w-full rounded-card border-2 p-5 flex items-center gap-4 text-left transition-all btn-3d",
        active
          ? "border-brand-500 bg-brand-50 text-brand-900"
          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
      )}
    >
      <span
        className={cn(
          "h-14 w-14 rounded-2xl inline-flex items-center justify-center shrink-0",
          active ? "bg-brand-500 text-white" : "bg-zinc-100 text-zinc-600",
        )}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-black text-lg">{title}</p>
        <p className={cn("text-sm mt-0.5", active ? "text-brand-700" : "text-zinc-600")}>{desc}</p>
      </div>
      <span
        className={cn(
          "text-xs font-bold uppercase tracking-wider shrink-0",
          active ? "text-brand-700" : "text-zinc-400",
        )}
      >
        {minutes}
      </span>
    </button>
  );
}
