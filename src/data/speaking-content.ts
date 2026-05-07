// Speaking content store types & helpers — Part 1 Q&A and Part 2 cue cards.
// Stored under a single CMS section keyed by `${categoryId}:${topicId}`.

export type Part1Qa = {
  id: string;
  question: string;
  answer: string;
  vocab: string[]; // key phrases / collocations
  tip: string; // short examiner tip
};

export type Part2FollowUp = {
  id: string;
  question: string;
  answer: string;
};

export type Part2CueCard = {
  cuePrompt: string; // full Part 2 cue with "You should say:" bullets
  sampleAnswer: string; // Band 8+ long-turn model answer
  followUps: Part2FollowUp[];
};

export type TopicStatus = "draft" | "published";

// One topic key carries either Part 1 Q&A list (general categories)
// or Part 2 cue card content (cc-* categories).
// `status` controls whether learners see the topic (drafts are admin-only).
export type TopicContent = {
  part1?: Part1Qa[];
  part2?: Part2CueCard;
  status?: TopicStatus; // defaults to "published" when missing
  updatedAt?: number; // ms epoch — used for "Recently added" rows
};

export function isPublished(tc: TopicContent | undefined): boolean {
  return (tc?.status ?? "published") === "published";
}

export type SpeakingContentMap = Record<string, TopicContent>;

export const SPEAKING_CONTENT_KEY = "speaking-content";
export const SPEAKING_CONTENT_DEFAULT: SpeakingContentMap = {};

export function contentKey(categoryId: string, topicId: string): string {
  return `${categoryId}:${topicId}`;
}

export function makeId(prefix = "i"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
