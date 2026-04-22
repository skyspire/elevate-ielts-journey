import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useState, type ReactNode } from "react";
import {
  PenLine,
  Mic,
  BookOpen,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { QuestionCard } from "@/components/site/QuestionCard";
import { BackButton } from "@/components/site/BackButton";


type Module = "academic" | "general";
type WritingTask = "task1" | "task2";
type SpeakingPart = "part1" | "part2";
type ExamSection = "writing" | "speaking" | "reading";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).catch("academic"),
  section: z.enum(["writing", "speaking", "reading"]).catch("writing"),
});

export const Route = createFileRoute("/recent-exam-questions")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Recent Exam Questions — BigIELTS.com" },
      {
        name: "description",
        content:
          "Real IELTS Writing and Speaking questions reported from recent test dates. Browse by Academic or General module, with Task 1/2 and Speaking Part 1/2/3.",
      },
      { property: "og:title", content: "Recent Exam Questions — BigIELTS.com" },
      {
        property: "og:description",
        content:
          "Latest verified IELTS questions from recent exams — Academic & General, Writing Task 1/2 and Speaking Part 1/2/3.",
      },
    ],
  }),
  component: RecentExamQuestionsPage,
});

/* ------------------------------------------------------------------ */
/* Question data                                                       */
/* ------------------------------------------------------------------ */

type Question = {
  tag: string;
  title: string;
  date: string;
  band?: string;
  locked?: boolean;
};

type WritingData = Record<WritingTask, Question[]>;
type SpeakingData = Record<SpeakingPart, Question[]>;

const academicWriting: WritingData = {
  task1: [
    {
      tag: "Bar Chart",
      title:
        "The chart below shows household spending on leisure activities in four countries in 2024.",
      date: "April 2026",
    },
    {
      tag: "Line Graph",
      title:
        "The graph illustrates electricity consumption per capita in three regions between 1990 and 2020.",
      date: "March 2026",
    },
    {
      tag: "Process",
      title: "The diagram shows how recycled plastic bottles are turned into clothing fibres.",
      date: "March 2026",
    },
    {
      tag: "Map",
      title: "The two maps show changes in a coastal town between 2000 and 2024.",
      date: "February 2026",
    },
  ],
  task2: [
    {
      tag: "Environment",
      title:
        "Some people believe individuals can do little to protect the environment. To what extent do you agree?",
      date: "April 2026",
    },
    {
      tag: "Education",
      title:
        "Many universities now offer online courses. Are the benefits greater than the drawbacks?",
      date: "April 2026",
    },
    {
      tag: "Technology",
      title:
        "Some argue that smartphones harm face-to-face communication. Discuss both views and give your opinion.",
      date: "March 2026",
    },
    {
      tag: "Society",
      title:
        "In some countries, the number of older people is rising. What problems does this cause and how can they be solved?",
      date: "March 2026",
    },
  ],
};

const generalWriting: WritingData = {
  task1: [
    {
      tag: "Formal Letter",
      title:
        "You recently bought an item online that arrived damaged. Write a letter to the company to complain and request a refund.",
      date: "April 2026",
    },
    {
      tag: "Semi-formal",
      title:
        "Your neighbour has been making a lot of noise late at night. Write a polite letter asking them to stop.",
      date: "April 2026",
    },
    {
      tag: "Informal Letter",
      title:
        "An old friend is visiting your city next month. Write a letter telling them what you have planned.",
      date: "March 2026",
    },
    {
      tag: "Formal Letter",
      title:
        "Write a letter to your manager requesting time off work for a personal matter, explaining the reason.",
      date: "February 2026",
    },
  ],
  task2: [
    {
      tag: "Work-Life",
      title:
        "Some people prefer to work from home, while others prefer to go to an office. Discuss both views and give your opinion.",
      date: "April 2026",
    },
    {
      tag: "Family",
      title:
        "Many families today eat fewer meals together than in the past. What are the reasons and effects of this change?",
      date: "March 2026",
    },
    {
      tag: "Health",
      title:
        "Fast food is becoming increasingly popular. Do the disadvantages outweigh the advantages?",
      date: "March 2026",
    },
    {
      tag: "Community",
      title:
        "Some people think parents should teach children how to be good members of society. To what extent do you agree?",
      date: "February 2026",
    },
  ],
};

// Speaking is identical for Academic and General
const speakingData: SpeakingData = {
  part1: [
    {
      tag: "Hometown",
      title: "Describe your hometown and what you like most about it.",
      date: "April 2026",
    },
    {
      tag: "Work / Study",
      title: "Do you work or are you a student? What do you enjoy about it?",
      date: "April 2026",
    },
    {
      tag: "Hobbies",
      title: "What do you usually do in your free time? How long have you done it?",
      date: "March 2026",
    },
    {
      tag: "Food",
      title: "What kind of food do you like to cook at home?",
      date: "March 2026",
    },
    {
      tag: "Weather",
      title: "What kind of weather do you like? Has it changed recently?",
      date: "February 2026",
    },
    {
      tag: "Travel",
      title: "Do you enjoy travelling? Where would you like to go next?",
      date: "January 2026",
    },
  ],
  part2: [
    {
      tag: "Memorable Trip",
      title:
        "Describe a journey that did not go as planned. You should say where, when, who and why. Follow-up: How do you usually react when plans change?",
      date: "April 2026",
    },
    {
      tag: "A Person",
      title:
        "Describe a person who inspires you. Say who they are, how you know them and why. Follow-up: Are role models more important today than in the past?",
      date: "March 2026",
    },
    {
      tag: "An Object",
      title:
        "Describe a piece of equipment in your home that you find useful. Follow-up: How has technology changed daily life in your country?",
      date: "March 2026",
    },
    {
      tag: "An Event",
      title:
        "Describe a celebration you attended recently. Follow-up: Do you think traditional celebrations are still important?",
      date: "February 2026",
    },
    {
      tag: "A Place",
      title:
        "Describe a quiet place you like to visit. Follow-up: Is it harder to find peaceful places in modern cities?",
      date: "January 2026",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function RecentExamQuestionsPage() {
  const search = Route.useSearch();
  const [module, setModule] = useState<Module>(search.module);
  const [section, setSection] = useState<ExamSection>(search.section);
  const isAcademic = module === "academic";

  return (
    <div className="min-h-screen bg-paper-white">
      <main className="relative py-10 sm:py-14">
        <BackButton to="/dashboard" ariaLabel="Back to Dashboard" />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">

          {/* Hero */}
          <div className="text-center">
            
            <div className="relative inline-block">
              <h1
                className="font-handwriting text-5xl font-bold leading-[0.95] text-foreground/55 sm:text-6xl md:text-7xl"
                style={{ transform: "rotate(-2deg)" }}
              >
                Recent Exam Questions
              </h1>
              <svg
                aria-hidden
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute -bottom-3 left-0 h-3 w-full text-foreground/55 sm:-bottom-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: "rotate(-2deg)" }}
              >
                <path d="M 6 9 C 50 4, 110 12, 160 7 S 250 11, 294 6" />
                <path
                  d="M 14 12 C 70 8, 130 13, 180 10 S 260 13, 286 11"
                  opacity="0.4"
                  strokeWidth="1.4"
                />
              </svg>
            </div>
            <div className="mx-auto mt-6 max-w-xl space-y-2">
              <p className="font-display text-lg font-black tracking-tight text-foreground sm:text-xl">
                Real questions. Real test-takers.
              </p>
              <p className="text-sm text-foreground/65 sm:text-[15px]">
                Verified Writing &amp; Speaking questions reported by{" "}
                <span className="relative inline-block whitespace-nowrap font-semibold text-foreground">
                  <span
                    aria-hidden
                    className="absolute inset-x-[-2px] bottom-[2px] -z-0 h-[55%] -rotate-[1.5deg] rounded-[2px]"
                    style={{
                      background:
                        "linear-gradient(100deg, oklch(0.92 0.16 95 / 0.85) 0%, oklch(0.88 0.18 90 / 0.85) 60%, oklch(0.92 0.16 95 / 0.7) 100%)",
                    }}
                  />
                  <span className="relative">real test-takers</span>
                </span>{" "}
                — updated every month.
              </p>
            </div>
          </div>


          {/* Module toggle (compass-owl style, simplified) */}
          <div className="mt-10 flex justify-center">
            <ModuleToggle module={module} setModule={setModule} />
          </div>

          {/* Section tabs */}
          <div className="mt-10 flex justify-center">
            <SectionTabs section={section} setSection={setSection} />
          </div>

          {/* Content */}
          <div className="mt-10">
            {section === "writing" ? (
              <WritingSection
                data={isAcademic ? academicWriting : generalWriting}
                isAcademic={isAcademic}
              />
            ) : section === "speaking" ? (
              <SpeakingSection data={speakingData} />
            ) : (
              <ReadingSection />
            )}
          </div>

          <p className="mt-14 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
            Updated monthly · Verified by real test-takers · Free samples available
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Module Toggle — compact owl-inspired style                          */
/* ------------------------------------------------------------------ */

function ModuleToggle({
  module,
  setModule,
}: {
  module: Module;
  setModule: (m: Module) => void;
}) {
  const isAcademic = module === "academic";
  return (
    <div className="relative flex items-center justify-center gap-3 sm:gap-6">
      <button
        type="button"
        onClick={() => setModule("academic")}
        aria-pressed={isAcademic}
        className={`group transition-all duration-300 ${
          isAcademic ? "opacity-100" : "opacity-45 hover:opacity-75"
        }`}
      >
        <span
          className={`font-display text-2xl font-black tracking-tight sm:text-4xl md:text-5xl ${
            isAcademic ? "text-foreground" : "text-foreground/55"
          }`}
        >
          Academic
        </span>
      </button>

      {/* Owl — same identity as dashboard */}
      <div className="relative flex shrink-0 items-end justify-center">
        <svg viewBox="0 0 200 220" className="h-44 w-44 sm:h-56 sm:w-56" aria-label="Wise owl">
          <path
            d="M 20 200 Q 100 195 180 200"
            stroke="oklch(0.45 0.06 60)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx="100"
            cy="150"
            rx="48"
            ry="46"
            fill={isAcademic ? "oklch(0.62 0.10 265)" : "oklch(0.60 0.15 28)"}
            className="transition-colors duration-500"
          />
          <ellipse cx="100" cy="158" rx="30" ry="32" fill="oklch(0.96 0.02 80)" />
          <path
            d="M 60 145 Q 50 175 70 188 Q 75 170 78 150 Z"
            fill={isAcademic ? "oklch(0.50 0.12 265)" : "oklch(0.48 0.16 28)"}
            className="transition-colors duration-500"
          />
          <path
            d="M 140 145 Q 150 175 130 188 Q 125 170 122 150 Z"
            fill={isAcademic ? "oklch(0.50 0.12 265)" : "oklch(0.48 0.16 28)"}
            className="transition-colors duration-500"
          />
          <g
            style={{
              transformOrigin: "100px 100px",
              transform: isAcademic ? "rotate(-22deg)" : "rotate(22deg)",
              transition: "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <circle
              cx="100"
              cy="92"
              r="48"
              fill={isAcademic ? "oklch(0.62 0.10 265)" : "oklch(0.60 0.15 28)"}
              className="transition-colors duration-500"
            />
            <circle
              cx="82"
              cy="92"
              r="18"
              fill="oklch(0.99 0 0)"
              stroke="oklch(0.20 0.02 250)"
              strokeWidth="3.5"
            />
            <circle
              cx="118"
              cy="92"
              r="18"
              fill="oklch(0.99 0 0)"
              stroke="oklch(0.20 0.02 250)"
              strokeWidth="3.5"
            />
            <circle
              cx={isAcademic ? "76" : "88"}
              cy="92"
              r="5"
              fill="oklch(0.18 0.02 250)"
              style={{ transition: "cx 500ms ease" }}
            />
            <circle
              cx={isAcademic ? "112" : "124"}
              cy="92"
              r="5"
              fill="oklch(0.18 0.02 250)"
              style={{ transition: "cx 500ms ease" }}
            />
            <path
              d="M 92 112 L 100 124 L 108 112 Z"
              fill="oklch(0.70 0.16 60)"
              stroke="oklch(0.45 0.14 60)"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>

      <button
        type="button"
        onClick={() => setModule("general")}
        aria-pressed={!isAcademic}
        className={`group transition-all duration-300 ${
          !isAcademic ? "opacity-100" : "opacity-45 hover:opacity-75"
        }`}
      >
        <span
          className={`font-display text-2xl font-black tracking-tight sm:text-4xl md:text-5xl ${
            !isAcademic ? "text-foreground" : "text-foreground/55"
          }`}
        >
          General
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section Tabs — Writing / Speaking                                   */
/* ------------------------------------------------------------------ */

function SectionTabs({
  section,
  setSection,
}: {
  section: ExamSection;
  setSection: (s: ExamSection) => void;
}) {
  const tabs: {
    key: ExamSection;
    label: string;
    icon: typeof PenLine;
    accent: string;
    deep: string;
  }[] = [
    {
      key: "writing",
      label: "Writing",
      icon: PenLine,
      accent: "oklch(0.52 0.16 258)",
      deep: "oklch(0.32 0.10 260)",
    },
    {
      key: "speaking",
      label: "Speaking",
      icon: Mic,
      accent: "oklch(0.52 0.11 195)",
      deep: "oklch(0.30 0.08 200)",
    },
    {
      key: "reading",
      label: "Reading",
      icon: BookOpen,
      accent: "oklch(0.55 0.13 45)",
      deep: "oklch(0.34 0.09 45)",
    },
  ];
  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-foreground/10 bg-white p-1.5 shadow-soft">
      {tabs.map((t) => {
        const active = section === t.key;
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setSection(t.key)}
            aria-pressed={active}
            className="group relative inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-[13px] font-semibold tracking-tight transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm"
            style={{
              background: active ? t.accent : "transparent",
              color: active ? "oklch(0.99 0 0)" : t.deep,
              boxShadow: active
                ? `0 6px 18px -8px ${t.accent}, inset 0 -1px 0 0 ${t.deep}`
                : "none",
            }}
          >
            <Icon
              className="h-4 w-4"
              strokeWidth={active ? 2.4 : 2}
              style={{ color: active ? "oklch(0.99 0 0)" : t.accent }}
            />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-toggle — Vintage brass compass (matches Writing/Speaking Samples) */
/* ------------------------------------------------------------------ */

function SubToggle<T extends string>({
  value,
  onChange,
  options,
  accent,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [{ key: T; label: string; sub?: string }, { key: T; label: string; sub?: string }];
  accent: string;
}) {
  const [left, right] = options;
  const isLeft = value === left.key;
  const needleDeg = isLeft ? -90 : 90;
  void accent;

  const renderItem = (
    active: boolean,
    onClick: () => void,
    name: string,
    sub: string | undefined,
    align: "left" | "right",
  ) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group block bg-transparent p-2 sm:p-4 ${
        align === "left" ? "text-left" : "text-right"
      } transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-50 hover:opacity-80"
      }`}
    >
      <div className={`flex flex-col ${align === "left" ? "items-start" : "items-end"} gap-2`}>
        <h3
          className={`font-display font-black leading-tight tracking-tight ${
            active ? "text-foreground" : "text-foreground/70"
          }`}
          style={{ fontSize: "clamp(1.25rem, 3.4vw, 1.875rem)" }}
        >
          {name}
        </h3>
        {sub && (
          <span
            className={`block text-[10px] font-black uppercase tracking-[0.18em] ${
              active ? "text-foreground/55" : "text-foreground/40"
            }`}
          >
            {sub}
          </span>
        )}
        <span
          aria-hidden
          className={`block h-px transition-all duration-500 ${
            active ? "w-12 bg-foreground/40 sm:w-16" : "w-6 bg-foreground/15"
          }`}
        />
      </div>
    </button>
  );

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 sm:gap-10">
        <div className="flex justify-end">
          {renderItem(isLeft, () => onChange(left.key), left.label, left.sub, "right")}
        </div>

        {/* Vintage brass compass */}
        <div
          className="relative flex flex-col items-center justify-center"
          style={{ width: "clamp(72px, 11vw, 96px)" }}
        >
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full drop-shadow-[0_4px_8px_oklch(0.30_0.06_45_/_0.35)]"
            style={{ width: "clamp(72px, 11vw, 96px)", height: "clamp(72px, 11vw, 96px)" }}
            aria-label="Compass selector"
          >
            <defs>
              <radialGradient id="brassRimRecent" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="oklch(0.88 0.12 80)" />
                <stop offset="45%" stopColor="oklch(0.72 0.13 70)" />
                <stop offset="80%" stopColor="oklch(0.52 0.11 55)" />
                <stop offset="100%" stopColor="oklch(0.38 0.08 45)" />
              </radialGradient>
              <radialGradient id="compassFaceRecent" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.96 0.03 85)" />
                <stop offset="70%" stopColor="oklch(0.90 0.05 80)" />
                <stop offset="100%" stopColor="oklch(0.80 0.07 70)" />
              </radialGradient>
              <linearGradient id="needleNRecent" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.55 0.20 30)" />
                <stop offset="100%" stopColor="oklch(0.40 0.16 25)" />
              </linearGradient>
              <linearGradient id="needleSRecent" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.45 0.04 60)" />
                <stop offset="100%" stopColor="oklch(0.30 0.03 55)" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="url(#brassRimRecent)" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="oklch(0.32 0.06 40)" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.38 0.08 45)" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="40" fill="url(#compassFaceRecent)" />

            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x1 = 50 + Math.sin(a) * 36;
              const y1 = 50 - Math.cos(a) * 36;
              const x2 = 50 + Math.sin(a) * (i % 3 === 0 ? 30 : 33);
              const y2 = 50 - Math.cos(a) * (i % 3 === 0 ? 30 : 33);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="oklch(0.30 0.05 45)"
                  strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
                  strokeLinecap="round"
                />
              );
            })}

            <text x="50" y="18" textAnchor="middle" fontSize="7" fontWeight="800" fill="oklch(0.30 0.05 45)" fontFamily="serif">N</text>
            <text x="84" y="53" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">E</text>
            <text x="50" y="88" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">S</text>
            <text x="16" y="53" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">W</text>

            <g
              style={{
                transformOrigin: "50px 50px",
                transform: `rotate(${needleDeg}deg)`,
                transition: "transform 850ms cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
            >
              <polygon points="50,12 46,50 54,50" fill="url(#needleNRecent)" stroke="oklch(0.30 0.12 25)" strokeWidth="0.4" />
              <polygon points="50,88 46,50 54,50" fill="url(#needleSRecent)" stroke="oklch(0.22 0.02 55)" strokeWidth="0.4" />
            </g>

            <circle cx="50" cy="50" r="3.2" fill="oklch(0.75 0.13 75)" stroke="oklch(0.38 0.08 45)" strokeWidth="0.6" />
            <circle cx="49.2" cy="49.2" r="1" fill="oklch(0.95 0.06 85)" opacity="0.85" />
          </svg>
        </div>

        <div className="flex justify-start">
          {renderItem(!isLeft, () => onChange(right.key), right.label, right.sub, "left")}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Month-Year grid                                                      */
/* ------------------------------------------------------------------ */

function MonthGrid({
  months,
  selected,
  onSelect,
  counts,
  accent,
}: {
  months: string[];
  selected: string | "all";
  onSelect: (m: string | "all") => void;
  counts: Record<string, number>;
  accent: string;
}) {
  void counts;
  void accent;
  const [showOlder, setShowOlder] = useState(false);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Generate last 5 calendar months from today (current month back 4)
  const now = new Date();
  const lastFive: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    lastFive.push(`${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`);
  }

  // Older months = those in our data not in the last 5
  const olderMonths = months.filter((m) => !lastFive.includes(m));

  // Abbreviate "March 2026" → "Mar 2026"
  const abbreviate = (m: string) => {
    const [mon, yr] = m.split(" ");
    return `${mon.slice(0, 3)} ${yr}`;
  };

  // Professional palette — one accent per month card (deepened, muted, editorial)
  const palette = [
    { fill: "oklch(0.42 0.10 258)", soft: "oklch(0.96 0.02 258)" }, // indigo
    { fill: "oklch(0.45 0.09 195)", soft: "oklch(0.96 0.02 195)" }, // teal
    { fill: "oklch(0.44 0.10 155)", soft: "oklch(0.96 0.02 155)" }, // forest
    { fill: "oklch(0.46 0.10 40)",  soft: "oklch(0.96 0.02 50)"  }, // burnt sienna
    { fill: "oklch(0.40 0.09 320)", soft: "oklch(0.96 0.02 320)" }, // plum
  ];

  return (
    <div>
      <div className="mb-3 flex items-end justify-center">
        <p className="font-display text-[10px] font-black uppercase tracking-[0.24em] text-foreground/55">
          Browse by month
        </p>
      </div>
      <div className="mx-auto grid max-w-3xl grid-cols-5 justify-center gap-1.5 sm:gap-2.5">
        {lastFive.map((m, i) => {
          const active = selected === m;
          const c = palette[i % palette.length];
          return (
            <button
              key={m}
              type="button"
              onClick={() => onSelect(active ? "all" : m)}
              className="group rounded-xl border-2 px-1.5 py-2 text-center font-display text-[11px] font-black tracking-tight transition-all duration-200 hover:-translate-y-0.5 sm:px-3 sm:py-2.5 sm:text-sm"
              style={{
                background: active ? c.fill : c.soft,
                borderColor: c.fill,
                color: active ? "oklch(0.99 0 0)" : c.fill,
                boxShadow: active
                  ? `3px 3px 0 0 ${c.fill}`
                  : `2px 2px 0 0 ${c.fill}`,
              }}
            >
              {abbreviate(m)}
            </button>
          );
        })}
      </div>

      {/* See more — handwritten link */}
      {olderMonths.length > 0 && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setShowOlder((v) => !v)}
            className="font-handwriting text-xl font-bold text-foreground/65 underline decoration-foreground/30 decoration-wavy underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/60 sm:text-2xl"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            {showOlder ? "← hide older months" : "see more →"}
          </button>
        </div>
      )}

      {showOlder && olderMonths.length > 0 && (
        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {olderMonths.map((m, i) => {
            const active = selected === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onSelect(active ? "all" : m)}
                className={`font-handwriting text-lg font-bold underline-offset-4 transition-colors sm:text-xl ${
                  active
                    ? "text-foreground underline decoration-foreground/60"
                    : "text-foreground/55 hover:text-foreground hover:underline"
                }`}
                style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1.5}deg)` }}
              >
                {abbreviate(m)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function uniqueMonths(qs: Question[]): string[] {
  const set = new Set(qs.map((q) => q.date));
  return Array.from(set).sort((a, b) => {
    const da = new Date(a + " 1");
    const db = new Date(b + " 1");
    return db.getTime() - da.getTime();
  });
}

function monthCounts(qs: Question[]): Record<string, number> {
  return qs.reduce<Record<string, number>>((acc, q) => {
    acc[q.date] = (acc[q.date] ?? 0) + 1;
    return acc;
  }, {});
}

/* ------------------------------------------------------------------ */
/* Writing — Task 1 & Task 2                                           */
/* ------------------------------------------------------------------ */

function WritingSection({ data, isAcademic }: { data: WritingData; isAcademic: boolean }) {
  const [task, setTask] = useState<WritingTask>("task1");
  const [month, setMonth] = useState<string | "all">("April 2026");
  const accent = task === "task1" ? "oklch(0.48 0.16 230)" : "oklch(0.42 0.18 260)";
  const questions = data[task];
  const months = uniqueMonths(questions);
  const counts = monthCounts(questions);
  const filtered = month === "all" ? questions : questions.filter((q) => q.date === month);

  const eyebrow =
    task === "task1"
      ? isAcademic
        ? "Writing Task 1 — Reports"
        : "Writing Task 1 — Letters"
      : "Writing Task 2 — Essays";
  const title =
    task === "task1"
      ? isAcademic
        ? "Charts, graphs, processes & maps"
        : "Formal, semi-formal & informal"
      : "Opinion, discussion & problem–solution";

  return (
    <div className="space-y-8">
      <SubToggle<WritingTask>
        value={task}
        onChange={(v) => {
          setTask(v);
          setMonth("April 2026");
        }}
        accent={accent}
        options={[
          {
            key: "task1",
            label: "Task 1",
            sub: isAcademic ? "Reports" : "Letters",
          },
          { key: "task2", label: "Task 2", sub: "Essays" },
        ]}
      />

      <MonthGrid
        months={months}
        selected={month}
        onSelect={setMonth}
        counts={counts}
        accent={accent}
      />

      <DottedResultsPanel>
        <SubSection
          eyebrow={eyebrow}
          emoji="✍️"
          title={title}
          questions={filtered}
          accent={accent}
          sectionLabel={task === "task1" ? "Writing Task 1" : "Writing Task 2"}
        />
      </DottedResultsPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Speaking — General Questions / Cue Cards & Follow Ups               */
/* ------------------------------------------------------------------ */

function SpeakingSection({ data }: { data: SpeakingData }) {
  const [part, setPart] = useState<SpeakingPart>("part1");
  const [month, setMonth] = useState<string | "all">("April 2026");
  const accent = part === "part1" ? "oklch(0.55 0.16 250)" : "oklch(0.50 0.15 200)";
  const questions = data[part];
  const months = uniqueMonths(questions);
  const counts = monthCounts(questions);
  const filtered = month === "all" ? questions : questions.filter((q) => q.date === month);

  const eyebrow =
    part === "part1" ? "Speaking Part 1" : "Speaking Part 2 & 3";
  const title =
    part === "part1"
      ? "Personal questions & familiar topics"
      : "Long-turn cue cards with follow-up discussion";

  return (
    <div className="space-y-8">
      <SubToggle<SpeakingPart>
        value={part}
        onChange={(v) => {
          setPart(v);
          setMonth("April 2026");
        }}
        accent={accent}
        options={[
          { key: "part1", label: "General Questions", sub: "Part 1 interview" },
          { key: "part2", label: "Cue Cards & Follow Ups", sub: "Part 2 + Part 3" },
        ]}
      />

      <MonthGrid
        months={months}
        selected={month}
        onSelect={setMonth}
        counts={counts}
        accent={accent}
      />

      <DottedResultsPanel>
        <SubSection
          eyebrow={eyebrow}
          emoji="🎙️"
          title={title}
          questions={filtered}
          accent={accent}
          sectionLabel={part === "part1" ? "Speaking Part 1" : "Speaking Part 2"}
        />
      </DottedResultsPanel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reading — coming soon placeholder                                   */
/* ------------------------------------------------------------------ */

function ReadingSection() {
  const accent = "oklch(0.55 0.13 155)";
  return (
    <DottedResultsPanel>
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-black tracking-tight text-foreground sm:text-2xl">
              Latest reading passages & question types
            </h2>
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-foreground/15 bg-white/60 p-10 text-center">
          <p className="font-display text-base font-black tracking-tight text-foreground sm:text-lg">
            Reading question bank is on the way.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-foreground/60">
            We&apos;re curating the most-recently reported reading passages and question types
            from real test-takers. Check back soon — or sign up to be notified the moment they
            drop.
          </p>
        </div>
      </section>
    </DottedResultsPanel>
  );
}

/* Full-bleed dotted background panel for question results area */
function DottedResultsPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Full-bleed dotted background extending beyond the content container */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 bg-paper-dots"
      />
      {/* Soft top border to separate from cream area */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-foreground/10"
      />
      <div className="relative py-10 sm:py-12">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-section + question card                                         */
/* ------------------------------------------------------------------ */

type QuestionType =
  | "Writing Task 1"
  | "Writing Task 2"
  | "Speaking Part 1"
  | "Speaking Part 2"
  | "Speaking Part 3";

function SubSection({
  eyebrow,
  emoji,
  title,
  questions,
  accent,
  sectionLabel,
}: {
  eyebrow: string;
  emoji: string;
  title: string;
  questions: Question[];
  accent: string;
  sectionLabel: QuestionType;
}) {
  return (
    <section>
      <div className="mb-5 flex items-center justify-end">
        <span
          className="hidden font-mono text-[11px] font-semibold tabular-nums sm:inline"
          style={{ color: accent }}
        >
          {String(questions.length).padStart(2, "0")} questions
        </span>
      </div>
      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/15 bg-white/60 p-8 text-center">
          <p className="font-display text-sm font-bold text-foreground/60">
            No questions reported for this month yet.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-7 text-center">
            <h3 className="font-display text-xl font-black leading-tight tracking-tight sm:text-2xl">
              <span style={{ color: accent }}>IELTS repeats questions</span>{" "}
              <span className="text-foreground">year after year</span>
            </h3>
            <p className="mt-1.5 font-display text-sm font-bold text-foreground/65 sm:text-[15px]">
              Every question below is worth practising.
            </p>
          </div>
          <div className="grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {questions.map((q) => (
              <ExamQuestionCard key={q.title} q={q} sectionLabel={sectionLabel} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* Tag → tone mapping for the homepage QuestionCard */
type Tone = "blue" | "mint" | "peach" | "lilac";

const TAG_TONE: Record<string, Tone> = {
  // greens / mint
  Environment: "mint",
  Health: "mint",
  Technology: "mint",
  Hobbies: "mint",
  Food: "mint",
  // blues
  Education: "blue",
  Society: "blue",
  Hometown: "blue",
  "Memorable Trip": "blue",
  Travel: "blue",
  "Work / Study": "blue",
  // peach (charts / tasks 1)
  "Bar Chart": "peach",
  "Line Graph": "peach",
  Process: "peach",
  Map: "peach",
  Weather: "peach",
  "An Object": "peach",
  // lilac (letters / events / people)
  Formal: "lilac",
  "Semi-formal": "lilac",
  Informal: "lilac",
  "A Person": "lilac",
  "An Event": "lilac",
  "A Place": "lilac",
};


function ExamQuestionCard({
  q,
  sectionLabel,
}: {
  q: Question;
  sectionLabel: QuestionType;
}) {
  const tone: Tone = TAG_TONE[q.tag] ?? "blue";
  return (
    <QuestionCard
      tag={q.tag}
      tagTone={tone}
      type={sectionLabel}
      title={q.title}
      date={q.date}
      band={q.band}
      locked={q.locked}
    />
  );
}
