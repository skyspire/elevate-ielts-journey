import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  GraduationCap,
  ArrowLeft,
  ArrowUpRight,
  Lock,
  Mic,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { BackButton } from "@/components/site/BackButton";
import {
  getSpeakingQuestions,
  getTopic,
  isCueCardCategory,
} from "@/data/speaking-questions";
import { speakingTopicsByCategory } from "@/data/speaking-topics";

export const Route = createFileRoute("/speaking-samples/$category/$topic")({
  loader: ({ params }) => {
    const topic = getTopic(params.category, params.topic);
    if (!topic) throw notFound();
    const questions = getSpeakingQuestions(params.category, params.topic);
    const isCue = isCueCardCategory(params.category);
    return { topic, questions, isCue, categoryId: params.category };
  },
  head: ({ loaderData }) => {
    const label = loaderData?.topic.label ?? "Speaking Topic";
    return {
      meta: [
        { title: `${label} — Speaking Samples — BigIELTS.com` },
        {
          name: "description",
          content: `Band 8+ IELTS Speaking model answers and examiner follow-ups for the topic: ${label}.`,
        },
        { property: "og:title", content: `${label} — Speaking Samples` },
        {
          property: "og:description",
          content: `Sample questions and Band 8+ answers on ${label}.`,
        },
      ],
    };
  },
  component: SpeakingTopicPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[oklch(0.985_0.014_165)] px-6 text-center">
      <p className="font-display text-2xl font-extrabold tracking-tight text-foreground">
        Topic not found
      </p>
      <Link
        to="/speaking-samples"
        className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.50_0.10_165)] px-4 py-2 text-sm font-bold text-white shadow-soft"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Speaking Samples
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[oklch(0.985_0.014_165)] px-6 text-center">
      <p className="font-display text-xl font-extrabold tracking-tight text-foreground">
        Something went wrong
      </p>
      <p className="text-sm text-foreground/60">{error.message}</p>
      <Link
        to="/speaking-samples"
        className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.50_0.10_165)] px-4 py-2 text-sm font-bold text-white shadow-soft"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Speaking Samples
      </Link>
    </div>
  ),
});

function SpeakingTopicPage() {
  const { topic, questions, isCue, categoryId } = Route.useLoaderData();

  // Find which category this topic belongs to (already known via param)
  const allTopicsInCategory = speakingTopicsByCategory[categoryId] ?? [];
  const topicIndex = allTopicsInCategory.findIndex((t) => t.id === topic.id);

  const accentChip =
    "bg-[oklch(0.94_0.04_165)] text-[oklch(0.38_0.10_165)] border-[oklch(0.55_0.10_165)]/30";

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.014_165)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-[oklch(0.985_0.014_165)]/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">BigIELTS.com</span>
          </Link>

          <BackButton
            to="/speaking-samples"
            ariaLabel="Back to All Speaking Topics"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-white text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          />
        </div>
      </header>

      <main className="relative pt-10 sm:pt-14">
        {/* Soft sage ruled overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[260px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 39px, oklch(0.45 0.08 165 / 0.10) 39px, oklch(0.45 0.08 165 / 0.10) 40px)",
          }}
        />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Eyebrow */}
          <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-[oklch(0.42_0.10_165)]">
            T{String(Math.max(topicIndex, 0) + 1).padStart(2, "0")} · {isCue ? "Cue Cards & Follow-Ups" : "General Questions"}
          </p>

          {/* Topic title */}
          <h1
            className="mt-3 font-display font-black leading-[1.0] tracking-tight text-foreground"
            style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)" }}
          >
            {topic.label}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] font-medium leading-relaxed text-foreground/65 sm:text-base">
            {isCue
              ? "A Part 2 cue card with examiner follow-ups. The first sample answer is unlocked — upgrade to view all Band 8+ models."
              : "Part 1 / 3 sample questions for this topic. The first model answer is unlocked — upgrade for the rest."}
          </p>

          {/* Questions grid on sage paper */}
          <div className="relative mt-12 left-1/2 right-1/2 -mx-[50vw] w-screen bg-paper-sage pb-20 sm:mt-16 sm:pb-28">
            <div className="relative mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {questions.map((q, i) => {
                  const isUnlocked = i === 0;
                  return (
                    <article
                      key={q.id}
                      className="group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-foreground/10 bg-white p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/40">
                          Q{String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accentChip}`}>
                            <Mic className="h-3 w-3" strokeWidth={2.6} />
                            {isCue ? "Part 2" : "Part 1 / 3"}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground/60">
                            {q.difficulty}
                          </span>
                        </div>
                      </div>

                      <p className="whitespace-pre-line font-display text-[15px] font-bold leading-snug tracking-tight text-foreground">
                        {q.title}
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-2 border-t border-foreground/8 pt-3">
                        <span className="text-[11px] font-semibold text-foreground/55">
                          {topic.label}
                        </span>
                        {isUnlocked ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.50_0.10_165)] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-soft transition-transform hover:-translate-y-0.5"
                          >
                            View answer
                            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.6} />
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-foreground/55">
                            <Lock className="h-3.5 w-3.5" />
                            Pro
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
