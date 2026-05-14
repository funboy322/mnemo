/**
 * Client-side pre-generation helpers. Fire-and-forget fetches that warm the
 * server cache before the user actually navigates.
 *
 * Why this works on Vercel: each function keeps running on the server even
 * if the client aborts. By the time the user clicks any lesson, content is
 * already in the database.
 *
 * Trade-off: extra Gemma 4 calls per course creation (one per lesson).
 * Google AI Studio free tier is generous enough; the dramatic perceived-
 * speed win is worth it.
 */

/**
 * After a course is created, kick off content generation for ALL lessons
 * in parallel. The user will navigate to /course/[id] while these run.
 * By the time they tap any lesson, content is ready or close to it.
 *
 * We stagger the parallel fan-out slightly (3 immediate, 2 delayed) to
 * stay under the Google AI free-tier token-per-minute ceiling. With
 * Gemma 4 thinking ~5-8k tokens per lesson, 5 simultaneous calls would
 * exceed 32k TPM on the free tier. Staggering keeps us safely under.
 */
export function prefetchAllLessons(courseId: string): void {
  if (typeof window === "undefined") return;

  fetch(`/api/courses/${courseId}`)
    .then((r) => r.json())
    .then((data: { lessons?: Array<{ id: string; hasContent?: boolean }> }) => {
      const lessons = data.lessons ?? [];
      // Only fire for lessons that don't already have content (idempotent).
      const targets = lessons.filter((l) => !l.hasContent).map((l) => l.id);
      if (targets.length === 0) return;

      // First 3 fire immediately; the rest after a short delay to spread
      // load and respect rate limits on the free tier.
      const immediate = targets.slice(0, 3);
      const delayed = targets.slice(3);

      for (const id of immediate) {
        void fetch(`/api/lessons/${id}`, { keepalive: true }).catch(() => {});
      }
      if (delayed.length > 0) {
        setTimeout(() => {
          for (const id of delayed) {
            void fetch(`/api/lessons/${id}`, { keepalive: true }).catch(() => {});
          }
        }, 35_000); // 35s — long enough for first batch to finish reasoning
      }
    })
    .catch(() => {
      // Best-effort. If prefetch fails, the lesson-open flow generates
      // on demand anyway.
    });
}

/**
 * Same as prefetchAllLessons but for users who already have a course open.
 * Triggered from the course-path page so opening an existing course (not
 * a freshly-created one) also warms the cache.
 */
export const prefetchFirstLesson = prefetchAllLessons;
