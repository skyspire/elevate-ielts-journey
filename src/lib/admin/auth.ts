// Mock multi-admin auth — localStorage only. Prototype use ONLY.
// Do NOT use this for any real authentication; passwords are stored in plain text.

import { useEffect, useState, useCallback } from "react";

export type AdminRole = "owner" | "admin" | "editor";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  password: string; // plain text, prototype only
  createdAt: number;
};

const USERS_KEY = "bigielts:admin:users";
const SESSION_KEY = "bigielts:admin:session";

const DEFAULT_USERS: AdminUser[] = [
  {
    id: "u_owner",
    email: "owner@bigielts.com",
    name: "Site Owner",
    role: "owner",
    password: "owner123",
    createdAt: Date.now(),
  },
  {
    id: "u_admin",
    email: "admin@bigielts.com",
    name: "Admin User",
    role: "admin",
    password: "admin123",
    createdAt: Date.now(),
  },
  {
    id: "u_editor",
    email: "editor@bigielts.com",
    name: "Content Editor",
    role: "editor",
    password: "editor123",
    createdAt: Date.now(),
  },
];

function isBrowser() {
  return typeof window !== "undefined";
}

export function getUsers(): AdminUser[] {
  if (!isBrowser()) return DEFAULT_USERS;
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as AdminUser[];
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: AdminUser[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent("admin:users-changed"));
}

export function getSession(): AdminUser | null {
  // Auth disabled — always return the owner so admin is accessible without login.
  const users = getUsers();
  return users.find((u) => u.role === "owner") ?? users[0] ?? DEFAULT_USERS[0];
}


export function login(email: string, password: string): AdminUser | null {
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) return null;
  if (isBrowser()) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user.id));
    window.dispatchEvent(new CustomEvent("admin:session-changed"));
  }
  return user;
}

export function logout() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("admin:session-changed"));
}

export function createUser(input: Omit<AdminUser, "id" | "createdAt">): AdminUser {
  const user: AdminUser = {
    ...input,
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };
  const next = [...getUsers(), user];
  saveUsers(next);
  return user;
}

export function updateUser(id: string, patch: Partial<Omit<AdminUser, "id" | "createdAt">>) {
  const next = getUsers().map((u) => (u.id === id ? { ...u, ...patch } : u));
  saveUsers(next);
}

export function deleteUser(id: string) {
  const next = getUsers().filter((u) => u.id !== id);
  saveUsers(next);
}

export function useSession() {
  const [user, setUser] = useState<AdminUser | null>(() => getSession());

  useEffect(() => {
    const onChange = () => setUser(getSession());
    window.addEventListener("admin:session-changed", onChange);
    window.addEventListener("admin:users-changed", onChange);
    window.addEventListener("storage", onChange);
    // re-read on mount in case SSR returned null
    setUser(getSession());
    return () => {
      window.removeEventListener("admin:session-changed", onChange);
      window.removeEventListener("admin:users-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const doLogout = useCallback(() => logout(), []);

  return { user, logout: doLogout };
}

export function canEdit(user: AdminUser | null): boolean {
  return !!user && (user.role === "owner" || user.role === "admin" || user.role === "editor");
}

export function canManageUsers(user: AdminUser | null): boolean {
  return !!user && (user.role === "owner" || user.role === "admin");
}
