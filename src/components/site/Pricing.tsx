import {
  Check,
  BookOpen,
  GraduationCap,
  PenTool,
  Mic,
  Sparkles,
  CalendarClock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { WashiTape } from "./PaperAccents";

const plans = [
  {
    name: "Weekly",
    price: "7",
    days: "15",
    popular: false,
    accent: "oklch(0.55 0.18 30)", // coral
  },
  {
    name: "Monthly",
    price: "12",
    days: "30",
    popular: true,
    accent: "oklch(0.45 0.18 265)", // indigo
  },
  {
    name: "3-Month",
    price: "29",
    days: "90",
    popular: false,
    accent: "oklch(0.55 0.14 160)", // teal
  },
];

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  bg: string;
};

const features: Feature[] = [
  {
    icon: GraduationCap,
    title: "Academic + General",
    desc: "Both modules, fully unlocked",
    color: "oklch(0.45 0.18 265)",
    bg: "oklch(0.45 0.18 265 / 0.1)",
  },
  {
    icon: BookOpen,
    title: "Complete Question Bank",
    desc: "Every topic, every task type",
    color: "oklch(0.55 0.18 30)",
    bg: "oklch(0.55 0.18 30 / 0.1)",
  },
  {
    icon: PenTool,
    title: "Band 8–9 Writing Samples",
    desc: "Task 1 & Task 2 model answers",
    color: "oklch(0.55 0.14 160)",
    bg: "oklch(0.55 0.14 160 / 0.1)",
  },
  {
    icon: Mic,
    title: "Speaking Model Answers",
    desc: "Parts 1, 2 & 3 with cue cards",
    color: "oklch(0.6 0.16 50)",
    bg: "oklch(0.6 0.16 50 / 0.1)",
  },
  {
    icon: Sparkles,
    title: "Vocabulary & Structures",
    desc: "Phrases, collocations, idioms",
    color: "oklch(0.5 0.2 320)",
    bg: "oklch(0.5 0.2 320 / 0.1)",
  },
  {
    icon: CalendarClock,
    title: "Recent Exam Questions",
    desc: "Updated every month",
    color: "oklch(0.5 0.18 200)",
    bg: "oklch(0.5 0.18 200 / 0.1)",
  },
];

export function Pricing() {
  return (
    <section className="relative bg-paper-white py-20 sm:py-28">
      <WashiTape position="top-left" color="peach" />
      <WashiTape position="top-right" color="mint" />
      <div className="container-page">
        <SectionHeader
          eyebrow="Pricing"
          title="One plan. Full access. You pick the duration."
          description="Every plan unlocks everything below — Academic and General. Only the duration changes."
        />

        <div className="mx-auto mt-12 max-w-5xl">
          {/* === Feature spotlight grid === */}
          <div className="relative">
            {/* "Everything included" stamp */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px flex-1 max-w-[80px] bg-foreground/15" />
              <span className="font-handwriting text-base text-foreground/70 sm:text-lg">
                everything you get, in every plan
              </span>
              <span className="h-px flex-1 max-w-[80px] bg-foreground/15" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
                  >
                    {/* subtle accent corner */}
                    <span
                      className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
                      style={{ background: f.bg }}
                    />
                    <div className="relative flex items-start gap-3">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: f.bg, color: f.color }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2.5} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-extrabold leading-tight text-foreground">
                          {f.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                    {/* "included" check */}
                    <span
                      className="absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: f.color, color: "white" }}
                    >
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* === Plan duration cards === */}
          <div className="mt-14">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px flex-1 max-w-[80px] bg-foreground/15" />
              <span className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                Pick your duration
              </span>
              <span className="h-px flex-1 max-w-[80px] bg-foreground/15" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={`relative flex flex-col items-center rounded-2xl border p-6 text-center transition-all hover:-translate-y-1 ${
                    p.popular
                      ? "border-transparent bg-card shadow-card ring-2 ring-brand"
                      : "border-border bg-card shadow-soft hover:shadow-card"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-foreground shadow-soft">
                      Most popular
                    </span>
                  )}
                  <div
                    className="font-display text-sm font-extrabold uppercase tracking-[0.15em]"
                    style={{ color: p.accent }}
                  >
                    {p.name}
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-5xl font-black tracking-tight text-foreground">
                      ${p.price}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      CAD
                    </span>
                  </div>
                  <div
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      background: `color-mix(in oklab, ${p.accent} 12%, transparent)`,
                      color: p.accent,
                    }}
                  >
                    <CalendarClock className="h-3 w-3" strokeWidth={3} />
                    {p.days} days access
                  </div>
                  <Button
                    className={`mt-5 h-10 w-full rounded-full font-bold ${
                      p.popular
                        ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    Choose {p.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs font-semibold text-muted-foreground">
            E-books sold separately • Cancel anytime • No auto-renewal
          </p>
        </div>
      </div>
    </section>
  );
}
