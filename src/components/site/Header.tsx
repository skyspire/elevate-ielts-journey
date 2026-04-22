import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  FileText,
  Sparkles,
  BookOpen,
  PenLine,
  Library,
  ArrowRight,
  Globe2,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const INK = "oklch(0.20 0.01 250)";
const INK_SOFT = "oklch(0.45 0.01 250)";
const HAIRLINE = "oklch(0.92 0.003 250)";
const HOVER_BG = "oklch(0.97 0.003 250)";

type ResourceItem = {
  label: string;
  to: "/recent-exam-questions" | "/predictions" | "/ebooks" | "/writing-samples" | "/vocabulary";
  description: string;
  icon: typeof FileText;
  accent: string;
  meta: string;
};

const resourceItems: ResourceItem[] = [
  {
    label: "Recent Exams",
    to: "/recent-exam-questions",
    description: "Verified questions from real test-takers across 40+ countries.",
    icon: FileText,
    accent: "oklch(0.62 0.17 255)",
    meta: "Updated April 2026",
  },
  {
    label: "Predictions",
    to: "/predictions",
    description: "AI-ranked topics most likely to appear in your next sitting.",
    icon: Sparkles,
    accent: "oklch(0.6 0.2 295)",
    meta: "Updated weekly",
  },
  {
    label: "E-books",
    to: "/ebooks",
    description: "Deep-dive PDF guides written by certified Band 9 examiners.",
    icon: BookOpen,
    accent: "oklch(0.62 0.16 35)",
    meta: "12 titles",
  },
  {
    label: "Band 8+ Sample Answers",
    to: "/writing-samples",
    description: "Annotated Writing & Speaking models with examiner notes.",
    icon: PenLine,
    accent: "oklch(0.55 0.14 165)",
    meta: "600+ samples",
  },
  {
    label: "Vocabulary",
    to: "/vocabulary",
    description: "High-yield collocations and lexical chunks, grouped by topic.",
    icon: Library,
    accent: "oklch(0.6 0.16 230)",
    meta: "30 topics",
  },
];

// Pricing lives on the homepage as #pricing; FAQ is its own route.

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  // Close the mega menu on route change
  useEffect(() => {
    setMegaOpen(false);
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <div className="container-page flex h-[68px] items-center justify-between gap-6">
        {/* Logo */}
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
          {/* Home */}
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-md px-3.5 py-2 text-[14px] font-semibold transition-colors"
            style={{ color: INK_SOFT }}
            activeProps={{ style: { color: INK, backgroundColor: HOVER_BG } }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = INK;
              if (e.currentTarget.getAttribute("data-status") !== "active") {
                e.currentTarget.style.backgroundColor = HOVER_BG;
              }
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.getAttribute("data-status") === "active";
              e.currentTarget.style.color = isActive ? INK : INK_SOFT;
              if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Home
          </Link>

          {/* Resources dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group flex items-center gap-1 rounded-md px-3.5 py-2 text-[14px] font-semibold transition-colors outline-none hover:bg-[var(--header-hover)] focus-visible:bg-[var(--header-hover)] data-[state=open]:bg-[var(--header-hover)]"
                style={
                  {
                    color: INK_SOFT,
                    ["--header-hover" as string]: HOVER_BG,
                  } as React.CSSProperties
                }
              >
                <span className="transition-colors group-hover:text-[color:var(--header-ink)] group-data-[state=open]:text-[color:var(--header-ink)]" style={{ ["--header-ink" as string]: INK } as React.CSSProperties}>
                  Resources
                </span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={10}
              className="w-[340px] rounded-xl border p-2"
              style={{ borderColor: HAIRLINE }}
            >
              {resourceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.label} asChild className="p-0 focus:bg-transparent">
                    <Link
                      to={item.to}
                      className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-[oklch(0.97_0.003_250)]"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `${item.accent}15`,
                          color: item.accent,
                        }}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.4} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div
                          className="font-display text-sm font-extrabold leading-tight"
                          style={{ color: INK }}
                        >
                          {item.label}
                        </div>
                        <div
                          className="mt-0.5 text-xs font-medium"
                          style={{ color: INK_SOFT }}
                        >
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pricing (homepage anchor) + FAQ */}
          <Link
            to="/"
            hash="pricing"
            className="rounded-md px-3.5 py-2 text-[14px] font-semibold transition-colors"
            style={{ color: INK_SOFT }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = INK;
              e.currentTarget.style.backgroundColor = HOVER_BG;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = INK_SOFT;
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Pricing
          </Link>
          <Link
            to="/faq"
            className="rounded-md px-3.5 py-2 text-[14px] font-semibold transition-colors"
            style={{ color: INK_SOFT }}
            activeProps={{ style: { color: INK, backgroundColor: HOVER_BG } }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = INK;
              if (e.currentTarget.getAttribute("data-status") !== "active") {
                e.currentTarget.style.backgroundColor = HOVER_BG;
              }
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.getAttribute("data-status") === "active";
              e.currentTarget.style.color = isActive ? INK : INK_SOFT;
              if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            FAQ
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            asChild
            variant="ghost"
            className="h-10 rounded-md px-4 font-semibold"
            style={{ color: INK }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = HOVER_BG)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = INK)}
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

      {/* Mobile menu */}
      {open && (
        <div className="bg-white lg:hidden" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          <div className="container-page flex flex-col gap-1 py-3">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-3 text-[15px] font-semibold"
              style={{ color: INK_SOFT }}
              activeProps={{ style: { color: INK, backgroundColor: HOVER_BG } }}
            >
              Home
            </Link>

            {/* Mobile Resources collapsible */}
            <button
              onClick={() => setMobileResourcesOpen((v) => !v)}
              className="flex items-center justify-between rounded-md px-4 py-3 text-[15px] font-semibold"
              style={{ color: INK_SOFT }}
            >
              Resources
              <ChevronDown
                className="h-4 w-4 transition-transform"
                style={{
                  transform: mobileResourcesOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            {mobileResourcesOpen && (
              <div className="ml-2 flex flex-col gap-0.5 border-l pl-3" style={{ borderColor: HAIRLINE }}>
                {resourceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[14px] font-semibold"
                      style={{ color: INK_SOFT }}
                      activeProps={{ style: { color: INK, backgroundColor: HOVER_BG } }}
                    >
                      <Icon className="h-4 w-4" style={{ color: item.accent }} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}

            <Link
              to="/"
              hash="pricing"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-3 text-[15px] font-semibold"
              style={{ color: INK_SOFT }}
            >
              Pricing
            </Link>
            <Link
              to="/faq"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-3 text-[15px] font-semibold"
              style={{ color: INK_SOFT }}
              activeProps={{ style: { color: INK, backgroundColor: HOVER_BG } }}
            >
              FAQ
            </Link>

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
