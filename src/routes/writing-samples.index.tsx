import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  GraduationCap,
  ArrowLeft,
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

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
});

export const Route = createFileRoute("/writing-samples/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Writing Samples — BandPath" },
      {
        name: "description",
        content:
          "Browse Band 8+ IELTS Writing samples. Choose Task 1 or Task 2, drill down by category, and explore model questions for Academic and General Training.",
      },
      { property: "og:title", content: "Writing Samples — BandPath" },
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
import { task2Prompts } from "@/data/writing-prompts";

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
  const prompts = task2Prompts[categoryId];
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
  const navigate = useNavigate();
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
  const accentText = isAcademic ? "text-brand" : "text-[oklch(0.42_0.10_160)]";
  const accentBg = isAcademic ? "bg-brand" : "bg-[oklch(0.55_0.10_160)]";
  const accentChip = isAcademic
    ? "bg-brand-soft text-brand border-brand/30"
    : "bg-[oklch(0.94_0.04_160)] text-[oklch(0.38_0.10_160)] border-[oklch(0.62_0.10_160)]/30";
  const accentRing = isAcademic
    ? "ring-brand/40 border-brand/40"
    : "ring-[oklch(0.55_0.10_160)]/40 border-[oklch(0.55_0.10_160)]/40";

  const activeCategory = categories.find((c) => c.id === categoryId) ?? categories[0];
  const questions = makeQuestions(activeCategory.id, activeCategory.label);

  return (
    <div className="min-h-screen bg-paper-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-paper-cream/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">BandPath</span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="relative py-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-paper-ruled opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
            <Link to="/dashboard" className="hover:text-foreground/80">Dashboard</Link>
            <span>/</span>
            <span className={accentText}>Writing Samples</span>
          </div>

          {/* Module switcher — School-vibe rotary dial with BigIELTS branding */}
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center gap-3 sm:gap-6">
              {/* Academic label (left) */}
              <button
                type="button"
                onClick={() => navigate({ to: "/writing-samples", search: { module: "academic" } })}
                aria-pressed={isAcademic}
                className={`group transition-all duration-300 ${
                  isAcademic ? "scale-110" : "scale-95 opacity-45 hover:opacity-75"
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

              {/* The Owl — head turns to choose module */}
              <div className="relative flex shrink-0 items-end justify-center">
                <svg
                  viewBox="0 0 200 220"
                  className="h-44 w-44 sm:h-56 sm:w-56"
                  aria-label="Wise owl mascot"
                >
                  {/* Branch */}
                  <path
                    d="M 20 200 Q 100 195 180 200"
                    stroke="oklch(0.45 0.06 60)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 60 198 q -4 -8 -10 -10 M 140 198 q 4 -8 10 -10"
                    stroke="oklch(0.45 0.06 60)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Body */}
                  <ellipse
                    cx="100"
                    cy="150"
                    rx="48"
                    ry="46"
                    fill={isAcademic ? "oklch(0.62 0.10 265)" : "oklch(0.58 0.09 160)"}
                    className="transition-colors duration-500"
                  />
                  {/* Belly */}
                  <ellipse cx="100" cy="158" rx="30" ry="32" fill="oklch(0.96 0.02 80)" />
                  {/* Wings */}
                  <path
                    d="M 60 145 Q 50 175 70 188 Q 75 170 78 150 Z"
                    fill={isAcademic ? "oklch(0.50 0.12 265)" : "oklch(0.46 0.10 160)"}
                    className="transition-colors duration-500"
                  />
                  <path
                    d="M 140 145 Q 150 175 130 188 Q 125 170 122 150 Z"
                    fill={isAcademic ? "oklch(0.50 0.12 265)" : "oklch(0.46 0.10 160)"}
                    className="transition-colors duration-500"
                  />
                  {/* Feet */}
                  <path
                    d="M 88 196 v 6 m -4 -3 h 8 M 112 196 v 6 m -4 -3 h 8"
                    stroke="oklch(0.55 0.14 60)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* HEAD GROUP — rotates */}
                  <g
                    style={{
                      transformOrigin: "100px 100px",
                      transform: isAcademic ? "rotate(-22deg)" : "rotate(22deg)",
                      transition: "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {/* Head */}
                    <circle
                      cx="100"
                      cy="92"
                      r="48"
                      fill={isAcademic ? "oklch(0.62 0.10 265)" : "oklch(0.58 0.09 160)"}
                      className="transition-colors duration-500"
                    />
                    {/* Ear tufts */}
                    <path
                      d="M 64 58 l 8 -18 l 12 14 Z M 136 58 l -8 -18 l -12 14 Z"
                      fill={isAcademic ? "oklch(0.50 0.12 265)" : "oklch(0.46 0.10 160)"}
                      className="transition-colors duration-500"
                    />

                    {/* Glasses frame */}
                    <circle cx="82" cy="92" r="18" fill="oklch(0.99 0 0)" stroke="oklch(0.20 0.02 250)" strokeWidth="3.5" />
                    <circle cx="118" cy="92" r="18" fill="oklch(0.99 0 0)" stroke="oklch(0.20 0.02 250)" strokeWidth="3.5" />
                    <line x1="100" y1="92" x2="100" y2="92" stroke="oklch(0.20 0.02 250)" strokeWidth="3.5" />
                    <path d="M 100 92 q 0 -2 0 -2" stroke="oklch(0.20 0.02 250)" strokeWidth="3.5" />
                    <line x1="98" y1="92" x2="102" y2="92" stroke="oklch(0.20 0.02 250)" strokeWidth="3.5" />

                    {/* Eyes (pupils shift to side based on selection) */}
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
                    {/* Eye shine */}
                    <circle
                      cx={isAcademic ? "78" : "90"}
                      cy="90"
                      r="1.5"
                      fill="white"
                      style={{ transition: "cx 500ms ease" }}
                    />
                    <circle
                      cx={isAcademic ? "114" : "126"}
                      cy="90"
                      r="1.5"
                      fill="white"
                      style={{ transition: "cx 500ms ease" }}
                    />

                    {/* Beak */}
                    <path
                      d="M 92 112 L 100 124 L 108 112 Z"
                      fill="oklch(0.70 0.16 60)"
                      stroke="oklch(0.45 0.14 60)"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>

                {/* BigIELTS.com brand chip below */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-foreground/15 bg-white px-3 py-1 shadow-soft">
                  <span className="font-display text-[11px] font-black tracking-tight text-foreground">
                    BigIELTS<span className="text-foreground/50">.com</span>
                  </span>
                </div>
              </div>

              {/* General label (right) */}
              <button
                type="button"
                onClick={() => navigate({ to: "/writing-samples", search: { module: "general" } })}
                aria-pressed={!isAcademic}
                className={`group transition-all duration-300 ${
                  !isAcademic ? "scale-110" : "scale-95 opacity-45 hover:opacity-75"
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

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/45">
              Turn the dial · Choose your module
            </p>
          </div>

          {/* MASSIVE EYEBROW — IELTS TYPE as the dominant element */}
          <div className="mt-8 text-center">
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
                    isAcademic ? "bg-[oklch(0.92_0.13_85)]" : "bg-[oklch(0.90_0.14_150)]"
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

          {/* Step 1 — Task selector with center "Select Your Task" disc */}
          <StepLabel index={1} label="Select Task" />
          <TaskEnvelopeScroll
            task={task}
            onTaskChange={onTaskChange}
            isAcademic={isAcademic}
          />

          {/* Steps 2 & 3 — gated until a task is selected */}
          {task && (
            <>
              {/* Step 2 — Soft colored chips */}
              <StepLabel index={2} label="Select Category" />
              <div className="flex flex-wrap justify-center gap-2.5">
                {categories.map((c, i) => {
                  const active = categoryId === c.id;
                  const Icon = c.icon;
                  // Rotate through site palette tokens
                  const tones = [
                    { soft: "bg-brand-soft", text: "text-brand", border: "border-brand/25", activeBg: "bg-brand", activeText: "text-brand-foreground", activeBorder: "border-brand" },
                    { soft: "bg-peach",      text: "text-foreground", border: "border-[oklch(0.70_0.10_55)]/30",  activeBg: "bg-[oklch(0.70_0.13_55)]",  activeText: "text-white", activeBorder: "border-[oklch(0.70_0.13_55)]" },
                    { soft: "bg-mint",       text: "text-foreground", border: "border-[oklch(0.62_0.10_175)]/30", activeBg: "bg-[oklch(0.55_0.10_175)]", activeText: "text-white", activeBorder: "border-[oklch(0.55_0.10_175)]" },
                    { soft: "bg-lilac",      text: "text-foreground", border: "border-[oklch(0.65_0.10_295)]/30", activeBg: "bg-[oklch(0.58_0.12_295)]", activeText: "text-white", activeBorder: "border-[oklch(0.58_0.12_295)]" },
                    { soft: "bg-brand-soft", text: "text-brand", border: "border-brand/25", activeBg: "bg-brand", activeText: "text-brand-foreground", activeBorder: "border-brand" },
                    { soft: "bg-peach",      text: "text-foreground", border: "border-[oklch(0.70_0.10_55)]/30",  activeBg: "bg-[oklch(0.70_0.13_55)]",  activeText: "text-white", activeBorder: "border-[oklch(0.70_0.13_55)]" },
                    { soft: "bg-mint",       text: "text-foreground", border: "border-[oklch(0.62_0.10_175)]/30", activeBg: "bg-[oklch(0.55_0.10_175)]", activeText: "text-white", activeBorder: "border-[oklch(0.55_0.10_175)]" },
                  ];
                  const t = tones[i % tones.length];
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-[14px] font-bold tracking-tight transition-all duration-200 ${
                        active
                          ? `${t.activeBg} ${t.activeText} ${t.activeBorder} shadow-soft`
                          : `${t.soft} ${t.text} ${t.border} hover:-translate-y-0.5 hover:shadow-soft`
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                      {c.label}
                    </button>
                  );
                })}
              </div>

              {/* Step 3 — Questions list */}
              <StepLabel index={3} label={`${activeCategory.label} Questions`} />
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

              <p className="mt-12 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
                Sample questions · Model answers coming soon
              </p>
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
  const highlightBg = isAcademic
    ? "bg-[oklch(0.92_0.13_85)]"
    : "bg-[oklch(0.90_0.14_150)]";
  const accentBorder = isAcademic
    ? "border-brand/55"
    : "border-[oklch(0.55_0.10_160)]/55";
  const accentText = isAcademic ? "text-brand" : "text-[oklch(0.42_0.10_160)]";

  const renderItem = (
    active: boolean,
    onClick: () => void,
    taskNum: "Task 1" | "Task 2",
    name: string,
    align: "left" | "right",
  ) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group block bg-transparent p-2 sm:p-4 ${
        align === "left" ? "text-left" : "text-right"
      } transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-55 hover:opacity-85"
      }`}
    >
      <h3
        className={`relative inline-block font-display font-black leading-[0.95] tracking-[-0.02em] ${
          active ? "text-foreground" : "text-foreground/70"
        }`}
        style={{ fontSize: "clamp(1.5rem, 5vw, 2.75rem)" }}
      >
        <span className="relative inline-block">
          {active && (
            <span
              aria-hidden
              className={`absolute inset-x-[-6px] bottom-[8%] -z-10 h-[52%] -rotate-1 ${highlightBg} opacity-75`}
              style={{ clipPath: "polygon(1% 8%, 99% 2%, 100% 92%, 0% 98%)" }}
            />
          )}
          <span className="relative">
            {taskNum}
            <span className="text-foreground/45"> — </span>
            <span className={active ? "text-foreground/85" : "text-foreground/55"}>
              {name}
            </span>
          </span>
        </span>
      </h3>
    </button>
  );

  // Flame lean: -1 = leans left (Task 1), 0 = upright, +1 = leans right (Task 2)
  const flameDir = isT1 ? -1 : isT2 ? 1 : 0;
  const leanDeg = flameDir * 40; // L3: strong 40° lean
  const accentColor = isAcademic ? "oklch(0.58 0.17 255)" : "oklch(0.55 0.10 160)";
  void accentColor;

  const embers = [0, 1, 2, 3, 4];

  return (
    <div className="relative mx-auto max-w-3xl">
      <style>{`
        @keyframes flame-flicker-v {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          25%      { transform: scaleY(1.08) scaleX(0.94); }
          50%      { transform: scaleY(0.94) scaleX(1.06); }
          75%      { transform: scaleY(1.05) scaleX(0.97); }
        }
        @keyframes halo-pulse {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.85; transform: translate(-50%, -50%) scale(1.12); }
        }
        @keyframes wick-glow-v {
          0%, 100% { opacity: 0.65; }
          50%      { opacity: 1; }
        }
        @keyframes ember-fly {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          70%  { opacity: 0.9; }
          100% { transform: translate(var(--ember-x, 30px), var(--ember-y, -60px)) scale(0.3); opacity: 0; }
        }
        @keyframes dust-drift {
          0%   { transform: translate(0, 0); opacity: 0; }
          20%  { opacity: 0.55; }
          80%  { opacity: 0.4; }
          100% { transform: translate(var(--dust-x, 20px), var(--dust-y, -80px)); opacity: 0; }
        }
      `}</style>

      {/* 3-column layout — bronze candle in its own column */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 sm:gap-10">
        <div className="pb-8 sm:pb-12">
          {renderItem(isT1, () => onTaskChange("task1"), "Task 1", isAcademic ? "Charts" : "Letters", "right")}
        </div>

        {/* Bronze oil-lamp candle column */}
        <div
          className="relative flex flex-col items-center justify-end"
          style={{ width: "clamp(96px, 14vw, 140px)", minHeight: "320px" }}
        >
          {/* A3: WARM HALO GLOW */}
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-full blur-3xl"
            style={{
              width: "260px",
              height: "260px",
              top: "60px",
              left: "50%",
              background:
                "radial-gradient(circle, oklch(0.78 0.20 55 / 0.55) 0%, oklch(0.65 0.22 40 / 0.30) 35%, oklch(0.55 0.18 30 / 0.10) 60%, transparent 80%)",
              animation: "halo-pulse 3.2s ease-in-out infinite",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* A3: DUST MOTES */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              { x: 18, y: -90, d: "0s", sz: 1.5, lx: 28 },
              { x: -14, y: -110, d: "1.2s", sz: 1, lx: 60 },
              { x: 22, y: -70, d: "2.1s", sz: 1.2, lx: 45 },
              { x: -20, y: -95, d: "3.4s", sz: 0.8, lx: 35 },
              { x: 12, y: -130, d: "4.5s", sz: 1.4, lx: 70 },
              { x: -8, y: -80, d: "5.8s", sz: 1, lx: 20 },
            ].map((m, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${m.sz * 2}px`,
                  height: `${m.sz * 2}px`,
                  left: `${m.lx}%`,
                  top: "60%",
                  background: "oklch(0.95 0.08 80 / 0.85)",
                  boxShadow: "0 0 4px oklch(0.92 0.12 75 / 0.7)",
                  ["--dust-x" as never]: `${m.x}px`,
                  ["--dust-y" as never]: `${m.y}px`,
                  animation: `dust-drift 7s ease-out ${m.d} infinite`,
                }}
              />
            ))}
          </div>

          {/* L3: FLYING EMBERS in lean direction */}
          {flameDir !== 0 && (
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={{ top: "30px", left: "50%", width: 0, height: 0 }}
            >
              {embers.map((i) => {
                const baseX = flameDir * (20 + i * 10);
                const baseY = -30 - i * 14;
                return (
                  <span
                    key={`${flameDir}-${i}`}
                    className="absolute block rounded-full"
                    style={{
                      width: "3px",
                      height: "3px",
                      background: "oklch(0.88 0.22 55)",
                      boxShadow: "0 0 6px oklch(0.85 0.22 50), 0 0 12px oklch(0.75 0.22 40 / 0.6)",
                      ["--ember-x" as never]: `${baseX}px`,
                      ["--ember-y" as never]: `${baseY}px`,
                      animation: `ember-fly ${1.4 + i * 0.3}s ease-out ${i * 0.4}s infinite`,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Flame — leans 40° toward selection */}
          <div
            className="relative z-10"
            style={{
              width: "36px",
              height: "62px",
              transformOrigin: "50% 100%",
              transform: `rotate(${leanDeg}deg)`,
              transition: "transform 900ms cubic-bezier(0.34, 1.4, 0.64, 1)",
            }}
            aria-hidden
          >
            <svg
              viewBox="0 0 32 56"
              className="absolute inset-0 h-full w-full drop-shadow-[0_0_10px_oklch(0.78_0.22_55_/_0.7)]"
              style={{
                transformOrigin: "50% 100%",
                animation: "flame-flicker-v 220ms ease-in-out infinite",
              }}
            >
              <defs>
                <radialGradient id="flameOuterV" cx="50%" cy="78%" r="55%">
                  <stop offset="0%" stopColor="oklch(0.94 0.18 80)" />
                  <stop offset="40%" stopColor="oklch(0.78 0.22 55)" />
                  <stop offset="80%" stopColor="oklch(0.62 0.22 38)" />
                  <stop offset="100%" stopColor="oklch(0.50 0.20 30 / 0)" />
                </radialGradient>
                <radialGradient id="flameInnerV" cx="50%" cy="80%" r="40%">
                  <stop offset="0%" stopColor="oklch(0.98 0.10 95)" />
                  <stop offset="60%" stopColor="oklch(0.88 0.18 80)" />
                  <stop offset="100%" stopColor="oklch(0.78 0.20 60 / 0)" />
                </radialGradient>
                <radialGradient id="flameCoreV" cx="50%" cy="88%" r="22%">
                  <stop offset="0%" stopColor="oklch(0.55 0.18 250)" />
                  <stop offset="100%" stopColor="oklch(0.55 0.18 250 / 0)" />
                </radialGradient>
              </defs>
              <path
                d="M 16 2 C 25 16, 29 30, 27 42 C 25 52, 20 55, 16 55 C 12 55, 7 52, 5 42 C 3 30, 7 16, 16 2 Z"
                fill="url(#flameOuterV)"
              />
              <path
                d="M 16 12 C 22 22, 24 34, 22 42 C 21 49, 18 52, 16 52 C 14 52, 11 49, 10 42 C 8 34, 10 22, 16 12 Z"
                fill="url(#flameInnerV)"
              />
              <ellipse cx="16" cy="48" rx="5" ry="7" fill="url(#flameCoreV)" />
            </svg>
          </div>

          {/* Wick */}
          <div
            className="relative z-10 -mt-1 h-3 w-[2.5px] rounded-full"
            style={{
              background: "linear-gradient(180deg, oklch(0.18 0.04 40) 0%, oklch(0.32 0.06 40) 100%)",
            }}
          >
            <span
              aria-hidden
              className="absolute inset-x-[-1px] top-0 h-1 rounded-full"
              style={{
                background: "oklch(0.88 0.20 55)",
                boxShadow: "0 0 8px oklch(0.85 0.20 55)",
                animation: "wick-glow-v 1.2s ease-in-out infinite",
              }}
            />
          </div>

          {/* V3: Beeswax pillar */}
          <div
            className="relative z-10 w-[78%] overflow-hidden"
            style={{
              height: "clamp(90px, 13vw, 130px)",
              borderRadius: "10px 10px 4px 4px",
              background:
                "linear-gradient(180deg, oklch(0.92 0.13 82) 0%, oklch(0.85 0.16 75) 25%, oklch(0.76 0.17 68) 65%, oklch(0.68 0.16 60) 100%)",
              boxShadow:
                "inset 4px 0 8px oklch(0.40 0.10 50 / 0.25), inset -4px 0 8px oklch(1 0 0 / 0.25), 0 4px 12px oklch(0.35 0.08 50 / 0.3)",
            }}
          >
            <div
              aria-hidden
              className="absolute left-0 right-0 top-0 h-2"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 100%, oklch(0.95 0.10 80) 0%, oklch(0.80 0.14 70) 60%, oklch(0.65 0.14 60) 100%)",
                borderRadius: "10px 10px 0 0",
              }}
            />
            <div
              aria-hidden
              className="absolute top-1 bottom-2 w-[18%] rounded-full opacity-70 blur-[2px]"
              style={{
                left: flameDir > 0 ? "auto" : "16%",
                right: flameDir > 0 ? "16%" : "auto",
                background:
                  "linear-gradient(180deg, oklch(1 0 0 / 0.85) 0%, oklch(0.98 0.05 80 / 0.3) 70%, transparent 100%)",
                transition: "left 700ms ease, right 700ms ease",
              }}
            />
            <div
              aria-hidden
              className="absolute top-3 w-[10px]"
              style={{
                height: "60%",
                [flameDir > 0 ? "left" : "right"]: "10%",
                background:
                  "radial-gradient(ellipse at 50% 0%, oklch(0.92 0.13 80) 0%, oklch(0.78 0.16 68) 60%, transparent 100%)",
                borderRadius: "999px",
                opacity: 0.85,
                transition: "all 700ms ease",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-y-0 w-[40%]"
              style={{
                right: flameDir > 0 ? "0" : "auto",
                left: flameDir > 0 ? "auto" : "0",
                background:
                  "linear-gradient(90deg, oklch(0.40 0.08 50 / 0.30) 0%, transparent 100%)",
                transition: "all 700ms ease",
              }}
            />
          </div>

          {/* V3: Squat bronze base with engraved rim */}
          <div className="relative z-10 -mt-1 flex w-full flex-col items-center">
            <div
              className="relative w-[115%] rounded-t-md"
              style={{
                height: "6px",
                background:
                  "linear-gradient(180deg, oklch(0.72 0.10 55) 0%, oklch(0.58 0.10 50) 50%, oklch(0.42 0.08 45) 100%)",
                boxShadow:
                  "inset 0 1px 0 oklch(0.92 0.10 65), inset 0 -1px 0 oklch(0.30 0.06 40)",
              }}
            >
              <div
                className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
                style={{ background: "oklch(0.30 0.05 40 / 0.6)" }}
              />
            </div>
            <div
              className="relative w-[145%]"
              style={{
                height: "26px",
                background:
                  "linear-gradient(180deg, oklch(0.62 0.11 55) 0%, oklch(0.48 0.10 50) 40%, oklch(0.35 0.08 45) 75%, oklch(0.55 0.10 55) 100%)",
                borderRadius: "4px 4px 50% 50% / 4px 4px 30% 30%",
                boxShadow:
                  "inset 6px 0 8px oklch(0.25 0.05 40 / 0.5), inset -6px 0 8px oklch(0.92 0.10 65 / 0.4), 0 8px 16px oklch(0.20 0.05 40 / 0.4)",
              }}
            >
              <div
                className="absolute left-[8%] right-[8%] top-[35%] h-[2px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, oklch(0.25 0.05 40 / 0.7) 20%, oklch(0.25 0.05 40 / 0.7) 80%, transparent 100%)",
                  boxShadow: "0 1px 0 oklch(0.85 0.10 65 / 0.5)",
                }}
              />
              <div
                className="absolute left-[20%] top-[15%] h-[3px] w-[25%] rounded-full opacity-70 blur-[1px]"
                style={{ background: "oklch(0.95 0.10 70)" }}
              />
            </div>
            <div
              className="w-[120%]"
              style={{
                height: "4px",
                background:
                  "linear-gradient(180deg, oklch(0.40 0.08 45) 0%, oklch(0.28 0.06 40) 100%)",
                borderRadius: "0 0 6px 6px",
                boxShadow: "0 2px 6px oklch(0.20 0.05 40 / 0.5)",
              }}
            />
          </div>

          {noSelection && (
            <span
              className={`relative z-10 mt-3 font-display text-[9px] font-black uppercase tracking-[0.18em] sm:text-[10px] ${accentText}`}
            >
              Pick a Task
            </span>
          )}
        </div>

        <div className="pb-8 sm:pb-12">
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
