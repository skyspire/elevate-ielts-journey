// Helper: look up the list of questions for a given questionId.
// Mirrors the logic in writing-samples.index.tsx so the detail page can
// build prev/next + related-question links from the same source of truth.
import { task2Prompts } from "./writing-prompts";

const TOPICS = ["Work", "Education", "Society", "Environment", "Technology", "Health", "Travel", "Lifestyle"] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type SiblingQuestion = {
  id: string;
  title: string;
  topic: string;
  difficulty: (typeof DIFFICULTIES)[number];
};

// All categories that have a defined prompt set in writing-prompts.ts
const CATEGORY_LABELS: Record<string, string> = {
  opinion: "Opinion Essay",
  discussion: "Discussion Essay",
  advdis: "Advantages & Disadvantages Essay",
  problem: "Problem & Solution Essay",
  direct: "Direct Question Essay",
  posneg: "Positive or Negative Development Essay",
  cause: "Cause and Effect Essay",
};

export function getCategoryLabel(categoryId: string): string {
  return CATEGORY_LABELS[categoryId] ?? "Sample";
}

// Parse "opinion-3" -> { categoryId: "opinion", index: 2 (zero-based) }
export function parseQuestionId(questionId: string): { categoryId: string; index: number } | null {
  const m = questionId.match(/^(.+)-(\d+)$/);
  if (!m) return null;
  const idx = parseInt(m[2], 10) - 1;
  if (Number.isNaN(idx) || idx < 0) return null;
  return { categoryId: m[1], index: idx };
}

export function getQuestionsForCategory(categoryId: string): SiblingQuestion[] {
  const prompts = task2Prompts[categoryId];
  if (!prompts || prompts.length === 0) return [];
  return prompts.map((statement, i) => ({
    id: `${categoryId}-${i + 1}`,
    title: statement,
    topic: TOPICS[i % TOPICS.length],
    difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
  }));
}

export function getSiblingQuestions(questionId: string) {
  const parsed = parseQuestionId(questionId);
  if (!parsed) return { current: null, prev: null, next: null, all: [] as SiblingQuestion[], categoryLabel: "Sample" };
  const all = getQuestionsForCategory(parsed.categoryId);
  const current = all[parsed.index] ?? null;
  const prev = parsed.index > 0 ? all[parsed.index - 1] : null;
  const next = parsed.index < all.length - 1 ? all[parsed.index + 1] : null;
  return { current, prev, next, all, categoryLabel: getCategoryLabel(parsed.categoryId) };
}
