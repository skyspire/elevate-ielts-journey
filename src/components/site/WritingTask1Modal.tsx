import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import type { SampleAnswer } from "@/data/sample-answers";
import { LineGraphChart } from "@/components/site/charts/LineGraphChart";
import type { Task1ChartData } from "@/data/writing-task1-charts";

/**
 * WritingTask1Modal — popup reader specifically for Academic Writing
 * Task 1. Visually matches SampleAnswerModal (sticky shrinking question
 * header, paper-uncrumple opener, dust particles, Band 7/8/9 footer tabs)
 * but uses a two-column body: sticky chart panel on the left, scrollable
 * answer on the right. Same layout on phone and desktop.
 */
export type WritingTask1ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  answer: SampleAnswer;
  chart: Task1ChartData;
};

const BAND_LABELS = ["Band 7", "Band 8", "Band 9"] as const;
const BAND_COLORS = ["#94a3b8", "#0f766e", "#b45309"];

export function WritingTask1Modal({
  open,
  onClose,
  title,
  answer,
  chart,
}: WritingTask1ModalProps) {
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

  const active = useMemo(() => {
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
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-4 sm:px-10 sm:py-12"
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

      {/* Dust particles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 600ms ease" }}
      >
        <style>{`
          @keyframes t1DustFloat {
            0%   { transform: translate3d(0, 12vh, 0); opacity: 0; }
            12%  { opacity: var(--t1-dust-op, 0.55); }
            88%  { opacity: var(--t1-dust-op, 0.55); }
            100% { transform: translate3d(var(--t1-dust-dx, 0px), -110vh, 0); opacity: 0; }
          }
        `}</style>
        {Array.from({ length: 45 }).map((_, i) => {
          const seed = (n: number) => (Math.sin(i * 12.9898 + n) + 1) / 2;
          const size = 2 + seed(1) * 7;
          const left = seed(2) * 100;
          const dur = 22 + seed(3) * 26;
          const delay = -seed(4) * dur;
          const dx = (seed(5) - 0.5) * 100;
          const opacity = 0.6 + seed(6) * 0.35;
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
                ["--t1-dust-op" as never]: String(opacity),
                ["--t1-dust-dx" as never]: `${dx}px`,
                animation: `t1DustFloat ${dur}s linear ${delay}s infinite`,
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </div>

      {/* Sheet */}
      <style>{`
        @keyframes t1PaperUncrumple {
          0% {
            transform: scale(0.18) rotate(-14deg) skew(6deg, -4deg);
            filter: blur(6px) contrast(1.15) brightness(0.92);
            border-radius: 40% 60% 55% 45% / 50% 40% 60% 50%;
            opacity: 0;
          }
          25% {
            transform: scale(0.45) rotate(8deg) skew(-3deg, 2deg);
            filter: blur(3px);
            border-radius: 30% 45% 35% 50% / 40% 35% 50% 40%;
            opacity: 0.85;
          }
          55% {
            transform: scale(0.92) rotate(-2deg);
            filter: blur(1px);
            border-radius: 18px;
            opacity: 1;
          }
          78% { transform: scale(1.015); filter: blur(0); border-radius: 18px; }
          100% { transform: scale(1) rotate(0); filter: blur(0); border-radius: 18px; opacity: 1; }
        }
      `}</style>
      <div
        className="relative flex w-full max-w-[1200px] flex-col overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{
          height: "min(94vh, 1040px)",
          backgroundColor: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(14px) saturate(1.05)",
          WebkitBackdropFilter: "blur(14px) saturate(1.05)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.4), 0 0 48px 6px rgba(255,255,255,0.18), 0 30px 80px -20px rgba(8,10,20,0.55), 0 12px 40px -12px rgba(8,10,20,0.4)",
          transformOrigin: "50% 55%",
          animation: visible
            ? "t1PaperUncrumple 640ms cubic-bezier(0.22, 1, 0.36, 1) both"
            : "none",
          opacity: visible ? 1 : 0,
          transition: visible ? undefined : "opacity 200ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — collapses on right-column scroll */}
        <div
          className="flex items-start gap-3 border-b border-foreground/[0.06] px-4 sm:px-10"
          style={{
            paddingTop: collapsed ? 12 : 24,
            paddingBottom: collapsed ? 12 : 24,
            boxShadow: collapsed
              ? "0 6px 18px -12px rgba(15,23,42,0.18)"
              : "0 0 0 0 rgba(15,23,42,0)",
            transition:
              "padding-top 450ms cubic-bezier(0.22, 1, 0.36, 1), padding-bottom 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 450ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="min-w-0 flex-1">
            <div
              className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/55"
              style={{
                fontFamily:
                  '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
              }}
            >
              Academic · Writing Task 1
            </div>
            <h2
              className="tracking-[-0.015em]"
              style={{
                fontFamily:
                  '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                fontWeight: 900,
                color: "#0a0a0a",
                fontSize: collapsed ? 15 : 18,
                lineHeight: collapsed ? 1.35 : 1.45,
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
            className="-mr-1 mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 hover:text-foreground"
            style={{
              backgroundColor: "#f1f1f3",
              color: "#6b7280",
              boxShadow:
                "0 1px 2px rgba(15,23,42,0.06), inset 0 0 0 1px rgba(15,23,42,0.06)",
            }}
          >
            <X className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </button>
        </div>

        {/* Two-column body — left: sticky chart, right: scrollable answer.
            Kept side-by-side on all viewports per design choice. */}
        <div className="flex min-h-0 flex-1 flex-row">
          {/* LEFT — chart panel (sticky / non-scroll) */}
          <div
            className="flex w-[44%] shrink-0 flex-col gap-3 overflow-hidden border-r border-foreground/[0.08] bg-[oklch(0.985_0.008_240)] px-3 py-4 sm:w-[46%] sm:px-6 sm:py-6"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 0%, rgba(15,118,110,0.05), transparent 55%), radial-gradient(circle at 100% 100%, rgba(180,83,9,0.04), transparent 55%)",
            }}
          >
            <div
              className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/55"
              style={{
                fontFamily:
                  '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
              }}
            >
              The chart
            </div>
            <div className="flex min-h-0 flex-1">
              {chart.kind === "line" && (
                <LineGraphChart
                  caption={chart.caption}
                  xLabels={chart.xLabels}
                  series={chart.series}
                  yMax={chart.yMax}
                  yStep={chart.yStep}
                  yUnit={chart.yUnit}
                />
              )}
            </div>
          </div>

          {/* RIGHT — scrollable answer */}
          <div
            ref={scrollRef}
            onScroll={(e) => {
              const top = (e.target as HTMLDivElement).scrollTop;
              setCollapsed(top > 24);
            }}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8"
          >
            <div
              className="mx-auto max-w-[560px]"
              style={{
                opacity: laneIn ? 1 : 0,
                transform: laneIn ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 180ms ease, transform 180ms ease",
              }}
            >
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground/65"
                style={{
                  fontFamily:
                    '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: BAND_COLORS[variant] }}
                />
                Band {active.bandScore} · {active.wordCount} words
              </div>

              {active.paragraphs.map((p, i) => (
                <div key={i} className="mb-7 last:mb-2">
                  {p.heading && (
                    <h3
                      className="mb-2 text-[16px] font-bold leading-snug sm:text-[17px]"
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
                  <p className="text-[14.5px] leading-[1.78] text-foreground/85 sm:text-[15.5px]">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky FOOTER — band tabs */}
        <div
          role="tablist"
          aria-label="Band score variants"
          className="grid shrink-0 grid-cols-3 border-t border-foreground/[0.08]"
        >
          {BAND_LABELS.map((label, i) => {
            const isActive = i === variant;
            const color = BAND_COLORS[i];
            const tint = `color-mix(in oklab, ${color} 55%, white)`;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                id={`t1-band-tab-${i}`}
                aria-selected={isActive}
                aria-label={`Show ${label} sample answer`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectVariant(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const next = (i + 1) % BAND_LABELS.length;
                    selectVariant(next);
                    document.getElementById(`t1-band-tab-${next}`)?.focus();
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const prev =
                      (i - 1 + BAND_LABELS.length) % BAND_LABELS.length;
                    selectVariant(prev);
                    document.getElementById(`t1-band-tab-${prev}`)?.focus();
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    selectVariant(0);
                    document.getElementById(`t1-band-tab-0`)?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    const last = BAND_LABELS.length - 1;
                    selectVariant(last);
                    document.getElementById(`t1-band-tab-${last}`)?.focus();
                  }
                }}
                className="group relative flex items-center justify-center px-3 py-4 transition-all focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground sm:py-5"
                style={{
                  backgroundColor: isActive ? color : tint,
                  color: "#ffffff",
                  boxShadow: isActive
                    ? `inset 0 2px 0 rgba(255,255,255,0.28), 0 0 0 1px ${color} inset, 0 -10px 28px -8px ${color}, 0 -2px 14px -4px ${color}`
                    : "inset 0 1px 0 rgba(255,255,255,0.18)",
                  fontFamily:
                    '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] transition-all"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.9)"
                      : "transparent",
                  }}
                />
                <span
                  className="font-bold tracking-tight"
                  style={{
                    fontSize: isActive ? "20px" : "18px",
                    letterSpacing: "-0.01em",
                    textShadow: isActive ? "0 1px 0 rgba(0,0,0,0.18)" : "none",
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
