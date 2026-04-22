import { Link } from "@tanstack/react-router";
import {
  PenLine,
  Mic,
  BookOpen,
  FileQuestion,
  Sparkles,
  CalendarClock,
  LineChart,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const freeItems = [
  {
    icon: PenLine,
    title: "3 Writing samples",
    desc: "Hand-picked Task 1 & Task 2 model answers to study instantly.",
  },
  {
    icon: Mic,
    title: "3 Speaking samples",
    desc: "Curated Part 1, 2 & 3 responses with natural phrasing.",
  },
];

const paidItems = [
  { icon: BookOpen, label: "Full Vocabulary Builder" },
  { icon: FileQuestion, label: "Recent Exam Questions" },
  { icon: Sparkles, label: "Predictions for Upcoming Exams" },
  { icon: CalendarClock, label: "Personalized Study Timetable" },
  { icon: LineChart, label: "Mistakes Analysis" },
  { icon: PenLine, label: "Unlimited Writing Samples" },
  { icon: Mic, label: "Unlimited Speaking Samples" },
];

export function TryFreeSection() {
  return (
    <section className="relative bg-background py-20 sm:py-28">
      <div className="container-page">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-3 py-1 text-[11px] font-semibold tracking-wide text-foreground/60">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Try before you subscribe
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Get a free taste. Then unlock the full library.
          </h2>
          <p className="mt-4 text-base font-medium text-foreground/65 sm:text-lg">
            Sign up and instantly access 6 admin-picked sample answers — no card,
            no trial countdown. Everything else lives behind one subscription.
          </p>
        </div>

        {/* Two columns */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-2">
          {/* FREE COLUMN */}
          <article className="relative flex flex-col rounded-3xl border-2 border-brand/30 bg-card p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand">
                Free after sign up
              </span>
              <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-foreground">
                $0 forever
              </span>
            </div>

            <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              6 hand-picked sample answers
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              Our team chooses the best examples so you see exactly what a
              high-band response looks like — across both Writing and Speaking.
            </p>

            <ul className="mt-7 space-y-4">
              {freeItems.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3.5 rounded-2xl border border-foreground/8 bg-background p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <item.icon className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="font-display text-base font-extrabold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sm font-medium leading-snug text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="mt-8 h-12 w-full rounded-full bg-brand text-base font-bold text-brand-foreground shadow-glow hover:bg-brand/90"
            >
              <Link to="/dashboard">
                Sign up & start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              No credit card · Instant access
            </p>
          </article>

          {/* PAID COLUMN */}
          <article className="relative flex flex-col rounded-3xl border border-foreground/10 bg-paper-cream p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/55">
                Members only
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-card px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-foreground/70">
                <Lock className="h-3 w-3" strokeWidth={3} />
                Subscribe to unlock
              </span>
            </div>

            <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Everything serious learners need
            </h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
              One subscription opens every tool, every sample, and every resource
              we publish — updated continuously.
            </p>

            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {paidItems.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-xl bg-card px-3 py-2.5 text-[13px] font-semibold text-foreground/85"
                >
                  <item.icon
                    className="h-4 w-4 shrink-0 text-foreground/55"
                    strokeWidth={2.25}
                  />
                  <span className="leading-tight">{item.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-full border-foreground/15 bg-card text-base font-bold hover:bg-secondary"
              >
                <Link to="/dashboard">See subscription plans</Link>
              </Button>
              <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Starts at $7 · Cancel anytime
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
