import { useEffect, useRef, useState } from "react";
import { useCmsSection } from "@/lib/admin/cms-store";
import { STATS_KEY, STATS_DEFAULT } from "@/lib/admin/defaults";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, run: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (!run || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setVal(Math.round(ease(t) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return val;
}

export function Stats() {
  const content = useCmsSection(STATS_KEY, STATS_DEFAULT);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      {/* Midnight aurora — deep navy base with violet & indigo light blooms */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.06 270) 0%, oklch(0.14 0.07 280) 50%, oklch(0.12 0.06 285) 100%)",
        }}
      />
      {/* Soft blurred aurora blooms */}
      <div
        aria-hidden
        className="absolute inset-0 -z-25"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 15% 20%, oklch(0.55 0.22 295 / 0.55) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 40% at 85% 30%, oklch(0.6 0.2 250 / 0.5) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 50% at 50% 90%, oklch(0.5 0.24 320 / 0.45) 0%, transparent 65%)," +
            "radial-gradient(ellipse 40% 35% at 90% 80%, oklch(0.58 0.18 220 / 0.4) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      {/* Subtle star/noise grain for depth */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-[0.25] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.95 0.02 270 / 0.6) 0.5px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
      {/* Top & bottom edge vignette for cinematic finish */}
      <div
        aria-hidden
        className="absolute inset-0 -z-15 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.1 0.05 280 / 0.6) 0%, transparent 15%, transparent 85%, oklch(0.1 0.05 280 / 0.6) 100%)",
        }}
      />

      <div className="container-page relative z-10">
        <div className="mb-14 text-center">
          <p className="font-handwriting text-2xl text-[oklch(0.85_0.14_60)] sm:text-3xl">
            {content.eyebrow}
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[oklch(0.98_0.01_270)] sm:text-4xl">
            {content.heading}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {content.items.map((s) => (
            <StatCard key={s.label} stat={s} run={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  run,
}: {
  stat: { target: number; suffix: string; label: string };
  run: boolean;
}) {
  const value = useCountUp(stat.target, run);
  const progress = stat.target === 0 ? 0 : value / stat.target;

  return (
    <div
      className="group relative flex flex-col items-center rounded-2xl px-5 py-8 text-center sm:px-6 sm:py-10"
      style={{
        background:
          "linear-gradient(180deg, oklch(1 0 0 / 0.12) 0%, oklch(1 0 0 / 0.05) 100%)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        boxShadow:
          "inset 0 1px 0 oklch(1 0 0 / 0.25), 0 1px 2px oklch(0 0 0 / 0.2), 0 20px 50px -12px oklch(0.1 0.06 280 / 0.6)",
        border: "1px solid oklch(1 0 0 / 0.18)",
      }}
    >
      <div className="font-display text-5xl font-black tabular-nums tracking-tight text-[oklch(0.98_0.01_270)] sm:text-6xl md:text-[64px]">
        {value.toLocaleString()}
        <span className="text-[oklch(0.82_0.16_55)]">{stat.suffix}</span>
      </div>

      {/* Hand-drawn underline that draws as the counter runs */}
      <svg
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className="mt-2 h-3 w-32"
        aria-hidden
      >
        <path
          d="M4 8 C 40 2, 90 12, 130 6 S 190 4, 196 9"
          fill="none"
          stroke="oklch(0.82 0.16 55)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="220"
          strokeDashoffset={220 * (1 - progress)}
          style={{ transition: "stroke-dashoffset 60ms linear" }}
        />
      </svg>

      <div className="mt-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-[oklch(0.85_0.03_270)] sm:text-[15px]">
        {stat.label}
      </div>
    </div>
  );
}
