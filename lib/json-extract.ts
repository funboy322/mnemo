/**
 * Extract a JSON object from an LLM response that may contain reasoning,
 * markdown fences, or extra commentary around the actual JSON.
 *
 * Gemma 4 26B-a4b-it in particular interleaves reasoning steps with the
 * answer like:
 *
 *   *   Topic: ...
 *   *   Constraints: ...
 *   ```json
 *   { "title": "...", ... }
 *   ```
 *   *   Valid JSON? Yes.
 *
 * We need to pluck out the JSON. Strategy:
 *   1. Find the last ```json ... ``` (or ``` ... ```) fenced block — prefer it
 *      because Gemma puts the final answer there.
 *   2. If no fence, find the longest balanced {...} substring.
 *   3. Strip leading/trailing whitespace.
 */

const FENCED_RE = /```(?:json)?\s*\n?([\s\S]*?)\n?```/g;

export function extractJson(text: string): string {
  // Path 1: fenced blocks. Prefer the LAST one (Gemma's final answer).
  const fencedMatches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = FENCED_RE.exec(text)) !== null) {
    fencedMatches.push(m[1].trim());
  }
  if (fencedMatches.length > 0) {
    // Prefer the longest fenced block; reasoning fences are usually short.
    fencedMatches.sort((a, b) => b.length - a.length);
    return fencedMatches[0];
  }

  // Path 2: find the largest balanced {...} block by depth scanning.
  let bestStart = -1;
  let bestEnd = -1;
  let bestLen = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== "{") continue;
    let depth = 1;
    let inString = false;
    let escaped = false;
    for (let j = i + 1; j < text.length; j++) {
      const ch = text[j];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const len = j - i + 1;
          if (len > bestLen) {
            bestStart = i;
            bestEnd = j + 1;
            bestLen = len;
          }
          break;
        }
      }
    }
  }
  if (bestStart >= 0) {
    return text.slice(bestStart, bestEnd).trim();
  }

  return text.trim();
}
