import { useState } from "react";
import { Check } from "lucide-react";

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
    bg: "linear-gradient(160deg, oklch(0.95 0.06 70) 0%, oklch(0.92 0.1 60) 100%)",
    pill: "linear-gradient(135deg, oklch(0.72 0.17 55) 0%, oklch(0.68 0.19 40) 100%)",
    accent: "oklch(0.62 0.19 40)",
    accentSoft: "oklch(0.94 0.07 55)",
  },
  {
    id: "general",
    label: "IELTS General",
    bg: "linear-gradient(160deg, oklch(0.62 0.19 35) 0%, oklch(0.5 0.18 25) 100%)",
    pill: "linear-gradient(135deg, oklch(0.95 0.05 70) 0%, oklch(0.9 0.08 60) 100%)",
    accent: "oklch(0.55 0.2 30)",
    accentSoft: "oklch(0.95 0.06 60)",
  },
] as const;

type ModuleId = (typeof modules)[number]["id"];

export function ModuleFeatures() {
  const [active, setActive] = useState<ModuleId>("academic");
  const current = modules.find((m) => m.id === active)!;
  const isDark = active === "general";

  return (
    <section
      className="relative py-20 sm:py-28 transition-[background] duration-700 ease-out"
      style={{ background: current.bg }}
    >
      <div className="container-page">
        <div className="text-center">
          <h2
            className={`font-display text-3xl font-extrabold uppercase tracking-[0.08em] sm:text-5xl transition-colors duration-500 ${
              isDark ? "text-white" : "text-foreground"
            }`}
          >
            Select Your IELTS
          </h2>
          <p
            className={`mx-auto mt-4 max-w-xl text-base font-medium transition-colors duration-500 ${
              isDark ? "text-white/80" : "text-foreground/70"
            }`}
          >
            Pick your module — same powerful prep, tailored to your test.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-10 flex justify-center">
          <div
            className={`inline-flex rounded-full p-1.5 shadow-card transition-colors duration-500 ${
              isDark ? "bg-white/10 backdrop-blur" : "bg-white/70 backdrop-blur"
            }`}
          >
            {modules.map((m) => {
              const isActive = active === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className={`relative rounded-full px-6 py-3 text-sm font-extrabold transition-all sm:px-9 sm:text-base ${
                    isActive
                      ? "text-white shadow-lg"
                      : isDark
                        ? "text-white/80 hover:text-white"
                        : "text-foreground/70 hover:text-foreground"
                  }`}
                  style={isActive ? { background: m.pill, color: m.id === "general" ? "oklch(0.3 0.1 30)" : "white" } : undefined}
                  aria-pressed={isActive}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature card */}
        <div
          key={active}
          className="mx-auto mt-12 max-w-4xl animate-in fade-in-0 slide-in-from-bottom-3 duration-500"
        >
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.3)] sm:p-10">
            <div className="mb-6 flex items-center justify-between">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider"
                style={{ background: current.accentSoft, color: current.accent }}
              >
                {current.label} · What you get
              </span>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                    style={{ background: current.accent }}
                  >
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                  <div>
                    <h4 className="font-display text-base font-extrabold tracking-tight text-foreground sm:text-lg">
                      {f.title}
                    </h4>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
