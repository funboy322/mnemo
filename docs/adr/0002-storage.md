# ADR 0002: Storage strategy

**Status**: Accepted for dev; **decision pending for production** (no deploy yet)
**Context**: Vercel Functions filesystem is read-only at runtime. SQLite-via-file does not work in production.

## Current state

- **Dev**: `better-sqlite3` driver, file at `.data/app.db`. Sync API. `lib/repository.ts` calls `db.select().from(...).get()` directly.
- **Prod**: Will fail at first write. We have not deployed.

## Production options evaluated

### Option A — Turso (libsql)
SQLite-compatible HTTP service with branching, edge replicas, free tier.

- **Pro**: Same `sqliteTable` schema. Driver swap only.
- **Pro**: Branch per preview deployment is supported.
- **Con**: All repository functions become `async` (libsql client is promise-based). ~15 functions to refactor + their callers (server components and route handlers, mostly mechanical).
- **Con**: External provider, not in Vercel Marketplace.

### Option B — Neon Postgres (Vercel Marketplace)
Serverless Postgres, Vercel-native via Marketplace.

- **Pro**: Vercel-native env auto-provisioning.
- **Pro**: Industry-standard SQL, more migration tooling.
- **Con**: Schema rewrite — `sqliteTable` → `pgTable`. Different column types (`integer({mode:"timestamp"})` → `timestamp`).
- **Con**: All repository functions async.

### Option C — Vercel Blob (JSON store)
Store course/lesson data as JSON blobs.

- **Pro**: Trivial to set up.
- **Con**: No queries — must read entire blob to find a course. Doesn't scale past ~50 users.
- **Verdict**: Reject.

## Decision

**Default plan**: Option A (Turso) when we deploy.
- Single schema file works for both local and prod.
- The async refactor is mechanical and forced anyway by any prod option.
- Free tier covers MVP.

**Revisit if**: We need joins across multiple users, complex aggregation, or hit Turso's free-tier limits.

## Migration steps (when ready)

1. `npm install @libsql/client`
2. Create Turso DB: `turso db create curio` (or use Vercel integration)
3. Get URL + token, add to Vercel env: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
4. Replace `lib/db.ts` body:
   ```ts
   import { createClient } from "@libsql/client";
   import { drizzle } from "drizzle-orm/libsql";
   const client = createClient({
     url: process.env.TURSO_DATABASE_URL!,
     authToken: process.env.TURSO_AUTH_TOKEN!,
   });
   export const db = drizzle(client, { schema });
   ```
5. Make every function in `lib/repository.ts` `async` (return `Promise<...>`); add `await` at all `.get()` / `.all()` / `.run()` calls.
6. Update callers (route handlers, server components).
7. Use `drizzle-kit push` to migrate schema once.
