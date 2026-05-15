import * as React from "react";

/**
 * EmText — renders an i18n string with embedded italic marker as JSX.
 *
 * Input format: "What do you want to {em}learn?{/em}"
 * Output: <>{"What do you want to "}<em>learn?</em></>
 *
 * Used for the Quiet signature italic moment — one Instrument Serif word
 * per heading. The `<em>` styling is global in `globals.css`. Locales
 * that don't have a natural italic equivalent (Arabic, Hindi) still get
 * the marker; the fallback font handles the visual differentiation.
 *
 * Only the FIRST {em}…{/em} match is rendered as italic. If a string
 * has none, it renders as plain text. If a string has multiple, that's
 * a bug — Quiet allows exactly one italic moment per heading.
 */
export function EmText({ children }: { children: string }) {
  const match = /^([\s\S]*?)\{em\}([\s\S]*?)\{\/em\}([\s\S]*)$/.exec(children);
  if (!match) return <>{children}</>;
  return (
    <>
      {match[1]}
      <em>{match[2]}</em>
      {match[3]}
    </>
  );
}
