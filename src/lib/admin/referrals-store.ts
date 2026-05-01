// Referrals / affiliate program.
// - Each affiliate has a unique code + share URL (?ref=CODE)
// - Track clicks + signups + paid conversions
// - Commission % per affiliate; payouts logged
// localStorage only.

import { useEffect, useState } from "react";

const AFF_KEY = "bigielts:referrals:affiliates";
const CLICK_KEY = "bigielts:referrals:clicks";
const CONV_KEY = "bigielts:referrals:conversions";
const PAYOUT_KEY = "bigielts:referrals:payouts";
const SETTINGS_KEY = "bigielts:referrals:settings";
const EVT = "referrals:changed";

export type Affiliate = {
  id: string;
  name: string;
  email: string;
  code: string;
  commissionPercent: number;
  status: "active" | "paused";
  createdAt: number;
  notes?: string;
};

export type ClickEvent = {
  id: string;
  code: string;
  ts: number;
  referrer?: string;
  landing?: string;
};

export type Conversion = {
  id: string;
  code: string;
  userId?: string;
  email?: string;
  plan?: string;
  amount: number;
  commission: number;
  ts: number;
  status: "pending" | "paid" | "void";
};

export type Payout = {
  id: string;
  affiliateId: string;
  amount: number;
  method: string;
  reference?: string;
  ts: number;
  notes?: string;
};

export type ReferralSettings = {
  defaultCommissionPercent: number;
  cookieDays: number;
  payoutThreshold: number;
  termsUrl: string;
};

export const DEFAULT_REFERRAL_SETTINGS: ReferralSettings = {
  defaultCommissionPercent: 20,
  cookieDays: 30,
  payoutThreshold: 50,
  termsUrl: "",
};

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

// ───────── Affiliates ─────────

export function getAffiliates(): Affiliate[] {
  return read<Affiliate[]>(AFF_KEY, []);
}
export function saveAffiliates(a: Affiliate[]) {
  write(AFF_KEY, a);
}
export function generateAffiliateCode(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 8) || "ref";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${slug.toUpperCase()}-${rand}`;
}
export function createAffiliate(input: Omit<Affiliate, "id" | "createdAt" | "code"> & { code?: string }) {
  const aff: Affiliate = {
    id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    code: input.code?.trim() || generateAffiliateCode(input.name),
    createdAt: Date.now(),
    ...input,
  };
  saveAffiliates([aff, ...getAffiliates()]);
  return aff;
}
export function updateAffiliate(id: string, patch: Partial<Affiliate>) {
  saveAffiliates(getAffiliates().map((a) => (a.id === id ? { ...a, ...patch } : a)));
}
export function deleteAffiliate(id: string) {
  saveAffiliates(getAffiliates().filter((a) => a.id !== id));
}

// ───────── Clicks ─────────

export function getClicks(): ClickEvent[] {
  return read<ClickEvent[]>(CLICK_KEY, []);
}
export function recordClick(code: string, landing?: string, referrer?: string) {
  const list = getClicks();
  list.unshift({
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    code: code.toUpperCase(),
    ts: Date.now(),
    landing,
    referrer,
  });
  // cap at 1000
  write(CLICK_KEY, list.slice(0, 1000));
}

// ───────── Conversions ─────────

export function getConversions(): Conversion[] {
  return read<Conversion[]>(CONV_KEY, []);
}
export function recordConversion(input: Omit<Conversion, "id" | "ts" | "commission" | "status"> & { status?: Conversion["status"] }) {
  const aff = getAffiliates().find((a) => a.code === input.code.toUpperCase());
  const pct = aff?.commissionPercent ?? getReferralSettings().defaultCommissionPercent;
  const conv: Conversion = {
    id: `cv_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    ts: Date.now(),
    commission: Math.round(input.amount * pct) / 100,
    status: input.status ?? "pending",
    ...input,
    code: input.code.toUpperCase(),
  };
  write(CONV_KEY, [conv, ...getConversions()]);
  return conv;
}
export function updateConversion(id: string, patch: Partial<Conversion>) {
  write(CONV_KEY, getConversions().map((c) => (c.id === id ? { ...c, ...patch } : c)));
}

// ───────── Payouts ─────────

export function getPayouts(): Payout[] {
  return read<Payout[]>(PAYOUT_KEY, []);
}
export function recordPayout(input: Omit<Payout, "id" | "ts">) {
  const p: Payout = {
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    ts: Date.now(),
    ...input,
  };
  write(PAYOUT_KEY, [p, ...getPayouts()]);
  return p;
}

// ───────── Settings ─────────

export function getReferralSettings(): ReferralSettings {
  return { ...DEFAULT_REFERRAL_SETTINGS, ...read<Partial<ReferralSettings>>(SETTINGS_KEY, {}) };
}
export function saveReferralSettings(s: ReferralSettings) {
  write(SETTINGS_KEY, s);
}

// ───────── Aggregates ─────────

export function affiliateStats(code: string) {
  const c = code.toUpperCase();
  const clicks = getClicks().filter((x) => x.code === c).length;
  const convs = getConversions().filter((x) => x.code === c);
  const earned = convs.reduce((s, x) => s + x.commission, 0);
  const paidOut = getPayouts()
    .filter((p) => getAffiliates().find((a) => a.id === p.affiliateId)?.code === c)
    .reduce((s, x) => s + x.amount, 0);
  return {
    clicks,
    signups: convs.length,
    revenue: convs.reduce((s, x) => s + x.amount, 0),
    earned: Math.round(earned * 100) / 100,
    paidOut: Math.round(paidOut * 100) / 100,
    balance: Math.round((earned - paidOut) * 100) / 100,
  };
}

// ───────── Hook ─────────

export function useReferrals() {
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
    affiliates: getAffiliates(),
    clicks: getClicks(),
    conversions: getConversions(),
    payouts: getPayouts(),
    settings: getReferralSettings(),
  };
}
