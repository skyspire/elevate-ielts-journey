import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

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

/* ---------------- building blocks ---------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-handwriting text-2xl text-brand sm:text-3xl">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 text-[17px] leading-[1.85] text-foreground/80 sm:text-lg">
      {children}
    </p>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <figure className="relative mx-auto my-16 max-w-3xl px-4 text-center">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 font-display text-[7rem] leading-none text-brand/15 sm:text-[9rem]"
      >
        “
      </span>
      <blockquote className="relative font-display text-2xl font-extrabold leading-snug tracking-tight text-foreground sm:text-[34px]">
        {children}
      </blockquote>
      <div
        aria-hidden
        className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-brand/50 to-transparent"
      />
    </figure>
  );
}

function Principle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-foreground/10 pt-7">
      <h3 className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-[16.5px] leading-[1.8] text-foreground/75">
        {children}
      </p>
    </div>
  );
}

/* ---------------- page ---------------- */

function OurStoryPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[oklch(0.985_0.006_85)] text-foreground">
      {/* Ivory paper base + ruled lines + soft warm halos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 12% 6%, oklch(0.94 0.05 70 / 0.55) 0%, transparent 65%)," +
            "radial-gradient(ellipse 55% 45% at 92% 22%, oklch(0.93 0.06 35 / 0.4) 0%, transparent 65%)," +
            "radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.94 0.05 80 / 0.4) 0%, transparent 70%)," +
            "linear-gradient(180deg, oklch(0.99 0.006 85) 0%, oklch(0.975 0.012 75) 100%)",
        }}
      />
      {/* Ruled paper hairlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.32]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 31px, oklch(0.55 0.04 70 / 0.18) 31px 32px)",
        }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25] mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.4 0.05 60 / 0.15) 1px, transparent 1.2px)",
          backgroundSize: "3px 3px",
        }}
      />

      <Header />

      <main>
        {/* HERO */}
        <section className="container-page relative pt-20 text-center sm:pt-28">
          <Eyebrow>our story</Eyebrow>
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
                  stroke="oklch(0.6 0.2 30)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            into achievement.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.8] text-foreground/75 sm:text-xl">
            Every day, millions of people around the world work toward a goal
            that has the power to transform their future. Along that journey
            stands one important milestone — IELTS.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-[1.8] text-foreground/75 sm:text-xl">
            For some, it is admission to a leading university. For others, a
            new career, international opportunity, professional growth, or the
            chance to build a better life for themselves and their families.
          </p>
          <div
            aria-hidden
            className="mx-auto mt-12 h-px w-32 bg-gradient-to-r from-transparent via-foreground/25 to-transparent"
          />
        </section>

        <PullQuote>
          Preparing for IELTS is about far more than mastering an exam format.
          It requires confidence, strategy, consistency, and access to
          reliable guidance.
        </PullQuote>

        {/* WHY WE EXIST */}
        <section className="container-page mx-auto max-w-3xl">
          <Eyebrow>why we exist</Eyebrow>
          <SectionTitle>Built on one simple belief.</SectionTitle>
          <Body>
            BigIELTS was created with a simple belief: students deserve access
            to accurate, practical, and high-quality IELTS preparation
            resources.
          </Body>
          <Body>
            Too often, learners find themselves navigating fragmented
            information, outdated materials, conflicting advice, and resources
            that fail to reflect the realities of the exam. We believed there
            should be a better way — a place where students could find
            trustworthy guidance, realistic preparation materials, and
            resources designed around their actual needs.
          </Body>
          <Body>
            A place built not around marketing promises, but around genuine
            student success. That vision continues to guide everything we do.
          </Body>
        </section>

        <PullQuote>
          Students deserve access to accurate, practical, and high-quality
          IELTS preparation resources.
        </PullQuote>

        {/* WHAT WE STAND FOR */}
        <section className="container-page mx-auto max-w-3xl">
          <Eyebrow>what we stand for</Eyebrow>
          <SectionTitle>Four principles shape our work.</SectionTitle>
          <Body>
            At BigIELTS, our work is shaped by four core principles that
            inform every resource we create and every decision we make.
          </Body>

          <div className="mt-12 space-y-9">
            <Principle title="Accuracy above everything">
              Trust is earned through reliability. We continuously review,
              refine, and update our resources to ensure students have access
              to information that is relevant, practical, and aligned with
              current IELTS expectations.
            </Principle>
            <Principle title="Student success comes first">
              Every article, sample answer, prediction file, and learning
              resource is created with a single objective: helping students
              perform at their best. If it does not create real value for
              learners, it does not belong on our platform.
            </Principle>
            <Principle title="Continuous improvement">
              Education never stands still. Neither do we. We are committed
              to improving our resources, expanding our offerings, and
              finding better ways to support students throughout their
              preparation journey.
            </Principle>
            <Principle title="Accessibility for all">
              High-quality preparation should not be limited by geography or
              circumstance. We believe every student deserves access to
              effective learning resources, regardless of where they live.
            </Principle>
          </div>
        </section>

        <PullQuote>
          Our goal is not simply to provide more content. Our goal is to
          provide better content.
        </PullQuote>

        {/* WHAT MAKES US DIFFERENT */}
        <section className="container-page mx-auto max-w-3xl">
          <Eyebrow>what makes us different</Eyebrow>
          <SectionTitle>A complete preparation ecosystem.</SectionTitle>
          <Body>
            BigIELTS has grown into a comprehensive platform designed to
            support candidates throughout every stage of their IELTS
            preparation. Our resources span recent exam question banks,
            research-based prediction files, high-quality sample answers,
            speaking and writing preparation materials, exam strategies, and
            continuously updated learning resources.
          </Body>
          <Body>
            Every resource is developed with a focus on clarity, relevance,
            and real-world usefulness. Content that helps students prepare
            smarter, build confidence, and approach the exam with a clear
            understanding of what success requires.
          </Body>
        </section>

        {/* IMPACT */}
        <section className="container-page mx-auto mt-24 max-w-3xl">
          <Eyebrow>the impact behind every score</Eyebrow>
          <SectionTitle>Behind every result is a personal story.</SectionTitle>
          <Body>
            A student pursuing higher education. A professional seeking new
            opportunities. An individual preparing for immigration. A family
            working toward a brighter future.
          </Body>
          <Body>
            While test scores are important, they represent something much
            larger. They represent doors opening. Opportunities becoming
            possible. Dreams moving closer to reality. Every success achieved
            by our students reminds us why our work matters.
          </Body>
        </section>

        <PullQuote>
          What unites our learners is not where they come from, but where
          they hope to go.
        </PullQuote>

        {/* TRUSTED */}
        <section className="container-page mx-auto max-w-3xl">
          <Eyebrow>trusted by learners worldwide</Eyebrow>
          <SectionTitle>A growing global community.</SectionTitle>
          <Body>
            BigIELTS serves a diverse and growing community of learners from
            across the globe. Their trust motivates us to maintain the
            highest standards in everything we create — to keep researching,
            improving, and delivering resources students can rely on when
            preparing for one of the most important examinations of their
            lives.
          </Body>
        </section>

        {/* LOOKING AHEAD */}
        <section className="container-page mx-auto mt-24 max-w-3xl">
          <Eyebrow>looking ahead</Eyebrow>
          <SectionTitle>Building a learning ecosystem.</SectionTitle>
          <Body>
            Our vision extends beyond providing study materials. We are
            building a learning ecosystem designed to make IELTS preparation
            more effective, more accessible, and more empowering for
            students everywhere.
          </Body>
          <Body>
            As technology evolves and student needs continue to change, we
            remain committed to innovation, quality, and continuous
            improvement. Our ambition is clear — to become the world&rsquo;s
            most trusted destination for IELTS preparation.
          </Body>
        </section>

        {/* COMMITMENT */}
        <section className="container-page mx-auto mb-24 mt-24 max-w-3xl">
          <Eyebrow>our commitment</Eyebrow>
          <SectionTitle>Wherever the journey leads.</SectionTitle>
          <Body>
            At BigIELTS, we understand that every IELTS candidate is working
            toward something meaningful. A university acceptance letter. A
            new career path. A life-changing opportunity. A personal dream.
          </Body>
          <Body>
            Our role is simple — to provide the guidance, resources, and
            confidence needed to help students move forward. Wherever that
            journey leads, we are proud to be part of it.
          </Body>

          <div className="mt-16 text-center">
            <p className="font-handwriting text-3xl text-brand sm:text-4xl">
              thank you for being part of our story.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
