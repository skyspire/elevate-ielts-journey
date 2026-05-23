import { useEffect, useState } from "react";
import { usePopupActive } from "@/hooks/use-popup-active";
import { X, Check, ArrowRight } from "lucide-react";
import { addPurchasedType, type IeltsPlanType } from "@/lib/ielts-type";
import { useLearnerSession } from "@/lib/learner-auth";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

type SingleType = "academic" | "general";
type PreviewStyle = "flat" | "3d" | "photo";

const PREVIEW_STYLES: {
  key: PreviewStyle;
  label: string;
  academic: string;
  general: string;
}[] = [
  {
    key: "flat",
    label: "A",
    academic: "/picker-options/picker_academic_flat.jpg",
    general: "/picker-options/picker_general_flat.jpg",
  },
  {
    key: "3d",
    label: "B",
    academic: "/picker-options/picker_academic_3d.jpg",
    general: "/picker-options/picker_general_3d.jpg",
  },
  {
    key: "photo",
    label: "C",
    academic: "/picker-options/picker_academic_photo.jpg",
    general: "/picker-options/picker_general_photo.jpg",
  },
];

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
  accent: string;
  accentDark: string;
}[] = [
  {
    key: "academic",
    name: "Academic",
    accent: "oklch(0.58 0.2 255)",
    accentDark: "oklch(0.42 0.21 265)",
  },
  {
    key: "general",
    name: "General Training",
    accent: "oklch(0.6 0.22 25)",
    accentDark: "oklch(0.45 0.22 25)",
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

        <h2
          id="pick-type-title"
          className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl"
        >
          Select Your IELTS
        </h2>

        {!user && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-800">
            You need an account to subscribe.{" "}
            <Link to="/signup" onClick={onClose} className="underline">Sign up</Link> or{" "}
            <Link to="/login" onClick={onClose} className="underline">log in</Link> first.
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {CARDS.map((card) => {
            const Icon = card.icon;
            const isActive = selected === card.key;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setSelected(card.key)}
                aria-pressed={isActive}
                className="group relative overflow-hidden rounded-2xl p-5 text-left text-white transition-all"
                style={{
                  background: `linear-gradient(150deg, ${card.accent}, ${card.accentDark})`,
                  boxShadow: isActive
                    ? `0 18px 36px -12px ${card.accent}, 0 0 0 3px white, 0 0 0 5px ${card.accent}`
                    : `0 10px 24px -12px ${card.accent}aa`,
                  transform: isActive ? "translateY(-2px)" : "none",
                }}
              >
                {/* Soft glow blob */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-2xl"
                  style={{ background: "white" }}
                />

                {isActive && (
                  <span
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white"
                    style={{ color: card.accentDark }}
                  >
                    <Check className="h-4 w-4" strokeWidth={3.2} />
                  </span>
                )}

                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/40"
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.4} />
                </span>

                <div className="mt-4 font-display text-xl font-black tracking-tight text-white">
                  {card.name}
                </div>
                <div className="text-[12px] font-semibold text-white/85">{card.tag}</div>

                <ul className="mt-3 space-y-1.5 text-[12.5px] font-semibold text-white/95">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white" strokeWidth={3} />
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
