"use client";
import type { Exercise } from "@/lib/schemas";
import { ExerciseMultipleChoice } from "./exercise-multiple-choice";
import { ExerciseFillBlank } from "./exercise-fill-blank";
import { ExerciseTrueFalse } from "./exercise-true-false";
import { ExerciseMatching } from "./exercise-matching";
import { ExerciseOrder } from "./exercise-order";

export function ExerciseRenderer({
  exercise,
  answered,
  onAnswer,
}: {
  exercise: Exercise;
  answered: boolean;
  onAnswer: (correct: boolean, userAnswer: unknown) => void;
}) {
  switch (exercise.type) {
    case "multiple_choice":
      return <ExerciseMultipleChoice exercise={exercise} answered={answered} onAnswer={onAnswer} />;
    case "fill_blank":
      return <ExerciseFillBlank exercise={exercise} answered={answered} onAnswer={onAnswer} />;
    case "true_false":
      return <ExerciseTrueFalse exercise={exercise} answered={answered} onAnswer={onAnswer} />;
    case "matching":
      return <ExerciseMatching exercise={exercise} answered={answered} onAnswer={onAnswer} />;
    case "order":
      return <ExerciseOrder exercise={exercise} answered={answered} onAnswer={onAnswer} />;
  }
}
