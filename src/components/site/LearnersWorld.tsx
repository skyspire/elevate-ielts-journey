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

/* ===========================================================
 * CounterStage — Dramatic moment: flag rain + ticking 70,000+
 * =========================================================== */

const RAIN_FLAGS = countries.slice(0, 36).map((c) => c.flag);

const rainConfig = RAIN_FLAGS.map((flag, i) => {
  const rand = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const startX = 4 + rand(i + 1) * 92;
  const restY = 62 + rand(i + 7) * 30;
  const rotate = (rand(i + 13) - 0.5) * 50;
  const delay = rand(i + 21) * 1.6;
  const duration = 1.6 + rand(i + 31) * 1.2;
  const size = 1.6 + rand(i + 41) * 1.4;
  return { flag, startX, restY, rotate, delay, duration, size };
});

function CounterStage({ active }: { active: boolean }) {
  const [count, setCount] = useState(0);
  const TARGET = 70000;
  const DURATION = 2200;

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * TARGET));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const timeout = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 400);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  const formatted = count.toLocaleString("en-US");

  return (
    <div className="relative mx-auto mt-12 h-[420px] w-full max-w-5xl sm:h-[480px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {rainConfig.map((f, i) => (
          <span
            key={i}
            className="absolute leading-none"
            style={{
              left: `${f.startX}%`,
              top: 0,
              fontSize: `${f.size}rem`,
              filter: "drop-shadow(0 4px 10px rgba(15,23,42,0.18))",
              animation: active
                ? `lw-fall ${f.duration}s cubic-bezier(0.34, 1.2, 0.64, 1) ${f.delay}s both`
                : "none",
              ["--rest-y" as string]: `${f.restY}%`,
              ["--rotate" as string]: `${f.rotate}deg`,
              opacity: active ? 1 : 0,
            }}
          >
            {f.flag}
          </span>
        ))}
      </div>

      <div className="absolute inset-x-0 top-6 z-10 flex flex-col items-center sm:top-10">
        <div
          className="font-display font-black tabular-nums tracking-tight text-foreground"
          style={{
            fontSize: "clamp(4.5rem, 14vw, 10rem)",
            lineHeight: 0.95,
            textShadow: "0 2px 20px oklch(0.97 0.015 85 / 0.8)",
          }}
        >
          {formatted}
          <span className="text-foreground/60">+</span>
        </div>
        <p className="mt-3 font-handwriting text-2xl text-foreground/55 sm:text-3xl">
          learners across 47 countries
        </p>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24"
        style={{
          background:
            "linear-gradient(to top, oklch(0.93 0.03 75 / 0.6), transparent)",
        }}
      />
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
      className="relative overflow-hidden py-24 sm:py-32"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.985 0.012 85) 0%, oklch(0.965 0.022 80) 50%, oklch(0.945 0.028 70) 100%)",
      }}
    >
      {/* Premium layered background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.88 0.14 65 / 0.45), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-32 h-[600px] w-[600px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.82 0.12 250 / 0.32), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.3 0.04 80 / 0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 90%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.97 0.015 85), transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to top, oklch(0.97 0.015 85), transparent)",
          }}
        />
      </div>

      <div className="container-page relative">
        {/* Editorial header */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-handwriting text-3xl text-foreground/55 sm:text-4xl">
            from every corner of the world
          </p>
          <h2 className="mt-3 font-display text-4xl font-black leading-[1] tracking-tight text-foreground sm:text-5xl">
            A quiet movement,
            <br />
            <span className="text-foreground/60">growing every day.</span>
          </h2>
        </div>

        {/* The dramatic counter stage */}
        <CounterStage active={inView} />

        <p className="mx-auto mt-10 max-w-2xl text-center font-display text-base text-foreground/65 sm:text-lg">
          A quiet movement of writers, speakers, and readers — preparing for
          their band, in their own time, from their own city.
        </p>
      </div>

      {/* Full-bleed marquee rows */}
      <div
        className="relative mt-16 sm:mt-20"
        style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Soft fade edges — match new background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-40"
          style={{
            background:
              "linear-gradient(to right, oklch(0.965 0.022 80) 5%, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-40"
          style={{
            background:
              "linear-gradient(to left, oklch(0.965 0.022 80) 5%, transparent)",
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
