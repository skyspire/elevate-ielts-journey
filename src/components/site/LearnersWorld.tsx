import { useEffect, useRef, useState } from "react";

/**
 * LearnersWorld — Vintage cartography world map.
 *
 * Cream paper backdrop, sepia continent silhouettes built from dot fields,
 * dashed shipping routes connecting a hub to learner cities, hand-drawn
 * compass rose, and wax-seal stamps on key cities. Editorial, no pills.
 */

const MAP_W = 1000;
const MAP_H = 520;

const proj = (lng: number, lat: number) => {
  const x = ((lng + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return { x, y };
};

// Pseudo-random helper for stable SSR-friendly point spreads
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Generate dot points inside a polygon-ish bounding region.
// Each "blob" is a coarse continent shape sketched as overlapping ellipses.
function dotsInEllipse(
  cxLng: number,
  cyLat: number,
  rxLng: number,
  ryLat: number,
  count: number,
  seed: number,
) {
  const rand = rng(seed);
  const out: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < count; i++) {
    // rejection sample inside ellipse
    let lng = 0;
    let lat = 0;
    for (let t = 0; t < 30; t++) {
      lng = cxLng + (rand() * 2 - 1) * rxLng;
      lat = cyLat + (rand() * 2 - 1) * ryLat;
      const nx = (lng - cxLng) / rxLng;
      const ny = (lat - cyLat) / ryLat;
      if (nx * nx + ny * ny <= 1) break;
    }
    const { x, y } = proj(lng, lat);
    // dot size varies for a hand-stippled feel
    const r = 1.4 + rand() * 1.0;
    out.push({ x, y, r });
  }
  return out;
}

// Continents — sketched as composites of ellipses.
const continents = [
  // North America
  ...dotsInEllipse(-100, 45, 30, 18, 240, 11),
  ...dotsInEllipse(-90, 28, 18, 10, 110, 12),
  ...dotsInEllipse(-75, 52, 15, 10, 70, 13),
  // Greenland
  ...dotsInEllipse(-42, 72, 10, 8, 50, 14),
  // Central America
  ...dotsInEllipse(-85, 15, 10, 6, 40, 15),
  // South America
  ...dotsInEllipse(-60, -15, 18, 25, 230, 16),
  ...dotsInEllipse(-70, -38, 8, 15, 80, 17),
  // Europe
  ...dotsInEllipse(15, 52, 22, 10, 180, 18),
  ...dotsInEllipse(0, 45, 12, 8, 70, 19),
  // UK / Ireland
  ...dotsInEllipse(-3, 54, 5, 4, 30, 20),
  // Africa
  ...dotsInEllipse(20, 5, 22, 22, 280, 21),
  ...dotsInEllipse(25, -20, 15, 15, 140, 22),
  // Middle East
  ...dotsInEllipse(45, 28, 14, 10, 90, 23),
  // Russia / Northern Asia
  ...dotsInEllipse(90, 60, 50, 12, 280, 24),
  // South Asia
  ...dotsInEllipse(78, 22, 12, 12, 130, 25),
  // South-East Asia
  ...dotsInEllipse(105, 5, 15, 12, 110, 26),
  // East Asia
  ...dotsInEllipse(115, 35, 18, 14, 180, 27),
  // Japan
  ...dotsInEllipse(138, 37, 4, 7, 35, 28),
  // Indonesia / Philippines
  ...dotsInEllipse(120, -2, 18, 6, 90, 29),
  // Australia
  ...dotsInEllipse(133, -25, 18, 12, 170, 30),
  // New Zealand
  ...dotsInEllipse(172, -42, 4, 6, 25, 31),
];

// Learner cities — these get wax stamps + route lines
const learnerCities = [
  { city: "Toronto", country: "Canada", lng: -79.38, lat: 43.65, hub: false },
  { city: "Vancouver", country: "Canada", lng: -123.12, lat: 49.28, hub: false },
  { city: "São Paulo", country: "Brazil", lng: -46.63, lat: -23.55, hub: false },
  { city: "London", country: "UK", lng: -0.13, lat: 51.5, hub: true },
  { city: "Berlin", country: "Germany", lng: 13.4, lat: 52.52, hub: false },
  { city: "Lisbon", country: "Portugal", lng: -9.14, lat: 38.72, hub: false },
  { city: "Lagos", country: "Nigeria", lng: 3.38, lat: 6.52, hub: false },
  { city: "Dubai", country: "UAE", lng: 55.27, lat: 25.2, hub: false },
  { city: "Mumbai", country: "India", lng: 72.87, lat: 19.07, hub: false },
  { city: "Delhi", country: "India", lng: 77.21, lat: 28.61, hub: false },
  { city: "Singapore", country: "Singapore", lng: 103.82, lat: 1.35, hub: false },
  { city: "Shanghai", country: "China", lng: 121.47, lat: 31.23, hub: false },
  { city: "Seoul", country: "South Korea", lng: 126.98, lat: 37.57, hub: false },
  { city: "Sydney", country: "Australia", lng: 151.21, lat: -33.87, hub: false },
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

// Sepia / ink palette
const INK_DOT = "oklch(0.45 0.06 55 / 0.55)";
const INK_LINE = "oklch(0.42 0.08 45)";
const INK_FAINT = "oklch(0.45 0.06 55 / 0.35)";
const STAMP_RED = "oklch(0.5 0.16 25)";
const PIN_FILL = "oklch(0.55 0.16 35)";
const PAPER_BG = "oklch(0.97 0.025 75)";

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

  const hub = learnerCities.find((c) => c.hub)!;
  const hubPt = proj(hub.lng, hub.lat);

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
          <h2 className="mt-3 font-display text-5xl font-black leading-[1] tracking-tight text-foreground sm:text-7xl md:text-[80px]">
            <span className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-x-[-10px] bottom-2 -z-0 h-[26%] -rotate-1 rounded-sm"
                style={{
                  background:
                    "linear-gradient(120deg, oklch(0.85 0.14 90 / 0.7), oklch(0.88 0.12 60 / 0.65))",
                }}
              />
              <span className="relative z-10">9,680+ learners.</span>
            </span>
            <br />
            47 countries.
          </h2>
        </div>

        {/* The vintage map artifact */}
        <div className="relative mx-auto mt-16 max-w-6xl">
          <div
            className="relative overflow-hidden rounded-[28px] border border-foreground/15 shadow-[0_2px_4px_rgba(15,23,42,0.05),0_30px_60px_-30px_rgba(15,23,42,0.25)]"
            style={{
              background: PAPER_BG,
              backgroundImage:
                "radial-gradient(oklch(0.4 0.06 55 / 0.06) 1px, transparent 1.2px)",
              backgroundSize: "4px 4px",
            }}
          >
            {/* Inner double-line frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-2 rounded-[22px] border border-foreground/15"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[10px] rounded-[18px] border border-foreground/10"
            />

            {/* Corner ornaments */}
            <CornerOrnament className="absolute left-3 top-3" />
            <CornerOrnament className="absolute right-3 top-3 scale-x-[-1]" />
            <CornerOrnament className="absolute left-3 bottom-3 scale-y-[-1]" />
            <CornerOrnament className="absolute right-3 bottom-3 -scale-100" />

            {/* Title cartouche — top-left */}
            <div className="absolute left-8 top-7 z-10 max-w-[58%] sm:left-10 sm:top-9">
              <p className="font-handwriting text-xl text-foreground/55 sm:text-2xl">
                fig. 01 — atlas of learners
              </p>
              <p className="mt-1 font-display text-[11px] font-extrabold uppercase tracking-[0.28em] text-foreground/55 sm:text-xs">
                Mercator projection · revised 2026
              </p>
            </div>

            {/* Compass rose — top-right */}
            <div className="absolute right-7 top-7 z-10 sm:right-10 sm:top-9">
              <CompassRose />
            </div>

            {/* The map */}
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="block h-auto w-full"
              aria-hidden
            >
              {/* Latitude / longitude faint grid */}
              <g stroke={INK_FAINT} strokeWidth={0.4} opacity={0.5}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const y = ((i + 1) * MAP_H) / 8;
                  return (
                    <line key={`lat-${i}`} x1={0} y1={y} x2={MAP_W} y2={y} />
                  );
                })}
                {Array.from({ length: 11 }).map((_, i) => {
                  const x = ((i + 1) * MAP_W) / 12;
                  return (
                    <line key={`lng-${i}`} x1={x} y1={0} x2={x} y2={MAP_H} />
                  );
                })}
              </g>

              {/* Equator — bolder dashed line */}
              <line
                x1={0}
                y1={MAP_H / 2}
                x2={MAP_W}
                y2={MAP_H / 2}
                stroke={INK_LINE}
                strokeWidth={0.6}
                strokeDasharray="6 6"
                opacity={0.45}
              />

              {/* Continent stipple */}
              <g>
                {continents.map((d, i) => (
                  <circle
                    key={`c-${i}`}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    fill={INK_DOT}
                  />
                ))}
              </g>

              {/* Shipping routes — dashed arcs from hub to each city */}
              <g>
                {inView &&
                  learnerCities
                    .filter((c) => !c.hub)
                    .map((c, i) => {
                      const a = hubPt;
                      const b = proj(c.lng, c.lat);
                      const mx = (a.x + b.x) / 2;
                      const my = Math.min(a.y, b.y) - 70;
                      const len = 1600;
                      return (
                        <path
                          key={`route-${i}`}
                          d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                          fill="none"
                          stroke={INK_LINE}
                          strokeWidth={1.1}
                          strokeLinecap="round"
                          strokeDasharray="3 5"
                          strokeDashoffset={len}
                          style={{
                            animation: `lw-draw 2.2s ease-out ${0.12 * i}s forwards`,
                          }}
                          opacity={0.7}
                        />
                      );
                    })}
              </g>

              {/* City pins (wax stamps) */}
              <g>
                {learnerCities.map((c, i) => {
                  const { x, y } = proj(c.lng, c.lat);
                  const labelLeft = c.lng > 100 || c.city === "Sydney";
                  return (
                    <g key={`pin-${i}`}>
                      {/* pulse halo */}
                      <circle
                        cx={x}
                        cy={y}
                        r={11}
                        fill={PIN_FILL}
                        opacity={0.18}
                        style={{
                          transformOrigin: `${x}px ${y}px`,
                          animation: `lw-pulse 2.8s ease-in-out ${0.18 * i}s infinite`,
                        }}
                      />
                      {/* wax-seal stamp */}
                      <circle
                        cx={x}
                        cy={y}
                        r={5}
                        fill={c.hub ? STAMP_RED : PIN_FILL}
                        stroke={PAPER_BG}
                        strokeWidth={1.5}
                      />
                      {c.hub && (
                        <circle
                          cx={x}
                          cy={y}
                          r={9}
                          fill="none"
                          stroke={STAMP_RED}
                          strokeWidth={1}
                          opacity={0.7}
                        />
                      )}
                      {/* city label */}
                      <text
                        x={labelLeft ? x - 9 : x + 9}
                        y={y + 4}
                        fontSize={11}
                        fontWeight={700}
                        fontFamily="Inter, system-ui, sans-serif"
                        textAnchor={labelLeft ? "end" : "start"}
                        fill="oklch(0.28 0.04 60)"
                        style={{
                          paintOrder: "stroke",
                          stroke: PAPER_BG,
                          strokeWidth: 3,
                        }}
                      >
                        {c.city}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Bottom-right scribbled note */}
            <div className="absolute bottom-6 right-8 z-10 hidden text-right sm:block">
              <p
                className="font-handwriting text-2xl text-foreground/55"
                style={{ transform: "rotate(-3deg)" }}
              >
                — drawn by hand, sort of
              </p>
            </div>

            {/* Bottom-left legend */}
            <div className="absolute bottom-6 left-8 z-10 flex items-center gap-5 sm:bottom-7 sm:left-10">
              <div className="flex items-center gap-2">
                <span
                  className="block h-2.5 w-2.5 rounded-full"
                  style={{ background: STAMP_RED }}
                />
                <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/65">
                  Hub
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="block h-2.5 w-2.5 rounded-full"
                  style={{ background: PIN_FILL }}
                />
                <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/65">
                  Learner city
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Country names — large editorial type */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 font-display text-xl font-bold leading-tight tracking-tight text-foreground/75 sm:text-2xl md:text-3xl">
            {featuredCountries.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-7">
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
        @keyframes lw-draw { to { stroke-dashoffset: 0; } }
        @keyframes lw-pulse {
          0%, 100% { transform: scale(0.85); opacity: 0.55; }
          50%      { transform: scale(1.6);  opacity: 0.1; }
        }
      `}</style>
    </section>
  );
}

/* -------------------------------------------------------------- */
/* Decorative pieces                                              */
/* -------------------------------------------------------------- */

function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      className={`pointer-events-none ${className}`}
      aria-hidden
    >
      <g
        fill="none"
        stroke="oklch(0.42 0.08 45 / 0.55)"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <path d="M4 14 L4 4 L14 4" />
        <path d="M4 18 L10 18" />
        <path d="M18 4 L18 10" />
        <circle cx="4" cy="4" r="1.6" fill="oklch(0.42 0.08 45 / 0.55)" />
      </g>
    </svg>
  );
}

function CompassRose() {
  return (
    <svg
      width="62"
      height="62"
      viewBox="0 0 62 62"
      aria-hidden
    >
      <g
        fill="none"
        stroke="oklch(0.42 0.08 45 / 0.7)"
        strokeWidth="0.9"
        strokeLinecap="round"
      >
        <circle cx="31" cy="31" r="26" />
        <circle cx="31" cy="31" r="20" opacity="0.6" />
        {/* Cardinal arrows */}
        <path
          d="M31 5 L34 31 L31 28 L28 31 Z"
          fill="oklch(0.5 0.16 25)"
          stroke="oklch(0.5 0.16 25)"
        />
        <path d="M31 57 L34 31 L31 34 L28 31 Z" fill="oklch(0.42 0.08 45)" />
        <path d="M5 31 L31 28 L28 31 L31 34 Z" fill="oklch(0.42 0.08 45)" />
        <path d="M57 31 L31 28 L34 31 L31 34 Z" fill="oklch(0.42 0.08 45)" />
        {/* Inter-cardinal hairlines */}
        <line x1="13" y1="13" x2="49" y2="49" opacity="0.5" />
        <line x1="49" y1="13" x2="13" y2="49" opacity="0.5" />
        <circle cx="31" cy="31" r="2" fill="oklch(0.42 0.08 45)" />
      </g>
      <text
        x="31"
        y="11"
        textAnchor="middle"
        fontSize="7"
        fontWeight="800"
        fontFamily="Inter, system-ui, sans-serif"
        fill="oklch(0.5 0.16 25)"
      >
        N
      </text>
    </svg>
  );
}
