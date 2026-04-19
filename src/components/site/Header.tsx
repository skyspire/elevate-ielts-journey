import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreeQuotaBadge } from "./FreeQuotaBadge";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Recent Questions", to: "/" },
  { label: "Academic", to: "/" },
  { label: "General", to: "/" },
  { label: "Vocabulary", to: "/" },
  { label: "E-books", to: "/" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">BandPath</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <FreeQuotaBadge used={0} total={3} />
          <Button variant="ghost" className="font-semibold">
            Sign In
          </Button>
          <Button className="rounded-full bg-brand font-semibold text-brand-foreground shadow-soft hover:bg-brand/90">
            Sign Up
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
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 font-semibold">
                Sign In
              </Button>
              <Button className="flex-1 bg-brand font-semibold text-brand-foreground hover:bg-brand/90">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
