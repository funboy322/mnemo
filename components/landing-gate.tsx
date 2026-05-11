"use client";
import * as React from "react";
import { Onboarding, shouldShowOnboarding } from "./onboarding";

/**
 * Decides whether to show the first-time onboarding wizard or the
 * regular landing page below. Renders nothing while reading
 * localStorage to avoid a flash of the landing for new users.
 */
export function LandingGate({ children }: { children: React.ReactNode }) {
  const [show, setShow] = React.useState<"loading" | "onboarding" | "landing">("loading");

  React.useEffect(() => {
    setShow(shouldShowOnboarding() ? "onboarding" : "landing");
  }, []);

  if (show === "loading") {
    return <div className="flex-1 min-h-screen" aria-hidden />;
  }

  if (show === "onboarding") {
    return <Onboarding onSkip={() => setShow("landing")} />;
  }

  return <>{children}</>;
}
