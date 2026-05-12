import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { LanguageSchema, LevelSchema } from "@/lib/schemas";
import { generateCourseFromImage } from "@/lib/ai-vision";
import { createCourse } from "@/lib/repository";

export const runtime = "nodejs";
export const maxDuration = 300;

const BodySchema = z.object({
  userId: z.string().min(1),
  imageDataUrl: z.string().min(20), // data:image/jpeg;base64,... or https://...
  language: LanguageSchema.default("en"),
  level: LevelSchema.default("beginner"),
  depth: z.union([z.literal(5), z.literal(8), z.literal(12)]).default(5),
  userHint: z.string().max(500).optional(),
});

/**
 * Build a course from an uploaded image using Gemma 4 vision.
 *
 * Designed for the Gemma 4 Good Hackathon — showcases open-weights multimodal:
 * a photo of a textbook page, a chart, a diagram, an object becomes a
 * structured course in seconds. Zero text input required.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error?.format() },
      { status: 400 },
    );
  }

  try {
    const { outline, inferredTopic } = await generateCourseFromImage(parsed.data);
    const { courseId } = await createCourse({
      userId: parsed.data.userId,
      input: {
        topic: inferredTopic,
        level: parsed.data.level,
        depth: parsed.data.depth,
        language: parsed.data.language,
      },
      outline,
    });
    return NextResponse.json({ courseId, inferredTopic });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Vision generation failed";
    console.error("from-image generation failed:", err);
    return NextResponse.json(
      { error: "Generation failed", message },
      { status: 500 },
    );
  }
}
