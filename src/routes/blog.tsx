import { createFileRoute, Link } from "@tanstack/react-router";

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
};

const POSTS: Post[] = [
  {
    slug: "writing-task-2-band-8-structure",
    title: "The Band 8 Writing Task 2 structure that actually works",
    category: "Writing",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "speaking-part-2-fluency-fix",
    title: "How to stop freezing in Speaking Part 2",
    category: "Speaking",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "reading-true-false-not-given",
    title: "True / False / Not Given — a decision tree that never fails",
    category: "Reading",
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "listening-map-labelling",
    title: "Map labelling questions: a 4-step reading order",
    category: "Listening",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "vocabulary-c1-academic",
    title: "30 C1 academic collocations that examiners notice",
    category: "Vocabulary",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "study-plan-30-days",
    title: "A realistic 30-day IELTS study plan for working adults",
    category: "Study habits",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "writing-task-1-overview",
    title: "Writing Task 1: the overview sentence that boosts your band",
    category: "Writing",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "speaking-pronunciation-stress",
    title: "Word stress: the smallest fix with the biggest payoff",
    category: "Speaking",
    image:
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=900&q=70",
  },
  {
    slug: "exam-day-checklist",
    title: "The exam-day checklist that calms your nerves",
    category: "Exam day",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=70",
  },
];

// Pastel palettes — each card rotates through these so every card feels different.
type Palette = {
  cardBg: string;
  border: string;
  imgBg: string;
  chipBg: string;
  chipText: string;
  title: string;
  heart: string;
};

const PALETTES: Palette[] = [
  // Lavender
  {
    cardBg: "#f5f3ff",
    border: "#e9d5ff",
    imgBg: "#ddd6fe",
    chipBg: "#ede9fe",
    chipText: "#6d28d9",
    title: "#3b0764",
    heart: "#7c3aed",
  },
  // Blush
  {
    cardBg: "#fff1f2",
    border: "#fecdd3",
    imgBg: "#fecdd3",
    chipBg: "#ffe4e6",
    chipText: "#be123c",
    title: "#4c0519",
    heart: "#e11d48",
  },
  // Mint
  {
    cardBg: "#ecfdf5",
    border: "#a7f3d0",
    imgBg: "#a7f3d0",
    chipBg: "#d1fae5",
    chipText: "#047857",
    title: "#022c22",
    heart: "#059669",
  },
  // Butter
  {
    cardBg: "#fefce8",
    border: "#fde68a",
    imgBg: "#fde68a",
    chipBg: "#fef3c7",
    chipText: "#a16207",
    title: "#422006",
    heart: "#ca8a04",
  },
  // Sky
  {
    cardBg: "#f0f9ff",
    border: "#bae6fd",
    imgBg: "#bae6fd",
    chipBg: "#e0f2fe",
    chipText: "#0369a1",
    title: "#0c2340",
    heart: "#0284c7",
  },
  // Peach
  {
    cardBg: "#fff7ed",
    border: "#fed7aa",
    imgBg: "#fed7aa",
    chipBg: "#ffedd5",
    chipText: "#c2410c",
    title: "#431407",
    heart: "#ea580c",
  },
];

const INTER = "Inter, ui-sans-serif, system-ui, sans-serif";

function BlogPage() {
  return (
    <main
      className="min-h-screen bg-white"
      style={{ fontFamily: INTER }}
    >
      {/* Centered header */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "#94a3b8", fontWeight: 700 }}
        >
          The Journal
        </p>
        <h1
          className="mt-4 text-5xl leading-[1.02] tracking-tight sm:text-6xl"
          style={{ color: "#1e1b4b", fontWeight: 800 }}
        >
          Blog
        </h1>
        <p
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: "#64748b" }}
        >
          Field notes from our IELTS team — strategies, sample answers, and the
          tiny habits that move bands.
        </p>
      </section>

      {/* Pastel post cards */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {POSTS.map((post, i) => {
            const p = PALETTES[i % PALETTES.length];
            return (
              <li key={post.slug}>
                <Link
                  to="/blog"
                  className="group flex h-full flex-col gap-3 rounded-2xl p-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    background: p.cardBg,
                    border: "none",
                    boxShadow: `0 12px 28px -14px ${p.border}, 0 4px 10px -6px rgba(15,23,42,0.08)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 20px 40px -16px ${p.border}, 0 8px 18px -8px rgba(15,23,42,0.12)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 12px 28px -14px ${p.border}, 0 4px 10px -6px rgba(15,23,42,0.08)`;
                  }}
                >
                  {/* Photo */}
                  <div
                    className="relative aspect-[5/4] w-full overflow-hidden rounded-xl"
                    style={{ background: p.imgBg }}
                  >
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                    {/* Heart save button */}
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
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill={p.heart}
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.727 4 2.015 .954-1.288 2.443-2.015 4-2.015 2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" />
                      </svg>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-1 pb-1">
                    <span
                      className="mb-2 inline-block rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider"
                      style={{
                        background: p.chipBg,
                        color: p.chipText,
                        fontWeight: 700,
                      }}
                    >
                      {post.category}
                    </span>
                    <h2
                      className="text-sm leading-tight sm:text-[15px]"
                      style={{ color: p.title, fontWeight: 700 }}
                    >
                      {post.title}
                    </h2>
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
