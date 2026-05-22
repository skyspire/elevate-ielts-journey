import type { ReactNode } from "react";

/**
 * Full-bleed dotted paper background with an active color wash on top.
 * Mirrors the Recent Exam Questions "Browse by month" panel design:
 * - bg-paper-dots canvas runs edge-to-edge under the content
 * - a soft tint wash (mix-blend-multiply) recolors as the active accent changes
 * - a hairline top divider separates it from the cream area above
 *
 * Use to wrap a category-pills + question-cards region so the whole panel
 * breathes the active selection's color.
 */
export function DottedTintPanel({
  children,
  tint,
  topDivider = true,
  className = "",
}: {
  children: ReactNode;
  /** Soft tint color (e.g. accent.soft). Pass null/undefined to render neutral dots. */
  tint?: string | null;
  topDivider?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Full-bleed dotted background */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 bg-paper-dots"
      />
      {/* Tinted wash that matches the active accent — blends with the dots */}
      {tint && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-full w-screen -translate-x-1/2 transition-colors duration-500"
          style={{
            background: tint,
            mixBlendMode: "multiply",
            opacity: 0.85,
          }}
        />
      )}
      {/* Hairline top divider */}
      {topDivider && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-foreground/10"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
