import { useEffect, useState } from "react";
import retrieverImg from "@/assets/golden-retriever-thinking.png";

type Phase = "idle" | "spin" | "dash" | "gone";

export function ThinkingRetriever({ taskSelected }: { taskSelected: boolean }) {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (!taskSelected) {
      setPhase("idle");
      return;
    }
    // happy spin → dash → gone
    setPhase("spin");
    const t1 = window.setTimeout(() => setPhase("dash"), 650);
    const t2 = window.setTimeout(() => setPhase("gone"), 1450);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [taskSelected]);

  if (phase === "gone") return null;

  // Per-phase transform / opacity
  const transform =
    phase === "spin"
      ? "translateX(0) rotate(360deg) scale(1.05)"
      : phase === "dash"
      ? "translateX(140vw) rotate(720deg) scale(0.9)"
      : "translateX(0) rotate(0deg) scale(1)";

  const opacity = phase === "dash" ? 0 : 1;

  // Idle bobbing animation
  const idleBob = phase === "idle" ? "retriever-bob 2.6s ease-in-out infinite" : "none";

  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto mt-6 flex h-[180px] w-full items-end justify-center sm:h-[220px]"
    >
      <style>{`
        @keyframes retriever-bob {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-6px) rotate(1.5deg); }
        }
        @keyframes qmark-pop {
          0% { transform: translateY(6px) scale(0.4); opacity: 0; }
          30% { transform: translateY(-2px) scale(1.15); opacity: 1; }
          70% { transform: translateY(-4px) scale(1); opacity: 1; }
          100% { transform: translateY(-10px) scale(0.85); opacity: 0; }
        }
        @keyframes dust-puff {
          0% { transform: translateX(0) scale(0.4); opacity: 0; }
          30% { opacity: 0.7; }
          100% { transform: translateX(-40px) scale(1.6); opacity: 0; }
        }
      `}</style>

      {/* Soft ground shadow */}
      <div
        className="absolute bottom-3 left-1/2 h-3 w-32 -translate-x-1/2 rounded-[50%] bg-foreground/15 blur-md transition-opacity duration-500"
        style={{ opacity: phase === "dash" ? 0 : 0.6 }}
      />

      {/* Dust puffs when dashing */}
      {phase === "dash" && (
        <>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute bottom-4 left-1/2 h-3 w-3 rounded-full bg-foreground/25"
              style={{
                animation: `dust-puff 0.8s ease-out ${i * 0.08}s forwards`,
                marginLeft: -6 + i * 4,
              }}
            />
          ))}
        </>
      )}

      {/* Retriever */}
      <div
        className="relative"
        style={{
          transform,
          opacity,
          transition:
            phase === "spin"
              ? "transform 650ms cubic-bezier(0.34, 1.5, 0.64, 1)"
              : phase === "dash"
              ? "transform 800ms cubic-bezier(0.5, 0, 0.75, 0), opacity 800ms ease-in"
              : "transform 400ms ease",
          transformOrigin: "50% 75%",
          willChange: "transform, opacity",
        }}
      >
        {/* Question marks (only when idle) */}
        {phase === "idle" && (
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 sm:-top-12"
            style={{ width: "60px", height: "40px" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute font-display font-black text-[oklch(0.45_0.16_35)] sm:text-2xl"
                style={{
                  left: `${i * 22}px`,
                  top: 0,
                  fontSize: "1.5rem",
                  animation: `qmark-pop 1.8s ease-out ${i * 0.35}s infinite`,
                }}
              >
                ?
              </span>
            ))}
          </div>
        )}

        <div style={{ animation: idleBob, transformOrigin: "50% 90%" }}>
          <img
            src={retrieverImg}
            alt=""
            loading="lazy"
            width={1024}
            height={1024}
            className="h-[160px] w-auto object-contain drop-shadow-[0_8px_12px_oklch(0.30_0.06_45_/_0.25)] sm:h-[200px]"
          />
        </div>
      </div>
    </div>
  );
}
