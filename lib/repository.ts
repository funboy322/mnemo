import { db, ensureSchema } from "./db";
import { courses, lessons, progress, userStats } from "./db-schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { CourseInput, CourseOutline, LessonContent, Exercise } from "./schemas";

export function generateId(prefix: string) {
  return `${prefix}_${nanoid(12)}`;
}

export async function createCourse(args: {
  userId: string;
  input: CourseInput;
  outline: CourseOutline;
}) {
  await ensureSchema();
  const courseId = generateId("c");
  const now = new Date();

  await db.insert(courses).values({
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
  });

  const lessonRows = args.outline.lessons.map((lesson, i) => ({
    id: generateId("l"),
    courseId,
    position: i,
    title: lesson.title,
    summary: lesson.summary,
    objectives: lesson.objectives,
  }));

  if (lessonRows.length) {
    await db.insert(lessons).values(lessonRows);
  }

  return { courseId, lessonIds: lessonRows.map((l) => l.id) };
}

export async function getCourse(courseId: string) {
  await ensureSchema();
  const course = await db.select().from(courses).where(eq(courses.id, courseId)).get();
  if (!course) return null;
  const lessonRows = await db
    .select()
    .from(lessons)
    .where(eq(lessons.courseId, courseId))
    .orderBy(lessons.position)
    .all();
  return { course, lessons: lessonRows };
}

export async function getLesson(lessonId: string) {
  await ensureSchema();
  return (await db.select().from(lessons).where(eq(lessons.id, lessonId)).get()) ?? null;
}

export async function getLessonsByCourse(courseId: string) {
  await ensureSchema();
  return await db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(lessons.position).all();
}

export async function saveLessonContent(lessonId: string, content: LessonContent) {
  await ensureSchema();
  await db.update(lessons).set({ content, generatedAt: new Date() }).where(eq(lessons.id, lessonId));
}

export async function listUserCourses(userId: string) {
  await ensureSchema();
  return await db.select().from(courses).where(eq(courses.userId, userId)).orderBy(desc(courses.createdAt)).all();
}

export async function listUserCoursesWithProgress(userId: string) {
  await ensureSchema();
  const userCourses = await listUserCourses(userId);
  if (userCourses.length === 0) return [];

  const result = [];
  for (const c of userCourses) {
    const totalLessons = (
      await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.courseId, c.id)).all()
    ).length;
    const completedLessons = await db
      .select({ lessonId: progress.lessonId })
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.courseId, c.id)))
      .all();
    const uniqueCompleted = new Set(completedLessons.map((p) => p.lessonId));
    result.push({
      ...c,
      totalLessons,
      completedLessons: uniqueCompleted.size,
      progressPct: totalLessons === 0 ? 0 : Math.round((uniqueCompleted.size / totalLessons) * 100),
    });
  }
  return result;
}

export async function hasActivityToday(userId: string): Promise<boolean> {
  const stats = await getUserStats(userId);
  return stats.lastActivityDate === todayISO();
}

export async function getCompletedLessonIds(userId: string, courseId: string): Promise<Set<string>> {
  await ensureSchema();
  const rows = await db
    .select({ lessonId: progress.lessonId })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.courseId, courseId)))
    .all();
  return new Set(rows.map((r) => r.lessonId));
}

export async function recordLessonComplete(args: {
  userId: string;
  courseId: string;
  lessonId: string;
  score: number;
  totalExercises: number;
}) {
  await ensureSchema();
  const xpEarned = Math.round((args.score / Math.max(args.totalExercises, 1)) * 10) + 5;
  const id = generateId("p");
  const now = new Date();

  await db.insert(progress).values({
    id,
    userId: args.userId,
    courseId: args.courseId,
    lessonId: args.lessonId,
    score: args.score,
    totalExercises: args.totalExercises,
    xpEarned,
    completedAt: now,
  });

  await bumpUserStats(args.userId, xpEarned);
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

async function bumpUserStats(userId: string, xp: number) {
  const existing = await db.select().from(userStats).where(eq(userStats.userId, userId)).get();
  const today = todayISO();

  if (!existing) {
    await db.insert(userStats).values({
      userId,
      totalXp: xp,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: today,
    });
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

  await db
    .update(userStats)
    .set({
      totalXp: existing.totalXp + xp,
      currentStreak: streak,
      longestStreak: Math.max(existing.longestStreak, streak),
      lastActivityDate: today,
    })
    .where(eq(userStats.userId, userId));
}

export async function getUserStats(userId: string) {
  await ensureSchema();
  const existing = await db.select().from(userStats).where(eq(userStats.userId, userId)).get();
  return (
    existing ?? {
      userId,
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
    }
  );
}

/**
 * Returns exercises pooled from lessons the user has completed at least
 * `minHoursAgo` ago. Used for spaced-repetition "daily review" sessions.
 */
export async function getReviewExercises(
  userId: string,
  limit: number,
  minHoursAgo: number = 1,
): Promise<
  Array<{
    exercise: Exercise;
    lessonId: string;
    lessonTitle: string;
    courseId: string;
  }>
> {
  await ensureSchema();
  const cutoff = new Date(Date.now() - minHoursAgo * 60 * 60 * 1000);

  const completed = await db
    .selectDistinct({ lessonId: progress.lessonId })
    .from(progress)
    .where(eq(progress.userId, userId))
    .all();

  if (completed.length === 0) return [];

  const lessonIds = completed.map((r) => r.lessonId);
  const lessonRows = (
    await Promise.all(
      lessonIds.map((id) => db.select().from(lessons).where(eq(lessons.id, id)).get()),
    )
  ).filter((l): l is NonNullable<typeof l> => l !== undefined && l !== null && l.content !== null);

  const eligibleLessons: typeof lessonRows = [];
  for (const l of lessonRows) {
    const latest = await db
      .select({ completedAt: progress.completedAt })
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.lessonId, l.id)))
      .orderBy(desc(progress.completedAt))
      .get();
    if (latest && latest.completedAt.getTime() <= cutoff.getTime()) {
      eligibleLessons.push(l);
    }
  }

  type Item = { exercise: Exercise; lessonId: string; lessonTitle: string; courseId: string };
  const pool: Item[] = [];
  for (const lesson of eligibleLessons) {
    const content = lesson.content as { exercises?: Exercise[] } | null;
    if (!content?.exercises) continue;
    for (const ex of content.exercises) {
      pool.push({
        exercise: ex,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        courseId: lesson.courseId,
      });
    }
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, limit);
}

export async function countLessonsDueForReview(userId: string): Promise<number> {
  await ensureSchema();
  const cutoff = new Date(Date.now() - 60 * 60 * 1000);

  const completed = await db
    .selectDistinct({ lessonId: progress.lessonId })
    .from(progress)
    .where(eq(progress.userId, userId))
    .all();

  let count = 0;
  for (const { lessonId } of completed) {
    const latest = await db
      .select({ completedAt: progress.completedAt })
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)))
      .orderBy(desc(progress.completedAt))
      .get();
    if (latest && latest.completedAt.getTime() <= cutoff.getTime()) count++;
  }
  return count;
}

export async function recordReviewSession(
  userId: string,
  score: number,
  totalExercises: number,
): Promise<{ xpEarned: number }> {
  await ensureSchema();
  const xpEarned = Math.round((score / Math.max(totalExercises, 1)) * 15) + 5;
  await bumpUserStats(userId, xpEarned);
  return { xpEarned };
}

/**
 * Merge a guest user's data into an authenticated user. Called on first sign-in.
 * Re-assigns rows in courses + progress to the new userId. For user_stats, sums
 * the totals (XP) and takes the max of streak fields.
 */
export async function migrateUserData(
  fromUserId: string,
  toUserId: string,
): Promise<{ migrated: number }> {
  await ensureSchema();
  if (fromUserId === toUserId) return { migrated: 0 };

  await db.update(courses).set({ userId: toUserId }).where(eq(courses.userId, fromUserId));
  await db.update(progress).set({ userId: toUserId }).where(eq(progress.userId, fromUserId));

  const fromStats = await db.select().from(userStats).where(eq(userStats.userId, fromUserId)).get();
  if (fromStats) {
    const toStats = await db.select().from(userStats).where(eq(userStats.userId, toUserId)).get();
    if (toStats) {
      await db
        .update(userStats)
        .set({
          totalXp: toStats.totalXp + fromStats.totalXp,
          currentStreak: Math.max(toStats.currentStreak, fromStats.currentStreak),
          longestStreak: Math.max(toStats.longestStreak, fromStats.longestStreak),
          lastActivityDate: toStats.lastActivityDate ?? fromStats.lastActivityDate,
        })
        .where(eq(userStats.userId, toUserId));
      await db.delete(userStats).where(eq(userStats.userId, fromUserId));
    } else {
      await db.update(userStats).set({ userId: toUserId }).where(eq(userStats.userId, fromUserId));
    }
  }

  return { migrated: 1 };
}
