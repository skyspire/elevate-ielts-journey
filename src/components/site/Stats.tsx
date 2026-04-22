import { useEffect, useRef, useState } from "react";

const stats = [
  { target: 1300, suffix: "+", label: "Writing Questions", hue: 285 },
  { target: 4500, suffix: "+", label: "Speaking Questions", hue: 195 },
  { target: 170, suffix: "+", label: "Cue Cards", hue: 70 },
  { target: 4000, suffix: "+", label: "Active Users", hue: 15 },
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
      {/* Base deep gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.06 285) 0%, oklch(0.16 0.07 250) 55%, oklch(0.18 0.08 220) 100%)",
        }}
      />
      {/* Animated mesh blobs (indigo / teal / rose) */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
        <div
          className="mesh-blob absolute -left-[10%] -top-[20%] h-[60vh] w-[60vh] rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.22 285 / 0.9), transparent 60%)" }}
        />
        <div
          className="mesh-blob absolute right-[-15%] top-[10%] h-[55vh] w-[55vh] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.18 195 / 0.85), transparent 60%)", animationDelay: "-7s" }}
        />
        <div
          className="mesh-blob absolute bottom-[-20%] left-[30%] h-[50vh] w-[50vh] rounded-full opacity-55 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.6 0.2 15 / 0.8), transparent 60%)", animationDelay: "-14s" }}
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
  const Icon = stat.icon;
  return (
    <div className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07]">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[oklch(0.85_0.14_70)] ring-1 ring-white/15">
        <Icon className="h-5 w-5" />
      </span>
      <div
        className="font-display text-4xl font-extrabold tracking-tight tabular-nums text-white sm:text-5xl md:text-6xl"
        style={{
          textShadow: "0 0 24px oklch(0.7 0.18 255 / 0.25)",
        }}
      >
        {value.toLocaleString()}
        <span className="text-[oklch(0.85_0.14_70)]">{stat.suffix}</span>
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-wider text-white/60 sm:text-[13px]">
        {stat.label}
      </div>
    </div>
  );
}
