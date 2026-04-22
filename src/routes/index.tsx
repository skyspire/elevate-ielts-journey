import { createFileRoute } from "@tanstack/react-router";
import { QuietHero } from "@/components/site/QuietHero";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { ValueStatement } from "@/components/site/ValueStatement";

import { TrustCompare } from "@/components/site/TrustCompare";
import { TryFreeSection } from "@/components/site/TryFreeSection";
import { LatestQuestions } from "@/components/site/LatestQuestions";
import { LearnersWorld } from "@/components/site/LearnersWorld";
import { Faq } from "@/components/site/Faq";
import { FinalCta } from "@/components/site/FinalCta";

import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <QuietHero />
        <Hero />
        <Stats />
        <ValueStatement />

        <TrustCompare />
        <TryFreeSection />
        <LatestQuestions />
        <LearnersWorld />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
