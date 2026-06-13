import { createFileRoute } from "@tanstack/react-router";
import { IslamicHero } from "@/components/site/IslamicHero";
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
import { FreeEbookCta } from "@/components/site/FreeEbookCta";

export const Route = createFileRoute("/islamic")({
  head: () => ({
    meta: [
      { title: "IELTS Prep for Muslim Learners — Band 8–9 Samples" },
      {
        name: "description",
        content:
          "A calm, modern IELTS prep experience for Muslim learners worldwide. Fresh Writing & Speaking questions with Band 8–9 sample answers.",
      },
      { property: "og:title", content: "IELTS Prep for Muslim Learners" },
      {
        property: "og:description",
        content:
          "Assalamu Alaikum — your distraction-free path to a high IELTS band.",
      },
    ],
  }),
  component: IslamicHome,
});

function IslamicHome() {
  return (
    <div
      className="relative min-h-screen text-foreground"
      style={{ backgroundColor: "#f5f0e0" }}
    >
      {/* Page-wide emerald tint overlay — multiplies onto every section */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,122,95,0.10) 0%, rgba(201,168,76,0.08) 50%, rgba(6,78,59,0.12) 100%)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Page-wide Islamic geometric watermark in emerald */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='none' stroke='%23064e3b' stroke-width='1'><path d='M40 6 L50 30 L74 40 L50 50 L40 74 L30 50 L6 40 L30 30 Z'/><path d='M40 6 L40 74 M6 40 L74 40'/></g></svg>\")",
          backgroundSize: "80px 80px",
          mixBlendMode: "multiply",
        }}
      />
      <main className="relative z-0">
        <IslamicHero />
        <EverythingYouNeed />
        <Stats />
        <ValueStatement />
        <TrustCompare />
        <TryFreeSection />
        <LatestQuestions />
        <LearnersWorld />
        <Faq />
        <FinalCta />
      </main>
      <FreeEbookCta />
      <Footer />
    </div>
  );
}
