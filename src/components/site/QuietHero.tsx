import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * QuietHero — Neat, calm, editorial hero in the same spirit as LearnersWorld.
 *
 * Recipe (matches LearnersWorld DNA):
 *  - Lots of breathing room, centered composition
 *  - One bold statement (the headline) sits like the "70,000+"
 *  - One handwritten accent above (eyebrow) + one quiet supporting line
 *  - Soft cream paper background — no shouting gradients
 *  - Gentle peripheral drift (paper snippets) — never near the text
 */
export function QuietHero() {
  return (
    <section className="relative isolate overflow-hidden bg-paper-cream">
      {/* Quiet peripheral drift — far from text, soft & slow */}
      <PeripheralPapers />

      <div className="container-page relative z-10 flex flex-col items-center py-28 text-center md:py-36 lg:py-44">
        {/* Handwritten eyebrow */}
        <p className="font-handwriting text-2xl text-brand/80 sm:text-3xl">
          free &amp; fresh, always
        </p>

        {/* The big calm statement */}
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          No need to buy{" "}
          <span className="relative inline-block">
            <span className="text-gradient-shimmer">expensive</span>
            <svg
              aria-hidden
              viewBox="0 0 240 14"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-2.5 w-full"
            >
              <path
                d="M3 9 C 50 3, 120 13, 180 6 S 230 5, 237 10"
                fill="none"
                stroke="oklch(0.6 0.2 30)"
                strokeWidth="3"
                strokeLinecap="round"
                className="hero-underline"
              />
            </svg>
          </span>{" "}
          IELTS books.
        </h1>

        {/* Quiet supporting line */}
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl">
          Latest questions with Band 8–9 sample answers — drawn from real exams,
          updated regularly.
        </p>

        {/* Calm CTA pair */}
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
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
   Peripheral paper snippets — drift far from the text.
   Same calm motion soul as LearnersWorld avatars.
   ============================================================ */
function PeripheralPapers() {
  // Positioned only at the edges — never near the centered headline.
  const papers = [
    { top: "12%", left: "4%", rotate: -8, w: 88, delay: "0s", dur: "11s" },
    { top: "22%", right: "5%", rotate: 6, w: 96, delay: "1.4s", dur: "13s" },
    { bottom: "16%", left: "6%", rotate: 4, w: 92, delay: "0.6s", dur: "12s" },
    { bottom: "22%", right: "7%", rotate: -6, w: 84, delay: "2.1s", dur: "14s" },
    { top: "48%", left: "2%", rotate: -3, w: 70, delay: "1.1s", dur: "15s" },
    { top: "52%", right: "2%", rotate: 5, w: 74, delay: "0.3s", dur: "12.5s" },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {papers.map((p, i) => (
        <div
          key={i}
          className="qh-float absolute"
          style={{
            top: p.top,
            bottom: p.bottom,
            left: p.left,
            right: p.right,
            width: `${p.w}px`,
            ["--rot" as any]: `${p.rotate}deg`,
            ["--dur" as any]: p.dur,
            animationDelay: p.delay,
          }}
        >
          <PaperSnippet variant={i % 3} />
        </div>
      ))}

      <style>{`
        @keyframes qh-float {
          0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
          50%      { transform: translateY(-10px) rotate(calc(var(--rot, 0deg) + 1.5deg)); }
        }
        .qh-float {
          animation: qh-float var(--dur, 12s) ease-in-out infinite;
          opacity: 0.55;
          filter: drop-shadow(0 6px 14px oklch(0.4 0.05 60 / 0.12));
        }
      `}</style>
    </div>
  );
}

function PaperSnippet({ variant }: { variant: number }) {
  // Three quiet variants: ruled note, sticky note, index card.
  if (variant === 0) {
    // Ruled notebook page
    return (
      <svg viewBox="0 0 100 80" className="h-auto w-full">
        <rect x="2" y="2" width="96" height="76" rx="3" fill="oklch(0.985 0.012 75)" stroke="oklch(0.4 0.05 60 / 0.25)" strokeWidth="1" />
        <line x1="14" y1="2" x2="14" y2="78" stroke="oklch(0.6 0.2 30 / 0.4)" strokeWidth="0.8" />
        {[20, 30, 40, 50, 60, 70].map((y) => (
          <line key={y} x1="18" y1={y} x2="92" y2={y} stroke="oklch(0.55 0.05 250 / 0.2)" strokeWidth="0.5" />
        ))}
        <path d="M20 24 L60 24 M20 34 L70 34 M20 44 L55 44" stroke="oklch(0.4 0.06 60 / 0.5)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 1) {
    // Sticky note
    return (
      <svg viewBox="0 0 100 90" className="h-auto w-full">
        <rect x="3" y="3" width="94" height="84" fill="oklch(0.94 0.08 95)" stroke="oklch(0.4 0.05 60 / 0.15)" strokeWidth="0.5" />
        <path d="M3 3 L14 3 L3 14 Z" fill="oklch(0.88 0.08 95)" />
        <path d="M16 26 L80 26 M16 38 L72 38 M16 50 L78 50 M16 62 L60 62" stroke="oklch(0.4 0.06 60 / 0.55)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  // Index card with a band score
  return (
    <svg viewBox="0 0 100 70" className="h-auto w-full">
      <rect x="2" y="2" width="96" height="66" rx="2" fill="oklch(0.99 0.005 250)" stroke="oklch(0.4 0.05 60 / 0.25)" strokeWidth="1" />
      <line x1="2" y1="18" x2="98" y2="18" stroke="oklch(0.6 0.2 30 / 0.5)" strokeWidth="0.7" />
      <text x="50" y="48" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="800" fill="oklch(0.58 0.17 255)">8.5</text>
    </svg>
  );
}
