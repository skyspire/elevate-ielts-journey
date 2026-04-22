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
    setPhase("perk");
    const t1 = window.setTimeout(() => setPhase("run"), 280);
    const t2 = window.setTimeout(() => setPhase("gone"), 280 + 1600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [taskSelected]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto mt-4 flex h-[200px] w-full items-end justify-center sm:h-[240px]"
    >
      <style>{`
        /* Sitting body breathing */
        @keyframes ret-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-3px) scale(1.012); }
        }
        /* Head thinking — slow tilt left/right */
        @keyframes ret-head-think {
          0%   { transform: rotate(0deg); }
          18%  { transform: rotate(-9deg); }
          34%  { transform: rotate(-9deg); }
          50%  { transform: rotate(2deg); }
          66%  { transform: rotate(10deg); }
          82%  { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes ret-perk {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-8px) scale(1.06); }
        }
        @keyframes qmark-pop {
          0%   { transform: translateY(8px) scale(0.4); opacity: 0; }
          25%  { transform: translateY(-2px) scale(1.15); opacity: 1; }
          70%  { transform: translateY(-4px) scale(1); opacity: 1; }
          100% { transform: translateY(-12px) scale(0.85); opacity: 0; }
        }
        /* Combined gallop: bouncing up/down while sliding right off-screen */
        @keyframes ret-run-across {
          0%   { transform: translate(0, 0) rotate(-2deg); opacity: 1; }
          10%  { transform: translate(8vw, -12px) rotate(2deg); opacity: 1; }
          20%  { transform: translate(18vw, 0) rotate(-2deg); opacity: 1; }
          30%  { transform: translate(28vw, -14px) rotate(2deg); opacity: 1; }
          40%  { transform: translate(38vw, 0) rotate(-2deg); opacity: 1; }
          55%  { transform: translate(55vw, -12px) rotate(2deg); opacity: 1; }
          75%  { transform: translate(80vw, -8px) rotate(-1deg); opacity: 1; }
          100% { transform: translate(140vw, 0) rotate(0deg); opacity: 0; }
        }
        @keyframes dust-puff {
          0%   { transform: translate(0, 0) scale(0.5); opacity: 0; }
          25%  { opacity: 0.55; }
          100% { transform: translate(-50px, -4px) scale(1.6); opacity: 0; }
        }
      `}</style>

      {/* Soft ground shadow under the dog (only while sitting) */}
      {phase !== "run" && (
        <div
          className="absolute bottom-3 left-1/2 h-3 w-36 -translate-x-1/2 rounded-[50%] bg-foreground/20 blur-md"
          style={{ opacity: 0.55 }}
        />
      )}

      {phase === "run" ? (
        // Running across the screen using the transparent running PNG
        <div
          className="absolute bottom-2 left-1/2 -ml-[100px] sm:-ml-[120px]"
          style={{
            animation: "ret-run-across 1.6s cubic-bezier(0.4, 0, 0.6, 1) forwards",
            willChange: "transform, opacity",
          }}
        >
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
        // Sitting + thinking
        <div
          className="relative"
          style={{
            animation: "ret-breathe 3.2s ease-in-out infinite",
            willChange: "transform",
          }}
        >
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

          <div className="relative">
            <img
              src={sittingImg}
              alt=""
              loading="lazy"
              width={1024}
              height={1024}
              className="h-[180px] w-auto object-contain drop-shadow-[0_10px_14px_oklch(0.30_0.06_45_/_0.28)] sm:h-[220px]"
              style={{
                animation: phase === "perk" ? "ret-perk 0.28s ease-out" : undefined,
              }}
            />
            {/* Head overlay — tilts independently while body stays still */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "ellipse(42% 30% at 50% 26%)",
                transformOrigin: "50% 46%",
                animation:
                  phase === "perk"
                    ? "ret-perk 0.28s ease-out"
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
        </div>
      )}
    </div>
  );
}
