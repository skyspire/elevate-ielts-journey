import { useEffect, useState } from "react";

export type StickyPill = {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
};

/**
 * Sticky frosted-glass bar that appears when the user scrolls past the
 * inline compass/pills section. Shows a compact compass + the pills so the
 * learner can switch task / format / category without scrolling back up.
 *
 * Universal across Sample Answers, Speaking Samples, Writing Samples.
 */
export function StickyTrackBar({
  leftLabel,
  rightLabel,
  needleDeg,
  onLeft,
  onRight,
  pills,
  accentColor,
  headerOffset = 68,
  showAfter = 260,
}: {
  leftLabel: string;
  rightLabel: string;
  needleDeg: number; // -90 (left) | 0 | 90 (right)
  onLeft: () => void;
  onRight: () => void;
  pills: StickyPill[];
  accentColor: string;
  headerOffset?: number;
  showAfter?: number;
}) {
  const [show, setShow] = useState(false);
  const [topOffset, setTopOffset] = useState(headerOffset);

  useEffect(() => {
    // Measure the bottom edge of the topmost sticky chrome (OfferBar + Header)
    // so the track bar sits flush under it even when the promo banner is shown.
    const measure = () => {
      let bottom = headerOffset;
      const header = document.querySelector("header");
      if (header) {
        const rect = header.getBoundingClientRect();
        // Only trust it when the header is actually pinned near the top.
        if (rect.top <= 4) bottom = Math.max(bottom, rect.bottom);
      }
      setTopOffset(bottom);
      setShow(window.scrollY > showAfter);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [showAfter, headerOffset]);

  const leftActive = needleDeg < 0;
  const rightActive = needleDeg > 0;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-40 transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
      style={{ top: topOffset }}
      aria-hidden={!show}
    >
      <div
        className={`pointer-events-auto border-b border-foreground/10 bg-white/75 backdrop-blur-xl ${
          show ? "shadow-[0_8px_24px_-12px_oklch(0_0_0_/_0.18)]" : ""
        }`}
      >
        <div className="container-page py-2.5 sm:py-3">
          {/* Compact compass row */}
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={onLeft}
              aria-pressed={leftActive}
              className={`font-display text-[13px] font-extrabold tracking-tight transition-opacity sm:text-[15px] ${
                leftActive ? "opacity-100" : "opacity-50 hover:opacity-80"
              }`}
              style={{ color: leftActive ? "oklch(0.20 0.02 250)" : undefined }}
            >
              {leftLabel}
            </button>

            <MiniCompass needleDeg={needleDeg} />

            <button
              type="button"
              onClick={onRight}
              aria-pressed={rightActive}
              className={`font-display text-[13px] font-extrabold tracking-tight transition-opacity sm:text-[15px] ${
                rightActive ? "opacity-100" : "opacity-50 hover:opacity-80"
              }`}
              style={{ color: rightActive ? "oklch(0.20 0.02 250)" : undefined }}
            >
              {rightLabel}
            </button>
          </div>

          {/* Pills row — horizontally scrollable on mobile, centered when fits */}
          {pills.length > 0 && (
            <div className="mt-2 -mx-3 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max min-w-full justify-center gap-1.5 sm:gap-2">
                {pills.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={p.onClick}
                    aria-pressed={p.active}
                    className="whitespace-nowrap rounded-full border px-3.5 py-1.5 font-display text-[12px] font-bold tracking-tight transition-all sm:text-[13px]"
                    style={{
                      backgroundColor: p.active ? accentColor : "white",
                      color: p.active ? "white" : "oklch(0.30 0 0)",
                      borderColor: p.active ? accentColor : "oklch(0.88 0 0)",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniCompass({ needleDeg }: { needleDeg: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-9 w-9 shrink-0 drop-shadow-[0_2px_4px_oklch(0.30_0.06_45_/_0.30)] sm:h-10 sm:w-10"
      aria-hidden
    >
      <defs>
        <radialGradient id="brassRimSticky" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="oklch(0.88 0.12 80)" />
          <stop offset="45%" stopColor="oklch(0.72 0.13 70)" />
          <stop offset="80%" stopColor="oklch(0.52 0.11 55)" />
          <stop offset="100%" stopColor="oklch(0.38 0.08 45)" />
        </radialGradient>
        <radialGradient id="compassFaceSticky" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="oklch(0.96 0.03 85)" />
          <stop offset="100%" stopColor="oklch(0.85 0.06 75)" />
        </radialGradient>
        <linearGradient id="needleNSticky" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.55 0.20 30)" />
          <stop offset="100%" stopColor="oklch(0.40 0.16 25)" />
        </linearGradient>
        <linearGradient id="needleSSticky" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.45 0.04 60)" />
          <stop offset="100%" stopColor="oklch(0.30 0.03 55)" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#brassRimSticky)" />
      <circle cx="50" cy="50" r="40" fill="url(#compassFaceSticky)" />
      <g
        style={{
          transformOrigin: "50px 50px",
          transform: `rotate(${needleDeg}deg)`,
          transition: "transform 600ms cubic-bezier(0.34, 1.3, 0.64, 1)",
        }}
      >
        <polygon points="50,14 46,50 54,50" fill="url(#needleNSticky)" />
        <polygon points="50,86 46,50 54,50" fill="url(#needleSSticky)" />
      </g>
      <circle cx="50" cy="50" r="3" fill="oklch(0.75 0.13 75)" stroke="oklch(0.38 0.08 45)" strokeWidth="0.6" />
    </svg>
  );
}
