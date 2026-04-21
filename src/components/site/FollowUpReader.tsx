import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircleQuestion } from "lucide-react";
import {
  getSpeakingModelAnswer,
  type SpeakingAnswerVariant,
} from "@/data/speaking-model-answers";

/**
 * FollowUpReader — full-screen reader for examiner follow-up questions.
 *
 * Mirrors the cue-card reader's layout (header, scrollable lane with section
 * banners, footer pager with three tabs) but:
 *   • Uses a fresh AMBER → TEAL → PLUM palette so follow-up answers feel
 *     visually distinct from the cue-card's red/blue/olive set.
 *   • Each answer card gets a solid 2px border in its own signature color.
 *   • Reveal is a "burst-and-split" genie animation: a glowing wisp bursts
 *     from the click origin and splits into three palette-tinted streams
 *     before the reader materializes.
 */

export type FollowUpReaderProps = {
  open: boolean;
  onClose: () => void;
  question: { id: string; title: string };
  // Click origin in viewport coords — drives the burst-and-split entrance.
  origin: { x: number; y: number } | null;
};

type EntrancePhase = "closed" | "burst" | "settled";

export function FollowUpReader({ open, onClose, question, origin }: FollowUpReaderProps) {
  const [phase, setPhase] = useState<EntrancePhase>("closed");
  const [variantIndex, setVariantIndex] = useState(0);
  const [switchDir, setSwitchDir] = useState<1 | -1>(1);
  const [laneAnim, setLaneAnim] = useState<"idle" | "out" | "in">("idle");
  const [revealedSections, setRevealedSections] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Build three answer variants from the follow-up question's text.
  const followUpAnswer = useMemo(
    () => getSpeakingModelAnswer(question.title, true),
    [question.title],
  );
  const variants: SpeakingAnswerVariant[] = useMemo(() => {
    if (followUpAnswer.variants && followUpAnswer.variants.length > 0) {
      return followUpAnswer.variants;
    }
    return [
      {
        label: "Sample answer",
        bandScore: followUpAnswer.bandScore,
        sections: followUpAnswer.sections,
      },
    ];
  }, [followUpAnswer]);

  const currentVariant = variants[Math.min(variantIndex, variants.length - 1)];

  // Flatten the variant's sections into a single flowing answer body.
  // Follow-up answers are conversational replies, not sectioned essays —
  // so we present them as one continuous response, billboard-style.
  const fullBody = useMemo(
    () => currentVariant.sections.map((s) => s.body).join(" "),
    [currentVariant],
  );

  // Split the body so we can emphasize the opening phrase (first sentence
  // or first ~14 words, whichever is shorter). This becomes the bold
  // pull-quote that opens the billboard.
  const { openingPhrase, restOfBody } = useMemo(() => {
    const text = fullBody.trim();
    // Prefer first sentence boundary (., !, ?) within first 120 chars.
    const sentenceMatch = text.match(/^[^.!?]{1,120}[.!?]/);
    if (sentenceMatch) {
      return {
        openingPhrase: sentenceMatch[0].trim(),
        restOfBody: text.slice(sentenceMatch[0].length).trim(),
      };
    }
    // Fallback: first 14 words.
    const words = text.split(/\s+/);
    const head = words.slice(0, 14).join(" ");
    return {
      openingPhrase: head + (words.length > 14 ? "…" : ""),
      restOfBody: words.slice(14).join(" "),
    };
  }, [fullBody]);

  // ── BILLBOARD palette: AMBER · TEAL · PLUM ─────────────────────────────
  // For follow-ups we go BOLD: the full screen fills with the active
  // palette's saturated color, text is white/cream, and the footer tabs
  // each carry their own signature color.
  const palette = [
    {
      // Amber — warm, energetic
      fill:      "oklch(0.62 0.18 65)",   // bold saturated amber-orange
      fillDeep:  "oklch(0.48 0.16 60)",   // for shadows / accents
      tabBg:     "oklch(0.62 0.18 65)",
      tabBorder: "oklch(0.30 0.14 60)",
      ink:       "oklch(0.99 0.015 80)",  // warm cream text
      inkSoft:   "oklch(0.99 0.015 80 / 0.85)",
    },
    {
      // Teal — cool, considered
      fill:      "oklch(0.50 0.13 200)",  // deep teal
      fillDeep:  "oklch(0.36 0.11 200)",
      tabBg:     "oklch(0.50 0.13 200)",
      tabBorder: "oklch(0.26 0.10 200)",
      ink:       "oklch(0.99 0.012 200)",
      inkSoft:   "oklch(0.99 0.012 200 / 0.85)",
    },
    {
      // Plum — rich, sophisticated
      fill:      "oklch(0.46 0.16 330)",  // deep plum
      fillDeep:  "oklch(0.32 0.14 330)",
      tabBg:     "oklch(0.46 0.16 330)",
      tabBorder: "oklch(0.24 0.13 330)",
      ink:       "oklch(0.99 0.015 330)",
      inkSoft:   "oklch(0.99 0.015 330 / 0.85)",
    },
  ];
  const activePalette = palette[variantIndex % palette.length];

  // Open / close phase machine.
  useEffect(() => {
    if (!open) {
      if (phase !== "closed") {
        setPhase("closed");
        setVariantIndex(0);
        setRevealedSections(0);
      }
      return;
    }
    // Burst → settled. The burst animation runs in CSS for ~520ms; once it
    // peaks we transition to "settled" so the reader content fades in.
    setPhase("burst");
    const t = window.setTimeout(() => setPhase("settled"), 520);
    return () => clearTimeout(t);
  }, [open]);

  // Reveal sections progressively on first open; instant on variant switch.
  useEffect(() => {
    if (phase !== "settled") return;
    const total = sections.length;
    if (laneAnim === "in" || laneAnim === "out") {
      setRevealedSections(total);
      return;
    }
    setRevealedSections(0);
    const timers: number[] = [];
    for (let i = 0; i < total; i++) {
      timers.push(
        window.setTimeout(
          () => setRevealedSections((n) => Math.max(n, i + 1)),
          200 + i * 280,
        ),
      );
    }
    return () => timers.forEach((id) => clearTimeout(id));
  }, [phase, variantIndex, sections.length, laneAnim]);

  // Body scroll lock.
  useEffect(() => {
    if (phase === "closed") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [phase]);

  // Esc + arrow keys.
  useEffect(() => {
    if (phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (variants.length > 1) {
        if (e.key === "ArrowRight") goToVariant(variantIndex + 1);
        if (e.key === "ArrowLeft") goToVariant(variantIndex - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, variantIndex, variants.length]);

  function goToVariant(next: number) {
    if (variants.length <= 1) return;
    const clamped = (next + variants.length) % variants.length;
    if (clamped === variantIndex) return;
    const forward =
      (clamped - variantIndex + variants.length) % variants.length === 1;
    setSwitchDir(forward ? 1 : -1);
    setLaneAnim("out");
    window.setTimeout(() => {
      setVariantIndex(clamped);
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
      setLaneAnim("in");
    }, 260);
    window.setTimeout(() => setLaneAnim("idle"), 660);
  }

  if (phase === "closed") return null;

  // Burst origin — defaults to viewport center if no click point given.
  const burstX = origin?.x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const burstY = origin?.y ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const isBursting = phase === "burst";
  const isSettled = phase === "settled";

  return (
    <div
      className="fixed inset-0 z-[110]"
      role="dialog"
      aria-modal="true"
      aria-label={`${question.title} — Sample answers`}
    >
      {/* Backdrop fade */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/55 backdrop-blur-md transition-opacity duration-500"
        style={{ opacity: isSettled ? 1 : 0.0 }}
      />

      {/* ── Burst & split streams overlay ─────────────────────────────────
          A central glowing wisp bursts from the click origin, then three
          palette-tinted streams arc outward in three directions. Pure CSS
          via inline keyframe animations — no JS animation loop. */}
      {isBursting && (
        <div
          className="pointer-events-none absolute inset-0 z-[112] overflow-hidden"
          aria-hidden
        >
          {/* Central wisp */}
          <span
            className="absolute rounded-full"
            style={{
              left: burstX,
              top: burstY,
              width: 16,
              height: 16,
              marginLeft: -8,
              marginTop: -8,
              background:
                "radial-gradient(circle, oklch(0.98 0.02 80) 0%, oklch(0.85 0.10 80 / 0.7) 50%, transparent 70%)",
              boxShadow: "0 0 60px 20px oklch(0.95 0.05 80 / 0.55)",
              animation: "fu-burst-core 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          />
          {/* Three palette-tinted streams arcing outward */}
          {palette.map((p, i) => {
            // Three directions: up-left, up, up-right (slight upward spread).
            const angle = -90 + (i - 1) * 28; // -118°, -90°, -62°
            const rad = (angle * Math.PI) / 180;
            const dist = 380;
            const dx = Math.cos(rad) * dist;
            const dy = Math.sin(rad) * dist;
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: burstX,
                  top: burstY,
                  width: 12,
                  height: 12,
                  marginLeft: -6,
                  marginTop: -6,
                  background: p.glow,
                  boxShadow: `0 0 30px 8px ${p.glow}`,
                  ["--fu-dx" as string]: `${dx}px`,
                  ["--fu-dy" as string]: `${dy}px`,
                  animation: `fu-stream 520ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 50}ms forwards`,
                  opacity: 0,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── Reader stage ─────────────────────────────────────────────────
          Fades + scales in from the burst origin once the streams settle. */}
      <div
        className="pointer-events-auto absolute inset-0 origin-center"
        style={{
          opacity: isSettled ? 1 : 0,
          transform: isSettled ? "scale(1)" : "scale(0.94)",
          transformOrigin: `${burstX}px ${burstY}px`,
          transition:
            "opacity 380ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Atmospheric background tint (palette.screen) */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            backgroundColor: activePalette.screen,
            transition: "background-color 640ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            className="absolute -left-[15%] top-[8%] h-[55vh] w-[55vh] rounded-full opacity-[0.16] blur-3xl"
            style={{
              background: `radial-gradient(circle, ${activePalette.glow} 0%, transparent 65%)`,
              animation: "drift-a 26s ease-in-out infinite",
            }}
          />
          <div
            className="absolute -right-[12%] bottom-[10%] h-[50vh] w-[50vh] rounded-full opacity-[0.14] blur-3xl"
            style={{
              background: `radial-gradient(circle, ${activePalette.glow} 0%, transparent 65%)`,
              animation: "drift-b 32s ease-in-out infinite",
            }}
          />
          {/* Subtle paper grain — same recipe as the cue-card reader. */}
          <div
            className="absolute inset-0 mix-blend-multiply opacity-[0.045]"
            style={{
              backgroundImage: [
                "radial-gradient(circle at 1px 1px, oklch(0.25 0.02 60) 0.6px, transparent 1.2px)",
                "radial-gradient(circle at 2px 3px, oklch(0.30 0.02 60) 0.5px, transparent 1px)",
              ].join(", "),
              backgroundSize: "7px 7px, 13px 11px",
              backgroundPosition: "0 0, 3px 5px",
            }}
          />
        </div>

        {/* Header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-4 sm:pt-6">
          <div className="pointer-events-auto w-full max-w-[680px] rounded-2xl border border-foreground/10 bg-white/65 px-5 py-3.5 shadow-[0_8px_30px_-12px_oklch(0.2_0.05_165/0.18)] backdrop-blur-xl sm:px-7 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="inline-flex shrink-0 items-center gap-1.5 pr-1"
                  style={{ color: activePalette.heading }}
                  aria-label="Follow-up question"
                >
                  <MessageCircleQuestion className="h-4 w-4" strokeWidth={2.4} />
                  <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em]">
                    Follow-up
                  </span>
                </span>
                <span aria-hidden className="h-4 w-px shrink-0 bg-foreground/15" />
                <h2 className="truncate font-display text-[15px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[17px]">
                  {question.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-foreground/10 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-foreground/70 transition-colors hover:text-foreground"
                aria-label="Close"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable reading lane with a solid 2px colored border in the
            active palette color — wraps the entire reading column. */}
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto pt-[120px] pb-[200px] sm:pt-[140px] sm:pb-[220px]"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0, black calc(100% - 120px), transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0, black calc(100% - 120px), transparent 100%)",
          }}
        >
          <article
            className="mx-auto w-full max-w-[640px] rounded-3xl bg-white/45 px-6 py-8 backdrop-blur-sm sm:px-10 sm:py-10"
            style={{
              border: `2px solid ${activePalette.laneBorder}`,
              transition: "border-color 640ms cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: `0 18px 48px -22px ${activePalette.laneBorder}`,
            }}
          >
            {(() => {
              const isOut = laneAnim === "out";
              const outStyle: React.CSSProperties = {
                transform: `translate3d(${-switchDir * 36}px, 0, 0)`,
                opacity: 0,
                transition:
                  "transform 260ms cubic-bezier(0.4, 0, 1, 1), opacity 260ms cubic-bezier(0.4, 0, 1, 1)",
                willChange: "transform, opacity",
              };
              const inOrIdleStyle: React.CSSProperties = {
                animation:
                  laneAnim === "in"
                    ? "lane-slide-in 380ms cubic-bezier(0, 0, 0.2, 1) both"
                    : undefined,
                ["--lane-from-x" as string]: `${switchDir * 36}px`,
              };

              return (
                <div
                  key={`fu-lane-${variantIndex}`}
                  className="space-y-10"
                  style={isOut ? outStyle : inOrIdleStyle}
                >
                  {sections.map((s, i) => {
                    const visible = i < revealedSections;
                    return (
                      <section
                        key={`${variantIndex}-${s.heading}`}
                        style={{ visibility: visible ? "visible" : "hidden" }}
                      >
                        <h3
                          className="-mx-6 rounded-2xl px-6 py-3 font-display text-[18px] font-extrabold leading-tight tracking-tight sm:-mx-10 sm:px-10 sm:py-3.5 sm:text-[20px]"
                          style={{
                            color: activePalette.heading,
                            backgroundColor: `color-mix(in oklab, ${activePalette.heading} 14%, ${activePalette.screen} 86%)`,
                            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${activePalette.heading} 18%, transparent)`,
                          }}
                        >
                          {s.heading}
                        </h3>
                        <p className="mt-4 text-[15.5px] leading-[1.85] text-foreground/85 sm:text-[16.5px]">
                          {s.body}
                        </p>
                        {i < sections.length - 1 && (
                          <div className="mx-auto mt-10 h-px w-16 bg-foreground/10" />
                        )}
                      </section>
                    );
                  })}
                </div>
              );
            })()}
          </article>
        </div>

        {/* Footer pager — three always-colored tabs, active gets tonal border. */}
        {variants.length > 1 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-5 sm:px-6 sm:pb-7">
            <div
              className="pointer-events-auto flex w-full max-w-[640px] items-stretch gap-1.5 rounded-2xl border border-white/[0.06] p-1.5 shadow-[0_22px_50px_-18px_oklch(0_0_0/0.55)]"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.26 0.015 75) 0%, oklch(0.18 0.015 75) 100%)",
              }}
            >
              <button
                type="button"
                onClick={() => goToVariant(variantIndex - 1)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/5 hover:text-white sm:h-12 sm:w-12"
                aria-label="Previous answer"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.6} />
              </button>

              <div
                className="flex flex-1 items-stretch gap-1.5"
                role="tablist"
                aria-label="Sample answers"
              >
                {variants.map((_, i) => {
                  const active = i === variantIndex;
                  const tone = palette[i % palette.length];
                  return (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => goToVariant(i)}
                      className="relative flex flex-1 items-center justify-center rounded-xl px-2 py-2.5 transition-all duration-300 ease-out sm:py-3"
                      style={{
                        backgroundColor: tone.tabBg,
                        boxShadow: active
                          ? `inset 0 0 0 2px ${tone.tabBorder}`
                          : "inset 0 0 0 1px oklch(0 0 0 / 0.04)",
                      }}
                    >
                      <span
                        className="font-display tracking-tight transition-all duration-300"
                        style={{
                          color: active ? "oklch(1 0 0 / 0.98)" : "oklch(1 0 0 / 0.78)",
                          fontWeight: active ? 800 : 600,
                          fontSize: "13px",
                          letterSpacing: active ? "-0.01em" : "0",
                        }}
                      >
                        Answer {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goToVariant(variantIndex + 1)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/70 transition-colors hover:bg-white/5 hover:text-white sm:h-12 sm:w-12"
                aria-label="Next answer"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.6} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Local keyframes for the burst & split entrance. */}
      <style>{`
        @keyframes fu-burst-core {
          0%   { transform: scale(0.4); opacity: 0; }
          25%  { transform: scale(1.5); opacity: 1; }
          70%  { transform: scale(2.4); opacity: 0.8; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        @keyframes fu-stream {
          0%   { transform: translate3d(0, 0, 0) scale(0.4); opacity: 0; }
          15%  { opacity: 1; }
          70%  { opacity: 0.85; }
          100% {
            transform: translate3d(var(--fu-dx, 0), var(--fu-dy, 0), 0) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
