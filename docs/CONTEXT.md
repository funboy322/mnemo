# Mnemo — Domain Context

> Read this first. The vocabulary in this document is the project vocabulary —
> use these words in code, commits, and discussions.

## What we're building

A personal learning app that turns **any topic** into a structured **course** of bite-sized **lessons** with active **exercises**, in the spirit of Duolingo. The differentiator vs ChatGPT-wrapped explainers is **active recall** — we test understanding through varied exercise formats, not just text generation.

## Core domain entities

### Course
A guided learning path generated for a single user-supplied **topic** at a chosen **level** (`beginner` / `intermediate` / `advanced`) and **depth** (5, 8, or 12 lessons).

Owns:
- A title, description, and a single representative emoji
- An ordered list of `Lessons`
- The original `topic` string and `language` (only `ru` and `en` for now)

A Course is owned by a **user** (currently identified by a localStorage UUID, no auth).

### Lesson
A single bite-sized teaching unit, position-indexed within a Course (0-based).

Two phases of lifecycle:
1. **Outlined** — title, summary, and 2–4 objectives are present. No content yet.
2. **Generated** — `content` (a `LessonContent`) has been filled by AI on demand.

Outlines are created when the Course is created (cheap — one AI call). Content is generated **lazily** on first lesson open (one AI call per lesson, cached forever after).

### LessonContent
The actual material the learner sees inside a lesson. Has two parts:
- **Blocks** (`ContentBlock[]`) — 2–4 teaching blocks. Two kinds: `concept` (explanation) and `example` (worked example).
- **Exercises** (`Exercise[]`) — 4–6 active-recall exercises, mixed types.

### Exercise
A single check-for-understanding interaction. Five types as discriminated union:

| Type | Shape | UX |
|---|---|---|
| `multiple_choice` | question + 4 options + `correctIndex` + explanation | Tap one option, check |
| `fill_blank` | sentence with `___` + answer + alternatives + hint? + explanation | Type missing word/phrase |
| `true_false` | statement + `isTrue` + explanation | Tap True/False |
| `matching` | prompt + 3–5 `{left, right}` pairs | Click left, click right to pair |
| `order` | prompt + items in CORRECT order + explanation | Pick items in order from a pool |

### Progress
A single `(user, lesson)` completion record. Stores score (correct count), totalExercises, xpEarned, and timestamp. Multiple records per lesson allowed (replays).

### UserStats
Aggregate per-user state: totalXp, currentStreak, longestStreak, lastActivityDate. Updated on every completion via `bumpUserStats`.

## Vocabulary rules

Use these words consistently. Don't introduce synonyms.

- **Course** (not "track", "path", "series")
- **Lesson** (not "module", "unit", "chapter")
- **Exercise** (not "question", "task", "quiz")
- **Outline** (the lesson skeleton: title + summary + objectives)
- **Content** (the generated body: blocks + exercises)
- **Block** specifically refers to a `ContentBlock` (concept or example).
- **Streak** is the consecutive-days counter. **Daily goal** is "complete ≥1 lesson today" — these are related but distinct.
- **XP** is earned per lesson; never spent. There's no economy.

## Generation flow

```
Topic input → POST /api/courses
  → generateCourseOutline (one AI call, ~3-10s)
  → DB: courses + lessons (outlined, no content)
  → return courseId

User opens lesson → GET /api/lessons/[id]
  if content exists → return immediately
  else → generateLessonContent (one AI call, ~5-15s)
       → DB: update lesson with content
       → return content

User finishes lesson → POST /api/lessons/[id]/complete
  → DB: insert progress + bumpUserStats
  → return xpEarned
```

## Storage decisions

- **Local dev**: SQLite via better-sqlite3 (sync, file in `.data/app.db`)
- **Production**: see `docs/adr/0002-storage.md`. Current code does NOT work on Vercel without driver swap.

## What this project deliberately is NOT

- **Not a language-learning app.** Despite Duolingo inspiration, this is for any subject. Exercise types are pedagogical primitives, not language-specific.
- **Not a knowledge graph.** Lessons are linear; we don't build relationships between concepts across courses.
- **Not collaborative.** No multi-user, no sharing, no social. Localstorage user only.
- **Not adaptive (yet).** Difficulty doesn't change based on performance. Wrong answers cost a heart but don't repeat the question.
- **Not an LMS.** No assignments, deadlines, instructors, certificates.
