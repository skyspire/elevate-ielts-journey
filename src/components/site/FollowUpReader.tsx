import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getSpeakingModelAnswer,
  type SpeakingAnswerVariant,
} from "@/data/speaking-model-answers";

/**
 * FollowUpReader — full-screen reader for examiner follow-up questions.
 *
 * Mirrors the cue-card reader's layout (header, scrollable lane with section
 * banners, footer pager with three tabs) but:
 *   • Uses a fresh AMBER → TEAL → PLUM palette so follow-up answers feel
 *     visually distinct from the cue-card's red/blue/olive set.
 *   • Each answer card gets a solid 2px border in its own signature color.
 *   • Reveal is a "burst-and-split" genie animation: a glowing wisp bursts
 *     from the click origin and splits into three palette-tinted streams
 *     before the reader materializes.
 */

export type FollowUpReaderProps = {
  open: boolean;
  onClose: () => void;
  question: { id: string; title: string };
  // Click origin in viewport coords — drives the burst-and-split entrance.
  origin: { x: number; y: number } | null;
  // Which follow-up this is (1-based) and how many there are total.
  // Drives the prominent "01 / 03" circle badge above the headline.
  index: number;
  total: number;
};

type EntrancePhase = "closed" | "burst" | "settled";

export function FollowUpReader({ open, onClose, question, origin, index, total }: FollowUpReaderProps) {
  const [phase, setPhase] = useState<EntrancePhase>("closed");
  const [variantIndex, setVariantIndex] = useState(0);
  const [switchDir, setSwitchDir] = useState<1 | -1>(1);
  const [laneAnim, setLaneAnim] = useState<"idle" | "out" | "in">("idle");
  const [revealedSections, setRevealedSections] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Build three answer variants from the follow-up question's text.
  const followUpAnswer = useMemo(
    () => getSpeakingModelAnswer(question.title, true),
    [question.title],
  );
  const variants: SpeakingAnswerVariant[] = useMemo(() => {
    if (followUpAnswer.variants && followUpAnswer.variants.length > 0) {
      return followUpAnswer.variants;
    }
    return [
      {
        label: "Sample answer",
        bandScore: followUpAnswer.bandScore,
        sections: followUpAnswer.sections,
      },
    ];
  }, [followUpAnswer]);

  const currentVariant = variants[Math.min(variantIndex, variants.length - 1)];

  // Flatten the variant's sections into a single flowing answer body.
  // Follow-up answers are conversational replies, not sectioned essays —
  // so we present them as one continuous response, billboard-style.
  const fullBody = useMemo(
    () => currentVariant.sections.map((s) => s.body).join(" "),
    [currentVariant],
  );

  // Parse the body into:
  //   • openingPhrase — bold pull-out (first sentence / 14 words)
  //   • bodyBeforePullQuote — paragraph(s) leading up to the pull-quote
  //   • pullQuote — strongest mid-answer sentence, broken out as centered quote
  //   • bodyAfterPullQuote — remaining text after the pull-quote
  const { openingPhrase, bodyBeforePullQuote, pullQuote, bodyAfterPullQuote } = useMemo(() => {
    const text = fullBody.trim();

    // 1. Opening phrase (bold opener).
    let opening = "";
    let rest = text;
    const sentenceMatch = text.match(/^[^.!?]{1,120}[.!?]/);
    if (sentenceMatch) {
      opening = sentenceMatch[0].trim();
      rest = text.slice(sentenceMatch[0].length).trim();
    } else {
      const words = text.split(/\s+/);
      opening = words.slice(0, 14).join(" ") + (words.length > 14 ? "…" : "");
      rest = words.slice(14).join(" ");
    }

    // 2. Split the remainder into sentences and pick a mid-answer pull-quote.
    //    Prefer a sentence in the middle third that is between 60–180 chars.
    const sentences = rest
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (sentences.length < 3) {
      return {
        openingPhrase: opening,
        bodyBeforePullQuote: rest,
        pullQuote: "",
        bodyAfterPullQuote: "",
      };
    }

    // Search the middle 60% of sentences for a good pull-quote candidate.
    const startIdx = Math.floor(sentences.length * 0.25);
    const endIdx = Math.ceil(sentences.length * 0.75);
    let pullIdx = -1;
    let bestLen = 0;
    for (let i = startIdx; i < endIdx; i++) {
      const len = sentences[i].length;
      if (len >= 50 && len <= 180 && len > bestLen) {
        bestLen = len;
        pullIdx = i;
      }
    }
    if (pullIdx === -1) {
      // Fallback: middle sentence.
      pullIdx = Math.floor(sentences.length / 2);
    }

    return {
      openingPhrase: opening,
      bodyBeforePullQuote: sentences.slice(0, pullIdx).join(" "),
      pullQuote: sentences[pullIdx],
      bodyAfterPullQuote: sentences.slice(pullIdx + 1).join(" "),
    };
  }, [fullBody]);

  // ── PARCHMENT + INK palette with bold per-variant gradient washes ──────
  // Background base is a warm cream parchment for premium long-read comfort.
  // Each variant overlays its own gradient wash (Sunrise · Forest · Twilight)
  // as a translucent atmospheric tint — rich but readable. Text stays a deep
  // espresso ink for full contrast on parchment.
  const PARCHMENT      = "oklch(0.965 0.022 82)";   // warm cream paper
  const PARCHMENT_DEEP = "oklch(0.93 0.030 78)";    // edge / vignette
  const INK            = "oklch(0.24 0.030 60)";    // deep espresso
  const INK_SOFT       = "oklch(0.32 0.028 60 / 0.92)";

  const palette = [
    {
      // SUNRISE — warm peach → amber → rose
      label:        "Sunrise",
      gradTop:      "oklch(0.88 0.085 55)",
      gradMid:      "oklch(0.83 0.105 35)",
      gradBottom:   "oklch(0.78 0.110 22)",
      accent:       "oklch(0.58 0.150 32)",   // burnt sienna
      accentDeep:   "oklch(0.42 0.130 32)",
      tabBg:        "oklch(0.78 0.105 38)",
      tabBorder:    "oklch(0.44 0.140 32)",
      tabInk:       "oklch(0.20 0.040 35)",
      // Legacy aliases used by JSX below — body stays ink-on-parchment;
      // chrome/badges/borders take the variant's accent hue.
      ink:          INK,
      inkSoft:      INK_SOFT,
      fill:         "oklch(0.58 0.150 32)",
      fillDeep:     "oklch(0.42 0.130 32)",
    },
    {
      // FOREST — sage → moss → deep pine
      label:        "Forest",
      gradTop:      "oklch(0.86 0.060 155)",
      gradMid:      "oklch(0.74 0.080 150)",
      gradBottom:   "oklch(0.58 0.090 148)",
      accent:       "oklch(0.42 0.090 150)",
      accentDeep:   "oklch(0.30 0.070 150)",
      tabBg:        "oklch(0.70 0.085 150)",
      tabBorder:    "oklch(0.34 0.080 150)",
      tabInk:       "oklch(0.18 0.030 150)",
      ink:          INK,
      inkSoft:      INK_SOFT,
      fill:         "oklch(0.42 0.090 150)",
      fillDeep:     "oklch(0.30 0.070 150)",
    },
    {
      // TWILIGHT — lilac → indigo → deep plum
      label:        "Twilight",
      gradTop:      "oklch(0.84 0.075 295)",
      gradMid:      "oklch(0.66 0.105 285)",
      gradBottom:   "oklch(0.46 0.110 290)",
      accent:       "oklch(0.40 0.130 295)",
      accentDeep:   "oklch(0.28 0.110 295)",
      tabBg:        "oklch(0.62 0.100 290)",
      tabBorder:    "oklch(0.32 0.115 295)",
      tabInk:       "oklch(0.99 0.012 290)",
      ink:          INK,
      inkSoft:      INK_SOFT,
      fill:         "oklch(0.40 0.130 295)",
      fillDeep:     "oklch(0.28 0.110 295)",
    },
  ];
  const activePalette = palette[variantIndex % palette.length];

  // Open / close phase machine.
  useEffect(() => {
    if (!open) {
      if (phase !== "closed") {
        setPhase("closed");
        setVariantIndex(0);
        setRevealedSections(0);
      }
      return;
    }
    // Burst → settled. The burst animation runs in CSS for ~520ms; once it
    // peaks we transition to "settled" so the reader content fades in.
    setPhase("burst");
    const t = window.setTimeout(() => setPhase("settled"), 520);
    return () => clearTimeout(t);
  }, [open]);

  // Billboard: the whole answer appears as one block — no per-section reveal.
  // We keep `revealedSections` for compatibility with the lane-slide effect:
  // it just toggles 0 → 1 once the reader settles.
  useEffect(() => {
    if (phase !== "settled") {
      setRevealedSections(0);
      return;
    }
    setRevealedSections(1);
  }, [phase, variantIndex]);

  // Body scroll lock.
  useEffect(() => {
    if (phase === "closed") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [phase]);

  // Esc + arrow keys.
  useEffect(() => {
    if (phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (variants.length > 1) {
        if (e.key === "ArrowRight") goToVariant(variantIndex + 1);
        if (e.key === "ArrowLeft") goToVariant(variantIndex - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, variantIndex, variants.length]);

  function goToVariant(next: number) {
    if (variants.length <= 1) return;
    const clamped = (next + variants.length) % variants.length;
    if (clamped === variantIndex) return;
    const forward =
      (clamped - variantIndex + variants.length) % variants.length === 1;
    setSwitchDir(forward ? 1 : -1);
    setLaneAnim("out");
    window.setTimeout(() => {
      setVariantIndex(clamped);
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
      setLaneAnim("in");
    }, 260);
    window.setTimeout(() => setLaneAnim("idle"), 660);
  }

  if (phase === "closed") return null;

  // Burst origin — defaults to viewport center if no click point given.
  const burstX = origin?.x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const burstY = origin?.y ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const isBursting = phase === "burst";
  const isSettled = phase === "settled";

  return (
    <div
      className="fixed inset-0 z-[110]"
      role="dialog"
      aria-modal="true"
      aria-label={`${question.title} — Sample answers`}
    >
      {/* Backdrop fade */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/55 backdrop-blur-md transition-opacity duration-500"
        style={{ opacity: isSettled ? 1 : 0.0 }}
      />

      {/* ── Burst & split streams overlay ─────────────────────────────────
          A central glowing wisp bursts from the click origin, then three
          palette-tinted streams arc outward in three directions. Pure CSS
          via inline keyframe animations — no JS animation loop. */}
      {isBursting && (
        <div
          className="pointer-events-none absolute inset-0 z-[112] overflow-hidden"
          aria-hidden
        >
          {/* Central wisp */}
          <span
            className="absolute rounded-full"
            style={{
              left: burstX,
              top: burstY,
              width: 16,
              height: 16,
              marginLeft: -8,
              marginTop: -8,
              background:
                "radial-gradient(circle, oklch(0.98 0.02 80) 0%, oklch(0.85 0.10 80 / 0.7) 50%, transparent 70%)",
              boxShadow: "0 0 60px 20px oklch(0.95 0.05 80 / 0.55)",
              animation: "fu-burst-core 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          />
          {/* Three palette-tinted streams arcing outward */}
          {palette.map((p, i) => {
            // Three directions: up-left, up, up-right (slight upward spread).
            const angle = -90 + (i - 1) * 28; // -118°, -90°, -62°
            const rad = (angle * Math.PI) / 180;
            const dist = 380;
            const dx = Math.cos(rad) * dist;
            const dy = Math.sin(rad) * dist;
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: burstX,
                  top: burstY,
                  width: 12,
                  height: 12,
                  marginLeft: -6,
                  marginTop: -6,
                  background: p.fill,
                  boxShadow: `0 0 30px 8px ${p.fill}`,
                  ["--fu-dx" as string]: `${dx}px`,
                  ["--fu-dy" as string]: `${dy}px`,
                  animation: `fu-stream 520ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 50}ms forwards`,
                  opacity: 0,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── Reader stage ─────────────────────────────────────────────────
          Fades + scales in from the burst origin once the streams settle. */}
      <div
        className="pointer-events-auto absolute inset-0 origin-center"
        style={{
          opacity: isSettled ? 1 : 0,
          transform: isSettled ? "scale(1)" : "scale(0.94)",
          transformOrigin: `${burstX}px ${burstY}px`,
          transition:
            "opacity 380ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* ── PARCHMENT background + per-variant gradient wash ──────────────
            Layered for richness:
              1. Warm cream parchment base (constant — readable, premium)
              2. Per-variant atmospheric gradient wash (multiply blend, ~32%)
                 — Sunrise / Forest / Twilight tints the room without
                 fighting the ink
              3. Soft top→bottom vignette to give depth
              4. Faint paper grain (multiply, ~10%) for tactility */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ backgroundColor: PARCHMENT }}
        >
          {/* Atmospheric gradient wash — variant-specific */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(160deg, ${activePalette.gradTop} 0%, ${activePalette.gradMid} 55%, ${activePalette.gradBottom} 100%)`,
              mixBlendMode: "multiply",
              opacity: 0.32,
              transition:
                "background-image 640ms cubic-bezier(0.4, 0, 0.2, 1), opacity 640ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          {/* Top vignette anchoring the header pill */}
          <div
            className="absolute inset-x-0 top-0 h-48"
            style={{
              background: `linear-gradient(180deg, ${activePalette.accentDeep}33 0%, transparent 100%)`,
            }}
          />
          {/* Bottom vignette toward the footer band */}
          <div
            className="absolute inset-x-0 bottom-0 h-56"
            style={{
              background: `linear-gradient(0deg, ${PARCHMENT_DEEP}cc 0%, transparent 100%)`,
            }}
          />
          {/* Paper grain — fine dotted overlay */}
          <div
            className="absolute inset-0 opacity-[0.10] mix-blend-multiply"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, oklch(0.30 0.04 60) 0.5px, transparent 1.2px), radial-gradient(circle at 2px 3px, oklch(0.30 0.04 60) 0.4px, transparent 1px)",
              backgroundSize: "4px 4px, 7px 7px",
            }}
          />
        </div>

        {/* Header — Back button. Now sits on parchment, so use ink color. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end items-center px-4 pt-4 sm:px-6 sm:pt-6">
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold backdrop-blur-md transition-colors"
            style={{
              color: INK,
              borderColor: `${activePalette.accentDeep}55`,
              backgroundColor: `${PARCHMENT}cc`,
            }}
            aria-label="Close"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>

        {/* ── Two-column billboard ───────────────────────────────────────
            Desktop (lg+): LEFT column (question stack) is FIXED — it does
            not scroll. Only the RIGHT column (answer body) scrolls.
            Mobile: single column, whole stage scrolls (question first,
            answer below). */}
        {(() => {
          const isOut = laneAnim === "out";
          const outStyle: React.CSSProperties = {
            transform: `translate3d(${-switchDir * 36}px, 0, 0)`,
            opacity: 0,
            transition:
              "transform 260ms cubic-bezier(0.4, 0, 1, 1), opacity 260ms cubic-bezier(0.4, 0, 1, 1)",
            willChange: "transform, opacity",
          };
          const inOrIdleStyle: React.CSSProperties = {
            animation:
              laneAnim === "in"
                ? "lane-slide-in 380ms cubic-bezier(0, 0, 0.2, 1) both"
                : undefined,
            ["--lane-from-x" as string]: `${switchDir * 36}px`,
          };
          const visible = revealedSections > 0;
          const laneStyle: React.CSSProperties = {
            visibility: visible ? "visible" : "hidden",
            ...(isOut ? outStyle : inOrIdleStyle),
          };

          // ── LEFT: fixed question stack (centered vertically) ──────────
          // Editorial treatment:
          //   • Massive display numeral (e.g. "01") set tight & heavy, with a
          //     hairline rule beneath and a tiny "/ 03 FOLLOW-UPS" counter.
          //   • "Follow-up" label uses the site's display font, bold, with a
          //     short accent underline in the variant color.
          //   • Headline gets an ink-bleed underline sweep on entrance: a
          //     thin rule expands left→right under the question, then settles
          //     as a permanent accent.
          const QuestionStack = (
            <aside className="flex w-full flex-col items-start text-left">
              {/* Editorial numeral block */}
              <div className="relative flex items-baseline gap-3" aria-hidden>
                <span
                  className="font-display font-black leading-[0.85] tabular-nums"
                  style={{
                    color: activePalette.ink,
                    fontSize: "clamp(5rem, 9vw, 8.5rem)",
                    letterSpacing: "-0.055em",
                    fontFeatureSettings: '"ss01", "cv11", "lnum"',
                    textShadow: `0 6px 32px ${activePalette.fillDeep}`,
                  }}
                >
                  {String(index).padStart(2, "0")}
                </span>
              </div>
              {/* Hairline rule + counter */}
              <div className="mt-3 flex w-full items-center gap-3">
                <span
                  className="block h-px flex-1"
                  style={{ backgroundColor: `${activePalette.ink}66` }}
                  aria-hidden
                />
                <span
                  className="font-display font-extrabold uppercase tabular-nums"
                  style={{
                    color: activePalette.ink,
                    fontSize: "10.5px",
                    letterSpacing: "0.28em",
                    opacity: 0.78,
                  }}
                >
                  / {String(total).padStart(2, "0")} Follow-ups
                </span>
              </div>

              {/* "Follow-up" label — bold display + accent underline */}
              <div className="mt-9 inline-flex flex-col items-start">
                <span
                  className="font-display font-black leading-none"
                  style={{
                    color: activePalette.ink,
                    fontSize: "clamp(1rem, 1.35vw, 1.15rem)",
                    letterSpacing: "-0.005em",
                  }}
                >
                  Follow-up
                </span>
                <span
                  className="mt-2 block h-[3px] rounded-full"
                  style={{
                    width: "clamp(36px, 4.5vw, 56px)",
                    backgroundColor: activePalette.accent,
                    boxShadow: `0 1px 8px ${activePalette.fillDeep}`,
                  }}
                  aria-hidden
                />
              </div>

              {/* Headline + ink-bleed underline sweep */}
              <h1
                className="fu-headline relative mt-4 font-display font-black leading-[1.05] tracking-tight"
                style={{
                  color: activePalette.ink,
                  fontSize: "clamp(1.7rem, 3.4vw, 2.65rem)",
                  letterSpacing: "-0.012em",
                  textShadow: `0 2px 28px ${activePalette.fillDeep}`,
                }}
              >
                {question.title}
                <span
                  aria-hidden
                  className="fu-headline-rule absolute left-0 -bottom-3 block h-[2.5px] origin-left rounded-full"
                  style={{
                    width: "100%",
                    backgroundImage: `linear-gradient(90deg, ${activePalette.ink} 0%, ${activePalette.accent} 75%, transparent 100%)`,
                    boxShadow: `0 1px 10px ${activePalette.fillDeep}`,
                  }}
                />
              </h1>
            </aside>
          );

          // ── RIGHT: scrollable answer body ─────────────────────────────
          const AnswerBody = (
            <div
              className="font-display"
              style={{
                color: activePalette.inkSoft,
                fontSize: "clamp(1.0625rem, 1.55vw, 1.2rem)",
                lineHeight: 1.72,
                fontWeight: 500,
              }}
            >
              <p>
                <span
                  className="font-display font-extrabold"
                  style={{
                    color: activePalette.ink,
                    fontSize: "1.12em",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {openingPhrase}
                </span>
                {bodyBeforePullQuote && <span> {bodyBeforePullQuote}</span>}
              </p>

              {pullQuote && (
                <figure
                  className="my-8 flex flex-col items-center text-center"
                  aria-label="Pull quote"
                >
                  <blockquote
                    className="mt-4 font-display font-extrabold leading-[1.25] tracking-tight"
                    style={{
                      color: activePalette.ink,
                      fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
                      maxWidth: "560px",
                      textShadow: `0 2px 18px ${activePalette.fillDeep}`,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        opacity: 0.55,
                        marginRight: "0.12em",
                        fontSize: "1.4em",
                        lineHeight: 0,
                        verticalAlign: "-0.18em",
                      }}
                    >
                      “
                    </span>
                    {pullQuote.replace(/^["“”]|["“”]$/g, "")}
                    <span
                      aria-hidden
                      style={{
                        opacity: 0.55,
                        marginLeft: "0.08em",
                        fontSize: "1.4em",
                        lineHeight: 0,
                        verticalAlign: "-0.18em",
                      }}
                    >
                      ”
                    </span>
                  </blockquote>
                </figure>
              )}

              {bodyAfterPullQuote && <p>{bodyAfterPullQuote}</p>}
            </div>
          );

          return (
            <>
              {/* ── DESKTOP (lg+): split layout, only right column scrolls ── */}
              <div
                key={`fu-desktop-${variantIndex}`}
                className="absolute inset-0 hidden pt-[72px] pb-[140px] sm:pt-[88px] sm:pb-[160px] lg:block"
                style={laneStyle}
              >
                <div className="mx-auto grid h-full w-full max-w-[1280px] grid-cols-[2fr_3fr] gap-14 px-10">
                  {/* Fixed (non-scrolling) question column — left-aligned editorial */}
                  <div className="flex h-full items-center justify-start pr-8">
                    {QuestionStack}
                  </div>
                  {/* Scrollable answer column */}
                  <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto border-l py-10 pl-12 pr-2"
                    style={{ borderColor: `${activePalette.ink}26` }}
                  >
                    {AnswerBody}
                  </div>
                </div>
              </div>

              {/* ── MOBILE / TABLET: stacked, whole stage scrolls ────────── */}
              <div
                key={`fu-mobile-${variantIndex}`}
                className="absolute inset-0 overflow-y-auto pt-[72px] pb-[140px] sm:pt-[88px] sm:pb-[160px] lg:hidden"
              >
                <div className="mx-auto flex min-h-full max-w-[1280px] flex-col gap-10 px-5 py-6 sm:px-10">
                  <article style={laneStyle} className="flex flex-col gap-10">
                    {QuestionStack}
                    <div>{AnswerBody}</div>
                  </article>
                </div>
              </div>
            </>
          );
        })()}

        {/* Footer pager — FULL-WIDTH BAND with palette-toned top divider rule. */}
        {variants.length > 1 && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
            style={{
              borderTop: `1px solid ${activePalette.accentDeep}55`,
              background: `linear-gradient(180deg, ${PARCHMENT_DEEP} 0%, ${PARCHMENT} 100%)`,
              backdropFilter: "blur(6px)",
              boxShadow: `0 -8px 24px ${activePalette.accentDeep}1a`,
            }}
          >
            <div className="pointer-events-auto mx-auto flex w-full max-w-[1280px] items-stretch gap-1.5 px-4 py-3 sm:px-10 sm:py-4">
              <button
                type="button"
                onClick={() => goToVariant(variantIndex - 1)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12"
                style={{ color: `${INK}b3` }}
                aria-label="Previous answer"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.6} />
              </button>

              <div
                className="flex flex-1 items-stretch gap-1.5"
                role="tablist"
                aria-label="Sample answers"
              >
                {variants.map((_, i) => {
                  const active = i === variantIndex;
                  const tone = palette[i % palette.length];
                  return (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => goToVariant(i)}
                      className="relative flex flex-1 items-center justify-center rounded-xl px-2 py-2.5 transition-all duration-300 ease-out sm:py-3"
                      style={{
                        backgroundColor: active ? tone.accent : `${tone.accent}1f`,
                        boxShadow: active
                          ? `inset 0 0 0 2px ${tone.accentDeep}, 0 6px 18px ${tone.accentDeep}55`
                          : `inset 0 0 0 1px ${tone.accent}55`,
                      }}
                    >
                      <span
                        className="font-display tracking-tight transition-all duration-300"
                        style={{
                          color: active ? "oklch(1 0 0 / 0.98)" : tone.accentDeep,
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
                style={{ color: `${INK}b3` }}
                aria-label="Next answer"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.6} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Local keyframes for the burst & split entrance. */}
      <style>{`
        @keyframes fu-burst-core {
          0%   { transform: scale(0.4); opacity: 0; }
          25%  { transform: scale(1.5); opacity: 1; }
          70%  { transform: scale(2.4); opacity: 0.8; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        @keyframes fu-stream {
          0%   { transform: translate3d(0, 0, 0) scale(0.4); opacity: 0; }
          15%  { opacity: 1; }
          70%  { opacity: 0.85; }
          100% {
            transform: translate3d(var(--fu-dx, 0), var(--fu-dy, 0), 0) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
