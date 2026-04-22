import { useEffect, useRef, useState } from "react";
import { WORLD_LAND_PATH } from "./world-map-path";

/**
 * LearnersWorld — real world map with floating regional callouts.
 * The map is the hero; 5 callouts sit in the empty ocean spaces around it,
 * each connected to its region by a thin ink line.
 */

const MAP_W = 1000;
const MAP_H = 500;

const proj = (lng: number, lat: number) => {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return { x, y };
};

// Calm editorial palette
const PAPER = "oklch(0.97 0.018 80)";
const LAND = "oklch(0.42 0.04 255)";
const LAND_STROKE = "oklch(0.32 0.05 255)";
const PIN = "oklch(0.58 0.17 255)";
const PIN_HALO = "oklch(0.58 0.17 255 / 0.18)";
const PIN_CORE = "oklch(0.99 0.005 90)";
const LINE = "oklch(0.32 0.05 255 / 0.55)";

// All learner pins (small dots on the map)
const cities = [
  { lng: -79.38, lat: 43.65 },   // Toronto
  { lng: -123.12, lat: 49.28 },  // Vancouver
  { lng: -99.13, lat: 19.43 },   // Mexico City
  { lng: -46.63, lat: -23.55 },  // São Paulo
  { lng: -0.13, lat: 51.5 },     // London
  { lng: 13.4, lat: 52.52 },     // Berlin
  { lng: -9.14, lat: 38.72 },    // Lisbon
  { lng: 12.5, lat: 41.9 },      // Rome
  { lng: 3.38, lat: 6.52 },      // Lagos
  { lng: 31.24, lat: 30.04 },    // Cairo
  { lng: 55.27, lat: 25.2 },     // Dubai
  { lng: 72.87, lat: 19.07 },    // Mumbai
  { lng: 77.21, lat: 28.61 },    // Delhi
  { lng: 90.4, lat: 23.8 },      // Dhaka
  { lng: 103.82, lat: 1.35 },    // Singapore
  { lng: 121.47, lat: 31.23 },   // Shanghai
  { lng: 126.98, lat: 37.57 },   // Seoul
  { lng: 139.69, lat: 35.69 },   // Tokyo
  { lng: 151.21, lat: -33.87 },  // Sydney
];

/**
 * Floating callouts — positioned in % of the SVG viewBox so they hover
 * in ocean / empty regions. Each anchors to a target country/region.
 */
type Callout = {
  flag: string;
  country: string;
  count: string;
  // Position of the callout box (in viewBox % units, 0-100)
  cardX: number; // left edge %
  cardY: number; // top edge %
  // Target geo point (lng, lat) to draw the connector line to
  targetLng: number;
  targetLat: number;
  side: "left" | "right";
};

const callouts: Callout[] = [
  {
    flag: "🇨🇦",
    country: "Canada",
    count: "720",
    cardX: -2,
    cardY: 4,
    targetLng: -100,
    targetLat: 56,
    side: "left",
  },
  {
    flag: "🇬🇧",
    country: "United Kingdom",
    count: "590",
    cardX: 28,
    cardY: -6,
    targetLng: -2,
    targetLat: 53,
    side: "left",
  },
  {
    flag: "🇮🇳",
    country: "India",
    count: "2,840",
    cardX: 79,
    cardY: 8,
    targetLng: 78,
    targetLat: 22,
    side: "right",
  },
  {
    flag: "🇧🇷",
    country: "Brazil",
    count: "410",
    cardX: -2,
    cardY: 70,
    targetLng: -52,
    targetLat: -10,
    side: "left",
  },
  {
    flag: "🇦🇺",
    country: "Australia",
    count: "310",
    cardX: 78,
    cardY: 78,
    targetLng: 134,
    targetLat: -25,
    side: "right",
  },
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

        {/* Map + floating callouts container */}
        <div className="relative mx-auto mt-20 max-w-7xl px-2 sm:px-6 lg:px-12">
          {/* Connector lines layer (sits under cards, over map) */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            aria-hidden
          >
            {callouts.map((c, i) => {
              // Map area sits roughly inside the container — convert geo → % of container.
              // The map svg occupies the full inner area, so we use the same geo proj
              // and convert MAP px → % of MAP_W / MAP_H.
              const t = proj(c.targetLng, c.targetLat);
              const tx = (t.x / MAP_W) * 100;
              const ty = (t.y / MAP_H) * 100;

              // Callout anchor point (where the line meets the card)
              const ax =
                c.side === "left" ? c.cardX + 22 : c.cardX + 0; // right edge of left cards / left edge of right cards
              const ay = c.cardY + 12; // mid-height of card

              return (
                <line
                  key={`line-${i}`}
                  x1={ax}
                  y1={ay}
                  x2={tx}
                  y2={ty}
                  stroke={LINE}
                  strokeWidth="0.18"
                  strokeDasharray="0.6 0.8"
                  strokeLinecap="round"
                  style={{
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.6s ease ${0.3 + i * 0.1}s`,
                  }}
                />
              );
            })}
          </svg>

          {/* The map */}
          <div className="relative">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="block h-auto w-full"
              aria-hidden
              style={{ background: PAPER, borderRadius: "20px" }}
            >
              <path
                d={WORLD_LAND_PATH}
                fill={LAND}
                stroke={LAND_STROKE}
                strokeWidth={0.4}
                strokeLinejoin="round"
              />
              <g>
                {cities.map((c, i) => {
                  const { x, y } = proj(c.lng, c.lat);
                  return (
                    <g key={`city-${i}`}>
                      {inView && (
                        <circle
                          cx={x}
                          cy={y}
                          r={11}
                          fill={PIN_HALO}
                          style={{
                            transformOrigin: `${x}px ${y}px`,
                            animation: `lw-pulse 3s ease-in-out ${0.15 * i}s infinite`,
                          }}
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={3.6}
                        fill={PIN}
                        stroke={PIN_CORE}
                        strokeWidth={1.2}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Floating callout cards — hidden on small screens to avoid clutter */}
          <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
            {callouts.map((c, i) => (
              <div
                key={c.country}
                className="pointer-events-auto absolute"
                style={{
                  left: `${c.cardX}%`,
                  top: `${c.cardY}%`,
                  width: "22%",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 0.6s ease ${0.2 + i * 0.1}s, transform 0.6s ease ${0.2 + i * 0.1}s`,
                }}
              >
                <div className="rounded-2xl border border-foreground/12 bg-background px-4 py-3 shadow-[0_2px_4px_rgba(15,23,42,0.04),0_18px_40px_-22px_rgba(15,23,42,0.2)]">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl leading-none">{c.flag}</span>
                    <span className="font-display text-3xl font-black tabular-nums leading-none tracking-tight text-foreground">
                      {c.count}
                    </span>
                  </div>
                  <div className="mt-2 font-display text-sm font-bold tracking-tight text-foreground/65">
                    learners in {c.country}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile-only: stacked summary below the map */}
          <div className="mt-10 grid grid-cols-2 gap-3 lg:hidden">
            {callouts.map((c) => (
              <div
                key={c.country}
                className="rounded-2xl border border-foreground/12 bg-background px-4 py-3 shadow-[0_2px_4px_rgba(15,23,42,0.04),0_12px_28px_-18px_rgba(15,23,42,0.2)]"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xl leading-none">{c.flag}</span>
                  <span className="font-display text-2xl font-black tabular-nums leading-none tracking-tight text-foreground">
                    {c.count}
                  </span>
                </div>
                <div className="mt-1.5 font-display text-xs font-bold tracking-tight text-foreground/65">
                  {c.country}
                </div>
              </div>
            ))}
          </div>
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
