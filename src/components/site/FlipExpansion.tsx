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

  function goToVariant(next: number) {
    if (variants.length <= 1) return;
    const clamped = (next + variants.length) % variants.length;
    if (clamped === variantIndex) return;
    setVariantTransitioning(true);
    window.setTimeout(() => {
      setVariantIndex(clamped);
      // scroll back to top for the new answer
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
      window.setTimeout(() => setVariantTransitioning(false), 40);
    }, 220);
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
  goToVariant: (n: number) => void;
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

  return (
    <div
      className={`pointer-events-auto absolute inset-0 origin-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExpanded
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-[0.98] opacity-0"
      }`}
    >
      {/* Atmospheric background — barely-there gradients & drifting shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[oklch(0.985_0.012_165)]">
        <div
          className="absolute -left-[20%] top-[5%] h-[55vh] w-[55vh] rounded-full opacity-[0.10] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.10 165) 0%, transparent 65%)",
            animation: "drift-a 26s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-[15%] top-[40%] h-[48vh] w-[48vh] rounded-full opacity-[0.09] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.82 0.08 90) 0%, transparent 65%)",
            animation: "drift-b 32s ease-in-out infinite",
          }}
        />
        <div
          className="absolute left-[30%] -bottom-[15%] h-[40vh] w-[40vh] rounded-full opacity-[0.08] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.75 0.10 200) 0%, transparent 65%)",
            animation: "drift-a 38s ease-in-out infinite reverse",
          }}
        />
        {/* Faint paper grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, oklch(0.2 0 0) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
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
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accentChip}`}
              >
                <Mic className="h-3 w-3" strokeWidth={2.6} />
                Part 2
              </span>
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

      {/* Scrollable reading lane */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto pt-[120px] pb-[120px] sm:pt-[140px] sm:pb-[128px]"
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

          {/* Footer link to full topic page — sits inside the reading lane */}
          <div className="mt-16 flex flex-col items-start gap-3 border-t border-foreground/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-foreground/55">
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

      {/* Minimal footer pager — switch between the three sample answers */}
      {variants.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5 sm:pb-7">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-foreground/10 bg-white/70 px-2 py-1.5 shadow-[0_8px_30px_-12px_oklch(0.2_0.05_165/0.25)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => goToVariant(variantIndex - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
              aria-label="Previous sample answer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 px-2">
              <div className="flex items-center gap-1.5">
                {variants.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToVariant(i)}
                    aria-label={`Go to sample ${i + 1}`}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === variantIndex ? 22 : 6,
                      backgroundColor:
                        i === variantIndex
                          ? "oklch(0.50 0.10 165)"
                          : "oklch(0.20 0.02 165 / 0.20)",
                    }}
                  />
                ))}
              </div>
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/55">
                Answer {variantIndex + 1} of {variants.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => goToVariant(variantIndex + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
              aria-label="Next sample answer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Drift keyframes */}
      <style>{`
        @keyframes drift-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(4%, -3%, 0) scale(1.05); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-3%, 4%, 0) scale(1.06); }
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
