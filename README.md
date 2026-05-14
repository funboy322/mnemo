# Mnemo

> AI-personalized courses for any topic — text or photo. Built on Gemma 4 (Apache 2.0).
>
> Submission for the [Gemma 4 Good Hackathon](https://www.kaggle.com/competitions/gemma-4-good-hackathon) ·
> tracks: **Future of Education** + **Digital Equity & Inclusivity**.

Type a topic — or **photograph a textbook page, diagram, or object** — and Gemma 4 generates a structured 5–12 lesson course with 5 types of active-recall exercises, streaks, XP, and spaced-repetition review. Like Duolingo, but for anything, in any language.

## Why this matters (the hackathon pitch)

Personalized AI learning today is gated behind expensive per-token APIs. A student in Mumbai or Lagos or Tashkent who needs help understanding the chapter their teacher skipped can't afford ChatGPT Plus.

**Mnemo + Gemma 4 changes the cost curve.** Gemma 4 is open-weights under Apache 2.0 — the same engine that powers this app can run on a single GPU in a school, in a community center, or offline on a laptop. No per-token fee. No vendor lock-in. No data leaves the device.

Three pillars:

1. **Free even at scale.** Gemma 4 self-hosts. Schools without API budgets can deploy the same backend that powers the demo.
2. **Any topic, any photo.** Text input *or* multimodal: snap a textbook page, a diagram, a piece of code, an object. Gemma 4's vision generates a course grounded in what's there. Killer feature for under-resourced classrooms with paper textbooks and no internet at home.
3. **140+ languages.** Lessons generate natively in the learner's language — Russian, Turkish, Hindi, Swahili, the languages other learning apps underserve. UI in 6 (en/ru/tr/es/hi/ar with RTL); content in 140+.

## Stack

- **Next.js 16** (App Router, Turbopack, Node 24)
- **AI SDK v6** → **Gemma 4 26B-a4b-it** (multimodal vision, photo→course) + **Gemini 2.5 Flash** (fast text routing)
- **Tailwind CSS v4** + Onest type
- **libSQL** (Turso for prod, file:// for dev) + Drizzle ORM
- **Clerk** (optional auth, guest mode by default)
- **Zod** for structured output

One API key powers everything: Google AI Studio gives free access to both Gemma 4 (open-weights, the multimodal differentiator) and Gemini Flash (closed, the speed lane). Same provider, complementary roles.

## Quickstart

```bash
npm install
cp .env.local.example .env.local
# Required: GOOGLE_GENERATIVE_AI_API_KEY (free at https://aistudio.google.com/apikey)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). First-time onboarding (3 steps), then type a topic or upload a photo. Courses stream live as the model writes.

## The photo → course feature

Tap **From photo** on the landing. Upload a JPEG/PNG/WebP (up to 8 MB). Gemma 4 26B-a4b-it analyzes the image and generates a 5-lesson course built around its specific subject.

Examples we've tested:
- 📷 Textbook page on photosynthesis → 5-lesson course on the Calvin cycle, with specific exercise on light-dependent reactions
- 📷 Wiring diagram of a 555 timer → course on monostable vs astable modes, with order-the-circuit-steps exercise
- 📷 Photo of a chess endgame → course on opposition, zugzwang, key squares

The exercises generated are SPECIFIC to the image — not generic "introduction to electronics."

## Tech architecture

```
app/
  page.tsx                       — landing + onboarding gate
  dashboard/                     — courses + streak/XP + review-due card
  course/[id]/                   — Duolingo-style path
  course/[id]/lesson/[lessonId]/ — lesson player + 5 exercise types
  review/                        — spaced repetition session
  api/courses/                   — POST text generation
  api/courses/stream/            — POST SSE streaming text gen
  api/courses/from-image/        — POST Gemma 4 vision → course
  api/lessons/[id]/              — GET lazy lesson content generation
  api/lessons/[id]/complete/     — POST progress
  api/review/exercises/          — GET review pool
  api/review/complete/           — POST review XP
  api/me/                        — GET stats + courses + review-due
  api/migrate/                   — POST guest → Clerk migration
components/
  lesson/                        — player + 5 exercise types + confetti
  review/                        — review player
  photo-upload.tsx               — drag-drop + Gemma submission
  streaming-preview.tsx          — live SSE preview
  onboarding.tsx                 — 3-step wizard
  create-tabs.tsx                — Topic | Photo switch on landing
lib/
  schemas.ts                     — Zod for AI structured output
  ai.ts, ai-stream.ts            — text generation (Gemini Flash default, Gemma 4 opt-in)
  ai-vision.ts                   — Gemma 4 vision pipeline
  db.ts, db-schema.ts            — libsql + Drizzle (works on file:// or libsql://)
  repository.ts                  — async DB layer
  i18n.ts                        — 6 locales (en/ru/tr/es/hi/ar — Arabic is RTL)
```

## Exercise types

1. **Multiple choice** — 4 plausible options, keyboard `1`-`4`
2. **Fill blank** — 1 input, alternatives accepted
3. **True/false** — keyboard `1`/`T` or `2`/`F`
4. **Matching** — click left → click right to pair
5. **Order** — arrange items in correct sequence

## Deploy on Vercel

```bash
# 1. Sign up at https://turso.tech (free)
turso db create mnemo
turso db show mnemo --url       # → TURSO_DATABASE_URL
turso db tokens create mnemo    # → TURSO_AUTH_TOKEN

# 2. Get Google AI Studio key (free)
# https://aistudio.google.com/apikey

# 3. Deploy
npm i -g vercel
vercel link
vercel env add GOOGLE_GENERATIVE_AI_API_KEY production
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
vercel deploy --prod
```

Schema bootstraps automatically on first request — no manual migrations.

## Env vars

| Variable | Required | Purpose |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | yes | Google AI Studio — powers both Gemma 4 vision and Gemini Flash text |
| `AI_MODEL` | no | Override text model (default `gemini-2.5-flash`; set to `gemma-4-26b-a4b-it` to run text through Gemma too) |
| `AI_VISION_MODEL` | no | Override vision model (default `gemma-4-26b-a4b-it`) |
| `ANTHROPIC_API_KEY` | fallback | Used only if no Google key is set |
| `TURSO_DATABASE_URL` | prod | libsql connection string |
| `TURSO_AUTH_TOKEN` | prod | Turso auth |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | no | Enables sign-in. Guest mode without it. |
| `CLERK_SECRET_KEY` | no | Pair with above |

## Why Gemma 4 for vision + Gemini Flash for text?

Honest engineering note. We picked each model where it earns its keep:

- **Photo → course** uses **Gemma 4 26B-a4b-it** via Google AI Studio. This is the open-weights multimodal differentiator: a free, self-hostable model that reads a textbook page or a diagram and grounds a course in what's actually there. No closed API matches this combination of open weights + multimodal at zero cost.
- **Topic → course** (typing a topic) uses **Gemini 2.5 Flash**. Gemma 4's reasoning trace is exactly what makes it great for image understanding, but it adds 60–120s of think-time per text course — too slow for the "type → seconds → study" UX. Gemini Flash returns the same Zod-validated course in ~10s.

Both models live behind the same `GOOGLE_GENERATIVE_AI_API_KEY`. Set `AI_MODEL=gemma-4-26b-a4b-it` to route text through Gemma too — the code path is identical, just slower.

## Scripts

```bash
npm run dev         # dev (Turbopack)
npm run build       # production build
npm start           # production (auto-sources .env.local)
npm run lint        # ESLint
npm run seed:demo   # seed a hand-crafted demo course (no AI key needed)
```

## License

MIT.

## Acknowledgments

- Google DeepMind & Kaggle for the [Gemma 4 Good Hackathon](https://www.kaggle.com/competitions/gemma-4-good-hackathon)
- Anthropic, Google, Vercel for AI infrastructure
- The Duolingo team for showing the world that learning can be a habit
