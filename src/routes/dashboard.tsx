import { useState, type ComponentType } from "react";
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

// Academic = the classic 7 macaron tones
const tonesAcademic: Record<Feature["tone"], ToneShades> = {
  // Sky blue macaron
  navy:     { front: "oklch(0.88 0.07 235)", mid: "oklch(0.88 0.07 235)", deep: "oklch(0.42 0.16 245)", glow: "oklch(0.92 0.07 235)" },
  // Raspberry macaron
  rust:     { front: "oklch(0.86 0.09 18)",  mid: "oklch(0.86 0.09 18)",  deep: "oklch(0.46 0.18 22)",  glow: "oklch(0.90 0.09 18)"  },
  // Pistachio macaron
  forest:   { front: "oklch(0.89 0.08 145)", mid: "oklch(0.89 0.08 145)", deep: "oklch(0.42 0.14 150)", glow: "oklch(0.92 0.08 145)" },
  // Rose macaron
  plum:     { front: "oklch(0.88 0.08 350)", mid: "oklch(0.88 0.08 350)", deep: "oklch(0.46 0.18 350)", glow: "oklch(0.92 0.08 350)" },
  // Lemon macaron
  ochre:    { front: "oklch(0.93 0.10 95)",  mid: "oklch(0.93 0.10 95)",  deep: "oklch(0.50 0.14 80)",  glow: "oklch(0.95 0.10 95)"  },
  // Mint / aqua macaron
  teal:     { front: "oklch(0.89 0.07 195)", mid: "oklch(0.89 0.07 195)", deep: "oklch(0.44 0.13 200)", glow: "oklch(0.92 0.07 195)" },
  // Lavender macaron
  espresso: { front: "oklch(0.86 0.08 305)", mid: "oklch(0.86 0.08 305)", deep: "oklch(0.44 0.18 305)", glow: "oklch(0.90 0.08 305)" },
};

// General = warmer macaron set (peach, coral, butter, etc.)
const tonesGeneral: Record<Feature["tone"], ToneShades> = {
  // Peach macaron
  navy:     { front: "oklch(0.89 0.08 55)",  mid: "oklch(0.89 0.08 55)",  deep: "oklch(0.50 0.18 50)",  glow: "oklch(0.93 0.08 55)"  },
  // Coral macaron
  rust:     { front: "oklch(0.86 0.09 22)",  mid: "oklch(0.86 0.09 22)",  deep: "oklch(0.48 0.20 22)",  glow: "oklch(0.90 0.09 22)"  },
  // Matcha macaron
  forest:   { front: "oklch(0.91 0.09 130)", mid: "oklch(0.91 0.09 130)", deep: "oklch(0.48 0.16 135)", glow: "oklch(0.93 0.09 130)" },
  // Strawberry macaron
  plum:     { front: "oklch(0.87 0.08 10)",  mid: "oklch(0.87 0.08 10)",  deep: "oklch(0.48 0.18 10)",  glow: "oklch(0.91 0.08 10)"  },
  // Butter macaron
  ochre:    { front: "oklch(0.94 0.10 90)",  mid: "oklch(0.94 0.10 90)",  deep: "oklch(0.54 0.14 80)",  glow: "oklch(0.96 0.10 90)"  },
  // Powder blue macaron
  teal:     { front: "oklch(0.89 0.07 220)", mid: "oklch(0.89 0.07 220)", deep: "oklch(0.46 0.14 230)", glow: "oklch(0.92 0.07 220)" },
  // Violet macaron
  espresso: { front: "oklch(0.86 0.08 295)", mid: "oklch(0.86 0.08 295)", deep: "oklch(0.46 0.18 295)", glow: "oklch(0.90 0.08 295)" },
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
  const isAcademic = module === "academic";
  const accent = isAcademic ? blue : sage;

  // Editorial date line — looks like a publication's issue stamp
  const today = new Date();
  const dateLine = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const issueNo = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000,
  );

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "oklch(0.992 0.005 85)" }}>
      <main className="relative overflow-hidden pb-16">
        {/* Ivory whisper background — soft pastel halos */}
        <StudyNotesBackground />

        {/* MASTHEAD — institutional header, like a journal front matter */}
        <header className="relative z-[1] border-b border-foreground/15">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.32em] text-foreground/55">
                BigIELTS
              </span>
              <span className="hidden h-3 w-px bg-foreground/25 sm:block" />
              <span className="hidden font-display text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/45 sm:inline">
                Candidate Portal
              </span>
            </div>
            <div className="flex items-baseline gap-3 text-right">
              <span className="hidden font-display text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/45 sm:inline">
                {dateLine}
              </span>
              <span className="hidden h-3 w-px bg-foreground/25 sm:block" />
              <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.32em] tabular-nums text-foreground/55">
                №&nbsp;{issueNo}
              </span>
            </div>
          </div>
        </header>

        {/* Centered content column */}
        <div className="relative z-[1] mx-auto w-full max-w-5xl px-5 pt-12 sm:px-6 sm:pt-16">

          {/* HEADLINE — editorial, serious, institutional */}
          <div className="text-center">
            <div className="font-display text-[10px] font-extrabold uppercase tracking-[0.32em] text-foreground/45">
              The Candidate Dashboard
            </div>
            <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Your preparation,{" "}
              <span className="font-handwriting font-bold italic text-foreground/70">
                organised.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base font-medium text-foreground/60 sm:text-lg">
              A complete reading room for IELTS Academic and General Training —
              examined, edited, and updated weekly.
            </p>
          </div>

          {/* DATA STRIP — real, premium tabular stats */}
          <div className="mt-10 border-y border-foreground/15">
            <dl className="grid grid-cols-2 divide-x divide-foreground/10 sm:grid-cols-4">
              <Stat label="Active Module" value={isAcademic ? "Academic" : "General"} />
              <Stat label="Target Band" value="7.5" mono />
              <Stat label="Library Items" value="2,140" mono />
              <Stat label="Updated" value="Weekly" />
            </dl>
          </div>

          {/* MODULE SELECTOR */}
          <section className="mt-14">
            <SectionRule numeral="I" label="Select your module" />
            <div className="mt-6 flex justify-center">
              <ModuleToggle module={module} setModule={setModule} />
            </div>
          </section>

          {/* TOOLKIT — the macaron card library */}
          <section className="mt-16">
            <SectionRule numeral="II" label="Practice Library" caption="Eight departments · curated weekly" />
            <div className="mx-auto mt-7 grid max-w-4xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {features.map((f) => (
                <FeatureCard key={f.key} feature={f} module={module} />
              ))}
            </div>
          </section>

          {/* TODAY'S BRIEF — editorial recommendation */}
          <section className="mt-16">
            <SectionRule numeral="III" label="Today's Brief" caption={dateLine} />
            <article
              className="relative mx-auto mt-7 max-w-3xl border border-foreground/20 bg-[oklch(0.995_0.006_85)] px-6 py-7 sm:px-9 sm:py-9"
              style={{ boxShadow: "inset 0 0 0 1px oklch(1 0 0)" }}
            >
              <span aria-hidden className="absolute left-0 top-6 bottom-6 w-[3px] bg-foreground" />
              <div className="font-display text-[10px] font-extrabold uppercase tracking-[0.28em] text-foreground/55">
                Editor's Pick · {isAcademic ? "Academic" : "General Training"}
              </div>
              <h3 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
                {isAcademic
                  ? "Five academic collocations to master before sundown."
                  : "One letter from this month's reported exam — drafted properly."}
              </h3>
              <p className="mt-3 max-w-xl text-[15px] font-medium leading-relaxed text-foreground/65">
                {isAcademic
                  ? "Lexical resource is decided in the first paragraph. Read the model, internalise the phrasing, and rewrite from memory."
                  : "Structure, register, and sign-off matter as much as content. Study one model in full before drafting your own."}
              </p>
              <div className="mt-6 flex items-center gap-5">
                <Link
                  to={isAcademic ? "/vocabulary" : "/writing-samples"}
                  search={{ module }}
                  className="inline-flex items-center gap-2 border-b-2 border-foreground pb-1 font-display text-[13px] font-extrabold uppercase tracking-[0.18em] text-foreground transition-opacity hover:opacity-70"
                >
                  Open the brief →
                </Link>
                <span className="font-display text-[11px] font-medium uppercase tracking-[0.22em] tabular-nums text-foreground/45">
                  ~ 8 min read
                </span>
              </div>
            </article>
          </section>

          {/* COLOPHON — institutional footer band */}
          <section className="mt-20 border-t border-foreground/20 pt-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-baseline">
              <div>
                <div className="font-display text-[10px] font-extrabold uppercase tracking-[0.32em] text-foreground/55">
                  Colophon
                </div>
                <p className="mt-2 max-w-md font-display text-lg font-bold leading-snug tracking-tight text-foreground/80">
                  Edited by IELTS examiners.{" "}
                  <span className="font-handwriting font-bold italic text-foreground/55">
                    Read at your own pace.
                  </span>
                </p>
              </div>
              <div className="font-display text-[10px] font-medium uppercase tracking-[0.24em] tabular-nums text-foreground/45">
                Volume I · Issue №&nbsp;{issueNo} · Set in Inter & Caveat
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** Hairline section header with § numeral — feels like a journal article. */
function SectionRule({
  numeral,
  label,
  caption,
}: {
  numeral: string;
  label: string;
  caption?: string;
}) {
  return (
    <div className="flex items-baseline gap-4 border-b border-foreground/15 pb-3">
      <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.32em] tabular-nums text-foreground/55">
        §&nbsp;{numeral}
      </span>
      <span className="h-px flex-1 bg-foreground/15" />
      <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.28em] text-foreground">
        {label}
      </span>
      {caption ? (
        <>
          <span className="hidden h-px w-8 bg-foreground/15 sm:block" />
          <span className="hidden font-display text-[10px] font-medium uppercase tracking-[0.22em] text-foreground/45 sm:inline">
            {caption}
          </span>
        </>
      ) : null}
    </div>
  );
}

/** Tabular stat cell for the data strip. Mono numerals look premium. */
function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="px-4 py-4 sm:px-5 sm:py-5">
      <dt className="font-display text-[9.5px] font-extrabold uppercase tracking-[0.26em] text-foreground/50">
        {label}
      </dt>
      <dd
        className={`mt-1.5 font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl ${
          mono ? "tabular-nums" : ""
        }`}
      >
        {value}
      </dd>
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
          className={`font-display text-2xl font-black tracking-tight sm:text-4xl md:text-5xl ${
            isAcademic ? "text-foreground" : "text-foreground/55"
          }`}
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
          className={`font-display text-2xl font-black tracking-tight sm:text-4xl md:text-5xl ${
            !isAcademic ? "text-foreground" : "text-foreground/55"
          }`}
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
      {/* Tonal layered box:
          - Solid pastel fill (tone.front)
          - Outer border: mid-tone (same hue, slightly deeper) via color-mix
          - Inner stroke: deeper same-hue tone via inset box-shadow
          - No drop shadow — refined, card-stock layering only */}
      <span
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[10px] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 ${
          isHighlighted ? "p-4 sm:p-5" : "p-3.5 sm:p-4"
        }`}
        style={{
          background: tone.front,
          border: `1.5px solid color-mix(in oklab, ${tone.deep} 35%, ${tone.front})`,
          boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${tone.deep} 18%, ${tone.front}), inset 0 0 0 4px ${tone.front}`,
        }}
      >
        {/* Animated motif loop — Lottie-style scene preserved */}
        <CardMotif
          kind={feature.key as Parameters<typeof CardMotif>[0]["kind"]}
          color={tone.deep}
          className="opacity-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
        />

        {/* Title + meta — pinned to the bottom, gives each card weight */}
        <span className="relative z-[1] mt-auto flex flex-col items-center gap-0.5">
          <h3
            className={`text-center font-display font-black leading-tight tracking-tight ${
              isHighlighted ? "text-sm sm:text-base" : "text-[12px] sm:text-[13px]"
            }`}
            style={{ color: tone.deep }}
          >
            {feature.title}
          </h3>
          <span
            className="text-center font-semibold uppercase leading-none tracking-[0.08em] text-[8.5px] sm:text-[9.5px]"
            style={{ color: `color-mix(in oklab, ${tone.deep} 75%, transparent)` }}
          >
            <span className="font-black">{feature.count[module].value}</span>
            <span className="opacity-80"> · {feature.count[module].label}</span>
          </span>
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