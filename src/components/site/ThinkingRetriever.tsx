import { useEffect, useState } from "react";
import sittingImg from "@/assets/retriever-body.png";
import runningImg from "@/assets/retriever-running.png";

type Phase = "idle" | "perk" | "run" | "gone";

export function ThinkingRetriever({ taskSelected }: { taskSelected: boolean }) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (!taskSelected) {
      setPhase("idle");
      return;
    }
    // tiny perk-up reaction → switch to running pose → gallop off-screen → gone
    setPhase("perk");
    const t1 = window.setTimeout(() => setPhase("run"), 320);
    const t2 = window.setTimeout(() => setPhase("gone"), 320 + 1100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [taskSelected]);

  if (phase === "gone") return null;

  const isRunning = phase === "run";

  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto mt-4 flex h-[200px] w-full items-end justify-center overflow-hidden sm:h-[240px]"
    >
      <style>{`
        /* Gentle waiting breath — whole body */
        @keyframes ret-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-3px) scale(1.012); }
        }
        /* Head thinking — slow tilt left/right with a tiny up nod, like a real curious dog */
        @keyframes ret-head-think {
          0%   { transform: rotate(0deg) translateY(0); }
          18%  { transform: rotate(-9deg) translateY(-1px); }
          34%  { transform: rotate(-9deg) translateY(-1px); }
          50%  { transform: rotate(2deg) translateY(0); }
          66%  { transform: rotate(10deg) translateY(-1px); }
          82%  { transform: rotate(10deg) translateY(-1px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        /* Tiny ear flick during the long head holds */
        @keyframes ret-perk {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-4px) scale(1.03); }
        }
        /* Question marks bobbing pop */
        @keyframes qmark-pop {
          0%   { transform: translateY(8px) scale(0.4); opacity: 0; }
          25%  { transform: translateY(-2px) scale(1.15); opacity: 1; }
          70%  { transform: translateY(-4px) scale(1); opacity: 1; }
          100% { transform: translateY(-12px) scale(0.85); opacity: 0; }
        }
        /* Running gallop bounce — body bobs while moving */
        @keyframes ret-gallop {
          0%   { transform: translateY(0) rotate(-2deg); }
          25%  { transform: translateY(-10px) rotate(1deg); }
          50%  { transform: translateY(0) rotate(-2deg); }
          75%  { transform: translateY(-12px) rotate(2deg); }
          100% { transform: translateY(0) rotate(-2deg); }
        }
        /* Dash: slide off to the right */
        @keyframes ret-dash-off {
          0%   { transform: translateX(0); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateX(120vw); opacity: 0; }
        }
        /* Dust puff trailing the run */
        @keyframes dust-puff {
          0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
          25%  { opacity: 0.65; }
          100% { transform: translate(-60px, -6px) scale(1.8); opacity: 0; }
        }
      `}</style>

      {/* Soft ground shadow under the dog (hidden once running) */}
      <div
        className="absolute bottom-3 left-1/2 h-3 w-36 -translate-x-1/2 rounded-[50%] bg-foreground/20 blur-md transition-opacity duration-300"
        style={{ opacity: isRunning ? 0 : 0.55 }}
      />

      {/* Dust puffs behind the dog while running */}
      {isRunning && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="absolute block h-3 w-3 rounded-full bg-foreground/30"
              style={{
                left: -10 - i * 6,
                bottom: 0,
                animation: `dust-puff 0.9s ease-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* The dog — sitting OR running */}
      <div
        className="relative"
        style={{
          animation: isRunning
            ? "ret-dash-off 1.1s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards"
            : "ret-breathe 3.2s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      >
        {/* Question marks above head — only when waiting */}
        {phase === "idle" && (
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 sm:-top-14"
            style={{ width: "70px", height: "44px" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute font-display font-black text-[oklch(0.45_0.16_35)]"
                style={{
                  left: `${i * 24}px`,
                  top: 0,
                  fontSize: "1.6rem",
                  textShadow: "0 1px 2px oklch(0.99 0.01 80 / 0.8)",
                  animation: `qmark-pop 2s ease-out ${i * 0.4}s infinite`,
                }}
              >
                ?
              </span>
            ))}
          </div>
        )}

        {isRunning ? (
          // Running pose — gallop bobbing
          <div style={{ animation: "ret-gallop 0.42s ease-in-out infinite", transformOrigin: "50% 80%" }}>
            <img
              src={runningImg}
              alt=""
              loading="lazy"
              width={1024}
              height={1024}
              className="h-[170px] w-auto object-contain drop-shadow-[0_10px_14px_oklch(0.30_0.06_45_/_0.25)] sm:h-[210px]"
            />
          </div>
        ) : (
          // Sitting pose — body still, head tilts as if thinking.
          // We layer a "head" copy on top of the full image and clip to just
          // the head/ears region, so the head can rotate independently while
          // the body underneath stays steady.
          <div className="relative">
            {/* Full body (head area will be hidden by a soft mask of the head overlay) */}
            <img
              src={sittingImg}
              alt=""
              loading="lazy"
              width={1024}
              height={1024}
              className="h-[180px] w-auto object-contain drop-shadow-[0_10px_14px_oklch(0.30_0.06_45_/_0.28)] sm:h-[220px]"
              style={{
                animation: phase === "perk" ? "ret-perk 0.32s ease-out" : undefined,
              }}
            />

            {/* Head overlay — same image, clipped to top portion, rotates around the neck */}
            <div
              className="absolute inset-0"
              style={{
                // Clip to the upper ~46% of the image — that's the head + ears region
                clipPath: "ellipse(42% 30% at 50% 26%)",
                transformOrigin: "50% 46%",
                animation:
                  phase === "perk"
                    ? "ret-perk 0.32s ease-out"
                    : "ret-head-think 4.2s ease-in-out infinite",
              }}
            >
              <img
                src={sittingImg}
                alt=""
                loading="lazy"
                width={1024}
                height={1024}
                className="h-[180px] w-auto object-contain sm:h-[220px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
