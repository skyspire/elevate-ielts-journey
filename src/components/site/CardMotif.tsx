/**
 * CardMotif — looping background micro-animation rendered behind each
 * dashboard card. Each `kind` corresponds to the feature's `key` and
 * paints a unique scene that subtly animates forever, giving the
 * dashboard a sense of life. Colors are driven by the parent card's
 * accent so the motif stays in the card's color family.
 *
 * Animations are defined in src/styles.css under
 * "Dashboard card motif animations" and respect prefers-reduced-motion.
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
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    >
      {kind === "writing" && (
        <g className="motif-ink" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.55">
          <path d="M 14 28 C 30 22, 50 34, 78 26" />
          <path d="M 14 50 C 32 44, 56 58, 80 48" />
          <path d="M 14 72 C 28 66, 50 78, 76 70" />
        </g>
      )}

      {kind === "speaking" && (
        <g className="motif-wave" fill={color} opacity="0.55">
          <rect x="14" y="40" width="6"  height="20" rx="2" />
          <rect x="26" y="40" width="6"  height="20" rx="2" />
          <rect x="38" y="40" width="6"  height="20" rx="2" />
          <rect x="50" y="40" width="6"  height="20" rx="2" />
          <rect x="62" y="40" width="6"  height="20" rx="2" />
          <rect x="74" y="40" width="6"  height="20" rx="2" />
          <rect x="86" y="40" width="6"  height="20" rx="2" />
        </g>
      )}

      {kind === "vocab" && (
        <g
          className="motif-letters"
          fill={color}
          opacity="0.6"
          fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
          fontWeight="800"
          fontSize="14"
          textAnchor="middle"
        >
          <text x="20" y="80">A</text>
          <text x="40" y="80">b</text>
          <text x="60" y="80">C</text>
          <text x="80" y="80">d</text>
          <text x="50" y="80">е</text>
        </g>
      )}

      {kind === "templates" && (
        <g className="motif-pages" opacity="0.55">
          <g>
            <rect x="22" y="28" width="36" height="48" rx="3" fill="none" stroke={color} strokeWidth="1.4" />
            <line x1="28" y1="38" x2="50" y2="38" stroke={color} strokeWidth="1.2" />
            <line x1="28" y1="46" x2="52" y2="46" stroke={color} strokeWidth="1.2" />
            <line x1="28" y1="54" x2="46" y2="54" stroke={color} strokeWidth="1.2" />
          </g>
          <g>
            <rect x="32" y="24" width="36" height="48" rx="3" fill="none" stroke={color} strokeWidth="1.4" />
            <line x1="38" y1="34" x2="60" y2="34" stroke={color} strokeWidth="1.2" />
            <line x1="38" y1="42" x2="62" y2="42" stroke={color} strokeWidth="1.2" />
            <line x1="38" y1="50" x2="56" y2="50" stroke={color} strokeWidth="1.2" />
          </g>
          <g>
            <rect x="42" y="20" width="36" height="48" rx="3" fill="none" stroke={color} strokeWidth="1.4" />
            <line x1="48" y1="30" x2="70" y2="30" stroke={color} strokeWidth="1.2" />
            <line x1="48" y1="38" x2="72" y2="38" stroke={color} strokeWidth="1.2" />
            <line x1="48" y1="46" x2="66" y2="46" stroke={color} strokeWidth="1.2" />
          </g>
        </g>
      )}

      {kind === "predictions" && (
        <g className="motif-stars" opacity="0.7">
          {/* Orbiting stars around center */}
          <g transform="translate(50,50)">
            <g className="orbit">
              <path d="M 0 -3 L 0.9 -0.9 L 3 0 L 0.9 0.9 L 0 3 L -0.9 0.9 L -3 0 L -0.9 -0.9 Z" fill={color} />
            </g>
            <g className="orbit">
              <path d="M 0 -2.5 L 0.75 -0.75 L 2.5 0 L 0.75 0.75 L 0 2.5 L -0.75 0.75 L -2.5 0 L -0.75 -0.75 Z" fill={color} />
            </g>
          </g>
          {/* Static twinkling stars */}
          <g className="twinkle" transform="translate(20,28)">
            <path d="M 0 -3 L 0.9 -0.9 L 3 0 L 0.9 0.9 L 0 3 L -0.9 0.9 L -3 0 L -0.9 -0.9 Z" fill={color} />
          </g>
          <g className="twinkle" transform="translate(82,72)">
            <path d="M 0 -3 L 0.9 -0.9 L 3 0 L 0.9 0.9 L 0 3 L -0.9 0.9 L -3 0 L -0.9 -0.9 Z" fill={color} />
          </g>
          <g className="twinkle" transform="translate(78,22)">
            <path d="M 0 -2.5 L 0.75 -0.75 L 2.5 0 L 0.75 0.75 L 0 2.5 L -0.75 0.75 L -2.5 0 L -0.75 -0.75 Z" fill={color} />
          </g>
        </g>
      )}

      {kind === "mistakes" && (
        <g className="motif-strike" opacity="0.55">
          {/* Lines being struck through */}
          <line x1="18" y1="36" x2="74" y2="36" stroke={color} strokeWidth="1.4" opacity="0.45" />
          <line x1="18" y1="52" x2="82" y2="52" stroke={color} strokeWidth="1.4" opacity="0.45" />
          <line x1="18" y1="68" x2="68" y2="68" stroke={color} strokeWidth="1.4" opacity="0.45" />
          {/* Animated red strike */}
          <line className="line" x1="14" y1="52" x2="86" y2="50" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          {/* Eraser block sweeping across */}
          <rect className="eraser" x="20" y="44" width="14" height="6" rx="1.5" fill={color} opacity="0.6" />
        </g>
      )}

      {kind === "plan" && (
        <g className="motif-checks" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
          {/* Calendar grid hint */}
          <g opacity="0.35">
            <rect x="18" y="22" width="64" height="56" rx="4" fill="none" stroke={color} strokeWidth="1.2" />
            <line x1="18" y1="34" x2="82" y2="34" stroke={color} strokeWidth="1" />
            <line x1="34" y1="34" x2="34" y2="78" stroke={color} strokeWidth="0.8" />
            <line x1="50" y1="34" x2="50" y2="78" stroke={color} strokeWidth="0.8" />
            <line x1="66" y1="34" x2="66" y2="78" stroke={color} strokeWidth="0.8" />
            <line x1="18" y1="50" x2="82" y2="50" stroke={color} strokeWidth="0.8" />
            <line x1="18" y1="64" x2="82" y2="64" stroke={color} strokeWidth="0.8" />
          </g>
          {/* Checkmarks pop in sequence */}
          <polyline points="22,42 26,46 32,38" />
          <polyline points="38,58 42,62 48,54" />
          <polyline points="54,42 58,46 64,38" />
          <polyline points="70,72 74,76 80,68" />
        </g>
      )}

      {kind === "recent-exams" && (
        <g className="motif-flame" opacity="0.65">
          {/* Three flame layers flickering at different rates */}
          <path
            className="flicker"
            d="M 50 24 C 38 38, 38 52, 50 64 C 62 52, 62 38, 50 24 Z"
            fill={color}
            opacity="0.35"
          />
          <path
            className="flicker"
            d="M 50 32 C 42 42, 42 54, 50 62 C 58 54, 58 42, 50 32 Z"
            fill={color}
            opacity="0.55"
          />
          <path
            className="flicker"
            d="M 50 40 C 46 46, 46 56, 50 60 C 54 56, 54 46, 50 40 Z"
            fill={color}
            opacity="0.85"
          />
        </g>
      )}
    </svg>
  );
}
