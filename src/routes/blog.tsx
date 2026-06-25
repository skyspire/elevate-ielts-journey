import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { POSTS, PALETTES } from "@/data/posts";

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

const INTER = "Inter, ui-sans-serif, system-ui, sans-serif";

const CATEGORIES = ["All", ...Array.from(new Set(POSTS.map((p) => p.category)))];


function BlogPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");

  const rest = POSTS;


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

      {/* Combined search + category dropdown */}
      <section className="mx-auto max-w-3xl px-5">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-stretch overflow-hidden rounded-full"
          style={{
            background: "#ffffff",
            boxShadow: "0 14px 34px -16px rgba(124,58,237,0.25), 0 4px 12px -6px rgba(15,23,42,0.08)",
          }}
        >
          {/* Category select */}
          <div
            className="relative flex items-center"
            style={{ background: "#f5f3ff" }}
          >
            <select
              value={activeCat}
              onChange={(e) => setActiveCat(e.target.value)}
              className="h-full cursor-pointer appearance-none bg-transparent py-3 pl-5 pr-9 text-sm outline-none"
              style={{ color: "#6d28d9", fontWeight: 700 }}
              aria-label="Filter by category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ color: "#1e1b4b" }}>
                  {cat}
                  {cat !== "All" ? ` (${POSTS.filter((x) => x.category === cat).length})` : ""}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6d28d9"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-3 h-4 w-4"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* Divider */}
          <div className="w-px" style={{ background: "#ede9fe" }} />

          {/* Search */}
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles"
              className="h-full w-full bg-transparent py-3 pl-11 pr-5 text-sm outline-none"
              style={{ color: "#1e1b4b" }}
            />
          </div>
        </form>
      </section>





      {/* Pastel post cards */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl tracking-tight sm:text-3xl" style={{ color: "#1e1b4b", fontWeight: 800 }}>
            Latest articles
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: "#64748b" }}>
            Fresh strategies and study notes from our IELTS team.
          </p>
        </div>


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
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
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
          <p className="text-sm tracking-tight" style={{ color: "#7c3aed", fontWeight: 600 }}>
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
