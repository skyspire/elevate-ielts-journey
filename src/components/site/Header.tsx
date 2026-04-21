import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, BookOpenText, PenLine, Mic, BookMarked, Library, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Writing", to: "/writing-samples", icon: PenLine },
  { label: "Speaking", to: "/", icon: Mic },
  { label: "Vocabulary", to: "/", icon: BookMarked },
  { label: "E-books", to: "/", icon: Library },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[oklch(0.85_0.04_60)]/60 bg-[oklch(0.985_0.018_75)]/90 backdrop-blur-xl">
      <div className="container-page flex h-[68px] items-center justify-between gap-4">
        {/* Logo — open book, warm gradient */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,oklch(0.72_0.16_55),oklch(0.62_0.18_35))] text-white shadow-[0_6px_20px_-6px_oklch(0.62_0.18_35/0.55)] transition-transform group-hover:-rotate-3">
            <BookOpenText className="h-5 w-5" strokeWidth={2.5} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[oklch(0.985_0.018_75)] bg-[oklch(0.78_0.15_140)]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[19px] font-extrabold tracking-tight text-[oklch(0.28_0.04_45)]">
              BandPath
            </span>
            <span className="font-handwriting text-[12px] font-semibold text-[oklch(0.55_0.15_40)]">
              study smart · score 8+
            </span>
          </span>
        </Link>

        {/* Desktop nav — warm pill bar */}
        <nav className="hidden items-center gap-1 rounded-full border border-[oklch(0.85_0.04_60)]/70 bg-white/70 p-1 shadow-[0_2px_10px_-4px_oklch(0.62_0.12_45/0.18)] lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-[oklch(0.42_0.04_50)] transition-all hover:bg-[oklch(0.95_0.04_70)] hover:text-[oklch(0.28_0.06_40)]"
                activeProps={{
                  className:
                    "bg-[linear-gradient(135deg,oklch(0.72_0.16_55),oklch(0.62_0.18_35))] text-white shadow-[0_4px_12px_-4px_oklch(0.62_0.18_35/0.5)] hover:bg-[linear-gradient(135deg,oklch(0.72_0.16_55),oklch(0.62_0.18_35))] hover:text-white",
                }}
              >
                <Icon className="h-3.5 w-3.5 opacity-80" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            asChild
            variant="ghost"
            className="rounded-full font-semibold text-[oklch(0.35_0.04_45)] hover:bg-[oklch(0.95_0.04_70)] hover:text-[oklch(0.28_0.06_40)]"
          >
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[linear-gradient(135deg,oklch(0.72_0.16_55),oklch(0.62_0.18_35))] font-semibold text-white shadow-[0_6px_18px_-6px_oklch(0.62_0.18_35/0.55)] transition-transform hover:scale-[1.02] hover:bg-[linear-gradient(135deg,oklch(0.72_0.16_55),oklch(0.62_0.18_35))]"
          >
            <Link to="/dashboard">Start studying</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[oklch(0.85_0.04_60)] bg-white text-[oklch(0.35_0.04_45)] lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[oklch(0.85_0.04_60)]/60 bg-[oklch(0.985_0.018_75)] lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold text-[oklch(0.32_0.04_45)] hover:bg-[oklch(0.95_0.04_70)]"
                  activeProps={{
                    className:
                      "bg-[oklch(0.95_0.06_60)] text-[oklch(0.42_0.16_40)]",
                  }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,oklch(0.92_0.06_60),oklch(0.88_0.08_45))] text-[oklch(0.45_0.16_40)]">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex gap-2 pt-2">
              <Button
                asChild
                variant="outline"
                className="flex-1 rounded-full border-[oklch(0.85_0.04_60)] font-semibold text-[oklch(0.35_0.04_45)]"
              >
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </Button>
              <Button
                asChild
                className="flex-1 rounded-full bg-[linear-gradient(135deg,oklch(0.72_0.16_55),oklch(0.62_0.18_35))] font-semibold text-white"
              >
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Start studying
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
