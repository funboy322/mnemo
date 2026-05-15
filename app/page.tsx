import Link from "next/link";
import { LandingGate } from "@/components/landing-gate";
import { CreateCourse } from "@/components/create-course";
import { getServerT } from "@/lib/i18n";

/**
 * Landing — Quiet direction.
 *
 * The whole page is a single centered "what do you want to learn"
 * composition. Returning users see the same create-course screen as
 * onboarding — Quiet collapses landing and step-1-onboarding into the
 * same surface, because they're the same job: pick a topic, start.
 *
 * Below the fold: a small "Why this matters" rail with three quiet
 * cards for the hackathon-track narrative. No big feature grid, no
 * shadow boxes, no rotating gradient blobs.
 */
export default async function Home() {
  const t = await getServerT();
  return (
    <LandingGate>
      <div className="flex flex-col flex-1">
        <CreateCourse mode="landing" />

        <section className="px-4 sm:px-6 pb-20 pt-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="h-px w-10 bg-rule" aria-hidden />
              <p className="eyebrow-tight">{t.whyMattersTitle}</p>
              <span className="h-px w-10 bg-rule" aria-hidden />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
              <WhyCard title={t.whyOpenTitle} body={t.whyOpenBody} />
              <WhyCard title={t.whyAnyTopicTitle} body={t.whyAnyTopicBody} />
              <WhyCard title={t.whyAnyLangTitle} body={t.whyAnyLangBody} />
            </div>

            <p className="mt-10 text-center text-[12px] text-ink-muted font-mono tracking-[0.06em]">
              Built for the{" "}
              <Link
                href="https://www.kaggle.com/competitions/gemma-4-good-hackathon"
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft hover:text-ink transition-colors"
              >
                Gemma 4 Good Hackathon
              </Link>
              {" · "}
              <Link
                href="https://huggingface.co/google/gemma-4-26B-A4B-it"
                target="_blank"
                rel="noreferrer"
                className="text-ink-soft hover:text-ink transition-colors"
              >
                Gemma 4 on Hugging Face
              </Link>
            </p>
          </div>
        </section>
      </div>
    </LandingGate>
  );
}

function WhyCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-quiet p-5 sm:p-6">
      <h3 className="font-display font-medium text-[16px] text-ink leading-tight">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-[1.55] text-ink-soft">{body}</p>
    </div>
  );
}
