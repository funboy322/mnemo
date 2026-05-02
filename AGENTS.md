<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project context

Read **`docs/CONTEXT.md`** first — it has the domain vocabulary (Course / Lesson / Exercise / Block / Outline / Content) and tells you what this project is and isn't.

Architectural decisions live in `docs/adr/`:
- `0001-tech-stack.md` — Next.js 16, AI SDK v6, Tailwind v4, Drizzle, etc.
- `0002-storage.md` — SQLite for dev, prod swap plan
- `0003-ai-structured-output.md` — why `generateObject` + Zod over free-form prompts

## Agent skills

This repo's issue tracker is **none yet** (single-developer prototype).
Triage label vocabulary is **none yet**.
Domain docs live at `docs/`.

When using the matt-pocock skill set, treat issues as **TODOs in code** or **GitHub Issues** if/when set up.

## Coding rules

- Use the project vocabulary (see `CONTEXT.md`) — don't invent synonyms.
- All AI generation goes through `lib/ai.ts` and uses Zod schemas from `lib/schemas.ts`.
- All DB access goes through `lib/repository.ts`. Don't hit `db` directly from routes/components.
- Russian UI strings stay in Russian. English code comments stay in English.
- Don't add new npm dependencies without strong justification (current bundle is intentionally small).
- Keep `components/lesson/exercise-*.tsx` files isomorphic in shape — same prop signature `{ exercise, answered, onAnswer }`. New exercise types follow the same pattern.

## Resource discipline

This project runs on a 16GB MacBook. Don't:
- Start `npm run dev` in the background without killing the previous one
- Run multiple Turbopack dev servers in parallel
- Run `npm install` without need

Prefer:
- `npm run build` for verification (one-shot, exits)
- `npx tsc --noEmit` for fast type-check
