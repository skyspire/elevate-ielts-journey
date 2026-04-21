import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Writing", to: "/writing-samples" },
  { label: "Speaking", to: "/" },
  { label: "Vocabulary", to: "/" },
  { label: "E-books", to: "/" },
] as const;

const BRAND = "oklch(0.62 0.18 35)"; // solid terracotta — single saturated brand color
const BRAND_HOVER = "oklch(0.56 0.19 35)";
const INK = "oklch(0.22 0.02 50)";
const MUTED = "oklch(0.48 0.02 50)";
const HAIRLINE = "oklch(0.92 0.005 50)";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <div className="container-page flex h-[68px] items-center justify-between gap-6">
        {/* Logo — one flat chunky tile */}
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: BRAND }}
          >
            <GraduationCap className="h-5 w-5" strokeWidth={2.75} />
          </span>
          <span
            className="font-display text-[20px] font-extrabold tracking-tight"
            style={{ color: INK }}
          >
            BigIELTS.com
          </span>
        </Link>

        {/* Desktop nav — bold flat labels */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-lg px-4 py-2 text-[14px] font-bold transition-colors hover:bg-[oklch(0.97_0.005_50)]"
              style={{ color: MUTED }}
              activeProps={{
                style: { color: BRAND, backgroundColor: "oklch(0.97 0.02 35)" },
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-lg px-4 font-bold hover:bg-[oklch(0.97_0.005_50)]"
            style={{ color: INK }}
          >
            <Link to="/dashboard">Log in</Link>
          </Button>
          <Button
            asChild
            className="h-10 rounded-lg px-5 font-bold text-white shadow-none transition-colors"
            style={
              {
                backgroundColor: BRAND,
                "--hover-bg": BRAND_HOVER,
              } as React.CSSProperties
            }
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = BRAND_HOVER)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = BRAND)
            }
          >
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
          style={{ color: INK, border: `1px solid ${HAIRLINE}` }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          className="bg-white lg:hidden"
          style={{ borderTop: `1px solid ${HAIRLINE}` }}
        >
          <div className="container-page flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-lg px-4 py-3 text-[15px] font-bold hover:bg-[oklch(0.97_0.005_50)]"
                style={{ color: INK }}
                activeProps={{
                  style: {
                    color: BRAND,
                    backgroundColor: "oklch(0.97 0.02 35)",
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 pt-2">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-lg font-bold"
                style={{ color: INK, borderColor: HAIRLINE }}
              >
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-lg font-bold text-white"
                style={{ backgroundColor: BRAND }}
              >
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
