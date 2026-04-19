import { useState } from "react";
import { Sparkles, FileText, TrendingUp, BookA, FolderTree, LifeBuoy } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const features = [
  {
    title: "Fresh Band 8+ Sample Answers",
    desc: "All new IELTS Writing and Speaking questions with model answers from Band 8 and above.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "600+ Previous Year Questions",
    desc: "Carefully selected past exam questions with up-to-date sample answers for focused practice.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Prediction Questions",
    desc: "Hand-picked predictions for upcoming exams so you walk in already prepared.",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "Vocabulary Builder",
    desc: "Words, phrases, phrasal verbs and slang organized to lift your lexical resource score.",
    icon: <BookA className="h-5 w-5" />,
  },
  {
    title: "Topic-wise Organization",
    desc: "Every question grouped by topic so you can drill exactly what you need.",
    icon: <FolderTree className="h-5 w-5" />,
  },
  {
    title: "30+ Survival Kits",
    desc: "Battle-tested kits designed to push your overall IELTS band score higher, fast.",
    icon: <LifeBuoy className="h-5 w-5" />,
  },
];

const modules = [
  { id: "academic", label: "IELTS Academic" },
  { id: "general", label: "IELTS General" },
] as const;

type ModuleId = (typeof modules)[number]["id"];

export function ModuleFeatures() {
  const [active, setActive] = useState<ModuleId>("academic");

  return (
    <section className="py-20 sm:py-28" style={{ background: "var(--surface-soft)" }}>
      <div className="container-page">
        <SectionHeader
          eyebrow="Choose your module"
          title="Everything you need for Academic & General"
          description="Switch modules to see what's included. Same powerful prep, tailored to your test."
        />

        {/* Toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1.5 shadow-soft">
            {modules.map((m) => {
              const isActive = active === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={`relative rounded-full px-6 py-2.5 text-sm font-bold transition-all sm:px-8 sm:text-base ${
                    isActive
                      ? "bg-foreground text-background shadow-card"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={isActive}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div
          key={active}
          className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="group flex flex-col gap-4 rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                {f.icon}
              </span>
              <div>
                <h4 className="font-display text-lg font-extrabold tracking-tight">{f.title}</h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
