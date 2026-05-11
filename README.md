# Mnemo — Duolingo для всего

AI генерирует структурированный курс по любой теме: 5–12 уроков, 5 типов упражнений, streak, XP. Как Duolingo, но для маркетинга, философии, system design и чего угодно.

## Стек

- **Next.js 16** (App Router, Turbopack, Node 24)
- **AI SDK v6** + Vercel AI Gateway → Claude Sonnet 4.6
- **Tailwind CSS v4** + Onest
- **libSQL** (Turso) + Drizzle ORM — единый драйвер для dev (file://) и prod
- **Clerk** (опциональный auth, гость-режим по умолчанию)
- **Zod** для structured output

## Запуск локально

```bash
npm install
cp .env.local.example .env.local
# впиши AI_GATEWAY_API_KEY (или ANTHROPIC_API_KEY)
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000). Первый раз пройдёшь онбординг (3 шага), потом введи любую тему — увидишь как AI пишет курс в реальном времени.

## Структура

```
app/
  page.tsx                       — лендинг + онбординг wizard
  dashboard/                     — мои курсы + streak/XP + review card
  course/[id]/                   — Duolingo-style путь уроков
  course/[id]/lesson/[lessonId]/ — плеер урока
  review/                        — режим повторения (spaced repetition)
  api/courses/                   — POST: обычная генерация
  api/courses/stream/            — POST: streaming SSE
  api/courses/[id]/              — GET: курс + прогресс
  api/lessons/[id]/              — GET: ленивая генерация контента
  api/lessons/[id]/complete/     — POST: фиксация прохождения
  api/review/exercises/          — GET: пул упражнений для повторения
  api/review/complete/           — POST: XP за сессию повторения
  api/me/                        — GET: статистика + курсы + due-review
  api/migrate/                   — POST: миграция гость→Clerk
components/
  lesson/                        — плеер + 5 типов упражнений + confetti
  review/                        — review-плеер
  onboarding.tsx                 — 3-step wizard
  streaming-preview.tsx          — UI потоковой генерации
  ui/                            — button, input, progress-bar
lib/
  schemas.ts                     — Zod schemas для AI structured output
  ai.ts, ai-stream.ts            — обычная + streaming генерация
  db.ts, db-schema.ts            — libsql + Drizzle
  repository.ts                  — async DB-слой
  i18n.ts                        — 3 локали: en/ru/tr
docs/
  CONTEXT.md, adr/*.md           — архитектура и решения
```

## Типы упражнений

1. **Multiple choice** — 4 варианта, клавиатура `1`-`4`
2. **Fill blank** — ввести слово
3. **True/false** — клавиатура `1`/`T` или `2`/`F`
4. **Matching** — кликнуть слева → справа
5. **Order** — расставить по порядку

## Deploy на Vercel

### 1. Создать Turso DB (бесплатно, 5 минут)

```bash
# CLI способ
brew install tursodatabase/tap/turso   # macOS
turso auth signup                       # или login
turso db create mnemo
turso db show mnemo --url               # → TURSO_DATABASE_URL
turso db tokens create mnemo            # → TURSO_AUTH_TOKEN
```

Или через UI: https://turso.tech → Create database → Tokens.

### 2. Привязать проект к Vercel

```bash
npm i -g vercel
vercel link
```

### 3. Установить env vars в Vercel

```bash
vercel env add AI_GATEWAY_API_KEY production
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
# Опционально для login:
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
```

### 4. Деплой

```bash
vercel deploy --prod
```

После первого запроса в проде создастся схема (CREATE IF NOT EXISTS). Никаких миграций руками.

## Env vars

| Variable | Required | Зачем |
|---|---|---|
| `AI_GATEWAY_API_KEY` | да* | Vercel AI Gateway. https://vercel.com/dashboard/ai-gateway |
| `ANTHROPIC_API_KEY` | альтернатива | Прямой Anthropic, если нет Gateway |
| `AI_MODEL` | нет | Override модели. По умолчанию `anthropic/claude-sonnet-4-6` |
| `TURSO_DATABASE_URL` | prod | libsql URL. Без него — локальный file. |
| `TURSO_AUTH_TOKEN` | prod | Auth token для Turso |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | нет | Включает sign-in. Без него — гость-режим. |
| `CLERK_SECRET_KEY` | нет | Парный к публичному |

*Один из AI ключей обязателен.

## Скрипты

```bash
npm run dev         # dev сервер (Turbopack)
npm run build       # production build
npm start           # production server, авто-source .env.local
npm run lint        # ESLint
npm run seed:demo   # засеять демо-курс по стоицизму для u_demo
```
