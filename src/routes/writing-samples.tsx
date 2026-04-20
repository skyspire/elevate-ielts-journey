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

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
});

export const Route = createFileRoute("/writing-samples")({
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
  const [task, setTask] = useState<Task>("task1");
  const categories = categoriesByModuleTask[module][task];
  const [categoryId, setCategoryId] = useState<string>(categories[0].id);

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

          {/* Step 1 — Task selector (large card-style toggle) */}
          <StepLabel index={1} label="Select Task" />
          <div className="grid gap-4 sm:grid-cols-2">
            <TaskCard
              active={task === "task1"}
              onClick={() => onTaskChange("task1")}
              icon={isAcademic ? BarChart3 : Mail}
              title="Task 1"
              subtitle={isAcademic ? "Graphs, charts, processes & maps (150 words)" : "Letter writing — formal & informal (150 words)"}
              accentRing={accentRing}
              accentText={accentText}
              accentBg={accentBg}
            />
            <TaskCard
              active={task === "task2"}
              onClick={() => onTaskChange("task2")}
              icon={PenLine}
              title="Task 2"
              subtitle="Essay writing — opinion, discussion & more (250 words)"
              accentRing={accentRing}
              accentText={accentText}
              accentBg={accentBg}
            />
          </div>

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
        </div>
      </main>
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

const toneMap: Record<Tone, string> = {
  blue: "bg-brand-soft text-brand",
  mint: "bg-mint text-foreground",
  peach: "bg-peach text-foreground",
  lilac: "bg-lilac text-foreground",
};

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

      {/* Right column — question statement */}
      <div className="flex min-w-0 flex-1 items-center px-5 py-6 sm:px-6">
        <p className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground sm:text-base">
          {q.title}
        </p>
      </div>
    </Link>
  );
}
