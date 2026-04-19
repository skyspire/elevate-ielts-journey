import type { CSSProperties } from "react";

/* Scattered hand-drawn doodles for cream paper sections.
   Subtle, decorative, pointer-events disabled. */
export function DoodleAccents({ density = "normal" }: { density?: "sparse" | "normal" | "dense" }) {
  const items =
    density === "sparse" ? doodles.slice(0, 6) : density === "dense" ? doodles : doodles.slice(0, 10);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((d, i) => (
        <svg
          key={i}
          viewBox="0 0 40 40"
          className="absolute"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            color: "oklch(0.35 0.05 60 / 0.5)",
            transform: `rotate(${d.rot}deg)`,
          }}
        >
          {d.path}
        </svg>
      ))}
    </div>
  );
}

const star = (
  <path
    d="M20 6 L22 18 L34 20 L22 22 L20 34 L18 22 L6 20 L18 18 Z"
    fill="currentColor"
    opacity="0.7"
  />
);
const sparkle = (
  <path
    d="M20 4 L21 19 L36 20 L21 21 L20 36 L19 21 L4 20 L19 19 Z"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  />
);
const arrow = (
  <path
    d="M4 20 Q18 12 34 20 M28 14 L34 20 L28 26"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);
const squiggle = (
  <path
    d="M4 22 Q10 12, 16 22 T28 22 T36 22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
);
const cross = (
  <path
    d="M10 10 L30 30 M30 10 L10 30"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
);
const dot = <circle cx="20" cy="20" r="3" fill="currentColor" />;

const doodles = [
  { top: "8%", left: "6%", size: 28, rot: -10, path: star },
  { top: "14%", left: "88%", size: 32, rot: 12, path: sparkle },
  { top: "30%", left: "12%", size: 36, rot: -20, path: arrow },
  { top: "22%", left: "70%", size: 22, rot: 0, path: cross },
  { top: "48%", left: "92%", size: 26, rot: 18, path: star },
  { top: "55%", left: "4%", size: 30, rot: 5, path: squiggle },
  { top: "70%", left: "82%", size: 34, rot: -8, path: sparkle },
  { top: "78%", left: "20%", size: 24, rot: 22, path: cross },
  { top: "88%", left: "60%", size: 28, rot: -14, path: arrow },
  { top: "40%", left: "48%", size: 14, rot: 0, path: dot },
  { top: "62%", left: "44%", size: 16, rot: 0, path: dot },
  { top: "18%", left: "40%", size: 20, rot: 30, path: cross },
];

/* Decorative washi tape strips at the corners of a card/section.
   Use inside a relatively positioned element. */
export function WashiTape({
  position = "top-left",
  color = "mint",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: "mint" | "peach" | "lilac" | "kraft";
}) {
  const tones: Record<string, string> = {
    mint: "oklch(0.85 0.08 165 / 0.75)",
    peach: "oklch(0.85 0.09 55 / 0.75)",
    lilac: "oklch(0.85 0.08 295 / 0.75)",
    kraft: "oklch(0.7 0.08 70 / 0.75)",
  };
  const positions: Record<string, CSSProperties> = {
    "top-left": { top: -10, left: 24, transform: "rotate(-8deg)" },
    "top-right": { top: -10, right: 24, transform: "rotate(7deg)" },
    "bottom-left": { bottom: -10, left: 24, transform: "rotate(6deg)" },
    "bottom-right": { bottom: -10, right: 24, transform: "rotate(-7deg)" },
  };
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute h-7 w-24 rounded-[2px]"
      style={{
        ...positions[position],
        background: `repeating-linear-gradient(135deg, ${tones[color]} 0 8px, oklch(1 0 0 / 0.3) 8px 14px)`,
        boxShadow: "0 2px 6px oklch(0.3 0.04 60 / 0.15)",
      }}
    />
  );
}
