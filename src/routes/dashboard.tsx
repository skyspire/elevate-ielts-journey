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
};

const features: Feature[] = [
  {
    key: "writing",
    title: "Writing Samples",
    description: {
      academic: "Task 1 reports & Task 2 essays with Band 8+ model answers.",
      general: "Letter writing & Task 2 essays with Band 8+ model answers.",
    },
    count: { academic: "240+ samples", general: "180+ samples" },
    icon: PenLine,
  },
  {
    key: "speaking",
    title: "Speaking Samples",
    description: {
      academic: "Part 1, 2 & 3 model answers with examiner-style follow-ups.",
      general: "Part 1, 2 & 3 model answers focused on everyday topics.",
    },
    count: { academic: "320+ recordings", general: "260+ recordings" },
    icon: Mic,
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
  },
  {
    key: "mistakes",
    title: "Common Mistakes",
    description: {
      academic: "Grammar, lexical and coherence errors that hurt your band.",
      general: "Frequent errors test-takers make in letters and essays.",
    },
    count: { academic: "120+ patterns", general: "90+ patterns" },
    icon: AlertTriangle,
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
  },
];

// Sage = oklch(0.62 0.10 160). Softs/tints derived from the same hue.
const sage = {
  ring: "ring-[oklch(0.62_0.10_160)]",
  bg: "bg-[oklch(0.62_0.10_160)]",
  bgSoft: "bg-[oklch(0.94_0.04_160)]",
  text: "text-[oklch(0.42_0.10_160)]",
  border: "border-[oklch(0.62_0.10_160)]/30",
  chipBg: "bg-[oklch(0.94_0.04_160)]",
  chipText: "text-[oklch(0.38_0.10_160)]",
  toggleActive: "bg-[oklch(0.55_0.10_160)] text-white shadow-soft",
};

const blue = {
  ring: "ring-brand",
  bg: "bg-brand",
  bgSoft: "bg-brand-soft",
  text: "text-brand",
  border: "border-brand/30",
  chipBg: "bg-brand-soft",
  chipText: "text-brand",
  toggleActive: "bg-brand text-brand-foreground shadow-soft",
};

function DashboardPage() {
  const [module, setModule] = useState<Module>("academic");
  const isAcademic = module === "academic";
  const accent = isAcademic ? blue : sage;

  return (
    <div className="min-h-screen bg-paper-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-paper-cream/85 backdrop-blur-xl">
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

      <main className="relative py-12 sm:py-16">
        {/* Subtle ruled-paper accent in the background, only behind the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-paper-ruled opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        {/* Centered content column */}
        <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-6">
          {/* Module pill */}
          <div className="flex justify-center">
            <div
              className={`inline-flex items-center gap-2 rounded-full border ${accent.border} ${accent.chipBg} ${accent.chipText} px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em]`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${accent.bg}`} />
              {isAcademic ? "IELTS Academic" : "IELTS General Training"}
            </div>
          </div>

          {/* Hero */}
          <div className="mt-6 text-center">
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Welcome back.
              <br />
              <span className="text-foreground/55">
                Your {isAcademic ? "Academic" : "General"} desk awaits.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium leading-relaxed text-foreground/65 sm:text-base">
              Switch modules anytime — your samples, vocabulary, templates and
              predictions adapt to whichever test you're preparing for.
            </p>
          </div>

          {/* Toggle */}
          <div className="mt-8 flex justify-center">
            <ModuleToggle module={module} setModule={setModule} />
          </div>

          {/* Section label */}
          <div className="mt-14 mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-foreground/15" />
            <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-foreground/50">
              Your Toolkit
            </span>
            <span className="h-px w-10 bg-foreground/15" />
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <FeatureCard
                key={f.key}
                feature={f}
                module={module}
                accent={accent}
              />
            ))}
          </div>

          <p className="mt-12 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
            More tools coming soon · Access never expires during your plan
          </p>
        </div>
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
    <div className="inline-flex items-center rounded-full border border-foreground/10 bg-white p-1.5 shadow-soft">
      {[
        { id: "academic" as const, label: "Academic", accent: blue },
        { id: "general" as const, label: "General", accent: sage },
      ].map((opt) => {
        const active = module === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setModule(opt.id)}
            aria-pressed={active}
            className={`relative rounded-full px-6 py-2.5 text-sm font-bold tracking-tight transition-all sm:px-8 ${
              active ? opt.accent.toggleActive : "text-foreground/55 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

type Accent = typeof blue;

function FeatureCard({
  feature,
  module,
  accent,
}: {
  feature: Feature;
  module: Module;
  accent: Accent;
}) {
  const Icon = feature.icon;
  return (
    <button
      type="button"
      className="group relative flex flex-col items-start overflow-hidden rounded-2xl border border-foreground/10 bg-paper-cream p-6 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-card"
    >
      {/* paper texture overlay (very subtle) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(oklch(0.4_0.05_60_/_0.06)_1px,transparent_1px)] [background-size:3px_3px]"
      />
      {/* warm top edge highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
      />

      <div className="relative flex w-full items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.bgSoft} ${accent.text} transition-transform group-hover:scale-105`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </div>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-foreground/40 ring-1 ring-foreground/10 transition-all group-hover:bg-foreground group-hover:text-background group-hover:ring-foreground`}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
      </div>

      <h3 className="relative mt-5 font-display text-lg font-extrabold tracking-tight text-foreground">
        {feature.title}
      </h3>
      <p className="relative mt-1.5 text-[13.5px] font-medium leading-relaxed text-foreground/65">
        {feature.description[module]}
      </p>

      <div className="relative mt-5 w-full border-t border-dashed border-foreground/15 pt-3">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/45">
          {feature.count[module]}
        </span>
      </div>
    </button>
  );
}
