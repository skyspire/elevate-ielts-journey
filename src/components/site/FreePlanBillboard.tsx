import { Link } from "@tanstack/react-router";
import { Sparkles, Lock } from "lucide-react";
import { useLearnerSession } from "@/lib/learner-auth";

/**
 * Sticky-ish top billboard shown to free users on gated pages
 * (Predictions, Recent Exam Questions). Calls out the locked content
 * and routes to pricing / signup.
 */
export function FreePlanBillboard({
  totalCount,
  freeCount,
}: {
  /** Total premium items locked on the page. */
  totalCount: number;
  /** How many items are visible for free at the top of each list. */
  freeCount: number;
}) {
  const { user } = useLearnerSession();
  const lockedCount = Math.max(0, totalCount - freeCount);

  return (
    <div
      className="relative mx-auto mb-8 w-full max-w-5xl overflow-hidden rounded-3xl border border-black/5 px-5 py-4 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.25)] sm:px-6 sm:py-5"
      style={{
        background:
          "linear-gradient(120deg, oklch(0.97 0.03 30) 0%, oklch(0.94 0.07 22) 55%, oklch(0.96 0.05 35) 100%)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full opacity-50 blur-2xl"
        style={{ background: "oklch(0.62 0.14 22 / 0.45)" }}
      />

      <div className="relative flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.13 22), oklch(0.55 0.18 30))",
            }}
          >
            <Lock className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <div>
            <p className="font-display text-[15px] font-black tracking-tight text-foreground sm:text-base">
              You're previewing {freeCount} of {totalCount} questions
            </p>
            <p className="mt-0.5 text-[12.5px] font-medium text-foreground/65">
              {lockedCount} more {lockedCount === 1 ? "question is" : "questions are"} locked —
              upgrade to unlock every real exam question, model answer and prediction.
            </p>
          </div>
        </div>

        <Link
          to={user ? "/" : "/signup"}
          hash={user ? "pricing" : undefined}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-white shadow-md transition-transform hover:scale-[1.03] sm:text-xs"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.45 0.13 22), oklch(0.55 0.18 30))",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          {user ? "Upgrade to unlock all" : "Sign up to unlock"}
        </Link>
      </div>
    </div>
  );
}
