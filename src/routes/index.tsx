import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { ModuleFeatures } from "@/components/site/ModuleFeatures";
import { TrustCompare } from "@/components/site/TrustCompare";
import { LatestQuestions } from "@/components/site/LatestQuestions";
import { SamplePreview } from "@/components/site/SamplePreview";
import { CategorySections } from "@/components/site/CategorySections";
import { Ebooks } from "@/components/site/Ebooks";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Pricing } from "@/components/site/Pricing";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Stats />
        <ModuleFeatures />
        <LatestQuestions />
        <SamplePreview />
        <CategorySections />
        <Ebooks />
        <WhyChooseUs />
        <HowItWorks />
        <Pricing />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
