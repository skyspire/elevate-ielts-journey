import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { useLearnerSession } from "@/lib/learner-auth";
import { canAccessType, getUserPlanType, type IeltsType } from "@/lib/ielts-type";
import { UpgradeToAllAccessPopup } from "./UpgradeToAllAccessPopup";
import { LockedUpgradeBillboard } from "./LockedUpgradeBillboard";

/**
 * Tiered locking for IELTS-type content:
 *  - "list"    → 0% blur. List/title pages stay fully browseable + clickable.
 *  - "preview" → 30% blur. Card previews/snippets — readable but faded.
 *  - "full"    → 70% blur. Sample answers, full passages, ebook pages.
 *
 * In every tier we render a sticky upgrade billboard above the content.
 */
export function TypeGate({
  contentType,
  children,
  tier = "list",
}: {
  contentType: IeltsType;
  children: React.ReactNode;
  tier?: "list" | "preview" | "full";
}) {
  const { user } = useLearnerSession();
  const location = useLocation();
  const [, setTick] = useState(0);
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
  const currentPlan = planType === "academic" || planType === "general" ? planType : null;

  useEffect(() => {
    setShowUpgrade(false);
  }, [location.pathname]);

  if (allowed) return <>{children}</>;

  const blurClass =
    tier === "full" ? "blur-md" : tier === "preview" ? "blur-[3px]" : "";
  const interactive = tier === "list";

  return (
    <>
      <LockedUpgradeBillboard wantedType={contentType} currentType={currentPlan} guest={isGuest} />

      {interactive ? (
        <div className="relative">{children}</div>
      ) : (
        <button
          type="button"
          aria-label="Locked content — click to unlock"
          onClick={() => setShowUpgrade(true)}
          className="group relative block w-full cursor-pointer text-left"
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none select-none ${blurClass} ${tier === "full" ? "opacity-80" : ""}`}
          >
            {children}
          </div>
          <span className="pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {isGuest ? "Login" : contentType === "academic" ? "Academic" : "General"}
          </span>
        </button>
      )}

      <UpgradeToAllAccessPopup
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentType={currentPlan}
        wantedType={contentType}
        guest={isGuest}
      />
    </>
  );
}
