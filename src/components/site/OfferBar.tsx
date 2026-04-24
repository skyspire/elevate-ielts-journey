// Top sticky offer bar — quiet, professional, dismissible.
// Admin-controlled via /admin/offer-bar. Hidden on /admin/* and auth routes
// (parent root component already gates rendering on hideChrome).

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useOfferBar } from "@/lib/admin/site-settings";

const DISMISS_KEY = "bigielts:offer-bar-dismissed-v";

export function OfferBar() {
  const bar = useOfferBar();
  // Default true to avoid SSR flash; flip to false on client if not dismissed.
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(DISMISS_KEY);
    setDismissed(stored === String(bar.version));
  }, [bar.version]);

  if (!bar.enabled || dismissed) return null;

  const handleDismiss = () => {
    if (bar.dismissible) {
      window.localStorage.setItem(DISMISS_KEY, String(bar.version));
    }
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Site offer"
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-foreground text-background"
    >
      <div className="container-page relative flex items-center justify-center gap-3 px-4 py-2 text-center text-[13px] font-medium sm:text-sm">
        <span className="flex-1 sm:flex-none">{bar.message}</span>
        {bar.ctaLabel && bar.ctaHref && (
          <a
            href={bar.ctaHref}
            className="hidden shrink-0 rounded-full bg-background px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-foreground transition-opacity hover:opacity-90 sm:inline-block"
          >
            {bar.ctaLabel}
          </a>
        )}
        {bar.dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-background/70 hover:bg-background/10 hover:text-background"
            aria-label="Dismiss offer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {bar.ctaLabel && bar.ctaHref && (
        <div className="flex justify-center pb-2 sm:hidden">
          <a
            href={bar.ctaHref}
            className="rounded-full bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground"
          >
            {bar.ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
