import { Link } from "@tanstack/react-router";
import { Lock, ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import type { IeltsType } from "@/lib/ielts-type";

type Props = {
  wantedType: IeltsType;
  currentType: IeltsType | null;
  guest?: boolean;
};

const LABEL = { academic: "Academic", general: "General Training" } as const;
const ICONS = { academic: GraduationCap, general: Briefcase } as const;
const ACCENT = { academic: "oklch(0.55 0.2 255)", general: "oklch(0.6 0.18 30)" } as const;

export function LockedUpgradeBillboard({ wantedType, currentType, guest }: Props) {
  const Icon = ICONS[wantedType];
  const accent = ACCENT[wantedType];
  const wantedLabel = LABEL[wantedType];

  const headline = guest
    ? `One subscription. The entire ${wantedLabel} library.`
    : currentType
      ? `Add the full ${wantedLabel} library to your plan.`
      : `One subscription. The entire ${wantedLabel} library.`;

  const sub = guest
    ? `Not a single page or module — every Writing Task 1, Reading, ebook, recent exam and weekly prediction in ${wantedLabel}, written by our IELTS specialists.`
    : currentType
      ? `Your plan covers ${LABEL[currentType]} only. ${wantedLabel} is sold separately — full library, same pricing.`
      : `Not a single page or module — every Writing Task 1, Reading, ebook, recent exam and weekly prediction in ${wantedLabel}, in one place.`;

  const ctaTo = guest ? "/login" : "/pricing";
  const ctaText = guest ? "Log in" : `Get ${wantedLabel}`;

  return (
    <>
      {/* spacer so fixed bar never covers content */}
      <div aria-hidden className="h-24 sm:h-20" />

      <div
        className="fixed inset-x-0 bottom-0 z-[90] text-white shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.45)]"
        style={{
          background: `linear-gradient(100deg, ${accent} 0%, color-mix(in oklab, ${accent} 55%, black) 100%)`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        role="region"
        aria-label={`${wantedLabel} subscription required`}
      >
        {/* decorative halos */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl"
          style={{ background: `color-mix(in oklab, ${accent} 50%, white)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full opacity-25 blur-3xl"
          style={{ background: "white" }}
        />
        {/* grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6 sm:py-4">
          {/* Lock badge */}
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur sm:flex">
            <Lock className="h-5 w-5" strokeWidth={2.5} />
          </span>

          {/* Copy */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 sm:hidden" />
              <h3 className="truncate font-display text-[15px] font-extrabold leading-tight tracking-tight sm:text-lg md:text-xl">
                {headline}
              </h3>
            </div>
            <p className="mt-0.5 hidden text-[12.5px] font-medium text-white/85 sm:block sm:text-[13.5px]">
              {sub}
            </p>
          </div>

          {/* CTA + price chip */}
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Link
              to={ctaTo}
              className="group inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-extrabold tracking-tight shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:h-12 sm:px-6 sm:text-sm"
              style={{ color: accent }}
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {!guest && (
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10.5px] font-bold tracking-tight text-white ring-1 ring-white/25">
                From $9 / 2 weeks
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
