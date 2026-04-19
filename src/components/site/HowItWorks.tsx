import { SectionHeader } from "./SectionHeader";

const steps = [
  {
    n: "01",
    title: "Choose your topic",
    desc: "Browse Writing or Speaking by task, topic or month.",
  },
  {
    n: "02",
    title: "Read recent questions",
    desc: "Real exam questions reported by candidates worldwide.",
  },
  {
    n: "03",
    title: "Unlock model answers",
    desc: "Subscribe to read full Band 8–9 answers with notes.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-paper-ruled py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="How it works" title="Three simple steps to a higher band" />

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-3xl border border-border bg-card p-8 shadow-soft"
            >
              <span className="font-display text-5xl font-extrabold tracking-tight text-gradient-brand">
                {s.n}
              </span>
              <h4 className="mt-4 font-display text-xl font-extrabold tracking-tight">
                {s.title}
              </h4>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
