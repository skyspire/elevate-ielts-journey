import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import type { SampleAnswer } from "@/data/sample-answers";

/**
 * SampleAnswerModal — near-fullscreen popup reader for a single sample
 * answer. "Minimal museum" polish: pure white card, hairline borders,
 * generous whitespace, tiny uppercase metadata. Three band variants live
 * behind a sticky FOOTER bar made of three full-width colored blocks
 * (muted premium palette: slate / deep teal / bronze).
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
// Muted premium palette
const BAND_COLORS = [
  "#94a3b8", // slate
  "#0f766e", // deep teal
  "#b45309", // bronze
];
// Slightly darker text-on-color for readable inactive labels
const BAND_COLORS_DEEP = [
  "#64748b",
  "#115e59",
  "#92400e",
];

function difficultyFromEyebrow(eyebrow?: string): string | null {
  if (!eyebrow) return null;
  const m = eyebrow.match(/(Easy|Medium|Hard)/i);
  return m ? m[1] : null;
}

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

  useEffect(() => {
    if (open) {
      setMounted(true);
      const r = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), 240);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (open) {
      setVariant(0);
      setLaneIn(true);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

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

  const difficulty = difficultyFromEyebrow(eyebrow);
  const accent = BAND_COLORS[variant];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-4 sm:px-6 sm:py-8"
      aria-modal="true"
      role="dialog"
      aria-label={`${title} — sample answer`}
    >
      {/* Backdrop */}
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
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — question statement only, large grey rounded sans */}
        <div className="flex items-start gap-3 border-b border-foreground/[0.06] px-6 pb-6 pt-6 sm:px-12 sm:pb-8 sm:pt-9">
          <div className="min-w-0 flex-1">
            <h2
              className="text-[20px] font-semibold leading-[1.45] tracking-[-0.005em] text-slate-500 sm:text-[24px] sm:leading-[1.5]"
              style={{
                fontFamily:
                  '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
              }}
            >
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

        {/* Scroll body — single column, gallery whitespace */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-12 sm:py-12"
        >
          <div
            className="mx-auto max-w-[640px]"
            style={{
              opacity: laneIn ? 1 : 0,
              transform: laneIn ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 180ms ease, transform 180ms ease",
            }}
          >
            {activeParagraphs.paragraphs.map((p, i) => (
              <div key={i} className="mb-8 last:mb-2">
                {p.heading && (
                  <h3 className="mb-2.5 font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/55">
                    {p.heading}
                  </h3>
                )}
                <p className="text-[15.5px] leading-[1.8] text-foreground/85 sm:text-[16.5px]">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky FOOTER — three full-width color blocks */}
        <div className="grid shrink-0 grid-cols-3 border-t border-foreground/[0.08]">
          {BAND_LABELS.map((label, i) => {
            const active = i === variant;
            const color = BAND_COLORS[i];
            const deep = BAND_COLORS_DEEP[i];
            return (
              <button
                key={label}
                type="button"
                onClick={() => selectVariant(i)}
                aria-pressed={active}
                className="group relative flex flex-col items-center justify-center gap-0.5 px-3 py-4 transition-all sm:py-5"
                style={{
                  backgroundColor: active ? color : "#ffffff",
                  color: active ? "#ffffff" : deep,
                  opacity: active ? 1 : 0.55,
                  boxShadow: active
                    ? "inset 0 2px 0 rgba(255,255,255,0.25), 0 -6px 18px -10px rgba(0,0,0,0.25)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.opacity = "0.55";
                }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-[3px] transition-all"
                  style={{ backgroundColor: active ? color : "transparent" }}
                />
                <span className="text-[12px] font-extrabold uppercase tracking-[0.22em] sm:text-[13px]">
                  {label}
                </span>
                <span
                  className="text-[9.5px] font-bold uppercase tracking-[0.2em]"
                  style={{ opacity: active ? 0.85 : 0.7 }}
                >
                  {i === 0 ? "Solid" : i === 1 ? "Strong" : "Expert"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
