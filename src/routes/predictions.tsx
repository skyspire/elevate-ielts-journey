import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  PenLine,
  Mic,
  BookOpen,
  Headphones,
  Flame,
  TrendingUp,
  Lightbulb,
  Lock,
  ChevronDown,
  Check,
  X,
  Pencil,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { BackButton } from "@/components/site/BackButton";
import { QuotaGate } from "@/components/site/QuotaGate";
import { TypeGate } from "@/components/site/TypeGate";
import {
  usePredictionAnswer,
  savePredictionAnswer,
  answerParagraphs,
  type PredictionAnswer,
} from "@/lib/admin/predictions-answers";
import { useSession, canEdit } from "@/lib/admin/auth";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "IELTS Predictions for Your Next Exam — BigIELTS" },
      {
        name: "description",
        content:
          "Topics most likely to appear in your next IELTS sitting — Writing, Speaking, Reading and Listening, ranked by likelihood and updated weekly by our IELTS specialists.",
      },
      { property: "og:title", content: "IELTS Predictions — BigIELTS" },
      {
        property: "og:description",
        content:
          "Predicted topics for the next IELTS exam, grouped by skill and ranked by likelihood. Updated weekly.",
      },
    ],
  }),
  component: GatedPredictionsPage,
});

function GatedPredictionsPage() {
  return (
    <QuotaGate itemKey="predictions">
      <PredictionsPage />
    </QuotaGate>
  );
}

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type SkillKey = "writing" | "speaking" | "reading" | "listening";
type Tier = "hot" | "likely" | "review";
type ExamKey = "academic" | "general";
type ExamScope = ExamKey | "both";

type Prediction = {
  tag: string;
  tagTone: "blue" | "mint" | "peach" | "lilac";
  type:
    | "Writing Task 1"
    | "Writing Task 2"
    | "Speaking Part 1"
    | "Speaking Part 2"
    | "Speaking Part 3"
    | "Listening"
    | "Reading";
  /** Task-type slug within the skill (e.g. "task2", "part2", "mcq"). Auto-derived from `type` when omitted. */
  taskType?: string;
  title: string;
  date: string;
  tier: Tier;
  exam?: ExamScope; // defaults to "both"
  confidence?: number;
  /** Lifetime exam appearances (not last 12 months). */
  appearances?: number;
  /** ISO YYYY-MM. Omit = current month. */
  month?: string;
};

/** Task types shown as chips under each module tab. */
const TASK_TYPES_BY_SKILL: Record<SkillKey, { id: string; label: string }[]> = {
  writing: [
    { id: "task1", label: "Task 1" },
    { id: "task2", label: "Task 2" },
  ],
  speaking: [
    { id: "part1", label: "Part 1" },
    { id: "part2", label: "Part 2 (Cue Card)" },
    { id: "part3", label: "Part 3" },
  ],
  reading: [
    { id: "tfng", label: "True / False / Not Given" },
    { id: "ynng", label: "Yes / No / Not Given" },
    { id: "headings", label: "Matching Headings" },
    { id: "matching-info", label: "Matching Information" },
    { id: "mcq", label: "Multiple Choice" },
    { id: "summary", label: "Summary Completion" },
    { id: "sentence", label: "Sentence Completion" },
    { id: "short-answer", label: "Short Answer" },
  ],
  listening: [
    { id: "mcq", label: "Multiple Choice" },
    { id: "matching", label: "Matching" },
    { id: "map", label: "Map / Plan Labelling" },
    { id: "form", label: "Form Completion" },
    { id: "note", label: "Note Completion" },
    { id: "table", label: "Table Completion" },
    { id: "sentence", label: "Sentence Completion" },
    { id: "short-answer", label: "Short Answer" },
  ],
};

/** The "current" prediction cycle. Items with no month default to this. */
const CURRENT_MONTH = "2026-05";

function formatMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const d = new Date(y, (m ?? 1) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function MonthHeadline({ iso, accent }: { iso: string; accent: string }) {
  const [y, m] = iso.split("-").map(Number);
  const d = new Date(y, (m ?? 1) - 1, 1);
  const monthFull = d.toLocaleDateString("en-GB", { month: "long" }).toUpperCase();
  const monthShort = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const year = String(y);

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="flex items-center gap-4 sm:gap-6">
        <span
          aria-hidden
          className="h-px w-10 sm:w-16"
          style={{ background: `color-mix(in oklab, ${accent} 35%, transparent)` }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.32em] text-foreground/55"
        >
          The {monthShort} {year} sitting
        </span>
        <span
          aria-hidden
          className="h-px w-10 sm:w-16"
          style={{ background: `color-mix(in oklab, ${accent} 35%, transparent)` }}
        />
      </div>

      <h2
        className="mt-3 font-display font-black leading-[0.85] tracking-[-0.04em] transition-colors duration-700"
        style={{
          fontSize: "clamp(3.5rem, 14vw, 7.5rem)",
          color: accent,
        }}
      >
        {monthFull}
      </h2>

      <div className="mt-1 flex items-baseline gap-3">
        <span
          className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl"
          style={{ color: accent, opacity: 0.85 }}
        >
          {year}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/50">
          predictions
        </span>
      </div>

      <p className="mt-3 max-w-md text-center text-[12px] text-foreground/50 sm:text-[13px]">
        Refreshed every Monday by our qualified IELTS team.
      </p>
    </div>
  );
}


const PREDICTIONS: Record<SkillKey, Prediction[]> = {
  writing: [
    {
      tag: "Environment",
      tagTone: "mint",
      type: "Writing Task 2",
      title:
        "Some people believe individuals can do little to protect the environment. To what extent do you agree?",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "both",
      confidence: 92,
      appearances: 24,
    },
    {
      tag: "Education",
      tagTone: "blue",
      type: "Writing Task 2",
      title:
        "Many universities now offer online courses. Are the benefits greater than the drawbacks?",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "both",
      confidence: 88,
      appearances: 19,
    },
    {
      tag: "Bar Chart",
      tagTone: "peach",
      type: "Writing Task 1",
      title:
        "The chart compares household spending on leisure activities across four countries in 2024.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "academic",
      confidence: 85,
      appearances: 17,
    },
    {
      tag: "Complaint Letter",
      tagTone: "peach",
      type: "Writing Task 1",
      title:
        "Write a letter to a shop manager about a faulty product you bought recently. Explain the problem and what you want done.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "general",
      confidence: 87,
      appearances: 21,
    },
    {
      tag: "Technology",
      tagTone: "lilac",
      type: "Writing Task 2",
      title:
        "Some argue that smartphones harm face-to-face communication. Discuss both views and give your opinion.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "both",
    },
    {
      tag: "Process",
      tagTone: "peach",
      type: "Writing Task 1",
      title: "The diagram shows how recycled plastic bottles are turned into clothing fibres.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "academic",
    },
    {
      tag: "Invitation Letter",
      tagTone: "lilac",
      type: "Writing Task 1",
      title:
        "Write a letter inviting a friend to visit your new home. Describe the place and suggest things to do together.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "general",
    },
    {
      tag: "Society",
      tagTone: "blue",
      type: "Writing Task 2",
      title:
        "In some countries the number of older people is rising. What problems does this cause and how can they be solved?",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "both",
    },
    {
      tag: "Health",
      tagTone: "mint",
      type: "Writing Task 2",
      title:
        "Fast food is becoming increasingly popular. Do the disadvantages outweigh the advantages?",
      date: "Worth reviewing",
      tier: "review",
      exam: "both",
    },
    {
      tag: "Map",
      tagTone: "peach",
      type: "Writing Task 1",
      title: "Two maps showing changes in a coastal town between 2000 and 2024.",
      date: "Worth reviewing",
      tier: "review",
      exam: "academic",
    },
    {
      tag: "Request Letter",
      tagTone: "blue",
      type: "Writing Task 1",
      title:
        "Write a letter to your employer asking for time off to attend a family event. Explain why and suggest cover.",
      date: "Worth reviewing",
      tier: "review",
      exam: "general",
    },
    /* ---------- Archive: April 2026 ---------- */
    {
      tag: "Crime",
      tagTone: "blue",
      type: "Writing Task 2",
      title:
        "Some believe prison is the best punishment; others prefer education and community work. Discuss both views.",
      date: "Published April 2026",
      tier: "hot",
      exam: "both",
      month: "2026-04",
    },
    {
      tag: "Line Graph",
      tagTone: "peach",
      type: "Writing Task 1",
      title:
        "The line graph shows electricity consumption in three countries between 1990 and 2020.",
      date: "Published April 2026",
      tier: "likely",
      exam: "academic",
      month: "2026-04",
    },
    {
      tag: "Apology Letter",
      tagTone: "lilac",
      type: "Writing Task 1",
      title:
        "Write a letter to a neighbour apologising for a recent disturbance and explaining what happened.",
      date: "Published April 2026",
      tier: "likely",
      exam: "general",
      month: "2026-04",
    },
    /* ---------- Archive: March 2026 ---------- */
    {
      tag: "Globalisation",
      tagTone: "mint",
      type: "Writing Task 2",
      title:
        "Some say globalisation harms local cultures. To what extent do you agree or disagree?",
      date: "Published March 2026",
      tier: "hot",
      exam: "both",
      month: "2026-03",
    },
  ],
  speaking: [
    {
      tag: "Hometown",
      tagTone: "lilac",
      type: "Speaking Part 1",
      title: "Describe your hometown and what you like most about it.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "both",
    },
    {
      tag: "Memorable Trip",
      tagTone: "blue",
      type: "Speaking Part 2",
      title:
        "Describe a journey that did not go as planned. You should say where, when, who and why.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "both",
    },
    {
      tag: "Technology",
      tagTone: "mint",
      type: "Speaking Part 3",
      title: "How has technology changed the way people communicate in your country?",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "both",
    },
    {
      tag: "Hobbies",
      tagTone: "peach",
      type: "Speaking Part 1",
      title: "What do you usually do in your free time? How long have you done it?",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "both",
    },
    {
      tag: "A Person",
      tagTone: "lilac",
      type: "Speaking Part 2",
      title: "Describe a person who inspires you. Say who they are, how you know them and why.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "both",
    },
    {
      tag: "Food",
      tagTone: "mint",
      type: "Speaking Part 1",
      title: "What kind of food do you like to cook at home?",
      date: "Worth reviewing",
      tier: "review",
      exam: "both",
    },
    /* ---------- Archive: April 2026 ---------- */
    {
      tag: "A Place",
      tagTone: "blue",
      type: "Speaking Part 2",
      title: "Describe a place you like to visit on weekends. Say where, when and why.",
      date: "Published April 2026",
      tier: "hot",
      exam: "both",
      month: "2026-04",
    },
    {
      tag: "Education",
      tagTone: "mint",
      type: "Speaking Part 3",
      title: "Do you think school subjects should change to match the modern job market?",
      date: "Published April 2026",
      tier: "likely",
      exam: "both",
      month: "2026-04",
    },
  ],
  reading: [
    {
      tag: "Climate Science",
      tagTone: "mint",
      type: "Reading",
      taskType: "headings",
      title: "Long-form passage on coral reef bleaching and conservation responses — match headings to paragraphs.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "academic",
      confidence: 89,
      appearances: 18,
    },
    {
      tag: "Workplace Notice",
      tagTone: "blue",
      type: "Reading",
      taskType: "tfng",
      title: "Section 1: a set of staff notices about a new office relocation — true / false / not given.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "general",
      confidence: 86,
      appearances: 20,
    },
    {
      tag: "Urban History",
      tagTone: "blue",
      type: "Reading",
      taskType: "matching-info",
      title: "Article tracing how a 19th-century city redesigned its public transport network — match information to paragraphs.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "academic",
      appearances: 12,
    },
    {
      tag: "Course Brochure",
      tagTone: "lilac",
      type: "Reading",
      taskType: "summary",
      title: "Section 2: a community college brochure describing evening classes and enrolment rules — summary completion.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "general",
      appearances: 10,
    },
    {
      tag: "Scientific Study",
      tagTone: "mint",
      type: "Reading",
      taskType: "mcq",
      title: "Passage on memory and ageing — multiple choice questions on the writer's main argument.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "academic",
      appearances: 11,
    },
    {
      tag: "Recipe Card",
      tagTone: "peach",
      type: "Reading",
      taskType: "sentence",
      title: "Section 1: instructions for using a kitchen appliance — sentence completion (NO MORE THAN TWO WORDS).",
      date: "Worth reviewing",
      tier: "review",
      exam: "general",
      appearances: 7,
    },
  ],
  listening: [
    {
      tag: "Section 2 — Tour",
      tagTone: "peach",
      type: "Listening",
      taskType: "map",
      title: "Guided tour of a community arts centre with map labelling.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "both",
      confidence: 91,
      appearances: 23,
    },
    {
      tag: "Section 1 — Booking",
      tagTone: "blue",
      type: "Listening",
      taskType: "form",
      title: "Phone call to book a holiday rental — fill in the booking form.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "both",
      confidence: 88,
      appearances: 26,
    },
    {
      tag: "Section 3 — Tutorial",
      tagTone: "blue",
      type: "Listening",
      taskType: "mcq",
      title: "Two students discuss a research project with their tutor — multiple choice.",
      date: "Predicted for May 2026",
      tier: "hot",
      exam: "both",
      confidence: 84,
      appearances: 19,
    },
    {
      tag: "Section 4 — Lecture",
      tagTone: "lilac",
      type: "Listening",
      taskType: "note",
      title: "Academic talk on sleep cycles and student performance — note completion.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "both",
      appearances: 14,
    },
    {
      tag: "Section 2 — Talk",
      tagTone: "mint",
      type: "Listening",
      taskType: "matching",
      title: "Local council talk about new recycling rules — match items to bin colours.",
      date: "Predicted for May–June",
      tier: "likely",
      exam: "both",
      appearances: 12,
    },
    {
      tag: "Section 4 — Research",
      tagTone: "peach",
      type: "Listening",
      taskType: "table",
      title: "Lecturer summarises a study on city traffic patterns — table completion.",
      date: "Worth reviewing",
      tier: "review",
      exam: "both",
      appearances: 9,
    },
  ],
};

const SKILLS: { key: SkillKey; label: string; icon: typeof PenLine }[] = [
  { key: "writing", label: "Writing", icon: PenLine },
  { key: "speaking", label: "Speaking", icon: Mic },
  { key: "reading", label: "Reading", icon: BookOpen },
  { key: "listening", label: "Listening", icon: Headphones },
];

const TIERS: {
  key: Tier;
  label: string;
  helper: string;
  icon: typeof Flame;
  accent: string;
  /** Soft full-screen tint used when this tier is the active scroll section. */
  tint: string;
}[] = [
  {
    key: "hot",
    label: "Highly likely",
    helper: "Top picks for the next sitting — start here.",
    icon: Flame,
    accent: "oklch(0.55 0.16 38)", // burnt sienna
    tint: "oklch(0.92 0.09 40)",
  },
  {
    key: "likely",
    label: "Likely to appear",
    helper: "Strong candidates worth a focused practice round.",
    icon: TrendingUp,
    accent: "oklch(0.42 0.18 285)", // ink violet
    tint: "oklch(0.90 0.09 285)",
  },
  {
    key: "review",
    label: "Worth reviewing",
    helper: "Recurring themes — keep them warm in your prep.",
    icon: Lightbulb,
    accent: "oklch(0.58 0.13 145)", // pistachio depth
    tint: "oklch(0.92 0.10 142)",
  },
];

/** Derive a task-type slug from the legacy `type` field when not explicitly set. */
function getTaskType(p: Prediction): string {
  if (p.taskType) return p.taskType;
  switch (p.type) {
    case "Writing Task 1": return "task1";
    case "Writing Task 2": return "task2";
    case "Speaking Part 1": return "part1";
    case "Speaking Part 2": return "part2";
    case "Speaking Part 3": return "part3";
    default: return "all";
  }
}

/* ------------------------------------------------------------------ */
/* Sample question bank — used to pad each tier to 30–50 items/month   */
/* (Will be replaced by a real database later.)                        */
/* ------------------------------------------------------------------ */

const SAMPLE_BANK: Record<SkillKey, string[]> = {
  writing: [
    "Some people think governments should spend more on public transport than on roads. To what extent do you agree or disagree?",
    "Many people believe that art should be a compulsory school subject. Discuss both views and give your opinion.",
    "Working from home is becoming more common. Do the advantages outweigh the disadvantages?",
    "Some argue that countries should produce all their own food. To what extent do you agree?",
    "The bar chart shows the percentage of households owning electric cars in five countries between 2010 and 2024.",
    "The line graph compares average monthly rainfall in three cities over a year.",
    "The pie charts show how energy was generated in two countries in 2000 and 2024.",
    "Write a letter to your landlord about repairs needed in your flat. Explain the problem and what you want done.",
    "Write a letter to a friend inviting them to your wedding. Describe the plans and what they should bring.",
    "Some believe schools should focus on practical skills rather than academic subjects. Discuss both views.",
    "In many cities, people prefer to live alone. What are the causes and effects of this trend?",
    "The map shows changes to a university campus between 2005 and 2025.",
    "The diagram shows how chocolate is produced from cocoa beans.",
    "Some say money is the most important motivator at work. To what extent do you agree?",
    "Tourism brings both benefits and problems to local communities. Discuss both views.",
    "Children today spend less time outdoors than previous generations. What are the causes and solutions?",
    "Write a letter to a colleague who has been promoted. Congratulate them and suggest meeting up.",
    "Some believe advertising should be banned for children under 12. Do you agree or disagree?",
    "The table compares household expenditure on five categories in three countries in 2023.",
    "Many old buildings are being demolished to make space for modern housing. Is this a positive or negative trend?",
    "Some people think reading fiction is more useful than reading non-fiction. Discuss both views.",
    "Public museums and art galleries should be free. To what extent do you agree?",
    "Write a letter to a hotel manager complaining about your recent stay.",
    "Some say university education should be free for everyone. Discuss both views.",
    "Plastic packaging is causing serious environmental damage. What can governments and individuals do?",
    "The chart shows the number of international students studying in four English-speaking countries from 2010 to 2024.",
    "Many people choose to learn a foreign language as adults. What are the benefits and challenges?",
    "Some believe that sports stars are paid too much. To what extent do you agree?",
    "Write a letter to your local council suggesting a new community facility.",
    "Cities are becoming overcrowded. What problems does this cause and how can they be solved?",
    "The diagram shows the life cycle of a honeybee.",
    "Some say children should start school at age four; others say age seven. Discuss both views.",
    "Working hours should be reduced to four days a week. To what extent do you agree?",
    "The map shows two proposed designs for a new town centre.",
    "Write a letter to a friend recommending a book you recently enjoyed.",
    "Many people travel for work. What are the advantages and disadvantages of frequent business travel?",
    "Some argue that the internet has weakened family relationships. Do you agree?",
    "The bar chart compares the most common reasons people give for moving house in three age groups.",
    "Governments should invest more in renewable energy. To what extent do you agree?",
    "Write a letter to your manager requesting flexible working hours.",
    "Some believe handwriting is no longer important. Discuss both views and give your opinion.",
    "The line graph shows changes in the population of three cities from 1950 to 2020.",
    "Many young people leave their hometown for big cities. What are the effects on rural areas?",
    "Some say zoos serve a useful purpose; others say they should be closed. Discuss both views.",
    "Write a letter to a neighbour thanking them for help during a difficult time.",
    "The diagram shows how rainwater is collected and reused in a modern home.",
    "Some believe music education improves academic performance. To what extent do you agree?",
    "Cycling should be encouraged in cities. What are the benefits and what could governments do?",
    "Write a letter to a magazine editor responding to a recent article.",
    "Some argue that fast fashion is harming the environment and workers. Discuss the problem and possible solutions.",
  ],
  speaking: [
    "Tell me about your hometown. What do you like most about it?",
    "Do you work or are you a student? Tell me about it.",
    "Describe a person who has had a big influence on your life.",
    "Describe a time you helped someone. Say who, when and what happened.",
    "Describe a piece of technology you use every day.",
    "Describe a memorable meal you had recently.",
    "What kind of music do you listen to? Has it changed over the years?",
    "Do you prefer reading books or watching films? Why?",
    "Describe a place in your country you would recommend to tourists.",
    "How important is family in your culture?",
    "Describe a skill you would like to learn and why.",
    "Do you think people are too dependent on smartphones?",
    "Describe a recent celebration you took part in.",
    "What kind of weather do you like best? Why?",
    "Describe a teacher you remember from school.",
    "How has shopping changed in your country in recent years?",
    "Describe a gift you gave someone that made them happy.",
    "Do young and older people in your country have similar interests?",
    "Describe a long journey you have made.",
    "What role do social media play in people's lives today?",
    "Describe a film you enjoyed watching.",
    "Do people in your country read enough? Why or why not?",
    "Describe an item of clothing you wear often.",
    "How do people relax in your country?",
    "Describe an interesting building in your city.",
    "Do you think it is important for children to learn about other cultures?",
    "Describe an outdoor activity you enjoy.",
    "How has the way people communicate changed in the last 20 years?",
    "Describe a website or app you use regularly.",
    "Should governments do more to protect the environment? How?",
    "Describe a small business you would like to start.",
    "Do you think traditional skills are dying out? Why?",
    "Describe a difficult decision you had to make.",
    "Are there any festivals from other countries you find interesting?",
    "Describe a healthy habit you have.",
    "How do people in your country balance work and family life?",
    "Describe an article or news story you remember reading.",
    "Should schools teach money management? Why?",
    "Describe a sport you enjoy watching or playing.",
    "How important is it to keep traditional foods alive?",
    "Describe a time you tried something for the first time.",
    "What changes would you like to see in your city in the next 10 years?",
    "Describe an old photograph that has special meaning to you.",
    "How do people in your country use public transport?",
    "Describe a problem in your neighbourhood and how it could be solved.",
    "Do you think life was better 50 years ago? Why?",
    "Describe a book that influenced your thinking.",
    "Should companies allow more remote work? Why?",
    "Describe a hobby you would like to pick up again.",
    "How do people make new friends in your country?",
  ],
  reading: [
    "Long passage on the history and conservation of urban green spaces — match headings to paragraphs.",
    "Article about the science of taste and how it changes with age — true / false / not given.",
    "Workplace handbook excerpt on health and safety procedures — sentence completion.",
    "Course catalogue for an evening adult education centre — multiple choice on enrolment rules.",
    "Passage exploring early human migration patterns — matching information to paragraphs.",
    "Notice from a city council about new parking regulations — short answer questions.",
    "Article on the development of wind power in coastal regions — summary completion.",
    "Tenancy agreement excerpt — true / false / not given on tenant responsibilities.",
    "Passage on the role of bees in pollination and food security — yes / no / not given.",
    "Booklet introducing a new community library — matching features to facilities.",
    "Passage on the rise and decline of a 19th-century railway company — multiple choice.",
    "Brochure for a series of weekend walking tours — sentence completion.",
    "Passage examining the psychology of decision making — matching researchers to findings.",
    "Workplace bulletin about a new email security policy — short answer.",
    "Passage on the cultural history of tea — table completion.",
    "Notice for new employees about company benefits — true / false / not given.",
    "Passage on advances in prosthetic limb design — multiple choice.",
    "Travel guide section on visiting the highlands — matching descriptions to places.",
    "Passage on the discovery and study of deep-sea hydrothermal vents — yes / no / not given.",
    "Form for booking a community hall — note completion.",
    "Passage on changing patterns of book publishing in the digital age — summary completion.",
    "Notice from a bank introducing a new savings product — short answer.",
    "Passage on the science of sleep deprivation in students — matching paragraphs.",
    "Brochure on a heritage railway museum — multiple choice on opening hours and exhibits.",
    "Passage on the impact of light pollution on wildlife — true / false / not given.",
    "Workplace memo about a new dress code — sentence completion.",
    "Passage on the linguistics of endangered languages — matching headings.",
    "Catalogue for a community gardening scheme — short answer.",
    "Passage on the history of vaccination — yes / no / not given.",
    "Holiday rental booking confirmation — table completion.",
    "Passage on smart city technologies and urban planning — multiple choice.",
    "Volunteer programme leaflet — matching opportunities to skills.",
    "Passage on the evolution of bird flight — summary completion.",
    "Notice about a public consultation on a new tram line — short answer.",
    "Passage on the rise of plant-based diets — true / false / not given.",
    "Brochure for an arts and crafts weekend course — sentence completion.",
    "Passage on the chemistry of perfume making — matching paragraphs.",
    "Workplace email chain about an upcoming office move — short answer.",
    "Passage on the science of memory and forgetting — yes / no / not given.",
    "Notice from a leisure centre about new opening hours — table completion.",
  ],
  listening: [
    "Phone call to enrol in a community language class — form completion.",
    "Tour of a new science museum — map labelling.",
    "Two students plan a group presentation with their tutor — multiple choice.",
    "Lecture on coastal erosion and protection methods — note completion.",
    "Conversation between a customer and a travel agent about a holiday package — form completion.",
    "Talk to new volunteers at an animal shelter — matching tasks to days.",
    "Discussion between two students about a psychology assignment — multiple choice.",
    "Lecture on the history of jazz in the 20th century — sentence completion.",
    "Phone enquiry about gym membership options — table completion.",
    "Walking tour of a historic market square — map labelling.",
    "Tutorial on writing a literature review — short answer.",
    "Lecture on the impact of urbanisation on bird populations — note completion.",
    "Customer call about a faulty laptop — form completion.",
    "Welcome talk for new university students — matching speakers to topics.",
    "Two researchers discuss findings from a sleep study — multiple choice.",
    "Lecture on renewable energy in remote communities — sentence completion.",
    "Booking call for a wedding venue — form completion.",
    "Tour of a community arts centre — map labelling.",
    "Tutorial on planning a fieldwork project — short answer.",
    "Lecture on the development of the internet — note completion.",
    "Phone call to report a lost item on public transport — form completion.",
    "Briefing for new library members about borrowing rules — matching items to rules.",
    "Two students compare options for a study trip abroad — multiple choice.",
    "Lecture on early childhood language development — sentence completion.",
    "Customer service call about a delayed parcel — form completion.",
    "Guided tour of a botanical garden — map labelling.",
    "Tutorial on academic referencing — short answer.",
    "Lecture on ocean currents and global climate — note completion.",
    "Phone enquiry about adult swimming lessons — table completion.",
    "Talk for new staff at a busy hotel — matching duties to roles.",
    "Two students plan a charity fundraising event — multiple choice.",
    "Lecture on the architecture of medieval cathedrals — sentence completion.",
    "Booking call for a city walking tour — form completion.",
    "Tour of a renovated train station — map labelling.",
    "Tutorial on time management for postgraduate students — short answer.",
    "Lecture on the cultural history of coffee — note completion.",
    "Customer call about cancelling a magazine subscription — form completion.",
    "Briefing for new exhibitors at a craft fair — matching stalls to areas.",
    "Two students discuss feedback on their dissertation drafts — multiple choice.",
    "Lecture on volcanoes and tectonic plate movement — sentence completion.",
  ],
};

/** Pad a tier's curated list with sample-bank entries to reach a target count. */
function padTier(
  skill: SkillKey,
  tier: Tier,
  curated: Prediction[],
): Prediction[] {
  const target = tier === "hot" ? 32 : tier === "likely" ? 38 : 30;
  if (curated.length >= target) return curated;

  const bank = SAMPLE_BANK[skill];
  const used = new Set(curated.map((p) => p.title));
  const seed = skill.charCodeAt(0) * 13 + tier.charCodeAt(0) * 7;

  const padded: Prediction[] = [...curated];
  let i = 0;
  while (padded.length < target && i < bank.length * 4) {
    const idx = (i * 31 + seed) % bank.length;
    const title = bank[idx];
    i += 1;
    if (used.has(title)) continue;
    used.add(title);
    const baseFreq = tier === "hot" ? 26 : tier === "likely" ? 16 : 9;
    const jitter = ((idx * 7 + seed) % 7) - 3;
    padded.push({
      tag: "Topic",
      tagTone: "blue",
      type:
        skill === "writing"
          ? "Writing Task 2"
          : skill === "speaking"
            ? "Speaking Part 1"
            : skill === "reading"
              ? "Reading"
              : "Listening",
      title,
      date: "Predicted for May 2026",
      tier,
      exam: "both",
      appearances: Math.max(2, baseFreq + jitter - Math.floor(padded.length / 6)),
    });
  }
  return padded;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function PredictionsPage() {
  const [skill, setSkill] = useState<SkillKey>("writing");
  const [taskType, setTaskType] = useState<string>("all");
  // Hydrate exam from localStorage AFTER mount to keep SSR/CSR markup identical.
  const [exam, setExam] = useState<ExamKey>("academic");
  useEffect(() => {
    const saved = window.localStorage.getItem("ielts-exam-track");
    if (saved === "general" || saved === "academic") setExam(saved);
  }, []);

  const handleExamChange = (next: ExamKey) => {
    setExam(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ielts-exam-track", next);
    }
  };

  const handleSkillChange = (next: SkillKey) => {
    setSkill(next);
    setTaskType("all"); // reset chip selection when switching modules
  };

  const [showArchive, setShowArchive] = useState(false);
  const [activeTier, setActiveTier] = useState<Tier | null>(null);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tier-section]"),
    );
    if (sections.length === 0) {
      setActiveTier(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible tier section currently intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const t = (visible[0].target as HTMLElement).dataset.tierSection as Tier;
          setActiveTier(t);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [skill, exam, taskType]);

  const activeTint = activeTier
    ? TIERS.find((t) => t.key === activeTier)?.tint
    : undefined;

  const { current, archive } = useMemo(() => {
    const list = PREDICTIONS[skill].filter(
      (p) =>
        (!p.exam || p.exam === "both" || p.exam === exam) &&
        (taskType === "all" || getTaskType(p) === taskType),
    );
    const isCurrent = (p: Prediction) => (p.month ?? CURRENT_MONTH) === CURRENT_MONTH;
    const currentList = list.filter(isCurrent);
    const archiveList = list.filter((p) => !isCurrent(p));

    const grouped = (items: Prediction[]) => ({
      hot: items.filter((p) => p.tier === "hot"),
      likely: items.filter((p) => p.tier === "likely"),
      review: items.filter((p) => p.tier === "review"),
    });

    // Group archive items by month, newest first
    const byMonth = new Map<string, Prediction[]>();
    for (const p of archiveList) {
      const m = p.month ?? CURRENT_MONTH;
      if (!byMonth.has(m)) byMonth.set(m, []);
      byMonth.get(m)!.push(p);
    }
    const archiveMonths = Array.from(byMonth.entries())
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .map(([month, items]) => ({ month, label: formatMonth(month), grouped: grouped(items) }));

    const currentGrouped = grouped(currentList);
    const currentPadded = {
      hot: padTier(skill, "hot", currentGrouped.hot),
      likely: padTier(skill, "likely", currentGrouped.likely),
      review: padTier(skill, "review", currentGrouped.review),
    };

    return { current: currentPadded, archive: archiveMonths };
  }, [skill, exam, taskType]);

  const daysToNext = useDaysToNextSaturday();

  const isAcademic = exam === "academic";
  // Clean white page — rotating pastel card tints carry the color story.
  const pageBg = "#ffffff";
  const heroGradient = "transparent";

  return (
    <div className="relative min-h-screen transition-colors duration-700 ease-out" style={{ backgroundColor: pageBg }}>
      <main className="relative py-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[720px] transition-[background] duration-700 ease-out [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
          style={{ background: heroGradient }}
        />
        {/* Soft paper grain — covers the entire page, fixed so it feels like real paper */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />

        <BackButton to="/dashboard" ariaLabel="Back to Dashboard" />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* MASSIVE EDITORIAL WORDMARK — page hero */}
          <div className="flex justify-center">
            <h2
              className="relative inline-block font-display font-black leading-[0.9] tracking-[-0.025em] transition-colors duration-700"
              style={{
                fontSize: "clamp(2.75rem, 9vw, 5.75rem)",
                color: isAcademic ? "oklch(0.38 0.18 258)" : "oklch(0.46 0.21 30)",
              }}
            >
              {/* Sparkle doodle (top-left) */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="absolute -left-6 -top-3 h-5 w-5 opacity-80 sm:-left-10 sm:-top-5 sm:h-7 sm:w-7"
                style={{ color: isAcademic ? "oklch(0.55 0.16 250)" : "oklch(0.62 0.19 32)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.5 5.5l3 3M15.5 15.5l3 3M5.5 18.5l3-3M15.5 8.5l3-3" />
              </svg>

              <span className="relative inline-block">
                {/* Tonal halo behind the word — softer than a highlighter */}
                <span
                  aria-hidden
                  className="absolute inset-x-[-10px] bottom-[6%] -z-10 h-[62%] -rotate-1 transition-colors duration-700"
                  style={{
                    background: isAcademic
                      ? "linear-gradient(100deg, oklch(0.92 0.08 245 / 0.55) 0%, oklch(0.88 0.10 255 / 0.70) 55%, oklch(0.92 0.08 245 / 0.50) 100%)"
                      : "linear-gradient(100deg, oklch(0.93 0.10 70 / 0.60) 0%, oklch(0.89 0.13 45 / 0.75) 55%, oklch(0.93 0.10 70 / 0.55) 100%)",
                    clipPath: "polygon(1% 8%, 99% 2%, 100% 92%, 0% 98%)",
                    filter: "blur(2px)",
                  }}
                />
                <span className="relative">Predictions</span>

                {/* Pencil underline swoosh — matches title color */}
                <svg
                  aria-hidden
                  viewBox="0 0 300 22"
                  preserveAspectRatio="none"
                  className="absolute -bottom-3 left-0 h-3 w-full transition-colors duration-700 sm:-bottom-4 sm:h-4"
                  style={{ color: isAcademic ? "oklch(0.45 0.18 255)" : "oklch(0.55 0.20 28)" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14 C 60 4, 140 20, 210 8 S 290 14, 296 10" />
                </svg>
              </span>
            </h2>
          </div>

          {/* Main hero — the exam question is the headline of the page */}
          <div className="mt-8 text-center sm:mt-10">
            <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Which exam are you taking?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-foreground/65 sm:text-[15px]">
              Choose your track to see topics most likely to appear — hand-picked by our{" "}
              <span className="relative inline-block whitespace-nowrap font-semibold text-foreground">
                <span
                  aria-hidden
                  className="absolute inset-x-[-2px] bottom-[2px] -z-0 h-[55%] -rotate-[1.5deg] rounded-[2px]"
                  style={{
                    background:
                      "linear-gradient(100deg, oklch(0.92 0.16 95 / 0.85) 0%, oklch(0.88 0.18 90 / 0.85) 60%, oklch(0.92 0.16 95 / 0.7) 100%)",
                  }}
                />
                <span className="relative">qualified IELTS team</span>
              </span>{" "}
              and refreshed weekly.
            </p>
          </div>

          {/* Exam track toggle */}
          <div className="mt-8 flex justify-center sm:mt-10">
            <ExamToggle value={exam} onChange={handleExamChange} />
          </div>

          {/* Countdown card — editorial, paper feel */}
          <div className="mt-12 flex justify-center">
            <CountdownCard days={daysToNext} />
          </div>

          {/* Honesty note — predictions are forecasts, not guarantees */}
          <p className="mx-auto mt-5 max-w-2xl text-center text-[12.5px] leading-relaxed text-foreground/55 sm:text-[13px]">
            Predictions are educated forecasts based on rotation patterns —
            <span className="font-semibold text-foreground/70"> not guarantees</span>.
            Use them to focus your practice, not to skip topics.
          </p>

          {/* Skill tabs */}
          <div className="mt-12">
            <SkillTabs value={skill} onChange={handleSkillChange} />
          </div>

          {/* Month headline — big editorial date block */}
          <MonthHeadline iso={CURRENT_MONTH} accent={isAcademic ? "oklch(0.38 0.18 258)" : "oklch(0.46 0.21 30)"} />

          {/* Task-type chips for the active module */}
          <div className="mt-6">
            <TaskTypeChips
              skill={skill}
              value={taskType}
              onChange={setTaskType}
            />
          </div>

          {/* Tiered groups — current month. Writing & Reading are gated per IELTS type; Speaking/Listening stay open. */}
          {(skill === "writing" || skill === "reading") ? (
            <TypeGate contentType={exam}>
              <div className="mt-12 space-y-16">
                {TIERS.map((tier) => {
                  const items = current[tier.key];
                  if (items.length === 0) return null;
                  const isActive = activeTier === tier.key;
                  return (
                    <div
                      key={tier.key}
                      data-tier-section={tier.key}
                      className="relative -mx-3 rounded-3xl px-3 py-6 sm:-mx-6 sm:px-6 sm:py-8"
                    >
                      <TierSection tier={tier} items={items} />
                    </div>
                  );
                })}

                {current.hot.length === 0 &&
                  current.likely.length === 0 &&
                  current.review.length === 0 && (
                    <p className="text-center font-display text-lg font-bold text-foreground/60">
                      Fresh predictions land here every Monday.
                    </p>
                  )}
              </div>
            </TypeGate>
          ) : (
            <div className="mt-12 space-y-16">
              {TIERS.map((tier) => {
                const items = current[tier.key];
                if (items.length === 0) return null;
                const isActive = activeTier === tier.key;
                return (
                  <div
                    key={tier.key}
                    data-tier-section={tier.key}
                    className="relative -mx-3 rounded-3xl px-3 py-6 transition-all duration-700 ease-out sm:-mx-6 sm:px-6 sm:py-8"
                    style={{
                      background: isActive
                        ? `radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklab, ${tier.tint} 95%, transparent) 0%, color-mix(in oklab, ${tier.tint} 70%, transparent) 60%, color-mix(in oklab, ${tier.tint} 45%, transparent) 100%)`
                        : "transparent",
                      boxShadow: isActive
                        ? `inset 0 1px 0 0 color-mix(in oklab, ${tier.accent} 18%, transparent), 0 30px 60px -40px color-mix(in oklab, ${tier.accent} 35%, transparent)`
                        : "none",
                    }}
                  >
                    <TierSection tier={tier} items={items} />
                  </div>
                );
              })}

              {current.hot.length === 0 &&
                current.likely.length === 0 &&
                current.review.length === 0 && (
                  <p className="text-center font-display text-lg font-bold text-foreground/60">
                    Fresh predictions land here every Monday.
                  </p>
                )}
            </div>
          )}

          {/* Archive — collapsed by default */}
          {archive.length > 0 && (
            <div className="mt-20 border-t border-border/60 pt-10">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-foreground/45">
                  Track record
                </span>
                <button
                  type="button"
                  onClick={() => setShowArchive((v) => !v)}
                  aria-expanded={showArchive}
                  className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-5 py-2.5 font-display text-sm font-bold tracking-tight text-foreground/80 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-card hover:text-foreground"
                >
                  {showArchive ? "Hide previous months" : "See previous months"}
                  <span
                    aria-hidden
                    className="inline-block transition-transform"
                    style={{ transform: showArchive ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    ▾
                  </span>
                </button>
                <p className="max-w-md text-[12px] leading-relaxed text-foreground/50">
                  These were our forecasts at the time — kept here for reference, not as a live guide.
                </p>
              </div>

              {showArchive && (
                <div className="mt-10 space-y-14">
                  {archive.map((m) => {
                    const empty =
                      m.grouped.hot.length === 0 &&
                      m.grouped.likely.length === 0 &&
                      m.grouped.review.length === 0;
                    if (empty) return null;
                    return (
                      <div key={m.month}>
                        <header className="mb-6 flex items-center gap-3">
                          <h3 className="font-display text-xl font-black tracking-tight text-foreground/70 sm:text-2xl">
                            {m.label}
                          </h3>
                          <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-[0.18em] text-foreground/55">
                            Archived
                          </span>
                        </header>
                        <div className="space-y-12">
                          {TIERS.map((tier) => {
                            const items = m.grouped[tier.key];
                            if (items.length === 0) return null;
                            return (
                              <TierSection
                                key={`${m.month}-${tier.key}`}
                                tier={tier}
                                items={items}
                                archived
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Countdown                                                           */
/* ------------------------------------------------------------------ */

function useDaysToNextSaturday() {
  return useMemo(() => {
    const today = new Date();
    const day = today.getDay(); // 0 Sun … 6 Sat
    const diff = (6 - day + 7) % 7 || 7;
    return diff;
  }, []);
}

function CountdownCard({ days }: { days: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] border border-border bg-card px-6 py-5 shadow-soft sm:px-9 sm:py-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.99 0.01 80) 0%, oklch(0.97 0.03 60) 100%)",
      }}
    >
      <div className="flex items-center gap-5 sm:gap-7">
        <div className="text-center">
          <div className="font-display text-5xl font-black leading-none tracking-tight text-foreground sm:text-6xl">
            {days}
          </div>
          <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-foreground/55">
            {days === 1 ? "day" : "days"}
          </div>
        </div>
        <div className="h-12 w-px bg-border sm:h-14" aria-hidden />
        <div className="max-w-[240px]">
          <p className="font-display text-base font-extrabold tracking-tight text-foreground sm:text-lg">
            Until the next IELTS sitting
          </p>
          <p className="mt-1 text-xs font-medium text-foreground/65 sm:text-sm">
            Focus your prep on the highly-likely topics first.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Exam toggle — Academic vs General Training                          */
/* ------------------------------------------------------------------ */

function ExamToggle({
  value,
  onChange,
}: {
  value: ExamKey;
  onChange: (e: ExamKey) => void;
}) {
  const options: {
    key: ExamKey;
    label: string;
    activeBg: string;
    accent: string;
    idleTint: string;
    glow: string;
  }[] = [
    {
      key: "academic",
      label: "Academic",
      activeBg:
        "linear-gradient(135deg, oklch(0.55 0.16 250) 0%, oklch(0.48 0.18 245) 100%)",
      accent: "oklch(0.52 0.17 248)",
      idleTint:
        "linear-gradient(135deg, oklch(0.985 0.012 240) 0%, oklch(0.965 0.025 240) 100%)",
      glow: "0 12px 28px -12px oklch(0.50 0.18 248 / 0.55)",
    },
    {
      key: "general",
      label: "General Training",
      activeBg:
        "linear-gradient(135deg, oklch(0.62 0.19 32) 0%, oklch(0.55 0.20 25) 100%)",
      accent: "oklch(0.58 0.19 30)",
      idleTint:
        "linear-gradient(135deg, oklch(0.985 0.014 50) 0%, oklch(0.965 0.030 40) 100%)",
      glow: "0 12px 28px -12px oklch(0.55 0.20 30 / 0.55)",
    },
  ];

  return (
    <div className="w-full max-w-xl">
      <div
        role="radiogroup"
        aria-label="IELTS exam track"
        className="grid grid-cols-2 gap-3 sm:gap-4"
      >
        {options.map((opt) => {
          const active = value === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.key)}
              className="group relative overflow-hidden rounded-2xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: active ? opt.activeBg : opt.idleTint,
                borderColor: active ? "transparent" : "oklch(0.90 0.01 60)",
                boxShadow: active ? opt.glow : "0 1px 2px oklch(0 0 0 / 0.04)",
                transform: active ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              {!active && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: opt.accent, opacity: 0.85 }}
                />
              )}

              <span
                className="block px-4 py-4 text-center font-display text-base font-black tracking-tight sm:px-5 sm:py-5 sm:text-lg"
                style={{
                  color: active ? "oklch(0.99 0.01 80)" : "oklch(0.22 0.03 60)",
                }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skill tabs — editorial, no pill chips                               */
/* ------------------------------------------------------------------ */

function SkillTabs({
  value,
  onChange,
}: {
  value: SkillKey;
  onChange: (s: SkillKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-7 gap-y-3 border-b border-border/70 pb-3 sm:gap-x-12">
      {SKILLS.map(({ key, label, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className="group relative flex items-center gap-2 transition-opacity"
            style={{ opacity: active ? 1 : 0.5 }}
          >
            <Icon
              className="h-4 w-4 sm:h-5 sm:w-5"
              style={{ color: active ? "oklch(0.45 0.14 60)" : "currentColor" }}
            />
            <span className="font-display text-lg font-black tracking-tight text-foreground sm:text-2xl">
              {label}
            </span>
            {active && (
              <span
                aria-hidden
                className="absolute -bottom-[14px] left-0 right-0 h-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.70 0.16 60) 0%, oklch(0.55 0.18 35) 100%)",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Task-type chips — horizontal scrollable filter under module tabs    */
/* ------------------------------------------------------------------ */

function TaskTypeChips({
  skill,
  value,
  onChange,
}: {
  skill: SkillKey;
  value: string;
  onChange: (id: string) => void;
}) {
  const types = TASK_TYPES_BY_SKILL[skill];
  const all = [{ id: "all", label: "All task types" }, ...types];

  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <div className="flex min-w-max items-center gap-2 sm:flex-wrap sm:justify-center">
        {all.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-pressed={active}
              className="group relative shrink-0 rounded-full border px-3.5 py-1.5 font-display text-[12px] font-bold tracking-tight transition-all sm:text-[13px]"
              style={{
                background: active
                  ? "linear-gradient(135deg, oklch(0.25 0.02 60) 0%, oklch(0.18 0.02 60) 100%)"
                  : "oklch(1 0 0 / 0.6)",
                color: active ? "oklch(0.99 0.01 80)" : "oklch(0.30 0.03 60)",
                borderColor: active
                  ? "transparent"
                  : "oklch(0.85 0.01 60 / 0.8)",
                boxShadow: active
                  ? "0 6px 16px -8px oklch(0.20 0.02 60 / 0.50)"
                  : "0 1px 2px oklch(0 0 0 / 0.03)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tier section                                                        */
/* ------------------------------------------------------------------ */

function TierSection({
  tier,
  items,
  archived = false,
}: {
  tier: { key: Tier; label: string; helper: string; icon: typeof Flame; accent: string };
  items: Prediction[];
  archived?: boolean;
}) {
  const Icon = tier.icon;
  const archivedLabel: Record<Tier, string> = {
    hot: "Was: highly likely",
    likely: "Was: likely",
    review: "Was: worth a look",
  };
  return (
    <section className={archived ? "opacity-90" : undefined}>
      {/* Mobile: sticky pill at top */}
      <div className="sticky top-2 z-20 -mx-1 mb-3 flex items-center gap-2 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 shadow-soft backdrop-blur sm:hidden">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{
            background: `color-mix(in oklab, ${tier.accent} ${archived ? 10 : 16}%, transparent)`,
            color: tier.accent,
          }}
          aria-hidden
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span
          className="font-display text-[12px] font-black tracking-tight"
          style={{ color: archived ? "oklch(0.45 0.02 60)" : tier.accent }}
        >
          {archived ? archivedLabel[tier.key] : tier.label}
        </span>
        <span className="ml-auto font-display text-[11px] font-bold text-foreground/55">
          {items.length} {items.length === 1 ? "topic" : "topics"}
        </span>
      </div>

      {/* Desktop: sticky left label, scrolling right list */}
      <div className="grid gap-6 sm:grid-cols-[220px_1fr] sm:gap-10">
        <aside className="hidden sm:block">
          <div className="sticky top-6">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in oklab, ${tier.accent} ${archived ? 8 : 14}%, transparent)`,
                color: tier.accent,
                filter: archived ? "saturate(0.7)" : undefined,
              }}
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </span>
            <h2
              className="mt-3 font-display text-2xl font-black tracking-tight sm:text-[28px]"
              style={{ color: archived ? "oklch(0.45 0.02 60)" : "oklch(var(--foreground))" }}
            >
              {archived ? archivedLabel[tier.key] : tier.label}
            </h2>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-foreground/55">
              {archived ? "Forecast made at the time — for reference only." : tier.helper}
            </p>
            <p className="mt-3 font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/45">
              {items.length} {items.length === 1 ? "topic" : "topics"}
            </p>
          </div>
        </aside>

        <div className="space-y-3 sm:space-y-3.5">
          {items.map((p, i) => (
            <PredictionRow
              key={p.title}
              prediction={p}
              tier={tier}
              archived={archived}
              index={i + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Prediction row — compact single-line briefing                       */
/* ------------------------------------------------------------------ */

// Rotating pastel palette — cycles as the user scrolls the list.
// Each entry: { bg, ink, rail } tuned for white-page contrast.
const PASTEL_CYCLE = [
  { bg: "oklch(0.96 0.045 155)", ink: "oklch(0.42 0.13 155)", rail: "oklch(0.68 0.14 155)" }, // mint
  { bg: "oklch(0.95 0.055 55)",  ink: "oklch(0.48 0.16 45)",  rail: "oklch(0.72 0.16 45)"  }, // peach
  { bg: "oklch(0.95 0.045 295)", ink: "oklch(0.44 0.16 295)", rail: "oklch(0.68 0.16 295)" }, // lavender
  { bg: "oklch(0.96 0.045 230)", ink: "oklch(0.44 0.14 245)", rail: "oklch(0.70 0.14 240)" }, // sky
  { bg: "oklch(0.97 0.060 95)",  ink: "oklch(0.46 0.13 80)",  rail: "oklch(0.78 0.15 90)"  }, // butter
  { bg: "oklch(0.96 0.040 10)",  ink: "oklch(0.48 0.16 15)",  rail: "oklch(0.74 0.16 15)"  }, // blush
];

function tierDefaultAppearances(tier: Tier): number {
  switch (tier) {
    case "hot":
      return 22;
    case "likely":
      return 14;
    case "review":
      return 8;
  }
}

function PredictionRow({
  prediction,
  tier,
  archived = false,
  index,
}: {
  prediction: Prediction;
  tier: { key: Tier; label: string; helper: string; icon: typeof Flame; accent: string };
  archived?: boolean;
  index: number;
}) {
  const appearances = prediction.appearances ?? tierDefaultAppearances(prediction.tier);
  const pastel = PASTEL_CYCLE[(index - 1) % PASTEL_CYCLE.length];
  const accent = pastel.rail;
  const ink = pastel.ink;
  const answer = usePredictionAnswer(prediction.title);
  const { user } = useSession();
  const isAdmin = canEdit(user);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const hasAnswer = !!answer?.body?.trim();
  const num = String(index).padStart(2, "0");

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-black/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-18px_rgba(0,0,0,0.25)]"
      style={{
        background: pastel.bg,
        opacity: archived ? 0.78 : 1,
        filter: archived ? "saturate(0.82)" : undefined,
      }}
    >
      {/* Colored left rail */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-full w-[4px]"
        style={{ background: accent }}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-4 px-4 py-4 text-left sm:gap-6 sm:px-6 sm:py-5"
      >
        {/* Large editorial numeral */}
        <span
          className="shrink-0 font-display text-[40px] font-black leading-none tracking-tight tabular-nums sm:text-[52px]"
          style={{ color: `color-mix(in oklab, ${ink} 55%, transparent)` }}
          aria-hidden
        >
          {num}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className="font-display text-[15px] font-semibold leading-snug tracking-tight sm:text-[16.5px]"
            style={{ color: ink }}
          >
            {prediction.title}
          </p>
          <div
            className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-bold uppercase tracking-[0.12em]"
            style={{ color: `color-mix(in oklab, ${ink} 70%, transparent)` }}
          >
            <span style={{ color: ink }}>{prediction.type}</span>
            <span aria-hidden style={{ color: `color-mix(in oklab, ${ink} 30%, transparent)` }}>·</span>
            <span>Appeared {appearances}×</span>
            {hasAnswer && (
              <>
                <span aria-hidden style={{ color: `color-mix(in oklab, ${ink} 30%, transparent)` }}>·</span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px]"
                  style={{
                    background: `color-mix(in oklab, ${accent} 22%, white)`,
                    color: ink,
                  }}
                >
                  <Check className="h-3 w-3" /> Model answer
                </span>
              </>
            )}
          </div>
        </div>

        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-foreground/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-border/60 bg-foreground/[0.015] px-4 pb-5 pt-4 sm:px-6">
          {isAdmin && editing ? (
            <AnswerEditor
              title={prediction.title}
              initial={answer}
              onClose={() => setEditing(false)}
            />
          ) : (
            <AnswerView
              answer={answer}
              accent={accent}
              isAdmin={isAdmin}
              onEdit={() => setEditing(true)}
            />
          )}
        </div>
      )}
    </article>
  );
}

/* ---------------------- Answer view (preview + paywall) ----------------------- */

function AnswerView({
  answer,
  accent,
  isAdmin,
  onEdit,
}: {
  answer?: PredictionAnswer;
  accent: string;
  isAdmin: boolean;
  onEdit: () => void;
}) {
  if (!answer?.body?.trim()) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-card p-5 text-center">
        <p className="text-[13px] font-medium text-foreground/60">
          Model answer coming soon — our IELTS specialists are finalising it.
        </p>
        {isAdmin && (
          <button
            type="button"
            onClick={onEdit}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-background"
          >
            <Pencil className="h-3 w-3" /> Add answer
          </button>
        )}
      </div>
    );
  }

  const paragraphs = answerParagraphs(answer.body);
  const [first, ...rest] = paragraphs;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {answer.bandScore && (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em]"
            style={{
              background: `color-mix(in oklab, ${accent} 18%, transparent)`,
              color: accent,
            }}
          >
            {answer.bandScore}
          </span>
        )}
        {answer.note && (
          <p className="text-[12px] italic text-foreground/60">{answer.note}</p>
        )}
        <div className="ml-auto" />
        {isAdmin && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-foreground/70 hover:bg-foreground/5"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        )}
      </div>

      {/* Free preview — first paragraph */}
      <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-foreground/85 sm:text-[14.5px]">
        {first}
      </p>

      {rest.length > 0 && (
        <div className="relative mt-3">
          {/* Blurred teaser of next paragraph */}
          <p
            aria-hidden
            className="pointer-events-none select-none whitespace-pre-wrap text-[14px] leading-relaxed text-foreground/85 blur-[5px] sm:text-[14.5px]"
          >
            {rest[0]?.slice(0, 380)}
          </p>

          {/* Paywall overlay */}
          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-card via-card/95 to-card/0 px-3 pb-1 pt-12 text-center">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: `color-mix(in oklab, ${accent} 18%, transparent)`,
                color: accent,
              }}
            >
              <Lock className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <p className="max-w-md text-[12.5px] font-medium text-foreground/70">
              Unlock the full Band 9 answer + structure, vocabulary and tips.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-extrabold tracking-tight text-white shadow-md transition-transform hover:-translate-y-0.5"
              style={{ background: accent }}
            >
              Unlock full answer
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------- Admin inline editor ----------------------- */

function AnswerEditor({
  title,
  initial,
  onClose,
}: {
  title: string;
  initial?: PredictionAnswer;
  onClose: () => void;
}) {
  const [body, setBody] = useState(initial?.body ?? "");
  const [bandScore, setBandScore] = useState(initial?.bandScore ?? "Band 9");
  const [note, setNote] = useState(initial?.note ?? "");

  const save = () => {
    savePredictionAnswer(title, { body, bandScore, note });
    onClose();
  };
  const remove = () => {
    savePredictionAnswer(title, null);
    onClose();
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={bandScore}
          onChange={(e) => setBandScore(e.target.value)}
          placeholder="Band score (e.g. Band 9)"
          className="w-40 rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] font-semibold text-foreground"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note (shown above answer)"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-[12px] text-foreground"
        />
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={10}
        placeholder="Paste the model answer here. Separate paragraphs with a blank line."
        className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-[12.5px] leading-relaxed text-foreground"
      />
      <div className="flex items-center justify-between gap-2">
        {initial?.body ? (
          <button
            type="button"
            onClick={remove}
            className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-destructive hover:bg-destructive/10"
          >
            <X className="h-3 w-3" /> Delete
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/70 hover:bg-foreground/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-background hover:opacity-90"
          >
            <Check className="h-3 w-3" /> Save answer
          </button>
        </div>
      </div>
    </div>
  );
}
