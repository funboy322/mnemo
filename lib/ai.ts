import { generateObject, generateText, type LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
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
 * Text generation routing for Mnemo.
 *
 * Default: gemini-2.5-flash (Google AI Studio direct) — fast structured
 * output, ~5-10s per course. Same API key as Gemma 4 vision.
 *
 * Why not Gemma 4 for text by default? Gemma 4 spends 60-120s reasoning
 * before emitting JSON — that's the model's design (open-weights with
 * explicit reasoning traces) but it kills the interactive UX. For a
 * Duolingo-style app where the user expects "create course → seconds → go",
 * Gemini Flash is the right tool for *text* generation.
 *
 * Gemma 4's actual showcase in this app is photo→course (lib/ai-vision.ts).
 * That's where it earns its keep: open-weights multimodal vision a closed
 * API can't match for free. The text path is supplementary.
 *
 * Opt back into Gemma for text via env: AI_MODEL=gemma-4-26b-a4b-it.
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

NEVER write: "In today's [X]", "In an era where", "It's worth noting that", "Let's explore/dive/look at", "In conclusion", "In summary", "Moreover", "Furthermore", "Additionally" (restructure instead), "The future looks bright", "Only time will tell", "At the end of the day", "When it comes to [X]", "Whether you're an X or a Y", "I hope this helps", "Great question", "Let me break this down".

AVOID: em dashes (use commas or periods or parentheses), bold for emphasis (rewrite the sentence instead), all-bullet-list explanations, rhetorical questions as section openers, three-item parallel structures every time.

DO: vary sentence length deliberately — mix short punchy sentences (3-8 words) with longer ones (20+). Use "is" and "has" when they fit. Repeat the right word instead of cycling synonyms. State the point first, evidence second. Use specific examples with real names, numbers, places.

If writing in Russian, also avoid: "в современном мире", "в эпоху", "стоит отметить", "в данной статье", "следует подчеркнуть", "однако следует помнить", "тем не менее", "таким образом" as conclusion-fillers.

If writing in Turkish, also avoid: "günümüzde", "bu makalede ele alacağız", "belirtmek gerekir ki", "sonuç olarak" as a generic closer.`;

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

Pick a single emoji that represents the course visually.`;

  const { object } = await generateObject({
    model: getModel(),
    schema: CourseOutlineSchema,
    system,
    prompt,
    temperature: 0.7,
  });
  return { ...object, lessons: object.lessons.slice(0, depth) };
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

Quality bar:
- Multiple choice: all 4 options plausible. The wrong ones are real misconceptions a learner might hold, not strawmen.
- Fill blank: the blank tests a concept, not trivia. Use ONE ___ per sentence. The answer is one or two words.
- True/false: the answer is defensible from the content. No ambiguity, no opinion.
- Matching: pairs are conceptually related. EXACTLY 3-5 pairs (never fewer than 3, never more than 5).
- Order: a real sequence the learner has to reason through. EXACTLY 3-5 items in the CORRECT order (never more than 5). If the sequence is naturally longer, pick the 5 most essential steps.`;

  // LessonContentSchema has a discriminated union which Gemini's strict
  // responseSchema mode mistranslates. Show the model an EXACT JSON
  // template in the prompt — much more reliable than schema mode for our
  // shape. Gemini Flash returns this in ~5-10s.
  const jsonTemplate = `{
  "blocks": [
    { "type": "concept", "heading": "...", "body": "...", "keyPoints": ["...", "..."] },
    { "type": "example", "heading": "...", "body": "..." }
  ],
  "exercises": [
    { "type": "multiple_choice", "question": "...", "options": ["a", "b", "c", "d"], "correctIndex": 0, "explanation": "..." },
    { "type": "fill_blank", "sentence": "Text with ___ blank.", "answer": "...", "acceptableAlternatives": [], "explanation": "..." },
    { "type": "true_false", "statement": "...", "isTrue": true, "explanation": "..." },
    { "type": "matching", "prompt": "Match...", "pairs": [{ "left": "A", "right": "1" }, { "left": "B", "right": "2" }, { "left": "C", "right": "3" }] },
    { "type": "order", "prompt": "Order these...", "items": ["first step", "second step", "third step", "fourth step"], "explanation": "..." }
  ]
}`;
  const { text } = await generateText({
    model: getModel(),
    system: system + `\n\nOUTPUT FORMAT — return ONLY a JSON object matching EXACTLY this shape (use these exact field names):\n\n${jsonTemplate}\n\nNo markdown fences, no prose, just the JSON object. Each exercise object MUST have a "type" string discriminator.`,
    prompt: prompt + `\n\nReturn the JSON object now matching the shape shown above.`,
    temperature: 0.7,
    maxOutputTokens: 8000,
  });
  const cleaned = extractJson(text);
  const parsed = JSON.parse(cleaned);
  return LessonContentSchema.parse(parsed);
}
