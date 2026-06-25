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
  date: string;
  readTime: string;
  image: string;
};

const POSTS: Post[] = [
  {
    slug: "writing-task-2-band-8-structure",
    title: "The Band 8 Writing Task 2 structure that actually works",
    category: "Writing",
    date: "Jun 18, 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "speaking-part-2-fluency-fix",
    title: "How to stop freezing in Speaking Part 2",
    category: "Speaking",
    date: "Jun 12, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "reading-true-false-not-given",
    title: "True / False / Not Given — a decision tree that never fails",
    category: "Reading",
    date: "Jun 04, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "listening-map-labelling",
    title: "Map labelling questions: a 4-step reading order",
    category: "Listening",
    date: "May 28, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "vocabulary-c1-academic",
    title: "30 C1 academic collocations that examiners notice",
    category: "Vocabulary",
    date: "May 21, 2026",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "study-plan-30-days",
    title: "A realistic 30-day IELTS study plan for working adults",
    category: "Study habits",
    date: "May 14, 2026",
    readTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "writing-task-1-overview",
    title: "Writing Task 1: the overview sentence that boosts your band",
    category: "Writing",
    date: "May 06, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "speaking-pronunciation-stress",
    title: "Word stress: the smallest fix with the biggest payoff",
    category: "Speaking",
    date: "Apr 29, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "exam-day-checklist",
    title: "The exam-day checklist that calms your nerves",
    category: "Exam day",
    date: "Apr 22, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=70",
  },
];

const INTER = "Inter, ui-sans-serif, system-ui, sans-serif";

function BlogPage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "#fafbfc", fontFamily: INTER }}
    >
      {/* Centered header */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
        <p
          className="text-xs tracking-[0.18em]"
          style={{ color: "#94a3b8", fontWeight: 600 }}
        >
          THE JOURNAL
        </p>
        <h1
          className="mx-auto mt-4 text-5xl leading-[1.02] tracking-tight sm:text-6xl"
          style={{ color: "#0f172a", fontWeight: 800 }}
        >
          Blog
        </h1>
        <p
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: "#475569", fontWeight: 400 }}
        >
          Field notes from our IELTS team — strategies, sample answers, and the
          tiny habits that move bands.
        </p>
        <div
          aria-hidden
          className="mx-auto mt-8 h-px w-16"
          style={{ background: "#e8ecf1" }}
        />
      </section>

      {/* Unified post cards */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog"
                className="group block h-full rounded-3xl outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-4"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8ecf1",
                  boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 40px -18px rgba(59,130,246,0.25), 0 2px 6px rgba(15,23,42,0.05)";
                  e.currentTarget.style.borderColor = "#dbe3ec";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(15,23,42,0.04)";
                  e.currentTarget.style.borderColor = "#e8ecf1";
                }}
              >
                {/* Photo lives inside the card, with a hairline frame around it */}
                <div className="p-3">
                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{ background: "#e8ecf1" }}
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="px-6 pb-6 pt-2">
                  <div
                    className="flex items-center gap-2 text-[11px] tracking-[0.12em]"
                    style={{ color: "#3b82f6", fontWeight: 700 }}
                  >
                    <span>{post.category.toUpperCase()}</span>
                  </div>
                  <h2
                    className="mt-3 text-[1.2rem] leading-snug tracking-tight transition-colors"
                    style={{ color: "#0f172a", fontWeight: 800 }}
                  >
                    {post.title}
                  </h2>
                  <div
                    className="mt-5 flex items-center gap-2 text-xs"
                    style={{ color: "#94a3b8", fontWeight: 500 }}
                  >
                    <span>{post.date}</span>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-current opacity-50" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
