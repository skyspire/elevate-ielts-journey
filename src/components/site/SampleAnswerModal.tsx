import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import type { SampleAnswer } from "@/data/sample-answers";

/**
 * SampleAnswerModal — near-fullscreen popup reader for a single sample
 * answer. Opens with a crossfade + light backdrop blur over the page that
 * launched it; the page underneath stays in place and stays blurred until
 * the modal closes. Sticky Band 7 / Band 8 / Band 9 tabs ride the top edge
 * so the learner can switch between three variants of the same answer at
 * any scroll depth.
 *
 * Design decisions (locked via Q&A):
 *   • Near-fullscreen sheet (~92vh, max 880px wide) — generous reading lane.
 *   • Single column reading body — no side panels.
 *   • Sticky band tabs at top of the modal scroll container.
 *   • Crossfade only (no scale) + ~8px backdrop blur, 220ms ease.
 *   • Background page stays mounted; backdrop dims to 35% black.
 *
 * Behaviour:
 *   • ESC closes. Backdrop click closes.
 *   • Body scroll is locked while open.
 *   • If `answer.variants` is present (triple), each tab renders its own
 *     variant; otherwise all three tabs render the same source paragraphs.
 */
export type SampleAnswerModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** 1-based index used for the small reference numeral in the header. */
  questionNumber?: number;
  answer: SampleAnswer;
  /** Optional small subtitle (e.g. "Task 2 · Opinion · Academic"). */
  eyebrow?: string;
};

const BAND_LABELS = ["Band 7", "Band 8", "Band 9"] as const;
const BAND_ACCENTS = [
  "oklch(0.62 0.135 70)", // saffron
  "oklch(0.40 0.080 155)", // forest
  "oklch(0.45 0.140 280)", // royal
];

export function SampleAnswerModal({
  open,
  onClose,
  title,
  questionNumber,
  answer,
  eyebrow,
}: SampleAnswerModalProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState(0);
  const [laneIn, setLaneIn] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Mount + crossfade choreography
  useEffect(() => {
    if (open) {
      setMounted(true);
      // next frame → trigger fade-in
      const r = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), 240);
    return () => window.clearTimeout(t);
  }, [open]);

  // Reset variant + scroll when freshly opened
  useEffect(() => {
    if (open) {
      setVariant(0);
      setLaneIn(true);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const activeParagraphs = useMemo(() => {
    if (answer.variants && answer.variants[variant]) {
      return {
        paragraphs: answer.variants[variant].paragraphs,
        bandScore: answer.variants[variant].bandScore,
        wordCount: answer.variants[variant].wordCount,
      };
    }
    return {
      paragraphs: answer.paragraphs,
      bandScore: answer.bandScore,
      wordCount: answer.wordCount,
    };
  }, [answer, variant]);

  function selectVariant(next: number) {
    if (next === variant) return;
    setLaneIn(false);
    window.setTimeout(() => {
      setVariant(next);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setLaneIn(true);
    }, 160);
  }

  if (!mounted) return null;

  const accent = BAND_ACCENTS[variant];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-4 sm:px-6 sm:py-8"
      aria-modal="true"
      role="dialog"
      aria-label={`${title} — sample answer`}
    >
      {/* Backdrop — crossfade + soft blur */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{
          backgroundColor: visible ? "rgba(8, 10, 20, 0.42)" : "rgba(8, 10, 20, 0)",
          backdropFilter: visible ? "blur(8px)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(8px)" : "blur(0px)",
          transition:
            "background-color 240ms ease, backdrop-filter 240ms ease, -webkit-backdrop-filter 240ms ease",
        }}
      />

      {/* Sheet */}
      <div
        className="relative flex w-full max-w-[880px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
        style={{
          height: "min(92vh, 980px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 220ms ease",
          borderTop: `4px solid ${accent}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header + tabs (one sticky element, two rows) */}
        <div className="sticky top-0 z-10 border-b border-foreground/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          {/* Row 1 — eyebrow / title / close */}
          <div className="flex items-start gap-3 px-5 pt-4 sm:px-7 sm:pt-5">
            <div className="min-w-0 flex-1">
              {eyebrow && (
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-foreground/55 sm:text-[11px]">
                  {eyebrow}
                </p>
              )}
              <h2 className="mt-1 font-display text-[17px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[20px]">
                {questionNumber ? (
                  <span className="mr-2 text-foreground/35">
                    {String(questionNumber).padStart(2, "0")}
                  </span>
                ) : null}
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground/70 transition hover:border-foreground/30 hover:bg-foreground/[0.04] hover:text-foreground"
            >
              <X className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>

          {/* Row 2 — Band 7 / 8 / 9 tabs */}
          <div className="mt-3 flex items-end gap-1.5 overflow-x-auto px-5 sm:gap-2 sm:px-7">
            {BAND_LABELS.map((label, i) => {
              const active = i === variant;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => selectVariant(i)}
                  className="relative shrink-0 px-3.5 pb-3 pt-2 text-[12px] font-extrabold uppercase tracking-[0.16em] transition-colors sm:px-4 sm:text-[13px]"
                  style={{
                    color: active ? BAND_ACCENTS[i] : "oklch(0.45 0.02 250)",
                  }}
                >
                  {label}
                  <span
                    className="absolute inset-x-2 -bottom-px h-[3px] rounded-full transition-all"
                    style={{
                      backgroundColor: active ? BAND_ACCENTS[i] : "transparent",
                    }}
                  />
                </button>
              );
            })}

            <div className="ml-auto hidden items-center gap-3 pb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/55 sm:flex">
              <span>Band {activeParagraphs.bandScore}</span>
              <span className="h-3 w-px bg-foreground/20" />
              <span>{activeParagraphs.wordCount} words</span>
            </div>
          </div>
        </div>

        {/* Scroll body — single column */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-8"
        >
          <div
            className="mx-auto max-w-[680px]"
            style={{
              opacity: laneIn ? 1 : 0,
              transform: laneIn ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 180ms ease, transform 180ms ease",
            }}
          >
            {/* Mobile-only meta strip */}
            <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/55 sm:hidden">
              <span>Band {activeParagraphs.bandScore}</span>
              <span className="h-3 w-px bg-foreground/20" />
              <span>{activeParagraphs.wordCount} words</span>
            </div>

            {activeParagraphs.paragraphs.map((p, i) => (
              <div key={i} className="mb-7 last:mb-2">
                {p.heading && (
                  <h3
                    className="mb-2 font-display text-[13px] font-extrabold uppercase tracking-[0.18em]"
                    style={{ color: accent }}
                  >
                    {p.heading}
                  </h3>
                )}
                <p className="text-[15.5px] leading-[1.75] text-foreground/85 sm:text-[16px]">
                  {p.body}
                </p>
              </div>
            ))}

            <div className="mt-10 border-t border-foreground/10 pt-5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/45">
              End of {BAND_LABELS[variant]} sample
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
