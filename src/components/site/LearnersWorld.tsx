import { useEffect, useRef, useState } from "react";
import learner01 from "@/assets/learners/learner-01.jpg";
import learner02 from "@/assets/learners/learner-02.jpg";
import learner03 from "@/assets/learners/learner-03.jpg";
import learner04 from "@/assets/learners/learner-04.jpg";
import learner05 from "@/assets/learners/learner-05.jpg";
import learner06 from "@/assets/learners/learner-06.jpg";
import learner07 from "@/assets/learners/learner-07.jpg";
import learner08 from "@/assets/learners/learner-08.jpg";
import learner09 from "@/assets/learners/learner-09.jpg";
import learner10 from "@/assets/learners/learner-10.jpg";
import learner11 from "@/assets/learners/learner-11.jpg";
import learner12 from "@/assets/learners/learner-12.jpg";
import learner13 from "@/assets/learners/learner-13.jpg";
import learner14 from "@/assets/learners/learner-14.jpg";
import learner15 from "@/assets/learners/learner-15.jpg";
import learner16 from "@/assets/learners/learner-16.jpg";
import learner17 from "@/assets/learners/learner-17.jpg";
import learner18 from "@/assets/learners/learner-18.jpg";
import learner19 from "@/assets/learners/learner-19.jpg";
import learner20 from "@/assets/learners/learner-20.jpg";
import learner21 from "@/assets/learners/learner-21.jpg";
import learner22 from "@/assets/learners/learner-22.jpg";
import learner23 from "@/assets/learners/learner-23.jpg";
import learner24 from "@/assets/learners/learner-24.jpg";

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
 * CounterStage — Floating learner avatars + ticking 70,000+
 * =========================================================== */

// 24 diverse smiling learner avatars paired with their country flag
const LEARNERS: { img: string; flag: string }[] = [
  { img: learner01, flag: "🇮🇳" },
  { img: learner02, flag: "🇵🇰" },
  { img: learner03, flag: "🇧🇩" },
  { img: learner04, flag: "🇨🇳" },
  { img: learner05, flag: "🇵🇭" },
  { img: learner06, flag: "🇳🇬" },
  { img: learner07, flag: "🇮🇩" },
  { img: learner08, flag: "🇻🇳" },
  { img: learner09, flag: "🇧🇷" },
  { img: learner10, flag: "🇬🇧" },
  { img: learner11, flag: "🇨🇦" },
  { img: learner12, flag: "🇦🇺" },
  { img: learner13, flag: "🇺🇸" },
  { img: learner14, flag: "🇩🇪" },
  { img: learner15, flag: "🇦🇪" },
  { img: learner16, flag: "🇹🇷" },
  { img: learner17, flag: "🇲🇾" },
  { img: learner18, flag: "🇪🇬" },
  { img: learner19, flag: "🇱🇰" },
  { img: learner20, flag: "🇳🇵" },
  { img: learner21, flag: "🇰🇷" },
  { img: learner22, flag: "🇲🇽" },
  { img: learner23, flag: "🇰🇪" },
  { img: learner24, flag: "🇫🇷" },
];

const rainConfig = LEARNERS.map((learner, i) => {
  const rand = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const startX = 4 + rand(i + 1) * 90;
  const restY = 8 + rand(i + 7) * 84; // 8–92% — distributed across full stage
  const rotate = (rand(i + 13) - 0.5) * 30;
  const delay = rand(i + 21) * 1.6;
  const duration = 1.8 + rand(i + 31) * 1.2;
  const size = 56 + Math.floor(rand(i + 41) * 44); // 56–100px avatars
  const driftDur = 7 + rand(i + 51) * 6;
  const driftDelay = -rand(i + 61) * driftDur;
  const bobDur = 3.2 + rand(i + 71) * 2.6;
  const bobDelay = -rand(i + 81) * bobDur;
  const driftAmp = 8 + rand(i + 91) * 14;
  const bobAmp = 6 + rand(i + 101) * 10;
  const swayDeg = 1.5 + rand(i + 111) * 3;
  return {
    ...learner,
    startX,
    restY,
    rotate,
    delay,
    duration,
    size,
    driftDur,
    driftDelay,
    bobDur,
    bobDelay,
    driftAmp,
    bobAmp,
    swayDeg,
  };
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

  // Rich dark blue — adds life without going pure black
  const INK_BLUE = "oklch(0.28 0.09 255)";
  const INK_BLUE_SOFT = "oklch(0.45 0.08 255)";

  return (
    <div className="relative mx-auto mt-8 h-[300px] w-full max-w-5xl sm:h-[380px]">
      {/* Floating learner avatars — drift continuously, behind the number */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {rainConfig.map((f, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${f.startX}%`,
              top: 0,
              opacity: active ? 1 : 0,
              animation: active
                ? `lw-fall ${f.duration}s cubic-bezier(0.34, 1.2, 0.64, 1) ${f.delay}s both`
                : "none",
              ["--rest-y" as string]: `${f.restY}%`,
              ["--rotate" as string]: `${f.rotate}deg`,
            }}
          >
            <span
              className="block"
              style={{
                animation: `lw-drift ${f.driftDur}s ease-in-out ${f.driftDelay}s infinite`,
                ["--drift-amp" as string]: `${f.driftAmp}px`,
              }}
            >
              <span
                className="relative block"
                style={{
                  width: `${f.size}px`,
                  height: `${f.size}px`,
                  animation: `lw-bob ${f.bobDur}s ease-in-out ${f.bobDelay}s infinite`,
                  ["--bob-amp" as string]: `${f.bobAmp}px`,
                  ["--sway-deg" as string]: `${f.swayDeg}deg`,
                  filter:
                    "drop-shadow(0 8px 20px rgba(15,23,42,0.18)) saturate(0.9)",
                }}
              >
                <img
                  src={f.img}
                  alt=""
                  loading="lazy"
                  width={f.size}
                  height={f.size}
                  className="h-full w-full rounded-full object-cover"
                  style={{
                    border: "3px solid oklch(0.99 0.008 85)",
                    opacity: 0.92,
                  }}
                />
                {/* Tiny flag pin */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full"
                  style={{
                    width: `${Math.max(20, f.size * 0.36)}px`,
                    height: `${Math.max(20, f.size * 0.36)}px`,
                    fontSize: `${Math.max(11, f.size * 0.22)}px`,
                    background: "oklch(0.99 0.008 85)",
                    boxShadow: "0 2px 6px rgba(15,23,42,0.18)",
                    lineHeight: 1,
                  }}
                >
                  {f.flag}
                </span>
              </span>
            </span>
          </span>
        ))}
      </div>

      {/* Soft halo behind the number to lift it from the flags */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.97 0.015 85 / 0.85), oklch(0.97 0.015 85 / 0.4) 50%, transparent 75%)",
        }}
      />

      {/* Big ticking counter — dark blue */}
      <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center px-4">
        <div
          className="font-display font-black tabular-nums tracking-tight"
          style={{
            color: INK_BLUE,
            fontSize: "clamp(3.5rem, 11vw, 8rem)",
            lineHeight: 0.92,
            textShadow:
              "0 1px 0 oklch(0.99 0.005 85), 0 4px 30px oklch(0.97 0.015 85 / 0.9)",
          }}
        >
          {formatted}
          <span style={{ color: INK_BLUE_SOFT }}>+</span>
        </div>
        <p
          className="mt-3 font-handwriting text-xl sm:text-2xl"
          style={{ color: INK_BLUE_SOFT, opacity: 0.8 }}
        >
          learners across 47 countries
        </p>
      </div>

      {/* Soft floor */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28"
        style={{
          background:
            "linear-gradient(to top, oklch(0.93 0.03 75 / 0.55), transparent)",
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
      className="relative overflow-hidden py-14 sm:py-20"
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
          <p className="font-handwriting text-2xl text-foreground/55 sm:text-3xl">
            from every corner of the world
          </p>
          <h2 className="mt-2 font-display text-3xl font-black leading-[1.05] tracking-tight text-foreground sm:text-4xl">
            A quiet movement,
            <br />
            <span className="text-foreground/60">growing every day.</span>
          </h2>
        </div>

        {/* The dramatic counter stage */}
        <CounterStage active={inView} />

        <p className="mx-auto mt-6 max-w-2xl text-center font-display text-sm text-foreground/65 sm:text-base">
          A quiet movement of writers, speakers, and readers — preparing for
          their band, in their own time, from their own city.
        </p>
      </div>

      {/* Full-bleed marquee rows */}
      <div
        className="relative mt-10 sm:mt-14"
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
        @keyframes lw-fall {
          0% {
            transform: translate3d(0, -120%, 0) rotate(0deg);
            opacity: 0;
          }
          15% { opacity: 1; }
          70% {
            transform: translate3d(0, var(--rest-y, 80%), 0) rotate(var(--rotate, 0deg));
            opacity: 1;
          }
          85% {
            transform: translate3d(0, calc(var(--rest-y, 80%) - 18px), 0) rotate(var(--rotate, 0deg));
          }
          100% {
            transform: translate3d(0, var(--rest-y, 80%), 0) rotate(var(--rotate, 0deg));
            opacity: 1;
          }
        }
        @keyframes lw-drift {
          0%, 100% { transform: translateX(calc(var(--drift-amp, 12px) * -1)); }
          50%      { transform: translateX(var(--drift-amp, 12px)); }
        }
        @keyframes lw-bob {
          0%, 100% {
            transform: translateY(calc(var(--bob-amp, 10px) * -1)) rotate(calc(var(--sway-deg, 3deg) * -1));
          }
          50% {
            transform: translateY(var(--bob-amp, 10px)) rotate(var(--sway-deg, 3deg));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="lw-marquee"], [style*="lw-fall"], [style*="lw-drift"], [style*="lw-bob"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
