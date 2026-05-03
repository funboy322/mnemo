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

export async function generateCourseOutline(input: CourseInput): Promise<CourseOutline> {
  const { topic, level, depth, language } = input;
  const langLabel = LANG_LABEL[language] ?? language;
  const levelLabel = LEVEL_LABEL[level] ?? level;

  const system = `You are an expert curriculum designer creating bite-sized, motivating learning paths in the spirit of Duolingo.

You design courses that:
- Build progressively: each lesson assumes only the previous ones
- Are concrete, not generic — every lesson teaches a specific skill or insight, not a vague "introduction to X"
- Have memorable, intriguing titles (not "Lesson 1: Introduction" — instead "Why your brain craves rewards")
- Cover real, useful, actionable content the learner can apply

ALL output text (titles, descriptions, summaries, objectives) MUST be in ${langLabel}.`;

  const prompt = `Create a structured course outline.

Topic: "${topic}"
Audience: ${levelLabel}
Number of lessons: exactly ${depth}
Output language: ${langLabel}

Design ${depth} lessons that take the learner from where they are now to genuine competence in this topic. Each lesson must:
- Have a specific, intriguing title (not a generic label)
- Have a one-sentence summary of the takeaway
- List 2-4 concrete learning objectives

Pick a single emoji that visually represents the course.`;

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

  const system = `You are an expert teacher creating a single bite-sized lesson in a Duolingo-style course.

Your lessons:
- Teach through concrete examples, not abstract definitions
- Use clear, conversational language at the right level for the audience
- Test understanding through varied, engaging exercises (not just multiple choice)
- Are memorable — the learner should walk away with something specific they couldn't do before

ALL output text (lesson content, questions, answers, explanations, options) MUST be in ${langLabel}.`;

  const prevContext = previousLessonTitles.length
    ? `\nPrevious lessons in this course (the learner already knows this):\n${previousLessonTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
    : "";

  const prompt = `Create the content for ONE lesson in the course "${courseTitle}" (topic: ${courseTopic}).

Lesson: "${lesson.title}"
Summary: ${lesson.summary}
Objectives:
${lesson.objectives.map((o) => `- ${o}`).join("\n")}

Audience: ${levelLabel}
Output language: ${langLabel}
${prevContext}

Produce:
1. 2-4 content blocks that teach the concepts. Mix "concept" blocks (clear explanations) and "example" blocks (concrete worked examples). Use markdown sparingly for emphasis.
2. 4-6 exercises that genuinely test the lesson's objectives. USE A MIX of types — include at least 3 different exercise types from: multiple_choice, fill_blank, true_false, matching, order. Make exercises specific to this lesson, not generic.

Quality bar:
- Multiple choice: all 4 options must be plausible — avoid obviously wrong distractors
- Fill blank: the blank should test a concept, not trivia. Use ONE ___ per sentence.
- True/false: avoid ambiguity — the answer must be defensible
- Matching: pairs should be conceptually related, requiring real understanding
- Order: a real sequence (steps in a process, historical events, logical progression)`;

  const { object } = await generateObject({
    model: resolveModel(),
    schema: LessonContentSchema,
    system,
    prompt,
    temperature: 0.7,
  });

  return object;
}
