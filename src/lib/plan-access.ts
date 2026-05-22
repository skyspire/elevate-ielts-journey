// Reactive helper: does the current learner have ANY paid IELTS-type plan?
// A "free" user = guest OR signed-in with zero purchased types.
//
// NOTE: admin / dev-bypass intentionally do NOT count as paid here — they
// should still see the locked tease on these pages so it can be previewed
// and QA-ed. Real bypass is only for content gates (TypeGate / QuotaGate).

import { useEffect, useState } from "react";
import { getLearnerSession } from "./learner-auth";
import { getPurchasedTypes } from "./ielts-type";

function compute(): boolean {
  const user = getLearnerSession();
  if (!user) return false;
  return getPurchasedTypes(user.id).length > 0;
}

/** `true` only if the signed-in learner has at least one purchased plan. */
export function useHasPaidPlan(): boolean {
  const [paid, setPaid] = useState<boolean>(() => compute());

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

  return paid;
}
