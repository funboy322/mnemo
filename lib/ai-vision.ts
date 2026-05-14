import { generateText, type LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { CourseOutlineSchema, type CourseOutline, type Language } from "./schemas";

/**
 * Gemma 4 multimodal entry point. Reads an image and emits a course outline
 * grounded in what the image shows.
 *
 * Provider routing (priority order):
 *   1. GOOGLE_GENERATIVE_AI_API_KEY → Google AI Studio direct
 *      (most reliable for Gemma 4 vision — same infra Google ships from)
 *   2. AI_GATEWAY_API_KEY → Vercel AI Gateway with `google/gemma-4-...`
 *      (works for text; vision is provider-dependent through Gateway routing)
 *
 * We use generateText + manual JSON parse instead of generateObject because
 * Gemma 4 (open-weights) doesn't reliably pass strict tool/schema mode through
 * the SDK yet. Validation happens with Zod after parsing.
 */

const VISION_MODEL_ID =
  process.env.AI_VISION_MODEL || "gemma-4-26b-a4b-it";

function getVisionModel(): LanguageModel | string {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google(VISION_MODEL_ID);
  }
  if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL) {
    // Gateway prefixes the provider
    return `google/${VISION_MODEL_ID}`;
  }
  throw new Error(
    "No AI credentials for vision. Set GOOGLE_GENERATIVE_AI_API_KEY (recommended) or AI_GATEWAY_API_KEY in .env.local.",
  );
}

const LANG_LABEL: Record<string, string> = {
  ru: "Russian (русский)",
  en: "English",
  tr: "Turkish (Türkçe)",
  es: "Spanish (Español)",
  hi: "Hindi (हिन्दी)",
  ar: "Arabic (العربية)",
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "complete beginner with no prior knowledge",
  intermediate: "intermediate learner with foundational knowledge",
  advanced: "advanced learner who wants nuance and depth",
};

export type VisionCourseInput = {
  imageDataUrl: string; // data:image/jpeg;base64,... or http URL
  language: Language;
  depth: 5 | 8 | 12;
  level: "beginner" | "intermediate" | "advanced";
  userHint?: string;
};

const SYSTEM_PROMPT = `You are an expert curriculum designer working with a learner's uploaded image. The image might be a textbook page, a diagram, an object, a chart, a piece of art, code, a sign — anything they want to understand.

Your job: figure out what's worth learning from this image and design a Duolingo-style course about it.

Rules for the course:
- Identify the SPECIFIC subject in the image. If it's a textbook on photosynthesis, the course is about photosynthesis. If it's a wiring diagram, the course is about that circuit type.
- Each lesson has a memorable title (not "Lesson 1: Introduction").
- Each lesson has a one-sentence summary and 2-4 concrete learning objectives written as observable behaviors ("Identify X", "Apply Y to Z").
- Pick a single emoji that visually represents the course.

LESSON PROGRESSION — the most important rule:
- Lesson 1 teaches the SINGLE smallest big idea everything else depends on. NOT history, NOT a generic introduction.
- Each subsequent lesson adds ONE new layer that builds on the previous.
- The final lesson is application or synthesis — not new theory.
- A learner finishing lesson 1 should be able to say one specific true thing they couldn't say before. Same for every lesson.
- Anti-pattern: "Lesson 1: Background. Lesson 2: Key concepts. Lesson 3: Advanced." That's a textbook table of contents.
- Better pattern: each lesson is a self-contained "aha" moment, in the order an expert teacher would deliver them.

OUTPUT FORMAT — return ONLY a single JSON object, no markdown, no commentary, matching this exact shape:

{
  "title": "Engaging 3-8 word course title",
  "description": "2-3 sentence motivating description (specific, references what's in the image)",
  "emoji": "single emoji",
  "lessons": [
    {
      "title": "...",
      "summary": "...",
      "objectives": ["...", "...", "..."]
    }
  ]
}

VOICE — write like a sharp human teacher, not a press release:
NEVER use: delve, leverage, robust, comprehensive, cutting-edge, pivotal, seamless, utilize, vibrant, thriving, showcasing, intricate, holistic, actionable, learnings, paradigm, ecosystem (as metaphor), nestled, deep dive, embark, in order to, due to the fact that, serves as.
NEVER write: "In today's X", "Let's explore", "In conclusion", "Moreover", "Furthermore".`;

function unfenceJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*\n([\s\S]*?)\n```$/);
  if (fenced) return fenced[1].trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace > 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

export async function generateCourseFromImage(input: VisionCourseInput): Promise<{
  outline: CourseOutline;
  inferredTopic: string;
}> {
  const langLabel = LANG_LABEL[input.language] ?? input.language;
  const levelLabel = LEVEL_LABEL[input.level] ?? input.level;

  const userPrompt = `Look at the attached image and design a course about its subject.

Course parameters:
- Audience: ${levelLabel}
- Number of lessons: exactly ${input.depth}
- Output language: ${langLabel}
${input.userHint ? `- Learner's hint: "${input.userHint}"` : ""}

Return the JSON object now. No markdown, no commentary, just the JSON.`;

  const result = await generateText({
    model: getVisionModel(),
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", image: input.imageDataUrl },
          { type: "text", text: userPrompt },
        ],
      },
    ],
    temperature: 0.7,
    maxOutputTokens: 4000,
  });

  const cleaned = unfenceJson(result.text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Gemma 4 returned non-JSON output. First 200 chars: ${result.text.slice(0, 200)}`,
    );
  }

  const validated = CourseOutlineSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error(
      `Gemma 4 output didn't match schema. Issues: ${JSON.stringify(validated.error.issues.slice(0, 3))}`,
    );
  }

  const outline: CourseOutline = {
    ...validated.data,
    lessons: validated.data.lessons.slice(0, input.depth),
  };

  return {
    outline,
    inferredTopic: outline.title,
  };
}
