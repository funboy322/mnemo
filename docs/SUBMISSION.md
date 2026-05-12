# Mnemo — submission for the Gemma 4 Good Hackathon

**Tracks:** Future of Education · Digital Equity & Inclusivity

> Type a topic or photograph a textbook page — Gemma 4 builds a structured Duolingo-style course about it. Open-weights, runs on a single GPU, works in 140+ languages.

---

## Links

- 🌐 **Live demo:** https://mnemo-git-main-ungspirits-projects.vercel.app
- 💻 **Public code:** https://github.com/funboy322/mnemo
- 🎬 **Video pitch:** _[Add Loom/YouTube link here after recording]_
- 🖼 **Cover image:** _[Auto-generated via /opengraph-image — 1200×630]_

---

## Impact & Vision

### The problem

Personalized AI learning today is gated behind expensive per-token APIs. A student in Mumbai or Lagos or Tashkent — confused about a chapter their teacher skipped, holding a textbook they can't fully read alone — cannot afford ChatGPT Plus. She's also unlikely to find a polished AI app in her language: most education tools optimize for English first, then the next four highest-revenue markets.

The result: AI tutoring becomes another barrier, layered on top of existing inequalities.

### The bet

**Gemma 4 changes the cost curve.** It's open-weights under Apache 2.0. The same engine that runs this app can be self-hosted on a single GPU in a school computer lab, in a community internet center, on a laptop a teacher carries home. No per-token meter. No vendor lock-in. No data leaves the building.

Mnemo is what that engine can do for learners when it's pointed at the gap.

### Three pillars

1. **Free, even at scale.** Self-hostable. The school owns its tutor.
2. **Photo → course.** A student photographs a textbook page or a confusing diagram. Gemma 4's vision reads it and builds a structured 5-lesson course grounded in exactly what's there. Critical for classrooms with paper books and no internet at home — kids photograph what they don't understand and learn it on a walk home with no signal.
3. **140+ languages.** Lessons generate natively in the learner's language. Russian, Turkish, Hindi, Swahili — Gemma 4 covers the long tail closed-source APIs neglect.

### Who this is for

- Students in under-resourced schools, especially with paper-only textbooks
- Teachers wanting to give students personalized practice material without an API budget
- Self-learners studying obscure topics that lack polished courses
- Adults reskilling in a second language where major AI apps don't yet support them well

---

## Technical Depth & Execution

### Architecture

Full Gemma 4 stack — every AI call in production goes to `gemma-4-26b-a4b-it` via Google AI Studio API.

- **Text course generation** (typing a topic): `generateText` + JSON extraction. Gemma 4 reasons through curriculum design (~1000 reasoning tokens visible in `thoughtsTokenCount`), emits the structured outline. Our `extractJson` pulls the fenced JSON block from Gemma's interleaved reasoning-and-answer output.
- **Photo → course (multimodal)**: same model, vision input. User uploads a JPEG/PNG/WebP up to 8 MB. Gemma 4's vision encoder identifies the subject, then the language model designs a course about it.
- **Lesson content** (when user opens a lesson): same pipeline. Generates 2-4 teaching blocks (mix of concept + worked example) and 4-6 exercises with 5 different types (multiple choice, fill blank, true/false, matching, order).

### Why open-weights matters here, not just philosophically

The most powerful Gemma 4 variant in production at this submission's URL is `gemma-4-26b-a4b-it` — Mixture-of-Experts, 26B total / 3.8B active. That's a model a single A100 or even consumer GPUs (with quantization) can serve. Cost-of-ownership for a school district to self-host this approaches zero compared to per-token API spend.

A worked example: generating one 5-lesson course on Mnemo via Gemma 4 uses ~1600 tokens total (≈983 reasoning + 523 output + 52 prompt). At Google AI Studio's free-tier limits, that's ~1500 courses/day from one key. Self-hosted with vLLM, no rate limit at all.

### Voice tuning

Gemma 4's default voice produces typical AI scaffolding ("comprehensive overview", "delve into", "intricate ecosystem"). We constrain it heavily — a `VOICE_RULES` block in every system prompt bans 60+ Tier-1 AI-isms (Conor Bronsdon's `avoid-ai-writing` skill provided the canonical list). Result: courses titled "How to Catch a Rainbow" or "White light is a lie" instead of "Introduction to Optics".

### Engineering notes for judges who run the code

- Single required env: `GOOGLE_GENERATIVE_AI_API_KEY`. Optional: Clerk auth keys, Turso DB for prod, Anthropic fallback.
- libSQL/Turso for storage (works on Vercel functions where filesystem is read-only). Local dev uses `file://` — same driver.
- i18n with full RU/EN/TR coverage, including server-rendered metadata per locale.
- Spaced repetition: `lib/repository.ts:getReviewExercises` pools exercises from lessons completed ≥ 1h ago and runs them as a daily review session. Bumps XP at 1.5x the lesson rate.
- Streaming SSE flow for text generation (`/api/courses/stream`) — falls back to single-shot when Gemma's reasoning-heavy output doesn't stream cleanly.

### Deliberate decisions we'd defend in code review

- **Why generateText + manual JSON extraction, not `responseMimeType: "application/json"`?** We tried. Gemma 4 26B-a4b-it's reasoning chain doesn't fit cleanly into a single JSON response when MIME-constrained — output gets truncated mid-reasoning. Giving it `maxOutputTokens: 16000` and parsing the fenced block from mixed output produces higher-quality course content per token.
- **Why Turso (libSQL) and not Postgres?** Same `sqliteTable` schema works locally with a file and in prod against Turso. Zero migration steps for judges who want to self-host. Schema bootstraps with `CREATE IF NOT EXISTS` on first request.
- **Why optional auth?** Equity. A learner without an email — a kid, someone in a country where account creation is hard — should be able to use the product. Localstorage guest mode is fully featured; Clerk auth is purely opt-in for cross-device progress sync.

---

## Video Pitch & Storytelling (script for recording)

**Target: 2–3 minutes, vertical or horizontal.**

### Beat 1 — 0:00–0:20 (problem)
> "Hi. I built Mnemo because a kid with a paper textbook can't afford ChatGPT. This is what Gemma 4 lets us do about it."
*[B-roll: hands on a paper textbook]*

### Beat 2 — 0:20–0:50 (text demo)
*[Screen: landing page, type "How rainbows form", hit Create]*
> "Type any topic, in any of 140 languages Gemma 4 supports. Gemma 4 reasons through the curriculum — five lessons appear with intriguing titles, not generic ones."
*[Show generated course "How to Catch a Rainbow"]*

### Beat 3 — 0:50–1:30 (KILLER FEATURE: photo demo)
*[Screen: switch to "From photo" tab, take photo of textbook page]*
> "This is the part you can't do with a closed API for free. Snap a photo of any textbook page, diagram, or object. Gemma 4 vision identifies what's there and builds a course about exactly that."
*[Show the course generated from the photo]*

### Beat 4 — 1:30–2:10 (lesson play)
*[Open lesson 1, scroll through concept blocks, do 2-3 exercises]*
> "Five exercise types, Duolingo-style retention loops — streaks, XP, spaced repetition. The full learning surface, not just chat."

### Beat 5 — 2:10–2:40 (impact)
> "Most importantly: Gemma 4 is open-weights, Apache 2.0. A school can self-host this entire app on a single GPU. No per-token cost. No data leaving the building. That's what makes this different from every other AI tutor on the market."

### Beat 6 — 2:40–3:00 (call to action)
> "Mnemo is live at mnemo.app, code is open at github.com/funboy322/mnemo, and Gemma 4 is what makes this possible. Thanks to Google DeepMind and Kaggle for shipping the model and the platform."

---

## Reproducibility for judges

```bash
git clone https://github.com/funboy322/mnemo
cd mnemo
npm install
cp .env.local.example .env.local
# Edit .env.local — set GOOGLE_GENERATIVE_AI_API_KEY
npm run dev
# Visit http://localhost:3000
```

Self-host on your own infrastructure:

```bash
# Replace Google AI with self-hosted Gemma 4 via vLLM
# (One env change, no code change)
AI_MODEL=http://your-vllm:8000/v1
```

---

## License

MIT (code), Apache 2.0 (Gemma 4 weights).

## Acknowledgments

- Google DeepMind for shipping Gemma 4 with multimodal vision and 140+ language support
- Kaggle for the platform and the Good Hackathon
- The Duolingo team for showing the world that learning can be a daily habit
- Conor Bronsdon's [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) skill — the voice-rules block in our system prompts is derived from his Tier-1 word list
