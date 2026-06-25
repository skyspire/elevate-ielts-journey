import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Flame,
  HandHeart,
  Send,
  MessageCircle,
  Link2,
  Check,
  Mail,
  Linkedin,
  Facebook,
  Twitter,
  ArrowLeft,
  ArrowRight,
  MessagesSquare,
} from "lucide-react";
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
    { key: "love", label: "Love" },
    { key: "like", label: "Like" },
    { key: "smile", label: "Smile" },
  ] as const;
  const reactionPath: Record<string, string> = {
    love: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    like: "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z",
    smile: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5s.67 1.5 1.5 1.5zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z",
  };
  const SHARE_TARGETS: { key: "whatsapp" | "telegram" | "x" | "facebook" | "linkedin" | "email"; label: string; path: string; iconClass?: string }[] = [
    { key: "whatsapp", label: "WhatsApp", path: "M17.472 14.382c-.301-.15-1.767-.872-2.04-.971-.272-.1-.47-.15-.67.15-.198.3-.77.971-.944 1.17-.173.199-.347.225-.648.075-.301-.15-1.27-.467-2.42-1.496-.893-.795-1.495-1.777-1.67-2.077-.173-.3-.018-.462.13-.61.135-.133.301-.35.452-.524.15-.174.2-.291.3-.485.1-.197.05-.37-.024-.524-.075-.15-.67-1.611-.92-2.215-.242-.584-.487-.506-.67-.516-.174-.008-.37-.01-.568-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.767-.721 2.016-1.415.249-.694.249-1.289.173-1.415-.075-.124-.272-.198-.57-.348h-.002zM12.22 20.252h-.007c-1.48 0-2.93-.399-4.194-1.154l-.301-.18-3.116.817.833-3.04-.197-.314c-.83-1.321-1.27-2.853-1.27-4.425 0-4.551 3.704-8.255 8.259-8.255 2.204 0 4.276.86 5.833 2.418 1.557 1.558 2.415 3.63 2.413 5.834 0 4.552-3.707 8.255-8.255 8.255zM12 2a9.995 9.995 0 00-10 10c0 1.75.45 3.45 1.31 4.96L2 22l5.16-1.35C8.61 21.51 10.29 22 12 22c5.51 0 10-4.49 10-10S17.51 2 12 2z" },
    { key: "telegram", label: "Telegram", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.96-.75 3.78-1.65 6.31-2.73 7.57-3.24 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.12.17.29.18.41.01.07.02.24.01.29z" },
    { key: "x", label: "X / Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", iconClass: "h-6 w-6" },
    { key: "facebook", label: "Facebook", path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" },
    { key: "linkedin", label: "LinkedIn", path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a2.7 2.7 0 0 0-2.7-2.7c-1.2 0-2 .7-2.3 1.2v-1h-3.1v10.1h3.1v-5.1c0-.8.4-1.2 1-1.2.7 0 1 .4 1 1.2v5.1h3.1M6.7 8.1c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8-1.8.8-1.8 1.8.8 1.8 1.8 1.8m1.5 10.4V8.5H5.2v10.1h3z" },
    { key: "email", label: "Email", path: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" },
  ];
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

      {/* Share — centered tiles + copy link */}
      <section className="mx-auto max-w-[680px] px-5 pb-14">
        <div className="flex flex-col items-center gap-8">
          <div className="grid grid-cols-3 gap-3">
            {SHARE_TARGETS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => shareTo(s.key)}
                aria-label={`Share on ${s.label}`}
                title={s.label}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-xl text-white transition-transform hover:scale-105 active:scale-95"
                style={{ background: "#000000" }}
              >
                <svg viewBox="0 0 24 24" className={s.iconClass || "h-7 w-7"} fill="currentColor">
                  <path d={s.path} />
                </svg>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] transition-colors"
            style={{
              color: copied ? "#047857" : "#475569",
              fontFamily: INTER,
              fontWeight: 700,
            }}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </section>

      {/* Floating reactions FAB — bottom right, opens popover upward */}
      <FloatingReactions
        reactions={REACTIONS}
        reactionPath={reactionPath}
        counts={reactionCounts}
        mine={myReactions}
        onToggle={toggleReaction}
      />




      {/* Previous / Next article */}
      {(prevPost || nextPost) && (
        <nav aria-label="More articles" className="mx-auto max-w-5xl px-5 pb-16">
          <div className="grid gap-4 sm:grid-cols-2">
            {prevPost ? (
              <Link
                to="/blog/$slug"
                params={{ slug: prevPost.slug }}
                className="group flex items-center gap-4 rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: "#E0E7FF",
                  boxShadow: "0 12px 28px -18px rgba(30,27,75,0.18)",
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform group-hover:-translate-x-0.5"
                  style={{ background: "#EEF2FF", color: "#3730a3" }}
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className="text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: "#3730a3", fontWeight: 800 }}
                  >
                    Previous
                  </span>
                  <p
                    className="mt-1 truncate text-[15px] leading-snug"
                    style={{ color: "#1e1b4b", fontWeight: 800 }}
                  >
                    {prevPost.title}
                  </p>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {nextPost ? (
              <Link
                to="/blog/$slug"
                params={{ slug: nextPost.slug }}
                className="group flex items-center gap-4 rounded-2xl border bg-white p-5 text-right transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: "#E0E7FF",
                  boxShadow: "0 12px 28px -18px rgba(30,27,75,0.18)",
                }}
              >
                <div className="min-w-0 flex-1">
                  <span
                    className="text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: "#3730a3", fontWeight: 800 }}
                  >
                    Next
                  </span>
                  <p
                    className="mt-1 truncate text-[15px] leading-snug"
                    style={{ color: "#1e1b4b", fontWeight: 800 }}
                  >
                    {nextPost.title}
                  </p>
                </div>
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5"
                  style={{ background: "#EEF2FF", color: "#3730a3" }}
                >
                  <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
                </div>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </nav>
      )}


      {/* Related posts */}
      <section className="mx-auto max-w-6xl px-5 pb-16">
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

      {/* Comments — grey band, full-bleed */}
      <section
        aria-label="Discussion"
        className="relative w-full px-5 py-20"
        style={{
          background: "linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)",
          fontFamily: INTER,
        }}
      >
        <div className="relative mx-auto max-w-[720px]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "#ffffff",
                color: "#1f2937",
                boxShadow: "0 8px 20px -10px rgba(15,23,42,0.18)",
              }}
            >
              <MessagesSquare className="h-6 w-6" strokeWidth={2.2} />
            </div>
            <h2
              className="text-2xl tracking-tight sm:text-3xl"
              style={{ color: "#111827", fontWeight: 700 }}
            >
              Join the discussion
            </h2>
            <p className="mt-2 text-[14px]" style={{ color: "#4B5563", fontWeight: 700 }}>
              {comments.length === 0
                ? "Be the first to share a thought."
                : `${comments.length} ${comments.length === 1 ? "comment" : "comments"} so far`}
            </p>
          </div>

          <div
            className="rounded-3xl border bg-white p-5 sm:p-6"
            style={{
              borderColor: "#E5E7EB",
              boxShadow: "0 20px 40px -28px rgba(15,23,42,0.18)",
            }}
          >
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full rounded-xl border bg-white px-4 py-3 text-[14px] outline-none transition-colors focus:border-gray-500"
                style={{ borderColor: "#E5E7EB", color: "#0f172a", fontWeight: 700 }}
              />
              <textarea
                value={cText}
                onChange={(e) => setCText(e.target.value)}
                placeholder="Share a thought, question, or tip…"
                rows={3}
                className="w-full resize-y rounded-xl border bg-white px-4 py-3 text-[14px] outline-none transition-colors focus:border-gray-500"
                style={{ borderColor: "#E5E7EB", color: "#0f172a", fontWeight: 700 }}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addComment}
                  disabled={!cText.trim()}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] transition-transform active:scale-95 disabled:opacity-50"
                  style={{
                    background: "#111827",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 10px 22px -10px rgba(17,24,39,0.45)",
                  }}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2.4} />
                  Post comment
                </button>
              </div>
            </div>

            {comments.length > 0 && (
              <ul className="mt-6 flex flex-col gap-5 border-t pt-6" style={{ borderColor: "#E5E7EB" }}>
                {comments.map((c) => (
                  <li key={c.at} className="flex gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px]"
                      style={{
                        background: "#374151",
                        color: "#fff",
                        fontWeight: 700,
                      }}
                      aria-hidden="true"
                    >
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[13px]" style={{ color: "#111827", fontWeight: 700 }}>
                          {c.name}
                        </span>
                        <span className="text-[11px]" style={{ color: "#6B7280", fontWeight: 700 }}>
                          {new Date(c.at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed" style={{ color: "#1f2937", fontWeight: 700 }}>
                        {c.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
