import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Hero — hand-drawn artistic centerpiece.
 * Layered: warm cream wash → soft radial halos → ruled-paper hint →
 * animated SVG doodles (open book, pencil, sparkles, arrows, stars) →
 * headline with hand-drawn ink underline → CTA pair.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Warm cream + radial halo wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 18% 12%, oklch(0.95 0.05 55 / 0.7) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 88% 18%, oklch(0.93 0.07 25 / 0.5) 0%, transparent 60%)," +
            "radial-gradient(ellipse 75% 55% at 50% 100%, oklch(0.94 0.05 75 / 0.55) 0%, transparent 65%)," +
            "linear-gradient(180deg, oklch(0.99 0.008 75) 0%, oklch(0.975 0.018 60) 100%)",
        }}
      />
      {/* Subtle grain for premium depth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.35] mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.4 0.05 60 / 0.18) 1px, transparent 1.2px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* === Floating hand-drawn doodles === */}
      <HeroDoodles />

      <div className="container-page relative z-10 flex flex-col items-center py-24 text-center md:py-32 lg:py-40">
        {/* Headline */}

        <h1 className="relative font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          No need to buy{" "}
          <span className="relative inline-block">
            <span className="text-gradient-shimmer">expensive IELTS books.</span>
            {/* hand-drawn ink underline */}
            <svg
              aria-hidden
              viewBox="0 0 320 18"
              preserveAspectRatio="none"
              className="absolute -bottom-3 left-0 h-3 w-full"
            >
              <path
                d="M4 11 C 60 4, 130 16, 200 8 S 300 6, 316 12"
                fill="none"
                stroke="oklch(0.6 0.2 30)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="hero-underline"
              />
            </svg>
          </span>
        </h1>

        {/* Handwritten subtitle */}
        <p className="mx-auto mt-3 font-handwriting text-2xl text-brand sm:text-3xl">
          everything you need, free &amp; fresh
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-muted-foreground sm:text-xl">
          Latest questions with Band 8–9 sample answers — drawn from real exams,
          updated regularly.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="group h-12 rounded-full bg-brand px-7 text-base font-bold text-brand-foreground shadow-glow hover:bg-brand/90"
          >
            View Recent Questions
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-border bg-background/80 px-7 text-base font-bold backdrop-blur hover:bg-secondary"
          >
            Unlock Full Access
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Decorative hand-drawn doodles, scattered around the headline.
   All SVGs use a single ink color and animate gently.
   ============================================================ */
function HeroDoodles() {
  const ink = "oklch(0.4 0.06 60)";
  const rose = "oklch(0.6 0.2 30)";
  const mint = "oklch(0.55 0.12 165)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Open book — top left */}
      <svg
        viewBox="0 0 120 90"
        className="hero-drift-y absolute left-[5%] top-[16%] hidden h-20 w-28 opacity-80 lg:block"
        style={{ ["--r" as any]: "-6deg" }}
      >
        <g fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 20 L60 30 L60 80 L10 70 Z" className="hero-draw" style={{ ["--dash" as any]: 240 }} />
          <path d="M110 20 L60 30 L60 80 L110 70 Z" className="hero-draw" style={{ ["--dash" as any]: 240, animationDelay: "0.2s" }} />
          <path d="M22 42 L52 48 M24 54 L52 58" stroke={ink} strokeWidth="1.4" opacity="0.55" />
          <path d="M68 48 L98 42 M68 58 L98 54" stroke={ink} strokeWidth="1.4" opacity="0.55" />
        </g>
      </svg>

      {/* Curly arrow — bottom left */}
      <svg
        viewBox="0 0 160 90"
        className="absolute bottom-[18%] left-[6%] hidden h-20 w-36 opacity-70 lg:block"
      >
        <g fill="none" stroke={mint} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M10 80 Q 40 60, 70 70 T 130 30"
            className="hero-draw"
            style={{ ["--dash" as any]: 220, animationDelay: "0.4s" }}
          />
          <path
            d="M120 24 L132 30 L126 42"
            className="hero-draw"
            style={{ ["--dash" as any]: 60, animationDelay: "1.2s" }}
          />
        </g>
      </svg>

      {/* Single star — top right */}
      <svg
        viewBox="0 0 60 60"
        className="hero-twinkle absolute right-[8%] top-[20%] hidden h-10 w-10 opacity-80 md:block"
      >
        <path
          d="M30 6 L33 26 L52 30 L33 34 L30 54 L27 34 L8 30 L27 26 Z"
          fill={rose}
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
