import { useEffect, useMemo, useRef, useState } from "react";
import { usePopupActive } from "@/hooks/use-popup-active";
import { PopupNavMenu } from "@/components/site/PopupNavMenu";
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
// Editorial / Oxford prestige palette
const BAND_COLORS = [
  "#1e3a5f", // navy
  "#9b2c2c", // burgundy
  "#b8860b", // gold
];

export function SampleAnswerModal({
  open,
  onClose,
  title,
  questionNumber,
  answer,
  eyebrow,
}: SampleAnswerModalProps) {
  usePopupActive(open);
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
      {/* Backdrop — band-tinted frosted glass (matches FollowUpReader) */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{
          background: visible
            ? `radial-gradient(130% 100% at 50% 30%, ${BAND_COLORS[variant]}d9 0%, ${BAND_COLORS[variant]}b8 55%, ${BAND_COLORS[variant]}cc 100%)`
            : "rgba(8, 10, 20, 0)",
          backdropFilter: visible ? "blur(36px) saturate(1.5)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(36px) saturate(1.5)" : "blur(0px)",
          transition:
            "background 360ms ease, backdrop-filter 240ms ease, -webkit-backdrop-filter 240ms ease",
        }}
      />
      {visible && <PopupNavMenu onClose={onClose} />}

      {/* Dust particles rendered by PopupNavMenu */}



      {/* Sheet — slightly translucent so particles fog through, with soft outer halo */}
      <style>{`
        @keyframes saPaperUncrumple {
          0% {
            transform: scale(0.18) rotate(-14deg) skew(6deg, -4deg);
            filter: blur(6px) contrast(1.15) brightness(0.92);
            border-radius: 40% 60% 55% 45% / 50% 40% 60% 50%;
            opacity: 0;
          }
          25% {
            transform: scale(0.45) rotate(8deg) skew(-3deg, 2deg);
            filter: blur(3px) contrast(1.08) brightness(0.96);
            border-radius: 30% 45% 35% 50% / 40% 35% 50% 40%;
            opacity: 0.85;
          }
          55% {
            transform: scale(0.92) rotate(-2deg) skew(1deg, -0.5deg);
            filter: blur(1px) contrast(1.02) brightness(0.99);
            border-radius: 18px;
            opacity: 1;
          }
          78% {
            transform: scale(1.015) rotate(0.4deg);
            filter: blur(0) contrast(1) brightness(1);
            border-radius: 18px;
          }
          100% {
            transform: scale(1) rotate(0);
            filter: blur(0) contrast(1) brightness(1);
            border-radius: 18px;
            opacity: 1;
          }
        }
      `}</style>
      <div
        className="relative flex w-full max-w-[880px] flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          height: "min(92vh, 980px)",
          backgroundColor: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(14px) saturate(1.05)",
          WebkitBackdropFilter: "blur(14px) saturate(1.05)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.4), 0 0 48px 6px rgba(255,255,255,0.18), 0 30px 80px -20px rgba(8,10,20,0.55), 0 12px 40px -12px rgba(8,10,20,0.4)",
          transformOrigin: "50% 55%",
          animation: visible
            ? "saPaperUncrumple 640ms cubic-bezier(0.22, 1, 0.36, 1) both"
            : "none",
          opacity: visible ? 1 : 0,
          transition: visible ? undefined : "opacity 200ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header — always compact one-line */}
        <div
          className="flex items-start gap-3 border-b border-foreground/[0.06] px-6 sm:px-12"
          style={{
            paddingTop: 14,
            paddingBottom: 14,
            boxShadow: "0 6px 18px -12px rgba(15,23,42,0.18)",
          }}
        >
          <div className="min-w-0 flex-1">
            <h2
              className="tracking-[-0.01em]"
              style={{
                fontFamily:
                  '"Space Grotesk", "DM Sans", "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
                fontWeight: 600,
                color: "#0a0a0a",
                fontSize: 18,
                lineHeight: 1.4,
              }}
            >
              {title}
            </h2>
          </div>


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
          className="mx-auto max-w-[640px] rounded-xl bg-[#F2D6A4] px-6 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:px-10 sm:py-10"
          style={{
            opacity: laneIn ? 1 : 0,
            transform: laneIn ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 180ms ease, transform 180ms ease",
          }}
        >
          {activeParagraphs.paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-5 text-[15.5px] leading-[1.8] text-[#2a2a2a]/90 last:mb-0 sm:text-[16.5px]"
            >
              {p.body}
            </p>
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
        <div
          role="tablist"
          aria-label="Band score variants"
          className="grid shrink-0 grid-cols-3 border-t border-foreground/[0.08]"
        >
          {BAND_LABELS.map((label, i) => {
            const active = i === variant;
            const color = BAND_COLORS[i];
            // mix color with white for medium tint at ~50% saturation
            const tint = `color-mix(in oklab, ${color} 55%, white)`;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                id={`band-tab-${i}`}
                aria-selected={active}
                aria-label={`Show ${label} sample answer`}
                tabIndex={active ? 0 : -1}
                onClick={() => selectVariant(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const next = (i + 1) % BAND_LABELS.length;
                    selectVariant(next);
                    document.getElementById(`band-tab-${next}`)?.focus();
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const prev = (i - 1 + BAND_LABELS.length) % BAND_LABELS.length;
                    selectVariant(prev);
                    document.getElementById(`band-tab-${prev}`)?.focus();
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    selectVariant(0);
                    document.getElementById(`band-tab-0`)?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    const last = BAND_LABELS.length - 1;
                    selectVariant(last);
                    document.getElementById(`band-tab-${last}`)?.focus();
                  }
                }}
                className="group relative flex items-center justify-center px-3 py-5 transition-all focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground sm:py-6"
                style={{
                  backgroundColor: active ? color : tint,
                  color: "#ffffff",
                  boxShadow: active
                    ? `inset 0 1px 0 rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.10)`
                    : "inset 0 1px 0 rgba(0,0,0,0.08)",
                  fontFamily:
                    '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                }}
              >
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
