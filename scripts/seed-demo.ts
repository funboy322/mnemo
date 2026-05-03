/**
 * Seeds a demo course with full hand-crafted content so you can play
 * through the entire UX without an AI key.
 *
 * Run: npx tsx scripts/seed-demo.ts [optional-userId]
 *
 * If userId omitted, uses "u_demo". Open localhost:3000 with that user
 * by setting localStorage.curio.userId = "u_demo" in browser DevTools,
 * then visit /dashboard.
 */
import { db } from "../lib/db";
import { courses, lessons } from "../lib/db-schema";
import { eq } from "drizzle-orm";
import { generateId } from "../lib/repository";
import type { CourseOutline, LessonContent } from "../lib/schemas";

const userId = process.argv[2] || "u_demo";

const outline: CourseOutline = {
  title: "Стоицизм за 5 уроков",
  description: "Древняя философия для современной жизни. Что Марк Аврелий и Сенека знали о тревоге, контроле и принятии — и как этим пользоваться сегодня.",
  emoji: "🏛️",
  lessons: [
    {
      title: "Дихотомия контроля",
      summary: "Главная идея: одни вещи в твоей власти, другие — нет.",
      objectives: [
        "Различать что зависит от тебя, а что нет",
        "Применить дихотомию к конкретной жизненной ситуации",
        "Понять почему попытка контролировать неконтролируемое = страдание",
      ],
    },
    {
      title: "Премедитация — мысленная репетиция плохого",
      summary: "Почему стоики намеренно представляли худший исход — и как это снижает тревогу.",
      objectives: [
        "Понять механику premeditatio malorum",
        "Применить технику к собственной тревоге",
      ],
    },
    {
      title: "Amor fati — любовь к судьбе",
      summary: "Не просто принимать что произошло, а любить это.",
      objectives: [
        "Различить пассивное смирение и активное приятие",
        "Применить amor fati к недавней неудаче",
      ],
    },
    {
      title: "Memento mori — помни о смерти",
      summary: "Зачем стоики ежедневно напоминали себе о конечности — и почему это делает жизнь насыщеннее.",
      objectives: [
        "Понять разницу между морбидностью и стоической памятью смерти",
        "Применить технику к выбору на следующий день",
      ],
    },
    {
      title: "Стоик в современном офисе",
      summary: "Конкретные сценарии: дедлайн, конфликт с коллегой, токсичный начальник.",
      objectives: [
        "Применить дихотомию к рабочему стрессу",
        "Использовать premeditatio перед сложной встречей",
      ],
    },
  ],
};

const lesson1Content: LessonContent = {
  blocks: [
    {
      type: "concept",
      heading: "Главное различие",
      body: "Эпиктет, бывший раб ставший философом, начал свои **Беседы** одним предложением: *«Из всего существующего одно зависит от нас, другое — нет»*.\n\nОт нас зависят: мнения, стремления, желания, реакции. Не зависят: тело, имущество, репутация, должности — всё, что не является нашими собственными действиями.\n\nЭто не пессимизм. Это карта. Если ты тратишь энергию на то что **не** в твоей власти — ты гарантированно страдаешь.",
      keyPoints: [
        "Внутри власти: твои суждения, реакции, усилия",
        "Вне власти: чужое мнение о тебе, погода, прошлое, исход",
      ],
    },
    {
      type: "example",
      heading: "Пример: пробка на дороге",
      body: "Ты опаздываешь на встречу. Стоишь в пробке.\n\n**Не в твоей власти:** факт пробки, сколько она продлится, во сколько ты приедешь.\n\n**В твоей власти:** позвонить и предупредить, использовать время на что-то полезное (аудиокнига, звонок другу), не злиться.\n\nЗлость на пробку — это попытка контролировать неконтролируемое. Это и есть страдание по Эпиктету.",
    },
  ],
  exercises: [
    {
      type: "multiple_choice",
      question: "Что из перечисленного, согласно Эпиктету, находится в твоей власти?",
      options: [
        "Мнение начальника о твоей презентации",
        "Реакция на критику твоей презентации",
        "Результат презентации для бизнеса",
        "Погода в день презентации",
      ],
      correctIndex: 1,
      explanation: "В твоей власти только твои собственные действия и реакции. Мнения других, результаты и внешние обстоятельства — нет.",
    },
    {
      type: "true_false",
      statement: "Стоики учили смирению перед судьбой и пассивному принятию всего что происходит.",
      isTrue: false,
      explanation: "Это распространённое заблуждение. Стоики учили активным усилиям в зоне своего контроля и спокойствию перед тем что вне контроля. Эпиктет, Марк Аврелий и Сенека все были крайне деятельными людьми.",
    },
    {
      type: "fill_blank",
      sentence: "Главный принцип стоической этики: одни вещи зависят от нас, другие — ___.",
      answer: "нет",
      acceptableAlternatives: ["не зависят", "не зависят от нас"],
      explanation: "Эпиктет открывает Беседы именно этой формулировкой.",
    },
    {
      type: "matching",
      prompt: "Сопоставь ситуацию с тем, что в ней в твоей власти",
      pairs: [
        { left: "Тебя уволили", right: "Как ты воспримешь это и что сделаешь дальше" },
        { left: "Друг не позвонил на день рождения", right: "Твоя интерпретация этого факта" },
        { left: "На улице ливень", right: "Взять зонт и не жаловаться" },
        { left: "Коллега получил повышение вместо тебя", right: "Чему ты можешь научиться у него" },
      ],
    },
    {
      type: "order",
      prompt: "Расставь шаги стоической реакции на проблему по порядку",
      items: [
        "Заметить эмоциональную реакцию (злость, тревогу)",
        "Спросить себя: это в моей власти или нет?",
        "Если нет — отпустить попытку контроля",
        "Если да — действовать спокойно и эффективно",
      ],
      explanation: "Это базовый стоический алгоритм работы с реакцией. Сначала осознание, потом классификация, потом действие или отпускание.",
    },
  ],
};

const lesson5Content: LessonContent = {
  blocks: [
    {
      type: "concept",
      heading: "Стоицизм работает в офисе",
      body: "Принципы, которые мы прошли, не музейные экспонаты. Они идеально ложатся на самые токсичные офисные ситуации.\n\nДедлайн горит → дихотомия (что я могу сделать сейчас vs что уже не успеть). Босс орёт → premeditatio (я представлял что такое случится — это не катастрофа). Получил отказ на повышение → amor fati (это часть моего пути, что я могу извлечь?).",
    },
    {
      type: "example",
      heading: "Сценарий: коллега украл твою идею на встрече",
      body: "**Реакция новичка:** злость, обида, желание мести, прокручивание в голове 3 дня.\n\n**Стоическая реакция:** \"Что в моей власти?\" → следующая идея, моя репутация в долгосроке, документирование своих идей до встречи. \"Что не в моей власти?\" → его поведение, мнение начальника прямо сейчас, прошлое.\n\n**Результат:** ты двигаешься дальше за час вместо трёх дней.",
    },
  ],
  exercises: [
    {
      type: "multiple_choice",
      question: "Дедлайн завтра, ты не успеваешь. Стоическая реакция:",
      options: [
        "Паниковать — это покажет начальнику что задача важна",
        "Делать что в моих силах, заранее предупредить о сдвиге если нужно",
        "Делегировать всем кому можно, даже если это создаст хаос",
        "Не думать о дедлайне, а то будет хуже",
      ],
      correctIndex: 1,
      explanation: "Дихотомия в действии: я контролирую свои усилия и коммуникацию, не контролирую время. Спокойное действие + честная коммуникация.",
    },
    {
      type: "fill_blank",
      sentence: "Перед сложной встречей стоики использовали ___ — мысленную репетицию худшего исхода.",
      answer: "premeditatio",
      acceptableAlternatives: ["премедитацию", "premeditatio malorum"],
      explanation: "Premeditatio malorum снимает 80% тревоги — потому что когда ты уже представил худшее, реальность редко оказывается хуже.",
    },
    {
      type: "true_false",
      statement: "Если коллега получил повышение вместо тебя, стоик скажет: «это судьба, ничего не поделаешь» и забудет.",
      isTrue: false,
      explanation: "Стоик не пассивен. Он спросит: что в моей власти изменить чтобы повысилась вероятность в следующий раз? Может это навыки, может это видимость работы, может это смена компании.",
    },
    {
      type: "order",
      prompt: "Стоический алгоритм перед сложной встречей",
      items: [
        "Premeditatio: представить худший возможный исход встречи",
        "Спросить себя: что из этого реально катастрофа, а что просто неприятно?",
        "Дихотомия: что я могу подготовить, что не могу контролировать",
        "Идти на встречу спокойным и подготовленным",
      ],
      explanation: "Этот алгоритм используется CEO и переговорщиками без всякой философии — стоики просто описали его 2000 лет назад.",
    },
    {
      type: "matching",
      prompt: "Сопоставь стоическую технику с офисной ситуацией",
      pairs: [
        { left: "Дихотомия контроля", right: "Дедлайн который я не успеваю" },
        { left: "Premeditatio malorum", right: "Презентация перед советом директоров" },
        { left: "Amor fati", right: "Не получил повышение в этом квартале" },
        { left: "Memento mori", right: "Зачем я тут вообще трачу свою жизнь" },
      ],
    },
  ],
};

async function main() {
  console.log(`🌱 Seeding demo course for user: ${userId}`);

  // Idempotent: clear existing demo courses for this user
  const existing = db.select().from(courses)
    .where(eq(courses.userId, userId))
    .all()
    .filter((c) => c.title === outline.title);

  for (const c of existing) {
    db.delete(courses).where(eq(courses.id, c.id)).run();
    console.log(`   🗑  Removed previous demo course ${c.id}`);
  }

  const courseId = generateId("c");
  db.insert(courses).values({
    id: courseId,
    userId,
    topic: "Стоицизм для современной жизни",
    level: "beginner",
    language: "ru",
    title: outline.title,
    description: outline.description,
    emoji: outline.emoji,
    outline,
    createdAt: new Date(),
  }).run();
  console.log(`   ✅ Course ${courseId}`);

  outline.lessons.forEach((lesson, i) => {
    const lessonId = generateId("l");
    // Pre-fill content for lesson 1 and lesson 5 — the others will lazy-generate (but
    // will fail without API key, that's ok — user can play 1 and 5 to see the full UX).
    let content: LessonContent | null = null;
    if (i === 0) content = lesson1Content;
    if (i === 4) content = lesson5Content;

    db.insert(lessons).values({
      id: lessonId,
      courseId,
      position: i,
      title: lesson.title,
      summary: lesson.summary,
      objectives: lesson.objectives,
      content,
      generatedAt: content ? new Date() : null,
    }).run();
    console.log(`   ✅ Lesson ${i + 1}: ${lesson.title}${content ? " (with content)" : " (outline only)"}`);
  });

  console.log("");
  console.log(`📋 Чтобы увидеть демо в браузере:`);
  console.log(`   1. Открой http://localhost:3000`);
  console.log(`   2. DevTools → Console:`);
  console.log(`      localStorage.setItem('curio.userId', '${userId}'); location.reload();`);
  console.log(`   3. Перейди на /dashboard — увидишь курс`);
  console.log(`   4. Уроки 1 и 5 проходимы. Уроки 2-4 покажут intro, но контент ленится сгенериться через API (без ключа упадёт).`);
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
