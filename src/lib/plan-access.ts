// Reactive helper: does the current learner have ANY paid IELTS-type plan?
// A "free" user = guest OR signed-in with zero purchased types.

import { useEffect, useState } from "react";
import { getLearnerSession } from "./learner-auth";
import { getPurchasedTypes } from "./ielts-type";
import { useSession as useAdminSession } from "./admin/auth";
import { useDevBypass } from "./dev-bypass";

function compute(): boolean {
  const user = getLearnerSession();
  if (!user) return false;
  return getPurchasedTypes(user.id).length > 0;
}

/**
 * `true` if the user has any paid plan (academic, general, or both),
 * OR is an admin / has dev bypass enabled.
 */
export function useHasPaidPlan(): boolean {
  const [paid, setPaid] = useState<boolean>(() => compute());
  const { user: adminUser } = useAdminSession();
  const { enabled: devBypass } = useDevBypass();

  useEffect(() => {
    const refresh = () => setPaid(compute());
    window.addEventListener("bigielts:type-changed", refresh);
    window.addEventListener("learner:session-changed", refresh);
    window.addEventListener("storage", refresh);
    refresh();
    return () => {
      window.removeEventListener("bigielts:type-changed", refresh);
      window.removeEventListener("learner:session-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return paid || !!adminUser || devBypass;
}
