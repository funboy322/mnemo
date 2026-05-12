import { generateObject, generateText, type LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import {
  CourseOutlineSchema,
  LessonContentSchema,
  type CourseInput,
  type CourseOutline,
  type LessonContent,
  type LessonOutline,
} from "./schemas";
import { extractJson } from "./json-extract";

/**
 * Mnemo is a Gemma 4 Good Hackathon submission. All AI work routes through
 * Gemma 4 26B-a4b-it (open-weights, Apache 2.0) by default, via Google AI
 * Studio. Other models are kept as escape hatches for development.
 *
 * Why two code paths (generateObject + generateText fallback)?
 * Open-weights models occasionally fail strict tool/schema mode in the AI SDK.
 * generateObject is tried first (faster, cleaner). If schema validation fails,
 * we fall back to generateText + manual JSON parse + Zod validate. The
 * fallback is what powers the photo→course feature in lib/ai-vision.ts and
 * we use the same trick here for text courses.
 */

const TEXT_MODEL_ID = process.env.AI_MODEL || "gemma-4-26b-a4b-it";
const FALLBACK_MODEL_ID = process.env.AI_FALLBACK_MODEL; // optional Claude fallback

function getModel(): LanguageModel {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google(TEXT_MODEL_ID);
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-5-20250929");
  }
  throw new Error(
    "No AI credentials. Set GOOGLE_GENERATIVE_AI_API_KEY (recommended) or ANTHROPIC_API_KEY in .env.local.",
  );
}

function getFallbackModel(): LanguageModel | null {
  if (!FALLBACK_MODEL_ID) return null;
  if (FALLBACK_MODEL_ID.startsWith("claude") && process.env.ANTHROPIC_API_KEY) {
    return anthropic(FALLBACK_MODEL_ID);
  }
  return null;
}

const LANG_LABEL: Record<string, string> = {
  ru: "Russian (русский)",
  en: "English",
  tr: "Turkish (Türkçe)",
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "complete beginner with no prior knowledge",
  intermediate: "intermediate learner with foundational knowledge",
  advanced: "advanced learner who wants nuance and depth",
};

const VOICE_RULES = `Voice — write like a sharp human teacher, not like a press release:

NEVER use: delve, leverage, robust, comprehensive, cutting-edge, pivotal, seamless, utilize, vibrant, thriving, showcasing, intricate, ever-evolving, holistic, actionable, impactful, learnings, synergy, harness, foster, elevate, unleash, empower, navigate, streamline, multifaceted, ecosystem (as a metaphor), myriad, plethora, paradigm, realm, tapestry, beacon, nestled, bustling, deep dive, unpack, embark, commence, ascertain, endeavor, testament to, paramount, poised to, burgeoning, transformative, game-changer, in order to (use "to"), due to the fact that (use "because"), serves as (use "is"), features as a verb (use "has"), boasts.

NEVER write: "In today's [X]", "In an era where", "It's worth noting that", "Let's explore/dive/look at", "In conclusion", "In summary", "Moreover", "Furthermore", "Additionally" (restructure instead), "The future looks bright", "Only time will tell", "At the end of the day", "When it comes to [X]", "Whether you're an X or a Y", "I hope this helps", "Great question", "Let me break this down".

AVOID: em dashes (use commas or periods or parentheses), bold for emphasis (rewrite the sentence instead), all-bullet-list explanations, rhetorical questions as section openers, three-item parallel structures every time.

DO: vary sentence length deliberately — mix short punchy sentences (3-8 words) with longer ones (20+). Use "is" and "has" when they fit. Repeat the right word instead of cycling synonyms. State the point first, evidence second. Use specific examples with real names, numbers, places.

If writing in Russian, also avoid: "в современном мире", "в эпоху", "стоит отметить", "в данной статье", "следует подчеркнуть", "однако следует помнить", "тем не менее", "таким образом" as conclusion-fillers.

If writing in Turkish, also avoid: "günümüzde", "bu makalede ele alacağız", "belirtmek gerekir ki", "sonuç olarak" as a generic closer.

CRITICAL — RESPONSE FORMAT:
Return ONLY a single JSON object matching the schema. NO markdown fences. NO reasoning steps. NO "Question: ..." or "Constraint 1: ..." or "Let me think step by step" preambles. Start your response with { and end with }. Nothing else.`;

/**
 * Generate text via Gemma 4 + parse JSON + validate against Zod schema.
 *
 * Gemma 4 reasons explicitly (thoughtsTokenCount comes back > 0), so we give
 * it generous room: 16000 maxOutputTokens. The visible text intermixes
 * reasoning with a fenced ```json``` block — extractJson finds it.
 *
 * Escape hatch: if a fallback model (Claude) is configured, use it on
 * failure. By default no fallback.
 */
async function generateWithSchema<T extends z.ZodTypeAny>(args: {
  schema: T;
  system: string;
  prompt: string;
  temperature?: number;
}): Promise<z.infer<T>> {
  const { schema, system, prompt, temperature = 0.7 } = args;

  try {
    const { text } = await generateText({
      model: getModel(),
      system,
      prompt,
      temperature,
      maxOutputTokens: 16000,
      maxRetries: 1,
    });
    console.log(`[mnemo:ai] Gemma raw output (first 300 chars): ${text.slice(0, 300)}`);
    console.log(`[mnemo:ai] Gemma raw output (last 300 chars): ${text.slice(-300)}`);
    const cleaned = extractJson(text);
    console.log(`[mnemo:ai] Extracted JSON (first 300 chars): ${cleaned.slice(0, 300)}`);
    const parsed = JSON.parse(cleaned);
    return schema.parse(parsed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[mnemo:ai] Gemma generation failed:", msg.slice(0, 200));

    const fb = getFallbackModel();
    if (fb) {
      console.warn("[mnemo:ai] using fallback model");
      const { object } = await generateObject({
        model: fb,
        schema,
        system,
        prompt,
        temperature,
      });
      return object as z.infer<T>;
    }
    throw err;
  }
}

const COURSE_OUTLINE_TEMPLATE = `{
  "title": "engaging 3-8 word course title",
  "description": "2-3 sentence motivating description of what the learner will gain",
  "emoji": "📚",
  "lessons": [
    {
      "title": "memorable 2-6 word lesson title",
      "summary": "one sentence summary of the takeaway",
      "objectives": [
        "observable behavior the learner will demonstrate",
        "second observable behavior"
      ]
    }
  ]
}`;

const PROGRESSION_RULES = `LESSON PROGRESSION — the most important rule:

A good course unfolds like a story, not a textbook. Each lesson rests on the previous and prepares the next. Beginners learn one foundational idea at a time, not a comprehensive overview.

- Lesson 1 teaches the SINGLE smallest big idea everything else depends on. Pick the insight that, once internalized, makes lessons 2-N obvious. NOT a generic introduction or history dump.
- Each subsequent lesson adds ONE new layer. Never reach for a concept that will be a later lesson's topic.
- The final lesson is application, synthesis, or putting pieces together — not new theory.
- A learner ending lesson 1 should be able to say one specific true thing they couldn't say before. Same for every lesson.

Anti-pattern to avoid: "Lesson 1: History and background. Lesson 2: Key concepts. Lesson 3: Advanced applications." This is a textbook table of contents, not a learning path. It dumps context the learner has no reason to care about yet.

Better pattern: each lesson is a self-contained "aha" moment that an expert tutor would deliver in 5 minutes, in the right order.`;

export async function generateCourseOutline(input: CourseInput): Promise<CourseOutline> {
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
- List 2-4 concrete learning objectives written as observable behaviors ("Identify X", "Apply Y to Z"), not vague verbs ("understand", "be aware of")

Pick a single emoji that represents the course visually.

OUTPUT JSON MATCHING EXACTLY THIS SHAPE (use these exact field names, English keys, content text in ${langLabel}):

${COURSE_OUTLINE_TEMPLATE}

Field names MUST be: "title", "description", "emoji", "lessons", and inside each lesson: "title", "summary", "objectives". Do NOT rename them. Output ONLY the JSON object, nothing else.`;

  const outline = await generateWithSchema({
    schema: CourseOutlineSchema,
    system,
    prompt,
  });
  return { ...outline, lessons: outline.lessons.slice(0, depth) };
}

const LESSON_PEDAGOGY = `PEDAGOGY — the most important rule:

This is ONE lesson, not a chapter. The learner has 5 minutes. Teach exactly enough that they can do what the objectives say, no more.

- Each content block introduces ONE new idea. If a concept has 3 parts, use 3 blocks. Never cram three points into one block.
- The FIRST block hooks: a surprising claim, a vivid question, a concrete situation. NOT a definition or history. Definitions come after the hook makes the learner want one.
- Each block builds on the previous block in this lesson, AND on previous lessons. Never reach into a future lesson's territory.
- Address the learner directly ("you", "your"). Not "students" or "people".
- Concrete examples have real names, real numbers, real places. Never "a person" or "imagine a company".
- Don't restate the lesson summary inside the blocks. The summary is for navigation; blocks are for teaching.
- Short blocks beat long ones. 2-4 sentences each is the target. If a block goes past 6 sentences, it's two blocks.

Exercises must test EXACTLY what THIS lesson's blocks taught. Never test:
- material from earlier lessons (that's review mode's job)
- material a future lesson will teach
- generic knowledge unrelated to this lesson's specific framing

If the learner reads the blocks once, the exercises should be doable. If they're not, your blocks didn't teach enough; rewrite them, don't pad the exercises.`;

export async function generateLessonContent(args: {
  courseTitle: string;
  courseTopic: string;
  level: string;
  language: string;
  lesson: LessonOutline;
  previousLessonTitles: string[];
  lessonNumber?: number;
  totalLessons?: number;
}): Promise<LessonContent> {
  const { courseTitle, courseTopic, level, language, lesson, previousLessonTitles } = args;
  const langLabel = LANG_LABEL[language] ?? language;
  const levelLabel = LEVEL_LABEL[level] ?? level;
  const lessonNumber = args.lessonNumber ?? previousLessonTitles.length + 1;
  const totalLessons = args.totalLessons ?? previousLessonTitles.length + 1;

  const system = `You are an expert teacher writing a single bite-sized lesson in a Duolingo-style course.

Your lessons:
- Teach through concrete examples with real names, places, numbers — never "a person" or "a company"
- Use clear, conversational language at the right level for the audience
- Test understanding through varied, engaging exercises — not just multiple choice
- Are memorable: the learner walks away with something specific they couldn't do before

${LESSON_PEDAGOGY}

${VOICE_RULES}

ALL output text (lesson content, questions, answers, explanations, options) MUST be in ${langLabel}.`;

  const prevContext = previousLessonTitles.length
    ? `\nWhat the learner already covered (lessons before this one):\n${previousLessonTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nYou can reference these. Don't re-teach them — assume the learner remembers.`
    : `\nThis is the FIRST lesson. The learner knows nothing about this topic yet. Start from zero.`;

  const prompt = `Write the content for lesson ${lessonNumber} of ${totalLessons} in the course "${courseTitle}" (topic: ${courseTopic}).

Lesson: "${lesson.title}"
Summary: ${lesson.summary}
Objectives:
${lesson.objectives.map((o) => `- ${o}`).join("\n")}

Audience: ${levelLabel}
Output language: ${langLabel}
${prevContext}

Produce:
1. 2-4 content blocks teaching ONLY what this lesson's objectives require. ONE new idea per block. Short blocks (2-4 sentences each). Mix "concept" blocks and "example" blocks. The FIRST block hooks — surprising claim, vivid question, or a concrete moment. NOT a definition.
2. 4-6 exercises that test EXACTLY what the blocks above just taught. USE A MIX of types — include at least 3 different exercise types from: multiple_choice, fill_blank, true_false, matching, order. Each exercise must be answerable from the blocks alone — never from outside knowledge.

OUTPUT JSON MATCHING EXACTLY THIS SHAPE:

{
  "blocks": [
    {"type": "concept", "heading": "...", "body": "...", "keyPoints": ["..."]},
    {"type": "example", "heading": "...", "body": "..."}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "...", "options": ["a","b","c","d"], "correctIndex": 0, "explanation": "..."},
    {"type": "fill_blank", "sentence": "Word with ___ blank.", "answer": "...", "acceptableAlternatives": [], "explanation": "..."},
    {"type": "true_false", "statement": "...", "isTrue": true, "explanation": "..."},
    {"type": "matching", "prompt": "...", "pairs": [{"left": "...", "right": "..."}]},
    {"type": "order", "prompt": "...", "items": ["step 1", "step 2"], "explanation": "..."}
  ]
}

Use EXACTLY these field names. Each exercise object must have a "type" discriminator field. Output ONLY the JSON, nothing else.

Quality bar:
- Multiple choice: all 4 options plausible. The wrong ones are real misconceptions a learner might hold, not strawmen.
- Fill blank: the blank tests a concept, not trivia. Use ONE ___ per sentence. The answer is one or two words.
- True/false: the answer is defensible from the content. No ambiguity, no opinion.
- Matching: pairs are conceptually related. 3-5 pairs.
- Order: a real sequence the learner has to reason through. Items in the CORRECT order.`;

  return generateWithSchema({
    schema: LessonContentSchema,
    system,
    prompt,
  });
}
