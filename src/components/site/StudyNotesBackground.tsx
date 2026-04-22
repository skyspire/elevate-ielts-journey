/**
 * IvoryWhisperBackground (exported as StudyNotesBackground for compatibility)
 *
 * Pure ivory-white base with extremely soft, large pastel halos breathing
 * gently in the corners. Inspired by Apple product page backgrounds —
 * elegant, premium, never loud. The halos are heavily blurred and very
 * low-opacity so the colorful card grid remains the hero of the page.
 *
 * The palette shifts subtly with the active IELTS module:
 *   - "academic" → cool ivory base with sage / sky / lilac halos (scholarly)
 *   - "general"  → warm cream base with peach / butter / blush halos (friendly)
 */

type Module = "academic" | "general";

type Halo = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  color: string;
  delay: number;
  duration?: number;
};

const palettes: Record<Module, { base: string; halos: Halo[]; vignette: string }> = {
  academic: {
    base: "oklch(0.992 0.005 220)", // barely-cool ivory
    vignette:
      "radial-gradient(ellipse 80% 60% at 50% 45%, oklch(1 0 0 / 0.35) 0%, transparent 70%)",
    halos: [
      { top: "-10%", left: "-8%",  size: "640px", color: "oklch(0.93 0.06 235 / 0.55)", delay: 0,   duration: 14 },
      { top: "-12%", right: "-10%", size: "720px", color: "oklch(0.93 0.07 165 / 0.50)", delay: 3,   duration: 16 },
      { bottom: "-14%", left: "-10%", size: "700px", color: "oklch(0.91 0.07 305 / 0.50)", delay: 6,   duration: 18 },
      { bottom: "-10%", right: "-8%", size: "660px", color: "oklch(0.93 0.06 220 / 0.55)", delay: 2,   duration: 15 },
      { top: "38%",  left: "-14%", size: "440px", color: "oklch(0.94 0.04 200 / 0.40)", delay: 4.5, duration: 17 },
      { top: "44%",  right: "-12%", size: "420px", color: "oklch(0.95 0.05 270 / 0.40)", delay: 1.5, duration: 19 },
    ],
  },
  general: {
    base: "oklch(0.992 0.008 70)", // barely-warm cream
    vignette:
      "radial-gradient(ellipse 80% 60% at 50% 45%, oklch(1 0 0 / 0.40) 0%, transparent 70%)",
    halos: [
      { top: "-10%", left: "-8%",  size: "640px", color: "oklch(0.92 0.07 55 / 0.55)",  delay: 0,   duration: 14 },
      { top: "-12%", right: "-10%", size: "720px", color: "oklch(0.95 0.08 95 / 0.50)",  delay: 3,   duration: 16 },
      { bottom: "-14%", left: "-10%", size: "700px", color: "oklch(0.94 0.06 25 / 0.50)",  delay: 6,   duration: 18 },
      { bottom: "-10%", right: "-8%", size: "660px", color: "oklch(0.93 0.08 65 / 0.55)",  delay: 2,   duration: 15 },
      { top: "38%",  left: "-14%", size: "440px", color: "oklch(0.94 0.05 20 / 0.40)",  delay: 4.5, duration: 17 },
      { top: "44%",  right: "-12%", size: "420px", color: "oklch(0.95 0.07 95 / 0.40)",  delay: 1.5, duration: 19 },
    ],
  },
};

export function StudyNotesBackground({ module = "academic" }: { module?: Module } = {}) {
  const palette = palettes[module];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Tinted ivory base — transitions softly between modules */}
      <div
        className="absolute inset-0 transition-colors duration-700 ease-out"
        style={{ backgroundColor: palette.base }}
      />

      {/* Soft pastel halos — breathing slowly in the corners */}
      {palette.halos.map((h, i) => (
        <span
          key={`halo-${module}-${i}`}
          className="ivory-halo absolute rounded-full transition-[background] duration-700 ease-out"
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
        style={{ background: palette.vignette }}
      />
    </div>
  );
}
