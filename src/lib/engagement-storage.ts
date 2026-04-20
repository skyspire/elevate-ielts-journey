// Lightweight localStorage-backed helpers for bookmarks + comments.
// We can swap these out for Lovable Cloud later without touching UI.

const BOOKMARKS_KEY = "bandpath:bookmarks";
const COMMENTS_KEY_PREFIX = "bandpath:comments:";
const STUDIED_KEY = "bandpath:studied";
const DIFFICULTY_VOTES_KEY = "bandpath:difficulty-votes"; // user's own votes
const DIFFICULTY_TALLY_KEY = "bandpath:difficulty-tally"; // aggregate counts (local-only stand-in for community)

export type DifficultyVote = "Easy" | "Medium" | "Hard";
export type DifficultyTally = Record<DifficultyVote, number>;

export type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: number; // epoch ms
};

// ───────── Bookmarks ─────────
export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function isBookmarked(questionId: string): boolean {
  return getBookmarks().includes(questionId);
}

export function toggleBookmark(questionId: string): boolean {
  if (typeof window === "undefined") return false;
  const list = getBookmarks();
  const has = list.includes(questionId);
  const next = has ? list.filter((x) => x !== questionId) : [...list, questionId];
  window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  return !has; // returns the new bookmarked state
}

// ───────── Comments (per question) ─────────
function commentsKey(questionId: string) {
  return `${COMMENTS_KEY_PREFIX}${questionId}`;
}

export function getComments(questionId: string): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(commentsKey(questionId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is Comment =>
        c &&
        typeof c.id === "string" &&
        typeof c.author === "string" &&
        typeof c.body === "string" &&
        typeof c.createdAt === "number"
    );
  } catch {
    return [];
  }
}

export function addComment(questionId: string, author: string, body: string): Comment {
  const comment: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: author.trim() || "Anonymous",
    body: body.trim(),
    createdAt: Date.now(),
  };
  const list = getComments(questionId);
  const next = [comment, ...list];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(commentsKey(questionId), JSON.stringify(next));
  }
  return comment;
}

// ───────── Studied (per question) ─────────
export function getStudied(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STUDIED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function isStudied(questionId: string): boolean {
  return getStudied().includes(questionId);
}

export function toggleStudied(questionId: string): boolean {
  if (typeof window === "undefined") return false;
  const list = getStudied();
  const has = list.includes(questionId);
  const next = has ? list.filter((x) => x !== questionId) : [...list, questionId];
  window.localStorage.setItem(STUDIED_KEY, JSON.stringify(next));
  return !has;
}

// ───────── Difficulty votes ─────────
function readVotes(): Record<string, DifficultyVote> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DIFFICULTY_VOTES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, DifficultyVote>) : {};
  } catch {
    return {};
  }
}

function readTally(): Record<string, DifficultyTally> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DIFFICULTY_TALLY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, DifficultyTally>) : {};
  } catch {
    return {};
  }
}

export function getMyDifficultyVote(questionId: string): DifficultyVote | null {
  return readVotes()[questionId] ?? null;
}

export function getDifficultyTally(questionId: string): DifficultyTally {
  return readTally()[questionId] ?? { Easy: 0, Medium: 0, Hard: 0 };
}

export function setDifficultyVote(questionId: string, vote: DifficultyVote): DifficultyTally {
  if (typeof window === "undefined") return { Easy: 0, Medium: 0, Hard: 0 };
  const votes = readVotes();
  const tallyAll = readTally();
  const previous = votes[questionId];
  const tally: DifficultyTally =
    tallyAll[questionId] ?? { Easy: 0, Medium: 0, Hard: 0 };

  if (previous === vote) return tally;
  if (previous) {
    tally[previous] = Math.max(0, tally[previous] - 1);
  }
  tally[vote] = (tally[vote] ?? 0) + 1;

  votes[questionId] = vote;
  tallyAll[questionId] = tally;
  window.localStorage.setItem(DIFFICULTY_VOTES_KEY, JSON.stringify(votes));
  window.localStorage.setItem(DIFFICULTY_TALLY_KEY, JSON.stringify(tallyAll));
  return tally;
}


export function deleteComment(questionId: string, commentId: string) {
  const list = getComments(questionId).filter((c) => c.id !== commentId);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(commentsKey(questionId), JSON.stringify(list));
  }
}
