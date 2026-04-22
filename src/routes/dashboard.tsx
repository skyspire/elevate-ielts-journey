import { useState, type ComponentType } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  CheckCircle2,
  PenLine,
  Mic,
  BookOpen,
  FileText,
  Sparkles,
  AlertTriangle,
  CalendarDays,
  Flame,
  type LucideProps,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { CardMotif } from "@/components/site/CardMotif";

type Module = "academic" | "general";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BigIELTS.com" },
      {
        name: "description",
        content:
          "Your IELTS preparation dashboard. Switch between Academic and General modules and access samples, vocabulary, templates, predictions and more.",
      },
      { property: "og:title", content: "Dashboard — BigIELTS.com" },
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
  count: {
    academic: { value: string; label: string };
    general: { value: string; label: string };
  };
  tone: "espresso" | "navy" | "forest" | "plum" | "rust" | "teal" | "ochre";
  icon: ComponentType<LucideProps>;
  to?: string;
  highlighted?: boolean;
};

const features: Feature[] = [
  {
    key: "recent-exams",
    title: "Recent Exam Questions",
    description: {
      academic: "Latest real Academic questions reported from recent test dates.",
      general: "Latest real General Training questions from recent test dates.",
    },
    count: {
      academic: { value: "Fresh", label: "from recent exams" },
      general: { value: "Fresh", label: "from recent exams" },
    },
    tone: "rust",
    icon: Flame,
    highlighted: true,
    to: "/dashboard/recent-exam-questions",
  },
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
    to: "/dashboard/speaking-samples",
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
    to: "/dashboard/vocabulary",
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

// Noddy storybook palette — pure, saturated, flat primary-leaning colors.
// Each card is a solid bright color with a slightly darker rim/text and a
// matching bright halo. front == mid keeps the surface essentially flat
// (sticker-like) so the cartoon palette reads as pure color.
type ToneShades = { front: string; mid: string; deep: string; glow: string };

// Academic = the classic 7-color Noddy primary set
const tonesAcademic: Record<Feature["tone"], ToneShades> = {
  // Sky blue (Noddy's hat / car)
  navy:     { front: "oklch(0.74 0.18 235)", mid: "oklch(0.74 0.18 235)", deep: "oklch(0.38 0.18 250)", glow: "oklch(0.78 0.20 235)" },
  // Pillar-box red (Noddy's shirt)
  rust:     { front: "oklch(0.66 0.24 27)",  mid: "oklch(0.66 0.24 27)",  deep: "oklch(0.38 0.20 27)",  glow: "oklch(0.72 0.24 27)"  },
  // Grass green
  forest:   { front: "oklch(0.74 0.20 145)", mid: "oklch(0.74 0.20 145)", deep: "oklch(0.40 0.16 145)", glow: "oklch(0.80 0.20 145)" },
  // Hot pink (storybook bow)
  plum:     { front: "oklch(0.74 0.21 350)", mid: "oklch(0.74 0.21 350)", deep: "oklch(0.42 0.20 350)", glow: "oklch(0.80 0.22 350)" },
  // Sunny yellow
  ochre:    { front: "oklch(0.90 0.18 95)",  mid: "oklch(0.90 0.18 95)",  deep: "oklch(0.55 0.16 75)",  glow: "oklch(0.92 0.18 95)"  },
  // Turquoise / teal
  teal:     { front: "oklch(0.78 0.16 195)", mid: "oklch(0.78 0.16 195)", deep: "oklch(0.42 0.14 200)", glow: "oklch(0.82 0.16 195)" },
  // Cartoon purple
  espresso: { front: "oklch(0.66 0.22 305)", mid: "oklch(0.66 0.22 305)", deep: "oklch(0.38 0.20 305)", glow: "oklch(0.74 0.22 305)" },
};

// General = same Noddy energy, shifted toward warm orange/coral side
const tonesGeneral: Record<Feature["tone"], ToneShades> = {
  // Tangerine orange
  navy:     { front: "oklch(0.78 0.20 55)",  mid: "oklch(0.78 0.20 55)",  deep: "oklch(0.48 0.20 45)",  glow: "oklch(0.84 0.20 55)"  },
  // Coral red
  rust:     { front: "oklch(0.70 0.23 22)",  mid: "oklch(0.70 0.23 22)",  deep: "oklch(0.42 0.21 22)",  glow: "oklch(0.76 0.23 22)"  },
  // Lime green
  forest:   { front: "oklch(0.84 0.20 130)", mid: "oklch(0.84 0.20 130)", deep: "oklch(0.48 0.18 135)", glow: "oklch(0.88 0.20 130)" },
  // Bubblegum pink
  plum:     { front: "oklch(0.78 0.20 10)",  mid: "oklch(0.78 0.20 10)",  deep: "oklch(0.46 0.20 10)",  glow: "oklch(0.84 0.20 10)"  },
  // Buttercup yellow
  ochre:    { front: "oklch(0.92 0.18 90)",  mid: "oklch(0.92 0.18 90)",  deep: "oklch(0.58 0.16 75)",  glow: "oklch(0.94 0.18 90)"  },
  // Aqua blue
  teal:     { front: "oklch(0.80 0.16 220)", mid: "oklch(0.80 0.16 220)", deep: "oklch(0.45 0.16 230)", glow: "oklch(0.85 0.16 220)" },
  // Storybook violet
  espresso: { front: "oklch(0.70 0.20 295)", mid: "oklch(0.70 0.20 295)", deep: "oklch(0.42 0.20 295)", glow: "oklch(0.78 0.20 295)" },
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
    <div className="relative min-h-screen velvet-base">
      <main className="relative overflow-hidden py-12 sm:py-16">
        {/* Dark velvet background — plum/charcoal with colored glow halos */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {/* Base gradient already on the page; add per-card glow halos */}
          <span className="velvet-glow velvet-glow-1" />
          <span className="velvet-glow velvet-glow-2" />
          <span className="velvet-glow velvet-glow-3" />
          <span className="velvet-glow velvet-glow-4" />
          <span className="velvet-glow velvet-glow-5" />
          <span className="velvet-glow velvet-glow-6" />
          <span className="velvet-glow velvet-glow-7" />
          <span className="velvet-glow velvet-glow-8" />
          {/* Star dust */}
          <span className="absolute inset-0 velvet-stars opacity-90" />
          {/* Subtle grain for texture */}
          <span className="absolute inset-0 aurora-grain opacity-[0.18] mix-blend-overlay" />
          {/* Top-bottom vignette to frame the content */}
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.18_0.04_300/0.55)_100%)]" />
        </div>

        {/* Centered content column */}
        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Hero — handwriting headline with sketchy pencil underline */}
          <div className="text-center">
            <div className="relative inline-block">
              <h1
                className="font-handwriting text-5xl font-bold leading-[0.95] text-white/85 sm:text-6xl md:text-7xl"
                style={{ transform: "rotate(-2deg)" }}
              >
                Pick your IELTS
              </h1>

              {/* Sketchy hand-drawn underline (double pass for pencil feel) */}
              <svg
                aria-hidden
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute -bottom-3 left-0 h-3 w-full text-white/70 sm:-bottom-4 sm:h-4"
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
          </div>

          {/* Toggle */}
          <div className="mt-8 flex justify-center sm:mt-10">
            <ModuleToggle module={module} setModule={setModule} />
          </div>

          {/* Section label */}
          <div className="mt-14 mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-white/20" />
            <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-white/55">
              Your Toolkit
            </span>
            <span className="h-px w-10 bg-white/20" />
          </div>

          {/* Vibrant gradient cards — bigger, juicy hover */}
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.key} feature={f} module={module} />
            ))}
          </div>

          <p className="mt-12 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
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
  const tone = (module === "academic" ? tonesAcademic : tonesGeneral)[feature.tone];
  const Icon = feature.icon;
  const isHighlighted = feature.highlighted;

  // Wrapper holds the whole card. Wider stack for the highlighted card.
  const wrapperClass = isHighlighted
    ? "group relative col-span-2 row-span-1 block aspect-[2/1] w-full focus-visible:outline-none"
    : "group relative block aspect-square w-full focus-visible:outline-none";

  const inner = (
    <div className="relative h-full w-full">
      {/* Glow halo — blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-[28px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: tone.glow }}
      />

      {/* Tilted shadow plate behind the card (peeks on hover) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[22px] transition-all duration-500 ease-out group-hover:rotate-[-3deg] group-hover:translate-x-[-4px] group-hover:translate-y-[6px]"
        style={{
          background: tone.deep,
          transform: "rotate(-1.5deg)",
          opacity: 0.85,
        }}
      />

      {/* Front card — vibrant gradient surface */}
      <span
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-white/40 shadow-[0_6px_14px_oklch(0.20_0.04_60/0.12),0_22px_50px_-22px_oklch(0.20_0.04_60/0.40)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[1deg] group-hover:shadow-[0_12px_28px_oklch(0.20_0.04_60/0.18),0_34px_70px_-22px_oklch(0.20_0.04_60/0.45)] ${
          isHighlighted ? "p-4 sm:p-5" : "p-3.5 sm:p-4"
        }`}
        style={{
          background: `linear-gradient(140deg, ${tone.front} 0%, ${tone.mid} 100%)`,
        }}
      >
        {/* Subtle top highlight — keeps a hint of dimension on flat color */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[22px]"
          style={{
            background:
              "linear-gradient(180deg, oklch(1 0 0 / 0.22) 0%, oklch(1 0 0 / 0) 100%)",
          }}
        />

        {/* Animated motif loop — centered scene, the visual focus */}
        <CardMotif
          kind={feature.key as Parameters<typeof CardMotif>[0]["kind"]}
          color={tone.deep}
          className="opacity-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
        />

        {/* Title — centered chip pinned to the bottom */}
        <span className="relative z-[1] mt-auto flex justify-center">
          <h3
            className={`text-center font-display font-black leading-tight tracking-tight ${
              isHighlighted ? "text-sm sm:text-base" : "text-[12px] sm:text-[13px]"
            }`}
            style={{ color: tone.deep }}
          >
            {feature.title}
          </h3>
        </span>
      </span>
    </div>
  );

  if (feature.to === "/dashboard/recent-exam-questions") {
    return (
      <Link
        to="/recent-exam-questions"
        search={{ module, section: "writing" }}
        className={wrapperClass}
      >
        {inner}
      </Link>
    );
  }

  if (feature.to === "/dashboard/writing-samples") {
    return (
      <Link to="/writing-samples" search={{ module }} className={wrapperClass}>
        {inner}
      </Link>
    );
  }

  if (feature.to === "/dashboard/speaking-samples") {
    return (
      <Link to="/speaking-samples" search={{ module }} className={wrapperClass}>
        {inner}
      </Link>
    );
  }

  if (feature.to === "/dashboard/vocabulary") {
    return (
      <Link to="/vocabulary" search={{ module }} className={wrapperClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={wrapperClass}>
      {inner}
    </button>
  );
}