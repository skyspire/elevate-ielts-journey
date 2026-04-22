import { Check, Infinity as InfinityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { WashiTape } from "./PaperAccents";

const plans = [
  {
    name: "Weekly",
    price: "7",
    period: "15 days",
    days: "15",
    popular: false,
    accent: "oklch(0.55 0.18 30)", // coral
  },
  {
    name: "Monthly",
    price: "12",
    period: "30 days",
    days: "30",
    popular: true,
    accent: "oklch(0.45 0.18 265)", // indigo
  },
  {
    name: "3-Month",
    price: "29",
    period: "90 days",
    days: "90",
    popular: false,
    accent: "oklch(0.55 0.14 160)", // teal/green
  },
];

const features = [
  "Full IELTS Academic question bank",
  "Full IELTS General question bank",
  "Band 8–9 Writing sample answers",
  "Band 8–9 Speaking model answers",
  "Vocabulary & structure notes",
  "Recent exam questions (updated monthly)",
  "Topic-wise organized practice",
  "Mobile & desktop access",
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
          description="Every plan unlocks the entire library — Academic and General. The only difference is how long your access lasts."
        />

        {/* Tagline */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-foreground/20" />
            <span className="font-handwriting text-xl text-foreground/70">
              same features, different durations
            </span>
            <span className="h-px w-12 bg-foreground/20" />
          </div>
        </div>

        {/* ===== Desktop / Tablet: Comparison Table ===== */}
        <div className="mx-auto mt-14 hidden max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-card md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="w-[40%] p-6 text-left">
                  <span className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                    What's included
                  </span>
                </th>
                {plans.map((p) => (
                  <th
                    key={p.name}
                    className={`relative p-6 text-center ${
                      p.popular ? "bg-brand-soft/40" : ""
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-foreground shadow-soft">
                        Most popular
                      </span>
                    )}
                    <div
                      className="font-display text-base font-extrabold uppercase tracking-wide"
                      style={{ color: p.accent }}
                    >
                      {p.name}
                    </div>
                    <div className="mt-3 flex items-baseline justify-center gap-1">
                      <span className="font-display text-4xl font-black tracking-tight text-foreground">
                        ${p.price}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">CAD</span>
                    </div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground">
                      {p.period} of access
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={f}
                  className={`border-b border-border/60 last:border-0 ${
                    i % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                  }`}
                >
                  <td className="p-4 pl-6 text-sm font-semibold text-foreground">{f}</td>
                  {plans.map((p) => (
                    <td
                      key={p.name}
                      className={`p-4 text-center ${p.popular ? "bg-brand-soft/30" : ""}`}
                    >
                      <span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `color-mix(in oklab, ${p.accent} 15%, transparent)`,
                          color: p.accent,
                        }}
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
              {/* Duration row */}
              <tr className="border-t-2 border-border bg-muted/30">
                <td className="p-4 pl-6 text-sm font-bold text-foreground">Access duration</td>
                {plans.map((p) => (
                  <td
                    key={p.name}
                    className={`p-4 text-center ${p.popular ? "bg-brand-soft/40" : ""}`}
                  >
                    <span
                      className="font-display text-lg font-black"
                      style={{ color: p.accent }}
                    >
                      {p.days} days
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="p-6"></td>
                {plans.map((p) => (
                  <td
                    key={p.name}
                    className={`p-6 text-center ${p.popular ? "bg-brand-soft/40" : ""}`}
                  >
                    <Button
                      className={`h-10 w-full rounded-full font-bold ${
                        p.popular
                          ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      Choose {p.name}
                    </Button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ===== Mobile: Stacked cards with shared features list ===== */}
        <div className="mt-14 md:hidden">
          {/* Plan price cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`relative flex flex-col items-center rounded-2xl border p-5 text-center ${
                  p.popular
                    ? "border-transparent bg-card shadow-card ring-2 ring-brand"
                    : "border-border bg-card shadow-soft"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-foreground shadow-soft">
                    Most popular
                  </span>
                )}
                <div
                  className="font-display text-sm font-extrabold uppercase tracking-wide"
                  style={{ color: p.accent }}
                >
                  {p.name}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black tracking-tight">
                    ${p.price}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">CAD</span>
                </div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">
                  {p.period}
                </div>
                <Button
                  className={`mt-4 h-9 w-full rounded-full text-xs font-bold ${
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

          {/* Shared features */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <InfinityIcon className="h-4 w-4 text-brand" />
              <span className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                Every plan includes
              </span>
            </div>
            <ul className="space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm font-semibold">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-8 text-center text-xs font-semibold text-muted-foreground">
          E-books are sold separately. Cancel anytime — no auto-renewal surprises.
        </p>
      </div>
    </section>
  );
}
