import { useEffect, useState } from "react";
import { Check, Gift, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useLearnerSession } from "@/lib/learner-auth";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CURRENCIES,
  CURRENCY_GROUPS,
  type CurrencyCode,
  type PlanKey,
  detectCurrencyFromIP,
  formatPrice,
  getPlanPrice,
  getStoredCurrency,
  setStoredCurrency,
} from "@/lib/currency";
import { useCmsSection } from "@/lib/admin/cms-store";
import { PRICING_KEY, PRICING_DEFAULT } from "@/lib/admin/defaults";
import { PickIeltsTypeAtCheckoutPopup } from "@/components/site/PickIeltsTypeAtCheckoutPopup";


export function ValueStatement() {
  const { plans, features, footnote } = useCmsSection(PRICING_KEY, PRICING_DEFAULT);
  const { user } = useLearnerSession();
  const [currency, setCurrency] = useState<CurrencyCode>("CAD");
  const [autoDetected, setAutoDetected] = useState(false);
  const [openCycleLabel, setOpenCycleLabel] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredCurrency();
    if (stored) {
      setCurrency(stored);
      return;
    }
    let cancelled = false;
    detectCurrencyFromIP().then((code) => {
      if (cancelled) return;
      setCurrency(code);
      setAutoDetected(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (code: string) => {
    const next = code as CurrencyCode;
    setCurrency(next);
    setStoredCurrency(next);
    setAutoDetected(false);
  };

  return (
    <>
    <section id="pricing" className="scroll-mt-24 bg-white pt-14 pb-8 sm:pt-20 sm:pb-12">
      <div className="container-page">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="text-[oklch(0.55_0.18_30)]">One</span>{" "}
            <span className="text-foreground">Subscription.</span>
            <br />
            <span className="text-[oklch(0.45_0.18_265)]">Unlimited</span>{" "}
            <span className="text-foreground">Access.</span>
          </h2>

          {/* Tagline — editorial line with handwritten accent */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="font-display text-base font-black uppercase tracking-[0.08em] text-foreground sm:text-xl">
              <span className="text-[oklch(0.55_0.18_30)]">Academic</span>
              <span className="mx-2 text-foreground/25">/</span>
              <span className="text-[oklch(0.45_0.18_265)]">General</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-foreground/20" />
              <span className="font-handwriting text-base text-foreground/70 sm:text-lg">
                one plan unlocks both
              </span>
              <span className="h-px w-10 bg-foreground/20" />
            </div>
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-foreground/60 sm:text-base">
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

        {/* === CURRENCY SWITCHER === */}
        <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2">
          <label
            htmlFor="currency-select"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Show prices in
          </label>
          <Select value={currency} onValueChange={handleChange}>
            <SelectTrigger
              id="currency-select"
              className="h-11 w-56 rounded-full border-2 border-foreground/15 bg-card px-4 text-sm font-bold shadow-soft focus:ring-2 focus:ring-brand"
            >
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">
                    {CURRENCIES[currency].flag}
                  </span>
                  <span>{CURRENCIES[currency].label}</span>
                  <span className="text-muted-foreground">
                    ({CURRENCIES[currency].symbol.trim()})
                  </span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {CURRENCY_GROUPS.map((group, gi) => (
                <SelectGroup key={group.label}>
                  {gi > 0 && <SelectSeparator />}
                  <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </SelectLabel>
                  {group.codes.map((code) => {
                    const c = CURRENCIES[code];
                    return (
                      <SelectItem
                        key={`${group.label}-${code}`}
                        value={code}
                        className="pr-2 [&>span:first-child]:hidden"
                      >
                        <span className="flex items-center gap-2 font-semibold">
                          <span className="text-base leading-none">{c.flag}</span>
                          <span>{c.label}</span>
                          <span className="text-muted-foreground">
                            ({c.symbol.trim()})
                          </span>
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          {autoDetected && (
            <p className="text-[11px] font-medium text-muted-foreground">
              Auto-detected from your location · change anytime
            </p>
          )}
        </div>

        {/* === FREE LANDSCAPE CARD (Royal Indigo) === */}
        <div
          className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl p-6 text-white shadow-[0_22px_50px_-18px_rgba(79,70,229,0.55)] sm:p-8"
          style={{
            background:
              "linear-gradient(135deg, #4f46e5 0%, #6366f1 55%, #1e1b4b 100%)",
          }}
        >
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
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
                <Gift className="h-6 w-6 text-white" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] ring-1 ring-white/25">
                  <Sparkles className="h-3 w-3" /> Free forever
                </div>
                <h3 className="font-display mt-3 text-2xl font-black leading-[1.1] tracking-tight sm:text-3xl">
                  Start free — fresh content every week
                </h3>
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

        {/* === PRICING === */}

        <div className="mx-auto mt-6 grid max-w-5xl gap-4 sm:mt-8 sm:grid-cols-3">
          {plans
            .filter((p) => p.visible !== false)
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((p) => {
              const planKey = p.key as PlanKey;
              const price = getPlanPrice(planKey, currency, p.priceOverrides);
              const original = getPlanPrice(planKey, currency, p.originalPriceOverrides);
              const hasOriginal =
                p.originalPriceOverrides && p.originalPriceOverrides[currency] && original > price;
              return (
            <div
              key={p.name}
              className={`relative flex flex-col items-center rounded-3xl border p-6 text-center transition-all hover:-translate-y-1 ${
                p.popular
                  ? "border-transparent bg-card shadow-card ring-2 ring-brand sm:scale-105"
                  : "border-border bg-card shadow-soft hover:shadow-card"
              }`}
            >
              {(p.badge || p.popular) && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-foreground shadow-soft">
                  {p.badge || "Most popular"}
                </span>
              )}
              <div className="flex flex-col items-center gap-1">
                <span
                  className="font-display text-2xl font-black tracking-tight sm:text-[28px]"
                  style={{ color: p.accent }}
                >
                  {p.name}
                </span>
                {p.tagline && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {p.tagline}
                  </span>
                )}
                <span
                  className="h-[3px] w-10 rounded-full"
                  style={{
                    background: `color-mix(in oklab, ${p.accent} 60%, transparent)`,
                  }}
                />
              </div>
              {hasOriginal && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-base font-bold text-muted-foreground line-through">
                    {formatPrice(original, currency)}
                  </span>
                  {p.discountPercent ? (
                    <span className="rounded-full bg-[oklch(0.55_0.18_30)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      −{p.discountPercent}%
                    </span>
                  ) : null}
                </div>
              )}
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-black tracking-tight text-foreground sm:text-6xl">
                  {formatPrice(price, currency)}
                </span>
                <span className="text-sm font-bold text-muted-foreground">
                  {currency}
                </span>
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
              {p.description && (
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {p.description}
                </p>
              )}
              <Button
                type="button"
                onClick={() => setOpenCycleLabel(`${p.name} · ${formatPrice(price, currency)} ${currency}`)}
                className={`mt-6 h-11 w-full rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                  p.popular
                    ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 hover:shadow-[0_0_30px_oklch(0.7_0.18_30/0.6),0_0_60px_oklch(0.7_0.18_30/0.35)]"
                    : "bg-[oklch(0.55_0.01_270)] text-white hover:bg-[oklch(0.48_0.01_270)] hover:shadow-[0_0_24px_oklch(0.55_0.01_270/0.55),0_0_48px_oklch(0.55_0.01_270/0.3)]"
                }`}
              >
                {p.ctaLabel || `Choose ${p.name}`}
              </Button>
            </div>
              );
            })}
        </div>

        {/* === FEATURES — clean & professional === */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="flex flex-col items-center">
            <h3 className="font-display text-2xl font-black uppercase tracking-[0.04em] text-[oklch(0.32_0.01_270)] sm:text-4xl">
              All plans include
            </h3>
            <span className="mt-3 h-px w-16 bg-[oklch(0.32_0.01_270)]/30" />
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
          {footnote}
        </p>
      </div>
    </section>
    <PickIeltsTypeAtCheckoutPopup
      open={!!openCycleLabel}
      onClose={() => setOpenCycleLabel(null)}
      cycleLabel={openCycleLabel ?? undefined}
    />
    </>
  );
}
