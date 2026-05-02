"use client";
import * as React from "react";

type Ctx = { userId: string | null };
const UserCtx = React.createContext<Ctx>({ userId: null });

const KEY = "curio.userId";

function generateUserId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `u_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  }
  return `u_${Math.random().toString(36).slice(2, 18)}`;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = generateUserId();
      localStorage.setItem(KEY, id);
    }
    setUserId(id);
  }, []);

  return <UserCtx.Provider value={{ userId }}>{children}</UserCtx.Provider>;
}

export function useUserId() {
  return React.useContext(UserCtx).userId;
}
