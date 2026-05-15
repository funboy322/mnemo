# Mnemo: Project Description (Kaggle Gemma 4 Good Hackathon)

**Type a topic. Or photograph a page. Get a course either way.**

Type "Calvin cycle," "Bayes' theorem," or "how Vim modal editing works." In about ten seconds, you have a five-lesson course with multiple choice, fill blank, true/false, matching, and ordered-step exercises. Streaks, XP, spaced-repetition review when memory starts to fade.

Or open a textbook. Point your phone at the chapter your teacher rushed through. Under a minute later, Gemma 4 has read the page and built a course on exactly what's on it. Not generic "Introduction to Photosynthesis" lessons. The diagram on the page becomes a lesson about the diagram. The chess endgame in the picture becomes a course about that specific endgame.

## How learners actually use it

**Text path** is the everyday surface. A student types "how a credit card chip works" or "what is dark matter" and starts learning in seconds. This is what most sessions look like.

**Photo path** is the differentiator. A textbook diagram, a circuit schematic, a hand-drawn note from a tutor, a museum placard, a foreign-language menu. Anything visual that contains learnable content becomes a course adapted to the learner's level and language.

Both paths feed the same lesson player. The same five exercise types. Mobile-first with 44px touch targets. Progress streams as the model writes the course.

## Why Gemma 4

The photo path is what makes this a Gemma 4 submission specifically. It needs an open-weights multimodal model, and there is no closed-API equivalent at zero cost. A school running its own GPU can host the same engine that powers this demo, with no per-token bill and no data leaving the building. The same engine still runs when a vendor changes pricing next quarter.

For me, the line in the hackathon brief that mattered was "Digital Equity & Inclusivity." Open weights is what makes that line real. Gemma 4 is the only model on the table that does multimodal, ships under Apache 2.0, and fits on one consumer GPU.

## Under the hood

The text path uses Gemini 2.5 Flash for speed (around ten seconds per course). The photo path uses Gemma 4 26B-a4b-it for multimodal vision (under a minute). Same Google AI Studio key for both, so deployment is one credential. The choice is honest engineering: Gemma 4's reasoning trace is what makes it good at image understanding, but it adds sixty to a hundred and twenty seconds per text course. Wrong tool for "type, wait, study."

The architecture is structured so anyone forking the project can flip the entire stack to Gemma 4 with one environment variable, accepting the latency for full open-weights operation.

Stack: Next.js 16, AI SDK v6, Vercel. Storage: libSQL with Drizzle. Auth: Clerk in optional mode, so guests can use the full app and migrate progress when they sign in.

## Languages

Six interface languages including Russian, Turkish, Hindi, and Arabic with full RTL. Lesson content generates natively in any of 140+ languages. The interface speaks the learner's language, and the lessons do too.

## Tracks

**Future of Education.** Personalized at scale, free at the point of use. A learner anywhere in the world types or photographs, and gets a course adapted to their level and language.

**Digital Equity & Inclusivity.** Open weights, low-resource languages, RTL support, works on a phone with intermittent connectivity. The student whose textbook is the only resource now has a tutor that fits in a phone.

Built solo in four days.

[Live demo](https://mnemo.vercel.app) · [GitHub](https://github.com/funboy322/mnemo) · MIT (app), Apache 2.0 (Gemma 4)
