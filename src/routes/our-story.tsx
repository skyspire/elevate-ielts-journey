import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FreeEbookCta } from "@/components/site/FreeEbookCta";
import heroImage from "@/assets/our-story-hero.jpg";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — BigIELTS" },
      {
        name: "description",
        content:
          "BigIELTS helps students turn ambition into achievement with accurate, accessible, high-quality IELTS preparation resources.",
      },
      { property: "og:title", content: "Our Story — BigIELTS" },
      {
        property: "og:description",
        content:
          "Why BigIELTS exists, what we stand for, and how we help learners around the world prepare smarter for IELTS.",
      },
    ],
  }),
  component: OurStoryPage,
});

/* ---------------- accent palette per section ---------------- */
const ACCENTS = {
  amber: {
    ink: "oklch(0.55 0.16 60)",
    soft: "oklch(0.94 0.06 75)",
    band: "oklch(0.95 0.05 70)",
  },
  sage: {
    ink: "oklch(0.48 0.09 165)",
    soft: "oklch(0.93 0.05 160)",
    band: "oklch(0.95 0.04 160)",
  },
  rose: {
    ink: "oklch(0.55 0.15 20)",
    soft: "oklch(0.94 0.05 25)",
    band: "oklch(0.95 0.04 22)",
  },
  indigo: {
    ink: "oklch(0.45 0.13 280)",
    soft: "oklch(0.94 0.04 285)",
    band: "oklch(0.95 0.035 285)",
  },
  kraft: {
    ink: "oklch(0.45 0.07 70)",
    soft: "oklch(0.92 0.04 75)",
    band: "oklch(0.94 0.04 78)",
  },
} as const;

type AccentKey = keyof typeof ACCENTS;

/* ---------------- building blocks ---------------- */

function Eyebrow({ accent, children }: { accent: AccentKey; children: React.ReactNode }) {
  return (
    <p
      className="font-handwriting text-2xl sm:text-3xl"
      style={{ color: ACCENTS[accent].ink }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
      {children}
    </h2>
  );
}

function AccentRule({ accent }: { accent: AccentKey }) {
  return (
    <div
      aria-hidden
      className="mt-6 h-[3px] w-16 rounded-full"
      style={{ backgroundColor: ACCENTS[accent].ink }}
    />
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 text-[17px] leading-[1.85] text-foreground/80 sm:text-lg">
      {children}
    </p>
  );
}

function TintedBand({
  accent,
  children,
}: {
  accent: AccentKey;
  children: React.ReactNode;
}) {
  const a = ACCENTS[accent];
  return (
    <section
      className="relative my-20 py-20 sm:py-28"
      style={{
        background: `linear-gradient(180deg, ${a.band} 0%, ${a.soft} 100%)`,
      }}
    >
      {/* hairlines top + bottom */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ backgroundColor: `${a.ink}33` }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ backgroundColor: `${a.ink}33` }}
      />
      <div className="container-page mx-auto max-w-3xl px-4 text-center">
        <span
          aria-hidden
          className="block font-display text-[6rem] leading-[0.6] sm:text-[8rem]"
          style={{ color: `${a.ink}40` }}
        >
          “
        </span>
        <blockquote className="mt-2 font-display text-2xl font-extrabold leading-snug tracking-tight text-foreground sm:text-[32px] lg:text-[38px]">
          {children}
        </blockquote>
      </div>
    </section>
  );
}

/* ---------------- page ---------------- */

function OurStoryPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.985_0.006_85)] text-foreground">
      {/* Ivory paper base + warm halos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 12% 4%, oklch(0.94 0.05 70 / 0.55) 0%, transparent 65%)," +
            "radial-gradient(ellipse 55% 45% at 92% 20%, oklch(0.93 0.06 35 / 0.4) 0%, transparent 65%)," +
            "linear-gradient(180deg, oklch(0.99 0.006 85) 0%, oklch(0.975 0.012 75) 100%)",
        }}
      />
      {/* ruled paper hairlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.28]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 31px, oklch(0.55 0.04 70 / 0.18) 31px 32px)",
        }}
      />
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22] mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.4 0.05 60 / 0.15) 1px, transparent 1.2px)",
          backgroundSize: "3px 3px",
        }}
      />

      <Header />

      <main>
        {/* =================== HERO — centered =================== */}
        <section className="container-page relative pt-20 text-center sm:pt-28">
          <Eyebrow accent="amber">our story</Eyebrow>
          <h1 className="mx-auto mt-4 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Helping students turn{" "}
            <span className="relative inline-block">
              <span className="text-gradient-shimmer">ambition</span>
              <svg
                aria-hidden
                viewBox="0 0 240 14"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full"
              >
                <path
                  d="M3 9 C 50 3, 120 13, 180 6 S 230 5, 237 10"
                  fill="none"
                  stroke={ACCENTS.amber.ink}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            into achievement.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.85] text-foreground/75 sm:text-xl">
            Every day, millions of people around the world work toward a goal
            that has the power to transform their future. Along that journey
            stands one important milestone — IELTS.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-[1.85] text-foreground/75 sm:text-xl">
            For some, it is admission to a leading university. For others, a
            new career, international opportunity, professional growth, or
            the chance to build a better life for themselves and their
            families.
          </p>
        </section>

        <TintedBand accent="amber">
          Preparing for IELTS is about far more than mastering an exam
          format. It requires confidence, strategy, consistency, and access
          to reliable guidance.
        </TintedBand>

        {/* =================== WHY WE EXIST — asymmetric two-col =================== */}
        <section className="container-page mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Eyebrow accent="sage">why we exist</Eyebrow>
                <SectionTitle>Built on one simple belief.</SectionTitle>
                <AccentRule accent="sage" />
              </div>
            </div>
            <div className="lg:col-span-7">
              <Body>
                BigIELTS was created with a simple belief: students deserve
                access to accurate, practical, and high-quality IELTS
                preparation resources.
              </Body>
              <Body>
                Too often, learners find themselves navigating fragmented
                information, outdated materials, conflicting advice, and
                resources that fail to reflect the realities of the exam. We
                believed there should be a better way — a place where
                students could find trustworthy guidance, realistic
                preparation materials, and resources designed around their
                actual needs.
              </Body>
              <Body>
                A place built not around marketing promises, but around
                genuine student success. That vision continues to guide
                everything we do.
              </Body>
            </div>
          </div>
        </section>

        <TintedBand accent="sage">
          Students deserve access to accurate, practical, and high-quality
          IELTS preparation resources.
        </TintedBand>

        {/* =================== WHAT WE STAND FOR — 2x2 grid =================== */}
        <section className="container-page mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow accent="rose">what we stand for</Eyebrow>
            <SectionTitle>Four principles shape our work.</SectionTitle>
            <div className="mx-auto mt-6 h-[3px] w-16 rounded-full" style={{ backgroundColor: ACCENTS.rose.ink }} />
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {[
              {
                n: "01",
                t: "Accuracy above everything",
                d: "Trust is earned through reliability. We continuously review, refine, and update our resources to ensure students have access to information that is relevant, practical, and aligned with current IELTS expectations.",
              },
              {
                n: "02",
                t: "Student success comes first",
                d: "Every article, sample answer, prediction file, and learning resource is created with a single objective: helping students perform at their best. If it does not create real value for learners, it does not belong on our platform.",
              },
              {
                n: "03",
                t: "Continuous improvement",
                d: "Education never stands still. Neither do we. We are committed to improving our resources, expanding our offerings, and finding better ways to support students throughout their preparation journey.",
              },
              {
                n: "04",
                t: "Accessibility for all",
                d: "High-quality preparation should not be limited by geography or circumstance. We believe every student deserves access to effective learning resources, regardless of where they live.",
              },
            ].map((p) => (
              <div key={p.n}>
                <div
                  className="font-display text-5xl font-extrabold leading-none"
                  style={{ color: `${ACCENTS.rose.ink}55` }}
                >
                  {p.n}
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {p.t}
                </h3>
                <p className="mt-3 text-[16.5px] leading-[1.8] text-foreground/75">
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        <TintedBand accent="rose">
          Our goal is not simply to provide more content. Our goal is to
          provide better content.
        </TintedBand>

        {/* =================== WHAT MAKES US DIFFERENT — split list =================== */}
        <section className="container-page mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Eyebrow accent="indigo">what makes us different</Eyebrow>
              <SectionTitle>A complete preparation ecosystem.</SectionTitle>
              <AccentRule accent="indigo" />
              <Body>
                BigIELTS has grown into a comprehensive platform designed
                to support candidates throughout every stage of their
                preparation. Every resource is built with clarity,
                relevance, and real-world usefulness in mind.
              </Body>
              <Body>
                Content that helps students prepare smarter, build
                confidence, and approach the exam with a clear
                understanding of what success requires.
              </Body>
            </div>
            <div className="lg:col-span-6">
              <ul className="space-y-0">
                {[
                  "Recent exam question banks",
                  "Research-based prediction files",
                  "High-quality sample answers",
                  "Speaking & writing preparation",
                  "Exam strategies & practical guidance",
                  "Continuously updated learning resources",
                ].map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-5 border-b py-5"
                    style={{ borderColor: `${ACCENTS.indigo.ink}22` }}
                  >
                    <span
                      className="font-display text-sm font-extrabold tabular-nums"
                      style={{ color: ACCENTS.indigo.ink }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =================== IMPACT — timeline =================== */}
        <section className="container-page mx-auto mt-24 max-w-3xl">
          <div className="text-center">
            <Eyebrow accent="kraft">the impact behind every score</Eyebrow>
            <SectionTitle>Behind every result, a story.</SectionTitle>
            <div className="mx-auto mt-6 h-[3px] w-16 rounded-full" style={{ backgroundColor: ACCENTS.kraft.ink }} />
          </div>

          <div className="relative mx-auto mt-14 max-w-xl">
            <div
              aria-hidden
              className="absolute left-[7px] top-2 bottom-2 w-px"
              style={{ backgroundColor: `${ACCENTS.kraft.ink}55` }}
            />
            {[
              "A student pursuing higher education.",
              "A professional seeking new opportunities.",
              "An individual preparing for immigration.",
              "A family working toward a brighter future.",
            ].map((line, i) => (
              <div key={i} className="relative pl-8 pb-7 last:pb-0">
                <span
                  aria-hidden
                  className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full ring-4 ring-[oklch(0.985_0.006_85)]"
                  style={{ backgroundColor: ACCENTS.kraft.ink }}
                />
                <p className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {line}
                </p>
              </div>
            ))}
          </div>

          <Body>
            While test scores are important, they represent something much
            larger. They represent doors opening. Opportunities becoming
            possible. Dreams moving closer to reality. Every success
            achieved by our students reminds us why our work matters.
          </Body>
        </section>

        <TintedBand accent="kraft">
          What unites our learners is not where they come from, but where
          they hope to go.
        </TintedBand>

        {/* =================== TRUSTED — centered tight =================== */}
        <section className="container-page mx-auto max-w-2xl text-center">
          <Eyebrow accent="sage">trusted worldwide</Eyebrow>
          <SectionTitle>A growing global community.</SectionTitle>
          <div className="mx-auto mt-6 h-[3px] w-16 rounded-full" style={{ backgroundColor: ACCENTS.sage.ink }} />
          <Body>
            BigIELTS serves a diverse and growing community of learners
            from across the globe. Their trust motivates us to maintain the
            highest standards in everything we create — to keep
            researching, improving, and delivering resources students can
            rely on when preparing for one of the most important
            examinations of their lives.
          </Body>
        </section>

        {/* =================== LOOKING AHEAD — asymmetric reversed =================== */}
        <section className="container-page mx-auto mt-24 max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="order-2 lg:order-1 lg:col-span-7">
              <Body>
                Our vision extends beyond providing study materials. We are
                building a learning ecosystem designed to make IELTS
                preparation more effective, more accessible, and more
                empowering for students everywhere.
              </Body>
              <Body>
                As technology evolves and student needs continue to change,
                we remain committed to innovation, quality, and continuous
                improvement. Our ambition is clear — to become the
                world&rsquo;s most trusted destination for IELTS
                preparation.
              </Body>
            </div>
            <div className="order-1 lg:order-2 lg:col-span-5">
              <div className="lg:sticky lg:top-28 lg:text-right">
                <Eyebrow accent="indigo">looking ahead</Eyebrow>
                <SectionTitle>Building a learning ecosystem.</SectionTitle>
                <div
                  className="mt-6 h-[3px] w-16 rounded-full lg:ml-auto"
                  style={{ backgroundColor: ACCENTS.indigo.ink }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =================== COMMITMENT — signed letter =================== */}
        <section className="container-page mx-auto mb-24 mt-28 max-w-2xl">
          <div className="text-center">
            <Eyebrow accent="amber">our commitment</Eyebrow>
            <SectionTitle>Wherever the journey leads.</SectionTitle>
            <div className="mx-auto mt-6 h-[3px] w-16 rounded-full" style={{ backgroundColor: ACCENTS.amber.ink }} />
          </div>
          <Body>
            At BigIELTS, we understand that every IELTS candidate is
            working toward something meaningful. A university acceptance
            letter. A new career path. A life-changing opportunity. A
            personal dream.
          </Body>
          <Body>
            Our role is simple — to provide the guidance, resources, and
            confidence needed to help students move forward. Wherever that
            journey leads, we are proud to be part of it.
          </Body>

          <div className="mt-16 text-center">
            <p
              className="font-handwriting text-3xl sm:text-4xl"
              style={{ color: ACCENTS.amber.ink }}
            >
              thank you for being part of our story.
            </p>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-foreground/55">
              — The BigIELTS Team
            </p>
          </div>
        </section>
      </main>

      <FreeEbookCta />
      <Footer />
    </div>
  );
}
