// CMS-backed model answers for prediction questions.
// Keyed by a slug derived from the question title.

import { getSection, setSection, useCmsSection } from "@/lib/admin/cms-store";

export const PREDICTIONS_ANSWERS_KEY = "predictions-answers";

export type PredictionAnswer = {
  /** Full model answer body (plain text or simple markdown — paragraphs split on blank lines). */
  body: string;
  /** Optional band score label (e.g. "Band 9"). */
  bandScore?: string;
  /** Optional examiner-style note shown above the answer. */
  note?: string;
  /** ISO timestamp updated. */
  updatedAt?: string;
};

export type PredictionsAnswers = Record<string, PredictionAnswer>;
export const PREDICTIONS_ANSWERS_DEFAULT: PredictionsAnswers = {};

/** Stable slug for a prediction title. */
export function predictionSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** React hook returning the answer for a prediction title, reactive to CMS changes. */
export function usePredictionAnswer(title: string): PredictionAnswer | undefined {
  const all = useCmsSection<PredictionsAnswers>(
    PREDICTIONS_ANSWERS_KEY,
    PREDICTIONS_ANSWERS_DEFAULT,
  );
  return all[predictionSlug(title)];
}

/** Save (or clear) an answer for a prediction title. */
export function savePredictionAnswer(
  title: string,
  patch: PredictionAnswer | null,
) {
  const slug = predictionSlug(title);
  setCmsSection<PredictionsAnswers>(
    PREDICTIONS_ANSWERS_KEY,
    PREDICTIONS_ANSWERS_DEFAULT,
    (prev) => {
      const next = { ...prev };
      if (patch == null || !patch.body?.trim()) {
        delete next[slug];
      } else {
        next[slug] = { ...patch, updatedAt: new Date().toISOString() };
      }
      return next;
    },
  );
}

/** Split body into paragraphs on blank lines. */
export function answerParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
