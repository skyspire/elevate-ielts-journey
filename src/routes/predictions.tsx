import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PenLine,
  Mic,
  BookOpen,
  Headphones,
  Flame,
  TrendingUp,
  Lightbulb,
  Calendar,
  Lock,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { BackButton } from "@/components/site/BackButton";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "IELTS Predictions for Your Next Exam — BigIELTS" },
      {
        name: "description",
        content:
          "Topics most likely to appear in your next IELTS sitting — Writing, Speaking, Reading and Listening, ranked by likelihood and updated weekly by our IELTS specialists.",
      },
      { property: "og:title", content: "IELTS Predictions — BigIELTS" },
      {
        property: "og:description",
        content:
          "Predicted topics for the next IELTS exam, grouped by skill and ranked by likelihood. Updated weekly.",
      },
    ],
  }),
  component: PredictionsPage,
});

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type SkillKey = "writing" | "speaking" | "reading" | "listening";
type Tier = "hot" | "likely" | "review";

type Prediction = {
  tag: string;
  tagTone: "blue" | "mint" | "peach" | "lilac";
  type:
    | "Writing Task 1"
    | "Writing Task 2"
    | "Speaking Part 1"
    | "Speaking Part 2"
    | "Speaking Part 3";
  title: string;
  date: string;
  tier: Tier;
};

const PREDICTIONS: Record<SkillKey, Prediction[]> = {
  writing: [
    {
      tag: "Environment",
      tagTone: "mint",
      type: "Writing Task 2",
      title:
        "Some people believe individuals can do little to protect the environment. To what extent do you agree?",
      date: "Predicted for May 2026",
      tier: "hot",
    },
    {
      tag: "Education",
      tagTone: "blue",
      type: "Writing Task 2",
      title:
        "Many universities now offer online courses. Are the benefits greater than the drawbacks?",
      date: "Predicted for May 2026",
      tier: "hot",
    },
    {
      tag: "Bar Chart",
      tagTone: "peach",
      type: "Writing Task 1",
      title:
        "The chart compares household spending on leisure activities across four countries in 2024.",
      date: "Predicted for May 2026",
      tier: "hot",
    },
    {
      tag: "Technology",
      tagTone: "lilac",
      type: "Writing Task 2",
      title:
        "Some argue that smartphones harm face-to-face communication. Discuss both views and give your opinion.",
      date: "Predicted for May–June",
      tier: "likely",
    },
    {
      tag: "Process",
      tagTone: "peach",
      type: "Writing Task 1",
      title: "The diagram shows how recycled plastic bottles are turned into clothing fibres.",
      date: "Predicted for May–June",
      tier: "likely",
    },
    {
      tag: "Society",
      tagTone: "blue",
      type: "Writing Task 2",
      title:
        "In some countries the number of older people is rising. What problems does this cause and how can they be solved?",
      date: "Predicted for May–June",
      tier: "likely",
    },
    {
      tag: "Health",
      tagTone: "mint",
      type: "Writing Task 2",
      title:
        "Fast food is becoming increasingly popular. Do the disadvantages outweigh the advantages?",
      date: "Worth reviewing",
      tier: "review",
    },
    {
      tag: "Map",
      tagTone: "peach",
      type: "Writing Task 1",
      title: "Two maps showing changes in a coastal town between 2000 and 2024.",
      date: "Worth reviewing",
      tier: "review",
    },
  ],
  speaking: [
    {
      tag: "Hometown",
      tagTone: "lilac",
      type: "Speaking Part 1",
      title: "Describe your hometown and what you like most about it.",
      date: "Predicted for May 2026",
      tier: "hot",
    },
    {
      tag: "Memorable Trip",
      tagTone: "blue",
      type: "Speaking Part 2",
      title:
        "Describe a journey that did not go as planned. You should say where, when, who and why.",
      date: "Predicted for May 2026",
      tier: "hot",
    },
    {
      tag: "Technology",
      tagTone: "mint",
      type: "Speaking Part 3",
      title: "How has technology changed the way people communicate in your country?",
      date: "Predicted for May 2026",
      tier: "hot",
    },
    {
      tag: "Hobbies",
      tagTone: "peach",
      type: "Speaking Part 1",
      title: "What do you usually do in your free time? How long have you done it?",
      date: "Predicted for May–June",
      tier: "likely",
    },
    {
      tag: "A Person",
      tagTone: "lilac",
      type: "Speaking Part 2",
      title: "Describe a person who inspires you. Say who they are, how you know them and why.",
      date: "Predicted for May–June",
      tier: "likely",
    },
    {
      tag: "Food",
      tagTone: "mint",
      type: "Speaking Part 1",
      title: "What kind of food do you like to cook at home?",
      date: "Worth reviewing",
      tier: "review",
    },
  ],
  reading: [
    {
      tag: "Climate Science",
      tagTone: "mint",
      type: "Writing Task 2",
      title: "Long-form passage on coral reef bleaching and conservation responses.",
      date: "Predicted for May 2026",
      tier: "hot",
    },
    {
      tag: "Urban History",
      tagTone: "blue",
      type: "Writing Task 2",
      title: "Article tracing how a 19th-century city redesigned its public transport network.",
      date: "Predicted for May–June",
      tier: "likely",
    },
  ],
  listening: [
    {
      tag: "Section 2 — Tour",
      tagTone: "peach",
      type: "Speaking Part 2",
      title: "Guided tour of a community arts centre with map labelling.",
      date: "Predicted for May 2026",
      tier: "hot",
    },
    {
      tag: "Section 4 — Lecture",
      tagTone: "lilac",
      type: "Speaking Part 3",
      title: "Academic talk on sleep cycles and student performance.",
      date: "Predicted for May–June",
      tier: "likely",
    },
  ],
};

const SKILLS: { key: SkillKey; label: string; icon: typeof PenLine }[] = [
  { key: "writing", label: "Writing", icon: PenLine },
  { key: "speaking", label: "Speaking", icon: Mic },
  { key: "reading", label: "Reading", icon: BookOpen },
  { key: "listening", label: "Listening", icon: Headphones },
];

const TIERS: {
  key: Tier;
  label: string;
  helper: string;
  icon: typeof Flame;
  accent: string;
}[] = [
  {
    key: "hot",
    label: "Highly likely",
    helper: "Top picks for the next sitting — start here.",
    icon: Flame,
    accent: "oklch(0.62 0.18 35)",
  },
  {
    key: "likely",
    label: "Likely to appear",
    helper: "Strong candidates worth a focused practice round.",
    icon: TrendingUp,
    accent: "oklch(0.55 0.14 250)",
  },
  {
    key: "review",
    label: "Worth reviewing",
    helper: "Recurring themes — keep them warm in your prep.",
    icon: Lightbulb,
    accent: "oklch(0.55 0.10 100)",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function PredictionsPage() {
  const [skill, setSkill] = useState<SkillKey>("writing");

  const grouped = useMemo(() => {
    const list = PREDICTIONS[skill];
    return {
      hot: list.filter((p) => p.tier === "hot"),
      likely: list.filter((p) => p.tier === "likely"),
      review: list.filter((p) => p.tier === "review"),
    };
  }, [skill]);

  const daysToNext = useDaysToNextSaturday();

  const pageBg = "oklch(0.985 0.018 60)";
  const heroGradient = `radial-gradient(ellipse 70% 80% at 16% 0%, oklch(0.92 0.09 55 / 0.55) 0%, transparent 60%),
       radial-gradient(ellipse 65% 75% at 86% 10%, oklch(0.92 0.08 30 / 0.45) 0%, transparent 65%),
       linear-gradient(180deg, oklch(0.96 0.03 50 / 0.55) 0%, transparent 100%)`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: pageBg }}>
      <main className="relative py-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
          style={{ background: heroGradient }}
        />

        <BackButton to="/dashboard" ariaLabel="Back to Dashboard" />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Hero */}
          <div className="text-center">
            <div className="relative inline-block">
              <h1
                className="font-handwriting text-5xl font-bold leading-[0.95] text-foreground/55 sm:text-6xl md:text-7xl"
                style={{ transform: "rotate(-2deg)" }}
              >
                Predictions
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

            <div className="mx-auto mt-6 max-w-xl space-y-2">
              <p className="font-display text-lg font-black tracking-tight text-foreground sm:text-xl">
                Topics worth your time before the next sitting.
              </p>
              <p className="text-sm text-foreground/65 sm:text-[15px]">
                Hand-picked by our{" "}
                <span className="relative inline-block whitespace-nowrap font-semibold text-foreground">
                  <span
                    aria-hidden
                    className="absolute inset-x-[-2px] bottom-[2px] -z-0 h-[55%] -rotate-[1.5deg] rounded-[2px]"
                    style={{
                      background:
                        "linear-gradient(100deg, oklch(0.92 0.16 95 / 0.85) 0%, oklch(0.88 0.18 90 / 0.85) 60%, oklch(0.92 0.16 95 / 0.7) 100%)",
                    }}
                  />
                  <span className="relative">qualified IELTS team</span>
                </span>{" "}
                from twelve months of question rotation patterns — refreshed weekly.
              </p>
            </div>
          </div>

          {/* Countdown card — editorial, paper feel */}
          <div className="mt-10 flex justify-center">
            <CountdownCard days={daysToNext} />
          </div>

          {/* Skill tabs */}
          <div className="mt-12">
            <SkillTabs value={skill} onChange={setSkill} />
          </div>

          {/* Tiered groups */}
          <div className="mt-12 space-y-16">
            {TIERS.map((tier) => {
              const items = grouped[tier.key];
              if (items.length === 0) return null;
              return (
                <TierSection key={tier.key} tier={tier} items={items} />
              );
            })}

            {grouped.hot.length === 0 &&
              grouped.likely.length === 0 &&
              grouped.review.length === 0 && (
                <p className="text-center font-display text-lg font-bold text-foreground/60">
                  Fresh predictions land here every Monday.
                </p>
              )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Countdown                                                           */
/* ------------------------------------------------------------------ */

function useDaysToNextSaturday() {
  return useMemo(() => {
    const today = new Date();
    const day = today.getDay(); // 0 Sun … 6 Sat
    const diff = (6 - day + 7) % 7 || 7;
    return diff;
  }, []);
}

function CountdownCard({ days }: { days: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] border border-border bg-card px-6 py-5 shadow-soft sm:px-9 sm:py-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.99 0.01 80) 0%, oklch(0.97 0.03 60) 100%)",
      }}
    >
      <div className="flex items-center gap-5 sm:gap-7">
        <div className="text-center">
          <div className="font-display text-5xl font-black leading-none tracking-tight text-foreground sm:text-6xl">
            {days}
          </div>
          <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-foreground/55">
            {days === 1 ? "day" : "days"}
          </div>
        </div>
        <div className="h-12 w-px bg-border sm:h-14" aria-hidden />
        <div className="max-w-[240px]">
          <p className="font-display text-base font-extrabold tracking-tight text-foreground sm:text-lg">
            Until the next IELTS sitting
          </p>
          <p className="mt-1 text-xs font-medium text-foreground/65 sm:text-sm">
            Focus your prep on the highly-likely topics first.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skill tabs — editorial, no pill chips                               */
/* ------------------------------------------------------------------ */

function SkillTabs({
  value,
  onChange,
}: {
  value: SkillKey;
  onChange: (s: SkillKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-7 gap-y-3 border-b border-border/70 pb-3 sm:gap-x-12">
      {SKILLS.map(({ key, label, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className="group relative flex items-center gap-2 transition-opacity"
            style={{ opacity: active ? 1 : 0.5 }}
          >
            <Icon
              className="h-4 w-4 sm:h-5 sm:w-5"
              style={{ color: active ? "oklch(0.45 0.14 60)" : "currentColor" }}
            />
            <span className="font-display text-lg font-black tracking-tight text-foreground sm:text-2xl">
              {label}
            </span>
            {active && (
              <span
                aria-hidden
                className="absolute -bottom-[14px] left-0 right-0 h-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.70 0.16 60) 0%, oklch(0.55 0.18 35) 100%)",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tier section                                                        */
/* ------------------------------------------------------------------ */

function TierSection({
  tier,
  items,
}: {
  tier: { key: Tier; label: string; helper: string; icon: typeof Flame; accent: string };
  items: Prediction[];
}) {
  const Icon = tier.icon;
  return (
    <section>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              background: `color-mix(in oklab, ${tier.accent} 14%, transparent)`,
              color: tier.accent,
            }}
            aria-hidden
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {tier.label}
            </h2>
            <p className="text-sm font-medium text-foreground/65">{tier.helper}</p>
          </div>
        </div>
        <span className="font-handwriting text-xl text-foreground/45 sm:text-2xl">
          {items.length} {items.length === 1 ? "topic" : "topics"}
        </span>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <QuestionCard
            key={p.title}
            tag={p.tag}
            tagTone={p.tagTone}
            type={p.type}
            title={p.title}
            date={p.date}
            band="High likelihood"
          />
        ))}
      </div>
    </section>
  );
}
