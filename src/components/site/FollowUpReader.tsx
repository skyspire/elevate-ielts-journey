import { useEffect, useMemo, useRef, useState } from "react";
import { X, Menu, ArrowLeft, LayoutDashboard, Home, BookOpen, MessageCircle, UserCircle, HelpCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  getSpeakingModelAnswer,
  type SpeakingAnswerVariant,
} from "@/data/speaking-model-answers";
import { Highlight, annotateText } from "./StudyPaper";



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
  // All follow-up questions for this topic (enables in-reader navigation).
  questions: { id: string; title: string }[];
  // Current 0-based index into `questions`.
  currentIndex: number;
  // Move to another follow-up without closing the reader.
  onIndexChange: (next: number) => void;
  // Click origin in viewport coords — drives the burst entrance.
  origin: { x: number; y: number } | null;
};

type EntrancePhase = "closed" | "burst" | "settled";

export function FollowUpReader({
  open,
  onClose,
  questions,
  currentIndex,
  onIndexChange,
  origin,
}: FollowUpReaderProps) {
  const question = questions[currentIndex] ?? { id: "", title: "" };
  const index = currentIndex + 1;
  const total = questions.length;

  const [phase, setPhase] = useState<EntrancePhase>("closed");
  const [variantIndex, setVariantIndex] = useState(0);
  const [switchDir, setSwitchDir] = useState<1 | -1>(1);
  const [laneAnim, setLaneAnim] = useState<"idle" | "out" | "in">("idle");
  const [revealedSections, setRevealedSections] = useState(0);
  const [qAnim, setQAnim] = useState<"idle" | "out-left" | "out-right" | "in-left" | "in-right">("idle");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const touchRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);


  // Reset variant index when question changes
  useEffect(() => {
    setVariantIndex(0);
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
  }, [currentIndex]);

  const goToQuestion = (next: number) => {
    if (total <= 1) return;
    const clamped = (next + total) % total;
    if (clamped === currentIndex) return;
    const forward = clamped === (currentIndex + 1) % total;
    setQAnim(forward ? "out-left" : "out-right");
    window.setTimeout(() => {
      onIndexChange(clamped);
      setQAnim(forward ? "in-right" : "in-left");
    }, 200);
    window.setTimeout(() => setQAnim("idle"), 560);
  };




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

  // Parse the body into:
  //   • openingPhrase — bold pull-out (first sentence / 14 words)
  //   • bodyBeforePullQuote — paragraph(s) leading up to the pull-quote
  //   • pullQuote — strongest mid-answer sentence, broken out as centered quote
  //   • bodyAfterPullQuote — remaining text after the pull-quote
  const { openingPhrase, bodyBeforePullQuote, pullQuote, bodyAfterPullQuote } = useMemo(() => {
    const text = fullBody.trim();

    // 1. Opening phrase (bold opener).
    let opening = "";
    let rest = text;
    const sentenceMatch = text.match(/^[^.!?]{1,120}[.!?]/);
    if (sentenceMatch) {
      opening = sentenceMatch[0].trim();
      rest = text.slice(sentenceMatch[0].length).trim();
    } else {
      const words = text.split(/\s+/);
      opening = words.slice(0, 14).join(" ") + (words.length > 14 ? "…" : "");
      rest = words.slice(14).join(" ");
    }

    // 2. Split the remainder into sentences and pick a mid-answer pull-quote.
    //    Prefer a sentence in the middle third that is between 60–180 chars.
    const sentences = rest
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (sentences.length < 3) {
      return {
        openingPhrase: opening,
        bodyBeforePullQuote: rest,
        pullQuote: "",
        bodyAfterPullQuote: "",
      };
    }

    // Search the middle 60% of sentences for a good pull-quote candidate.
    const startIdx = Math.floor(sentences.length * 0.25);
    const endIdx = Math.ceil(sentences.length * 0.75);
    let pullIdx = -1;
    let bestLen = 0;
    for (let i = startIdx; i < endIdx; i++) {
      const len = sentences[i].length;
      if (len >= 50 && len <= 180 && len > bestLen) {
        bestLen = len;
        pullIdx = i;
      }
    }
    if (pullIdx === -1) {
      // Fallback: middle sentence.
      pullIdx = Math.floor(sentences.length / 2);
    }

    return {
      openingPhrase: opening,
      bodyBeforePullQuote: sentences.slice(0, pullIdx).join(" "),
      pullQuote: sentences[pullIdx],
      bodyAfterPullQuote: sentences.slice(pullIdx + 1).join(" "),
    };
  }, [fullBody]);

  // ── Ocean ladder palette — cohesive with SpeakingSampleModal ─────────
  const BAND_COLORS = ["#155e75", "#5b21b6", "#9f1239"];
  const BAND_BAR_COLORS = ["#0e4a5e", "#4c1d95", "#7f1130"];

  const BAND_SHADOW_COLORS = [
    "rgba(6, 60, 56, 0.7)",
    "rgba(15, 36, 110, 0.7)",
    "rgba(20, 18, 70, 0.75)",
  ];
  const INK = "#0f172a";
  const INK_SOFT = "rgba(15, 23, 42, 0.86)";

  const activeBand = BAND_COLORS[variantIndex % BAND_COLORS.length];
  const activeBar = BAND_BAR_COLORS[variantIndex % BAND_BAR_COLORS.length];
  const activeShadow = BAND_SHADOW_COLORS[variantIndex % BAND_SHADOW_COLORS.length];

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
    setPhase("burst");
    const t = window.setTimeout(() => setPhase("settled"), 420);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (phase !== "settled") {
      setRevealedSections(0);
      return;
    }
    setRevealedSections(1);
  }, [phase, variantIndex]);

  useEffect(() => {
    if (phase === "closed") return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("popup-open");
    return () => {
      document.body.style.overflow = original;
      document.body.classList.remove("popup-open");
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (variants.length > 1) {
        if (e.key === "ArrowRight") goToVariant(variantIndex + 1);
        if (e.key === "ArrowLeft") goToVariant(variantIndex - 1);
      }
      if (total > 1) {
        if (e.key === "PageDown" || e.key === "ArrowDown") {
          e.preventDefault();
          goToQuestion(currentIndex + 1);
        }
        if (e.key === "PageUp" || e.key === "ArrowUp") {
          e.preventDefault();
          goToQuestion(currentIndex - 1);
        }
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
    }, 220);
    window.setTimeout(() => setLaneAnim("idle"), 600);
  }

  if (phase === "closed") return null;

  const visible = phase === "settled";
  const laneOut = laneAnim === "out";
  const laneStyle: React.CSSProperties = laneOut
    ? {
        transform: `translate3d(${-switchDir * 24}px, 0, 0)`,
        opacity: 0,
        transition:
          "transform 220ms cubic-bezier(0.4, 0, 1, 1), opacity 220ms cubic-bezier(0.4, 0, 1, 1)",
      }
    : {
        animation:
          laneAnim === "in"
            ? "fu-lane-in 380ms cubic-bezier(0, 0, 0.2, 1) both"
            : undefined,
        ["--fu-lane-from" as string]: `${switchDir * 24}px`,
      };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-10 sm:px-10 sm:py-16"
      role="dialog"
      aria-modal="true"
      aria-label={`${question.title} — Sample answers`}
    >
      {/* Backdrop — band-tinted frosted glass */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{
          background: visible
            ? `radial-gradient(130% 100% at 50% 30%, ${activeBand}d9 0%, ${activeBand}b8 55%, ${activeBand}cc 100%)`
            : "rgba(8, 10, 20, 0)",
          backdropFilter: visible ? "blur(36px) saturate(1.5)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(36px) saturate(1.5)" : "blur(0px)",
          transition:
            "background 360ms ease, backdrop-filter 240ms ease, -webkit-backdrop-filter 240ms ease",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: visible ? 1 : 0,
          background:
            "radial-gradient(70% 40% at 50% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)",
          transition: "opacity 360ms ease",
        }}
      />

      {/* Floating radial nav — top-right, outside the popup card */}
      {visible && (() => {
        const navItems = [
          { label: "Back", icon: ArrowLeft, onClick: () => { setNavOpen(false); onClose(); } },
          { label: "Dashboard", icon: LayoutDashboard, onClick: () => { setNavOpen(false); onClose(); navigate({ to: "/dashboard" }); } },
          { label: "Homepage", icon: Home, onClick: () => { setNavOpen(false); onClose(); navigate({ to: "/" }); } },
          { label: "Modules", icon: Grid3x3, onClick: () => { setNavOpen(false); onClose(); navigate({ to: "/sample-answers" }); } },
        ];
        // Fan items in an arc sweeping down-left from the trigger
        const radius = 92;
        const startAngle = 135; // degrees
        const endAngle = 225;
        return (
          <div className="absolute right-4 top-4 z-[120] sm:right-6 sm:top-6">
            <div className="relative">
              {/* Fan items */}
              {navItems.map((item, idx) => {
                const t = navItems.length === 1 ? 0.5 : idx / (navItems.length - 1);
                const angle = (startAngle + (endAngle - startAngle) * t) * (Math.PI / 180);
                const dx = Math.cos(angle) * radius;
                const dy = Math.sin(angle) * radius;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    aria-label={item.label}
                    title={item.label}
                    className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg backdrop-blur transition-all hover:scale-110"
                    style={{
                      backgroundColor: "rgba(15, 23, 42, 0.88)",
                      transform: navOpen
                        ? `translate(${dx}px, ${dy}px) scale(1)`
                        : "translate(0px, 0px) scale(0.4)",
                      opacity: navOpen ? 1 : 0,
                      pointerEvents: navOpen ? "auto" : "none",
                      transitionProperty: "transform, opacity",
                      transitionDuration: "320ms",
                      transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transitionDelay: navOpen ? `${idx * 40}ms` : `${(navItems.length - 1 - idx) * 30}ms`,
                    }}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                    <span
                      className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white"
                      style={{
                        backgroundColor: "rgba(15, 23, 42, 0.88)",
                        opacity: navOpen ? 1 : 0,
                        transition: "opacity 200ms ease",
                        transitionDelay: navOpen ? `${200 + idx * 40}ms` : "0ms",
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setNavOpen((v) => !v)}
                aria-label={navOpen ? "Close menu" : "Open menu"}
                aria-expanded={navOpen}
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: navOpen ? "rgba(220, 38, 38, 0.92)" : "rgba(15, 23, 42, 0.9)",
                  transform: navOpen ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 220ms ease",
                }}
              >
                {navOpen ? <X className="h-5 w-5" strokeWidth={2.4} /> : <Menu className="h-5 w-5" strokeWidth={2.4} />}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Glass sheet */}
      <div
        className="relative flex w-full max-w-[880px] flex-col overflow-hidden rounded-2xl sm:rounded-3xl"

        style={{
          height: "min(92vh, 980px)",
          backgroundColor: "rgba(255,255,255,0.93)",
          backdropFilter: "blur(14px) saturate(1.05)",
          WebkitBackdropFilter: "blur(14px) saturate(1.05)",
          boxShadow: `0 30px 90px -20px ${activeShadow}, 0 12px 36px -12px ${activeShadow}`,
          transformOrigin: "50% 55%",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.96)",
          transition:
            "opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), transform 380ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 360ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar — dark band-coloured, stacked logo + question */}
        <div
          className="relative flex flex-col items-center gap-2 px-12 sm:px-16"
          style={{
            paddingTop: 14,
            paddingBottom: 16,
            backgroundColor: activeBar,
            boxShadow: "0 6px 18px -12px rgba(15,23,42,0.35)",
            transition: "background-color 360ms ease",
          }}
        >
          <div
            aria-label="BigIELTS.com"
            style={{
              fontFamily:
                'var(--font-display), "Inter", ui-sans-serif, system-ui, sans-serif',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: "0.02em",
              color: "#ffffff",
              opacity: 0.9,
            }}
          >
            BigIELTS
          </div>
          <h2
            className="text-center"
            style={{
              fontFamily: '"Poppins", "Inter", ui-sans-serif, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: "clamp(15px, 2.2vw, 18px)",
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              color: "#ffffff",
              maxWidth: "44ch",
              transform:
                qAnim === "out-left"
                  ? "translateX(-24px)"
                  : qAnim === "out-right"
                  ? "translateX(24px)"
                  : "translateX(0)",
              opacity: qAnim === "out-left" || qAnim === "out-right" ? 0 : 1,
              transition:
                "transform 200ms cubic-bezier(0.4,0,1,1), opacity 200ms ease",
            }}
            key={`q-${currentIndex}`}
          >
            {question.title}

          </h2>

          {/* Dots indicator — tap to jump between follow-up questions */}
          {total > 1 && (
            <div
              className="mt-1 flex items-center justify-center gap-1.5"
              role="tablist"
              aria-label="Follow-up questions"
            >
              {questions.map((q, i) => {
                const isActive = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Question ${i + 1}: ${q.title}`}
                    onClick={() => goToQuestion(i)}
                    className="inline-flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      backgroundColor: isActive ? "#ffffff" : "transparent",
                      color: isActive ? activeBar : "rgba(255,255,255,0.75)",
                      fontFamily:
                        '"Nunito", "Quicksand", ui-rounded, system-ui, sans-serif',
                      fontWeight: 800,
                      fontSize: 12,
                      lineHeight: 1,
                      letterSpacing: 0,
                      boxShadow: isActive
                        ? "0 2px 8px rgba(0,0,0,0.18)"
                        : "none",
                      transition:
                        "background-color 220ms ease, color 220ms ease, box-shadow 220ms ease",
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}

            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white sm:right-4 sm:top-4"
          >
            <X className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>


        {/* Scrollable answer body — supports horizontal swipe between questions */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-9"
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
          }}
          onTouchEnd={(e) => {
            const start = touchRef.current;
            touchRef.current = null;
            if (!start || total <= 1) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            const dt = Date.now() - start.t;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 600) {
              if (dx < 0) goToQuestion(currentIndex + 1);
              else goToQuestion(currentIndex - 1);
            }
          }}
        >
          <article
            style={{
              ...laneStyle,
              transform:
                qAnim === "out-left"
                  ? "translateX(-40px)"
                  : qAnim === "out-right"
                  ? "translateX(40px)"
                  : (laneStyle.transform as string) || "translateX(0)",
              opacity: qAnim === "out-left" || qAnim === "out-right" ? 0 : laneStyle.opacity ?? 1,
              transition:
                qAnim === "out-left" || qAnim === "out-right"
                  ? "transform 200ms cubic-bezier(0.4,0,1,1), opacity 200ms ease"
                  : laneStyle.transition,
              animation:
                qAnim === "in-left" || qAnim === "in-right"
                  ? `fu-q-in-${qAnim === "in-left" ? "left" : "right"} 360ms cubic-bezier(0,0,0.2,1) both`
                  : laneStyle.animation,
            }}
            key={`a-${currentIndex}`}
          >

            <div
              className="mx-auto max-w-[680px]"
              style={{
                color: INK_SOFT,
                fontFamily:
                  '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
                fontSize: "clamp(16px, 1.5vw, 18px)",
                lineHeight: 1.72,
                fontWeight: 450,
              }}
            >
              <p>
                <Highlight tone="amber">
                  <span
                    style={{
                      color: INK,
                      fontWeight: 700,
                      fontSize: "1.06em",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {openingPhrase}
                  </span>
                </Highlight>
                {bodyBeforePullQuote && <span> {annotateText(bodyBeforePullQuote)}</span>}
              </p>

              {pullQuote && (
                <figure
                  className="my-7 flex flex-col items-center text-center"
                  aria-label="Pull quote"
                >
                  <span
                    aria-hidden
                    style={{
                      width: 44,
                      height: 3,
                      borderRadius: 999,
                      backgroundColor: activeBand,
                      marginBottom: 14,
                    }}
                  />
                  <blockquote
                    style={{
                      color: INK,
                      fontFamily: '"Poppins", "Inter", sans-serif',
                      fontWeight: 700,
                      fontSize: "clamp(18px, 2vw, 22px)",
                      lineHeight: 1.35,
                      letterSpacing: "-0.012em",
                      maxWidth: 560,
                    }}
                  >
                    <span aria-hidden style={{ opacity: 0.4, marginRight: "0.1em" }}>
                      “
                    </span>
                    {pullQuote.replace(/^["“”]|["“”]$/g, "")}
                    <span aria-hidden style={{ opacity: 0.4, marginLeft: "0.05em" }}>
                      ”
                    </span>
                  </blockquote>
                </figure>
              )}

              {bodyAfterPullQuote && <p>{annotateText(bodyAfterPullQuote)}</p>}
            </div>
          </article>
        </div>

        {/* Footer tabs — band-coloured strip */}
        {variants.length > 1 && (
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: `repeat(${variants.length}, minmax(0, 1fr))`,
            }}
            role="tablist"
            aria-label="Sample answers"
          >
            {variants.map((v, i) => {
              const active = i === variantIndex;
              const color = BAND_COLORS[i % BAND_COLORS.length];
              const tint = `${color}26`;
              return (
                <button
                  key={i}
                  id={`fu-band-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => goToVariant(i)}
                  className="group relative flex items-center justify-center px-3 py-5 transition-all focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground sm:py-6"
                  style={{
                    backgroundColor: active ? color : tint,
                    color: active ? "#ffffff" : INK,
                    boxShadow: active
                      ? "inset 0 1px 0 rgba(0,0,0,0.18), inset 0 0 0 1px rgba(0,0,0,0.10)"
                      : "inset 0 1px 0 rgba(0,0,0,0.08)",
                    fontFamily:
                      '"Nunito", "Quicksand", ui-rounded, system-ui, -apple-system, sans-serif',
                  }}
                >
                  <span
                    className="font-bold tracking-tight"
                    style={{
                      fontSize: active ? 22 : 20,
                      letterSpacing: "-0.01em",
                      textShadow: active ? "0 1px 0 rgba(0,0,0,0.18)" : "none",
                      transition: "font-size 180ms ease",
                    }}
                  >
                    Band {v.bandScore}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fu-lane-in {
          from { transform: translate3d(var(--fu-lane-from, 24px), 0, 0); opacity: 0; }
          to   { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        @keyframes fu-q-in-right {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes fu-q-in-left {
          from { transform: translateX(-40px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>

    </div>
  );
}

