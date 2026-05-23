/**
 * DustParticles — ambient micro-dust layer rendered behind popup content.
 *
 * Spawns in a frame around the popup card: top strip, bottom strip, and
 * left/right gutters. Never behind the card itself. Tiny sizes (1–3px with
 * occasional 5px accents) at very low opacity (~15–35%) for a barely-there
 * shimmer. Particles drift slowly away from the card edges.
 */
export function DustParticles({
  visible = true,
  count = 40,
}: {
  visible?: boolean;
  count?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 600ms ease", zIndex: 1 }}
    >
      <style>{`
        @keyframes dustParticleFloat {
          0%   { transform: translate3d(0, 0, 0); opacity: 0; }
          18%  { opacity: var(--dust-op, 0.25); }
          85%  { opacity: var(--dust-op, 0.25); }
          100% { transform: translate3d(var(--dust-dx, 0px), var(--dust-dy, -40vh), 0); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const seed = (n: number) => (Math.sin(i * 12.9898 + n) + 1) / 2;
        // Micro mix: mostly 1–3px, occasional 5px accent
        const isAccent = seed(0) > 0.85;
        const size = isAccent ? 4 + seed(1) * 1.5 : 1 + seed(1) * 2;
        // Zone: 0=top, 1=bottom, 2=left gutter, 3=right gutter
        const zone = i % 4;
        let top = 0;
        let left = 0;
        let dx = 0;
        let dy = 0;
        if (zone === 0) {
          // Top margin strip
          top = seed(2) * 11;
          left = seed(3) * 100;
          dx = (seed(4) - 0.5) * 60;
          dy = -25 - seed(5) * 20;
        } else if (zone === 1) {
          // Bottom margin strip — drift downward and out
          top = 89 + seed(2) * 11;
          left = seed(3) * 100;
          dx = (seed(4) - 0.5) * 60;
          dy = 25 + seed(5) * 25;
        } else if (zone === 2) {
          // Left gutter
          top = 12 + seed(2) * 76;
          left = seed(3) * 11;
          dx = -(seed(4) * 50 + 15);
          dy = -(seed(5) * 30 + 10);
        } else {
          // Right gutter
          top = 12 + seed(2) * 76;
          left = 89 + seed(3) * 11;
          dx = seed(4) * 50 + 15;
          dy = -(seed(5) * 30 + 10);
        }
        const dur = 22 + seed(6) * 26; // 22–48s slow drift
        const delay = -seed(7) * dur;
        // Very faint: 0.15–0.35
        const opacity = 0.15 + seed(8) * 0.2;
        const blur = isAccent ? 0.8 : 0.2;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: `${top}vh`,
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 4px rgba(255,255,255,0.4)",
              filter: `blur(${blur}px)`,
              ["--dust-op" as never]: String(opacity),
              ["--dust-dx" as never]: `${dx}px`,
              ["--dust-dy" as never]: `${dy}vh`,
              animation: `dustParticleFloat ${dur}s linear ${delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}
