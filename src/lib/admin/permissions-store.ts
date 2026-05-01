// Permissions matrix — custom per-module checkbox permissions layered on top of
// the base owner/admin/editor roles. Owner always has full access.

import { useEffect, useState } from "react";
import { type AdminUser, getUsers } from "@/lib/admin/auth";

const PERMS_KEY = "bigielts:perms:matrix";
const TOTP_KEY = "bigielts:perms:totp";
const EVT = "perms:changed";

/** Modules that can be permission-gated */
export const PERMISSION_MODULES = [
  { id: "content", label: "Content (writing, speaking, vocab, resources)" },
  { id: "site", label: "Site (hero, homepage, footer, banners)" },
  { id: "pricing", label: "Pricing & monetization" },
  { id: "accounts", label: "Learner accounts & subscriptions" },
  { id: "communications", label: "Communications & email" },
  { id: "ops", label: "Operations (backup, trash, import)" },
  { id: "users", label: "Admin users & permissions" },
  { id: "analytics", label: "Analytics & reports" },
  { id: "publish", label: "Publish (move draft → live)" },
] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number]["id"];
export type PermissionAction = "view" | "edit";
export type PermissionMatrix = Record<string, Partial<Record<PermissionModule, PermissionAction[]>>>;

export type TotpConfig = Record<string, { enabled: boolean; secret: string; verifiedAt?: number }>;

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

// ───────── Matrix ─────────

export function getMatrix(): PermissionMatrix {
  return read<PermissionMatrix>(PERMS_KEY, {});
}
export function saveMatrix(m: PermissionMatrix) {
  write(PERMS_KEY, m);
}
export function setUserPermission(
  userId: string,
  mod: PermissionModule,
  actions: PermissionAction[],
) {
  const m = getMatrix();
  m[userId] = { ...(m[userId] ?? {}), [mod]: actions };
  saveMatrix(m);
}

export function userCan(user: AdminUser | null, mod: PermissionModule, action: PermissionAction): boolean {
  if (!user) return false;
  if (user.role === "owner") return true;
  // Admin defaults: full access except `users` (owner-only by default)
  if (user.role === "admin" && mod !== "users") return true;
  // Custom matrix grants
  const granted = getMatrix()[user.id]?.[mod] ?? [];
  if (action === "view") return granted.includes("view") || granted.includes("edit");
  return granted.includes("edit");
}

// ───────── TOTP (mock) ─────────
// We store a base32 "secret" and a verified flag. Real TOTP would verify a
// time-based code; the mock accepts the last 6 chars of the secret as the code.

export function getTotp(): TotpConfig {
  return read<TotpConfig>(TOTP_KEY, {});
}
export function saveTotp(t: TotpConfig) {
  write(TOTP_KEY, t);
}
export function generateTotpSecret(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let s = "";
  for (let i = 0; i < 16; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
export function enableTotp(userId: string, secret: string) {
  const t = getTotp();
  t[userId] = { enabled: true, secret, verifiedAt: Date.now() };
  saveTotp(t);
}
export function disableTotp(userId: string) {
  const t = getTotp();
  delete t[userId];
  saveTotp(t);
}
export function userHasTotp(userId: string): boolean {
  return !!getTotp()[userId]?.enabled;
}
export function verifyTotpCode(userId: string, code: string): boolean {
  const cfg = getTotp()[userId];
  if (!cfg?.enabled) return true; // not enrolled = pass
  // mock: code = last 6 chars of secret (case-insensitive)
  return cfg.secret.slice(-6).toLowerCase() === code.trim().toLowerCase();
}

export function useAdminUsersWithPerms() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const on = () => setTick((t) => t + 1);
    window.addEventListener(EVT, on);
    window.addEventListener("admin:users-changed", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("admin:users-changed", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return { tick, users: getUsers(), matrix: getMatrix(), totp: getTotp() };
}
