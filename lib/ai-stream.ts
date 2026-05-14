import { streamObject, type LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import {
  CourseOutlineSchema,
  type CourseInput,
  type CourseOutline,
} from "./schemas";

/**
 * Streaming course outline generation. Gemini 2.5 Flash with strict-schema
 * mode handles partial object streaming cleanly, so the UI lights up
 * lesson-by-lesson as the model emits.
 */

const DEFAULT_TEXT_MODEL = "gemini-2.5-flash";
const TEXT_MODEL_ID = process.env.AI_MODEL || DEFAULT_TEXT_MODEL;

function getModel(): LanguageModel {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google(TEXT_MODEL_ID);
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-5-20250929");
  }
  throw new Error(
    "No AI credentials. Set GOOGLE_GENERATIVE_AI_API_KEY in .env.local.",
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

const VOICE_RULES = `Voice — write like a sharp human teacher, not like a press release:

NEVER use: delve, leverage, robust, comprehensive, cutting-edge, pivotal, seamless, utilize, vibrant, thriving, showcasing, intricate, ever-evolving, holistic, actionable, impactful, learnings, synergy, harness, foster, elevate, unleash, empower, navigate, streamline, multifaceted, ecosystem (as a metaphor), myriad, plethora, paradigm, realm, tapestry, beacon, nestled, bustling, deep dive, unpack, embark, commence, ascertain, endeavor, testament to, paramount, poised to, burgeoning, transformative, game-changer, in order to (use "to"), due to the fact that (use "because"), serves as (use "is"), features as a verb (use "has"), boasts.

NEVER write: "In today's [X]", "In an era where", "It's worth noting that", "Let's explore/dive/look at", "In conclusion", "In summary", "Moreover", "Furthermore", "Additionally", "The future looks bright", "Only time will tell", "At the end of the day", "When it comes to [X]", "Whether you're an X or a Y".

AVOID: em dashes, bold for emphasis, all-bullet-list explanations, rhetorical questions as section openers, three-item parallel structures every time.

If writing in Russian, also avoid: "в современном мире", "в эпоху", "стоит отметить", "в данной статье", "следует подчеркнуть", "однако следует помнить", "тем не менее", "таким образом" as conclusion-filler.

If writing in Turkish, also avoid: "günümüzde", "bu makalede ele alacağız", "belirtmek gerekir ki", "sonuç olarak" as a generic closer.`;

const PROGRESSION_RULES = `LESSON PROGRESSION — the most important rule:
- Lesson 1 teaches the SINGLE smallest big idea everything else depends on. NOT history, NOT a generic introduction.
- Each subsequent lesson adds ONE new layer that builds on the previous.
- The final lesson is application or synthesis — not new theory.
- A learner finishing lesson 1 should be able to say one specific true thing they couldn't say before. Same for every lesson.
- Anti-pattern: "Lesson 1: Background. Lesson 2: Key concepts. Lesson 3: Advanced." That's a textbook table of contents.
- Better pattern: each lesson is a self-contained "aha" moment, in the order an expert teacher would deliver them.`;

function buildPrompts(input: CourseInput): { system: string; prompt: string } {
  const { topic, level, depth, language } = input;
  const langLabel = LANG_LABEL[language] ?? language;
  const levelLabel = LEVEL_LABEL[level] ?? level;

  const system = `You are an expert curriculum designer creating bite-sized learning paths in the spirit of Duolingo.

${PROGRESSION_RULES}

${VOICE_RULES}

ALL output text (titles, descriptions, summaries, objectives) MUST be in ${langLabel}.`;

  const prompt = `Create a structured course outline.

Topic: "${topic}"
Audience: ${levelLabel}
Number of lessons: exactly ${depth}
Output language: ${langLabel}

Design ${depth} lessons that take the learner from zero to competence. Each lesson:
- Specific, intriguing title (not a generic label)
- One-sentence summary
- 2-4 observable-behavior objectives

Pick a single emoji that represents the course visually.`;

  return { system, prompt };
}

type StreamResult = {
  partialObjectStream: AsyncIterable<Partial<CourseOutline>>;
  object: Promise<CourseOutline>;
};

/**
 * Real streamObject — Gemini Flash supports strict-schema streaming, so
 * the client sees lesson titles appear one-by-one as the model emits them.
 */
export function streamCourseOutline(input: CourseInput): StreamResult {
  const { system, prompt } = buildPrompts(input);
  const model = getModel();

  const stream = streamObject({
    model,
    schema: CourseOutlineSchema,
    system,
    prompt,
    temperature: 0.7,
  });

  // Clamp lessons to requested depth in the final object
  const finalObject = stream.object.then((o) => ({
    ...(o as CourseOutline),
    lessons: (o as CourseOutline).lessons.slice(0, input.depth),
  }));

  return {
    partialObjectStream: stream.partialObjectStream as AsyncIterable<Partial<CourseOutline>>,
    object: finalObject,
  };
}
