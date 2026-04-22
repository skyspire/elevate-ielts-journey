import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  PenLine,
  FileText,
  Mail,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Scale,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowUpRight,
  SplitSquareHorizontal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { z } from "zod";
import { Footer } from "@/components/site/Footer";
import { BackButton } from "@/components/site/BackButton";
import { ThinkingRetriever } from "@/components/site/ThinkingRetriever";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
});

export const Route = createFileRoute("/writing-samples/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Writing Samples — BigIELTS.com" },
      {
        name: "description",
        content:
          "Browse Band 8+ IELTS Writing samples. Choose Task 1 or Task 2, drill down by category, and explore model questions for Academic and General Training.",
      },
      { property: "og:title", content: "Writing Samples — BigIELTS.com" },
      {
        property: "og:description",
        content:
          "Band 8+ IELTS Writing samples organised by task and category.",
      },
    ],
  }),
  component: WritingSamplesPage,
});

type Module = "academic" | "general";
type Task = "task1" | "task2";

// ───────── Category model ─────────
type Category = {
  id: string;
  label: string;
  hint: string;
  icon: typeof Mail;
};

const task2Essays: Category[] = [
  { id: "opinion", label: "Opinion Essay", hint: "Agree / Disagree", icon: Lightbulb },
  { id: "discussion", label: "Discussion Essay", hint: "Discuss both views + opinion", icon: Scale },
  { id: "advdis", label: "Advantages & Disadvantages Essay", hint: "Weigh pros and cons", icon: SplitSquareHorizontal },
  { id: "problem", label: "Problem & Solution Essay", hint: "Identify problems, propose solutions", icon: HelpCircle },
  { id: "direct", label: "Direct Question Essay", hint: "Two-part question", icon: MessageSquare },
  { id: "posneg", label: "Positive or Negative Development Essay", hint: "Evaluate a development", icon: TrendingUp },
  { id: "cause", label: "Cause and Effect Essay", hint: "Reasons and results", icon: Zap },
];

const categoriesByModuleTask: Record<Module, Record<Task, Category[]>> = {
  general: {
    task1: [
      { id: "formal", label: "Formal Letters", hint: "To officials, managers, companies", icon: Mail },
      { id: "informal", label: "Informal Letters", hint: "To friends & family", icon: MessageSquare },
    ],
    task2: task2Essays,
  },
  academic: {
    task1: [
      { id: "graphs", label: "Graphs & Charts", hint: "Bar, line, pie, table", icon: BarChart3 },
      { id: "process", label: "Processes & Maps", hint: "Diagrams & map changes", icon: FileText },
    ],
    task2: task2Essays,
  },
};

// ───────── Questions ─────────
import { task2Prompts, task1GeneralPrompts } from "@/data/writing-prompts";

const ALL_PROMPTS: Record<string, string[]> = {
  ...task2Prompts,
  ...task1GeneralPrompts,
};

type Tone = "blue" | "mint" | "peach" | "lilac";
type Question = {
  id: string;
  title: string; // Full question statement
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tone: Tone;
};

const TONES: Tone[] = ["blue", "mint", "peach", "lilac"];

const makeQuestions = (categoryId: string, label: string): Question[] => {
  const prompts = ALL_PROMPTS[categoryId];
  const items = prompts && prompts.length > 0
    ? prompts
    : Array.from({ length: 8 }).map((_, i) => `${label} — Sample Question ${i + 1}`);

  return items.map((statement, i) => ({
    id: `${categoryId}-${i + 1}`,
    title: statement,
    topic: ["Work", "Education", "Society", "Environment", "Technology", "Health", "Travel", "Lifestyle"][i % 8],
    difficulty: (["Easy", "Medium", "Hard"] as const)[i % 3],
    tone: TONES[i % TONES.length],
  }));
};

function WritingSamplesPage() {
  const search = Route.useSearch();
  const module: Module = search.module ?? "general";
  const [task, setTask] = useState<Task | null>(null);
  const fallbackCategories = categoriesByModuleTask[module]["task1"];
  const categories = task ? categoriesByModuleTask[module][task] : fallbackCategories;
  const [categoryId, setCategoryId] = useState<string>(fallbackCategories[0].id);

  // Reset category when task changes
  const onTaskChange = (next: Task) => {
    setTask(next);
    setCategoryId(categoriesByModuleTask[module][next][0].id);
  };

  const isAcademic = module === "academic";
  const accentText = isAcademic ? "text-brand" : "text-[oklch(0.45_0.15_28)]";
  const accentBg = isAcademic ? "bg-brand" : "bg-[oklch(0.58_0.16_28)]";
  const accentChip = isAcademic
    ? "bg-brand-soft text-brand border-brand/30"
    : "bg-[oklch(0.95_0.04_30)] text-[oklch(0.42_0.16_28)] border-[oklch(0.62_0.16_28)]/30";
  const accentRing = isAcademic
    ? "ring-brand/40 border-brand/40"
    : "ring-[oklch(0.58_0.16_28)]/40 border-[oklch(0.58_0.16_28)]/40";

  const activeCategory = categories.find((c) => c.id === categoryId) ?? categories[0];
  const questions = makeQuestions(activeCategory.id, activeCategory.label);

  // Module-tinted page + ambient gradient — swaps with Academic ⇄ General.
  // Gradient covers the entire page (not just the hero).
  const pageBg = isAcademic ? "oklch(0.985 0.014 235)" : "oklch(0.985 0.018 20)";
  const pageGradient = isAcademic
    ? `radial-gradient(ellipse 70% 45% at 18% 0%, oklch(0.90 0.08 235 / 0.55) 0%, transparent 60%),
       radial-gradient(ellipse 65% 40% at 88% 8%, oklch(0.92 0.07 280 / 0.45) 0%, transparent 65%),
       radial-gradient(ellipse 60% 35% at 0% 55%, oklch(0.93 0.06 200 / 0.35) 0%, transparent 65%),
       radial-gradient(ellipse 55% 30% at 100% 70%, oklch(0.92 0.06 270 / 0.35) 0%, transparent 65%),
       radial-gradient(ellipse 80% 25% at 50% 100%, oklch(0.93 0.05 220 / 0.30) 0%, transparent 70%)`
    : `radial-gradient(ellipse 70% 45% at 18% 0%, oklch(0.90 0.08 20 / 0.55) 0%, transparent 60%),
       radial-gradient(ellipse 65% 40% at 88% 8%, oklch(0.89 0.09 15 / 0.45) 0%, transparent 65%),
       radial-gradient(ellipse 60% 35% at 0% 55%, oklch(0.91 0.07 25 / 0.35) 0%, transparent 65%),
       radial-gradient(ellipse 55% 30% at 100% 70%, oklch(0.89 0.08 10 / 0.35) 0%, transparent 65%),
       radial-gradient(ellipse 80% 25% at 50% 100%, oklch(0.91 0.06 20 / 0.30) 0%, transparent 70%)`;

  return (
    <div
      className="relative min-h-screen transition-colors duration-700"
      style={{ backgroundColor: pageBg }}
    >
      {/* Ambient gradient wash — covers the entire page, swaps with the toggle */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-700 ease-out"
        style={{ background: pageGradient }}
      />

      {/* Top bar */}
      <header
        className="sticky top-0 z-40 border-b border-foreground/8 backdrop-blur-xl transition-colors duration-700"
        style={{ backgroundColor: `color-mix(in oklab, ${pageBg} 85%, transparent)` }}
      >
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">BigIELTS.com</span>
          </Link>

          <BackButton
            to="/dashboard"
            ariaLabel="Back to Dashboard"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-white text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          />
        </div>
      </header>

      <main className="relative z-[1] pt-10 sm:pt-14">
        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* MASSIVE EYEBROW — IELTS TYPE as the dominant element */}
          <div className="mt-4 text-center">
            <h2
              className={`relative inline-block font-display font-black leading-[0.95] tracking-[-0.02em] ${accentText}`}
              style={{ fontSize: "clamp(2.25rem, 8vw, 5rem)" }}
            >
              {/* Sparkle doodle (top-left) */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className={`absolute -left-5 -top-2 h-5 w-5 sm:-left-10 sm:-top-4 sm:h-7 sm:w-7 ${accentText} opacity-70`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.5 5.5l3 3M15.5 15.5l3 3M5.5 18.5l3-3M15.5 8.5l3-3" />
              </svg>

              IELTS{" "}
              <span className="relative inline-block">
                {/* Highlighter swipe behind the word */}
                <span
                  aria-hidden
                  className={`absolute inset-x-[-6px] bottom-[6%] -z-10 h-[58%] -rotate-1 ${
                    isAcademic ? "bg-[oklch(0.92_0.13_85)]" : "bg-[oklch(0.88_0.14_30)]"
                  } opacity-70`}
                  style={{ clipPath: "polygon(1% 8%, 99% 2%, 100% 92%, 0% 98%)" }}
                />
                <span className="relative">
                  {isAcademic ? "Academic" : "General Training"}
                </span>

                {/* Pencil underline swoosh */}
                <svg
                  aria-hidden
                  viewBox="0 0 300 22"
                  preserveAspectRatio="none"
                  className={`absolute -bottom-3 left-0 h-3 w-full ${accentText}`}
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

            {/* Sub-hero */}
            <h1 className="mt-8 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Writing Samples
              <br />
              <span className="text-foreground/55">Choose your task.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium leading-relaxed text-foreground/65 sm:text-base">
              Pick a task type, then a category. We'll show you Band 8+ model questions you can study and practice.
            </p>
          </div>

          {/* Step 1 — Task selector */}
          <div className="mt-16 sm:mt-20">
            <TaskEnvelopeScroll
              task={task}
              onTaskChange={onTaskChange}
              isAcademic={isAcademic}
            />
            <ThinkingRetriever taskSelected={task !== null} />
          </div>

          {/* Steps 2 & 3 — gated until a task is selected */}
          {task && (
            <>
              {/* Step 2 — Category chips (monochrome + single module accent on active) */}
              <div className="mt-16 flex flex-wrap justify-center gap-2.5 sm:mt-20">
                {categories.map((c) => {
                  const active = categoryId === c.id;
                  const Icon = c.icon;
                  const activeClasses = isAcademic
                    ? "bg-brand text-brand-foreground border-brand shadow-soft"
                    : "bg-[oklch(0.50_0.16_28)] text-white border-[oklch(0.50_0.16_28)] shadow-soft";
                  const restingClasses =
                    "bg-card text-foreground/75 border-border hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground hover:shadow-soft";
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-[14px] font-bold tracking-tight transition-all duration-200 ${
                        active ? activeClasses : restingClasses
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                      {c.label}
                    </button>
                  );
                })}
              </div>

              {/* Step 3 — Questions list — sits over the page-wide ambient gradient */}
              <div className="relative mt-16 pb-20 sm:mt-20 sm:pb-28">
                <div className="relative mx-auto w-full max-w-5xl py-12 sm:py-16">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {questions.map((q, i) => (
                      <QuestionRowCard
                        key={q.id}
                        index={i + 1}
                        q={q}
                        module={module}
                        task={task}
                        category={activeCategory.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ───────── Subcomponents ─────────
function StepLabel({ index, label }: { index: number; label: string }) {
  return (
    <div className="mt-12 mb-5 flex items-center justify-center gap-3">
      <span className="h-px w-10 bg-foreground/15" />
      <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-foreground/50">
        Step {index} · {label}
      </span>
      <span className="h-px w-10 bg-foreground/15" />
    </div>
  );
}

function TaskCard({
  active,
  onClick,
  icon: Icon,
  title,
  subtitle,
  accentRing,
  accentText,
  accentBg,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Mail;
  title: string;
  subtitle: string;
  accentRing: string;
  accentText: string;
  accentBg: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex items-start gap-4 overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card sm:p-6 ${
        active ? `ring-2 ring-inset ${accentRing}` : "border-foreground/10"
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-soft transition-colors ${
          active ? `${accentBg} text-white` : "bg-foreground/5 text-foreground/60"
        }`}
      >
        <Icon className="h-6 w-6" strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-foreground">{title}</h3>
          {active && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${accentText}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Selected
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-foreground/65">{subtitle}</p>
      </div>
    </button>
  );
}

function TaskEnvelopeScroll({
  task,
  onTaskChange,
  isAcademic,
}: {
  task: Task | null;
  onTaskChange: (t: Task) => void;
  isAcademic: boolean;
}) {
  const isT1 = task === "task1";
  const isT2 = task === "task2";
  const noSelection = task === null;
  const accentBorder = isAcademic
    ? "border-brand/55"
    : "border-[oklch(0.58_0.16_28)]/55";
  const accentText = isAcademic ? "text-brand" : "text-[oklch(0.45_0.15_28)]";
  const accentRule = isAcademic
    ? "bg-brand"
    : "bg-[oklch(0.50_0.16_28)]";

  const renderItem = (
    active: boolean,
    onClick: () => void,
    taskNum: "Task 1" | "Task 2",
    name: string,
    align: "left" | "right",
  ) => {
    return (
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
          {/* Single unified heading — same font, same weight, same size */}
          <h3
            className={`font-display font-bold leading-tight tracking-tight ${
              active ? "text-foreground" : "text-foreground/70"
            }`}
            style={{ fontSize: "clamp(1.25rem, 3.4vw, 1.875rem)" }}
          >
            <span>{taskNum}</span>
            <span className="mx-2 text-foreground/30">·</span>
            <span>{name}</span>
          </h3>

          {/* Thin accent rule — only on active */}
          <span
            aria-hidden
            className={`block h-px transition-all duration-500 ${
              active ? `w-12 sm:w-16 ${accentRule}` : "w-6 bg-foreground/15"
            }`}
          />
        </div>
      </button>
    );
  };

  // Compass needle: -90° points left (Task 1), +90° points right (Task 2), 0 = idle (north)
  const needleDeg = isT1 ? -90 : isT2 ? 90 : 0;
  void accentBorder;

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* 3-column layout — equal-width side columns mirror around the compass */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 sm:gap-10">
        <div className="flex justify-end">
          {renderItem(isT1, () => onTaskChange("task1"), "Task 1", isAcademic ? "Charts" : "Letters", "right")}
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
              <radialGradient id="brassRim" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="oklch(0.88 0.12 80)" />
                <stop offset="45%" stopColor="oklch(0.72 0.13 70)" />
                <stop offset="80%" stopColor="oklch(0.52 0.11 55)" />
                <stop offset="100%" stopColor="oklch(0.38 0.08 45)" />
              </radialGradient>
              <radialGradient id="compassFace" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.96 0.03 85)" />
                <stop offset="70%" stopColor="oklch(0.90 0.05 80)" />
                <stop offset="100%" stopColor="oklch(0.80 0.07 70)" />
              </radialGradient>
              <linearGradient id="needleN" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.55 0.20 30)" />
                <stop offset="100%" stopColor="oklch(0.40 0.16 25)" />
              </linearGradient>
              <linearGradient id="needleS" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.45 0.04 60)" />
                <stop offset="100%" stopColor="oklch(0.30 0.03 55)" />
              </linearGradient>
            </defs>

            {/* Outer brass rim */}
            <circle cx="50" cy="50" r="48" fill="url(#brassRim)" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="oklch(0.32 0.06 40)" strokeWidth="0.6" />
            {/* Inner bezel */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.38 0.08 45)" strokeWidth="0.8" />
            {/* Compass face */}
            <circle cx="50" cy="50" r="40" fill="url(#compassFace)" />

            {/* Tick marks (every 30°) */}
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

            {/* Cardinal letters */}
            <text x="50" y="18" textAnchor="middle" fontSize="7" fontWeight="800" fill="oklch(0.30 0.05 45)" fontFamily="serif">N</text>
            <text x="84" y="53" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">E</text>
            <text x="50" y="88" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">S</text>
            <text x="16" y="53" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">W</text>

            {/* Needle group — rotates smoothly */}
            <g
              style={{
                transformOrigin: "50px 50px",
                transform: `rotate(${needleDeg}deg)`,
                transition: "transform 850ms cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
            >
              {/* North half (red) */}
              <polygon points="50,12 46,50 54,50" fill="url(#needleN)" stroke="oklch(0.30 0.12 25)" strokeWidth="0.4" />
              {/* South half (dark) */}
              <polygon points="50,88 46,50 54,50" fill="url(#needleS)" stroke="oklch(0.22 0.02 55)" strokeWidth="0.4" />
            </g>

            {/* Center brass pin */}
            <circle cx="50" cy="50" r="3.2" fill="oklch(0.75 0.13 75)" stroke="oklch(0.38 0.08 45)" strokeWidth="0.6" />
            <circle cx="49.2" cy="49.2" r="1" fill="oklch(0.95 0.06 85)" opacity="0.85" />
          </svg>

          {noSelection && (
            <span
              className={`relative z-10 mt-2 font-display text-[9px] font-black uppercase tracking-[0.18em] sm:text-[10px] ${accentText}`}
            >
              Pick a Task
            </span>
          )}
        </div>

        <div className="flex justify-start">
          {renderItem(isT2, () => onTaskChange("task2"), "Task 2", "Essay", "left")}
        </div>
      </div>
    </div>
  );
}

const toneMap: Record<Tone, string> = {
  blue: "bg-brand-soft text-brand",
  mint: "bg-mint text-foreground",
  peach: "bg-peach text-foreground",
  lilac: "bg-lilac text-foreground",
};

// Deeper, accessible accent palettes that rotate per card.
// `topic` and `cue` use slightly different hues so the eye separates them.
const HIGHLIGHT_PALETTES: Array<{ topic: string; cue: string }> = [
  { topic: "oklch(0.45 0.16 255)", cue: "oklch(0.50 0.16 30)"  }, // blue + terracotta
  { topic: "oklch(0.42 0.13 160)", cue: "oklch(0.48 0.16 320)" }, // forest + magenta
  { topic: "oklch(0.45 0.15 60)",  cue: "oklch(0.45 0.15 270)" }, // amber + violet
  { topic: "oklch(0.45 0.16 295)", cue: "oklch(0.45 0.14 145)" }, // aubergine + sage
];

// Common IELTS Task 2 cue phrases (case-insensitive, longest first to win match).
const CUE_PATTERNS: RegExp[] = [
  /\bdo you agree or disagree\??/i,
  /\bto what extent do you agree or disagree\??/i,
  /\bdiscuss both views and give your opinion\??/i,
  /\bdiscuss both views\b/i,
  /\bwhat are the (?:advantages and disadvantages|problems and solutions|causes and (?:solutions|consequences)|effects|impacts|consequences|results|reasons)\??/i,
  /\bis this (?:a )?positive or negative(?: development)?\??/i,
  /\bis it (?:a )?positive(?: trend)?\??/i,
  /\bwhat can be done\??/i,
  /\bhow can (?:it|crime|stress) be (?:reduced|prevented|saved)\??/i,
  /\bwhat measures can reduce it\??/i,
  /\bwhat are its (?:effects|impacts|consequences|results)\??/i,
];

// Curated topic keywords (case-insensitive). Multi-word phrases listed first.
const TOPIC_KEYWORDS: string[] = [
  "university education", "online education", "online shopping", "social media",
  "public transport", "fast food", "international travel", "international migration",
  "public libraries", "animal testing", "death penalty", "team sports",
  "foreign languages", "traffic congestion", "youth unemployment", "plastic waste",
  "air pollution", "food waste", "water scarcity", "internet addiction",
  "global travel", "digital payments", "fast food consumption", "climate change",
  "traditional skills", "consumerism", "obesity", "pollution", "smartphones",
  "tourism", "automation", "urbanization", "advertising", "globalization",
  "homework", "exams", "crime", "stress", "zoos", "technology", "students",
  "children", "parents", "advertisements", "e-books", "marriage", "family",
];

type Segment = { text: string; kind: "plain" | "topic" | "cue" };

function segmentStatement(text: string): Segment[] {
  // 1. Find cue match (longest)
  let cueMatch: { start: number; end: number } | null = null;
  for (const re of CUE_PATTERNS) {
    const m = text.match(re);
    if (m && m.index !== undefined) {
      const span = { start: m.index, end: m.index + m[0].length };
      if (!cueMatch || span.end - span.start > cueMatch.end - cueMatch.start) {
        cueMatch = span;
      }
    }
  }

  // 2. Find topic match (first occurrence, longest keyword wins)
  let topicMatch: { start: number; end: number } | null = null;
  const sortedKeywords = [...TOPIC_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sortedKeywords) {
    const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    const m = text.match(re);
    if (m && m.index !== undefined) {
      const span = { start: m.index, end: m.index + m[0].length };
      // Skip if it overlaps the cue
      if (cueMatch && span.start < cueMatch.end && span.end > cueMatch.start) continue;
      topicMatch = span;
      break;
    }
  }

  // 3. Build segments by sorting matches and slicing
  const marks = [
    ...(topicMatch ? [{ ...topicMatch, kind: "topic" as const }] : []),
    ...(cueMatch ? [{ ...cueMatch, kind: "cue" as const }] : []),
  ].sort((a, b) => a.start - b.start);

  if (marks.length === 0) return [{ text, kind: "plain" }];

  const segs: Segment[] = [];
  let cursor = 0;
  for (const m of marks) {
    if (m.start > cursor) segs.push({ text: text.slice(cursor, m.start), kind: "plain" });
    segs.push({ text: text.slice(m.start, m.end), kind: m.kind });
    cursor = m.end;
  }
  if (cursor < text.length) segs.push({ text: text.slice(cursor), kind: "plain" });
  return segs;
}

function QuestionRowCard({
  q,
  index,
  module,
  task,
  category,
}: {
  q: Question;
  index: number;
  module: Module;
  task: Task;
  category: string;
}) {
  const idx = String(index).padStart(2, "0");
  const palette = HIGHLIGHT_PALETTES[(index - 1) % HIGHLIGHT_PALETTES.length];
  const segments = segmentStatement(q.title);

  return (
    <Link
      to="/writing-samples/$questionId"
      params={{ questionId: q.id }}
      search={{ module, task, category, title: q.title, topic: q.topic, difficulty: q.difficulty }}
      className="group relative flex h-full overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-card"
    >
      {/* Left column — index */}
      <div className="flex w-16 shrink-0 items-start justify-center border-r border-foreground/10 bg-foreground/[0.025] px-3 pt-6 pb-5 sm:w-20">
        <span className="font-display text-2xl font-black tracking-tight text-foreground/45 transition-colors group-hover:text-foreground/70 sm:text-3xl">
          {idx}
        </span>
      </div>

      {/* Right column — question statement with highlighted topic + cue */}
      <div className="flex min-w-0 flex-1 items-center px-5 py-6 sm:px-6">
        <p className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground sm:text-base">
          {segments.map((s, i) => {
            if (s.kind === "plain") return <span key={i}>{s.text}</span>;
            const color = s.kind === "topic" ? palette.topic : palette.cue;
            return (
              <span key={i} style={{ color, fontWeight: 800 }}>
                {s.text}
              </span>
            );
          })}
        </p>
      </div>
    </Link>
  );
}
