import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SpeakingSampleModal } from "@/components/site/SpeakingSampleModal";
import {
  GraduationCap,
  MessageCircle,
  
  ArrowUpRight,
  Users,
  MapPin,
  Building2,
  Package,
  CalendarDays,
  Activity,
  Briefcase,
  Lightbulb,
  Rocket,
  Film,
  Plane,
  Coffee,
  Cpu,
  Globe2,
  type LucideProps,
} from "lucide-react";
import { z } from "zod";
import type { ComponentType } from "react";
import { Footer } from "@/components/site/Footer";
import { BackButton } from "@/components/site/BackButton";
import { StickyTrackBar } from "@/components/site/StickyTrackBar";
import { speakingTopicsByCategory } from "@/data/speaking-topics";
import { DottedTintPanel } from "@/components/site/DottedTintPanel";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
});

export const Route = createFileRoute("/speaking-samples/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Speaking Samples — BigIELTS.com" },
      {
        name: "description",
        content:
          "Browse Band 8+ IELTS Speaking samples. Choose between General Questions (Part 1 & 3) or Cue Cards & Follow-Ups (Part 2), and explore model answers with examiner-style follow-ups.",
      },
      { property: "og:title", content: "Speaking Samples — BigIELTS.com" },
      {
        property: "og:description",
        content:
          "Band 8+ IELTS Speaking samples organised by part and theme.",
      },
    ],
  }),
  component: SpeakingSamplesPage,
});

type Module = "academic" | "general";
type Mode = "general" | "cuecards";

type Category = {
  id: string;
  label: string;
  hint: string;
  icon: ComponentType<LucideProps>;
};

const categoriesByMode: Record<Mode, Category[]> = {
  general: [
    { id: "things", label: "Things", hint: "Objects, gifts, items", icon: MessageCircle },
    { id: "activities", label: "Activities", hint: "Hobbies & routines", icon: MessageCircle },
    { id: "places", label: "Places", hint: "Hometown, cities, spaces", icon: MessageCircle },
    { id: "people", label: "People", hint: "Family, friends, role models", icon: MessageCircle },
    { id: "experiences", label: "Experiences", hint: "Memories & moments", icon: MessageCircle },
    { id: "future-plans", label: "Future Plans", hint: "Goals & aspirations", icon: MessageCircle },
  ],
  cuecards: [
    { id: "cc-people", label: "People", hint: "Friends, mentors, family", icon: Users },
    { id: "cc-places", label: "Places & Locations", hint: "Cities, rooms, spaces", icon: MapPin },
    { id: "cc-buildings", label: "Buildings & Structures", hint: "Landmarks & architecture", icon: Building2 },
    { id: "cc-objects", label: "Objects & Things", hint: "Gifts, gadgets, possessions", icon: Package },
    { id: "cc-events", label: "Events & Experiences", hint: "Memorable moments", icon: CalendarDays },
    { id: "cc-activities", label: "Activities", hint: "Hobbies & routines", icon: Activity },
    { id: "cc-study-work", label: "Study & Work", hint: "School, jobs, careers", icon: Briefcase },
    { id: "cc-opinions", label: "Opinions & Abstract", hint: "Ideas, values, choices", icon: Lightbulb },
    { id: "cc-future", label: "Future & Hypothetical", hint: "Plans & possibilities", icon: Rocket },
    { id: "cc-media", label: "Media & Entertainment", hint: "Films, music, shows", icon: Film },
    { id: "cc-travel", label: "Travel & Tourism", hint: "Trips, holidays, places", icon: Plane },
    { id: "cc-lifestyle", label: "Habits & Lifestyle", hint: "Routines & wellbeing", icon: Coffee },
    { id: "cc-tech", label: "Technology & Innovation", hint: "Apps, gadgets, AI", icon: Cpu },
    { id: "cc-society", label: "Society & Culture", hint: "Traditions & change", icon: Globe2 },
  ],
};


function SpeakingSamplesPage() {
  const search = Route.useSearch();
  const module: Module = search.module ?? "general";
  const [mode, setMode] = useState<Mode | null>(null);
  const fallbackCategories = categoriesByMode["general"];
  const categories = mode ? categoriesByMode[mode] : fallbackCategories;
  const [categoryId, setCategoryId] = useState<string>(fallbackCategories[0].id);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Flip Expansion state
  const [flipOpen, setFlipOpen] = useState(false);
  const [flipTopic, setFlipTopic] = useState<{ id: string; label: string } | null>(null);
  const [flipCategoryId, setFlipCategoryId] = useState<string>(fallbackCategories[0].id);

  const handleOpenFlip = (
    topic: { id: string; label: string },
    catId: string,
    _rect: DOMRect,
  ) => {
    setFlipTopic(topic);
    setFlipCategoryId(catId);
    setFlipOpen(true);
  };

  const onModeChange = (next: Mode) => {
    setMode(next);
    setCategoryId(categoriesByMode[next][0].id);
  };

  // Speaking samples uses a sage/teal accent to feel distinct from Writing Samples
  const accentText = "text-[oklch(0.42_0.10_165)]";
  const accentChip =
    "bg-[oklch(0.94_0.04_165)] text-[oklch(0.38_0.10_165)] border-[oklch(0.55_0.10_165)]/30";
  const accentRing =
    "ring-[oklch(0.55_0.10_165)]/45 border-[oklch(0.55_0.10_165)]/45";

  const activeCategory = categories.find((c) => c.id === categoryId) ?? categories[0];
  const topics = speakingTopicsByCategory[activeCategory.id] ?? [];

  // Page cream base + soft green top gradient that fades into cream
  const pageBg = "oklch(0.985 0.005 95)";
  const topTint = "oklch(0.94 0.06 165)"; // pale sage/mint green

  return (
    <div className="relative flex min-h-screen flex-col" style={{ backgroundColor: pageBg }}>
      {/* Wrapper for header + main — gradient lives here so the Footer stays plain */}
      <div className="relative flex-1">
        {/* Soft green top gradient — fades into cream */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 z-0 w-screen -translate-x-1/2"
          style={{
            height: 720,
            background: `linear-gradient(to bottom, ${topTint} 0%, ${pageBg} 100%)`,
          }}
        />

        {/* Top bar */}
        <header
          className="sticky top-0 z-40 border-b border-foreground/8 backdrop-blur-xl"
          style={{ backgroundColor: `color-mix(in oklab, ${pageBg} 85%, transparent)` }}
        >
          <div className="container-page flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
                <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">BigIELTS.com</span>
            </Link>

            <BackButton
              to="/dashboard"
              ariaLabel="Back to Dashboard"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-white text-foreground/70 shadow-soft transition-colors hover:text-foreground"
            />
          </div>
        </header>

      <main className="relative z-[1] pt-10 sm:pt-14">
        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Massive eyebrow */}
          <div className="mt-4 text-center">
            <h2
              className={`relative inline-block font-display font-black leading-[0.95] tracking-[-0.02em] ${accentText}`}
              style={{ fontSize: "clamp(2.25rem, 8vw, 5rem)" }}
            >
              {/* Mic doodle */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className={`absolute -left-5 -top-2 h-5 w-5 sm:-left-10 sm:-top-4 sm:h-7 sm:w-7 ${accentText} opacity-70`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
              </svg>

              IELTS{" "}
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute inset-x-[-6px] bottom-[6%] -z-10 h-[58%] -rotate-1 bg-[oklch(0.88_0.10_165)] opacity-70"
                  style={{ clipPath: "polygon(1% 8%, 99% 2%, 100% 92%, 0% 98%)" }}
                />
                <span className="relative">Speaking</span>

                <svg
                  aria-hidden
                  viewBox="0 0 300 22"
                  preserveAspectRatio="none"
                  className={`absolute -bottom-3 left-0 h-3 w-full ${accentText}`}
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
              Speaking Samples
              <br />
              <span className="text-foreground/55">Choose your format.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium leading-relaxed text-foreground/65 sm:text-base">
              Pick a question style, then a theme. We'll show you Band 8+ model answers with examiner follow-ups.
            </p>
          </div>

          {mode && (
            <StickyTrackBar
              leftLabel="General"
              rightLabel="Cue Cards"
              needleDeg={mode === "general" ? -90 : 90}
              onLeft={() => onModeChange("general")}
              onRight={() => onModeChange("cuecards")}
              accentColor="oklch(0.50 0.10 165)"
              triggerRef={triggerRef}
              pills={categories.map((c) => ({
                id: c.id,
                label: c.label,
                active: categoryId === c.id,
                onClick: () => setCategoryId(c.id),
              }))}
            />
          )}

          {/* Step 1 — Big format toggle (General vs Cue Cards) */}
          <div className="mt-14 sm:mt-20">
            <FormatTogglePair mode={mode} onChange={onModeChange} />
          </div>

          {/* Steps 2 & 3 — gated until format is chosen */}
          {mode && (
            <DottedTintPanel className="mt-16 sm:mt-20">
              <div className="container-page py-10 sm:py-14">
                {/* Step 2 — Theme chips */}
                <div ref={triggerRef} className="flex flex-wrap justify-center gap-2.5">
                  {categories.map((c) => {
                    const active = categoryId === c.id;
                    const Icon = c.icon;
                    const activeClasses =
                      "bg-[oklch(0.50_0.10_165)] text-white border-[oklch(0.50_0.10_165)] shadow-soft";
                    const restingClasses =
                      "bg-card text-foreground/75 border-border hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground hover:shadow-soft";
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategoryId(c.id)}
                        aria-pressed={active}
                        className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-center font-display text-[14px] font-bold tracking-tight transition-all duration-200 ${
                          active ? activeClasses : restingClasses
                        }`}
                        style={{ minWidth: 120 }}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                        {c.label}
                      </button>
                    );
                  })}
                </div>

                {/* Step 3 — Topic cards */}
                <div className="relative mt-12 sm:mt-16">
                  <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-8 text-center">
                      <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/45">
                        {activeCategory.label} · {topics.length} topics
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        Pick a topic to explore
                      </h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {topics.map((t, i) => (
                        <TopicCard
                          key={t.id}
                          index={i + 1}
                          topic={t}
                          categoryId={activeCategory.id}
                          onOpen={handleOpenFlip}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DottedTintPanel>
          )}
        </div>
      </main>
      </div>
      <Footer />

      {flipTopic && (
        <SpeakingSampleModal
          open={flipOpen}
          onClose={() => setFlipOpen(false)}
          categoryId={flipCategoryId}
          topic={flipTopic}
        />
      )}
    </div>
  );
}

// ───────── Format toggle — vintage brass compass (matches Writing Samples) ─────────
function FormatTogglePair({
  mode,
  onChange,
}: {
  mode: Mode | null;
  onChange: (m: Mode) => void;
}) {
  const isGeneral = mode === "general";
  const isCue = mode === "cuecards";
  const noSelection = mode === null;

  const accentText = "text-[oklch(0.42_0.10_165)]";
  const accentRule = "bg-[oklch(0.50_0.10_165)]";

  const renderItem = (
    active: boolean,
    onClick: () => void,
    label: string,
    align: "left" | "right",
  ) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group block bg-transparent p-2 sm:p-4 ${
        align === "left" ? "text-left" : "text-right"
      } transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-50 hover:opacity-80"
      }`}
    >
      <div className={`flex flex-col ${align === "left" ? "items-start" : "items-end"} gap-2`}>
        <h3
          className={`font-display font-bold leading-tight tracking-tight ${
            active ? "text-foreground" : "text-foreground/70"
          }`}
          style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.5rem)" }}
        >
          {label}
        </h3>
        <span
          aria-hidden
          className={`block h-px transition-all duration-500 ${
            active ? `w-12 sm:w-16 ${accentRule}` : "w-6 bg-foreground/15"
          }`}
        />
      </div>
    </button>
  );

  // Needle: -90° = General (left), +90° = Cue Cards (right), 0 = idle (north)
  const needleDeg = isGeneral ? -90 : isCue ? 90 : 0;

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 sm:gap-10">
        <div className="flex justify-end">
          {renderItem(isGeneral, () => onChange("general"), "General Questions", "right")}
        </div>

        {/* Vintage brass compass */}
        <div
          className="relative flex flex-col items-center justify-center"
          style={{ width: "clamp(88px, 12vw, 112px)" }}
        >
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full drop-shadow-[0_4px_8px_oklch(0.30_0.06_45_/_0.35)]"
            style={{ width: "clamp(88px, 12vw, 112px)", height: "clamp(88px, 12vw, 112px)" }}
            aria-label="Compass selector"
          >
            <defs>
              <radialGradient id="brassRimSpk" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="oklch(0.88 0.12 80)" />
                <stop offset="45%" stopColor="oklch(0.72 0.13 70)" />
                <stop offset="80%" stopColor="oklch(0.52 0.11 55)" />
                <stop offset="100%" stopColor="oklch(0.38 0.08 45)" />
              </radialGradient>
              <radialGradient id="compassFaceSpk" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.96 0.03 85)" />
                <stop offset="70%" stopColor="oklch(0.90 0.05 80)" />
                <stop offset="100%" stopColor="oklch(0.80 0.07 70)" />
              </radialGradient>
              <linearGradient id="needleNSpk" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.55 0.20 30)" />
                <stop offset="100%" stopColor="oklch(0.40 0.16 25)" />
              </linearGradient>
              <linearGradient id="needleSSpk" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.45 0.04 60)" />
                <stop offset="100%" stopColor="oklch(0.30 0.03 55)" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="url(#brassRimSpk)" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="oklch(0.32 0.06 40)" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.38 0.08 45)" strokeWidth="0.8" />
            <circle cx="50" cy="50" r="40" fill="url(#compassFaceSpk)" />

            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x1 = 50 + Math.sin(a) * 36;
              const y1 = 50 - Math.cos(a) * 36;
              const x2 = 50 + Math.sin(a) * (i % 3 === 0 ? 30 : 33);
              const y2 = 50 - Math.cos(a) * (i % 3 === 0 ? 30 : 33);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="oklch(0.30 0.05 45)"
                  strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
                  strokeLinecap="round"
                />
              );
            })}

            <text x="50" y="18" textAnchor="middle" fontSize="7" fontWeight="800" fill="oklch(0.30 0.05 45)" fontFamily="serif">N</text>
            <text x="84" y="53" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">E</text>
            <text x="50" y="88" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">S</text>
            <text x="16" y="53" textAnchor="middle" fontSize="6" fontWeight="700" fill="oklch(0.35 0.05 45)" fontFamily="serif">W</text>

            <g
              style={{
                transformOrigin: "50px 50px",
                transform: `rotate(${needleDeg}deg)`,
                transition: "transform 850ms cubic-bezier(0.34, 1.3, 0.64, 1)",
              }}
            >
              <polygon points="50,12 46,50 54,50" fill="url(#needleNSpk)" stroke="oklch(0.30 0.12 25)" strokeWidth="0.4" />
              <polygon points="50,88 46,50 54,50" fill="url(#needleSSpk)" stroke="oklch(0.22 0.02 55)" strokeWidth="0.4" />
            </g>

            <circle cx="50" cy="50" r="3.2" fill="oklch(0.75 0.13 75)" stroke="oklch(0.38 0.08 45)" strokeWidth="0.6" />
            <circle cx="49.2" cy="49.2" r="1" fill="oklch(0.95 0.06 85)" opacity="0.85" />
          </svg>

          {noSelection && (
            <span
              className={`relative z-10 mt-2 font-display text-[9px] font-black uppercase tracking-[0.18em] sm:text-[10px] ${accentText}`}
            >
              Pick a Format
            </span>
          )}
        </div>

        <div className="flex justify-start">
          {renderItem(isCue, () => onChange("cuecards"), "Cue Cards & Follow-Ups", "left")}
        </div>
      </div>
    </div>
  );
}


// ───────── Topic row card — triggers FlipExpansion in-place ─────────
function TopicCard({
  index,
  topic,
  categoryId,
  onOpen,
}: {
  index: number;
  topic: { id: string; label: string };
  categoryId: string;
  onOpen: (
    topic: { id: string; label: string },
    catId: string,
    rect: DOMRect,
  ) => void;
}) {
  const idx = String(index).padStart(2, "0");
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect() ?? null;
    if (rect) onOpen(topic, categoryId, rect);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className="group relative flex h-full w-full overflow-hidden rounded-2xl border border-foreground/10 bg-card text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.50_0.10_165)] focus-visible:ring-offset-2"
      aria-label={`Open sample answer for ${topic.label}`}
    >
      {/* Left column — index */}
      <div className="flex w-16 shrink-0 items-start justify-center border-r border-foreground/10 bg-foreground/[0.025] px-3 pt-6 pb-5 sm:w-20">
        <span className="font-display text-2xl font-black tracking-tight text-foreground/45 transition-colors group-hover:text-foreground/70 sm:text-3xl">
          {idx}
        </span>
      </div>

      {/* Right column — topic name */}
      <div className="flex min-w-0 flex-1 items-center px-5 py-6 sm:px-6">
        <p
          className="font-display font-black leading-tight tracking-tight"
          style={{ color: "oklch(0.42 0.10 165)", fontSize: "clamp(1.2rem, 2.56vw, 1.5rem)" }}
        >
          {topic.label}
        </p>
      </div>
    </button>
  );
}

