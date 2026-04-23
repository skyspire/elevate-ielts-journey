// Per-user, per-book reader state stored in localStorage.
// Stores: progress (current page), bookmarks, highlights, reader prefs.

import { useEffect, useState, useCallback } from "react";

export type Highlight = {
  id: string;
  pageIndex: number;
  text: string;
  note?: string;
  color: "yellow" | "green" | "pink";
  createdAt: number;
};

export type ReaderState = {
  currentPage: number;
  bookmarks: number[]; // page indices
  highlights: Highlight[];
};

export type ReaderPrefs = {
  fontSize: "sm" | "md" | "lg" | "xl";
  theme: "light" | "sepia" | "dark";
};

const STATE_PREFIX = "bigielts:ebook:state:";
const PREFS_KEY = "bigielts:ebook:prefs";

const VALID_HIGHLIGHT_COLORS = new Set<Highlight["color"]>(["yellow", "green", "pink"]);
const VALID_FONT_SIZES = new Set<ReaderPrefs["fontSize"]>(["sm", "md", "lg", "xl"]);
const VALID_THEMES = new Set<ReaderPrefs["theme"]>(["light", "sepia", "dark"]);

function isBrowser() {
  return typeof window !== "undefined";
}

const defaultState: ReaderState = { currentPage: 0, bookmarks: [], highlights: [] };
const defaultPrefs: ReaderPrefs = { fontSize: "md", theme: "sepia" };

function normalizePageIndex(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

function normalizeHighlight(value: unknown): Highlight | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<Highlight>;
  if (typeof candidate.text !== "string" || !candidate.text.trim()) return null;

  return {
    id: typeof candidate.id === "string" && candidate.id ? candidate.id : `h_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    pageIndex: normalizePageIndex(candidate.pageIndex),
    text: candidate.text,
    note: typeof candidate.note === "string" ? candidate.note : undefined,
    color: VALID_HIGHLIGHT_COLORS.has(candidate.color as Highlight["color"])
      ? (candidate.color as Highlight["color"])
      : "yellow",
    createdAt:
      typeof candidate.createdAt === "number" && Number.isFinite(candidate.createdAt)
        ? candidate.createdAt
        : Date.now(),
  };
}

function normalizeReaderState(value: unknown): ReaderState {
  if (!value || typeof value !== "object") return defaultState;

  const candidate = value as Partial<ReaderState>;
  const bookmarks = Array.isArray(candidate.bookmarks)
    ? Array.from(new Set(candidate.bookmarks.map(normalizePageIndex))).sort((a, b) => a - b)
    : [];
  const highlights = Array.isArray(candidate.highlights)
    ? candidate.highlights.map(normalizeHighlight).filter((item): item is Highlight => item !== null)
    : [];

  return {
    currentPage: normalizePageIndex(candidate.currentPage),
    bookmarks,
    highlights,
  };
}

function normalizeReaderPrefs(value: unknown): ReaderPrefs {
  if (!value || typeof value !== "object") return defaultPrefs;

  const candidate = value as Partial<ReaderPrefs>;
  return {
    fontSize: VALID_FONT_SIZES.has(candidate.fontSize as ReaderPrefs["fontSize"])
      ? (candidate.fontSize as ReaderPrefs["fontSize"])
      : defaultPrefs.fontSize,
    theme: VALID_THEMES.has(candidate.theme as ReaderPrefs["theme"])
      ? (candidate.theme as ReaderPrefs["theme"])
      : defaultPrefs.theme,
  };
}

function stateKey(userId: string | null, bookId: string) {
  return `${STATE_PREFIX}${userId ?? "guest"}:${bookId}`;
}

export function getReaderState(userId: string | null, bookId: string): ReaderState {
  if (!isBrowser()) return defaultState;
  try {
    const raw = window.localStorage.getItem(stateKey(userId, bookId));
    if (!raw) return defaultState;
    return normalizeReaderState(JSON.parse(raw));
  } catch {
    return defaultState;
  }
}

export function saveReaderState(userId: string | null, bookId: string, state: ReaderState) {
  if (!isBrowser()) return;
  window.localStorage.setItem(stateKey(userId, bookId), JSON.stringify(normalizeReaderState(state)));
}

export function getReaderPrefs(): ReaderPrefs {
  if (!isBrowser()) return defaultPrefs;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPrefs;
    return normalizeReaderPrefs(JSON.parse(raw));
  } catch {
    return defaultPrefs;
  }
}

export function saveReaderPrefs(prefs: ReaderPrefs) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(normalizeReaderPrefs(prefs)));
}

export function useReaderPrefs() {
  const [prefs, setPrefs] = useState<ReaderPrefs>(() => getReaderPrefs());
  const update = useCallback((next: Partial<ReaderPrefs>) => {
    setPrefs((prev) => {
      const merged = { ...prev, ...next };
      saveReaderPrefs(merged);
      return merged;
    });
  }, []);
  return [prefs, update] as const;
}

export function useReaderState(userId: string | null, bookId: string) {
  const [state, setState] = useState<ReaderState>(() => getReaderState(userId, bookId));

  useEffect(() => {
    setState(getReaderState(userId, bookId));
  }, [userId, bookId]);

  const update = useCallback(
    (next: ReaderState | ((prev: ReaderState) => ReaderState)) => {
      setState((prev) => {
        const value = typeof next === "function" ? (next as (p: ReaderState) => ReaderState)(prev) : next;
        saveReaderState(userId, bookId, value);
        return value;
      });
    },
    [userId, bookId],
  );

  return [state, update] as const;
}
