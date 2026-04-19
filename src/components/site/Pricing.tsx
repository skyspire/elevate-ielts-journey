import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { WashiTape } from "./PaperAccents";

const features = [
  "Full access to question bank",
  "Band 8–9 sample answers",
  "Vocabulary & structure notes",
  "New questions every month",
];

const plans = [
  {
    name: "Weekly",
    price: "7",
    period: "15-day access",
    popular: false,
  },
  {
    name: "Monthly",
    price: "12",
    period: "30-day access",
    popular: true,
  },
  {
    name: "3-Month",
    price: "29",
    period: "90-day access",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="relative bg-paper-white py-20 sm:py-28">
      <WashiTape position="top-left" color="peach" />
      <WashiTape position="top-right" color="mint" />
      <div className="container-page">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans, full access"
          description="Subscribe to unlock the entire question bank. E-books are sold separately."
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
          {plans.map((p) => {
            const popular = p.popular;
            return (
              <div
                key={p.name}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all ${
                  popular
                    ? "border-transparent bg-card shadow-card ring-2 ring-brand"
                    : "border-border bg-card shadow-soft hover:-translate-y-1 hover:shadow-card"
                }`}
              >
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-foreground shadow-soft">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-muted-foreground">
                  {p.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-extrabold tracking-tight">
                    {p.price}
                  </span>
                  <span className="text-base font-bold text-muted-foreground">CAD</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{p.period}</p>

                <ul className="mt-7 space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-semibold">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-soft text-brand">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-8 h-11 rounded-full font-bold ${
                    popular
                      ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  Choose {p.name}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
