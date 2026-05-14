import { generateText, type LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import {
  CourseOutlineSchema,
  type CourseInput,
  type CourseOutline,
} from "./schemas";
import { extractJson } from "./json-extract";

/**
 * Streaming course outline generation with Gemma 4 as primary model.
 *
 * Strategy:
 *   1. Try streamObject — when it works, the UI lights up lesson-by-lesson.
 *   2. On schema failure, fall back to generateText + manual JSON parse and
 *      emit the completed object in one shot. The user still sees the
 *      finished course, just without the live build-up.
 *
 * Caller (app/api/courses/stream/route.ts) consumes `partialObjectStream`
 * and finally awaits `object`. We expose those same surfaces here.
 */

const TEXT_MODEL_ID = process.env.AI_MODEL || "gemma-4-26b-a4b-it";

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

AVOID: em dashes (use commas or periods or parentheses), bold for emphasis, all-bullet-list explanations, rhetorical questions as section openers, three-item parallel structures every time.

If writing in Russian, also avoid: "в современном мире", "в эпоху", "стоит отметить", "в данной статье", "следует подчеркнуть", "однако следует помнить", "тем не менее", "таким образом" as conclusion-filler.

If writing in Turkish, also avoid: "günümüzde", "bu makalede ele alacağız", "belirtmek gerekir ki", "sonuç olarak" as a generic closer.

CRITICAL — RESPONSE FORMAT:
Return ONLY a single JSON object matching the schema. NO markdown fences. NO reasoning steps. NO "Question: ..." or "Constraint 1: ..." or "Let me think step by step" preambles. Start your response with { and end with }. Nothing else.`;

const PROGRESSION_RULES = `LESSON PROGRESSION — the most important rule:

A good course unfolds like a story, not a textbook. Each lesson rests on the previous and prepares the next. Beginners learn one foundational idea at a time, not a comprehensive overview.

- Lesson 1 teaches the SINGLE smallest big idea everything else depends on. Pick the insight that, once internalized, makes lessons 2-N obvious. NOT a generic introduction or history dump.
- Each subsequent lesson adds ONE new layer. Never reach for a concept that will be a later lesson's topic.
- The final lesson is application, synthesis, or putting pieces together — not new theory.
- A learner ending lesson 1 should be able to say one specific true thing they couldn't say before. Same for every lesson.

Anti-pattern to avoid: "Lesson 1: History and background. Lesson 2: Key concepts. Lesson 3: Advanced applications." This is a textbook table of contents, not a learning path.

Better pattern: each lesson is a self-contained "aha" moment that an expert tutor would deliver in 5 minutes, in the right order.`;

function buildPrompts(input: CourseInput): { system: string; prompt: string } {
  const { topic, level, depth, language } = input;
  const langLabel = LANG_LABEL[language] ?? language;
  const levelLabel = LEVEL_LABEL[level] ?? level;

  const system = `You are an expert curriculum designer creating bite-sized learning paths in the spirit of Duolingo.

Your courses are:
- Progressive: each lesson assumes only the previous ones, never the next
- Concrete, not generic: every lesson teaches a specific skill or insight, never a vague "introduction to X"
- Intriguing: titles are memorable. Not "Lesson 1: Introduction" but "Why your brain craves rewards"
- Useful: a learner can apply what they learn

${PROGRESSION_RULES}

${VOICE_RULES}

ALL output text (titles, descriptions, summaries, objectives) MUST be in ${langLabel}.`;

  const prompt = `Create a structured course outline.

Topic: "${topic}"
Audience: ${levelLabel}
Number of lessons: exactly ${depth}
Output language: ${langLabel}

Design ${depth} lessons that take the learner from where they are now to real competence in this topic. Each lesson must:
- Have a specific, intriguing title (not a generic label)
- Have a one-sentence summary of the takeaway
- List 2-4 concrete learning objectives written as observable behaviors

Pick a single emoji that represents the course visually.

OUTPUT JSON MATCHING EXACTLY THIS SHAPE (use these exact field names, content text in ${langLabel}):

{
  "title": "engaging 3-8 word course title",
  "description": "2-3 sentence motivating description",
  "emoji": "📚",
  "lessons": [
    {
      "title": "memorable 2-6 word lesson title",
      "summary": "one sentence summary",
      "objectives": ["observable behavior", "second one"]
    }
  ]
}

Field names MUST be: "title", "description", "emoji", "lessons", and inside each lesson: "title", "summary", "objectives". Do NOT rename to course_title or similar. Output ONLY the JSON, nothing else.`;

  return { system, prompt };
}

type StreamResult = {
  partialObjectStream: AsyncIterable<Partial<CourseOutline>>;
  object: Promise<CourseOutline>;
};

/**
 * Gemma 4 doesn't deliver true partial JSON via the SDK reliably — its
 * output stream is reasoning text first, JSON last. So we do a single
 * generateText call with a big token budget, then emit one synthetic
 * "done" partial. The UI still gets a finished course, just not the
 * lesson-by-lesson live build.
 */
export function streamCourseOutline(input: CourseInput): StreamResult {
  const { system, prompt } = buildPrompts(input);
  const model = getModel();

  let resolveObject: (v: CourseOutline) => void;
  let rejectObject: (err: Error) => void;
  const objectPromise = new Promise<CourseOutline>((res, rej) => {
    resolveObject = res;
    rejectObject = rej;
  });

  async function* iterate(): AsyncIterable<Partial<CourseOutline>> {
    try {
      const { text } = await generateText({
        model,
        system,
        prompt,
        temperature: 0.7,
        maxOutputTokens: 16000,
        maxRetries: 1,
      });
      console.log(`[mnemo:ai-stream] Gemma output length: ${text.length}, last 200: ${text.slice(-200)}`);
      const cleaned = extractJson(text);
      const parsed = JSON.parse(cleaned);
      const validated = CourseOutlineSchema.parse(parsed);
      const final: CourseOutline = {
        ...validated,
        lessons: validated.lessons.slice(0, input.depth),
      };
      yield final;
      resolveObject(final);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.warn("[mnemo:ai-stream] Gemma generation failed:", err.message.slice(0, 200));
      rejectObject(err);
      throw err;
    }
  }

  return {
    partialObjectStream: iterate(),
    object: objectPromise,
  };
}
