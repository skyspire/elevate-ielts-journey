import { Link } from "@tanstack/react-router";
import {
  PenLine,
  Mic,
  BookOpen,
  FileQuestion,
  Sparkles,
  CalendarClock,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const freeItems = [
  {
    icon: PenLine,
    title: "3 Writing Samples",
    desc: "Hand-picked Task 1 & Task 2 model answers to study instantly.",
  },
  {
    icon: Mic,
    title: "3 Speaking Samples",
    desc: "Curated Part 1, 2 & 3 responses with natural, band-9 phrasing.",
  },
];

const paidItems = [
  { icon: PenLine, label: "Unlimited Writing Samples" },
  { icon: Mic, label: "Unlimited Speaking Samples" },
  { icon: BookOpen, label: "Full Vocabulary Builder" },
  { icon: FileQuestion, label: "Recent Exam Questions" },
  { icon: Sparkles, label: "Predictions for Upcoming Exams" },
  { icon: CalendarClock, label: "Personalized Study Timetable" },
  { icon: LineChart, label: "Mistakes Analysis" },
];

export function TryFreeSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="container-page relative">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Try it free.{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-4px] bottom-1 -z-0 h-[40%] -rotate-1 rounded-sm bg-[linear-gradient(120deg,oklch(0.85_0.14_90_/_0.7),oklch(0.88_0.12_60_/_0.65))]" />
              <span className="relative z-10">Then unlock everything.</span>
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-foreground/65 sm:text-lg">
            Sign up and instantly get 6 admin-picked samples — no card, no
            countdown. The full toolkit lives behind one simple subscription.
          </p>
        </div>

        {/* Two columns */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ============= FREE ============= */}
          <article className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-brand bg-card p-8 shadow-glow sm:p-10">
            {/* Big top mark */}
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-brand">
                  Free after sign up
                </p>
                <h3 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                  Start with 6 model answers
                </h3>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <div className="font-display text-5xl font-black leading-none text-foreground">
                  $0
                </div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Forever
                </div>
              </div>
            </div>

            <p className="mt-4 text-[15px] font-medium leading-relaxed text-muted-foreground">
              Our team chooses the best examples so you see exactly what a
              high-band response looks like — across both Writing and Speaking.
            </p>

            <div className="mt-8 grid gap-4">
              {freeItems.map((item, i) => (
                <div
                  key={item.title}
                  className="group flex items-start gap-4 rounded-2xl border border-foreground/8 bg-background p-5 transition-all hover:border-brand/40 hover:shadow-soft"
                >
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
                    <item.icon className="h-5 w-5" strokeWidth={2.5} />
                    <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground font-display text-[11px] font-black text-background">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-extrabold leading-tight text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-snug text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="mt-8 h-13 w-full rounded-full bg-brand py-4 text-base font-extrabold text-brand-foreground shadow-glow hover:bg-brand/90"
            >
              <Link to="/dashboard">
                Sign up & get free samples
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <p className="mt-4 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              No credit card · Instant access
            </p>
          </article>

          {/* ============= PAID ============= */}
          <article className="relative flex flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-paper-cream p-8 sm:p-10">
            {/* Top */}
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-display text-[11px] font-black uppercase tracking-[0.22em] text-foreground/55">
                  Members only
                </p>
                <h3 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                  The complete toolkit
                </h3>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <div className="font-display text-5xl font-black leading-none text-foreground">
                  7<span className="text-2xl text-muted-foreground">+</span>
                </div>
                <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Tools
                </div>
              </div>
            </div>

            <p className="mt-4 text-[15px] font-medium leading-relaxed text-muted-foreground">
              One subscription opens every sample, every tool, and every
              resource we publish — updated continuously.
            </p>

            <ul className="mt-8 grid gap-2.5">
              {paidItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-4 rounded-xl border border-foreground/8 bg-card px-4 py-3.5 text-[15px] font-bold text-foreground transition-colors hover:border-foreground/20"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground/75">
                    <item.icon className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  <span className="leading-tight">{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Button
                asChild
                variant="outline"
                className="h-13 w-full rounded-full border-2 border-foreground bg-card py-4 text-base font-extrabold text-foreground hover:bg-foreground hover:text-background"
              >
                <Link to="/dashboard">See subscription plans</Link>
              </Button>
              <p className="mt-4 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Starts at $7 · Cancel anytime
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
