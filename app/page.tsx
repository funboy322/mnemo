import { TopicForm } from "@/components/topic-form";
import { Sparkles, BookOpen, Brain } from "lucide-react";

const SUGGESTIONS = [
  "Маркетинг в эпоху ИИ",
  "Основы стоической философии",
  "Как работает blockchain",
  "Подготовка к собеседованию по System Design",
  "История Византии",
  "Основы продуктового менеджмента",
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <section className="px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-bold mb-6 border border-brand-100">
            <Sparkles className="h-4 w-4" />
            AI генерирует курс под тебя
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 leading-[1.05]">
            Учись чему угодно.<br />
            <span className="text-brand-500">Шаг за шагом.</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-zinc-600 max-w-xl mx-auto">
            Введи любую тему — получи структурированный курс с короткими уроками и упражнениями. Как Duolingo, только для всего на свете.
          </p>

          <div className="mt-10 max-w-2xl mx-auto">
            <TopicForm suggestions={SUGGESTIONS} />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          <Feature
            icon={<Brain className="h-6 w-6" />}
            title="Структурированный путь"
            body="AI разбивает любую тему на 5–12 уроков с прогрессией от простого к сложному."
          />
          <Feature
            icon={<BookOpen className="h-6 w-6" />}
            title="Активная практика"
            body="5 типов упражнений — выбор, заполнение, сопоставление, порядок шагов, true/false."
          />
          <Feature
            icon={<Sparkles className="h-6 w-6" />}
            title="Streak и XP"
            body="Дни подряд и очки опыта помогают вернуться завтра."
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
