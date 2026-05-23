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
