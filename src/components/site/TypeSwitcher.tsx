import { useState } from "react";
import { Lock } from "lucide-react";
import { useIeltsType, type IeltsType } from "@/lib/ielts-type";
import { useLearnerSession } from "@/lib/learner-auth";
import { UpgradeToAllAccessPopup } from "./UpgradeToAllAccessPopup";

/**
 * Header pill that lets users toggle between Academic and General.
 * - Guests: free to switch.
 * - Logged-in single-type subscribers: clicking the other side opens the upgrade popup.
 * - All Access subscribers: free to switch.
 */
export function TypeSwitcher({ compact = false }: { compact?: boolean }) {
  const { type, planType, isLocked, select } = useIeltsType();
  const { user } = useLearnerSession();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [blockedType, setBlockedType] = useState<IeltsType | null>(null);

  const handlePick = (t: IeltsType) => {
    if (t === type) return;
    if (user && isLocked && planType !== t) {
      setBlockedType(t);
      setShowUpgrade(true);
      return;
    }
    select(t);
  };

  const lockedSide: IeltsType | null = isLocked && planType !== "both"
    ? planType === "academic" ? "general" : "academic"
    : null;

  return (
    <>
      <div
        className="inline-flex items-center rounded-full border bg-white p-0.5"
        style={{ borderColor: "oklch(0.9 0.01 250)" }}
        role="group"
        aria-label="IELTS type"
      >
        {(["academic", "general"] as IeltsType[]).map((t) => {
          const active = type === t;
          const locked = lockedSide === t;
          const label = t === "academic" ? "Academic" : "General";
          const accent = t === "academic" ? "oklch(0.55 0.2 255)" : "oklch(0.6 0.18 30)";
          return (
            <button
              key={t}
              type="button"
              onClick={() => handlePick(t)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-bold transition-all ${
                compact ? "text-[11px] px-2.5 py-1" : ""
              }`}
              style={{
                background: active
                  ? `linear-gradient(140deg, ${accent}, color-mix(in oklab, ${accent} 70%, black))`
                  : "transparent",
                color: active ? "white" : locked ? "oklch(0.6 0.01 250)" : "oklch(0.25 0.01 250)",
                boxShadow: active
                  ? `0 6px 14px -6px ${accent}80, inset 0 1px 0 oklch(1 0 0 / 0.3)`
                  : "none",
              }}
            >
              {locked && <Lock className="h-3 w-3" />}
              {label}
            </button>
          );
        })}
      </div>

      <UpgradeToAllAccessPopup
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentType={planType === "academic" ? "academic" : "general"}
        wantedType={blockedType ?? "academic"}
      />
    </>
  );
}
