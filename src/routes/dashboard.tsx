import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PenLine,
  Mic,
  BookOpen,
  FileText,
  Sparkles,
  AlertTriangle,
  CalendarDays,
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

type Module = "academic" | "general";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BandPath" },
      {
        name: "description",
        content:
          "Your IELTS preparation dashboard. Switch between Academic and General modules and access samples, vocabulary, templates, predictions and more.",
      },
      { property: "og:title", content: "Dashboard — BandPath" },
      {
        property: "og:description",
        content:
          "Switch between IELTS Academic and General. Samples, vocabulary, templates, predictions and study plans in one place.",
      },
    ],
  }),
  component: DashboardPage,
});

type Feature = {
  key: string;
  title: string;
  description: { academic: string; general: string };
  count: { academic: string; general: string };
  icon: typeof PenLine;
  tone: "blue" | "mint" | "peach" | "lilac" | "kraft";
};

const features: Feature[] = [
  {
    key: "writing",
    title: "IELTS Writing Samples",
    description: {
      academic: "Task 1 reports & Task 2 essays with Band 8+ model answers.",
      general: "Letter writing & Task 2 essays with Band 8+ model answers.",
    },
    count: { academic: "240+ samples", general: "180+ samples" },
    icon: PenLine,
    tone: "blue",
  },
  {
    key: "speaking",
    title: "IELTS Speaking Samples",
    description: {
      academic: "Part 1, 2 & 3 model answers with examiner-style follow-ups.",
      general: "Part 1, 2 & 3 model answers focused on everyday topics.",
    },
    count: { academic: "320+ recordings", general: "260+ recordings" },
    icon: Mic,
    tone: "peach",
  },
  {
    key: "vocab",
    title: "Vocabulary Builder",
    description: {
      academic: "Topic-wise academic lexis, collocations & paraphrasing drills.",
      general: "High-frequency everyday vocabulary with usage examples.",
    },
    count: { academic: "1,800+ words", general: "1,200+ words" },
    icon: BookOpen,
    tone: "mint",
  },
  {
    key: "templates",
    title: "Band 8+ Templates",
    description: {
      academic: "Reusable structures for graphs, processes and essays.",
      general: "Letter formats, opinion essays and discussion templates.",
    },
    count: { academic: "60+ templates", general: "45+ templates" },
    icon: FileText,
    tone: "lilac",
  },
  {
    key: "predictions",
    title: "Prediction Questions",
    description: {
      academic: "Most likely Writing & Speaking topics for the next exam.",
      general: "High-probability questions for upcoming General tests.",
    },
    count: { academic: "Updated weekly", general: "Updated weekly" },
    icon: Sparkles,
    tone: "blue",
  },
  {
    key: "mistakes",
    title: "Common Mistakes Analysis",
    description: {
      academic: "Grammar, lexical and coherence errors that hurt your band.",
      general: "Frequent errors test-takers make in letters and essays.",
    },
    count: { academic: "120+ patterns", general: "90+ patterns" },
    icon: AlertTriangle,
    tone: "peach",
  },
  {
    key: "plan",
    title: "Study Plan",
    description: {
      academic: "Personalized 4–8 week roadmap to your target band.",
      general: "Structured weekly plan tailored to your timeline.",
    },
    count: { academic: "4 / 6 / 8 weeks", general: "4 / 6 / 8 weeks" },
    icon: CalendarDays,
    tone: "kraft",
  },
];

function DashboardPage() {
  const [module, setModule] = useState<Module>("academic");
  const isAcademic = module === "academic";

  // Module accent: Academic = brand blue, General = warm amber/terracotta
  const accent = isAcademic
    ? {
        ring: "ring-brand",
        bg: "bg-brand",
        bgSoft: "bg-brand-soft",
        text: "text-brand",
        border: "border-brand/30",
        chipBg: "bg-brand-soft",
        chipText: "text-brand",
        gradient:
          "bg-[linear-gradient(135deg,oklch(0.97_0.025_250)_0%,oklch(0.94_0.05_255)_100%)]",
      }
    : {
        ring: "ring-[oklch(0.7_0.14_55)]",
        bg: "bg-[oklch(0.68_0.16_55)]",
        bgSoft: "bg-[oklch(0.94_0.06_55)]",
        text: "text-[oklch(0.55_0.16_50)]",
        border: "border-[oklch(0.7_0.14_55)]/30",
        chipBg: "bg-[oklch(0.94_0.06_55)]",
        chipText: "text-[oklch(0.45_0.15_45)]",
        gradient:
          "bg-[linear-gradient(135deg,oklch(0.97_0.03_70)_0%,oklch(0.94_0.06_55)_100%)]",
      };

  return (
    <div className="min-h-screen bg-paper-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-background/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              BandPath
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-[11px] font-semibold text-foreground/70 sm:inline-flex">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
              Active subscription
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-[13px] font-bold text-background">
              U
            </span>
          </div>
        </div>
      </header>

      <main className="container-page py-10 sm:py-14">
        {/* Hero / module summary */}
        <section className="mx-auto max-w-5xl">
          <div
            className={`flex items-center gap-2 rounded-full border ${accent.border} ${accent.chipBg} ${accent.chipText} w-fit px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${accent.bg}`} />
            {isAcademic ? "IELTS Academic" : "IELTS General Training"}
          </div>

          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Welcome back.
            <br className="hidden sm:block" />
            <span className="text-foreground/60">
              Continue your {isAcademic ? "Academic" : "General"} preparation.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-foreground/65 sm:text-lg">
            Everything you need is below. Switch between modules anytime — your
            samples, vocabulary, templates and predictions will adapt to the
            module you're preparing for.
          </p>

          {/* Module toggle */}
          <ModuleToggle module={module} setModule={setModule} />
        </section>

        {/* Feature cards */}
        <section className="mx-auto mt-14 max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Your toolkit
              </h2>
              <p className="mt-1 text-sm font-medium text-foreground/60">
                Tap any tool to start practicing.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard
                key={f.key}
                feature={f}
                module={module}
                accent={accent}
              />
            ))}
          </div>
        </section>

        <p className="mx-auto mt-14 max-w-6xl text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
          More tools coming soon · Your access never expires during your plan
        </p>
      </main>
    </div>
  );
}

function ModuleToggle({
  module,
  setModule,
}: {
  module: Module;
  setModule: (m: Module) => void;
}) {
  return (
    <div className="mt-9 inline-flex w-full max-w-md items-center rounded-full border border-foreground/10 bg-white p-1.5 shadow-soft sm:w-auto">
      {(
        [
          { id: "academic" as const, label: "Academic" },
          { id: "general" as const, label: "General Training" },
        ]
      ).map((opt) => {
        const active = module === opt.id;
        const isAcademicOpt = opt.id === "academic";
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setModule(opt.id)}
            aria-pressed={active}
            className={`relative flex-1 rounded-full px-5 py-2.5 text-sm font-bold tracking-tight transition-all sm:px-7 ${
              active
                ? isAcademicOpt
                  ? "bg-brand text-brand-foreground shadow-soft"
                  : "bg-[oklch(0.68_0.16_55)] text-white shadow-soft"
                : "text-foreground/55 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function FeatureCard({
  feature,
  module,
  accent,
}: {
  feature: Feature;
  module: Module;
  accent: {
    ring: string;
    bg: string;
    bgSoft: string;
    text: string;
    border: string;
    chipBg: string;
    chipText: string;
    gradient: string;
  };
}) {
  const Icon = feature.icon;
  return (
    <button
      type="button"
      className="group relative flex flex-col items-start rounded-3xl border border-foreground/8 bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-card sm:p-7"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft} ${accent.text} transition-transform group-hover:scale-105`}
      >
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </div>

      <h3 className="mt-5 font-display text-lg font-extrabold tracking-tight text-foreground">
        {feature.title}
      </h3>
      <p className="mt-2 text-[14px] font-medium leading-relaxed text-foreground/65">
        {feature.description[module]}
      </p>

      <div className="mt-5 flex w-full items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-foreground/45">
          {feature.count[module]}
        </span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${accent.bgSoft} ${accent.text} transition-transform group-hover:translate-x-0.5`}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </div>
    </button>
  );
}
