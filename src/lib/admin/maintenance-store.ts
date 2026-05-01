// Maintenance mode — global learner block with admin bypass.
// localStorage only.

import { useEffect, useState } from "react";

const KEY = "bigielts:maintenance";
const EVT = "maintenance:changed";

export type MaintenanceConfig = {
  enabled: boolean;
  message: string;
  /** ISO string or empty */
  estimatedEndsAt: string;
  /** Allow admins to view the site normally while it's down for everyone else */
  allowAdmins: boolean;
};

export const DEFAULT_MAINTENANCE: MaintenanceConfig = {
  enabled: false,
  message:
    "We're making the site better. We'll be back shortly — thanks for your patience.",
  estimatedEndsAt: "",
  allowAdmins: true,
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getMaintenance(): MaintenanceConfig {
  if (!isBrowser()) return DEFAULT_MAINTENANCE;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_MAINTENANCE, ...JSON.parse(raw) } : DEFAULT_MAINTENANCE;
  } catch {
    return DEFAULT_MAINTENANCE;
  }
}
export function setMaintenance(cfg: MaintenanceConfig) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(cfg));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function useMaintenance() {
  const [cfg, setCfg] = useState<MaintenanceConfig>(() => getMaintenance());
  useEffect(() => {
    const on = () => setCfg(getMaintenance());
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return cfg;
}
