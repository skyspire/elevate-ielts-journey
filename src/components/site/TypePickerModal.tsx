import { useEffect, useState } from "react";
import { GraduationCap, Briefcase, Sparkles } from "lucide-react";
import { hasPickedType, setActiveType, getActiveType } from "@/lib/ielts-type";
import { useLearnerSession } from "@/lib/learner-auth";

/**
 * First-visit modal: forces a guest to pick Academic or General.
 * Hidden once chosen, and never shown for signed-in learners (they're locked by plan).
 */
export function TypePickerModal() {
  const { user } = useLearnerSession();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<"academic" | "general" | null>(null);

  useEffect(() => {
    if (user) {
      setOpen(false);
      return;
    }
    if (typeof window === "undefined") return;
    setOpen(!hasPickedType());
  }, [user]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const pick = (t: "academic" | "general") => {
    setActiveType(t);
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="type-picker-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative w-full max-w-2xl rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200 sm:p-8">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "oklch(0.55 0.18 30)" }} strokeWidth={2.5} />
          <span
            className="text-[11px] font-extrabold uppercase tracking-wider"
            style={{ color: "oklch(0.55 0.18 30)" }}
          >
            Welcome to BigIELTS
          </span>
        </div>

        <h2
          id="type-picker-title"
          className="mt-3 text-center font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[30px]"
        >
          Which IELTS are you preparing for?
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-muted-foreground sm:text-[15px]">
          Pick one to personalize your practice. You can change it anytime before you subscribe.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {/* Academic */}
          <button
            type="button"
            onClick={() => pick("academic")}
            onMouseEnter={() => setHover("academic")}
            onMouseLeave={() => setHover(null)}
            className="group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all"
            style={{
              borderColor: hover === "academic" ? "oklch(0.55 0.2 255)" : "oklch(0.9 0.01 250)",
              background:
                hover === "academic"
                  ? "linear-gradient(140deg, oklch(0.96 0.05 255), oklch(0.92 0.08 255))"
                  : "white",
              transform: hover === "academic" ? "translateY(-2px)" : "translateY(0)",
              boxShadow:
                hover === "academic"
                  ? "0 14px 30px -10px oklch(0.55 0.2 255 / 0.4)"
                  : "0 1px 0 oklch(0.9 0.01 250)",
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(140deg, oklch(0.6 0.2 255), oklch(0.45 0.2 260))",
                boxShadow:
                  "0 10px 20px -8px oklch(0.55 0.2 255 / 0.6), inset 0 1px 0 oklch(1 0 0 / 0.4)",
              }}
            >
              <GraduationCap className="h-6 w-6 text-white" strokeWidth={2.4} />
            </div>
            <div className="mt-3 font-display text-xl font-black tracking-tight text-foreground">
              IELTS Academic
            </div>
            <p className="mt-1 text-[13px] font-medium leading-snug text-muted-foreground">
              For university, college, or professional registration. Includes Writing Task 1 charts
              & graphs, academic reading passages.
            </p>
          </button>

          {/* General */}
          <button
            type="button"
            onClick={() => pick("general")}
            onMouseEnter={() => setHover("general")}
            onMouseLeave={() => setHover(null)}
            className="group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all"
            style={{
              borderColor: hover === "general" ? "oklch(0.6 0.18 30)" : "oklch(0.9 0.01 250)",
              background:
                hover === "general"
                  ? "linear-gradient(140deg, oklch(0.97 0.04 50), oklch(0.93 0.08 35))"
                  : "white",
              transform: hover === "general" ? "translateY(-2px)" : "translateY(0)",
              boxShadow:
                hover === "general"
                  ? "0 14px 30px -10px oklch(0.6 0.18 30 / 0.4)"
                  : "0 1px 0 oklch(0.9 0.01 250)",
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(140deg, oklch(0.65 0.18 35), oklch(0.5 0.18 25))",
                boxShadow:
                  "0 10px 20px -8px oklch(0.6 0.18 30 / 0.6), inset 0 1px 0 oklch(1 0 0 / 0.4)",
              }}
            >
              <Briefcase className="h-6 w-6 text-white" strokeWidth={2.4} />
            </div>
            <div className="mt-3 font-display text-xl font-black tracking-tight text-foreground">
              IELTS General Training
            </div>
            <p className="mt-1 text-[13px] font-medium leading-snug text-muted-foreground">
              For work, migration, or secondary education. Includes Writing Task 1 letters and
              workplace/everyday reading.
            </p>
          </button>
        </div>

        <p className="mt-5 text-center text-[11px] font-semibold text-muted-foreground">
          Not sure? Most learners pick <button onClick={() => pick("academic")} className="underline">Academic</button> — you can switch later.
        </p>

        {/* No close button — picking is required */}
        <span className="sr-only">{`Current type: ${getActiveType()}`}</span>
      </div>
    </div>
  );
}
