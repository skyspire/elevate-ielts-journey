import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — BigIELTS" },
      {
        name: "description",
        content:
          "Simple, honest pricing for Band 8+ IELTS prep. Start free, upgrade when you're ready.",
      },
      { property: "og:title", content: "BigIELTS Pricing" },
      {
        property: "og:description",
        content:
          "Free, Pro, and Lifetime plans with full access to recent exams, predictions, samples, and vocabulary.",
      },
    ],
  }),
  component: PricingPage,
});

const INK = "oklch(0.20 0.01 250)";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Get a feel for what's inside.",
    features: [
      "3 recent exam questions / month",
      "5 sample answers",
      "Limited vocabulary lists",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    blurb: "Everything you need to hit Band 8+.",
    features: [
      "Unlimited recent exam questions",
      "Weekly prediction updates",
      "All 600+ sample answers",
      "Full vocabulary library",
      "All e-books included",
    ],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "one-time",
    blurb: "Pay once. Use forever.",
    features: [
      "Everything in Pro",
      "Lifetime updates",
      "Priority support",
      "All future content",
    ],
    cta: "Get Lifetime",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Simple, honest pricing
          </h1>
          <p className="mt-6 text-lg font-semibold text-foreground/75">
            Start free. Upgrade when you're ready to take it seriously.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="relative flex flex-col rounded-2xl border bg-white p-7"
              style={{
                borderColor: p.highlight ? INK : "oklch(0.92 0.003 250)",
                boxShadow: p.highlight
                  ? "0 24px 48px -24px oklch(0.20 0.01 250 / 0.4)"
                  : "0 4px 12px -6px oklch(0.20 0.01 250 / 0.08)",
              }}
            >
              {p.highlight && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: INK }}
                >
                  Most popular
                </span>
              )}
              <div className="font-display text-2xl font-black">{p.name}</div>
              <p className="mt-1 text-sm font-semibold text-foreground/60">
                {p.blurb}
              </p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-5xl font-black">{p.price}</span>
                <span className="text-sm font-bold text-foreground/60">
                  {p.period}
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm font-semibold">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: INK }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                className="mt-7 inline-flex items-center justify-center rounded-md px-5 py-2.5 font-bold transition-colors"
                style={
                  p.highlight
                    ? { backgroundColor: INK, color: "white" }
                    : { backgroundColor: "oklch(0.97 0.003 250)", color: INK }
                }
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
