import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsSection } from "@/lib/admin/cms-store";
import { HERO_KEY, HERO_DEFAULT } from "@/lib/admin/defaults";

/**
 * QuietHero — Royal gradient hero. Clean: no floating objects, no grain.
 */
export function QuietHero() {
  const hero = useCmsSection(HERO_KEY, HERO_DEFAULT);
  return (
    <section className="relative isolate overflow-hidden">
      {/* Royal gradient — deep indigo → violet → midnight, with champagne glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 8%, oklch(0.55 0.12 290 / 0.85) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 45% at 90% 14%, oklch(0.42 0.16 295 / 0.9) 0%, transparent 60%)," +
            "radial-gradient(ellipse 75% 55% at 50% 105%, oklch(0.32 0.12 305 / 0.85) 0%, transparent 65%)," +
            "radial-gradient(ellipse 35% 30% at 78% 60%, oklch(0.7 0.13 75 / 0.25) 0%, transparent 60%)," +
            "linear-gradient(140deg, oklch(0.28 0.1 285) 0%, oklch(0.32 0.13 295) 50%, oklch(0.26 0.11 305) 100%)",
        }}
      />
      {/* Champagne gold halo at top center */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[55%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, oklch(0.85 0.1 80 / 0.18) 0%, transparent 70%)",
        }}
      />

      <div className="container-page relative z-10 flex flex-col items-center py-28 text-center md:py-36 lg:py-44">
        {/* Handwritten eyebrow */}
        <p className="font-handwriting text-2xl text-amber-200/90 sm:text-3xl">
          {hero.eyebrow}
        </p>

        {/* The big calm statement */}
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-[0_2px_24px_oklch(0.2_0.1_290_/_0.5)]">
          {hero.headlinePrefix}{" "}
          <span className="relative inline-block">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, oklch(0.92 0.1 85) 0%, oklch(0.85 0.14 75) 45%, oklch(0.95 0.08 90) 100%)",
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
                stroke="oklch(0.85 0.14 75)"
                strokeWidth="3"
                strokeLinecap="round"
                className="hero-underline"
              />
            </svg>
          </span>{" "}
          {hero.headlineSuffix}
        </h1>

        {/* Quiet supporting line */}
        <p className="mx-auto mt-8 max-w-xl text-lg text-white/75 sm:text-xl">
          {hero.subline}
        </p>

        {/* Calm CTA pair */}
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="group h-12 rounded-full px-7 text-base font-bold text-[oklch(0.22_0.1_290)] shadow-[0_18px_50px_-12px_oklch(0.85_0.14_75/0.55)] hover:opacity-95"
            style={{
              backgroundImage:
                "linear-gradient(100deg, oklch(0.92 0.1 85) 0%, oklch(0.82 0.14 75) 100%)",
            }}
          >
            {hero.primaryCta}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white/30 bg-white/10 px-7 text-base font-bold text-white backdrop-blur hover:bg-white/20"
          >
            {hero.secondaryCta}
          </Button>
        </div>
      </div>
    </section>
  );
}
