import { useEffect, useRef, useState } from "react";

/**
 * LearnersWorld — Editorial marquee of countries with learner counts.
 * Three rows of country flags + numbers scroll horizontally at different
 * speeds and directions, creating a calm "around the world" feel without
 * any map illustration.
 */

type Country = { flag: string; name: string; count: string };

const countries: Country[] = [
  { flag: "🇮🇳", name: "India", count: "2,840" },
  { flag: "🇨🇦", name: "Canada", count: "720" },
  { flag: "🇬🇧", name: "United Kingdom", count: "590" },
  { flag: "🇦🇺", name: "Australia", count: "510" },
  { flag: "🇺🇸", name: "United States", count: "480" },
  { flag: "🇵🇰", name: "Pakistan", count: "460" },
  { flag: "🇧🇩", name: "Bangladesh", count: "410" },
  { flag: "🇧🇷", name: "Brazil", count: "390" },
  { flag: "🇳🇬", name: "Nigeria", count: "370" },
  { flag: "🇵🇭", name: "Philippines", count: "350" },
  { flag: "🇩🇪", name: "Germany", count: "330" },
  { flag: "🇫🇷", name: "France", count: "310" },
  { flag: "🇮🇹", name: "Italy", count: "280" },
  { flag: "🇪🇸", name: "Spain", count: "265" },
  { flag: "🇳🇱", name: "Netherlands", count: "240" },
  { flag: "🇸🇪", name: "Sweden", count: "210" },
  { flag: "🇳🇴", name: "Norway", count: "190" },
  { flag: "🇮🇪", name: "Ireland", count: "175" },
  { flag: "🇿🇦", name: "South Africa", count: "230" },
  { flag: "🇰🇪", name: "Kenya", count: "200" },
  { flag: "🇪🇬", name: "Egypt", count: "260" },
  { flag: "🇲🇦", name: "Morocco", count: "180" },
  { flag: "🇦🇪", name: "UAE", count: "295" },
  { flag: "🇸🇦", name: "Saudi Arabia", count: "270" },
  { flag: "🇶🇦", name: "Qatar", count: "150" },
  { flag: "🇹🇷", name: "Türkiye", count: "320" },
  { flag: "🇮🇷", name: "Iran", count: "215" },
  { flag: "🇱🇰", name: "Sri Lanka", count: "245" },
  { flag: "🇳🇵", name: "Nepal", count: "225" },
  { flag: "🇲🇾", name: "Malaysia", count: "275" },
  { flag: "🇸🇬", name: "Singapore", count: "205" },
  { flag: "🇮🇩", name: "Indonesia", count: "340" },
  { flag: "🇻🇳", name: "Vietnam", count: "290" },
  { flag: "🇹🇭", name: "Thailand", count: "250" },
  { flag: "🇨🇳", name: "China", count: "300" },
  { flag: "🇯🇵", name: "Japan", count: "235" },
  { flag: "🇰🇷", name: "South Korea", count: "220" },
  { flag: "🇲🇽", name: "Mexico", count: "260" },
  { flag: "🇦🇷", name: "Argentina", count: "195" },
  { flag: "🇨🇱", name: "Chile", count: "165" },
  { flag: "🇨🇴", name: "Colombia", count: "180" },
  { flag: "🇵🇪", name: "Peru", count: "140" },
  { flag: "🇵🇱", name: "Poland", count: "210" },
  { flag: "🇺🇦", name: "Ukraine", count: "190" },
  { flag: "🇷🇴", name: "Romania", count: "170" },
  { flag: "🇬🇷", name: "Greece", count: "155" },
  { flag: "🇵🇹", name: "Portugal", count: "175" },
  { flag: "🇨🇭", name: "Switzerland", count: "160" },
];

// Split into 3 rows for visual rhythm
const row1 = countries.filter((_, i) => i % 3 === 0);
const row2 = countries.filter((_, i) => i % 3 === 1);
const row3 = countries.filter((_, i) => i % 3 === 2);

function CountryItem({ c }: { c: Country }) {
  return (
    <div className="flex shrink-0 items-baseline gap-4 px-8">
      <span className="text-3xl leading-none sm:text-4xl">{c.flag}</span>
      <div className="flex items-baseline gap-2.5">
        <span className="font-display text-3xl font-black tabular-nums leading-none tracking-tight text-foreground sm:text-4xl">
          {c.count}
        </span>
        <span className="font-display text-base font-semibold tracking-tight text-foreground/55 sm:text-lg">
          {c.name}
        </span>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  duration,
  reverse = false,
}: {
  items: Country[];
  duration: number;
  reverse?: boolean;
}) {
  // Duplicate the list so the loop appears seamless
  const loop = [...items, ...items];
  return (
    <div className="group relative overflow-hidden py-2">
      <div
        className="flex w-max items-center"
        style={{
          animation: `lw-marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {loop.map((c, i) => (
          <CountryItem key={`${c.name}-${i}`} c={c} />
        ))}
      </div>
    </div>
  );
}

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
      { threshold: 0.1 },
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
          <p className="mx-auto mt-6 max-w-2xl font-display text-base text-foreground/65 sm:text-lg">
            A quiet movement of writers, speakers, and readers — preparing for
            their band, in their own time, from their own city.
          </p>
        </div>
      </div>

      {/* Full-bleed marquee rows */}
      <div
        className="relative mt-16 sm:mt-20"
        style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Soft fade edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-40"
          style={{
            background:
              "linear-gradient(to right, var(--color-paper-cream, oklch(0.97 0.015 85)) 10%, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-40"
          style={{
            background:
              "linear-gradient(to left, var(--color-paper-cream, oklch(0.97 0.015 85)) 10%, transparent)",
          }}
        />

        <div className="space-y-2 sm:space-y-4">
          <MarqueeRow items={row1} duration={70} />
          <div className="border-y border-foreground/10">
            <MarqueeRow items={row2} duration={90} reverse />
          </div>
          <MarqueeRow items={row3} duration={80} />
        </div>
      </div>

      <style>{`
        @keyframes lw-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="lw-marquee"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
