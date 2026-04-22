import { Check } from "lucide-react";
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
  "Full IELTS Academic question bank",
  "Full IELTS General question bank",
  "Band 8–9 Writing sample answers",
  "Band 8–9 Speaking model answers",
  "Vocabulary & structure notes",
  "Recent exam questions (updated monthly)",
];

export function Pricing() {
  return (
    <section className="relative bg-paper-white py-20 sm:py-24">
      <WashiTape position="top-left" color="peach" />
      <WashiTape position="top-right" color="mint" />
      <div className="container-page">
        <SectionHeader
          eyebrow="Pricing"
          title="One plan. Full access. You pick the duration."
          description="Every plan unlocks everything — Academic and General. Only the duration changes."
        />

        <div className="mx-auto mt-10 max-w-4xl">
          {/* Unified card */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            {/* Shared features — top band */}
            <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
              <div className="mb-3 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-foreground/20" />
                <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                  Every plan includes
                </span>
                <span className="h-px w-8 bg-foreground/20" />
              </div>
              <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-[13px] font-semibold text-foreground"
                  >
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"
                      strokeWidth={3}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plan chips */}
            <div className="grid gap-px bg-border sm:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={`relative flex flex-col items-center bg-card p-5 text-center transition-colors ${
                    p.popular ? "bg-brand-soft/30" : ""
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brand-foreground shadow-soft">
                      Most popular
                    </span>
                  )}
                  <div
                    className="font-display text-xs font-extrabold uppercase tracking-[0.15em]"
                    style={{ color: p.accent }}
                  >
                    {p.name}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-black tracking-tight text-foreground">
                      ${p.price}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      CAD
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
                    {p.days} days access
                  </div>
                  <Button
                    size="sm"
                    className={`mt-3 h-8 rounded-full px-4 text-xs font-bold ${
                      p.popular
                        ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    Choose
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Footnote */}
          <p className="mt-5 text-center text-[11px] font-semibold text-muted-foreground">
            E-books sold separately • Cancel anytime • No auto-renewal
          </p>
        </div>
      </div>
    </section>
  );
}
