import { ArrowUpRight, BookOpen, Mic, PenLine, MessagesSquare } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Item = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  count: string;
};

const academic: Item[] = [
  {
    title: "Writing Task 1",
    desc: "Charts, graphs, maps and process diagrams.",
    icon: <PenLine className="h-5 w-5" />,
    count: "240+ samples",
  },
  {
    title: "Writing Task 2",
    desc: "Opinion, discussion and problem-solution essays.",
    icon: <BookOpen className="h-5 w-5" />,
    count: "320+ samples",
  },
  {
    title: "Speaking Part 1, 2, 3",
    desc: "Cue cards and follow-up questions with model answers.",
    icon: <Mic className="h-5 w-5" />,
    count: "500+ topics",
  },
];

const general: Item[] = [
  {
    title: "Writing Task 1 · Letters",
    desc: "Formal, semi-formal and informal letter templates.",
    icon: <PenLine className="h-5 w-5" />,
    count: "180+ samples",
  },
  {
    title: "Writing Task 2 · Essays",
    desc: "Recent General Training essay questions answered.",
    icon: <BookOpen className="h-5 w-5" />,
    count: "260+ samples",
  },
  {
    title: "Speaking Part 1, 2, 3",
    desc: "GT-focused speaking topics with band 8 responses.",
    icon: <MessagesSquare className="h-5 w-5" />,
    count: "420+ topics",
  },
];

function CategoryCard({ item }: { item: Item }) {
  return (
    <a
      href="#"
      className="group flex h-full flex-col gap-5 rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          {item.icon}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-secondary-foreground">
          {item.count}
        </span>
      </div>
      <div>
        <h4 className="font-display text-xl font-extrabold tracking-tight">{item.title}</h4>
        <p className="mt-2 text-sm font-medium text-muted-foreground">{item.desc}</p>
      </div>
      <span className="mt-auto flex items-center gap-1 text-sm font-bold text-brand">
        Browse <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </a>
  );
}

export function CategorySections() {
  return (
    <section className="py-20 sm:py-28" style={{ background: "var(--surface-blue)" }}>
      <div className="container-page space-y-20">
        <div>
          <SectionHeader
            eyebrow="IELTS Academic"
            title="Built for university-bound candidates"
            description="Every Academic module organized by task type and difficulty."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {academic.map((it) => (
              <CategoryCard key={it.title} item={it} />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader
            eyebrow="IELTS General Training"
            title="For work, migration and beyond"
            description="Practical letter templates and everyday speaking topics."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {general.map((it) => (
              <CategoryCard key={it.title} item={it} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
