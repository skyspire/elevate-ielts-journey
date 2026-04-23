// Site-wide announcement banner. Reads from CMS; respects a per-version
// dismiss flag so re-published banners reappear.

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAnnouncementBanner } from "@/lib/admin/site-settings";

const DISMISS_KEY = "bigielts:banner-dismissed-v";

export function AnnouncementBanner() {
  const banner = useAnnouncementBanner();
  const [dismissed, setDismissed] = useState(true); // default true to avoid SSR flash

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(DISMISS_KEY);
    setDismissed(stored === String(banner.version));
  }, [banner.version]);

  if (!banner.enabled || dismissed) return null;

  const tones: Record<string, string> = {
    neutral: "bg-foreground text-background",
    brand: "bg-primary text-primary-foreground",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-amber-950",
  };

  return (
    <div className={`relative z-30 flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium ${tones[banner.tone] ?? tones.neutral}`}>
      <span>{banner.message}</span>
      {banner.ctaLabel && banner.ctaHref && (
        <a href={banner.ctaHref} className="rounded-full border border-current/40 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider hover:bg-black/10">
          {banner.ctaLabel}
        </a>
      )}
      <button
        type="button"
        onClick={() => {
          window.localStorage.setItem(DISMISS_KEY, String(banner.version));
          setDismissed(true);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-black/10"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
