import { useEffect, useRef, useState } from "react";

/**
 * LearnersWorld — Editorial marquee of countries with learner counts.
 * Three rows of country flags + numbers scroll horizontally at different
 * speeds and directions, creating a calm "around the world" feel without
 * any map illustration.
 */

type Country = { flag: string; name: string; count: string };

const countries: Country[] = [
  { flag: "🇮🇳", name: "India", count: "12,400+" },
  { flag: "🇵🇰", name: "Pakistan", count: "4,200+" },
  { flag: "🇧🇩", name: "Bangladesh", count: "3,100+" },
  { flag: "🇨🇳", name: "China", count: "2,800+" },
  { flag: "🇵🇭", name: "Philippines", count: "2,400+" },
  { flag: "🇳🇬", name: "Nigeria", count: "1,900+" },
  { flag: "🇮🇩", name: "Indonesia", count: "1,700+" },
  { flag: "🇻🇳", name: "Vietnam", count: "1,500+" },
  { flag: "🇧🇷", name: "Brazil", count: "1,400+" },
  { flag: "🇬🇧", name: "United Kingdom", count: "1,200+" },
  { flag: "🇨🇦", name: "Canada", count: "1,100+" },
  { flag: "🇦🇺", name: "Australia", count: "980+" },
  { flag: "🇺🇸", name: "United States", count: "950+" },
  { flag: "🇩🇪", name: "Germany", count: "820+" },
  { flag: "🇦🇪", name: "UAE", count: "780+" },
  { flag: "🇹🇷", name: "Türkiye", count: "740+" },
  { flag: "🇲🇾", name: "Malaysia", count: "690+" },
  { flag: "🇪🇬", name: "Egypt", count: "660+" },
  { flag: "🇱🇰", name: "Sri Lanka", count: "640+" },
  { flag: "🇳🇵", name: "Nepal", count: "610+" },
  { flag: "🇸🇦", name: "Saudi Arabia", count: "580+" },
  { flag: "🇫🇷", name: "France", count: "560+" },
  { flag: "🇹🇭", name: "Thailand", count: "540+" },
  { flag: "🇿🇦", name: "South Africa", count: "520+" },
  { flag: "🇮🇹", name: "Italy", count: "490+" },
  { flag: "🇪🇸", name: "Spain", count: "470+" },
  { flag: "🇰🇷", name: "South Korea", count: "450+" },
  { flag: "🇯🇵", name: "Japan", count: "430+" },
  { flag: "🇲🇽", name: "Mexico", count: "410+" },
  { flag: "🇰🇪", name: "Kenya", count: "390+" },
  { flag: "🇮🇷", name: "Iran", count: "370+" },
  { flag: "🇸🇬", name: "Singapore", count: "350+" },
  { flag: "🇳🇱", name: "Netherlands", count: "330+" },
  { flag: "🇨🇴", name: "Colombia", count: "310+" },
  { flag: "🇵🇱", name: "Poland", count: "290+" },
  { flag: "🇲🇦", name: "Morocco", count: "270+" },
  { flag: "🇶🇦", name: "Qatar", count: "260+" },
  { flag: "🇺🇦", name: "Ukraine", count: "240+" },
  { flag: "🇦🇷", name: "Argentina", count: "230+" },
  { flag: "🇸🇪", name: "Sweden", count: "220+" },
  { flag: "🇮🇪", name: "Ireland", count: "210+" },
  { flag: "🇵🇹", name: "Portugal", count: "200+" },
  { flag: "🇷🇴", name: "Romania", count: "190+" },
  { flag: "🇳🇴", name: "Norway", count: "180+" },
  { flag: "🇨🇭", name: "Switzerland", count: "170+" },
  { flag: "🇬🇷", name: "Greece", count: "160+" },
  { flag: "🇨🇱", name: "Chile", count: "150+" },
  { flag: "🇵🇪", name: "Peru", count: "140+" },
];

// Split into 3 rows for visual rhythm
const row1 = countries.filter((_, i) => i % 3 === 0);
const row2 = countries.filter((_, i) => i % 3 === 1);
const row3 = countries.filter((_, i) => i % 3 === 2);

function CountryItem({ c }: { c: Country }) {
  return (
    <div className="flex shrink-0 items-center gap-5 px-10">
      <span
        className="leading-none"
        style={{
          fontSize: "clamp(3rem, 6vw, 4.5rem)",
          filter: "drop-shadow(0 6px 14px rgba(15,23,42,0.18))",
        }}
      >
        {c.flag}
      </span>
      <div className="flex flex-col leading-none">
        <span className="font-display text-4xl font-black tabular-nums tracking-tight text-foreground sm:text-5xl">
          {c.count}
        </span>
        <span className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground/50 sm:text-base">
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
