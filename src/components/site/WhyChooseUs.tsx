import { CalendarCheck, Award, BookMarked, Sparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DoodleAccents } from "./PaperAccents";

const items = [
  {
    icon: <CalendarCheck className="h-5 w-5" />,
    title: "Regularly updated",
    desc: "New questions added every month from real test-takers worldwide.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Exam-style questions",
    desc: "Verified to match the format and difficulty of the actual IELTS test.",
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: "Band 8–9 sample answers",
    desc: "Hand-written by certified IELTS instructors and Cambridge examiners.",
  },
  {
    icon: <BookMarked className="h-5 w-5" />,
    title: "Vocabulary support",
    desc: "Topic-grouped advanced vocabulary with collocations and pronunciation.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-paper-cream py-20 sm:py-28">
      <DoodleAccents density="sparse" />
      <div className="container-page relative">
        <SectionHeader
          eyebrow="Why choose BigIELTS.com"
          title="Everything you need to reach Band 8+"
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                {it.icon}
              </span>
              <h4 className="mt-5 font-display text-lg font-extrabold tracking-tight">
                {it.title}
              </h4>
              <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
