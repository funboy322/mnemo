import { NextRequest } from "next/server";
import { CourseInputSchema, type CourseOutline } from "@/lib/schemas";
import { streamCourseOutline } from "@/lib/ai-stream";
import { createCourse } from "@/lib/repository";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Streams the course outline as it's generated, then saves to DB and emits
 * a final {done: true, courseId} chunk. Server-sent events format.
 *
 * Client flow:
 *   1. POST with {userId, input}
 *   2. Read SSE stream — each `data: {...}` line is a Partial<CourseOutline>
 *   3. Final `data: {"done":true,"courseId":"c_xxx"}` triggers redirect
 *   4. Stream ends.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = CourseInputSchema.safeParse(body?.input);
  const userId = typeof body?.userId === "string" ? body.userId : null;

  if (!parsed.success || !userId) {
    return new Response(
      JSON.stringify({ error: "Invalid input", details: parsed.error?.format() }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const result = streamCourseOutline(parsed.data);

        // Emit each partial state as the model generates it
        for await (const partial of result.partialObjectStream) {
          send({ partial });
        }

        // Wait for the final validated object, then persist
        const outline = (await result.object) as CourseOutline;
        const finalOutline: CourseOutline = {
          ...outline,
          lessons: outline.lessons.slice(0, parsed.data.depth),
        };
        const { courseId } = createCourse({ userId, input: parsed.data, outline: finalOutline });
        send({ done: true, courseId });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        send({ error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
