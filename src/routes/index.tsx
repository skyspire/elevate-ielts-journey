import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { ValueStatement } from "@/components/site/ValueStatement";

import { TrustCompare } from "@/components/site/TrustCompare";
import { TryFreeSection } from "@/components/site/TryFreeSection";
import { LatestQuestions } from "@/components/site/LatestQuestions";
import { CategorySections } from "@/components/site/CategorySections";
import { HowItWorks } from "@/components/site/HowItWorks";

import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Hero />
        <Stats />
        <ValueStatement />
        
        <TrustCompare />
        <TryFreeSection />
        <LatestQuestions />
        <CategorySections />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
