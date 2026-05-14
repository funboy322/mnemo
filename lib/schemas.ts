import { z } from "zod";

export const LevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export type Level = z.infer<typeof LevelSchema>;

export const LANGUAGES = ["en", "ru", "tr", "es", "hi", "ar"] as const;
export const LanguageSchema = z.enum(LANGUAGES);
export type Language = z.infer<typeof LanguageSchema>;

export const CourseInputSchema = z.object({
  topic: z.string().min(2).max(200),
  level: LevelSchema,
  depth: z.union([z.literal(5), z.literal(8), z.literal(12)]),
  language: LanguageSchema.default("en"),
});
export type CourseInput = z.infer<typeof CourseInputSchema>;

export const LessonOutlineSchema = z.object({
  title: z.string().describe("Catchy 2-6 word lesson title"),
  summary: z.string().describe("One sentence summary of what the learner will know after this lesson"),
  objectives: z.array(z.string()).min(2).max(4).describe("Concrete learning objectives"),
});
export type LessonOutline = z.infer<typeof LessonOutlineSchema>;

export const CourseOutlineSchema = z.object({
  title: z.string().describe("Engaging 3-8 word course title"),
  description: z.string().describe("2-3 sentence motivating description of what the learner will gain"),
  emoji: z.string().describe("Single emoji that represents the course visually"),
  lessons: z.array(LessonOutlineSchema).min(3).max(15).describe("Ordered lesson outlines from simple to advanced, building progressively"),
});
export type CourseOutline = z.infer<typeof CourseOutlineSchema>;

export const ConceptBlockSchema = z.object({
  type: z.literal("concept"),
  heading: z.string().describe("Short heading for this concept"),
  body: z.string().describe("2-5 sentences explaining the concept clearly with concrete examples. Markdown allowed."),
  keyPoints: z.array(z.string()).max(3).optional().describe("Optional 1-3 bullet takeaways"),
});

export const ExampleBlockSchema = z.object({
  type: z.literal("example"),
  heading: z.string().describe("Title for the example"),
  body: z.string().describe("A concrete worked example illustrating the concept. Markdown allowed."),
});

export const ContentBlockSchema = z.discriminatedUnion("type", [
  ConceptBlockSchema,
  ExampleBlockSchema,
]);
export type ContentBlock = z.infer<typeof ContentBlockSchema>;

export const MultipleChoiceExerciseSchema = z.object({
  type: z.literal("multiple_choice"),
  question: z.string().describe("Clear question testing understanding"),
  options: z.array(z.string()).length(4).describe("Exactly 4 plausible options"),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().describe("Brief explanation of why the correct answer is right"),
});

export const FillBlankExerciseSchema = z.object({
  type: z.literal("fill_blank"),
  sentence: z.string().describe("Sentence with exactly one ___ placeholder for the missing word/phrase"),
  answer: z.string().describe("The correct word or short phrase that fills the blank"),
  acceptableAlternatives: z.array(z.string()).max(3).default([]).describe("Other accepted answers"),
  hint: z.string().optional(),
  explanation: z.string(),
});

export const TrueFalseExerciseSchema = z.object({
  type: z.literal("true_false"),
  statement: z.string().describe("A statement that is either definitively true or false"),
  isTrue: z.boolean(),
  explanation: z.string(),
});

export const MatchingExerciseSchema = z.object({
  type: z.literal("matching"),
  prompt: z.string().describe("Instruction like 'Match each term to its definition'"),
  pairs: z.array(z.object({
    left: z.string().describe("Term, concept, or item"),
    right: z.string().describe("Matching definition, example, or counterpart"),
  })).min(3).max(5).describe("3-5 pairs to match"),
});

export const OrderExerciseSchema = z.object({
  type: z.literal("order"),
  prompt: z.string().describe("Instruction like 'Put these steps in order'"),
  items: z.array(z.string()).min(3).max(5).describe("Items in CORRECT order"),
  explanation: z.string(),
});

export const ExerciseSchema = z.discriminatedUnion("type", [
  MultipleChoiceExerciseSchema,
  FillBlankExerciseSchema,
  TrueFalseExerciseSchema,
  MatchingExerciseSchema,
  OrderExerciseSchema,
]);
export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseType = Exercise["type"];

export const LessonContentSchema = z.object({
  blocks: z.array(ContentBlockSchema).min(2).max(4).describe("2-4 content blocks teaching the concepts. Mix concept and example blocks."),
  exercises: z.array(ExerciseSchema).min(4).max(6).describe("4-6 varied exercises. Use a mix of types — multiple_choice, fill_blank, true_false, matching, order."),
});
export type LessonContent = z.infer<typeof LessonContentSchema>;
