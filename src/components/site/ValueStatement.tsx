import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Bi-Weekly",
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
    <section className="bg-white pt-24 pb-12 sm:pt-32 sm:pb-16">
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
              <div className="flex flex-col items-center gap-1">
                <span
                  className="font-display text-2xl font-black tracking-tight sm:text-[28px]"
                  style={{ color: p.accent }}
                >
                  {p.name}
                </span>
                <span
                  className="h-[3px] w-10 rounded-full"
                  style={{
                    background: `color-mix(in oklab, ${p.accent} 60%, transparent)`,
                  }}
                />
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
                className={`mt-6 h-11 w-full rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                  p.popular
                    ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 hover:shadow-[0_0_30px_oklch(0.7_0.18_30/0.6),0_0_60px_oklch(0.7_0.18_30/0.35)]"
                    : "bg-[oklch(0.55_0.01_270)] text-white hover:bg-[oklch(0.48_0.01_270)] hover:shadow-[0_0_24px_oklch(0.55_0.01_270/0.55),0_0_48px_oklch(0.55_0.01_270/0.3)]"
                }`}
              >
                Choose {p.name}
              </Button>
            </div>
          ))}
        </div>

        {/* === FEATURES — eye-catching === */}
        <div className="mx-auto mt-16 max-w-4xl">
          {/* Heading — big, with highlighter swipe + sparkles */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <Sparkles
                className="h-6 w-6 text-[oklch(0.55_0.18_30)] sm:h-7 sm:w-7"
                strokeWidth={2.5}
              />
              <h3 className="font-display text-3xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
                All plans{" "}
                <span className="relative inline-block">
                  <span
                    aria-hidden
                    className="absolute inset-x-[-4px] bottom-1 -z-0 h-[55%] -rotate-1 rounded-sm"
                    style={{
                      background:
                        "linear-gradient(120deg, oklch(0.85 0.14 90 / 0.7), oklch(0.88 0.12 60 / 0.65))",
                    }}
                  />
                  <span className="relative z-10">include</span>
                </span>
              </h3>
              <Sparkles
                className="h-6 w-6 text-[oklch(0.45_0.18_265)] sm:h-7 sm:w-7"
                strokeWidth={2.5}
              />
            </div>
            <p className="mt-3 font-handwriting text-xl text-foreground/65 sm:text-2xl">
              every single feature, on every plan
            </p>
          </div>

          {/* Features — clean, professional, dark grey */}
          <ul className="mx-auto mt-9 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-base font-semibold text-[oklch(0.32_0.01_270)] sm:text-[17px]"
              >
                <Check
                  className="mt-1 h-4 w-4 shrink-0 text-[oklch(0.32_0.01_270)]"
                  strokeWidth={3}
                />
                <span>{f}</span>
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
