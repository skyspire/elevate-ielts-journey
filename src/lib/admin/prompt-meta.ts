// Per-prompt metadata: status (draft/published), last edited, version history.
// Keyed by `${categoryKey}-${index+1}` (same scheme as questionId / sampleAnswers).
//
// History is a ring buffer (max 10) of { ts, prompt, answer? } snapshots so an
// admin can revert any single prompt without losing other edits.

import { useMemo } from "react";
import { useCmsSection } from "@/lib/admin/cms-store";
import type { AnswerParagraph } from "@/data/sample-answers";
import type { WritingAnswerOverride } from "@/lib/admin/writing-answers";

export const PROMPT_META_KEY = "prompt-meta";

export type PromptStatus = "draft" | "published";

export type PromptHistoryEntry = {
  /** Unix ms */
  ts: number;
  /** Who made the change (best-effort, may be empty) */
  editedBy?: string;
  /** Prompt body at this revision */
  prompt: string;
  /** Optional model-answer snapshot (writing only) */
  answer?: WritingAnswerOverride;
  /** Short label e.g. "edited", "duplicated", "answer updated" */
  action: "created" | "edited" | "duplicated" | "answer-updated" | "status-changed" | "restored";
};

export type PromptMeta = {
  status: PromptStatus;
  lastEditedAt?: number;
  lastEditedBy?: string;
  history: PromptHistoryEntry[];
};

export type PromptMetaStore = Record<string, PromptMeta>;
export const PROMPT_META_DEFAULT: PromptMetaStore = {};
const HISTORY_LIMIT = 10;

export function getPromptMeta(store: PromptMetaStore, id: string): PromptMeta {
  return (
    store[id] ?? {
      status: "published",
      history: [],
    }
  );
}

/** Pure helper — returns next store with a single change applied. */
export function applyPromptChange(
  store: PromptMetaStore,
  id: string,
  patch: {
    status?: PromptStatus;
    editedBy?: string;
    snapshot?: { prompt: string; answer?: WritingAnswerOverride };
    action?: PromptHistoryEntry["action"];
  },
): PromptMetaStore {
  const prev = getPromptMeta(store, id);
  const ts = Date.now();
  const next: PromptMeta = {
    status: patch.status ?? prev.status,
    lastEditedAt: ts,
    lastEditedBy: patch.editedBy ?? prev.lastEditedBy,
    history: prev.history,
  };
  if (patch.snapshot) {
    const entry: PromptHistoryEntry = {
      ts,
      editedBy: patch.editedBy,
      prompt: patch.snapshot.prompt,
      answer: patch.snapshot.answer,
      action: patch.action ?? "edited",
    };
    next.history = [entry, ...prev.history].slice(0, HISTORY_LIMIT);
  }
  return { ...store, [id]: next };
}

export function useAllPromptMeta(): PromptMetaStore {
  return useCmsSection<PromptMetaStore>(PROMPT_META_KEY, PROMPT_META_DEFAULT);
}

export function usePromptMeta(id: string): PromptMeta {
  const all = useAllPromptMeta();
  return useMemo(() => getPromptMeta(all, id), [all, id]);
}

/** Build a stable id matching writing-answers / sampleAnswers keying. */
export function promptIdOf(categoryKey: string, index: number) {
  return `${categoryKey}-${index + 1}`;
}

/** Format an ISO-ish "12 min ago" string. */
export function timeAgo(ts: number | undefined): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr${hr === 1 ? "" : "s"} ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? "" : "s"} ago`;
  return new Date(ts).toLocaleDateString();
}
