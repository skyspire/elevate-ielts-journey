// Workflow store — adds scheduled publishing, draft → review → publish status,
// and version history with rollback for arbitrary CMS sections.
// localStorage only (prototype).

import { useEffect, useState, useCallback } from "react";
import { getSection, setSection } from "@/lib/admin/cms-store";

const SCHEDULE_KEY = "bigielts:workflow:schedule";
const STATUS_KEY = "bigielts:workflow:status";
const VERSIONS_KEY = "bigielts:workflow:versions";
const EVT = "workflow:changed";

export type WorkflowStatus = "draft" | "in-review" | "published";

export type ScheduleEntry = {
  /** CMS section key */
  key: string;
  /** Snapshot of value to publish at the scheduled time */
  payload: unknown;
  /** Epoch ms */
  publishAt: number;
  /** Optional auto-expire epoch ms */
  expireAt?: number;
  /** Restore value when expired (if not set, the section is reset) */
  expirePayload?: unknown;
  createdAt: number;
  createdBy?: string;
  applied?: boolean;
  expired?: boolean;
};

export type StatusEntry = {
  key: string;
  status: WorkflowStatus;
  updatedAt: number;
  updatedBy?: string;
  notes?: string;
};

export type VersionEntry = {
  id: string;
  key: string;
  /** Snapshot of the section value at this point in time */
  snapshot: unknown;
  takenAt: number;
  takenBy?: string;
  label?: string;
};

const VERSION_LIMIT = 20;

function isBrowser() {
  return typeof window !== "undefined";
}
function read<T>(k: string, f: T): T {
  if (!isBrowser()) return f;
  try {
    const r = window.localStorage.getItem(k);
    return r ? ((JSON.parse(r) as T) ?? f) : f;
  } catch {
    return f;
  }
}
function write<T>(k: string, v: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent(EVT));
}

// ───────── Schedule ─────────

export function getSchedules(): ScheduleEntry[] {
  return read<ScheduleEntry[]>(SCHEDULE_KEY, []);
}
export function saveSchedules(s: ScheduleEntry[]) {
  write(SCHEDULE_KEY, s);
}
export function addSchedule(entry: Omit<ScheduleEntry, "createdAt" | "applied" | "expired">) {
  saveSchedules([...getSchedules(), { ...entry, createdAt: Date.now() }]);
}
export function deleteSchedule(key: string, publishAt: number) {
  saveSchedules(getSchedules().filter((s) => !(s.key === key && s.publishAt === publishAt)));
}

/** Apply any due/expired schedules. Idempotent — call from a ticker. */
export function tickSchedules() {
  const now = Date.now();
  const list = getSchedules();
  let changed = false;
  for (const s of list) {
    if (!s.applied && s.publishAt <= now) {
      // snapshot current value into version history before overwriting
      pushVersion(s.key, getSection(s.key, null), { label: "auto: pre-schedule" });
      setSection(s.key, s.payload);
      s.applied = true;
      changed = true;
    }
    if (s.applied && !s.expired && s.expireAt && s.expireAt <= now) {
      pushVersion(s.key, getSection(s.key, null), { label: "auto: pre-expire" });
      if (s.expirePayload !== undefined) setSection(s.key, s.expirePayload);
      s.expired = true;
      changed = true;
    }
  }
  if (changed) saveSchedules(list);
}

// ───────── Status ─────────

export function getStatuses(): Record<string, StatusEntry> {
  return read<Record<string, StatusEntry>>(STATUS_KEY, {});
}
export function getStatus(key: string): WorkflowStatus {
  return getStatuses()[key]?.status ?? "published";
}
export function setStatus(key: string, status: WorkflowStatus, by?: string, notes?: string) {
  const all = getStatuses();
  all[key] = { key, status, updatedAt: Date.now(), updatedBy: by, notes };
  write(STATUS_KEY, all);
}

// ───────── Versions ─────────

export function getVersions(key?: string): VersionEntry[] {
  const all = read<VersionEntry[]>(VERSIONS_KEY, []);
  return key ? all.filter((v) => v.key === key) : all;
}
export function pushVersion(
  key: string,
  snapshot: unknown,
  opts?: { label?: string; takenBy?: string },
) {
  const all = read<VersionEntry[]>(VERSIONS_KEY, []);
  const next: VersionEntry = {
    id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    key,
    snapshot,
    takenAt: Date.now(),
    label: opts?.label,
    takenBy: opts?.takenBy,
  };
  // keep most recent VERSION_LIMIT per-key
  const merged = [next, ...all];
  const byKey = new Map<string, VersionEntry[]>();
  for (const v of merged) {
    const arr = byKey.get(v.key) ?? [];
    if (arr.length < VERSION_LIMIT) arr.push(v);
    byKey.set(v.key, arr);
  }
  write(
    VERSIONS_KEY,
    [...byKey.values()].flat().sort((a, b) => b.takenAt - a.takenAt),
  );
}
export function rollbackVersion(versionId: string) {
  const all = read<VersionEntry[]>(VERSIONS_KEY, []);
  const v = all.find((x) => x.id === versionId);
  if (!v) return;
  // snapshot current first so rollback is reversible
  pushVersion(v.key, getSection(v.key, null), { label: "auto: pre-rollback" });
  setSection(v.key, v.snapshot);
}
export function deleteVersion(versionId: string) {
  write(VERSIONS_KEY, read<VersionEntry[]>(VERSIONS_KEY, []).filter((v) => v.id !== versionId));
}

// ───────── Hook ─────────

export function useWorkflow() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const on = () => setTick((t) => t + 1);
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return {
    tick,
    schedules: getSchedules(),
    statuses: getStatuses(),
    versions: getVersions(),
  };
}

/** Run a setInterval that applies due schedules. Returns cleanup. */
export function startScheduleTicker(intervalMs = 30_000) {
  if (!isBrowser()) return () => {};
  tickSchedules();
  const id = window.setInterval(tickSchedules, intervalMs);
  return () => window.clearInterval(id);
}

export function useScheduleTicker() {
  useEffect(() => startScheduleTicker(), []);
}
