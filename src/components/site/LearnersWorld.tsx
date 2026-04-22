import { useEffect, useRef, useState } from "react";
import worldMapImg from "@/assets/world-map-3d.jpg";

/**
 * LearnersWorld — 3D world map photo with floating regional callouts.
 * The map is a high-quality 3D illustration; cards float in the negative
 * space around it and connect to their region with a thin ink line.
 */

// Calm editorial palette
const PIN = "oklch(0.58 0.17 255)";
const PIN_HALO = "oklch(0.58 0.17 255 / 0.22)";
const PIN_CORE = "oklch(0.99 0.005 90)";
const LINE = "oklch(0.32 0.05 255 / 0.5)";

/**
 * All decorative pin dots — positions are in % of the map image
 * (left, top), hand-tuned to sit on continents in the rendered image.
 */
const pins = [
  { x: 22, y: 32 }, // Vancouver
  { x: 28, y: 36 }, // Toronto
  { x: 26, y: 50 }, // Mexico City
  { x: 33, y: 70 }, // São Paulo
  { x: 47, y: 30 }, // London
  { x: 50, y: 33 }, // Berlin
  { x: 46, y: 38 }, // Lisbon
  { x: 51, y: 55 }, // Lagos
  { x: 56, y: 48 }, // Cairo
  { x: 60, y: 50 }, // Dubai
  { x: 67, y: 52 }, // Mumbai
  { x: 68, y: 47 }, // Delhi
  { x: 76, y: 60 }, // Singapore
  { x: 80, y: 45 }, // Shanghai
  { x: 82, y: 43 }, // Seoul
  { x: 85, y: 44 }, // Tokyo
  { x: 88, y: 75 }, // Sydney
];

/**
 * Floating callouts — positioned in % of the wrapper container.
 * Each anchors to a target % point on the map image.
 */
type Callout = {
  flag: string;
  country: string;
  count: string;
  cardX: number;
  cardY: number;
  // Target point on the map (% of map image)
  targetX: number;
  targetY: number;
  side: "left" | "right";
};

const callouts: Callout[] = [
  {
    flag: "🇨🇦",
    country: "Canada",
    count: "720",
    cardX: -2,
    cardY: 6,
    targetX: 24,
    targetY: 30,
    side: "left",
  },
  {
    flag: "🇬🇧",
    country: "United Kingdom",
    count: "590",
    cardX: 28,
    cardY: -4,
    targetX: 47,
    targetY: 30,
    side: "left",
  },
  {
    flag: "🇮🇳",
    country: "India",
    count: "2,840",
    cardX: 78,
    cardY: 8,
    targetX: 68,
    targetY: 50,
    side: "right",
  },
  {
    flag: "🇧🇷",
    country: "Brazil",
    count: "410",
    cardX: -2,
    cardY: 72,
    targetX: 33,
    targetY: 70,
    side: "left",
  },
  {
    flag: "🇦🇺",
    country: "Australia",
    count: "310",
    cardX: 78,
    cardY: 78,
    targetX: 88,
    targetY: 75,
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

        {/* Map + callouts wrapper */}
        <div className="relative mx-auto mt-20 max-w-7xl px-2 sm:px-6 lg:px-12">
          {/* The map image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px]">
            <img
              src={worldMapImg}
              alt="World map showing learners across continents"
              loading="lazy"
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
            />

            {/* Pin layer — positioned over the map image */}
            <div className="pointer-events-none absolute inset-0">
              {pins.map((p, i) => (
                <div
                  key={`pin-${i}`}
                  className="absolute"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {inView && (
                    <span
                      className="absolute left-1/2 top-1/2 block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        background: PIN_HALO,
                        animation: `lw-pulse 3s ease-in-out ${0.15 * i}s infinite`,
                      }}
                    />
                  )}
                  <span
                    className="relative block h-2.5 w-2.5 rounded-full"
                    style={{
                      background: PIN,
                      boxShadow: `0 0 0 2px ${PIN_CORE}`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Connector lines — sit above map, below cards */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
            aria-hidden
          >
            {callouts.map((c, i) => {
              const ax = c.side === "left" ? c.cardX + 22 : c.cardX;
              const ay = c.cardY + 12;
              return (
                <line
                  key={`line-${i}`}
                  x1={ax}
                  y1={ay}
                  x2={c.targetX}
                  y2={c.targetY}
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

          {/* Floating callout cards — desktop only */}
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

          {/* Mobile-only stacked summary */}
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
          0%, 100% { transform: translate(-50%, -50%) scale(0.7); opacity: 0.55; }
          50%      { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
