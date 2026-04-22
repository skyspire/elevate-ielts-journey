/**
 * StudyNotesBackground — a cream paper background with faint pastel
 * handwritten study notes scattered around the margins. Equations,
 * vocabulary, arrows, asterisks and highlighter strokes gently fade
 * in and out, as if an invisible student is studying behind the page.
 *
 * Notes are pinned to the corners/edges so the central content stays
 * legible. Animations live in src/styles.css under "Study notes
 * background animations" and respect prefers-reduced-motion.
 */
type Note = {
  text: string;
  top: string;
  left?: string;
  right?: string;
  rotate: number;
  size: string;     // tailwind text size
  color: string;    // tailwind/utility color class
  delay: number;    // seconds
  duration?: number;
};

const handwritten: Note[] = [
  // top-left
  { text: "vocabulary ✎",    top: "5%",  left: "3%",  rotate: -6,  size: "text-base",  color: "text-rose-400/55",    delay: 0    },
  { text: "S + V + O",       top: "12%", left: "6%",  rotate: 4,   size: "text-sm",    color: "text-sky-500/45",     delay: 1.4  },
  { text: "→ band 8+",       top: "20%", left: "2%",  rotate: -8,  size: "text-sm",    color: "text-emerald-500/55", delay: 2.8  },

  // top-right
  { text: "cohesion ★",      top: "6%",  right: "4%", rotate: 5,   size: "text-base",  color: "text-violet-500/55",  delay: 0.6  },
  { text: "task response",   top: "14%", right: "3%", rotate: -3,  size: "text-sm",    color: "text-amber-500/50",   delay: 2.0  },
  { text: "Σ = ideas + ex.", top: "22%", right: "6%", rotate: 2,   size: "text-sm",    color: "text-rose-400/45",    delay: 3.2  },

  // mid edges (kept narrow so they don't fight the content)
  { text: "P1 P2 P3",        top: "38%", left: "2%",  rotate: -12, size: "text-sm",    color: "text-sky-500/50",     delay: 1.0  },
  { text: "linkers ↗",       top: "46%", right: "2%", rotate: 6,   size: "text-sm",    color: "text-emerald-500/55", delay: 2.4  },

  // bottom-left
  { text: "paraphrase",      top: "70%", left: "3%",  rotate: -5,  size: "text-base",  color: "text-violet-500/55",  delay: 3.6  },
  { text: "synonyms ≈",      top: "78%", left: "6%",  rotate: 3,   size: "text-sm",    color: "text-amber-500/55",   delay: 0.8  },
  { text: "✓ revise",        top: "86%", left: "2%",  rotate: -7,  size: "text-base",  color: "text-rose-400/55",    delay: 2.2  },

  // bottom-right
  { text: "fluency 4/4",     top: "72%", right: "4%", rotate: 4,   size: "text-base",  color: "text-emerald-500/55", delay: 1.6  },
  { text: "model essays",    top: "80%", right: "3%", rotate: -4,  size: "text-sm",    color: "text-sky-500/55",     delay: 3.0  },
  { text: "study daily!",    top: "88%", right: "6%", rotate: 6,   size: "text-base",  color: "text-violet-500/55",  delay: 0.4  },
];

// Soft highlighter swipes (positioned & colored individually)
const highlighters: { top: string; left?: string; right?: string; w: string; rotate: number; color: string; delay: number }[] = [
  { top: "10%", left: "8%",  w: "120px", rotate: -4, color: "oklch(0.92 0.13 95 / 0.45)",  delay: 0.5 }, // yellow
  { top: "44%", right: "8%", w: "100px", rotate: 6,  color: "oklch(0.88 0.10 145 / 0.45)", delay: 2.2 }, // mint
  { top: "82%", left: "10%", w: "140px", rotate: 3,  color: "oklch(0.88 0.10 350 / 0.45)", delay: 1.4 }, // pink
  { top: "76%", right: "12%", w: "110px", rotate: -5, color: "oklch(0.88 0.10 235 / 0.45)", delay: 3.0 }, // sky
];

export function StudyNotesBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Cream paper base + faint ruled lines for "notebook" feel */}
      <div className="absolute inset-0 bg-paper-cream" />
      <div className="absolute inset-0 bg-paper-ruled opacity-[0.18]" />

      {/* Highlighter swipes — sit beneath the handwriting */}
      {highlighters.map((h, i) => (
        <span
          key={`hl-${i}`}
          className="study-highlighter absolute h-3 rounded-sm blur-[1px]"
          style={{
            top: h.top,
            left: h.left,
            right: h.right,
            width: h.w,
            transform: `rotate(${h.rotate}deg)`,
            background: h.color,
            animationDelay: `${h.delay}s`,
          }}
        />
      ))}

      {/* Handwritten margin notes */}
      {handwritten.map((n, i) => (
        <span
          key={`note-${i}`}
          className={`study-note font-handwriting absolute font-bold ${n.size} ${n.color}`}
          style={{
            top: n.top,
            left: n.left,
            right: n.right,
            transform: `rotate(${n.rotate}deg)`,
            animationDelay: `${n.delay}s`,
          }}
        >
          {n.text}
        </span>
      ))}

      {/* Cream wash to soften everything and keep cards in focus */}
      <div className="absolute inset-0 bg-[oklch(0.99_0.015_85/0.40)]" />
    </div>
  );
}
