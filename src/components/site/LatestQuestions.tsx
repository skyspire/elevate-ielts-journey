import { SectionHeader } from "./SectionHeader";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";

const writing = [
  {
    tag: "Environment",
    tagTone: "mint" as const,
    type: "Writing Task 2" as const,
    title: "Some people believe individuals can do little to protect the environment. To what extent do you agree?",
    date: "April 2026",
  },
  {
    tag: "Education",
    tagTone: "blue" as const,
    type: "Writing Task 2" as const,
    title: "Many universities now offer online courses. Are the benefits greater than the drawbacks?",
    date: "March 2026",
  },
  {
    tag: "Bar Chart",
    tagTone: "peach" as const,
    type: "Writing Task 1" as const,
    title: "The chart below shows household spending on leisure activities in four countries in 2024.",
    date: "March 2026",
  },
];

const speaking = [
  {
    tag: "Hometown",
    tagTone: "lilac" as const,
    type: "Speaking Part 1" as const,
    title: "Describe your hometown and what you like most about it.",
    date: "April 2026",
  },
  {
    tag: "Memorable Trip",
    tagTone: "blue" as const,
    type: "Speaking Part 2" as const,
    title: "Describe a journey that did not go as planned. You should say where, when, who and why.",
    date: "April 2026",
  },
  {
    tag: "Technology",
    tagTone: "mint" as const,
    type: "Speaking Part 3" as const,
    title: "How has technology changed the way people communicate in your country?",
    date: "March 2026",
  },
];

export function LatestQuestions() {
  return (
    <section className="py-20 sm:py-28" style={{ background: "var(--surface)" }}>
      <div className="container-page">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeader
            align="left"
            eyebrow="Latest exam questions"
            title="Fresh from recent test sittings"
            description="Updated each month with verified questions reported by real test-takers."
          />
          <Button variant="outline" className="rounded-full font-bold">
            View all questions
          </Button>
        </div>

        <div className="mt-12 space-y-12">
          <div>
            <h3 className="mb-5 font-display text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
              ✍️ Writing
            </h3>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {writing.map((q) => (
                <QuestionCard key={q.title} {...q} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-display text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
              🎙 Speaking
            </h3>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {speaking.map((q) => (
                <QuestionCard key={q.title} {...q} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
