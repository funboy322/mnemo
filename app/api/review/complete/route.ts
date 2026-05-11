import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recordReviewSession } from "@/lib/repository";

export const runtime = "nodejs";

const BodySchema = z.object({
  userId: z.string().min(1),
  score: z.number().int().min(0),
  totalExercises: z.number().int().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const result = recordReviewSession(parsed.data.userId, parsed.data.score, parsed.data.totalExercises);
  return NextResponse.json(result);
}
