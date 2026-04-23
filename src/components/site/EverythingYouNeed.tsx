import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  BookOpen,
  PenLine,
  Library,
  AlertTriangle,
} from "lucide-react";

type Feature = {
  key: string;
  label: string;
  description: string;
  icon: typeof FileText;
  accent: string;
  accentDeep: string;
  accentSoft: string;
  badge: string;
};

const FEATURES: Feature[] = [
  {
    key: "recent",
    label: "Recent Exam Questions",
    description:
      "Verified questions reported by real test-takers across 40+ countries — refreshed every month.",
    icon: FileText,
    accent: "oklch(0.62 0.17 255)",
    accentDeep: "oklch(0.45 0.18 260)",
    accentSoft: "oklch(0.95 0.05 255)",
    badge: "Updated April 2026",
  },
  {
    key: "predictions",
    label: "Prediction Questions",
    description:
      "AI-ranked topics most likely to appear in your sitting, based on 12 months of question rotation.",
    icon: Sparkles,
    accent: "oklch(0.6 0.2 295)",
    accentDeep: "oklch(0.42 0.2 295)",
    accentSoft: "oklch(0.95 0.05 295)",
    badge: "AI-ranked weekly",
  },
  {
    key: "ebooks",
    label: "E-Books for Serious Study",
    description:
      "Deep-dive guides written by Band 9 examiners — frameworks, vocabulary, pronunciation, grammar.",
    icon: BookOpen,
    accent: "oklch(0.62 0.16 35)",
    accentDeep: "oklch(0.45 0.17 30)",
    accentSoft: "oklch(0.95 0.05 35)",
    badge: "12 titles · PDF",
  },
  {
    key: "samples",
    label: "Writing & Speaking Samples",
    description:
      "Hundreds of Band 8 & 9 model answers with examiner annotations — see what scores really look like.",
    icon: PenLine,
    accent: "oklch(0.55 0.14 165)",
    accentDeep: "oklch(0.4 0.15 165)",
    accentSoft: "oklch(0.94 0.05 165)",
    badge: "600+ samples",
  },
  {
    key: "vocabulary",
    label: "Curated Vocabulary Lists",
    description:
      "High-yield collocations and lexical chunks examiners reward — grouped by topic with examples.",
    icon: Library,
    accent: "oklch(0.6 0.16 230)",
    accentDeep: "oklch(0.42 0.17 230)",
    accentSoft: "oklch(0.95 0.05 230)",
    badge: "30 topics",
  },
  {
    key: "mistakes",
    label: "Catastrophic Mistakes List",
    description:
      "The exact errors that drag a 7.5 down to a 6.5 — what to never do, with real examples.",
    icon: AlertTriangle,
    accent: "oklch(0.6 0.2 25)",
    accentDeep: "oklch(0.45 0.2 25)",
    accentSoft: "oklch(0.94 0.06 25)",
    badge: "Avoid these",
  },
];

export function EverythingYouNeed() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.985 0.012 75) 0%, oklch(0.97 0.018 295) 55%, oklch(0.96 0.025 290) 100%)",
      }}
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "oklch(0.7 0.12 290 / 0.18)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-10 h-[380px] w-[380px] rounded-full blur-3xl"
        style={{ background: "oklch(0.78 0.1 60 / 0.15)" }}
      />

      <div className="container-page relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-5xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl">
            Everything you need to hit{" "}
            <span
              className="relative inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.5 0.18 290), oklch(0.6 0.16 320))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Band 8+
            </span>{" "}
            in your next exam
          </h2>
          <p className="mt-6 text-lg font-bold text-foreground/80 sm:text-xl">
            Six focused resources, built by Band 9 examiners. No fluff, no
            recycled content — just what actually moves your score.
          </p>
        </div>

        {/* Feature list — two columns on md+ */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-x-8 gap-y-4 md:grid-cols-2">
          {FEATURES.map((f, idx) => (
            <FeatureRow key={f.key} feature={f} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group flex items-center gap-5 rounded-2xl p-3 transition-all hover:bg-white/60 sm:gap-7 sm:p-4"
    >
      {/* Circular medallion */}
      <FeatureMedallion feature={feature} />

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl font-black tracking-tight text-foreground sm:text-2xl">
          {feature.label}
        </h3>
        <p className="mt-2 text-base font-semibold leading-relaxed text-foreground/75 sm:text-lg">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- Circular illustrated medallion per feature ---------- */

function FeatureMedallion({ feature }: { feature: Feature }) {
  return (
    <div className="relative shrink-0">
      {/* Outer halo glow */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${feature.accent}55, transparent 70%)`,
          opacity: 0.5,
          transform: "scale(1.15)",
        }}
      />

      {/* The circle */}
      <div
        className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24"
        style={{
          background: `radial-gradient(circle at 30% 25%, oklch(1 0 0 / 0.3), transparent 50%), linear-gradient(140deg, ${feature.accent} 0%, ${feature.accentDeep} 100%)`,
          boxShadow: `0 12px 28px -10px ${feature.accent}80, inset 0 1px 0 oklch(1 0 0 / 0.4), inset 0 -8px 18px ${feature.accentDeep}40`,
        }}
      >
        {/* Custom illustration */}
        <FeatureIllustration featureKey={feature.key} />

        {/* Inner ring highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-1 rounded-full"
          style={{
            background:
              "linear-gradient(180deg, oklch(1 0 0 / 0.22) 0%, transparent 35%)",
          }}
        />
      </div>
    </div>
  );
}

/* ---------- Per-feature SVG illustrations (white on accent) ---------- */

function FeatureIllustration({ featureKey }: { featureKey: string }) {
  switch (featureKey) {
    case "recent":
      return <RecentIllustration />;
    case "predictions":
      return <PredictionsIllustration />;
    case "ebooks":
      return <EbooksIllustration />;
    case "samples":
      return <SamplesIllustration />;
    case "vocabulary":
      return <VocabularyIllustration />;
    case "mistakes":
      return <MistakesIllustration />;
    default:
      return null;
  }
}

// 1. Recent Exam Questions — globe with location pin
function RecentIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="relative h-12 w-12 sm:h-14 sm:w-14" fill="none">
      <circle cx="32" cy="32" r="20" stroke="white" strokeWidth="2.5" opacity="0.95" />
      <ellipse cx="32" cy="32" rx="8" ry="20" stroke="white" strokeWidth="1.8" opacity="0.7" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="white" strokeWidth="1.8" opacity="0.7" />
      <path d="M14 24 Q32 18 50 24" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <path d="M14 40 Q32 46 50 40" stroke="white" strokeWidth="1.5" opacity="0.5" />
      {/* location pin */}
      <path d="M46 12 C42 12 39 15 39 19 C39 23 46 30 46 30 C46 30 53 23 53 19 C53 15 50 12 46 12 Z" fill="white" />
      <circle cx="46" cy="19" r="2.5" fill="oklch(0.45 0.18 260)" />
    </svg>
  );
}

// 2. Prediction Questions — crystal ball / chart with sparkle
function PredictionsIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="relative h-12 w-12 sm:h-14 sm:w-14" fill="none">
      {/* bars rising */}
      <rect x="14" y="38" width="7" height="14" rx="1.5" fill="white" opacity="0.85" />
      <rect x="24" y="30" width="7" height="22" rx="1.5" fill="white" opacity="0.95" />
      <rect x="34" y="22" width="7" height="30" rx="1.5" fill="white" />
      {/* trend arrow */}
      <path d="M14 36 L24 28 L34 20 L46 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M40 12 L46 12 L46 18" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      {/* sparkle */}
      <path d="M50 32 L51.5 35 L54.5 36.5 L51.5 38 L50 41 L48.5 38 L45.5 36.5 L48.5 35 Z" fill="white" />
    </svg>
  );
}

// 3. E-Books — open book with bookmark
function EbooksIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="relative h-12 w-12 sm:h-14 sm:w-14" fill="none">
      {/* book */}
      <path d="M10 16 Q10 14 12 14 L30 14 Q32 14 32 16 L32 50 Q32 48 30 48 L12 48 Q10 48 10 50 Z" fill="white" opacity="0.95" />
      <path d="M54 16 Q54 14 52 14 L34 14 Q32 14 32 16 L32 50 Q32 48 34 48 L52 48 Q54 48 54 50 Z" fill="white" opacity="0.95" />
      <line x1="32" y1="16" x2="32" y2="48" stroke="oklch(0.45 0.17 30)" strokeWidth="1.2" opacity="0.4" />
      {/* lines on left page */}
      <line x1="14" y1="22" x2="28" y2="22" stroke="oklch(0.45 0.17 30)" strokeWidth="1.5" opacity="0.5" />
      <line x1="14" y1="27" x2="26" y2="27" stroke="oklch(0.45 0.17 30)" strokeWidth="1.5" opacity="0.5" />
      <line x1="14" y1="32" x2="28" y2="32" stroke="oklch(0.45 0.17 30)" strokeWidth="1.5" opacity="0.5" />
      {/* lines on right page */}
      <line x1="36" y1="22" x2="50" y2="22" stroke="oklch(0.45 0.17 30)" strokeWidth="1.5" opacity="0.5" />
      <line x1="36" y1="27" x2="48" y2="27" stroke="oklch(0.45 0.17 30)" strokeWidth="1.5" opacity="0.5" />
      <line x1="36" y1="32" x2="50" y2="32" stroke="oklch(0.45 0.17 30)" strokeWidth="1.5" opacity="0.5" />
      {/* bookmark */}
      <path d="M44 14 L44 26 L47 23 L50 26 L50 14 Z" fill="oklch(0.62 0.18 25)" />
    </svg>
  );
}

// 4. Writing & Speaking Samples — pencil + speech bubble
function SamplesIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="relative h-12 w-12 sm:h-14 sm:w-14" fill="none">
      {/* speech bubble */}
      <path d="M10 14 Q10 10 14 10 L42 10 Q46 10 46 14 L46 30 Q46 34 42 34 L22 34 L16 40 L18 34 L14 34 Q10 34 10 30 Z" fill="white" opacity="0.95" />
      {/* lines in bubble */}
      <line x1="16" y1="18" x2="38" y2="18" stroke="oklch(0.4 0.15 165)" strokeWidth="1.5" opacity="0.5" />
      <line x1="16" y1="23" x2="34" y2="23" stroke="oklch(0.4 0.15 165)" strokeWidth="1.5" opacity="0.5" />
      <line x1="16" y1="28" x2="40" y2="28" stroke="oklch(0.4 0.15 165)" strokeWidth="1.5" opacity="0.5" />
      {/* pencil */}
      <g transform="translate(38 36) rotate(40)">
        <rect x="0" y="0" width="20" height="6" rx="1" fill="white" />
        <rect x="0" y="0" width="4" height="6" fill="oklch(0.62 0.18 25)" />
        <path d="M20 0 L24 3 L20 6 Z" fill="white" />
        <path d="M22 1.5 L24 3 L22 4.5 Z" fill="oklch(0.2 0.02 60)" />
      </g>
    </svg>
  );
}

// 5. Vocabulary — stacked word tiles (no letters, just lines)
function VocabularyIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="relative h-12 w-12 sm:h-14 sm:w-14" fill="none">
      {/* 3 tiles fanned with abstract word lines */}
      <g transform="translate(10 14) rotate(-8)">
        <rect width="18" height="18" rx="3" fill="white" />
        <rect x="3" y="7" width="12" height="2" rx="1" fill="oklch(0.42 0.17 230)" opacity="0.6" />
        <rect x="3" y="11" width="8" height="2" rx="1" fill="oklch(0.42 0.17 230)" opacity="0.4" />
      </g>
      <g transform="translate(24 12) rotate(-2)">
        <rect width="18" height="18" rx="3" fill="white" />
        <rect x="3" y="7" width="12" height="2" rx="1" fill="oklch(0.42 0.17 230)" opacity="0.6" />
        <rect x="3" y="11" width="9" height="2" rx="1" fill="oklch(0.42 0.17 230)" opacity="0.4" />
      </g>
      <g transform="translate(38 14) rotate(6)">
        <rect width="18" height="18" rx="3" fill="white" />
        <rect x="3" y="7" width="12" height="2" rx="1" fill="oklch(0.42 0.17 230)" opacity="0.6" />
        <rect x="3" y="11" width="7" height="2" rx="1" fill="oklch(0.42 0.17 230)" opacity="0.4" />
      </g>
      {/* underline rows */}
      <rect x="14" y="40" width="36" height="3" rx="1.5" fill="white" opacity="0.85" />
      <rect x="14" y="46" width="26" height="3" rx="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

// 6. Catastrophic Mistakes — warning triangle with X
function MistakesIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="relative h-12 w-12 sm:h-14 sm:w-14" fill="none">
      <path
        d="M32 10 L56 50 L8 50 Z"
        fill="white"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* X mark in center */}
      <line x1="26" y1="26" x2="38" y2="38" stroke="oklch(0.45 0.2 25)" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="38" y1="26" x2="26" y2="38" stroke="oklch(0.45 0.2 25)" strokeWidth="3.2" strokeLinecap="round" />
      {/* dot at base */}
      <circle cx="32" cy="44" r="2" fill="oklch(0.45 0.2 25)" />
    </svg>
  );
}
