import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/ielts-calculator")({
  head: () => ({
    meta: [
      { title: "IELTS Score Calculator — BigIELTS" },
      {
        name: "description",
        content:
          "Calculate your IELTS Overall Band Score for Academic and General Training. Enter raw Listening and Reading scores plus Writing and Speaking bands.",
      },
      { property: "og:title", content: "IELTS Score Calculator — BigIELTS" },
      {
        property: "og:description",
        content:
          "Free IELTS band score calculator. Convert raw scores to bands instantly for Academic and General Training.",
      },
    ],
  }),
  component: IeltsCalculatorPage,
});

/* ------------------------------------------------------------------ */
/* Palette — olive × cream                                            */
/* ------------------------------------------------------------------ */
const PAL = {
  paper: "#f3efe2",
  paperSoft: "#e6dec5",
  oliveSoft: "#bdb98a",
  olive: "#5e6b3a",
  oliveDeep: "#3f4a24",
  ink: "#21260f",
  cream: "#faf6e9",
};

const INTER: React.CSSProperties = {
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
};

/* ------------------------------------------------------------------ */
/* IELTS conversion tables                                            */
/* ------------------------------------------------------------------ */
type Track = "academic" | "general";

function listeningBand(raw: number): number {
  if (raw >= 39) return 9;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8;
  if (raw >= 32) return 7.5;
  if (raw >= 30) return 7;
  if (raw >= 26) return 6.5;
  if (raw >= 23) return 6;
  if (raw >= 18) return 5.5;
  if (raw >= 16) return 5;
  if (raw >= 13) return 4.5;
  if (raw >= 11) return 4;
  if (raw >= 8) return 3.5;
  if (raw >= 6) return 3;
  if (raw >= 4) return 2.5;
  return 0;
}
function academicReadingBand(raw: number): number {
  if (raw >= 39) return 9;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8;
  if (raw >= 33) return 7.5;
  if (raw >= 30) return 7;
  if (raw >= 27) return 6.5;
  if (raw >= 23) return 6;
  if (raw >= 19) return 5.5;
  if (raw >= 15) return 5;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4;
  if (raw >= 8) return 3.5;
  if (raw >= 6) return 3;
  if (raw >= 4) return 2.5;
  return 0;
}
function generalReadingBand(raw: number): number {
  if (raw >= 40) return 9;
  if (raw >= 39) return 8.5;
  if (raw >= 37) return 8;
  if (raw >= 36) return 7.5;
  if (raw >= 34) return 7;
  if (raw >= 32) return 6.5;
  if (raw >= 30) return 6;
  if (raw >= 27) return 5.5;
  if (raw >= 23) return 5;
  if (raw >= 19) return 4.5;
  if (raw >= 15) return 4;
  if (raw >= 12) return 3.5;
  if (raw >= 9) return 3;
  if (raw >= 6) return 2.5;
  return 0;
}

/** Average → round to nearest 0.5; .25 rounds UP to .5, .75 rounds UP to next whole. */
function overallBand(bands: number[]): number {
  const avg = bands.reduce((a, b) => a + b, 0) / bands.length;
  const whole = Math.floor(avg);
  const frac = avg - whole;
  if (frac < 0.25) return whole;
  if (frac < 0.75) return whole + 0.5;
  return whole + 1;
}

const INTERPRETATION: Record<string, string> = {
  "9": "Expert user",
  "8.5": "Very good user",
  "8": "Very good user",
  "7.5": "Good user",
  "7": "Good user",
  "6.5": "Competent user",
  "6": "Competent user",
  "5.5": "Modest user",
  "5": "Modest user",
  "4.5": "Limited user",
  "4": "Limited user",
  "3.5": "Extremely limited user",
  "3": "Extremely limited user",
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                    */
/* ------------------------------------------------------------------ */
function SectionShell({
  index,
  total,
  eyebrow,
  children,
  id,
}: {
  index: number;
  total: number;
  eyebrow: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative flex h-full min-h-[560px] w-full snap-start items-center justify-center px-6 py-16 sm:px-10"
      style={INTER}
    >
      {/* page-corner meta */}
      <div
        className="absolute left-6 top-6 flex items-center gap-3 sm:left-10 sm:top-10"
        style={{ color: PAL.olive }}
      >
        <span
          className="grid h-9 w-9 place-items-center rounded-full text-xs font-extrabold"
          style={{
            background: PAL.cream,
            border: `1.5px solid ${PAL.oliveSoft}`,
            color: PAL.oliveDeep,
            letterSpacing: "0.04em",
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span
          className="text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: PAL.olive }}
        >
          {eyebrow}
        </span>
        <span className="text-[11px] font-medium" style={{ color: PAL.oliveSoft }}>
          / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {children}
      </div>
    </section>
  );
}

function LiveBandCard({
  label,
  band,
  hint,
}: {
  label: string;
  band: number | null;
  hint?: string;
}) {
  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[28px] p-8"
      style={{
        background: `linear-gradient(160deg, ${PAL.olive} 0%, ${PAL.oliveDeep} 100%)`,
        boxShadow:
          "0 30px 60px -30px rgba(63,74,36,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
        color: PAL.cream,
      }}
    >
      {/* corner stamp */}
      <div
        className="absolute right-5 top-5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]"
        style={{
          background: "rgba(250,246,233,0.12)",
          border: "1px solid rgba(250,246,233,0.25)",
        }}
      >
        Live Band
      </div>
      <div className="flex h-full flex-col justify-between">
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.24em]"
            style={{ color: "rgba(250,246,233,0.7)" }}
          >
            {label}
          </p>
          <div className="mt-2 h-px w-10" style={{ background: PAL.oliveSoft }} />
        </div>

        <div className="text-center">
          <div
            className="font-black leading-none tabular-nums"
            style={{
              fontWeight: 900,
              fontSize: "clamp(5.5rem, 14vw, 9rem)",
              letterSpacing: "-0.05em",
              color: PAL.cream,
              textShadow: "0 8px 30px rgba(0,0,0,0.25)",
            }}
          >
            {band === null ? "—" : band.toFixed(1)}
          </div>
          <p
            className="mt-3 text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(250,246,233,0.65)" }}
          >
            Band Score
          </p>
        </div>

        <p
          className="text-center text-[12px] leading-snug"
          style={{ color: "rgba(250,246,233,0.7)" }}
        >
          {hint ?? "Scores update as you enter your inputs."}
        </p>
      </div>
    </div>
  );
}

function BigHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="leading-[0.95] tracking-tight"
      style={{
        ...INTER,
        fontWeight: 900,
        fontSize: "clamp(2.5rem, 6vw, 4.75rem)",
        letterSpacing: "-0.04em",
        color: PAL.ink,
      }}
    >
      {children}
    </h2>
  );
}

function SubText({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mt-5 max-w-md text-[16.5px] leading-[1.7]"
      style={{ ...INTER, fontWeight: 500, color: "rgba(33,38,15,0.72)" }}
    >
      {children}
    </p>
  );
}

/* Raw-score stepper — tactile, no native number input look */
function RawScoreInput({
  value,
  onChange,
  max = 40,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(max, n));
  return (
    <div className="mt-8 flex flex-col gap-5">
      <div
        className="flex items-stretch overflow-hidden rounded-2xl"
        style={{
          background: PAL.cream,
          border: `1.5px solid ${PAL.oliveSoft}`,
          boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset",
        }}
      >
        <button
          type="button"
          aria-label="Decrease"
          onClick={() => onChange(clamp(value - 1))}
          className="grid w-14 place-items-center text-2xl font-black transition-colors hover:bg-[color:var(--soft)]"
          style={
            {
              color: PAL.oliveDeep,
              ["--soft" as string]: PAL.paperSoft,
            } as React.CSSProperties
          }
        >
          −
        </button>
        <div className="flex flex-1 items-baseline justify-center gap-2 py-5">
          <input
            type="number"
            min={0}
            max={max}
            value={value}
            onChange={(e) => onChange(clamp(parseInt(e.target.value || "0", 10)))}
            className="w-24 bg-transparent text-center font-black tabular-nums outline-none"
            style={{
              ...INTER,
              fontWeight: 900,
              fontSize: "3rem",
              color: PAL.ink,
              letterSpacing: "-0.03em",
            }}
          />
          <span
            className="text-xl font-bold"
            style={{ color: "rgba(33,38,15,0.4)" }}
          >
            / {max}
          </span>
        </div>
        <button
          type="button"
          aria-label="Increase"
          onClick={() => onChange(clamp(value + 1))}
          className="grid w-14 place-items-center text-2xl font-black transition-colors hover:bg-[color:var(--soft)]"
          style={
            {
              color: PAL.oliveDeep,
              ["--soft" as string]: PAL.paperSoft,
            } as React.CSSProperties
          }
        >
          +
        </button>
      </div>

      {/* slider */}
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-[color:var(--accent)]"
        style={{ ["--accent" as string]: PAL.olive } as React.CSSProperties}
      />
    </div>
  );
}

/* Band picker — 0.0 → 9.0 in 0.5 steps, used for Writing & Speaking */
function BandPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const steps: number[] = [];
  for (let b = 4; b <= 9; b += 0.5) steps.push(b);
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {steps.map((b) => {
          const active = Math.abs(b - value) < 0.001;
          return (
            <button
              key={b}
              type="button"
              onClick={() => onChange(b)}
              className="rounded-full px-4 py-2 text-sm font-extrabold tabular-nums transition-all"
              style={{
                ...INTER,
                background: active ? PAL.olive : PAL.cream,
                color: active ? PAL.cream : PAL.oliveDeep,
                border: `1.5px solid ${active ? PAL.olive : PAL.oliveSoft}`,
                boxShadow: active
                  ? "0 6px 16px -8px rgba(63,74,36,0.55)"
                  : "none",
                letterSpacing: "-0.01em",
              }}
            >
              {b.toFixed(1)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Scroll progress rail */
function ProgressRail({ current, total }: { current: number; total: number }) {
  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
      {Array.from({ length: total }).map((_, i) => {
        const active = i === current;
        return (
          <span
            key={i}
            className="block rounded-full transition-all"
            style={{
              width: active ? 10 : 6,
              height: active ? 28 : 6,
              background: active ? PAL.olive : PAL.oliveSoft,
              opacity: active ? 1 : 0.55,
            }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
function IeltsCalculatorPage() {
  const [track, setTrack] = React.useState<Track>("academic");
  const [lRaw, setLRaw] = React.useState(30);
  const [rRaw, setRRaw] = React.useState(30);
  const [wBand, setWBand] = React.useState(6.5);
  const [sBand, setSBand] = React.useState(6.5);

  const lBand = listeningBand(lRaw);
  const rBand =
    track === "academic" ? academicReadingBand(rRaw) : generalReadingBand(rRaw);
  const overall = overallBand([lBand, rBand, wBand, sBand]);
  const interp = INTERPRETATION[overall.toFixed(1)] ?? "—";

  // section tracking for the rail
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState(0);
  const TOTAL = 6;

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const h = el.clientHeight;
      const idx = Math.round(el.scrollTop / h);
      setActive(Math.max(0, Math.min(TOTAL - 1, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{
        ...INTER,
        background:
          `radial-gradient(ellipse 60% 40% at 8% 0%, ${PAL.paperSoft} 0%, transparent 60%),` +
          `radial-gradient(ellipse 50% 40% at 95% 100%, ${PAL.oliveSoft}55 0%, transparent 65%),` +
          `linear-gradient(180deg, ${PAL.paper} 0%, ${PAL.paperSoft} 100%)`,
        color: PAL.ink,
      }}
    >
      {/* soft grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.22] mix-blend-multiply"
        style={{
          backgroundImage:
            `radial-gradient(${PAL.olive}22 1px, transparent 1.2px)`,
          backgroundSize: "3px 3px",
        }}
      />



      <ProgressRail current={active} total={TOTAL} />

      <main
        ref={scrollerRef}
        className="relative z-10 flex-1 snap-y snap-mandatory overflow-y-scroll scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* ============ 1. PICK TRACK ============ */}
        <SectionShell index={1} total={TOTAL} eyebrow="Choose your track">
          <div>
            <p
              className="text-xs font-extrabold uppercase tracking-[0.24em]"
              style={{ color: PAL.olive }}
            >
              IELTS Score Calculator
            </p>
            <BigHeading>
              Find your <span style={{ color: PAL.olive }}>Overall Band</span> in
              five quick steps.
            </BigHeading>
            <SubText>
              Pick Academic or General Training. Reading conversion differs
              between the two — we apply the correct table automatically.
            </SubText>

            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
              {(["academic", "general"] as Track[]).map((t) => {
                const active = track === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrack(t)}
                    className="rounded-2xl px-5 py-5 text-left transition-all"
                    style={{
                      background: active ? PAL.olive : PAL.cream,
                      color: active ? PAL.cream : PAL.oliveDeep,
                      border: `1.5px solid ${active ? PAL.olive : PAL.oliveSoft}`,
                      boxShadow: active
                        ? "0 18px 40px -22px rgba(63,74,36,0.6)"
                        : "0 1px 0 rgba(255,255,255,0.6) inset",
                    }}
                  >
                    <div
                      className="text-[10px] font-extrabold uppercase tracking-[0.22em]"
                      style={{ opacity: 0.7 }}
                    >
                      IELTS
                    </div>
                    <div
                      className="mt-1 font-black tracking-tight"
                      style={{
                        fontWeight: 900,
                        fontSize: "1.5rem",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {t === "academic" ? "Academic" : "General Training"}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                scrollerRef.current?.scrollTo({
                  top: scrollerRef.current.clientHeight,
                  behavior: "smooth",
                })
              }
              className="mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5"
              style={{
                background: PAL.ink,
                color: PAL.cream,
                boxShadow: "0 14px 30px -14px rgba(33,38,15,0.6)",
              }}
            >
              Start scrolling ↓
            </button>
          </div>
          <LiveBandCard
            label={track === "academic" ? "IELTS Academic" : "IELTS General"}
            band={null}
            hint="Scroll down to enter your Listening score first."
          />
        </SectionShell>

        {/* ============ 2. LISTENING ============ */}
        <SectionShell index={2} total={TOTAL} eyebrow="Listening">
          <div>
            <p
              className="text-xs font-extrabold uppercase tracking-[0.24em]"
              style={{ color: PAL.olive }}
            >
              Step 02 · Listening
            </p>
            <BigHeading>How many did you get right?</BigHeading>
            <SubText>
              Listening has 40 questions. Enter the number you answered
              correctly — we convert to a band using the official IELTS table.
            </SubText>
            <RawScoreInput value={lRaw} onChange={setLRaw} />
          </div>
          <LiveBandCard
            label="Listening Band"
            band={lBand}
            hint={`Raw ${lRaw} / 40 → Band ${lBand.toFixed(1)}`}
          />
        </SectionShell>

        {/* ============ 3. READING ============ */}
        <SectionShell index={3} total={TOTAL} eyebrow="Reading">
          <div>
            <p
              className="text-xs font-extrabold uppercase tracking-[0.24em]"
              style={{ color: PAL.olive }}
            >
              Step 03 · {track === "academic" ? "Academic Reading" : "General Reading"}
            </p>
            <BigHeading>Now your Reading raw score.</BigHeading>
            <SubText>
              Reading also has 40 questions.{" "}
              {track === "general"
                ? "General Training Reading is graded on a more demanding scale — you need more correct answers for the same band."
                : "We apply the Academic Reading conversion table."}
            </SubText>
            <RawScoreInput value={rRaw} onChange={setRRaw} />
          </div>
          <LiveBandCard
            label="Reading Band"
            band={rBand}
            hint={`Raw ${rRaw} / 40 → Band ${rBand.toFixed(1)}`}
          />
        </SectionShell>

        {/* ============ 4. WRITING ============ */}
        <SectionShell index={4} total={TOTAL} eyebrow="Writing">
          <div>
            <p
              className="text-xs font-extrabold uppercase tracking-[0.24em]"
              style={{ color: PAL.olive }}
            >
              Step 04 · Writing
            </p>
            <BigHeading>Pick your Writing band.</BigHeading>
            <SubText>
              Writing is band-scored directly by the examiner across the four
              criteria. Pick what you expect to score, or your last mock result.
            </SubText>
            <BandPicker value={wBand} onChange={setWBand} />
          </div>
          <LiveBandCard
            label="Writing Band"
            band={wBand}
            hint="Tap a chip to set your Writing band."
          />
        </SectionShell>

        {/* ============ 5. SPEAKING ============ */}
        <SectionShell index={5} total={TOTAL} eyebrow="Speaking">
          <div>
            <p
              className="text-xs font-extrabold uppercase tracking-[0.24em]"
              style={{ color: PAL.olive }}
            >
              Step 05 · Speaking
            </p>
            <BigHeading>And your Speaking band.</BigHeading>
            <SubText>
              Same idea — pick what you expect across Fluency, Vocabulary,
              Grammar, and Pronunciation.
            </SubText>
            <BandPicker value={sBand} onChange={setSBand} />
          </div>
          <LiveBandCard
            label="Speaking Band"
            band={sBand}
            hint="Tap a chip to set your Speaking band."
          />
        </SectionShell>

        {/* ============ 6. OVERALL REVEAL ============ */}
        <section
          className="relative flex h-full min-h-[560px] w-full snap-start items-center justify-center px-6 py-16 sm:px-10"
          style={INTER}
        >
          <div
            className="absolute left-6 top-6 flex items-center gap-3 sm:left-10 sm:top-10"
            style={{ color: PAL.olive }}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-xs font-extrabold"
              style={{
                background: PAL.cream,
                border: `1.5px solid ${PAL.oliveSoft}`,
                color: PAL.oliveDeep,
              }}
            >
              06
            </span>
            <span
              className="text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: PAL.olive }}
            >
              Your Overall Band
            </span>
          </div>

          <div className="mx-auto w-full max-w-4xl text-center">
            <p
              className="text-xs font-extrabold uppercase tracking-[0.28em]"
              style={{ color: PAL.olive }}
            >
              Estimated Overall Band Score
            </p>

            <div
              key={overall}
              className="mx-auto mt-6 animate-[scale-in_0.5s_ease-out] font-black leading-none tabular-nums"
              style={{
                fontWeight: 900,
                fontSize: "clamp(9rem, 28vw, 22rem)",
                letterSpacing: "-0.06em",
                color: PAL.oliveDeep,
                textShadow: "0 18px 60px rgba(63,74,36,0.25)",
              }}
            >
              {overall.toFixed(1)}
            </div>

            <p
              className="mt-2 font-extrabold uppercase tracking-[0.22em]"
              style={{
                fontWeight: 900,
                fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
                color: PAL.ink,
              }}
            >
              {interp}
            </p>

            <div
              className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
              style={INTER}
            >
              {[
                { k: "Listening", v: lBand, sub: `${lRaw}/40` },
                { k: "Reading", v: rBand, sub: `${rRaw}/40` },
                { k: "Writing", v: wBand, sub: "Band" },
                { k: "Speaking", v: sBand, sub: "Band" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-2xl px-4 py-5 text-left"
                  style={{
                    background: PAL.cream,
                    border: `1.5px solid ${PAL.oliveSoft}`,
                  }}
                >
                  <div
                    className="text-[10px] font-extrabold uppercase tracking-[0.2em]"
                    style={{ color: PAL.olive }}
                  >
                    {row.k}
                  </div>
                  <div
                    className="mt-1 font-black tabular-nums"
                    style={{
                      fontWeight: 900,
                      fontSize: "2rem",
                      letterSpacing: "-0.03em",
                      color: PAL.ink,
                    }}
                  >
                    {row.v.toFixed(1)}
                  </div>
                  <div
                    className="text-[11px] font-bold"
                    style={{ color: "rgba(33,38,15,0.5)" }}
                  >
                    {row.sub}
                  </div>
                </div>
              ))}
            </div>

            <p
              className="mx-auto mt-10 max-w-xl text-[13px] leading-relaxed"
              style={{ color: "rgba(33,38,15,0.6)" }}
            >
              Overall band = average of the four skills, rounded to the nearest
              0.5. .25 rounds up to .5, .75 rounds up to the next whole band.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5"
                style={{
                  background: PAL.ink,
                  color: PAL.cream,
                }}
              >
                Recalculate
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrack(track === "academic" ? "general" : "academic");
                  scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-full px-6 py-3 text-sm font-extrabold uppercase tracking-[0.18em] transition-transform hover:-translate-y-0.5"
                style={{
                  background: PAL.cream,
                  color: PAL.oliveDeep,
                  border: `1.5px solid ${PAL.oliveSoft}`,
                }}
              >
                Switch to {track === "academic" ? "General" : "Academic"}
              </button>
            </div>
          </div>
        </section>

        {/* footer in its own snap pane so it's reachable but doesn't break the deck */}
        <div className="snap-start">
          <Footer />
        </div>
      </main>
    </div>
  );
}
