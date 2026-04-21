import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  GraduationCap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Mic,
  Lock,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import {
  getSpeakingQuestions,
  getTopic,
  isCueCardCategory,
} from "@/data/speaking-questions";
import {
  getSpeakingModelAnswer,
  type SpeakingAnswerVariant,
} from "@/data/speaking-model-answers";

export const Route = createFileRoute(
  "/speaking-samples/$category/$topic/followup/$index",
)({
  loader: ({ params }) => {
    const topic = getTopic(params.category, params.topic);
    if (!topic) throw notFound();
    if (!isCueCardCategory(params.category)) throw notFound();

    const questions = getSpeakingQuestions(params.category, params.topic);
    // Skip index 0 (cue card itself); follow-ups are 1..n
    const followUps = questions.slice(1);
    const idx = parseInt(params.index, 10);
    if (Number.isNaN(idx) || idx < 1 || idx > followUps.length) throw notFound();

    const question = followUps[idx - 1];
    const answer = getSpeakingModelAnswer(question.title, true);
    const variants: SpeakingAnswerVariant[] =
      answer.variants && answer.variants.length > 0
        ? answer.variants
        : [
            {
              label: "Sample answer",
              bandScore: answer.bandScore,
              sections: answer.sections,
            },
          ];

    return {
      topic,
      question,
      variants,
      index: idx,
      total: followUps.length,
      categoryId: params.category,
      topicId: params.topic,
    };
  },
  head: ({ loaderData }) => {
    const label = loaderData?.topic.label ?? "Speaking";
    const idx = loaderData?.index ?? 1;
    const title = `Follow-up ${idx} — ${label} — BigIELTS.com`;
    const desc = `Band 8+ examiner follow-up sample answers for ${label} (Question ${idx}).`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: FollowUpPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[oklch(0.985_0.014_165)] px-6 text-center">
      <p className="font-display text-2xl font-extrabold tracking-tight text-foreground">
        Follow-up not found
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

// Vibrant pastel palette mirrors the follow-up rail tiles on the cue-card
// reader (Peach · Mint · Lilac). Each variant tab gets its own tone so the
// page identity quietly shifts when you switch sample answers.
const variantPalette = [
  {
    name: "Peach",
    fill: "oklch(0.965 0.040 55)",
    ink: "oklch(0.30 0.060 40)",
    accent: "oklch(0.70 0.150 45)",
  },
  {
    name: "Mint",
    fill: "oklch(0.960 0.045 175)",
    ink: "oklch(0.28 0.050 190)",
    accent: "oklch(0.65 0.130 180)",
  },
  {
    name: "Lilac",
    fill: "oklch(0.955 0.045 295)",
    ink: "oklch(0.30 0.060 295)",
    accent: "oklch(0.65 0.155 300)",
  },
];

function FollowUpPage() {
  const { topic, question, variants, index, total, categoryId, topicId } =
    Route.useLoaderData();

  const [variantIndex, setVariantIndex] = useState(0);
  const tone = variantPalette[variantIndex % variantPalette.length];
  const currentVariant = variants[Math.min(variantIndex, variants.length - 1)];

  // First variant is unlocked; others are gated behind Pro.
  const isUnlocked = variantIndex === 0;

  const prevIndex = index > 1 ? index - 1 : null;
  const nextIndex = index < total ? index + 1 : null;

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.014_165)]">
      {/* Top bar — same shell as the cue-card sample page */}
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-[oklch(0.985_0.014_165)]/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              BigIELTS.com
            </span>
          </Link>

          <Link
            to="/speaking-samples/$category/$topic"
            params={{ category: categoryId, topic: topicId }}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to topic
          </Link>
        </div>
      </header>

      <main className="relative pt-10 sm:pt-14">
        {/* Soft sage ruled overlay — matches the topic page hero */}
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
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "oklch(0.94 0.04 165)",
                color: "oklch(0.38 0.10 165)",
                borderColor: "oklch(0.55 0.10 165 / 0.30)",
              }}
            >
              <Mic className="h-3 w-3" strokeWidth={2.6} />
              Part 3 · Examiner Follow-up
            </span>
            <span className="font-handwriting text-[15px] leading-none text-foreground/55">
              {topic.label}
            </span>
          </div>

          {/* Big numbered badge + question */}
          <div className="mt-6 flex items-start gap-5 sm:gap-6">
            <div
              className="flex shrink-0 items-center justify-center rounded-full"
              style={{
                width: "clamp(64px, 7vw, 88px)",
                height: "clamp(64px, 7vw, 88px)",
                border: `3px solid ${tone.accent}`,
                backgroundColor: tone.fill,
                color: tone.accent,
                boxShadow: `0 6px 20px -6px ${tone.accent}55`,
                transition: "all 380ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              aria-hidden
            >
              <span
                className="font-display font-black tabular-nums leading-none tracking-tight"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
              >
                {String(index).padStart(2, "0")}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/45">
                Follow-up {index} of {total}
              </p>
              <h1
                className="mt-2 font-display font-black leading-[1.05] tracking-tight text-foreground"
                style={{ fontSize: "clamp(1.5rem, 4.2vw, 2.5rem)" }}
              >
                {question.title}
              </h1>
            </div>
          </div>

          {/* Answer card on tinted paper — mirrors the cue card sample style */}
          <div
            className="relative mt-12 left-1/2 right-1/2 -mx-[50vw] w-screen pb-20 sm:mt-14 sm:pb-28"
            style={{
              backgroundColor: tone.fill,
              transition: "background-color 480ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="relative mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
              {/* Variant tabs — three sample answers like the cue card reader */}
              {variants.length > 1 && (
                <div
                  className="mb-8 flex flex-wrap items-center gap-2 rounded-full border bg-white/80 p-1.5 backdrop-blur-sm"
                  style={{ borderColor: `${tone.accent}33` }}
                  role="tablist"
                  aria-label="Sample answer variants"
                >
                  {variants.map((v, i) => {
                    const t = variantPalette[i % variantPalette.length];
                    const active = i === variantIndex;
                    return (
                      <button
                        key={v.label}
                        role="tab"
                        aria-selected={active}
                        type="button"
                        onClick={() => setVariantIndex(i)}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition-all"
                        style={{
                          backgroundColor: active ? t.accent : "transparent",
                          color: active ? "white" : t.ink,
                          opacity: active ? 1 : 0.75,
                        }}
                      >
                        <span className="tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{v.label}</span>
                        {i > 0 && !active && <Lock className="h-3 w-3" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Answer body or upgrade gate */}
              {isUnlocked ? (
                <article
                  key={variantIndex}
                  className="rounded-2xl border bg-white p-6 shadow-soft sm:p-9"
                  style={{
                    borderColor: `${tone.accent}33`,
                    borderTop: `5px solid ${tone.accent}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-foreground/8 pb-4">
                    <span
                      className="font-handwriting text-[18px] leading-none"
                      style={{ color: tone.ink }}
                    >
                      {currentVariant.label}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${tone.accent}22`,
                        color: tone.ink,
                      }}
                    >
                      Band {currentVariant.bandScore}
                    </span>
                  </div>

                  <div className="mt-6 space-y-6">
                    {currentVariant.sections.map((s, i) => (
                      <div key={`${variantIndex}-${i}`}>
                        <h3
                          className="font-display text-[12px] font-extrabold uppercase tracking-[0.18em]"
                          style={{ color: tone.accent }}
                        >
                          {s.heading}
                        </h3>
                        <p className="mt-2 text-[15px] leading-[1.75] text-foreground/85 sm:text-[16px]">
                          {s.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              ) : (
                <div
                  className="rounded-2xl border-2 border-dashed bg-white/60 p-8 text-center sm:p-12"
                  style={{ borderColor: `${tone.accent}55` }}
                >
                  <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${tone.accent}22`, color: tone.ink }}
                  >
                    <Lock className="h-5 w-5" />
                  </div>
                  <p
                    className="mt-4 font-display text-xl font-extrabold tracking-tight"
                    style={{ color: tone.ink }}
                  >
                    {currentVariant.label} is a Pro sample
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    Unlock all three Band 8+ variants for every follow-up question.
                  </p>
                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-soft transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: tone.accent }}
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}

              {/* Footer pager — prev / next follow-up */}
              <nav
                className="mt-10 flex items-center justify-between gap-3 border-t pt-6"
                style={{ borderColor: `${tone.accent}33` }}
                aria-label="Follow-up navigation"
              >
                {prevIndex ? (
                  <Link
                    to="/speaking-samples/$category/$topic/followup/$index"
                    params={{
                      category: categoryId,
                      topic: topicId,
                      index: String(prevIndex),
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-white/80 px-4 py-2 text-[12px] font-bold backdrop-blur-sm transition-all hover:-translate-y-0.5"
                    style={{ color: tone.ink, borderColor: `${tone.accent}55` }}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev follow-up
                  </Link>
                ) : (
                  <span />
                )}

                <span
                  className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em]"
                  style={{ color: tone.ink, opacity: 0.65 }}
                >
                  {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>

                {nextIndex ? (
                  <Link
                    to="/speaking-samples/$category/$topic/followup/$index"
                    params={{
                      category: categoryId,
                      topic: topicId,
                      index: String(nextIndex),
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-soft transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: tone.accent }}
                  >
                    Next follow-up
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <Link
                    to="/speaking-samples/$category/$topic"
                    params={{ category: categoryId, topic: topicId }}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-soft transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: tone.accent }}
                  >
                    Back to topic
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
