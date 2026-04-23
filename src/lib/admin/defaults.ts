// Default content snapshots — the initial values shown when no CMS override exists.
// Keep these in sync with what's hardcoded in the public components.

export const HERO_KEY = "hero";
export type HeroContent = {
  eyebrow: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineSuffix: string;
  subline: string;
  primaryCta: string;
  secondaryCta: string;
};
export const HERO_DEFAULT: HeroContent = {
  eyebrow: "free & fresh, always",
  headlinePrefix: "No need to buy",
  headlineHighlight: "expensive",
  headlineSuffix: "IELTS books.",
  subline:
    "Latest questions with Band 8–9 sample answers — drawn from real exams, updated regularly.",
  primaryCta: "View Recent Questions",
  secondaryCta: "Unlock Full Access",
};

export const STATS_KEY = "stats";
export type StatsContent = {
  eyebrow: string;
  heading: string;
  items: { target: number; suffix: string; label: string }[];
};
export const STATS_DEFAULT: StatsContent = {
  eyebrow: "by the numbers",
  heading: "Built for serious IELTS prep",
  items: [
    { target: 1300, suffix: "+", label: "Writing Questions" },
    { target: 4500, suffix: "+", label: "Speaking Questions" },
    { target: 170, suffix: "+", label: "Cue Cards" },
    { target: 4000, suffix: "+", label: "Active Users" },
  ],
};

export const PRICING_KEY = "pricing";
export type PricingPlan = {
  key: "biweekly" | "monthly" | "quarterly";
  name: string;
  days: string;
  popular: boolean;
  accent: string;
};
export type PricingContent = {
  plans: PricingPlan[];
  features: string[];
  footnote: string;
};
export const PRICING_DEFAULT: PricingContent = {
  plans: [
    { key: "biweekly", name: "Bi-Weekly", days: "15", popular: false, accent: "oklch(0.55 0.18 30)" },
    { key: "monthly", name: "Monthly", days: "30", popular: true, accent: "oklch(0.45 0.18 265)" },
    { key: "quarterly", name: "3-Month", days: "90", popular: false, accent: "oklch(0.55 0.14 160)" },
  ],
  features: [
    "Academic + General",
    "Complete question bank",
    "Band 8–9 Writing samples",
    "Speaking model answers",
    "Vocabulary & structures",
    "Recent exam questions (monthly)",
  ],
  footnote: "Cancel anytime",
};

export const FAQ_KEY = "faq";
export type FaqItem = { q: string; a: string };
export type FaqContent = { items: FaqItem[] };
export const FAQ_DEFAULT: FaqContent = {
  items: [
    {
      q: "Is BigIELTS for Academic or General Training?",
      a: "Both. Every Writing and Speaking section is split into Academic and General — Task 1 letters, Task 1 charts, Task 2 essays, and the full Speaking Part 1, 2, 3 banks. Choose your track once and the library filters automatically.",
    },
    {
      q: "Are the model answers really Band 9?",
      a: "Yes. Every sample is hand-written by certified IELTS instructors and reviewed by Cambridge-trained examiners. Each answer is graded against the four official band descriptors — Task Response, Coherence, Lexical Resource, and Grammatical Range.",
    },
    {
      q: "How often are new questions added?",
      a: "New Writing and Speaking questions are added every month, sourced from real test-takers worldwide. Predictions for upcoming exams are refreshed before each new test window.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes. Subscriptions are non-binding — cancel from your dashboard in one click. You keep full access until the end of your billing period and there are no cancellation fees.",
    },
    {
      q: "Do I need to pay to see anything?",
      a: "No. Sign up free and instantly unlock 6 hand-picked Band 9 model answers — 3 Writing and 3 Speaking. The full library, vocabulary builder, predictions, and templates open with one subscription starting at $7.",
    },
    {
      q: "Will this work on my phone?",
      a: "Absolutely. BigIELTS is designed mobile-first — every sample, vocabulary card, and timetable works the same on phone, tablet, and desktop. One account, every device.",
    },
  ],
};

export const FOOTER_KEY = "footer";
export type FooterLink = { label: string; to: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterContent = {
  tagline: string;
  columns: FooterColumn[];
  disclaimer: string;
};
export const FOOTER_DEFAULT: FooterContent = {
  tagline:
    "Recent IELTS Writing & Speaking questions with Band 8–9 sample answers — built to help you prepare smarter, not harder.",
  columns: [
    {
      title: "Navigate",
      links: [
        { label: "Home", to: "/" },
        { label: "Recent Questions", to: "/recent-exam-questions" },
        { label: "Vocabulary", to: "/vocabulary" },
        { label: "E-books", to: "/ebooks" },
      ],
    },
    {
      title: "IELTS",
      links: [
        { label: "Academic Writing", to: "/writing-samples" },
        { label: "Academic Speaking", to: "/speaking-samples" },
        { label: "General Writing", to: "/writing-samples" },
        { label: "General Speaking", to: "/speaking-samples" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Sign In", to: "/dashboard" },
        { label: "Sign Up", to: "/dashboard" },
        { label: "My Subscription", to: "/dashboard" },
        { label: "Billing", to: "/dashboard" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", to: "/faq" },
        { label: "Contact", to: "/contact" },
        { label: "Terms of Service", to: "/terms" },
        { label: "Privacy Policy", to: "/privacy" },
      ],
    },
  ],
  disclaimer:
    "BigIELTS.com is an independent IELTS preparation resource and is not affiliated with, endorsed by, or connected to IELTS, the British Council, IDP Education, or Cambridge Assessment English. All trademarks belong to their respective owners. Content on this site is provided for educational purposes only.",
};

export const CONTACT_KEY = "contact";
export type ContactContent = {
  company: string;
  legalName: string;
  description: string;
  email: string;
  address: string;
  hours: string;
  responseTime: string;
};
export const CONTACT_DEFAULT: ContactContent = {
  company: "BigIELTS.com",
  legalName: "Skyspire Academy Private Limited",
  description:
    "An independent IELTS preparation platform helping learners prepare smarter with recent questions and Band 8–9 sample answers.",
  email: "support@bigielts.com",
  address: "India",
  hours: "Mon–Fri, 10:00 — 18:00 IST",
  responseTime: "2–3 business days",
};

export const PRICES_KEY = "prices";
// Stored as a partial override of the PRICES map in src/lib/currency.ts
export type PricesOverride = Partial<
  Record<"biweekly" | "monthly" | "quarterly", Record<string, number>>
>;
export const PRICES_DEFAULT: PricesOverride = {};

// Bulk JSON sections for large data files
export const WRITING_PROMPTS_KEY = "writing-prompts";
export const SPEAKING_TOPICS_KEY = "speaking-topics";
export const VOCABULARY_KEY = "vocabulary";
