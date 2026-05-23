/**
 * SparkleShimmer — twinkling star sparkles scattered in the side gutters
 * behind the popup card. Pairs with DustParticles for added magic without
 * extra motion noise. Pure fade in/out + tiny scale pulse, no drift.
 */
export function SparkleShimmer({
  visible = true,
  count = 18,
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
        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
          50%      { opacity: var(--spk-op, 0.9); transform: scale(1) rotate(45deg); }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const seed = (n: number) => (Math.sin(i * 21.317 + n) + 1) / 2;
        const isLeft = i % 2 === 0;
        const left = isLeft ? seed(1) * 11 : 89 + seed(1) * 11;
        const top = 8 + seed(2) * 84; // spread vertically across viewport
        const size = 3 + seed(3) * 5; // 3–8px
        const dur = 2.4 + seed(4) * 3.6; // 2.4–6s
        const delay = -seed(5) * dur;
        const opacity = 0.55 + seed(6) * 0.4;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: `${top}vh`,
              left: `${left}%`,
              width: size,
              height: size,
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,240,200,0.9) 40%, rgba(255,255,255,0) 70%)",
              boxShadow:
                "0 0 6px rgba(255,255,255,0.9), 0 0 12px rgba(255,220,150,0.5)",
              borderRadius: "9999px",
              ["--spk-op" as never]: String(opacity),
              animation: `sparkleTwinkle ${dur}s ease-in-out ${delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </div>
  );
}
