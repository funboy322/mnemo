# ADR 0001: Tech stack

**Status**: Accepted (2026-05)
**Context**: Initial build, single-developer, deploy-target Vercel.

## Decision

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 16 App Router** + Turbopack | Vercel-native, SSR + API routes in one repo, Turbopack much faster dev experience |
| Language | TypeScript (strict) | Catches bugs at compile time, especially for discriminated unions of exercise types |
| Styling | **Tailwind CSS v4** + custom `@theme` | No design-system overhead; brand palette via CSS vars |
| UI primitives | Hand-rolled minimal `Button`/`Input`/`ProgressBar` + Radix slot | Avoids shadcn CLI overhead; <100 LOC total |
| Icons | `lucide-react` | Tree-shakable, consistent stroke style |
| AI | **AI SDK v6** + Vercel AI Gateway | Provider-agnostic, observability, model fallbacks. `generateObject` with Zod is the killer feature here. |
| Default model | `anthropic/claude-sonnet-4-6` | Best structured-output quality for educational content |
| Schema validation | Zod v4 | AI SDK uses Zod natively for `generateObject`. Discriminated unions for `Exercise` types. |
| DB (dev) | better-sqlite3 + Drizzle ORM | Sync, zero-config, single `.data/app.db` file |
| DB (prod) | TBD — see ADR 0002 | Vercel filesystem is read-only |
| Auth | None (localStorage UUID) | Avoid sign-up friction for MVP. Add later via Clerk (Vercel Marketplace native). |

## Rejected alternatives

- **shadcn CLI**: Skipped because we only need ~5 primitives. Hand-rolled is faster and gives full control over the 3D button shadow look.
- **Direct `@ai-sdk/anthropic`** as default: Per Vercel guidance, prefer Gateway with `"provider/model"` strings. Direct provider is fallback only when `ANTHROPIC_API_KEY` is set without `AI_GATEWAY_API_KEY`.
- **Postgres locally**: Adds Docker dependency. SQLite is enough until deploy.
- **NextAuth / Clerk in MVP**: Adds another env var, sign-in UX, and webhook surface area. Defer.

## Consequences

- **Pro**: Single-process dev (`npm run dev` only). No external services to start.
- **Pro**: Type-safe AI output via Zod → schema directly.
- **Pro**: Deploy is `vercel deploy` once env vars + DB are set.
- **Con**: Storage swap is required before any real production deploy (see ADR 0002).
- **Con**: No auth means progress is per-device-per-browser. Clearing localStorage = losing progress.
