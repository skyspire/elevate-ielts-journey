import { Check, Minus, Star } from "lucide-react";

const freeIncludes = [
  "Sign up required to view any sample",
  "5 Writing sample answers (lifetime)",
  "5 Speaking sample answers (lifetime)",
  "Browse questions & topics",
];

const freeLimits = [
  "Vocabulary builder",
  "Prediction questions",
  "Topic-wise practice sets",
  "Templates & full library",
];

const paidIncludes = [
  "Unlimited Writing & Speaking samples",
  "Hundreds of Writing & Speaking templates",
  "Full vocabulary builder — words, phrases, expressions",
  "Prediction questions for upcoming exams",
  "Topic-wise organized practice sets",
  "All learning resources & survival kits",
  "New questions added every month",
];

// Ivory + deep navy + burgundy palette
const NAVY = "oklch(0.28 0.04 260)";
const NAVY_SOFT = "oklch(0.42 0.04 260)";
const BURGUNDY = "oklch(0.42 0.13 20)";
const IVORY = "oklch(0.985 0.008 85)";
const IVORY_DEEP = "oklch(0.96 0.012 80)";
const HAIRLINE = "oklch(0.85 0.015 80)";

const plans = [
  {
    duration: "15 Days",
    price: "$7",
    sub: "CAD",
    tag: null as string | null,
  },
  {
    duration: "1 Month",
    price: "$12",
    sub: "CAD",
    tag: "Most Popular",
  },
  {
    duration: "3 Months",
    price: "$29",
    sub: "CAD",
    tag: "Best Value",
  },
];

export function FreeVsPaid() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ background: IVORY }}
    >
      {/* One subtle detail: faint ruled-paper baseline grid, very low opacity */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 39px, ${NAVY} 39px 40px)`,
        }}
      />

      <div className="container-page relative">
        {/* Eyebrow */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2">
            <span
              className="h-px w-8"
              style={{ background: NAVY, opacity: 0.4 }}
            />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: NAVY_SOFT }}
            >
              Plans & Access
            </span>
            <span
              className="h-px w-8"
              style={{ background: NAVY, opacity: 0.4 }}
            />
          </div>

          <h2
            className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-5xl"
            style={{ color: NAVY }}
          >
            Free to start.{" "}
            <span style={{ color: BURGUNDY, fontStyle: "italic" }}>
              Built for Band 8+.
            </span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed"
            style={{ color: NAVY_SOFT }}
          >
            A limited free tier to explore the platform, and a complete
            subscription for serious preparation.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.25fr] lg:gap-8">
          {/* ============ FREE ============ */}
          <article
            className="relative flex flex-col rounded-2xl p-8 sm:p-10"
            style={{
              background: IVORY_DEEP,
              border: `1px solid ${HAIRLINE}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: NAVY_SOFT }}
              >
                Free Tier
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  color: NAVY_SOFT,
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                Sign up required
              </span>
            </div>

            <h3
              className="mt-6 font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ color: NAVY }}
            >
              Explore the basics
            </h3>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: NAVY_SOFT }}
            >
              A taste of the platform. Limited samples, no recurring access.
            </p>

            <div className="mt-7 flex items-baseline gap-2">
              <span
                className="font-display text-5xl font-semibold tracking-tight"
                style={{ color: NAVY }}
              >
                $0
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: NAVY_SOFT }}
              >
                / forever
              </span>
            </div>

            <div
              className="mt-7 h-px w-full"
              style={{ background: HAIRLINE }}
            />

            <p
              className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: NAVY_SOFT }}
            >
              Included
            </p>
            <ul className="mt-4 space-y-3">
              {freeIncludes.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-[15px] leading-relaxed"
                  style={{ color: NAVY }}
                >
                  <Check
                    className="mt-1 h-4 w-4 shrink-0"
                    strokeWidth={2.5}
                    style={{ color: NAVY }}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <p
              className="mt-7 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: NAVY_SOFT }}
            >
              Not included
            </p>
            <ul className="mt-4 space-y-2.5">
              {freeLimits.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                  style={{ color: NAVY_SOFT, opacity: 0.75 }}
                >
                  <Minus
                    className="mt-1 h-4 w-4 shrink-0"
                    strokeWidth={2.5}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              className="mt-9 h-11 rounded-md text-sm font-semibold tracking-wide transition-colors hover:opacity-90"
              style={{
                color: NAVY,
                border: `1px solid ${NAVY}`,
                background: "transparent",
              }}
            >
              Sign up free
            </button>
          </article>

          {/* ============ PAID ============ */}
          <article
            className="relative flex flex-col overflow-hidden rounded-2xl p-8 sm:p-10"
            style={{
              background: NAVY,
              color: IVORY,
              boxShadow:
                "0 30px 60px -30px oklch(0.28 0.04 260 / 0.45), 0 8px 20px -10px oklch(0.28 0.04 260 / 0.3)",
            }}
          >
            {/* subtle inner top hairline accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${BURGUNDY}, transparent)`,
                opacity: 0.6,
              }}
            />

            <div className="flex items-center justify-between">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: IVORY, opacity: 0.7 }}
              >
                Full Access
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
                style={{
                  color: IVORY,
                  background: BURGUNDY,
                }}
              >
                <Star className="h-3 w-3 fill-current" />
                Recommended
              </span>
            </div>

            <h3
              className="mt-6 font-display text-2xl font-semibold tracking-tight sm:text-[2rem] sm:leading-[1.15]"
              style={{ color: IVORY }}
            >
              Unlimited access.{" "}
              <span style={{ color: "oklch(0.85 0.08 25)", fontStyle: "italic" }}>
                The complete library.
              </span>
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed sm:text-base"
              style={{ color: IVORY, opacity: 0.72 }}
            >
              One subscription unlocks every sample, template, vocabulary set,
              prediction, and resource we publish.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-6">
              {paidIncludes.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-[14.5px] leading-relaxed"
                  style={{ color: IVORY, opacity: 0.95 }}
                >
                  <Check
                    className="mt-1 h-4 w-4 shrink-0"
                    strokeWidth={2.5}
                    style={{ color: "oklch(0.85 0.08 25)" }}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* Plans */}
            <div
              className="mt-10 pt-8"
              style={{ borderTop: `1px solid oklch(1 0 0 / 0.12)` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p
                  className="font-display text-base font-semibold tracking-tight sm:text-lg"
                  style={{ color: IVORY }}
                >
                  Choose your plan
                </p>
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: IVORY, opacity: 0.55 }}
                >
                  Cancel anytime
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {plans.map((p, i) => {
                  const isPopular = i === 1;
                  return (
                    <button
                      key={p.duration}
                      className="group/plan relative flex flex-col items-start rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: isPopular
                          ? "oklch(1 0 0 / 0.08)"
                          : "oklch(1 0 0 / 0.03)",
                        border: isPopular
                          ? `1px solid ${BURGUNDY}`
                          : `1px solid oklch(1 0 0 / 0.1)`,
                      }}
                    >
                      {p.tag && (
                        <span
                          className="absolute -top-2.5 left-4 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest"
                          style={{
                            background: isPopular ? BURGUNDY : IVORY,
                            color: isPopular ? IVORY : NAVY,
                          }}
                        >
                          {p.tag}
                        </span>
                      )}
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: IVORY, opacity: 0.6 }}
                      >
                        {p.duration}
                      </span>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span
                          className="font-display text-2xl font-semibold tracking-tight"
                          style={{ color: IVORY }}
                        >
                          {p.price}
                        </span>
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: IVORY, opacity: 0.55 }}
                        >
                          {p.sub}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                className="mt-6 h-11 w-full rounded-md text-sm font-semibold tracking-wide transition-opacity hover:opacity-90"
                style={{
                  background: IVORY,
                  color: NAVY,
                }}
              >
                Continue with selected plan
              </button>

              <p
                className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.18em]"
                style={{ color: IVORY, opacity: 0.5 }}
              >
                Instant access · One account, all devices
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
