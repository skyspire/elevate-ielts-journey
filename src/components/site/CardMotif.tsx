/**
 * CardMotif — rich, centered scenes with real motion. Each `kind`
 * paints a believable mini-illustration that loops forever:
 *  - writing       : a pencil draws a line that fades and redraws
 *  - speaking      : a mic with concentric pulse rings expanding outward
 *  - vocab         : letter tiles flipping like a Wordle board
 *  - templates     : a stack of pages, top page peels and flips
 *  - predictions   : planets orbiting a glowing core
 *  - mistakes      : red strike crosses out a word, then resets
 *  - plan          : calendar with checkmarks ticking in sequence
 *  - recent-exams  : layered flame with embers floating up
 *
 * Animations live in src/styles.css under "Dashboard card motif
 * animations" and respect prefers-reduced-motion.
 */
type Kind =
  | "writing"
  | "speaking"
  | "vocab"
  | "templates"
  | "predictions"
  | "mistakes"
  | "plan"
  | "recent-exams";

export function CardMotif({
  kind,
  color,
  className,
}: {
  kind: Kind;
  color: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className={`pointer-events-none absolute inset-0 m-auto h-[68%] w-[68%] ${className ?? ""}`}
    >
      {kind === "writing" && (
        <g className="motif-pencil">
          {/* The line being drawn */}
          <path
            className="trail"
            d="M 18 62 C 32 50, 50 70, 82 56"
            fill="none"
            stroke={color}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Pencil group travels along the path */}
          <g className="pencil">
            {/* Wood body */}
            <rect x="-14" y="-3" width="20" height="6" rx="1" fill={color} opacity="0.95" />
            {/* Metal ferrule */}
            <rect x="6" y="-3" width="3" height="6" fill="oklch(0.85 0.04 80)" />
            {/* Eraser */}
            <rect x="9" y="-3" width="4" height="6" rx="1" fill="oklch(0.78 0.14 25)" />
            {/* Tip */}
            <polygon points="-14,-3 -19,0 -14,3" fill="oklch(0.25 0.02 60)" />
            {/* Highlight */}
            <rect x="-13" y="-2.4" width="18" height="1.2" fill="oklch(1 0 0 / 0.35)" />
          </g>
        </g>
      )}

      {kind === "speaking" && (
        <g className="motif-mic">
          {/* Concentric pulse rings centered on mic */}
          <circle className="ring" cx="50" cy="50" r="14" fill="none" stroke={color} strokeWidth="1.6" />
          <circle className="ring" cx="50" cy="50" r="14" fill="none" stroke={color} strokeWidth="1.4" />
          <circle className="ring" cx="50" cy="50" r="14" fill="none" stroke={color} strokeWidth="1.2" />

          {/* Mic stand */}
          <line x1="50" y1="68" x2="50" y2="80" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="42" y1="80" x2="58" y2="80" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          {/* Mic arc */}
          <path
            d="M 38 50 a 12 14 0 0 0 24 0"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Mic capsule */}
          <rect x="43" y="32" width="14" height="24" rx="7" fill={color} />
          {/* Highlight on capsule */}
          <rect x="45.5" y="34" width="3" height="14" rx="1.5" fill="oklch(1 0 0 / 0.35)" />
        </g>
      )}

      {kind === "vocab" && (
        <g
          className="motif-tiles"
          fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
          fontWeight="900"
          fontSize="14"
          textAnchor="middle"
        >
          {/* 5 Wordle-style tiles flipping in sequence */}
          {["W", "O", "R", "D", "S"].map((ch, i) => {
            const x = 14 + i * 15;
            return (
              <g key={i} className="tile">
                <g className="flip">
                  <rect
                    x={x}
                    y="40"
                    width="14"
                    height="18"
                    rx="2"
                    fill={color}
                    stroke={color}
                    strokeWidth="1"
                  />
                  <text x={x + 7} y="54" fill="oklch(1 0 0)">
                    {ch}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      )}

      {kind === "templates" && (
        <g className="motif-stack">
          {/* Bottom static pages */}
          <rect x="28" y="36" width="44" height="52" rx="3" fill="none" stroke={color} strokeWidth="1.4" opacity="0.5" />
          <rect x="32" y="32" width="44" height="52" rx="3" fill="none" stroke={color} strokeWidth="1.4" opacity="0.7" />
          {/* Top peeling page */}
          <g className="peel" style={{ transformOrigin: "36px 28px" }}>
            <rect x="36" y="28" width="44" height="52" rx="3" fill={color} opacity="0.18" stroke={color} strokeWidth="1.6" />
            <line x1="42" y1="40" x2="74" y2="40" stroke={color} strokeWidth="1.4" />
            <line x1="42" y1="48" x2="70" y2="48" stroke={color} strokeWidth="1.4" />
            <line x1="42" y1="56" x2="74" y2="56" stroke={color} strokeWidth="1.4" />
            <line x1="42" y1="64" x2="66" y2="64" stroke={color} strokeWidth="1.4" />
            {/* Folded corner triangle */}
            <polygon points="74,28 80,28 80,34" fill={color} opacity="0.4" />
          </g>
        </g>
      )}

      {kind === "predictions" && (
        <g className="motif-orbit">
          {/* Glowing core */}
          <circle className="core" cx="50" cy="50" r="6" fill={color} />
          <circle className="core-halo" cx="50" cy="50" r="10" fill={color} opacity="0.25" />

          {/* Orbit rings (visible paths) */}
          <ellipse cx="50" cy="50" rx="22" ry="10" fill="none" stroke={color} strokeWidth="0.8" opacity="0.35" />
          <ellipse
            cx="50"
            cy="50"
            rx="22"
            ry="10"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.35"
            transform="rotate(60 50 50)"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="22"
            ry="10"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.35"
            transform="rotate(-60 50 50)"
          />

          {/* Planets orbiting */}
          <g style={{ transformOrigin: "50px 50px" }} className="orbit-a">
            <circle cx="72" cy="50" r="3" fill={color} />
          </g>
          <g style={{ transformOrigin: "50px 50px", transform: "rotate(60deg)" }} className="orbit-b">
            <circle cx="72" cy="50" r="2.4" fill={color} opacity="0.85" />
          </g>
          <g style={{ transformOrigin: "50px 50px", transform: "rotate(-60deg)" }} className="orbit-c">
            <circle cx="72" cy="50" r="2" fill={color} opacity="0.7" />
          </g>
        </g>
      )}

      {kind === "mistakes" && (
        <g className="motif-cross">
          {/* The "wrong" word */}
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
            fontWeight="800"
            fontSize="16"
            fill={color}
            opacity="0.85"
          >
            error
          </text>
          {/* Red X strike — two crossing lines */}
          <line className="x1" x1="22" y1="44" x2="78" y2="68" stroke="oklch(0.55 0.22 25)" strokeWidth="2.6" strokeLinecap="round" />
          <line className="x2" x1="78" y1="44" x2="22" y2="68" stroke="oklch(0.55 0.22 25)" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      )}

      {kind === "plan" && (
        <g className="motif-cal">
          {/* Calendar body */}
          <rect x="20" y="22" width="60" height="58" rx="4" fill={color} opacity="0.10" stroke={color} strokeWidth="1.6" />
          {/* Header */}
          <rect x="20" y="22" width="60" height="12" rx="4" fill={color} opacity="0.85" />
          <rect x="30" y="18" width="3" height="8" rx="1" fill={color} />
          <rect x="67" y="18" width="3" height="8" rx="1" fill={color} />
          {/* Grid */}
          <g stroke={color} strokeWidth="0.7" opacity="0.45">
            <line x1="35" y1="34" x2="35" y2="80" />
            <line x1="50" y1="34" x2="50" y2="80" />
            <line x1="65" y1="34" x2="65" y2="80" />
            <line x1="20" y1="49" x2="80" y2="49" />
            <line x1="20" y1="64" x2="80" y2="64" />
          </g>
          {/* Checkmarks ticking in sequence */}
          <g
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline className="ck" points="24,42 27,45 32,39" />
            <polyline className="ck" points="39,42 42,45 47,39" />
            <polyline className="ck" points="54,57 57,60 62,54" />
            <polyline className="ck" points="69,72 72,75 77,69" />
          </g>
        </g>
      )}

      {kind === "recent-exams" && (
        <g className="motif-fire">
          {/* Outer glow */}
          <ellipse cx="50" cy="76" rx="22" ry="4" fill={color} opacity="0.18" />

          {/* Three flame layers */}
          <path
            className="flame"
            d="M 50 22 C 34 38, 34 58, 50 72 C 66 58, 66 38, 50 22 Z"
            fill={color}
            opacity="0.30"
          />
          <path
            className="flame"
            d="M 50 30 C 40 42, 40 58, 50 70 C 60 58, 60 42, 50 30 Z"
            fill={color}
            opacity="0.55"
          />
          <path
            className="flame"
            d="M 50 40 C 44 48, 44 60, 50 68 C 56 60, 56 48, 50 40 Z"
            fill="oklch(0.96 0.10 80)"
            opacity="0.95"
          />

          {/* Embers floating up */}
          <circle className="ember" cx="42" cy="60" r="1.4" fill={color} />
          <circle className="ember" cx="58" cy="55" r="1.1" fill={color} />
          <circle className="ember" cx="50" cy="50" r="1" fill={color} />
        </g>
      )}
    </svg>
  );
}
