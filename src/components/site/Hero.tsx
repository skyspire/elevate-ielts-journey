import { ArrowRight, Sparkles } from "lucide-react";
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
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-soft backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-brand" />
          Hand-curated • Updated weekly
        </div>

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
          everything you need, free &amp; fresh ✦
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

        {/* Trust pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: "oklch(0.65 0.15 165)" }} />
            12,000+ learners
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: "oklch(0.7 0.16 70)" }} />
            Band 8–9 samples
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand" />
            No signup needed
          </span>
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
  const ink = "oklch(0.35 0.06 60)";
  const rose = "oklch(0.6 0.2 25)";
  const ocean = "oklch(0.55 0.15 230)";
  const mint = "oklch(0.55 0.12 165)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Open book — top left */}
      <svg
        viewBox="0 0 120 90"
        className="hero-drift-y absolute left-[4%] top-[14%] hidden h-24 w-32 md:block"
        style={{ ["--r" as any]: "-6deg" }}
      >
        <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 20 L60 30 L60 80 L10 70 Z" className="hero-draw" style={{ ["--dash" as any]: 240 }} />
          <path d="M110 20 L60 30 L60 80 L110 70 Z" className="hero-draw" style={{ ["--dash" as any]: 240, animationDelay: "0.2s" }} />
          <path d="M20 36 L52 42 M22 46 L52 52 M24 56 L52 60" stroke={ocean} strokeWidth="1.6" />
          <path d="M68 42 L100 36 M68 52 L100 46 M68 60 L100 56" stroke={ocean} strokeWidth="1.6" />
        </g>
      </svg>

      {/* Pencil — top right */}
      <svg
        viewBox="0 0 140 60"
        className="hero-drift-x absolute right-[5%] top-[10%] hidden h-16 w-36 md:block"
        style={{ ["--r" as any]: "12deg" }}
      >
        <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 30 L100 30" className="hero-draw" style={{ ["--dash" as any]: 100 }} />
          <path d="M10 22 L100 22 L115 30 L100 38 L10 38 Z" fill="oklch(0.92 0.08 80)" />
          <path d="M115 30 L130 30" stroke={rose} strokeWidth="3" />
          <path d="M10 22 L10 38" />
          <path d="M22 22 L22 38 M34 22 L34 38 M46 22 L46 38" stroke="oklch(0.4 0.05 60 / 0.4)" strokeWidth="1" />
        </g>
      </svg>

      {/* Star burst — left mid */}
      <svg
        viewBox="0 0 60 60"
        className="hero-twinkle absolute left-[10%] top-[44%] h-10 w-10"
      >
        <path
          d="M30 6 L33 26 L52 30 L33 34 L30 54 L27 34 L8 30 L27 26 Z"
          fill={rose}
          opacity="0.85"
        />
      </svg>

      {/* Sparkle outline — right mid */}
      <svg
        viewBox="0 0 60 60"
        className="hero-twinkle absolute right-[12%] top-[40%] h-12 w-12"
        style={{ animationDelay: "0.6s" }}
      >
        <path
          d="M30 4 L32 28 L56 30 L32 32 L30 56 L28 32 L4 30 L28 28 Z"
          fill="none"
          stroke={ocean}
          strokeWidth="2"
        />
      </svg>

      {/* Curly arrow pointing to headline — bottom left */}
      <svg
        viewBox="0 0 160 90"
        className="absolute bottom-[16%] left-[6%] hidden h-24 w-40 lg:block"
      >
        <g fill="none" stroke={mint} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Coffee cup doodle — bottom right */}
      <svg
        viewBox="0 0 100 90"
        className="hero-drift-y absolute bottom-[14%] right-[8%] hidden h-24 w-24 lg:block"
        style={{ ["--r" as any]: "4deg" }}
      >
        <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 35 L20 75 Q 20 82, 28 82 L62 82 Q 70 82, 70 75 L70 35 Z" fill="oklch(0.94 0.04 55)" />
          <path d="M70 45 Q 86 45, 86 58 Q 86 70, 70 70" />
          <path d="M30 20 Q 32 14, 30 8 M42 20 Q 44 14, 42 8 M54 20 Q 56 14, 54 8" stroke={ocean} />
        </g>
      </svg>

      {/* Tiny dots scattered */}
      <svg viewBox="0 0 20 20" className="absolute left-[28%] top-[22%] h-3 w-3 hero-twinkle">
        <circle cx="10" cy="10" r="4" fill={rose} />
      </svg>
      <svg viewBox="0 0 20 20" className="absolute right-[26%] top-[68%] h-3 w-3 hero-twinkle" style={{ animationDelay: "1s" }}>
        <circle cx="10" cy="10" r="4" fill={mint} />
      </svg>
      <svg viewBox="0 0 20 20" className="absolute left-[40%] bottom-[10%] h-2.5 w-2.5 hero-twinkle" style={{ animationDelay: "0.4s" }}>
        <circle cx="10" cy="10" r="4" fill={ocean} />
      </svg>

      {/* Cross marks */}
      <svg viewBox="0 0 30 30" className="absolute right-[18%] top-[18%] h-5 w-5 hero-wiggle">
        <path d="M6 6 L24 24 M24 6 L6 24" stroke={rose} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </svg>
      <svg viewBox="0 0 30 30" className="absolute left-[20%] bottom-[28%] h-4 w-4 hero-wiggle" style={{ animationDelay: "0.8s" }}>
        <path d="M6 6 L24 24 M24 6 L6 24" stroke={ocean} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
