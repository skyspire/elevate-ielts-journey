import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsSection } from "@/lib/admin/cms-store";
import { HERO_KEY, HERO_DEFAULT } from "@/lib/admin/defaults";

/**
 * IslamicHero — Madinah Night Sky.
 * Full-bleed deep emerald sky with a soft starfield, luminous gold crescent
 * in the corner, a tall gold mihrab arch behind the headline, and a calm
 * calligraphic ribbon at the top.
 */
export function IslamicHero() {
  const hero = useCmsSection(HERO_KEY, HERO_DEFAULT);

  const gold = "#d4af48";
  const goldSoft = "#e8c97a";

  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed deep emerald night sky */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #0e5a44 0%, #073d2c 55%, #042a1f 100%)",
        }}
      />

      {/* Soft starfield */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full"
      >
        <defs>
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="#fff8d8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fff8d8" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 70 }).map((_, i) => {
          const x = (i * 137.5) % 100;
          const y = (i * 73.3) % 100;
          const r = (i % 5) * 0.4 + 0.6;
          const o = 0.4 + ((i * 17) % 60) / 100;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              fill="#fff8d8"
              opacity={o}
            />
          );
        })}
        {/* A few bright halo stars */}
        {[
          [12, 22],
          [78, 18],
          [88, 62],
          [22, 70],
          [55, 12],
        ].map(([x, y], i) => (
          <circle
            key={`g${i}`}
            cx={`${x}%`}
            cy={`${y}%`}
            r="8"
            fill="url(#starGlow)"
          />
        ))}
      </svg>

      {/* Luminous gold crescent — top right */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute right-4 top-8 -z-10 h-32 w-32 sm:right-12 sm:top-12 sm:h-44 sm:w-44"
      >
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={goldSoft} stopOpacity="0.55" />
            <stop offset="70%" stopColor={gold} stopOpacity="0.05" />
            <stop offset="100%" stopColor={gold} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="url(#moonGlow)" />
        <path
          d="M130 100 a 50 50 0 1 1 -35 -48 a 40 40 0 1 0 35 48 Z"
          fill={gold}
          opacity="0.92"
        />
        {/* small companion star */}
        <path
          d="M165 75 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z"
          fill={goldSoft}
        />
      </svg>

      {/* Bismillah calligraphy ribbon at top */}
      <div className="relative z-10 pt-8 text-center sm:pt-12">
        <p
          className="text-2xl sm:text-3xl"
          style={{ color: goldSoft, fontFamily: "'Noto Naskh Arabic', 'Amiri', serif" }}
        >
          ﷽
        </p>
      </div>

      <div className="container-page relative z-10 flex flex-col items-center py-20 text-center md:py-28 lg:py-32">
        <div className="relative w-full max-w-3xl">
          {/* Gold mihrab arch */}
          <svg
            aria-hidden
            viewBox="0 0 600 520"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 -z-10 mx-auto h-[115%] w-[95%] sm:w-[82%]"
          >
            <defs>
              <linearGradient id="archGoldStroke" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={goldSoft} />
                <stop offset="100%" stopColor={gold} stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="archGoldFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={gold} stopOpacity="0.10" />
                <stop offset="100%" stopColor={gold} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M60 510 L60 280 Q 60 110, 300 20 Q 540 110, 540 280 L540 510 Z"
              fill="url(#archGoldFill)"
              stroke="url(#archGoldStroke)"
              strokeWidth="2.5"
            />
            <path
              d="M82 510 L82 286 Q 82 130, 300 48 Q 518 130, 518 286 L518 510"
              fill="none"
              stroke={gold}
              strokeWidth="1"
              opacity="0.45"
            />
          </svg>

          {/* Greeting */}
          <p
            className="font-handwriting text-2xl sm:text-3xl"
            style={{ color: goldSoft }}
          >
            ٱلسَّلَامُ عَلَيْكُمْ · Assalamu Alaikum
          </p>

          {/* Headline */}
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            {hero.headlinePrefix}{" "}
            <span className="relative inline-block">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(100deg, ${goldSoft} 0%, ${gold} 100%)`,
                }}
              >
                {hero.headlineHighlight}
              </span>
              <svg
                aria-hidden
                viewBox="0 0 240 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full"
              >
                <path
                  d="M3 9 C 50 3, 120 13, 180 6 S 230 5, 237 10"
                  fill="none"
                  stroke={gold}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            {hero.headlineSuffix}
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-base text-white/80 sm:text-lg">
            A calm, distraction-free IELTS journey — Band 8–9 sample answers,
            updated regularly, crafted with care for our Muslim learners
            worldwide.{" "}
            <span className="italic" style={{ color: goldSoft }}>
              In shā’ Allāh, your best score awaits.
            </span>
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button
              size="lg"
              className="group h-12 rounded-full px-7 text-base font-bold shadow-[0_18px_50px_-12px_rgba(212,175,72,0.55)] hover:opacity-95"
              style={{
                backgroundImage: `linear-gradient(100deg, ${goldSoft} 0%, ${gold} 100%)`,
                color: "#063b2b",
              }}
            >
              {hero.primaryCta}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/40 bg-white/10 px-7 text-base font-bold text-white backdrop-blur hover:bg-white/20"
            >
              {hero.secondaryCta}
            </Button>
          </div>
        </div>
      </div>

      {/* Gold ornamental bottom border */}
      <div className="relative z-10 mt-2">
        <IslamicDivider color={gold} bg="transparent" />
      </div>
    </section>
  );
}

/* Reusable Islamic divider — gold eight-point star chain on a thin line. */
export function IslamicDivider({
  color = "#c9a84c",
  bg = "transparent",
}: {
  color?: string;
  bg?: string;
}) {
  return (
    <div className="w-full py-6" style={{ background: bg }}>
      <svg
        aria-hidden
        viewBox="0 0 400 24"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto h-6 w-full max-w-3xl"
      >
        <g stroke={color} strokeWidth="1" fill="none">
          <line x1="0" y1="12" x2="160" y2="12" />
          <line x1="240" y1="12" x2="400" y2="12" />
        </g>
        <g transform="translate(180,0)" stroke={color} strokeWidth="1.4" fill="none">
          <path d="M20 2 L26 14 L38 12 L28 20 L32 32 L20 24 L8 32 L12 20 L2 12 L14 14 Z" />
          <circle cx="20" cy="12" r="2.5" fill={color} />
        </g>
      </svg>
    </div>
  );
}
