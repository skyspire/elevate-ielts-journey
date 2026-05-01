// Free-tier daily quota tracker — prototype, localStorage only.
// 3 opens per day per signed-in free user. Resets at 9:00 AM IST.
// Vocabulary categories do NOT consume quota (per product decision).

import { useEffect, useState, useCallback } from "react";

export const DAILY_FREE_LIMIT = 3;
export const RESET_HOUR_IST = 9;

const QUOTA_KEY = "bigielts:free-quota:v1";

type QuotaRecord = {
  // Map of userId -> { periodStart: epoch ms (IST 9 AM), used: number }
  [userId: string]: { periodStart: number; used: number };
};

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Returns the epoch-ms of the most recent 9:00 AM IST boundary on or before `now`.
 * IST is UTC+5:30 with no DST, so we work in UTC and offset by 5h30m.
 */
export function currentPeriodStartMs(now: number = Date.now()): number {
  const IST_OFFSET_MIN = 5 * 60 + 30;
  // Convert "now" to an IST wall-clock Date by shifting forward.
  const istNow = new Date(now + IST_OFFSET_MIN * 60_000);
  // Build today's 9 AM IST as a UTC instant.
  const y = istNow.getUTCFullYear();
  const m = istNow.getUTCMonth();
  const d = istNow.getUTCDate();
  // 9 AM IST = 03:30 UTC
  let boundaryUtc = Date.UTC(y, m, d, RESET_HOUR_IST - 5, 60 - 30); // 9 - 5 = 4? careful.
  // Simpler: compute in IST then subtract offset.
  const istBoundary = Date.UTC(y, m, d, RESET_HOUR_IST, 0, 0, 0);
  boundaryUtc = istBoundary - IST_OFFSET_MIN * 60_000;
  if (boundaryUtc > now) {
    // Before 9 AM IST today → use yesterday's boundary.
    boundaryUtc -= 24 * 60 * 60_000;
  }
  return boundaryUtc;
}

export function nextResetMs(now: number = Date.now()): number {
  return currentPeriodStartMs(now) + 24 * 60 * 60_000;
}

function readAll(): QuotaRecord {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(QUOTA_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as QuotaRecord) : {};
  } catch {
    return {};
  }
}

function writeAll(rec: QuotaRecord) {
  if (!isBrowser()) return;
  window.localStorage.setItem(QUOTA_KEY, JSON.stringify(rec));
  window.dispatchEvent(new CustomEvent("free-quota:changed"));
}

/** Get used count for a user in the current period. Auto-resets if expired. */
export function getUsed(userId: string): number {
  if (!userId) return 0;
  const all = readAll();
  const entry = all[userId];
  const period = currentPeriodStartMs();
  if (!entry || entry.periodStart !== period) return 0;
  return entry.used;
}

export function getRemaining(userId: string): number {
  return Math.max(0, DAILY_FREE_LIMIT - getUsed(userId));
}

/**
 * Try to consume one unit. Returns true if consumed, false if already exhausted.
 * If the user already opened this `itemKey` in the current period, it's free
 * (so re-visiting the same item doesn't double-charge).
 */
export function consumeOne(
  userId: string,
  itemKey: string,
): { ok: true; remaining: number } | { ok: false; remaining: 0 } {
  if (!userId) return { ok: false, remaining: 0 };
  const all = readAll();
  const period = currentPeriodStartMs();
  const entry = all[userId];
  const openedKey = `${QUOTA_KEY}:opened:${userId}:${period}`;
  let opened: string[] = [];
  if (isBrowser()) {
    try {
      opened = JSON.parse(window.localStorage.getItem(openedKey) || "[]");
    } catch {
      opened = [];
    }
  }
  // Re-open of same item in same period: free.
  if (opened.includes(itemKey)) {
    const used = entry?.periodStart === period ? entry.used : 0;
    return { ok: true, remaining: Math.max(0, DAILY_FREE_LIMIT - used) };
  }
  const used = entry?.periodStart === period ? entry.used : 0;
  if (used >= DAILY_FREE_LIMIT) return { ok: false, remaining: 0 };
  const nextUsed = used + 1;
  all[userId] = { periodStart: period, used: nextUsed };
  writeAll(all);
  if (isBrowser()) {
    window.localStorage.setItem(openedKey, JSON.stringify([...opened, itemKey]));
  }
  return { ok: true, remaining: DAILY_FREE_LIMIT - nextUsed };
}

/** Has the user already opened this item in the current period? (free re-open) */
export function hasOpened(userId: string, itemKey: string): boolean {
  if (!userId || !isBrowser()) return false;
  const period = currentPeriodStartMs();
  const openedKey = `${QUOTA_KEY}:opened:${userId}:${period}`;
  try {
    const opened = JSON.parse(window.localStorage.getItem(openedKey) || "[]");
    return Array.isArray(opened) && opened.includes(itemKey);
  } catch {
    return false;
  }
}

export function formatResetCountdown(now: number = Date.now()): string {
  const ms = Math.max(0, nextResetMs(now) - now);
  const totalMin = Math.floor(ms / 60_000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function useFreeQuota(userId: string | undefined | null) {
  const id = userId ?? "";
  const [used, setUsed] = useState<number>(() => (id ? getUsed(id) : 0));
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setUsed(id ? getUsed(id) : 0);
    refresh();
    window.addEventListener("free-quota:changed", refresh);
    window.addEventListener("storage", refresh);
    // Tick every minute so countdowns and auto-reset reflect.
    const t = window.setInterval(() => {
      refresh();
      setTick((n) => n + 1);
    }, 60_000);
    return () => {
      window.removeEventListener("free-quota:changed", refresh);
      window.removeEventListener("storage", refresh);
      window.clearInterval(t);
    };
  }, [id]);

  const remaining = Math.max(0, DAILY_FREE_LIMIT - used);
  const consume = useCallback(
    (itemKey: string) => (id ? consumeOne(id, itemKey) : { ok: false as const, remaining: 0 as const }),
    [id],
  );
  const checkOpened = useCallback((itemKey: string) => (id ? hasOpened(id, itemKey) : false), [id]);

  return {
    used,
    remaining,
    limit: DAILY_FREE_LIMIT,
    exhausted: remaining <= 0,
    consume,
    hasOpened: checkOpened,
    countdown: formatResetCountdown(),
  };
}
