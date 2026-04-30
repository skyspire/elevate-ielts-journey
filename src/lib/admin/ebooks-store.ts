// E-books CMS overrides — a per-id record of edited fields plus a list of
// admin-added ebooks. The public site merges defaults with these overrides.
//
// Storage shape:
//   {
//     order: string[];              // optional reordering of ALL ebooks (defaults + custom)
//     hidden: string[];             // ids hidden from the public library
//     overrides: Record<id, Partial<Ebook>>;  // edits to default ebooks
//     custom: Ebook[];              // brand-new ebooks created in admin
//   }

import { ebooks as defaultEbooks, type Ebook } from "@/data/ebooks";

export const EBOOKS_KEY = "ebooks-cms";

export type EbooksStore = {
  order: string[];
  hidden: string[];
  overrides: Record<string, Partial<Ebook>>;
  custom: Ebook[];
};

export const EBOOKS_DEFAULT: EbooksStore = {
  order: [],
  hidden: [],
  overrides: {},
  custom: [],
};

/** Merge the static default ebooks with admin overrides + custom additions. */
export function resolveEbooks(store: EbooksStore): Ebook[] {
  const merged: Ebook[] = [];

  // Apply per-id overrides on top of defaults
  for (const base of defaultEbooks) {
    const ov = store.overrides[base.id];
    merged.push(ov ? { ...base, ...ov } : base);
  }

  // Append custom ebooks
  for (const c of store.custom) {
    merged.push(c);
  }

  // Hide
  const hiddenSet = new Set(store.hidden);
  const visible = merged.filter((b) => !hiddenSet.has(b.id));

  // Apply manual order if provided
  if (store.order.length > 0) {
    const indexOf = (id: string) => {
      const i = store.order.indexOf(id);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    visible.sort((a, b) => indexOf(a.id) - indexOf(b.id));
  } else {
    // Otherwise honour per-ebook sortOrder if any are set
    visible.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  // Drafts are filtered for the public site — admin gets the full list.
  return visible;
}

/** Public library — drafts hidden. */
export function resolvePublicEbooks(store: EbooksStore): Ebook[] {
  return resolveEbooks(store).filter((b) => (b.status ?? "published") === "published");
}

export function blankEbook(): Ebook {
  return {
    id: `ebook-${Date.now().toString(36)}`,
    title: "Untitled e-book",
    subtitle: "",
    author: "Our IELTS team",
    category: "Writing",
    band: "Band 7+",
    pageCount: 0,
    coverGradient: "linear-gradient(135deg, oklch(0.45 0.18 30), oklch(0.35 0.15 25))",
    coverAccent: "oklch(0.85 0.15 80)",
    description: "",
    freePages: 0,
    chapters: [],
    status: "draft",
    featured: false,
    isNew: true,
  };
}
