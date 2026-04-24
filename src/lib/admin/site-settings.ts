// Site-wide settings: theme/branding, homepage section order/visibility,
// per-route SEO, announcement banner.

import { useCmsSection, getSection } from "@/lib/admin/cms-store";

// ───────── Theme & branding ─────────

export const BRANDING_KEY = "branding";

export type Branding = {
  /** Hex color, applied as primary tint via CSS vars on the public site. */
  primaryHex: string;
  /** "inter" | "playfair" | "system" — see THEME_FONT_OPTIONS. */
  fontKey: string;
  /** Logo wordmark text. */
  logoText: string;
};

export const BRANDING_DEFAULT: Branding = {
  primaryHex: "#3b6df7",
  fontKey: "inter",
  logoText: "BigIELTS.com",
};

export const THEME_FONT_OPTIONS: { key: string; label: string; cssStack: string }[] = [
  { key: "inter", label: "Inter (default)", cssStack: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  { key: "playfair", label: "Playfair Display (editorial)", cssStack: '"Playfair Display", Georgia, serif' },
  { key: "merriweather", label: "Merriweather (serif body)", cssStack: '"Merriweather", Georgia, serif' },
  { key: "system", label: "System UI", cssStack: 'ui-sans-serif, system-ui, -apple-system, sans-serif' },
];

export function useBranding(): Branding {
  return useCmsSection<Branding>(BRANDING_KEY, BRANDING_DEFAULT);
}

// ───────── Homepage section order/visibility ─────────

export const HOMEPAGE_LAYOUT_KEY = "homepage-layout";

export type HomepageSection = {
  id: string;
  label: string;
  visible: boolean;
};

export const HOMEPAGE_DEFAULT: HomepageSection[] = [
  { id: "hero", label: "Hero", visible: true },
  { id: "press", label: "Press / Featured-in", visible: true },
  { id: "everything", label: "Everything You Need", visible: true },
  { id: "stats", label: "Stats", visible: true },
  { id: "value", label: "Value Statement", visible: true },
  { id: "trust", label: "Trust / Compare", visible: true },
  { id: "tryfree", label: "Try Free", visible: true },
  { id: "latest", label: "Latest Questions", visible: true },
  { id: "world", label: "Learners' World", visible: true },
  { id: "faq", label: "FAQ", visible: true },
  { id: "finalcta", label: "Final CTA", visible: true },
];

export function useHomepageLayout(): HomepageSection[] {
  // If the saved value has fewer sections than defaults (e.g. we added new ones),
  // merge them in at the end with visible=true so the homepage never breaks.
  const stored = useCmsSection<HomepageSection[]>(HOMEPAGE_LAYOUT_KEY, HOMEPAGE_DEFAULT);
  const known = new Set(stored.map((s) => s.id));
  const extras = HOMEPAGE_DEFAULT.filter((s) => !known.has(s.id));
  return extras.length === 0 ? stored : [...stored, ...extras];
}

// ───────── Per-route SEO ─────────

export const SEO_KEY = "seo-overrides";

export type SeoEntry = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export type SeoOverrides = Record<string, SeoEntry>;
export const SEO_DEFAULT: SeoOverrides = {};

export const SEO_ROUTES: { path: string; label: string; defaultTitle: string; defaultDesc: string }[] = [
  { path: "/", label: "Home", defaultTitle: "BigIELTS.com — Recent IELTS Questions & Sample Answers", defaultDesc: "Recent IELTS Writing and Speaking exam questions with Band 8–9 sample answers, vocabulary, and structure breakdowns." },
  { path: "/writing-samples", label: "Writing Samples", defaultTitle: "Writing Samples — BigIELTS.com", defaultDesc: "IELTS Writing Task 1 & Task 2 prompts with Band 8+ sample answers." },
  { path: "/speaking-samples", label: "Speaking Samples", defaultTitle: "Speaking Samples — BigIELTS.com", defaultDesc: "IELTS Speaking Part 1, 2 & 3 model answers with vocabulary and tips." },
  { path: "/recent-exam-questions", label: "Recent Exam Questions", defaultTitle: "Recent Exam Questions — BigIELTS.com", defaultDesc: "Verified recent IELTS exam questions reported by real test-takers." },
  { path: "/predictions", label: "Predictions", defaultTitle: "IELTS Predictions — BigIELTS.com", defaultDesc: "Up-to-date predicted IELTS Writing and Speaking topics." },
  { path: "/vocabulary", label: "Vocabulary", defaultTitle: "Vocabulary — BigIELTS.com", defaultDesc: "Topic-grouped IELTS vocabulary with meanings and example sentences." },
  { path: "/ebooks", label: "Ebooks", defaultTitle: "Free IELTS Ebooks — BigIELTS.com", defaultDesc: "Free downloadable IELTS preparation ebooks." },
  { path: "/contact", label: "Contact", defaultTitle: "Contact — BigIELTS.com", defaultDesc: "Get in touch with the BigIELTS team." },
  { path: "/faq", label: "FAQ", defaultTitle: "FAQ — BigIELTS.com", defaultDesc: "Answers to common questions about IELTS preparation with BigIELTS." },
];

export function useSeoOverrides(): SeoOverrides {
  return useCmsSection<SeoOverrides>(SEO_KEY, SEO_DEFAULT);
}

export function getSeoOverridesSync(): SeoOverrides {
  return getSection<SeoOverrides>(SEO_KEY, SEO_DEFAULT);
}

// ───────── Announcement banner ─────────

export const BANNER_KEY = "announcement-banner";

export type AnnouncementBanner = {
  enabled: boolean;
  message: string;
  /** Optional CTA */
  ctaLabel?: string;
  ctaHref?: string;
  /** Tailwind-friendly preset for color */
  tone: "neutral" | "brand" | "success" | "warning";
  /** Bumped on every save — used as a key so dismissed banners reappear when changed. */
  version: number;
};

export const BANNER_DEFAULT: AnnouncementBanner = {
  enabled: false,
  message: "🎉 New: General Training writing letters are now live!",
  ctaLabel: "Browse",
  ctaHref: "/writing-samples",
  tone: "brand",
  version: 1,
};

export function useAnnouncementBanner(): AnnouncementBanner {
  return useCmsSection<AnnouncementBanner>(BANNER_KEY, BANNER_DEFAULT);
}
