import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  ArrowLeft,
  PenLine,
  FileText,
  Mail,
  BookOpen,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Scale,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
});

export const Route = createFileRoute("/dashboard/writing-samples")({
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
type Question = { id: string; title: string; topic: string; difficulty: "Easy" | "Medium" | "Hard" };

const makeQuestions = (label: string): Question[] =>
  Array.from({ length: 8 }).map((_, i) => ({
    id: `${label}-${i + 1}`,
    title: `${label} — Sample Question ${i + 1}`,
    topic: ["Work", "Education", "Society", "Environment", "Technology", "Health", "Travel", "Lifestyle"][i],
    difficulty: (["Easy", "Medium", "Hard"] as const)[i % 3],
  }));

function WritingSamplesPage() {
  const { module } = Route.useSearch();
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
          {/* Breadcrumb / module pill */}
          <div className="flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
            <Link to="/dashboard" className="hover:text-foreground/80">Dashboard</Link>
            <span>/</span>
            <span className={accentText}>Writing Samples</span>
          </div>

          {/* Hero */}
          <div className="mt-5 text-center">
            <div className={`mx-auto inline-flex items-center gap-2 rounded-full border ${accentChip} px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em]`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accentBg}`} />
              IELTS {isAcademic ? "Academic" : "General Training"}
            </div>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
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
          <div className="grid gap-3 sm:grid-cols-2">
            {questions.map((q) => (
              <QuestionRowCard key={q.id} q={q} accentText={accentText} />
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

function QuestionRowCard({ q, accentText }: { q: Question; accentText: string }) {
  const diffTone =
    q.difficulty === "Easy"
      ? "bg-[oklch(0.94_0.05_160)] text-[oklch(0.38_0.10_160)]"
      : q.difficulty === "Medium"
      ? "bg-[oklch(0.95_0.05_85)] text-[oklch(0.42_0.11_75)]"
      : "bg-[oklch(0.94_0.05_30)] text-[oklch(0.42_0.13_40)]";

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground/60">
          <BookOpen className="h-4 w-4" strokeWidth={2.4} />
        </span>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ${diffTone}`}>
          {q.difficulty}
        </span>
      </div>
      <h4 className="font-display text-[15px] font-extrabold leading-snug tracking-tight text-foreground">
        {q.title}
      </h4>
      <div className="mt-auto flex items-center justify-between border-t border-foreground/10 pt-3">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
          {q.topic}
        </span>
        <span className={`text-[11px] font-extrabold uppercase tracking-[0.2em] ${accentText}`}>
          Sample
        </span>
      </div>
    </div>
  );
}
