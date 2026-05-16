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
// Footer bar — warm, soothing tones that still match the IELTS type hue
const SOLID = {
  academic: "oklch(0.38 0.09 258)", // warm muted indigo
  general: "oklch(0.42 0.11 32)", // warm muted terracotta
} as const;

// Popup — warm, soothing earthy tone (same for both types) so the fullscreen
// experience reads as calm and premium, not loud.
const POPUP_BG = "oklch(0.32 0.05 55)"; // warm deep mocha / espresso
const POPUP_ACCENT = "oklch(0.78 0.10 70)"; // soft warm sand for icon chips

const ACCENTS = {
  amber: "oklch(0.85 0.10 75)",
  sand: "oklch(0.82 0.07 80)",
  rose: "oklch(0.78 0.09 30)",
  sage: "oklch(0.78 0.07 145)",
  sky: "oklch(0.78 0.08 230)",
  clay: "oklch(0.75 0.10 50)",
} as const;

// Cream body for ambient readability on dark cards.
const CREAM = "#FFF6E0";

function Key({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  // Shimmer-sweep keyword on warm dark cards.
  return (
    <span className={`text-shimmer-white font-black ${className}`}>
      {children}
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
    { icon: FileText, label: "Ebooks library", color: ACCENTS.sage, desc: "Strategy & vocabulary PDFs you can read in-app" },
    { icon: CalendarDays, label: "Recent exams", color: ACCENTS.rose, desc: "Verified questions reported by real test-takers" },
    { icon: Sparkles, label: "Weekly predictions", color: ACCENTS.clay, desc: "Fresh forecasts every Saturday by our IELTS specialists" },
    { icon: Icon, label: "Sample answers", color: ACCENTS.sand, desc: `${wantedLabel}-specific model responses, fully annotated` },
  ];

  return (
    <>
      {/* spacer so fixed bar never covers content */}
      <div aria-hidden className="h-14 sm:h-16" />

      <div
        className="fixed inset-x-0 bottom-0 z-[90] text-white shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.45)]"
        style={{ backgroundColor: solid, paddingBottom: "env(safe-area-inset-bottom)" }}
        role="region"
        aria-label={`${wantedLabel} subscription required`}
      >
        <div className="relative mx-auto flex w-full max-w-6xl items-center gap-2.5 px-3 py-2 sm:gap-4 sm:px-6 sm:py-2.5">
          {/* Lock badge */}
          <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 sm:flex">
            <Lock className="h-4 w-4" strokeWidth={2.5} />
          </span>

          {/* Single-line copy */}
          <div className="min-w-0 flex-1 truncate" style={{ color: CREAM }}>
            <h3 className="truncate font-display text-[13.5px] font-bold leading-tight tracking-tight sm:text-[15px]">
              <Key>One subscription</Key> · entire <Key>{wantedLabel}</Key> library
            </h3>
          </div>

          {/* See what's included — compact trigger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group hidden shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-white/90 ring-1 ring-white/20 hover:bg-white/15 sm:inline-flex"
          >
            What's included
            <Maximize2 className="h-3 w-3 transition-transform group-hover:scale-110" />
          </button>
          <button
            type="button"
            aria-label="What's included"
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 sm:hidden"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* CTA */}
          <Link
            to={ctaTo}
            className="group inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-3.5 text-[12px] font-extrabold tracking-tight shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:h-10 sm:px-5 sm:text-[13px]"
            style={{ color: solid }}
          >
            {ctaText}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
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
            style={{ backgroundColor: POPUP_BG }}
          >
            {/* Decorative warm halos */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
              style={{ background: POPUP_ACCENT }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full opacity-20 blur-3xl"
              style={{ background: ACCENTS.clay }}
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex-1 overflow-y-auto px-6 py-10 sm:px-12 sm:py-14">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ring-1 ring-white/20">
                <Lock className="h-3.5 w-3.5" /> {wantedLabel} subscription
              </div>

              {/* Headline — readable size, warm cream body, white keywords */}
              <h2
                className="mt-5 font-display text-[26px] font-bold leading-[1.1] tracking-tight sm:text-[34px] md:text-[40px]"
                style={{ color: CREAM }}
              >
                <Key>One subscription.</Key>
                <br />
                The <Key>entire {wantedLabel}</Key>
                <br />
                library, unlocked.
              </h2>

              <p
                className="mt-4 max-w-2xl text-[14.5px] font-medium leading-relaxed sm:text-[15.5px]"
                style={{ color: CREAM }}
              >
                Not a single page. Not a single module. Every IELTS{" "}
                <Key>{wantedLabel}</Key> resource we publish — written and updated by our{" "}
                <Key>IELTS specialists</Key>.
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
                <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: ACCENTS.sage }} /> Instant access</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: ACCENTS.amber }} /> Cancel anytime</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" style={{ color: ACCENTS.sky }} /> Updated monthly</li>
              </ul>
            </div>

            {/* Sticky CTA footer inside popup — no price pill */}
            <div className="relative flex items-center justify-end border-t border-white/15 bg-white/5 px-6 py-4 backdrop-blur sm:px-12 sm:py-5">
              <Link
                to={ctaTo}
                onClick={() => setOpen(false)}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-extrabold tracking-tight shadow-xl transition-transform hover:-translate-y-0.5"
                style={{ color: POPUP_BG }}
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
