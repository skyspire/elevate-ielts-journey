import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Maximize2, Sparkles } from "lucide-react";
import { z } from "zod";
import { parseQuestionId } from "@/data/question-helpers";
import {
  useWritingAnswer,
  WRITING_ANSWERS_KEY,
  WRITING_ANSWERS_DEFAULT,
  type WritingAnswersOverrides,
} from "@/lib/admin/writing-answers";
import { useCmsSection } from "@/lib/admin/cms-store";
import { WritingAnswerBillboard } from "@/components/site/WritingAnswerBillboard";
import { BackButton } from "@/components/site/BackButton";
import { QuotaGate } from "@/components/site/QuotaGate";
import { SampleAnswerModal } from "@/components/site/SampleAnswerModal";

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
      { title: `${match.search.title || "Sample Question"} — BigIELTS.com` },
      {
        name: "description",
        content:
          "View an IELTS Writing sample question with the full Band 8+ model answer in a distraction-free, full-screen reader.",
      },
    ],
  }),
  component: GatedQuestionDetailPage,
});

function GatedQuestionDetailPage() {
  const { questionId } = Route.useParams();
  return (
    <QuotaGate itemKey={`writing:${questionId}`}>
      <QuestionDetailPage />
    </QuotaGate>
  );
}

function QuestionDetailPage() {
  const search = Route.useSearch();
  const { questionId } = Route.useParams();
  const module = search.module ?? "general";
  const title = search.title || "Sample Question";

  const answer = useWritingAnswer(questionId);
  const overrides = useCmsSection<WritingAnswersOverrides>(
    WRITING_ANSWERS_KEY,
    WRITING_ANSWERS_DEFAULT,
  );
  const questionImage = overrides[questionId]?.imageDataUrl;

  // 1-based question index within its category — drives the big numeral
  // shown in the billboard's left column.
  const questionNumber = useMemo(() => {
    const parsed = parseQuestionId(questionId);
    return parsed ? parsed.index + 1 : 1;
  }, [questionId]);

  // Always start at the top when this page opens
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [questionId]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-paper-cream">
      {/* Floating back button — circular, top-right */}
      <BackButton
        to="/writing-samples"
        search={{ module }}
        ariaLabel="Back to Writing Samples"
      />

      {answer ? (
        <WritingAnswerBillboard
          questionTitle={title}
          questionNumber={questionNumber}
          answer={answer}
          questionImage={questionImage}
          fullScreen
        />
      ) : (
        <div className="flex h-full items-center justify-center px-6">
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-white/60 p-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              Coming soon
            </span>
            <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight text-foreground">
              Band 8+ model answer
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] font-medium leading-relaxed text-foreground/65">
              A full sample answer for this question will be available here shortly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
