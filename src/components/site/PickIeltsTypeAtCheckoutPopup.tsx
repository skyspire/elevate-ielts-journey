import { useEffect, useState } from "react";
import { usePopupActive } from "@/hooks/use-popup-active";
import { GraduationCap, Briefcase, X, Check, Sparkles, ArrowRight } from "lucide-react";
import { addPurchasedType, type IeltsPlanType } from "@/lib/ielts-type";
import { useLearnerSession } from "@/lib/learner-auth";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

type SingleType = "academic" | "general";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Description of the cycle the user clicked on, e.g. "Monthly · $14 CAD". */
  cycleLabel?: string;
  onConfirmed?: (plan: IeltsPlanType) => void;
};

const CARDS: {
  key: SingleType;
  name: string;
  tag: string;
  icon: typeof GraduationCap;
  accent: string;
  bullets: string[];
}[] = [
  {
    key: "academic",
    name: "Academic",
    tag: "University & professional registration",
    icon: GraduationCap,
    accent: "oklch(0.55 0.2 255)",
    bullets: ["Writing T1 charts & graphs", "Academic reading", "Academic ebooks & samples"],
  },
  {
    key: "general",
    name: "General Training",
    tag: "Migration, work & secondary ed",
    icon: Briefcase,
    accent: "oklch(0.6 0.18 30)",
    bullets: ["Writing T1 letters", "Workplace / everyday reading", "General ebooks & samples"],
  },
];

/**
 * Bottom-sheet picker shown when a user clicks Subscribe on a plan.
 * User must explicitly pick Academic or General — no pre-selection, no "both".
 * To access both types they must subscribe a second time.
 */
export function PickIeltsTypeAtCheckoutPopup({ open, onClose, cycleLabel, onConfirmed }: Props) {
  usePopupActive(open);
  const { user } = useLearnerSession();
  const [selected, setSelected] = useState<SingleType | null>(null);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      return;
    }
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const confirm = () => {
    if (!selected) return;
    if (!user) {
      toast.error("Please sign up or log in to subscribe.");
      onClose();
      return;
    }
    addPurchasedType(user.id, selected);
    toast.success(
      `${selected === "academic" ? "Academic" : "General Training"} plan activated.`,
    );
    onConfirmed?.(selected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pick-type-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/65 backdrop-blur-md animate-in fade-in duration-200"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-t-3xl bg-card p-5 shadow-2xl animate-in slide-in-from-bottom duration-300 sm:p-7">
        {/* Grab handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/25" />

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
          className="mt-2 font-display text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl"
        >
          Which IELTS are you preparing for?
        </h2>
        <p className="mt-1.5 text-[13px] font-medium text-muted-foreground sm:text-sm">
          Pick one. To access both later, you'll need to subscribe a second time for the other type.
        </p>

        {!user && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-800">
            You need an account to subscribe.{" "}
            <Link to="/signup" onClick={onClose} className="underline">Sign up</Link> or{" "}
            <Link to="/login" onClick={onClose} className="underline">log in</Link> first.
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CARDS.map((card) => {
            const Icon = card.icon;
            const isActive = selected === card.key;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setSelected(card.key)}
                aria-pressed={isActive}
                className="group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all"
                style={{
                  borderColor: isActive ? card.accent : "oklch(0.9 0.01 250)",
                  background: isActive
                    ? `linear-gradient(140deg, color-mix(in oklab, ${card.accent} 10%, white), color-mix(in oklab, ${card.accent} 18%, white))`
                    : "white",
                  boxShadow: isActive
                    ? `0 14px 30px -10px ${card.accent}66`
                    : "0 1px 0 oklch(0.9 0.01 250)",
                  transform: isActive ? "translateY(-2px)" : "none",
                }}
              >
                {isActive && (
                  <span
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-white"
                    style={{ background: card.accent }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
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
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-[11px] font-semibold text-muted-foreground sm:text-left">
            One IELTS type per subscription. Subscribe again to add the other.
          </p>
          <button
            type="button"
            onClick={confirm}
            disabled={!selected || !user}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: selected
                ? `linear-gradient(140deg, ${
                    CARDS.find((c) => c.key === selected)!.accent
                  }, color-mix(in oklab, ${CARDS.find((c) => c.key === selected)!.accent} 65%, black))`
                : "oklch(0.45 0.02 250)",
              boxShadow: selected
                ? `0 10px 22px -8px ${CARDS.find((c) => c.key === selected)!.accent}80`
                : undefined,
            }}
          >
            Continue <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
          </button>
        </div>
      </div>
    </div>
  );
}
