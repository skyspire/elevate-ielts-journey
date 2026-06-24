import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Sparkles, RotateCcw, Share2, FileText } from "lucide-react";

export const Route = createFileRoute("/ielts-calculator")({
  head: () => ({
    meta: [
      { title: "IELTS Band Calculator — BigIELTS" },
      {
        name: "description",
        content:
          "Free IELTS band score calculator. Slide your Listening, Reading, Writing and Speaking scores — we apply the official rounding rules.",
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
/* Palette — sage × navy, faithful to the reference                   */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#cfd8a8",
  bgDeep: "#a3b375",
  cardCream: "#e6e9c6",
  cardCreamSoft: "#d8dfb4",
  ink: "#1c2330",
  inkSoft: "#2a3243",
  pale: "#cfd8a8",       // pale green that lives on the dark card
  paleSoft: "#e6e9c6",
  olive: "#7d8b4a",      // accent inside the cream card (the "band" highlight)
  muted: "rgba(28,35,48,0.62)",
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
  { n: 9, t: "Expert user", d: "Fully operational command of the language. Appropriate, accurate, fluent — with complete understanding." },
  { n: 8, t: "Very good user", d: "Operational command with only occasional unsystematic inaccuracies. Handles complex argumentation well." },
  { n: 7, t: "Good user", d: "Operational command despite occasional inaccuracies. Generally handles complex language and detailed reasoning." },
  { n: 6, t: "Competent user", d: "Effective command despite some inaccuracies. Can use and understand fairly complex language in familiar situations." },
  { n: 5, t: "Modest user", d: "Partial command, coping with overall meaning in most situations though likely to make many mistakes." },
  { n: 4, t: "Limited user", d: "Basic competence limited to familiar situations. Frequent problems in understanding and expression." },
  { n: 3, t: "Extremely limited user", d: "Conveys and understands only general meaning in very familiar situations. Frequent breakdowns in communication." },
  { n: 2, t: "Intermittent user", d: "No real communication is possible except for the most basic information using isolated words or short formulae." },
  { n: 1, t: "Non-user", d: "Essentially has no ability to use the language beyond possibly a few isolated words." },
];

function bandLabel(b: number): { title: string; desc: string } {
  const whole = Math.round(b);
  const found = BAND_MEANING.find((x) => x.n === whole);
  return { title: found?.t ?? "—", desc: found?.d ?? "" };
}

/* ------------------------------------------------------------------ */
/* Re-usable pieces                                                    */
/* ------------------------------------------------------------------ */
function GhostNumber({ n, position }: { n: string; position: "br" | "bl" }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none ${
        position === "br" ? "-bottom-10 right-[-2vw]" : "-bottom-10 left-[-2vw]"
      }`}
      style={{
        ...INTER,
        fontWeight: 900,
        fontSize: "clamp(18rem, 38vw, 44rem)",
        letterSpacing: "-0.08em",
        lineHeight: 0.78,
        color: C.ink,
        opacity: 0.07,
      }}
    >
      {n}
    </span>
  );
}

function SectionNumber({ n }: { n: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em]"
      style={{
        background: "rgba(28,35,48,0.08)",
        color: C.ink,
      }}
    >
      <span
        className="grid h-5 w-5 place-items-center rounded-full text-[10px]"
        style={{ background: C.ink, color: C.pale }}
      >
        {n}
      </span>
      Section {n}
    </span>
  );
}

function ChipBrand() {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-extrabold"
      style={{
        background: C.ink,
        color: C.pale,
      }}
    >
      <GraduationCap className="h-3.5 w-3.5" strokeWidth={2.6} />
      IELTS Calculator
    </span>
  );
}

function ChipFree() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold"
      style={{
        background: C.ink,
        color: C.pale,
      }}
    >
      <Sparkles className="h-3 w-3" strokeWidth={2.6} />
      Free · No sign-up
    </span>
  );
}

/* Styled range slider with band readout */
function BandSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const pct = (value / 9) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span
          className="text-[12px] font-extrabold uppercase tracking-[0.18em]"
          style={{ color: C.ink }}
        >
          {label}
        </span>
        <span
          className="font-black tabular-nums"
          style={{
            ...INTER,
            fontWeight: 900,
            fontSize: "1.75rem",
            letterSpacing: "-0.03em",
            color: C.ink,
          }}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <div className="relative">
        <div
          className="h-3 w-full rounded-full"
          style={{ background: "rgba(28,35,48,0.12)" }}
        />
        <div
          className="absolute left-0 top-0 h-3 rounded-full"
          style={{ width: `${pct}%`, background: C.ink }}
        />
        <input
          type="range"
          min={0}
          max={9}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 h-3 w-full cursor-pointer appearance-none bg-transparent
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:h-6
                     [&::-webkit-slider-thumb]:w-6
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:border-[3px]
                     [&::-webkit-slider-thumb]:border-[var(--ink)]
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-moz-range-thumb]:h-6
                     [&::-moz-range-thumb]:w-6
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:border-[3px]
                     [&::-moz-range-thumb]:border-[var(--ink)]
                     [&::-moz-range-thumb]:bg-white"
          style={{ ["--ink" as string]: C.ink } as React.CSSProperties}
        />
      </div>
    </div>
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
      className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-extrabold transition-transform hover:-translate-y-0.5"
      style={{
        background: isDark ? C.ink : "transparent",
        color: isDark ? C.pale : C.ink,
        border: isDark ? "none" : `1.5px solid ${C.ink}33`,
        boxShadow: isDark ? "0 10px 24px -12px rgba(28,35,48,0.55)" : "none",
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function IeltsCalculatorPage() {
  const [l, setL] = React.useState(7);
  const [r, setR] = React.useState(6.5);
  const [w, setW] = React.useState(6.5);
  const [s, setS] = React.useState(7);

  const overall = overallBand([l, r, w, s]);
  const avg = (l + r + w + s) / 4;
  const meaning = bandLabel(overall);

  const reset = () => {
    setL(7);
    setR(6.5);
    setW(6.5);
    setS(7);
  };

  const calcRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="relative w-full overflow-x-clip"
      style={{
        ...INTER,
        background: C.bg,
        color: C.ink,
      }}
    >
      {/* large soft blurred halos like the reference */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[55vw] w-[55vw] rounded-full"
        style={{
          background: `radial-gradient(circle, ${C.bgDeep} 0%, transparent 65%)`,
          filter: "blur(60px)",
          opacity: 0.55,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-15vw] top-[40vh] h-[40vw] w-[40vw] rounded-full"
        style={{
          background: `radial-gradient(circle, ${C.bgDeep} 0%, transparent 65%)`,
          filter: "blur(70px)",
          opacity: 0.4,
        }}
      />

      {/* =================================================
          SECTION 01 — HERO with two-card layout
         ================================================= */}
      <section
        className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-5 py-24 sm:px-8"
      >
        <GhostNumber n="01" position="br" />

        <div className="relative z-10 w-full">
          <div className="mb-8 flex justify-center">
            <ChipBrand />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            {/* LEFT — cream card */}
            <div
              className="relative rounded-[28px] p-8 sm:p-10"
              style={{
                background: C.cardCream,
                boxShadow:
                  "0 30px 60px -40px rgba(28,35,48,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <div className="absolute -top-3 right-6">
                <ChipFree />
              </div>

              <h1
                className="leading-[0.95] tracking-tight"
                style={{
                  ...INTER,
                  fontWeight: 900,
                  fontSize: "clamp(2.5rem, 6.4vw, 5rem)",
                  letterSpacing: "-0.04em",
                  color: C.ink,
                }}
              >
                Find your IELTS{" "}
                <span style={{ color: C.olive }}>band</span> in seconds.
              </h1>

              <p
                className="mt-6 max-w-md text-[16px] leading-[1.65]"
                style={{ color: C.muted, fontWeight: 500 }}
              >
                Slide your score. We do the math the official way — same
                rounding as the real exam.
              </p>

              <div className="mt-8">
                <PillButton
                  onClick={() =>
                    calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  Start calculating <ArrowRight className="h-4 w-4" />
                </PillButton>
              </div>
            </div>

            {/* RIGHT — dark navy card with giant pale band number */}
            <div
              className="relative flex items-center justify-center rounded-[28px] p-10 sm:p-12"
              style={{
                background: C.ink,
                color: C.pale,
                boxShadow:
                  "0 30px 60px -30px rgba(28,35,48,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                minHeight: 320,
              }}
            >
              <div className="text-center">
                <div
                  className="font-black leading-none tabular-nums"
                  style={{
                    ...INTER,
                    fontWeight: 900,
                    fontSize: "clamp(7rem, 16vw, 12rem)",
                    letterSpacing: "-0.06em",
                    color: C.pale,
                    textShadow: "0 10px 40px rgba(0,0,0,0.25)",
                  }}
                >
                  {overall.toFixed(1)}
                </div>
                <p
                  className="mt-4 font-extrabold"
                  style={{
                    color: C.olive === C.olive ? "#a3b375" : C.pale,
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  your overall band
                </p>
                <p
                  className="mt-4 text-[13px]"
                  style={{ color: "rgba(207,216,168,0.65)" }}
                >
                  Updates as you drag the sliders below.
                </p>
              </div>
            </div>
          </div>

          {/* scroll hint */}
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() =>
                calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="text-[11px] font-extrabold uppercase tracking-[0.3em]"
              style={{ color: C.muted }}
            >
              scroll ↓
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          SECTION 02 — Calculator
         ================================================= */}
      <section
        ref={calcRef}
        className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-5 py-24 sm:px-8"
      >
        <GhostNumber n="02" position="bl" />

        <div className="relative z-10 w-full">
          <div className="mb-6 flex flex-col items-start gap-3">
            <SectionNumber n="02" />
            <h2
              className="leading-[0.95] tracking-tight"
              style={{
                ...INTER,
                fontWeight: 900,
                fontSize: "clamp(2rem, 4.6vw, 3.5rem)",
                letterSpacing: "-0.03em",
                color: C.ink,
              }}
            >
              Your calculator
            </h2>
            <p style={{ color: C.muted, fontWeight: 500 }}>
              Drag the sliders. Your overall band updates live.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-5 lg:gap-6">
            {/* LEFT — sliders card (cream) */}
            <div
              className="rounded-[28px] p-8 sm:p-10 lg:col-span-3"
              style={{
                background: C.cardCream,
                boxShadow:
                  "0 30px 60px -40px rgba(28,35,48,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <div className="space-y-7">
                <BandSlider label="Listening" value={l} onChange={setL} />
                <BandSlider label="Reading" value={r} onChange={setR} />
                <BandSlider label="Writing" value={w} onChange={setW} />
                <BandSlider label="Speaking" value={s} onChange={setS} />
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <PillButton variant="ghost">
                  <Share2 className="h-4 w-4" /> Share
                </PillButton>
                <PillButton variant="ghost">
                  <FileText className="h-4 w-4" /> PDF
                </PillButton>
                <PillButton variant="ghost" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Reset
                </PillButton>
              </div>
            </div>

            {/* RIGHT — result card (dark) */}
            <div
              className="relative flex flex-col justify-between rounded-[28px] p-8 sm:p-10 lg:col-span-2"
              style={{
                background: C.ink,
                color: C.pale,
                boxShadow:
                  "0 30px 60px -30px rgba(28,35,48,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                minHeight: 420,
              }}
            >
              <div className="text-center">
                <div
                  className="font-black leading-none tabular-nums"
                  style={{
                    ...INTER,
                    fontWeight: 900,
                    fontSize: "clamp(6rem, 14vw, 10rem)",
                    letterSpacing: "-0.06em",
                    color: C.pale,
                  }}
                >
                  {overall.toFixed(1)}
                </div>
                <p
                  className="mt-3 font-extrabold uppercase tracking-[0.18em]"
                  style={{
                    color: "#a3b375",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                  }}
                >
                  {meaning.title}
                </p>
              </div>

              <p
                className="mx-auto mt-6 max-w-xs text-center text-[13.5px] leading-relaxed"
                style={{ color: "rgba(207,216,168,0.78)" }}
              >
                {meaning.desc}
              </p>

              <div
                className="mt-8 rounded-full px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.16em]"
                style={{
                  background: "rgba(207,216,168,0.08)",
                  color: "rgba(207,216,168,0.7)",
                  border: "1px solid rgba(207,216,168,0.18)",
                }}
              >
                avg {avg.toFixed(3)} · rounded to nearest 0.5
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <span
              className="text-[11px] font-extrabold uppercase tracking-[0.3em]"
              style={{ color: C.muted }}
            >
              scroll ↓
            </span>
          </div>
        </div>
      </section>

      {/* =================================================
          SECTION 03 — How scoring works
         ================================================= */}
      <section className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
        <GhostNumber n="03" position="br" />

        <div className="relative z-10">
          <div className="mb-6 flex flex-col items-start gap-3">
            <SectionNumber n="03" />
            <h2
              className="leading-[0.95] tracking-tight"
              style={{
                ...INTER,
                fontWeight: 900,
                fontSize: "clamp(2rem, 4.6vw, 3.5rem)",
                letterSpacing: "-0.03em",
                color: C.ink,
              }}
            >
              How the scoring works
            </h2>
            <p style={{ color: C.muted, fontWeight: 500 }}>
              The official rounding rules — the same ones we use above.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                k: "01",
                t: "Average the four",
                d: "We take the mean of your Listening, Reading, Writing, and Speaking band scores.",
              },
              {
                k: "02",
                t: "Round to nearest 0.5",
                d: ".25 rounds UP to the next .5. .75 rounds UP to the next whole band. Anything in between stays.",
              },
              {
                k: "03",
                t: "That's your overall",
                d: "Example: 6.5 + 6.5 + 5.0 + 7.0 = 25 ÷ 4 = 6.25 → Overall Band 6.5.",
              },
            ].map((card) => (
              <div
                key={card.k}
                className="rounded-[24px] p-7"
                style={{
                  background: C.cardCream,
                  boxShadow:
                    "0 30px 60px -40px rgba(28,35,48,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-extrabold"
                  style={{ background: C.ink, color: C.pale }}
                >
                  {card.k}
                </span>
                <h3
                  className="mt-5"
                  style={{
                    ...INTER,
                    fontWeight: 900,
                    fontSize: "1.4rem",
                    letterSpacing: "-0.02em",
                    color: C.ink,
                  }}
                >
                  {card.t}
                </h3>
                <p
                  className="mt-2 text-[14px] leading-[1.65]"
                  style={{ color: C.muted, fontWeight: 500 }}
                >
                  {card.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          SECTION 04 — What each band means
         ================================================= */}
      <section className="relative mx-auto w-full max-w-7xl px-5 pb-32 pt-12 sm:px-8">
        <GhostNumber n="04" position="bl" />

        <div className="relative z-10">
          <div className="mb-6 flex flex-col items-start gap-3">
            <SectionNumber n="04" />
            <h2
              className="leading-[0.95] tracking-tight"
              style={{
                ...INTER,
                fontWeight: 900,
                fontSize: "clamp(2rem, 4.6vw, 3.5rem)",
                letterSpacing: "-0.03em",
                color: C.ink,
              }}
            >
              What each band means
            </h2>
            <p style={{ color: C.muted, fontWeight: 500 }}>
              Plain English for every score, 9 down to 1.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-[28px]" style={{ background: C.cardCream }}>
            {BAND_MEANING.map((b, i) => (
              <div
                key={b.n}
                className="grid grid-cols-[64px_1fr] items-start gap-5 px-6 py-6 sm:grid-cols-[80px_1fr] sm:px-9 sm:py-7"
                style={{
                  borderTop: i === 0 ? "none" : "1px solid rgba(28,35,48,0.08)",
                }}
              >
                <div
                  className="font-black tabular-nums"
                  style={{
                    ...INTER,
                    fontWeight: 900,
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                    letterSpacing: "-0.04em",
                    color: C.ink,
                    lineHeight: 1,
                  }}
                >
                  {b.n}
                </div>
                <div>
                  <h3
                    style={{
                      ...INTER,
                      fontWeight: 900,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.02em",
                      color: C.ink,
                    }}
                  >
                    {b.t}
                  </h3>
                  <p
                    className="mt-1.5 max-w-2xl text-[14.5px] leading-[1.65]"
                    style={{ color: C.muted, fontWeight: 500 }}
                  >
                    {b.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
