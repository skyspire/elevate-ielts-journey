import { useState, useEffect, type ComponentType } from "react";
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
  HelpCircle,
  type LucideProps,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { CardMotif } from "@/components/site/CardMotif";
import { StudyNotesBackground } from "@/components/site/StudyNotesBackground";

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

// Macaron candy palette — soft pastels with bakery-window appeal.
// Pistachio, raspberry, lemon, lavender, rose, sky, peach.
// front == mid keeps surfaces clean and flat; deep gives ink-on-pastel
// title contrast; glow is a brighter wash for halos.
type ToneShades = { front: string; mid: string; deep: string; glow: string };

// Academic = soft scholarly palette (quiet library tones)
// front = soft muted fill; deep = quiet ink for title/motif.
const tonesAcademic: Record<Feature["tone"], ToneShades> = {
  // Dusty navy
  navy:     { front: "oklch(0.84 0.035 245)", mid: "oklch(0.84 0.035 245)", deep: "oklch(0.32 0.08 250)",  glow: "oklch(0.88 0.04 245)" },
  // Antique rose
  rust:     { front: "oklch(0.86 0.035 18)",  mid: "oklch(0.86 0.035 18)",  deep: "oklch(0.36 0.09 20)",   glow: "oklch(0.90 0.04 18)"  },
  // Sage
  forest:   { front: "oklch(0.86 0.035 150)", mid: "oklch(0.86 0.035 150)", deep: "oklch(0.34 0.07 150)",  glow: "oklch(0.90 0.04 150)" },
  // Dusty plum
  plum:     { front: "oklch(0.84 0.04 320)",  mid: "oklch(0.84 0.04 320)",  deep: "oklch(0.34 0.08 320)",  glow: "oklch(0.88 0.045 320)"},
  // Parchment / antique cream
  ochre:    { front: "oklch(0.91 0.045 85)",  mid: "oklch(0.91 0.045 85)",  deep: "oklch(0.42 0.09 70)",   glow: "oklch(0.94 0.05 85)"  },
  // Dove blue / soft pewter blue
  teal:     { front: "oklch(0.86 0.03 210)",  mid: "oklch(0.86 0.03 210)",  deep: "oklch(0.34 0.07 220)",  glow: "oklch(0.90 0.035 210)"},
  // Heather / muted lavender
  espresso: { front: "oklch(0.84 0.035 295)", mid: "oklch(0.84 0.035 295)", deep: "oklch(0.34 0.08 295)",  glow: "oklch(0.88 0.04 295)" },
};

// General = warm scholarly variant (taupe, sand, dusty rose, etc.)
const tonesGeneral: Record<Feature["tone"], ToneShades> = {
  // Sand / warm taupe
  navy:     { front: "oklch(0.86 0.04 60)",   mid: "oklch(0.86 0.04 60)",   deep: "oklch(0.38 0.09 55)",   glow: "oklch(0.90 0.045 60)" },
  // Dusty terracotta
  rust:     { front: "oklch(0.84 0.045 30)",  mid: "oklch(0.84 0.045 30)",  deep: "oklch(0.38 0.10 25)",   glow: "oklch(0.88 0.05 30)"  },
  // Soft moss
  forest:   { front: "oklch(0.86 0.04 130)",  mid: "oklch(0.86 0.04 130)",  deep: "oklch(0.36 0.08 135)",  glow: "oklch(0.90 0.045 130)"},
  // Dusty rose
  plum:     { front: "oklch(0.86 0.04 10)",   mid: "oklch(0.86 0.04 10)",   deep: "oklch(0.38 0.10 12)",   glow: "oklch(0.90 0.045 10)" },
  // Honey cream
  ochre:    { front: "oklch(0.91 0.05 90)",   mid: "oklch(0.91 0.05 90)",   deep: "oklch(0.44 0.10 75)",   glow: "oklch(0.94 0.055 90)" },
  // Smoky blue
  teal:     { front: "oklch(0.84 0.035 225)", mid: "oklch(0.84 0.035 225)", deep: "oklch(0.36 0.08 230)",  glow: "oklch(0.88 0.04 225)" },
  // Mauve
  espresso: { front: "oklch(0.84 0.04 305)",  mid: "oklch(0.84 0.04 305)",  deep: "oklch(0.36 0.09 305)",  glow: "oklch(0.88 0.045 305)"},
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

  // Sample user — replace with real auth data later
  const userName = "Riya";

  // Time-aware greeting + date stamp — computed on the client only to keep
  // SSR and first client render identical (avoids hydration mismatch)
  const [greeting, setGreeting] = useState<string>("Welcome back");
  const [dateStamp, setDateStamp] = useState<string>("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour >= 5 && hour < 12
        ? "Good morning"
        : hour >= 12 && hour < 17
          ? "Good afternoon"
          : hour >= 17 && hour < 21
            ? "Good evening"
            : "Good night",
    );
    setDateStamp(
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    );
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "oklch(0.992 0.005 85)" }}>
      <main className="relative overflow-hidden py-12 sm:py-16">
        {/* Ivory whisper background — soft pastel halos breathing in the corners */}
        <StudyNotesBackground module={module} />

        {/* Centered content column */}
        <div className="relative z-[1] mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Personalized hero — date stamp · handwritten greeting · editorial tagline */}
          <div className="text-center">
            {/* Tiny date stamp on top — magazine masthead vibe */}
            <div className="font-display text-[10px] font-extrabold uppercase tracking-[0.32em] text-foreground/45">
              {dateStamp}
            </div>

            {/* Handwritten greeting — warm and personal */}
            <h1
              className="mt-3 font-handwriting text-5xl font-bold leading-[0.95] text-foreground/75 sm:text-6xl md:text-7xl"
              style={{ transform: "rotate(-1.5deg)" }}
            >
              {greeting},{" "}
              <span className="text-foreground">{userName}</span>
            </h1>

            {/* Sketchy underline */}
            <div className="relative mx-auto mt-1 h-3 w-56 sm:h-4 sm:w-72">
              <svg
                aria-hidden
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full text-foreground/45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 6 9 C 50 4, 110 12, 160 7 S 250 11, 294 6" />
                <path
                  d="M 14 12 C 70 8, 130 13, 180 10 S 260 13, 286 11"
                  opacity="0.4"
                  strokeWidth="1.4"
                />
              </svg>
            </div>

            {/* Editorial tagline below */}
            <p className="mx-auto mt-6 max-w-md text-base font-medium text-foreground/60 sm:text-lg">
              Your IELTS desk is ready —{" "}
              <span className="font-handwriting text-xl font-bold italic text-foreground/70 sm:text-2xl">
                let's pick up where you left off.
              </span>
            </p>
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

          {/* Macaron card grid */}
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.key} feature={f} module={module} />
            ))}
          </div>

          {/* Bottom anchor — daily tip strip gives the page a satisfying close */}
          <div className="mt-14">
            <div
              className="relative mx-auto flex max-w-3xl flex-col items-center gap-3 overflow-hidden rounded-2xl px-5 py-5 sm:flex-row sm:gap-5 sm:px-7 sm:py-6"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.96 0.04 95) 0%, oklch(0.95 0.05 55) 50%, oklch(0.94 0.05 350) 100%)",
                border: "1px solid color-mix(in oklab, oklch(0.45 0.10 60) 22%, transparent)",
                boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.55)",
              }}
            >
              {/* Pastel rosette — left */}
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl"
                style={{
                  background: "oklch(0.99 0.012 85)",
                  border: "1.5px solid color-mix(in oklab, oklch(0.45 0.10 60) 28%, transparent)",
                  boxShadow: "inset 0 0 0 3px oklch(0.96 0.05 95)",
                }}
                aria-hidden
              >
                ✨
              </div>

              {/* Copy */}
              <div className="flex-1 text-center sm:text-left">
                <div className="font-display text-[10px] font-extrabold uppercase tracking-[0.22em] text-foreground/55">
                  Today's Pick
                </div>
                <div className="mt-1 font-display text-base font-black tracking-tight text-foreground sm:text-lg">
                  {module === "academic"
                    ? "Master 5 new academic collocations today"
                    : "Practice 1 letter from a real recent exam"}
                </div>
                <div className="mt-1 text-[12px] font-medium text-foreground/65">
                  Small daily wins compound into a Band 8+ score.
                </div>
              </div>

              {/* CTA chip */}
              <Link
                to={module === "academic" ? "/vocabulary" : "/writing-samples"}
                search={{ module }}
                className="shrink-0 rounded-full px-4 py-2 font-display text-[12px] font-black tracking-tight transition-transform hover:-translate-y-0.5"
                style={{
                  background: "oklch(0.22 0.04 260)",
                  color: "oklch(0.98 0.01 85)",
                  boxShadow: "0 4px 0 oklch(0.45 0.10 60 / 0.35)",
                }}
              >
                Start now →
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
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
          className={`font-display text-2xl font-black tracking-tight sm:text-4xl md:text-5xl transition-colors duration-500 ${
            isAcademic ? "" : "opacity-80"
          }`}
          style={{
            color: isAcademic ? "oklch(0.45 0.14 265)" : "oklch(0.55 0.06 265 / 0.55)",
          }}
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
          className={`font-display text-2xl font-black tracking-tight sm:text-4xl md:text-5xl transition-colors duration-500 ${
            !isAcademic ? "" : "opacity-80"
          }`}
          style={{
            color: !isAcademic ? "oklch(0.52 0.16 28)" : "oklch(0.55 0.06 28 / 0.55)",
          }}
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
      {/* Soft squircle (Apple-icon-style ~24px corners) with quiet scholarly fill,
          fine paper grain, hairline tonal border, and gentle drop shadow. */}
      <span
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[24px] transition-all duration-300 ease-out group-hover:-translate-y-1 ${
          isHighlighted ? "p-4 sm:p-5" : "p-3.5 sm:p-4"
        }`}
        style={{
          background: tone.front,
          boxShadow: [
            "0 1px 1px oklch(0.20 0.04 60 / 0.06)",
            "0 6px 14px -8px oklch(0.20 0.04 60 / 0.18)",
            "inset 0 1px 0 oklch(1 0 0 / 0.40)",
          ].join(", "),
        }}
      >
        {/* Fine paper grain — very subtle, just enough tooth */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0 0 0 / 0.15) 0.5px, transparent 0.7px)",
            backgroundSize: "3px 3px",
            opacity: 0.4,
          }}
        />

        {/* Animated motif — drawn in the deep ink of the card */}
        <CardMotif
          kind={feature.key as Parameters<typeof CardMotif>[0]["kind"]}
          color={tone.deep}
          className="relative z-[1] opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
        />

        {/* Title only — quiet ink on muted ground */}
        <span className="relative z-[1] mt-auto flex flex-col items-center">
          <h3
            className={`text-center font-display font-extrabold leading-tight tracking-tight ${
              isHighlighted ? "text-base sm:text-lg" : "text-[14px] sm:text-[16px]"
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