import { useEffect, useRef, useState } from "react";
import { PenLine, Mic, BookOpen, Users } from "lucide-react";

const stats = [
  { target: 1300, suffix: "+", label: "Writing Questions", icon: PenLine },
  { target: 4500, suffix: "+", label: "Speaking Questions", icon: Mic },
  { target: 170, suffix: "+", label: "Cue Cards", icon: BookOpen },
  { target: 4000, suffix: "+", label: "Active Users", icon: Users },
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
      {/* Distinct cool slate gradient — contrasts the warm hero above */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 20%, oklch(0.32 0.06 260 / 0.95) 0%, transparent 65%)," +
            "radial-gradient(ellipse 55% 50% at 85% 80%, oklch(0.35 0.08 240 / 0.85) 0%, transparent 65%)," +
            "linear-gradient(180deg, oklch(0.22 0.04 260) 0%, oklch(0.18 0.05 250) 100%)",
        }}
      />
      {/* fine grid for editorial feel */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.95 0.01 250) 1px, transparent 1px)," +
            "linear-gradient(90deg, oklch(0.95 0.01 250) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
        }}
      />
      {/* glowing top + bottom hairlines */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.7 0.18 255 / 0.6), transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.7 0.18 255 / 0.4), transparent)",
        }}
      />

      <div className="container-page relative z-10">
        <div className="mb-12 text-center">
          <p className="font-handwriting text-2xl text-[oklch(0.85_0.12_70)] sm:text-3xl">
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
