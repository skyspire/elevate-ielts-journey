import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import bookCoral from "@/assets/hero-objects/book-coral.png";
import bookNavy from "@/assets/hero-objects/book-navy.png";
import bookStack from "@/assets/hero-objects/book-stack.png";
import notebookOpen from "@/assets/hero-objects/notebook-open.png";
import notebookKraft from "@/assets/hero-objects/notebook-kraft.png";
import stickyScore from "@/assets/hero-objects/sticky-score.png";
import stickyPink from "@/assets/hero-objects/sticky-pink.png";
import flashcardVocab from "@/assets/hero-objects/flashcard-vocab.png";
import pencil from "@/assets/hero-objects/pencil.png";
import highlighter from "@/assets/hero-objects/highlighter.png";
import examPaper from "@/assets/hero-objects/exam-paper.png";
import paperclipNotes from "@/assets/hero-objects/paperclip-notes.png";

/**
 * QuietHero — Real 3D study objects floating around a calm headline.
 *
 * Same DNA as LearnersWorld: bold centered statement + photographic
 * objects gently drifting around the periphery on cream paper.
 * Here, instead of human faces, it's Apple-style 3D rendered IELTS
 * study material: books, notebooks, sticky notes, pencils, flashcards.
 */
export function QuietHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Royal gradient — deep indigo → violet → midnight, with champagne glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 8%, oklch(0.55 0.12 290 / 0.85) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 45% at 90% 14%, oklch(0.42 0.16 295 / 0.9) 0%, transparent 60%)," +
            "radial-gradient(ellipse 75% 55% at 50% 105%, oklch(0.32 0.12 305 / 0.85) 0%, transparent 65%)," +
            "radial-gradient(ellipse 35% 30% at 78% 60%, oklch(0.7 0.13 75 / 0.25) 0%, transparent 60%)," +
            "linear-gradient(140deg, oklch(0.28 0.1 285) 0%, oklch(0.32 0.13 295) 50%, oklch(0.26 0.11 305) 100%)",
        }}
      />
      {/* Subtle starfield grain for depth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.3] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.95 0.04 290 / 0.4) 1px, transparent 1.2px)",
          backgroundSize: "4px 4px",
        }}
      />
      {/* Champagne gold halo at top center */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[55%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, oklch(0.85 0.1 80 / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* Floating 3D study objects — peripheral, never crowding text */}
      <FloatingObjects />

      <div className="container-page relative z-10 flex flex-col items-center py-28 text-center md:py-36 lg:py-44">
        {/* Handwritten eyebrow */}
        <p className="font-handwriting text-2xl text-brand/80 sm:text-3xl">
          free &amp; fresh, always
        </p>

        {/* The big calm statement */}
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          No need to buy{" "}
          <span className="relative inline-block">
            <span className="text-gradient-shimmer">expensive</span>
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
                className="hero-underline"
              />
            </svg>
          </span>{" "}
          IELTS books.
        </h1>

        {/* Quiet supporting line */}
        <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl">
          Latest questions with Band 8–9 sample answers — drawn from real exams,
          updated regularly.
        </p>

        {/* Calm CTA pair */}
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="group h-12 rounded-full bg-brand px-7 text-base font-bold text-brand-foreground shadow-glow hover:bg-brand/90"
          >
            View Recent Questions
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-border bg-background/80 px-7 text-base font-bold backdrop-blur hover:bg-secondary"
          >
            Unlock Full Access
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Real 3D objects, scattered at the edges, drifting gently.
   Each has its own size, position, rotation, delay, and duration
   so the motion feels organic — like LearnersWorld avatars.
   ============================================================ */
type FloatItem = {
  src: string;
  alt: string;
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  delay: string;
  dur: string;
  hideBelow?: "md" | "lg";
};

const ITEMS: FloatItem[] = [
  // ---- Far left column ----
  { src: bookNavy, alt: "Cambridge IELTS book", size: 150, top: "8%", left: "3%", rotate: -12, delay: "0s", dur: "11s" },
  { src: notebookOpen, alt: "Open notebook with notes", size: 170, top: "44%", left: "1%", rotate: 8, delay: "1.6s", dur: "13s" },
  { src: pencil, alt: "Pencil", size: 110, bottom: "12%", left: "8%", rotate: -25, delay: "0.8s", dur: "10s" },
  { src: stickyScore, alt: "Sticky note 8.5", size: 95, top: "26%", left: "12%", rotate: -8, delay: "2.2s", dur: "12s", hideBelow: "lg" },

  // ---- Far right column ----
  { src: bookCoral, alt: "IELTS book", size: 150, top: "10%", right: "4%", rotate: 10, delay: "0.5s", dur: "12s" },
  { src: bookStack, alt: "Stack of IELTS books", size: 180, bottom: "8%", right: "3%", rotate: -6, delay: "1.2s", dur: "14s" },
  { src: highlighter, alt: "Highlighter", size: 110, top: "42%", right: "2%", rotate: 35, delay: "2s", dur: "11s" },
  { src: stickyPink, alt: "Sticky note Speaking", size: 100, top: "22%", right: "12%", rotate: 12, delay: "0.3s", dur: "13s", hideBelow: "lg" },

  // ---- Mid-distance accents (md+) ----
  { src: flashcardVocab, alt: "Vocabulary flashcard", size: 120, bottom: "30%", left: "14%", rotate: -10, delay: "1.8s", dur: "12.5s", hideBelow: "lg" },
  { src: examPaper, alt: "Exam paper Nov 2025", size: 130, bottom: "26%", right: "14%", rotate: 8, delay: "0.9s", dur: "13.5s", hideBelow: "lg" },
  { src: notebookKraft, alt: "Kraft notebook", size: 110, top: "62%", left: "6%", rotate: -4, delay: "2.6s", dur: "15s", hideBelow: "md" },
  { src: paperclipNotes, alt: "Paper clip with notes", size: 100, top: "60%", right: "8%", rotate: 14, delay: "1.4s", dur: "14s", hideBelow: "md" },
];

function FloatingObjects() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ITEMS.map((item, i) => {
        const hideClass =
          item.hideBelow === "lg"
            ? "hidden lg:block"
            : item.hideBelow === "md"
              ? "hidden md:block"
              : "hidden sm:block";
        return (
          <div
            key={i}
            className={`qh-float absolute ${hideClass}`}
            style={{
              top: item.top,
              bottom: item.bottom,
              left: item.left,
              right: item.right,
              width: `${item.size}px`,
              ["--rot" as any]: `${item.rotate}deg`,
              ["--dur" as any]: item.dur,
              animationDelay: item.delay,
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              width={item.size}
              height={item.size}
              className="h-auto w-full select-none"
              draggable={false}
            />
          </div>
        );
      })}

      <style>{`
        @keyframes qh-float {
          0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
          50%      { transform: translateY(-14px) rotate(calc(var(--rot, 0deg) + 2deg)); }
        }
        .qh-float {
          animation: qh-float var(--dur, 12s) ease-in-out infinite;
          filter: drop-shadow(0 14px 28px oklch(0.4 0.05 60 / 0.18));
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .qh-float { animation: none; }
        }
      `}</style>
    </div>
  );
}
