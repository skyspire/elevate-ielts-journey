import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QuietHero } from "@/components/site/QuietHero";
import { EverythingYouNeed } from "@/components/site/EverythingYouNeed";
import { Stats } from "@/components/site/Stats";
import { ValueStatement } from "@/components/site/ValueStatement";

import { TrustCompare } from "@/components/site/TrustCompare";
import { TryFreeSection } from "@/components/site/TryFreeSection";
import { LatestQuestions } from "@/components/site/LatestQuestions";
import { LearnersWorld } from "@/components/site/LearnersWorld";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";

import { Footer } from "@/components/site/Footer";
import { useHomepageLayout } from "@/lib/admin/site-settings";

const IELTS_PICKER_PREVIEWS = [
  {
    label: "A",
    name: "Flat illustration",
    academic: "/picker-options/picker_academic_flat.jpg",
    general: "/picker-options/picker_general_flat.jpg",
  },
  {
    label: "B",
    name: "3D clay render",
    academic: "/picker-options/picker_academic_3d.jpg",
    general: "/picker-options/picker_general_3d.jpg",
  },
  {
    label: "C",
    name: "Cinematic photo",
    academic: "/picker-options/picker_academic_photo.jpg",
    general: "/picker-options/picker_general_photo.jpg",
  },
];

export const Route = createFileRoute("/")({
  component: Index,
});

const SECTION_MAP: Record<string, React.ComponentType> = {
  hero: QuietHero,
  everything: EverythingYouNeed,
  stats: Stats,
  value: ValueStatement,
  trust: TrustCompare,
  tryfree: TryFreeSection,
  latest: LatestQuestions,
  world: LearnersWorld,
  faq: Faq,
  finalcta: FinalCta,
};

function Index() {
  const layout = useHomepageLayout();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <section className="bg-background px-4 py-4">
          <div className="mx-auto max-w-5xl">
            <h1 className="mb-3 text-center font-display text-2xl font-black text-foreground">
              Choose preview option A, B, or C
            </h1>
            <div className="grid gap-3 sm:grid-cols-3">
              {IELTS_PICKER_PREVIEWS.map((option) => (
                <div key={option.label} className="rounded-3xl border border-border bg-card p-3 shadow-soft">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-black text-background">
                      {option.label}
                    </span>
                    <span className="text-sm font-extrabold text-foreground">{option.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-brand p-2">
                      <img src={option.academic} alt={`Option ${option.label} Academic preview`} className="aspect-square w-full rounded-xl bg-card object-cover" loading="eager" />
                      <div className="mt-1 text-center text-[11px] font-black text-brand-foreground">Academic</div>
                    </div>
                    <div className="rounded-2xl bg-destructive p-2">
                      <img src={option.general} alt={`Option ${option.label} General Training preview`} className="aspect-square w-full rounded-xl bg-card object-cover" loading="eager" />
                      <div className="mt-1 text-center text-[11px] font-black text-destructive-foreground">General</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {layout
          .filter((s) => s.visible && SECTION_MAP[s.id])
          .map((s) => {
            const Comp = SECTION_MAP[s.id];
            return <Comp key={s.id} />;
          })}
      </main>
      <Footer />
    </div>
  );
}
