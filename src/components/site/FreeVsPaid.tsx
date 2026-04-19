import { Check, Lock, Sparkles, Star, X } from "lucide-react";

const freeIncludes = [
  "Sign up required to view any sample",
  "5 Writing sample answers (lifetime)",
  "5 Speaking sample answers (lifetime)",
  "Browse questions & topics",
];

const freeLimits = [
  "No vocabulary builder",
  "No prediction questions",
  "No topic-wise practice sets",
  "No templates or full library",
];

const paidIncludes = [
  "Unlimited Writing & Speaking samples",
  "Hundreds of Writing & Speaking templates",
  "Full vocabulary builder — words, phrases, expressions",
  "Prediction questions for upcoming exams",
  "Topic-wise organized practice sets",
  "All learning resources & survival kits",
  "New questions added every month",
];

const plans = [
  {
    duration: "15 Days",
    price: "7",
    tag: null as string | null,
    bg: "linear-gradient(135deg, oklch(0.7 0.18 50), oklch(0.62 0.2 40))",
    shadow: "0 6px 0 0 oklch(0.45 0.16 40), 0 10px 20px -8px oklch(0.5 0.18 45 / 0.5)",
    flex: "sm:flex-1",
    pad: "py-4",
    priceSize: "text-2xl",
    opacity: "opacity-90",
  },
  {
    duration: "1 Month",
    price: "12",
    tag: "★ Most Popular",
    bg: "linear-gradient(135deg, oklch(0.45 0.18 250), oklch(0.35 0.2 265))",
    shadow: "0 8px 0 0 oklch(0.28 0.16 260), 0 14px 28px -8px oklch(0.4 0.2 260 / 0.6)",
    flex: "sm:flex-[1.15]",
    pad: "py-5",
    priceSize: "text-3xl",
    opacity: "opacity-90",
  },
  {
    duration: "3 Months",
    price: "29",
    tag: null as string | null,
    bg: "linear-gradient(135deg, oklch(0.32 0.05 60), oklch(0.22 0.04 50))",
    shadow: "0 6px 0 0 oklch(0.15 0.03 50), 0 10px 20px -8px oklch(0.2 0.04 50 / 0.6)",
    flex: "sm:flex-1",
    pad: "py-4",
    priceSize: "text-2xl",
    opacity: "opacity-80",
  },
];

// Hand-drawn underline (wobbly) for column titles
function ChalkUnderline({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      className="absolute -bottom-2 left-0 h-2.5 w-full"
    >
      <path
        d="M 4 7 C 40 2, 80 11, 120 5 S 180 9, 196 6"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ filter: "url(#fvp-wobble)" }}
      />
      <defs>
        <filter id="fvp-wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="1.5" />
        </filter>
      </defs>
    </svg>
  );
}

export function FreeVsPaid() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: "oklch(0.96 0.015 75)" }}>
      {/* Wood-panel classroom strip at the bottom of the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3"
        style={{
          background:
            "repeating-linear-gradient(90deg, oklch(0.4 0.06 55) 0 40px, oklch(0.35 0.05 50) 40px 80px)",
          opacity: 0.85,
        }}
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-foreground/70">
            Classroom · Free vs Paid
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Two boards. One clear choice.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium text-foreground/65">
            On the chalkboard: the basics, free after sign up. On the whiteboard: everything you
            need to actually hit Band 8+.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-7 lg:grid-cols-[1fr_1.3fr] lg:gap-9">
          {/* ============== FREE — CHALKBOARD ============== */}
          <div className="relative">
            {/* Wood frame */}
            <div
              className="relative rounded-[28px] p-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.42 0.07 55), oklch(0.32 0.06 50)), repeating-linear-gradient(90deg, transparent 0 22px, oklch(0 0 0 / 0.08) 22px 24px)",
                backgroundBlendMode: "overlay",
              }}
            >
              {/* Chalkboard surface */}
              <div
                className="relative flex flex-col rounded-[20px] p-7 sm:p-9"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 20%, oklch(0.32 0.04 160 / 0.55), transparent 60%), radial-gradient(ellipse at 70% 80%, oklch(0.28 0.05 165 / 0.55), transparent 60%), oklch(0.26 0.04 165)",
                  boxShadow: "inset 0 0 80px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
                  color: "oklch(0.97 0.01 90)",
                  fontFamily: "ui-rounded, 'Comic Sans MS', system-ui",
                }}
              >
                {/* Chalk dust + smudge texture */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[20px] opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.5) 0.6px, transparent 0.6px)",
                    backgroundSize: "4px 4px",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[20px] opacity-[0.18] mix-blend-screen"
                  style={{
                    background:
                      "radial-gradient(ellipse at 80% 15%, white, transparent 30%), radial-gradient(ellipse at 15% 85%, white, transparent 35%)",
                  }}
                />

                <div className="relative flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/85 ring-1 ring-white/20">
                    <Lock className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/70">
                    Chalkboard · Free Access
                  </span>
                </div>

                <div className="relative mt-5 inline-block">
                  <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    The Basics
                  </h3>
                  <ChalkUnderline color="oklch(0.97 0.01 90 / 0.85)" />
                </div>
                <p className="relative mt-3 text-sm font-medium text-white/75">
                  Sign up required. Limited samples, no recurring access.
                </p>

                <div className="relative mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-white">$0</span>
                  <span className="text-sm font-bold text-white/65">/ forever</span>
                </div>

                <ul className="relative mt-7 space-y-3">
                  {freeIncludes.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[15px] font-medium text-white/90">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-6 border-t border-dashed border-white/25 pt-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/55">
                    Erased · Not included
                  </p>
                  <ul className="mt-3 space-y-2">
                    {freeLimits.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm font-medium text-white/55 line-through decoration-white/30"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white/45">
                          <X className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="relative mt-8 h-11 rounded-full border border-white/30 bg-white/10 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                  Sign up free
                </button>
              </div>
            </div>

            {/* Wood chalk tray */}
            <div
              aria-hidden
              className="mx-3 -mt-1 h-3 rounded-b-xl shadow-[0_6px_12px_-4px_rgba(0,0,0,0.4)]"
              style={{
                background: "linear-gradient(180deg, oklch(0.32 0.06 50), oklch(0.24 0.05 45))",
              }}
            />
          </div>

          {/* ============== PAID — WHITEBOARD ============== */}
          <div className="relative">
            {/* Aluminum frame */}
            <div
              className="relative rounded-[28px] p-2.5 shadow-[12px_12px_0_0_oklch(0.3_0.04_60_/_0.85),0_30px_60px_-25px_oklch(0.45_0.18_45_/_0.4)]"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.85 0.01 250), oklch(0.72 0.015 250))",
              }}
            >
              {/* Whiteboard surface */}
              <div
                className="relative flex flex-col rounded-[20px] p-7 sm:p-10"
                style={{
                  background:
                    "radial-gradient(ellipse at 70% 15%, oklch(1 0 0), oklch(0.985 0.005 80) 60%)",
                  boxShadow: "inset 0 0 0 1px oklch(0.85 0.01 80), inset 0 30px 60px -30px oklch(0.85 0.02 70 / 0.5)",
                }}
              >
                {/* Faint marker smudge texture */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[20px] opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent 0 38px, oklch(0.4 0.05 60) 38px 39px)",
                  }}
                />

                {/* Recommended ribbon */}
                <span
                  className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md sm:left-10"
                  style={{ background: "oklch(0.55 0.2 30)" }}
                >
                  <Star className="h-3 w-3 fill-current" /> Recommended
                </span>

                <div className="relative flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, oklch(0.7 0.18 50), oklch(0.55 0.2 30))" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/80">
                    Whiteboard · Full Library
                  </span>
                </div>

                <div className="relative mt-5 inline-block">
                  <h3 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {/* Highlighter swipe behind 'Unlimited access' */}
                    <span className="relative inline-block">
                      <span
                        aria-hidden
                        className="absolute inset-x-[-4px] bottom-1 top-2 -z-0 -rotate-1 rounded-sm"
                        style={{
                          background:
                            "linear-gradient(100deg, oklch(0.93 0.16 95 / 0.85) 0%, oklch(0.92 0.18 90 / 0.95) 50%, oklch(0.93 0.16 95 / 0.7) 100%)",
                          filter: "blur(0.3px)",
                        }}
                      />
                      <span className="relative z-10">Unlimited access.</span>
                    </span>{" "}
                    Everything we make.
                  </h3>
                  <ChalkUnderline color="oklch(0.45 0.18 250 / 0.7)" />
                </div>

                <p className="relative mt-4 text-sm font-medium text-foreground/70 sm:text-base">
                  One subscription unlocks the entire platform — samples, templates, vocabulary,
                  predictions, and every resource we publish.
                </p>

                <ul className="relative mt-7 grid gap-3 sm:grid-cols-2">
                  {paidIncludes.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm font-semibold text-foreground"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.7 0.18 50), oklch(0.55 0.2 30))",
                        }}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Plan buttons */}
                <div
                  className="relative mt-9 border-t-2 border-dashed pt-7"
                  style={{ borderColor: "oklch(0.3 0.04 60 / 0.2)" }}
                >
                  <p className="text-center font-display text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                    Pick your plan — start practicing in under a minute
                  </p>

                  <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-end sm:gap-4">
                    {plans.map((p) => {
                      const btn = (
                        <button
                          className={`group/btn relative w-full rounded-2xl px-5 ${p.pad} font-display text-base font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02]`}
                          style={{ background: p.bg, boxShadow: p.shadow }}
                        >
                          <span className={`block text-[10px] font-bold uppercase tracking-widest ${p.opacity}`}>
                            {p.duration}
                          </span>
                          <span className={`mt-0.5 block ${p.priceSize} font-extrabold`}>
                            {p.price} CAD
                          </span>
                        </button>
                      );

                      if (p.tag) {
                        return (
                          <div key={p.duration} className={`relative ${p.flex}`}>
                            <span
                              className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md"
                              style={{ background: "oklch(0.55 0.2 30)" }}
                            >
                              {p.tag}
                            </span>
                            {btn}
                          </div>
                        );
                      }
                      return (
                        <div key={p.duration} className={p.flex}>
                          {btn}
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Cancel anytime · Instant access · One account, all devices
                  </p>
                </div>
              </div>
            </div>

            {/* Aluminum tray with marker dots */}
            <div
              aria-hidden
              className="relative mx-2.5 -mt-1 flex h-3 items-center justify-center gap-2 rounded-b-xl shadow-[0_6px_12px_-4px_rgba(0,0,0,0.25)]"
              style={{
                background: "linear-gradient(180deg, oklch(0.72 0.015 250), oklch(0.6 0.02 250))",
              }}
            >
              <span className="h-1.5 w-6 rounded-full" style={{ background: "oklch(0.55 0.2 30)" }} />
              <span className="h-1.5 w-6 rounded-full" style={{ background: "oklch(0.45 0.18 250)" }} />
              <span className="h-1.5 w-6 rounded-full" style={{ background: "oklch(0.55 0.18 145)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
