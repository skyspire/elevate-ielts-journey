import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoodleAccents } from "./PaperAccents";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-paper-cream">
      <DoodleAccents density="normal" />

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
