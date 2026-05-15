/**
 * QuietMark — the Mnemo brand mark.
 *
 * A minimal line-art letter M with a single green dot at the top-right
 * peak (the "knot"). The dot is the only color anchor in the design;
 * everything else around it must stay restrained.
 *
 * Rules (from the design spec):
 *  - The dot stays green even on dark backgrounds. Never inverts to white.
 *  - Stroke width scales with size — `max(1.5, size * 0.085)`.
 *  - Wordmark sets the mark at `size * 1.05` to optical-balance the
 *    "mnemo" wordmark next to it.
 *  - On graphite (dark) backgrounds, the M stroke goes white via the
 *    `color` prop, but `accent` (the dot) stays Quiet green.
 */
import * as React from "react";

type Props = {
  size?: number;
  color?: string;
  accent?: string;
  className?: string;
};

const QUIET_INK = "#16140f";
const QUIET_GREEN = "#0d8a4a";

export function QuietMark({
  size = 32,
  color = QUIET_INK,
  accent = QUIET_GREEN,
  className,
}: Props) {
  const sw = Math.max(1.5, size * 0.085);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M 5 26 L 5 6 L 16 20 L 27 6 L 27 26"
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="6" r={sw * 0.8} fill={accent} />
    </svg>
  );
}

/**
 * QuietWordmark — mark + "mnemo" text in Inter Tight 600 lowercase.
 * The text size is set with the `size` prop so the wordmark scales as
 * a unit. Use `size={20}` for headers, `size={26}` for hero placement.
 */
export function QuietWordmark({
  size = 22,
  color = QUIET_INK,
  accent = QUIET_GREEN,
  className,
}: Props) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.4,
      }}
    >
      <QuietMark size={size * 1.05} color={color} accent={accent} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: size,
          color,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        mnemo
      </span>
    </span>
  );
}
