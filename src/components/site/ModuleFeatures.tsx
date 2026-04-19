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

        {/* Feature card with CTA */}
        <div
          key={active}
          className="mx-auto mt-14 max-w-3xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
        >
          <div
            className="rounded-3xl border-2 bg-white/80 p-6 backdrop-blur-sm sm:p-10"
            style={{
              borderColor: "oklch(0.3 0.04 60 / 0.85)",
              boxShadow: "6px 6px 0 0 oklch(0.3 0.04 60 / 0.85)",
            }}
          >
            <ul className="flex flex-col">
              {features.map((f, i) => (
                <li
                  key={f.title}
                  className="group relative flex items-start gap-4 border-b-2 border-dashed py-5 last:border-b-0 sm:gap-7 sm:py-6"
                  style={{ borderColor: "oklch(0.3 0.04 60 / 0.22)" }}
                >
                  <span
                    className="font-display text-3xl font-extrabold tabular-nums sm:text-5xl"
                    style={{
                      color: current.ink,
                      transform: `rotate(${i % 2 === 0 ? -3 : 2}deg)`,
                      display: "inline-block",
                      minWidth: "3rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 pt-1">
                    <h4 className="font-display text-base font-extrabold tracking-tight text-foreground sm:text-xl">
                      {f.title}
                    </h4>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground/70 sm:text-[15px]">
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Persuasive CTA line */}
            <div className="mt-8 border-t-2 border-dashed pt-8 text-center" style={{ borderColor: "oklch(0.3 0.04 60 / 0.25)" }}>
              <p className="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                Get full access to all questions <br className="sm:hidden" />
                and high band sample answers
              </p>
              <p className="mt-2 text-sm font-medium text-foreground/65">
                Choose a plan and start practicing in under a minute.
              </p>

              {/* Plan buttons */}
              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-end sm:gap-4">
                {/* 15 Days */}
                <button
                  className="group/btn relative rounded-2xl px-6 py-4 font-display text-base font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] sm:flex-1"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.7 0.18 50), oklch(0.62 0.2 40))",
                    boxShadow: "0 6px 0 0 oklch(0.45 0.16 40), 0 10px 20px -8px oklch(0.5 0.18 45 / 0.5)",
                  }}
                >
                  <span className="block text-xs font-bold uppercase tracking-widest opacity-90">15 Days</span>
                  <span className="mt-0.5 block text-2xl font-extrabold">7 CAD</span>
                </button>

                {/* 1 Month — most popular */}
                <div className="relative sm:flex-[1.15]">
                  <span
                    className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md"
                    style={{ background: "oklch(0.55 0.2 30)" }}
                  >
                    ★ Most Popular
                  </span>
                  <button
                    className="group/btn relative w-full rounded-2xl px-6 py-5 font-display text-base font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03]"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.45 0.18 250), oklch(0.35 0.2 265))",
                      boxShadow: "0 8px 0 0 oklch(0.28 0.16 260), 0 14px 28px -8px oklch(0.4 0.2 260 / 0.6)",
                    }}
                  >
                    <span className="block text-xs font-bold uppercase tracking-widest opacity-90">1 Month</span>
                    <span className="mt-0.5 block text-3xl font-extrabold">12 CAD</span>
                  </button>
                </div>

                {/* 3 Months — premium dark */}
                <button
                  className="group/btn relative rounded-2xl px-6 py-4 font-display text-base font-extrabold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] sm:flex-1"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.32 0.05 60), oklch(0.22 0.04 50))",
                    boxShadow: "0 6px 0 0 oklch(0.15 0.03 50), 0 10px 20px -8px oklch(0.2 0.04 50 / 0.6)",
                  }}
                >
                  <span className="block text-xs font-bold uppercase tracking-widest opacity-80">3 Months</span>
                  <span className="mt-0.5 block text-2xl font-extrabold">29 CAD</span>
                </button>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Cancel anytime · Instant access
              </p>
            </div>
          </div>
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
