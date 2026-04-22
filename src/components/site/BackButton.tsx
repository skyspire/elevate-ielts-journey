import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  /** Aria label for screen readers — e.g. "Back to Dashboard" */
  ariaLabel: string;
  /** Optional positioning override. Defaults to top-right floating. */
  className?: string;
} & LinkProps;

/**
 * Site-wide circular back button.
 *
 * Renders a small circular button containing only an arrow icon —
 * never a text label. Floats at the top-right of the page by default.
 */
export function BackButton({ ariaLabel, className, ...linkProps }: BackButtonProps) {
  return (
    <Link
      {...(linkProps as LinkProps)}
      aria-label={ariaLabel}
      className={
        className ??
        "absolute right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-white/90 text-foreground/70 shadow-soft backdrop-blur-md transition-all hover:scale-105 hover:text-foreground hover:shadow-card sm:right-6 sm:top-6 sm:h-11 sm:w-11"
      }
    >
      <ArrowLeft className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.4} />
    </Link>
  );
}
