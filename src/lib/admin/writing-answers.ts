// CMS-backed model answer store.
// Keys are question ids ("opinion-1", "discussion-3", …) — same scheme used by
// the public Writing Samples detail page.
//
// Stored as a partial override on top of the imported `sampleAnswers` so the
// admin only needs to author the fields they want to change; everything else
// falls back to defaults.

import { useMemo } from "react";
import { sampleAnswers, type SampleAnswer, type AnswerParagraph } from "@/data/sample-answers";
import { useCmsSection } from "@/lib/admin/cms-store";

export const WRITING_ANSWERS_KEY = "writing-answers";

/** Subset of SampleAnswer that the simple admin editor controls today. */
export type WritingAnswerOverride = {
  bandScore?: string;
  wordCount?: number;
  paragraphs?: AnswerParagraph[];
};

export type WritingAnswersOverrides = Record<string, WritingAnswerOverride>;
export const WRITING_ANSWERS_DEFAULT: WritingAnswersOverrides = {};

/** Compute word count from an array of paragraphs. */
export function computeWordCount(paragraphs: AnswerParagraph[]): number {
  return paragraphs
    .map((p) => p.body.trim().split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);
}

/** Merge the override (if any) into the default sample answer for a given id. */
export function mergeAnswer(
  questionId: string,
  overrides: WritingAnswersOverrides,
): SampleAnswer | undefined {
  const base = sampleAnswers[questionId];
  const ov = overrides[questionId];

  if (!base && !ov) return undefined;

  if (!ov) return base;

  // Allow "creating" an answer for a question that has no default.
  if (!base) {
    if (!ov.paragraphs || ov.paragraphs.length === 0) return undefined;
    return {
      bandScore: ov.bandScore ?? "8.5",
      wordCount: ov.wordCount ?? computeWordCount(ov.paragraphs),
      paragraphs: ov.paragraphs,
      structure: [],
      vocabulary: [],
      tips: [],
    };
  }

  // Override on top of base.
  const paragraphs = ov.paragraphs ?? base.paragraphs;
  return {
    ...base,
    bandScore: ov.bandScore ?? base.bandScore,
    paragraphs,
    wordCount: ov.wordCount ?? computeWordCount(paragraphs),
  };
}

/** React hook returning a merged answer for a question id, reactive to CMS changes. */
export function useWritingAnswer(questionId: string): SampleAnswer | undefined {
  const overrides = useCmsSection<WritingAnswersOverrides>(
    WRITING_ANSWERS_KEY,
    WRITING_ANSWERS_DEFAULT,
  );
  return useMemo(() => mergeAnswer(questionId, overrides), [questionId, overrides]);
}
