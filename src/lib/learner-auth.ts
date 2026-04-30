// Mock learner auth — localStorage only. Prototype use ONLY.
// Do NOT use this for real authentication; passwords are stored in plain text.

import { useEffect, useState, useCallback } from "react";

export type LearnerUser = {
  id: string;
  email: string;
  name: string;
  password: string; // plain text, prototype only
  createdAt: number;
  provider: "email" | "google" | "apple" | "magic";
};

const USERS_KEY = "bigielts:learner:users";
const SESSION_KEY = "bigielts:learner:session";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getLearners(): LearnerUser[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LearnerUser[]) : [];
  } catch {
    return [];
  }
}

function saveLearners(users: LearnerUser[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent("learner:users-changed"));
}

export function getLearnerSession(): LearnerUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const sessionId = JSON.parse(raw) as string;
    return getLearners().find((u) => u.id === sessionId) ?? null;
  } catch {
    return null;
  }
}

export function loginLearner(
  email: string,
  password: string,
): { ok: true; user: LearnerUser } | { ok: false; error: string } {
  const user = getLearners().find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false, error: "No account found with that email." };
  if (user.password !== password) return { ok: false, error: "Incorrect password." };
  if (isBrowser()) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user.id));
    window.dispatchEvent(new CustomEvent("learner:session-changed"));
  }
  return { ok: true, user };
}

export function signupLearner(input: {
  email: string;
  name: string;
  password: string;
}): { ok: true; user: LearnerUser } | { ok: false; error: string } {
  const exists = getLearners().some((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (exists) return { ok: false, error: "An account with that email already exists." };
  const user: LearnerUser = {
    id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: input.email,
    name: input.name,
    password: input.password,
    createdAt: Date.now(),
    provider: "email",
  };
  saveLearners([...getLearners(), user]);
  if (isBrowser()) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user.id));
    window.dispatchEvent(new CustomEvent("learner:session-changed"));
  }
  return { ok: true, user };
}

export function logoutLearner() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("learner:session-changed"));
}

// ───────── Admin-side management ─────────

export function updateLearner(id: string, patch: Partial<Omit<LearnerUser, "id" | "createdAt">>) {
  const next = getLearners().map((u) => (u.id === id ? { ...u, ...patch } : u));
  saveLearners(next);
}

export function deleteLearner(id: string) {
  saveLearners(getLearners().filter((u) => u.id !== id));
  // If the deleted user is currently logged in, clear the session.
  if (isBrowser()) {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw && JSON.parse(raw) === id) {
        window.localStorage.removeItem(SESSION_KEY);
        window.dispatchEvent(new CustomEvent("learner:session-changed"));
      }
    } catch {
      /* ignore */
    }
  }
}

/** Force-login as a learner (admin impersonation). Prototype only. */
export function impersonateLearner(id: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(id));
  window.dispatchEvent(new CustomEvent("learner:session-changed"));
}

export function adminCreateLearner(input: {
  email: string;
  name: string;
  password: string;
}): { ok: true; user: LearnerUser } | { ok: false; error: string } {
  const exists = getLearners().some((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (exists) return { ok: false, error: "An account with that email already exists." };
  const user: LearnerUser = {
    id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: input.email,
    name: input.name,
    password: input.password,
    createdAt: Date.now(),
    provider: "email",
  };
  saveLearners([...getLearners(), user]);
  return { ok: true, user };
}

export function useLearnerSession() {
  const [user, setUser] = useState<LearnerUser | null>(() => getLearnerSession());

  useEffect(() => {
    const onChange = () => setUser(getLearnerSession());
    window.addEventListener("learner:session-changed", onChange);
    window.addEventListener("learner:users-changed", onChange);
    window.addEventListener("storage", onChange);
    setUser(getLearnerSession());
    return () => {
      window.removeEventListener("learner:session-changed", onChange);
      window.removeEventListener("learner:users-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const doLogout = useCallback(() => logoutLearner(), []);

  return { user, logout: doLogout };
}
