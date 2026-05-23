import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { BackButton } from "@/components/site/BackButton";
import { Footer } from "@/components/site/Footer";
import {
  getCategory,
  type CategoryKey,
  type TopicList,
  type Word,
} from "@/data/vocabulary";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).catch("academic"),
  list: z.string().optional(),
});

type CategoryToneKey = CategoryKey;

const categoryTone: Record<CategoryToneKey, { ink: string }> = {
  dictionary: { ink: "oklch(0.42 0.18 260)" },
  phrasal: { ink: "oklch(0.48 0.16 230)" },
  idioms: { ink: "oklch(0.45 0.18 290)" },
  collocations: { ink: "oklch(0.50 0.15 200)" },
  slangs: { ink: "oklch(0.55 0.16 250)" },
};

/* Pastel rainbow palette — cycled per topic list. */
type Palette = { bg: string; bgDeep: string; ink: string; glow: string };

const pastelPalette: Palette[] = [
  { bg: "oklch(0.95 0.045 165)", bgDeep: "oklch(0.88 0.085 165)", ink: "oklch(0.34 0.10 165)", glow: "oklch(0.70 0.13 165)" },
  { bg: "oklch(0.95 0.05 55)",   bgDeep: "oklch(0.88 0.10 55)",   ink: "oklch(0.40 0.12 45)",  glow: "oklch(0.72 0.14 45)"  },
  { bg: "oklch(0.95 0.05 295)",  bgDeep: "oklch(0.87 0.10 295)",  ink: "oklch(0.38 0.14 295)", glow: "oklch(0.70 0.15 295)" },
  { bg: "oklch(0.95 0.05 230)",  bgDeep: "oklch(0.87 0.10 230)",  ink: "oklch(0.38 0.14 235)", glow: "oklch(0.70 0.15 230)" },
  { bg: "oklch(0.95 0.055 95)",  bgDeep: "oklch(0.87 0.11 90)",   ink: "oklch(0.38 0.11 80)",  glow: "oklch(0.74 0.14 90)"  },
  { bg: "oklch(0.95 0.05 15)",   bgDeep: "oklch(0.87 0.10 15)",   ink: "oklch(0.40 0.14 18)",  glow: "oklch(0.70 0.15 15)"  },
  { bg: "oklch(0.95 0.05 180)",  bgDeep: "oklch(0.87 0.10 180)",  ink: "oklch(0.38 0.11 195)", glow: "oklch(0.72 0.13 180)" },
  { bg: "oklch(0.95 0.04 75)",   bgDeep: "oklch(0.87 0.085 70)",  ink: "oklch(0.36 0.08 65)",  glow: "oklch(0.72 0.12 70)"  },
];

export const Route = createFileRoute("/vocabulary/$category")({
  validateSearch: searchSchema,
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.category.title} — Vocabulary Builder | BigIELTS.com`
          : "Vocabulary — BigIELTS.com",
      },
      {
        name: "description",
        content:
          loaderData?.category.tagline ??
          "IELTS vocabulary curated by topic with meanings, examples, and examiner tips.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="font-display text-4xl font-black text-foreground/80">Not found</h1>
        <p className="mt-2 text-sm text-foreground/60">
          That vocabulary category doesn't exist.
        </p>
        <Link
          to="/vocabulary"
          search={{ module: "academic" }}
          className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background"
        >
          Back to Vocabulary
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="font-display text-3xl font-black text-foreground/80">Something went wrong</h1>
        <p className="mt-2 max-w-md text-sm text-foreground/60">{error.message}</p>
      </div>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/vocabulary/$category" });

  const tone = categoryTone[category.key as CategoryToneKey];
  const lists = category.lists;

  // Active list index (driven by URL ?list=slug)
  const initialIndex = Math.max(
    0,
    lists.findIndex((l: TopicList) => l.slug === search.list),
  );
  const activeIndex = initialIndex === -1 ? 0 : initialIndex;
  const activeList = lists[activeIndex] ?? lists[0];

  const setActiveIndex = (i: number) => {
    const clamped = Math.max(0, Math.min(lists.length - 1, i));
    const slug = lists[clamped]?.slug;
    if (!slug) return;
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, list: slug }),
      replace: true,
    });
    // Light haptic feedback on supported devices
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate?.(8);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#D96E8A" }}>
      <main className="relative">
        <BackButton
          to="/vocabulary"
          search={{ module: search.module }}
          ariaLabel="Back to Vocabulary"
        />

        <div className="mx-auto w-full max-w-7xl px-5 pt-8 sm:px-6 sm:pt-10">

          {/* Page title */}
          <header className="text-center">
            <h1
              className="font-display text-[36px] font-black leading-[1.02] tracking-tight text-foreground sm:text-[52px]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {category.title}
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-[13px] text-foreground/55 sm:text-sm">
              {category.tagline}
            </p>
          </header>
        </div>

        {/* Two-column workspace */}
        <div className="mx-auto mt-6 w-full max-w-7xl px-5 pb-10 sm:px-6 sm:mt-8 sm:pb-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,33fr)_minmax(0,67fr)] lg:gap-8">
            {/* LEFT — Card stack */}
            <CardStack
              lists={lists}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
            />

            {/* RIGHT — Content panel */}
            <ContentPanel
              key={activeList?.slug}
              list={activeList}
              ink={tone.ink}
              palette={pastelPalette[activeIndex % pastelPalette.length]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ================================================================== */
/* CARD STACK — vertically swipeable stacked cards                     */
/* ================================================================== */

function CardStack({
  lists,
  activeIndex,
  onChange,
}: {
  lists: TopicList[];
  activeIndex: number;
  onChange: (i: number) => void;
}) {
  // Show up to 3 cards in the stack: active + next two
  const VISIBLE = 3;

  return (
    <div className="lg:sticky lg:top-6 lg:self-start">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="font-display text-[10px] font-extrabold uppercase tracking-[0.24em] text-foreground/45">
          Topic Cards
        </span>
        <span className="font-mono text-[11px] font-semibold tabular-nums text-foreground/45">
          {String(activeIndex + 1).padStart(2, "0")} / {String(lists.length).padStart(2, "0")}
        </span>
      </div>

      {/* Stack viewport */}
      <div
        className="relative w-full select-none"
        style={{ height: "min(60vh, 460px)", perspective: "1200px" }}
      >
        <AnimatePresence initial={false}>
          {lists.map((list, idx) => {
            const offset = idx - activeIndex;
            // Render only the active card and a few behind/ahead
            if (offset < -1 || offset > VISIBLE - 1) return null;
            const palette = pastelPalette[idx % pastelPalette.length];
            return (
              <StackCard
                key={list.slug}
                list={list}
                palette={palette}
                offset={offset}
                isActive={offset === 0}
                canPrev={activeIndex > 0}
                canNext={activeIndex < lists.length - 1}
                onSwipeUp={() => onChange(activeIndex + 1)}
                onSwipeDown={() => onChange(activeIndex - 1)}
                onTap={() => {
                  if (offset > 0) onChange(activeIndex + 1);
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onChange(activeIndex - 1)}
          disabled={activeIndex <= 0}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground/65 transition-all hover:scale-105 hover:text-foreground disabled:opacity-40 disabled:hover:scale-100"
          aria-label="Previous card"
        >
          <ChevronUp className="h-4 w-4" strokeWidth={2.6} />
        </button>
        <button
          type="button"
          onClick={() => onChange(activeIndex + 1)}
          disabled={activeIndex >= lists.length - 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white text-foreground/65 transition-all hover:scale-105 hover:text-foreground disabled:opacity-40 disabled:hover:scale-100"
          aria-label="Next card"
        >
          <ChevronDown className="h-4 w-4" strokeWidth={2.6} />
        </button>
      </div>

      {/* Helper text */}
      <p className="mt-2 text-center text-[11px] font-medium text-foreground/40">
        Swipe up to flip through cards
      </p>
    </div>
  );
}

function StackCard({
  list,
  palette,
  offset,
  isActive,
  canPrev,
  canNext,
  onSwipeUp,
  onSwipeDown,
  onTap,
}: {
  list: TopicList;
  palette: Palette;
  offset: number; // 0 = active, 1 = next, 2 = next next, -1 = previous (transitioning out)
  isActive: boolean;
  canPrev: boolean;
  canNext: boolean;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onTap: () => void;
}) {
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-200, 0, 200], [-8, 0, 8]);
  const dragOpacity = useTransform(y, [-300, 0, 300], [0.4, 1, 0.4]);

  // Stack visual depth — each card behind sits lower-z, slightly smaller, more rotated
  const baseTranslateY = offset === -1 ? -40 : offset * 14;
  const baseScale = offset === -1 ? 0.96 : 1 - offset * 0.05;
  const baseRotate = offset === -1 ? -3 : offset * 1.2;
  const baseOpacity = offset === -1 ? 0 : offset === 0 ? 1 : 0.85 - offset * 0.15;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 90;
    const velocity = info.velocity.y;
    if ((info.offset.y < -threshold || velocity < -500) && canNext) {
      onSwipeUp();
    } else if ((info.offset.y > threshold || velocity > 500) && canPrev) {
      onSwipeDown();
    }
    y.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={!isActive ? onTap : undefined}
      drag={isActive ? "y" : false}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{
        y: isActive ? y : 0,
        rotate: isActive ? rotate : baseRotate,
        opacity: isActive ? dragOpacity : baseOpacity,
        zIndex: 10 - Math.abs(offset),
      }}
      initial={{
        y: baseTranslateY + 60,
        scale: baseScale,
        rotate: baseRotate,
        opacity: 0,
      }}
      animate={{
        y: baseTranslateY,
        scale: baseScale,
        rotate: baseRotate,
        opacity: baseOpacity,
      }}
      exit={{
        y: -180,
        opacity: 0,
        scale: 0.92,
        rotate: -6,
        transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 32,
        mass: 0.9,
      }}
      whileTap={isActive ? { scale: baseScale * 0.99 } : undefined}
      className="absolute inset-0 flex w-full origin-bottom flex-col overflow-hidden rounded-[24px] text-left outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      aria-label={`Topic: ${list.title}`}
      aria-current={isActive ? "true" : undefined}
    >
      {/* Card body */}
      <div
        className="relative flex h-full w-full flex-col justify-between p-6 sm:p-7"
        style={{
          background: isActive
            ? `linear-gradient(155deg, ${palette.bg} 0%, ${palette.bgDeep} 100%)`
            : `linear-gradient(155deg, ${palette.bg} 0%, ${palette.bgDeep} 100%)`,
          boxShadow: isActive
            ? `0 1px 0 0 oklch(1 0 0 / 0.6) inset, 0 24px 60px -20px ${palette.ink}55, 0 8px 24px -10px ${palette.ink}30, 0 0 0 1px ${palette.ink}25`
            : `0 1px 0 0 oklch(1 0 0 / 0.5) inset, 0 8px 24px -12px ${palette.ink}30, 0 0 0 1px ${palette.ink}15`,
        }}
      >
        {/* Subtle paper grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, oklch(0 0 0) 1px, transparent 1px), radial-gradient(circle at 70% 60%, oklch(0 0 0) 1px, transparent 1px)",
            backgroundSize: "24px 24px, 32px 32px",
          }}
        />

        {/* Active glow */}
        {isActive && (
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[24px]"
            style={{
              boxShadow: `0 0 0 1.5px ${palette.ink}40, 0 0 24px -4px ${palette.glow}55`,
            }}
          />
        )}

        {/* Top — small index */}
        <div className="relative flex items-start justify-between">
          <span
            className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: palette.ink, opacity: 0.55 }}
          >
            Card
          </span>
          <span
            className="font-display text-[12px] font-black tabular-nums"
            style={{ color: palette.ink, opacity: 0.7 }}
          >
            {list.words.length} items
          </span>
        </div>

        {/* Center — title */}
        <div className="relative flex flex-1 items-center">
          <h3
            className="font-display text-[26px] font-black leading-[1.05] tracking-tight sm:text-[30px]"
            style={{
              color: palette.ink,
              letterSpacing: "-0.02em",
              textShadow: isActive ? `0 1px 0 oklch(1 0 0 / 0.4)` : undefined,
            }}
          >
            {list.title}
          </h3>
        </div>

        {/* Bottom — blurb */}
        <p
          className="relative line-clamp-2 text-[12.5px] leading-snug"
          style={{ color: palette.ink, opacity: 0.7 }}
        >
          {list.blurb}
        </p>
      </div>
    </motion.button>
  );
}

/* ================================================================== */
/* CONTENT PANEL — sticky-header scrollable list of words              */
/* ================================================================== */

function ContentPanel({
  list,
  ink,
  palette,
}: {
  list: TopicList | undefined;
  ink: string;
  palette: Palette;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Reset scroll when list changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setScrolled(false);
  }, [list?.slug]);

  const words = useMemo(() => list?.words ?? [], [list]);

  if (!list) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-white p-10 text-center shadow-soft">
        <p className="text-foreground/60">No lists yet.</p>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-soft"
    >
      {/* Sticky header */}
      <header
        className="sticky top-0 z-10 border-b transition-shadow"
        style={{
          background: "white",
          borderColor: scrolled ? "oklch(0 0 0 / 0.08)" : "oklch(0 0 0 / 0.05)",
          boxShadow: scrolled ? "0 6px 16px -10px oklch(0 0 0 / 0.18)" : "none",
        }}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0">
            <p
              className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: palette.ink, opacity: 0.6 }}
            >
              Active Card
            </p>
            <h2
              className="mt-0.5 truncate font-display text-[22px] font-black leading-tight tracking-tight sm:text-[26px]"
              style={{ color: ink, letterSpacing: "-0.02em" }}
            >
              {list.title}
            </h2>
          </div>
          <span
            className="shrink-0 rounded-full px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-[0.18em]"
            style={{
              background: palette.bg,
              color: palette.ink,
              boxShadow: `inset 0 0 0 1px ${palette.ink}25`,
            }}
          >
            {words.length} {words.length === 1 ? "item" : "items"}
          </span>
        </div>
      </header>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 4)}
        className="max-h-[min(72vh,720px)] overflow-y-auto"
      >
        {words.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-2xl font-black text-foreground/55">
              Nothing here yet
            </p>
          </div>
        ) : (
          <ol className="divide-y divide-foreground/5">
            <AnimatePresence mode="popLayout">
              {words.map((word, i) => (
                <motion.li
                  key={`${list.slug}-${word.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: Math.min(i * 0.012, 0.18),
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="flex items-stretch"
                >
                  <WordEntry word={word} index={i + 1} ink={ink} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        )}
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* WordEntry — one dictionary entry                                    */
/* ------------------------------------------------------------------ */

function WordEntry({
  word,
  index,
  ink,
}: {
  word: Word;
  index: number;
  ink: string;
}) {
  const indexLabel = String(index).padStart(2, "0");

  return (
    <>
      <div className="flex w-12 shrink-0 items-start justify-center border-r border-foreground/10 bg-foreground/[0.02] px-2 pt-5 pb-5 sm:w-16 sm:pt-6">
        <span className="font-display text-xl font-black tracking-tight text-foreground/40 sm:text-2xl">
          {indexLabel}
        </span>
      </div>

      <div className="min-w-0 flex-1 px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h3
            className="font-display text-[17px] font-extrabold leading-tight tracking-tight sm:text-[18px]"
            style={{ color: "oklch(0.18 0.03 260)" }}
          >
            {word.term}
          </h3>
          {word.pos && (
            <span className="text-[11px] font-medium italic text-foreground/40">
              {word.pos}
            </span>
          )}
          <span className="text-foreground/35">—</span>
          <span className="text-[14px] leading-snug text-foreground/75 sm:text-[14.5px]">
            {word.meaning}
          </span>
        </div>

        <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/55 sm:text-[13.5px]">
          “{word.example}”
        </p>

        {word.tip && (
          <p
            className="mt-1.5 text-[12.5px] font-medium leading-snug"
            style={{ color: ink }}
          >
            {word.tip}
          </p>
        )}
      </div>
    </>
  );
}
