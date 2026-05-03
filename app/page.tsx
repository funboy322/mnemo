import { TopicForm } from "@/components/topic-form";
import { Sparkles, BookOpen, Brain } from "lucide-react";
import { getServerT } from "@/lib/i18n";

export default async function Home() {
  const t = await getServerT();
  return (
    <div className="flex flex-col flex-1">
      <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-bold mb-6 border border-brand-100">
            <Sparkles className="h-4 w-4" />
            {t.heroBadge}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 leading-[1.05]">
            {t.heroLine1}
            <br />
            <span className="text-brand-500">{t.heroLine2}</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-zinc-600 max-w-xl mx-auto">{t.heroSub}</p>

          <div className="mt-10 max-w-2xl mx-auto">
            <TopicForm />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          <Feature
            icon={<Brain className="h-6 w-6" />}
            title={t.featureStructuredTitle}
            body={t.featureStructuredBody}
          />
          <Feature
            icon={<BookOpen className="h-6 w-6" />}
            title={t.featurePracticeTitle}
            body={t.featurePracticeBody}
          />
          <Feature
            icon={<Sparkles className="h-6 w-6" />}
            title={t.featureStreakTitle}
            body={t.featureStreakBody}
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-card bg-white border-2 border-zinc-200 p-6">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}
