import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Lock,
  ArrowRight,
  GraduationCap,
  Briefcase,
  X,
  PenLine,
  BookOpen,
  FileText,
  CalendarDays,
  Sparkles,
  Maximize2,
  Check,
} from "lucide-react";
import type { IeltsType } from "@/lib/ielts-type";

type Props = {
  wantedType: IeltsType;
  currentType: IeltsType | null;
  guest?: boolean;
};

const LABEL = { academic: "Academic", general: "General Training" } as const;
const ICONS = { academic: GraduationCap, general: Briefcase } as const;
// Bold solid colors (no gradient)
const SOLID = {
  academic: "oklch(0.35 0.18 258)", // deep indigo
  general: "oklch(0.45 0.20 28)", // deep terracotta
} as const;

// Accent palette used for highlighting different words in the copy
const ACCENTS = {
  amber: "oklch(0.85 0.18 85)",
  emerald: "oklch(0.78 0.16 155)",
  pink: "oklch(0.78 0.18 0)",
  sky: "oklch(0.80 0.13 230)",
  lime: "oklch(0.86 0.18 125)",
  violet: "oklch(0.78 0.14 305)",
} as const;

function Highlight({
  children,
  color,
  className = "",
}: {
  children: React.ReactNode;
  color: string;
  className?: string;
}) {
  return (
    <span className={`relative inline-block whitespace-nowrap font-extrabold text-white ${className}`}>
      <span
        aria-hidden
        className="absolute inset-x-[-4px] bottom-[3%] -z-0 h-[62%] -rotate-1 rounded-[3px]"
        style={{ background: color, opacity: 0.85 }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

export function LockedUpgradeBillboard({ wantedType, currentType, guest }: Props) {
  const Icon = ICONS[wantedType];
  const solid = SOLID[wantedType];
  const wantedLabel = LABEL[wantedType];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const ctaTo = guest ? "/login" : "/pricing";
  const ctaText = guest ? "Log in" : `Get ${wantedLabel}`;

  const features = [
    { icon: PenLine, label: "Writing Task 1", color: ACCENTS.amber, desc: "Every real prompt + Band 9 model answers" },
    { icon: BookOpen, label: "Reading", color: ACCENTS.sky, desc: "Full passages, all question types, explained" },
    { icon: FileText, label: "Ebooks library", color: ACCENTS.emerald, desc: "Strategy & vocabulary PDFs you can read in-app" },
    { icon: CalendarDays, label: "Recent exams", color: ACCENTS.pink, desc: "Verified questions reported by real test-takers" },
    { icon: Sparkles, label: "Weekly predictions", color: ACCENTS.violet, desc: "Fresh forecasts every Saturday by our IELTS specialists" },
    { icon: Icon, label: "Sample answers", color: ACCENTS.lime, desc: `${wantedLabel}-specific model responses, fully annotated` },
  ];

  return (
    <>
      {/* spacer so fixed bar never covers content */}
      <div aria-hidden className="h-28 sm:h-24" />

      <div
        className="fixed inset-x-0 bottom-0 z-[90] text-white shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.45)]"
        style={{ backgroundColor: solid, paddingBottom: "env(safe-area-inset-bottom)" }}
        role="region"
        aria-label={`${wantedLabel} subscription required`}
      >
        <div className="relative mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6 sm:py-4">
          {/* Lock badge */}
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 sm:flex">
            <Lock className="h-5 w-5" strokeWidth={2.5} />
          </span>

          {/* Copy */}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[16px] font-black leading-tight tracking-tight sm:text-xl md:text-[22px]">
              <Highlight color={ACCENTS.amber}>One subscription.</Highlight>{" "}
              <span className="text-white">The </span>
              <Highlight color={ACCENTS.emerald}>entire {wantedLabel}</Highlight>{" "}
              <span className="text-white">library.</span>
            </h3>
            <p className="mt-1.5 hidden text-[13px] font-bold leading-snug text-white/90 sm:block sm:text-[14px]">
              {currentType ? (
                <>
                  Not just one page or module —{" "}
                  <Highlight color={ACCENTS.sky} className="text-[13px] sm:text-[14px]">
                    every {wantedLabel} resource
                  </Highlight>{" "}
                  is sold separately. Same pricing as your current plan.
                </>
              ) : (
                <>
                  Not a single page. Not a single module.{" "}
                  <Highlight color={ACCENTS.pink} className="text-[13px] sm:text-[14px]">
                    Everything {wantedLabel}
                  </Highlight>{" "}
                  — Writing, Reading, Ebooks, Exams & Predictions.
                </>
              )}
            </p>

            {/* See what's included — animated trigger */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group mt-2 inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-white/95 underline-offset-4 hover:underline sm:text-[13px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              See what's included
              <Maximize2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            </button>
          </div>

          {/* CTA + price chip */}
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Link
              to={ctaTo}
              className="group inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-extrabold tracking-tight shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:h-12 sm:px-6 sm:text-sm"
              style={{ color: solid }}
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {!guest && (
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10.5px] font-bold tracking-tight text-white ring-1 ring-white/30">
                From $9 / 2 weeks
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN ZOOM-FROM-CENTER POPUP */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          />

          <div
            className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl text-white shadow-2xl animate-in zoom-in-95 fade-in duration-300"
            style={{ backgroundColor: solid }}
          >
            {/* Decorative halos */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
              style={{ background: "white" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full opacity-25 blur-3xl"
              style={{ background: ACCENTS.amber }}
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 ring-1 ring-white/30 transition-colors hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex-1 overflow-y-auto px-6 py-10 sm:px-12 sm:py-14">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ring-1 ring-white/25">
                <Lock className="h-3.5 w-3.5" /> {wantedLabel} subscription
              </div>

              {/* Headline */}
              <h2 className="mt-5 font-display text-[34px] font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                <Highlight color={ACCENTS.amber} className="text-[34px] sm:text-5xl md:text-6xl">
                  One subscription.
                </Highlight>
                <br />
                <span className="text-white">The </span>
                <Highlight color={ACCENTS.emerald} className="text-[34px] sm:text-5xl md:text-6xl">
                  entire {wantedLabel}
                </Highlight>
                <br />
                <span className="text-white">library, unlocked.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-[15px] font-semibold leading-relaxed text-white/90 sm:text-lg">
                Not a single page. Not a single module. Every IELTS{" "}
                <Highlight color={ACCENTS.sky}>{wantedLabel}</Highlight> resource we publish — written
                and updated by our <Highlight color={ACCENTS.pink}>IELTS specialists</Highlight>.
              </p>

              {/* Feature grid */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {features.map((f) => {
                  const FIcon = f.icon;
                  return (
                    <div
                      key={f.label}
                      className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur transition-transform hover:-translate-y-0.5 sm:p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: f.color }}
                        >
                          <FIcon className="h-5 w-5 text-black" strokeWidth={2.5} />
                        </span>
                        <h3
                          className="font-display text-lg font-black tracking-tight sm:text-xl"
                          style={{ color: f.color }}
                        >
                          {f.label}
                        </h3>
                      </div>
                      <p className="mt-2 text-[13.5px] font-semibold leading-snug text-white/85 sm:text-sm">
                        {f.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Trust row */}
              <ul className="mt-6 grid gap-2 text-[13.5px] font-bold text-white/90 sm:grid-cols-3 sm:text-sm">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: ACCENTS.emerald }} /> Instant access</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: ACCENTS.amber }} /> Cancel anytime</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: ACCENTS.sky }} /> Updated monthly</li>
              </ul>
            </div>

            {/* Sticky CTA footer inside popup */}
            <div className="relative flex flex-col items-stretch gap-2 border-t border-white/15 bg-white/5 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-black tracking-tight text-white">$9</span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-white/75">/ 2 weeks · CAD</span>
              </div>
              <Link
                to={ctaTo}
                onClick={() => setOpen(false)}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-extrabold tracking-tight shadow-xl transition-transform hover:-translate-y-0.5"
                style={{ color: solid }}
              >
                {ctaText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
