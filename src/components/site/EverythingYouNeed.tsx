import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  BookOpen,
  PenLine,
  Library,
  AlertTriangle,
  ArrowRight,
  Check,
} from "lucide-react";

type FeatureKey =
  | "recent"
  | "predictions"
  | "ebooks"
  | "samples"
  | "vocabulary"
  | "mistakes";

type Feature = {
  key: FeatureKey;
  label: string;
  short: string;
  icon: typeof FileText;
  accent: string; // oklch color for accent
  badge: string;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    key: "recent",
    label: "Recent Exam Questions",
    short: "From real test-takers",
    icon: FileText,
    accent: "oklch(0.62 0.16 255)",
    badge: "Verified · Apr 2026",
    title: "Recent exam questions from around the world",
    description:
      "Every month we collect and verify the questions that actually appeared in IELTS exams across 40+ countries — so you study what's really being asked.",
  },
  {
    key: "predictions",
    label: "Prediction Questions",
    short: "For your next exam",
    icon: Sparkles,
    accent: "oklch(0.6 0.18 295)",
    badge: "Updated weekly",
    title: "Predictions tuned for your test date",
    description:
      "Based on patterns from the last 12 months and the question pool rotation, we surface the topics most likely to appear in your upcoming sitting.",
  },
  {
    key: "ebooks",
    label: "E-Books",
    short: "For serious study",
    icon: BookOpen,
    accent: "oklch(0.58 0.14 35)",
    badge: "12 titles · PDF",
    title: "E-books for serious, structured prep",
    description:
      "Deep-dive guides on Task 1 graphs, Task 2 essay frameworks, Speaking part 2 cue cards, pronunciation, grammar — written by Band 9 examiners.",
  },
  {
    key: "samples",
    label: "Writing & Speaking Samples",
    short: "Hundreds of model answers",
    icon: PenLine,
    accent: "oklch(0.55 0.13 165)",
    badge: "600+ samples",
    title: "Hundreds of band 8 & 9 model answers",
    description:
      "Side-by-side examiner-graded responses with annotations: why this scored 8.5, what could've made it a 9, and which structures you can borrow.",
  },
  {
    key: "vocabulary",
    label: "Curated Vocabulary",
    short: "Topic-grouped lists",
    icon: Library,
    accent: "oklch(0.55 0.16 230)",
    badge: "30 topics",
    title: "Curated vocabulary that actually scores",
    description:
      "No 1000-word memorisation. Just the high-yield collocations and lexical chunks examiners reward — grouped by topic with usage examples.",
  },
  {
    key: "mistakes",
    label: "Catastrophic Mistakes",
    short: "What kills your band",
    icon: AlertTriangle,
    accent: "oklch(0.58 0.18 25)",
    badge: "Avoid these",
    title: "The catastrophic mistakes list",
    description:
      "The exact errors that drag a 7.5 down to a 6.5 — memorising essays, off-topic intros, robotic phrases. Learn what to never do, with real examples.",
  },
];

export function EverythingYouNeed() {
  const [active, setActive] = useState<FeatureKey>("recent");
  const current = FEATURES.find((f) => f.key === active)!;

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.985 0.012 75) 0%, oklch(0.97 0.018 295) 60%, oklch(0.96 0.025 290) 100%)",
      }}
    >
      {/* Soft glow accents */}
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
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "oklch(0.95 0.04 290)",
              color: "oklch(0.4 0.15 290)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Everything in one place
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
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
          <p className="mt-4 text-base font-medium text-muted-foreground sm:text-lg">
            Six focused resources, built by Band 9 examiners. No fluff, no recycled
            content — just what moves your score.
          </p>
        </div>

        {/* Tabbed showcase */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[320px,1fr] lg:gap-10">
          {/* Tab pills (left) */}
          <div className="flex flex-col gap-2">
            {FEATURES.map((f) => {
              const isActive = f.key === active;
              const Icon = f.icon;
              return (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all ${
                    isActive
                      ? "border-transparent bg-white shadow-card"
                      : "border-border/60 bg-white/40 hover:bg-white/70"
                  }`}
                  style={
                    isActive
                      ? {
                          borderLeft: `3px solid ${f.accent}`,
                          boxShadow: `0 8px 28px -12px ${f.accent}40`,
                        }
                      : undefined
                  }
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: isActive ? `${f.accent}18` : "oklch(0.96 0.01 290)",
                      color: f.accent,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-bold text-foreground">
                      {f.label}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {f.short}
                    </div>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 transition-all ${
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                    }`}
                    style={isActive ? { color: f.accent } : undefined}
                  />
                </button>
              );
            })}
          </div>

          {/* Preview panel (right) */}
          <div
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-white p-6 shadow-card sm:p-8"
            style={{
              boxShadow: `0 20px 60px -30px ${current.accent}50`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                    style={{
                      background: `${current.accent}15`,
                      color: current.accent,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: current.accent }}
                    />
                    {current.badge}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {current.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                  {current.description}
                </p>

                {/* Mini preview mock */}
                <div className="mt-6">
                  <FeaturePreview feature={current} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------- Per-feature mini previews (illustrated mocks) -------- */

function FeaturePreview({ feature }: { feature: Feature }) {
  switch (feature.key) {
    case "recent":
      return <RecentPreview accent={feature.accent} />;
    case "predictions":
      return <PredictionsPreview accent={feature.accent} />;
    case "ebooks":
      return <EbooksPreview accent={feature.accent} />;
    case "samples":
      return <SamplesPreview accent={feature.accent} />;
    case "vocabulary":
      return <VocabPreview accent={feature.accent} />;
    case "mistakes":
      return <MistakesPreview accent={feature.accent} />;
  }
}

function MockCard({
  children,
  accent,
  className = "",
}: {
  children: React.ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 ${className}`}
      style={{
        borderColor: `${accent}25`,
        boxShadow: `0 4px 16px -8px ${accent}30`,
      }}
    >
      {children}
    </div>
  );
}

function RecentPreview({ accent }: { accent: string }) {
  const items = [
    { tag: "Environment", country: "🇦🇺 Australia", date: "Apr 12, 2026" },
    { tag: "Education", country: "🇬🇧 UK", date: "Apr 8, 2026" },
    { tag: "Technology", country: "🇨🇦 Canada", date: "Apr 5, 2026" },
  ];
  return (
    <div className="grid gap-3">
      {items.map((it) => (
        <MockCard key={it.tag} accent={accent}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{ background: `${accent}15`, color: accent }}
              >
                {it.tag}
              </span>
              <span className="text-sm font-medium text-foreground">
                {it.country}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{it.date}</span>
          </div>
        </MockCard>
      ))}
    </div>
  );
}

function PredictionsPreview({ accent }: { accent: string }) {
  const items = [
    { topic: "Online learning vs traditional", chance: 92 },
    { topic: "Working from home", chance: 85 },
    { topic: "Plastic pollution", chance: 78 },
  ];
  return (
    <div className="grid gap-3">
      {items.map((it) => (
        <MockCard key={it.topic} accent={accent}>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-foreground">
                {it.topic}
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${it.chance}%`,
                    background: `linear-gradient(90deg, ${accent}, oklch(0.7 0.15 320))`,
                  }}
                />
              </div>
            </div>
            <div
              className="font-display text-lg font-extrabold tabular-nums"
              style={{ color: accent }}
            >
              {it.chance}%
            </div>
          </div>
        </MockCard>
      ))}
    </div>
  );
}

function EbooksPreview({ accent }: { accent: string }) {
  const books = [
    { title: "Task 2 Frameworks", pages: 84 },
    { title: "Graph Vocabulary", pages: 62 },
    { title: "Speaking Part 2", pages: 96 },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {books.map((b) => (
        <div
          key={b.title}
          className="relative aspect-[3/4] overflow-hidden rounded-xl p-3 text-white"
          style={{
            background: `linear-gradient(160deg, ${accent}, oklch(0.4 0.12 35))`,
            boxShadow: `0 8px 20px -8px ${accent}60`,
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">
            E-book
          </div>
          <div className="mt-2 font-display text-sm font-extrabold leading-tight">
            {b.title}
          </div>
          <div className="absolute bottom-3 left-3 text-[11px] opacity-80">
            {b.pages} pages
          </div>
        </div>
      ))}
    </div>
  );
}

function SamplesPreview({ accent }: { accent: string }) {
  return (
    <MockCard accent={accent}>
      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          style={{ background: `${accent}15`, color: accent }}
        >
          Writing Task 2 · Sample
        </span>
        <span
          className="font-display text-sm font-extrabold"
          style={{ color: accent }}
        >
          Band 8.5
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        While some argue that{" "}
        <span
          className="rounded px-1"
          style={{ background: `${accent}20` }}
        >
          individual actions yield negligible impact
        </span>{" "}
        on environmental degradation, I would contend that collective behavioural
        shifts can{" "}
        <span
          className="rounded px-1"
          style={{ background: `${accent}20` }}
        >
          drive systemic change
        </span>
        ...
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Coherence 9", "Lexical 8", "Grammar 9"].map((t) => (
          <span
            key={t}
            className="rounded-md border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
            style={{ borderColor: `${accent}30` }}
          >
            {t}
          </span>
        ))}
      </div>
    </MockCard>
  );
}

function VocabPreview({ accent }: { accent: string }) {
  const words = [
    "detrimental",
    "exacerbate",
    "ubiquitous",
    "mitigate",
    "paramount",
    "negligible",
  ];
  return (
    <MockCard accent={accent}>
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Topic · Environment
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {words.map((w) => (
          <span
            key={w}
            className="rounded-lg px-2.5 py-1 font-display text-sm font-bold"
            style={{
              background: `${accent}12`,
              color: accent,
              border: `1px solid ${accent}25`,
            }}
          >
            {w}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-lg p-3 text-sm" style={{ background: `${accent}08` }}>
        <span className="font-bold" style={{ color: accent }}>
          mitigate
        </span>{" "}
        <span className="text-muted-foreground">— to make less severe.</span>
        <div className="mt-1 text-xs italic text-muted-foreground">
          "Governments must mitigate the effects of climate change."
        </div>
      </div>
    </MockCard>
  );
}

function MistakesPreview({ accent }: { accent: string }) {
  const mistakes = [
    "Memorising entire essays",
    "Robotic phrases like 'It is a fact that...'",
    "Going off-topic to use big words",
    "Repeating the question word-for-word",
  ];
  return (
    <div className="grid gap-2.5">
      {mistakes.map((m) => (
        <div
          key={m}
          className="flex items-center gap-3 rounded-xl border bg-white px-3.5 py-2.5"
          style={{ borderColor: `${accent}25` }}
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
            style={{ background: `${accent}18`, color: accent }}
          >
            <Check className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium text-foreground line-through opacity-70">
            {m}
          </span>
        </div>
      ))}
    </div>
  );
}
