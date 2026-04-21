import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, BookOpenText, PenLine, Mic, BookMarked, Library, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeQuotaBadge } from "./FreeQuotaBadge";

const navItems = [
  { label: "Home", to: "/", icon: Sparkles },
  { label: "Writing", to: "/writing-samples", icon: PenLine },
  { label: "Speaking", to: "/", icon: Mic },
  { label: "Vocabulary", to: "/", icon: BookMarked },
  { label: "E-books", to: "/", icon: Library },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      {/* Top accent strip — exam paper / ruled-line vibe */}
      <div className="h-1 w-full bg-[linear-gradient(90deg,var(--brand)_0%,var(--brand)_25%,var(--mint)_25%,var(--mint)_50%,var(--peach)_50%,var(--peach)_75%,var(--lilac)_75%,var(--lilac)_100%)] opacity-80" />

      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo — stacked books = study */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-primary text-brand-foreground shadow-soft transition-transform group-hover:-rotate-3">
            <BookOpenText className="h-5 w-5" strokeWidth={2.5} />
            {/* tiny pencil-tip dot */}
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-peach" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-tight">BandPath</span>
            <span className="font-handwriting text-[11px] font-semibold text-brand">study smart · score 8+</span>
          </span>
        </Link>

        {/* Desktop nav — study-tab underline style */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="group relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                {item.label}
                {/* hand-drawn underline */}
                <span className="pointer-events-none absolute inset-x-3 bottom-1 h-[3px] origin-left scale-x-0 rounded-full bg-brand/70 transition-transform duration-300 group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <FreeQuotaBadge used={0} total={3} />
          <Button asChild variant="ghost" className="font-semibold">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild className="rounded-full bg-brand font-semibold text-brand-foreground shadow-soft hover:bg-brand/90">
            <Link to="/dashboard">Start studying</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
                  activeProps={{ className: "bg-secondary text-brand" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1 font-semibold">
                <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
              </Button>
              <Button asChild className="flex-1 bg-brand font-semibold text-brand-foreground hover:bg-brand/90">
                <Link to="/dashboard" onClick={() => setOpen(false)}>Start studying</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
