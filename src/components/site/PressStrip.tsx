// PressStrip — "As seen in / trusted by" social-proof band.
// Shows a row of community/publication wordmarks below the hero.
// Content is admin-editable via /admin/press.

import { useCmsSection } from "@/lib/admin/cms-store";
import { PRESS_KEY, PRESS_DEFAULT, type PressContent } from "@/lib/admin/defaults";

export function PressStrip() {
  const data = useCmsSection<PressContent>(PRESS_KEY, PRESS_DEFAULT);
  if (!data.enabled || data.logos.length === 0) return null;

  return (
    <section
      aria-label="Featured in"
      className="border-y border-border/60 bg-muted/30 py-8 sm:py-10"
    >
      <div className="container-page">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
          {data.eyebrow}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:mt-6 sm:gap-x-12">
          {data.logos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="group flex flex-col items-center text-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              <span className="font-display text-base font-black tracking-tight text-foreground sm:text-lg">
                {logo.name}
              </span>
              {logo.kind && (
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {logo.kind}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
