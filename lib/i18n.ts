/**
 * Tiny i18n. Three locales (ru, en, tr). Locale lives in `locale` cookie
 * (read by server) or localStorage (set by client switcher; cookie is mirrored).
 *
 * Usage:
 *   server component → const t = await getServerT()
 *   client component → const t = useT()  (LocaleProvider supplies it)
 *
 * Add a new key:
 *   1. Add it to `dicts.ru` first (canonical source of meaning)
 *   2. Add same key to en + tr
 *   3. TS will surface missing keys at compile time
 */

import type { Language } from "./schemas";

export type Locale = Language;
export const SUPPORTED_LOCALES: Locale[] = ["en", "ru", "tr", "es", "hi", "ar"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

/** Right-to-left scripts. Used in <html dir="..."> on the server. */
export const RTL_LOCALES = new Set<Locale>(["ar"]);

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  tr: "Türkçe",
  es: "Español",
  hi: "हिन्दी",
  ar: "العربية",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
  tr: "🇹🇷",
  es: "🇪🇸",
  hi: "🇮🇳",
  ar: "🇸🇦",
};

export type Dict = {
  // Header
  myCourses: string;
  streakTitle: string;
  xpTitle: string;
  dailyGoalTitle: string;
  dailyGoalDoneTitle: string;

  // Landing
  heroBadge: string;
  heroLine1: string;
  heroLine2: string;
  heroSub: string;
  featureStructuredTitle: string;
  featureStructuredBody: string;
  featurePracticeTitle: string;
  featurePracticeBody: string;
  featureStreakTitle: string;
  featureStreakBody: string;

  // TopicForm
  topicPlaceholder: string;
  levelLabel: string;
  depthLabel: string;
  levelBeginner: string;
  levelIntermediate: string;
  levelAdvanced: string;
  depth5: string;
  depth8: string;
  depth12: string;
  langLabel: string;
  createCourse: string;
  generating: string;
  generatingHint: string;
  errorTooShort: string;
  errorGenerationFailed: string;
  orPickIdea: string;

  // Suggestions (RU/EN/TR variants)
  suggestion1: string;
  suggestion2: string;
  suggestion3: string;
  suggestion4: string;
  suggestion5: string;
  suggestion6: string;

  // Course page
  lessonsCount: (n: number) => string;

  // CoursePath
  lessonNumber: (n: number) => string;
  lessonCompleted: string;
  startLesson: string;
  replay: string;

  // LessonGate
  newLesson: string;
  whatYoullLearn: string;
  startButton: string;
  preparingMaterial: string;
  preparingHint: string;
  toCourse: string;

  // LessonPlayer
  exerciseN: (n: number, total: number) => string;
  toExercises: string;
  exitLesson: string;

  // Exercises — instructions
  matchPrompt: string;
  fillBlankPrompt: string;
  trueFalsePrompt: string;
  orderPrompt: string;
  pickToAddHere: string;

  // Buttons
  check: string;
  next: string;
  trueLabel: string;
  falseLabel: string;
  moveUp: string;
  moveDown: string;
  remove: string;

  // Feedback
  correct: string;
  incorrect: string;
  correctAnswerIs: string;
  correctlyIs: string;

  // CompletionScreen
  perfect: string;
  great: string;
  passed: string;
  goodJob: string;
  perfectSub: string;
  greatSub: string;
  passedSub: string;
  goodJobSub: string;
  withoutMistakes: string;
  xp: string;
  accuracy: string;
  hearts: string;
  continueCourse: string;
  toMyCourses: string;

  // Dashboard
  yourProgress: string;
  daysInARow: string;
  experienceLong: string;
  bestStreak: string;
  dailyGoalDone: string;
  dailyGoalDoneSub: string;
  dailyGoalNotDone: string;
  dailyGoalNotDoneSub: string;
  myCoursesTitle: string;
  newCourse: string;
  noCoursesYet: string;
  createFirst: string;
  lessonsOf: (done: number, total: number) => string;
  coursesPlural: (n: number) => string;
  completedPlural: (n: number) => string;

  // not-found / error
  notFoundTitle: string;
  notFoundBody: string;
  goHome: string;
  somethingWrong: string;
  unknownError: string;
  retry: string;

  // Loading
  loadingLabel: string;

  // Tip panels (interstitial)
  tipLabel: string;
  gotIt: string;

  // Out of hearts
  outOfHeartsTitle: string;
  outOfHeartsBody: string;
  retryLesson: string;
  backToCourse: string;

  // Encouragement (random phrase pools)
  correctPhrases: readonly string[];
  wrongPhrases: readonly string[];

  // Auth
  signIn: string;
  signUp: string;
  saveProgress: string;
  guestModeBadge: string;
  migratingProgress: string;
  migrationDone: string;

  // Onboarding
  onboardStep: (n: number, total: number) => string;
  onboardSkip: string;
  onboardBack: string;
  onboardContinue: string;
  onboardStart: string;
  onboardTopicTitle: string;
  onboardTopicSub: string;
  onboardWhyTitle: string;
  onboardWhySub: string;
  onboardWhyCurious: string;
  onboardWhyWork: string;
  onboardWhyGrowth: string;
  onboardWhyExam: string;
  onboardWhyFun: string;
  onboardGoalTitle: string;
  onboardGoalSub: string;
  onboardGoalCasual: string;
  onboardGoalCasualDesc: string;
  onboardGoalRegular: string;
  onboardGoalRegularDesc: string;
  onboardGoalSerious: string;
  onboardGoalSeriousDesc: string;
  onboardMinPerDay: (n: number) => string;

  // Review mode
  reviewTitle: string;
  reviewSubtitle: string;
  reviewStart: string;
  reviewDueCount: (n: number) => string;
  reviewNoneYet: string;
  reviewSourceLesson: string;
  reviewEmpty: string;

  // Gemma / positioning
  poweredByGemma: string;
  whyMattersTitle: string;
  whyOpenTitle: string;
  whyOpenBody: string;
  whyAnyTopicTitle: string;
  whyAnyTopicBody: string;
  whyAnyLangTitle: string;
  whyAnyLangBody: string;
  fromPhotoTabBadge: string;
  fromTopicBack: string;
  orPhotograph: string;
  /** Headline on the dashboard. Use {em} markers to set the italic
   *  signature moment (e.g. "Welcome {em}back.{/em}"). */
  welcomeBack: string;
  /** Section title above the course grid on the dashboard. */
  yourShelf: string;
  /** Stat labels on the dashboard. Lowercase, used in JBM caps. */
  statDayStreak: string;
  statXpEarned: string;
  statBestStreak: string;
};

const en: Dict = {
  myCourses: "My courses",
  streakTitle: "Day streak",
  xpTitle: "XP",
  dailyGoalTitle: "Daily goal: complete 1 lesson",
  dailyGoalDoneTitle: "Daily goal complete",

  heroBadge: "AI generates a course for you",
  heroLine1: "Learn anything.",
  heroLine2: "Step by step.",
  heroSub: "Type any topic. Get a structured course of bite-size lessons and exercises. Like Duolingo, for everything.",
  featureStructuredTitle: "Structured path",
  featureStructuredBody: "AI breaks any topic into 5–12 lessons, progressing from simple to advanced.",
  featurePracticeTitle: "Active practice",
  featurePracticeBody: "5 exercise types: multiple choice, fill blank, matching, ordering, true/false.",
  featureStreakTitle: "Streak & XP",
  featureStreakBody: "Daily streak and experience points keep you coming back.",

  topicPlaceholder: "e.g. How LLM neural networks work",
  levelLabel: "Level",
  depthLabel: "Length",
  levelBeginner: "Beginner",
  levelIntermediate: "Intermediate",
  levelAdvanced: "Advanced",
  depth5: "5 lessons",
  depth8: "8 lessons",
  depth12: "12 lessons",
  langLabel: "Language",
  createCourse: "Create course",
  generating: "Generating course...",
  generatingHint: "This takes 10–30 seconds. AI is preparing the structure and lesson titles.",
  errorTooShort: "Topic must be at least 2 characters",
  errorGenerationFailed: "Could not create course",
  orPickIdea: "Or pick an idea",

  suggestion1: "Marketing in the AI era",
  suggestion2: "Stoic philosophy basics",
  suggestion3: "How blockchain works",
  suggestion4: "System Design interview prep",
  suggestion5: "Byzantine history",
  suggestion6: "Product management fundamentals",

  lessonsCount: (n) => `${n} ${n === 1 ? "lesson" : "lessons"}`,

  lessonNumber: (n) => `Lesson ${n}`,
  lessonCompleted: "completed",
  startLesson: "Start",
  replay: "Replay",

  newLesson: "New lesson",
  whatYoullLearn: "What you'll learn",
  startButton: "Start lesson",
  preparingMaterial: "Preparing material...",
  preparingHint: "AI is writing exercises and content. 10–20 seconds.",
  toCourse: "Back to course",

  exerciseN: (n, total) => `Exercise ${n} of ${total}`,
  toExercises: "Go to exercises",
  exitLesson: "Exit lesson",

  matchPrompt: "Match",
  fillBlankPrompt: "Fill in the blank",
  trueFalsePrompt: "True or false?",
  orderPrompt: "Put in order",
  pickToAddHere: "Tap items below to add them here",

  check: "Check",
  next: "Continue",
  trueLabel: "True",
  falseLabel: "False",
  moveUp: "Move up",
  moveDown: "Move down",
  remove: "Remove",

  correct: "Correct!",
  incorrect: "Incorrect",
  correctAnswerIs: "Correct answer:",
  correctlyIs: "Correctly:",

  perfect: "Perfect!",
  great: "Great!",
  passed: "Lesson done",
  goodJob: "Way to finish",
  perfectSub: "100% correct. Keep it up!",
  greatSub: "Strong result.",
  passedSub: "You know more now than you did at the start.",
  goodJobSub: "Tough lesson. Try again, it'll be easier.",
  withoutMistakes: "No mistakes",
  xp: "XP",
  accuracy: "Accuracy",
  hearts: "Hearts",
  continueCourse: "Continue course",
  toMyCourses: "To my courses",

  yourProgress: "Your progress",
  daysInARow: "day streak",
  experienceLong: "XP",
  bestStreak: "best",
  dailyGoalDone: "Daily goal complete",
  dailyGoalDoneSub: "Streak is safe. Keep going or rest.",
  dailyGoalNotDone: "Goal: 1 lesson today",
  dailyGoalNotDoneSub: "Complete one lesson to extend your streak.",
  myCoursesTitle: "My courses",
  newCourse: "New course",
  noCoursesYet: "No courses yet.",
  createFirst: "Create first course",
  lessonsOf: (done, total) => `${done}/${total} lessons`,
  coursesPlural: (n) => `${n} ${n === 1 ? "course" : "courses"}`,
  completedPlural: (n) => `${n} done`,

  notFoundTitle: "Page not found",
  notFoundBody: "Maybe the link is stale or the course was deleted. You can start a new one.",
  goHome: "Home",
  somethingWrong: "Something went wrong",
  unknownError: "Unknown error. Try again.",
  retry: "Retry",

  loadingLabel: "Loading",

  tipLabel: "Tip",
  gotIt: "Got it",

  outOfHeartsTitle: "Out of hearts",
  outOfHeartsBody: "Take a break or try this lesson again from the start.",
  retryLesson: "Try again",
  backToCourse: "Back to course",

  correctPhrases: ["Nice!", "Great!", "Spot on!", "Boom!", "Perfect!", "Sharp!", "Crushed it!", "On fire!"],
  wrongPhrases: ["Almost!", "Not quite", "Close one", "No worries", "Try once more"],

  signIn: "Sign in",
  signUp: "Sign up",
  saveProgress: "Save your progress",
  guestModeBadge: "Guest",
  migratingProgress: "Saving your progress to your account...",
  migrationDone: "Progress saved",

  onboardStep: (n, total) => `Step ${n} of ${total}`,
  onboardSkip: "Skip",
  onboardBack: "Back",
  onboardContinue: "Continue",
  onboardStart: "Start learning",
  onboardTopicTitle: "What do you want to {em}learn?{/em}",
  onboardTopicSub: "A topic, a textbook page, a YouTube link. We turn it into a structured 5–12 lesson course with active recall.",
  onboardWhyTitle: "Why this topic?",
  onboardWhySub: "We'll match the depth and tone to your reason.",
  onboardWhyCurious: "Just curious",
  onboardWhyWork: "For my work",
  onboardWhyGrowth: "Personal growth",
  onboardWhyExam: "School or exam",
  onboardWhyFun: "Pure fun",
  onboardGoalTitle: "How serious are you?",
  onboardGoalSub: "Pick a daily target. You can always change it later.",
  onboardGoalCasual: "Casual",
  onboardGoalCasualDesc: "1 lesson per day",
  onboardGoalRegular: "Regular",
  onboardGoalRegularDesc: "3 lessons per day",
  onboardGoalSerious: "Serious",
  onboardGoalSeriousDesc: "5 lessons per day",
  onboardMinPerDay: (n) => `~${n} min/day`,

  reviewTitle: "Daily review",
  reviewSubtitle: "Strengthen what you already learned. 5 exercises from past lessons.",
  reviewStart: "Start review",
  reviewDueCount: (n) => `${n} ${n === 1 ? "lesson" : "lessons"} due`,
  reviewNoneYet: "Complete a lesson first to unlock review mode.",
  reviewSourceLesson: "From",
  reviewEmpty: "Nothing to review yet — come back after you've completed some lessons.",

  poweredByGemma: "Powered by Gemma 4 · open-weights",
  whyMattersTitle: "Why this matters",
  whyOpenTitle: "Free, even at scale",
  whyOpenBody: "Gemma 4 runs on a single GPU under Apache 2.0. A school with no per-token API budget can self-host the same engine that powers this site.",
  whyAnyTopicTitle: "Any topic, any photo",
  whyAnyTopicBody: "Type a topic or snap a page. Gemma 4's vision turns a textbook photo, a diagram, or an object into a structured course in seconds.",
  whyAnyLangTitle: "Lessons in 140+ languages",
  whyAnyLangBody: "Lessons generate natively in 140+ languages — Russian, Turkish, Hindi, Swahili, the languages other learning apps underserve. The interface ships in 6 (English, Russian, Turkish, Spanish, Hindi, Arabic). Community translations welcome.",
  fromPhotoTabBadge: "NEW",
  fromTopicBack: "back to typing a topic",
  orPhotograph: "or photograph a page →",
  welcomeBack: "Welcome {em}back.{/em}",
  yourShelf: "Your shelf",
  statDayStreak: "day streak",
  statXpEarned: "xp earned",
  statBestStreak: "best streak",
};

const ru: Dict = {
  myCourses: "Мои курсы",
  streakTitle: "Серия дней подряд",
  xpTitle: "Опыт",
  dailyGoalTitle: "Дневная цель: пройди 1 урок",
  dailyGoalDoneTitle: "Дневная цель выполнена",

  heroBadge: "AI генерирует курс под тебя",
  heroLine1: "Учись чему угодно.",
  heroLine2: "Шаг за шагом.",
  heroSub: "Введи любую тему — получи структурированный курс с короткими уроками и упражнениями. Как Duolingo, только для всего на свете.",
  featureStructuredTitle: "Структурированный путь",
  featureStructuredBody: "AI разбивает любую тему на 5–12 уроков с прогрессией от простого к сложному.",
  featurePracticeTitle: "Активная практика",
  featurePracticeBody: "5 типов упражнений — выбор, заполнение, сопоставление, порядок шагов, true/false.",
  featureStreakTitle: "Streak и XP",
  featureStreakBody: "Дни подряд и очки опыта помогают вернуться завтра.",

  topicPlaceholder: "Например: Как работает нейросеть LLM",
  levelLabel: "Уровень",
  depthLabel: "Длина",
  levelBeginner: "Новичок",
  levelIntermediate: "Средний",
  levelAdvanced: "Продвинутый",
  depth5: "5 уроков",
  depth8: "8 уроков",
  depth12: "12 уроков",
  langLabel: "Язык",
  createCourse: "Создать курс",
  generating: "Генерируем курс...",
  generatingHint: "Это может занять 10–30 секунд. AI готовит структуру и темы уроков.",
  errorTooShort: "Введи тему хотя бы из 2 символов",
  errorGenerationFailed: "Не удалось создать курс",
  orPickIdea: "Или выбери идею",

  suggestion1: "Маркетинг в эпоху ИИ",
  suggestion2: "Основы стоической философии",
  suggestion3: "Как работает blockchain",
  suggestion4: "Подготовка к собеседованию по System Design",
  suggestion5: "История Византии",
  suggestion6: "Основы продуктового менеджмента",

  lessonsCount: (n) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return `${n} урок`;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} урока`;
    return `${n} уроков`;
  },

  lessonNumber: (n) => `Урок ${n}`,
  lessonCompleted: "пройден",
  startLesson: "Начать",
  replay: "Повторить",

  newLesson: "Новый урок",
  whatYoullLearn: "Чему научишься",
  startButton: "Начать урок",
  preparingMaterial: "Готовим материал...",
  preparingHint: "AI пишет упражнения и материалы. 10–20 секунд.",
  toCourse: "К курсу",

  exerciseN: (n, total) => `Упражнение ${n} из ${total}`,
  toExercises: "Перейти к упражнениям",
  exitLesson: "Выйти из урока",

  matchPrompt: "Сопоставь",
  fillBlankPrompt: "Заполни пропуск",
  trueFalsePrompt: "Правда или нет?",
  orderPrompt: "Расставь по порядку",
  pickToAddHere: "Нажимай на варианты ниже, чтобы добавить их сюда",

  check: "Проверить",
  next: "Дальше",
  trueLabel: "Правда",
  falseLabel: "Неправда",
  moveUp: "Вверх",
  moveDown: "Вниз",
  remove: "Убрать",

  correct: "Верно!",
  incorrect: "Неверно",
  correctAnswerIs: "Правильный ответ:",
  correctlyIs: "Правильно:",

  perfect: "Идеально!",
  great: "Отлично!",
  passed: "Урок пройден",
  goodJob: "Молодец, что закончил",
  perfectSub: "100% правильных ответов. Так держать!",
  greatSub: "Очень хороший результат.",
  passedSub: "Уже знаешь больше, чем в начале.",
  goodJobSub: "Сложный урок — попробуй пройти снова, станет легче.",
  withoutMistakes: "Без единой ошибки",
  xp: "Опыт",
  accuracy: "Точность",
  hearts: "Жизни",
  continueCourse: "Продолжить курс",
  toMyCourses: "К моим курсам",

  yourProgress: "Твой прогресс",
  daysInARow: "дней подряд",
  experienceLong: "опыта",
  bestStreak: "рекорд",
  dailyGoalDone: "Цель на сегодня выполнена",
  dailyGoalDoneSub: "Streak в безопасности. Можно продолжать или отдохнуть.",
  dailyGoalNotDone: "Цель: 1 урок сегодня",
  dailyGoalNotDoneSub: "Пройди один урок, чтобы продлить streak.",
  myCoursesTitle: "Мои курсы",
  newCourse: "Новый курс",
  noCoursesYet: "Пока ни одного курса.",
  createFirst: "Создать первый курс",
  lessonsOf: (done, total) => `${done}/${total} уроков`,
  coursesPlural: (n) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return `${n} курс`;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} курса`;
    return `${n} курсов`;
  },
  completedPlural: (n) => `${n} ${n === 1 ? "пройден" : "пройдено"}`,

  notFoundTitle: "Страница не найдена",
  notFoundBody: "Возможно, ссылка устарела или курс удалён. Можно начать новый.",
  goHome: "На главную",
  somethingWrong: "Что-то пошло не так",
  unknownError: "Неизвестная ошибка. Попробуй ещё раз.",
  retry: "Повторить",

  loadingLabel: "Загружаем",

  tipLabel: "Подсказка",
  gotIt: "Понятно",

  outOfHeartsTitle: "Жизни кончились",
  outOfHeartsBody: "Сделай паузу или начни этот урок заново.",
  retryLesson: "Попробовать снова",
  backToCourse: "К курсу",

  correctPhrases: ["Точно!", "Огонь!", "Бомба!", "Великолепно!", "Молодец!", "В точку!", "Класс!", "Безошибочно!", "Так держать!"],
  wrongPhrases: ["Почти!", "Чуть-чуть", "Бывает!", "Не страшно", "Ещё разок"],

  signIn: "Войти",
  signUp: "Регистрация",
  saveProgress: "Сохранить прогресс",
  guestModeBadge: "Гость",
  migratingProgress: "Сохраняем твой прогресс в аккаунт...",
  migrationDone: "Прогресс сохранён",

  onboardStep: (n, total) => `Шаг ${n} из ${total}`,
  onboardSkip: "Пропустить",
  onboardBack: "Назад",
  onboardContinue: "Дальше",
  onboardStart: "Начать",
  onboardTopicTitle: "Что хочется {em}выучить?{/em}",
  onboardTopicSub: "Тема, страница учебника, ссылка на YouTube. Превратим в курс из 5–12 уроков с активным повторением.",
  onboardWhyTitle: "Зачем тебе это?",
  onboardWhySub: "Под цель подберём глубину и тон материала.",
  onboardWhyCurious: "Просто интересно",
  onboardWhyWork: "Для работы",
  onboardWhyGrowth: "Личный рост",
  onboardWhyExam: "Учёба, экзамен",
  onboardWhyFun: "Развлечься",
  onboardGoalTitle: "Насколько серьёзно?",
  onboardGoalSub: "Выбери дневную цель. Поменять можно потом.",
  onboardGoalCasual: "Без напряга",
  onboardGoalCasualDesc: "1 урок в день",
  onboardGoalRegular: "Регулярно",
  onboardGoalRegularDesc: "3 урока в день",
  onboardGoalSerious: "Серьёзно",
  onboardGoalSeriousDesc: "5 уроков в день",
  onboardMinPerDay: (n) => `~${n} мин/день`,

  reviewTitle: "Повторение",
  reviewSubtitle: "Закрепи пройденное. 5 упражнений из прошлых уроков.",
  reviewStart: "Начать повторение",
  reviewDueCount: (n) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return `${n} урок готов к повторению`;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} урока готовы к повторению`;
    return `${n} уроков готовы к повторению`;
  },
  reviewNoneYet: "Пройди хотя бы один урок, чтобы открыть режим повторения.",
  reviewSourceLesson: "Из урока",
  reviewEmpty: "Пока нечего повторять. Возвращайся когда пройдёшь несколько уроков.",

  poweredByGemma: "Работает на Gemma 4 · open-weights",
  whyMattersTitle: "Почему это важно",
  whyOpenTitle: "Бесплатно даже на масштабе",
  whyOpenBody: "Gemma 4 крутится на одной GPU под Apache 2.0. Школа без бюджета на per-token API может развернуть тот же движок, что и здесь.",
  whyAnyTopicTitle: "Любая тема, любая фотка",
  whyAnyTopicBody: "Введи тему или сфотай страницу. Vision Gemma 4 превращает фото учебника, диаграмму или предмет в структурированный курс за секунды.",
  whyAnyLangTitle: "Уроки на 140+ языках",
  whyAnyLangBody: "Уроки нативно на любом из 140+ языков — русский, турецкий, хинди, суахили, те языки, которые крупные API-сервисы часто игнорируют. Сам интерфейс пока на 6 (английский, русский, турецкий, испанский, хинди, арабский). Community translations welcome.",
  fromPhotoTabBadge: "НОВОЕ",
  fromTopicBack: "вернуться к вводу темы",
  orPhotograph: "или сфотографировать страницу →",
  welcomeBack: "С {em}возвращением.{/em}",
  yourShelf: "Твоя полка",
  statDayStreak: "день подряд",
  statXpEarned: "очков опыта",
  statBestStreak: "лучший стрик",
};

const tr: Dict = {
  myCourses: "Kurslarım",
  streakTitle: "Üst üste gün",
  xpTitle: "Deneyim",
  dailyGoalTitle: "Günlük hedef: 1 ders bitir",
  dailyGoalDoneTitle: "Günlük hedef tamam",

  heroBadge: "AI sana özel kurs üretir",
  heroLine1: "Her şeyi öğren.",
  heroLine2: "Adım adım.",
  heroSub: "Bir konu yaz — kısa derslerden ve alıştırmalardan oluşan yapılandırılmış bir kurs al. Duolingo gibi, ama her konu için.",
  featureStructuredTitle: "Yapılandırılmış yol",
  featureStructuredBody: "AI her konuyu basitten ileriye 5–12 derse böler.",
  featurePracticeTitle: "Aktif pratik",
  featurePracticeBody: "5 alıştırma tipi — çoktan seçmeli, boşluk doldurma, eşleştirme, sıralama, doğru/yanlış.",
  featureStreakTitle: "Streak ve XP",
  featureStreakBody: "Üst üste günler ve deneyim puanları yarın da geri gelmeni sağlar.",

  topicPlaceholder: "Örn: LLM sinir ağları nasıl çalışır",
  levelLabel: "Seviye",
  depthLabel: "Uzunluk",
  levelBeginner: "Başlangıç",
  levelIntermediate: "Orta",
  levelAdvanced: "İleri",
  depth5: "5 ders",
  depth8: "8 ders",
  depth12: "12 ders",
  langLabel: "Dil",
  createCourse: "Kursu oluştur",
  generating: "Kurs üretiliyor...",
  generatingHint: "Bu 10–30 saniye sürer. AI yapı ve ders başlıklarını hazırlıyor.",
  errorTooShort: "Konu en az 2 karakter olmalı",
  errorGenerationFailed: "Kurs oluşturulamadı",
  orPickIdea: "Ya da bir fikir seç",

  suggestion1: "AI çağında pazarlama",
  suggestion2: "Stoacı felsefe temelleri",
  suggestion3: "Blockchain nasıl çalışır",
  suggestion4: "System Design mülakat hazırlığı",
  suggestion5: "Bizans tarihi",
  suggestion6: "Ürün yönetimi temelleri",

  lessonsCount: (n) => `${n} ders`,

  lessonNumber: (n) => `Ders ${n}`,
  lessonCompleted: "tamamlandı",
  startLesson: "Başla",
  replay: "Tekrar et",

  newLesson: "Yeni ders",
  whatYoullLearn: "Ne öğreneceksin",
  startButton: "Derse başla",
  preparingMaterial: "Materyal hazırlanıyor...",
  preparingHint: "AI alıştırmaları ve içeriği yazıyor. 10–20 saniye.",
  toCourse: "Kursa dön",

  exerciseN: (n, total) => `Alıştırma ${n} / ${total}`,
  toExercises: "Alıştırmalara geç",
  exitLesson: "Dersten çık",

  matchPrompt: "Eşleştir",
  fillBlankPrompt: "Boşluğu doldur",
  trueFalsePrompt: "Doğru mu yanlış mı?",
  orderPrompt: "Sırala",
  pickToAddHere: "Buraya eklemek için aşağıdaki seçeneklere dokun",

  check: "Kontrol et",
  next: "Devam",
  trueLabel: "Doğru",
  falseLabel: "Yanlış",
  moveUp: "Yukarı",
  moveDown: "Aşağı",
  remove: "Kaldır",

  correct: "Doğru!",
  incorrect: "Yanlış",
  correctAnswerIs: "Doğru cevap:",
  correctlyIs: "Doğrusu:",

  perfect: "Mükemmel!",
  great: "Harika!",
  passed: "Ders bitti",
  goodJob: "Bitirdiğin için aferin",
  perfectSub: "%100 doğru. Böyle devam!",
  greatSub: "Güçlü bir sonuç.",
  passedSub: "Şimdi başlangıçtan daha çok şey biliyorsun.",
  goodJobSub: "Zor bir dersti — tekrar dene, daha kolay olacak.",
  withoutMistakes: "Tek hata yok",
  xp: "XP",
  accuracy: "İsabet",
  hearts: "Kalp",
  continueCourse: "Kursa devam",
  toMyCourses: "Kurslarıma",

  yourProgress: "İlerlemen",
  daysInARow: "üst üste gün",
  experienceLong: "XP",
  bestStreak: "rekor",
  dailyGoalDone: "Bugünkü hedef tamam",
  dailyGoalDoneSub: "Streak güvende. Devam et ya da dinlen.",
  dailyGoalNotDone: "Hedef: bugün 1 ders",
  dailyGoalNotDoneSub: "Streak'i uzatmak için bir ders bitir.",
  myCoursesTitle: "Kurslarım",
  newCourse: "Yeni kurs",
  noCoursesYet: "Henüz kurs yok.",
  createFirst: "İlk kursu oluştur",
  lessonsOf: (done, total) => `${done}/${total} ders`,
  coursesPlural: (n) => `${n} kurs`,
  completedPlural: (n) => `${n} tamamlandı`,

  notFoundTitle: "Sayfa bulunamadı",
  notFoundBody: "Bağlantı eski olabilir ya da kurs silinmiş olabilir. Yeni bir tane başlatabilirsin.",
  goHome: "Ana sayfa",
  somethingWrong: "Bir şeyler ters gitti",
  unknownError: "Bilinmeyen hata. Tekrar dene.",
  retry: "Tekrar",

  loadingLabel: "Yükleniyor",

  tipLabel: "İpucu",
  gotIt: "Anladım",

  outOfHeartsTitle: "Kalpler bitti",
  outOfHeartsBody: "Mola ver ya da bu derse baştan başla.",
  retryLesson: "Tekrar dene",
  backToCourse: "Kursa dön",

  correctPhrases: ["Tam isabet!", "Harika!", "Bomba!", "Mükemmel!", "Süper!", "Aferin!", "Şahane!", "Tek hata yok!"],
  wrongPhrases: ["Az kaldı!", "Yaklaştın", "Olur böyle", "Önemli değil", "Bir kez daha"],

  signIn: "Giriş",
  signUp: "Kayıt",
  saveProgress: "İlerlemeni kaydet",
  guestModeBadge: "Misafir",
  migratingProgress: "İlerlemen hesabına kaydediliyor...",
  migrationDone: "İlerleme kaydedildi",

  onboardStep: (n, total) => `Adım ${n} / ${total}`,
  onboardSkip: "Atla",
  onboardBack: "Geri",
  onboardContinue: "Devam",
  onboardStart: "Başla",
  onboardTopicTitle: "Ne {em}öğrenmek{/em} istersin?",
  onboardTopicSub: "Bir konu, bir kitap sayfası, bir YouTube bağlantısı. Aktif hatırlama ile 5–12 derslik yapılandırılmış bir kursa dönüştürürüz.",
  onboardWhyTitle: "Bu konuyu neden?",
  onboardWhySub: "Nedenine göre derinliği ve tonu ayarlarız.",
  onboardWhyCurious: "Sadece merak",
  onboardWhyWork: "İşim için",
  onboardWhyGrowth: "Kişisel gelişim",
  onboardWhyExam: "Okul, sınav",
  onboardWhyFun: "Eğlence",
  onboardGoalTitle: "Ne kadar ciddi?",
  onboardGoalSub: "Günlük hedef seç. Sonra değiştirebilirsin.",
  onboardGoalCasual: "Rahat",
  onboardGoalCasualDesc: "Günde 1 ders",
  onboardGoalRegular: "Düzenli",
  onboardGoalRegularDesc: "Günde 3 ders",
  onboardGoalSerious: "Ciddi",
  onboardGoalSeriousDesc: "Günde 5 ders",
  onboardMinPerDay: (n) => `~${n} dk/gün`,

  reviewTitle: "Tekrar",
  reviewSubtitle: "Öğrendiğini pekiştir. Geçmiş derslerden 5 alıştırma.",
  reviewStart: "Tekrara başla",
  reviewDueCount: (n) => `${n} ders tekrara hazır`,
  reviewNoneYet: "Tekrar modunu açmak için önce bir ders bitir.",
  reviewSourceLesson: "Kaynak",
  reviewEmpty: "Henüz tekrar edecek bir şey yok — birkaç ders bitirdikten sonra dön.",

  poweredByGemma: "Gemma 4 ile çalışır · açık ağırlıklar",
  whyMattersTitle: "Bu neden önemli",
  whyOpenTitle: "Ölçekte bile ücretsiz",
  whyOpenBody: "Gemma 4 tek bir GPU üzerinde Apache 2.0 ile çalışır. Token başına API bütçesi olmayan bir okul bu siteyi besleyen motoru kendi sunucusunda barındırabilir.",
  whyAnyTopicTitle: "Her konu, her fotoğraf",
  whyAnyTopicBody: "Bir konu yaz ya da bir sayfa çek. Gemma 4'ün görüşü bir ders kitabı fotoğrafını, bir diyagramı veya bir nesneyi saniyeler içinde yapılandırılmış bir kursa çevirir.",
  whyAnyLangTitle: "140+ dilde dersler",
  whyAnyLangBody: "Dersler 140+ dilde yerel olarak üretilir — Rusça, Türkçe, Hintçe, Svahili, büyük API'ların ihmal ettiği diller. Arayüz 6 dilde (İngilizce, Rusça, Türkçe, İspanyolca, Hintçe, Arapça). Topluluk çevirileri memnuniyetle karşılanır.",
  fromPhotoTabBadge: "YENİ",
  fromTopicBack: "konu yazmaya dön",
  orPhotograph: "veya bir sayfanın fotoğrafını çek →",
  welcomeBack: "Tekrar {em}hoş geldin.{/em}",
  yourShelf: "Rafın",
  statDayStreak: "gün üst üste",
  statXpEarned: "xp kazanıldı",
  statBestStreak: "en iyi seri",
};

const es: Dict = {
  myCourses: "Mis cursos",
  streakTitle: "Racha de días",
  xpTitle: "XP",
  dailyGoalTitle: "Meta diaria: completa 1 lección",
  dailyGoalDoneTitle: "Meta diaria completada",
  heroBadge: "La IA genera un curso para ti",
  heroLine1: "Aprende lo que quieras.",
  heroLine2: "Paso a paso.",
  heroSub: "Escribe cualquier tema. Obtén un curso estructurado con lecciones y ejercicios cortos. Como Duolingo, para todo.",
  featureStructuredTitle: "Ruta estructurada",
  featureStructuredBody: "La IA divide cualquier tema en 5–12 lecciones, progresando de lo simple a lo avanzado.",
  featurePracticeTitle: "Práctica activa",
  featurePracticeBody: "5 tipos de ejercicios: opción múltiple, rellenar huecos, emparejar, ordenar, verdadero/falso.",
  featureStreakTitle: "Racha y XP",
  featureStreakBody: "La racha diaria y los puntos de experiencia te motivan a volver.",
  topicPlaceholder: "ej. Cómo funcionan las redes neuronales LLM",
  levelLabel: "Nivel",
  depthLabel: "Duración",
  levelBeginner: "Principiante",
  levelIntermediate: "Intermedio",
  levelAdvanced: "Avanzado",
  depth5: "5 lecciones",
  depth8: "8 lecciones",
  depth12: "12 lecciones",
  langLabel: "Idioma",
  createCourse: "Crear curso",
  generating: "Generando curso...",
  generatingHint: "Esto tarda 10–30 segundos. La IA está preparando la estructura y los títulos de las lecciones.",
  errorTooShort: "El tema debe tener al menos 2 caracteres",
  errorGenerationFailed: "No se pudo crear el curso",
  orPickIdea: "O elige una idea",
  suggestion1: "Marketing en la era de la IA",
  suggestion2: "Conceptos básicos de filosofía estoica",
  suggestion3: "Cómo funciona blockchain",
  suggestion4: "Preparación para entrevista de Diseño de Sistemas",
  suggestion5: "Historia bizantina",
  suggestion6: "Fundamentos de gestión de producto",
  lessonCompleted: "completada",
  startLesson: "Empezar",
  replay: "Repetir",
  newLesson: "Nueva lección",
  whatYoullLearn: "Lo que aprenderás",
  startButton: "Empezar lección",
  preparingMaterial: "Preparando material...",
  preparingHint: "La IA está escribiendo ejercicios y contenido. 10–20 segundos.",
  toCourse: "Volver al curso",
  toExercises: "Ir a los ejercicios",
  exitLesson: "Salir de la lección",
  matchPrompt: "Empareja",
  fillBlankPrompt: "Rellena el hueco",
  trueFalsePrompt: "¿Verdadero o falso?",
  orderPrompt: "Pon en orden",
  pickToAddHere: "Toca los elementos de abajo para añadirlos aquí",
  check: "Comprobar",
  next: "Continuar",
  trueLabel: "Verdadero",
  falseLabel: "Falso",
  moveUp: "Mover arriba",
  moveDown: "Mover abajo",
  remove: "Eliminar",
  correct: "¡Correcto!",
  incorrect: "Incorrecto",
  correctAnswerIs: "Respuesta correcta:",
  correctlyIs: "Correctamente:",
  perfect: "¡Perfecto!",
  great: "¡Genial!",
  passed: "Lección terminada",
  goodJob: "¡Bien hecho!",
  perfectSub: "100% correcto. ¡Sigue así!",
  greatSub: "Gran resultado.",
  passedSub: "Ahora sabes más que al principio.",
  goodJobSub: "Lección difícil. Inténtalo de nuevo, será más fácil.",
  withoutMistakes: "Sin errores",
  xp: "XP",
  accuracy: "Precisión",
  hearts: "Vidas",
  continueCourse: "Continuar curso",
  toMyCourses: "A mis cursos",
  yourProgress: "Tu progreso",
  daysInARow: "días de racha",
  experienceLong: "XP",
  bestStreak: "mejor",
  dailyGoalDone: "Meta diaria completada",
  dailyGoalDoneSub: "La racha está a salvo. Sigue o descansa.",
  dailyGoalNotDone: "Meta: 1 lección hoy",
  dailyGoalNotDoneSub: "Completa una lección para extender tu racha.",
  myCoursesTitle: "Mis cursos",
  newCourse: "Nuevo curso",
  noCoursesYet: "Aún no tienes cursos.",
  createFirst: "Crea tu primer curso",
  notFoundTitle: "Página no encontrada",
  notFoundBody: "Quizás el enlace esté obsoleto o el curso fue eliminado. Puedes empezar uno nuevo.",
  goHome: "Inicio",
  somethingWrong: "Algo salió mal",
  unknownError: "Error desconocido. Inténtalo de nuevo.",
  retry: "Reintentar",
  loadingLabel: "Cargando",
  tipLabel: "Consejo",
  gotIt: "Entendido",
  outOfHeartsTitle: "Sin vidas",
  outOfHeartsBody: "Tómate un descanso o intenta esta lección de nuevo desde el principio.",
  retryLesson: "Intentar de nuevo",
  backToCourse: "Volver al curso",
  correctPhrases: ["¡Genial!", "¡Fantástico!", "¡Exacto!", "¡Boom!", "¡Perfecto!", "¡Impecable!", "¡Lo lograste!", "¡En racha!"],
  wrongPhrases: ["¡Casi!", "No del todo", "Cerca", "No te preocupes", "Inténtalo una vez más"],
  signIn: "Iniciar sesión",
  signUp: "Registrarse",
  saveProgress: "Guarda tu progreso",
  guestModeBadge: "Invitado",
  migratingProgress: "Guardando tu progreso en tu cuenta...",
  migrationDone: "Progreso guardado",
  onboardSkip: "Omitir",
  onboardBack: "Atrás",
  onboardContinue: "Continuar",
  onboardStart: "Empezar a aprender",
  onboardTopicTitle: "¿Qué quieres {em}aprender?{/em}",
  onboardTopicSub: "Un tema, una página de libro, un enlace de YouTube. Lo convertimos en un curso estructurado de 5–12 lecciones con repaso activo.",
  onboardWhyTitle: "¿Por qué este tema?",
  onboardWhySub: "Adaptaremos la profundidad y el tono a tu razón.",
  onboardWhyCurious: "Solo por curiosidad",
  onboardWhyWork: "Para mi trabajo",
  onboardWhyGrowth: "Crecimiento personal",
  onboardWhyExam: "Estudios o examen",
  onboardWhyFun: "Pura diversión",
  onboardGoalTitle: "¿Qué tan en serio te lo tomas?",
  onboardGoalSub: "Elige una meta diaria. Siempre podrás cambiarla después.",
  onboardGoalCasual: "Casual",
  onboardGoalCasualDesc: "1 lección al día",
  onboardGoalRegular: "Regular",
  onboardGoalRegularDesc: "3 lecciones al día",
  onboardGoalSerious: "Serio",
  onboardGoalSeriousDesc: "5 lecciones al día",
  reviewTitle: "Repaso diario",
  reviewSubtitle: "Refuerza lo que ya aprendiste. 5 ejercicios de lecciones anteriores.",
  reviewStart: "Empezar repaso",
  reviewNoneYet: "Completa una lección primero para desbloquear el modo de repaso.",
  reviewSourceLesson: "De",
  reviewEmpty: "Nada que repasar aún — vuelve después de haber completado algunas lecciones.",
  poweredByGemma: "Impulsado por Gemma 4 · pesos abiertos",
  whyMattersTitle: "Por qué esto importa",
  whyOpenTitle: "Gratis, incluso a gran escala",
  whyOpenBody: "Gemma 4 funciona en una sola GPU bajo Apache 2.0. Una escuela sin presupuesto de API por token puede autoalojar el mismo motor que impulsa este sitio.",
  whyAnyTopicTitle: "Cualquier tema, cualquier foto",
  whyAnyTopicBody: "Escribe un tema o captura una página. La visión de Gemma 4 convierte una foto de libro de texto, un diagrama o un objeto en un curso estructurado en segundos.",
  whyAnyLangTitle: "Más de 140 idiomas",
  whyAnyLangBody: "Las lecciones se generan de forma nativa en tu idioma. Ruso, turco, hindi, suajili — Gemma 4 cubre a los estudiantes que las principales APIs a veces no cubren.",
  fromPhotoTabBadge: "NUEVO",
  fromTopicBack: "volver a escribir un tema",
  orPhotograph: "o fotografía una página →",
  welcomeBack: "{em}Bienvenido{/em} de vuelta.",
  yourShelf: "Tu estantería",
  statDayStreak: "días seguidos",
  statXpEarned: "xp ganados",
  statBestStreak: "mejor racha",
  onboardStep: (n, total) => `Paso ${n} de ${total}`,
  lessonNumber: (n) => `Lección ${n}`,
  exerciseN: (n, total) => `Ejercicio ${n} de ${total}`,
  lessonsCount: (n) => `${n} ${n === 1 ? "lección" : "lecciones"}`,
  onboardMinPerDay: (n) => `~${n} min/día`,
  coursesPlural: (n) => `${n} ${n === 1 ? "curso" : "cursos"}`,
  completedPlural: (n) => `${n} ${n === 1 ? "completado" : "completados"}`,
  lessonsOf: (done, total) => `${done}/${total} lecciones`,
  reviewDueCount: (n) => `${n} ${n === 1 ? "lección lista" : "lecciones listas"}`,
};

const hi: Dict = {
  myCourses: "मेरे कोर्स",
  streakTitle: "दिनों की लकीर",
  xpTitle: "XP",
  dailyGoalTitle: "दैनिक लक्ष्य: 1 पाठ पूरा करें",
  dailyGoalDoneTitle: "दैनिक लक्ष्य पूरा हुआ",
  heroBadge: "AI आपके लिए एक कोर्स बनाता है",
  heroLine1: "कुछ भी सीखें।",
  heroLine2: "कदम दर कदम।",
  heroSub: "कोई भी विषय टाइप करें। छोटे-छोटे पाठों और अभ्यासों का एक संरचित कोर्स प्राप्त करें। हर चीज़ के लिए, डुओलिंगो की तरह।",
  featureStructuredTitle: "संरचित मार्ग",
  featureStructuredBody: "AI किसी भी विषय को 5-12 पाठों में विभाजित करता है, जो सरल से उन्नत की ओर बढ़ते हैं।",
  featurePracticeTitle: "सक्रिय अभ्यास",
  featurePracticeBody: "5 प्रकार के अभ्यास: बहुविकल्पीय, रिक्त स्थान भरें, मिलान करें, क्रमबद्ध करें, सही/गलत।",
  featureStreakTitle: "लगातार दिनों की लकीर और XP",
  featureStreakBody: "दैनिक लगातार दिनों की लकीर और अनुभव अंक आपको वापस आने के लिए प्रेरित करते हैं।",
  topicPlaceholder: "उदाहरण के लिए: LLM न्यूरल नेटवर्क कैसे काम करते हैं",
  levelLabel: "स्तर",
  depthLabel: "अवधि",
  levelBeginner: "शुरुआती",
  levelIntermediate: "मध्यवर्ती",
  levelAdvanced: "उन्नत",
  depth5: "5 पाठ",
  depth8: "8 पाठ",
  depth12: "12 पाठ",
  langLabel: "भाषा",
  createCourse: "कोर्स बनाएँ",
  generating: "कोर्स बनाया जा रहा है...",
  generatingHint: "इसमें 10-30 सेकंड लगते हैं। AI संरचना और पाठों के शीर्षक तैयार कर रहा है।",
  errorTooShort: "विषय कम से कम 2 अक्षर का होना चाहिए",
  errorGenerationFailed: "कोर्स नहीं बनाया जा सका",
  orPickIdea: "या एक विचार चुनें",
  suggestion1: "AI युग में मार्केटिंग",
  suggestion2: "स्टोइक दर्शन के मूल सिद्धांत",
  suggestion3: "ब्लॉकचेन कैसे काम करता है",
  suggestion4: "सिस्टम डिज़ाइन इंटरव्यू की तैयारी",
  suggestion5: "बीजान्टिन इतिहास",
  suggestion6: "उत्पाद प्रबंधन के मूल सिद्धांत",
  lessonCompleted: "पूरा हुआ",
  startLesson: "शुरू करें",
  replay: "दोबारा चलाएँ",
  newLesson: "नया पाठ",
  whatYoullLearn: "आप क्या सीखेंगे",
  startButton: "पाठ शुरू करें",
  preparingMaterial: "सामग्री तैयार की जा रही है...",
  preparingHint: "AI अभ्यास और सामग्री लिख रहा है। 10-20 सेकंड।",
  toCourse: "कोर्स पर वापस",
  toExercises: "अभ्यासों पर जाएँ",
  exitLesson: "पाठ से बाहर निकलें",
  matchPrompt: "मिलान करें",
  fillBlankPrompt: "रिक्त स्थान भरें",
  trueFalsePrompt: "सही या गलत?",
  orderPrompt: "क्रम में लगाएँ",
  pickToAddHere: "इन्हें यहाँ जोड़ने के लिए नीचे दिए गए आइटम पर टैप करें",
  check: "जाँच करें",
  next: "जारी रखें",
  trueLabel: "सही",
  falseLabel: "गलत",
  moveUp: "ऊपर ले जाएँ",
  moveDown: "नीचे ले जाएँ",
  remove: "हटाएँ",
  correct: "सही!",
  incorrect: "गलत",
  correctAnswerIs: "सही उत्तर:",
  correctlyIs: "सही ढंग से:",
  perfect: "उत्कृष्ट!",
  great: "बहुत बढ़िया!",
  passed: "पाठ पूरा हुआ",
  goodJob: "बहुत अच्छे, पूरा किया",
  perfectSub: "100% सही। इसे जारी रखें!",
  greatSub: "मजबूत परिणाम।",
  passedSub: "अब आप शुरुआत से ज़्यादा जानते हैं।",
  goodJobSub: "कठिन पाठ। फिर से कोशिश करें, यह आसान होगा।",
  withoutMistakes: "कोई गलती नहीं",
  xp: "XP",
  accuracy: "सटीकता",
  hearts: "हार्ट्स",
  continueCourse: "कोर्स जारी रखें",
  toMyCourses: "मेरे कोर्स पर",
  yourProgress: "आपकी प्रगति",
  daysInARow: "दिनों की लकीर",
  experienceLong: "XP",
  bestStreak: "सर्वश्रेष्ठ",
  dailyGoalDone: "दैनिक लक्ष्य पूरा हुआ",
  dailyGoalDoneSub: "लगातार दिनों की लकीर सुरक्षित है। जारी रखें या आराम करें।",
  dailyGoalNotDone: "लक्ष्य: आज 1 पाठ",
  dailyGoalNotDoneSub: "अपनी लगातार दिनों की लकीर बढ़ाने के लिए एक पाठ पूरा करें।",
  myCoursesTitle: "मेरे कोर्स",
  newCourse: "नया कोर्स",
  noCoursesYet: "अभी कोई कोर्स नहीं है।",
  createFirst: "पहला कोर्स बनाएँ",
  notFoundTitle: "पेज नहीं मिला",
  notFoundBody: "हो सकता है कि लिंक पुराना हो गया हो या कोर्स हटा दिया गया हो। आप एक नया शुरू कर सकते हैं।",
  goHome: "होम",
  somethingWrong: "कुछ गलत हो गया",
  unknownError: "अज्ञात त्रुटि। फिर से कोशिश करें।",
  retry: "फिर से कोशिश करें",
  loadingLabel: "लोड हो रहा है",
  tipLabel: "टिप",
  gotIt: "समझ गया",
  outOfHeartsTitle: "हार्ट्स खत्म हो गए",
  outOfHeartsBody: "थोड़ा ब्रेक लें या इस पाठ को फिर से शुरू से कोशिश करें।",
  retryLesson: "फिर से कोशिश करें",
  backToCourse: "कोर्स पर वापस",
  correctPhrases: ["बहुत अच्छे!", "शानदार!", "बिल्कुल सही!", "बूम!", "उत्कृष्ट!", "तेज!", "कमाल कर दिया!", "आग लगा दी!"],
  wrongPhrases: ["लगभग!", "पूरी तरह नहीं", "करीब था", "कोई बात नहीं", "एक बार फिर कोशिश करें"],
  signIn: "साइन इन करें",
  signUp: "साइन अप करें",
  saveProgress: "अपनी प्रगति सहेजें",
  guestModeBadge: "मेहमान",
  migratingProgress: "आपकी प्रगति को आपके खाते में सहेजा जा रहा है...",
  migrationDone: "प्रगति सहेजी गई",
  onboardSkip: "छोड़ें",
  onboardBack: "वापस",
  onboardContinue: "जारी रखें",
  onboardStart: "सीखना शुरू करें",
  onboardTopicTitle: "आप {em}क्या{/em} सीखना चाहते हैं?",
  onboardTopicSub: "एक विषय, पाठ्यपुस्तक का पन्ना, या YouTube लिंक। हम इसे सक्रिय स्मरण के साथ 5–12 पाठों का संरचित कोर्स बना देते हैं।",
  onboardWhyTitle: "यह विषय क्यों?",
  onboardWhySub: "हम आपकी वजह के अनुसार गहराई और लहजे का मिलान करेंगे।",
  onboardWhyCurious: "बस उत्सुक हूँ",
  onboardWhyWork: "मेरे काम के लिए",
  onboardWhyGrowth: "व्यक्तिगत विकास",
  onboardWhyExam: "स्कूल या परीक्षा",
  onboardWhyFun: "केवल मनोरंजन के लिए",
  onboardGoalTitle: "आप कितने गंभीर हैं?",
  onboardGoalSub: "एक दैनिक लक्ष्य चुनें। आप इसे बाद में कभी भी बदल सकते हैं।",
  onboardGoalCasual: "सामान्य",
  onboardGoalCasualDesc: "प्रति दिन 1 पाठ",
  onboardGoalRegular: "नियमित",
  onboardGoalRegularDesc: "प्रति दिन 3 पाठ",
  onboardGoalSerious: "गंभीर",
  onboardGoalSeriousDesc: "प्रति दिन 5 पाठ",
  reviewTitle: "दैनिक समीक्षा",
  reviewSubtitle: "जो आपने पहले ही सीखा है उसे मजबूत करें। पिछले पाठों से 5 अभ्यास।",
  reviewStart: "समीक्षा शुरू करें",
  reviewNoneYet: "समीक्षा मोड अनलॉक करने के लिए पहले एक पाठ पूरा करें।",
  reviewSourceLesson: "से",
  reviewEmpty: "अभी समीक्षा करने के लिए कुछ भी नहीं है — कुछ पाठ पूरे करने के बाद वापस आएँ।",
  poweredByGemma: "जेम्मा 4 द्वारा संचालित · ओपन-वेट्स",
  whyMattersTitle: "यह क्यों मायने रखता है",
  whyOpenTitle: "बड़े पैमाने पर भी, मुफ्त",
  whyOpenBody: "जेम्मा 4 अपाचे 2.0 के तहत एक सिंगल जीपीयू पर चलता है। प्रति-टोकन एपीआई बजट के बिना एक स्कूल उसी इंजन को स्वयं होस्ट कर सकता है जो इस साइट को शक्ति प्रदान करता है।",
  whyAnyTopicTitle: "कोई भी विषय, कोई भी फोटो",
  whyAnyTopicBody: "कोई विषय टाइप करें या एक पेज की फोटो लें। जेम्मा 4 का विजन एक पाठ्यपुस्तक की फोटो, एक आरेख, या एक वस्तु को सेकंडों में एक संरचित कोर्स में बदल देता है।",
  whyAnyLangTitle: "140+ भाषाएँ",
  whyAnyLangBody: "पाठ आपकी भाषा में मूल रूप से उत्पन्न होते हैं। रूसी, तुर्की, हिंदी, स्वाहिली — जेम्मा 4 उन शिक्षार्थियों को कवर करता है जिन्हें प्रमुख एपीआई कभी-कभी नहीं करते।",
  fromPhotoTabBadge: "नया",
  fromTopicBack: "विषय टाइप करने पर वापस जाएं",
  orPhotograph: "या किसी पन्ने की तस्वीर लें →",
  welcomeBack: "{em}वापसी{/em} पर स्वागत है।",
  yourShelf: "आपकी शेल्फ",
  statDayStreak: "दिन की लकीर",
  statXpEarned: "xp अर्जित",
  statBestStreak: "सर्वश्रेष्ठ लकीर",
  onboardStep: (n, total) => `चरण ${n} / ${total}`,
  lessonNumber: (n) => `पाठ ${n}`,
  exerciseN: (n, total) => `अभ्यास ${n} / ${total}`,
  lessonsCount: (n) => `${n} पाठ`,
  onboardMinPerDay: (n) => `~${n} मिनट/दिन`,
  coursesPlural: (n) => `${n} कोर्स`,
  completedPlural: (n) => `${n} पूरे`,
  lessonsOf: (done, total) => `${done}/${total} पाठ`,
  reviewDueCount: (n) => `${n} पाठ तैयार`,
};

const ar: Dict = {
  myCourses: "دوراتي",
  streakTitle: "سلسلة الأيام المتتالية",
  xpTitle: "XP",
  dailyGoalTitle: "الهدف اليومي: أكمل درسًا واحدًا",
  dailyGoalDoneTitle: "تم إنجاز الهدف اليومي",
  heroBadge: "الذكاء الاصطناعي ينشئ لك دورة تدريبية",
  heroLine1: "تعلم أي شيء.",
  heroLine2: "خطوة بخطوة.",
  heroSub: "اكتب أي موضوع. احصل على دورة منظمة من الدروس والتمارين القصيرة. مثل دوولينجو، لكل شيء.",
  featureStructuredTitle: "مسار منظم",
  featureStructuredBody: "يقوم الذكاء الاصطناعي بتقسيم أي موضوع إلى 5-12 درسًا، متدرجًا من البسيط إلى المتقدم.",
  featurePracticeTitle: "ممارسة نشطة",
  featurePracticeBody: "5 أنواع من التمارين: اختيار من متعدد، ملء الفراغ، مطابقة، ترتيب، صواب/خطأ.",
  featureStreakTitle: "السلسلة ونقاط الخبرة",
  featureStreakBody: "السلسلة اليومية ونقاط الخبرة تجعلك تعود للمتابعة.",
  topicPlaceholder: "مثال: كيف تعمل الشبكات العصبية للنماذج اللغوية الكبيرة",
  levelLabel: "المستوى",
  depthLabel: "المدة",
  levelBeginner: "مبتدئ",
  levelIntermediate: "متوسط",
  levelAdvanced: "متقدم",
  depth5: "5 دروس",
  depth8: "8 دروس",
  depth12: "12 درسًا",
  langLabel: "اللغة",
  createCourse: "إنشاء دورة",
  generating: "جاري إنشاء الدورة...",
  generatingHint: "يستغرق هذا من 10 إلى 30 ثانية. يقوم الذكاء الاصطناعي بإعداد الهيكل وعناوين الدروس.",
  errorTooShort: "يجب أن يتكون الموضوع من حرفين على الأقل",
  errorGenerationFailed: "تعذر إنشاء الدورة",
  orPickIdea: "أو اختر فكرة",
  suggestion1: "التسويق في عصر الذكاء الاصطناعي",
  suggestion2: "أساسيات الفلسفة الرواقية",
  suggestion3: "كيف تعمل تقنية البلوك تشين",
  suggestion4: "التحضير لمقابلة تصميم الأنظمة",
  suggestion5: "تاريخ الإمبراطورية البيزنطية",
  suggestion6: "أساسيات إدارة المنتجات",
  lessonCompleted: "مكتمل",
  startLesson: "ابدأ",
  replay: "إعادة",
  newLesson: "درس جديد",
  whatYoullLearn: "ما ستتعلمه",
  startButton: "ابدأ الدرس",
  preparingMaterial: "جاري تحضير المحتوى...",
  preparingHint: "يقوم الذكاء الاصطناعي بكتابة التمارين والمحتوى. 10-20 ثانية.",
  toCourse: "العودة إلى الدورة",
  toExercises: "اذهب إلى التمارين",
  exitLesson: "الخروج من الدرس",
  matchPrompt: "طابق",
  fillBlankPrompt: "املأ الفراغ",
  trueFalsePrompt: "صواب أم خطأ؟",
  orderPrompt: "رتب",
  pickToAddHere: "اضغط على العناصر أدناه لإضافتها هنا",
  check: "تحقق",
  next: "متابعة",
  trueLabel: "صواب",
  falseLabel: "خطأ",
  moveUp: "تحريك للأعلى",
  moveDown: "تحريك للأسفل",
  remove: "إزالة",
  correct: "صحيح!",
  incorrect: "غير صحيح",
  correctAnswerIs: "الإجابة الصحيحة:",
  correctlyIs: "بشكل صحيح:",
  perfect: "ممتاز!",
  great: "رائع!",
  passed: "تم إنجاز الدرس",
  goodJob: "أحسنت!",
  perfectSub: "100% صحيح. استمر!",
  greatSub: "نتيجة قوية.",
  passedSub: "أنت تعرف الآن أكثر مما كنت تعرف في البداية.",
  goodJobSub: "درس صعب. حاول مرة أخرى، سيكون أسهل.",
  withoutMistakes: "بدون أخطاء",
  xp: "XP",
  accuracy: "الدقة",
  hearts: "قلوب",
  continueCourse: "متابعة الدورة",
  toMyCourses: "إلى دوراتي",
  yourProgress: "تقدمك",
  daysInARow: "سلسلة أيام متتالية",
  experienceLong: "XP",
  bestStreak: "الأفضل",
  dailyGoalDone: "تم إنجاز الهدف اليومي",
  dailyGoalDoneSub: "سلسلتك آمنة. استمر أو استرح.",
  dailyGoalNotDone: "الهدف: درس واحد اليوم",
  dailyGoalNotDoneSub: "أكمل درسًا واحدًا لتمديد سلسلتك.",
  myCoursesTitle: "دوراتي",
  newCourse: "دورة جديدة",
  noCoursesYet: "لا توجد دورات بعد.",
  createFirst: "أنشئ أول دورة لك",
  notFoundTitle: "الصفحة غير موجودة",
  notFoundBody: "ربما الرابط قديم أو تم حذف الدورة. يمكنك بدء دورة جديدة.",
  goHome: "الرئيسية",
  somethingWrong: "حدث خطأ ما",
  unknownError: "خطأ غير معروف. حاول مرة أخرى.",
  retry: "إعادة المحاولة",
  loadingLabel: "جاري التحميل",
  tipLabel: "نصيحة",
  gotIt: "فهمت",
  outOfHeartsTitle: "نفدت القلوب",
  outOfHeartsBody: "خذ قسطًا من الراحة أو حاول هذا الدرس مرة أخرى من البداية.",
  retryLesson: "حاول مرة أخرى",
  backToCourse: "العودة إلى الدورة",
  correctPhrases: ["رائع!", "ممتاز!", "في الصميم!", "أحسنت!", "مثالي!", "ذكي!", "أبدعت!", "أنت متألق!"],
  wrongPhrases: ["تقريبًا!", "ليس تمامًا", "قريب جدًا", "لا تقلق", "حاول مرة أخرى"],
  signIn: "تسجيل الدخول",
  signUp: "إنشاء حساب",
  saveProgress: "احفظ تقدمك",
  guestModeBadge: "ضيف",
  migratingProgress: "جاري حفظ تقدمك في حسابك...",
  migrationDone: "تم حفظ التقدم",
  onboardSkip: "تخطي",
  onboardBack: "رجوع",
  onboardContinue: "متابعة",
  onboardStart: "ابدأ التعلم",
  onboardTopicTitle: "ماذا تريد أن {em}تتعلم؟{/em}",
  onboardTopicSub: "موضوع، صفحة كتاب، رابط يوتيوب. نحوّله إلى دورة منظمة من 5 إلى 12 درسًا مع تذكر نشط.",
  onboardWhyTitle: "لماذا هذا الموضوع؟",
  onboardWhySub: "سوف نناسب العمق والنبرة لسببك.",
  onboardWhyCurious: "مجرد فضول",
  onboardWhyWork: "لعملي",
  onboardWhyGrowth: "تطوير ذاتي",
  onboardWhyExam: "دراسة أو امتحان",
  onboardWhyFun: "للمتعة فقط",
  onboardGoalTitle: "ما مدى جديتك؟",
  onboardGoalSub: "اختر هدفًا يوميًا. يمكنك دائمًا تغييره لاحقًا.",
  onboardGoalCasual: "عادي",
  onboardGoalCasualDesc: "درس واحد يوميًا",
  onboardGoalRegular: "منتظم",
  onboardGoalRegularDesc: "3 دروس يوميًا",
  onboardGoalSerious: "جدي",
  onboardGoalSeriousDesc: "5 دروس يوميًا",
  reviewTitle: "مراجعة يومية",
  reviewSubtitle: "عزز ما تعلمته بالفعل. 5 تمارين من الدروس السابقة.",
  reviewStart: "ابدأ المراجعة",
  reviewNoneYet: "أكمل درسًا أولاً لفتح وضع المراجعة.",
  reviewSourceLesson: "من",
  reviewEmpty: "لا يوجد شيء للمراجعة بعد — عد بعد إكمال بعض الدروس.",
  poweredByGemma: "مدعوم بواسطة جيما 4 · أوزان مفتوحة",
  whyMattersTitle: "لماذا هذا مهم",
  whyOpenTitle: "مجاني، حتى على نطاق واسع",
  whyOpenBody: "يعمل جيما 4 على وحدة معالجة رسومات واحدة بموجب ترخيص Apache 2.0. يمكن لمدرسة ليس لديها ميزانية API لكل رمز استضافة نفس المحرك الذي يدعم هذا الموقع.",
  whyAnyTopicTitle: "أي موضوع، أي صورة",
  whyAnyTopicBody: "اكتب موضوعًا أو التقط صورة لصفحة. تحول رؤية جيما 4 صورة كتاب مدرسي أو رسم بياني أو كائن إلى دورة منظمة في ثوانٍ.",
  whyAnyLangTitle: "أكثر من 140 لغة",
  whyAnyLangBody: "يتم إنشاء الدروس بلغتك الأم. الروسية، التركية، الهندية، السواحلية — يغطي جيما 4 المتعلمين الذين لا تغطيهم واجهات برمجة التطبيقات الرئيسية أحيانًا.",
  fromPhotoTabBadge: "جديد",
  fromTopicBack: "العودة إلى كتابة الموضوع",
  orPhotograph: "أو التقط صورة لصفحة ←",
  welcomeBack: "{em}مرحبًا{/em} بعودتك.",
  yourShelf: "رفك",
  statDayStreak: "يوم متتالي",
  statXpEarned: "نقاط الخبرة",
  statBestStreak: "أفضل سلسلة",
  onboardStep: (n, total) => `الخطوة ${n} من ${total}`,
  lessonNumber: (n) => `الدرس ${n}`,
  exerciseN: (n, total) => `التمرين ${n} من ${total}`,
  lessonsCount: (n) => n === 1 ? `درس واحد` : n === 2 ? `درسان` : n <= 10 ? `${n} دروس` : `${n} درساً`,
  onboardMinPerDay: (n) => `~${n} دقيقة/يوم`,
  coursesPlural: (n) => n === 1 ? `دورة واحدة` : n === 2 ? `دورتان` : n <= 10 ? `${n} دورات` : `${n} دورة`,
  completedPlural: (n) => `${n} مكتملة`,
  lessonsOf: (done, total) => `${done}/${total} دروس`,
  reviewDueCount: (n) => `${n} ${n === 1 ? "درس جاهز" : "دروس جاهزة"}`,
};

export const dicts: Record<Locale, Dict> = { en, ru, tr, es, hi, ar };

export function getDict(locale: Locale): Dict {
  return dicts[locale] ?? dicts[DEFAULT_LOCALE];
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as string[]).includes(value);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  if (!value) return DEFAULT_LOCALE;
  const lc = value.toLowerCase().split("-")[0];
  return isLocale(lc) ? lc : DEFAULT_LOCALE;
}

/** Server-side: read locale cookie. */
export async function getServerLocale(): Promise<Locale> {
  const { cookies } = await import("next/headers");
  const c = await cookies();
  return normalizeLocale(c.get(LOCALE_COOKIE)?.value);
}

export async function getServerT(): Promise<Dict> {
  return getDict(await getServerLocale());
}
