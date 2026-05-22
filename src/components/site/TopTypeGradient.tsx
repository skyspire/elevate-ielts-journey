/**
 * Full-page silk gradient — a single smooth top-to-bottom vertical gradient
 * that runs the entire page height. Saturated at the top in the IELTS-type
 * accent, fading to warm cream at the bottom. No patterns, no blobs.
 *
 * Rendered as a fixed layer so it covers the whole viewport regardless of
 * scroll, giving every page a single continuous premium wash.
 */
export function TopTypeGradient({
  variant,
}: {
  variant: "academic" | "general";
}) {
  const top =
    variant === "academic"
      ? "oklch(0.90 0.08 250)" // deep sky blue
      : "oklch(0.62 0.11 22)"; // rosewood maroon
  const bottom = "oklch(0.98 0.005 95)"; // warm off-white

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-700 ease-out"
      style={{
        background: `linear-gradient(to bottom, ${top} 0%, ${bottom} 100%)`,
      }}
    />
  );
}
