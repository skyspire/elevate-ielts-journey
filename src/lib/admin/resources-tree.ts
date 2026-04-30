// Single source of truth for the admin Content > Resources tree.
// Mirrors the public Header.tsx mega-menu so admins manage the same items
// visitors see under Resources.

import {
  FileText,
  Sparkles,
  BookOpen,
  PenLine,
  Library,
  ClipboardList,
  GraduationCap,
  Headphones,
  Video,
  Mic,
  StickyNote,
} from "lucide-react";

export type ResourceItem = {
  /** Stable slug used in the route URL: /admin/content/resources/$slug */
  id: string;
  label: string;
  blurb: string;
  icon: typeof FileText;
  /** Whether the public page is live or marked Coming Soon in the mega menu. */
  status: "live" | "coming-soon";
  /** Editor mode the hub card links into. */
  editor:
    | "prompt-list" // Recent Exams, Predictions
    | "ebooks" // E-books JSON editor
    | "sample-answers" // Links into existing Writing/Speaking content
    | "vocabulary" // Existing vocabulary JSON editor
    | "coming-soon"; // Generic placeholder editor (title/blurb/launch ETA)
};

export const RESOURCES: ResourceItem[] = [
  {
    id: "recent-exams",
    label: "Recent Exams",
    blurb: "Verified questions from real test-takers across 40+ countries.",
    icon: FileText,
    status: "live",
    editor: "prompt-list",
  },
  {
    id: "predictions",
    label: "Predictions",
    blurb: "AI-ranked topics most likely to appear in your next sitting.",
    icon: Sparkles,
    status: "live",
    editor: "prompt-list",
  },
  {
    id: "ebooks",
    label: "E-books",
    blurb: "Deep-dive PDF guides written by our qualified IELTS team.",
    icon: BookOpen,
    status: "live",
    editor: "ebooks",
  },
  {
    id: "sample-answers",
    label: "Band 8+ Sample Answers",
    blurb: "Annotated Writing & Speaking models with expert notes.",
    icon: PenLine,
    status: "live",
    editor: "sample-answers",
  },
  {
    id: "vocabulary",
    label: "Vocabulary",
    blurb: "High-yield collocations and lexical chunks, grouped by topic.",
    icon: Library,
    status: "live",
    editor: "vocabulary",
  },
  {
    id: "quizzes",
    label: "Quizzes",
    blurb: "Bite-size band-targeted quizzes for grammar, vocab and reading.",
    icon: ClipboardList,
    status: "coming-soon",
    editor: "coming-soon",
  },
  {
    id: "assignments",
    label: "Assignments",
    blurb: "Guided weekly assignments with personalised expert feedback.",
    icon: GraduationCap,
    status: "coming-soon",
    editor: "coming-soon",
  },
  {
    id: "audio-courses",
    label: "Audio Courses",
    blurb: "Listen-on-the-go lessons covering every IELTS skill.",
    icon: Headphones,
    status: "coming-soon",
    editor: "coming-soon",
  },
  {
    id: "video-courses",
    label: "Video Courses",
    blurb: "Structured video classes from our qualified IELTS team.",
    icon: Video,
    status: "coming-soon",
    editor: "coming-soon",
  },
  {
    id: "podcasts",
    label: "Podcasts",
    blurb: "Weekly episodes on test strategy, mindset and real exam stories.",
    icon: Mic,
    status: "coming-soon",
    editor: "coming-soon",
  },
  {
    id: "study-notes",
    label: "Study Notes",
    blurb: "Printable cheat-sheets and one-page summaries for every topic.",
    icon: StickyNote,
    status: "coming-soon",
    editor: "coming-soon",
  },
];

export function findResource(id: string): ResourceItem | undefined {
  return RESOURCES.find((r) => r.id === id);
}

// ───────── Storage keys ─────────
// Recent Exams & Predictions both use a Record<string, string[]> so they can
// reuse the existing PromptListEditor (one category per skill).

export const RECENT_EXAMS_KEY = "recent-exams";
export const PREDICTIONS_KEY = "predictions";

export type ExamSkillKey = "writing" | "speaking" | "reading" | "listening";

export const EXAM_SKILLS: { key: ExamSkillKey; label: string }[] = [
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
  { key: "reading", label: "Reading" },
  { key: "listening", label: "Listening" },
];

export const RECENT_EXAMS_DEFAULT: Record<ExamSkillKey, string[]> = {
  writing: [],
  speaking: [],
  reading: [],
  listening: [],
};

export const PREDICTIONS_DEFAULT: Record<ExamSkillKey, string[]> = {
  writing: [],
  speaking: [],
  reading: [],
  listening: [],
};

// ───────── Coming-soon placeholder content ─────────
// Stored under one key per resource so admins can prep launch copy + ETA.

export const COMING_SOON_KEY_PREFIX = "resource-coming-soon:";

export type ComingSoonDraft = {
  headline: string;
  description: string;
  /** ISO date string, optional. */
  launchDate?: string;
  /** When true, swap the "Coming Soon" badge for a live-link in the mega menu. */
  ready: boolean;
  /** Free-form body the admin can prep ahead of launch (markdown / notes). */
  body: string;
};

export const COMING_SOON_DEFAULT: ComingSoonDraft = {
  headline: "",
  description: "",
  launchDate: "",
  ready: false,
  body: "",
};

export const EBOOKS_KEY = "ebooks";
