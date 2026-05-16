import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { useLearnerSession } from "@/lib/learner-auth";
import { canAccessType, getUserPlanType, type IeltsType } from "@/lib/ielts-type";
import { UpgradeToAllAccessPopup } from "./UpgradeToAllAccessPopup";

/**
 * Blocks content tagged for the OTHER IELTS type when the user is on a single-type plan.
 * Guests and All Access users see content normally.
 */
export function TypeGate({
  contentType,
  children,
}: {
  contentType: IeltsType;
  children: React.ReactNode;
}) {
  const { user } = useLearnerSession();
  const location = useLocation();
  const [tick, setTick] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener("bigielts:type-changed", refresh);
    window.addEventListener("learner:session-changed", refresh);
    return () => {
      window.removeEventListener("bigielts:type-changed", refresh);
      window.removeEventListener("learner:session-changed", refresh);
    };
  }, []);

  const allowed = canAccessType(contentType);
  const planType = user ? getUserPlanType(user.id) : null;
  const isGuest = !user;

  useEffect(() => {
    setShowUpgrade(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, tick]);

  if (allowed) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        aria-label="Locked content — click to unlock"
        onClick={() => setShowUpgrade(true)}
        className="group relative block w-full cursor-pointer text-left"
      >
        <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
          {children}
        </div>
        <span
          className="pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg"
        >
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {isGuest ? "Login" : contentType === "academic" ? "Academic" : "General"}
        </span>
      </button>
      <UpgradeToAllAccessPopup
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentType={planType === "academic" || planType === "general" ? planType : null}
        wantedType={contentType}
        guest={isGuest}
      />
    </>
  );
}
