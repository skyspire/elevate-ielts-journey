import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Mic, Sparkles, ArrowUpRight, Link as LinkIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  getSpeakingModelAnswer,
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

  const isCue = isCueCardCategory(categoryId);
  const questions = getSpeakingQuestions(categoryId, topic.id);
  const headerQuestion = questions[0];
  const answer: SpeakingModelAnswer = getSpeakingModelAnswer(topic.label, isCue);

  // Drive the open/close phase machine
  useEffect(() => {
    if (!open) {
      if (phase !== "closed") {
        setPhase("collapsing");
        const t = setTimeout(() => {
          setPhase("closed");
          setRevealedSections(0);
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

  // Sequentially reveal answer sections once expanded
  useEffect(() => {
    if (phase !== "expanded") return;
    setRevealedSections(0);
    const total = answer.sections.length;
    const timers: number[] = [];
    for (let i = 0; i < total; i++) {
      timers.push(
        window.setTimeout(() => setRevealedSections((n) => Math.max(n, i + 1)), 250 + i * 350),
      );
    }
    return () => timers.forEach((id) => clearTimeout(id));
  }, [phase, topic.id, answer.sections.length]);

  // Lock body scroll while open
  useEffect(() => {
    if (phase === "closed") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [phase]);

  // Esc to close
  useEffect(() => {
    if (phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onClose]);

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

        {/* Phase B — expanded panel */}
        <div
          className={`pointer-events-auto relative mt-6 w-full max-w-3xl origin-top overflow-hidden rounded-3xl border border-foreground/10 bg-[oklch(0.985_0.014_165)] shadow-card transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:mt-12 ${
            isExpanded
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-3 scale-95 opacity-0"
          }`}
          style={{
            maxHeight: "calc(100vh - 6rem)",
          }}
        >
          {/* Sticky header */}
          <div className="sticky top-0 z-10 border-b border-foreground/8 bg-[oklch(0.985_0.014_165)]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accentChip}`}
                  >
                    <Mic className="h-3 w-3" strokeWidth={2.6} />
                    {isCue ? "Part 2" : "Part 1 / 3"}
                  </span>
                  <span className={`font-display text-[11px] font-extrabold uppercase tracking-[0.22em] ${accentText}`}>
                    {topic.label} · Band {answer.bandScore}+
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

          {/* Scrollable body */}
          <div
            className="overflow-y-auto px-5 py-7 sm:px-7 sm:py-9"
            style={{ maxHeight: "calc(100vh - 6rem - 88px)" }}
          >
            <div className="space-y-6">
              {answer.sections.map((s, i) => {
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

            {/* Footer CTA — link to full topic page */}
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
      </div>
    </div>,
    document.body,
  );
}
