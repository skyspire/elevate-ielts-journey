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
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const freeSamples = [
  { icon: PenLine, label: "3 Writing samples", sub: "Task 1 + Task 2" },
  { icon: Mic, label: "3 Speaking samples", sub: "Part 1, 2 & 3" },
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
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
          {/* ============= FREE ============= */}
          <article className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-[oklch(0.62_0.18_45)] p-8 text-brand-foreground shadow-glow sm:p-10">
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            {/* Floating badge */}
            <div className="relative inline-flex w-fit items-center gap-2 rounded-full bg-brand-foreground/15 px-3.5 py-1.5 backdrop-blur-sm ring-1 ring-brand-foreground/25">
              <Gift className="h-3.5 w-3.5" strokeWidth={2.75} />
              <span className="font-display text-[11px] font-black uppercase tracking-[0.2em]">
                Free Forever
              </span>
            </div>

            <h3 className="relative mt-6 font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl">
              6 hand-picked
              <br />
              model answers
            </h3>

            <p className="relative mt-4 text-[15px] font-medium leading-relaxed text-brand-foreground/85">
              See exactly what a band-9 response looks like. Curated by our
              team, available the moment you sign up.
            </p>

            {/* Big sample callouts */}
            <div className="relative mt-8 space-y-3">
              {freeSamples.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-4 rounded-2xl bg-brand-foreground/12 p-4 backdrop-blur-sm ring-1 ring-brand-foreground/20"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-foreground text-brand shadow-soft">
                    <s.icon className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-extrabold leading-tight">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-brand-foreground/70">
                      {s.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="relative mt-8 h-12 w-full rounded-full bg-brand-foreground text-base font-extrabold text-brand hover:bg-brand-foreground/95"
            >
              <Link to="/dashboard">
                Sign up free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <p className="relative mt-3 text-center text-[11px] font-bold uppercase tracking-wider text-brand-foreground/75">
              No credit card · Instant access
            </p>
          </article>

          {/* ============= PAID ============= */}
          <article className="relative flex flex-col overflow-hidden rounded-3xl bg-foreground p-8 text-background sm:p-10">
            {/* subtle dot pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, var(--background) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative inline-flex w-fit items-center gap-2 rounded-full bg-background/10 px-3.5 py-1.5 ring-1 ring-background/20">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.75} />
              <span className="font-display text-[11px] font-black uppercase tracking-[0.2em]">
                Full Membership
              </span>
            </div>

            <h3 className="relative mt-6 font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl">
              Everything you
              <br />
              need to score 8+
            </h3>

            <p className="relative mt-4 text-[15px] font-medium leading-relaxed text-background/65">
              One subscription. Every sample, every tool, every resource we
              publish — updated continuously.
            </p>

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

            <div className="relative mt-auto pt-8">
              <Button
                asChild
                className="h-12 w-full rounded-full bg-background text-base font-extrabold text-foreground hover:bg-background/90"
              >
                <Link to="/dashboard">See plans</Link>
              </Button>
              <p className="mt-3 text-center text-[11px] font-bold uppercase tracking-wider text-background/60">
                Starts at $7 · Cancel anytime
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
