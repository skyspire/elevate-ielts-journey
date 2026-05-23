import { useEffect, useState } from "react";
import { usePopupActive } from "@/hooks/use-popup-active";
import { X } from "lucide-react";
import { addPurchasedType, type IeltsPlanType } from "@/lib/ielts-type";
import { useLearnerSession } from "@/lib/learner-auth";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

type SingleType = "academic" | "general";

const OPTIONS: { key: SingleType; name: string; image: string }[] = [
  { key: "academic", name: "Academic", image: "/picker-options/picker_academic_3d.jpg" },
  { key: "general", name: "General Training", image: "/picker-options/picker_general_3d.jpg" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  cycleLabel?: string;
  onConfirmed?: (plan: IeltsPlanType) => void;
};

export function PickIeltsTypeAtCheckoutPopup({ open, onClose, onConfirmed }: Props) {
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
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#1a0b2e] p-3 animate-in fade-in duration-200 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pick-type-title"
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative z-10 flex h-full max-h-[680px] w-full max-w-3xl flex-col items-center justify-between gap-4 py-4 sm:gap-8 sm:py-8">
        <h1
          id="pick-type-title"
          className="text-center font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          Choose your{" "}
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            IELTS
          </span>
        </h1>

        {!user && (
          <div className="w-full max-w-md rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-center text-xs font-semibold text-amber-100 sm:text-sm">
            You need an account.{" "}
            <Link to="/signup" onClick={onClose} className="underline">Sign up</Link> or{" "}
            <Link to="/login" onClick={onClose} className="underline">log in</Link>.
          </div>
        )}

        <div className="grid w-full min-h-0 flex-1 grid-cols-2 gap-3 sm:gap-6">
          {OPTIONS.map((opt) => {
            const isActive = selected === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSelected(opt.key)}
                aria-pressed={isActive}
                className={[
                  "group relative flex h-full min-h-0 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 bg-white/5 p-3 backdrop-blur-2xl transition-all duration-300 sm:rounded-[2rem] sm:p-6",
                  isActive
                    ? "scale-[1.02] border-amber-400 bg-white/10 shadow-[0_0_40px_rgba(251,191,36,0.18)]"
                    : "border-white/10 hover:border-white/25 hover:bg-white/[0.08]",
                ].join(" ")}
              >
                <div className="mb-3 min-h-0 w-full flex-1 overflow-hidden rounded-xl sm:mb-4 sm:rounded-2xl">
                  <img
                    src={opt.image}
                    alt={`${opt.name} IELTS`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="eager"
                  />
                </div>
                <div className="shrink-0 text-center">
                  <h3 className="font-display text-base font-bold leading-tight text-white sm:text-2xl">
                    {opt.name}
                  </h3>
                  <div
                    className={[
                      "mx-auto mt-1 h-1 w-8 rounded-full bg-amber-400 transition-opacity sm:mt-2 sm:h-1.5 sm:w-10",
                      isActive ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={confirm}
          disabled={!selected || !user}
          className="w-full max-w-sm shrink-0 cursor-pointer rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-base font-extrabold text-[#1a0b2e] shadow-[0_10px_40px_-10px_rgba(251,191,36,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_-5px_rgba(251,191,36,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 sm:py-5 sm:text-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
