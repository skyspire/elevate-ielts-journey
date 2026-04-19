import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Dotted grid */}
      <div aria-hidden className="absolute inset-0 bg-dot-grid opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />

      {/* Colorful glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[640px] w-[640px] rounded-full opacity-70 blur-3xl animate-glow-pulse"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.7 0.2 265 / 0.55), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 -z-0 h-72 w-72 rounded-full bg-[oklch(0.85_0.15_320/0.45)] blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 -z-0 h-80 w-80 rounded-full bg-[oklch(0.85_0.14_180/0.4)] blur-3xl animate-float-slow"
        style={{ animationDelay: "-4s" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 -z-0 h-72 w-72 rounded-full bg-[oklch(0.88_0.13_70/0.4)] blur-3xl animate-float-slow"
        style={{ animationDelay: "-2s" }}
      />

      <div className="container-page relative z-10 flex flex-col items-center py-24 text-center md:py-32 lg:py-40">
        <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          No need to buy{" "}
          <span className="text-gradient-shimmer">expensive IELTS books.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold text-muted-foreground sm:text-xl">
          Latest questions with Band 8–9 sample answers — updated regularly.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="h-12 rounded-full bg-brand px-7 text-base font-bold text-brand-foreground shadow-glow hover:bg-brand/90"
          >
            View Recent Questions
            <ArrowRight className="ml-1 h-4 w-4" />
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
