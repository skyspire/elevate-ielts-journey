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

const categoriesByModuleTask: Record<Module, Record<Task, Category[]>> = {
  general: {
    task1: [
      { id: "formal", label: "Formal Letters", hint: "To officials, managers, companies", icon: Mail },
      { id: "informal", label: "Informal Letters", hint: "To friends & family", icon: MessageSquare },
    ],
    task2: [
      { id: "opinion", label: "Opinion Essays", hint: "Agree / disagree prompts", icon: Lightbulb },
      { id: "discussion", label: "Discussion Essays", hint: "Discuss both views", icon: Scale },
      { id: "problem", label: "Problem & Solution", hint: "Causes, effects, solutions", icon: HelpCircle },
    ],
  },
  academic: {
    task1: [
      { id: "graphs", label: "Graphs & Charts", hint: "Bar, line, pie, table", icon: BarChart3 },
      { id: "process", label: "Processes & Maps", hint: "Diagrams & map changes", icon: FileText },
    ],
    task2: [
      { id: "opinion", label: "Opinion Essays", hint: "Agree / disagree prompts", icon: Lightbulb },
      { id: "discussion", label: "Discussion Essays", hint: "Discuss both views", icon: Scale },
      { id: "problem", label: "Problem & Solution", hint: "Causes, effects, solutions", icon: HelpCircle },
    ],
  },
};

// ───────── Placeholder questions ─────────
type Tone = "blue" | "mint" | "peach" | "lilac";
type Question = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tone: Tone;
};

const TONES: Tone[] = ["blue", "mint", "peach", "lilac"];

const makeQuestions = (label: string): Question[] =>
  Array.from({ length: 8 }).map((_, i) => ({
    id: `${label}-${i + 1}`,
    title: `${label} — Sample Question ${i + 1}`,
    topic: ["Work", "Education", "Society", "Environment", "Technology", "Health", "Travel", "Lifestyle"][i],
    difficulty: (["Easy", "Medium", "Hard"] as const)[i % 3],
    tone: TONES[i % TONES.length],
  }));

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
  const questions = makeQuestions(activeCategory.label);

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

          {/* Module switcher — Premium rotary dial */}
          <div className="mt-10 flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center gap-3 sm:gap-6">
              {/* Academic label (left) */}
              <button
                type="button"
                onClick={() => navigate({ to: "/writing-samples", search: { module: "academic" } })}
                aria-pressed={isAcademic}
                className={`group flex flex-col items-end text-right transition-all duration-300 ${
                  isAcademic ? "scale-110" : "scale-95 opacity-45 hover:opacity-75"
                }`}
              >
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-[0.22em] transition-colors ${
                    isAcademic ? "text-brand" : "text-foreground/40"
                  }`}
                >
                  Module
                </span>
                <span
                  className={`font-display text-2xl font-black tracking-tight sm:text-4xl md:text-5xl ${
                    isAcademic ? "text-foreground" : "text-foreground/55"
                  }`}
                >
                  Academic
                </span>
              </button>

              {/* The Dial — Big & Premium */}
              <div className="relative shrink-0">
                {/* Pulsing glow halo */}
                <div
                  aria-hidden
                  className={`absolute inset-0 -m-4 rounded-full blur-2xl transition-all duration-700 ${
                    isAcademic
                      ? "bg-[oklch(0.55_0.16_265)]/40"
                      : "bg-[oklch(0.55_0.10_160)]/40"
                  }`}
                />

                {/* Outer bezel — dark metallic ring */}
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-foreground/[0.18] via-foreground/[0.08] to-foreground/[0.18] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4),inset_0_2px_3px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.15)] sm:h-40 sm:w-40">
                  {/* Bezel marker labels & ticks */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full"
                    fill="none"
                  >
                    {/* Tick marks */}
                    {Array.from({ length: 24 }).map((_, i) => {
                      const angle = ((i * 15 - 90) * Math.PI) / 180;
                      const isMajor = i % 6 === 0;
                      const inner = isMajor ? 38 : 41;
                      const x1 = 50 + Math.cos(angle) * inner;
                      const y1 = 50 + Math.sin(angle) * inner;
                      const x2 = 50 + Math.cos(angle) * 45;
                      const y2 = 50 + Math.sin(angle) * 45;
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="currentColor"
                          strokeWidth={isMajor ? 2 : 1}
                          strokeLinecap="round"
                          className={isMajor ? "text-foreground/55" : "text-foreground/25"}
                        />
                      );
                    })}

                    {/* Active position highlight arc — left for Academic, right for General */}
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      stroke={isAcademic ? "oklch(0.55 0.16 265)" : "oklch(0.55 0.10 160)"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={isAcademic ? "30 246" : "30 246"}
                      strokeDashoffset={isAcademic ? "62" : "192"}
                      className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                      fill="none"
                    />
                  </svg>

                  {/* Inner knob — rotates */}
                  <div
                    className={`relative flex h-[72%] w-[72%] items-center justify-center rounded-full bg-gradient-to-br from-white via-white to-foreground/[0.04] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      isAcademic ? "-rotate-[60deg]" : "rotate-[60deg]"
                    }`}
                    style={{
                      boxShadow: isAcademic
                        ? "0 0 0 4px oklch(0.55 0.16 265 / 0.18), 0 8px 24px -4px oklch(0.55 0.16 265 / 0.45), inset 0 -3px 6px rgba(0,0,0,0.1), inset 0 3px 6px rgba(255,255,255,0.9)"
                        : "0 0 0 4px oklch(0.55 0.10 160 / 0.18), 0 8px 24px -4px oklch(0.55 0.10 160 / 0.45), inset 0 -3px 6px rgba(0,0,0,0.1), inset 0 3px 6px rgba(255,255,255,0.9)",
                    }}
                  >
                    {/* Long pointer arrow */}
                    <div className="absolute top-1.5 flex flex-col items-center">
                      <div
                        className={`h-0 w-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent ${
                          isAcademic
                            ? "border-b-brand"
                            : "border-b-[oklch(0.55_0.10_160)]"
                        }`}
                      />
                      <div
                        className={`h-5 w-1.5 rounded-b-full ${
                          isAcademic ? "bg-brand" : "bg-[oklch(0.55_0.10_160)]"
                        }`}
                      />
                    </div>

                    {/* Knurled grip lines around knob center */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span
                        key={i}
                        aria-hidden
                        className="absolute h-2 w-0.5 rounded-full bg-foreground/15"
                        style={{
                          transform: `rotate(${i * 45}deg) translateY(-22px)`,
                        }}
                      />
                    ))}

                    {/* Center hub */}
                    <div
                      className={`relative flex h-7 w-7 items-center justify-center rounded-full shadow-inner ${
                        isAcademic
                          ? "bg-gradient-to-br from-brand to-[oklch(0.42_0.16_265)]"
                          : "bg-gradient-to-br from-[oklch(0.55_0.10_160)] to-[oklch(0.38_0.10_160)]"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* General label (right) */}
              <button
                type="button"
                onClick={() => navigate({ to: "/writing-samples", search: { module: "general" } })}
                aria-pressed={!isAcademic}
                className={`group flex flex-col items-start text-left transition-all duration-300 ${
                  !isAcademic ? "scale-110" : "scale-95 opacity-45 hover:opacity-75"
                }`}
              >
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-[0.22em] transition-colors ${
                    !isAcademic ? "text-[oklch(0.42_0.10_160)]" : "text-foreground/40"
                  }`}
                >
                  Module
                </span>
                <span
                  className={`font-display text-lg font-extrabold tracking-tight sm:text-2xl ${
                    !isAcademic ? "text-foreground" : "text-foreground/55"
                  }`}
                >
                  General
                </span>
              </button>
            </div>

            {/* Helper text */}
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

          {/* Step 2 — Category pill toggle */}
          <StepLabel index={2} label="Select Category" />
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center rounded-full border border-foreground/10 bg-white p-1.5 shadow-soft">
              {categories.map((c) => {
                const active = categoryId === c.id;
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold tracking-tight transition-all ${
                      active
                        ? `${accentBg} text-white shadow-soft`
                        : "text-foreground/55 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2.4} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 — Questions list */}
          <StepLabel index={3} label={`${activeCategory.label} Questions`} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {questions.map((q) => (
              <QuestionRowCard
                key={q.id}
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
  module,
  task,
  category,
}: {
  q: Question;
  module: Module;
  task: Task;
  category: string;
}) {
  const typeLabel = task === "task1" ? "Writing Task 1" : "Writing Task 2";
  const locked = true;
  const band = "Band 8.5";
  const date = "April 2026";

  return (
    <Link
      to="/writing-samples/$questionId"
      params={{ questionId: q.id }}
      search={{ module, task, category, title: q.title, topic: q.topic, difficulty: q.difficulty }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      {/* Tag banner — full-width, prominent */}
      <div className={`flex items-center justify-between px-5 py-3.5 ${toneMap[q.tone]}`}>
        <span className="text-sm font-extrabold uppercase tracking-wide">{q.topic}</span>
        <span className="rounded-full bg-background/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
          {typeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-xl font-extrabold leading-snug tracking-tight text-foreground">
          {q.title}
        </h3>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {date}
            <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-secondary-foreground">
              {band}
            </span>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-all group-hover:bg-brand group-hover:text-brand-foreground">
            {locked ? <Lock className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-4 w-4" />}
          </span>
        </div>

        {locked && (
          <p className="-mb-1 text-[11px] font-semibold text-muted-foreground/80">
            Sign up to read · free sample
          </p>
        )}
      </div>
    </Link>
  );
}
