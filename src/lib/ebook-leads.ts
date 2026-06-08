// Lightweight client-side store for free-ebook leads.
// Persisted to localStorage; admin can extend later.

export type EbookLead = {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  whatsappOptIn: boolean;
  targetBand: string;
  createdAt: number;
};

const KEY = "bigielts.ebook-leads.v1";

export function loadLeads(): EbookLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EbookLead[]) : [];
  } catch {
    return [];
  }
}

export function saveLead(lead: Omit<EbookLead, "id" | "createdAt">): EbookLead {
  const next: EbookLead = {
    ...lead,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const all = loadLeads();
  all.unshift(next);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all.slice(0, 500)));
  } catch {
    /* ignore */
  }
  return next;
}

export function hasClaimedFreeEbook(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("bigielts.ebook-leads.claimed") === "1";
}

export function markClaimed() {
  try {
    window.localStorage.setItem("bigielts.ebook-leads.claimed", "1");
  } catch {
    /* ignore */
  }
}
