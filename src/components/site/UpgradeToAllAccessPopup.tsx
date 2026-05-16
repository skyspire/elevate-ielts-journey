import { Link } from "@tanstack/react-router";
import { Crown, X, Check } from "lucide-react";
import { useEffect } from "react";
import type { IeltsType } from "@/lib/ielts-type";

type Props = {
  open: boolean;
  onClose: () => void;
  currentType: IeltsType;
  wantedType: IeltsType;
};

const LABEL = { academic: "Academic", general: "General Training" } as const;

export function UpgradeToAllAccessPopup({ open, onClose, currentType, wantedType }: Props) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center px-4 sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-md"
      />

      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200 sm:p-8"
        style={{ borderTop: "4px solid oklch(0.7 0.18 75)" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(140deg, oklch(0.75 0.18 75), oklch(0.55 0.18 50))",
              boxShadow: "0 8px 18px -6px oklch(0.65 0.18 60 / 0.55)",
            }}
          >
            <Crown className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: "oklch(0.55 0.18 50)" }}>
            All Access required
          </span>
        </div>

        <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[26px]">
          Your plan covers {LABEL[currentType]}.
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-[15px]">
          To access <span className="font-bold text-foreground">{LABEL[wantedType]}</span> content too, upgrade to{" "}
          <span className="font-bold text-foreground">All Access</span>. One subscription, both IELTS types.
        </p>

        <ul className="mt-4 space-y-1.5 text-[13px] font-semibold text-foreground">
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Academic + General writing, reading, ebooks</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Switch types anytime</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Same shared Speaking, Listening & Vocabulary</li>
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/pricing"
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{
              background:
                "linear-gradient(140deg, oklch(0.7 0.18 75), oklch(0.55 0.18 50))",
              boxShadow: "0 10px 20px -8px oklch(0.65 0.18 60 / 0.55)",
            }}
          >
            See All Access plans
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-full border px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted"
            style={{ borderColor: "oklch(0.9 0.01 250)" }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
