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
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-10 sm:py-12"

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

      {/* Floating dust particles — ambient cozy layer above backdrop, below sheet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 600ms ease" }}
      >
        <style>{`
          @keyframes saDustFloat {
            0%   { transform: translate3d(0, 12vh, 0); opacity: 0; }
            12%  { opacity: var(--sa-dust-op, 0.55); }
            88%  { opacity: var(--sa-dust-op, 0.55); }
            100% { transform: translate3d(var(--sa-dust-dx, 0px), -110vh, 0); opacity: 0; }
          }
        `}</style>
        {Array.from({ length: 55 }).map((_, i) => {
          // deterministic pseudo-random positions/sizes — feels random but stable
          const seed = (n: number) => ((Math.sin(i * 12.9898 + n) + 1) / 2);
          const size = 2 + seed(1) * 7;          // 2–9px (varied)
          const left = seed(2) * 100;            // 0–100%, fully random


          const dur = 22 + seed(3) * 26;         // 22–48s
          const delay = -seed(4) * dur;          // negative to start mid-flight
          const dx = (seed(5) - 0.5) * 100;      // -50 to 50px horizontal drift
          const opacity = 0.6 + seed(6) * 0.35;  // 0.6–0.95 (bright on dark blur)
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: `${left}%`,
                width: size,
                height: size,
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.95)",
                boxShadow:
                  "0 0 8px rgba(255,255,255,0.65), 0 0 16px rgba(191,219,254,0.35)",
                filter: "blur(0.3px)",
                ["--sa-dust-op" as never]: String(opacity),
                ["--sa-dust-dx" as never]: `${dx}px`,
                animation: `saDustFloat ${dur}s linear ${delay}s infinite`,
                willChange: "transform, opacity",
              }}
            />
          );
        })}

      </div>



      {/* Sheet — slightly translucent so particles fog through, with soft outer halo */}
      <div
        className="relative flex w-full max-w-[880px] flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          height: "min(92vh, 980px)",
          opacity: visible ? 1 : 0,
          backgroundColor: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(14px) saturate(1.05)",
          WebkitBackdropFilter: "blur(14px) saturate(1.05)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.4), 0 0 48px 6px rgba(255,255,255,0.18), 0 30px 80px -20px rgba(8,10,20,0.55), 0 12px 40px -12px rgba(8,10,20,0.4)",
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
            boxShadow: collapsed
              ? "0 6px 18px -12px rgba(15,23,42,0.18)"
              : "0 0 0 0 rgba(15,23,42,0)",
            transition:
              "padding-top 450ms cubic-bezier(0.22, 1, 0.36, 1), padding-bottom 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="min-w-0 flex-1">
            <h2
              className="tracking-[-0.015em] text-[#1d4ed8]"
              style={{
                fontFamily:
                  '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                fontWeight: 900,
                fontSize: collapsed ? 15 : 22,
                lineHeight: collapsed ? 1.4 : 1.45,
                transition:
                  "font-size 450ms cubic-bezier(0.22, 1, 0.36, 1), line-height 450ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {title}
            </h2>
          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "#1d4ed8",
              boxShadow:
                "0 8px 20px -6px rgba(29,78,216,0.55), 0 2px 6px -2px rgba(29,78,216,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <X className="h-[18px] w-[18px]" strokeWidth={3.2} />
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
