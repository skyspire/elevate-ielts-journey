import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/" as const, exact: true },
  { label: "Dashboard", to: "/dashboard" as const, exact: false },
  { label: "Writing", to: "/writing-samples" as const, exact: false },
  { label: "Speaking", to: "/" as const, exact: true, disabled: true },
  { label: "Vocabulary", to: "/" as const, exact: true, disabled: true },
  { label: "E-books", to: "/" as const, exact: true, disabled: true },
];

const INK = "oklch(0.20 0.01 250)";
const INK_SOFT = "oklch(0.45 0.01 250)";
const HAIRLINE = "oklch(0.92 0.003 250)";
const HOVER_BG = "oklch(0.97 0.003 250)";

// Hand-drawn squiggle underline (SVG) — animates in on hover/active
function DoodleUnderline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-2 -bottom-1 h-[6px] w-[calc(100%-1rem)] origin-left scale-x-0 opacity-0 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100 group-data-[status=active]:scale-x-100 group-data-[status=active]:opacity-100"
    >
      <path
        d="M1 5 Q 12 1, 25 4 T 50 4 T 75 4 T 99 4"
        fill="none"
        stroke={INK}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <div className="container-page flex h-[68px] items-center justify-between gap-6">
        {/* Logo — charcoal tile */}
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: INK }}
          >
            <GraduationCap className="h-5 w-5" strokeWidth={2.75} />
          </span>
          <span
            className="font-display text-[20px] font-extrabold tracking-tight"
            style={{ color: INK }}
          >
            BigIELTS<span style={{ color: INK_SOFT, fontWeight: 600 }}>.com</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="group relative rounded-md px-3.5 py-2 text-[14px] font-semibold transition-colors"
              style={{ color: INK_SOFT }}
              activeProps={{ style: { color: INK } }}
              onMouseEnter={(e) => (e.currentTarget.style.color = INK)}
              onMouseLeave={(e) => {
                const isActive =
                  e.currentTarget.getAttribute("data-status") === "active";
                e.currentTarget.style.color = isActive ? INK : INK_SOFT;
              }}
            >
              {item.label}
              <DoodleUnderline />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-md px-4 font-semibold"
            style={{ color: INK }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = HOVER_BG)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Link to="/dashboard">Log in</Link>
          </Button>
          <Button
            asChild
            className="h-10 rounded-md px-5 font-semibold text-white shadow-none"
            style={{ backgroundColor: INK }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "oklch(0.28 0.01 250)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = INK)
            }
          >
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md lg:hidden"
          style={{ color: INK, border: `1px solid ${HAIRLINE}` }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="bg-white lg:hidden" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <div className="container-page flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.exact }}
                className="rounded-md px-4 py-3 text-[15px] font-semibold"
                style={{ color: INK_SOFT }}
                activeProps={{
                  style: { color: INK, backgroundColor: HOVER_BG },
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 pt-2">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-md font-semibold"
                style={{ color: INK, borderColor: HAIRLINE }}
              >
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-md font-semibold text-white"
                style={{ backgroundColor: INK }}
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
