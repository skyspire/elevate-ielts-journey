import { useState } from "react";
import { Plus } from "lucide-react";

/**
 * Faq — editorial accordion. Big questions, generous spacing, no pills.
 */

const faqs = [
  {
    q: "Is BigIELTS for Academic or General Training?",
    a: "Both. Every Writing and Speaking section is split into Academic and General — Task 1 letters, Task 1 charts, Task 2 essays, and the full Speaking Part 1, 2, 3 banks. Choose your track once and the library filters automatically.",
  },
  {
    q: "Are the model answers really Band 9?",
    a: "Yes. Every sample is hand-written by certified IELTS instructors and reviewed by Cambridge-trained examiners. Each answer is graded against the four official band descriptors — Task Response, Coherence, Lexical Resource, and Grammatical Range.",
  },
  {
    q: "How often are new questions added?",
    a: "New Writing and Speaking questions are added every month, sourced from real test-takers worldwide. Predictions for upcoming exams are refreshed before each new test window.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Subscriptions are non-binding — cancel from your dashboard in one click. You keep full access until the end of your billing period and there are no cancellation fees.",
  },
  {
    q: "Do I need to pay to see anything?",
    a: "No. Sign up free and instantly unlock 6 hand-picked Band 9 model answers — 3 Writing and 3 Speaking. The full library, vocabulary builder, predictions, and templates open with one subscription starting at $7.",
  },
  {
    q: "Will this work on my phone?",
    a: "Absolutely. BigIELTS is designed mobile-first — every sample, vocabulary card, and timetable works the same on phone, tablet, and desktop. One account, every device.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-paper-white py-24 sm:py-32">
      {/* faint warm corner wash so it doesn't feel sterile */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 100% 0%, oklch(0.97 0.025 75 / 0.6), transparent 55%)," +
            "radial-gradient(ellipse at 0% 100%, oklch(0.96 0.03 250 / 0.5), transparent 55%)",
        }}
      />

      <div className="container-page relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Left — headline */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-4xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl">
              Questions
              <br />
              we hear
              <br />
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute inset-x-[-8px] bottom-2 -z-0 h-[28%] -rotate-1 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(120deg, oklch(0.88 0.14 145 / 0.65), oklch(0.9 0.12 175 / 0.6))",
                  }}
                />
                <span className="relative z-10">every day.</span>
              </span>
            </h2>
            <p className="mt-6 max-w-md font-display text-xl font-medium leading-relaxed text-foreground/65">
              Real answers, written plainly. If something here isn't covered,
              email us — a human replies.
            </p>
          </div>

          {/* Right — accordion */}
          <div>
            <ul className="border-t border-foreground/15">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li
                    key={f.q}
                    className="border-b border-foreground/15"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-start justify-between gap-6 py-7 text-left transition-colors hover:text-brand"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-xl font-extrabold leading-snug tracking-tight text-foreground sm:text-2xl">
                        {f.q}
                      </span>
                      <span
                        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-brand bg-brand text-brand-foreground"
                            : "bg-background text-foreground group-hover:border-brand group-hover:text-brand"
                        }`}
                      >
                        <Plus className="h-4 w-4" strokeWidth={3} />
                      </span>
                    </button>
                    <div
                      className="grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                      }}
                    >
                      <div className="min-h-0">
                        <p className="pb-7 pr-14 font-display text-lg font-medium leading-relaxed text-foreground/70">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
