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

  useEffect(() => {
    setShowUpgrade(!allowed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, location.pathname, tick]);

  if (allowed) return <>{children}</>;

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
        {children}
      </div>
      <UpgradeToAllAccessPopup
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentType={planType === "academic" ? "academic" : "general"}
        wantedType={contentType}
      />
    </>
  );
}
