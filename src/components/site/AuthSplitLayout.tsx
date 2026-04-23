import { Link } from "@tanstack/react-router";
import { GraduationCap, Quote, Sparkles, Globe2, BookOpen, Star, Zap } from "lucide-react";
import authHero from "@/assets/auth-hero.jpg";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthSplitLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-background lg:grid-cols-[1fr_1.05fr]">
      {/* LEFT — hero panel (now on the LEFT) */}
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
            backgroundImage: "radial-gradient(oklch(0.3 0.02 60) 1px, transparent 1px)",
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

      {/* RIGHT — colorful form panel */}
      <div className="relative flex min-h-screen flex-col overflow-hidden px-5 py-8 sm:px-10 lg:px-14 lg:py-12">
        {/* Colorful animated gradient background */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.97 0.04 80) 0%, oklch(0.96 0.05 330) 35%, oklch(0.95 0.06 250) 70%, oklch(0.97 0.05 160) 100%)",
          }}
        />
        {/* Floating colorful blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full opacity-60 blur-3xl"
          style={{ background: "oklch(0.85 0.15 25)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-60px] top-1/3 -z-10 h-80 w-80 rounded-full opacity-50 blur-3xl"
          style={{ background: "oklch(0.82 0.14 280)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-80px] left-1/3 -z-10 h-96 w-96 rounded-full opacity-45 blur-3xl"
          style={{ background: "oklch(0.84 0.13 180)" }}
        />
        {/* Tiny dot grid for texture */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.35 0.05 260) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
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
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.2 25), oklch(0.6 0.22 320))",
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

        {/* Floating mini-badges */}
        <div className="relative mx-auto mt-6 flex w-full max-w-md flex-wrap items-center justify-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.2 25), oklch(0.65 0.2 50))" }}
          >
            <Zap className="h-3 w-3" /> 100% free
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, oklch(0.6 0.2 280), oklch(0.62 0.2 320))" }}
          >
            <Star className="h-3 w-3" /> Band 8–9 answers
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ background: "linear-gradient(135deg, oklch(0.55 0.16 180), oklch(0.6 0.18 200))" }}
          >
            <Sparkles className="h-3 w-3" /> Updated weekly
          </span>
        </div>

        {/* Form block — colorful card */}
        <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <div
            className="rounded-3xl border border-white/60 bg-background/85 p-7 shadow-[0_30px_80px_-30px_oklch(0.3_0.1_280/0.35)] backdrop-blur-xl sm:p-8"
            style={{
              boxShadow:
                "0 30px 80px -30px oklch(0.3 0.1 280 / 0.35), 0 0 0 1px oklch(1 0 0 / 0.5) inset",
            }}
          >
            <div className="mb-7">
              <h1
                className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-[34px]"
                style={{
                  background:
                    "linear-gradient(120deg, oklch(0.45 0.2 280) 0%, oklch(0.55 0.22 25) 60%, oklch(0.55 0.2 200) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {title}
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>

          {footer && (
            <div className="mx-auto mt-6 w-full max-w-md text-center text-xs text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
