import { Link } from "@tanstack/react-router";
import { GraduationCap, Quote, Sparkles, Globe2, BookOpen } from "lucide-react";
import authHero from "@/assets/auth-hero.jpg";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthSplitLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* LEFT — form */}
      <div className="relative flex min-h-screen flex-col px-5 py-8 sm:px-10 lg:px-14 lg:py-12">
        {/* Brand row */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-foreground"
            aria-label="BigIELTS home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              BigIELTS<span className="text-primary">.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground transition hover:text-foreground"
          >
            ← Back to site
          </Link>
        </div>

        {/* Form block */}
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-[34px]">
              {title}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>

        {footer && (
          <div className="mx-auto w-full max-w-md text-center text-xs text-muted-foreground">
            {footer}
          </div>
        )}
      </div>

      {/* RIGHT — hero panel */}
      <div className="relative hidden overflow-hidden lg:block">
        {/* Background image */}
        <img
          src={authHero}
          alt="Student preparing for IELTS at a sunlit desk with books, vocabulary notes, and a globe"
          width={1024}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Soft warm overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.95 0.03 80 / 0.55) 0%, oklch(0.92 0.05 250 / 0.45) 100%)",
          }}
        />
        {/* Paper grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.3 0.02 60) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Top trust pill */}
        <div className="absolute left-8 top-8 z-10 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/80 px-3 py-1.5 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            Used by 120,000+ test-takers
          </span>
        </div>

        {/* Bottom content card */}
        <div className="absolute inset-x-8 bottom-8 z-10">
          <div className="rounded-2xl border border-foreground/10 bg-background/85 p-6 shadow-[0_20px_60px_-20px_oklch(0.3_0.05_250/0.35)] backdrop-blur-md">
            <div className="flex items-start gap-3">
              <Quote className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <p className="font-display text-[17px] font-semibold leading-snug text-foreground">
                "BigIELTS got me from Band 6.5 to Band 8 in eight weeks. The sample answers and
                speaking topics felt like the real exam."
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-foreground">Priya R.</div>
                <div className="text-xs text-muted-foreground">Band 8 · India → Canada PR</div>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Globe2 className="h-3 w-3" /> 40+ countries
                </span>
                <span className="inline-flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Updated monthly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
