/**
 * Soft vertical gradient wash that sits at the top of a page to reflect the
 * IELTS type (academic = blue, general = green). Fades from a pale tint at
 * the top down to the page cream so it blends seamlessly into whatever is
 * below (including the cream paper-dots panel).
 */
export function TopTypeGradient({
  variant,
  /** Height of the gradient band in viewport pixels. Should cover the hero. */
  height = 720,
}: {
  variant: "academic" | "general";
  height?: number;
}) {
  const top =
    variant === "academic"
      ? "oklch(0.94 0.06 255)" // pale sky blue
      : "oklch(0.94 0.06 165)"; // pale sage/mint green
  const bottom = "oklch(0.985 0.005 95)"; // page cream

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-0 w-screen -translate-x-1/2"
      style={{
        height,
        background: `linear-gradient(to bottom, ${top} 0%, ${bottom} 100%)`,
      }}
    />
  );
}
