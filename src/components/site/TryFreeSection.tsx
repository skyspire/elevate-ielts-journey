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
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const freeSamples = [
  { icon: PenLine, label: "3 Writing samples" },
  { icon: Mic, label: "3 Speaking samples" },
];

const paidTools = [
  { icon: PenLine, label: "Unlimited Writing samples" },
  { icon: Mic, label: "Unlimited Speaking samples" },
  { icon: BookOpen, label: "Vocabulary Builder" },
  { icon: FileQuestion, label: "Recent Exam Questions" },
  { icon: Sparkles, label: "Predictions for upcoming exams" },
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
          <p className="mx-auto mt-5 max-w-xl text-base font-medium text-foreground/65 sm:text-lg">
            Sign up and instantly get 6 admin-picked samples. The full toolkit
            lives behind one simple subscription.
          </p>
        </div>

        {/* Two columns */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-2 lg:gap-6">
          {/* ============= FREE ============= */}
          <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-card p-8 shadow-card ring-1 ring-foreground/8 sm:p-10">
            {/* glow accent */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/15 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-brand" />
                <span className="font-display text-xs font-black uppercase tracking-[0.22em] text-brand">
                  Free forever
                </span>
              </div>

              <h3 className="mt-6 font-display text-3xl font-black leading-[1.05] tracking-tight text-foreground sm:text-4xl">
                6 hand-picked
                <br />
                model answers
              </h3>

              <p className="mt-4 text-[15px] font-medium leading-relaxed text-muted-foreground">
                See exactly what a band-9 response looks like. Curated by our
                team, available the moment you sign up.
              </p>
            </div>

            {/* Big sample callouts */}
            <div className="relative mt-8 space-y-3">
              {freeSamples.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-4 rounded-2xl bg-brand-soft/60 px-5 py-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
                    <s.icon className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <span className="font-display text-lg font-extrabold text-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="relative mt-8 h-12 w-full rounded-full bg-brand text-base font-extrabold text-brand-foreground shadow-glow hover:bg-brand/90"
            >
              <Link to="/dashboard">
                Sign up free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </article>

          {/* ============= PAID ============= */}
          <article className="relative flex flex-col overflow-hidden rounded-3xl bg-foreground p-8 text-background sm:p-10">
            {/* subtle pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, var(--background) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-background/70" />
                <span className="font-display text-xs font-black uppercase tracking-[0.22em] text-background/70">
                  Full Membership
                </span>
              </div>

              <h3 className="mt-6 font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl">
                Everything you
                <br />
                need to score 8+
              </h3>

              <p className="mt-4 text-[15px] font-medium leading-relaxed text-background/65">
                One subscription. Every sample, every tool, every resource we
                publish — updated continuously.
              </p>
            </div>

            <ul className="relative mt-8 space-y-2">
              {paidTools.map((t) => (
                <li
                  key={t.label}
                  className="flex items-center gap-3.5 border-b border-background/10 py-3 text-[15px] font-bold last:border-b-0"
                >
                  <Check
                    className="h-4 w-4 shrink-0 text-brand"
                    strokeWidth={3.5}
                  />
                  <span>{t.label}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="relative mt-8 h-12 w-full rounded-full bg-background text-base font-extrabold text-foreground hover:bg-background/90"
            >
              <Link to="/dashboard">See plans</Link>
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
}
