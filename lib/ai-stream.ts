import { streamObject, type LanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  CourseOutlineSchema,
  type CourseInput,
} from "./schemas";

function resolveModel(): LanguageModel | string {
  const explicit = process.env.AI_MODEL;
  if (explicit) return explicit;
  if (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL) {
    return "anthropic/claude-sonnet-4-6";
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-5-20250929");
  }
  throw new Error(
    "No AI credentials. Set AI_GATEWAY_API_KEY (recommended) or ANTHROPIC_API_KEY in .env.local.",
  );
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

AVOID: em dashes (use commas or periods or parentheses), bold for emphasis, all-bullet-list explanations, rhetorical questions as section openers, three-item parallel structures every time.

If writing in Russian, also avoid: "в современном мире", "в эпоху", "стоит отметить", "в данной статье", "следует подчеркнуть", "однако следует помнить", "тем не менее", "таким образом" as conclusion-filler.

If writing in Turkish, also avoid: "günümüzde", "bu makalede ele alacağız", "belirtmek gerekir ki", "sonuç olarak" as a generic closer.`;

/**
 * Returns the streaming result for a course outline. Caller is responsible
 * for consuming `partialObjectStream` and `object` (final).
 */
export function streamCourseOutline(input: CourseInput) {
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

  return streamObject({
    model: resolveModel(),
    schema: CourseOutlineSchema,
    system,
    prompt,
    temperature: 0.7,
  });
}
