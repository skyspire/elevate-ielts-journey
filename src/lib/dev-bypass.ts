import { useCallback, useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";

const DEV_BYPASS_KEY = "bigielts:dev-bypass";

function isPreviewOrExplicitBypassHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.includes("preview--") ||
    host.includes("lovable.app") ||
    host.includes("-dev.") ||
    window.location.search.includes("bypass=")
  );
}

function readStoredDevBypass() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(DEV_BYPASS_KEY) === "1";
  } catch {
    return false;
  }
}

function writeStoredDevBypass(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (enabled) window.localStorage.setItem(DEV_BYPASS_KEY, "1");
    else window.localStorage.removeItem(DEV_BYPASS_KEY);
  } catch {
    /* ignore */
  }
}

export function useDevBypass() {
  const location = useLocation();
  const [enabled, setEnabled] = useState(false);
  const [canToggle, setCanToggle] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("bypass") === "1") writeStoredDevBypass(true);
      if (params.get("bypass") === "0") writeStoredDevBypass(false);
    } catch {
      /* ignore */
    }
    setEnabled(readStoredDevBypass());
    setCanToggle(isPreviewOrExplicitBypassHost());
  }, [location.pathname, location.search]);

  const enable = useCallback(() => {
    writeStoredDevBypass(true);
    setEnabled(true);
  }, []);

  const disable = useCallback(() => {
    writeStoredDevBypass(false);
    setEnabled(false);
  }, []);

  return { enabled, canToggle, enable, disable };
}