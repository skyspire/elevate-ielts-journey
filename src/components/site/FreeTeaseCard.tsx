import { useState, type ReactNode } from "react";
import { Lock, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLearnerSession } from "@/lib/learner-auth";

/**
 * Frosted-glass paywall wrapper.
 *
 * - `locked=false` → renders children unchanged.
 * - `locked=true`  → renders children blurred + non-interactive behind a
 *   frosted overlay with a lock chip. Clicking the card flips it to a
 *   "peek" back face showing an upgrade CTA. Clicking the back arrow
 *   flips it back.
 */
export function FreeTeaseCard({
  locked,
  children,
  className = "",
}: {
  locked: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [peeking, setPeeking] = useState(false);
  const { user } = useLearnerSession();

  if (!locked) return <>{children}</>;

  return (
    <div className={`relative isolate [perspective:1200px] ${className}`}>
      <div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: peeking ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* FRONT — blurred content + frosted overlay */}
        <div className="relative [backface-visibility:hidden]">
          <div
            aria-hidden
            className="pointer-events-none select-none blur-md opacity-70"
          >
            {children}
          </div>

          {/* Frosted overlay (clickable to peek) */}
          <button
            type="button"
            onClick={() => setPeeking(true)}
            aria-label="Locked — tap to peek"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-white/40 backdrop-blur-[2px] transition-all hover:bg-white/55"
            style={{
              boxShadow:
                "inset 0 0 0 1px color-mix(in oklab, oklch(0.55 0.18 30) 22%, transparent)",
            }}
          >
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.13 22), oklch(0.55 0.18 30))",
              }}
            >
              <Lock className="h-3 w-3" strokeWidth={2.5} />
              Premium
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
              Tap to peek
            </span>
          </button>
        </div>

        {/* BACK — upgrade CTA */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl p-5 text-center [backface-visibility:hidden]"
          style={{
            transform: "rotateY(180deg)",
            background:
              "linear-gradient(135deg, oklch(0.96 0.04 30) 0%, oklch(0.92 0.07 25) 100%)",
            boxShadow:
              "inset 0 0 0 1px color-mix(in oklab, oklch(0.55 0.18 30) 30%, transparent)",
          }}
        >
          <button
            type="button"
            onClick={() => setPeeking(false)}
            aria-label="Back"
            className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-foreground/70 transition-colors hover:bg-white hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>

          <span
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.13 22), oklch(0.55 0.18 30))",
            }}
          >
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>

          <p className="font-display text-base font-black leading-tight tracking-tight text-foreground sm:text-lg">
            Unlock every question
          </p>
          <p className="max-w-[22ch] text-[12px] font-medium text-foreground/65">
            Real exam questions, model answers and predictions — site-wide.
          </p>

          <Link
            to={user ? "/" : "/signup"}
            hash={user ? "pricing" : undefined}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-white shadow-md transition-transform hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.13 22), oklch(0.55 0.18 30))",
            }}
          >
            {user ? "Upgrade now" : "Sign up free"}
          </Link>
        </div>
      </div>
    </div>
  );
}
