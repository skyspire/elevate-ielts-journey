import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  GraduationCap,
  Lock,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { z } from "zod";
import { Footer } from "@/components/site/Footer";
import { FreeEbookCta } from "@/components/site/FreeEbookCta";
import { BackButton } from "@/components/site/BackButton";
import { UpgradeToAllAccessPopup } from "@/components/site/UpgradeToAllAccessPopup";
import { StickyTrackBar } from "@/components/site/StickyTrackBar";
import { IeltsTypeSelector } from "@/components/site/IeltsTypeSelector";
import {
  useIeltsType,
  getPurchasedTypes,
  type IeltsType,
} from "@/lib/ielts-type";
import { useLearnerSession } from "@/lib/learner-auth";
import { task2Prompts, task1GeneralPrompts, task1AcademicPrompts } from "@/data/writing-prompts";
import { speakingTopicsByCategory } from "@/data/speaking-topics";
import { DottedTintPanel } from "@/components/site/DottedTintPanel";
import { TopTypeGradient } from "@/components/site/TopTypeGradient";
import { SpeakingSampleModal } from "@/components/site/SpeakingSampleModal";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional(),
  selected: z.enum(["listening", "reading", "writing", "speaking"]).optional(),
});

// ───────── Writing types/categories (mirror writing-samples) ─────────
const WRITING_TASK1_ACADEMIC = [
  { id: "line-graph", label: "Line Graph" },
  { id: "bar-chart", label: "Bar Chart" },
  { id: "pie-chart", label: "Pie Chart" },
  { id: "table", label: "Table" },
  { id: "process-diagram", label: "Process Diagram" },
  { id: "map", label: "Map" },
  { id: "multiple-charts", label: "Multiple Charts" },
];
const WRITING_TASK1_GENERAL = [
  { id: "formal", label: "Formal Letters" },
  { id: "informal", label: "Informal Letters" },
];
const WRITING_TASK2 = [
  { id: "opinion", label: "Opinion" },
  { id: "discussion", label: "Discussion" },
  { id: "advdis", label: "Advantages & Disadvantages" },
  { id: "problem", label: "Problem & Solution" },
  { id: "direct", label: "Direct Question" },
  { id: "posneg", label: "Positive or Negative" },
  { id: "cause", label: "Cause and Effect" },
];

const ALL_WRITING_PROMPTS: Record<string, string[]> = {
  ...task2Prompts,
  ...task1GeneralPrompts,
  ...task1AcademicPrompts,
};

// ───────── Speaking parts/categories (mirror speaking-samples) ─────────
const SPEAKING_GENERAL_CATS = [
  { id: "things", label: "Things" },
  { id: "activities", label: "Activities" },
  { id: "places", label: "Places" },
  { id: "people", label: "People" },
  { id: "experiences", label: "Experiences" },
  { id: "future-plans", label: "Future Plans" },
];
const SPEAKING_CUECARD_CATS = [
  { id: "cc-people", label: "People" },
  { id: "cc-places", label: "Places & Locations" },
  { id: "cc-buildings", label: "Buildings & Structures" },
  { id: "cc-objects", label: "Objects & Things" },
  { id: "cc-events", label: "Events & Experiences" },
  { id: "cc-activities", label: "Activities" },
  { id: "cc-study-work", label: "Study & Work" },
  { id: "cc-opinions", label: "Opinions & Abstract" },
  { id: "cc-future", label: "Future & Hypothetical" },
  { id: "cc-media", label: "Media & Entertainment" },
  { id: "cc-travel", label: "Travel & Tourism" },
  { id: "cc-lifestyle", label: "Habits & Lifestyle" },
  { id: "cc-tech", label: "Technology & Innovation" },
  { id: "cc-society", label: "Society & Culture" },
];

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
  to?: string;
  comingSoon?: boolean;
};

const MODULE_CARDS: ModuleCard[] = [
  {
    id: "writing",
    label: "Writing",
    blurb: "Task 1 & Task 2 prompts with full Band 8+ model essays and examiner notes.",
    meta: "600+ samples",
    icon: PenLine,
    to: "/writing-samples",
  },
  {
    id: "speaking",
    label: "Speaking",
    blurb: "Part 1, 2 & 3 questions with annotated Band 8+ model responses and follow-ups.",
    meta: "300+ samples",
    icon: Mic,
    to: "/speaking-samples",
  },
  {
    id: "reading",
    label: "Reading",
    blurb: "Passage walkthroughs with question-type strategies and worked solutions.",
    meta: "Coming soon",
    icon: BookOpen,
    comingSoon: true,
  },
  {
    id: "listening",
    label: "Listening",
    blurb: "Section-by-section transcripts with key-word highlights and answer rationales.",
    meta: "Coming soon",
    icon: Headphones,
    comingSoon: true,
  },
];

const TYPE_ACCENT: Record<
  IeltsType,
  { solid: string; soft: string; ring: string; highlight: string; text: string }
> = {
  academic: {
    solid: "oklch(0.50 0.18 255)",
    soft: "oklch(0.95 0.05 255)",
    ring: "oklch(0.50 0.18 255 / 0.35)",
    highlight: "oklch(0.88 0.10 250)",
    text: "text-[oklch(0.42_0.18_255)]",
  },
  general: {
    solid: "oklch(0.55 0.18 28)",
    soft: "oklch(0.95 0.05 30)",
    ring: "oklch(0.55 0.18 28 / 0.35)",
    highlight: "oklch(0.88 0.12 30)",
    text: "text-[oklch(0.45_0.16_28)]",
  },
};

// Pastel palette per module — matches homepage Latest Questions treatment
const MODULE_PALETTE: Record<
  ModuleId,
  { active: string; soft: string; ink: string; ring: string; icon: string }
> = {
  writing:   { active: "#c8ebd4", soft: "#e6f5ec", ink: "#1f3b2a", ring: "#9ed7b3", icon: "✍️" },
  speaking:  { active: "#fbd7be", soft: "#fdeadd", ink: "#4a2a17", ring: "#f2b98f", icon: "🎙" },
  reading:   { active: "#dfd0f2", soft: "#ece2f8", ink: "#2f2246", ring: "#c4aee5", icon: "📖" },
  listening: { active: "#fbe8b0", soft: "#fdf3d3", ink: "#4a3a10", ring: "#efd27a", icon: "🎧" },
};

function SampleAnswersHubPage() {
  const search = Route.useSearch();
  const { user } = useLearnerSession();
  const { type: activeType, select } = useIeltsType();

  const purchased = useMemo(() => (user ? getPurchasedTypes(user.id) : []), [user]);
  const ownsAcademic = purchased.includes("academic");
  const ownsGeneral = purchased.includes("general");

  // SSR-safe: render a stable default until mounted to avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // On mount, default the compass to the user's purchased type.
  useEffect(() => {
    if (search.module) return;
    if (purchased.length === 0) return;
    if (!purchased.includes(activeType)) select(purchased[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const module: IeltsType = search.module ?? (mounted ? activeType : "academic");

  useEffect(() => {
    if (search.module && search.module !== activeType) select(search.module);
  }, [search.module, activeType, select]);

  const isAcademic = module === "academic";
  const accent = TYPE_ACCENT[module];
  const isGuest = !user;
  const ownsCurrent = isAcademic ? ownsAcademic : ownsGeneral;
  const typeLocked = !isGuest && !ownsCurrent;

  const [showUpgrade, setShowUpgrade] = useState(false);
  const navigate = useNavigate({ from: "/sample-answers" });
  const selected: ModuleId = (search.selected as ModuleId | undefined) ?? "writing";
  const contentRef = useRef<HTMLDivElement | null>(null);

  const onSelectModule = (id: ModuleId) => {
    if (typeLocked) {
      setShowUpgrade(true);
      return;
    }
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({
        ...prev,
        selected: prev.selected === id ? undefined : id,
      }),
      replace: true,
    });
    requestAnimationFrame(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#faf7f0", color: "oklch(0.22 0.03 85)", ["--foreground" as any]: "oklch(0.22 0.03 85)", ["--muted-foreground" as any]: "oklch(0.40 0.025 85)" }}>
      

      <header
        className="sticky top-0 z-40 border-b border-foreground/8 backdrop-blur-xl"
        style={{ backgroundColor: "color-mix(in oklab, oklch(0.98 0.005 95) 85%, transparent)" }}
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
          {/* Hero — mirrors speaking-samples */}
          <div className="text-center">
            <h2
              className={`relative mt-4 inline-block font-display font-black leading-[0.95] tracking-[-0.02em] ${accent.text}`}
              style={{ fontSize: "clamp(2.25rem, 8vw, 5rem)" }}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className={`absolute -left-5 -top-2 h-5 w-5 sm:-left-10 sm:-top-4 sm:h-7 sm:w-7 ${accent.text} opacity-70`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18M3 12h18" />
                <circle cx="12" cy="12" r="9" />
              </svg>

              IELTS{" "}
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute inset-x-[-6px] bottom-[6%] -z-10 h-[58%] -rotate-1 opacity-70"
                  style={{
                    backgroundColor: accent.highlight,
                    clipPath: "polygon(1% 8%, 99% 2%, 100% 92%, 0% 98%)",
                  }}
                />
                <span className="relative">
                  {isAcademic ? "Academic" : "General"}
                </span>

                <svg
                  aria-hidden
                  viewBox="0 0 300 22"
                  preserveAspectRatio="none"
                  className={`absolute -bottom-3 left-0 h-3 w-full ${accent.text}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14 C 60 4, 140 20, 210 8 S 290 14, 296 10" />
                </svg>
              </span>
            </h2>

            <h1 className="mt-8 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Sample Answers
              <br />
              <span className="text-foreground/55">Choose your IELTS.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium leading-relaxed text-foreground/65 sm:text-base">
              Pick your IELTS type, then a module. We'll show you Band 8+ model
              answers written by our qualified IELTS team.
            </p>
          </div>

          {/* Compact integrated chooser bar — type + modules on one row */}
          <div className="mt-8 sm:mt-10">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 rounded-2xl border border-foreground/10 bg-white/60 p-3 shadow-soft backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-3">
              <div className="shrink-0">
                <IeltsTypeSelector
                  value={module}
                  onChange={(t) => select(t)}
                  lockedAcademic={!isGuest && !ownsAcademic}
                  lockedGeneral={!isGuest && !ownsGeneral}
                />
              </div>
              <div className="hidden h-10 w-px bg-foreground/10 sm:block" />
              <div className={`min-w-0 flex-1 transition-[filter,opacity] duration-300 ${typeLocked ? "blur-[2px] opacity-80" : ""}`}>
                <ModuleTabs
                  value={selected}
                  accent={accent}
                  onChange={onSelectModule}
                />
              </div>
            </div>
          </div>

          {/* Locked-type unlock bar */}
          {typeLocked ? (
            <div
              className="mt-6 flex flex-col items-start gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
              style={{ borderColor: accent.ring, backgroundColor: accent.soft }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-soft"
                  style={{ backgroundColor: accent.solid }}
                >
                  <Lock className="h-4 w-4" strokeWidth={2.6} />
                </span>
                <div>
                  <p className="font-display text-[15px] font-extrabold leading-tight tracking-tight text-foreground">
                    Unlock IELTS {isAcademic ? "Academic" : "General Training"} with All Access
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-foreground/65">
                    Your current plan covers {isAcademic ? "General Training" : "Academic"}. Upgrade to study both.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgrade(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 font-display text-[12px] font-extrabold uppercase tracking-[0.14em] text-white shadow-soft transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: accent.solid }}
              >
                Upgrade
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.8} />
              </button>
            </div>
          ) : null}

          {/* Inline content — renders immediately for default module */}
          <div ref={contentRef} className="scroll-mt-24">
            <ModuleContent
              moduleId={selected}
              ieltsType={module}
              accent={accent}
              palette={MODULE_PALETTE[selected]}
            />
          </div>

          <div className="pb-20 sm:pb-28" />
        </div>
      </main>

      <FreeEbookCta />
      <Footer />

      <UpgradeToAllAccessPopup
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentType={isAcademic ? "general" : "academic"}
        wantedType={module}
        guest={isGuest}
      />
    </div>
  );
}

// ───────── Module tabs row (icon + label + accent underline, pic-1 style) ─────────
function ModuleTabs({
  value,
  accent,
  onChange,
}: {
  value: ModuleId | null;
  accent: (typeof TYPE_ACCENT)[IeltsType];
  onChange: (id: ModuleId) => void;
}) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <div className="flex min-w-max flex-wrap items-center justify-center gap-3 sm:min-w-0 sm:gap-4">
        {MODULE_CARDS.map(({ id, label, comingSoon }) => {
          const active = value === id;
          const p = MODULE_PALETTE[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-pressed={active}
              className="group inline-flex shrink-0 items-center gap-3 rounded-full border-2 px-6 py-4 font-display text-base font-extrabold tracking-tight transition-all duration-300 sm:px-8 sm:py-5 sm:text-lg"
              style={{
                backgroundColor: active ? p.active : "#ffffff",
                borderColor: active ? p.ring : "rgba(0,0,0,0.08)",
                color: active ? p.ink : "#2a2a2a",
                boxShadow: active
                  ? `0 10px 24px -14px ${p.ring}`
                  : "0 2px 0 0 rgba(0,0,0,0.06)",
                transform: active ? "translateY(-1px)" : "none",
                opacity: comingSoon && !active ? 0.65 : 1,
              }}
            >
              <span className="text-xl sm:text-2xl" aria-hidden>{p.icon}</span>
              <span>{label}</span>
              {comingSoon && (
                <span className="ml-1 rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ───────── Mini compass toggle for two question types (pic-2 style, compact) ─────────
function MiniCompassToggle<T extends string>({
  options,
  value,
  onChange,
  accent,
  caption = "Pick type",
}: {
  options: readonly [{ id: T; label: string }, { id: T; label: string }];
  value: T;
  onChange: (v: T) => void;
  accent: (typeof TYPE_ACCENT)[IeltsType];
  caption?: string;
}) {
  const [left, right] = options;
  const isLeft = value === left.id;
  const isRight = value === right.id;
  const needleDeg = isLeft ? -90 : isRight ? 90 : 0;

  const item = (active: boolean, onClick: () => void, label: string, align: "left" | "right") => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group block bg-transparent p-1 sm:p-2 ${
        align === "left" ? "text-left" : "text-right"
      } transition-opacity duration-300 ${active ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
    >
      <div className={`flex flex-col ${align === "left" ? "items-start" : "items-end"} gap-1.5`}>
        <h4
          className={`font-display font-extrabold leading-tight tracking-tight ${
            active ? "text-foreground" : "text-foreground/70"
          }`}
          style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.5rem)" }}
        >
          {label}
        </h4>
        <span
          aria-hidden
          className={`block h-px transition-all duration-500 ${active ? "w-12 sm:w-16" : "w-6 bg-foreground/15"}`}
          style={active ? { backgroundColor: accent.solid } : undefined}
        />
      </div>
    </button>
  );

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-6">
        <div className="flex justify-end">{item(isLeft, () => onChange(left.id), left.label, "right")}</div>

        <div className="relative flex flex-col items-center justify-center" style={{ width: "clamp(88px, 12vw, 112px)" }}>
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full drop-shadow-[0_4px_8px_oklch(0.30_0.06_45_/_0.35)]"
            style={{ width: "clamp(88px, 12vw, 112px)", height: "clamp(88px, 12vw, 112px)" }}
            aria-label="Question type compass"
          >
            <defs>
              <radialGradient id="brassRimMini" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="oklch(0.88 0.12 80)" />
                <stop offset="45%" stopColor="oklch(0.72 0.13 70)" />
                <stop offset="80%" stopColor="oklch(0.52 0.11 55)" />
                <stop offset="100%" stopColor="oklch(0.38 0.08 45)" />
              </radialGradient>
              <radialGradient id="compassFaceMini" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.96 0.03 85)" />
                <stop offset="70%" stopColor="oklch(0.90 0.05 80)" />
                <stop offset="100%" stopColor="oklch(0.80 0.07 70)" />
              </radialGradient>
              <linearGradient id="needleNMini" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.55 0.20 30)" />
                <stop offset="100%" stopColor="oklch(0.40 0.16 25)" />
              </linearGradient>
              <linearGradient id="needleSMini" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.45 0.04 60)" />
                <stop offset="100%" stopColor="oklch(0.30 0.03 55)" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#brassRimMini)" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.38 0.08 45)" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="40" fill="url(#compassFaceMini)" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x1 = 50 + Math.sin(a) * 36;
              const y1 = 50 - Math.cos(a) * 36;
              const x2 = 50 + Math.sin(a) * (i % 3 === 0 ? 30 : 33);
              const y2 = 50 - Math.cos(a) * (i % 3 === 0 ? 30 : 33);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.30 0.05 45)" strokeWidth={i % 3 === 0 ? 1.2 : 0.6} strokeLinecap="round" />
              );
            })}
            <g
              style={{
                transformOrigin: "50px 50px",
                transform: `rotate(${needleDeg}deg)`,
                transition: "transform 750ms cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
            >
              <polygon points="50,12 46,50 54,50" fill="url(#needleNMini)" stroke="oklch(0.30 0.12 25)" strokeWidth="0.4" />
              <polygon points="50,88 46,50 54,50" fill="url(#needleSMini)" stroke="oklch(0.22 0.02 55)" strokeWidth="0.4" />
            </g>
            <circle cx="50" cy="50" r="3.2" fill="oklch(0.75 0.13 75)" stroke="oklch(0.38 0.08 45)" strokeWidth="0.6" />
            <circle cx="49.2" cy="49.2" r="1" fill="oklch(0.95 0.06 85)" opacity="0.85" />
          </svg>
          <span className="relative z-10 mt-1.5 font-display text-[8px] font-black uppercase tracking-[0.18em] text-foreground/55 sm:text-[9px]">
            {caption}
          </span>
        </div>

        <div className="flex justify-start">{item(isRight, () => onChange(right.id), right.label, "left")}</div>
      </div>
    </div>
  );
}

// ───────── Inline content panel: question types → categories → questions ─────────
function ModuleContent({
  moduleId,
  ieltsType,
  accent,
  palette,
}: {
  moduleId: ModuleId;
  ieltsType: IeltsType;
  accent: (typeof TYPE_ACCENT)[IeltsType];
  palette: (typeof MODULE_PALETTE)[ModuleId];
}) {
  if (moduleId === "listening" || moduleId === "reading") {
    return (
      <div
        className="mt-10 rounded-2xl border-2 border-dashed p-8 text-center"
        style={{ borderColor: palette.ring, backgroundColor: palette.soft }}
      >
        <Clock className="mx-auto h-7 w-7" strokeWidth={2.2} style={{ color: palette.ink }} />
        <h3 className="mt-3 font-display text-xl font-extrabold tracking-tight" style={{ color: palette.ink }}>
          {moduleId === "listening" ? "Listening" : "Reading"} samples — coming soon
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] font-medium" style={{ color: palette.ink, opacity: 0.75 }}>
          Our team is finalising Band 8+ transcripts, key-word highlights and worked solutions. Sit tight — they'll appear here first.
        </p>
      </div>
    );
  }

  if (moduleId === "writing") {
    return <WritingInline ieltsType={ieltsType} accent={accent} palette={palette} />;
  }

  return <SpeakingInline accent={accent} palette={palette} />;
}

// ───────── Writing inline drilldown ─────────
function WritingInline({
  ieltsType,
  accent,
  palette,
}: {
  ieltsType: IeltsType;
  accent: (typeof TYPE_ACCENT)[IeltsType];
  palette: (typeof MODULE_PALETTE)[ModuleId];
}) {
  type Task = "task1" | "task2";
  const [task, setTask] = useState<Task>("task2");
  const task1Cats = ieltsType === "academic" ? WRITING_TASK1_ACADEMIC : WRITING_TASK1_GENERAL;
  const cats = task === "task1" ? task1Cats : WRITING_TASK2;
  const [catId, setCatId] = useState<string>(cats[0].id);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCatId((task === "task1" ? task1Cats : WRITING_TASK2)[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, ieltsType]);

  const prompts = ALL_WRITING_PROMPTS[catId] ?? [];

  return (
    <div className="mt-10">
      <StickyTrackBar
        leftLabel="Task 1"
        rightLabel="Task 2"
        needleDeg={task === "task1" ? -90 : 90}
        onLeft={() => setTask("task1")}
        onRight={() => setTask("task2")}
        accentColor={accent.solid}
        triggerRef={triggerRef}
        pills={cats.map((c) => ({
          id: c.id,
          label: c.label,
          active: catId === c.id,
          onClick: () => setCatId(c.id),
        }))}
      />

      <SectionEyebrow accent={accent} label={`Writing · ${ieltsType === "academic" ? "Academic" : "General Training"}`} />

      <div ref={triggerRef}>
        {/* Task compass toggle (pic-2 style) */}
        <div className="mt-6">
          <MiniCompassToggle
            options={[
              { id: "task1", label: "Task 1" },
              { id: "task2", label: "Task 2" },
            ] as const}
            value={task}
            onChange={(v) => setTask(v)}
            accent={accent}
            caption="Pick task"
          />
        </div>

        {/* Category chips + question grid sit on a tinted dotted panel */}
        <DottedTintPanel className="mt-6 py-10 sm:py-12">
          <div className="container-page">
            <div className="flex flex-wrap justify-center gap-2.5">
              {cats.map((c) => (
                <Pill key={c.id} active={catId === c.id} accent={accent} onClick={() => setCatId(c.id)}>
                  {c.label}
                </Pill>
              ))}
            </div>

            {prompts.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-foreground/10 bg-white p-5 text-center text-[13px] font-medium text-foreground/50 shadow-soft">
                Prompts coming soon for this category.
              </p>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {prompts.map((statement, i) => {
                  const qId = `${catId}-${i + 1}`;
                  return (
                    <NumberedTile
                      key={qId}
                      index={i + 1}
                      label={statement}
                      accent={accent}
                      palette={palette}
                      to="/writing-samples/$questionId"
                      params={{ questionId: qId }}
                      search={{ module: ieltsType }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </DottedTintPanel>
      </div>
    </div>
  );
}

// ───────── Speaking inline drilldown ─────────
function SpeakingInline({ accent, palette }: { accent: (typeof TYPE_ACCENT)[IeltsType]; palette: (typeof MODULE_PALETTE)[ModuleId] }) {
  type Mode = "general" | "cuecards";
  const [mode, setMode] = useState<Mode>("general");
  const cats = mode === "general" ? SPEAKING_GENERAL_CATS : SPEAKING_CUECARD_CATS;
  const [catId, setCatId] = useState<string>(cats[0].id);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [modalTopic, setModalTopic] = useState<{ id: string; label: string } | null>(null);

  useEffect(() => {
    setCatId((mode === "general" ? SPEAKING_GENERAL_CATS : SPEAKING_CUECARD_CATS)[0].id);
  }, [mode]);

  const topics = speakingTopicsByCategory[catId] ?? [];

  return (
    <div className="mt-10">
      <StickyTrackBar
        leftLabel="General"
        rightLabel="Cue Cards"
        needleDeg={mode === "general" ? -90 : 90}
        onLeft={() => setMode("general")}
        onRight={() => setMode("cuecards")}
        accentColor={accent.solid}
        triggerRef={triggerRef}
        pills={cats.map((c) => ({
          id: c.id,
          label: c.label,
          active: catId === c.id,
          onClick: () => setCatId(c.id),
        }))}
      />

      <SectionEyebrow accent={accent} label="Speaking" />

      <div ref={triggerRef}>
        {/* Format compass toggle (pic-2 style) */}
        <div className="mt-6">
          <MiniCompassToggle
            options={[
              { id: "general", label: "General (Part 1 & 3)" },
              { id: "cuecards", label: "Cue Cards (Part 2)" },
            ] as const}
            value={mode}
            onChange={(v) => setMode(v)}
            accent={accent}
            caption="Pick format"
          />
        </div>

        <DottedTintPanel className="mt-6 py-10 sm:py-12">
          <div className="container-page">
            <div className="flex flex-wrap justify-center gap-2.5">
              {cats.map((c) => (
                <Pill key={c.id} active={catId === c.id} accent={accent} onClick={() => setCatId(c.id)}>
                  {c.label}
                </Pill>
              ))}
            </div>

            {topics.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-foreground/10 bg-white p-5 text-center text-[13px] font-medium text-foreground/50 shadow-soft">
                Topics coming soon.
              </p>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((t, i) => (
                  <NumberedTile
                    key={t.id}
                    index={i + 1}
                    label={t.label}
                    accent={accent}
                    palette={palette}
                    onClick={() => setModalTopic({ id: t.id, label: t.label })}
                  />
                ))}
              </div>
            )}
          </div>
        </DottedTintPanel>
      </div>

      {modalTopic && (
        <SpeakingSampleModal
          open={!!modalTopic}
          onClose={() => setModalTopic(null)}
          categoryId={catId}
          topic={modalTopic}
        />
      )}
    </div>
  );
}

function Pill({
  children,
  active,
  accent,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  accent: (typeof TYPE_ACCENT)[IeltsType];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="relative overflow-hidden rounded-full px-5 py-2.5 text-center font-sans text-[14px] font-bold tracking-tight transition-all duration-200"
      style={{
        minWidth: 120,
        backgroundColor: active ? accent.solid : "oklch(0.62 0.008 250)",
        color: "white",
        border: "none",
        transform: active ? "translateY(-1px)" : "translateY(0)",
        boxShadow: active
          ? `0 10px 22px -10px ${accent.solid}, 0 2px 0 0 oklch(0 0 0 / 0.25)`
          : "0 2px 0 0 oklch(0 0 0 / 0.35), 0 6px 14px -8px oklch(0 0 0 / 0.35)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.55), transparent)",
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}

function SectionEyebrow({
  accent,
  label,
}: {
  accent: (typeof TYPE_ACCENT)[IeltsType];
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-px w-8" style={{ backgroundColor: accent.solid }} />
      <span className="font-display text-[10px] font-black uppercase tracking-[0.22em] text-foreground/60">
        {label}
      </span>
    </div>
  );
}

// ───────── Numbered tile (matches speaking-samples Pick-a-topic style) ─────────
function NumberedTile({
  index,
  label,
  accent,
  palette,
  to,
  params,
  search,
  onClick,
}: {
  index: number;
  label: string;
  accent: (typeof TYPE_ACCENT)[IeltsType];
  palette?: (typeof MODULE_PALETTE)[ModuleId];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  to?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search?: any;
  onClick?: () => void;
}) {
  const idx = String(index).padStart(2, "0");
  const fill = palette?.soft ?? "#ffffff";
  const accentFill = palette?.active ?? "rgba(0,0,0,0.04)";
  const ring = palette?.ring ?? "rgba(0,0,0,0.10)";
  const ink = palette?.ink ?? "oklch(0.28 0.01 250)";
  const cls =
    "group relative flex h-full w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const style = {
    ['--tw-ring-color' as never]: accent.solid,
    backgroundColor: fill,
    borderColor: ring,
    boxShadow: `0 8px 20px -16px ${ring}`,
  };
  const inner = (
    <>
      <div
        className="flex w-14 shrink-0 items-start justify-center px-2 pt-5 pb-4 sm:w-16 sm:pt-6"
        style={{ backgroundColor: accentFill, borderRight: `1px solid ${ring}` }}
      >
        <span
          className="font-display text-xl font-black tracking-tight sm:text-2xl"
          style={{ color: ink, opacity: 0.75 }}
        >
          {idx}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-4 py-5 sm:px-5">
        <p
          className="font-display font-black leading-snug tracking-tight"
          style={{ color: ink, fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
        >
          {label}
        </p>
      </div>
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} style={style}>
        {inner}
      </button>
    );
  }
  return (
    <Link to={to} params={params} search={search} className={cls} style={style}>
      {inner}
    </Link>
  );
}
