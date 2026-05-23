import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { z } from "zod";
import {
  BookA,
  Combine,
  Quote,
  Link2,
  MessageCircle,
  ArrowUpRight,
  type LucideProps,
} from "lucide-react";
import { BackButton } from "@/components/site/BackButton";
import type { ComponentType } from "react";
import { Footer } from "@/components/site/Footer";

type Module = "academic" | "general";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).catch("academic"),
});

export const Route = createFileRoute("/vocabulary")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Vocabulary Builder — BigIELTS.com" },
      {
        name: "description",
        content:
          "Sharpen your IELTS lexical resource: dictionary words, phrasal verbs, idioms, collocations and slangs — curated for Academic and General modules.",
      },
      { property: "og:title", content: "Vocabulary Builder — BigIELTS.com" },
      {
        property: "og:description",
        content:
          "Five focused word banks to push your Lexical Resource score: dictionary words, phrasal verbs, idioms, collocations and slangs.",
      },
    ],
  }),
  component: VocabularyPage,
});

type VocabCard = {
  key: string;
  title: string;
  blurb: { academic: string; general: string };
  count: { academic: string; general: string };
  countLabel: string;
  icon: ComponentType<LucideProps>;
  tone: "indigo" | "rust" | "plum" | "forest" | "ochre";
};

const cards: VocabCard[] = [
  {
    key: "dictionary",
    title: "Dictionary Words",
    blurb: {
      academic: "High-band academic vocabulary with definitions and exam-ready usage.",
      general: "Everyday vocabulary you actually need — clear meanings, real sentences.",
    },
    count: { academic: "1,200+", general: "800+" },
    countLabel: "curated words",
    icon: BookA,
    tone: "indigo",
  },
  {
    key: "phrasal",
    title: "Phrasal Verbs",
    blurb: {
      academic: "Natural phrasal verbs that lift formal writing without sounding casual.",
      general: "Phrasal verbs native speakers use daily — perfect for Speaking & letters.",
    },
    count: { academic: "260+", general: "320+" },
    countLabel: "phrasal verbs",
    icon: Combine,
    tone: "rust",
  },
  {
    key: "idioms",
    title: "Idioms",
    blurb: {
      academic: "Subtle idiomatic expressions that signal Band 8+ fluency.",
      general: "Common idioms to make Speaking Part 2 & 3 sound effortless.",
    },
    count: { academic: "180+", general: "240+" },
    countLabel: "idioms",
    icon: Quote,
    tone: "plum",
  },
  {
    key: "collocations",
    title: "Collocations",
    blurb: {
      academic: "Word partnerships examiners reward in Writing Task 2.",
      general: "Natural word combinations that make every sentence sound right.",
    },
    count: { academic: "900+", general: "650+" },
    countLabel: "collocations",
    icon: Link2,
    tone: "forest",
  },
  {
    key: "slangs",
    title: "Slangs",
    blurb: {
      academic: "Informal expressions to recognise — and when to avoid them.",
      general: "Authentic slang for Speaking — sound human, not robotic.",
    },
    count: { academic: "120+", general: "180+" },
    countLabel: "expressions",
    icon: MessageCircle,
    tone: "ochre",
  },
];

const tonesAcademic: Record<VocabCard["tone"], { bg: string; bgHover: string }> = {
  indigo: { bg: "oklch(0.42 0.18 260)", bgHover: "oklch(0.46 0.18 260)" },
  rust: { bg: "oklch(0.48 0.16 230)", bgHover: "oklch(0.52 0.16 230)" },
  plum: { bg: "oklch(0.45 0.18 290)", bgHover: "oklch(0.49 0.18 290)" },
  forest: { bg: "oklch(0.50 0.15 200)", bgHover: "oklch(0.54 0.15 200)" },
  ochre: { bg: "oklch(0.55 0.16 250)", bgHover: "oklch(0.59 0.16 250)" },
};

const tonesGeneral: Record<VocabCard["tone"], { bg: string; bgHover: string }> = {
  indigo: { bg: "oklch(0.55 0.18 35)", bgHover: "oklch(0.59 0.18 35)" },
  rust: { bg: "oklch(0.58 0.20 25)", bgHover: "oklch(0.62 0.20 25)" },
  plum: { bg: "oklch(0.50 0.18 15)", bgHover: "oklch(0.54 0.18 15)" },
  forest: { bg: "oklch(0.55 0.16 60)", bgHover: "oklch(0.59 0.16 60)" },
  ochre: { bg: "oklch(0.65 0.17 70)", bgHover: "oklch(0.69 0.17 70)" },
};

function VocabularyPage() {
  const { module } = Route.useSearch();
  const isAcademic = module === "academic";
  const tones = isAcademic ? tonesAcademic : tonesGeneral;

  // When a child route like /vocabulary/$category is active,
  // render the child instead of the cards landing page.
  const matches = useMatches();
  const hasChildMatch = matches.some(
    (m) => m.routeId !== "/vocabulary" && m.routeId.startsWith("/vocabulary/"),
  );
  if (hasChildMatch) {
    return <Outlet />;
  }
  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(0.93 0.03 0)", color: "oklch(0.20 0.05 0)", ["--foreground" as any]: "oklch(0.20 0.05 0)", ["--muted-foreground" as any]: "oklch(0.40 0.04 0)" }}>
      <main className="relative py-12 sm:py-16">
        <BackButton to="/dashboard" ariaLabel="Back to Dashboard" />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">

          {/* Hero — handwritten headline matching dashboard style */}
          <div className="text-center">
            <div className="relative inline-block">
              <h1
                className="font-handwriting text-5xl font-bold leading-[0.95] text-foreground/55 sm:text-6xl md:text-7xl"
                style={{ transform: "rotate(-2deg)" }}
              >
                Vocabulary Builder
              </h1>

              <svg
                aria-hidden
                viewBox="0 0 300 14"
                preserveAspectRatio="none"
                className="absolute -bottom-3 left-0 h-3 w-full text-foreground/55 sm:-bottom-4 sm:h-4"
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

          {/* Module pill */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-4 py-1.5 shadow-soft">
              <span className="h-2 w-2 rounded-full" style={{ background: tones.indigo.bg }} />
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-foreground/70">
                IELTS {isAcademic ? "Academic" : "General"}
              </span>
            </div>
          </div>

          {/* Section label */}
          <div className="mt-12 mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-foreground/15" />
            <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-foreground/50">
              Five Word Banks
            </span>
            <span className="h-px w-10 bg-foreground/15" />
          </div>

          {/* Cards */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <VocabularyCard key={c.key} card={c} module={module} tones={tones} />
            ))}
          </div>

          <p className="mt-12 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40">
            Curated for IELTS · Updated regularly · Examiner-approved
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function VocabularyCard({
  card,
  module,
  tones,
}: {
  card: VocabCard;
  module: Module;
  tones: Record<VocabCard["tone"], { bg: string; bgHover: string }>;
}) {
  const tone = tones[card.tone];
  const Icon = card.icon;
  const isAcademic = module === "academic";

  return (
    <Link
      to="/vocabulary/$category"
      params={{ category: card.key }}
      search={{ module }}
      className="group relative flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-2xl p-5 text-left text-white shadow-[0_2px_4px_oklch(0.20_0.04_60/0.06),0_10px_24px_-14px_oklch(0.20_0.04_60/0.25)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_4px_8px_oklch(0.20_0.04_60/0.10),0_20px_40px_-18px_oklch(0.20_0.04_60/0.40)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2"
    >
      {/* Solid color background */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-colors duration-300"
        style={{ background: tone.bg }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: tone.bgHover }}
      />
      {/* Soft white shine */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_80%_at_100%_0%,rgba(255,255,255,0.20)_0%,transparent_55%)]"
      />
      {/* Film-grain noise — matches dashboard cards */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      {/* Top: icon + arrow */}
      <div className="relative flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6 text-white" strokeWidth={2.4} />
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20 transition-all duration-300 group-hover:bg-white/20 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="h-4 w-4 text-white" strokeWidth={2.6} />
        </span>
      </div>

      {/* Bottom: title + count */}
      <div className="relative mt-6">
        <h3 className="font-display text-2xl font-black leading-tight tracking-tight text-white sm:text-[26px]">
          {card.title}
        </h3>
        <p className="mt-2 max-w-[26ch] text-[13px] font-medium leading-snug text-white/85">
          {card.blurb[isAcademic ? "academic" : "general"]}
        </p>
        <div className="mt-4 inline-flex items-baseline gap-1.5 rounded-full bg-white/15 px-3 py-1 ring-1 ring-inset ring-white/20">
          <span className="font-display text-sm font-black tracking-tight text-white">
            {card.count[isAcademic ? "academic" : "general"]}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
            {card.countLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

