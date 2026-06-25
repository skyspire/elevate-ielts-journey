import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Share2,
  FileText,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/ielts-calculator")({
  head: () => ({
    meta: [
      { title: "IELTS Band Calculator — BigIELTS" },
      {
        name: "description",
        content:
          "Free IELTS band score calculator. Enter your Listening & Reading correct answers and your Writing & Speaking bands — we apply the official rounding rules.",
      },
      { property: "og:title", content: "IELTS Band Calculator — BigIELTS" },
      {
        property: "og:description",
        content:
          "Find your IELTS overall band in seconds. Same rounding rules as the real exam.",
      },
    ],
  }),
  component: IeltsCalculatorPage,
});

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */
const INK = "#1c2330";
const PALE = "#e6e9c6";
const MUTED = "rgba(28,35,48,0.62)";

const SECTIONS = {
  olive: "#dbe5b0",
  peach: "#f6d8b6",
  lilac: "#ddd4f0",
  mint: "#d2e8d4",
  blush: "#f3cfd3",
  butter: "#f3e6a8",
  sky: "#d2e1ef",
  navy: INK,
};

const INTER: React.CSSProperties = {
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
};

/* ------------------------------------------------------------------ */
/* Band logic                                                          */
/* ------------------------------------------------------------------ */
function overallBand(bands: number[]): number {
  const avg = bands.reduce((a, b) => a + b, 0) / bands.length;
  const whole = Math.floor(avg);
  const frac = avg - whole;
  if (frac < 0.25) return whole;
  if (frac < 0.75) return whole + 0.5;
  return whole + 1;
}

const BAND_MEANING: Array<{ n: number; t: string; d: string }> = [
  { n: 9, t: "Expert user", d: "Fully operational command — accurate, fluent, complete understanding." },
  { n: 8, t: "Very good user", d: "Operational command with only occasional unsystematic inaccuracies." },
  { n: 7, t: "Good user", d: "Operational command despite occasional inaccuracies and misunderstandings." },
  { n: 6, t: "Competent user", d: "Effective command despite some inaccuracies in familiar situations." },
  { n: 5, t: "Modest user", d: "Partial command, coping with overall meaning in most situations." },
  { n: 4, t: "Limited user", d: "Basic competence limited to familiar situations." },
  { n: 3, t: "Extremely limited user", d: "Conveys and understands only general meaning in very familiar situations." },
  { n: 2, t: "Intermittent user", d: "No real communication beyond the most basic information." },
  { n: 1, t: "Non-user", d: "Essentially no ability to use the language beyond a few isolated words." },
];

function bandLabel(b: number): { title: string; desc: string } {
  const whole = Math.round(b);
  const found = BAND_MEANING.find((x) => x.n === whole);
  return { title: found?.t ?? "—", desc: found?.d ?? "" };
}

/* ------------------------------------------------------------------ */
/* Conversion tables                                                   */
/* ------------------------------------------------------------------ */
type Row = [number, number, number];

const LISTENING_TABLE: Row[] = [
  [39, 40, 9.0], [37, 38, 8.5], [35, 36, 8.0], [32, 34, 7.5],
  [30, 31, 7.0], [26, 29, 6.5], [23, 25, 6.0], [18, 22, 5.5],
  [16, 17, 5.0], [13, 15, 4.5], [11, 12, 4.0], [8, 10, 3.5],
  [6, 7, 3.0],  [4, 5, 2.5],
];

const READING_ACADEMIC: Row[] = [
  [39, 40, 9.0], [37, 38, 8.5], [35, 36, 8.0], [33, 34, 7.5],
  [30, 32, 7.0], [27, 29, 6.5], [23, 26, 6.0], [19, 22, 5.5],
  [15, 18, 5.0], [13, 14, 4.5], [10, 12, 4.0], [8, 9, 3.5],
  [6, 7, 3.0],   [4, 5, 2.5],
];

const READING_GENERAL: Row[] = [
  [40, 40, 9.0], [39, 39, 8.5], [37, 38, 8.0], [36, 36, 7.5],
  [34, 35, 7.0], [32, 33, 6.5], [30, 31, 6.0], [27, 29, 5.5],
  [23, 26, 5.0], [19, 22, 4.5], [15, 18, 4.0], [12, 14, 3.5],
  [9, 11, 3.0],  [6, 8, 2.5],
];

function rawToBand(raw: number, table: Row[]): number {
  const r = Math.max(0, Math.min(40, Math.round(raw)));
  for (const [lo, hi, b] of table) if (r >= lo && r <= hi) return b;
  return 0;
}

/* ------------------------------------------------------------------ */
/* Small UI pieces                                                     */
/* ------------------------------------------------------------------ */
function GhostNumber({ n, position }: { n: string; position: "br" | "bl" }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none ${
        position === "br" ? "bottom-2 right-[-2vw]" : "bottom-2 left-[-2vw]"
      }`}
      style={{
        ...INTER,
        fontWeight: 900,
        fontSize: "clamp(10rem, 26vw, 28rem)",
        letterSpacing: "-0.08em",
        lineHeight: 0.78,
        color: INK,
        opacity: 0.07,
      }}
    >
      {n}
    </span>
  );
}

function SectionTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold"
      style={{ ...INTER, background: "rgba(28,35,48,0.08)", color: INK }}
    >
      {label}
    </span>
  );
}

function ChipBrand() {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
      style={{ ...INTER, background: INK, color: PALE }}
    >
      <GraduationCap className="h-4 w-4" strokeWidth={2.4} />
      IELTS Calculator
    </span>
  );
}

function ChipFree() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold"
      style={{ ...INTER, background: INK, color: PALE }}
    >
      <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
      Free · No sign-up
    </span>
  );
}

function PillButton({
  children,
  variant = "dark",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "dark" | "ghost";
  onClick?: () => void;
}) {
  const isDark = variant === "dark";
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-transform hover:-translate-y-0.5"
      style={{
        ...INTER,
        background: isDark ? INK : "transparent",
        color: isDark ? PALE : INK,
        border: isDark ? "none" : `1.5px solid ${INK}33`,
        boxShadow: isDark ? "0 10px 24px -12px rgba(28,35,48,0.55)" : "none",
      }}
    >
      {children}
    </button>
  );
}

/* Stepper for a raw /40 score */
function RawStepper({
  label,
  raw,
  band,
  onChange,
  hint,
}: {
  label: string;
  raw: number;
  band: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(40, n));
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(28,35,48,0.08)" }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h4 style={{ ...INTER, fontWeight: 700, fontSize: "1.05rem", color: INK }}>
          {label}
        </h4>
        <span style={{ ...INTER, fontSize: "14px", color: MUTED }}>out of 40</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(clamp(raw - 1))}
          aria-label="Decrease"
          className="grid h-11 w-11 place-items-center rounded-full transition active:scale-95"
          style={{ background: INK, color: PALE }}
        >
          <Minus className="h-5 w-5" strokeWidth={2.4} />
        </button>

        <input
          type="number"
          min={0}
          max={40}
          value={raw}
          onChange={(e) => onChange(clamp(parseInt(e.target.value || "0", 10)))}
          className="flex-1 rounded-xl bg-white py-2 text-center tabular-nums outline-none"
          style={{
            ...INTER,
            fontWeight: 800,
            fontSize: "2rem",
            letterSpacing: "-0.02em",
            color: INK,
            border: "1px solid rgba(28,35,48,0.12)",
          }}
        />

        <button
          type="button"
          onClick={() => onChange(clamp(raw + 1))}
          aria-label="Increase"
          className="grid h-11 w-11 place-items-center rounded-full transition active:scale-95"
          style={{ background: INK, color: PALE }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span style={{ ...INTER, fontSize: "14px", color: MUTED }}>
          {hint ?? "Your band"}
        </span>
        <span
          className="tabular-nums"
          style={{ ...INTER, fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.02em", color: INK }}
        >
          {band.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

/* Stepper for a band score (Writing, Speaking) */
function BandStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(9, Math.round(n * 2) / 2));
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(28,35,48,0.08)" }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h4 style={{ ...INTER, fontWeight: 700, fontSize: "1.05rem", color: INK }}>
          {label}
        </h4>
        <span style={{ ...INTER, fontSize: "14px", color: MUTED }}>band 0 – 9</span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 0.5))}
          aria-label="Decrease"
          className="grid h-11 w-11 place-items-center rounded-full transition active:scale-95"
          style={{ background: INK, color: PALE }}
        >
          <Minus className="h-5 w-5" strokeWidth={2.4} />
        </button>

        <div
          className="flex-1 rounded-xl bg-white py-2 text-center tabular-nums"
          style={{
            ...INTER,
            fontWeight: 800,
            fontSize: "2rem",
            letterSpacing: "-0.02em",
            color: INK,
            border: "1px solid rgba(28,35,48,0.12)",
          }}
        >
          {value.toFixed(1)}
        </div>

        <button
          type="button"
          onClick={() => onChange(clamp(value + 0.5))}
          aria-label="Increase"
          className="grid h-11 w-11 place-items-center rounded-full transition active:scale-95"
          style={{ background: INK, color: PALE }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={9}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full"
          style={{ background: "rgba(28,35,48,0.18)" }}
        />
      </div>
    </div>
  );
}

/* Auto-shrinks its content with CSS transform: scale() so it always
   fits inside the section's viewport, perfectly centred. */
function FitToScreen({ children }: { children: React.ReactNode }) {
  const outerRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = React.useState(1);

  React.useLayoutEffect(() => {
    const measure = () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const prev = inner.style.transform;
      inner.style.transform = "none";
      const ch = inner.scrollHeight;
      const cw = inner.scrollWidth;
      inner.style.transform = prev;
      const ah = outer.clientHeight;
      const aw = outer.clientWidth;
      if (ah === 0 || ch === 0) return;
      const sH = ch > ah ? ah / ch : 1;
      const sW = cw > aw ? aw / cw : 1;
      const s = Math.min(1, sH, sW);
      setScale(s < 0.5 ? 0.5 : s);
    };
    measure();
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(schedule);
    if (outerRef.current) ro.observe(outerRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
    if (fonts?.ready) fonts.ready.then(schedule);
    const timers = [60, 200, 500, 1200].map((ms) => window.setTimeout(measure, ms));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [children]);

  return (
    <div
      ref={outerRef}
      className="absolute inset-0 overflow-hidden"
    >
      <div
        ref={innerRef}
        className="absolute left-1/2 top-1/2 w-full"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* Reusable section shell — full-viewport snap target with its own pastel bg */
function Section({
  id,
  bg,
  children,
  ghostN,
  ghostPos = "br",
}: {
  id: string;
  bg: string;
  children: React.ReactNode;
  ghostN?: string;
  ghostPos?: "br" | "bl";
}) {
  return (
    <section
      id={id}
      className="relative w-full overflow-hidden"
      style={{
        background: bg,
        height: "100svh",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
      }}
    >
      {ghostN ? <GhostNumber n={ghostN} position={ghostPos} /> : null}
      <FitToScreen>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
          {children}
        </div>
      </FitToScreen>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function IeltsCalculatorPage() {
  const [testType, setTestType] = React.useState<"academic" | "general">("academic");
  const [tab, setTab] = React.useState<"raw" | "band">("raw");

  const [rawL, setRawL] = React.useState<number>(30);
  const [rawR, setRawR] = React.useState<number>(27);
  const [w, setW] = React.useState(6.5);
  const [s, setS] = React.useState(7);
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [showAllBands, setShowAllBands] = React.useState(false);

  const readingTable = testType === "academic" ? READING_ACADEMIC : READING_GENERAL;

  const l = rawToBand(rawL, LISTENING_TABLE);
  const r = rawToBand(rawR, readingTable);

  const overall = overallBand([l, r, w, s]);
  const meaning = bandLabel(overall);

  const reset = () => {
    setRawL(30);
    setRawR(27);
    setW(6.5);
    setS(7);
  };

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  const jumpToId = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Keyboard arrow-jump between sections */
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(e.key)) return;
      const sections = Array.from(scroller.querySelectorAll<HTMLElement>("section[id]"));
      if (!sections.length) return;
      const top = scroller.scrollTop;
      const idx = sections.findIndex((sec) => sec.offsetTop + sec.offsetHeight - 40 > top);
      const dir = e.key === "ArrowDown" || e.key === "PageDown" ? 1 : -1;
      const next = Math.min(sections.length - 1, Math.max(0, idx + dir));
      e.preventDefault();
      sections[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    scroller.addEventListener("keydown", onKey);
    scroller.tabIndex = 0;
    return () => scroller.removeEventListener("keydown", onKey);
  }, []);

  const FAQ: Array<{ q: string; a: string }> = [
    {
      q: "Is the overall band just an average?",
      a: "It's the mean of your four skills, then rounded to the nearest 0.5. .25 rounds up to .5; .75 rounds up to the next whole band.",
    },
    {
      q: "Are Academic and General Training scored the same way?",
      a: "Yes — same 0–9 scale and same rounding. Only the Reading and Writing tasks differ in content.",
    },
    {
      q: "Why do Listening & Reading use correct answers, but Writing & Speaking don't?",
      a: "Listening & Reading are objective — each question is right or wrong out of 40, and the raw score converts to a band using a fixed table. Writing & Speaking are judged by examiners on four criteria each, so you set those by the band directly.",
    },
    {
      q: "Can my overall band be higher than every individual score?",
      a: "Yes. Four 6.5s round up to 6.5; but 6.5 / 6.5 / 7 / 7 averages 6.75, which rounds up to 7.",
    },
    {
      q: "Does this calculator save my data?",
      a: "No. Everything stays in your browser. Nothing is uploaded, no sign-up.",
    },
  ];

  return (
    <div
      ref={scrollerRef}
      style={{
        ...INTER,
        color: INK,
        height: "100svh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
      }}
    >
      {/* ===== 01 — HERO (olive) ===== */}
      <Section id="sec-1" bg={SECTIONS.olive} ghostN="01" ghostPos="br">
        <div className="mb-6 flex justify-center">
          <ChipBrand />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div
            className="relative rounded-[28px] p-7 sm:p-9"
            style={{
              background: "#eef0d2",
              boxShadow: "0 30px 60px -40px rgba(28,35,48,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            <div className="absolute -top-3 right-6">
              <ChipFree />
            </div>
            <h1
              className="leading-[0.95] tracking-tight"
              style={{
                ...INTER,
                fontWeight: 800,
                fontSize: "clamp(2.2rem, 5.6vw, 4.4rem)",
                letterSpacing: "-0.03em",
                color: INK,
              }}
            >
              Find your IELTS <span style={{ color: "#7d8b4a" }}>band</span> in seconds.
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-[1.65]" style={{ ...INTER, color: MUTED, fontWeight: 400 }}>
              Enter your correct answers for Listening & Reading, then set your Writing & Speaking band. We round the four scores the official way.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PillButton onClick={() => jumpToId("sec-2")}>
                Start calculating <ArrowRight className="h-4 w-4" />
              </PillButton>
              <PillButton variant="ghost" onClick={() => jumpToId("sec-7")}>
                Read FAQ
              </PillButton>
            </div>
          </div>

          <div
            className="relative flex items-center justify-center rounded-[28px] p-8 sm:p-10"
            style={{
              background: INK,
              color: PALE,
              boxShadow: "0 30px 60px -30px rgba(28,35,48,0.6)",
              minHeight: 180,
            }}
          >
            <div className="text-center">
              <div
                className="font-black leading-none tabular-nums"
                style={{
                  ...INTER,
                  fontWeight: 900,
                  fontSize: "clamp(6rem, 14vw, 10rem)",
                  letterSpacing: "-0.05em",
                  color: PALE,
                }}
              >
                {overall.toFixed(1)}
              </div>
              <p className="mt-3" style={{ ...INTER, fontWeight: 600, color: "#a3b375", fontSize: "15px" }}>
                Your overall band
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== 02 — CALCULATOR (peach) ===== */}
      <Section id="sec-2" bg={SECTIONS.peach} ghostN="02" ghostPos="bl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col items-start gap-3">
            <h2
              className="leading-[0.95] tracking-tight"
              style={{
                ...INTER,
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4.2vw, 3rem)",
                letterSpacing: "-0.03em",
                color: INK,
              }}
            >
              Your calculator
            </h2>
          </div>

          {/* Academic / General toggle */}
          <div
            className="inline-flex items-center rounded-full p-1"
            style={{ background: "rgba(28,35,48,0.08)" }}
          >
            {(["academic", "general"] as const).map((t) => {
              const active = testType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTestType(t)}
                  className="rounded-full px-4 py-1.5 text-[13px] font-semibold transition"
                  style={{
                    ...INTER,
                    background: active ? INK : "transparent",
                    color: active ? PALE : INK,
                  }}
                >
                  {t === "academic" ? "Academic" : "General Training"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
          <div
            className="rounded-[28px] p-5 sm:p-7 lg:col-span-3"
            style={{
              background: "#fbe6cc",
              boxShadow: "0 30px 60px -40px rgba(28,35,48,0.35)",
            }}
          >
            {/* Tabs */}
            <div
              className="inline-flex w-full items-center rounded-full p-1"
              style={{ background: "rgba(28,35,48,0.08)" }}
            >
              {([
                { id: "raw", label: "Listening & Reading" },
                { id: "band", label: "Writing & Speaking" },
              ] as const).map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className="flex-1 rounded-full px-4 py-2 text-[13.5px] font-semibold transition"
                    style={{
                      ...INTER,
                      background: active ? INK : "transparent",
                      color: active ? PALE : INK,
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-[14px] leading-[1.55]" style={{ ...INTER, color: MUTED, fontWeight: 400 }}>
              {tab === "raw"
                ? "Listening and Reading are marked out of 40. Enter how many you got right — we convert each one to a band using the official table."
                : "Writing and Speaking are graded by an examiner on four criteria. Choose the band you expect for each."}
            </p>

            {tab === "raw" ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <RawStepper
                  label="Listening"
                  raw={rawL}
                  band={l}
                  onChange={setRawL}
                />
                <RawStepper
                  label={`Reading · ${testType === "academic" ? "Academic" : "General"}`}
                  raw={rawR}
                  band={r}
                  onChange={setRawR}
                />
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <BandStepper label="Writing" value={w} onChange={setW} />
                <BandStepper label="Speaking" value={s} onChange={setS} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <PillButton variant="ghost"><Share2 className="h-4 w-4" /> Share</PillButton>
              <PillButton variant="ghost"><FileText className="h-4 w-4" /> PDF</PillButton>
              <PillButton variant="ghost" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</PillButton>
            </div>
          </div>

          {/* Overall card */}
          <div
            className="relative flex flex-col justify-between rounded-[28px] p-6 sm:p-8 lg:col-span-2"
            style={{ background: INK, color: PALE, boxShadow: "0 30px 60px -30px rgba(28,35,48,0.6)" }}
          >
            <div className="text-center">
              <div
                className="leading-none tabular-nums"
                style={{
                  ...INTER,
                  fontWeight: 900,
                  fontSize: "clamp(5rem, 12vw, 8.5rem)",
                  letterSpacing: "-0.05em",
                  color: PALE,
                }}
              >
                {overall.toFixed(1)}
              </div>
              <p className="mt-2" style={{ ...INTER, fontWeight: 600, fontSize: "15px", color: "#a3b375" }}>
                {meaning.title}
              </p>
            </div>
            <p
              className="mx-auto mt-4 max-w-xs text-center text-[14px] leading-[1.6]"
              style={{ ...INTER, color: "rgba(207,216,168,0.85)", fontWeight: 400 }}
            >
              {meaning.desc}
            </p>

            {/* Per-skill quick summary so users can see all 4 at once */}
            <div className="mt-5 grid grid-cols-4 gap-2">
              {[
                { k: "L", v: l },
                { k: "R", v: r },
                { k: "W", v: w },
                { k: "S", v: s },
              ].map((x) => (
                <div
                  key={x.k}
                  className="rounded-xl py-2 text-center"
                  style={{ background: "rgba(207,216,168,0.10)", border: "1px solid rgba(207,216,168,0.18)" }}
                >
                  <div style={{ ...INTER, fontSize: "12px", color: "rgba(207,216,168,0.7)" }}>{x.k}</div>
                  <div className="tabular-nums" style={{ ...INTER, fontWeight: 800, fontSize: "1.1rem", color: PALE }}>
                    {x.v.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== 03 — HOW SCORING WORKS (lilac) ===== */}
      <Section id="sec-3" bg={SECTIONS.lilac} ghostN="03" ghostPos="br">
        <div className="mb-4 flex flex-col items-start gap-3">
          <h2
            className="leading-[0.95] tracking-tight"
            style={{
              ...INTER,
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4.2vw, 3rem)",
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            How the scoring works
          </h2>
          <p style={{ ...INTER, color: MUTED, fontWeight: 400, fontSize: "16px" }}>
            The official rounding rules — the same ones we use above.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { k: "1", t: "Average the four", d: "We take the mean of your Listening, Reading, Writing, and Speaking band scores." },
            { k: "2", t: "Round to nearest 0.5", d: "A fraction of .25 rounds up to .5. A fraction of .75 rounds up to the next whole band." },
            { k: "3", t: "That's your overall", d: "Example: 6.5 + 6.5 + 5.0 + 7.0 = 25 ÷ 4 = 6.25 → Overall Band 6.5." },
          ].map((card) => (
            <div
              key={card.k}
              className="rounded-[24px] p-6"
              style={{ background: "#eae2f7", boxShadow: "0 30px 60px -40px rgba(28,35,48,0.3)" }}
            >
              <span
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ ...INTER, fontWeight: 700, fontSize: "14px", background: INK, color: PALE }}
              >
                {card.k}
              </span>
              <h3 className="mt-4" style={{ ...INTER, fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.01em", color: INK }}>
                {card.t}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.6]" style={{ ...INTER, color: MUTED, fontWeight: 400 }}>
                {card.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 04 — WHAT EACH BAND MEANS (mint) ===== */}
      <Section id="sec-4" bg={SECTIONS.mint} ghostN="04" ghostPos="bl">
        <div className="mb-4 flex flex-col items-start gap-3">
          <h2
            className="leading-[0.95] tracking-tight"
            style={{
              ...INTER,
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4.2vw, 3rem)",
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            What each band means
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {(showAllBands ? BAND_MEANING : BAND_MEANING.filter((b) => b.n >= 4)).map((b) => (
            <div
              key={b.n}
              className="rounded-2xl p-4 sm:p-5"
              style={{ background: "#e1f0e3", boxShadow: "0 20px 40px -30px rgba(28,35,48,0.3)" }}
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="tabular-nums"
                  style={{ ...INTER, fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.03em", color: INK, lineHeight: 1 }}
                >
                  {b.n}
                </span>
                <span style={{ ...INTER, fontWeight: 600, fontSize: "14px", color: INK }}>
                  {b.t}
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-[1.55]" style={{ ...INTER, color: MUTED, fontWeight: 400 }}>
                {b.d}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAllBands((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{ ...INTER, fontWeight: 600, fontSize: "14px", background: "rgba(28,35,48,0.08)", color: INK }}
          >
            {showAllBands ? "Show fewer bands" : "See all 9 bands"}
          </button>
        </div>
      </Section>

      {/* ===== 05 — ACADEMIC vs GENERAL (blush) ===== */}
      <Section id="sec-5" bg={SECTIONS.blush} ghostN="05" ghostPos="br">
        <div className="mb-4 flex flex-col items-start gap-3">
          <h2
            className="leading-[0.95] tracking-tight"
            style={{ ...INTER, fontWeight: 800, fontSize: "clamp(1.8rem, 4.2vw, 3rem)", letterSpacing: "-0.03em", color: INK }}
          >
            Academic vs General Training
          </h2>
          <p style={{ ...INTER, color: MUTED, fontWeight: 400, fontSize: "16px" }}>
            Same 0–9 scale and same rounding. Only Reading & Writing content differs.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { t: "Academic", who: "For university admissions & professional registration.", read: "3 long academic texts (journals, books).", write: "Task 1: describe a chart or graph. Task 2: essay." },
            { t: "General Training", who: "For migration, work, or training programs.", read: "Everyday notices, ads, work documents.", write: "Task 1: a letter. Task 2: essay." },
          ].map((c) => (
            <div key={c.t} className="rounded-[24px] p-6 sm:p-8" style={{ background: "#f9dde0", boxShadow: "0 30px 60px -40px rgba(28,35,48,0.3)" }}>
              <h3 style={{ ...INTER, fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.02em", color: INK }}>
                {c.t}
              </h3>
              <p className="mt-2 text-[15px]" style={{ ...INTER, color: MUTED, fontWeight: 400 }}>{c.who}</p>
              <dl className="mt-4 space-y-3 text-[15px]">
                <div>
                  <dt style={{ ...INTER, fontWeight: 700, fontSize: "14px", color: INK }}>Reading</dt>
                  <dd style={{ ...INTER, color: MUTED, fontWeight: 400 }}>{c.read}</dd>
                </div>
                <div>
                  <dt style={{ ...INTER, fontWeight: 700, fontSize: "14px", color: INK }}>Writing</dt>
                  <dd style={{ ...INTER, color: MUTED, fontWeight: 400 }}>{c.write}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 06 — PRO TIPS (butter) ===== */}
      <Section id="sec-6" bg={SECTIONS.butter} ghostN="06" ghostPos="bl">
        <div className="mb-4 flex flex-col items-start gap-3">
          <h2
            className="leading-[0.95] tracking-tight"
            style={{ ...INTER, fontWeight: 800, fontSize: "clamp(1.8rem, 4.2vw, 3rem)", letterSpacing: "-0.03em", color: INK }}
          >
            Push your band by +0.5
          </h2>
          <p style={{ ...INTER, color: MUTED, fontWeight: 400, fontSize: "16px" }}>
            Small habits that move the average — and the rounding — in your favour.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { t: "Boost your weakest skill first", d: "Rounding rewards lifting your lowest score by 0.5 more than your highest by 1." },
            { t: "Time Reading section 3", d: "Most candidates lose 4–6 marks here purely to clock-running, not difficulty." },
            { t: "Plan Writing Task 2 (3 min)", d: "A planned essay scores higher on Coherence and Task Response than a longer messy one." },
            { t: "Record yourself speaking", d: "Hearing your own pauses and fillers fixes Fluency faster than any tutor feedback." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl p-5" style={{ background: "#faecb5", boxShadow: "0 20px 40px -30px rgba(28,35,48,0.3)" }}>
              <h3 style={{ ...INTER, fontWeight: 700, fontSize: "1.05rem", letterSpacing: "-0.01em", color: INK }}>
                {c.t}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.55]" style={{ ...INTER, color: MUTED, fontWeight: 400 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== 07 — FAQ (sky) ===== */}
      <Section id="sec-7" bg={SECTIONS.sky} ghostN="07" ghostPos="br">
        <div className="mb-4 flex flex-col items-start gap-3">
          <h2
            className="leading-[0.95] tracking-tight"
            style={{ ...INTER, fontWeight: 800, fontSize: "clamp(1.8rem, 4.2vw, 3rem)", letterSpacing: "-0.03em", color: INK }}
          >
            Quick questions
          </h2>
        </div>

        <div className="mt-6 space-y-3">
          {FAQ.map((f, i) => {
            const open = openFaq === i;
            return (
              <button
                key={f.q}
                onClick={() => setOpenFaq(open ? null : i)}
                className="block w-full rounded-2xl p-5 text-left transition"
                style={{ background: "#dfeaf4", boxShadow: "0 20px 40px -30px rgba(28,35,48,0.3)" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span style={{ ...INTER, fontWeight: 700, fontSize: "16px", color: INK }}>
                    {f.q}
                  </span>
                  {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                </div>
                {open && (
                  <p className="mt-3 text-[15px] leading-[1.65]" style={{ ...INTER, color: MUTED, fontWeight: 400 }}>
                    {f.a}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ===== 08 — CTA (navy) ===== */}
      <Section id="sec-8" bg={SECTIONS.navy}>
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ ...INTER, fontWeight: 600, fontSize: "13px", background: "rgba(207,216,168,0.12)", color: PALE }}
          >
            Ready
          </span>
          <h2
            className="mt-5 leading-[0.95] tracking-tight"
            style={{
              ...INTER,
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
              letterSpacing: "-0.03em",
              color: PALE,
            }}
          >
            Want to actually hit{" "}
            <span style={{ color: "#a3b375" }}>Band {Math.max(overall, 7).toFixed(1)}</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-[1.65]" style={{ ...INTER, color: "rgba(207,216,168,0.8)", fontWeight: 400 }}>
            BigIELTS gives you recent exam questions, Band 8–9 model answers, and structure breakdowns — for free.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 transition-transform hover:-translate-y-0.5"
              style={{ ...INTER, fontWeight: 700, fontSize: "14px", background: PALE, color: INK, boxShadow: "0 10px 24px -12px rgba(0,0,0,0.5)" }}
            >
              Start free <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => jumpToId("sec-1")}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3"
              style={{ ...INTER, fontWeight: 700, fontSize: "14px", border: "1.5px solid rgba(207,216,168,0.3)", color: PALE }}
            >
              Back to top
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
