import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookA,
  Combine,
  Quote,
  Link2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Lightbulb,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import { Footer } from "@/components/site/Footer";
import {
  getCategory,
  totalWords,
  type CategoryKey,
  type TopicList,
  type Word,
} from "@/data/vocabulary";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).catch("academic"),
  list: z.string().optional(),
  page: z.coerce.number().int().min(1).catch(1),
  q: z.string().optional(),
});

const WORDS_PER_PAGE = 20;

const categoryIcon: Record<CategoryKey, ComponentType<LucideProps>> = {
  dictionary: BookA,
  phrasal: Combine,
  idioms: Quote,
  collocations: Link2,
  slangs: MessageCircle,
};

const categoryTone: Record<CategoryKey, { ink: string; pill: string }> = {
  dictionary: { ink: "oklch(0.42 0.18 260)", pill: "oklch(0.95 0.05 260)" },
  phrasal: { ink: "oklch(0.48 0.16 230)", pill: "oklch(0.95 0.04 230)" },
  idioms: { ink: "oklch(0.45 0.18 290)", pill: "oklch(0.95 0.05 290)" },
  collocations: { ink: "oklch(0.50 0.15 200)", pill: "oklch(0.94 0.05 200)" },
  slangs: { ink: "oklch(0.55 0.16 250)", pill: "oklch(0.95 0.04 250)" },
};

export const Route = createFileRoute("/vocabulary/$category")({
  validateSearch: searchSchema,
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.category.title} — Vocabulary Builder | BigIELTS.com`
          : "Vocabulary — BigIELTS.com",
      },
      {
        name: "description",
        content:
          loaderData?.category.tagline ??
          "IELTS vocabulary curated by topic with meanings, examples, and examiner tips.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-paper-cream px-4">
      <div className="text-center">
        <h1 className="font-handwriting text-5xl text-foreground/70">Not found</h1>
        <p className="mt-2 text-sm text-foreground/60">
          That vocabulary category doesn't exist.
        </p>
        <Link
          to="/vocabulary"
          search={{ module: "academic" }}
          className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background"
        >
          Back to Vocabulary
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-paper-cream px-4">
      <div className="text-center">
        <h1 className="font-handwriting text-4xl text-foreground/70">Something went wrong</h1>
        <p className="mt-2 max-w-md text-sm text-foreground/60">{error.message}</p>
      </div>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/vocabulary/$category" });

  // Active list (defaults to first list).
  const activeListSlug = search.list ?? category.lists[0]?.slug;
  const activeList: TopicList | undefined =
    category.lists.find((l) => l.slug === activeListSlug) ?? category.lists[0];

  const Icon = categoryIcon[category.key];
  const tone = categoryTone[category.key];

  const [searchOpen, setSearchOpen] = useState(false);

  // Filter words by query (only within the active list).
  const query = (search.q ?? "").trim().toLowerCase();
  const filteredWords: Word[] = useMemo(() => {
    if (!activeList) return [];
    if (!query) return activeList.words;
    return activeList.words.filter(
      (w) =>
        w.term.toLowerCase().includes(query) ||
        w.meaning.toLowerCase().includes(query),
    );
  }, [activeList, query]);

  const totalPages = Math.max(1, Math.ceil(filteredWords.length / WORDS_PER_PAGE));
  const page = Math.min(search.page, totalPages);
  const start = (page - 1) * WORDS_PER_PAGE;
  const pageWords = filteredWords.slice(start, start + WORDS_PER_PAGE);

  const goToList = (slug: string) =>
    navigate({
      search: (prev) => ({ ...prev, list: slug, page: 1, q: undefined }),
    });

  const goToPage = (p: number) =>
    navigate({
      search: (prev) => ({ ...prev, page: Math.max(1, Math.min(totalPages, p)) }),
    });

  const setQuery = (val: string) =>
    navigate({
      search: (prev) => ({ ...prev, q: val || undefined, page: 1 }),
    });

  return (
    <div className="min-h-screen bg-paper-cream">
      <main className="relative py-10 sm:py-14">
        {/* Subtle ruled-paper top accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-paper-ruled opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6">
          {/* Back link */}
          <div className="mb-5">
            <Link
              to="/vocabulary"
              search={{ module: search.module }}
              className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.2em] text-foreground/55 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.6} />
              Vocabulary
            </Link>
          </div>

          {/* Header */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-soft"
                  style={{ background: tone.ink }}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.4} />
                </span>
                <div>
                  <h1
                    className="font-handwriting text-4xl font-bold leading-[0.95] text-foreground/70 sm:text-5xl"
                    style={{ transform: "rotate(-1.5deg)" }}
                  >
                    {category.title}
                  </h1>
                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.22em] text-foreground/45">
                    {category.lists.length} topic lists ·{" "}
                    {totalWords(category).toLocaleString()} words
                  </p>
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-foreground/65">
                {category.tagline}
              </p>
            </div>

            {/* Module pill */}
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-foreground/10 bg-white px-3 py-1.5 shadow-soft sm:self-end">
              <span className="h-2 w-2 rounded-full" style={{ background: tone.ink }} />
              <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.24em] text-foreground/70">
                IELTS {search.module === "academic" ? "Academic" : "General"}
              </span>
            </div>
          </header>

          {/* Sidebar + Detail layout */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
            {/* SIDEBAR — big bold stacked list */}
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <div className="pb-4">
                <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.24em] text-foreground/45">
                  Topic Lists
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {category.lists.map((l) => {
                  const isActive = l.slug === activeList?.slug;
                  return (
                    <button
                      key={l.slug}
                      type="button"
                      onClick={() => goToList(l.slug)}
                      className="group flex flex-col items-start py-2.5 text-left transition-colors"
                    >
                      <span
                        className="font-display text-[22px] leading-[1.15] tracking-tight transition-colors sm:text-[24px]"
                        style={{
                          color: isActive ? tone.ink : "oklch(0.30 0.03 260)",
                          fontWeight: isActive ? 900 : 700,
                        }}
                      >
                        {l.title}
                      </span>
                      {/* Underline accent for active */}
                      <span
                        aria-hidden
                        className="mt-1 h-[3px] rounded-full transition-all duration-200"
                        style={{
                          background: tone.ink,
                          width: isActive ? "32px" : "0px",
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                      <span
                        className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
                        style={{
                          color: isActive ? tone.ink : "oklch(0.55 0.02 260)",
                          opacity: isActive ? 0.8 : 0.55,
                        }}
                      >
                        {l.words.length} words
                      </span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* DETAIL — clean dictionary page */}
            <section className="min-w-0">
              {activeList ? (
                <DictionaryPage
                  list={activeList}
                  words={pageWords}
                  totalCount={filteredWords.length}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  query={search.q ?? ""}
                  onQueryChange={setQuery}
                  searchOpen={searchOpen}
                  onToggleSearch={() => setSearchOpen((s) => !s)}
                  ink={tone.ink}
                  pill={tone.pill}
                />
              ) : (
                <div className="rounded-2xl border border-foreground/10 bg-white p-10 text-center shadow-soft">
                  <p className="text-foreground/60">No lists yet.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DictionaryPage — clean two-column dictionary list (no expand).     */
/* ------------------------------------------------------------------ */

function DictionaryPage({
  list,
  words,
  totalCount,
  page,
  totalPages,
  onPageChange,
  query,
  onQueryChange,
  searchOpen,
  onToggleSearch,
  ink,
  pill,
}: {
  list: TopicList;
  words: Word[];
  totalCount: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  query: string;
  onQueryChange: (q: string) => void;
  searchOpen: boolean;
  onToggleSearch: () => void;
  ink: string;
  pill: string;
}) {
  const startIndex = (page - 1) * WORDS_PER_PAGE + 1;
  const endIndex = startIndex + words.length - 1;

  return (
    <article className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-soft">
      {/* HEADER — list title + search */}
      <header className="flex flex-col gap-3 border-b border-foreground/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: ink }}
            />
            <h2
              className="font-display text-[20px] font-black tracking-tight"
              style={{ color: ink }}
            >
              {list.title}
            </h2>
          </div>
          <p className="mt-1 text-[12.5px] font-medium text-foreground/55">
            {list.blurb} · <span className="tabular-nums">{totalCount}</span> words
          </p>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-foreground/45" strokeWidth={2.4} />
              <input
                autoFocus
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search this list…"
                className="w-44 bg-transparent text-[13px] font-medium text-foreground placeholder:text-foreground/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={onToggleSearch}
                className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-foreground/50 hover:text-foreground"
              >
                Close
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onToggleSearch}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/65 transition-colors hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={2.4} />
              Search
            </button>
          )}
        </div>
      </header>

      {/* WORDS — two-column dictionary entries */}
      {words.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="font-handwriting text-3xl text-foreground/55">No matches</p>
          <p className="mt-2 text-[13px] text-foreground/55">
            Try a different word or clear the search.
          </p>
        </div>
      ) : (
        <ol className="divide-y divide-foreground/5">
          {words.map((word, i) => (
            <WordEntry
              key={word.id}
              word={word}
              index={startIndex + i}
              ink={ink}
              pill={pill}
            />
          ))}
        </ol>
      )}

      {/* FOOTER — pagination */}
      <footer className="flex flex-col items-center justify-between gap-3 border-t border-foreground/10 px-5 py-4 sm:flex-row sm:px-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/45">
          {totalCount === 0
            ? "No words"
            : `Words ${startIndex}–${endIndex} of ${totalCount}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground/65 transition-colors hover:text-foreground disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.6} />
          </button>
          <span className="min-w-[80px] text-center font-display text-[13px] font-extrabold tabular-nums text-foreground/75">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground/65 transition-colors hover:text-foreground disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.6} />
          </button>
        </div>
      </footer>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* WordEntry — fully visible two-column dictionary entry.             */
/* ------------------------------------------------------------------ */

function WordEntry({
  word,
  index,
  ink,
  pill,
}: {
  word: Word;
  index: number;
  ink: string;
  pill: string;
}) {
  return (
    <li className="px-5 py-5 sm:px-7">
      {/* Headword line */}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3
          className="font-display text-[18px] font-extrabold leading-tight tracking-tight"
          style={{ color: "oklch(0.18 0.03 260)" }}
        >
          {word.term}
        </h3>
        {word.pos && (
          <span className="text-[11px] font-medium italic text-foreground/40">
            {word.pos}
          </span>
        )}
        <span className="text-foreground/35">—</span>
        <span className="text-[14.5px] leading-snug text-foreground/75">
          {word.meaning}
        </span>
      </div>

      {/* Example — italic, no label */}
      <p className="mt-1.5 text-[13.5px] italic leading-relaxed text-foreground/55">
        “{word.example}”
      </p>

      {/* Tip — quiet single line, no pill, no icon */}
      {word.tip && (
        <p
          className="mt-1.5 text-[12.5px] font-medium leading-snug"
          style={{ color: ink }}
        >
          {word.tip}
        </p>
      )}
    </li>
  );
}
