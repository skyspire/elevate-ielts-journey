import { useEffect, useMemo, useState } from "react";
import sittingImg from "@/assets/retriever-body.png";
import runningImg from "@/assets/retriever-running.png";

type SelectedTask = "task1" | "task2" | null;
type Phase = "idle" | "perk" | "run" | "gone";

export function ThinkingRetriever({ selectedTask }: { selectedTask: SelectedTask }) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (!selectedTask) {
      setPhase("idle");
      return;
    }

    setPhase("perk");
    const perkTimer = window.setTimeout(() => setPhase("run"), 380);

    return () => {
      window.clearTimeout(perkTimer);
    };
  }, [selectedTask]);

  const questionMarks = useMemo(() => [0, 1, 2], []);
  const dustPuffs = useMemo(() => [0, 1, 2, 3], []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none relative z-10 mx-auto mt-4 flex h-[220px] w-full items-end justify-center sm:h-[260px]"
    >
      <style>{`
        @keyframes ret-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.015); }
        }
        @keyframes ret-head-think {
          0% { transform: rotate(0deg); }
          18% { transform: rotate(-9deg); }
          34% { transform: rotate(-9deg); }
          50% { transform: rotate(2deg); }
          66% { transform: rotate(10deg); }
          82% { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes ret-perk {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.08); }
        }
        @keyframes qmark-pop {
          0% { transform: translateY(8px) scale(0.4); opacity: 0; }
          25% { transform: translateY(-2px) scale(1.15); opacity: 1; }
          70% { transform: translateY(-4px) scale(1); opacity: 1; }
          100% { transform: translateY(-12px) scale(0.85); opacity: 0; }
        }
        @keyframes ret-run-across {
          0% { transform: translate(0, 0) rotate(-3deg) scale(1); opacity: 1; }
          12% { transform: translate(8vw, -14px) rotate(2deg) scale(1.01); opacity: 1; }
          24% { transform: translate(18vw, 0) rotate(-2deg) scale(1); opacity: 1; }
          36% { transform: translate(30vw, -16px) rotate(2deg) scale(1.01); opacity: 1; }
          48% { transform: translate(44vw, 0) rotate(-2deg) scale(1); opacity: 1; }
          62% { transform: translate(62vw, -14px) rotate(1deg) scale(1.01); opacity: 1; }
          78% { transform: translate(88vw, 0) rotate(-1deg) scale(1); opacity: 1; }
          100% { transform: translate(128vw, -4px) rotate(0deg) scale(0.98); opacity: 0; }
        }
        @keyframes dust-puff {
          0% { transform: translate(0, 0) scale(0.45); opacity: 0; }
          30% { opacity: 0.5; }
          100% { transform: translate(-46px, -8px) scale(1.7); opacity: 0; }
        }
      `}</style>

      {phase !== "run" && (
        <div className="absolute bottom-3 left-1/2 h-3 w-36 -translate-x-1/2 rounded-[50%] bg-foreground/20 blur-md" />
      )}

      {phase === "run" ? (
        <div
          className="absolute bottom-1 left-1/2 -ml-[108px] sm:-ml-[128px]"
          onAnimationEnd={() => setPhase("gone")}
          style={{
            animation: "ret-run-across 2.4s cubic-bezier(0.4, 0, 0.6, 1) forwards",
            willChange: "transform, opacity",
          }}
        >
          {dustPuffs.map((i) => (
            <span
              key={i}
              className="absolute bottom-4 left-4 block h-3 w-3 rounded-full bg-foreground/25"
              style={{ animation: `dust-puff 0.9s ease-out ${i * 0.18}s infinite` }}
            />
          ))}
          <img
            src={runningImg}
            alt=""
            loading="lazy"
            width={1024}
            height={1024}
            className="relative h-[170px] w-auto object-contain drop-shadow-[0_10px_14px_oklch(0.30_0.06_45_/_0.25)] sm:h-[210px]"
          />
        </div>
      ) : (
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
              {questionMarks.map((i) => (
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
              style={{ animation: phase === "perk" ? "ret-perk 0.38s ease-out" : undefined }}
            />
            <div
              className="absolute inset-0"
              style={{
                clipPath: "ellipse(42% 30% at 50% 26%)",
                transformOrigin: "50% 46%",
                animation: phase === "perk" ? "ret-perk 0.38s ease-out" : "ret-head-think 4.2s ease-in-out infinite",
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
