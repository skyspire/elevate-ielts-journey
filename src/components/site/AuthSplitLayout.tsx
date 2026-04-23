import { Link } from "@tanstack/react-router";
import { GraduationCap, Quote, Sparkles, Globe2, BookOpen } from "lucide-react";
import authHero from "@/assets/auth-hero.png";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthSplitLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="grid h-screen w-full grid-cols-1 overflow-hidden bg-background md:grid-cols-[1fr_1.05fr]">
      {/* LEFT — hero panel (now on the LEFT) */}
      <div className="relative hidden overflow-hidden md:block">
        {/* Background image */}
        <img
          src={authHero}
          alt="Student preparing for IELTS at a sunlit desk with books, vocabulary notes, and a globe"
          width={1024}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* No overlays — show the real photo */}

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

      {/* RIGHT — colorful form panel */}
      <div className="relative flex h-screen flex-col overflow-y-auto px-5 py-6 sm:px-10 lg:px-14 lg:py-8">
        {/* Premium warm gradient base — deep amber → champagne → terracotta */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.92 0.06 75) 0%, oklch(0.86 0.09 55) 40%, oklch(0.78 0.13 40) 100%)",
          }}
        />
        {/* Warm glow — top-right (golden amber) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[560px] w-[560px] rounded-full opacity-80 blur-[110px]"
          style={{ background: "oklch(0.85 0.17 75)" }}
        />
        {/* Warm glow — center-left (rose gold) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/4 -z-10 h-[480px] w-[480px] rounded-full opacity-70 blur-[120px]"
          style={{ background: "oklch(0.78 0.15 25)" }}
        />
        {/* Warm glow — bottom-right (terracotta) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-20 -z-10 h-[500px] w-[500px] rounded-full opacity-75 blur-[120px]"
          style={{ background: "oklch(0.72 0.16 35)" }}
        />
        {/* Warm glow — bottom-left (soft peach) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/4 -z-10 h-[400px] w-[400px] rounded-full opacity-65 blur-[100px]"
          style={{ background: "oklch(0.85 0.13 60)" }}
        />
        {/* Faint warm dot grid for texture */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.35 0.1 40) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Brand row */}
        <div className="relative flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-foreground"
            aria-label="BigIELTS home"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.16 255), oklch(0.5 0.17 280))",
              }}
            >
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              BigIELTS<span className="text-primary">.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="rounded-full border border-foreground/15 bg-background/70 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur transition hover:bg-background"
          >
            ← Back to site
          </Link>
        </div>

        {/* Form block — clean professional card */}
        <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-4">
          <div className="rounded-2xl border border-border/60 bg-card/95 p-5 shadow-[0_20px_50px_-25px_oklch(0.3_0.08_260/0.25)] backdrop-blur-sm sm:p-6">
            <div className="mb-4">
              <h1
                className="font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[28px]"
              >
                {title}
                <span
                  className="ml-1 inline-block h-2 w-2 rounded-full align-middle"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.6 0.18 255), oklch(0.6 0.18 320))",
                  }}
                />
              </h1>
              <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>

          {footer && (
            <div className="mx-auto mt-3 w-full max-w-md text-center text-xs text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
