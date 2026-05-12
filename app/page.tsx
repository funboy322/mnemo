import Link from "next/link";
import { CreateTabs } from "@/components/create-tabs";
import { LandingGate } from "@/components/landing-gate";
import { Sparkles, BookOpen, Brain, Globe, Camera, Lock } from "lucide-react";
import { getServerT } from "@/lib/i18n";

export default async function Home() {
  const t = await getServerT();
  return (
    <LandingGate>
      <div className="flex flex-col flex-1">
        <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Link
              href="https://www.kaggle.com/competitions/gemma-4-good-hackathon"
              target="_blank"
              rel="noreferrer"
              className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-6 border border-brand-100 uppercase tracking-wider hover:bg-brand-100 transition-colors"
              style={{ animationDelay: "0ms" }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t.poweredByGemma}
            </Link>

            <h1
              className="reveal text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 leading-[1.02]"
              style={{ animationDelay: "80ms" }}
            >
              {t.heroLine1}
              <br />
              <span className="text-brand-500">{t.heroLine2}</span>
            </h1>

            <p
              className="reveal mt-5 text-lg sm:text-xl text-zinc-600 max-w-xl mx-auto leading-relaxed"
              style={{ animationDelay: "200ms" }}
            >
              {t.heroSub}
            </p>

            <div
              className="reveal mt-10 max-w-2xl mx-auto"
              style={{ animationDelay: "320ms" }}
            >
              <CreateTabs />
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-4">
              <Feature
                number="01"
                icon={<Brain className="h-5 w-5" />}
                title={t.featureStructuredTitle}
                body={t.featureStructuredBody}
                delayMs={0}
              />
              <Feature
                number="02"
                icon={<BookOpen className="h-5 w-5" />}
                title={t.featurePracticeTitle}
                body={t.featurePracticeBody}
                delayMs={100}
              />
              <Feature
                number="03"
                icon={<Sparkles className="h-5 w-5" />}
                title={t.featureStreakTitle}
                body={t.featureStreakBody}
                delayMs={200}
              />
            </div>
          </div>
        </section>

        {/* "Why this matters" — Education + Digital Equity narrative for Gemma 4 Good track */}
        <section className="px-4 sm:px-6 pb-20 mt-4 sm:mt-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="h-px w-12 bg-zinc-300" aria-hidden />
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">
                {t.whyMattersTitle}
              </p>
              <span className="h-px w-12 bg-zinc-300" aria-hidden />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <WhyCard
                icon={<Lock className="h-5 w-5" />}
                title={t.whyOpenTitle}
                body={t.whyOpenBody}
              />
              <WhyCard
                icon={<Camera className="h-5 w-5" />}
                title={t.whyAnyTopicTitle}
                body={t.whyAnyTopicBody}
              />
              <WhyCard
                icon={<Globe className="h-5 w-5" />}
                title={t.whyAnyLangTitle}
                body={t.whyAnyLangBody}
              />
            </div>

            <p className="mt-8 text-center text-xs text-zinc-400">
              Built for the{" "}
              <a
                href="https://www.kaggle.com/competitions/gemma-4-good-hackathon"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-zinc-600 hover:text-brand-600 transition-colors"
              >
                Gemma 4 Good Hackathon
              </a>
              {" · "}
              <a
                href="https://huggingface.co/google/gemma-4-26B-A4B-it"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-zinc-600 hover:text-brand-600 transition-colors"
              >
                Gemma 4 on Hugging Face
              </a>
            </p>
          </div>
        </section>
      </div>
    </LandingGate>
  );
}

function Feature({
  number,
  icon,
  title,
  body,
  delayMs,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  delayMs: number;
}) {
  return (
    <div
      className="reveal rounded-card bg-white border-2 border-zinc-200 p-6 relative overflow-hidden hover:border-brand-200 transition-colors"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <span
        className="absolute -top-3 -right-2 text-7xl font-black leading-none text-brand-100 select-none pointer-events-none"
        aria-hidden
      >
        {number}
      </span>
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 mb-4 border border-brand-100 relative z-10">
        {icon}
      </div>
      <h3 className="font-bold text-zinc-900 relative z-10">{title}</h3>
      <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed relative z-10">{body}</p>
    </div>
  );
}

function WhyCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-card bg-zinc-50 border border-zinc-200 p-6">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-700 border border-zinc-200 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-zinc-900 text-sm">{title}</h3>
      <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}
