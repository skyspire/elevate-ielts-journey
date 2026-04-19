import { useState, useEffect, useId } from "react";

const features = [
  {
    title: "All-new Writing & Speaking questions",
    desc: "Fresh questions paired with Band 8+ model answers you can learn from instantly.",
  },
  {
    title: "600+ previous year questions",
    desc: "The questions that actually repeat — with updated sample answers for real practice.",
  },
  {
    title: "Selected prediction questions",
    desc: "Hand-picked predictions for upcoming exams so you walk in already prepared.",
  },
  {
    title: "Vocabulary Builder",
    desc: "Words, phrases, phrasal verbs and slang to lift your lexical resource score.",
  },
  {
    title: "Topic-wise organized questions",
    desc: "Drill exactly what you need — every question grouped by topic for fast practice.",
  },
  {
    title: "30+ Survival Kits",
    desc: "Battle-tested kits designed to significantly boost your overall IELTS band score.",
  },
];

const modules = [
  {
    id: "academic",
    label: "IELTS Academic",
    ink: "oklch(0.45 0.16 35)", // warm sienna ink
    inkSoft: "oklch(0.92 0.06 55)",
  },
  {
    id: "general",
    label: "IELTS General",
    ink: "oklch(0.38 0.12 200)", // deep teal ink
    inkSoft: "oklch(0.92 0.05 200)",
  },
] as const;

type ModuleId = (typeof modules)[number]["id"];

export function ModuleFeatures() {
  const [active, setActive] = useState<ModuleId>("academic");
  const [drawKey, setDrawKey] = useState(0);
  const current = modules.find((m) => m.id === active)!;
  const circleId = useId();

  // Re-trigger circle draw on toggle
  useEffect(() => {
    setDrawKey((k) => k + 1);
  }, [active]);

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{
        background:
          "radial-gradient(at 20% 10%, oklch(0.97 0.02 80) 0%, transparent 50%), radial-gradient(at 80% 90%, oklch(0.96 0.025 60) 0%, transparent 50%), oklch(0.985 0.012 75)",
      }}
    >
      {/* Paper texture: subtle noise + faint ruled lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 39px, oklch(0.55 0.05 60 / 0.07) 39px, oklch(0.55 0.05 60 / 0.07) 40px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.4 0.05 60 / 0.18) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="container-page relative">
        {/* Heading with doodle circle around IELTS */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-[0.06em] text-foreground sm:text-5xl">
            Select Your{" "}
            <span className="relative inline-block px-2 sm:px-3">
              <span className="relative z-10">IELTS</span>
              {/* Hand-drawn animated circle */}
              <svg
                key={drawKey}
                aria-hidden
                viewBox="0 0 200 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                style={{ overflow: "visible" }}
              >
                <path
                  id={circleId}
                  d="M 100 8 C 155 8, 192 28, 192 50 C 192 74, 150 92, 98 92 C 48 92, 8 74, 8 50 C 8 30, 42 12, 96 8 C 120 7, 150 12, 175 22"
                  fill="none"
                  stroke={current.ink}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 600,
                    strokeDashoffset: 600,
                    animation: "doodle-draw 1.2s ease-out forwards",
                    filter: "url(#wobble)",
                  }}
                />
                <defs>
                  <filter id="wobble">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" />
                    <feDisplacementMap in="SourceGraphic" scale="2.5" />
                  </filter>
                </defs>
              </svg>
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-medium text-foreground/65">
            Pick your module — same powerful prep, tailored to your test.
          </p>
        </div>

        {/* Toggle — paper tab style */}
        <div className="mt-10 flex justify-center">
          <div
            className="inline-flex rounded-full border-2 p-1.5"
            style={{
              borderColor: "oklch(0.3 0.04 60 / 0.85)",
              background: "oklch(0.99 0.005 80)",
              boxShadow: "3px 3px 0 0 oklch(0.3 0.04 60 / 0.85)",
            }}
          >
            {modules.map((m) => {
              const isActive = active === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className="relative rounded-full px-5 py-2.5 text-sm font-extrabold transition-all sm:px-8 sm:text-base"
                  style={{
                    background: isActive ? m.ink : "transparent",
                    color: isActive ? "oklch(0.99 0.005 80)" : "oklch(0.3 0.04 60)",
                  }}
                  aria-pressed={isActive}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stacked feature rows */}
        <div
          key={active}
          className="mx-auto mt-16 max-w-3xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
        >
          <ul className="flex flex-col">
            {features.map((f, i) => (
              <li
                key={f.title}
                className="group relative flex items-start gap-5 border-b-2 border-dashed py-7 sm:gap-8 sm:py-8"
                style={{ borderColor: "oklch(0.3 0.04 60 / 0.25)" }}
              >
                {/* Big handwritten-style number */}
                <span
                  className="font-display text-4xl font-extrabold tabular-nums sm:text-6xl"
                  style={{
                    color: current.ink,
                    transform: `rotate(${i % 2 === 0 ? -3 : 2}deg)`,
                    display: "inline-block",
                    minWidth: "3.5rem",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 pt-1">
                  <h4 className="font-display text-lg font-extrabold tracking-tight text-foreground sm:text-2xl">
                    {f.title}
                  </h4>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/70 sm:text-base">
                    {f.desc}
                  </p>
                </div>

                {/* Tiny doodle arrow on hover */}
                <svg
                  aria-hidden
                  viewBox="0 0 40 20"
                  className="mt-2 hidden h-5 w-10 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
                  style={{ color: current.ink }}
                >
                  <path
                    d="M 2 10 Q 18 4, 32 10 M 26 5 L 34 10 L 26 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes doodle-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </section>
  );
}
