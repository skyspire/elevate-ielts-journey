import { useEffect, useRef, useState } from "react";


const stats = [
  { target: 1300, suffix: "+", label: "Writing Questions" },
  { target: 4500, suffix: "+", label: "Speaking Questions" },
  { target: 170, suffix: "+", label: "Cue Cards" },
  { target: 4000, suffix: "+", label: "Active Users" },
];

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
      {/* Muted sage / olive wash with subtle organic texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 18% 15%, oklch(0.92 0.04 145 / 0.7) 0%, transparent 65%)," +
            "radial-gradient(ellipse 65% 55% at 88% 85%, oklch(0.88 0.05 130 / 0.65) 0%, transparent 65%)," +
            "linear-gradient(180deg, oklch(0.93 0.03 140) 0%, oklch(0.9 0.04 135) 100%)",
        }}
      />
      {/* Faint grain for realism */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.4 0.05 130 / 0.18) 1px, transparent 1.2px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="container-page relative z-10">
        <div className="mb-14 text-center">
          <p className="font-handwriting text-2xl text-[oklch(0.55_0.16_30)] sm:text-3xl">
            by the numbers
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[oklch(0.18_0.03_60)] sm:text-4xl">
            Built for serious IELTS prep
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {stats.map((s) => (
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
  stat: (typeof stats)[number];
  run: boolean;
}) {
  const value = useCountUp(stat.target, run);
  const progress = stat.target === 0 ? 0 : value / stat.target;

  return (
    <div
      className="group relative flex flex-col items-center rounded-2xl px-5 py-8 text-center sm:px-6 sm:py-10"
      style={{
        background:
          "linear-gradient(180deg, oklch(1 0 0 / 0.55) 0%, oklch(1 0 0 / 0.35) 100%)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        boxShadow:
          "inset 0 1px 0 oklch(1 0 0 / 0.7), 0 1px 2px oklch(0.3 0.04 60 / 0.06), 0 18px 40px -12px oklch(0.3 0.04 60 / 0.18)",
        border: "1px solid oklch(1 0 0 / 0.5)",
      }}
    >
      <div className="font-display text-5xl font-black tabular-nums tracking-tight text-[oklch(0.16_0.03_60)] sm:text-6xl md:text-[64px]">
        {value.toLocaleString()}
        <span className="text-[oklch(0.55_0.18_30)]">{stat.suffix}</span>
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
          stroke="oklch(0.55 0.18 30)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="220"
          strokeDashoffset={220 * (1 - progress)}
          style={{ transition: "stroke-dashoffset 60ms linear" }}
        />
      </svg>

      <div className="mt-4 font-display text-sm font-bold uppercase tracking-[0.18em] text-[oklch(0.32_0.04_60)] sm:text-[15px]">
        {stat.label}
      </div>
    </div>
  );
}
