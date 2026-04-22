import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import {
  ArrowLeft,
  PenLine,
  Mic,
  BookOpen,
  Calendar,
  Lock,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";

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
    <div className="min-h-screen bg-paper-cream">
      <main className="relative py-10 sm:py-14">
        {/* Subtle ruled-paper background behind hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-paper-ruled opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Back link */}
          <div className="mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-foreground/55 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.6} />
              Dashboard
            </Link>
          </div>

          {/* Hero */}
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[oklch(0.62_0.20_25)]/10 px-3 py-1 ring-1 ring-inset ring-[oklch(0.62_0.20_25)]/30">
              <Flame className="h-3.5 w-3.5 text-[oklch(0.55_0.20_25)]" strokeWidth={2.6} />
              <span className="font-display text-[10px] font-black uppercase tracking-[0.22em] text-[oklch(0.45_0.18_25)]">
                Fresh from recent exams
              </span>
            </div>
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
            <p className="mx-auto mt-6 max-w-xl text-sm text-foreground/60 sm:text-base">
              Verified Writing & Speaking questions reported by real test-takers — updated each
              month.
            </p>
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
    <div className="relative flex items-center justify-center gap-3 sm:gap-5">
      <button
        type="button"
        onClick={() => setModule("academic")}
        aria-pressed={isAcademic}
        className={`group transition-all duration-300 ${
          isAcademic ? "scale-110" : "scale-95 opacity-45 hover:opacity-75"
        }`}
      >
        <span
          className={`font-display text-xl font-black tracking-tight sm:text-3xl ${
            isAcademic ? "text-foreground" : "text-foreground/55"
          }`}
        >
          Academic
        </span>
      </button>

      {/* Mini owl — same identity as dashboard */}
      <div className="relative flex shrink-0 items-end justify-center">
        <svg viewBox="0 0 200 220" className="h-24 w-24 sm:h-32 sm:w-32" aria-label="Wise owl">
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
          !isAcademic ? "scale-110" : "scale-95 opacity-45 hover:opacity-75"
        }`}
      >
        <span
          className={`font-display text-xl font-black tracking-tight sm:text-3xl ${
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
  const tabs: { key: ExamSection; label: string; icon: typeof PenLine }[] = [
    { key: "writing", label: "Writing", icon: PenLine },
    { key: "speaking", label: "Speaking", icon: Mic },
    { key: "reading", label: "Reading", icon: BookOpen },
  ];
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-white p-1 shadow-soft">
      {tabs.map((t) => {
        const active = section === t.key;
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => setSection(t.key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-[12px] font-extrabold uppercase tracking-[0.16em] transition-all sm:px-5 ${
              active
                ? "bg-foreground text-background shadow-soft"
                : "text-foreground/55 hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.6} />
            {t.label}
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
          className={`font-display font-bold leading-tight tracking-tight ${
            active ? "text-foreground" : "text-foreground/70"
          }`}
          style={{ fontSize: "clamp(1.25rem, 3.4vw, 1.875rem)" }}
        >
          {name}
        </h3>
        {sub && (
          <span
            className={`block text-[10px] font-semibold uppercase tracking-[0.18em] ${
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
  const allActive = selected === "all";
  return (
    <div>
      <div className="mb-3 flex items-end justify-center">
        <p className="font-display text-[10px] font-black uppercase tracking-[0.24em] text-foreground/55">
          Browse by month
        </p>
      </div>
      <div className="relative -mx-5 px-5 sm:mx-0 sm:px-0">
        {/* Edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-paper-cream to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-paper-cream to-transparent"
        />
        <div
          className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* All months chip */}
          <button
            type="button"
            onClick={() => onSelect("all")}
            className={`group relative flex shrink-0 snap-start flex-col items-start overflow-hidden rounded-xl border px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${
              allActive
                ? "border-transparent text-white shadow-card"
                : "border-foreground/10 bg-white text-foreground hover:border-foreground/25 hover:shadow-soft"
            }`}
            style={allActive ? { background: accent } : undefined}
          >
            <span
              className={`block font-display text-[10px] font-black uppercase tracking-[0.2em] ${
                allActive ? "text-white/80" : "text-foreground/50"
              }`}
            >
              View
            </span>
            <span className="mt-0.5 block font-display text-base font-black tracking-tight sm:text-lg">
              All
            </span>
            <span
              className={`mt-1 font-mono text-[10px] font-semibold tabular-nums ${
                allActive ? "text-white/85" : "text-foreground/45"
              }`}
            >
              {Object.values(counts).reduce((a, b) => a + b, 0)} total
            </span>
          </button>

          {months.map((m) => {
            const [mon, yr] = m.split(" ");
            const active = selected === m;
            const count = counts[m] ?? 0;
            return (
              <button
                key={m}
                type="button"
                onClick={() => onSelect(m)}
                className={`group relative flex shrink-0 snap-start flex-col items-start overflow-hidden rounded-xl border px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  active
                    ? "border-transparent text-white shadow-card"
                    : "border-foreground/10 bg-white text-foreground hover:border-foreground/25 hover:shadow-soft"
                }`}
                style={active ? { background: accent } : undefined}
              >
                <span
                  className={`block font-display text-[10px] font-black uppercase tracking-[0.2em] ${
                    active ? "text-white/80" : "text-foreground/50"
                  }`}
                >
                  {yr}
                </span>
                <span className="mt-0.5 block font-display text-base font-black tracking-tight sm:text-lg">
                  {mon}
                </span>
                <span
                  className={`mt-1 inline-flex items-center gap-1 font-mono text-[10px] font-semibold tabular-nums ${
                    active ? "text-white/85" : "text-foreground/45"
                  }`}
                >
                  <span
                    className={`inline-block h-1 w-1 rounded-full ${
                      active ? "bg-white/80" : "bg-foreground/40"
                    }`}
                  />
                  {count} new
                </span>
              </button>
            );
          })}
        </div>
      </div>
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
  const [month, setMonth] = useState<string | "all">("all");
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
          setMonth("all");
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

      <SubSection eyebrow={eyebrow} title={title} questions={filtered} accent={accent} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Speaking — General Questions / Cue Cards & Follow Ups               */
/* ------------------------------------------------------------------ */

function SpeakingSection({ data }: { data: SpeakingData }) {
  const [part, setPart] = useState<SpeakingPart>("part1");
  const [month, setMonth] = useState<string | "all">("all");
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
          setMonth("all");
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

      <SubSection eyebrow={eyebrow} title={title} questions={filtered} accent={accent} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reading — coming soon placeholder                                   */
/* ------------------------------------------------------------------ */

function ReadingSection() {
  const accent = "oklch(0.55 0.13 155)";
  return (
    <div className="space-y-6">
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p
              className="font-display text-[10px] font-black uppercase tracking-[0.24em]"
              style={{ color: accent }}
            >
              Reading — Recent Passages
            </p>
            <h2 className="mt-1 font-display text-xl font-black tracking-tight text-foreground sm:text-2xl">
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-section + question card                                         */
/* ------------------------------------------------------------------ */

function SubSection({
  eyebrow,
  title,
  questions,
  accent,
}: {
  eyebrow: string;
  title: string;
  questions: Question[];
  accent: string;
}) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p
            className="font-display text-[10px] font-black uppercase tracking-[0.24em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
          <h2 className="mt-1 font-display text-xl font-black tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
        </div>
        <span className="hidden font-mono text-[11px] font-semibold tabular-nums text-foreground/45 sm:inline">
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
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((q) => (
            <ExamQuestionCard key={q.title} q={q} accent={accent} />
          ))}
        </div>
      )}
    </section>
  );
}

function ExamQuestionCard({ q, accent }: { q: Question; accent: string }) {
  const locked = q.locked ?? true;
  const band = q.band ?? "Band 8.5";
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Accent rail */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1"
        style={{ background: accent }}
      />
      <div className="flex flex-1 flex-col gap-4 p-5 pl-6 sm:p-6 sm:pl-7">
        {/* Tag */}
        <div className="flex items-center justify-between gap-3">
          <span
            className="inline-flex rounded-full px-2.5 py-1 font-display text-[10px] font-black uppercase tracking-[0.18em]"
            style={{ background: `color-mix(in oklab, ${accent} 12%, white)`, color: accent }}
          >
            {q.tag}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-foreground/50">
            <Calendar className="h-3 w-3" strokeWidth={2.6} />
            {q.date}
          </span>
        </div>

        {/* Question */}
        <h3 className="font-display text-[15px] font-extrabold leading-snug tracking-tight text-foreground sm:text-base">
          {q.title}
        </h3>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-foreground/10 pt-4">
          <span className="rounded-full bg-secondary px-2 py-0.5 font-display text-[10px] font-black uppercase tracking-[0.18em] text-secondary-foreground">
            {band}
          </span>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-all group-hover:text-white"
            style={{
              backgroundColor: locked ? undefined : accent,
            }}
          >
            {locked ? (
              <Lock className="h-3.5 w-3.5" strokeWidth={2.6} />
            ) : (
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.6} />
            )}
          </span>
        </div>

        {locked && (
          <p className="-mt-1 text-[11px] font-semibold text-foreground/55">
            Sign up to read · free sample available
          </p>
        )}
      </div>
    </article>
  );
}
