/**
 * SparkleShimmer — tiny twinkling sparkles framing the popup card.
 * Spawns in top/bottom strips and left/right gutters (never behind the card).
 * Very faint, micro-sized; gentle fade + scale pulse, no drift.
 */
export function SparkleShimmer({
  visible = true,
  count = 22,
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
          50%      { opacity: var(--spk-op, 0.3); transform: scale(1) rotate(45deg); }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => {
        const seed = (n: number) => (Math.sin(i * 21.317 + n) + 1) / 2;
        const zone = i % 4;
        let top = 0;
        let left = 0;
        if (zone === 0) {
          top = seed(1) * 11;
          left = seed(2) * 100;
        } else if (zone === 1) {
          top = 89 + seed(1) * 11;
          left = seed(2) * 100;
        } else if (zone === 2) {
          top = 12 + seed(1) * 76;
          left = seed(2) * 11;
        } else {
          top = 12 + seed(1) * 76;
          left = 89 + seed(2) * 11;
        }
        const size = 2 + seed(3) * 3; // 2–5px
        const dur = 2.6 + seed(4) * 3.4;
        const delay = -seed(5) * dur;
        const opacity = 0.18 + seed(6) * 0.17; // 0.18–0.35
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
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,240,200,0.85) 40%, rgba(255,255,255,0) 70%)",
              boxShadow: "0 0 4px rgba(255,255,255,0.6)",
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
