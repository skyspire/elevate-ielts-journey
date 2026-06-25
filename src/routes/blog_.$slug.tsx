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

      {/* Full-bleed cover */}
      <figure className="relative w-full" style={{ background: p.imgBg }}>
        <img
          src={post.image}
          alt=""
          className="h-[44vh] max-h-[560px] min-h-[280px] w-full object-cover sm:h-[56vh]"
        />
      </figure>

      {/* Article header */}
      <article className="mx-auto max-w-[680px] px-5 pt-10 sm:pt-14">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: "#64748b", fontWeight: 600 }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to blog
        </Link>

        <span
          className="mt-8 inline-block rounded-full px-3 py-1 text-[11px] tracking-wide"
          style={{ background: p.chipBg, color: p.chipText, fontWeight: 700 }}
        >
          {post.category}
        </span>

        <h1
          className="mt-4 text-4xl leading-[1.08] tracking-tight sm:text-5xl"
          style={{ color: "#1e1b4b", fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          {post.title}
        </h1>

        <p className="mt-5 text-lg leading-relaxed" style={{ color: "#475569" }}>
          {post.excerpt}
        </p>

        {/* Author meta row */}
        <div className="mt-8 flex items-center gap-3 border-t pt-6" style={{ borderColor: "#f1f5f9" }}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm"
            style={{ background: p.imgBg, color: p.title, fontWeight: 800 }}
            aria-hidden="true"
          >
            {post.author
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px]" style={{ color: "#1e1b4b", fontWeight: 700 }}>
              {post.author}
            </span>
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "#94a3b8", fontWeight: 500 }}>
              <span>{post.readMin} min read</span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full" style={{ background: "#cbd5e1" }} />
              <span>IELTS specialists</span>
            </span>
          </div>
        </div>
      </article>


      {/* Body */}
      <article className="mx-auto max-w-[680px] px-5 pt-12 pb-20">
        <div className="flex flex-col gap-6">
          {post.body.map((para: string, i: number) => (
            <p
              key={i}
              className="text-[17px] leading-[1.75]"
              style={{ color: "#1f2937" }}
            >
              {para}
            </p>
          ))}
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
                  to="/blog_/$slug"
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
