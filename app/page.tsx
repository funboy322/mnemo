import { TopicForm } from "@/components/topic-form";
import { Sparkles, BookOpen, Brain } from "lucide-react";
import { getServerT } from "@/lib/i18n";

export default async function Home() {
  const t = await getServerT();
  return (
    <div className="flex flex-col flex-1">
      <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-6 border border-brand-100 uppercase tracking-wider"
            style={{ animationDelay: "0ms" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t.heroBadge}
          </div>

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

          <div className="reveal mt-10 max-w-2xl mx-auto" style={{ animationDelay: "320ms" }}>
            <TopicForm />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20">
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
