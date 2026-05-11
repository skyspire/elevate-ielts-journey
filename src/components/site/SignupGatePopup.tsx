import { GraduationCap, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type GateVariant = "sunshine" | "berry" | "ocean" | "mint";

type Props = {
  open: boolean;
  dismissible?: boolean;
  onClose?: () => void;
  redirectTo?: string;
  canDevBypass?: boolean;
  onDevBypass?: () => void;
  /** Visual style. Default "sunshine". */
  variant?: GateVariant;
};

/** Bold, simple, colorful variants. Solid blocks of color — no gradients, no glass. */
const VARIANTS: Record<
  GateVariant,
  {
    label: string;
    page: string; // backdrop wash
    card: string; // card bg
    cardText: string;
    accent: string; // top color block / chip
    accentText: string;
    cta: string; // primary button
    ctaText: string;
    ghost: string; // secondary button
    ghostText: string;
  }
> = {
  sunshine: {
    label: "Sunshine",
    page: "bg-yellow-300/40",
    card: "bg-[#FFD60A]",
    cardText: "text-black",
    accent: "bg-black",
    accentText: "text-[#FFD60A]",
    cta: "bg-black hover:bg-neutral-800",
    ctaText: "text-[#FFD60A]",
    ghost: "bg-white hover:bg-white/90 border-2 border-black",
    ghostText: "text-black",
  },
  berry: {
    label: "Berry",
    page: "bg-pink-400/40",
    card: "bg-[#FF2E63]",
    cardText: "text-white",
    accent: "bg-white",
    accentText: "text-[#FF2E63]",
    cta: "bg-white hover:bg-white/90",
    ctaText: "text-[#FF2E63]",
    ghost: "bg-transparent hover:bg-white/15 border-2 border-white",
    ghostText: "text-white",
  },
  ocean: {
    label: "Ocean",
    page: "bg-blue-400/40",
    card: "bg-[#0066FF]",
    cardText: "text-white",
    accent: "bg-[#FFE600]",
    accentText: "text-black",
    cta: "bg-[#FFE600] hover:bg-yellow-300",
    ctaText: "text-black",
    ghost: "bg-transparent hover:bg-white/15 border-2 border-white",
    ghostText: "text-white",
  },
  mint: {
    label: "Mint",
    page: "bg-emerald-300/40",
    card: "bg-[#00C896]",
    cardText: "text-black",
    accent: "bg-black",
    accentText: "text-[#00C896]",
    cta: "bg-black hover:bg-neutral-800",
    ctaText: "text-[#00C896]",
    ghost: "bg-white hover:bg-white/90 border-2 border-black",
    ghostText: "text-black",
  },
};

const ORDER: GateVariant[] = ["sunshine", "berry", "ocean", "mint"];

export function SignupGatePopup({
  open,
  dismissible = false,
  onClose,
  redirectTo,
  canDevBypass = false,
  onDevBypass,
  variant = "sunshine",
}: Props) {
  const isMobile = useIsMobile();
  const [active, setActive] = useState<GateVariant>(variant);

  // Dev preview: append ?gate=demo to the URL to see all variant chips.
  const showSwitcher =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("gate") === "demo";

  useEffect(() => setActive(variant), [variant]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const v = VARIANTS[active];
  const signupHref = redirectTo
    ? `/signup?redirect=${encodeURIComponent(redirectTo)}`
    : "/signup";
  const loginHref = redirectTo
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-gate-title"
    >
      <button
        type="button"
        aria-label={dismissible ? "Close" : "Sign up to continue"}
        onClick={dismissible ? onClose : undefined}
        className={`absolute inset-0 cursor-default backdrop-blur-md ${v.page}`}
        style={{ cursor: dismissible ? "pointer" : "default" }}
      />

      <div
        className={[
          "relative w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] animate-in duration-300",
          v.card,
          v.cardText,
          isMobile
            ? "rounded-t-3xl p-6 pb-8 slide-in-from-bottom"
            : "max-w-md rounded-3xl p-8 zoom-in-95 fade-in",
        ].join(" ")}
      >
        {dismissible && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`absolute right-4 top-4 rounded-full p-1.5 transition-opacity hover:opacity-70 ${v.cardText}`}
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${v.accent} ${v.accentText}`}
          >
            <GraduationCap className="h-5 w-5" strokeWidth={2.75} />
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">
            BigIELTS.com
          </span>
        </div>

        <h2
          id="signup-gate-title"
          className="mt-6 font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl"
        >
          Sign up free.
          <br />
          Keep going.
        </h2>
        <p className="mt-3 text-base font-semibold opacity-80">
          3 free opens every day. No card required.
        </p>

        <div className="mt-7 flex flex-col gap-2.5">
          <a
            href={signupHref}
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-black tracking-tight transition-colors ${v.cta} ${v.ctaText}`}
          >
            <Sparkles className="h-4 w-4" strokeWidth={3} />
            Create free account
          </a>
          <a
            href={loginHref}
            className={`inline-flex h-12 items-center justify-center rounded-xl px-5 text-base font-bold tracking-tight transition-colors ${v.ghost} ${v.ghostText}`}
          >
            I already have an account
          </a>
          {canDevBypass && onDevBypass && (
            <button
              type="button"
              onClick={onDevBypass}
              className={`inline-flex h-11 items-center justify-center rounded-xl border-2 border-dashed px-5 text-sm font-bold transition-opacity hover:opacity-70 ${v.cardText}`}
              style={{ borderColor: "currentColor" }}
            >
              Continue as admin/dev
            </button>
          )}
          <a
            href={`/admin/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className={`mt-1 inline-flex h-10 items-center justify-center rounded-xl px-5 text-xs font-bold uppercase tracking-wider underline-offset-4 hover:underline ${v.cardText} opacity-80`}
          >
            Admin? Sign in to bypass
          </a>
        </div>

        <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.15em] opacity-70">
          Daily quota resets at 9:00 AM IST
        </p>

        {showSwitcher && (
          <div className="mt-5 flex flex-wrap justify-center gap-2 border-t-2 border-current/20 pt-4">
            {ORDER.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setActive(k)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition ${
                  active === k
                    ? "bg-black text-white"
                    : "bg-white/70 text-black hover:bg-white"
                }`}
              >
                {VARIANTS[k].label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
