// Global activity log — ring buffer (max 200) of CMS events.
// Anything that mutates content should call `logActivity(...)` so we can show
// a "what changed" feed in /admin/activity.

import { useCmsSection, getSection, setSection } from "@/lib/admin/cms-store";

export const ACTIVITY_LOG_KEY = "activity-log";
const LIMIT = 200;

export type ActivityKind =
  | "prompt-edited"
  | "prompt-added"
  | "prompt-deleted"
  | "prompt-duplicated"
  | "answer-edited"
  | "answer-reset"
  | "status-changed"
  | "settings-edited"
  | "imported"
  | "reset-all";

export type ActivityEntry = {
  ts: number;
  kind: ActivityKind;
  /** Short human-readable description */
  message: string;
  /** Optional area path e.g. "academic / writing / task2 / opinion" */
  area?: string;
  /** Who did it (best-effort) */
  user?: string;
};

export const ACTIVITY_LOG_DEFAULT: ActivityEntry[] = [];

export function logActivity(entry: Omit<ActivityEntry, "ts">) {
  const list = getSection<ActivityEntry[]>(ACTIVITY_LOG_KEY, ACTIVITY_LOG_DEFAULT);
  const next: ActivityEntry[] = [{ ts: Date.now(), ...entry }, ...list].slice(0, LIMIT);
  setSection(ACTIVITY_LOG_KEY, next);
}

export function useActivityLog(): ActivityEntry[] {
  return useCmsSection<ActivityEntry[]>(ACTIVITY_LOG_KEY, ACTIVITY_LOG_DEFAULT);
}

export function clearActivityLog() {
  setSection(ACTIVITY_LOG_KEY, []);
}
