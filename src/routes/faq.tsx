import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — BigIELTS" },
      {
        name: "description",
        content:
          "Answers to common questions about BigIELTS — pricing, content, accuracy of predictions, and how to get Band 8+.",
      },
      { property: "og:title", content: "BigIELTS FAQ" },
      {
        property: "og:description",
        content: "Everything you need to know about BigIELTS before signing up.",
      },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "How accurate are your prediction questions?",
    a: "Our predictions are based on 12 months of verified questions from real test-takers across 40+ countries, combined with the IELTS question rotation pattern. Roughly 70–80% of high-likelihood topics appear in the following month's sitting.",
  },
  {
    q: "Are the recent exam questions verified?",
    a: "Yes. Every question is cross-referenced with multiple test-takers from the same sitting before being added. We never publish unverified or made-up questions.",
  },
  {
    q: "Who writes the sample answers?",
    a: "All Band 8+ sample answers are written and graded by our qualified IELTS team — IELTS specialists with at least 5 years of teaching and marking experience.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. You can cancel your Pro subscription at any time from your dashboard. You'll keep access until the end of your billing period.",
  },
  {
    q: "Is there a free trial?",
    a: "We offer a generous Free plan with 3 recent questions per month and 5 sample answers — no card required. Upgrade only when you're ready.",
  },
  {
    q: "Do you cover Academic and General Training?",
    a: "Yes. All content is clearly labelled, and predictions, samples, and vocabulary cover both Academic and General Training modules.",
  },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Frequently asked questions
            </h1>
            <p className="mt-6 text-lg font-semibold text-foreground/75">
              Everything you need to know before signing up.
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="rounded-xl border bg-white px-5"
                style={{ borderColor: "oklch(0.92 0.003 250)" }}
              >
                <AccordionTrigger className="text-left font-display text-lg font-extrabold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-base font-medium text-foreground/75">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
