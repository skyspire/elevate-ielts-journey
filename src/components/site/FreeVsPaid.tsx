import { Check, Lock, Sparkles, Star } from "lucide-react";

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
  "Full vocabulary builder — words, phrases, phrasal verbs, expressions",
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

export function FreeVsPaid() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      {/* Soft ambient glow toward paid side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, oklch(0.92 0.08 60 / 0.45) 0%, transparent 65%)",
        }}
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Free vs Paid
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Choose how far you want to go
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium text-foreground/65">
            Start free after sign up. Subscribe to unlock the full IELTS library — built to take
            you to band 8 and beyond.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.25fr] lg:gap-8">
          {/* FREE COLUMN — calm, secondary */}
          <div className="relative flex flex-col rounded-3xl border border-border bg-card/60 p-7 sm:p-9">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                Free Access
              </span>
            </div>

            <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              A taste of what's inside
            </h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Sign up required. Limited samples, no recurring access.
            </p>

            <div className="mt-7 flex items-baseline gap-1.5">
              <span className="font-display text-5xl font-extrabold tracking-tight text-foreground/85">
                $0
              </span>
              <span className="text-sm font-bold text-muted-foreground">/ forever</span>
            </div>

            <ul className="mt-7 space-y-3">
              {freeIncludes.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm font-medium text-foreground/80">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-dashed border-border pt-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Not included
              </p>
              <ul className="mt-3 space-y-2">
                {freeLimits.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm font-medium text-muted-foreground/80"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground/60">
                      ·
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <button className="mt-8 h-11 rounded-full border border-border bg-card text-sm font-bold text-foreground transition-colors hover:bg-secondary">
              Sign up free
            </button>
          </div>

          {/* PAID COLUMN — dominant */}
          <div
            className="relative flex flex-col rounded-3xl border-2 bg-card p-7 sm:p-10"
            style={{
              borderColor: "oklch(0.3 0.04 60 / 0.9)",
              boxShadow:
                "8px 8px 0 0 oklch(0.3 0.04 60 / 0.9), 0 30px 60px -30px oklch(0.45 0.18 45 / 0.35)",
            }}
          >
            {/* Recommended ribbon */}
            <span
              className="absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md sm:left-10"
              style={{ background: "oklch(0.55 0.2 30)" }}
            >
              <Star className="h-3 w-3 fill-current" /> Recommended
            </span>

            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ background: "linear-gradient(135deg, oklch(0.7 0.18 50), oklch(0.55 0.2 30))" }}
              >
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-foreground">
                Paid Access — Full Library
              </span>
            </div>

            <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Unlimited access. Everything we make.
            </h3>
            <p className="mt-2 text-sm font-medium text-foreground/70 sm:text-base">
              One subscription unlocks the entire platform — samples, templates, vocabulary,
              predictions, and every resource we publish.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
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
            <div className="mt-9 border-t-2 border-dashed pt-7" style={{ borderColor: "oklch(0.3 0.04 60 / 0.2)" }}>
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
      </div>
    </section>
  );
}
