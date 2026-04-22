import { useEffect, useRef, useState } from "react";
import sittingImg from "@/assets/retriever-body.png";
import runVideo from "@/assets/retriever-run.mp4.asset.json";

type Phase = "idle" | "perk" | "run" | "gone";

export function ThinkingRetriever({ taskSelected }: { taskSelected: boolean }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!taskSelected) {
      setPhase("idle");
      return;
    }
    // tiny perk reaction → play running video → fade out → gone
    setPhase("perk");
    const t1 = window.setTimeout(() => setPhase("run"), 280);
    // Total visible run window before dash-off completes
    const t2 = window.setTimeout(() => setPhase("gone"), 280 + 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [taskSelected]);

  // Try to start playback as soon as the video appears
  useEffect(() => {
    if (phase === "run" && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {/* ignored — autoplay may be restricted */});
      }
    }
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none relative mx-auto mt-4 flex h-[200px] w-full items-end justify-center overflow-hidden sm:h-[240px]"
    >
      <style>{`
        @keyframes ret-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-3px) scale(1.012); }
        }
        @keyframes ret-head-think {
          0%   { transform: rotate(0deg) translateY(0); }
          18%  { transform: rotate(-9deg) translateY(-1px); }
          34%  { transform: rotate(-9deg) translateY(-1px); }
          50%  { transform: rotate(2deg) translateY(0); }
          66%  { transform: rotate(10deg) translateY(-1px); }
          82%  { transform: rotate(10deg) translateY(-1px); }
          100% { transform: rotate(0deg) translateY(0); }
        }
        @keyframes ret-perk {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-6px) scale(1.04); }
        }
        @keyframes qmark-pop {
          0%   { transform: translateY(8px) scale(0.4); opacity: 0; }
          25%  { transform: translateY(-2px) scale(1.15); opacity: 1; }
          70%  { transform: translateY(-4px) scale(1); opacity: 1; }
          100% { transform: translateY(-12px) scale(0.85); opacity: 0; }
        }
        @keyframes ret-dash-off {
          0%   { transform: translateX(0); opacity: 1; }
          60%  { transform: translateX(40vw); opacity: 1; }
          100% { transform: translateX(120vw); opacity: 0; }
        }
      `}</style>

      {/* Soft ground shadow under the dog (only while sitting) */}
      <div
        className="absolute bottom-3 left-1/2 h-3 w-36 -translate-x-1/2 rounded-[50%] bg-foreground/20 blur-md transition-opacity duration-300"
        style={{ opacity: phase === "run" ? 0 : 0.55 }}
      />

      {phase === "run" ? (
        // Animated running clip — slides off to the right while playing
        <div
          className="relative"
          style={{
            animation: "ret-dash-off 2.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards",
            willChange: "transform, opacity",
          }}
        >
          <video
            ref={videoRef}
            src={runVideo.url}
            autoPlay
            muted
            playsInline
            loop
            className="h-[180px] w-auto object-contain drop-shadow-[0_10px_14px_oklch(0.30_0.06_45_/_0.25)] sm:h-[220px]"
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
          {/* Question marks above head */}
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
