// IELTS type (Academic vs General Training) preference + plan lock.
// Prototype: stored in localStorage alongside the existing learner-auth module.

import { useEffect, useState, useCallback } from "react";
import { getLearnerSession } from "./learner-auth";

export type IeltsType = "academic" | "general";
export type IeltsPlanType = IeltsType | "both";

const TYPE_KEY = "bigielts:ielts-type";
const PLAN_KEY = "bigielts:ielts-plan"; // per-user plan lock map: { [userId]: 'academic'|'general'|'both' }
const PICKED_KEY = "bigielts:ielts-type-picked"; // has guest been shown the picker?

function isBrowser() {
  return typeof window !== "undefined";
}

export function getActiveType(): IeltsType {
  if (!isBrowser()) return "academic";
  const raw = window.localStorage.getItem(TYPE_KEY);
  return raw === "general" ? "general" : raw === "academic" ? "academic" : "academic";
}

export function hasPickedType(): boolean {
  if (!isBrowser()) return true; // SSR: don't show modal
  return window.localStorage.getItem(PICKED_KEY) === "1";
}

export function setActiveType(t: IeltsType, markPicked = true) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TYPE_KEY, t);
  if (markPicked) window.localStorage.setItem(PICKED_KEY, "1");
  window.dispatchEvent(new CustomEvent("bigielts:type-changed"));
}

function readPlanMap(): Record<string, IeltsPlanType> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    return raw ? (JSON.parse(raw) as Record<string, IeltsPlanType>) : {};
  } catch {
    return {};
  }
}

function writePlanMap(map: Record<string, IeltsPlanType>) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PLAN_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent("bigielts:type-changed"));
}

export function getUserPlanType(userId: string | undefined): IeltsPlanType | null {
  if (!userId) return null;
  return readPlanMap()[userId] ?? null;
}

export function setUserPlanType(userId: string, plan: IeltsPlanType) {
  const map = readPlanMap();
  map[userId] = plan;
  writePlanMap(map);
}

/**
 * Can the current user access content tagged as `contentType`?
 * - Guests: yes (gated separately via QuotaGate/SignupGate).
 * - Logged-in: only if their plan covers it (matching type OR 'both').
 */
export function canAccessType(contentType: IeltsType): boolean {
  const user = getLearnerSession();
  if (!user) return true;
  const plan = getUserPlanType(user.id);
  if (!plan) return true; // no plan yet → free preview, defer to other gates
  if (plan === "both") return true;
  return plan === contentType;
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
