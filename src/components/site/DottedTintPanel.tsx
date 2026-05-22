import type { ReactNode } from "react";

/**
 * Full-bleed dotted cream paper background panel.
 * - bg-paper-dots canvas runs edge-to-edge under the content
 * - extends a configurable distance below the content so it bridges
 *   seamlessly into the footer with no visible gap
 * - hairline top divider separates it from the cream area above
 */
export function DottedTintPanel({
  children,
  topDivider = true,
  /** Extra pixels the background bleeds below the content. Set high enough
   *  to bridge into the footer with no gap. */
  bleedBottom = 600,
  className = "",
}: {
  children: ReactNode;
  topDivider?: boolean;
  bleedBottom?: number;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Full-bleed dotted background — bleeds below content to meet the footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 w-screen -translate-x-1/2 bg-paper-dots"
        style={{ height: `calc(100% + ${bleedBottom}px)` }}
      />
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
