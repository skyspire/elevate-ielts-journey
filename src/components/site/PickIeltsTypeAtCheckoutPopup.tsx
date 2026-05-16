import { useEffect, useState } from "react";
import { GraduationCap, Briefcase, Crown, X, Check, Sparkles } from "lucide-react";
import { addPurchasedType, setUserPlanType, type IeltsPlanType } from "@/lib/ielts-type";
import { useLearnerSession } from "@/lib/learner-auth";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Description of the cycle the user clicked on, e.g. "Monthly · $14 CAD". Shown as context. */
  cycleLabel?: string;
  /** Optional: confirm callback after selection (e.g. proceed to a real checkout). */
  onConfirmed?: (plan: IeltsPlanType) => void;
};

const CARDS: {
  key: IeltsPlanType;
  name: string;
  tag: string;
  icon: typeof GraduationCap;
  accent: string;
  multiplier: number;
  popular?: boolean;
  bullets: string[];
}[] = [
  {
    key: "academic",
    name: "Academic",
    tag: "University & professional registration",
    icon: GraduationCap,
    accent: "oklch(0.55 0.2 255)",
    multiplier: 1,
    bullets: ["Writing T1 charts & graphs", "Academic reading", "Academic ebooks & samples"],
  },
  {
    key: "general",
    name: "General Training",
    tag: "Migration, work & secondary ed",
    icon: Briefcase,
    accent: "oklch(0.6 0.18 30)",
    multiplier: 1,
    bullets: ["Writing T1 letters", "Workplace / everyday reading", "General ebooks & samples"],
  },
  {
    key: "both",
    name: "All Access",
    tag: "Academic + General together",
    icon: Crown,
    accent: "oklch(0.65 0.18 60)",
    multiplier: 1.5,
    popular: true,
    bullets: ["Both IELTS types unlocked", "Switch anytime", "Best value vs. two plans"],
  },
];

/**
 * Asks "which IELTS?" right at the moment the user clicks Subscribe.
 * Used by the pricing page and any other Subscribe/Upgrade entry-point.
 */
export function PickIeltsTypeAtCheckoutPopup({ open, onClose, cycleLabel, onConfirmed }: Props) {
  const { user } = useLearnerSession();
  const [hover, setHover] = useState<IeltsPlanType | null>(null);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const pick = (plan: IeltsPlanType) => {
    if (!user) {
      toast.error("Please sign up or log in to subscribe.");
      onClose();
      return;
    }
    if (plan === "both") {
      setUserPlanType(user.id, "both");
    } else {
      addPurchasedType(user.id, plan);
    }
    toast.success(
      plan === "both"
        ? "All Access activated — both IELTS types unlocked."
        : `${plan === "academic" ? "Academic" : "General Training"} plan activated.`,
    );
    onConfirmed?.(plan);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center px-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pick-type-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/65 backdrop-blur-md"
      />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "oklch(0.55 0.18 30)" }} strokeWidth={2.5} />
          <span
            className="text-[11px] font-extrabold uppercase tracking-wider"
            style={{ color: "oklch(0.55 0.18 30)" }}
          >
            {cycleLabel ? `One last step · ${cycleLabel}` : "One last step"}
          </span>
        </div>

        <h2
          id="pick-type-title"
          className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[28px]"
        >
          Which IELTS are you preparing for?
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-[15px]">
          Pick the type you'll be tested on. Other-type content will stay locked unless you go All Access.
        </p>

        {!user && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-800">
            You need an account to subscribe.{" "}
            <Link to="/signup" onClick={onClose} className="underline">Sign up</Link> or{" "}
            <Link to="/login" onClick={onClose} className="underline">log in</Link> first.
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = card.icon;
            const isHover = hover === card.key;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => pick(card.key)}
                onMouseEnter={() => setHover(card.key)}
                onMouseLeave={() => setHover(null)}
                className="group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all"
                style={{
                  borderColor: card.popular
                    ? "transparent"
                    : isHover
                      ? card.accent
                      : "oklch(0.9 0.01 250)",
                  background: isHover
                    ? `linear-gradient(140deg, color-mix(in oklab, ${card.accent} 8%, white), color-mix(in oklab, ${card.accent} 14%, white))`
                    : "white",
                  boxShadow: card.popular
                    ? `0 0 0 2px ${card.accent}, 0 14px 30px -10px ${card.accent}66`
                    : isHover
                      ? `0 12px 26px -10px ${card.accent}55`
                      : "0 1px 0 oklch(0.9 0.01 250)",
                  transform: isHover ? "translateY(-2px)" : "none",
                }}
              >
                {card.popular && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white"
                    style={{
                      background: `linear-gradient(140deg, ${card.accent}, color-mix(in oklab, ${card.accent} 60%, black))`,
                    }}
                  >
                    Best value
                  </span>
                )}

                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{
                    background: `linear-gradient(140deg, ${card.accent}, color-mix(in oklab, ${card.accent} 65%, black))`,
                    boxShadow: `0 8px 18px -6px ${card.accent}80, inset 0 1px 0 oklch(1 0 0 / 0.4)`,
                  }}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.4} />
                </span>

                <div className="mt-3 font-display text-lg font-black tracking-tight text-foreground">
                  {card.name}
                </div>
                <div className="text-[11px] font-semibold text-muted-foreground">{card.tag}</div>

                <ul className="mt-3 space-y-1 text-[12px] font-semibold text-foreground">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: card.accent }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {card.multiplier > 1 && (
                  <div className="mt-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                    +50% vs. single type
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center text-[11px] font-semibold text-muted-foreground">
          No mid-plan switching. To access both types later, you'll need to upgrade to All Access.
        </p>
      </div>
    </div>
  );
}
