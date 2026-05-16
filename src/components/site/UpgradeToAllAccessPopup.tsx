import { Link } from "@tanstack/react-router";
import { Lock, X, Check, GraduationCap, Briefcase } from "lucide-react";
import { useEffect } from "react";
import type { IeltsType } from "@/lib/ielts-type";

type Props = {
  open: boolean;
  onClose: () => void;
  /** The type the user is currently subscribed to (may be null for guests / unpaid). */
  currentType: IeltsType | null;
  /** The type the locked content belongs to. */
  wantedType: IeltsType;
  /** True when there's no logged-in learner — CTA flips to "Log in to continue". */
  guest?: boolean;
};

const LABEL = { academic: "Academic", general: "General Training" } as const;
const ICONS = { academic: GraduationCap, general: Briefcase } as const;
const ACCENT = { academic: "oklch(0.55 0.2 255)", general: "oklch(0.6 0.18 30)" } as const;

export function UpgradeToAllAccessPopup({ open, onClose, currentType, wantedType, guest }: Props) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const WantedIcon = ICONS[wantedType];
  const accent = ACCENT[wantedType];

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
        style={{ borderTop: `4px solid ${accent}` }}
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
              background: `linear-gradient(140deg, ${accent}, color-mix(in oklab, ${accent} 65%, black))`,
              boxShadow: `0 8px 18px -6px ${accent}88`,
            }}
          >
            <Lock className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: accent }}>
            {guest ? "Login required" : `${LABEL[wantedType]} subscription required`}
          </span>
        </div>

        <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[26px]">
          {guest
            ? "Log in to open this content."
            : currentType
              ? `Your plan covers ${LABEL[currentType]} only.`
              : `This is ${LABEL[wantedType]} content.`}
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground sm:text-[15px]">
          {guest ? (
            <>You need an account before opening any IELTS practice item.</>
          ) : currentType ? (
            <>
              To access <span className="font-bold text-foreground">{LABEL[wantedType]}</span> content too, buy the{" "}
              <span className="font-bold text-foreground">{LABEL[wantedType]} subscription</span> separately. Plans are sold per
              IELTS type.
            </>
          ) : (
            <>Subscribe to <span className="font-bold text-foreground">{LABEL[wantedType]}</span> to unlock this item.</>
          )}
        </p>

        {!guest && (
          <ul className="mt-4 space-y-1.5 text-[13px] font-semibold text-foreground">
            <li className="flex items-center gap-2">
              <WantedIcon className="h-4 w-4" style={{ color: accent }} />
              All {LABEL[wantedType]} writing, reading, ebooks, exams & predictions
            </li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Same Bi-weekly / Monthly / 3-month pricing</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Shared Speaking, Listening & Vocabulary stay available</li>
          </ul>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            to={guest ? "/login" : "/pricing"}
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(140deg, ${accent}, color-mix(in oklab, ${accent} 65%, black))`,
              boxShadow: `0 10px 20px -8px ${accent}88`,
            }}
          >
            {guest ? "Log in to continue" : `Get ${LABEL[wantedType]} subscription`}
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
