import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import type { SampleAnswer } from "@/data/sample-answers";

/**
 * WritingAnswerBillboard — parchment + ink billboard reader for writing
 * sample answers. Mirrors the cue-card answer reader (see CueCardReader in
 * FlipExpansion.tsx) so the writing samples screen has the same gallery-grade
 * reading experience as the speaking samples screen.
 *
 * Layout
 * ──────
 *   • Desktop (≥md): two-column billboard inside a fixed-height frame.
 *       LEFT (sticky, ~36% wide): tinted parchment column with the question
 *         index numeral, a short accent rule, the question title, and the
 *         BigIELTS brand lockup — all centered vertically.
 *       RIGHT: pure-white reading lane that scrolls the model essay.
 *   • Mobile (<md): the LEFT column collapses into a sticky compact pill
 *     at the top; the answer flows underneath full-width.
 *   • A footer pager with three tabs (Answer 1 · Answer 2 · Answer 3) sits
 *     on top of the billboard. Tabs swap the variant tint and re-mount the
 *     answer body with a brief lateral slide. For now all three tabs render
 *     the SAME source answer — the structure is ready for genuine variants
 *     to be slotted in later without changing the consumer.
 *
 * Data
 * ────
 * Receives a single SampleAnswer + the question title + a 1-based index
 * within its category. The component does not fetch or transform; it only
 * presents.
 */

export type WritingAnswerBillboardProps = {
  questionTitle: string;
  /** 1-based index of this question within its category (drives the numeral). */
  questionNumber: number;
  /** The single Band 8+ source answer. Repeated across the three tabs. */
  answer: SampleAnswer;
  /**
   * When true the billboard fills the viewport (100vh) instead of using
   * the default min-height. Used by the dedicated full-screen route.
   */
  fullScreen?: boolean;
};

type VariantPalette = {
  /** Display label shown inside the footer pager tab. */
  label: string;
  /** Solid tab-bg color when the variant is active. */
  tabBg: string;
  /** Tab border / outline tone. */
  tabBorder: string;
  /** Tab hover tone. */
  tabHover: string;
};

// Three palette tones for the footer pager — saffron / oxford navy / forest.
// They mirror the cue-card reader's variant tones so the two screens feel
// like siblings. The reading lane itself stays pure white across all three;
// color identity lives only in the tabs and the left-column tint.
const PALETTE: VariantPalette[] = [
  {
    label: "Answer 1",
    tabBg: "oklch(0.62 0.135 70)",
    tabBorder: "oklch(0.72 0.150 70)",
    tabHover: "oklch(0.66 0.140 70)",
  },
  {
    label: "Answer 2",
    tabBg: "oklch(0.32 0.080 255)",
    tabBorder: "oklch(0.46 0.115 255)",
    tabHover: "oklch(0.36 0.085 255)",
  },
  {
    label: "Answer 3",
    tabBg: "oklch(0.40 0.080 155)",
    tabBorder: "oklch(0.52 0.105 155)",
    tabHover: "oklch(0.44 0.082 155)",
  },
];

// Shared ink tones — deep slate for headings, softened slate for body.
// Matches CueCardReader so the typography reads as one family across the app.
const SIGNATURE_INK = "oklch(0.30 0.035 250)";
const SIGNATURE_INK_SOFT = "oklch(0.36 0.030 250 / 0.92)";

export function WritingAnswerBillboard({
  questionTitle,
  questionNumber,
  answer,
  fullScreen = false,
}: WritingAnswerBillboardProps) {
  const [variantIndex, setVariantIndex] = useState(0);
  // Lateral lane animation phase for variant switches: out → in → idle.
  // Mirrors the FollowUpReader / CueCardReader micro-interaction so all
  // three readers share the same choreography.
  const [laneAnim, setLaneAnim] = useState<"idle" | "out" | "in">("idle");
  const [switchDir, setSwitchDir] = useState<1 | -1>(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Touch-swipe state — tracks the starting point of a horizontal drag
  // so we can decide on touchend whether the gesture should advance the
  // active answer variant. Vertical-dominant gestures are ignored so the
  // reading lane keeps its native scroll behaviour.
  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const swipeHandledRef = useRef(false);

  const activePalette = PALETTE[variantIndex % PALETTE.length];

  // Left-column tint: ~10% of the variant accent mixed into a near-white
  // parchment base. Same recipe as CueCardReader so the writing & speaking
  // billboards share visual DNA.
  const LEFT_TINT = useMemo(
    () =>
      `color-mix(in oklab, ${activePalette.tabBorder} 10%, oklch(0.985 0.005 90))`,
    [activePalette.tabBorder],
  );
  const LEFT_BORDER = useMemo(
    () =>
      `color-mix(in oklab, ${activePalette.tabBorder} 22%, transparent)`,
    [activePalette.tabBorder],
  );

  // Number string for the big numeral (always two digits, e.g. "01").
  const numberStr = String(Math.max(1, questionNumber)).padStart(2, "0");

  function goToVariant(next: number) {
    const clamped = (next + PALETTE.length) % PALETTE.length;
    if (clamped === variantIndex) return;
    const forward =
      (clamped - variantIndex + PALETTE.length) % PALETTE.length === 1;
    setSwitchDir(forward ? 1 : -1);
    setLaneAnim("out");
    window.setTimeout(() => {
      setVariantIndex(clamped);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
      }
      setLaneAnim("in");
    }, 220);
    window.setTimeout(() => setLaneAnim("idle"), 600);
  }

  // Keyboard arrows shift the active variant when the billboard is in view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (e.key === "ArrowRight") goToVariant(variantIndex + 1);
      if (e.key === "ArrowLeft") goToVariant(variantIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantIndex]);

  // ── Reading-lane body ──────────────────────────────────────────────────
  // For the placeholder phase, all three tabs render the same paragraphs.
  // When real variants land, swap `answer.paragraphs` for a per-variant
  // selection without touching the surrounding chrome.
  const isOut = laneAnim === "out";
  const outStyle: React.CSSProperties = {
    transform: `translate3d(${-switchDir * 28}px, 0, 0)`,
    opacity: 0,
    transition:
      "transform 220ms cubic-bezier(0.4, 0, 1, 1), opacity 220ms cubic-bezier(0.4, 0, 1, 1)",
    willChange: "transform, opacity",
  };
  const inOrIdleStyle: React.CSSProperties = {
    animation:
      laneAnim === "in"
        ? "wab-lane-slide-in 380ms cubic-bezier(0, 0, 0.2, 1) both"
        : undefined,
    ["--wab-from-x" as string]: `${switchDir * 28}px`,
  };
  const laneStyle: React.CSSProperties = isOut ? outStyle : inOrIdleStyle;

  const frameHeight = fullScreen ? "100vh" : "min(720px, 78vh)";

  // ── Touch-swipe handlers ───────────────────────────────────────────────
  // Horizontal swipes on the billboard advance / rewind the active answer
  // variant. Thresholds: ≥50px horizontal travel AND horizontal distance at
  // least 1.4× vertical distance (so a near-vertical scroll never triggers
  // a tab change). One swipe per touch — `swipeHandledRef` debounces the
  // gesture across move events.
  const SWIPE_THRESHOLD = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    swipeHandledRef.current = false;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (swipeHandledRef.current) return;
    const start = touchStartRef.current;
    if (!start) return;
    const t = e.touches[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.4) return;
    swipeHandledRef.current = true;
    // dx > 0 → finger moved right → previous answer; dx < 0 → next.
    goToVariant(variantIndex + (dx < 0 ? 1 : -1));
  };
  const onTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <section
      className={
        fullScreen
          ? "relative h-screen w-screen overflow-hidden border-0 bg-white"
          : "relative mt-8 overflow-hidden rounded-3xl border bg-white shadow-card"
      }
      style={{
        borderColor: fullScreen ? undefined : "oklch(0.30 0.035 250 / 0.10)",
        minHeight: fullScreen ? undefined : frameHeight,
        touchAction: "pan-y",
      }}
      aria-label="Sample answer reader"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/* ── Two-column billboard frame ──────────────────────────────── */}
      <div
        className="flex w-full flex-col md:flex-row"
        style={{ height: frameHeight }}
      >
        {/* Mobile-only sticky compact header pill with the question title. */}
        <div
          className="pointer-events-none sticky top-0 z-20 flex justify-center px-3 pt-3 md:hidden"
        >
          <div
            className="pointer-events-auto flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-md"
            style={{
              backgroundColor: LEFT_TINT,
              border: `1px solid ${LEFT_BORDER}`,
              boxShadow: "0 6px 18px -10px oklch(0.20 0.010 250 / 0.20)",
              transition: "background-color 380ms ease, border-color 380ms ease",
            }}
          >
            <span
              className="font-display text-[12px] font-black tabular-nums leading-none text-foreground/55"
            >
              {numberStr}
            </span>
            <span
              aria-hidden
              className="block h-[14px] w-px"
              style={{ backgroundColor: `${SIGNATURE_INK}33` }}
            />
            <h2
              className="line-clamp-2 font-display text-[13.5px] font-extrabold leading-snug tracking-tight"
              style={{ color: "oklch(0.42 0.10 165)" }}
            >
              {questionTitle}
            </h2>
          </div>
        </div>

        {/* Desktop sticky LEFT column (≥md). */}
        <aside
          className="relative hidden w-[36%] max-w-[440px] shrink-0 md:flex md:flex-col lg:w-[34%]"
          style={{
            backgroundColor: LEFT_TINT,
            borderRight: `1px solid ${LEFT_BORDER}`,
            transition: "background-color 380ms ease, border-color 380ms ease",
          }}
        >
          {/* Vellum paper grain overlay — same SVG fractalNoise recipe used
              by the cue-card reader so both billboards feel like the same
              stationery. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0.14,
              mixBlendMode: "multiply",
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.32  0 0 0 0 0.28  0 0 0 0 0.22  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
              backgroundSize: "220px 220px",
            }}
          />

          {/* Centered numeral + accent rule + title + brand lockup. */}
          <div className="relative flex flex-1 flex-col items-center justify-center px-7 text-center">
            <span
              className="font-display font-black tabular-nums leading-none text-foreground/45"
              style={{
                fontSize: "clamp(3rem, 6vw, 4.5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              {numberStr}
            </span>
            <span
              aria-hidden
              className="mt-4 h-[2px] w-[44px] rounded-full"
              style={{
                backgroundColor: activePalette.tabBorder,
                opacity: 0.55,
                transition: "background-color 380ms ease",
              }}
            />
            <h2
              className="mt-3 font-display font-black leading-[1.08] tracking-tight"
              style={{
                color: "oklch(0.42 0.10 165)",
                fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
              }}
            >
              {questionTitle}
            </h2>

            {/* Brand lockup — sits under the title, matches CueCardReader. */}
            <div className="mt-6 flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "oklch(0.55 0.135 25)",
                  boxShadow:
                    "0 0 0 1px oklch(0.65 0.150 25 / 0.55), 0 6px 16px oklch(0.55 0.135 25 / 0.35)",
                }}
              >
                <GraduationCap
                  className="h-5 w-5"
                  strokeWidth={2.6}
                  style={{ color: "oklch(0.99 0.005 250)" }}
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="flex items-baseline gap-[1px]">
                  <span
                    className="font-display text-[15px] font-black tracking-tight"
                    style={{ color: SIGNATURE_INK }}
                  >
                    BigIELTS
                  </span>
                  <span
                    className="font-display text-[15px] font-black tracking-tight"
                    style={{ color: "oklch(0.55 0.080 125)" }}
                  >
                    .com
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mt-[3px] h-[2px] w-full rounded-full"
                  style={{ backgroundColor: "oklch(0.52 0.115 250)" }}
                />
              </span>
            </div>
          </div>
        </aside>

        {/* RIGHT scrollable reading lane. */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto bg-white"
          // Reserve room at the bottom so the footer pager doesn't cover
          // the last paragraph.
          style={{ paddingBottom: "96px" }}
        >
          {/* Lane wrapper carries the lateral slide on variant switches. */}
          <article
            key={`wab-${variantIndex}`}
            className="mx-auto max-w-[680px] px-5 py-8 sm:px-10 sm:py-12"
            style={laneStyle}
          >
            {/* Eyebrow: variant label + band score chip. */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1"
                style={{
                  backgroundColor: `${activePalette.tabBg}1f`,
                  color: activePalette.tabBg,
                  border: `1px solid ${activePalette.tabBorder}55`,
                  transition:
                    "background-color 380ms ease, color 380ms ease, border-color 380ms ease",
                }}
              >
                {activePalette.label}
              </span>
              <span className="inline-flex items-center rounded-full border border-foreground/10 bg-paper-cream px-2.5 py-1">
                Band {answer.bandScore}
              </span>
              <span className="inline-flex items-center rounded-full border border-foreground/10 bg-paper-cream px-2.5 py-1">
                {answer.wordCount} words
              </span>
            </div>

            {/* Essay body — paragraphs with subtle headings. */}
            <div className="mt-6 space-y-7">
              {answer.paragraphs.map((p) => (
                <div key={p.heading}>
                  <h3
                    className="font-display text-[15px] font-extrabold uppercase tracking-[0.16em]"
                    style={{ color: SIGNATURE_INK, opacity: 0.75 }}
                  >
                    {p.heading}
                  </h3>
                  <p
                    className="mt-2 font-display"
                    style={{
                      color: SIGNATURE_INK_SOFT,
                      fontSize: "clamp(1rem, 1.45vw, 1.125rem)",
                      lineHeight: 1.78,
                      fontWeight: 500,
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      {/* ── Footer pager — three sample-answer tabs ───────────────────── */}
      {/* In full-screen mode we use position:fixed so the pager is pinned
          to the viewport bottom no matter what scrolls inside the reader.
          In embedded mode it stays absolutely positioned to the section. */}
      <div
        className={`pointer-events-none ${fullScreen ? "fixed" : "absolute"} inset-x-0 bottom-0 z-50`}
        style={{
          borderTop: `1px solid ${activePalette.tabBorder}55`,
          background:
            "linear-gradient(180deg, oklch(0.97 0.012 90) 0%, oklch(0.985 0.008 90) 100%)",
          backdropFilter: "blur(6px)",
          boxShadow: `0 -8px 24px ${activePalette.tabBorder}1a`,
        }}
      >
        <div className="pointer-events-auto mx-auto flex w-full items-stretch gap-1.5 px-4 py-3 sm:px-8 sm:py-3.5">
          <button
            type="button"
            onClick={() => goToVariant(variantIndex - 1)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12"
            style={{ color: `${SIGNATURE_INK}b3` }}
            aria-label="Previous answer"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.6} />
          </button>

          <div
            className="flex flex-1 items-stretch gap-1.5"
            role="tablist"
            aria-label="Sample answers"
          >
            {PALETTE.map((tone, i) => {
              const active = i === variantIndex;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => goToVariant(i)}
                  className="relative flex flex-1 items-center justify-center rounded-xl px-2 py-2.5 transition-all duration-300 ease-out sm:py-3"
                  style={{
                    backgroundColor: active ? tone.tabBg : `${tone.tabBg}1f`,
                    boxShadow: active
                      ? `inset 0 0 0 2px ${tone.tabBorder}, 0 6px 18px ${tone.tabBorder}55`
                      : `inset 0 0 0 1px ${tone.tabBg}55`,
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.backgroundColor = `${tone.tabHover}33`;
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.backgroundColor = `${tone.tabBg}1f`;
                  }}
                >
                  <span
                    className="font-display tracking-tight transition-all duration-300"
                    style={{
                      color: active ? "oklch(1 0 0 / 0.98)" : tone.tabBorder,
                      fontWeight: active ? 800 : 700,
                      fontSize: "13px",
                      letterSpacing: active ? "-0.01em" : "0",
                    }}
                  >
                    {tone.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goToVariant(variantIndex + 1)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12"
            style={{ color: `${SIGNATURE_INK}b3` }}
            aria-label="Next answer"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.6} />
          </button>
        </div>
      </div>

      {/* Local keyframes for the lateral lane slide on variant switches. */}
      <style>{`
        @keyframes wab-lane-slide-in {
          from {
            transform: translate3d(var(--wab-from-x, 28px), 0, 0);
            opacity: 0;
          }
          to {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-wab-lane-phase] {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
