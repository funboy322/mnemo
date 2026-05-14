/**
 * Client-side pre-generation helpers. Fire-and-forget fetches that warm the
 * server cache before the user actually navigates.
 *
 * Why this works on Vercel: the function keeps running on the server even if
 * the client aborts; by the time the user clicks "Start lesson", the content
 * is already saved in the database.
 *
 * Trade-off: one extra Gemma 4 call per course creation. Worth it for the
 * dramatic perceived-speed improvement — first lesson opens instantly
 * instead of waiting another 30-60s for Gemma to think.
 */

/**
 * After a course is created, kick off lesson 1's content generation in the
 * background. The user will navigate to /course/[id] while this runs.
 * By the time they click "Start lesson", content is ready or close to it.
 */
export function prefetchFirstLesson(courseId: string): void {
  if (typeof window === "undefined") return;
  // Don't await — pure fire-and-forget. Even if the function takes 60s on the
  // server, the user's request to /api/courses already returned and they're
  // navigating elsewhere.
  fetch(`/api/courses/${courseId}`)
    .then((r) => r.json())
    .then((data: { lessons?: Array<{ id: string }> }) => {
      const firstLessonId = data.lessons?.[0]?.id;
      if (!firstLessonId) return;
      // This will internally trigger Gemma 4 generation if content isn't
      // already cached. Server saves the result before responding.
      void fetch(`/api/lessons/${firstLessonId}`, {
        // keepalive lets the request survive the page navigation. With this
        // the browser doesn't kill the request when the user moves to a new
        // page. Vercel function keeps running on the server regardless, but
        // this is belt-and-suspenders.
        keepalive: true,
      }).catch(() => {
        // We don't care about the response — server saves to DB.
      });
    })
    .catch(() => {
      // Swallow errors silently — prefetch is best-effort.
    });
}
