// Monetization: coupons, gift subscriptions, sale pricing.
// localStorage only.

import { useEffect, useState, useCallback } from "react";
import type { PlanKey } from "@/lib/admin/subscribers-store";

const COUPONS_KEY = "bigielts:money:coupons";
const GIFTS_KEY = "bigielts:money:gifts";
const SALE_KEY = "bigielts:money:sale";
const REDEMPTIONS_KEY = "bigielts:money:redemptions";
const PENDING_COUPON_KEY = "bigielts:money:pendingCoupon";

const EVT = "money:changed";

// ───────── Types ─────────

export type Coupon = {
  code: string; // uppercased
  type: "percent" | "fixed" | "trial-extend";
  value: number; // % or amount or extra trial days
  appliesTo: "all" | PlanKey;
  startsAt?: number;
  expiresAt?: number;
  maxRedemptions?: number;
  redeemedCount: number;
  enabled: boolean;
  note?: string;
  // ── Per-user / restriction rules ──
  singleUse?: boolean;            // each code can only be redeemed once total
  oncePerUser?: boolean;          // each user may redeem once
  newUsersOnly?: boolean;         // only first-purchase / first-time subscribers
  firstPurchaseOnly?: boolean;    // no prior billing entries for the user
  stackableWithSale?: boolean;    // allow on top of active sale
  minOrderAmount?: number;        // minimum subtotal required
  allowedEmails?: string[];       // restrict to these emails (lowercased)
};

export type Redemption = {
  id: string;
  code: string;
  email: string;
  userId?: string;
  plan: PlanKey;
  amount?: number;       // discount amount applied (if known)
  redeemedAt: number;
  source: "admin" | "signup" | "manual";
};

export type Gift = {
  id: string;
  email: string; // recipient
  plan: PlanKey;
  days: number;
  note?: string;
  createdAt: number;
  claimedAt?: number;
  claimedByUserId?: string;
};

export type SalePricing = {
  enabled: boolean;
  startsAt?: number;
  endsAt?: number;
  bannerText?: string;
  // % off applied on top of pricing for given plans (or all)
  discountPercent: number;
  appliesTo: "all" | PlanKey;
};

const DEFAULT_SALE: SalePricing = {
  enabled: false,
  discountPercent: 20,
  appliesTo: "all",
  bannerText: "Limited-time offer — {discount}% off all plans!",
};

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

// ───────── Coupons ─────────

export function getCoupons(): Coupon[] {
  return read<Coupon[]>(COUPONS_KEY, []);
}
export function saveCoupons(list: Coupon[]) {
  write(COUPONS_KEY, list);
}
export function upsertCoupon(c: Coupon) {
  const list = getCoupons();
  const code = c.code.toUpperCase().trim();
  const next = { ...c, code };
  const i = list.findIndex((x) => x.code === code);
  if (i >= 0) list[i] = next;
  else list.unshift(next);
  saveCoupons(list);
}
export function deleteCoupon(code: string) {
  saveCoupons(getCoupons().filter((c) => c.code !== code.toUpperCase()));
}
export function blankCoupon(): Coupon {
  return {
    code: "",
    type: "percent",
    value: 10,
    appliesTo: "all",
    redeemedCount: 0,
    enabled: true,
  };
}

export type CouponValidation =
  | { ok: true; coupon: Coupon }
  | { ok: false; error: string };

export function validateCoupon(code: string, plan: PlanKey): CouponValidation {
  const c = getCoupons().find((x) => x.code === code.toUpperCase().trim());
  if (!c) return { ok: false, error: "Invalid code." };
  if (!c.enabled) return { ok: false, error: "This code is disabled." };
  const now = Date.now();
  if (c.startsAt && now < c.startsAt) return { ok: false, error: "This code is not yet active." };
  if (c.expiresAt && now > c.expiresAt) return { ok: false, error: "This code has expired." };
  if (c.maxRedemptions && c.redeemedCount >= c.maxRedemptions)
    return { ok: false, error: "This code has reached its redemption limit." };
  if (c.appliesTo !== "all" && c.appliesTo !== plan)
    return { ok: false, error: "This code does not apply to the selected plan." };
  return { ok: true, coupon: c };
}

export function redeemCoupon(code: string) {
  const list = getCoupons();
  const i = list.findIndex((x) => x.code === code.toUpperCase().trim());
  if (i < 0) return;
  list[i] = { ...list[i], redeemedCount: list[i].redeemedCount + 1 };
  saveCoupons(list);
}

// ───────── Gifts ─────────

export function getGifts(): Gift[] {
  return read<Gift[]>(GIFTS_KEY, []);
}
export function saveGifts(list: Gift[]) {
  write(GIFTS_KEY, list);
}
export function createGift(input: Omit<Gift, "id" | "createdAt" | "claimedAt" | "claimedByUserId">): Gift {
  const g: Gift = {
    ...input,
    email: input.email.toLowerCase().trim(),
    id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
  };
  saveGifts([g, ...getGifts()]);
  return g;
}
export function deleteGift(id: string) {
  saveGifts(getGifts().filter((g) => g.id !== id));
}
export function claimGiftsForEmail(email: string, userId: string): Gift[] {
  const norm = email.toLowerCase().trim();
  const list = getGifts();
  const claimed: Gift[] = [];
  const next = list.map((g) => {
    if (g.email === norm && !g.claimedAt) {
      const c = { ...g, claimedAt: Date.now(), claimedByUserId: userId };
      claimed.push(c);
      return c;
    }
    return g;
  });
  if (claimed.length) saveGifts(next);
  return claimed;
}

// ───────── Sale pricing ─────────

export function getSale(): SalePricing {
  return { ...DEFAULT_SALE, ...read<Partial<SalePricing>>(SALE_KEY, {}) };
}
export function saveSale(s: SalePricing) {
  write(SALE_KEY, s);
}
export function isSaleActive(s: SalePricing = getSale()): boolean {
  if (!s.enabled) return false;
  const now = Date.now();
  if (s.startsAt && now < s.startsAt) return false;
  if (s.endsAt && now > s.endsAt) return false;
  return true;
}

/** Apply current active sale to a price for a given plan. */
export function applySale(price: number, plan: PlanKey): number {
  const s = getSale();
  if (!isSaleActive(s)) return price;
  if (s.appliesTo !== "all" && s.appliesTo !== plan) return price;
  const off = price * (s.discountPercent / 100);
  return Math.max(0, Math.round((price - off) * 100) / 100);
}

// ───────── Hook ─────────

export function useMoneyData<T>(selector: () => T): T {
  const [v, setV] = useState<T>(() => selector());
  const refresh = useCallback(() => setV(selector()), [selector]);
  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, [refresh]);
  return v;
}
