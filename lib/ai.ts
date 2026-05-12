import { generateObject, type LanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  CourseOutlineSchema,
  LessonContentSchema,
  type CourseInput,
  type CourseOutline,
  type LessonContent,
  type LessonOutline,
} from "./schemas";

/**
 * Model resolution priority:
 *   1. AI_MODEL env (e.g., "google/gemma-4-26b-a4b-it") — explicit override
 *   2. AI_GATEWAY_API_KEY or running on Vercel → default via Gateway
 *   3. ANTHROPIC_API_KEY → direct Anthropic provider
 *   4. Throw a friendly error
 *
 * For the Gemma 4 Good Hackathon, set AI_MODEL=google/gemma-4-26b-a4b-it
 * (or 31b-it for higher quality) and the entire app generates with Gemma.
 * Gemma 4 supports structured JSON output, function calling, and vision
 * via the same AI SDK interface — no code changes beyond the model id.
 */
function resolveModel(): LanguageModel | string {
  const explicit = process.env.AI_MODEL;
  if (explicit) return explicit;
  if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL) {
    return DEFAULT_GATEWAY_MODEL;
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-5-20250929");
  }
  throw new Error(
    "No AI credentials. Set AI_GATEWAY_API_KEY (recommended) or ANTHROPIC_API_KEY in .env.local.",
  );
}

// Default text model. Override with AI_MODEL env. For the Gemma 4 hackathon
// build, ship with Gemma. For other contexts, Claude Sonnet stays solid.
const DEFAULT_GATEWAY_MODEL = process.env.AI_PRIMARY === "gemma"
  ? "google/gemma-4-26b-a4b-it"
  : "anthropic/claude-sonnet-4-6";

/**
 * Multimodal model — needs vision (image input). Gemma 4 supports this natively
 * on both 31B-it and 26B-a4b-it. Used by /api/courses/from-image.
 */
export const VISION_MODEL =
  process.env.AI_VISION_MODEL || "google/gemma-4-26b-a4b-it";

export function getActiveModelLabel(): string {
  const m = resolveModel();
  return typeof m === "string" ? m : "anthropic-direct";
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

/**
 * Voice rules pulled from avoid-ai-writing (conorbronsdon). The model is
 * the primary author of every lesson the user reads, so the prompt has to
 * specify what NOT to do explicitly — otherwise Claude defaults to the
 * polished-blog voice that screams "AI wrote this."
 */
const VOICE_RULES = `Voice — write like a sharp human teacher, not like a press release:

NEVER use: delve, leverage, robust, comprehensive, cutting-edge, pivotal, seamless, utilize, vibrant, thriving, showcasing, intricate, ever-evolving, holistic, actionable, impactful, learnings, synergy, harness, foster, elevate, unleash, empower, navigate, streamline, multifaceted, ecosystem (as a metaphor), myriad, plethora, paradigm, realm, tapestry, beacon, nestled, bustling, deep dive, unpack, embark, commence, ascertain, endeavor, testament to, paramount, poised to, burgeoning, transformative, game-changer, in order to (use "to"), due to the fact that (use "because"), serves as (use "is"), features as a verb (use "has"), boasts.

NEVER write: "In today's [X]", "In an era where", "It's worth noting that", "Let's explore/dive/look at", "In conclusion", "In summary", "Moreover", "Furthermore", "Additionally" (restructure instead), "The future looks bright", "Only time will tell", "At the end of the day", "When it comes to [X]", "Whether you're an X or a Y", "I hope this helps", "Great question", "Let me break this down".

AVOID: em dashes (use commas or periods or parentheses), bold for emphasis (rewrite the sentence instead), all-bullet-list explanations (use prose paragraphs unless the content is genuinely list-shaped), rhetorical questions as section openers ("But what does this mean?"), three-item parallel structures every time ("X, Y, and Z" everywhere is metronomic).

DO: vary sentence length deliberately — mix short punchy sentences (3-8 words) with longer ones (20+). Use "is" and "has" when they fit. Repeat the right word instead of cycling synonyms. State the point first, evidence second. Use specific examples with real names, numbers, places — not "a developer" or "a company." If a sentence still works after deleting an adjective, delete it.

If writing in Russian, also avoid: "в современном мире", "в эпоху", "стоит отметить", "в данной статье", "следует подчеркнуть", "однако следует помнить", "тем не менее", and "таким образом" as conclusion-fillers.

If writing in Turkish, also avoid: "günümüzde", "bu makalede ele alacağız", "belirtmek gerekir ki", "sonuç olarak" as a generic closer.`;

export async function generateCourseOutline(input: CourseInput): Promise<CourseOutline> {
  const { topic, level, depth, language } = input;
  const langLabel = LANG_LABEL[language] ?? language;
  const levelLabel = LEVEL_LABEL[level] ?? level;

  const system = `You are an expert curriculum designer creating bite-sized learning paths in the spirit of Duolingo.

Your courses are:
- Progressive: each lesson assumes only the previous ones
- Concrete, not generic: every lesson teaches a specific skill or insight, never a vague "introduction to X"
- Intriguing: titles are memorable. Not "Lesson 1: Introduction" but "Why your brain craves rewards"
- Useful: a learner can apply what they learn

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
    model: resolveModel(),
    schema: CourseOutlineSchema,
    system,
    prompt,
    temperature: 0.7,
  });

  return { ...object, lessons: object.lessons.slice(0, depth) };
}

export async function generateLessonContent(args: {
  courseTitle: string;
  courseTopic: string;
  level: string;
  language: string;
  lesson: LessonOutline;
  previousLessonTitles: string[];
}): Promise<LessonContent> {
  const { courseTitle, courseTopic, level, language, lesson, previousLessonTitles } = args;
  const langLabel = LANG_LABEL[language] ?? language;
  const levelLabel = LEVEL_LABEL[level] ?? level;

  const system = `You are an expert teacher writing a single bite-sized lesson in a Duolingo-style course.

Your lessons:
- Teach through concrete examples with real names, places, numbers — never "a person" or "a company"
- Use clear, conversational language at the right level for the audience
- Test understanding through varied, engaging exercises — not just multiple choice
- Are memorable: the learner walks away with something specific they couldn't do before

${VOICE_RULES}

ALL output text (lesson content, questions, answers, explanations, options) MUST be in ${langLabel}.`;

  const prevContext = previousLessonTitles.length
    ? `\nPrevious lessons in this course (the learner already knows this):\n${previousLessonTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
    : "";

  const prompt = `Write the content for ONE lesson in the course "${courseTitle}" (topic: ${courseTopic}).

Lesson: "${lesson.title}"
Summary: ${lesson.summary}
Objectives:
${lesson.objectives.map((o) => `- ${o}`).join("\n")}

Audience: ${levelLabel}
Output language: ${langLabel}
${prevContext}

Produce:
1. 2-4 content blocks teaching the concepts. Mix "concept" blocks (clear explanations) and "example" blocks (concrete worked examples with specific names/situations). Vary block length: some short and punchy, some longer. Use markdown sparingly — bold one phrase per block at most.
2. 4-6 exercises that genuinely test the lesson's objectives. USE A MIX of types — include at least 3 different exercise types from: multiple_choice, fill_blank, true_false, matching, order. Each exercise should test the lesson's specific content, never generic knowledge.

Quality bar:
- Multiple choice: all 4 options plausible. The wrong ones are real misconceptions a learner might hold, not strawmen.
- Fill blank: the blank tests a concept, not trivia. Use ONE ___ per sentence. The answer is one or two words.
- True/false: the answer is defensible from the content. No ambiguity, no opinion.
- Matching: pairs are conceptually related. Bad pairs (left + wrong right) should be plausible distractors.
- Order: a real sequence the learner has to reason through — process steps, historical events, logical progression.`;

  const { object } = await generateObject({
    model: resolveModel(),
    schema: LessonContentSchema,
    system,
    prompt,
    temperature: 0.7,
  });

  return object;
}
