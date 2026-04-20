import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const freeIncludes = [
  "Sign up required to view samples",
  "5 Writing sample answers (lifetime)",
  "5 Speaking sample answers (lifetime)",
  "Browse questions & topics",
];

const freeLimits = [
  "Vocabulary builder",
  "Prediction questions",
  "Topic-wise practice sets",
  "Templates & full library",
];

const paidIncludes = [
  "Unlimited Writing & Speaking samples",
  "Hundreds of Writing & Speaking templates",
  "Full vocabulary builder",
  "Prediction questions for upcoming exams",
  "Topic-wise organized practice sets",
  "All learning resources & survival kits",
  "New questions added every month",
];

const plans = [
  { name: "Weekly", price: "7", period: "15-day access", popular: false },
  { name: "Monthly", price: "12", period: "30-day access", popular: true },
  { name: "3-Month", price: "29", period: "90-day access", popular: false },
];

export function FreeVsPaid() {
  return (
    <section className="relative bg-paper-cream py-20 sm:py-28">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-foreground/60">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Free vs Full Access
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Start free. Unlock everything when you're ready.
          </h2>
          <p className="mt-4 text-base font-medium text-foreground/65 sm:text-lg">
            A limited free tier to explore the platform — and one subscription
            that opens the entire library.
          </p>
        </div>

        {/* Two cards */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-[1fr_1.3fr] lg:gap-6">
          {/* ============ FREE ============ */}
          <article className="relative flex flex-col rounded-3xl border border-foreground/10 bg-white p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                Free Tier
              </span>
              <span className="rounded-full border border-foreground/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground/55">
                Sign up required
              </span>
            </div>

            <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Explore the basics
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              A taste of the platform. Limited samples, no recurring access.
            </p>

            <div className="mt-7 flex items-baseline gap-1.5">
              <span className="font-display text-5xl font-extrabold tracking-tight text-foreground">
                $0
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                / forever
              </span>
            </div>

            <div className="mt-7 h-px w-full bg-foreground/8" />

            <p className="mt-6 font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
              Included
            </p>
            <ul className="mt-4 space-y-3">
              {freeIncludes.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[15px] font-medium text-foreground/85"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground/70">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <p className="mt-7 font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
              Not included
            </p>
            <ul className="mt-4 space-y-2.5">
              {freeLimits.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm font-medium text-foreground/55"
                >
                  <Minus
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-foreground/35"
                    strokeWidth={3}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              className="mt-9 h-11 rounded-full border-foreground/15 bg-white font-bold hover:bg-secondary"
            >
              Sign up free
            </Button>
          </article>

          {/* ============ PAID ============ */}
          <article className="relative flex flex-col rounded-3xl border-transparent bg-card p-7 shadow-card ring-2 ring-brand sm:p-10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-foreground shadow-soft">
              Most popular
            </span>

            <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Unlimited access to the complete library
            </h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
              One subscription unlocks every sample, template, vocabulary set,
              prediction, and resource we publish.
            </p>

            <ul className="mt-7 space-y-3.5">
              {paidIncludes.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-[15px] font-semibold text-foreground"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Plans */}
            <div className="mt-10 border-t border-foreground/8 pt-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {plans.map((p) => {
                  const popular = p.popular;
                  return (
                    <div
                      key={p.name}
                      className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${
                        popular
                          ? "border-transparent bg-brand-soft/50 ring-1 ring-brand"
                          : "border-foreground/10 bg-white"
                      }`}
                    >
                      {popular && (
                        <span className="absolute -top-2.5 rounded-full bg-brand px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-brand-foreground shadow-soft">
                          Recommended
                        </span>
                      )}
                      <h4 className="font-display text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                        {p.name}
                      </h4>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                          {p.price}
                        </span>
                        <span className="text-[11px] font-bold text-muted-foreground">
                          CAD
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
                        {p.period}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Button className="mt-6 h-12 w-full rounded-full bg-brand text-base font-bold text-brand-foreground shadow-glow hover:bg-brand/90">
                Continue to checkout
              </Button>

              <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Cancel anytime · Instant access · All devices
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
