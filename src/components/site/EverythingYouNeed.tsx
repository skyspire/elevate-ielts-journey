import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  BookOpen,
  PenLine,
  Library,
  AlertTriangle,
  Globe2,
  TrendingUp,
  Star,
  Flame,
} from "lucide-react";

type Feature = {
  key: string;
  label: string;
  title: string;
  description: string;
  icon: typeof FileText;
  accent: string;
  accentSoft: string;
  badge: string;
};

const FEATURES: Feature[] = [
  {
    key: "recent",
    label: "Recent Exam Questions",
    title: "Recent exam questions from around the world",
    description:
      "Verified questions reported by real test-takers across 40+ countries — updated every month.",
    icon: FileText,
    accent: "oklch(0.55 0.16 255)",
    accentSoft: "oklch(0.95 0.04 255)",
    badge: "Updated April 2026",
  },
  {
    key: "predictions",
    label: "Prediction Questions",
    title: "Predictions for your next exam",
    description:
      "AI-ranked topics most likely to appear, based on the last 12 months of question rotation patterns.",
    icon: Sparkles,
    accent: "oklch(0.55 0.18 295)",
    accentSoft: "oklch(0.95 0.04 295)",
    badge: "AI-ranked",
  },
  {
    key: "ebooks",
    label: "E-Books",
    title: "E-books for serious study",
    description:
      "Deep-dive guides written by Band 9 examiners — frameworks, vocabulary, pronunciation, grammar.",
    icon: BookOpen,
    accent: "oklch(0.58 0.15 35)",
    accentSoft: "oklch(0.95 0.04 35)",
    badge: "12 titles",
  },
  {
    key: "samples",
    label: "Writing & Speaking Samples",
    title: "Hundreds of model answers",
    description:
      "Band 8 & 9 responses with examiner annotations — see exactly what makes a high-scoring answer.",
    icon: PenLine,
    accent: "oklch(0.5 0.13 165)",
    accentSoft: "oklch(0.94 0.04 165)",
    badge: "600+ samples",
  },
  {
    key: "vocabulary",
    label: "Curated Vocabulary",
    title: "Curated vocabulary that scores",
    description:
      "High-yield collocations and lexical chunks examiners reward — grouped by topic with examples.",
    icon: Library,
    accent: "oklch(0.55 0.16 230)",
    accentSoft: "oklch(0.95 0.04 230)",
    badge: "30 topics",
  },
  {
    key: "mistakes",
    label: "Catastrophic Mistakes",
    title: "The catastrophic mistakes list",
    description:
      "The exact errors that drag a 7.5 down to a 6.5 — learn what to never do, with real examples.",
    icon: AlertTriangle,
    accent: "oklch(0.55 0.18 25)",
    accentSoft: "oklch(0.94 0.05 25)",
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
        {/* Two-column header + lead */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* LEFT: Sticky title column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
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
              <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
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
              <p className="mt-5 text-base font-medium text-muted-foreground sm:text-lg">
                Six focused resources, built by Band 9 examiners. No fluff, no
                recycled content — just what actually moves your score.
              </p>

              {/* Trust strip */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">4.9/5</span>
                  <span className="text-muted-foreground">from 2,400+ learners</span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Globe2 className="h-4 w-4" style={{ color: "oklch(0.55 0.16 255)" }} />
                  <span className="font-bold">40+</span>
                  <span className="text-muted-foreground">countries</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Feature cards */}
          <div className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {FEATURES.map((f, idx) => (
                <FeatureTile key={f.key} feature={f} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Feature tile with custom illustrated mock ---------- */

function FeatureTile({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border bg-white p-5 transition-all"
      style={{
        borderColor: `${feature.accent}20`,
        boxShadow: `0 12px 32px -16px ${feature.accent}45`,
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${feature.accent}, ${feature.accent}30)`,
        }}
      />

      {/* Visual mock area */}
      <div
        className="relative h-44 overflow-hidden rounded-2xl p-4"
        style={{
          background: `linear-gradient(135deg, ${feature.accentSoft} 0%, white 100%)`,
        }}
      >
        <FeatureMock feature={feature} />
      </div>

      {/* Content */}
      <div className="mt-5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: `${feature.accent}15`,
              color: feature.accent,
            }}
          >
            <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: `${feature.accent}12`,
              color: feature.accent,
            }}
          >
            {feature.badge}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-extrabold leading-tight tracking-tight text-foreground">
          {feature.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- Per-feature visual mocks ---------- */

function FeatureMock({ feature }: { feature: Feature }) {
  switch (feature.key) {
    case "recent":
      return <RecentMock accent={feature.accent} />;
    case "predictions":
      return <PredictionsMock accent={feature.accent} />;
    case "ebooks":
      return <EbooksMock accent={feature.accent} />;
    case "samples":
      return <SamplesMock accent={feature.accent} />;
    case "vocabulary":
      return <VocabMock accent={feature.accent} />;
    case "mistakes":
      return <MistakesMock accent={feature.accent} />;
    default:
      return null;
  }
}

function RecentMock({ accent }: { accent: string }) {
  const items = [
    { flag: "🇦🇺", tag: "Environment", date: "Apr 12" },
    { flag: "🇬🇧", tag: "Education", date: "Apr 8" },
    { flag: "🇨🇦", tag: "Technology", date: "Apr 5" },
  ];
  return (
    <div className="flex h-full flex-col gap-2">
      {items.map((it, i) => (
        <motion.div
          key={it.tag}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.08 }}
          className="flex items-center gap-2.5 rounded-lg bg-white px-2.5 py-2 shadow-sm"
          style={{ border: `1px solid ${accent}15` }}
        >
          <span className="text-base leading-none">{it.flag}</span>
          <span
            className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
            style={{ background: `${accent}15`, color: accent }}
          >
            {it.tag}
          </span>
          <span className="ml-auto text-[10px] font-medium text-muted-foreground">
            {it.date}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function PredictionsMock({ accent }: { accent: string }) {
  const items = [
    { topic: "Online learning", chance: 92 },
    { topic: "Remote work", chance: 85 },
    { topic: "Plastic pollution", chance: 78 },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2.5">
      {items.map((it, i) => (
        <div key={it.topic} className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-foreground">{it.topic}</span>
            <span className="font-display font-extrabold tabular-nums" style={{ color: accent }}>
              {it.chance}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: `${accent}15` }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${it.chance}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${accent}, oklch(0.7 0.15 320))`,
              }}
            />
          </div>
        </div>
      ))}
      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold" style={{ color: accent }}>
        <TrendingUp className="h-3 w-3" />
        Likelihood for May 2026
      </div>
    </div>
  );
}

function EbooksMock({ accent }: { accent: string }) {
  const books = [
    { t: "Task 2 Frameworks", r: -8 },
    { t: "Graph Vocabulary", r: 0 },
    { t: "Speaking Part 2", r: 8 },
  ];
  return (
    <div className="flex h-full items-center justify-center gap-2">
      {books.map((b, i) => (
        <motion.div
          key={b.t}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.1 }}
          className="relative flex h-32 w-20 flex-col justify-between rounded-md p-2 text-white"
          style={{
            background: `linear-gradient(160deg, ${accent}, oklch(0.4 0.12 35))`,
            boxShadow: `0 8px 18px -6px ${accent}60`,
            transform: `rotate(${b.r}deg)`,
          }}
        >
          <div className="text-[8px] font-bold uppercase tracking-widest opacity-70">
            E-book
          </div>
          <div className="font-display text-[10px] font-extrabold leading-tight">
            {b.t}
          </div>
          <div
            className="absolute inset-y-1 left-1 w-1 rounded-full opacity-30"
            style={{ background: "white" }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function SamplesMock({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg bg-white p-2.5 shadow-sm" style={{ border: `1px solid ${accent}15` }}>
      <div className="flex items-center justify-between">
        <span
          className="rounded-md px-1.5 py-0.5 text-[9px] font-bold"
          style={{ background: `${accent}15`, color: accent }}
        >
          TASK 2 · BAND 8.5
        </span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
      <div className="space-y-1 text-[10px] leading-snug text-foreground">
        <p>
          While some argue that{" "}
          <span className="rounded px-0.5" style={{ background: `${accent}25` }}>
            individual actions yield negligible
          </span>{" "}
          impact, I would contend that{" "}
          <span className="rounded px-0.5" style={{ background: `${accent}25` }}>
            collective behavioural shifts
          </span>{" "}
          can drive systemic change...
        </p>
      </div>
      <div className="flex gap-1">
        {["CC 9", "LR 8", "GR 9"].map((t) => (
          <span
            key={t}
            className="rounded border px-1 py-0.5 text-[8px] font-bold text-muted-foreground"
            style={{ borderColor: `${accent}30` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function VocabMock({ accent }: { accent: string }) {
  const words = ["detrimental", "exacerbate", "ubiquitous", "mitigate", "paramount", "negligible"];
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        Topic · Environment
      </div>
      <div className="flex flex-wrap gap-1.5">
        {words.map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-md px-2 py-0.5 font-display text-[10px] font-bold"
            style={{
              background: "white",
              color: accent,
              border: `1px solid ${accent}30`,
              boxShadow: `0 2px 6px -2px ${accent}30`,
            }}
          >
            {w}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function MistakesMock({ accent }: { accent: string }) {
  const mistakes = [
    "Memorising entire essays",
    "Robotic phrases",
    "Going off-topic",
    "Repeating the question",
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {mistakes.map((m, i) => (
        <motion.div
          key={m}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.07 }}
          className="flex items-center gap-2 rounded-md bg-white px-2 py-1.5 shadow-sm"
          style={{ border: `1px solid ${accent}20` }}
        >
          <Flame className="h-3 w-3 shrink-0" style={{ color: accent }} />
          <span className="text-[10px] font-medium text-foreground line-through opacity-60">
            {m}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
