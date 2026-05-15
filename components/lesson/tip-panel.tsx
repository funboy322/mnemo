"use client";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import type { ContentBlock } from "@/lib/schemas";

/**
 * TipPanel — Quiet direction.
 *
 * Interstitial mini-lesson card between exercises. The previous version
 * tinted the whole card amber for examples and indigo for concepts —
 * Quiet collapses that to a single bone-on-surface card with mono-caps
 * eyebrow telling you which block type this is. One accent only.
 */
export function TipPanel({ block, onContinue }: { block: ContentBlock; onContinue: () => void }) {
  const t = useT();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onContinue();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);

  const isExample = block.type === "example";

  return (
    <div className="animate-slide-up max-w-2xl mx-auto">
      <div className="card-quiet p-6 sm:p-8">
        <p className="eyebrow mb-3">
          {isExample ? t.tipLabel ?? "Example" : t.tipLabel ?? "Concept"}
        </p>

        <h3 className="font-display font-medium text-[20px] sm:text-[24px] text-ink leading-snug tracking-[-0.015em]">
          {block.heading}
        </h3>

        <div className="lesson-prose mt-3 text-[15px] sm:text-[16px] text-ink-soft leading-[1.6]">
          <ReactMarkdown>{block.body}</ReactMarkdown>
        </div>

        {block.type === "concept" && block.keyPoints && block.keyPoints.length > 0 && (
          <ul className="mt-5 pt-4 border-t border-rule space-y-2">
            {block.keyPoints.map((kp, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-ink leading-relaxed"
              >
                <span className="text-green mt-1.5 leading-none">·</span>
                <span>{kp}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button onClick={onContinue} size="lg" className="w-full mt-6">
        {t.gotIt} →
      </Button>
    </div>
  );
}
