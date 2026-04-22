import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Weekly",
    price: "7",
    days: "15",
    popular: false,
    accent: "oklch(0.55 0.18 30)", // coral
  },
  {
    name: "Monthly",
    price: "12",
    days: "30",
    popular: true,
    accent: "oklch(0.45 0.18 265)", // indigo
  },
  {
    name: "3-Month",
    price: "29",
    days: "90",
    popular: false,
    accent: "oklch(0.55 0.14 160)", // teal
  },
];

const features = [
  "Academic + General",
  "Complete question bank",
  "Band 8–9 Writing samples",
  "Speaking model answers",
  "Vocabulary & structures",
  "Recent exam questions (monthly)",
];

export function ValueStatement() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-page">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <span className="text-[oklch(0.55_0.18_30)]">One</span>{" "}
            <span className="text-foreground">Subscription.</span>
            <br />
            <span className="text-[oklch(0.45_0.18_265)]">Unlimited</span>{" "}
            <span className="text-foreground">Access.</span>
          </h2>

          {/* Tagline — editorial line with handwritten accent */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="font-display text-xl font-black uppercase tracking-[0.08em] text-foreground sm:text-3xl">
              <span className="text-[oklch(0.55_0.18_30)]">Academic</span>
              <span className="mx-3 text-foreground/25">/</span>
              <span className="text-[oklch(0.45_0.18_265)]">General</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-foreground/20" />
              <span className="font-handwriting text-xl text-foreground/70 sm:text-2xl">
                one plan unlocks both
              </span>
              <span className="h-px w-12 bg-foreground/20" />
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-foreground/60 sm:text-lg">
            Hundreds of{" "}
            <span className="font-bold text-[oklch(0.55_0.18_30)]">recent</span>{" "}
            IELTS Writing and Speaking questions with{" "}
            <span className="font-bold text-[oklch(0.45_0.18_265)]">
              Band 8–9
            </span>{" "}
            sample answers and{" "}
            <span className="font-bold text-foreground">vocabulary support</span>{" "}
            — all in one place.
          </p>
        </div>

        {/* === PRICING === */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-5 sm:mt-20 sm:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col items-center rounded-3xl border p-8 text-center transition-all hover:-translate-y-1 ${
                p.popular
                  ? "border-transparent bg-card shadow-card ring-2 ring-brand sm:scale-105"
                  : "border-border bg-card shadow-soft hover:shadow-card"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-foreground shadow-soft">
                  Most popular
                </span>
              )}
              <div
                className="font-display text-sm font-extrabold uppercase tracking-[0.18em]"
                style={{ color: p.accent }}
              >
                {p.name}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-6xl font-black tracking-tight text-foreground">
                  ${p.price}
                </span>
                <span className="text-sm font-bold text-muted-foreground">CAD</span>
              </div>
              <div
                className="mt-3 rounded-full px-4 py-1.5 text-sm font-extrabold"
                style={{
                  background: `color-mix(in oklab, ${p.accent} 14%, transparent)`,
                  color: p.accent,
                }}
              >
                {p.days} days access
              </div>
              <Button
                className={`mt-6 h-11 w-full rounded-full font-bold ${
                  p.popular
                    ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                Choose {p.name}
              </Button>
            </div>
          ))}
        </div>

        {/* === FEATURES — supporting === */}
        <div className="mx-auto mt-14 max-w-4xl">
          {/* Heading — handwritten + sparkle, no pill */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative inline-flex items-center gap-2">
              <Sparkles
                className="h-5 w-5 text-[oklch(0.55_0.18_30)]"
                strokeWidth={2.5}
              />
              <h3 className="font-handwriting text-3xl text-foreground sm:text-4xl">
                All plans include
              </h3>
              <Sparkles
                className="h-5 w-5 text-[oklch(0.45_0.18_265)]"
                strokeWidth={2.5}
              />
            </div>
            {/* hand-drawn underline */}
            <svg
              viewBox="0 0 200 12"
              className="h-2.5 w-44 text-[oklch(0.55_0.18_30)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M3 7 Q 50 1, 100 6 T 197 5" />
            </svg>
          </div>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {features.map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-base font-semibold text-foreground/85 shadow-soft backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:text-foreground hover:shadow-card"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-xs font-semibold text-muted-foreground">
          E-books sold separately • Cancel anytime • No auto-renewal
        </p>
      </div>
    </section>
  );
}
