import { db } from "./db";
import { courses, lessons, progress, userStats } from "./db-schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { CourseInput, CourseOutline, LessonContent } from "./schemas";

export function generateId(prefix: string) {
  return `${prefix}_${nanoid(12)}`;
}

export function createCourse(args: { userId: string; input: CourseInput; outline: CourseOutline }) {
  const courseId = generateId("c");
  const now = new Date();

  db.insert(courses).values({
    id: courseId,
    userId: args.userId,
    topic: args.input.topic,
    level: args.input.level,
    language: args.input.language,
    title: args.outline.title,
    description: args.outline.description,
    emoji: args.outline.emoji,
    outline: args.outline,
    createdAt: now,
  }).run();

  const lessonRows = args.outline.lessons.map((lesson, i) => ({
    id: generateId("l"),
    courseId,
    position: i,
    title: lesson.title,
    summary: lesson.summary,
    objectives: lesson.objectives,
  }));

  if (lessonRows.length) {
    db.insert(lessons).values(lessonRows).run();
  }

  return { courseId, lessonIds: lessonRows.map((l) => l.id) };
}

export function getCourse(courseId: string) {
  const course = db.select().from(courses).where(eq(courses.id, courseId)).get();
  if (!course) return null;
  const lessonRows = db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(lessons.position).all();
  return { course, lessons: lessonRows };
}

export function getLesson(lessonId: string) {
  return db.select().from(lessons).where(eq(lessons.id, lessonId)).get() ?? null;
}

export function getLessonsByCourse(courseId: string) {
  return db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(lessons.position).all();
}

export function saveLessonContent(lessonId: string, content: LessonContent) {
  db.update(lessons)
    .set({ content, generatedAt: new Date() })
    .where(eq(lessons.id, lessonId))
    .run();
}

export function listUserCourses(userId: string) {
  return db.select().from(courses).where(eq(courses.userId, userId)).orderBy(desc(courses.createdAt)).all();
}

export function listUserCoursesWithProgress(userId: string) {
  const userCourses = listUserCourses(userId);
  if (userCourses.length === 0) return [];
  return userCourses.map((c) => {
    const totalLessons = db.select({ id: lessons.id })
      .from(lessons)
      .where(eq(lessons.courseId, c.id))
      .all().length;
    const completedLessons = db.select({ lessonId: progress.lessonId })
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.courseId, c.id)))
      .all();
    const uniqueCompleted = new Set(completedLessons.map((p) => p.lessonId));
    return {
      ...c,
      totalLessons,
      completedLessons: uniqueCompleted.size,
      progressPct: totalLessons === 0 ? 0 : Math.round((uniqueCompleted.size / totalLessons) * 100),
    };
  });
}

/** Returns whether user completed any lesson today (for daily goal). */
export function hasActivityToday(userId: string): boolean {
  const stats = getUserStats(userId);
  return stats.lastActivityDate === todayISO();
}

export function getCompletedLessonIds(userId: string, courseId: string): Set<string> {
  const rows = db.select({ lessonId: progress.lessonId }).from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.courseId, courseId)))
    .all();
  return new Set(rows.map((r) => r.lessonId));
}

export function recordLessonComplete(args: {
  userId: string;
  courseId: string;
  lessonId: string;
  score: number;
  totalExercises: number;
}) {
  const xpEarned = Math.round((args.score / Math.max(args.totalExercises, 1)) * 10) + 5;
  const id = generateId("p");
  const now = new Date();

  db.insert(progress).values({
    id,
    userId: args.userId,
    courseId: args.courseId,
    lessonId: args.lessonId,
    score: args.score,
    totalExercises: args.totalExercises,
    xpEarned,
    completedAt: now,
  }).run();

  bumpUserStats(args.userId, xpEarned);
  return { xpEarned };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function bumpUserStats(userId: string, xp: number) {
  const existing = db.select().from(userStats).where(eq(userStats.userId, userId)).get();
  const today = todayISO();

  if (!existing) {
    db.insert(userStats).values({
      userId,
      totalXp: xp,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: today,
    }).run();
    return;
  }

  let streak = existing.currentStreak;
  if (existing.lastActivityDate === today) {
    // already active today, streak unchanged
  } else if (existing.lastActivityDate === yesterdayISO()) {
    streak = existing.currentStreak + 1;
  } else {
    streak = 1;
  }

  db.update(userStats)
    .set({
      totalXp: existing.totalXp + xp,
      currentStreak: streak,
      longestStreak: Math.max(existing.longestStreak, streak),
      lastActivityDate: today,
    })
    .where(eq(userStats.userId, userId))
    .run();
}

export function getUserStats(userId: string) {
  const existing = db.select().from(userStats).where(eq(userStats.userId, userId)).get();
  return existing ?? {
    userId,
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
  };
}

/**
 * Merge a guest user's data into an authenticated user. Called on first sign-in.
 *
 * Strategy: re-assign rows in courses + progress to the new userId.
 * For user_stats, sum the totals (XP, streak max). Idempotent — running twice
 * just re-points already-pointed rows.
 */
export function migrateUserData(fromUserId: string, toUserId: string): { migrated: number } {
  if (fromUserId === toUserId) return { migrated: 0 };

  // Re-assign all rows
  const courseUpdate = db.update(courses).set({ userId: toUserId }).where(eq(courses.userId, fromUserId)).run();
  const progressUpdate = db.update(progress).set({ userId: toUserId }).where(eq(progress.userId, fromUserId)).run();

  // Merge user_stats: take max of XP and streak fields
  const fromStats = db.select().from(userStats).where(eq(userStats.userId, fromUserId)).get();
  if (fromStats) {
    const toStats = db.select().from(userStats).where(eq(userStats.userId, toUserId)).get();
    if (toStats) {
      db.update(userStats)
        .set({
          totalXp: toStats.totalXp + fromStats.totalXp,
          currentStreak: Math.max(toStats.currentStreak, fromStats.currentStreak),
          longestStreak: Math.max(toStats.longestStreak, fromStats.longestStreak),
          lastActivityDate: toStats.lastActivityDate ?? fromStats.lastActivityDate,
        })
        .where(eq(userStats.userId, toUserId))
        .run();
      db.delete(userStats).where(eq(userStats.userId, fromUserId)).run();
    } else {
      // Just re-assign the row
      db.update(userStats).set({ userId: toUserId }).where(eq(userStats.userId, fromUserId)).run();
    }
  }

  return {
    migrated: (courseUpdate.changes ?? 0) + (progressUpdate.changes ?? 0),
  };
}
