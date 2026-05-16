import { Link } from "@tanstack/react-router";
import { Lock, Sparkles, ArrowRight, GraduationCap, Briefcase, Check } from "lucide-react";
import type { IeltsType } from "@/lib/ielts-type";

type Props = {
  /** Type the locked content belongs to (what the user needs to buy). */
  wantedType: IeltsType;
  /** The type the user already owns (null = guest / no plan). */
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
    ? `Log in to unlock ${wantedLabel} practice`
    : currentType
      ? `Add ${wantedLabel} to your plan`
      : `Unlock ${wantedLabel} content`;

  const sub = guest
    ? "Create your free account, then choose your IELTS track to open every Writing, Reading, ebook, exam & prediction."
    : currentType
      ? `Your subscription covers ${LABEL[currentType]} only. ${wantedLabel} is sold separately — same pricing tiers, instant access.`
      : `Pick a plan and start practising real ${wantedLabel} questions, ebooks, recent exams & weekly predictions.`;

  const ctaTo = guest ? "/login" : "/pricing";
  const ctaText = guest ? "Log in to continue" : `Get ${wantedLabel} subscription`;

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-3xl text-white shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, color-mix(in oklab, ${accent} 55%, black) 100%)`,
      }}
    >
      {/* decorative halos */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: `color-mix(in oklab, ${accent} 50%, white)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
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

      <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-10">
        <div className="min-w-0">
          {/* eyebrow */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <Lock className="h-4.5 w-4.5" strokeWidth={2.5} />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.18em] ring-1 ring-white/25 backdrop-blur">
              <Sparkles className="h-3 w-3" /> {wantedLabel} locked
            </span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl md:text-[44px]">
            {headline}
          </h2>
          <p className="mt-3 max-w-xl text-[14.5px] font-medium leading-relaxed text-white/85 sm:text-[15.5px]">
            {sub}
          </p>

          <ul className="mt-5 grid gap-2 text-[13.5px] font-semibold sm:grid-cols-2 sm:text-sm">
            <li className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-white/90" />
              All {wantedLabel} Writing Task 1 & Reading
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-200" />
              Ebooks, recent exams & predictions
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-200" />
              Updated monthly by our IELTS team
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-200" />
              Bi-weekly / Monthly / 3-month plans
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <Link
            to={ctaTo}
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-[15px] font-extrabold tracking-tight shadow-xl transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ color: accent }}
          >
            {ctaText}
            <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-center text-[11.5px] font-bold uppercase tracking-[0.18em] text-white/75 md:text-right">
            Instant access · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
