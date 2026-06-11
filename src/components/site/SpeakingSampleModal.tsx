import { useEffect, useMemo, useRef, useState } from "react";

import { PopupNavMenu } from "@/components/site/PopupNavMenu";
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

// Ocean ladder — teal → ocean blue → deep indigo (cohesive, modern)
const BAND_COLORS = [
  "#0f766e", // teal
  "#1d4ed8", // ocean blue
  "#312e81", // deep indigo
];
// Deeper companion shades for the band-tinted modal halo
const BAND_SHADOW_COLORS = [
  "rgba(6, 60, 56, 0.7)",   // deep teal
  "rgba(15, 36, 110, 0.7)", // deep ocean
  "rgba(20, 18, 70, 0.75)", // deep indigo
];
// Darker bar shades (used by the question header bar)
const BAND_BAR_COLORS = [
  "#0a534d", // darker teal
  "#1e3a8a", // darker ocean
  "#1e1b5e", // darker indigo
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
  const [pressedFollowUpId, setPressedFollowUpId] = useState<string | null>(null);

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
    index: number;
    origin: { x: number; y: number };
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
    document.body.classList.add("popup-open");
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove("popup-open");
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
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10 sm:px-10 sm:py-16"
      aria-modal="true"
      role="dialog"
      aria-label={`${topic.label} — sample answer`}
    >
      {/* Backdrop — frosted band glass (no grey, edge-to-edge band tint) */}
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

      {/* Glossy top sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: visible ? 1 : 0,
          background:
            "radial-gradient(70% 40% at 50% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)",
          transition: "opacity 360ms ease",
        }}
      />

      {/* Subtle frosted noise for that premium glass texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          opacity: visible ? 0.18 : 0,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          transition: "opacity 360ms ease",
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
          className="group relative flex min-h-[72vh] w-full max-w-[420px] cursor-pointer flex-col items-center justify-center overflow-hidden px-8 py-20 text-center transition-shadow duration-700 sm:min-h-[60vh] sm:max-w-[760px] sm:px-16 sm:py-24 lg:max-w-[920px] lg:px-20 lg:py-28"
          style={{
            maxHeight: "88vh",
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)",
            borderRadius: 40,
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow:
              "0 30px 80px -20px rgba(30,58,138,0.7), 0 12px 40px -12px rgba(8,10,20,0.45)",
          }}
        >
          {/* Question — perfectly centered in the card */}
          <h2
            className="relative"
            style={{
              fontFamily:
                'var(--font-display), "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
              fontWeight: 900,
              fontSize: "clamp(30px, 5.6vw, 42px)",
              lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              maxWidth: "18ch",
              textShadow: "0 2px 24px rgba(8,10,40,0.25)",
            }}
          >
            {mainQuestion}
          </h2>

          {/* Bottom block: logo + hint, pinned so question stays visually centered */}
          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center sm:bottom-12">
            <div
              aria-label="BigIELTS.com"
              style={{
                fontFamily:
                  'var(--font-display), "Inter", ui-sans-serif, system-ui, sans-serif',
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "-0.01em",
                color: "#ffffff",
              }}
            >
              <span>BigIELTS</span>
              <span style={{ color: "#bfdbfe" }}>.com</span>
            </div>
            <p
              className="mt-8 sm:mt-10"
              style={{
                fontFamily:
                  'var(--font-display), "Inter", ui-sans-serif, system-ui, sans-serif',
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.4)",
                margin: 0,
              }}
            >
              Click anywhere to view the answer
            </p>
          </div>


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
            `0 30px 90px -20px ${BAND_SHADOW_COLORS[variant]}, 0 12px 36px -12px ${BAND_SHADOW_COLORS[variant]}`,

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
        {/* Header — stacked centered: logo on top, full question below */}
        <div
          className="relative flex flex-col items-center gap-2 px-12 sm:px-16"
          style={{
            paddingTop: 14,
            paddingBottom: 16,
            backgroundColor: BAND_BAR_COLORS[variant],
            boxShadow: "0 6px 18px -12px rgba(15,23,42,0.35)",
          }}
        >
          {/* Logo (small, centered) */}
          <div
            aria-label="BigIELTS.com"
            style={{
              fontFamily:
                'var(--font-display), "Inter", ui-sans-serif, system-ui, sans-serif',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: "0.01em",
              color: "#ffffff",
              opacity: 0.9,
            }}
          >
            <span>BigIELTS</span>
            <span style={{ color: "#bfdbfe" }}>.com</span>
          </div>

          {/* Question — full text, centered, wraps freely */}
          <h2
            className="text-center tracking-[-0.01em]"
            style={{
              fontFamily:
                '"Poppins", "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              color: "#ffffff",
              fontSize: 16,
              lineHeight: 1.4,
              maxWidth: "44ch",
            }}
          >
            {mainQuestion}
          </h2>

          {/* Close handled by PopupNavMenu (red close + hamburger) */}
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
            className="mx-auto max-w-[640px] rounded-xl bg-[#FDFCF8] px-6 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:px-10 sm:py-10"
            style={{
              opacity: laneIn ? 1 : 0,
              transform: laneIn ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 180ms ease, transform 180ms ease",
            }}
          >
            {sections.map((s, i) => (
              <p
                key={i}
                className="mb-5 text-[15.5px] leading-[1.8] text-[#2a2a2a]/90 last:mb-0 sm:text-[16.5px]"
              >
                {s.body}
              </p>
            ))}

            {/* Follow-up questions (cue cards only) */}
            {followUps.length > 0 && (
              <div className="mt-10 border-t border-foreground/[0.08] pt-8">
                <div
                  className="mb-5 text-center"
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
                  Follow-up questions
                </div>
                <ul className="grid gap-2.5">
                  {followUps.map((q, i) => {
                    // Uniform pastel tint of the active band tab color
                    const activeColor = BAND_COLORS[variant];
                    const p = {
                      bg: `${activeColor}1f`,   // ~12% tint
                      ink: BAND_BAR_COLORS[variant], // deep band shade for text
                    };



                    return (
                    <li key={q.id}>
                      <button
                        type="button"
                        onClick={(e) => {
                          const rect = (
                            e.currentTarget as HTMLElement
                          ).getBoundingClientRect();
                          const origin = {
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                          };
                          setPressedFollowUpId(q.id);
                          // Hold pressed state ~250ms, then release over 500ms before opening
                          window.setTimeout(() => {
                            setPressedFollowUpId(null);
                            window.setTimeout(() => {
                              setFollowUpReader({ index: i, origin });
                            }, 500);
                          }, 250);
                        }}
                        data-pressed={pressedFollowUpId === q.id || undefined}
                        onPointerEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = `${activeColor}59`;
                        }}
                        onPointerLeave={(e) => {
                          if (pressedFollowUpId !== q.id) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = p.bg;
                          }
                        }}
                        className="group relative flex w-full items-stretch overflow-hidden rounded-xl text-left hover:shadow-md"
                        style={{
                          backgroundColor:
                            pressedFollowUpId === q.id
                              ? `${activeColor}59` /* ~35% tint */
                              : p.bg,
                          color: p.ink,
                          transition:
                            "background-color 500ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      >
                        <div
                          className="flex w-14 shrink-0 items-center justify-center px-2 sm:w-16"
                          style={{
                            borderRight: `1px solid ${p.ink}26`,
                            backgroundColor: `${p.ink}0d`,
                          }}
                        >
                          <span
                            className="font-display font-black tabular-nums tracking-tight"
                            style={{
                              color: p.ink,
                              fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)",
                              opacity: 0.85,
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <span
                          className="flex min-w-0 flex-1 items-center px-4 py-4 text-[15px] leading-snug sm:px-5"
                          style={{
                            fontFamily:
                              '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                            fontWeight: 700,
                            color: p.ink,
                          }}
                        >
                          {q.title}
                        </span>
                      </button>

                    </li>
                  );})}

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
          questions={followUps.map((q) => ({ id: q.id, title: q.title }))}
          currentIndex={followUpReader.index}
          onIndexChange={(i) =>
            setFollowUpReader((prev) => (prev ? { ...prev, index: i } : prev))
          }
          origin={followUpReader.origin}
        />
      )}

    </div>
  );
}
