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

function BlogPage() {
  return (
    <main
      className="min-h-screen bg-white"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 sm:pt-24 sm:pb-14">
        <p className="text-sm font-semibold tracking-tight text-neutral-500">
          The journal
        </p>
        <h1
          className="mt-3 text-4xl leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl"
          style={{ fontWeight: 800 }}
        >
          Blog
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          Field notes from our IELTS team — strategies, sample answers, and the
          tiny habits that move bands.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog"
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-4 focus-visible:ring-offset-white rounded-3xl"
              >
                <div className="overflow-hidden rounded-3xl bg-neutral-100">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                <div className="mt-5 px-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <span className="text-neutral-900">{post.category}</span>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
                    <span>{post.date}</span>
                    <span aria-hidden className="h-1 w-1 rounded-full bg-neutral-300" />
                    <span>{post.readTime}</span>
                  </div>
                  <h2
                    className="mt-3 text-xl leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-700"
                    style={{ fontWeight: 700 }}
                  >
                    {post.title}
                  </h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
