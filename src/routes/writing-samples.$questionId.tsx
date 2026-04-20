import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Sparkles,
  Award,
  Hash,
  ListOrdered,
  Lightbulb,
  PenLine,
  CheckCircle2,
} from "lucide-react";
import { z } from "zod";
import { sampleAnswers, type AnswerParagraph } from "@/data/sample-answers";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
  task: z.enum(["task1", "task2"]).optional().default("task1"),
  category: z.string().optional().default(""),
  title: z.string().optional().default(""),
  topic: z.string().optional().default(""),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().default("Medium"),
});

export const Route = createFileRoute("/writing-samples/$questionId")({
  validateSearch: searchSchema,
  head: ({ match }) => ({
    meta: [
      { title: `${match.search.title || "Sample Question"} — BandPath` },
      {
        name: "description",
        content:
          "View an IELTS Writing sample question with the full Band 8+ model answer, structure breakdown, vocabulary highlights and exam tips.",
      },
    ],
  }),
  component: QuestionDetailPage,
});

// ───────── Section role detection (Intro / Body / Counter / Conclusion) ─────────
type Role = "intro" | "body" | "counter" | "conclusion";

const ROLE_STYLES: Record<
  Role,
  { label: string; bar: string; chipBg: string; chipText: string; dot: string }
> = {
  intro: {
    label: "Introduction",
    bar: "bg-[oklch(0.62_0.16_255)]",
    chipBg: "bg-[oklch(0.94_0.05_255)]",
    chipText: "text-[oklch(0.42_0.16_255)]",
    dot: "bg-[oklch(0.62_0.16_255)]",
  },
  body: {
    label: "Body",
    bar: "bg-[oklch(0.55_0.12_160)]",
    chipBg: "bg-[oklch(0.94_0.05_160)]",
    chipText: "text-[oklch(0.38_0.12_160)]",
    dot: "bg-[oklch(0.55_0.12_160)]",
  },
  counter: {
    label: "Counter-argument",
    bar: "bg-[oklch(0.62_0.13_55)]",
    chipBg: "bg-[oklch(0.95_0.05_75)]",
    chipText: "text-[oklch(0.42_0.13_55)]",
    dot: "bg-[oklch(0.62_0.13_55)]",
  },
  conclusion: {
    label: "Conclusion",
    bar: "bg-[oklch(0.55_0.14_295)]",
    chipBg: "bg-[oklch(0.94_0.05_295)]",
    chipText: "text-[oklch(0.40_0.14_295)]",
    dot: "bg-[oklch(0.55_0.14_295)]",
  },
};

function detectRole(p: AnswerParagraph, index: number, total: number): Role {
  const h = p.heading.toLowerCase();
  if (index === 0 || h.includes("introduction")) return "intro";
  if (index === total - 1 || h.includes("conclusion")) return "conclusion";
  if (
    h.includes("challenge") ||
    h.includes("drawback") ||
    h.includes("disadvantage") ||
    h.includes("however") ||
    h.includes("counter") ||
    h.includes("concern")
  )
    return "counter";
  return "body";
}

function QuestionDetailPage() {
  const search = Route.useSearch();
  const { questionId } = Route.useParams();
  const module = search.module ?? "general";
  const task = search.task ?? "task1";
  const category = search.category || "Sample";
  const title = search.title || "Sample Question";
  const topic = search.topic || "General";
  const difficulty = search.difficulty ?? "Medium";

  const answer = sampleAnswers[questionId];

  // Always start at the top when this page opens
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [questionId]);

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
    <div className="min-h-screen bg-[oklch(0.99_0.005_250)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-white/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">BandPath</span>
          </Link>

          <Link
            to="/writing-samples"
            search={{ module }}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Writing Samples
          </Link>
        </div>
      </header>

      <main className="relative pb-20">
        {/* Soft gradient hero band */}
        <section className="relative overflow-hidden border-b border-foreground/8 bg-gradient-to-b from-[oklch(0.97_0.025_250)] via-white to-white py-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          />
          <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-6">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
              <Link to="/dashboard" className="hover:text-foreground/80">Dashboard</Link>
              <span>/</span>
              <Link to="/writing-samples" search={{ module }} className="hover:text-foreground/80">
                Writing Samples
              </Link>
              <span>/</span>
              <span className={accentText}>{category}</span>
            </div>

            <div className="mt-5 text-center">
              <div className={`mx-auto inline-flex items-center gap-2 rounded-full border ${accentChip} px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em]`}>
                <span className={`h-1.5 w-1.5 rounded-full ${accentBg}`} />
                IELTS {isAcademic ? "Academic" : "General"} · {task === "task1" ? "Task 1" : "Task 2"}
              </div>
              <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
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
          </div>
        </section>

        <div className="relative mx-auto w-full max-w-3xl px-5 pt-10 sm:px-6">
          {/* Question card */}
          <div className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
              <FileText className="h-3.5 w-3.5" />
              Question
            </div>
            <p className="mt-3 font-display text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
              {title}
            </p>
          </div>

          {answer ? (
            <>
              {/* Score strip */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <ScoreCard
                  icon={Award}
                  label="Band Score"
                  value={answer.bandScore}
                  tone="brand"
                />
                <ScoreCard
                  icon={Hash}
                  label="Word Count"
                  value={String(answer.wordCount)}
                  tone="mint"
                />
                <ScoreCard
                  icon={CheckCircle2}
                  label="Paragraphs"
                  value={String(answer.paragraphs.length)}
                  tone="lilac"
                  className="col-span-2 sm:col-span-1"
                />
              </div>

              {/* Sample answer — color-coded sections */}
              <section className="mt-8">
                <SectionTitle icon={PenLine} eyebrow="Model Answer" title="Sample Answer" />

                <div className="mt-5 space-y-5">
                  {answer.paragraphs.map((p, i) => {
                    const role = detectRole(p, i, answer.paragraphs.length);
                    const s = ROLE_STYLES[role];
                    return (
                      <article
                        key={p.heading}
                        className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-soft transition-shadow hover:shadow-card"
                      >
                        {/* Color bar (left) */}
                        <span
                          aria-hidden
                          className={`absolute inset-y-0 left-0 w-1.5 ${s.bar}`}
                        />

                        <div className="px-6 py-6 pl-7 sm:px-8 sm:pl-9">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full ${s.chipBg} ${s.chipText} px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/40">
                              ¶ {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="mt-3 font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                            {p.heading}
                          </h3>
                          <p className="mt-3 text-[15.5px] font-medium leading-[1.85] text-foreground/85 sm:text-base">
                            {p.body}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* Structure breakdown */}
              <section className="mt-12">
                <SectionTitle icon={ListOrdered} eyebrow="How it's built" title="Structure breakdown" />

                <div className="mt-5 rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
                  <ol className="space-y-5">
                    {answer.structure.map((s, i) => (
                      <li key={s.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${accentBg} text-[12px] font-extrabold text-white shadow-soft`}>
                            {i + 1}
                          </span>
                          {i < answer.structure.length - 1 && (
                            <span className="mt-1 h-full w-px flex-1 bg-foreground/10" />
                          )}
                        </div>
                        <div className="pb-1">
                          <p className="font-display text-[15px] font-extrabold tracking-tight text-foreground">
                            {s.label}
                          </p>
                          <p className="mt-1 text-[14px] font-medium leading-relaxed text-foreground/70">
                            {s.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {/* Vocabulary */}
              <section className="mt-12">
                <SectionTitle icon={BookOpen} eyebrow="Lift your score" title="Key vocabulary" />

                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {answer.vocabulary.map((v) => (
                    <li
                      key={v.term}
                      className="rounded-xl border border-foreground/10 bg-white p-4 shadow-soft transition-shadow hover:shadow-card"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${accentBg}`} />
                        <div>
                          <p className={`font-display text-[14px] font-extrabold tracking-tight ${accentText}`}>
                            {v.term}
                          </p>
                          <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-foreground/70">
                            {v.meaning}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tips */}
              <section className="mt-12">
                <SectionTitle icon={Lightbulb} eyebrow="From the examiner" title="Tips to remember" />

                <div className="mt-5 grid gap-3">
                  {answer.tips.map((t, i) => (
                    <div
                      key={t}
                      className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-gradient-to-br from-[oklch(0.98_0.015_85)] to-white p-4 shadow-soft sm:p-5"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[oklch(0.92_0.13_85)] text-[12px] font-extrabold text-[oklch(0.32_0.13_75)] shadow-soft">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 text-[14.5px] font-medium leading-relaxed text-foreground/85">
                        {t}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-foreground/15 bg-white/60 p-6 text-center sm:p-10">
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
          )}

          <div className="mt-14 flex justify-center">
            <Link
              to="/writing-samples"
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

// ───────── Subcomponents ─────────
function SectionTitle({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: typeof BookOpen;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/45">
        <Icon className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  value,
  tone,
  className = "",
}: {
  icon: typeof Award;
  label: string;
  value: string;
  tone: "brand" | "mint" | "lilac";
  className?: string;
}) {
  const tones = {
    brand: { bg: "bg-brand-soft", text: "text-brand", icon: "bg-brand text-brand-foreground" },
    mint: {
      bg: "bg-[oklch(0.94_0.05_165)]",
      text: "text-[oklch(0.38_0.10_165)]",
      icon: "bg-[oklch(0.55_0.10_165)] text-white",
    },
    lilac: {
      bg: "bg-[oklch(0.94_0.05_295)]",
      text: "text-[oklch(0.40_0.14_295)]",
      icon: "bg-[oklch(0.55_0.14_295)] text-white",
    },
  }[tone];

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-foreground/10 bg-white p-4 shadow-soft ${className}`}
    >
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones.icon} shadow-soft`}>
        <Icon className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <div>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-foreground/50">
          {label}
        </p>
        <p className={`font-display text-xl font-black leading-tight tracking-tight ${tones.text}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
