import { useEffect, useRef, useState } from "react";
import { WORLD_LAND_PATH } from "./world-map-path";

/**
 * LearnersWorld — real world map.
 * Calm, editorial. Soft cream paper. Real continent silhouettes.
 * Glowing learner cities with subtle pulses. No labels-on-pins,
 * no compass, no legend, no fake annotations. Big type only.
 */

const MAP_W = 1000;
const MAP_H = 500;

// Equirectangular projection matching the SVG path (scale = W / 2π, centered)
const proj = (lng: number, lat: number) => {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return { x, y };
};

const cities = [
  { city: "Toronto", lng: -79.38, lat: 43.65 },
  { city: "Vancouver", lng: -123.12, lat: 49.28 },
  { city: "Mexico City", lng: -99.13, lat: 19.43 },
  { city: "São Paulo", lng: -46.63, lat: -23.55 },
  { city: "London", lng: -0.13, lat: 51.5 },
  { city: "Berlin", lng: 13.4, lat: 52.52 },
  { city: "Lisbon", lng: -9.14, lat: 38.72 },
  { city: "Lagos", lng: 3.38, lat: 6.52 },
  { city: "Cairo", lng: 31.24, lat: 30.04 },
  { city: "Dubai", lng: 55.27, lat: 25.2 },
  { city: "Mumbai", lng: 72.87, lat: 19.07 },
  { city: "Delhi", lng: 77.21, lat: 28.61 },
  { city: "Singapore", lng: 103.82, lat: 1.35 },
  { city: "Shanghai", lng: 121.47, lat: 31.23 },
  { city: "Seoul", lng: 126.98, lat: 37.57 },
  { city: "Tokyo", lng: 139.69, lat: 35.69 },
  { city: "Sydney", lng: 151.21, lat: -33.87 },
];

// Calm, editorial palette — deep navy ink on warm cream
const PAPER = "oklch(0.97 0.018 80)";
const LAND = "oklch(0.4 0.04 255)"; // muted navy ink
const LAND_STROKE = "oklch(0.32 0.05 255)";
const PIN = "oklch(0.58 0.17 255)"; // brand
const PIN_HALO = "oklch(0.58 0.17 255 / 0.18)";
const PIN_CORE = "oklch(0.99 0.005 90)";

export function LearnersWorld() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-paper-cream py-24 sm:py-32"
    >
      <div className="container-page relative">
        {/* Editorial header */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-handwriting text-3xl text-foreground/55 sm:text-4xl">
            from every corner of the world
          </p>
          <h2 className="mt-3 font-display text-5xl font-black leading-[1] tracking-tight text-foreground sm:text-7xl md:text-[88px]">
            <span className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-x-[-10px] bottom-2 -z-0 h-[26%] -rotate-1 rounded-sm"
                style={{
                  background:
                    "linear-gradient(120deg, oklch(0.85 0.14 90 / 0.7), oklch(0.88 0.12 60 / 0.65))",
                }}
              />
              <span className="relative z-10">9,680 learners.</span>
            </span>
            <br />
            47 countries.
          </h2>
        </div>

        {/* The map */}
        <div className="relative mx-auto mt-20 max-w-6xl">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="block h-auto w-full"
            aria-hidden
            style={{ background: PAPER }}
          >
            {/* Real continent silhouettes */}
            <path
              d={WORLD_LAND_PATH}
              fill={LAND}
              stroke={LAND_STROKE}
              strokeWidth={0.4}
              strokeLinejoin="round"
            />

            {/* City pins */}
            <g>
              {cities.map((c, i) => {
                const { x, y } = proj(c.lng, c.lat);
                return (
                  <g key={c.city}>
                    {/* outer pulse */}
                    {inView && (
                      <circle
                        cx={x}
                        cy={y}
                        r={14}
                        fill={PIN_HALO}
                        style={{
                          transformOrigin: `${x}px ${y}px`,
                          animation: `lw-pulse 3.2s ease-in-out ${0.18 * i}s infinite`,
                        }}
                      />
                    )}
                    {/* core dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={4.5}
                      fill={PIN}
                      stroke={PIN_CORE}
                      strokeWidth={1.6}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes lw-pulse {
          0%, 100% { transform: scale(0.7); opacity: 0.55; }
          50%      { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
