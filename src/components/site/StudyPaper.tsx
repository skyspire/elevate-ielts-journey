/**
 * StudyPaper — shared "study paper" treatments for sample-answer readers.
 *
 * Gives the FollowUpReader, CueCardReader and WritingAnswerBillboard a
 * shared dotted bullet-journal paper background plus two inline annotation
 * primitives — a soft highlighter swipe and a hand-drawn underline — used
 * to mark up signature linkers and band-9 vocabulary in model answers.
 *
 * The annotation primitives are intentionally pure presentational: they
 * accept already-segmented text spans, never mutate the model answers
 * themselves.
 */

import { Fragment, type ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────
 * StudyPaperBackground
 * Confident & tactile dotted bullet-journal paper.
 * Drop inside any positioned (relative/absolute) container — it fills it
 * with a warm cream wash + crisp ink-grey dot grid + faint paper grain.
 * ───────────────────────────────────────────────────────────────────── */

export function StudyPaperBackground({
  tone = "cream",
  className,
}: {
  tone?: "cream" | "ivory";
  className?: string;
}) {
  // Near-white paper with only the faintest grain — the dot grid was too
  // visible and disturbed reading, so we drop it entirely. What remains is
  // a quiet warm-white wash + a whisper-soft fractal grain that gives the
  // lane just enough tactility to feel like paper, not a screen.
  const baseColor = tone === "cream" ? "oklch(0.992 0.006 85)" : "oklch(0.994 0.004 90)";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {/* Near-white paper base */}
      <div className="absolute inset-0" style={{ backgroundColor: baseColor }} />

      {/* Whisper-soft paper grain — fractal noise, very light multiply.
          Just enough tactility to read as paper without competing with ink. */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.30  0 0 0 0 0.26  0 0 0 0 0.20  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          backgroundSize: "240px 240px",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Highlight — soft yellow/green highlighter swipe behind key phrases.
 * Slightly skewed and softer at the edges so it reads as a felt-tip mark,
 * not a CSS box. Render as <Highlight>opening phrase</Highlight>.
 * ───────────────────────────────────────────────────────────────────── */

export function Highlight({
  children,
  tone = "amber",
}: {
  children: ReactNode;
  tone?: "amber" | "lime" | "rose";
}) {
  const palette = {
    amber: "oklch(0.92 0.16 95 / 0.55)",
    lime:  "oklch(0.90 0.16 130 / 0.50)",
    rose:  "oklch(0.92 0.10 25 / 0.50)",
  }[tone];
  const paletteDeep = {
    amber: "oklch(0.86 0.18 90 / 0.60)",
    lime:  "oklch(0.84 0.18 130 / 0.55)",
    rose:  "oklch(0.88 0.12 25 / 0.55)",
  }[tone];

  return (
    <span
      className="relative inline rounded-[2px] px-[2px]"
      style={{
        // Uneven gradient mimics a marker stroke pressed harder in the middle.
        backgroundImage: `linear-gradient(105deg, transparent 0%, ${palette} 8%, ${paletteDeep} 50%, ${palette} 92%, transparent 100%)`,
        // Slight vertical slack so the swipe extends just past the x-height
        // top and bottom — feels hand-drawn.
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
        paddingTop: "0.05em",
        paddingBottom: "0.05em",
      }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Underline — hand-drawn wavy pen underline for band-9 phrases.
 * Uses an inline SVG repeated as a background, anchored to the text
 * baseline. Slightly inked, slightly wavy — feels like a fountain pen.
 * ───────────────────────────────────────────────────────────────────── */

export function Underline({
  children,
  tone = "ink",
}: {
  children: ReactNode;
  tone?: "ink" | "teal" | "plum";
}) {
  const stroke = {
    ink:  "oklch(0.32 0.040 60)",
    teal: "oklch(0.46 0.105 195)",
    plum: "oklch(0.42 0.130 305)",
  }[tone];

  // Encode the stroke colour into the SVG path. Using a wavy path so the
  // underline reads as hand-drawn rather than a CSS text-decoration line.
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 8' width='60' height='8' preserveAspectRatio='none'><path d='M0 5 Q 10 1 20 5 T 40 5 T 60 5' fill='none' stroke='${stroke}' stroke-width='1.4' stroke-linecap='round'/></svg>`,
  );

  return (
    <span
      className="relative inline"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left 100%",
        backgroundSize: "60px 6px",
        paddingBottom: "0.18em",
      }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * annotateText — opinionated auto-annotator for IELTS sample answers.
 *
 * Walks a string, wrapping signature linker phrases in <Highlight> and a
 * curated set of band-9 vocabulary in <Underline>. Returns a fragment of
 * React nodes safe to render inline inside any <p>/<span>.
 *
 * This is the cheap-but-effective approach: one source of truth for which
 * phrases get highlighted, applied across all three readers, with no need
 * to re-edit the underlying model-answer data.
 * ───────────────────────────────────────────────────────────────────── */

const HIGHLIGHT_PHRASES: string[] = [
  // Discourse markers / linkers — the kind examiners reward.
  "on the other hand",
  "more importantly",
  "having said that",
  "that being said",
  "in my view",
  "from my perspective",
  "what I find fascinating",
  "to be perfectly honest",
  "to be honest",
  "the way I see it",
  "as a general rule",
  "first and foremost",
  "all things considered",
  "by and large",
  "needless to say",
];

const UNDERLINE_WORDS: string[] = [
  // Band-9 vocabulary worth showcasing.
  "fascinating",
  "compelling",
  "remarkable",
  "profound",
  "invaluable",
  "indispensable",
  "pivotal",
  "nuanced",
  "intricate",
  "meticulously",
  "fundamentally",
  "undoubtedly",
  "arguably",
  "inevitably",
  "predominantly",
  "ubiquitous",
  "paramount",
];

// Build a single regex that captures BOTH highlight phrases and underline
// words, with phrases taking precedence (longer matches first).
function buildAnnotationRegex(): RegExp {
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const phrases = HIGHLIGHT_PHRASES.map(escape).join("|");
  const words = UNDERLINE_WORDS.map(escape).join("|");
  // Word-boundary on both sides so we don't match inside other words.
  return new RegExp(`\\b(?:(${phrases})|(${words}))\\b`, "gi");
}

const ANNOTATION_RE = buildAnnotationRegex();

export function annotateText(
  text: string,
  opts?: { highlightTone?: "amber" | "lime" | "rose"; underlineTone?: "ink" | "teal" | "plum" },
): ReactNode {
  if (!text) return text;
  const highlightTone = opts?.highlightTone ?? "amber";
  const underlineTone = opts?.underlineTone ?? "ink";

  const out: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  // Reset stateful regex.
  ANNOTATION_RE.lastIndex = 0;

  while ((match = ANNOTATION_RE.exec(text)) !== null) {
    const [full, phrase, word] = match;
    if (match.index > lastIndex) {
      out.push(text.slice(lastIndex, match.index));
    }
    if (phrase) {
      out.push(
        <Highlight key={`h-${match.index}`} tone={highlightTone}>
          {full}
        </Highlight>,
      );
    } else if (word) {
      out.push(
        <Underline key={`u-${match.index}`} tone={underlineTone}>
          {full}
        </Underline>,
      );
    }
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) out.push(text.slice(lastIndex));

  return <Fragment>{out}</Fragment>;
}
