import { type ReactNode } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLearnerSession } from "@/lib/learner-auth";

/**
 * Premium paywall wrapper.
 *
 * - `locked=false` → renders children unchanged.
 * - `locked=true`  → renders children blurred + non-interactive behind a
 *   frosted overlay with a prominent "Upgrade to View" CTA. The whole
 *   overlay is a Link to the upgrade flow — no peek/flip interaction.
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
  const { user } = useLearnerSession();

  if (!locked) return <>{children}</>;

  return (
    <div
      className={`group relative isolate overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
      style={{
        boxShadow:
          "0 24px 48px -20px rgba(15,23,42,0.22), 0 8px 18px -10px rgba(15,23,42,0.14), inset 0 0 0 1px rgba(255,255,255,0.55)",
      }}
    >
      {/* Blurred content beneath */}
      <div
        aria-hidden
        className="pointer-events-none select-none blur-md opacity-60"
      >
        {children}
      </div>

      {/* Frosted overlay + Upgrade CTA */}
      <Link
        to={user ? "/" : "/signup"}
        hash={user ? "pricing" : undefined}
        aria-label="Upgrade to view"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-white/45 px-5 backdrop-blur-[3px] transition-all hover:bg-white/60"
        style={{
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklab, oklch(0.55 0.18 30) 22%, transparent)",
        }}
      >
        {/* Premium chip */}
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

        {/* Prominent CTA — rounded font, bigger */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-extrabold tracking-tight text-white shadow-[0_10px_24px_-8px_rgba(220,90,40,0.55)] transition-transform group-hover:scale-[1.03] sm:text-base"
          style={{
            fontFamily:
              "'Nunito', 'Plus Jakarta Sans', 'SF Pro Rounded', system-ui, sans-serif",
            letterSpacing: "-0.005em",
            background:
              "linear-gradient(135deg, oklch(0.55 0.18 30), oklch(0.62 0.16 38))",
          }}
        >
          <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          Upgrade to View
        </span>
      </Link>
    </div>
  );
}
