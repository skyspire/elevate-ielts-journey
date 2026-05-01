import { useFreeQuota } from "@/lib/free-quota";
import { useLearnerSession } from "@/lib/learner-auth";
import { Sparkles } from "lucide-react";

/** Always-visible quota pill for signed-in free users. Hidden for guests. */
export function FreeQuotaPill({ compact = false }: { compact?: boolean }) {
  const { user } = useLearnerSession();
  const { remaining, limit, exhausted, countdown } = useFreeQuota(user?.id);

  if (!user) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        exhausted
          ? "border-[oklch(0.55_0.18_30)]/40 bg-[oklch(0.55_0.18_30)]/8 text-[oklch(0.45_0.18_30)]"
          : "border-border bg-secondary/60 text-foreground"
      }`}
      title={exhausted ? `Free quota resets in ${countdown}` : `Resets in ${countdown}`}
    >
      <Sparkles className="h-3 w-3" strokeWidth={2.5} />
      <span>
        {remaining}/{limit} {compact ? "free" : "free opens left today"}
      </span>
    </div>
  );
}
