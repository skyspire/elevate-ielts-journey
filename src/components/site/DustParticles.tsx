/**
 * DustParticles — ambient rising dust layer rendered behind popup content.
 *
 * Mixed-size particles with depth-of-field blur on the larger ones for a
 * cinematic parallax feel. Emits sparsely from the bottom edge and drifts
 * upward with gentle horizontal sway.
 *
 * Usage: place inside a fullscreen popup container with `position: absolute`
 * or `fixed`, after the backdrop and BEFORE the content card so particles
 * appear behind the popup card but above the dimmed backdrop.
 */
export function DustParticles({
  visible = true,
  count = 25,
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
          0%   { transform: translate3d(0, 0vh, 0); opacity: 0; }
          14%  { opacity: var(--dust-op, 0.6); }
          88%  { opacity: var(--dust-op, 0.6); }
          100% { transform: translate3d(var(--dust-dx, 0px), -120vh, 0); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const seed = (n: number) => (Math.sin(i * 12.9898 + n) + 1) / 2;
        // Mixed sizes: 2px tiny → 14px large foreground motes
        const size = 2 + seed(1) * 12;
        const left = seed(2) * 100;
        const dur = 26 + seed(3) * 30; // 26–56s slow drift
        const delay = -seed(4) * dur;
        const dx = (seed(5) - 0.5) * 140;
        const opacity = 0.5 + seed(6) * 0.45;
        // Depth-of-field: larger particles get more blur (closer/out-of-focus)
        const blur = size > 9 ? 2.2 : size > 6 ? 1.1 : 0.3;
        // Emit from bottom edge: stagger starting Y between 92–108vh
        const startY = 92 + seed(7) * 16;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: `${startY}vh`,
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.95)",
              boxShadow:
                "0 0 10px rgba(255,255,255,0.6), 0 0 20px rgba(191,219,254,0.3)",
              filter: `blur(${blur}px)`,
              ["--dust-op" as never]: String(opacity),
              ["--dust-dx" as never]: `${dx}px`,
              animation: `dustParticleFloat ${dur}s linear ${delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}
