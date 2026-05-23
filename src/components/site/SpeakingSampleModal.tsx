import { useEffect, useMemo, useRef, useState } from "react";
import { X, MessageCircleQuestion, ArrowUpRight } from "lucide-react";
import {
  getSpeakingModelAnswer,
  type SpeakingAnswerVariant,
} from "@/data/speaking-model-answers";
import {
  getSpeakingQuestions,
  isCueCardCategory,
} from "@/data/speaking-questions";
import type { SpeakingTopic } from "@/data/speaking-topics";
import { FollowUpReader } from "@/components/site/FollowUpReader";

/**
 * SpeakingSampleModal — visually identical to SampleAnswerModal (Writing).
 * Same paper-uncrumple opener, dust particles, sticky shrinking header with
 * dark-black question title + grey close icon, single-column body, and
 * full-width band-score footer tabs. Below the answer body it renders the
 * examiner follow-up question list (for cue cards), each of which opens the
 * existing FollowUpReader genie reader.
 */
export type SpeakingSampleModalProps = {
  open: boolean;
  onClose: () => void;
  topic: SpeakingTopic;
  categoryId: string;
};

// Editorial / Oxford prestige palette — matches Writing modals.
const BAND_COLORS = [
  "#1e3a5f", // navy
  "#9b2c2c", // burgundy
  "#b8860b", // gold
];

export function SpeakingSampleModal({
  open,
  onClose,
  topic,
  categoryId,
}: SpeakingSampleModalProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState(0);
  const [laneIn, setLaneIn] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [phase, setPhase] = useState<"title" | "answer">("title");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isCue = isCueCardCategory(categoryId);
  const questions = useMemo(
    () => getSpeakingQuestions(categoryId, topic.id),
    [categoryId, topic.id],
  );
  const headerQuestion = questions[0];
  const followUps = isCue ? questions.slice(1) : [];

  const answer = useMemo(
    () => getSpeakingModelAnswer(topic.label, isCue),
    [topic.label, isCue],
  );
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

  const [followUpReader, setFollowUpReader] = useState<{
    question: { id: string; title: string };
    origin: { x: number; y: number };
    index: number;
    total: number;
  } | null>(null);

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
      setPhase(isCue ? "title" : "answer");
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [open, isCue]);

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

  const currentVariant = variants[Math.min(variant, variants.length - 1)];
  const sections = currentVariant.sections;
  const title = headerQuestion?.title ?? topic.label;
  // Strip cue-card sub-questions ("You should say: • ...") so the title card
  // only shows the main prompt sentence.
  const mainQuestion = (() => {
    const cut = title.split(/\s*you should say\s*:?/i)[0].trim();
    const cleaned = cut.replace(/[\s•\-–—]+$/g, "").trim();
    return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
  })();


  const BAND_LABELS = variants.map((v) => `Band ${v.bandScore}`);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-10 sm:py-12"
      aria-modal="true"
      role="dialog"
      aria-label={`${topic.label} — sample answer`}
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

      {/* Floating dust particles */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 600ms ease" }}
      >
        <style>{`
          @keyframes spDustFloat {
            0%   { transform: translate3d(0, 12vh, 0); opacity: 0; }
            12%  { opacity: var(--sp-dust-op, 0.55); }
            88%  { opacity: var(--sp-dust-op, 0.55); }
            100% { transform: translate3d(var(--sp-dust-dx, 0px), -110vh, 0); opacity: 0; }
          }
        `}</style>
        {Array.from({ length: 55 }).map((_, i) => {
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
                ["--sp-dust-op" as never]: String(opacity),
                ["--sp-dust-dx" as never]: `${dx}px`,
                animation: `spDustFloat ${dur}s linear ${delay}s infinite`,
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </div>

      {/* Sheet */}
      <style>{`
        @keyframes spPaperUncrumple {
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
      {phase === "title" && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Reveal sample answer"
          onClick={(e) => {
            e.stopPropagation();
            setPhase("answer");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setPhase("answer");
            }
          }}
          className="relative flex w-full max-w-[880px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl px-8 py-16 text-center sm:rounded-3xl sm:px-16 sm:py-24"
          style={{
            height: "min(92vh, 980px)",
            backgroundColor: "oklch(0.93 0.03 70)",
            color: "oklch(0.20 0.04 70)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.4), 0 30px 80px -20px rgba(8,10,20,0.55), 0 12px 40px -12px rgba(8,10,20,0.4)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              fontFamily:
                '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(72px, 14vw, 160px)",
              lineHeight: 0.8,
              color: "oklch(0.45 0.17 30)",
              opacity: 0.55,
              marginBottom: 8,
            }}
          >
            “
          </div>
          <h2
            style={{
              fontFamily:
                '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
              fontWeight: 400,
              fontSize: "clamp(28px, 5.2vw, 52px)",
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
              maxWidth: "22ch",
              color: "oklch(0.20 0.04 70)",
            }}
          >
            {title}
          </h2>
          <div
            aria-hidden="true"
            style={{
              fontFamily:
                '"Instrument Serif", "Cormorant Garamond", Georgia, serif',
              fontSize: "clamp(72px, 14vw, 160px)",
              lineHeight: 0.4,
              color: "oklch(0.45 0.17 30)",
              opacity: 0.55,
              marginTop: 16,
            }}
          >
            ”
          </div>
          <div
            style={{
              marginTop: 40,
              fontFamily:
                '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "oklch(0.40 0.03 70)",
            }}
          >
            Tap anywhere to reveal the sample answer
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 sm:right-6 sm:top-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.6)",
              color: "oklch(0.30 0.03 70)",
              boxShadow:
                "0 1px 2px rgba(15,23,42,0.06), inset 0 0 0 1px rgba(15,23,42,0.08)",
            }}
          >
            <X className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </button>
        </div>
      )}

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
          animation: visible && phase === "answer"
            ? "spPaperUncrumple 640ms cubic-bezier(0.22, 1, 0.36, 1) both"
            : "none",
          opacity: visible && phase === "answer" ? 1 : 0,
          display: phase === "answer" ? "flex" : "none",
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

        {/* Scroll body */}
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
            {sections.map((s, i) => (
              <div key={i} className="mb-8 last:mb-2">
                {s.heading && (
                  <h3
                    className="mb-3 text-[17px] font-bold leading-snug sm:text-[18px]"
                    style={{
                      fontFamily:
                        '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                      color: BAND_COLORS[variant],
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {s.heading}
                  </h3>
                )}
                <p className="text-[15.5px] leading-[1.8] text-foreground/85 sm:text-[16.5px]">
                  {s.body}
                </p>
              </div>
            ))}

            {/* Follow-up questions (cue cards only) */}
            {followUps.length > 0 && (
              <div className="mt-10 border-t border-foreground/[0.08] pt-8">
                <div
                  className="mb-4 flex items-center gap-2"
                  style={{
                    fontFamily:
                      '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                    color: "#0a0a0a",
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  <MessageCircleQuestion className="h-4 w-4 opacity-70" />
                  Follow-up questions
                </div>
                <ul className="grid gap-2.5">
                  {followUps.map((q, i) => (
                    <li key={q.id}>
                      <button
                        type="button"
                        onClick={(e) => {
                          const rect = (
                            e.currentTarget as HTMLElement
                          ).getBoundingClientRect();
                          setFollowUpReader({
                            question: { id: q.id, title: q.title },
                            origin: {
                              x: rect.left + rect.width / 2,
                              y: rect.top + rect.height / 2,
                            },
                            index: i + 1,
                            total: followUps.length,
                          });
                        }}
                        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-white/70 px-4 py-3 text-left transition-all hover:border-foreground/20 hover:bg-white hover:shadow-sm"
                      >
                        <span
                          className="min-w-0 flex-1 text-[14.5px] leading-snug text-foreground/85"
                          style={{
                            fontFamily:
                              '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                            fontWeight: 600,
                          }}
                        >
                          <span
                            className="mr-2 inline-block tabular-nums"
                            style={{ color: "#6b7280", fontWeight: 700 }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {q.title}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground/70"
                          strokeWidth={2.4}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Corner watermark */}
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

        {/* Sticky FOOTER tabs */}
        <div
          role="tablist"
          aria-label="Band score variants"
          className="grid shrink-0 grid-cols-3 border-t border-foreground/[0.08]"
        >
          {BAND_LABELS.map((label, i) => {
            const active = i === variant;
            const color = BAND_COLORS[i];
            const tint = `color-mix(in oklab, ${color} 55%, white)`;
            return (
              <button
                key={`${label}-${i}`}
                type="button"
                role="tab"
                id={`sp-band-tab-${i}`}
                aria-selected={active}
                aria-label={`Show ${label} sample answer`}
                tabIndex={active ? 0 : -1}
                onClick={() => selectVariant(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const next = (i + 1) % BAND_LABELS.length;
                    selectVariant(next);
                    document.getElementById(`sp-band-tab-${next}`)?.focus();
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const prev =
                      (i - 1 + BAND_LABELS.length) % BAND_LABELS.length;
                    selectVariant(prev);
                    document.getElementById(`sp-band-tab-${prev}`)?.focus();
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    selectVariant(0);
                    document.getElementById(`sp-band-tab-0`)?.focus();
                  } else if (e.key === "End") {
                    e.preventDefault();
                    const last = BAND_LABELS.length - 1;
                    selectVariant(last);
                    document.getElementById(`sp-band-tab-${last}`)?.focus();
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
                    textShadow: active ? "0 1px 0 rgba(0,0,0,0.18)" : "none",
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

      {/* Follow-up genie reader */}
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
    </div>
  );
}
