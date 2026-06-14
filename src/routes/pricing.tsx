import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Sparkles, Check, Lock, GraduationCap, Briefcase, Crown, Gift, ArrowRight } from "lucide-react";
import { useLearnerSession } from "@/lib/learner-auth";
import { useIeltsType } from "@/lib/ielts-type";
import { PickIeltsTypeAtCheckoutPopup } from "@/components/site/PickIeltsTypeAtCheckoutPopup";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BigIELTS.com" },
      {
        name: "description",
        content:
          "Bi-weekly, monthly, and 3-month subscriptions in CAD. Pick Academic, General Training, or All Access at checkout.",
      },
      { property: "og:title", content: "BigIELTS Pricing" },
      {
        property: "og:description",
        content: "Simple CAD pricing. Choose your IELTS type when you subscribe.",
      },
    ],
  }),
  component: PricingPage,
});

type Cycle = "biweekly" | "monthly" | "quarterly";

const CYCLES: { key: Cycle; label: string; sub: string; price: number; badge?: string; accent: string }[] = [
  {
    key: "biweekly",
    label: "Bi-weekly",
    sub: "15 days access",
    price: 9,
    accent: "oklch(0.6 0.16 230)",
  },
  {
    key: "monthly",
    label: "Monthly",
    sub: "30 days access",
    price: 14,
    badge: "Most popular",
    accent: "oklch(0.55 0.18 30)",
  },
  {
    key: "quarterly",
    label: "3 months",
    sub: "90 days access",
    price: 29,
    badge: "Best value",
    accent: "oklch(0.55 0.14 165)",
  },
];

function PricingPage() {
  const { user } = useLearnerSession();
  const { planType } = useIeltsType();
  const [openCycle, setOpenCycle] = useState<Cycle | null>(null);

  const cycle = openCycle ? CYCLES.find((c) => c.key === openCycle)! : null;

  return (
    <div className="bg-background">
      <section className="container-page py-12 sm:py-16">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
            <Sparkles className="h-3.5 w-3.5" /> Simple, fair pricing
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Choose your subscription
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg">
            All prices in CAD. You'll pick Academic or General Training at checkout. One type per subscription — subscribe again to add the other.
          </p>

          {planType && (
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border bg-emerald-50 px-4 py-1.5 text-[12px] font-bold text-emerald-700" style={{ borderColor: "oklch(0.85 0.1 150)" }}>
              <Check className="h-3.5 w-3.5" />
              You're currently on the{" "}
              {planType === "both" ? "All Access" : planType === "academic" ? "Academic" : "General Training"}{" "}
              plan
            </div>
          )}
        </div>

        {/* Free landscape card — Royal Indigo */}
        <div
          className="relative mt-10 overflow-hidden rounded-3xl p-6 text-white shadow-[0_22px_50px_-18px_rgba(79,70,229,0.55)] sm:p-8"
          style={{
            background:
              "linear-gradient(135deg, #4f46e5 0%, #6366f1 55%, #1e1b4b 100%)",
          }}
        >
          {/* decorative glows */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full opacity-40 blur-3xl"
            style={{ background: "#a5b4fc" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -left-10 -bottom-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
            style={{ background: "#6366f1" }}
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 lg:max-w-2xl">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur"
              >
                <Gift className="h-6 w-6 text-white" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ring-1 ring-white/25">
                  <Sparkles className="h-3 w-3" /> Free forever
                </div>
                <h2 className="font-display mt-3 text-2xl font-black leading-[1.1] tracking-tight sm:text-3xl">
                  Start free — fresh content every week
                </h2>
                <p className="mt-2 text-[14px] font-medium leading-relaxed text-white/85 sm:text-[15px]">
                  Sign up and get hand-picked sample answers and ebook
                  chapters delivered every week. No card, no trial timer —
                  yours to keep using as long as you like.
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-bold text-white/95">
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4" strokeWidth={2.75} /> Weekly fresh sample answers
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4" strokeWidth={2.75} /> Weekly ebook chapter
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4" strokeWidth={2.75} /> No credit card required
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-2 lg:items-end">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold text-indigo-700 shadow-md transition-transform hover:scale-[1.02]"
              >
                {user ? "Go to free content" : "Start free"}
                <ArrowRight className="h-4 w-4" strokeWidth={2.75} />
              </Link>
              <p className="text-center text-[11px] font-bold uppercase tracking-wider text-white/70 lg:text-right">
                Free plan · Updated weekly
              </p>
            </div>
          </div>
        </div>

        {/* Cycle cards */}
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {CYCLES.map((c) => {
            const isPopular = c.key === "monthly";
            return (
              <div
                key={c.key}
                className="relative flex flex-col rounded-3xl bg-card p-6 shadow-sm transition-all sm:p-7"
                style={{
                  border: isPopular ? "2px solid transparent" : "1px solid oklch(0.9 0.01 250)",
                  boxShadow: isPopular
                    ? `0 22px 50px -18px ${c.accent}55, 0 0 0 2px ${c.accent}`
                    : undefined,
                  transform: isPopular ? "translateY(-4px)" : "none",
                }}
              >
                {c.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white"
                    style={{
                      background: `linear-gradient(140deg, ${c.accent}, color-mix(in oklab, ${c.accent} 60%, black))`,
                      boxShadow: `0 8px 18px -6px ${c.accent}66`,
                    }}
                  >
                    {c.badge}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: `linear-gradient(140deg, ${c.accent}, color-mix(in oklab, ${c.accent} 65%, black))`,
                      boxShadow: `0 10px 20px -8px ${c.accent}80, inset 0 1px 0 oklch(1 0 0 / 0.4)`,
                    }}
                  >
                    <Calendar className="h-6 w-6 text-white" strokeWidth={2.4} />
                  </span>
                  <div>
                    <div className="font-display text-xl font-black tracking-tight text-foreground">
                      {c.label}
                    </div>
                    <div className="text-[12px] font-semibold text-muted-foreground">{c.sub}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black tracking-tight text-foreground">
                    ${c.price}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">CAD</span>
                </div>
                <div className="text-[12px] font-semibold text-muted-foreground">
                  For Academic or General Training (pick at next step)
                </div>

                <ul className="mt-5 space-y-2 text-[13px] font-semibold text-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                    Unlimited access for {c.sub.split(" ")[0]} days
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                    Shared Speaking, Listening & Vocabulary
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                    Choose Academic or General at next step
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} />
                    Cancel anytime
                  </li>
                </ul>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setOpenCycle(c.key)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{
                      background: `linear-gradient(140deg, ${c.accent}, color-mix(in oklab, ${c.accent} 65%, black))`,
                      boxShadow: `0 10px 20px -8px ${c.accent}80`,
                    }}
                  >
                    {user ? "Subscribe" : "Get started"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* What unlocks per type — explainer */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            What each IELTS type unlocks
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              {
                k: "academic" as const,
                name: "Academic",
                icon: GraduationCap,
                accent: "oklch(0.55 0.2 255)",
                unlocks: ["Writing Task 1 (charts & graphs)", "Academic reading passages", "Academic recent exams", "Academic predictions", "Academic sample answers & ebooks"],
                locks: ["General Training writing letters", "Workplace / everyday reading", "GT ebooks & samples"],
              },
              {
                k: "general" as const,
                name: "General Training",
                icon: Briefcase,
                accent: "oklch(0.6 0.18 30)",
                unlocks: ["Writing Task 1 (letters)", "Everyday & workplace reading", "GT recent exams", "GT predictions", "GT sample answers & ebooks"],
                locks: ["Academic charts & graphs", "Academic reading passages", "Academic ebooks & samples"],
              },
              {
                k: "both" as const,
                name: "All Access",
                icon: Crown,
                accent: "oklch(0.65 0.18 60)",
                unlocks: ["Everything in Academic", "Everything in General Training", "Switch focus anytime"],
                locks: [],
              },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.k}
                  className="rounded-2xl border bg-card p-5"
                  style={{ borderColor: "oklch(0.9 0.01 250)" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background: `linear-gradient(140deg, ${row.accent}, color-mix(in oklab, ${row.accent} 65%, black))`,
                        boxShadow: `0 8px 18px -6px ${row.accent}80, inset 0 1px 0 oklch(1 0 0 / 0.4)`,
                      }}
                    >
                      <Icon className="h-5 w-5 text-white" strokeWidth={2.4} />
                    </span>
                    <span className="font-display text-lg font-black tracking-tight text-foreground">
                      {row.name}
                    </span>
                  </div>

                  <div className="mt-4 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                    Unlocks
                  </div>
                  <ul className="mt-1.5 space-y-1 text-[13px] font-semibold text-foreground">
                    {row.unlocks.map((u) => (
                      <li key={u} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>

                  {row.locks.length > 0 && (
                    <>
                      <div className="mt-4 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        Stays locked
                      </div>
                      <ul className="mt-1.5 space-y-1 text-[13px] font-medium text-muted-foreground">
                        {row.locks.map((u) => (
                          <li key={u} className="flex items-start gap-2">
                            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>{u}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-muted/30 p-5 text-center text-[13px] font-medium text-muted-foreground" style={{ borderColor: "oklch(0.9 0.01 250)" }}>
          <p>
            <span className="font-bold text-foreground">No mid-plan switching.</span> Switching between
            Academic and General Training requires upgrading to{" "}
            <span className="font-bold text-foreground">All Access</span>.
          </p>
        </div>
      </section>

      <PickIeltsTypeAtCheckoutPopup
        open={!!cycle}
        onClose={() => setOpenCycle(null)}
        cycleLabel={cycle ? `${cycle.label} · $${cycle.price} CAD` : undefined}
      />
    </div>
  );
}
