import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { BookOpen } from "lucide-react";
import { type EbookCategory } from "@/data/ebooks";
import { useEffect, useMemo, useState } from "react";
import { getReaderState } from "@/lib/ebook-storage";
import { useLearnerSession } from "@/lib/learner-auth";
import { useCmsSection } from "@/lib/admin/cms-store";
import {
  EBOOKS_KEY,
  EBOOKS_DEFAULT,
  resolvePublicEbooks,
  type EbooksStore,
} from "@/lib/admin/ebooks-store";

export const Route = createFileRoute("/ebooks")({
  head: () => ({
    meta: [
      { title: "IELTS E-Book Library — BigIELTS" },
      {
        name: "description",
        content:
          "Read IELTS e-books in a beautiful Kindle-style reader. Writing frameworks, speaking cue cards, vocabulary and grammar — by our qualified IELTS team.",
      },
      { property: "og:title", content: "IELTS E-Book Library — BigIELTS" },
      {
        property: "og:description",
        content:
          "A bookshelf of IELTS e-books — written by our qualified IELTS team, read in a beautiful in-browser reader.",
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

// Per-category abstract SVG motif painted into the cover
function CoverMotif({ category }: { category: EbookCategory }) {
  const common = "absolute inset-0 h-full w-full";
  switch (category) {
    case "Writing":
      return (
        <svg className={common} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              x2="200"
              y1={40 + i * 18}
              y2={40 + i * 18}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
            />
          ))}
        </svg>
      );
    case "Speaking":
      return (
        <svg className={common} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 22 }).map((_, i) => {
            const h = 6 + Math.abs(Math.sin(i * 1.3)) * 60;
            return (
              <rect
                key={i}
                x={10 + i * 8}
                y={150 - h / 2}
                width="3"
                height={h}
                rx="1.5"
                fill="rgba(255,255,255,0.18)"
              />
            );
          })}
        </svg>
      );
    case "Reading":
      return (
        <svg className={common} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx={100}
              cy={150}
              r={20 + i * 18}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}
        </svg>
      );
    case "Listening":
      return (
        <svg className={common} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden>
          {[40, 70, 100, 130, 160].map((r, i) => (
            <path
              key={i}
              d={`M 30 ${260 - r * 0.6} Q 100 ${200 - r * 0.9} 170 ${260 - r * 0.6}`}
              fill="none"
              stroke="rgba(255,255,255,0.13)"
              strokeWidth="1.2"
            />
          ))}
        </svg>
      );
    case "Vocabulary":
      return (
        <svg className={common} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 70 }).map((_, i) => {
            const x = (i * 37) % 200;
            const y = (i * 53) % 300;
            return <circle key={i} cx={x} cy={y} r="1.2" fill="rgba(255,255,255,0.22)" />;
          })}
        </svg>
      );
    case "Grammar":
      return (
        <svg className={common} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) =>
            Array.from({ length: 7 }).map((__, j) => (
              <rect
                key={`${i}-${j}`}
                x={j * 30}
                y={i * 30}
                width="30"
                height="30"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
              />
            )),
          )}
        </svg>
      );
    default:
      return null;
  }
}

function EbooksPage() {
  const [category, setCategory] = useState<"All" | EbookCategory>("All");
  const store = useCmsSection<EbooksStore>(EBOOKS_KEY, EBOOKS_DEFAULT);
  const ebooks = useMemo(() => resolvePublicEbooks(store), [store]);
  const filtered = useMemo(
    () => (category === "All" ? ebooks : ebooks.filter((b) => b.category === category)),
    [category, ebooks],
  );
  const matches = useMatches();
  const hasChildMatch = matches.some(
    (m) => m.routeId !== "/ebooks" && m.routeId.startsWith("/ebooks/"),
  );

  const { user } = useLearnerSession();
  const userId = user?.id ?? null;
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next: Record<string, number> = {};
    for (const book of ebooks) {
      const st = getReaderState(userId, book.id);
      if (st.currentPage > 0) {
        const total = Math.max(book.pageCount, 1);
        next[book.id] = Math.min(1, (st.currentPage + 1) / total);
      }
    }
    setProgressMap(next);
  }, [userId, ebooks]);

  if (hasChildMatch) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#BFA470", color: "oklch(0.24 0.05 70)", ["--foreground" as any]: "oklch(0.22 0.06 70)", ["--muted-foreground" as any]: "oklch(0.36 0.05 70)" }}>
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

        {/* Premium magazine grid */}
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((book) => {
            const progress = progressMap[book.id];
            const firstLine = book.description.split(/(?<=[.!?])\s/)[0];
            return (
              <Link
                key={book.id}
                to="/ebooks/$bookId"
                params={{ bookId: book.id }}
                className="group block"
              >
                {/* Cover stage with perspective for the open-peek */}
                <div
                  className="relative aspect-[2/3] w-full"
                  style={{ perspective: "1400px" }}
                >
                  {/* Back paper — what gets revealed */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm shadow-[0_18px_36px_-14px_oklch(0.2_0.05_260/0.45)]"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.985 0.005 80), oklch(0.96 0.01 80))",
                    }}
                  >
                    {/* faint ruled lines */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, transparent 0 22px, oklch(0.85 0.02 260 / 0.35) 22px 23px)",
                      }}
                    />
                    <div className="relative flex h-full flex-col justify-between p-5">
                      <div>
                        <div
                          className="text-[9px] font-black uppercase tracking-[0.25em]"
                          style={{ color: "oklch(0.45 0.17 30)" }}
                        >
                          From the book
                        </div>
                        <p
                          className="mt-3 text-[12px] leading-snug line-clamp-6"
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            color: "oklch(0.28 0.02 260)",
                          }}
                        >
                          “{firstLine}”
                        </p>
                      </div>
                      <div
                        className="self-end text-[10px] font-bold uppercase tracking-[0.22em]"
                        style={{ color: "oklch(0.45 0.05 260)" }}
                      >
                        Read →
                      </div>
                    </div>
                  </div>

                  {/* Front cover — opens to the left on hover */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm shadow-[0_14px_36px_-12px_oklch(0.2_0.05_260/0.5)] transition-transform duration-[650ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:[transform:rotateY(-32deg)] group-hover:shadow-[0_28px_60px_-12px_oklch(0.2_0.05_260/0.55)]"
                    style={{
                      background: book.coverGradient,
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {book.coverImageDataUrl ? (
                      <img
                        src={book.coverImageDataUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <CoverMotif category={book.category} />
                    )}

                    {/* spine shadow */}
                    <div
                      className="absolute inset-y-0 left-0 w-[8px]"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(0,0,0,0.45), rgba(0,0,0,0.05) 70%, transparent)",
                      }}
                    />
                    {/* gloss */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(118deg, rgba(255,255,255,0.22) 0%, transparent 32%, transparent 68%, rgba(0,0,0,0.22) 100%)",
                      }}
                    />
                    {/* edge of pages on right */}
                    <div
                      className="absolute inset-y-2 right-0 w-[3px] rounded-r-sm"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.15))",
                      }}
                    />

                    {/* content */}
                    <div className="relative flex h-full flex-col justify-between p-5 text-white">
                      <div className="flex items-start justify-between">
                        <span
                          className="inline-block rounded-sm px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]"
                          style={{
                            background: book.coverAccent,
                            color: "oklch(0.20 0.05 260)",
                          }}
                        >
                          {book.category}
                        </span>
                        <span
                          className="text-[9px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                          {book.band}
                        </span>
                      </div>

                      <div>
                        <div
                          className="h-px w-10"
                          style={{ background: "rgba(255,255,255,0.55)" }}
                        />
                        <h3
                          className="mt-3 font-display text-lg font-black leading-[1.05] sm:text-xl"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {book.title}
                        </h3>
                        <p
                          className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em]"
                          style={{ color: "rgba(255,255,255,0.78)" }}
                        >
                          {book.author.split(",")[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Below cover — title + author only, plus progress if started */}
                <div className="mt-4 w-full">
                  <h4 className="text-[15px] font-bold leading-tight text-foreground line-clamp-2">
                    {book.title}
                  </h4>
                  <p className="mt-1 text-xs font-semibold text-foreground/55">
                    {book.author.split(",")[0]}
                  </p>
                  {progress !== undefined && (
                    <div className="mt-3">
                      <div
                        className="h-1 w-full overflow-hidden rounded-full"
                        style={{ background: "oklch(0.94 0.01 260)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.round(progress * 100)}%`,
                            background:
                              "linear-gradient(to right, oklch(0.55 0.18 30), oklch(0.65 0.17 40))",
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/50">
                        {Math.round(progress * 100)}% read
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
