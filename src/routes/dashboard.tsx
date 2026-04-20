import { useState, type ComponentType } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
  PenLine,
  Mic,
  BookOpen,
  FileText,
  Sparkles,
  AlertTriangle,
  CalendarDays,
  type LucideProps,
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
  // count is split: numeric headline + small unit label
  count: {
    academic: { value: string; label: string };
    general: { value: string; label: string };
  };
  // tone for the card tint (independent of module accent)
  tone: "blue" | "sage" | "lilac" | "peach" | "mint" | "kraft" | "rose";
  // Lucide icon used for the glossy 3D mark in the corner
  icon: ComponentType<LucideProps>;
};

const features: Feature[] = [
  {
    key: "writing",
    title: "Writing Samples",
    description: {
      academic: "Task 1 reports & Task 2 essays with Band 8+ model answers.",
      general: "Letter writing & Task 2 essays with Band 8+ model answers.",
    },
    count: {
      academic: { value: "240+", label: "model essays" },
      general: { value: "180+", label: "model letters & essays" },
    },
    tone: "blue",
    icon: PenLine,
  },
  {
    key: "speaking",
    title: "Speaking Samples",
    description: {
      academic: "Part 1, 2 & 3 model answers with examiner-style follow-ups.",
      general: "Part 1, 2 & 3 model answers focused on everyday topics.",
    },
    count: {
      academic: { value: "320+", label: "recorded answers" },
      general: { value: "260+", label: "recorded answers" },
    },
    tone: "peach",
    icon: Mic,
  },
  {
    key: "vocab",
    title: "Vocabulary Builder",
    description: {
      academic: "Topic-wise academic lexis, collocations & paraphrasing drills.",
      general: "High-frequency everyday vocabulary with usage examples.",
    },
    count: {
      academic: { value: "1,800+", label: "words & collocations" },
      general: { value: "1,200+", label: "everyday words" },
    },
    tone: "sage",
    icon: BookOpen,
  },
  {
    key: "templates",
    title: "Band 8+ Templates",
    description: {
      academic: "Reusable structures for graphs, processes and essays.",
      general: "Letter formats, opinion essays and discussion templates.",
    },
    count: {
      academic: { value: "60+", label: "ready templates" },
      general: { value: "45+", label: "ready templates" },
    },
    tone: "lilac",
    icon: FileText,
  },
  {
    key: "predictions",
    title: "Prediction Questions",
    description: {
      academic: "Most likely Writing & Speaking topics for the next exam.",
      general: "High-probability questions for upcoming General tests.",
    },
    count: {
      academic: { value: "Weekly", label: "fresh predictions" },
      general: { value: "Weekly", label: "fresh predictions" },
    },
    tone: "rose",
    icon: Sparkles,
  },
  {
    key: "mistakes",
    title: "Common Mistakes",
    description: {
      academic: "Grammar, lexical and coherence errors that hurt your band.",
      general: "Frequent errors test-takers make in letters and essays.",
    },
    count: {
      academic: { value: "120+", label: "error patterns" },
      general: { value: "90+", label: "error patterns" },
    },
    tone: "mint",
    icon: AlertTriangle,
  },
  {
    key: "plan",
    title: "Study Plan",
    description: {
      academic: "Personalized 4–8 week roadmap to your target band.",
      general: "Structured weekly plan tailored to your timeline.",
    },
    count: {
      academic: { value: "4–8", label: "week roadmaps" },
      general: { value: "4–8", label: "week roadmaps" },
    },
    tone: "kraft",
    icon: CalendarDays,
  },
];

// Per-tone color sets for tinted cards & gradient numbers
const tones: Record<
  Feature["tone"],
  {
    bg: string;
    border: string;
    arrowBg: string;
    arrowText: string;
    numberGradient: string;
  }
> = {
  blue: {
    bg: "bg-[oklch(0.96_0.04_255)]",
    border: "border-[oklch(0.62_0.16_255)]/20",
    arrowBg: "bg-white",
    arrowText: "text-[oklch(0.45_0.16_255)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.45_0.18_260)_0%,oklch(0.62_0.18_245)_100%)]",
  },
  sage: {
    bg: "bg-[oklch(0.94_0.05_160)]",
    border: "border-[oklch(0.55_0.10_160)]/20",
    arrowBg: "bg-white",
    arrowText: "text-[oklch(0.42_0.10_160)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.38_0.10_160)_0%,oklch(0.58_0.13_155)_100%)]",
  },
  peach: {
    bg: "bg-[oklch(0.94_0.055_55)]",
    border: "border-[oklch(0.65_0.12_50)]/22",
    arrowBg: "bg-white",
    arrowText: "text-[oklch(0.45_0.12_45)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.42_0.12_40)_0%,oklch(0.6_0.14_55)_100%)]",
  },
  lilac: {
    bg: "bg-[oklch(0.94_0.055_295)]",
    border: "border-[oklch(0.6_0.12_295)]/22",
    arrowBg: "bg-white",
    arrowText: "text-[oklch(0.42_0.12_295)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.4_0.13_295)_0%,oklch(0.58_0.15_290)_100%)]",
  },
  mint: {
    bg: "bg-[oklch(0.94_0.05_185)]",
    border: "border-[oklch(0.6_0.10_185)]/22",
    arrowBg: "bg-white",
    arrowText: "text-[oklch(0.4_0.1_185)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.38_0.10_185)_0%,oklch(0.55_0.12_180)_100%)]",
  },
  rose: {
    bg: "bg-[oklch(0.95_0.045_15)]",
    border: "border-[oklch(0.62_0.14_15)]/22",
    arrowBg: "bg-white",
    arrowText: "text-[oklch(0.45_0.14_15)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.42_0.16_10)_0%,oklch(0.6_0.18_20)_100%)]",
  },
  kraft: {
    bg: "bg-[oklch(0.92_0.04_75)]",
    border: "border-[oklch(0.55_0.07_70)]/22",
    arrowBg: "bg-white",
    arrowText: "text-[oklch(0.4_0.07_70)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.35_0.06_70)_0%,oklch(0.55_0.09_70)_100%)]",
  },
};

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

function FeatureCard({
  feature,
  module,
}: {
  feature: Feature;
  module: Module;
}) {
  const tone = tones[feature.tone];
  const { value, label } = feature.count[module];

  return (
    <button
      type="button"
      className={`group relative flex flex-col overflow-hidden rounded-2xl border ${tone.border} ${tone.bg} p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card sm:p-6`}
    >
      {/* subtle paper grain */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(oklch(0.3_0.05_60_/_0.05)_1px,transparent_1px)] [background-size:3px_3px]"
      />
      {/* top edge highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />

      {/* Top row: arrow only */}
      <div className="relative flex w-full items-start justify-end">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${tone.arrowBg} ${tone.arrowText} shadow-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.75} />
        </span>
      </div>

      {/* Oversized gradient number — the hero of the card */}
      <div className="relative mt-1 flex items-baseline gap-2">
        <span
          className={`bg-clip-text font-display text-[56px] font-extrabold leading-none tracking-tight text-transparent sm:text-[64px] ${tone.numberGradient}`}
        >
          {value}
        </span>
      </div>
      <span className="relative mt-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </span>

      {/* Title + description */}
      <h3 className="relative mt-5 font-display text-lg font-extrabold tracking-tight text-foreground">
        {feature.title}
      </h3>
      <p className="relative mt-1.5 text-[13.5px] font-medium leading-relaxed text-foreground/70">
        {feature.description[module]}
      </p>
    </button>
  );
}
