import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";

export function SamplePreview() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="Sample answer preview"
          title="Read a teaser. Unlock the full Band 9."
          description="Every answer is hand-written by IELTS instructors and graded with vocabulary, structure, and common-mistake notes."
        />

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
          <div className="flex items-center justify-between gap-3 bg-brand-soft px-6 py-4">
            <span className="text-sm font-extrabold uppercase tracking-wider text-brand">
              Writing Task 2 · Environment
            </span>
            <span className="rounded-full bg-background px-3 py-1 text-xs font-extrabold text-brand">
              Band 9.0
            </span>
          </div>

          <div className="space-y-6 p-8 sm:p-10">
            <h3 className="font-display text-2xl font-extrabold tracking-tight">
              "Some people believe individuals can do little to protect the environment. To what
              extent do you agree?"
            </h3>

            <div className="relative">
              <div className="space-y-4 text-base font-medium leading-relaxed text-foreground/90">
                <p>
                  It is often argued that environmental protection is the sole responsibility of
                  governments and large corporations, leaving ordinary citizens with a negligible
                  role to play. While I acknowledge that systemic change requires top-down action,
                  I firmly disagree with the notion that individual contributions are inconsequential.
                </p>
                <p>
                  To begin with, the cumulative impact of personal choices is far from trivial.
                  When millions of households reduce single-use plastics, conserve energy, or opt
                  for plant-based meals even occasionally, the resulting decline in demand…
                </p>
              </div>

              {/* Blurred locked content */}
              <div className="relative mt-4">
                <div
                  className="space-y-4 text-base font-medium leading-relaxed text-foreground/80 select-none"
                  style={{ filter: "blur(6px)" }}
                  aria-hidden
                >
                  <p>
                    Furthermore, grassroots movements have repeatedly demonstrated that civic
                    engagement can pressure policymakers into legislative reform, as evidenced by
                    several climate referenda in the past decade.
                  </p>
                  <p>
                    Critics may counter that individual action is a distraction from corporate
                    accountability, yet this is a false dichotomy that overlooks the…
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-glow">
                    <Lock className="h-5 w-5" />
                  </span>
                  <p className="font-display text-lg font-extrabold">
                    Unlock the full Band 9.0 answer
                  </p>
                  <Button className="rounded-full bg-brand font-bold text-brand-foreground hover:bg-brand/90">
                    <Sparkles className="mr-1 h-4 w-4" />
                    Subscribe to read
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
