import type { ReactNode } from "react";

/**
 * Transparent passthrough panel. Previously rendered a dotted paper
 * background; now neutral so the page-level silk gradient shows through.
 * Kept as a component for layout-spacing compatibility with existing pages.
 */
export function DottedTintPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  topDivider?: boolean;
  bleedBottom?: number;
  tint?: string | null;
  className?: string;
}) {
  return <div className={`relative ${className}`}>{children}</div>;
}
