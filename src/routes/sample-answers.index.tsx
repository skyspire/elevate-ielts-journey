import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import { UpgradeToAllAccessPopup } from "@/components/site/UpgradeToAllAccessPopup";
import {
  useIeltsType,
  getPurchasedTypes,
  type IeltsType,
} from "@/lib/ielts-type";
import { useLearnerSession } from "@/lib/learner-auth";

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
  to?: string; // existing destination
  comingSoon?: boolean;
};

const MODULE_CARDS: ModuleCard[] = [
  {
    id: "listening",
    label: "Listening",
    blurb: "Section-by-section transcripts with key-word highlights and answer rationales.",
    meta: "Coming soon",
    icon: Headphones,
    comingSoon: true,
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
];

// Per-type accent palette — drives tile tint when that type is active.
const TYPE_ACCENT: Record<IeltsType, { solid: string; soft: string; ring: string; chip: string }> = {
  academic: {
    solid: "oklch(0.55 0.2 255)",
    soft: "oklch(0.94 0.06 255)",
    ring: "oklch(0.55 0.2 255 / 0.35)",
    chip: "oklch(0.92 0.13 85)",
  },
  general: {
    solid: "oklch(0.55 0.18 28)",
    soft: "oklch(0.95 0.05 30)",
    ring: "oklch(0.55 0.18 28 / 0.35)",
    chip: "oklch(0.88 0.14 30)",
  },
};

function SampleAnswersHubPage() {
  const search = Route.useSearch();
  const { user } = useLearnerSession();
  const { type: activeType, select } = useIeltsType();

  const purchased = useMemo(() => (user ? getPurchasedTypes(user.id) : []), [user]);
  const ownsAcademic = purchased.includes("academic");
  const ownsGeneral = purchased.includes("general");

  // Default the toggle to a purchased type on mount (paid side unlocked by default).
  useEffect(() => {
    if (search.module) return;
    if (purchased.length === 0) return;
    if (!purchased.includes(activeType)) {
      select(purchased[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const module: IeltsType = search.module ?? activeType;

  useEffect(() => {
    if (search.module && search.module !== activeType) {
      select(search.module);
    }
  }, [search.module, activeType, select]);

  const isAcademic = module === "academic";
  const accent = TYPE_ACCENT[module];
  const isGuest = !user;
  const ownsCurrent = isAcademic ? ownsAcademic : ownsGeneral;
  // Locked-state: signed-in user who hasn't purchased this side. Guests stay unlocked
  // for browsing (they get gated deeper at the answer/quota layer).
  const typeLocked = !isGuest && !ownsCurrent;

  const [showUpgrade, setShowUpgrade] = useState(false);

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

            <h1 className="mt-7 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Choose your IELTS,
              <br />
              <span className="text-foreground/55">then pick a module.</span>
            </h1>

            {/* Compass toggle */}
            <div className="mt-7 inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-white p-1 shadow-soft">
              {(["academic", "general"] as const).map((t) => {
                const active = module === t;
                const owns = t === "academic" ? ownsAcademic : ownsGeneral;
                const showLock = !isGuest && !owns;
                const Icon = t === "academic" ? GraduationCap : Briefcase;
                const tAccent = TYPE_ACCENT[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => select(t)}
                    className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-[12px] font-extrabold tracking-tight transition-colors ${
                      active
                        ? "text-white"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                    style={active ? { backgroundColor: tAccent.solid } : undefined}
                    aria-pressed={active}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.6} />
                    {t === "academic" ? "Academic" : "General"}
                    {showLock ? (
                      <Lock
                        className={`h-3 w-3 ${active ? "text-white/90" : "text-foreground/40"}`}
                        strokeWidth={2.6}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locked-type unlock bar */}
          {typeLocked ? (
            <div
              className="mt-10 flex flex-col items-start gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
              style={{
                borderColor: accent.ring,
                backgroundColor: accent.soft,
              }}
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

          <div
            className={`mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 transition-[filter,opacity] duration-300 ${
              typeLocked ? "pointer-events-auto blur-[2px] opacity-80" : ""
            }`}
          >
            {MODULE_CARDS.map((m) => (
              <ModuleTile
                key={m.id}
                module={m}
                ieltsType={module}
                accent={accent}
                typeLocked={typeLocked}
                onLockedClick={() => setShowUpgrade(true)}
              />
            ))}
          </div>
        </div>
      </main>

      <div className="mt-16">
        <Footer />
      </div>

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

function ModuleTile({
  module,
  ieltsType,
  accent,
  typeLocked,
  onLockedClick,
}: {
  module: ModuleCard;
  ieltsType: IeltsType;
  accent: (typeof TYPE_ACCENT)[IeltsType];
  typeLocked: boolean;
  onLockedClick: () => void;
}) {
  const Icon = module.icon;
  const comingSoon = !!module.comingSoon;

  const Inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-soft transition-colors"
          style={{ backgroundColor: accent.solid }}
        >
          <Icon className="h-6 w-6" strokeWidth={2.4} />
        </span>
        {comingSoon ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground/8 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-foreground/55">
            Soon
          </span>
        ) : typeLocked ? (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white"
            style={{ backgroundColor: accent.solid }}
          >
            <Lock className="h-3 w-3" strokeWidth={2.8} />
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
        <span className="h-px w-5" style={{ backgroundColor: accent.solid, opacity: 0.7 }} />
        {module.meta}
      </div>
    </>
  );

  const baseClass =
    "group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-white p-6 text-left shadow-soft transition-all";

  const style = { borderColor: accent.ring } as React.CSSProperties;

  if (comingSoon) {
    return (
      <div
        className={`${baseClass} cursor-not-allowed opacity-75`}
        style={style}
        aria-disabled="true"
      >
        {Inner}
      </div>
    );
  }

  if (typeLocked) {
    return (
      <button
        type="button"
        onClick={onLockedClick}
        className={`${baseClass} cursor-pointer hover:-translate-y-0.5`}
        style={style}
      >
        {Inner}
      </button>
    );
  }

  return (
    <Link
      to={module.to!}
      search={{ module: ieltsType }}
      className={`${baseClass} hover:-translate-y-0.5 hover:shadow-card`}
      style={style}
    >
      {Inner}
    </Link>
  );
}
