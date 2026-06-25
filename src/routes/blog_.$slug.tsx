import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { POSTS, paletteFor } from "@/data/posts";

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    return {
      meta: post
        ? [
            { title: `${post.title} — IELTS blog` },
            { name: "description", content: post.excerpt },
            { property: "og:title", content: post.title },
            { property: "og:description", content: post.excerpt },
            { property: "og:image", content: post.image },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:image", content: post.image },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen bg-white px-5 py-24 text-center" style={{ fontFamily: INTER }}>
      <h1 className="text-3xl" style={{ color: "#1e1b4b", fontWeight: 800 }}>
        Article not found
      </h1>
      <Link to="/blog" className="mt-4 inline-block text-sm underline" style={{ color: "#6d28d9" }}>
        Back to the blog
      </Link>
    </main>
  ),
  errorComponent: ({ error, reset }) => (
    <main className="min-h-screen bg-white px-5 py-24 text-center" style={{ fontFamily: INTER }}>
      <h1 className="text-3xl" style={{ color: "#1e1b4b", fontWeight: 800 }}>
        Something went wrong
      </h1>
      <p className="mt-2 text-sm" style={{ color: "#64748b" }}>{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full px-5 py-2 text-sm"
        style={{ background: "#1e1b4b", color: "#fff", fontWeight: 700 }}
      >
        Try again
      </button>
    </main>
  ),
  component: PostPage,
});

const INTER = "Inter, ui-sans-serif, system-ui, sans-serif";

function PostPage() {
  const { post } = Route.useLoaderData();
  const p = paletteFor(post.slug);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const related = POSTS.filter((x) => x.slug !== post.slug).slice(0, 3);

  const idx = POSTS.findIndex((x) => x.slug === post.slug);
  const prevPost = idx > 0 ? POSTS[idx - 1] : null;
  const nextPost = idx >= 0 && idx < POSTS.length - 1 ? POSTS[idx + 1] : null;

  const REACTIONS = [
    { key: "clap", emoji: "👏", label: "Clap" },
    { key: "idea", emoji: "💡", label: "Insightful" },
    { key: "fire", emoji: "🔥", label: "Love it" },
  ] as const;
  const reactionsKey = `blog:reactions:${post.slug}`;
  const myReactionsKey = `blog:my-reactions:${post.slug}`;
  const commentsKey = `blog:comments:${post.slug}`;

  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    clap: 0,
    idea: 0,
    fire: 0,
  });
  const [myReactions, setMyReactions] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<{ name: string; text: string; at: number }[]>([]);
  const [cName, setCName] = useState("");
  const [cText, setCText] = useState("");

  useEffect(() => {
    try {
      const r = localStorage.getItem(reactionsKey);
      if (r) setReactionCounts({ clap: 0, idea: 0, fire: 0, ...JSON.parse(r) });
      const mr = localStorage.getItem(myReactionsKey);
      if (mr) setMyReactions(JSON.parse(mr));
      const c = localStorage.getItem(commentsKey);
      if (c) setComments(JSON.parse(c));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.slug]);

  const toggleReaction = (key: string) => {
    setMyReactions((prev) => {
      const mine = !prev[key];
      const next = { ...prev, [key]: mine };
      setReactionCounts((counts) => {
        const updated = { ...counts, [key]: Math.max(0, (counts[key] || 0) + (mine ? 1 : -1)) };
        try {
          localStorage.setItem(reactionsKey, JSON.stringify(updated));
        } catch {
          /* ignore */
        }
        return updated;
      });
      try {
        localStorage.setItem(myReactionsKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const addComment = () => {
    const name = cName.trim() || "Guest";
    const text = cText.trim();
    if (!text) return;
    const next = [{ name, text, at: Date.now() }, ...comments];
    setComments(next);
    setCText("");
    try {
      localStorage.setItem(commentsKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const shareTo = (network: "whatsapp" | "telegram" | "x" | "facebook" | "linkedin" | "email") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(post.title);
    const map: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
      telegram: `https://t.me/share/url?url=${u}&text=${t}`,
      x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      email: `mailto:?subject=${t}&body=${u}`,
    };
    window.open(map[network], "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.excerpt, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: INTER }}>
      {/* Reading progress bar */}
      <div className="fixed left-0 right-0 top-0 z-40 h-1" style={{ background: "#f1f5f9" }}>
        <div
          className="h-full transition-[width] duration-150"
          style={{ width: `${progress}%`, background: p.heart }}
        />
      </div>

      {/* Floating save & share */}
      <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full px-2 py-2 sm:left-6 sm:top-1/2 sm:bottom-auto sm:-translate-x-0 sm:-translate-y-1/2 sm:flex-col sm:px-2 sm:py-3"
        style={{
          background: "#ffffff",
          boxShadow: "0 14px 34px -16px rgba(15,23,42,0.20), 0 4px 12px -6px rgba(15,23,42,0.10)",
        }}
      >
        <button
          type="button"
          aria-label={saved ? "Unsave" : "Save"}
          onClick={() => setSaved((s) => !s)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90"
          style={{ background: saved ? p.chipBg : "transparent" }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? p.heart : "none"} stroke={p.heart} strokeWidth="2">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.727 4 2.015 .954-1.288 2.443-2.015 4-2.015 2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Share"
          onClick={share}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={p.heart} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
        </button>
        {copied && (
          <span className="hidden text-[10px] sm:block" style={{ color: p.chipText, fontWeight: 600 }}>
            Copied
          </span>
        )}
      </div>

      {/* Full-bleed cover with floating back button */}
      <figure className="relative w-full" style={{ background: p.imgBg }}>
        <img
          src={post.image}
          alt=""
          className="h-[44vh] max-h-[560px] min-h-[280px] w-full object-cover sm:h-[56vh]"
        />
        <Link
          to="/blog"
          aria-label="Back to blog"
          className="absolute left-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 sm:left-6 sm:top-6 sm:h-12 sm:w-12"
          style={{
            background: p.heart,
            color: "#ffffff",
            boxShadow: `0 10px 24px -10px ${p.shadow}, 0 4px 10px -4px rgba(15,23,42,0.18)`,
          }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
      </figure>

      {/* Article header — edge-to-edge wide title */}
      <article className="mx-auto max-w-5xl px-5 pt-10 sm:pt-14">
        <div className="flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-[3px] w-8 rounded-full" style={{ background: p.heart }} />
          <span
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{ color: p.chipText, fontWeight: 800 }}
          >
            {post.category}
          </span>
        </div>

        <h1
          className="mt-5 text-center text-[36px] leading-[1.04] tracking-[-0.025em] sm:text-[64px] sm:leading-[1.02] lg:text-[72px]"
          style={{ color: "#93C5FD", fontWeight: 900, textWrap: "balance" } as React.CSSProperties}
        >
          {post.title}
        </h1>

        <p className="mx-auto mt-6 max-w-[680px] text-center text-lg leading-relaxed" style={{ color: "#475569", fontWeight: 400 }}>
          {post.excerpt}
        </p>


        {/* Author card — clean white, blue accents */}
        <div
          className="mt-10 flex items-center gap-4 rounded-2xl border bg-white p-4 sm:p-5"
          style={{
            borderColor: "#eef2ff",
            boxShadow: "0 12px 32px -18px rgba(30,27,75,0.20), 0 2px 6px -3px rgba(15,23,42,0.05)",
          }}
        >
          <div
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm sm:h-14 sm:w-14 sm:text-base"
            style={{
              background: "linear-gradient(135deg, #1e1b4b, #3b82f6)",
              color: "#ffffff",
              fontWeight: 800,
              boxShadow: "0 8px 18px -6px rgba(59,130,246,0.55)",
            }}
            aria-hidden="true"
          >
            {post.author
              .split(" ")
              .map((s: string) => s[0])
              .slice(0, 2)
              .join("")}
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white"
              style={{ background: "#3b82f6" }}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[14px] sm:text-[15px]" style={{ color: "#1e1b4b", fontWeight: 800 }}>
                {post.author}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]"
                style={{ background: "#eef2ff", color: "#3730a3", fontWeight: 700 }}
              >
                IELTS specialists
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#94a3b8", fontWeight: 500 }}>
              <span>{post.readMin} min read</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full" style={{ background: "#cbd5e1" }} />
              <span>Updated recently</span>
            </span>
          </div>
        </div>
      </article>


      {/* Body with mid-article pull-quote */}
      <article className="mx-auto max-w-[680px] px-5 pt-12 pb-20">
        <div className="flex flex-col gap-6">
          {post.body.map((para: string, i: number) => {
            const mid = Math.floor(post.body.length / 2);
            const showQuote = post.body.length >= 4 && i === mid;
            const quoteText = post.body[0].split(". ").slice(0, 1).join(". ") + ".";
            return (
              <div key={i} className="contents">
                {showQuote && (
                  <figure className="my-4 sm:my-6">
                    <blockquote
                      className="relative rounded-2xl px-6 py-7 text-[20px] leading-[1.45] tracking-[-0.01em] sm:px-8 sm:py-9 sm:text-[24px]"
                      style={{
                        background: p.cardBg,
                        color: p.title,
                        fontWeight: 700,
                        borderLeft: `4px solid ${p.heart}`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-3 left-5 text-5xl leading-none sm:left-7 sm:text-6xl"
                        style={{ color: p.heart, fontWeight: 900 }}
                      >
                        “
                      </span>
                      {quoteText}
                    </blockquote>
                  </figure>
                )}
                <p
                  className="text-[17px] leading-[1.75]"
                  style={{ color: "#1f2937" }}
                >
                  {para}
                </p>
              </div>
            );
          })}
        </div>
      </article>

      {/* Related posts */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <h2
          className="mb-8 text-center text-2xl tracking-tight sm:text-3xl"
          style={{ color: "#1e1b4b", fontWeight: 800 }}
        >
          Keep reading
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {related.map((r) => {
            const rp = paletteFor(r.slug);
            return (
              <li key={r.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group flex h-full flex-col gap-3 rounded-2xl p-2 transition-all duration-300"
                  style={{
                    background: rp.cardBg,
                    boxShadow: `0 12px 28px -14px ${rp.shadow}, 0 4px 10px -6px rgba(15,23,42,0.08)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="aspect-[5/4] w-full overflow-hidden rounded-xl" style={{ background: rp.imgBg }}>
                    <img
                      src={r.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="px-1 pb-1">
                    <span
                      className="mb-2 inline-block rounded-md px-2 py-0.5 text-[10px]"
                      style={{ background: rp.chipBg, color: rp.chipText, fontWeight: 700 }}
                    >
                      {r.category}
                    </span>
                    <h3 className="text-sm leading-tight sm:text-[15px]" style={{ color: rp.title, fontWeight: 700 }}>
                      {r.title}
                    </h3>
                    <p className="mt-2 text-[11px]" style={{ color: "#94a3b8", fontWeight: 500 }}>
                      {r.readMin} min read · by {r.author}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
