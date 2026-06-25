import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — IELTS tips, strategies & study guides" },
      {
        name: "description",
        content:
          "Practical IELTS articles from our team — band-by-band strategies, vocabulary, writing models and study habits.",
      },
      { property: "og:title", content: "Blog — IELTS tips, strategies & study guides" },
      {
        property: "og:description",
        content:
          "Practical IELTS articles from our team — band-by-band strategies, vocabulary, writing models and study habits.",
      },
    ],
  }),
  component: BlogPage,
});

type Post = {
  slug: string;
  title: string;
  category: string;
  image: string;
  readMin: number;
  author: string;
};

const POSTS: Post[] = [
  { slug: "writing-task-2-band-8-structure", title: "The Band 8 Writing Task 2 structure that actually works", category: "Writing", readMin: 6, author: "IELTS team", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=70" },
  { slug: "speaking-part-2-fluency-fix", title: "How to stop freezing in Speaking Part 2", category: "Speaking", readMin: 5, author: "IELTS team", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=70" },
  { slug: "reading-true-false-not-given", title: "True / False / Not Given — a decision tree that never fails", category: "Reading", readMin: 7, author: "IELTS team", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=70" },
  { slug: "listening-map-labelling", title: "Map labelling questions: a 4-step reading order", category: "Listening", readMin: 4, author: "IELTS team", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=70" },
  { slug: "vocabulary-c1-academic", title: "30 C1 academic collocations that examiners notice", category: "Vocabulary", readMin: 8, author: "IELTS team", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=70" },
  { slug: "study-plan-30-days", title: "A realistic 30-day IELTS study plan for working adults", category: "Study habits", readMin: 9, author: "IELTS team", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=70" },
  { slug: "writing-task-1-overview", title: "Writing Task 1: the overview sentence that boosts your band", category: "Writing", readMin: 5, author: "IELTS team", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=70" },
  { slug: "speaking-pronunciation-stress", title: "Word stress: the smallest fix with the biggest payoff", category: "Speaking", readMin: 4, author: "IELTS team", image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=900&q=70" },
  { slug: "exam-day-checklist", title: "The exam-day checklist that calms your nerves", category: "Exam day", readMin: 3, author: "IELTS team", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=70" },
];

type Palette = {
  cardBg: string;
  shadow: string;
  imgBg: string;
  chipBg: string;
  chipText: string;
  title: string;
  heart: string;
};

const PALETTES: Palette[] = [
  { cardBg: "#f5f3ff", shadow: "#e9d5ff", imgBg: "#ddd6fe", chipBg: "#ede9fe", chipText: "#6d28d9", title: "#3b0764", heart: "#7c3aed" },
  { cardBg: "#fff1f2", shadow: "#fecdd3", imgBg: "#fecdd3", chipBg: "#ffe4e6", chipText: "#be123c", title: "#4c0519", heart: "#e11d48" },
  { cardBg: "#ecfdf5", shadow: "#a7f3d0", imgBg: "#a7f3d0", chipBg: "#d1fae5", chipText: "#047857", title: "#022c22", heart: "#059669" },
  { cardBg: "#fefce8", shadow: "#fde68a", imgBg: "#fde68a", chipBg: "#fef3c7", chipText: "#a16207", title: "#422006", heart: "#ca8a04" },
  { cardBg: "#f0f9ff", shadow: "#bae6fd", imgBg: "#bae6fd", chipBg: "#e0f2fe", chipText: "#0369a1", title: "#0c2340", heart: "#0284c7" },
  { cardBg: "#fff7ed", shadow: "#fed7aa", imgBg: "#fed7aa", chipBg: "#ffedd5", chipText: "#c2410c", title: "#431407", heart: "#ea580c" },
];

const INTER = "Inter, ui-sans-serif, system-ui, sans-serif";

const CATEGORIES = ["All", ...Array.from(new Set(POSTS.map((p) => p.category)))];

function BlogPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");

  const featured = POSTS[0];
  const rest = POSTS.slice(1);

  const featured = POSTS[0];
  const rest = POSTS.slice(1);
  void featured;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rest.filter((p) => {
      const matchCat = activeCat === "All" || p.category === activeCat;
      const matchQ = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [rest, activeCat, query]);

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: INTER }}>
      {/* Header */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 text-center sm:pt-24 sm:pb-12">
        <p className="text-sm tracking-tight" style={{ color: "#94a3b8", fontWeight: 600 }}>
          The Journal
        </p>
        <h1 className="mt-4 text-5xl leading-[1.02] tracking-tight sm:text-6xl" style={{ color: "#1e1b4b", fontWeight: 800 }}>
          Blog
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "#64748b" }}>
          Field notes from our IELTS team — strategies, sample answers, and the tiny habits that move bands.
        </p>
      </section>

      {/* Big pastel category tiles — hero */}
      <section className="mx-auto max-w-6xl px-5">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl tracking-tight sm:text-3xl" style={{ color: "#1e1b4b", fontWeight: 800 }}>
            Browse by category
          </h2>
          {activeCat !== "All" && (
            <button
              type="button"
              onClick={() => setActiveCat("All")}
              className="text-xs underline"
              style={{ color: "#6d28d9", fontWeight: 600 }}
            >
              Clear filter
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const p = PALETTES[i % PALETTES.length];
            const active = activeCat === cat;
            const count = cat === "All" ? POSTS.length : POSTS.filter((x) => x.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all"
                style={{
                  background: p.cardBg,
                  boxShadow: active
                    ? `0 0 0 3px ${p.heart}, 0 20px 40px -16px ${p.shadow}`
                    : `0 12px 28px -14px ${p.shadow}, 0 4px 10px -6px rgba(15,23,42,0.08)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-60"
                  style={{ background: p.imgBg }}
                />
                <div className="relative">
                  <h3 className="text-lg leading-tight sm:text-xl" style={{ color: p.title, fontWeight: 800 }}>
                    {cat}
                  </h3>
                  <p className="mt-1.5 text-xs" style={{ color: p.chipText, fontWeight: 600 }}>
                    {count} {count === 1 ? "article" : "articles"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Full-width pastel search band */}
      <section className="mt-16">
        <div
          className="px-5 py-12 sm:py-16"
          style={{
            background: "linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 50%, #ecfdf5 100%)",
          }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm tracking-tight" style={{ color: "#7c3aed", fontWeight: 600 }}>
              Find your next read
            </p>
            <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl" style={{ color: "#1e1b4b", fontWeight: 800 }}>
              Search every IELTS article
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="relative mx-auto mt-6 max-w-2xl">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try ‘Task 2 structure’ or ‘Speaking Part 2’…"
                className="w-full rounded-full py-4 pl-14 pr-6 text-base outline-none transition-all focus:ring-4"
                style={{
                  background: "#ffffff",
                  color: "#1e1b4b",
                  boxShadow: "0 12px 30px -12px rgba(124,58,237,0.30), 0 4px 10px -6px rgba(15,23,42,0.08)",
                }}
              />
            </form>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["Task 2", "Speaking Part 2", "True/False/Not Given", "Vocabulary"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="rounded-full bg-white/80 px-3 py-1 text-xs backdrop-blur-md transition-transform hover:scale-105"
                  style={{ color: "#6d28d9", fontWeight: 600 }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>




      {/* Pastel post cards */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: "#94a3b8" }}>
            No articles match your search.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {filtered.map((post, i) => {
              const p = PALETTES[(i + 1) % PALETTES.length];
              return (
                <li key={post.slug}>
                  <Link
                    to="/blog"
                    className="group flex h-full flex-col gap-3 rounded-2xl p-2 transition-all duration-300"
                    style={{
                      background: p.cardBg,
                      boxShadow: `0 12px 28px -14px ${p.shadow}, 0 4px 10px -6px rgba(15,23,42,0.08)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = `0 20px 40px -16px ${p.shadow}, 0 8px 18px -8px rgba(15,23,42,0.12)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = `0 12px 28px -14px ${p.shadow}, 0 4px 10px -6px rgba(15,23,42,0.08)`;
                    }}
                  >
                    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xl" style={{ background: p.imgBg }}>
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      />
                      <button
                        type="button"
                        aria-label="Save"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90"
                        style={{ background: "rgba(255,255,255,0.85)" }}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={p.heart}>
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.727 4 2.015 .954-1.288 2.443-2.015 4-2.015 2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" />
                        </svg>
                      </button>
                    </div>

                    <div className="px-1 pb-1">
                      <span
                        className="mb-2 inline-block rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider"
                        style={{ background: p.chipBg, color: p.chipText, fontWeight: 700 }}
                      >
                        {post.category}
                      </span>
                      <h2 className="text-sm leading-tight sm:text-[15px]" style={{ color: p.title, fontWeight: 700 }}>
                        {post.title}
                      </h2>
                      <p className="mt-2 text-[11px]" style={{ color: "#94a3b8", fontWeight: 500 }}>
                        {post.readMin} min read · by {post.author}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Newsletter band */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div
          className="overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16"
          style={{
            background: "linear-gradient(135deg, #f5f3ff 0%, #fff1f2 50%, #fff7ed 100%)",
            boxShadow: "0 20px 50px -20px rgba(124,58,237,0.25), 0 8px 20px -10px rgba(15,23,42,0.08)",
          }}
        >
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "#7c3aed", fontWeight: 700 }}>
            Stay sharp
          </p>
          <h3 className="mx-auto mt-3 max-w-xl text-3xl leading-tight tracking-tight sm:text-4xl" style={{ color: "#1e1b4b", fontWeight: 800 }}>
            New IELTS strategies in your inbox, weekly.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "#64748b" }}>
            One short, practical email every Sunday. No spam, unsubscribe anytime.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 rounded-full px-5 py-3 text-sm outline-none focus:ring-2"
              style={{ background: "#ffffff", color: "#1e1b4b", boxShadow: "inset 0 0 0 1px #e2e8f0" }}
            />
            <button
              type="submit"
              className="rounded-full px-6 py-3 text-sm transition-transform active:scale-95"
              style={{ background: "#1e1b4b", color: "#ffffff", fontWeight: 700 }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
