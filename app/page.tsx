import { TopicForm } from "@/components/topic-form";
import { Sparkles, BookOpen, Brain } from "lucide-react";
import { getServerT } from "@/lib/i18n";

export default async function Home() {
  const t = await getServerT();
  return (
    <div className="flex flex-col flex-1">
      <section className="px-4 sm:px-6 pt-16 sm:pt-24 pb-20 relative">
        {/* Decorative pull-quote mark in the corner — editorial mood */}
        <span
          aria-hidden
          className="display-serif absolute top-4 right-4 sm:top-10 sm:right-12 text-[8rem] sm:text-[14rem] leading-none text-brand-200/40 select-none pointer-events-none"
        >
          ”
        </span>

        <div className="max-w-3xl mx-auto relative">
          <div
            className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/8 text-brand-700 text-xs font-bold mb-8 border border-brand-200 uppercase tracking-[0.15em]"
            style={{ animationDelay: "0ms" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t.heroBadge}
          </div>

          <h1
            className="reveal display-serif text-[3.25rem] sm:text-[6rem] text-ink"
            style={{ animationDelay: "80ms", color: "var(--color-ink)" }}
          >
            {t.heroLine1.replace(/\.\s*$/, "")},
            <br />
            <span className="text-brand-600 not-italic font-serif" style={{ fontStyle: "italic" }}>
              {t.heroLine2}
            </span>
          </h1>

          <p
            className="reveal mt-6 text-lg sm:text-xl max-w-xl leading-relaxed"
            style={{ animationDelay: "200ms", color: "var(--color-ink-soft)" }}
          >
            {t.heroSub}
          </p>

          <div className="reveal mt-12 max-w-2xl" style={{ animationDelay: "320ms" }}>
            <TopicForm />
          </div>
        </div>
      </section>

      {/* Decorative rule between sections */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6" aria-hidden>
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
      </div>

      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.2em] font-bold mb-8 text-center"
            style={{ color: "var(--color-ink-soft)" }}
          >
            How it works
          </p>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
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
              delayMs={120}
            />
            <Feature
              number="03"
              icon={<Sparkles className="h-5 w-5" />}
              title={t.featureStreakTitle}
              body={t.featureStreakBody}
              delayMs={240}
            />
          </div>
        </div>
      </section>
    </div>
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
      className="reveal rounded-card bg-white border border-zinc-200/80 p-6 relative overflow-hidden"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <span
        className="display-serif absolute -top-2 -right-2 text-7xl leading-none select-none pointer-events-none"
        style={{ color: "rgba(18, 183, 106, 0.08)" }}
        aria-hidden
      >
        {number}
      </span>
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 mb-4 border border-brand-100">
        {icon}
      </div>
      <h3 className="font-bold text-base" style={{ color: "var(--color-ink)" }}>{title}</h3>
      <p
        className="text-sm mt-2 leading-relaxed"
        style={{ color: "var(--color-ink-soft)" }}
      >
        {body}
      </p>
    </div>
  );
}
