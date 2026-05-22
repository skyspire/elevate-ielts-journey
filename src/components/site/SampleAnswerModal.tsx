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
  const [collapsed, setCollapsed] = useState(false);
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
        {/* Header — collapses to compact one-line on scroll */}
        <div
          className="flex items-start gap-3 border-b border-foreground/[0.06] px-6 sm:px-12"
          style={{
            paddingTop: collapsed ? 14 : 28,
            paddingBottom: collapsed ? 14 : 28,
            boxShadow: collapsed ? "0 6px 18px -12px rgba(15,23,42,0.18)" : "none",
            transition: "padding 220ms ease, box-shadow 220ms ease",
          }}
        >
          <div className="min-w-0 flex-1">
            <h2
              className="font-bold tracking-[-0.01em] text-[#1d4ed8]"
              style={{
                fontFamily:
                  '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                fontSize: collapsed ? 15 : undefined,
                lineHeight: collapsed ? "1.4" : "1.5",
                transition: "font-size 220ms ease, line-height 220ms ease",
              }}
            >
              <span className={collapsed ? "" : "text-[20px] sm:text-[24px]"}>
                {title}
              </span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="group -mr-1 mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#1d4ed8] transition-all hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, rgba(219,234,254,0.95), rgba(191,219,254,0.85))",
              boxShadow:
                "0 0 0 1.5px rgba(29,78,216,0.45), 0 0 0 4px rgba(29,78,216,0.08), 0 6px 18px -6px rgba(29,78,216,0.35)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <X className="h-[18px] w-[18px]" strokeWidth={3} />
          </button>
        </div>

        {/* Scroll body — single column, gallery whitespace */}
        <div
          ref={scrollRef}
          onScroll={(e) => {
            const top = (e.target as HTMLDivElement).scrollTop;
            setCollapsed(top > 24);
          }}
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
                  <h3
                    className="mb-3 text-[17px] font-bold leading-snug sm:text-[18px]"
                    style={{
                      fontFamily:
                        '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                      color: BAND_COLORS[variant],
                      letterSpacing: "-0.005em",
                    }}
                  >
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

        {/* Corner watermark — fixed inside sheet, just above footer tabs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[88px] right-4 select-none sm:bottom-[100px] sm:right-6"
          style={{
            fontFamily:
              '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "rgba(15, 23, 42, 0.28)",
            textTransform: "uppercase",
          }}
        >
          BigIELTS.com
        </div>


        {/* Sticky FOOTER — three full-width color blocks, big rounded labels */}
        <div className="grid shrink-0 grid-cols-3 border-t border-foreground/[0.08]">
          {BAND_LABELS.map((label, i) => {
            const active = i === variant;
            const color = BAND_COLORS[i];
            // mix color with white for medium tint at ~50% saturation
            const tint = `color-mix(in oklab, ${color} 55%, white)`;
            return (
              <button
                key={label}
                type="button"
                onClick={() => selectVariant(i)}
                aria-pressed={active}
                className="group relative flex items-center justify-center px-3 py-5 transition-all sm:py-6"
                style={{
                  backgroundColor: active ? color : tint,
                  color: "#ffffff",
                  boxShadow: active
                    ? `inset 0 2px 0 rgba(255,255,255,0.28), 0 0 0 1px ${color} inset, 0 -10px 28px -8px ${color}, 0 -2px 14px -4px ${color}`
                    : "inset 0 1px 0 rgba(255,255,255,0.18)",
                  fontFamily:
                    '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-[3px] transition-all"
                  style={{
                    backgroundColor: active
                      ? "rgba(255,255,255,0.9)"
                      : "transparent",
                  }}
                />
                <span
                  className="font-bold tracking-tight"
                  style={{
                    fontSize: active ? "22px" : "20px",
                    letterSpacing: "-0.01em",
                    textShadow: active
                      ? "0 1px 0 rgba(0,0,0,0.18)"
                      : "none",
                    transition: "font-size 180ms ease",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
