// Communications store — broadcast announcements, email templates, per-learner inbox.
// localStorage only. Prototype: emails are NOT actually sent. They are recorded
// in an "outbox" so the admin can see what would have gone out.

import { useEffect, useState, useCallback } from "react";
import { getLearners } from "@/lib/learner-auth";
import { getLearnerRows, isSubActive, type PlanKey } from "@/lib/admin/subscribers-store";

const ANNOUNCE_KEY = "bigielts:comms:announcements";
const TEMPLATES_KEY = "bigielts:comms:templates";
const INBOX_KEY = "bigielts:comms:inbox"; // map<userId, InboxMsg[]>
const OUTBOX_KEY = "bigielts:comms:outbox";
const READS_KEY = "bigielts:comms:reads"; // map<userId, announcementId[]>

const EVT = "comms:changed";

// ───────── Types ─────────

export type AudienceFilter = {
  segment: "all" | "active" | "trialing" | "expired" | "plan";
  plan?: PlanKey;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: AudienceFilter;
  createdAt: number;
  publishedAt?: number; // null = draft
  variant?: "info" | "success" | "warning" | "promo";
};

export type EmailTemplate = {
  key: string; // e.g. "welcome", "trial-ending", "expired", "payment-received"
  label: string;
  subject: string;
  body: string;
  enabled: boolean;
  // Auto-reminder trigger (for trial-ending / sub-expiring): days before expiry.
  triggerDaysBefore?: number;
};

export type InboxMsg = {
  id: string;
  userId: string;
  fromAdmin: string; // admin name
  subject: string;
  body: string;
  createdAt: number;
  read?: boolean;
};

export type OutboxEntry = {
  id: string;
  templateKey: string;
  to: string;
  subject: string;
  body: string;
  sentAt: number;
  reason: string; // e.g. "auto: trial ending in 3d", "manual: welcome"
};

// ───────── Defaults ─────────

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    key: "welcome",
    label: "Welcome",
    subject: "Welcome to BigIELTS, {{name}}!",
    body: "Hi {{name}},\n\nWelcome aboard! Start exploring fresh IELTS questions and Band 8–9 sample answers right away.\n\n— The BigIELTS team",
    enabled: true,
  },
  {
    key: "trial-ending",
    label: "Trial ending soon",
    subject: "Your trial ends in {{days}} days",
    body: "Hi {{name}},\n\nYour free trial ends on {{expiresAt}}. Pick a plan to keep your access.\n\n— The BigIELTS team",
    enabled: true,
    triggerDaysBefore: 3,
  },
  {
    key: "sub-expiring",
    label: "Subscription expiring",
    subject: "Your subscription expires in {{days}} days",
    body: "Hi {{name}},\n\nYour {{plan}} subscription expires on {{expiresAt}}. Renew to avoid losing access.\n\n— The BigIELTS team",
    enabled: true,
    triggerDaysBefore: 7,
  },
  {
    key: "expired",
    label: "Subscription expired",
    subject: "Your subscription has expired",
    body: "Hi {{name}},\n\nYour {{plan}} subscription has now expired. Renew anytime to pick up where you left off.\n\n— The BigIELTS team",
    enabled: true,
  },
  {
    key: "payment-received",
    label: "Payment received",
    subject: "Payment received — {{currency}} {{amount}}",
    body: "Hi {{name}},\n\nWe've received your payment of {{currency}} {{amount}} for the {{plan}} plan. Thank you!\n\n— The BigIELTS team",
    enabled: true,
  },
];

// ───────── Helpers ─────────

function isBrowser() {
  return typeof window !== "undefined";
}
function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return (JSON.parse(raw) as T) ?? fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVT));
}

// ───────── Announcements ─────────

export function getAnnouncements(): Announcement[] {
  return read<Announcement[]>(ANNOUNCE_KEY, []);
}
export function saveAnnouncements(list: Announcement[]) {
  write(ANNOUNCE_KEY, list);
}
export function upsertAnnouncement(a: Announcement) {
  const list = getAnnouncements();
  const idx = list.findIndex((x) => x.id === a.id);
  if (idx >= 0) list[idx] = a;
  else list.unshift(a);
  saveAnnouncements(list);
}
export function deleteAnnouncement(id: string) {
  saveAnnouncements(getAnnouncements().filter((a) => a.id !== id));
}
export function blankAnnouncement(): Announcement {
  return {
    id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: "",
    body: "",
    audience: { segment: "all" },
    createdAt: Date.now(),
    variant: "info",
  };
}

/** Filter announcements visible to a specific learner. */
export function getAnnouncementsForUser(userId: string): Announcement[] {
  const all = getAnnouncements().filter((a) => a.publishedAt);
  const row = getLearnerRows().find((r) => r.user.id === userId);
  if (!row) return [];
  return all.filter((a) => audienceMatches(a.audience, row.sub.plan, row.sub.status, row.active));
}

function audienceMatches(
  aud: AudienceFilter,
  plan: PlanKey,
  status: string,
  active: boolean,
): boolean {
  switch (aud.segment) {
    case "all":
      return true;
    case "active":
      return active && status === "active";
    case "trialing":
      return status === "trialing";
    case "expired":
      return !active;
    case "plan":
      return aud.plan === plan;
  }
}

/** Resolve count of users that match an audience filter. */
export function audienceSize(aud: AudienceFilter): number {
  return getLearnerRows().filter((r) =>
    audienceMatches(aud, r.sub.plan, r.sub.status, r.active),
  ).length;
}

// ───────── Reads (which announcements a user has dismissed) ─────────

type ReadsMap = Record<string, string[]>;
export function getReads(userId: string): string[] {
  return read<ReadsMap>(READS_KEY, {})[userId] ?? [];
}
export function markAnnouncementRead(userId: string, announcementId: string) {
  const all = read<ReadsMap>(READS_KEY, {});
  const list = new Set(all[userId] ?? []);
  list.add(announcementId);
  all[userId] = Array.from(list);
  write(READS_KEY, all);
}

// ───────── Email templates ─────────

export function getTemplates(): EmailTemplate[] {
  const stored = read<EmailTemplate[] | null>(TEMPLATES_KEY, null);
  if (!stored) return DEFAULT_TEMPLATES;
  // Merge in any new defaults that were added later
  const map = new Map(stored.map((t) => [t.key, t]));
  for (const d of DEFAULT_TEMPLATES) if (!map.has(d.key)) map.set(d.key, d);
  return Array.from(map.values());
}
export function saveTemplates(list: EmailTemplate[]) {
  write(TEMPLATES_KEY, list);
}
export function getTemplate(key: string): EmailTemplate | undefined {
  return getTemplates().find((t) => t.key === key);
}

function fill(tpl: string, vars: Record<string, string>) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

// ───────── Inbox (admin → learner private notes) ─────────

type InboxMap = Record<string, InboxMsg[]>;
export function getInboxFor(userId: string): InboxMsg[] {
  return read<InboxMap>(INBOX_KEY, {})[userId] ?? [];
}
export function sendInboxMessage(msg: Omit<InboxMsg, "id" | "createdAt">) {
  const all = read<InboxMap>(INBOX_KEY, {});
  const m: InboxMsg = {
    ...msg,
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
  };
  all[msg.userId] = [m, ...(all[msg.userId] ?? [])];
  write(INBOX_KEY, all);
  return m;
}
export function deleteInboxMessage(userId: string, id: string) {
  const all = read<InboxMap>(INBOX_KEY, {});
  all[userId] = (all[userId] ?? []).filter((m) => m.id !== id);
  write(INBOX_KEY, all);
}
export function markInboxRead(userId: string, id: string) {
  const all = read<InboxMap>(INBOX_KEY, {});
  all[userId] = (all[userId] ?? []).map((m) => (m.id === id ? { ...m, read: true } : m));
  write(INBOX_KEY, all);
}

// ───────── Outbox (mock email log) ─────────

export function getOutbox(): OutboxEntry[] {
  return read<OutboxEntry[]>(OUTBOX_KEY, []);
}
export function saveOutbox(list: OutboxEntry[]) {
  write(OUTBOX_KEY, list);
}
export function logOutbox(entry: Omit<OutboxEntry, "id" | "sentAt">) {
  const e: OutboxEntry = {
    ...entry,
    id: `o_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sentAt: Date.now(),
  };
  saveOutbox([e, ...getOutbox()].slice(0, 500));
  return e;
}

/** "Send" an email by filling the template and logging to outbox. */
export function sendTemplatedEmail(opts: {
  templateKey: string;
  to: string;
  vars: Record<string, string>;
  reason: string;
}): OutboxEntry | null {
  const t = getTemplate(opts.templateKey);
  if (!t || !t.enabled) return null;
  const subject = fill(t.subject, opts.vars);
  const body = fill(t.body, opts.vars);
  return logOutbox({
    templateKey: opts.templateKey,
    to: opts.to,
    subject,
    body,
    reason: opts.reason,
  });
}

// ───────── Auto-reminder runner ─────────

/**
 * Walks all learners and dispatches reminder emails for any subscriptions
 * that match a template's triggerDaysBefore. Idempotent within the same day:
 * uses an outbox dedup key so the same reminder isn't sent twice.
 */
export function runAutoReminders(): { sent: number } {
  const templates = getTemplates().filter((t) => t.enabled && t.triggerDaysBefore != null);
  if (templates.length === 0) return { sent: 0 };
  const rows = getLearnerRows();
  const today = new Date().toISOString().slice(0, 10);
  const sentToday = new Set(
    getOutbox()
      .filter((o) => new Date(o.sentAt).toISOString().slice(0, 10) === today)
      .map((o) => `${o.templateKey}:${o.to}`),
  );
  let sent = 0;
  for (const r of rows) {
    if (!r.sub.expiresAt) continue;
    const daysLeft = Math.ceil((r.sub.expiresAt - Date.now()) / 86400000);
    if (daysLeft < 0) continue;
    for (const t of templates) {
      if (daysLeft !== t.triggerDaysBefore) continue;
      const tpl = t.key === "trial-ending" && r.sub.status !== "trialing" ? null : t;
      const tpl2 = t.key === "sub-expiring" && r.sub.status === "trialing" ? null : tpl;
      if (!tpl2) continue;
      const dedup = `${tpl2.key}:${r.user.email}`;
      if (sentToday.has(dedup)) continue;
      sendTemplatedEmail({
        templateKey: tpl2.key,
        to: r.user.email,
        vars: {
          name: r.user.name,
          days: String(daysLeft),
          plan: r.sub.plan,
          expiresAt: new Date(r.sub.expiresAt).toLocaleDateString(),
        },
        reason: `auto: ${tpl2.label} (${daysLeft}d left)`,
      });
      sentToday.add(dedup);
      sent++;
    }
  }
  return { sent };
}

// ───────── Hook ─────────

export function useCommsData<T>(selector: () => T): T {
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

export function audienceLabel(a: AudienceFilter): string {
  switch (a.segment) {
    case "all":
      return "All learners";
    case "active":
      return "Active subscribers";
    case "trialing":
      return "On trial";
    case "expired":
      return "Expired / free";
    case "plan":
      return `Plan: ${a.plan}`;
  }
}
