import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsSection } from "@/lib/admin/cms-store";
import { HERO_KEY, HERO_DEFAULT } from "@/lib/admin/defaults";

/**
 * IslamicHero — Modern Mihrab Minimal.
 * Ivory background, teal-green + muted gold accents, a tall pointed mihrab
 * arch framing the headline, eight-point star ornament, and a calm
 * Assalamu Alaikum greeting.
 */
export function IslamicHero() {
  const hero = useCmsSection(HERO_KEY, HERO_DEFAULT);

  const teal = "oklch(0.42 0.07 175)";
  const tealSoft = "oklch(0.55 0.06 175)";
  const gold = "oklch(0.72 0.11 80)";
  const ivory = "oklch(0.985 0.008 90)";

  return (
    <section className="relative isolate overflow-hidden">
      {/* Ivory wash with faint teal halo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            `radial-gradient(ellipse 60% 45% at 50% 0%, oklch(0.94 0.04 175 / 0.55) 0%, transparent 65%),` +
            `radial-gradient(ellipse 70% 55% at 50% 100%, oklch(0.93 0.05 85 / 0.4) 0%, transparent 65%),` +
            `linear-gradient(180deg, ${ivory} 0%, oklch(0.97 0.012 85) 100%)`,
        }}
      />

      {/* Subtle eight-point-star tile pattern */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.08]"
      >
        <defs>
          <pattern id="islamic-star" width="64" height="64" patternUnits="userSpaceOnUse">
            <g fill="none" stroke={teal} strokeWidth="1">
              <path d="M32 4 L40 24 L60 32 L40 40 L32 60 L24 40 L4 32 L24 24 Z" />
              <path d="M32 4 L32 60 M4 32 L60 32 M12 12 L52 52 M52 12 L12 52" opacity="0.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star)" />
      </svg>

      <div className="container-page relative z-10 flex flex-col items-center py-24 text-center md:py-32 lg:py-40">
        {/* Mihrab arch behind the headline */}
        <div className="relative w-full max-w-3xl">
          <svg
            aria-hidden
            viewBox="0 0 600 520"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 -z-10 mx-auto h-[110%] w-[92%] sm:w-[78%]"
          >
            <defs>
              <linearGradient id="archStroke" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={gold} />
                <stop offset="100%" stopColor={teal} />
              </linearGradient>
              <linearGradient id="archFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.96 0.03 175 / 0.55)" />
                <stop offset="100%" stopColor="oklch(0.98 0.012 90 / 0)" />
              </linearGradient>
            </defs>
            {/* Pointed (ogee) mihrab arch */}
            <path
              d="M60 510 L60 280 Q 60 120, 300 30 Q 540 120, 540 280 L540 510 Z"
              fill="url(#archFill)"
              stroke="url(#archStroke)"
              strokeWidth="2.5"
            />
            {/* Inner thin arch line */}
            <path
              d="M82 510 L82 286 Q 82 138, 300 56 Q 518 138, 518 286 L518 510"
              fill="none"
              stroke={tealSoft}
              strokeWidth="1"
              opacity="0.55"
            />
          </svg>

          {/* Crowning star ornament */}
          <svg
            aria-hidden
            viewBox="0 0 64 64"
            className="mx-auto h-10 w-10 opacity-90"
          >
            <path
              d="M32 4 L40 24 L60 32 L40 40 L32 60 L24 40 L4 32 L24 24 Z"
              fill="none"
              stroke={gold}
              strokeWidth="2"
            />
            <circle cx="32" cy="32" r="4" fill={gold} />
          </svg>

          {/* Greeting eyebrow */}
          <p
            className="mt-6 font-handwriting text-2xl sm:text-3xl"
            style={{ color: teal }}
          >
            ٱلسَّلَامُ عَلَيْكُمْ · Assalamu Alaikum
          </p>

          {/* Headline */}
          <h1
            className="mt-4 font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: "oklch(0.22 0.04 175)" }}
          >
            {hero.headlinePrefix}{" "}
            <span className="relative inline-block">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(100deg, ${teal} 0%, ${gold} 100%)`,
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

          {/* Subline tailored for Muslim learners */}
          <p className="mx-auto mt-7 max-w-xl text-base text-foreground/70 sm:text-lg">
            A calm, distraction-free IELTS journey — Band 8–9 sample answers,
            updated regularly, crafted with care for our Muslim learners
            worldwide. <span className="italic">In shā’ Allāh, your best score awaits.</span>
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button
              size="lg"
              className="group h-12 rounded-full px-7 text-base font-bold text-white shadow-lg hover:opacity-95"
              style={{
                backgroundImage: `linear-gradient(100deg, ${teal} 0%, oklch(0.35 0.08 175) 100%)`,
              }}
            >
              {hero.primaryCta}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full px-7 text-base font-bold"
              style={{ borderColor: gold, color: teal, backgroundColor: "white" }}
            >
              {hero.secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
