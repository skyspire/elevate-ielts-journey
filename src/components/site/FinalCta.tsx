import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * FinalCta — confident closing band before the footer.
 * Big editorial type, brand-toned, no pills, no micro-text.
 */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-brand py-16 text-brand-foreground sm:py-20">
      {/* Softly glowing background blooms — subtle, not gradient-heavy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 20%, oklch(0.72 0.15 255 / 0.55), transparent 60%)," +
            "radial-gradient(ellipse 55% 45% at 85% 80%, oklch(0.5 0.18 280 / 0.5), transparent 60%)",
        }}
      />
      {/* Fine dot grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, oklch(1 0 0) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-handwriting text-2xl text-brand-foreground/75 sm:text-3xl">
            ready when you are
          </p>
          <h2 className="mt-2 font-display text-4xl font-black leading-[1.05] tracking-tight text-brand-foreground sm:text-5xl md:text-6xl">
            Stop guessing.
            <br />
            Start scoring{" "}
            <span className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-x-[-8px] bottom-1 -z-0 h-[26%] -rotate-1 rounded-sm"
                style={{
                  background:
                    "linear-gradient(120deg, oklch(0.85 0.16 75 / 0.85), oklch(0.78 0.18 55 / 0.85))",
                }}
              />
              <span className="relative z-10">Band 8+.</span>
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-display text-base font-medium leading-relaxed text-brand-foreground/80 sm:text-lg">
            Sign up free and unlock 6 hand-picked Band 9 model answers in
            seconds. Upgrade when — and only when — you're ready.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-brand-foreground px-7 text-base font-extrabold text-brand hover:bg-brand-foreground/95"
            >
              <Link to="/dashboard">
                Start free
                <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-brand-foreground/40 bg-transparent px-7 text-base font-extrabold text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
            >
              <Link to="/recent-exam-questions">Browse questions</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
