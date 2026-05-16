// IELTS type (Academic vs General Training) preference + per-type plan lock.
// User answer: types are purchased separately. No prorated upgrade; to access
// the other type, the user buys a second standalone subscription.

import { useEffect, useState, useCallback } from "react";
import { getLearnerSession } from "./learner-auth";

export type IeltsType = "academic" | "general";
export type IeltsPlanType = IeltsType | "both";

const TYPE_KEY = "bigielts:ielts-type";
const PLAN_KEY = "bigielts:ielts-plan"; // { [userId]: IeltsType[] }  (legacy values 'academic'|'general'|'both' migrated on read)
const PICKED_KEY = "bigielts:ielts-type-picked";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getActiveType(): IeltsType {
  if (!isBrowser()) return "academic";
  const raw = window.localStorage.getItem(TYPE_KEY);
  return raw === "general" ? "general" : "academic";
}

export function hasPickedType(): boolean {
  if (!isBrowser()) return true;
  return window.localStorage.getItem(PICKED_KEY) === "1";
}

export function setActiveType(t: IeltsType, markPicked = true) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TYPE_KEY, t);
  if (markPicked) window.localStorage.setItem(PICKED_KEY, "1");
  window.dispatchEvent(new CustomEvent("bigielts:type-changed"));
}

type RawPlanMap = Record<string, IeltsType[] | "academic" | "general" | "both">;

function readPlanMap(): Record<string, IeltsType[]> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as RawPlanMap;
    const out: Record<string, IeltsType[]> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (Array.isArray(v)) out[k] = v.filter((x) => x === "academic" || x === "general");
      else if (v === "both") out[k] = ["academic", "general"];
      else if (v === "academic" || v === "general") out[k] = [v];
    }
    return out;
  } catch {
    return {};
  }
}

function writePlanMap(map: Record<string, IeltsType[]>) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PLAN_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent("bigielts:type-changed"));
}

export function getPurchasedTypes(userId: string | undefined): IeltsType[] {
  if (!userId) return [];
  return readPlanMap()[userId] ?? [];
}

/** Backwards-compat: returns a plan label for UI ("academic"|"general"|"both") or null. */
export function getUserPlanType(userId: string | undefined): IeltsPlanType | null {
  const types = getPurchasedTypes(userId);
  if (types.length === 0) return null;
  if (types.length >= 2) return "both";
  return types[0];
}

/** Add a purchased type (idempotent). Use when user completes a subscription. */
export function addPurchasedType(userId: string, t: IeltsType) {
  const map = readPlanMap();
  const cur = new Set(map[userId] ?? []);
  cur.add(t);
  map[userId] = Array.from(cur) as IeltsType[];
  writePlanMap(map);
}

/** Set the plan explicitly (replaces). 'both' grants both types. */
export function setUserPlanType(userId: string, plan: IeltsPlanType) {
  const map = readPlanMap();
  map[userId] = plan === "both" ? ["academic", "general"] : [plan];
  writePlanMap(map);
}

/**
 * Can the current user access content tagged as `contentType`?
 * - Guests: NO — they must log in first (forced-login flow).
 * - Logged-in with no plan: NO — must subscribe.
 * - Logged-in: only types they've purchased.
 */
export function canAccessType(contentType: IeltsType): boolean {
  const user = getLearnerSession();
  if (!user) return false;
  return getPurchasedTypes(user.id).includes(contentType);
}

export function useIeltsType() {
  const [type, setType] = useState<IeltsType>(() => getActiveType());
  const [picked, setPicked] = useState<boolean>(() => hasPickedType());
  const [planTypeState, setPlanTypeState] = useState<IeltsPlanType | null>(() => {
    const u = getLearnerSession();
    return u ? getUserPlanType(u.id) : null;
  });

  useEffect(() => {
    const refresh = () => {
      setType(getActiveType());
      setPicked(hasPickedType());
      const u = getLearnerSession();
      setPlanTypeState(u ? getUserPlanType(u.id) : null);
    };
    window.addEventListener("bigielts:type-changed", refresh);
    window.addEventListener("learner:session-changed", refresh);
    window.addEventListener("storage", refresh);
    refresh();
    return () => {
      window.removeEventListener("bigielts:type-changed", refresh);
      window.removeEventListener("learner:session-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const select = useCallback((t: IeltsType) => setActiveType(t), []);

  return {
    type,
    picked,
    planType: planTypeState,
    isLocked: !!planTypeState && planTypeState !== "both",
    hasAllAccess: planTypeState === "both",
    select,
  };
}
