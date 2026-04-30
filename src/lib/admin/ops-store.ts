// Ops store — bulk import, backup/restore, soft-delete trash bin, session controls.
// localStorage only.

import { useEffect, useState, useCallback } from "react";
import { getLearners, type LearnerUser } from "@/lib/learner-auth";
import {
  getProfiles,
  getSubs,
  getBilling,
  saveProfiles,
  saveSubs,
  saveBilling,
  getSubscribersSettings,
  saveSubscribersSettings,
} from "@/lib/admin/subscribers-store";

const TRASH_KEY = "bigielts:ops:trash";
const SESSION_CTL_KEY = "bigielts:ops:session-controls";
const FORCE_LOGOUT_KEY = "bigielts:ops:force-logout"; // map<userId, timestamp>
const FORCE_RESET_KEY = "bigielts:ops:force-reset"; // userId[]

const EVT = "ops:changed";

const TRASH_DAYS = 30;

// ───────── Types ─────────

export type TrashEntry = {
  id: string;
  user: LearnerUser;
  profile: unknown;
  sub: unknown;
  billing: unknown[];
  deletedAt: number;
};

export type SessionControls = {
  adminTimeoutMinutes: number; // 0 = no timeout
};

const DEFAULT_SESSION_CONTROLS: SessionControls = { adminTimeoutMinutes: 60 };

// ───────── Helpers ─────────

function isBrowser() {
  return typeof window !== "undefined";
}
function read<T>(k: string, f: T): T {
  if (!isBrowser()) return f;
  try {
    const r = window.localStorage.getItem(k);
    if (!r) return f;
    return (JSON.parse(r) as T) ?? f;
  } catch {
    return f;
  }
}
function write<T>(k: string, v: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent(EVT));
}

// ───────── Trash bin (soft delete) ─────────

export function getTrash(): TrashEntry[] {
  // Auto-purge entries older than TRASH_DAYS
  const all = read<TrashEntry[]>(TRASH_KEY, []);
  const cutoff = Date.now() - TRASH_DAYS * 86400000;
  const fresh = all.filter((e) => e.deletedAt > cutoff);
  if (fresh.length !== all.length) write(TRASH_KEY, fresh);
  return fresh;
}

export function softDeleteLearner(userId: string) {
  const learners = getLearners();
  const user = learners.find((u) => u.id === userId);
  if (!user) return;
  const profile = getProfiles()[userId];
  const sub = getSubs()[userId];
  const billing = getBilling().filter((b) => b.userId === userId);
  const entry: TrashEntry = {
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    user,
    profile,
    sub,
    billing,
    deletedAt: Date.now(),
  };
  const trash = read<TrashEntry[]>(TRASH_KEY, []);
  write(TRASH_KEY, [entry, ...trash]);

  // Now remove from live data
  const newLearners = learners.filter((u) => u.id !== userId);
  if (isBrowser()) {
    window.localStorage.setItem("bigielts:learner:users", JSON.stringify(newLearners));
    window.dispatchEvent(new CustomEvent("learner:users-changed"));
  }
  const profiles = getProfiles();
  delete profiles[userId];
  saveProfiles(profiles);
  const subs = getSubs();
  delete subs[userId];
  saveSubs(subs);
  saveBilling(getBilling().filter((b) => b.userId !== userId));
}

export function restoreFromTrash(trashId: string) {
  const trash = getTrash();
  const entry = trash.find((t) => t.id === trashId);
  if (!entry) return;
  // Restore learner
  const learners = getLearners();
  if (!learners.some((u) => u.id === entry.user.id)) {
    learners.push(entry.user);
    if (isBrowser()) {
      window.localStorage.setItem("bigielts:learner:users", JSON.stringify(learners));
      window.dispatchEvent(new CustomEvent("learner:users-changed"));
    }
  }
  // Restore profile/sub/billing
  if (entry.profile) {
    const p = getProfiles();
    p[entry.user.id] = entry.profile as never;
    saveProfiles(p);
  }
  if (entry.sub) {
    const s = getSubs();
    s[entry.user.id] = entry.sub as never;
    saveSubs(s);
  }
  if (entry.billing.length) {
    saveBilling([...(entry.billing as never[]), ...getBilling()]);
  }
  write(TRASH_KEY, trash.filter((t) => t.id !== trashId));
}

export function purgeFromTrash(trashId: string) {
  write(TRASH_KEY, getTrash().filter((t) => t.id !== trashId));
}

// ───────── Backup / restore ─────────

const BACKUP_KEYS = [
  "bigielts:learner:users",
  "bigielts:subscribers:profiles",
  "bigielts:subscribers:subs",
  "bigielts:subscribers:billing",
  "bigielts:subscribers:settings",
  "bigielts:comms:announcements",
  "bigielts:comms:templates",
  "bigielts:comms:inbox",
  "bigielts:comms:outbox",
  "bigielts:money:coupons",
  "bigielts:money:gifts",
  "bigielts:money:sale",
  "bigielts:ops:trash",
  "bigielts:ops:session-controls",
  "bigielts:admin:users",
  "ebooks-cms",
];

export type BackupBundle = {
  version: 1;
  exportedAt: number;
  data: Record<string, unknown>;
};

export function exportBackup(): BackupBundle {
  const data: Record<string, unknown> = {};
  if (isBrowser()) {
    for (const k of BACKUP_KEYS) {
      const raw = window.localStorage.getItem(k);
      if (raw) {
        try {
          data[k] = JSON.parse(raw);
        } catch {
          data[k] = raw;
        }
      }
    }
  }
  return { version: 1, exportedAt: Date.now(), data };
}

export function importBackup(bundle: BackupBundle, mode: "replace" | "merge") {
  if (!isBrowser() || !bundle?.data) return;
  if (mode === "replace") {
    for (const k of BACKUP_KEYS) window.localStorage.removeItem(k);
  }
  for (const [k, v] of Object.entries(bundle.data)) {
    window.localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
  }
  // Notify the world
  window.dispatchEvent(new CustomEvent("learner:users-changed"));
  window.dispatchEvent(new CustomEvent("admin:users-changed"));
  window.dispatchEvent(new CustomEvent("subscribers:changed"));
  window.dispatchEvent(new CustomEvent("comms:changed"));
  window.dispatchEvent(new CustomEvent("money:changed"));
  window.dispatchEvent(new CustomEvent(EVT));
}

// ───────── CSV bulk import ─────────

export type ImportRow = {
  email: string;
  name: string;
  password?: string;
  country?: string;
  source?: string;
  plan?: string;
  status?: string;
  expiresAt?: string;
  tags?: string;
};
export type ImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
};

export function parseCsv(text: string): ImportRow[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim());
  if (lines.length === 0) return [];
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const out: ImportRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const row: Record<string, string> = {};
    header.forEach((h, idx) => (row[h] = (cols[idx] ?? "").trim()));
    if (row.email) out.push(row as ImportRow);
  }
  return out;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQ = false;
      } else cur += ch;
    } else {
      if (ch === ",") {
        out.push(cur);
        cur = "";
      } else if (ch === '"') inQ = true;
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function importLearnersCsv(rows: ImportRow[]): ImportResult {
  const result: ImportResult = { created: 0, updated: 0, skipped: 0, errors: [] };
  const learners = getLearners();
  const profiles = getProfiles();
  const subs = getSubs();

  for (const r of rows) {
    if (!r.email || !r.name) {
      result.skipped++;
      continue;
    }
    const email = r.email.toLowerCase().trim();
    let user = learners.find((u) => u.email.toLowerCase() === email);
    if (!user) {
      user = {
        id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        email,
        name: r.name,
        password: r.password || "changeme",
        createdAt: Date.now(),
        provider: "email",
      };
      learners.push(user);
      result.created++;
    } else {
      user.name = r.name || user.name;
      if (r.password) user.password = r.password;
      result.updated++;
    }
    const p = profiles[user.id] ?? {
      userId: user.id,
      tags: [],
      notes: "",
      country: "",
      source: "",
      resourceUnlocks: [],
    };
    p.country = r.country || p.country;
    p.source = r.source || p.source;
    if (r.tags) p.tags = r.tags.split("|").map((t) => t.trim()).filter(Boolean);
    profiles[user.id] = p;

    if (r.plan || r.status || r.expiresAt) {
      const s = subs[user.id] ?? { userId: user.id, plan: "free" as const, status: "expired" as const };
      if (r.plan) (s as { plan: string }).plan = r.plan;
      if (r.status) (s as { status: string }).status = r.status;
      if (r.expiresAt) {
        const t = Date.parse(r.expiresAt);
        if (!isNaN(t)) (s as { expiresAt: number }).expiresAt = t;
      }
      subs[user.id] = s;
    }
  }

  if (isBrowser()) {
    window.localStorage.setItem("bigielts:learner:users", JSON.stringify(learners));
    window.dispatchEvent(new CustomEvent("learner:users-changed"));
  }
  saveProfiles(profiles);
  saveSubs(subs);
  return result;
}

// ───────── Session controls ─────────

export function getSessionControls(): SessionControls {
  return { ...DEFAULT_SESSION_CONTROLS, ...read<Partial<SessionControls>>(SESSION_CTL_KEY, {}) };
}
export function saveSessionControls(s: SessionControls) {
  write(SESSION_CTL_KEY, s);
}

/** Force-logout a learner: bumps their force-logout timestamp.
 * The learner-auth session checker can clear sessions that pre-date this. */
export function forceLogoutLearner(userId: string) {
  const map = read<Record<string, number>>(FORCE_LOGOUT_KEY, {});
  map[userId] = Date.now();
  write(FORCE_LOGOUT_KEY, map);
  // If they're currently the active session, clear it.
  if (isBrowser()) {
    try {
      const raw = window.localStorage.getItem("bigielts:learner:session");
      if (raw && JSON.parse(raw) === userId) {
        window.localStorage.removeItem("bigielts:learner:session");
        window.dispatchEvent(new CustomEvent("learner:session-changed"));
      }
    } catch {
      /* ignore */
    }
  }
}
export function getForceLogoutMap(): Record<string, number> {
  return read<Record<string, number>>(FORCE_LOGOUT_KEY, {});
}

export function requirePasswordReset(userId: string, required = true) {
  const list = new Set(read<string[]>(FORCE_RESET_KEY, []));
  if (required) list.add(userId);
  else list.delete(userId);
  write(FORCE_RESET_KEY, Array.from(list));
}
export function isPasswordResetRequired(userId: string): boolean {
  return read<string[]>(FORCE_RESET_KEY, []).includes(userId);
}

// settings re-export to keep call sites tidy
export { getSubscribersSettings, saveSubscribersSettings };

// ───────── Hook ─────────

export function useOpsData<T>(selector: () => T): T {
  const [v, setV] = useState<T>(() => selector());
  const refresh = useCallback(() => setV(selector()), [selector]);
  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener(EVT, h);
    window.addEventListener("learner:users-changed", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("learner:users-changed", h);
      window.removeEventListener("storage", h);
    };
  }, [refresh]);
  return v;
}
