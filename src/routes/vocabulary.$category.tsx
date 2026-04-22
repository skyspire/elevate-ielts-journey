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
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
            {/* SIDEBAR — topic lists */}
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-2xl border border-foreground/10 bg-white/80 p-3 shadow-soft backdrop-blur-sm">
                <div className="px-2 pt-1 pb-2">
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
                        className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-colors"
                        style={
                          isActive
                            ? { background: tone.pill }
                            : undefined
                        }
                      >
                        <div className="min-w-0">
                          <div
                            className="truncate font-display text-[14px] font-bold leading-tight"
                            style={{
                              color: isActive ? tone.ink : "oklch(0.25 0.03 260)",
                            }}
                          >
                            {l.title}
                          </div>
                          <div className="mt-0.5 truncate text-[11px] font-medium text-foreground/55">
                            {l.blurb}
                          </div>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold tabular-nums"
                          style={{
                            background: isActive ? "white" : "oklch(0.96 0.01 250)",
                            color: isActive ? tone.ink : "oklch(0.4 0.02 260)",
                          }}
                        >
                          {l.words.length}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* DETAIL — notebook page */}
            <section className="min-w-0">
              {activeList ? (
                <NotebookPage
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
/* NotebookPage — paginated, ruled "page" of words.                   */
/* ------------------------------------------------------------------ */

function NotebookPage({
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
    <article
      className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-card"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent 0, transparent 47px, oklch(0.55 0.05 60 / 0.10) 47px, oklch(0.55 0.05 60 / 0.10) 48px)",
      }}
    >
      {/* Red margin line — like a real notebook */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-12 w-px sm:left-16"
        style={{ background: "oklch(0.65 0.18 25 / 0.35)" }}
      />
      {/* Punched holes */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 flex-col items-center justify-around py-10 sm:flex sm:w-16">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="block h-3 w-3 rounded-full bg-foreground/10 ring-1 ring-foreground/15"
          />
        ))}
      </div>

      {/* HEADER ROW — list title + search + pagination */}
      <header className="relative flex flex-col gap-3 border-b border-foreground/10 bg-white/70 px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:pl-20 sm:pr-6">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h2
              className="font-display text-xl font-black tracking-tight"
              style={{ color: ink }}
            >
              {list.title}
            </h2>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em]"
              style={{ background: pill, color: ink }}
            >
              {totalCount} words
            </span>
          </div>
          <p className="mt-0.5 text-[12px] font-medium text-foreground/55">{list.blurb}</p>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-3 py-1.5 shadow-soft">
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
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground/65 shadow-soft transition-colors hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={2.4} />
              Search
            </button>
          )}
        </div>
      </header>

      {/* WORDS — list rows */}
      {words.length === 0 ? (
        <div className="px-6 py-16 text-center sm:pl-20">
          <p className="font-handwriting text-3xl text-foreground/55">No matches</p>
          <p className="mt-2 text-[13px] text-foreground/55">
            Try a different word or clear the search.
          </p>
        </div>
      ) : (
        <ol className="relative px-5 py-3 sm:pl-20 sm:pr-6">
          {words.map((word, i) => (
            <WordRow
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
      <footer className="relative flex flex-col items-center justify-between gap-3 border-t border-foreground/10 bg-white/70 px-5 py-4 backdrop-blur-sm sm:flex-row sm:pl-20 sm:pr-6">
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
/* WordRow — collapsible word entry on a notebook line.               */
/* ------------------------------------------------------------------ */

function WordRow({
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
  const [open, setOpen] = useState(false);

  return (
    <li className="group border-b border-foreground/5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-foreground/[0.025]"
        aria-expanded={open}
      >
        <span className="w-8 shrink-0 text-right font-display text-[11px] font-bold tabular-nums text-foreground/35">
          {String(index).padStart(2, "0")}
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-baseline gap-2">
            <span
              className="font-display text-[16px] font-extrabold leading-tight"
              style={{ color: "oklch(0.20 0.03 260)" }}
            >
              {word.term}
            </span>
            {word.pos && (
              <span className="text-[11px] font-bold italic text-foreground/45">
                {word.pos}
              </span>
            )}
            {word.ipa && (
              <span className="text-[11px] font-medium text-foreground/45">
                /{word.ipa}/
              </span>
            )}
          </span>
          {!open && (
            <span className="mt-0.5 line-clamp-1 block text-[13px] text-foreground/60">
              {word.meaning}
            </span>
          )}
        </span>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-[0.16em] transition-colors"
          style={{
            background: open ? ink : pill,
            color: open ? "white" : ink,
          }}
        >
          {open ? "Close" : "Open"}
        </span>
      </button>

      {open && (
        <div className="ml-12 mr-2 mb-3 rounded-xl bg-foreground/[0.03] p-4">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-foreground/45">
              Meaning
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-foreground/85">
              {word.meaning}
            </p>
          </div>
          <div className="mt-3">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-foreground/45">
              Example
            </div>
            <p
              className="mt-1 font-handwriting text-[18px] leading-snug text-foreground/80"
              style={{ transform: "rotate(-0.4deg)", transformOrigin: "left" }}
            >
              “{word.example}”
            </p>
          </div>
          {word.tip && (
            <div
              className="mt-3 rounded-lg border-l-2 px-3 py-2"
              style={{ borderColor: ink, background: pill }}
            >
              <div
                className="text-[10px] font-extrabold uppercase tracking-[0.2em]"
                style={{ color: ink }}
              >
                Examiner Tip
              </div>
              <p className="mt-0.5 text-[13px] font-medium text-foreground/80">
                {word.tip}
              </p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
