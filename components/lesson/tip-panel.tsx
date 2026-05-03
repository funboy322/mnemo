"use client";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Lightbulb, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useT } from "../locale-provider";
import type { ContentBlock } from "@/lib/schemas";

/**
 * Interstitial mini-lesson card. Shows ONE content block (concept or example)
 * between exercises, Duolingo-style. Press Enter/Space to advance.
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
      <div className={`rounded-card border-2 p-5 sm:p-7 ${
        isExample ? "bg-amber-50 border-amber-200" : "bg-indigo-50 border-indigo-200"
      }`}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center justify-center h-9 w-9 rounded-2xl ${
            isExample ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
          }`}>
            {isExample ? <Lightbulb className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
          </span>
          <p className={`text-xs uppercase tracking-wider font-bold ${
            isExample ? "text-amber-800" : "text-indigo-800"
          }`}>
            {t.tipLabel}
          </p>
        </div>

        <h3 className="text-xl font-black text-zinc-900 leading-snug">{block.heading}</h3>
        <div className="mt-3 prose prose-sm max-w-none prose-zinc text-zinc-800 leading-relaxed">
          <ReactMarkdown>{block.body}</ReactMarkdown>
        </div>

        {block.type === "concept" && block.keyPoints && block.keyPoints.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-indigo-200/60 pt-3">
            {block.keyPoints.map((kp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-800 font-medium">
                <span className="text-indigo-600 mt-0.5">→</span>
                <span>{kp}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button onClick={onContinue} size="lg" className="w-full mt-6">
        {t.gotIt}
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
