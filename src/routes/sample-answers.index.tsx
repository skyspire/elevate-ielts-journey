import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  GraduationCap,
  Briefcase,
  Lock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { Footer } from "@/components/site/Footer";
import { BackButton } from "@/components/site/BackButton";
import { TypeGate } from "@/components/site/TypeGate";
import { useIeltsType, type IeltsType } from "@/lib/ielts-type";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional(),
});

export const Route = createFileRoute("/sample-answers/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Band 8+ Sample Answers — BigIELTS.com" },
      {
        name: "description",
        content:
          "Browse Band 8+ IELTS sample answers across Listening, Reading, Writing and Speaking. Annotated by our qualified IELTS team.",
      },
      { property: "og:title", content: "Band 8+ Sample Answers — BigIELTS.com" },
      {
        property: "og:description",
        content:
          "All four IELTS modules with Band 8+ model answers. Pick your IELTS type, then pick a module.",
      },
    ],
  }),
  component: SampleAnswersHubPage,
});

type ModuleId = "listening" | "reading" | "writing" | "speaking";

type ModuleCard = {
  id: ModuleId;
  label: string;
  blurb: string;
  meta: string;
  icon: typeof PenLine;
  accent: string; // oklch tint for the card icon halo
  to?: string; // existing destination
  isPaid?: boolean;
};

const MODULE_CARDS: ModuleCard[] = [
  {
    id: "listening",
    label: "Listening",
    blurb: "Section-by-section transcripts with key-word highlights and answer rationales.",
    meta: "Premium access",
    icon: Headphones,
    accent: "oklch(0.62 0.16 250)",
    isPaid: true,
  },
  {
    id: "reading",
    label: "Reading",
    blurb: "Passage walkthroughs with question-type strategies and worked solutions.",
    meta: "Premium access",
    icon: BookOpen,
    accent: "oklch(0.60 0.16 165)",
    isPaid: true,
  },
  {
    id: "writing",
    label: "Writing",
    blurb: "Task 1 & Task 2 prompts with full Band 8+ model essays and examiner notes.",
    meta: "600+ samples",
    icon: PenLine,
    accent: "oklch(0.58 0.18 28)",
    to: "/writing-samples",
  },
  {
    id: "speaking",
    label: "Speaking",
    blurb: "Part 1, 2 & 3 questions with annotated Band 8+ model responses and follow-ups.",
    meta: "300+ samples",
    icon: Mic,
    accent: "oklch(0.58 0.16 320)",
    to: "/speaking-samples",
  },
];

function SampleAnswersHubPage() {
  const search = Route.useSearch();
  const { type: activeType, select } = useIeltsType();
  // Allow ?module=academic|general to override active type for deep links.
  const module: IeltsType = search.module ?? activeType;

  // Keep global active type in sync if user opened a deep-link.
  useEffect(() => {
    if (search.module && search.module !== activeType) {
      select(search.module);
    }
  }, [search.module, activeType, select]);

  const isAcademic = module === "academic";
  const accentText = isAcademic ? "text-brand" : "text-[oklch(0.45_0.15_28)]";

  const pageBg = "oklch(0.985 0.005 95)";
  const grain =
    "radial-gradient(circle at 1px 1px, oklch(0.20 0 0 / 0.06) 1px, transparent 0)";

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: pageBg }}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{ backgroundImage: grain, backgroundSize: "3px 3px" }}
      />

      <header
        className="sticky top-0 z-40 border-b border-foreground/8 backdrop-blur-xl"
        style={{ backgroundColor: `color-mix(in oklab, ${pageBg} 85%, transparent)` }}
      >
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              BigIELTS.com
            </span>
          </Link>
          <BackButton
            to="/dashboard"
            ariaLabel="Back to Dashboard"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-white text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          />
        </div>
      </header>

      <main className="relative z-[1] pt-10 sm:pt-14">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Hero */}
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/60 shadow-soft">
              <Sparkles className="h-3 w-3" />
              Band 8+ Sample Answers
            </span>

            <h2
              className={`relative mt-6 inline-block font-display font-black leading-[0.95] tracking-[-0.02em] ${accentText}`}
              style={{ fontSize: "clamp(2.25rem, 8vw, 5rem)" }}
            >
              IELTS{" "}
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className={`absolute inset-x-[-6px] bottom-[6%] -z-10 h-[58%] -rotate-1 ${
                    isAcademic
                      ? "bg-[oklch(0.92_0.13_85)]"
                      : "bg-[oklch(0.88_0.14_30)]"
                  } opacity-70`}
                  style={{ clipPath: "polygon(1% 8%, 99% 2%, 100% 92%, 0% 98%)" }}
                />
                <span className="relative">
                  {isAcademic ? "Academic" : "General Training"}
                </span>
              </span>
            </h2>

            <h1 className="mt-8 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Pick a module
              <br />
              <span className="text-foreground/55">to open its sample answers.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium leading-relaxed text-foreground/65 sm:text-base">
              All four IELTS modules. Drill into question types, then categories,
              then study Band 8+ model answers written by our qualified IELTS team.
            </p>

            {/* Type switch */}
            <div className="mt-7 inline-flex rounded-full border border-foreground/10 bg-white p-1 shadow-soft">
              {(["academic", "general"] as const).map((t) => {
                const active = module === t;
                const Icon = t === "academic" ? GraduationCap : Briefcase;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => select(t)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-display text-[12px] font-extrabold tracking-tight transition-colors ${
                      active
                        ? t === "academic"
                          ? "bg-brand text-brand-foreground"
                          : "bg-[oklch(0.50_0.16_28)] text-white"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.6} />
                    {t === "academic" ? "Academic" : "General"}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2">
            {MODULE_CARDS.map((m) => (
              <ModuleTile key={m.id} module={m} ieltsType={module} />
            ))}
          </div>
        </div>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

function ModuleTile({
  module,
  ieltsType,
}: {
  module: ModuleCard;
  ieltsType: IeltsType;
}) {
  const Icon = module.icon;
  const locked = !!module.isPaid;

  const Inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-soft"
          style={{ backgroundColor: module.accent }}
        >
          <Icon className="h-6 w-6" strokeWidth={2.4} />
        </span>
        {locked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-foreground/60">
            <Lock className="h-3 w-3" />
            Locked
          </span>
        ) : (
          <ArrowUpRight className="h-5 w-5 text-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </div>

      <div className="mt-5">
        <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          {module.label}
        </h3>
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-foreground/65">
          {module.blurb}
        </p>
      </div>

      <div className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/45">
        <span className="h-px w-5 bg-foreground/20" />
        {module.meta}
      </div>
    </>
  );

  const baseClass =
    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white p-6 text-left shadow-soft transition-all";

  if (locked) {
    return (
      <div className={`${baseClass} cursor-not-allowed opacity-75`} aria-disabled="true">
        {Inner}
      </div>
    );
  }

  return (
    <Link
      to={module.to!}
      search={{ module: ieltsType }}
      className={`${baseClass} hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-card`}
    >
      {Inner}
    </Link>
  );
}
