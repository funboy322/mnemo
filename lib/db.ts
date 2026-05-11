import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db-schema";
import path from "node:path";
import fs from "node:fs";

/**
 * Single libsql driver works for both local (file: URL) and prod (libsql:// to Turso).
 * Schema stays in sqliteTable — libsql is SQLite-compatible.
 *
 * Local: file at .data/app.db (gitignored)
 * Prod : Turso DB via TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
 */

function getLocalUrl(): string {
  const dbDir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  return `file:${path.join(dbDir, "app.db")}`;
}

const url = process.env.TURSO_DATABASE_URL || getLocalUrl();
const authToken = process.env.TURSO_AUTH_TOKEN;

const client: Client = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client, { schema });

// Initial schema bootstrap. Idempotent — runs every cold start.
// In production with Turso, you'd typically run migrations once via
// drizzle-kit; this inline init keeps the dev/demo flow zero-config.
const INIT_SQL = [
  `CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    level TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'ru',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '📚',
    outline TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_courses_user ON courses(user_id)`,
  `CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    objectives TEXT NOT NULL,
    content TEXT,
    generated_at INTEGER
  )`,
  `CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id)`,
  `CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    completed_at INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_exercises INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_progress_lesson ON progress(lesson_id)`,
  `CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date TEXT
  )`,
];

let initPromise: Promise<void> | null = null;
export function ensureSchema(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    for (const stmt of INIT_SQL) {
      await client.execute(stmt);
    }
  })();
  return initPromise;
}

// Kick off schema init on import (non-blocking; queries await it implicitly
// via the wrapper functions in repository.ts).
void ensureSchema().catch((err) => {
  console.error("Schema init failed:", err);
});
