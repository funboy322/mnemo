import { NextRequest, NextResponse } from "next/server";
import { CourseInputSchema } from "@/lib/schemas";
import { generateCourseOutline } from "@/lib/ai";
import { createCourse } from "@/lib/repository";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = CourseInputSchema.safeParse(body?.input);
  const userId = typeof body?.userId === "string" ? body.userId : null;

  if (!parsed.success || !userId) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error?.format() }, { status: 400 });
  }

  try {
    const outline = await generateCourseOutline(parsed.data);
    const { courseId } = createCourse({ userId, input: parsed.data, outline });
    return NextResponse.json({ courseId });
  } catch (err) {
    console.error("Course generation failed:", err);
    return NextResponse.json({ error: "Generation failed", message: (err as Error).message }, { status: 500 });
  }
}
