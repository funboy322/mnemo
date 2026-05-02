# ADR 0003: AI generation via structured output (Zod), not free-form prompting

**Status**: Accepted (2026-05)
**Context**: Both course outlines and lesson content come from the same AI provider. We need predictable, parseable output.

## Decision

Use AI SDK's `generateObject` with Zod schemas (`CourseOutlineSchema`, `LessonContentSchema`) instead of free-form text prompts that we'd post-process.

## Why this matters

The exercise types form a discriminated union:
```ts
const ExerciseSchema = z.discriminatedUnion("type", [
  MultipleChoiceExerciseSchema,
  FillBlankExerciseSchema,
  TrueFalseExerciseSchema,
  MatchingExerciseSchema,
  OrderExerciseSchema,
]);
```

When the model returns a `multiple_choice` exercise, we get exactly 4 options, an `correctIndex` 0-3, and an explanation — no string parsing, no regex, no "what if it returned 3 options". Same for matching pairs (3-5), order items (3-5), etc.

`generateObject` does the "ask the model, validate against schema, retry if invalid" loop for us.

## Rejected alternatives

- **Free-form prompt + JSON.parse**: Models routinely produce broken JSON, missing fields, or extra commentary. Each round of "fix your output" hurts cost and latency.
- **Function calling for each exercise type**: More moving parts, no benefit over discriminated union.
- **Streaming with `streamObject`**: Useful for showing partial results, but our generations are 5-30s and the user is willing to wait. Skip until we add streaming UX.

## Consequences

- **Pro**: Zero parsing code in `lib/ai.ts`.
- **Pro**: Adding a new exercise type = adding one schema to the union + one renderer component. The AI picks it up automatically because it's described in the schema.
- **Pro**: Schema descriptions (`.describe(...)`) double as model hints — they steer output quality.
- **Con**: Bound to providers that support structured output (most major ones do via `generateObject`).
- **Con**: Schemas constrain the model's creative freedom slightly. We mitigate by keeping descriptions semantic ("4 plausible options, avoid obviously wrong distractors") rather than rigid.
