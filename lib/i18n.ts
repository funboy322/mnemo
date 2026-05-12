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
export const SUPPORTED_LOCALES: Locale[] = ["en", "ru", "tr"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  tr: "Türkçe",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
  tr: "🇹🇷",
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
  onboardTopicTitle: "What do you want to learn?",
  onboardTopicSub: "Any topic. Be specific — the more concrete, the better the course.",
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
  whyAnyLangTitle: "140+ languages",
  whyAnyLangBody: "Lessons generate natively in your language. Russian, Turkish, Hindi, Swahili — Gemma 4 covers learners the major APIs sometimes don't.",
  fromPhotoTabBadge: "NEW",
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
  onboardTopicTitle: "Что хочешь изучить?",
  onboardTopicSub: "Любая тема. Чем конкретнее, тем лучше получится курс.",
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
  whyAnyLangTitle: "140+ языков",
  whyAnyLangBody: "Уроки нативно генерируются на твоём языке. Русский, турецкий, хинди, суахили — Gemma 4 покрывает учеников, до которых крупные API часто не дотягиваются.",
  fromPhotoTabBadge: "НОВОЕ",
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
  onboardTopicTitle: "Ne öğrenmek istersin?",
  onboardTopicSub: "Herhangi bir konu. Ne kadar net olursa, kurs o kadar iyi olur.",
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
  whyAnyLangTitle: "140+ dil",
  whyAnyLangBody: "Dersler senin dilinde doğrudan üretilir. Türkçe, Rusça, Hintçe, Svahili — büyük API'lerin bazen ulaşamadığı öğrencileri Gemma 4 kapsar.",
  fromPhotoTabBadge: "YENİ",
};

export const dicts: Record<Locale, Dict> = { en, ru, tr };

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
