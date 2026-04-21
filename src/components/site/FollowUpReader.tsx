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

  // ── BILLBOARD palette: AMBER · TEAL · PLUM ─────────────────────────────
  // For follow-ups we go BOLD: the full screen fills with the active
  // palette's saturated color, text is white/cream, and the footer tabs
  // each carry their own signature color.
  const palette = [
    {
      // Amber — warm, energetic
      fill:      "oklch(0.62 0.18 65)",   // bold saturated amber-orange
      fillDeep:  "oklch(0.48 0.16 60)",   // for shadows / accents
      tabBg:     "oklch(0.62 0.18 65)",
      tabBorder: "oklch(0.30 0.14 60)",
      ink:       "oklch(0.99 0.015 80)",  // warm cream text
      inkSoft:   "oklch(0.99 0.015 80 / 0.85)",
    },
    {
      // Teal — cool, considered
      fill:      "oklch(0.50 0.13 200)",  // deep teal
      fillDeep:  "oklch(0.36 0.11 200)",
      tabBg:     "oklch(0.50 0.13 200)",
      tabBorder: "oklch(0.26 0.10 200)",
      ink:       "oklch(0.99 0.012 200)",
      inkSoft:   "oklch(0.99 0.012 200 / 0.85)",
    },
    {
      // Plum — rich, sophisticated
      fill:      "oklch(0.46 0.16 330)",  // deep plum
      fillDeep:  "oklch(0.32 0.14 330)",
      tabBg:     "oklch(0.46 0.16 330)",
      tabBorder: "oklch(0.24 0.13 330)",
      ink:       "oklch(0.99 0.015 330)",
      inkSoft:   "oklch(0.99 0.015 330 / 0.85)",
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
        {/* ── BILLBOARD background: LAYERED GRADIENT + GRAIN ──────────────
            • Diagonal gradient from deeper shade → bold palette fill
            • Soft top vignette to anchor the header pill
            • Whisper film grain via dotted overlay (mix-blend-overlay) */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(135deg, ${activePalette.fillDeep} 0%, ${activePalette.fill} 55%, ${activePalette.fill} 100%)`,
            transition: "background-image 640ms cubic-bezier(0.4, 0, 0.2, 1), background-color 640ms cubic-bezier(0.4, 0, 0.2, 1)",
            backgroundColor: activePalette.fill,
          }}
        >
          {/* Top vignette — gentle darkening at the very top edge */}
          <div
            className="absolute inset-x-0 top-0 h-[40%]"
            style={{
              background: `linear-gradient(180deg, ${activePalette.fillDeep} 0%, transparent 100%)`,
              opacity: 0.45,
            }}
          />
          {/* Bottom corner deepening */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 80% 100%, ${activePalette.fillDeep} 0%, transparent 55%)`,
              opacity: 0.55,
            }}
          />
          {/* Film grain — fine SVG-noise via radial dots, blended */}
          <div
            className="absolute inset-0 mix-blend-overlay opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, oklch(1 0 0) 0.5px, transparent 1.2px), radial-gradient(circle at 2px 3px, oklch(0 0 0) 0.4px, transparent 1px)",
              backgroundSize: "4px 4px, 7px 7px",
            }}
          />
        </div>

        {/* Header — only the Back button. The follow-up index gets its
            own prominent circle badge above the headline inside the card. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end items-center px-4 pt-4 sm:px-6 sm:pt-6">
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[12px] font-semibold backdrop-blur-md transition-colors hover:bg-white/20"
            style={{ color: activePalette.ink }}
            aria-label="Close"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>

        {/* ── Two-column billboard ───────────────────────────────────────
            • LEFT (60%): single-flow answer body with pull-quote breakout
            • RIGHT (40%): centered stack — outlined index badge above the
              question headline
            • Mobile: stacks with question column first, then answer.
            • Footer (full-width band) lives outside this scroll area below. */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto pt-[72px] pb-[140px] sm:pt-[88px] sm:pb-[160px]"
        >
          <div className="mx-auto flex min-h-full max-w-[1280px] items-stretch px-5 sm:px-10">
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

              return (
                <article
                  key={`fu-billboard-${variantIndex}`}
                  className="grid w-full grid-cols-1 gap-10 py-6 lg:grid-cols-[2fr_3fr] lg:gap-14 lg:py-10"
                  style={{
                    visibility: visible ? "visible" : "hidden",
                    ...(isOut ? outStyle : inOrIdleStyle),
                  }}
                >
                  {/* ── RIGHT COLUMN (mobile: first) ──────────────────────
                      Centered stack: outlined circle index badge above the
                      oversized question headline + underline swash. On
                      desktop this sits in column 2 (right). On mobile it
                      stacks above the answer (order-1). */}
                  <aside
                    className="order-1 flex flex-col items-center justify-center text-center lg:order-1 lg:pr-12"
                  >
                    {/* Outlined circle index badge */}
                    <div
                      className="relative mb-5 flex items-center justify-center rounded-full"
                      style={{
                        width: "clamp(84px, 9vw, 108px)",
                        height: "clamp(84px, 9vw, 108px)",
                        border: `3px solid ${activePalette.ink}`,
                        boxShadow: `0 6px 24px ${activePalette.fillDeep}, inset 0 0 0 1px ${activePalette.ink}33`,
                      }}
                      aria-hidden
                    >
                      <span
                        className="font-display font-black tabular-nums leading-none tracking-tight"
                        style={{
                          color: activePalette.ink,
                          fontSize: "clamp(1.85rem, 3vw, 2.5rem)",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {String(index).padStart(2, "0")}
                      </span>
                      <span
                        className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 rounded-full px-2 py-[2px] font-display font-extrabold tabular-nums"
                        style={{
                          backgroundColor: activePalette.fillDeep,
                          color: activePalette.ink,
                          fontSize: "10px",
                          letterSpacing: "0.08em",
                          border: `1.5px solid ${activePalette.ink}`,
                        }}
                      >
                        / {String(total).padStart(2, "0")}
                      </span>
                    </div>
                    <span
                      className="mb-4 font-display text-[11px] font-extrabold uppercase tracking-[0.32em]"
                      style={{ color: activePalette.ink, opacity: 0.9 }}
                    >
                      Follow-up
                    </span>

                    {/* Oversized question headline */}
                    <h1
                      className="font-display font-black leading-[1.08] tracking-tight"
                      style={{
                        color: activePalette.ink,
                        fontSize: "clamp(1.65rem, 3.2vw, 2.5rem)",
                        textShadow: `0 2px 28px ${activePalette.fillDeep}`,
                      }}
                    >
                      {question.title}
                    </h1>
                    {/* Underline swash (centered) */}
                    <div
                      className="mt-5 h-[6px] w-[clamp(72px,12vw,140px)] rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${activePalette.ink} 30%, ${activePalette.ink} 70%, transparent 100%)`,
                        opacity: 0.92,
                        boxShadow: `0 2px 14px ${activePalette.fillDeep}`,
                      }}
                    />
                  </aside>

                  {/* ── LEFT COLUMN (mobile: second) ──────────────────────
                      Single-flow answer body with bold opening phrase and
                      a centered pull-quote breakout mid-answer. */}
                  <div
                    className="order-2 lg:order-2 lg:border-l lg:pl-12"
                    style={{ borderColor: `${activePalette.ink}26` }}
                  >
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
                        {bodyBeforePullQuote && (
                          <span> {bodyBeforePullQuote}</span>
                        )}
                      </p>

                      {pullQuote && (
                        <figure
                          className="my-8 flex flex-col items-center text-center"
                          aria-label="Pull quote"
                        >
                          <span
                            className="block h-[2px] w-12 rounded-full"
                            style={{ backgroundColor: activePalette.ink, opacity: 0.55 }}
                          />
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
                          <span
                            className="mt-4 block h-[2px] w-12 rounded-full"
                            style={{ backgroundColor: activePalette.ink, opacity: 0.55 }}
                          />
                        </figure>
                      )}

                      {bodyAfterPullQuote && <p>{bodyAfterPullQuote}</p>}
                    </div>
                  </div>
                </article>
              );
            })()}
          </div>
        </div>

        {/* Footer pager — FULL-WIDTH BAND with palette-toned top divider rule. */}
        {variants.length > 1 && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
            style={{
              borderTop: `1px solid ${activePalette.ink}26`,
              background: `linear-gradient(180deg, ${activePalette.fillDeep}cc 0%, ${activePalette.fillDeep} 100%)`,
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="pointer-events-auto mx-auto flex w-full max-w-[1280px] items-stretch gap-1.5 px-4 py-3 sm:px-10 sm:py-4">
              <button
                type="button"
                onClick={() => goToVariant(variantIndex - 1)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:h-12 sm:w-12"
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
                        backgroundColor: tone.tabBg,
                        boxShadow: active
                          ? `inset 0 0 0 2px ${tone.tabBorder}, 0 6px 18px ${tone.tabBorder}`
                          : "inset 0 0 0 1px oklch(0 0 0 / 0.06)",
                      }}
                    >
                      <span
                        className="font-display tracking-tight transition-all duration-300"
                        style={{
                          color: active ? "oklch(1 0 0 / 0.98)" : "oklch(1 0 0 / 0.78)",
                          fontWeight: active ? 800 : 600,
                          fontSize: "13px",
                          letterSpacing: active ? "-0.01em" : "0",
                        }}
                      >
                        Answer {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goToVariant(variantIndex + 1)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:h-12 sm:w-12"
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
