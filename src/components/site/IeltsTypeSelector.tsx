import { Lock } from "lucide-react";
import type { IeltsType } from "@/lib/ielts-type";

/**
 * Universal IELTS Academic vs General Training selector.
 * Two large rounded-pill buttons:
 *   - Academic = solid blue
 *   - General Training = soft peach/cream with warm border
 * Use this anywhere a learner needs to pick their IELTS track.
 */
export function IeltsTypeSelector({
  value,
  onChange,
  lockedAcademic = false,
  lockedGeneral = false,
  className = "",
}: {
  value: IeltsType;
  onChange: (t: IeltsType) => void;
  lockedAcademic?: boolean;
  lockedGeneral?: boolean;
  className?: string;
}) {
  const options: {
    key: IeltsType;
    label: string;
    activeBg: string;
    accent: string;
    idleTint: string;
    glow: string;
    locked: boolean;
  }[] = [
    {
      key: "academic",
      label: "Academic",
      activeBg:
        "linear-gradient(135deg, oklch(0.55 0.16 250) 0%, oklch(0.48 0.18 245) 100%)",
      accent: "oklch(0.52 0.17 248)",
      idleTint:
        "linear-gradient(135deg, oklch(0.985 0.012 240) 0%, oklch(0.965 0.025 240) 100%)",
      glow: "0 12px 28px -12px oklch(0.50 0.18 248 / 0.55)",
      locked: lockedAcademic,
    },
    {
      key: "general",
      label: "General Training",
      activeBg:
        "linear-gradient(135deg, oklch(0.62 0.19 32) 0%, oklch(0.55 0.20 25) 100%)",
      accent: "oklch(0.58 0.19 30)",
      idleTint:
        "linear-gradient(135deg, oklch(0.985 0.014 50) 0%, oklch(0.965 0.030 40) 100%)",
      glow: "0 12px 28px -12px oklch(0.55 0.20 30 / 0.55)",
      locked: lockedGeneral,
    },
  ];

  return (
    <div className={`mx-auto w-full max-w-xl ${className}`}>
      <div
        role="radiogroup"
        aria-label="IELTS exam track"
        className="grid grid-cols-2 gap-3 sm:gap-4"
      >
        {options.map((opt) => {
          const active = value === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.key)}
              className="group relative overflow-hidden rounded-2xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: active ? opt.activeBg : opt.idleTint,
                borderColor: active ? "transparent" : "oklch(0.90 0.01 60)",
                boxShadow: active ? opt.glow : "0 1px 2px oklch(0 0 0 / 0.04)",
                transform: active ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              {!active && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: opt.accent, opacity: 0.85 }}
                />
              )}

              <span
                className="flex items-center justify-center gap-2 px-4 py-4 text-center font-display text-base font-black tracking-tight sm:px-5 sm:py-5 sm:text-lg"
                style={{
                  color: active ? "oklch(0.99 0.01 80)" : "oklch(0.22 0.03 60)",
                }}
              >
                {opt.locked && (
                  <Lock
                    className="h-3.5 w-3.5"
                    strokeWidth={2.6}
                    style={{
                      color: active
                        ? "oklch(0.99 0.01 80 / 0.85)"
                        : "oklch(0.45 0.03 60 / 0.7)",
                    }}
                  />
                )}
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
