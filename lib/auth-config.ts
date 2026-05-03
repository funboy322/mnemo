/**
 * Auth (Clerk) is optional. If publishable key is not set, the app
 * runs in pure guest mode (localStorage user ids only, no sign-in UI).
 *
 * This is read in BOTH server and client contexts. The publishable key is
 * intentionally NEXT_PUBLIC_* so the client can also see if auth is enabled.
 */

export function isClerkEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}
