// no Link import needed; using plain anchors so href can include query strings.
import { GraduationCap, X } from "lucide-react";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  open: boolean;
  /** Hard block = no close. Soft = allow dismiss. */
  dismissible?: boolean;
  onClose?: () => void;
  redirectTo?: string;
  canDevBypass?: boolean;
  onDevBypass?: () => void;
};

/**
 * Signed-out gate popup. Minimal copy. Hard-block variant blurs the page behind.
 * Bottom sheet on mobile, centered modal on desktop.
 */
export function SignupGatePopup({
  open,
  dismissible = false,
  onClose,
  redirectTo,
  canDevBypass = false,
  onDevBypass,
}: Props) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

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
      {/* Backdrop with blur */}
      <button
        type="button"
        aria-label={dismissible ? "Close" : "Sign up to continue"}
        onClick={dismissible ? onClose : undefined}
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-md"
        style={{ cursor: dismissible ? "pointer" : "default" }}
      />

      <div
        className={
          isMobile
            ? "relative w-full rounded-t-3xl bg-card p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300"
            : "relative w-full max-w-md rounded-3xl bg-card p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200"
        }
        style={{ borderTop: "4px solid oklch(0.55 0.16 38)" }}
      >
        {dismissible && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "oklch(0.97 0.01 250)" }}
          >
            <GraduationCap className="h-5 w-5 text-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-base font-extrabold tracking-tight">
            BigIELTS.com
          </span>
        </div>

        <h2
          id="signup-gate-title"
          className="mt-5 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[28px]"
        >
          Sign up free to access this page.
        </h2>
        <p className="mt-2.5 text-sm font-medium text-muted-foreground sm:text-[15px]">
          3 free opens every day. No card required.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <a
            href={signupHref}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-foreground px-5 text-sm font-bold text-background transition-opacity hover:opacity-90"
          >
            Create free account
          </a>
          <a
            href={loginHref}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            I already have an account
          </a>
          {canDevBypass && onDevBypass && (
            <button
              type="button"
              onClick={onDevBypass}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-dashed border-border bg-muted px-5 text-sm font-bold text-foreground transition-colors hover:bg-accent"
            >
              Continue as admin/dev
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Daily quota resets at 9:00 AM IST
        </p>
      </div>
    </div>
  );
}
