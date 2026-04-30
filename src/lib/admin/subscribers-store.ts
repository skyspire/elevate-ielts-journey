// Subscribers / Subscriptions store — localStorage only. Prototype use ONLY.
// Layered on top of learner accounts (src/lib/learner-auth.ts).
//
// Stores:
// - bigielts:subscribers:profiles   → richer per-learner profile (tags, notes, country, source, last login, blocked)
// - bigielts:subscribers:subs       → subscription record per learner (plan, status, dates, trial, overrides)
// - bigielts:subscribers:billing    → flat list of manual billing/payment entries
// - bigielts:subscribers:settings   → admin settings (default trial days, dashboard prefs)

import { useEffect, useState, useCallback } from "react";
import { getLearners, type LearnerUser } from "@/lib/learner-auth";

const PROFILES_KEY = "bigielts:subscribers:profiles";
const SUBS_KEY = "bigielts:subscribers:subs";
const BILLING_KEY = "bigielts:subscribers:billing";
const SETTINGS_KEY = "bigielts:subscribers:settings";

const CHANGE_EVENT = "subscribers:changed";

// ───────── Types ─────────

export type PlanKey = "free" | "biweekly" | "monthly" | "quarterly";
export const ALL_PLANS: PlanKey[] = ["free", "biweekly", "monthly", "quarterly"];

export type SubStatus = "active" | "paused" | "cancelled" | "expired" | "trialing";

export type SubscriberProfile = {
  userId: string;
  tags: string[];
  notes: string;
  country: string;
  source: string; // signup source (e.g. "google", "organic", "referral")
  lastLoginAt?: number;
  blocked?: boolean;
  verifiedAt?: number;
  // Per-user resource access overrides — list of resource ids unlocked for this learner
  // (e.g. "ebook:cambridge-19", "section:writing-task-2")
  resourceUnlocks: string[];
};

export type Subscription = {
  userId: string;
  plan: PlanKey;
  status: SubStatus;
  startedAt?: number;
  expiresAt?: number; // also used as trial end when status === "trialing"
  cancelledAt?: number;
  // Trial
  trialDays?: number;
  // Free notes
  adminNote?: string;
};

export type BillingEntry = {
  id: string;
  userId: string;
  amount: number;
  currency: string; // e.g. "USD"
  method: string; // e.g. "manual", "stripe", "bkash"
  reference: string;
  note?: string;
  createdAt: number;
};

export type SubscribersSettings = {
  defaultTrialDays: number;
};

const DEFAULT_SETTINGS: SubscribersSettings = { defaultTrialDays: 7 };

// ───────── Helpers ─────────

function isBrowser() {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

// ───────── Profiles ─────────

export function getProfiles(): Record<string, SubscriberProfile> {
  return read<Record<string, SubscriberProfile>>(PROFILES_KEY, {});
}
export function saveProfiles(p: Record<string, SubscriberProfile>) {
  write(PROFILES_KEY, p);
}
export function getProfile(userId: string): SubscriberProfile {
  const all = getProfiles();
  return (
    all[userId] ?? {
      userId,
      tags: [],
      notes: "",
      country: "",
      source: "",
      resourceUnlocks: [],
    }
  );
}
export function upsertProfile(profile: SubscriberProfile) {
  const all = getProfiles();
  all[profile.userId] = profile;
  saveProfiles(all);
}

// ───────── Subscriptions ─────────

export function getSubs(): Record<string, Subscription> {
  return read<Record<string, Subscription>>(SUBS_KEY, {});
}
export function saveSubs(s: Record<string, Subscription>) {
  write(SUBS_KEY, s);
}
export function getSub(userId: string): Subscription {
  const all = getSubs();
  return all[userId] ?? { userId, plan: "free", status: "expired" };
}
export function upsertSub(sub: Subscription) {
  const all = getSubs();
  all[sub.userId] = sub;
  saveSubs(all);
}
export function assignPlan(userId: string, plan: PlanKey, days?: number) {
  const now = Date.now();
  const sub = getSub(userId);
  const expiresAt = days ? now + days * 86400000 : sub.expiresAt;
  upsertSub({
    ...sub,
    userId,
    plan,
    status: "active",
    startedAt: sub.startedAt ?? now,
    expiresAt,
    cancelledAt: undefined,
  });
}
export function grantTrial(userId: string, days: number) {
  const now = Date.now();
  upsertSub({
    userId,
    plan: getSub(userId).plan === "free" ? "monthly" : getSub(userId).plan,
    status: "trialing",
    startedAt: now,
    expiresAt: now + days * 86400000,
    trialDays: days,
  });
}
export function cancelSub(userId: string) {
  const sub = getSub(userId);
  upsertSub({ ...sub, status: "cancelled", cancelledAt: Date.now() });
}
export function extendSub(userId: string, days: number) {
  const sub = getSub(userId);
  const base = sub.expiresAt && sub.expiresAt > Date.now() ? sub.expiresAt : Date.now();
  upsertSub({ ...sub, expiresAt: base + days * 86400000, status: "active" });
}

export function isSubActive(sub: Subscription): boolean {
  if (sub.status === "cancelled" || sub.status === "expired") return false;
  if (sub.expiresAt && sub.expiresAt < Date.now()) return false;
  return sub.status === "active" || sub.status === "trialing" || sub.status === "paused";
}

// ───────── Billing log ─────────

export function getBilling(): BillingEntry[] {
  return read<BillingEntry[]>(BILLING_KEY, []);
}
export function saveBilling(list: BillingEntry[]) {
  write(BILLING_KEY, list);
}
export function addBillingEntry(entry: Omit<BillingEntry, "id" | "createdAt">) {
  const e: BillingEntry = {
    ...entry,
    id: `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };
  saveBilling([e, ...getBilling()]);
  return e;
}
export function deleteBillingEntry(id: string) {
  saveBilling(getBilling().filter((e) => e.id !== id));
}
export function getBillingForUser(userId: string): BillingEntry[] {
  return getBilling().filter((e) => e.userId === userId);
}

// ───────── Settings ─────────

export function getSubscribersSettings(): SubscribersSettings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<SubscribersSettings>>(SETTINGS_KEY, {}) };
}
export function saveSubscribersSettings(s: SubscribersSettings) {
  write(SETTINGS_KEY, s);
}

// ───────── Composite helpers ─────────

export type LearnerRow = {
  user: LearnerUser;
  profile: SubscriberProfile;
  sub: Subscription;
  active: boolean;
};

export function getLearnerRows(): LearnerRow[] {
  const learners = getLearners();
  return learners.map((u) => {
    const profile = getProfile(u.id);
    const sub = getSub(u.id);
    return { user: u, profile, sub, active: isSubActive(sub) };
  });
}

export function getDashboardStats() {
  const rows = getLearnerRows();
  const total = rows.length;
  const active = rows.filter((r) => r.active).length;
  const trialing = rows.filter((r) => r.sub.status === "trialing").length;
  const cancelledThisMonth = rows.filter((r) => {
    if (!r.sub.cancelledAt) return false;
    const d = new Date(r.sub.cancelledAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const churn = active + cancelledThisMonth > 0
    ? Math.round((cancelledThisMonth / Math.max(1, active + cancelledThisMonth)) * 100)
    : 0;
  // Revenue estimate from billing log (this month)
  const now = new Date();
  const monthRevenueByCcy = getBilling()
    .filter((e) => {
      const d = new Date(e.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.currency] = (acc[e.currency] ?? 0) + e.amount;
      return acc;
    }, {});
  return { total, active, trialing, cancelledThisMonth, churn, monthRevenueByCcy };
}

// CSV export
export function exportLearnersCsv(): string {
  const rows = getLearnerRows();
  const head = [
    "id",
    "email",
    "name",
    "provider",
    "createdAt",
    "country",
    "source",
    "tags",
    "blocked",
    "plan",
    "status",
    "startedAt",
    "expiresAt",
    "lastLoginAt",
    "notes",
  ];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const fmt = (t?: number) => (t ? new Date(t).toISOString() : "");
  const lines = rows.map((r) =>
    [
      r.user.id,
      r.user.email,
      r.user.name,
      r.user.provider,
      fmt(r.user.createdAt),
      r.profile.country,
      r.profile.source,
      r.profile.tags.join("|"),
      r.profile.blocked ? "yes" : "",
      r.sub.plan,
      r.sub.status,
      fmt(r.sub.startedAt),
      fmt(r.sub.expiresAt),
      fmt(r.profile.lastLoginAt),
      r.profile.notes,
    ]
      .map(escape)
      .join(","),
  );
  return [head.join(","), ...lines].join("\n");
}

// React hook — re-renders when any subscribers data changes
export function useSubscribersData<T>(selector: () => T): T {
  const [value, setValue] = useState<T>(() => selector());
  const refresh = useCallback(() => setValue(selector()), [selector]);
  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("learner:users-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("learner:users-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);
  return value;
}

// Plan label
export function planLabel(p: PlanKey): string {
  switch (p) {
    case "free":
      return "Free";
    case "biweekly":
      return "Bi-Weekly";
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "3-Month";
  }
}
