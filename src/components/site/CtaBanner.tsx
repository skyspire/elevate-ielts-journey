import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16 sm:py-20"
          style={{ background: "var(--gradient-cta)" }}
        >
          <div
            aria-hidden
            className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
          />
          <h2 className="relative font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Stop guessing. Start scoring Band 8+.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-base font-medium text-white/85 sm:text-lg">
            Join thousands of candidates studying with the most up-to-date IELTS question bank.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full bg-white px-7 text-base font-bold text-brand hover:bg-white/90"
            >
              Start your subscription
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/40 bg-transparent px-7 text-base font-bold text-white hover:bg-white/10 hover:text-white"
            >
              View free samples
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
