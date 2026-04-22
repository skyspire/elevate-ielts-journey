import { useEffect, useRef, useState } from "react";

/**
 * LearnersWorld
 * A paper-style world section showing where learners come from.
 * No pills, no micro-text. Big editorial headline, confident dotted world map.
 */

// Approximate normalized lat/lng → x/y on a 1000x500 map (equirectangular).
// We hand-pick a spread of cities so the dot field reads as a real world map.
const MAP_W = 1000;
const MAP_H = 500;

// helper: convert lng/lat to svg coords
const proj = (lng: number, lat: number) => {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return { x, y };
};

// Background dot field — sparse continent outlines, not a real geo dataset.
// Each entry is a coarse cluster of (lng, lat) points across continents.
const continentClusters: Array<{ lng: number; lat: number }> = [
  // North America
  ...spread(-125, 25, -65, 60, 90),
  // South America
  ...spread(-82, -55, -35, 12, 55),
  // Europe
  ...spread(-10, 36, 40, 65, 70),
  // Africa
  ...spread(-18, -34, 52, 35, 80),
  // Middle East / Central Asia
  ...spread(35, 18, 75, 50, 55),
  // South & East Asia
  ...spread(60, 5, 145, 50, 90),
  // Oceania
  ...spread(112, -42, 155, -10, 30),
  // UK / Ireland
  ...spread(-10, 50, 2, 58, 12),
];

// Generate a pseudo-random spread of (lng, lat) within a bounding box.
function spread(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number,
  count: number,
) {
  const out: Array<{ lng: number; lat: number }> = [];
  // deterministic pseudo-random for consistent SSR rendering
  let seed = (Math.abs(lng1) + Math.abs(lat1) + count) * 9301 + 49297;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    out.push({
      lng: lng1 + rand() * (lng2 - lng1),
      lat: lat1 + rand() * (lat2 - lat1),
    });
  }
  return out;
}

// Highlighted learner cities — these glow & pulse.
const learnerCities = [
  { city: "Toronto", country: "Canada", lng: -79.38, lat: 43.65 },
  { city: "Vancouver", country: "Canada", lng: -123.12, lat: 49.28 },
  { city: "London", country: "UK", lng: -0.13, lat: 51.5 },
  { city: "Berlin", country: "Germany", lng: 13.4, lat: 52.52 },
  { city: "Lisbon", country: "Portugal", lng: -9.14, lat: 38.72 },
  { city: "Dubai", country: "UAE", lng: 55.27, lat: 25.2 },
  { city: "Mumbai", country: "India", lng: 72.87, lat: 19.07 },
  { city: "Delhi", country: "India", lng: 77.21, lat: 28.61 },
  { city: "Singapore", country: "Singapore", lng: 103.82, lat: 1.35 },
  { city: "Shanghai", country: "China", lng: 121.47, lat: 31.23 },
  { city: "Seoul", country: "South Korea", lng: 126.98, lat: 37.57 },
  { city: "Sydney", country: "Australia", lng: 151.21, lat: -33.87 },
  { city: "Lagos", country: "Nigeria", lng: 3.38, lat: 6.52 },
  { city: "São Paulo", country: "Brazil", lng: -46.63, lat: -23.55 },
  { city: "Mexico City", country: "Mexico", lng: -99.13, lat: 19.43 },
];

const featuredCountries = [
  "Canada",
  "United Kingdom",
  "Germany",
  "Portugal",
  "UAE",
  "India",
  "Singapore",
  "China",
  "South Korea",
  "Australia",
  "Nigeria",
  "Brazil",
  "Mexico",
  "Japan",
  "Vietnam",
];

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
      { threshold: 0.2 },
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
        {/* Headline — no pill, no eyebrow chip */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Learners in{" "}
            <span className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-x-[-6px] bottom-1 -z-0 h-[36%] -rotate-1 rounded-sm"
                style={{
                  background:
                    "linear-gradient(120deg, oklch(0.85 0.14 90 / 0.7), oklch(0.88 0.12 60 / 0.65))",
                }}
              />
              <span className="relative z-10">47 countries</span>
            </span>
            <br />
            study with BigIELTS.
          </h2>
        </div>

        {/* Map */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="h-auto w-full"
            aria-hidden
          >
            {/* Background dot field — sparse, continent-shaped */}
            {continentClusters.map((p, i) => {
              const { x, y } = proj(p.lng, p.lat);
              return (
                <circle
                  key={`bg-${i}`}
                  cx={x}
                  cy={y}
                  r={2.4}
                  fill="oklch(0.55 0.04 60 / 0.25)"
                />
              );
            })}

            {/* Soft connecting arcs from a hub (London) to learner cities */}
            {inView &&
              learnerCities.map((c, i) => {
                const a = proj(-0.13, 51.5); // London hub
                const b = proj(c.lng, c.lat);
                const mx = (a.x + b.x) / 2;
                const my = Math.min(a.y, b.y) - 60;
                const len = 1400;
                return (
                  <path
                    key={`arc-${i}`}
                    d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                    fill="none"
                    stroke="oklch(0.58 0.17 255 / 0.35)"
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeDasharray={len}
                    strokeDashoffset={len}
                    style={{
                      animation: `lw-draw 1.6s ease-out ${0.15 * i}s forwards`,
                    }}
                  />
                );
              })}

            {/* Learner city dots — glowing */}
            {learnerCities.map((c, i) => {
              const { x, y } = proj(c.lng, c.lat);
              return (
                <g key={`city-${i}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={10}
                    fill="oklch(0.62 0.20 35 / 0.18)"
                    style={{
                      transformOrigin: `${x}px ${y}px`,
                      animation: `lw-pulse 2.6s ease-in-out ${0.2 * i}s infinite`,
                    }}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={4}
                    fill="oklch(0.62 0.20 35)"
                    stroke="oklch(0.99 0.005 90)"
                    strokeWidth={1.5}
                  />
                </g>
              );
            })}
          </svg>

          {/* Decorative compass mark */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-4 right-2 hidden font-handwriting text-2xl text-foreground/40 sm:block"
            style={{ transform: "rotate(-8deg)" }}
          >
            studied here →
          </div>
        </div>

        {/* Country names — large, editorial, no pills */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-display text-xl font-bold leading-tight tracking-tight text-foreground/75 sm:text-2xl md:text-3xl">
            {featuredCountries.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-8">
                <span className="transition-colors hover:text-foreground">
                  {c}
                </span>
                {i < featuredCountries.length - 1 && (
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-foreground/25"
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lw-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes lw-pulse {
          0%, 100% { transform: scale(0.85); opacity: 0.6; }
          50%      { transform: scale(1.4);  opacity: 0.15; }
        }
      `}</style>
    </section>
  );
}
