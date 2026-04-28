import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
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
  ClipboardList,
  GraduationCap,
  Headphones,
  Video,
  Mic,
  StickyNote,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding, LOGO_SIZE_PX } from "@/lib/admin/site-settings";
import logoWheel from "@/assets/logo-wheel.png";

const INK = "oklch(0.20 0.01 250)";
const INK_SOFT = "oklch(0.45 0.01 250)";
const HAIRLINE = "oklch(0.92 0.003 250)";
const HOVER_BG = "oklch(0.97 0.003 250)";

type ResourceLink =
  | "/recent-exam-questions"
  | "/predictions"
  | "/ebooks"
  | "/writing-samples"
  | "/vocabulary";

type ResourceItem = {
  label: string;
  description: string;
  icon: typeof FileText;
  accent: string;
  meta: string;
} & ({ to: ResourceLink; comingSoon?: false } | { to?: undefined; comingSoon: true });

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
  {
    label: "Quizzes",
    description: "Bite-size band-targeted quizzes for grammar, vocab and reading.",
    icon: ClipboardList,
    accent: "oklch(0.62 0.17 145)",
    meta: "Coming soon",
    comingSoon: true,
  },
  {
    label: "Assignments",
    description: "Guided weekly assignments with personalised examiner feedback.",
    icon: GraduationCap,
    accent: "oklch(0.55 0.18 25)",
    meta: "Coming soon",
    comingSoon: true,
  },
  {
    label: "Audio Courses",
    description: "Listen-on-the-go lessons covering every IELTS skill.",
    icon: Headphones,
    accent: "oklch(0.6 0.16 195)",
    meta: "Coming soon",
    comingSoon: true,
  },
  {
    label: "Video Courses",
    description: "Structured video classes from certified Band 9 examiners.",
    icon: Video,
    accent: "oklch(0.55 0.2 15)",
    meta: "Coming soon",
    comingSoon: true,
  },
  {
    label: "Podcasts",
    description: "Weekly episodes on test strategy, mindset and real exam stories.",
    icon: Mic,
    accent: "oklch(0.55 0.18 305)",
    meta: "Coming soon",
    comingSoon: true,
  },
  {
    label: "Study Notes",
    description: "Printable cheat-sheets and one-page summaries for every topic.",
    icon: StickyNote,
    accent: "oklch(0.6 0.15 75)",
    meta: "Coming soon",
    comingSoon: true,
  },
];

// Pricing lives on the homepage as #pricing; FAQ is its own route.

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const branding = useBranding();
  const logoPx = LOGO_SIZE_PX[branding.logoSize ?? "md"];

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
          <img
            src={logoWheel}
            alt="BigIELTS logo"
            style={{ height: logoPx, width: logoPx }}
            className="object-contain"
          />
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

          {/* Resources mega menu trigger */}
          <button
            type="button"
            data-state={megaOpen ? "open" : "closed"}
            onClick={() => setMegaOpen((v) => !v)}
            onMouseEnter={() => {
              cancelClose();
              setMegaOpen(true);
            }}
            onMouseLeave={scheduleClose}
            className="group flex items-center gap-1 rounded-md px-3.5 py-2 text-[14px] font-semibold transition-colors outline-none data-[state=open]:bg-[var(--header-hover)]"
            style={
              {
                color: INK_SOFT,
                ["--header-hover" as string]: HOVER_BG,
              } as React.CSSProperties
            }
          >
            <span
              className="transition-colors group-hover:text-[color:var(--header-ink)] group-data-[state=open]:text-[color:var(--header-ink)]"
              style={{ ["--header-ink" as string]: INK } as React.CSSProperties}
            >
              Resources
            </span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </button>

          {/* E-books (top-level) */}
          <Link
            to="/ebooks"
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
            E-books
          </Link>

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
          <Link
            to="/dashboard"
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
            Dashboard
          </Link>
          <Link
            to="/admin"
            className="ml-1 inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-[13px] font-bold transition-all"
            style={{ color: INK, borderColor: HAIRLINE, backgroundColor: "oklch(0.98 0.005 250)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = INK;
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = INK;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "oklch(0.98 0.005 250)";
              e.currentTarget.style.color = INK;
              e.currentTarget.style.borderColor = HAIRLINE;
            }}
          >
            Admin
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
            <Link to="/login">Log in</Link>
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
            <Link to="/signup">Get Started</Link>
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

      {/* === Full-width Resources mega menu (desktop) === */}
      <AnimatePresence>
        {megaOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              key="mega-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 top-[68px] z-40 hidden bg-black/30 backdrop-blur-sm lg:block"
              onClick={() => setMegaOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="mega-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full z-50 hidden border-b bg-white shadow-2xl lg:block"
              style={{ borderColor: HAIRLINE }}
            >
              <div className="container-page py-8">
                <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {resourceItems.map((item) => {
                    const Icon = item.icon;
                    const isSoon = item.comingSoon === true;

                    const inner = (
                      <>
                        {/* Coming soon ribbon */}
                        {isSoon && (
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-xl"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.98 0.005 250) 0%, oklch(0.96 0.01 280) 100%)",
                            }}
                          />
                        )}
                        <span
                          className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform duration-300 group-hover/item:scale-110"
                          style={{
                            background: isSoon
                              ? `linear-gradient(140deg, color-mix(in oklab, ${item.accent} 55%, white) 0%, color-mix(in oklab, ${item.accent} 80%, black) 100%)`
                              : `radial-gradient(circle at 30% 25%, oklch(1 0 0 / 0.3), transparent 50%), linear-gradient(140deg, ${item.accent} 0%, color-mix(in oklab, ${item.accent} 70%, black) 100%)`,
                            boxShadow: `0 6px 14px -6px ${item.accent}80, inset 0 1px 0 oklch(1 0 0 / 0.4)`,
                            opacity: isSoon ? 0.85 : 1,
                          }}
                        >
                          <Icon className="h-5 w-5 text-white" strokeWidth={2.4} />
                        </span>
                        <div className="relative min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="font-display text-[14px] font-black leading-tight"
                              style={{ color: INK }}
                            >
                              {item.label}
                            </span>
                            {!isSoon && (
                              <ArrowRight
                                className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                                style={{ color: item.accent }}
                              />
                            )}
                          </div>
                          <p
                            className="mt-1.5 text-[12px] font-medium leading-snug"
                            style={{ color: INK_SOFT }}
                          >
                            {item.description}
                          </p>
                          {isSoon ? (
                            <span
                              className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                              style={{
                                background: `linear-gradient(135deg, color-mix(in oklab, ${item.accent} 18%, white) 0%, color-mix(in oklab, ${item.accent} 28%, white) 100%)`,
                                color: `color-mix(in oklab, ${item.accent} 75%, black)`,
                                boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${item.accent} 35%, white)`,
                              }}
                            >
                              <Clock className="h-3 w-3" />
                              Coming soon
                            </span>
                          ) : (
                            <div
                              className="mt-2 inline-flex items-center text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: item.accent }}
                            >
                              {item.meta}
                            </div>
                          )}
                        </div>
                      </>
                    );

                    const baseClass =
                      "group/item relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-transparent p-4 transition-all";
                    const cssVars = {
                      ["--mega-hover" as string]: HOVER_BG,
                    } as React.CSSProperties;

                    if (isSoon) {
                      return (
                        <div
                          key={item.label}
                          aria-disabled="true"
                          className={`${baseClass} cursor-not-allowed`}
                          style={{
                            ...cssVars,
                            borderColor: `${item.accent}25`,
                            background:
                              "linear-gradient(135deg, oklch(0.985 0.004 250) 0%, oklch(0.97 0.012 280) 100%)",
                          }}
                        >
                          {inner}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setMegaOpen(false)}
                        className={`${baseClass} hover:bg-[var(--mega-hover)]`}
                        style={cssVars}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${item.accent}30`;
                          e.currentTarget.style.boxShadow = `0 8px 24px -12px ${item.accent}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {inner}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              to="/ebooks"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-3 text-[15px] font-semibold"
              style={{ color: INK_SOFT }}
              activeProps={{ style: { color: INK, backgroundColor: HOVER_BG } }}
            >
              E-books
            </Link>
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
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-3 text-[15px] font-semibold"
              style={{ color: INK_SOFT }}
              activeProps={{ style: { color: INK, backgroundColor: HOVER_BG } }}
            >
              Dashboard
            </Link>

            <div className="mt-2 grid grid-cols-2 gap-2 pt-2">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-md font-semibold"
                style={{ color: INK, borderColor: HAIRLINE }}
              >
                <Link to="/login" onClick={() => setOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-md font-semibold text-white"
                style={{ backgroundColor: INK }}
              >
                <Link to="/signup" onClick={() => setOpen(false)}>
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
