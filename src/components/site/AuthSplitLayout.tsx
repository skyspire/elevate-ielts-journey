import { Link } from "@tanstack/react-router";
import { Quote, Sparkles, Globe2, BookOpen } from "lucide-react";
import authHero from "@/assets/auth-hero.png";
import brandLogo from "@/assets/bigielts-logo.png";

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
        <div className="absolute left-8 top-8 z-10 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/60 px-3 py-1.5 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            Used by 120,000+ test-takers
          </span>
        </div>

        {/* Bottom content card */}
        <div className="absolute inset-x-8 bottom-8 z-10">
          <div className="rounded-2xl border border-foreground/10 bg-background/68 p-6 shadow-[0_20px_60px_-20px_oklch(0.3_0.05_250/0.35)]">
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
      <div
        className="relative flex h-screen flex-col overflow-y-auto px-5 py-6 sm:px-10 lg:px-14 lg:py-8"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.95 0.05 78) 0%, oklch(0.88 0.11 62) 36%, oklch(0.79 0.16 42) 100%)",
        }}
      >
        {/* Premium warm glow — golden amber */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 85% 12%, oklch(0.91 0.14 78 / 0.95), transparent 34%), radial-gradient(circle at 18% 28%, oklch(0.82 0.17 38 / 0.72), transparent 40%), radial-gradient(circle at 78% 82%, oklch(0.7 0.18 34 / 0.58), transparent 38%), radial-gradient(circle at 35% 92%, oklch(0.89 0.12 58 / 0.52), transparent 30%)",
          }}
        />
        {/* Soft texture */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.35 0.08 40) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Brand row */}
        <div className="relative flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center text-foreground"
            aria-label="BigIELTS home"
          >
            <img
              src={brandLogo}
              alt="BigIELTS.com"
              style={{ height: 56 }}
              className="w-auto object-contain"
            />
          </Link>
          <Link
            to="/"
            className="rounded-full border border-foreground/15 bg-background/55 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-background/70"
          >
            ← Back to site
          </Link>
        </div>

        {/* Form block — clean professional card */}
        <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-4">
          <div className="rounded-2xl border border-border/60 bg-background/72 p-5 shadow-[0_20px_50px_-25px_oklch(0.3_0.08_260/0.25)] sm:p-6">
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
