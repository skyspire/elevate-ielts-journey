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
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { BackButton } from "@/components/site/BackButton";

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
  component: PredictionsPage,
});

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
}[] = [
  {
    key: "hot",
    label: "Highly likely",
    helper: "Top picks for the next sitting — start here.",
    icon: Flame,
    accent: "oklch(0.62 0.18 35)",
  },
  {
    key: "likely",
    label: "Likely to appear",
    helper: "Strong candidates worth a focused practice round.",
    icon: TrendingUp,
    accent: "oklch(0.55 0.14 250)",
  },
  {
    key: "review",
    label: "Worth reviewing",
    helper: "Recurring themes — keep them warm in your prep.",
    icon: Lightbulb,
    accent: "oklch(0.55 0.10 100)",
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

    return { current: grouped(currentList), archive: archiveMonths };
  }, [skill, exam]);

  const daysToNext = useDaysToNextSaturday();

  const isAcademic = exam === "academic";
  // Premium soft palettes — warm cream for General, cool pearl for Academic.
  // Layered radial halos give a sunrise/atelier glow without overpowering content.
  const pageBg = isAcademic ? "oklch(0.985 0.012 235)" : "oklch(0.985 0.020 55)";
  const heroGradient = isAcademic
    ? `radial-gradient(ellipse 55% 70% at 12% -5%, oklch(0.88 0.10 245 / 0.65) 0%, transparent 55%),
       radial-gradient(ellipse 50% 65% at 88% 0%, oklch(0.90 0.09 285 / 0.55) 0%, transparent 60%),
       radial-gradient(ellipse 70% 50% at 50% 35%, oklch(0.94 0.05 220 / 0.45) 0%, transparent 70%),
       radial-gradient(ellipse 40% 40% at 25% 60%, oklch(0.92 0.07 200 / 0.35) 0%, transparent 65%),
       linear-gradient(180deg, oklch(0.96 0.03 240 / 0.60) 0%, oklch(0.985 0.012 235 / 0) 100%)`
    : `radial-gradient(ellipse 55% 70% at 10% -5%, oklch(0.91 0.11 50 / 0.70) 0%, transparent 55%),
       radial-gradient(ellipse 55% 65% at 90% 0%, oklch(0.88 0.13 25 / 0.60) 0%, transparent 60%),
       radial-gradient(ellipse 70% 55% at 50% 30%, oklch(0.94 0.08 70 / 0.50) 0%, transparent 70%),
       radial-gradient(ellipse 45% 45% at 78% 55%, oklch(0.90 0.10 35 / 0.40) 0%, transparent 65%),
       radial-gradient(ellipse 40% 40% at 18% 65%, oklch(0.93 0.08 85 / 0.35) 0%, transparent 65%),
       linear-gradient(180deg, oklch(0.97 0.04 50 / 0.65) 0%, oklch(0.985 0.020 55 / 0) 100%)`;

  return (
    <div className="min-h-screen transition-colors duration-700 ease-out" style={{ backgroundColor: pageBg }}>
      <main className="relative py-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[720px] transition-[background] duration-700 ease-out [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
          style={{ background: heroGradient }}
        />
        {/* Subtle grain for premium paper feel */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[720px] opacity-[0.035] mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_50%,transparent)]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
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

          {/* Task-type chips for the active module */}
          <div className="mt-6">
            <TaskTypeChips
              skill={skill}
              value={taskType}
              onChange={setTaskType}
            />
          </div>

          {/* Tiered groups — current month */}
          <div className="mt-12 space-y-16">
            {TIERS.map((tier) => {
              const items = current[tier.key];
              if (items.length === 0) return null;
              return <TierSection key={tier.key} tier={tier} items={items} />;
            })}

            {current.hot.length === 0 &&
              current.likely.length === 0 &&
              current.review.length === 0 && (
                <p className="text-center font-display text-lg font-bold text-foreground/60">
                  Fresh predictions land here every Monday.
                </p>
              )}
          </div>

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
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
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
          <div>
            <h2
              className="font-display text-2xl font-black tracking-tight sm:text-3xl"
              style={{ color: archived ? "oklch(0.45 0.02 60)" : "oklch(var(--foreground))" }}
            >
              {archived ? archivedLabel[tier.key] : tier.label}
            </h2>
            <p className="text-sm font-medium text-foreground/55">
              {archived ? "Forecast made at the time — for reference only." : tier.helper}
            </p>
          </div>
        </div>
        <span className="font-handwriting text-xl text-foreground/45 sm:text-2xl">
          {items.length} {items.length === 1 ? "topic" : "topics"}
        </span>
      </header>

      <div className="mt-6 divide-y divide-border/50 border-y border-border/50">
        {items.map((p) => (
          <PredictionRow key={p.title} prediction={p} tier={tier} archived={archived} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Prediction row — compact single-line briefing                       */
/* ------------------------------------------------------------------ */

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
}: {
  prediction: Prediction;
  tier: { key: Tier; label: string; helper: string; icon: typeof Flame; accent: string };
  archived?: boolean;
}) {
  const appearances = prediction.appearances ?? tierDefaultAppearances(prediction.tier);
  const accent = tier.accent;

  return (
    <article
      className="group relative flex items-baseline gap-3 px-1 py-3.5 transition-colors hover:bg-foreground/[0.025] sm:gap-4 sm:py-4"
      style={{
        opacity: archived ? 0.72 : 1,
        filter: archived ? "saturate(0.78)" : undefined,
      }}
    >
      <p className="min-w-0 flex-1 font-display text-[14.5px] font-semibold leading-snug tracking-tight text-foreground sm:text-[15.5px]">
        {prediction.title}
        <span className="ml-1.5 whitespace-nowrap text-[12.5px] font-medium text-foreground/45 sm:text-[13px]">
          · appeared {appearances} times
        </span>
      </p>

      {/* Hover accent — left edge whisker in tier color */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 origin-left scale-y-0 rounded-r transition-transform duration-300 group-hover:scale-y-100"
        style={{ background: accent }}
      />
    </article>
  );
}
