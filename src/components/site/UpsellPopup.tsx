import { Link } from "@tanstack/react-router";
import { usePopupActive } from "@/hooks/use-popup-active";
import { Sparkles, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCmsSection } from "@/lib/admin/cms-store";
import { PRICING_KEY, PRICING_DEFAULT } from "@/lib/admin/defaults";
import {
  CURRENCIES,
  type CurrencyCode,
  type PlanKey,
  detectCurrencyFromIP,
  formatPrice,
  getPlanPrice,
  getStoredCurrency,
} from "@/lib/currency";

type Props = {
  open: boolean;
  onClose: () => void;
  countdown: string;
};

/**
 * Upsell popup shown after a free user exhausts their 3 daily opens.
 * Uses the homepage pricing plans (CMS-driven). Bottom sheet on mobile, modal on desktop.
 */
export function UpsellPopup({ open, onClose, countdown }: Props) {
  const isMobile = useIsMobile();
  const { plans } = useCmsSection(PRICING_KEY, PRICING_DEFAULT);
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  useEffect(() => {
    const stored = getStoredCurrency();
    if (stored) {
      setCurrency(stored);
      return;
    }
    let cancelled = false;
    detectCurrencyFromIP().then((code) => {
      if (!cancelled) setCurrency(code);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const visiblePlans = plans
    .filter((p) => p.visible !== false)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upsell-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/55 backdrop-blur-md"
      />

      <div
        className={
          isMobile
            ? "relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-card p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300"
            : "relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-card p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200"
        }
        style={{ borderTop: "4px solid oklch(0.55 0.18 30)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "color-mix(in oklab, oklch(0.55 0.18 30) 14%, transparent)" }}
          >
            <Sparkles className="h-4 w-4" style={{ color: "oklch(0.55 0.18 30)" }} strokeWidth={2.5} />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: "oklch(0.55 0.18 30)" }}>
            Daily free limit reached
          </span>
        </div>

        <h2
          id="upsell-title"
          className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[28px]"
        >
          You've used today's 3 free opens.
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-[15px]">
          Go unlimited with a site-wide plan, or wait{" "}
          <span className="font-bold text-foreground">{countdown}</span> for your free quota to reset.
        </p>

        {/* Plans grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {visiblePlans.map((p) => {
            const planKey = p.key as PlanKey;
            const price = getPlanPrice(planKey, currency, p.priceOverrides);
            const original = getPlanPrice(planKey, currency, p.originalPriceOverrides);
            const hasOriginal =
              p.originalPriceOverrides && p.originalPriceOverrides[currency] && original > price;
            return (
              <div
                key={p.key}
                className={`relative flex flex-col rounded-2xl border p-4 ${
                  p.popular ? "border-transparent ring-2 ring-brand" : "border-border"
                }`}
              >
                {(p.badge || p.popular) && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brand-foreground">
                    {p.badge || "Most popular"}
                  </span>
                )}
                <span
                  className="font-display text-lg font-black tracking-tight"
                  style={{ color: p.accent }}
                >
                  {p.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {p.days} days access
                </span>
                {hasOriginal && (
                  <span className="mt-2 text-xs font-bold text-muted-foreground line-through">
                    {formatPrice(original, currency)}
                  </span>
                )}
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-black text-foreground">
                    {formatPrice(price, currency)}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {CURRENCIES[currency].symbol.trim()}
                  </span>
                </div>
                <Link
                  to="/"
                  hash="pricing"
                  onClick={onClose}
                  className={`mt-4 inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-bold transition-opacity hover:opacity-90 ${
                    p.popular
                      ? "bg-brand text-brand-foreground"
                      : "bg-foreground text-background"
                  }`}
                >
                  {p.ctaLabel || `Choose ${p.name}`}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Foot */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" /> Academic + General
          </span>
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" /> Cancel anytime
          </span>
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" /> Free quota resets in {countdown}
          </span>
        </div>
      </div>
    </div>
  );
}
