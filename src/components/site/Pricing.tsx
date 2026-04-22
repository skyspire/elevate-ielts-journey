import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { WashiTape } from "./PaperAccents";

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

export function Pricing() {
  return (
    <section className="relative bg-paper-white py-20 sm:py-28">
      <WashiTape position="top-left" color="peach" />
      <WashiTape position="top-right" color="mint" />
      <div className="container-page">
        <SectionHeader
          eyebrow="Pricing"
          title="One plan. Full access. You pick the duration."
          description="Every plan unlocks everything — Academic and General. Only the duration changes."
        />

        {/* === PRICING — the star === */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
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

        {/* === FEATURES — quiet, supporting === */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-[60px] bg-foreground/15" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand" />
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.2em]">
                All plans include
              </span>
            </div>
            <span className="h-px flex-1 max-w-[60px] bg-foreground/15" />
          </div>

          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
            {features.map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80"
              >
                <Check className="h-3.5 w-3.5 text-brand" strokeWidth={3} />
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
