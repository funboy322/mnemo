"use client";
import ReactMarkdown from "react-markdown";
import type { ContentBlock } from "@/lib/schemas";
import { Lightbulb, BookOpen } from "lucide-react";

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <div
          key={i}
          className="rounded-card bg-white border-2 border-zinc-200 p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <span
              className={
                block.type === "concept"
                  ? "inline-flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600"
                  : "inline-flex items-center justify-center h-8 w-8 rounded-xl bg-amber-50 text-amber-600"
              }
            >
              {block.type === "concept" ? (
                <BookOpen className="h-4 w-4" />
              ) : (
                <Lightbulb className="h-4 w-4" />
              )}
            </span>
            <h3 className="font-bold text-zinc-900">{block.heading}</h3>
          </div>
          <div className="prose prose-sm max-w-none prose-zinc text-zinc-700 leading-relaxed">
            <ReactMarkdown>{block.body}</ReactMarkdown>
          </div>
          {block.type === "concept" && block.keyPoints && block.keyPoints.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-zinc-100 pt-3">
              {block.keyPoints.map((kp, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-zinc-700">
                  <span className="text-brand-500 mt-0.5">→</span>
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
