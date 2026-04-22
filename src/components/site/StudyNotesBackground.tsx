/**
 * IvoryWhisperBackground (exported as StudyNotesBackground for compatibility)
 *
 * Pure ivory-white base with extremely soft, large pastel halos breathing
 * gently in the corners. Inspired by Apple product page backgrounds —
 * elegant, premium, never loud. The halos are heavily blurred and very
 * low-opacity so the colorful card grid remains the hero of the page.
 *
 * Layers (back → front):
 *   1. Ivory base color
 *   2. Four corner halos (peach, mint, lilac, sky) — slow, staggered breathing
 *   3. Faint center vignette of warm white to add depth
 *   4. A whisper-thin noise/grain overlay for premium texture
 *
 * Animations: `whisper-breathe` lives in src/styles.css and respects
 * prefers-reduced-motion.
 */

type Halo = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;        // px / rem
  color: string;       // oklch(...)
  delay: number;       // seconds
  duration?: number;   // seconds
};

const halos: Halo[] = [
  // top-left — soft peach
  { top: "-10%", left: "-8%",  size: "640px", color: "oklch(0.92 0.07 55 / 0.55)",  delay: 0,   duration: 14 },
  // top-right — soft mint
  { top: "-12%", right: "-10%", size: "720px", color: "oklch(0.93 0.07 165 / 0.50)", delay: 3,   duration: 16 },
  // bottom-left — soft lilac
  { bottom: "-14%", left: "-10%", size: "700px", color: "oklch(0.91 0.07 305 / 0.50)", delay: 6,   duration: 18 },
  // bottom-right — soft powder blue
  { bottom: "-10%", right: "-8%", size: "660px", color: "oklch(0.93 0.06 235 / 0.55)", delay: 2,   duration: 15 },
  // mid-left subtle blush
  { top: "38%",  left: "-14%", size: "440px", color: "oklch(0.94 0.05 20 / 0.40)",  delay: 4.5, duration: 17 },
  // mid-right subtle butter
  { top: "44%",  right: "-12%", size: "420px", color: "oklch(0.95 0.07 95 / 0.40)",  delay: 1.5, duration: 19 },
];

export function StudyNotesBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Ivory base — barely-warm white */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "oklch(0.992 0.005 85)" }}
      />

      {/* Soft pastel halos — breathing slowly in the corners */}
      {halos.map((h, i) => (
        <span
          key={`halo-${i}`}
          className="ivory-halo absolute rounded-full"
          style={{
            top: h.top,
            bottom: h.bottom,
            left: h.left,
            right: h.right,
            width: h.size,
            height: h.size,
            background: `radial-gradient(circle at center, ${h.color} 0%, transparent 65%)`,
            filter: "blur(40px)",
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration ?? 16}s`,
          }}
        />
      ))}

      {/* Center warm-white vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, oklch(1 0 0 / 0.35) 0%, transparent 70%)",
        }}
      />

    </div>
  );
}
