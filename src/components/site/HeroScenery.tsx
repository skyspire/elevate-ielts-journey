/**
 * HeroScenery — a unique, hand-drawn "study journey" backdrop.
 *
 * A layered, low-opacity scene evoking the IELTS journey:
 *   sunrise → mountains → winding road → distant skyline →
 *   hot-air balloon, paper plane, floating book, stars & clouds.
 *
 * Pointer-events disabled. Decorative only. Sits absolute inside a
 * relatively positioned hero container.
 */
export function HeroScenery() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        // Soft dawn wash over white — barely there, just warmth.
        background:
          "radial-gradient(ellipse 70% 55% at 50% 88%, oklch(0.93 0.06 70 / 0.35), transparent 70%), radial-gradient(ellipse 50% 40% at 50% 30%, oklch(0.92 0.05 220 / 0.25), transparent 70%)",
      }}
    >
      {/* Main scenery SVG, anchored to the bottom, full width */}
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-full w-full"
        style={{ color: "oklch(0.35 0.05 60)" }}
      >
        {/* Sun */}
        <g opacity="0.18">
          <circle cx="850" cy="380" r="55" fill="oklch(0.78 0.16 65)" />
          <circle
            cx="850"
            cy="380"
            r="75"
            fill="none"
            stroke="oklch(0.7 0.15 60)"
            strokeWidth="1.2"
            strokeDasharray="3 6"
          />
        </g>

        {/* Far mountains */}
        <g opacity="0.13" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round">
          <path d="M 0 470 L 140 360 L 230 420 L 340 320 L 460 420 L 560 370 L 700 440 L 820 360 L 940 430 L 1080 350 L 1200 420 L 1200 600 L 0 600 Z" />
        </g>

        {/* Mid mountains */}
        <g opacity="0.18" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round">
          <path d="M 0 510 L 90 430 L 180 490 L 280 410 L 400 500 L 520 440 L 640 510 L 780 420 L 900 500 L 1040 430 L 1200 500 L 1200 600 L 0 600 Z" />
          {/* tiny snow caps */}
          <path d="M 270 420 L 280 410 L 292 422" />
          <path d="M 770 432 L 780 420 L 792 434" />
        </g>

        {/* Distant city skyline */}
        <g opacity="0.16" stroke="currentColor" strokeWidth="1.3" fill="none">
          <path d="M 60 530 L 60 500 L 78 500 L 78 515 L 96 515 L 96 490 L 116 490 L 116 510 L 134 510 L 134 522 L 156 522 L 156 498 L 176 498 L 176 530" />
          <path d="M 980 532 L 980 506 L 1000 506 L 1000 520 L 1020 520 L 1020 494 L 1042 494 L 1042 514 L 1064 514 L 1064 524 L 1086 524 L 1086 502 L 1108 502 L 1108 532" />
          {/* tiny windows */}
          <g strokeWidth="0.8" opacity="0.7">
            <line x1="100" y1="498" x2="100" y2="510" />
            <line x1="120" y1="498" x2="120" y2="508" />
            <line x1="1024" y1="500" x2="1024" y2="512" />
            <line x1="1046" y1="500" x2="1046" y2="510" />
          </g>
        </g>

        {/* Rolling hills / ground */}
        <g opacity="0.22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round">
          <path d="M 0 560 Q 200 520, 420 555 T 820 545 T 1200 560 L 1200 600 L 0 600 Z" />
        </g>

        {/* Winding road from bottom-left to horizon */}
        <g opacity="0.22" stroke="currentColor" fill="none" strokeLinecap="round">
          <path
            d="M 200 600 C 320 540, 380 520, 480 510 S 640 500, 720 480 T 870 430"
            strokeWidth="2.2"
          />
          {/* dashed center line */}
          <path
            d="M 220 590 C 330 535, 390 518, 485 508 S 645 498, 722 478 T 868 432"
            strokeWidth="1"
            strokeDasharray="4 7"
            opacity="0.7"
          />
        </g>

        {/* Tiny pine trees along the road */}
        <g opacity="0.2" stroke="currentColor" fill="none" strokeWidth="1.3" strokeLinejoin="round">
          {[
            [310, 560],
            [380, 545],
            [460, 532],
            [540, 522],
            [620, 510],
            [700, 498],
          ].map(([x, y], i) => (
            <g key={i}>
              <path d={`M ${x} ${y} L ${x - 6} ${y + 12} L ${x + 6} ${y + 12} Z`} />
              <line x1={x} y1={y + 12} x2={x} y2={y + 16} />
            </g>
          ))}
        </g>

        {/* Hot-air balloon (upper-left) */}
        <g opacity="0.22" transform="translate(220 130)" stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M 0 0 C -28 0, -34 26, -22 50 C -14 66, -6 72, 0 80 C 6 72, 14 66, 22 50 C 34 26, 28 0, 0 0 Z" />
          <line x1="-14" y1="0" x2="-14" y2="50" opacity="0.6" />
          <line x1="14" y1="0" x2="14" y2="50" opacity="0.6" />
          <line x1="0" y1="0" x2="0" y2="50" opacity="0.6" />
          {/* basket strings */}
          <line x1="-10" y1="80" x2="-7" y2="92" />
          <line x1="10" y1="80" x2="7" y2="92" />
          {/* basket */}
          <rect x="-9" y="92" width="18" height="9" rx="1.5" />
        </g>

        {/* Paper plane (upper-right) */}
        <g
          opacity="0.28"
          transform="translate(960 170) rotate(-15)"
          stroke="currentColor"
          fill="none"
          strokeWidth="1.4"
          strokeLinejoin="round"
        >
          <path d="M 0 0 L 60 -10 L 30 14 Z" />
          <path d="M 30 14 L 38 26" />
          <path d="M 0 0 L 30 14" />
          {/* dotted trail */}
          <path
            d="M -8 4 C -40 14, -80 12, -120 28"
            strokeDasharray="2 6"
            opacity="0.6"
          />
        </g>

        {/* Floating open book (mid-left) */}
        <g
          opacity="0.2"
          transform="translate(110 290) rotate(-10)"
          stroke="currentColor"
          fill="none"
          strokeWidth="1.3"
          strokeLinejoin="round"
        >
          <path d="M 0 0 C 14 -6, 28 -6, 42 0 L 42 30 C 28 24, 14 24, 0 30 Z" />
          <path d="M 42 0 C 56 -6, 70 -6, 84 0 L 84 30 C 70 24, 56 24, 42 30 Z" />
          <line x1="42" y1="0" x2="42" y2="30" />
          <line x1="8" y1="6" x2="34" y2="2" opacity="0.5" />
          <line x1="8" y1="12" x2="34" y2="9" opacity="0.5" />
          <line x1="50" y1="2" x2="76" y2="6" opacity="0.5" />
          <line x1="50" y1="9" x2="76" y2="12" opacity="0.5" />
        </g>

        {/* Pencil (mid-right) */}
        <g
          opacity="0.22"
          transform="translate(1050 320) rotate(35)"
          stroke="currentColor"
          fill="none"
          strokeWidth="1.3"
          strokeLinejoin="round"
        >
          <rect x="0" y="0" width="78" height="9" rx="1" />
          <path d="M 78 0 L 90 4.5 L 78 9 Z" />
          <line x1="86" y1="4.5" x2="92" y2="4.5" />
          <line x1="6" y1="0" x2="6" y2="9" opacity="0.5" />
          <line x1="14" y1="0" x2="14" y2="9" opacity="0.5" />
        </g>

        {/* Clouds */}
        <g opacity="0.18" stroke="currentColor" fill="none" strokeWidth="1.3" strokeLinecap="round">
          <path d="M 380 110 q 10 -16 26 -10 q 8 -12 22 -6 q 14 -2 18 12 q 12 4 6 18 l -78 0 q -10 -8 6 -14 z" />
          <path d="M 700 220 q 8 -12 20 -8 q 6 -9 16 -5 q 11 -2 14 9 q 9 3 4 14 l -60 0 q -8 -6 6 -10 z" />
          <path d="M 90 200 q 6 -10 16 -7 q 5 -7 13 -4 q 9 -2 11 7 q 7 3 3 11 l -48 0 q -6 -5 5 -7 z" />
        </g>

        {/* Stars / sparks */}
        <g opacity="0.3" fill="currentColor">
          {[
            [60, 80, 1.6],
            [180, 60, 1.2],
            [330, 50, 1.4],
            [560, 90, 1.1],
            [780, 60, 1.6],
            [1100, 110, 1.3],
            [40, 320, 1.2],
            [1170, 260, 1.4],
            [510, 200, 1.1],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ))}
        </g>

        {/* Tiny dotted constellation lines */}
        <g
          opacity="0.18"
          stroke="currentColor"
          fill="none"
          strokeWidth="0.9"
          strokeDasharray="1 4"
          strokeLinecap="round"
        >
          <path d="M 60 80 L 180 60 L 330 50" />
          <path d="M 780 60 L 1100 110" />
        </g>
      </svg>
    </div>
  );
}
