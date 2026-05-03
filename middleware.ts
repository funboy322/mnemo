import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkEnabled } from "./lib/auth-config";

/**
 * Clerk middleware (optional). If NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is
 * not set, we skip Clerk entirely and the app runs in guest-only mode.
 *
 * No routes are gated here — auth is checked per-route where it matters
 * (see /api/migrate which requires `auth()`).
 */
const noopMiddleware = () => NextResponse.next();
const middleware = isClerkEnabled() ? clerkMiddleware() : noopMiddleware;

export default middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
