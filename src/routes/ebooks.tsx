import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { BookOpen, Lock, Sparkles } from "lucide-react";
import { ebooks, type EbookCategory } from "@/data/ebooks";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/ebooks")({
  head: () => ({
    meta: [
      { title: "IELTS E-Book Library — BigIELTS" },
      {
        name: "description",
        content:
          "Read IELTS e-books in a beautiful Kindle-style reader. Writing frameworks, speaking cue cards, vocabulary and grammar — by Band 9 examiners.",
      },
      { property: "og:title", content: "IELTS E-Book Library — BigIELTS" },
      {
        property: "og:description",
        content:
          "A bookshelf of IELTS e-books — written by Band 9 examiners, read in a beautiful in-browser reader.",
      },
    ],
  }),
  component: EbooksPage,
});

const CATEGORIES: ("All" | EbookCategory)[] = [
  "All",
  "Writing",
  "Speaking",
  "Reading",
  "Listening",
  "Vocabulary",
  "Grammar",
];

function EbooksPage() {
  const [category, setCategory] = useState<"All" | EbookCategory>("All");
  const filtered = useMemo(
    () => (category === "All" ? ebooks : ebooks.filter((b) => b.category === category)),
    [category],
  );
  const matches = useMatches();
  const hasChildMatch = matches.some(
    (m) => m.routeId !== "/ebooks" && m.routeId.startsWith("/ebooks/"),
  );

  if (hasChildMatch) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container-page pb-24 pt-12 sm:pt-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "oklch(0.95 0.05 35)",
              color: "oklch(0.45 0.17 30)",
            }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {ebooks.length} titles · Free preview
          </span>
          <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            The E-Book Library
          </h1>
          <p className="mt-5 text-base font-semibold text-foreground/70 sm:text-lg">
            Open any book and start reading. The first chapter is free — sign in to unlock the rest, plus
            highlights, bookmarks and progress tracking.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
                style={{
                  background: active ? "oklch(0.20 0.01 250)" : "oklch(0.97 0.01 250)",
                  color: active ? "white" : "oklch(0.30 0.02 260)",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Bookshelf grid */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((book) => (
            <Link
              key={book.id}
              to="/ebooks/$bookId"
              params={{ bookId: book.id }}
              className="group flex flex-col items-center"
            >
              {/* Cover */}
              <div
                className="relative aspect-[2/3] w-full overflow-hidden rounded-r-md rounded-l-sm shadow-[0_12px_32px_-8px_oklch(0.2_0.05_260/0.35)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-1deg] group-hover:shadow-[0_20px_44px_-8px_oklch(0.2_0.05_260/0.45)]"
                style={{ background: book.coverGradient }}
              >
                {/* spine line */}
                <div
                  className="absolute inset-y-0 left-0 w-[6px]"
                  style={{ background: "linear-gradient(to right, rgba(0,0,0,0.35), transparent)" }}
                />
                {/* gloss */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.18) 100%)",
                  }}
                />
                {/* content */}
                <div className="relative flex h-full flex-col justify-between p-4 text-white">
                  <div>
                    <span
                      className="inline-block rounded-sm px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em]"
                      style={{ background: book.coverAccent, color: "oklch(0.20 0.05 260)" }}
                    >
                      {book.category}
                    </span>
                  </div>
                  <div>
                    <div
                      className="text-[8px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {book.band}
                    </div>
                    <h3
                      className="mt-1.5 font-display text-base font-black leading-[1.05] sm:text-lg"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {book.title}
                    </h3>
                    <p className="mt-1 text-[10px] font-semibold opacity-80">{book.subtitle}</p>
                  </div>
                </div>
                {/* free preview ribbon */}
                <div
                  className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
                  style={{ background: "white", color: "oklch(0.45 0.17 30)" }}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  Free
                </div>
              </div>
              {/* Below cover */}
              <div className="mt-3 w-full text-center">
                <h4 className="text-sm font-bold leading-tight text-foreground line-clamp-2">
                  {book.title}
                </h4>
                <p className="mt-0.5 text-xs font-semibold text-foreground/55">
                  {book.author.split(",")[0]}
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-foreground/45">
                  <Lock className="h-2.5 w-2.5" />
                  {book.pageCount} pages
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
