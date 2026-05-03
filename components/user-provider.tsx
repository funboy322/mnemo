"use client";
import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { isClerkEnabled } from "@/lib/auth-config";

type Ctx = {
  /** Authoritative user id used by all API calls. Clerk id when signed in,
   *  else a stable localStorage UUID for guest mode. `null` only briefly
   *  during initial mount before localStorage is read. */
  userId: string | null;
  /** True when this id is authenticated via Clerk (i.e. real account). */
  isAuthed: boolean;
  /** Available after sign-in: previous guest id that should be migrated.
   *  Cleared after successful migration. */
  pendingGuestId: string | null;
  clearPendingGuestId: () => void;
};

const UserCtx = React.createContext<Ctx>({
  userId: null,
  isAuthed: false,
  pendingGuestId: null,
  clearPendingGuestId: () => {},
});

const GUEST_KEY = "curio.userId";
const PENDING_MIGRATE_KEY = "curio.pendingMigrate";

function generateGuestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `g_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  }
  return `g_${Math.random().toString(36).slice(2, 18)}`;
}

function useGuestId(): { guestId: string | null; pendingGuestId: string | null; clearPending: () => void } {
  const [guestId, setGuestId] = React.useState<string | null>(null);
  const [pendingGuestId, setPendingGuestId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let id = localStorage.getItem(GUEST_KEY);
    if (!id) {
      id = generateGuestId();
      localStorage.setItem(GUEST_KEY, id);
    }
    setGuestId(id);
    const pending = localStorage.getItem(PENDING_MIGRATE_KEY);
    if (pending) setPendingGuestId(pending);
  }, []);

  const clearPending = React.useCallback(() => {
    localStorage.removeItem(PENDING_MIGRATE_KEY);
    setPendingGuestId(null);
  }, []);

  return { guestId, pendingGuestId, clearPending };
}

/** Inner provider used when Clerk is enabled. Calls useUser(). */
function ClerkAwareProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user, isLoaded } = useUser();
  const { guestId, pendingGuestId, clearPending } = useGuestId();
  const [pendingState, setPendingState] = React.useState<string | null>(null);

  // Sync from useGuestId
  React.useEffect(() => setPendingState(pendingGuestId), [pendingGuestId]);

  const wasAuthed = React.useRef<boolean | null>(null);
  React.useEffect(() => {
    if (!isLoaded) return;
    const authed = !!isSignedIn;
    if (wasAuthed.current === false && authed && guestId) {
      localStorage.setItem(PENDING_MIGRATE_KEY, guestId);
      setPendingState(guestId);
    }
    wasAuthed.current = authed;
  }, [isSignedIn, isLoaded, guestId]);

  const userId = isSignedIn && user?.id ? user.id : guestId;
  const value = React.useMemo<Ctx>(
    () => ({
      userId,
      isAuthed: !!isSignedIn,
      pendingGuestId: pendingState,
      clearPendingGuestId: () => {
        clearPending();
        setPendingState(null);
      },
    }),
    [userId, isSignedIn, pendingState, clearPending],
  );

  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

/** Inner provider used when Clerk is NOT configured. Pure guest mode. */
function GuestOnlyProvider({ children }: { children: React.ReactNode }) {
  const { guestId } = useGuestId();
  const value = React.useMemo<Ctx>(
    () => ({
      userId: guestId,
      isAuthed: false,
      pendingGuestId: null,
      clearPendingGuestId: () => {},
    }),
    [guestId],
  );
  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  // The check is constant per-build (env baked in), so swapping providers
  // does NOT violate rules of hooks — only one branch ever runs in a given
  // build of the app.
  return isClerkEnabled() ? (
    <ClerkAwareProvider>{children}</ClerkAwareProvider>
  ) : (
    <GuestOnlyProvider>{children}</GuestOnlyProvider>
  );
}

export function useUserId() {
  return React.useContext(UserCtx).userId;
}

export function useIsAuthed() {
  return React.useContext(UserCtx).isAuthed;
}

export function useUserContext() {
  return React.useContext(UserCtx);
}
