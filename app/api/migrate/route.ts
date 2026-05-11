import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { migrateUserData } from "@/lib/repository";
import { isClerkEnabled } from "@/lib/auth-config";

export const runtime = "nodejs";

const BodySchema = z.object({
  fromUserId: z.string().min(3),
  toUserId: z.string().min(3),
});

export async function POST(req: NextRequest) {
  if (!isClerkEnabled()) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 501 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Authorization: client must actually be signed in as `toUserId`.
  // Without this, anyone could merge anyone else's guest progress into
  // their own account.
  let authedUserId: string | null = null;
  try {
    const result = await auth();
    authedUserId = result.userId ?? null;
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!authedUserId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (authedUserId !== parsed.data.toUserId) {
    return NextResponse.json({ error: "toUserId must match the authenticated user" }, { status: 403 });
  }

  // Sanity: never merge a Clerk-authed userId (prefix `user_`) into another.
  if (parsed.data.fromUserId.startsWith("user_")) {
    return NextResponse.json({ error: "fromUserId must be a guest id, not a Clerk user id" }, { status: 400 });
  }

  const result = await migrateUserData(parsed.data.fromUserId, parsed.data.toUserId);
  return NextResponse.json(result);
}
