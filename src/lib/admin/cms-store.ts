// Generic CMS storage — localStorage-backed key/value store with React hook.
// Each "section" is identified by a key and falls back to a default when no override exists.

import { useEffect, useState, useCallback } from "react";

const PREFIX = "bigielts:cms:";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getSection<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setSection<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("cms:changed", { detail: { key } }));
}

export function resetSection(key: string) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(PREFIX + key);
  window.dispatchEvent(new CustomEvent("cms:changed", { detail: { key } }));
}

export function exportAll(): Record<string, unknown> {
  if (!isBrowser()) return {};
  const out: Record<string, unknown> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(PREFIX)) {
      try {
        out[k.slice(PREFIX.length)] = JSON.parse(window.localStorage.getItem(k) ?? "null");
      } catch {
        // skip
      }
    }
  }
  return out;
}

export function importAll(data: Record<string, unknown>) {
  if (!isBrowser()) return;
  Object.entries(data).forEach(([k, v]) => {
    window.localStorage.setItem(PREFIX + k, JSON.stringify(v));
  });
  window.dispatchEvent(new CustomEvent("cms:changed", { detail: { key: "*" } }));
}

export function resetAll() {
  if (!isBrowser()) return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("cms:changed", { detail: { key: "*" } }));
}

/** React hook — returns the current value (override OR default) and re-renders on changes. */
export function useCmsSection<T>(key: string, defaultValue: T): T {
  const [value, setValue] = useState<T>(() => getSection(key, defaultValue));

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string }>).detail;
      if (!detail || detail.key === key || detail.key === "*") {
        setValue(getSection(key, defaultValue));
      }
    };
    window.addEventListener("cms:changed", onChange);
    window.addEventListener("storage", onChange);
    setValue(getSection(key, defaultValue));
    return () => {
      window.removeEventListener("cms:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return value;
}

/** Hook that also exposes a setter — useful inside admin editors. */
export function useCmsEditor<T>(key: string, defaultValue: T) {
  const value = useCmsSection<T>(key, defaultValue);
  const update = useCallback((next: T) => setSection(key, next), [key]);
  const reset = useCallback(() => resetSection(key), [key]);
  return { value, update, reset };
}
