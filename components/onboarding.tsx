"use client";
import * as React from "react";
import { CreateCourse } from "./create-course";

const ONBOARDED_KEY = "mnemo.onboarded";

export function shouldShowOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDED_KEY) !== "1";
}

export function markOnboarded() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDED_KEY, "1");
}

/**
 * Onboarding — Quiet single-step.
 *
 * The previous 3-step flow (topic → why → goal) wrote "why"/"goal" to
 * localStorage but nothing downstream ever read them. Quiet collapses
 * to a single screen identical to the landing's CreateCourse, with an
 * "onboarding" eyebrow tag.
 *
 * Marking the user as onboarded happens when CreateCourse fires off the
 * stream POST — handled inline below in the wrapped instance.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Onboarding({ onSkip }: { onSkip: () => void }) {
  React.useEffect(() => {
    // First render of onboarding counts as the user having seen it.
    // Once they submit, the create flow takes over.
    return () => {
      // Mark as onboarded when the component unmounts (user either
      // submitted a course or skipped). The localStorage flag means
      // they won't see the onboarding tag again on subsequent visits.
      markOnboarded();
    };
  }, []);

  return <CreateCourse mode="onboarding" />;
}
