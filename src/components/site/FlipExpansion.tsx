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
  // Typographic zoom-through overlay state for the answer transition
  const [wash, setWash] = useState<{
    x: number;
    y: number;
    color: string;
    numeral: string;
    key: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  // Sequentially reveal answer sections once expanded — and again every time
  // the active variant changes, so each switch feels freshly composed.
  useEffect(() => {
    if (phase !== "expanded") return;
    setRevealedSections(0);
    const total = sections.length;
    const timers: number[] = [];
    for (let i = 0; i < total; i++) {
      timers.push(
        window.setTimeout(
          () => setRevealedSections((n) => Math.max(n, i + 1)),
          220 + i * 320,
        ),
      );
    }
    return () => timers.forEach((id) => clearTimeout(id));
  }, [phase, topic.id, variantIndex, sections.length]);

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

  // Palette mirrored from CueCardReader so the wash color matches the next tab.
  // Coral · Marigold · Emerald
  const variantWashColors = [
    "oklch(0.68 0.20 25)",  // coral
    "oklch(0.78 0.17 80)",  // marigold
    "oklch(0.62 0.16 155)", // emerald
  ];

  function goToVariant(next: number, origin?: { x: number; y: number }) {
    if (variants.length <= 1) return;
    const clamped = (next + variants.length) % variants.length;
    if (clamped === variantIndex) return;
    setVariantTransitioning(true);

    // Trigger typographic zoom-through from the tab's position (or screen center).
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight - 80;
    const color = variantWashColors[clamped % variantWashColors.length];
    const numeral = String(clamped + 1);
    setWash({ x, y, color, numeral, key: Date.now() });

    // Switch content under the overlay mid-animation, so when it shrinks away
    // the new screen + text are already in place underneath.
    window.setTimeout(() => {
      setVariantIndex(clamped);
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
    }, 480);

    // Clear overlay + transition lock after the full sweep finishes.
    window.setTimeout(() => {
      setVariantTransitioning(false);
      setWash(null);
    }, 1100);
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
      {/* Typographic zoom-through overlay — a giant numeral inflates from the
          clicked tab in the next answer's color, holds as a typographic
          moment, then shrinks into place as the page settles underneath.
          A soft color veil rides along to bridge the two screens. */}
      {wash && (
        <div
          key={wash.key}
          className="pointer-events-none absolute inset-0 z-[110] overflow-hidden"
          style={{ animation: "zoom-veil 1080ms cubic-bezier(0.65, 0, 0.35, 1) forwards" }}
        >
          {/* Soft tinted veil that fades the screens together */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(60% 60% at ${wash.x}px ${wash.y}px, ${wash.color}, transparent 75%)`,
              opacity: 0,
              animation: "zoom-veil-tint 1080ms cubic-bezier(0.65, 0, 0.35, 1) forwards",
              mixBlendMode: "multiply",
            }}
          />
          {/* The hero numeral */}
          <div
            className="absolute"
            style={{
              left: wash.x,
              top: wash.y,
              transform: "translate(-50%, -50%)",
              animation: "zoom-numeral 1080ms cubic-bezier(0.65, 0, 0.35, 1) forwards",
              willChange: "transform, opacity",
            }}
          >
            <span
              className="font-display block select-none leading-none"
              style={{
                fontSize: "clamp(140px, 24vw, 320px)",
                fontWeight: 900,
                letterSpacing: "-0.06em",
                color: wash.color,
                textShadow: `0 30px 80px ${wash.color}55, 0 8px 24px ${wash.color}33`,
                WebkitTextStroke: `1px ${wash.color}`,
              }}
            >
              {wash.numeral}
            </span>
          </div>
        </div>
      )}
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
            sections={sections}
            revealedSections={revealedSections}
            scrollProgress={scrollProgress}
            headerScale={headerScale}
            headerOpacity={headerOpacity}
            followUps={followUps}
            accentText={accentText}
            accentChip={accentChip}
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
  sections: { heading: string; body: string }[];
  revealedSections: number;
  scrollProgress: number;
  headerScale: number;
  headerOpacity: number;
  followUps: { id: string; title: string }[];
  accentText: string;
  accentChip: string;
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
  sections,
  revealedSections,
  scrollProgress,
  headerScale,
  headerOpacity,
  followUps,
  accentText,
  accentChip,
}: CueReaderProps) {
  // Edge softening intensifies as the reader scrolls — creates the focus tunnel.
  const tunnelStrength = Math.min(1, scrollProgress * 1.4);
  const vignetteOpacity = 0.18 + tunnelStrength * 0.32;

  // Coordinated palette — drives both the reading-screen warm tint and the
  // vibrant footer tabs. Index matches the active variant.
  // 1. Coral · 2. Marigold · 3. Emerald
  const palette = [
    {
      // Coral
      tabBg:    "oklch(0.68 0.20 25)",
      tabHover: "oklch(0.74 0.18 25)",
      screen:   "oklch(0.965 0.035 35)",   // warm blush peach
      glow:     "oklch(0.85 0.12 30)",
    },
    {
      // Marigold
      tabBg:    "oklch(0.78 0.17 80)",
      tabHover: "oklch(0.83 0.15 80)",
      screen:   "oklch(0.975 0.04 92)",    // cream butter
      glow:     "oklch(0.88 0.13 88)",
    },
    {
      // Emerald
      tabBg:    "oklch(0.62 0.16 155)",
      tabHover: "oklch(0.68 0.15 155)",
      screen:   "oklch(0.97 0.035 145)",   // soft pistachio
      glow:     "oklch(0.82 0.12 150)",
    },
  ];
  const activePalette = palette[variantIndex % palette.length];

  return (
    <div
      className={`pointer-events-auto absolute inset-0 origin-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExpanded
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-[0.98] opacity-0"
      }`}
    >
      {/* Atmospheric background — base color shifts to a warm tint of the active answer's palette. */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden transition-colors duration-700 ease-out"
        style={{ backgroundColor: activePalette.screen }}
      >
        <div
          className="absolute -left-[20%] top-[5%] h-[55vh] w-[55vh] rounded-full opacity-[0.14] blur-3xl transition-[background] duration-700 ease-out"
          style={{
            background: `radial-gradient(circle, ${activePalette.glow} 0%, transparent 65%)`,
            animation: "drift-a 26s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-[15%] top-[40%] h-[48vh] w-[48vh] rounded-full opacity-[0.12] blur-3xl transition-[background] duration-700 ease-out"
          style={{
            background: `radial-gradient(circle, ${activePalette.glow} 0%, transparent 65%)`,
            animation: "drift-b 32s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-[30%] -bottom-[15%] h-[40vh] w-[40vh] rounded-full opacity-[0.10] blur-3xl transition-[background] duration-700 ease-out"
          style={{
            background: `radial-gradient(circle, ${activePalette.glow} 0%, transparent 65%)`,
            animation: "drift-a 38s ease-in-out infinite reverse",
          }}
        />
        {/* Letterpress paper grain — whisper-intensity (~3-5%).
            Layer 1: fine fiber speckle (two offset dot fields at different
            scales) for cold-pressed paper tooth.
            Layer 2: short directional fibers for handmade-paper feel.
            Layer 3: soft inner debossed vignette so the screen feels pressed
            into the page edge — premium printed-journal quality. */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-[0.045]"
          style={{
            backgroundImage: [
              "radial-gradient(circle at 1px 1px, oklch(0.25 0.02 60) 0.6px, transparent 1.2px)",
              "radial-gradient(circle at 2px 3px, oklch(0.30 0.02 60) 0.5px, transparent 1px)",
              "radial-gradient(circle at 4px 1px, oklch(0.20 0.02 60) 0.4px, transparent 0.9px)",
            ].join(", "),
            backgroundSize: "7px 7px, 13px 11px, 19px 17px",
            backgroundPosition: "0 0, 3px 5px, 7px 2px",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-multiply opacity-[0.035]"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(102deg, transparent 0 3px, oklch(0.28 0.02 60 / 0.55) 3px 3.4px, transparent 3.4px 9px)",
              "repeating-linear-gradient(14deg, transparent 0 5px, oklch(0.30 0.02 60 / 0.4) 5px 5.3px, transparent 5.3px 14px)",
            ].join(", "),
          }}
        />
        {/* Soft inner debossed vignette — letterpress press-edge */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow:
              "inset 0 0 80px oklch(0.30 0.04 60 / 0.08), inset 0 0 200px oklch(0.30 0.04 60 / 0.05)",
          }}
        />
      </div>

      {/* Brand seal watermark — permanently anchored to the bottom-right corner. */}
      <div
        className="pointer-events-none absolute z-[1]"
        style={{ right: "max(24px, 4vmin)", bottom: "calc(96px + max(16px, 2vmin))", opacity: 0.09 }}
      >
        <div className="flex items-center gap-2.5 rounded-2xl border-[3px] border-foreground/80 px-3.5 py-2.5">
          <GraduationCap className="h-7 w-7 text-foreground" strokeWidth={2.5} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-black tracking-tight text-foreground">
              BigIELTS
            </span>
            <span className="mt-1 font-display text-[8px] font-extrabold tracking-[0.4em] text-foreground">
              .COM
            </span>
          </div>
        </div>
      </div>

      {/* Focus-tunnel vignette — sharpens as user scrolls */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, oklch(0.15 0.02 165) 130%)",
          opacity: vignetteOpacity,
        }}
      />

      {/* Stable, isolated topic header — single clean heading line.
          Intentionally contains NO prompt text and stays fixed in its own
          space so it never visually merges with the scrolling answer. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-4 sm:pt-6"
        style={{ transform: `scale(${headerScale})`, opacity: headerOpacity, transformOrigin: "top center", transition: "transform 240ms ease, opacity 240ms ease" }}
      >
        <div className="pointer-events-auto w-full max-w-[680px] rounded-2xl border border-foreground/8 bg-white/60 px-5 py-3.5 shadow-[0_8px_30px_-12px_oklch(0.2_0.05_165/0.18)] backdrop-blur-xl sm:px-7 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-2.5">
              <span
                className="inline-flex shrink-0 items-center gap-1.5 pr-1 text-[oklch(0.38_0.10_165)]"
                aria-label="Speaking Part Two"
              >
                <Mic className="h-3.5 w-3.5 opacity-80" strokeWidth={2.4} />
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
                      opacity="0.55"
                    />
                  </svg>
                </span>
              </span>
              <span aria-hidden className="h-4 w-px shrink-0 bg-foreground/15" />
              <h2 className="truncate font-display text-[17px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[19px]">
                {topic.label}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-foreground/10 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
              aria-label="Close sample answer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Hairline separator between header and reading lane — keeps the
          two regions visually independent while scrolling. */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 h-px bg-foreground/10"
        style={{ top: "92px" }}
        aria-hidden
      />

      {/* Scrollable reading lane.
          NOTE: Bottom padding intentionally large so the answer text never
          crashes into the colorful footer pager that floats above it. */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto pt-[120px] pb-[220px] sm:pt-[140px] sm:pb-[240px]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0, black calc(100% - 140px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0, black calc(100% - 140px), transparent 100%)",
        }}
      >
        <article
          className="mx-auto w-full max-w-[640px] px-6 sm:px-10"
          style={{
            opacity: variantTransitioning ? 0 : 1,
            transform: variantTransitioning ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 220ms ease, transform 220ms ease",
          }}
        >
          <div className="space-y-12 pt-4">
            {sections.map((s, i) => {
              const visible = i < revealedSections;
              return (
                <section
                  key={`${variantIndex}-${s.heading}`}
                  className="transition-all duration-700"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(14px)",
                  }}
                >
                  <h3 className="font-display text-[20px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[22px]">
                    {s.heading}
                  </h3>
                  <p className="mt-4 text-[16px] leading-[1.85] text-foreground/85 sm:text-[17px]">
                    {s.body}
                  </p>
                  {/* Soft rhythm marker between paragraphs */}
                  {i < sections.length - 1 && (
                    <div className="mx-auto mt-12 h-px w-16 bg-foreground/10" />
                  )}
                </section>
              );
            })}
          </div>

        </article>
      </div>

      {/* Follow-up cards — desktop, edge-emerging */}
      {followUps.length > 0 && (
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {followUps.map((q, i) => {
            const start = 0.14 + i * 0.18;
            const end = start + 0.18;
            const local =
              scrollProgress <= start
                ? 0
                : scrollProgress >= end
                  ? 1
                  : (scrollProgress - start) / (end - start);

            const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
            const topPct = 22 + i * 16;
            const offset = (1 - local) * 70;
            const opacity = local * 0.95;
            const scale = 0.9 + local * 0.1;

            const sideStyle: React.CSSProperties =
              side === "left"
                ? { left: `calc(2vw + ${-offset}px)` }
                : { right: `calc(2vw + ${-offset}px)` };

            return (
              <div
                key={q.id}
                className="pointer-events-auto absolute w-[230px] xl:w-[260px]"
                style={{
                  top: `${topPct}%`,
                  ...sideStyle,
                  opacity,
                  transform: `scale(${scale})`,
                  transition:
                    "opacity 500ms ease, transform 500ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <div className="rounded-2xl border border-[oklch(0.55_0.10_165)]/20 bg-white/70 p-4 shadow-card backdrop-blur-md">
                  <div className="flex items-center gap-1.5">
                    <MessageCircleQuestion
                      className={`h-3.5 w-3.5 ${accentText}`}
                      strokeWidth={2.6}
                    />
                    <span
                      className={`font-display text-[10px] font-extrabold uppercase tracking-[0.22em] ${accentText}`}
                    >
                      Follow-up {i + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] font-semibold leading-snug text-foreground/80">
                    {q.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Follow-up cards — mobile bottom carousel */}
      {followUps.length > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[88px] lg:hidden"
          style={{
            opacity:
              scrollProgress < 0.15 ? 0 : Math.min(1, (scrollProgress - 0.15) / 0.25),
            transform: `translateY(${(1 - Math.min(1, scrollProgress * 1.8)) * 24}px)`,
            transition: "opacity 350ms ease, transform 350ms ease",
          }}
        >
          <div className="pointer-events-auto mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 pb-2 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {followUps.map((q, i) => {
              const threshold = 0.18 + i * 0.14;
              const local =
                scrollProgress <= threshold
                  ? 0
                  : Math.min(1, (scrollProgress - threshold) / 0.18);
              return (
                <div
                  key={q.id}
                  className="shrink-0 basis-[78%] snap-start"
                  style={{
                    opacity: local,
                    transform: `translateY(${(1 - local) * 16}px)`,
                    transition:
                      "opacity 400ms ease, transform 400ms cubic-bezier(0.16,1,0.3,1)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                >
                  <div className="rounded-2xl border border-[oklch(0.55_0.10_165)]/20 bg-white/85 p-3.5 shadow-card backdrop-blur-md">
                    <div className="flex items-center gap-1.5">
                      <MessageCircleQuestion
                        className={`h-3.5 w-3.5 ${accentText}`}
                        strokeWidth={2.6}
                      />
                      <span
                        className={`font-display text-[10px] font-extrabold uppercase tracking-[0.22em] ${accentText}`}
                      >
                        Follow-up {i + 1}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-foreground/85">
                      {q.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer pager — warm graphite ink bar housing three vibrant tabs.
          Tabs use the same coordinated palette as the reading-screen tint,
          so switching answers lights up both the tab and the screen behind it. */}
      {variants.length > 1 && (() => {
        return (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-5 sm:px-6 sm:pb-7">
            <div
              className="pointer-events-auto flex w-full max-w-[640px] items-stretch gap-1.5 rounded-2xl border border-white/[0.06] p-1.5 shadow-[0_22px_50px_-18px_oklch(0_0_0/0.55)]"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.26 0.015 75) 0%, oklch(0.18 0.015 75) 100%)",
              }}
            >
              {/* Prev */}
              <button
                type="button"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  goToVariant(variantIndex - 1, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                }}
                className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/70 transition-all duration-200 hover:bg-white/5 hover:text-white sm:h-12 sm:w-12"
                aria-label="Previous sample answer"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.6} />
              </button>

              {/* Tabs */}
              <div className="flex flex-1 items-stretch gap-1.5" role="tablist" aria-label="Sample answers">
                {variants.map((_, i) => {
                  const active = i === variantIndex;
                  const tone = palette[i % palette.length];
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
                      className="group relative flex flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2.5 transition-all duration-300 ease-out hover:-translate-y-[1px] sm:py-3"
                      style={{
                        backgroundColor: active ? tone.tabBg : "oklch(1 0 0 / 0.04)",
                        boxShadow: active
                          ? `inset 0 1px 0 oklch(1 0 0 / 0.25), 0 6px 18px -6px ${tone.tabBg}`
                          : "inset 0 0 0 1px oklch(1 0 0 / 0.05)",
                      }}
                    >
                      <span
                        className="block h-[7px] w-[7px] rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: active ? "oklch(1 0 0 / 0.95)" : tone.tabBg,
                          boxShadow: active ? "0 0 0 3px oklch(1 0 0 / 0.18)" : "none",
                        }}
                      />
                      <span
                        className="font-display text-[13px] font-bold tracking-tight transition-colors sm:text-[14px]"
                        style={{
                          color: active ? "oklch(1 0 0 / 0.98)" : "oklch(1 0 0 / 0.62)",
                        }}
                      >
                        Answer {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Next */}
              <button
                type="button"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  goToVariant(variantIndex + 1, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                }}
                className="group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/70 transition-all duration-200 hover:bg-white/5 hover:text-white sm:h-12 sm:w-12"
                aria-label="Next sample answer"
              >
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.6} />
              </button>
            </div>
          </div>
        );
      })()}

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
