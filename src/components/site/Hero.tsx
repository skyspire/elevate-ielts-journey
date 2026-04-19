import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-academic.jpg";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--brand-soft), transparent 70%)" }}
      />
      <div className="container-page relative grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brand backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Updated weekly · Band 8–9 answers
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            No need to buy{" "}
            <span className="text-gradient-brand">expensive IELTS books.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-semibold text-muted-foreground lg:mx-0">
            Latest questions with Band 8–9 sample answers — updated regularly.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:items-start lg:justify-start">
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
              className="h-12 rounded-full border-border bg-background px-7 text-base font-bold hover:bg-secondary"
            >
              Unlock Full Access
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-muted-foreground lg:justify-start">
            <span>★★★★★ 4.9 from 2,300+ learners</span>
            <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
            <span>Updated monthly</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 translate-y-6 scale-95 rounded-[2rem] bg-brand-soft blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
            <img
              src={heroImage}
              alt="Floating papers, pencil and an open book on a soft blue gradient"
              width={1536}
              height={1152}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
