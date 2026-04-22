import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 1300, suffix: "+", label: "Writing Questions", hue: 285 },
  { target: 4500, suffix: "+", label: "Speaking Questions", hue: 320 },
  { target: 170, suffix: "+", label: "Cue Cards", hue: 55 },
  { target: 4000, suffix: "+", label: "Active Users", hue: 25 },
];

/* easeOutCubic — fast at start, gently decelerates */
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
      className="relative isolate overflow-hidden py-20 sm:py-28"
    >
      {/* Base — deep indigo → plum → warm rose, bridges to the cream hero */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.22 0.07 280) 0%, oklch(0.22 0.09 320) 55%, oklch(0.26 0.1 25) 100%)",
        }}
      />
      {/* Animated mesh blobs — brand-aligned hues */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        <div
          className="mesh-blob absolute -left-[10%] -top-[20%] h-[60vh] w-[60vh] rounded-full opacity-65 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.22 285 / 0.9), transparent 60%)" }}
        />
        <div
          className="mesh-blob absolute right-[-15%] top-[5%] h-[55vh] w-[55vh] rounded-full opacity-55 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.62 0.2 340 / 0.85), transparent 60%)", animationDelay: "-7s" }}
        />
        <div
          className="mesh-blob absolute bottom-[-20%] left-[28%] h-[55vh] w-[55vh] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.2 35 / 0.85), transparent 60%)", animationDelay: "-14s" }}
        />
      </div>
      {/* Particle field */}
      <ParticleField />
      {/* hairlines */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.85 0.1 280 / 0.5), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.85 0.1 220 / 0.4), transparent)" }}
      />

      <div className="container-page relative z-10">
        <div className="mb-12 text-center">
          <p className="font-handwriting text-2xl text-[oklch(0.85_0.14_70)] sm:text-3xl">
            by the numbers
          </p>
          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Built for serious IELTS prep
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} stat={s} run={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Drifting particles — pure CSS, no Lottie payload, GPU-friendly. */
function ParticleField() {
  // Deterministic pseudo-random positions so SSR matches client.
  const particles = Array.from({ length: 28 }, (_, i) => {
    const seed = (n: number) => ((Math.sin((i + 1) * n) + 1) / 2);
    const left = (seed(12.9898) * 100).toFixed(2);
    const size = 2 + seed(78.233) * 4;
    const dur = 16 + seed(37.719) * 18;
    const delay = -seed(91.345) * dur;
    const drift = (seed(45.164) - 0.5) * 80;
    const opacity = 0.35 + seed(23.51) * 0.5;
    const hue = 200 + Math.floor(seed(11.7) * 120); // teal → violet → rose
    return { left, size, dur, delay, drift, opacity, hue, key: i };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.key}
          className="particle absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: `oklch(0.85 0.14 ${p.hue})`,
            boxShadow: `0 0 ${p.size * 3}px oklch(0.8 0.18 ${p.hue} / 0.7)`,
            ["--pd" as any]: `${p.dur}s`,
            ["--pdelay" as any]: `${p.delay}s`,
            ["--pdx" as any]: `${p.drift}px`,
            ["--ps" as any]: 1,
            ["--po" as any]: p.opacity,
          }}
        />
      ))}
    </div>
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
  const progress = stat.target === 0 ? 1 : value / stat.target;
  // Arc geometry: 80% of a circle (open at the bottom), r=44
  const r = 44;
  const C = 2 * Math.PI * r;
  const arcLen = C * 0.8;
  const dashOffset = arcLen * (1 - progress);

  return (
    <div className="group relative flex flex-col items-center text-center">
      {/* Animated arc — draws as the counter runs */}
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-[126deg]">
          <defs>
            <linearGradient id={`arc-${stat.hue}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={`oklch(0.85 0.16 ${stat.hue})`} />
              <stop offset="100%" stopColor={`oklch(0.7 0.2 ${(stat.hue + 60) % 360})`} />
            </linearGradient>
          </defs>
          {/* track */}
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="oklch(1 0 0 / 0.08)"
            strokeWidth="3"
            strokeDasharray={`${arcLen} ${C}`}
            strokeLinecap="round"
          />
          {/* progress */}
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={`url(#arc-${stat.hue})`}
            strokeWidth="3"
            strokeDasharray={`${arcLen} ${C}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 60ms linear",
              filter: `drop-shadow(0 0 6px oklch(0.8 0.18 ${stat.hue} / 0.6))`,
            }}
          />
          {/* glowing endpoint dot */}
          {progress > 0.02 && (
            <circle
              cx={50 + r * Math.cos((progress * 0.8 * 2 * Math.PI))}
              cy={50 + r * Math.sin((progress * 0.8 * 2 * Math.PI))}
              r="3"
              fill={`oklch(0.95 0.16 ${stat.hue})`}
              style={{ filter: `drop-shadow(0 0 8px oklch(0.9 0.2 ${stat.hue}))` }}
            />
          )}
        </svg>

        {/* Number centered inside the arc */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-display text-3xl font-black tabular-nums tracking-tight text-white sm:text-4xl"
            style={{ textShadow: `0 2px 24px oklch(0.7 0.22 ${stat.hue} / 0.55), 0 0 1px oklch(1 0 0 / 0.4)` }}
          >
            {value.toLocaleString()}
            <span style={{ color: `oklch(0.88 0.18 ${stat.hue})` }}>{stat.suffix}</span>
          </span>
        </div>
      </div>

      <div
        className="mt-5 font-display text-sm font-bold uppercase tracking-[0.22em] text-white sm:text-[15px]"
        style={{ textShadow: "0 1px 12px oklch(0.2 0.05 280 / 0.6)" }}
      >
        {stat.label}
      </div>
    </div>
  );
}
