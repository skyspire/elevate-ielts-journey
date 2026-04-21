import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Mic,
  Sparkles,
  ArrowUpRight,
  Link as LinkIcon,
  MessageCircleQuestion,
  GraduationCap,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  getSpeakingModelAnswer,
  type SpeakingAnswerVariant,
  type SpeakingModelAnswer,
} from "@/data/speaking-model-answers";
import {
  getSpeakingQuestions,
  isCueCardCategory,
} from "@/data/speaking-questions";
import { FollowUpReader } from "./FollowUpReader";

type FlipExpansionProps = {
  open: boolean;
  onClose: () => void;
  categoryId: string;
  topic: { id: string; label: string };
  // Anchor rect (DOMRect of the originating card) — used to position the
  // pre-flip "card" so it visually grows from where the user clicked.
  anchorRect: DOMRect | null;
};

type Phase = "closed" | "flipping" | "expanded" | "collapsing";

export function FlipExpansion({
  open,
  onClose,
  categoryId,
  topic,
  anchorRect,
}: FlipExpansionProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [revealedSections, setRevealedSections] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [variantTransitioning, setVariantTransitioning] = useState(false);
  // Lateral slide choreography (sequential out → in).
  // "out": current answer slides out in the switch direction (260ms).
  // "in":  new answer slides in from the opposite side (380ms).
  const [gravityPhase, setGravityPhase] = useState<"idle" | "out" | "in">("idle");
  // Direction of the most recent variant switch: +1 = next (slide left out,
  // new arrives from right); -1 = prev (slide right out, new arrives from left).
  const [switchDir, setSwitchDir] = useState<1 | -1>(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Follow-up reader — opened when the user taps a follow-up card. Holds the
  // clicked question + the click coordinates (used as the burst origin).
  const [followUpReader, setFollowUpReader] = useState<{
    question: { id: string; title: string };
    origin: { x: number; y: number };
    index: number;
    total: number;
  } | null>(null);

  const isCue = isCueCardCategory(categoryId);
  const questions = getSpeakingQuestions(categoryId, topic.id);
  const headerQuestion = questions[0];
  // Examiner follow-ups (skip the cue card itself at index 0)
  const followUps = isCue ? questions.slice(1) : [];
  const answer: SpeakingModelAnswer = getSpeakingModelAnswer(topic.label, isCue);

  // Build the list of switchable variants. Non-cue contexts collapse to a
  // single variant for code simplicity.
  const variants: SpeakingAnswerVariant[] = useMemo(() => {
    if (answer.variants && answer.variants.length > 0) return answer.variants;
    return [
      {
        label: "Sample answer",
        bandScore: answer.bandScore,
        sections: answer.sections,
      },
    ];
  }, [answer]);

  const currentVariant = variants[Math.min(variantIndex, variants.length - 1)];
  const sections = currentVariant.sections;

  // Drive the open/close phase machine
  useEffect(() => {
    if (!open) {
      if (phase !== "closed") {
        setPhase("collapsing");
        const t = setTimeout(() => {
          setPhase("closed");
          setRevealedSections(0);
          setVariantIndex(0);
        }, 520);
        return () => clearTimeout(t);
      }
      return;
    }
    // Opening: flip → expanded
    setPhase("flipping");
    const flipTimer = setTimeout(() => setPhase("expanded"), 620);
    return () => clearTimeout(flipTimer);
  }, [open]);

  // Reveal answer sections: gentle stagger on first open, instant on variant
  // switch (so the lateral slide-in animation isn't fighting an opacity
  // stagger underneath it).
  useEffect(() => {
    if (phase !== "expanded") return;
    const total = sections.length;
    const isVariantSwitch = gravityPhase === "in" || gravityPhase === "out";
    if (isVariantSwitch) {
      setRevealedSections(total);
      return;
    }
    setRevealedSections(0);
    const timers: number[] = [];
    const initialDelay = 220;
    const stagger = 320;
    for (let i = 0; i < total; i++) {
      timers.push(
        window.setTimeout(
          () => setRevealedSections((n) => Math.max(n, i + 1)),
          initialDelay + i * stagger,
        ),
      );
    }
    return () => timers.forEach((id) => clearTimeout(id));
  }, [phase, topic.id, variantIndex, sections.length, gravityPhase]);

  // Lock body scroll while open
  useEffect(() => {
    if (phase === "closed") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [phase]);

  // Esc to close · ←/→ to switch variants when expanded
  useEffect(() => {
    if (phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (phase === "expanded" && variants.length > 1) {
        if (e.key === "ArrowRight") goToVariant(variantIndex + 1);
        if (e.key === "ArrowLeft") goToVariant(variantIndex - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onClose, variantIndex, variants.length]);

  // Track scroll progress within the panel body (0 → 1)
  useEffect(() => {
    if (phase !== "expanded") return;
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const ratio = max > 0 ? el.scrollTop / max : 0;
      setScrollProgress(Math.min(1, Math.max(0, ratio)));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [phase, variantIndex]);

  // Reset scroll progress whenever we leave the expanded state
  useEffect(() => {
    if (phase !== "expanded") setScrollProgress(0);
  }, [phase]);

  // Lateral slide — sequential, professional answer swap.
  // 1. Out (0 → 260ms): current answer slides off in the switch direction.
  // 2. Swap (at 260ms): variantIndex flips, scroll resets, new answer is
  //    pre-positioned off-screen on the opposite side.
  // 3. In  (260 → 640ms): new answer slides into place with a soft fade.
  // Headings cross-fade their color over the full duration in parallel.
  function goToVariant(next: number, _origin?: { x: number; y: number }) {
    if (variants.length <= 1) return;
    const clamped = (next + variants.length) % variants.length;
    if (clamped === variantIndex) return;
    // Direction: forward (+1) when moving to a higher index (with wrap),
    // backward (-1) otherwise. Used to choose slide-out/in directions.
    const forward =
      (clamped - variantIndex + variants.length) % variants.length === 1;
    setSwitchDir(forward ? 1 : -1);
    setVariantTransitioning(true);
    setGravityPhase("out");

    // Mid-transition swap — old has fully slid out by now.
    window.setTimeout(() => {
      setVariantIndex(clamped);
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
      setGravityPhase("in");
    }, 260);

    // Release transition lock once the slide-in has settled.
    window.setTimeout(() => {
      setVariantTransitioning(false);
      setGravityPhase("idle");
    }, 660);
  }

  if (phase === "closed" || typeof document === "undefined") return null;

  const isExpanded = phase === "expanded";
  const isFlipping = phase === "flipping";
  const isCollapsing = phase === "collapsing";

  // Anchor-derived starting transform for the card (so it grows from origin)
  const anchorStyle: React.CSSProperties | undefined = anchorRect
    ? {
        position: "fixed",
        top: anchorRect.top,
        left: anchorRect.left,
        width: anchorRect.width,
        height: anchorRect.height,
      }
    : undefined;

  const accentText = "text-[oklch(0.42_0.10_165)]";
  const accentChip =
    "bg-[oklch(0.94_0.04_165)] text-[oklch(0.38_0.10_165)] border-[oklch(0.55_0.10_165)]/30";

  // Header stays stable and independent — it must not visually merge with
  // the answer content while scrolling. We keep scale/opacity locked.
  const headerScale = 1;
  const headerOpacity = 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label={`${topic.label} — Sample answer`}
    >
      {/* No overlay needed — Gravity drop & settle happens in-place. */}
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/55 backdrop-blur-md transition-opacity duration-500 ${
          isExpanded ? "opacity-100" : isCollapsing ? "opacity-0" : "opacity-0"
        }`}
        style={isFlipping ? { opacity: 1, transition: "opacity 500ms" } : undefined}
      />

      {/* Stage */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center p-4 sm:p-8">
        {/* Phase A — anchored flipping card */}
        {(isFlipping || (isCollapsing && anchorRect)) && anchorStyle && (
          <div
            className="pointer-events-auto"
            style={{
              ...anchorStyle,
              perspective: "1200px",
            }}
          >
            <div
              className="h-full w-full"
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 600ms cubic-bezier(0.7, 0, 0.3, 1)",
                transform: isFlipping ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front (original card look) */}
              <div
                className="absolute inset-0 flex overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-card"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex w-16 shrink-0 items-start justify-center border-r border-foreground/10 bg-foreground/[0.025] px-3 pt-6 pb-5 sm:w-20" />
                <div className="flex min-w-0 flex-1 items-center px-5 py-6 sm:px-6">
                  <p
                    className="font-display font-black leading-tight tracking-tight"
                    style={{
                      color: "oklch(0.42 0.10 165)",
                      fontSize: "clamp(1.2rem, 2.56vw, 1.5rem)",
                    }}
                  >
                    {topic.label}
                  </p>
                </div>
              </div>

              {/* Back (sage face that previews the panel) */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-2xl border border-[oklch(0.50_0.10_165)] bg-[oklch(0.50_0.10_165)] text-white shadow-card"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <Sparkles className="h-6 w-6 opacity-80" strokeWidth={2.4} />
              </div>
            </div>
          </div>
        )}

        {/* Phase B — expanded reading space.
            For cue cards we use a wide, airy full-screen reading lane with
            an atmospheric backdrop. For non-cue (general questions) we keep
            the previous compact panel. */}
        {isCue ? (
          <CueCardReader
            isExpanded={isExpanded}
            scrollRef={scrollRef}
            onClose={onClose}
            topic={topic}
            categoryId={categoryId}
            headerQuestion={headerQuestion}
            currentVariant={currentVariant}
            variants={variants}
            variantIndex={variantIndex}
            goToVariant={goToVariant}
            variantTransitioning={variantTransitioning}
            gravityPhase={gravityPhase}
            switchDir={switchDir}
            sections={sections}
            revealedSections={revealedSections}
            scrollProgress={scrollProgress}
            headerScale={headerScale}
            headerOpacity={headerOpacity}
            followUps={followUps}
            accentText={accentText}
            accentChip={accentChip}
            onOpenFollowUp={(question, origin, index, total) =>
              setFollowUpReader({ question, origin, index, total })
            }
          />
        ) : (
          <CompactPanel
            isExpanded={isExpanded}
            scrollRef={scrollRef}
            onClose={onClose}
            topic={topic}
            categoryId={categoryId}
            headerQuestion={headerQuestion}
            answerBand={currentVariant.bandScore}
            sections={sections}
            revealedSections={revealedSections}
            accentText={accentText}
            accentChip={accentChip}
          />
        )}
      </div>

      {/* Follow-up genie reader — opens above the cue-card stage when the
          user taps any follow-up question. Burst & split entrance from the
          click origin, then materializes a full-screen reader with three
          amber/teal/plum sample answers. */}
      {followUpReader && (
        <FollowUpReader
          open={Boolean(followUpReader)}
          onClose={() => setFollowUpReader(null)}
          question={followUpReader.question}
          origin={followUpReader.origin}
          index={followUpReader.index}
          total={followUpReader.total}
        />
      )}
    </div>,
    document.body,
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Cue-card reader — spacious centered column with atmospheric background,   */
/*  soft sticky header, paragraph rhythm separators, edge follow-ups, and a   */
/*  minimal footer pager for the three sample answers.                        */
/* ────────────────────────────────────────────────────────────────────────── */

type CueReaderProps = {
  isExpanded: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  topic: { id: string; label: string };
  categoryId: string;
  headerQuestion: { title: string } | undefined;
  currentVariant: SpeakingAnswerVariant;
  variants: SpeakingAnswerVariant[];
  variantIndex: number;
  goToVariant: (n: number, origin?: { x: number; y: number }) => void;
  variantTransitioning: boolean;
  gravityPhase: "idle" | "out" | "in";
  switchDir: 1 | -1;
  sections: { heading: string; body: string }[];
  revealedSections: number;
  scrollProgress: number;
  headerScale: number;
  headerOpacity: number;
  followUps: { id: string; title: string }[];
  accentText: string;
  accentChip: string;
  onOpenFollowUp: (
    question: { id: string; title: string },
    origin: { x: number; y: number },
    index: number,
    total: number,
  ) => void;
};

function CueCardReader({
  isExpanded,
  scrollRef,
  onClose,
  topic,
  categoryId,
  headerQuestion,
  currentVariant,
  variants,
  variantIndex,
  goToVariant,
  variantTransitioning,
  gravityPhase,
  switchDir,
  sections,
  revealedSections,
  scrollProgress,
  headerScale,
  headerOpacity,
  followUps,
  accentText,
  accentChip,
  onOpenFollowUp,
}: CueReaderProps) {
  // Edge softening intensifies as the reader scrolls — creates the focus tunnel.
  // Kept for backwards compat; opacity fixed to 0 on the billboard treatment.
  const tunnelStrength = Math.min(1, scrollProgress * 1.4);
  const _vignetteOpacityUnused = 0.18 + tunnelStrength * 0.32;

  // ── Atmospheric mood shift ───────────────────────────────────────────────
  // On every variant switch, the reading lane briefly desaturates and dims
  // (~325ms), text/colors swap silently at the trough, then the new palette
  // resaturates over ~325ms. Total ~650ms — silent, premium, gallery-quality.
  const headerAnchorRef = useRef<HTMLDivElement | null>(null);
  const [moodPhase, setMoodPhase] = useState<"idle" | "out" | "in">("idle");
  const prevVariantRef = useRef(variantIndex);

  // ── PURE WHITE cue-card surface ─────────────────────────────────────────
  // All three answer variants share the SAME pure-white paper — no tint,
  // no gradient, no texture. Color identity (dusty blue → slate) lives only
  // in the footer pager tabs and the follow-up rail, so the reading lane
  // itself stays gallery-clean and uninterrupted across variant switches.
  //   • PURE_WHITE        — flat paper background (used for fill + fillDeep)
  //   • SIGNATURE_INK     — deep slate-navy for headings & accents
  //   • SIGNATURE_INK_SOFT — softened slate for body text
  // Footer tab tones (tabBg/tabBorder) carry the dusty-blue → slate palette
  // so each variant tab still feels distinct in the colorful footer band.
  const PURE_WHITE         = "oklch(1 0 0)";
  const SIGNATURE_INK      = "oklch(0.30 0.035 250)";          // deep slate
  const SIGNATURE_INK_SOFT = "oklch(0.36 0.030 250 / 0.92)";   // softened slate
  const palette = [
    {
      // DUSTY BLUE — light, airy
      fill:      PURE_WHITE,
      fillDeep:  PURE_WHITE,
      tabBg:     "oklch(0.78 0.045 240)",
      tabBorder: "oklch(0.42 0.055 240)",
      ink:       SIGNATURE_INK,
      inkSoft:   SIGNATURE_INK_SOFT,
      tabHover:  "oklch(0.82 0.040 240)",
      screen:    PURE_WHITE,
      glow:      "oklch(0.78 0.045 240)",
      heading:   SIGNATURE_INK,
    },
    {
      // STEEL BLUE — mid-tone, considered
      fill:      PURE_WHITE,
      fillDeep:  PURE_WHITE,
      tabBg:     "oklch(0.62 0.055 245)",
      tabBorder: "oklch(0.32 0.055 245)",
      ink:       SIGNATURE_INK,
      inkSoft:   SIGNATURE_INK_SOFT,
      tabHover:  "oklch(0.66 0.050 245)",
      screen:    PURE_WHITE,
      glow:      "oklch(0.62 0.055 245)",
      heading:   SIGNATURE_INK,
    },
    {
      // DEEP SLATE — confident, magazine-like
      fill:      PURE_WHITE,
      fillDeep:  PURE_WHITE,
      tabBg:     "oklch(0.42 0.045 250)",
      tabBorder: "oklch(0.24 0.040 250)",
      ink:       SIGNATURE_INK,
      inkSoft:   SIGNATURE_INK_SOFT,
      tabHover:  "oklch(0.46 0.040 250)",
      screen:    PURE_WHITE,
      glow:      "oklch(0.42 0.045 250)",
      heading:   SIGNATURE_INK,
    },
  ];
  const activePalette = palette[variantIndex % palette.length];

  // Drive the atmospheric mood-shift on every variant change.
  useEffect(() => {
    if (!isExpanded) return;
    if (prevVariantRef.current === variantIndex) return;
    prevVariantRef.current = variantIndex;

    setMoodPhase("out");
    // Halfway through (~325ms), the lane is at its dimmest/most-desaturated.
    // Flip to "in" so the new palette resaturates and rises back to full.
    const tIn = window.setTimeout(() => setMoodPhase("in"), 325);
    const tEnd = window.setTimeout(() => setMoodPhase("idle"), 700);
    return () => {
      clearTimeout(tIn);
      clearTimeout(tEnd);
    };
  }, [variantIndex, isExpanded]);

  return (
    <div
      className={`pointer-events-auto absolute inset-0 origin-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExpanded
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-[0.98] opacity-0"
      }`}
    >
      {/* ── PURE WHITE reading surface — flat, no gradient, no texture.
          The user explicitly asked for pure white across all variants;
          color identity lives only in the footer pager + follow-up rail. */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ backgroundColor: PURE_WHITE }}
      />

      {/* Brand seal watermark — cream ink so it reads against the bold palette fill. */}
      <div
        className="pointer-events-none absolute z-[1]"
        style={{ right: "max(24px, 4vmin)", bottom: "calc(96px + max(16px, 2vmin))", opacity: 0.10 }}
      >
        <div
          className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
          style={{ border: `3px solid ${activePalette.ink}` }}
        >
          <GraduationCap className="h-7 w-7" strokeWidth={2.5} style={{ color: activePalette.ink }} />
          <div className="flex flex-col leading-none">
            <span
              className="font-display text-[15px] font-black tracking-tight"
              style={{ color: activePalette.ink }}
            >
              BigIELTS
            </span>
            <span
              className="mt-1 font-display text-[8px] font-extrabold tracking-[0.4em]"
              style={{ color: activePalette.ink }}
            >
              .COM
            </span>
          </div>
        </div>
      </div>

      {/* Stable, isolated topic header — minimal, transparent, cream-on-palette. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-4 sm:pt-6"
        style={{ transform: `scale(${headerScale})`, opacity: headerOpacity, transformOrigin: "top center", transition: "transform 240ms ease, opacity 240ms ease" }}
      >
        <div
          ref={headerAnchorRef}
          className="pointer-events-auto w-full max-w-[680px] rounded-2xl px-5 py-3.5 backdrop-blur-md sm:px-7 sm:py-4"
          style={{
            backgroundColor: `${activePalette.ink}0A`,
            border: `1px solid ${activePalette.ink}1F`,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2.5">
              <span
                className="inline-flex shrink-0 items-center gap-1.5 pr-1"
                style={{ color: activePalette.ink }}
                aria-label="Speaking Part Two"
              >
                <Mic className="h-3.5 w-3.5 opacity-90" strokeWidth={2.4} />
                <span className="relative font-handwriting text-[20px] leading-none tracking-tight sm:text-[22px]">
                  Part Two
                  <svg
                    aria-hidden
                    viewBox="0 0 80 6"
                    className="pointer-events-none absolute -bottom-1 left-0 h-[5px] w-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 4 Q 20 1, 40 3 T 78 2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
                </span>
              </span>
              <span aria-hidden className="h-4 w-px shrink-0" style={{ backgroundColor: `${activePalette.ink}40` }} />
              <h2
                className="truncate font-display text-[17px] font-extrabold leading-tight tracking-tight sm:text-[19px]"
                style={{ color: activePalette.ink }}
              >
                {topic.label}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold backdrop-blur-md transition-colors"
              style={{
                color: activePalette.ink,
                backgroundColor: `${activePalette.ink}10`,
                border: `1px solid ${activePalette.ink}30`,
              }}
              aria-label="Close sample answer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>
        </div>
      </div>


      {/* Scrollable reading lane.
          NOTE: Bottom padding intentionally large so the answer text never
          crashes into the colorful footer pager that floats above it. */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto pt-[120px] pb-[260px] sm:pt-[140px] sm:pb-[280px]"
      >
        <article className="mx-auto w-full max-w-[820px] px-6 sm:px-10">
          {(() => {
            // Lateral slide choreography (sequential out → in):
            //   out  → current text translates by  -switchDir * 36px and
            //          fades to 0 over 260ms (ease-in / accelerate).
            //   swap → variantIndex flips; the lane is re-keyed and remounts
            //          fresh, immediately running the `lane-slide-in` CSS
            //          keyframe which starts at +switchDir * 36px / opacity 0
            //          and settles to 0 / 1 over 380ms (ease-out / decelerate).
            // Headings cross-fade their color across the full 640ms.
            const isOut = gravityPhase === "out";

            const outStyle: React.CSSProperties = {
              transform: `translate3d(${-switchDir * 36}px, 0, 0)`,
              opacity: 0,
              transition:
                "transform 260ms cubic-bezier(0.4, 0, 1, 1), opacity 260ms cubic-bezier(0.4, 0, 1, 1)",
              willChange: "transform, opacity",
            };

            const inOrIdleStyle: React.CSSProperties = {
              // CSS keyframe handles the enter — runs once on mount when the
              // lane is re-keyed by variantIndex. At rest, the element sits
              // at translate(0) / opacity 1 with no transition.
              animation:
                gravityPhase === "in"
                  ? `lane-slide-in 380ms cubic-bezier(0, 0, 0.2, 1) both`
                  : undefined,
              ["--lane-from-x" as string]: `${switchDir * 36}px`,
            };

            return (
              <div
                // Re-key on variant change so the incoming element mounts
                // fresh and runs the enter keyframe cleanly.
                key={`lane-${variantIndex}`}
                className="pt-4"
                style={isOut ? outStyle : inOrIdleStyle}
                data-lane-phase={gravityPhase}
              >
                {/* Billboard topic headline — oversized, cream-on-palette,
                    with a thick palette-toned underline swash beneath. */}
                <header className="mb-10">
                  <span
                    className="font-display text-[11px] font-extrabold uppercase tracking-[0.32em]"
                    style={{ color: activePalette.ink, opacity: 0.8 }}
                  >
                    Sample answer · Band {currentVariant.bandScore}
                  </span>
                  <h1
                    className="mt-3 font-display font-black leading-[1.05] tracking-tight"
                    style={{
                      color: activePalette.ink,
                      fontSize: "clamp(2rem, 5.4vw, 3.25rem)",
                    }}
                  >
                    {topic.label}
                  </h1>
                  <div
                    className="mt-5 h-[3px] w-[clamp(80px,18vw,160px)] rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${activePalette.ink} 0%, ${activePalette.ink} 60%, transparent 100%)`,
                      opacity: 0.55,
                    }}
                  />
                </header>

                {/* Sections rendered as inline anchors inside one continuous
                    flowing answer. Each section's heading becomes a small
                    uppercase eyebrow above its body. */}
                <div className="space-y-9">
                  {sections.map((s, i) => {
                    const visible = i < revealedSections;
                    return (
                      <section
                        key={`${variantIndex}-${s.heading}`}
                        style={{
                          visibility: visible ? "visible" : "hidden",
                        }}
                      >
                        <h3
                          className="font-display text-[11px] font-extrabold uppercase tracking-[0.28em]"
                          style={{ color: activePalette.ink, opacity: 0.85 }}
                        >
                          {s.heading}
                        </h3>
                        <p
                          className="mt-3 font-display"
                          style={{
                            color: activePalette.inkSoft,
                            fontSize: "clamp(1.0625rem, 1.55vw, 1.2rem)",
                            lineHeight: 1.72,
                            fontWeight: 500,
                          }}
                        >
                          {s.body}
                        </p>
                      </section>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </article>
      </div>

      {/* ── Follow-up rail ────────────────────────────────────────────────
          Reveal-on-scroll horizontal rail anchored above the footer band.
          Tiles are color-coded with the AMBER · TEAL · PLUM follow-up
          palette so they visually match what they open into. Horizontally
          scrollable with a peek of the next card so the rail works for
          any count and stays mobile-friendly. */}
      {followUps.length > 0 && (() => {
        // Reveal threshold: tile-band fades + lifts in once the user has
        // scrolled past ~55% of the answer.
        const REVEAL_AT = 0.55;
        const reveal =
          scrollProgress <= REVEAL_AT
            ? 0
            : Math.min(1, (scrollProgress - REVEAL_AT) / 0.25);

        // Confident muted dusty-blue → slate tile palette so the rail
        // visibly carries the brand color story above the pure-white lane.
        // Each tile has its own slate variant; ink is deep slate-navy.
        const followUpPalette = [
          { fill: "oklch(0.86 0.040 240)", ink: "oklch(0.28 0.045 245)" }, // Dusty blue
          { fill: "oklch(0.74 0.050 245)", ink: "oklch(0.24 0.045 248)" }, // Steel blue
          { fill: "oklch(0.58 0.055 250)", ink: "oklch(0.98 0.012 245)" }, // Deep slate (light ink)
        ];

        return (
          <div
            // Sit just above the 64-72px footer band. pointer-events follow
            // reveal so the rail can't catch clicks while invisible.
            className="pointer-events-none absolute inset-x-0 z-[18]"
            style={{
              bottom: "76px",
              opacity: reveal,
              transform: `translateY(${(1 - reveal) * 18}px)`,
              transition:
                "opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)",
            }}
            aria-hidden={reveal < 0.05}
          >
            {/* Horizontal scrollable rail with peek. */}
            <div
              className={`pointer-events-auto mx-auto flex max-w-[1280px] gap-3 overflow-x-auto px-4 pb-1 sm:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                reveal < 0.5 ? "pointer-events-none" : ""
              }`}
              style={{ scrollSnapType: "x mandatory" }}
            >
              {followUps.map((q, i) => {
                const tone = followUpPalette[i % followUpPalette.length];
                return (
                  <div
                    key={q.id}
                    className="shrink-0 basis-[78%] snap-start sm:basis-[42%] lg:basis-[30%]"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        onOpenFollowUp(
                          q,
                          { x: r.left + r.width / 2, y: r.top + r.height / 2 },
                          i + 1,
                          followUps.length,
                        );
                      }}
                      className="relative block h-full w-full overflow-hidden rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                      style={{
                        backgroundColor: tone.fill,
                        boxShadow: `0 12px 30px -14px ${activePalette.fillDeep}`,
                        border: `1px solid ${tone.ink}33`,
                      }}
                    >
                      {/* Eyebrow — oversized padded numeral with tiny
                          uppercase label stacked beside it. No icon: pure
                          typographic hierarchy. */}
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-display font-black tabular-nums leading-none tracking-tight"
                          style={{
                            color: tone.ink,
                            fontSize: "22px",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="font-display text-[9px] font-extrabold uppercase tracking-[0.32em]"
                          style={{ color: tone.ink, opacity: 0.78 }}
                        >
                          Follow-up
                        </span>
                      </div>
                      <p
                        className="mt-2.5 font-display text-[14px] font-extrabold tracking-tight"
                        style={{ color: tone.ink, lineHeight: 1.25 }}
                      >
                        {q.title}
                      </p>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Footer pager — FULL-WIDTH BAND with palette-toned top divider rule.
          Mirrors the FollowUpReader footer treatment. */}
      {variants.length > 1 && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
          style={{
            // Confident muted slate band — independent of the pure-white
            // reading lane so the footer reads as its own colored zone.
            borderTop: `1px solid oklch(0.32 0.045 248 / 0.20)`,
            background: `linear-gradient(180deg, oklch(0.94 0.020 240) 0%, oklch(0.88 0.030 245) 100%)`,
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="pointer-events-auto mx-auto flex w-full max-w-[1280px] items-stretch gap-1.5 px-4 py-3 sm:px-10 sm:py-4">
            <button
              type="button"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                goToVariant(variantIndex - 1, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
              }}
              className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12"
              style={{ color: "oklch(0.32 0.045 248)" }}
              aria-label="Previous sample answer"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.6} />
            </button>

            <div className="flex flex-1 items-stretch gap-1.5" role="tablist" aria-label="Sample answers">
              {variants.map((_, i) => {
                const active = i === variantIndex;
                const tone = palette[i % palette.length];
                // White ink across all three tabs — the dusty/steel/slate
                // tab fills are saturated enough that light text reads as
                // a confident magazine band.
                const tabTextColor = "oklch(0.99 0.012 245)";
                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      goToVariant(i, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                    }}
                    className="relative flex flex-1 items-center justify-center rounded-xl px-2 py-2.5 transition-all duration-300 ease-out sm:py-3"
                    style={{
                      backgroundColor: tone.tabBg,
                      boxShadow: active
                        ? `inset 0 0 0 2px ${tone.tabBorder}, 0 4px 14px ${tone.tabBorder}55`
                        : `inset 0 0 0 1px ${tone.tabBorder}40`,
                    }}
                  >
                    <span
                      className="font-display tracking-tight transition-all duration-300"
                      style={{
                        color: tabTextColor,
                        opacity: active ? 1 : 0.82,
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
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                goToVariant(variantIndex + 1, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
              }}
              className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12"
              style={{ color: activePalette.ink }}
              aria-label="Next sample answer"
            >
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.6} />
            </button>
          </div>
        </div>
      )}

      {/* Atmospheric mood veil — a single solid layer that fades in then out
          during a variant switch. Uses opacity (cheap, GPU-friendly, no
          repaint flicker) instead of backdrop-filter, and a fixed neutral
          tint instead of a color-mix value (which cannot be tweened). The
          mask hides the brief snap as the gradient orbs re-render. */}
      <div
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{
          backgroundColor: "oklch(0.18 0.005 80)",
          opacity: moodPhase === "out" ? 0.18 : 0,
          transition: "opacity 320ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        aria-hidden
      />

      {/* Drift + answer-transition keyframes */}
      <style>{`
        @keyframes drift-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(4%, -3%, 0) scale(1.05); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-3%, 4%, 0) scale(1.06); }
        }
        @keyframes zoom-numeral {
          0%   { transform: translate(-50%, -50%) scale(0.05); opacity: 0; filter: blur(6px); }
          18%  { opacity: 1; filter: blur(0px); }
          42%  { transform: translate(-50%, -50%) scale(1.15); opacity: 1; filter: blur(0px); }
          58%  { transform: translate(-50%, -50%) scale(1.0);  opacity: 1; filter: blur(0px); }
          100% { transform: translate(-50%, -50%) scale(0.18); opacity: 0; filter: blur(4px); }
        }
        @keyframes zoom-veil-tint {
          0%   { opacity: 0; }
          35%  { opacity: 0.85; }
          65%  { opacity: 0.85; }
          100% { opacity: 0; }
        }
        @keyframes zoom-veil {
          0%, 100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Compact panel — preserved for non-cue (general questions) topics          */
/* ────────────────────────────────────────────────────────────────────────── */

type CompactProps = {
  isExpanded: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  topic: { id: string; label: string };
  categoryId: string;
  headerQuestion: { title: string } | undefined;
  answerBand: string;
  sections: { heading: string; body: string }[];
  revealedSections: number;
  accentText: string;
  accentChip: string;
};

function CompactPanel({
  isExpanded,
  scrollRef,
  onClose,
  topic,
  categoryId,
  headerQuestion,
  answerBand,
  sections,
  revealedSections,
  accentText,
  accentChip,
}: CompactProps) {
  return (
    <div
      className={`pointer-events-auto relative mt-6 w-full max-w-3xl origin-top overflow-hidden rounded-3xl border border-foreground/10 bg-[oklch(0.985_0.014_165)] shadow-card transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:mt-12 ${
        isExpanded
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-3 scale-95 opacity-0"
      }`}
      style={{ maxHeight: "calc(100vh - 6rem)" }}
    >
      <div className="sticky top-0 z-10 border-b border-foreground/8 bg-[oklch(0.985_0.014_165)]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accentChip}`}
              >
                <Mic className="h-3 w-3" strokeWidth={2.6} />
                Part 1 / 3
              </span>
              <span
                className={`font-display text-[11px] font-extrabold uppercase tracking-[0.22em] ${accentText}`}
              >
                {topic.label} · Band {answerBand}+
              </span>
            </div>
            <h2 className="mt-2 whitespace-pre-line font-display text-[17px] font-extrabold leading-snug tracking-tight text-foreground sm:text-[19px]">
              {headerQuestion?.title ?? topic.label}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
            aria-label="Close sample answer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="relative overflow-y-auto px-5 py-7 sm:px-7 sm:py-9"
        style={{ maxHeight: "calc(100vh - 6rem - 88px)" }}
      >
        <div className="space-y-6">
          {sections.map((s, i) => {
            const visible = i < revealedSections;
            return (
              <section
                key={s.heading}
                className="transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                }}
              >
                <p
                  className={`font-display text-[11px] font-extrabold uppercase tracking-[0.22em] ${accentText}`}
                >
                  {s.heading}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground/85 sm:text-[16px]">
                  {s.body}
                </p>
              </section>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 border-t border-foreground/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-foreground/60">
            Want all questions, follow-ups & vocab for this topic?
          </p>
          <Link
            to="/speaking-samples/$category/$topic"
            params={{ category: categoryId, topic: topic.id }}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.50_0.10_165)] px-4 py-2 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            Open full topic
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.6} />
          </Link>
        </div>
      </div>
    </div>
  );
}
