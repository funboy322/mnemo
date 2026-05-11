# Mnemo — Duolingo для всего

AI генерирует структурированный курс по любой теме: 5–12 уроков, 5 типов упражнений, streak, XP. В духе Duolingo, но для маркетинга, философии, system design — чего угодно.

## Стек

- **Next.js 16** (App Router, Turbopack, Node 24)
- **AI SDK v6** + Vercel AI Gateway → Claude Sonnet 4.6
- **Tailwind CSS v4**
- **SQLite** + Drizzle ORM (локально; в проде нужен Postgres/libsql — см. `docs/adr/0002-storage.md`)
- **Zod** для structured output

## Запуск локально

```bash
npm install
cp .env.local.example .env.local
# впиши AI_GATEWAY_API_KEY (или ANTHROPIC_API_KEY)
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000), введи любую тему — получишь курс через 10–30 секунд.

## Структура

```
app/
  page.tsx                       — лендинг с topic-формой
  dashboard/                     — мои курсы + streak/XP
  course/[id]/                   — duolingo-style путь уроков
  course/[id]/lesson/[lessonId]/ — плеер урока
  api/courses/                   — POST: генерация курса
  api/courses/[id]/              — GET: курс + прогресс
  api/lessons/[id]/              — GET: ленивая генерация контента урока
  api/lessons/[id]/complete/     — POST: запись прохождения + XP
  api/me/                        — GET: статистика и список курсов
components/
  lesson/                        — плеер + 5 типов упражнений
  ui/                            — button, input, progress-bar
lib/
  schemas.ts                     — Zod schemas для AI structured output
  ai.ts                          — генерация курса и уроков
  db.ts, db-schema.ts            — SQLite + Drizzle
  repository.ts                  — DB-слой
docs/
  adr/                           — архитектурные решения
  CONTEXT.md                     — доменная модель
```

## Типы упражнений

1. **Multiple choice** — 4 варианта, 1 правильный
2. **Fill blank** — заполнить пропуск (с alternative answers)
3. **True/false** — правда или нет
4. **Matching** — сопоставить пары (click-to-pair)
5. **Order** — расставить по порядку (pick-and-arrange)

## Deploy на Vercel

```bash
# 1. Установи Vercel CLI (если нет)
npm i -g vercel

# 2. Залогинься и привяжи проект
vercel link

# 3. Добавь AI Gateway ключ
vercel env add AI_GATEWAY_API_KEY

# 4. Подключи Postgres из Marketplace (Neon / Supabase) ИЛИ Turso (libsql)
#    Marketplace: https://vercel.com/marketplace/category/storage
#    После подключения env-переменные пробросятся автоматически
vercel env pull .env.local

# 5. Деплой
vercel deploy --prod
```

⚠️ **SQLite не работает в проде:** filesystem на Vercel Functions read-only. Нужен один из:
- **Neon Postgres** (Vercel Marketplace) — нужно переписать `lib/db.ts` на `drizzle-orm/neon-http` + поменять `sqliteTable` на `pgTable` в `db-schema.ts`
- **Turso (libsql)** — proще: тот же `sqliteTable`, меняется только драйвер. Установить `@libsql/client`, в `db.ts` использовать `drizzle-orm/libsql`. Все repository-функции придётся сделать `async`.
- **Vercel Blob** — для прототипа можно хранить JSON в Blob (но плохо масштабируется)

См. `docs/adr/0002-storage.md` для деталей.

## Env vars

| Variable | Required | Описание |
|---|---|---|
| `AI_GATEWAY_API_KEY` | да* | Vercel AI Gateway ключ. Получить: https://vercel.com/dashboard/ai-gateway |
| `ANTHROPIC_API_KEY` | альтернатива | Прямой Anthropic ключ (fallback если нет AI Gateway) |
| `AI_MODEL` | нет | Override модели. По умолчанию `anthropic/claude-sonnet-4-6` |

*Один из двух ключей обязателен.

## Скрипты

```bash
npm run dev    # dev сервер (Turbopack)
npm run build  # production build
npm start      # запустить production билд
npm run lint   # ESLint
```
