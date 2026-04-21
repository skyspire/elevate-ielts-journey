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
import { Footer } from "@/components/site/Footer";

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
  tone: "espresso" | "navy" | "forest" | "plum" | "rust" | "teal" | "ochre";
  // Lucide icon used for the glossy 3D mark in the corner
  icon: ComponentType<LucideProps>;
  // Optional route to navigate to when the card is clicked
  to?: string;
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
    tone: "navy",
    icon: PenLine,
    to: "/dashboard/writing-samples",
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
    tone: "rust",
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
    tone: "forest",
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
    tone: "plum",
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
    tone: "ochre",
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
    tone: "teal",
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
    tone: "espresso",
    icon: CalendarDays,
  },
];

// Per-tone color sets for tinted cards, gradient numbers, and glossy 3D icon
const tones: Record<
  Feature["tone"],
  {
    bg: string;
    border: string; // 2px solid tone-colored border
    arrowBg: string;
    arrowText: string;
    numberGradient: string;
    // Glossy 3D icon — gradient stops + drop shadow color
    iconStart: string; // light tone (top of icon)
    iconEnd: string; // deep tone (bottom of icon)
    iconShadow: string; // soft tone-colored shadow under the icon disc
  }
> = {
  navy: {
    // Deep navy-clay
    bg: "bg-[oklch(0.32_0.06_255)]",
    border:
      "border border-[oklch(0.22_0.05_255)]/60 ring-2 ring-inset ring-white/10",
    arrowBg: "bg-white/95",
    arrowText: "text-[oklch(0.32_0.06_255)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.96_0.02_250)_0%,oklch(0.82_0.10_240)_100%)]",
    iconStart: "oklch(0.62 0.12 250)",
    iconEnd: "oklch(0.30 0.08 255)",
    iconShadow: "oklch(0.20 0.06 255 / 0.5)",
  },
  rust: {
    // Burnt rust / terracotta
    bg: "bg-[oklch(0.40_0.13_40)]",
    border:
      "border border-[oklch(0.28_0.10_40)]/60 ring-2 ring-inset ring-white/10",
    arrowBg: "bg-white/95",
    arrowText: "text-[oklch(0.40_0.13_40)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.96_0.04_60)_0%,oklch(0.82_0.13_55)_100%)]",
    iconStart: "oklch(0.68 0.15 45)",
    iconEnd: "oklch(0.38 0.13 40)",
    iconShadow: "oklch(0.30 0.12 40 / 0.5)",
  },
  forest: {
    // Deep forest green
    bg: "bg-[oklch(0.34_0.07_160)]",
    border:
      "border border-[oklch(0.22_0.06_160)]/60 ring-2 ring-inset ring-white/10",
    arrowBg: "bg-white/95",
    arrowText: "text-[oklch(0.34_0.07_160)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.96_0.04_160)_0%,oklch(0.82_0.11_155)_100%)]",
    iconStart: "oklch(0.60 0.10 160)",
    iconEnd: "oklch(0.30 0.08 160)",
    iconShadow: "oklch(0.22 0.06 160 / 0.5)",
  },
  plum: {
    // Deep plum / aubergine
    bg: "bg-[oklch(0.34_0.08_320)]",
    border:
      "border border-[oklch(0.22_0.07_320)]/60 ring-2 ring-inset ring-white/10",
    arrowBg: "bg-white/95",
    arrowText: "text-[oklch(0.34_0.08_320)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.96_0.03_320)_0%,oklch(0.82_0.10_315)_100%)]",
    iconStart: "oklch(0.62 0.12 315)",
    iconEnd: "oklch(0.32 0.10 320)",
    iconShadow: "oklch(0.22 0.07 320 / 0.5)",
  },
  ochre: {
    // Warm ochre / mustard
    bg: "bg-[oklch(0.45_0.11_75)]",
    border:
      "border border-[oklch(0.32_0.09_75)]/60 ring-2 ring-inset ring-white/10",
    arrowBg: "bg-white/95",
    arrowText: "text-[oklch(0.40_0.10_75)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.97_0.04_85)_0%,oklch(0.85_0.13_80)_100%)]",
    iconStart: "oklch(0.72 0.13 80)",
    iconEnd: "oklch(0.42 0.11 75)",
    iconShadow: "oklch(0.30 0.09 75 / 0.5)",
  },
  teal: {
    // Deep teal-ink
    bg: "bg-[oklch(0.34_0.07_200)]",
    border:
      "border border-[oklch(0.22_0.06_200)]/60 ring-2 ring-inset ring-white/10",
    arrowBg: "bg-white/95",
    arrowText: "text-[oklch(0.34_0.07_200)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.96_0.03_200)_0%,oklch(0.82_0.10_195)_100%)]",
    iconStart: "oklch(0.62 0.10 200)",
    iconEnd: "oklch(0.30 0.08 200)",
    iconShadow: "oklch(0.22 0.06 200 / 0.5)",
  },
  espresso: {
    // Espresso / dark cocoa
    bg: "bg-[oklch(0.30_0.04_60)]",
    border:
      "border border-[oklch(0.20_0.03_60)]/60 ring-2 ring-inset ring-white/10",
    arrowBg: "bg-white/95",
    arrowText: "text-[oklch(0.30_0.04_60)]",
    numberGradient:
      "bg-[linear-gradient(135deg,oklch(0.96_0.02_70)_0%,oklch(0.84_0.07_65)_100%)]",
    iconStart: "oklch(0.58 0.07 65)",
    iconEnd: "oklch(0.28 0.04 60)",
    iconShadow: "oklch(0.18 0.03 60 / 0.5)",
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
          {/* Hero — teacher's tick marks above + sketchy hand-drawn underline below */}
          <div className="text-center">
            <div className="relative inline-block">
              {/* Teacher's tick marks above */}
              <svg
                aria-hidden
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute -top-3 left-1/2 h-3 w-[78%] -translate-x-1/2 text-foreground/55 sm:-top-4 sm:h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M 18 12 L 24 2" />
                <path d="M 50 12 L 56 2" />
                <path d="M 82 12 L 88 2" />
                <path d="M 114 12 L 120 2" />
                <path d="M 146 12 L 152 2" />
                <path d="M 178 12 L 184 2" />
              </svg>

              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
                Pick Your IELTS
              </h1>

              {/* Sketchy hand-drawn underline */}
              <svg
                aria-hidden
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-foreground/45 sm:-bottom-3 sm:h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 6 9 C 50 4, 110 12, 160 7 S 250 11, 294 6" />
                <path d="M 14 12 C 70 8, 130 13, 180 10 S 260 13, 286 11" opacity="0.45" />
              </svg>
            </div>
          </div>

          {/* Toggle */}
          <div className="mt-8 flex justify-center sm:mt-10">
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
      <Footer />
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
  const isAcademic = module === "academic";

  return (
    <div className="relative flex items-center justify-center gap-3 sm:gap-6">
      {/* Academic label (left) */}
      <button
        type="button"
        onClick={() => setModule("academic")}
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
            fill={isAcademic ? "oklch(0.62 0.10 265)" : "oklch(0.60 0.15 28)"}
            className="transition-colors duration-500"
          />
          {/* Belly */}
          <ellipse cx="100" cy="158" rx="30" ry="32" fill="oklch(0.96 0.02 80)" />
          {/* Wings */}
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
              fill={isAcademic ? "oklch(0.62 0.10 265)" : "oklch(0.60 0.15 28)"}
              className="transition-colors duration-500"
            />
            {/* Ear tufts */}
            <path
              d="M 64 58 l 8 -18 l 12 14 Z M 136 58 l -8 -18 l -12 14 Z"
              fill={isAcademic ? "oklch(0.50 0.12 265)" : "oklch(0.48 0.16 28)"}
              className="transition-colors duration-500"
            />

            {/* Glasses frame */}
            <circle cx="82" cy="92" r="18" fill="oklch(0.99 0 0)" stroke="oklch(0.20 0.02 250)" strokeWidth="3.5" />
            <circle cx="118" cy="92" r="18" fill="oklch(0.99 0 0)" stroke="oklch(0.20 0.02 250)" strokeWidth="3.5" />
            <line x1="100" y1="92" x2="100" y2="92" stroke="oklch(0.20 0.02 250)" strokeWidth="3.5" />

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
        onClick={() => setModule("general")}
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
  const Icon = feature.icon;
  const gradId = `grad-${feature.key}`;

  const cardClass = `group relative flex flex-col overflow-hidden rounded-2xl ${tone.border} ${tone.bg} p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card sm:p-6`;

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:3px_3px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      <div className="relative flex w-full items-start justify-between">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${tone.arrowBg} ${tone.arrowText} shadow-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.75} />
        </span>
        <Glossy3DIcon Icon={Icon} tone={tone} gradId={gradId} />
      </div>
      <h3 className="relative mt-5 font-display text-xl font-extrabold tracking-tight text-white">
        {feature.title}
      </h3>
      <p className="relative mt-1.5 text-[13px] font-medium leading-relaxed text-white/75">
        {feature.description[module]}
      </p>
      <div className="relative mt-5 flex items-baseline gap-2 border-t border-white/15 pt-4">
        <span
          className={`bg-clip-text font-display text-[40px] font-extrabold leading-none tracking-tight text-transparent ${tone.numberGradient}`}
        >
          {value}
        </span>
        <span className="text-[13px] font-extrabold uppercase leading-tight tracking-[0.18em] text-white/90">
          {label}
        </span>
      </div>
    </>
  );

  if (feature.to === "/dashboard/writing-samples") {
    return (
      <Link to="/writing-samples" search={{ module }} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={cardClass}>
      {inner}
    </button>
  );
}

/**
 * Glossy 3D icon — Apple visionOS style.
 * Rounded-square disc with diagonal gradient + glass highlight + soft shadow.
 */
function Glossy3DIcon({
  Icon,
  tone,
  gradId,
}: {
  Icon: ComponentType<LucideProps>;
  tone: (typeof tones)[Feature["tone"]];
  gradId: string;
}) {
  return (
    <div
      className="relative h-14 w-14 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-16 sm:w-16"
    >
      <svg
        viewBox="0 0 64 64"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tone.iconStart} />
            <stop offset="100%" stopColor={tone.iconEnd} />
          </linearGradient>
          <radialGradient id={`${gradId}-gloss`} cx="30%" cy="20%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="60%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${gradId})`} />
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="18"
          fill={`url(#${gradId}-gloss)`}
        />
        <rect
          x="2.5"
          y="2.5"
          width="59"
          height="59"
          rx="17.5"
          fill="none"
          stroke="white"
          strokeOpacity="0.4"
          strokeWidth="1"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon
          className="h-6 w-6 text-white sm:h-7 sm:w-7"
          strokeWidth={2.4}
          style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }}
        />
      </div>
    </div>
  );
}
