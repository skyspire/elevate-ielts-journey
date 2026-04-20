import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Clock, FileText, GraduationCap, Sparkles } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
  task: z.enum(["task1", "task2"]).optional().default("task1"),
  category: z.string().optional().default(""),
  title: z.string().optional().default(""),
  topic: z.string().optional().default(""),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().default("Medium"),
});

export const Route = createFileRoute("/dashboard/writing-samples/$questionId")({
  validateSearch: searchSchema,
  head: ({ match }) => ({
    meta: [
      { title: `${match.search.title || "Sample Question"} — BandPath` },
      {
        name: "description",
        content:
          "View an IELTS Writing sample question with prompt details, structure tips and model answer guidance.",
      },
    ],
  }),
  component: QuestionDetailPage,
});

function QuestionDetailPage() {
  const search = Route.useSearch();
  const module = search.module ?? "general";
  const task = search.task ?? "task1";
  const category = search.category || "Sample";
  const title = search.title || "Sample Question";
  const topic = search.topic || "General";
  const difficulty = search.difficulty ?? "Medium";

  const isAcademic = module === "academic";
  const accentText = isAcademic ? "text-brand" : "text-[oklch(0.42_0.10_160)]";
  const accentBg = isAcademic ? "bg-brand" : "bg-[oklch(0.55_0.10_160)]";
  const accentChip = isAcademic
    ? "bg-brand-soft text-brand border-brand/30"
    : "bg-[oklch(0.94_0.04_160)] text-[oklch(0.38_0.10_160)] border-[oklch(0.62_0.10_160)]/30";

  const diffTone =
    difficulty === "Easy"
      ? "bg-[oklch(0.94_0.05_160)] text-[oklch(0.38_0.10_160)]"
      : difficulty === "Medium"
      ? "bg-[oklch(0.95_0.05_85)] text-[oklch(0.42_0.11_75)]"
      : "bg-[oklch(0.94_0.05_30)] text-[oklch(0.42_0.13_40)]";

  const wordCount = task === "task1" ? "150 words · 20 min" : "250 words · 40 min";

  return (
    <div className="min-h-screen bg-paper-cream">
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-paper-cream/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">BandPath</span>
          </Link>

          <Link
            to="/dashboard.writing-samples"
            search={{ module }}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Writing Samples
          </Link>
        </div>
      </header>

      <main className="relative py-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-paper-ruled opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
            <Link to="/dashboard" className="hover:text-foreground/80">Dashboard</Link>
            <span>/</span>
            <Link to="/dashboard.writing-samples" search={{ module }} className="hover:text-foreground/80">
              Writing Samples
            </Link>
            <span>/</span>
            <span className={accentText}>{category}</span>
          </div>

          {/* Hero */}
          <div className="mt-5 text-center">
            <div className={`mx-auto inline-flex items-center gap-2 rounded-full border ${accentChip} px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em]`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accentBg}`} />
              IELTS {isAcademic ? "Academic" : "General"} · {task === "task1" ? "Task 1" : "Task 2"}
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/60">
                <BookOpen className="h-3.5 w-3.5" />
                {topic}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${diffTone}`}>
                {difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/60">
                <Clock className="h-3.5 w-3.5" />
                {wordCount}
              </span>
            </div>
          </div>

          {/* Prompt card */}
          <div className="mt-10 rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
              <FileText className="h-3.5 w-3.5" />
              Prompt
            </div>
            <p className="mt-3 font-display text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
              This is a placeholder prompt for "{title}". Real IELTS-style question text will appear here, including the full scenario, what to include in your response, and any addressee details.
            </p>
            <ul className="mt-5 space-y-2 text-[14px] font-medium leading-relaxed text-foreground/70">
              <li>• Point one the candidate must address.</li>
              <li>• Point two the candidate must address.</li>
              <li>• Point three the candidate must address.</li>
            </ul>
          </div>

          {/* Coming soon */}
          <div className="mt-6 rounded-2xl border border-dashed border-foreground/15 bg-white/60 p-6 text-center sm:p-8">
            <span className={`inline-flex items-center gap-1.5 rounded-full ${accentChip} border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]`}>
              <Sparkles className="h-3.5 w-3.5" />
              Coming soon
            </span>
            <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight text-foreground">
              Band 8+ model answer
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] font-medium leading-relaxed text-foreground/65">
              A full sample answer with structure breakdown, vocabulary highlights and examiner notes will be available here shortly.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/dashboard.writing-samples"
              search={{ module }}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-5 py-2.5 text-sm font-bold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all questions
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
