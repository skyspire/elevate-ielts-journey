import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Briefcase, Crown, Check, Sparkles } from "lucide-react";
import { useLearnerSession } from "@/lib/learner-auth";
import { setUserPlanType, useIeltsType, type IeltsPlanType } from "@/lib/ielts-type";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BigIELTS.com" },
      {
        name: "description",
        content:
          "Choose Academic, General Training, or All Access. Bi-weekly, monthly, and 3-month plans in CAD.",
      },
      { property: "og:title", content: "BigIELTS Pricing — Academic, General, or All Access" },
      {
        property: "og:description",
        content: "Three plans, three billing cycles. Pay only for the IELTS type you're preparing for.",
      },
    ],
  }),
  component: PricingPage,
});

type Cycle = "biweekly" | "monthly" | "quarterly";

const CYCLES: Record<Cycle, { label: string; sub: string; price: number; days: number }> = {
  biweekly: { label: "Bi-weekly", sub: "15 days access", price: 9, days: 15 },
  monthly: { label: "Monthly", sub: "30 days access", price: 14, days: 30 },
  quarterly: { label: "3 months", sub: "90 days access — best value", price: 29, days: 90 },
};

const TYPE_MULTIPLIER: Record<IeltsPlanType, number> = {
  academic: 1,
  general: 1,
  both: 1.5,
};

const PLAN_CARDS: {
  key: IeltsPlanType;
  name: string;
  tag: string;
  icon: typeof GraduationCap;
  accent: string;
  popular?: boolean;
  features: string[];
}[] = [
  {
    key: "academic",
    name: "Academic",
    tag: "For university & professional registration",
    icon: GraduationCap,
    accent: "oklch(0.55 0.2 255)",
    features: [
      "Writing Task 1 (charts & graphs)",
      "Academic reading passages",
      "Academic recent exams & predictions",
      "Academic sample answers & ebooks",
      "Shared Speaking, Listening & Vocabulary",
    ],
  },
  {
    key: "general",
    name: "General Training",
    tag: "For migration, work & secondary ed",
    icon: Briefcase,
    accent: "oklch(0.6 0.18 30)",
    features: [
      "Writing Task 1 (letters)",
      "Everyday & workplace reading",
      "General Training recent exams & predictions",
      "General Training sample answers & ebooks",
      "Shared Speaking, Listening & Vocabulary",
    ],
  },
  {
    key: "both",
    name: "All Access",
    tag: "Academic + General Training together",
    icon: Crown,
    accent: "oklch(0.65 0.18 60)",
    popular: true,
    features: [
      "Everything in Academic",
      "Everything in General Training",
      "Switch types anytime",
      "Best for tutors & undecided learners",
      "Save vs. buying both separately",
    ],
  },
];

function PricingPage() {
  const { user } = useLearnerSession();
  const { planType } = useIeltsType();
  const [cycle, setCycle] = useState<Cycle>("monthly");

  const handleChoose = (plan: IeltsPlanType) => {
    if (!user) {
      toast.error("Please sign up or log in first to subscribe.");
      return;
    }
    setUserPlanType(user.id, plan);
    toast.success(
      plan === "both"
        ? "All Access activated — both IELTS types unlocked."
        : `${plan === "academic" ? "Academic" : "General Training"} plan activated.`,
    );
  };

  return (
    <div className="bg-background">
      <section className="container-page py-12 sm:py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
            <Sparkles className="h-3.5 w-3.5" /> Simple, fair pricing
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Pay only for the IELTS you're taking.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg">
            Academic and General Training are sold separately. Need both? Choose{" "}
            <span className="font-bold text-foreground">All Access</span>. All prices in CAD.
          </p>

          {/* Cycle toggle */}
          <div
            className="mx-auto mt-7 inline-flex items-center rounded-full border bg-card p-1"
            style={{ borderColor: "oklch(0.9 0.01 250)" }}
            role="group"
          >
            {(Object.keys(CYCLES) as Cycle[]).map((c) => {
              const active = cycle === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  className="rounded-full px-4 py-1.5 text-[13px] font-bold transition-all sm:px-5 sm:py-2"
                  style={{
                    background: active
                      ? "linear-gradient(140deg, oklch(0.25 0.01 250), oklch(0.15 0.01 250))"
                      : "transparent",
                    color: active ? "white" : "oklch(0.4 0.01 250)",
                    boxShadow: active ? "0 6px 14px -6px oklch(0.25 0.01 250 / 0.5)" : "none",
                  }}
                >
                  {CYCLES[c].label}
                  {c === "quarterly" && (
                    <span className="ml-1.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700">
                      Save
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plan cards */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLAN_CARDS.map((card) => {
            const Icon = card.icon;
            const base = CYCLES[cycle].price;
            const price = Math.round(base * TYPE_MULTIPLIER[card.key]);
            const isCurrent = planType === card.key;
            return (
              <div
                key={card.key}
                className="relative flex flex-col rounded-3xl bg-card p-6 shadow-sm transition-all sm:p-7"
                style={{
                  border: card.popular ? "2px solid transparent" : "1px solid oklch(0.9 0.01 250)",
                  boxShadow: card.popular
                    ? `0 22px 50px -18px ${card.accent}55, 0 0 0 2px ${card.accent}`
                    : undefined,
                  transform: card.popular ? "translateY(-4px)" : "none",
                }}
              >
                {card.popular && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white"
                    style={{
                      background:
                        "linear-gradient(140deg, oklch(0.7 0.18 75), oklch(0.55 0.18 50))",
                      boxShadow: "0 8px 18px -6px oklch(0.65 0.18 60 / 0.6)",
                    }}
                  >
                    Best value
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: `linear-gradient(140deg, ${card.accent}, color-mix(in oklab, ${card.accent} 65%, black))`,
                      boxShadow: `0 10px 20px -8px ${card.accent}80, inset 0 1px 0 oklch(1 0 0 / 0.4)`,
                    }}
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={2.4} />
                  </span>
                  <div>
                    <div className="font-display text-xl font-black tracking-tight text-foreground">
                      {card.name}
                    </div>
                    <div className="text-[12px] font-semibold text-muted-foreground">{card.tag}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black tracking-tight text-foreground">
                    ${price}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">CAD</span>
                </div>
                <div className="text-[12px] font-semibold text-muted-foreground">
                  {CYCLES[cycle].sub}
                </div>

                <ul className="mt-5 space-y-2 text-[13px] font-semibold text-foreground">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: card.accent }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-11 w-full items-center justify-center rounded-full border-2 border-dashed px-5 text-sm font-bold text-muted-foreground"
                      style={{ borderColor: "oklch(0.85 0.01 250)" }}
                    >
                      Your current plan
                    </button>
                  ) : user ? (
                    <button
                      type="button"
                      onClick={() => handleChoose(card.key)}
                      className="inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{
                        background: card.popular
                          ? "linear-gradient(140deg, oklch(0.7 0.18 75), oklch(0.55 0.18 50))"
                          : `linear-gradient(140deg, ${card.accent}, color-mix(in oklab, ${card.accent} 70%, black))`,
                        boxShadow: card.popular
                          ? "0 10px 20px -8px oklch(0.65 0.18 60 / 0.55)"
                          : `0 10px 20px -8px ${card.accent}80`,
                      }}
                    >
                      Choose {card.name}
                    </button>
                  ) : (
                    <Link
                      to="/signup"
                      className="inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      style={{
                        background: card.popular
                          ? "linear-gradient(140deg, oklch(0.7 0.18 75), oklch(0.55 0.18 50))"
                          : `linear-gradient(140deg, ${card.accent}, color-mix(in oklab, ${card.accent} 70%, black))`,
                        boxShadow: card.popular
                          ? "0 10px 20px -8px oklch(0.65 0.18 60 / 0.55)"
                          : `0 10px 20px -8px ${card.accent}80`,
                      }}
                    >
                      Sign up to choose
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Foot notes */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border bg-muted/30 p-5 text-center text-[13px] font-medium text-muted-foreground" style={{ borderColor: "oklch(0.9 0.01 250)" }}>
          <p>
            <span className="font-bold text-foreground">No mid-plan switching.</span> Academic and
            General Training are separate subscriptions. If you need both, choose{" "}
            <span className="font-bold text-foreground">All Access</span>.
          </p>
          <p className="mt-2">
            Cancel anytime. Your free daily quota (3 opens) still works without a plan.
          </p>
        </div>
      </section>
    </div>
  );
}
