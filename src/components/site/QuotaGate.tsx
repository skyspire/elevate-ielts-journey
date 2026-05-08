import { useEffect, useMemo, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { useLearnerSession } from "@/lib/learner-auth";
import { useFreeQuota } from "@/lib/free-quota";
import { useSession as useAdminSession } from "@/lib/admin/auth";
import { SignupGatePopup } from "./SignupGatePopup";
import { UpsellPopup } from "./UpsellPopup";

/**
 * Wraps a "detail" page that costs 1 of 3 daily free opens.
 *
 * Behavior:
 * - Signed-out: hard-block popup (page blurred behind), forces signup.
 * - Signed-in free w/ quota: silently consumes 1 (free if same item re-visited).
 * - Signed-in free, exhausted: upsell popup with site-wide plans.
 *
 * `itemKey` should be stable per item (e.g. `writing:t1-question-42`).
 */
export function QuotaGate({
  itemKey,
  children,
}: {
  itemKey: string;
  children: React.ReactNode;
}) {
  const { user } = useLearnerSession();
  const { user: adminUser } = useAdminSession();
  const location = useLocation();
  const quota = useFreeQuota(user?.id);

  // Dev bypass: ?bypass=1 in URL (sticky), or localStorage flag, or signed-in admin.
  const [devBypass, setDevBypass] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("bypass") === "1") {
        window.localStorage.setItem("bigielts:dev-bypass", "1");
      } else if (params.get("bypass") === "0") {
        window.localStorage.removeItem("bigielts:dev-bypass");
      }
      setDevBypass(window.localStorage.getItem("bigielts:dev-bypass") === "1");
    } catch {
      /* ignore */
    }
  }, [location.pathname, location.search]);

  const isAdmin = !!adminUser || devBypass;

  // Track whether THIS mount has been granted access.
  const [granted, setGranted] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);

  useEffect(() => {
    if (!user) {
      setGranted(false);
      setShowUpsell(false);
      return;
    }
    // Already opened earlier today? Free re-open.
    if (quota.hasOpened(itemKey)) {
      setGranted(true);
      return;
    }
    const result = quota.consume(itemKey);
    if (result.ok) {
      setGranted(true);
    } else {
      setGranted(false);
      setShowUpsell(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, itemKey]);

  const redirectTo = useMemo(() => location.href ?? location.pathname, [location]);

  // Admin bypass: signed-in admins skip the quota gate entirely.
  if (isAdmin) {
    return <>{children}</>;
  }

  // Guest: hard block.
  if (!user) {
    return (
      <>
        <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
          {children}
        </div>
        <SignupGatePopup open dismissible={false} redirectTo={redirectTo} />
      </>
    );
  }

  // Signed-in but exhausted.
  if (!granted) {
    return (
      <>
        <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
          {children}
        </div>
        <UpsellPopup
          open={showUpsell}
          onClose={() => setShowUpsell(false)}
          countdown={quota.countdown}
        />
      </>
    );
  }

  return <>{children}</>;
}
