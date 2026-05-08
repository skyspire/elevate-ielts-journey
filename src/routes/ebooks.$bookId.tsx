import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Type,
  Sun,
  Moon,
  Coffee,
  List,
  X,
  ArrowLeft,
  Lock,
  Highlighter,
  Trash2,
} from "lucide-react";
import { getEbookById, flattenPages } from "@/data/ebooks";
import { useReaderPrefs, useReaderState, type Highlight } from "@/lib/ebook-storage";
import { useLearnerSession } from "@/lib/learner-auth";
import { useCmsSection } from "@/lib/admin/cms-store";
import {
  EBOOKS_KEY,
  EBOOKS_DEFAULT,
  resolvePublicEbooks,
  type EbooksStore,
} from "@/lib/admin/ebooks-store";
import { PdfReaderView } from "@/components/site/PdfReaderView";
import { QuotaGate } from "@/components/site/QuotaGate";
import { useDevBypass } from "@/lib/dev-bypass";

export const Route = createFileRoute("/ebooks/$bookId")({
  head: ({ params }) => {
    const book = getEbookById(params.bookId);
    const title = book ? `${book.title} — BigIELTS E-Books` : "E-Book — BigIELTS";
    const description = book?.description ?? "Read IELTS e-books in our in-browser reader.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Book not found</h1>
        <Link to="/ebooks" className="mt-4 inline-block underline">
          Back to library
        </Link>
      </div>
    </div>
  ),
  component: GatedReaderPage,
});

function GatedReaderPage() {
  const { bookId } = Route.useParams();
  return (
    <QuotaGate itemKey={`ebook:${bookId}`}>
      <ReaderPage />
    </QuotaGate>
  );
}

// Body font is Lora throughout for a soft, book-like read.
const FONT_SIZES = {
  sm: { body: "text-[15px] leading-[1.75]", h1: "text-2xl", h2: "text-base" },
  md: { body: "text-[17px] leading-[1.8]", h1: "text-3xl", h2: "text-lg" },
  lg: { body: "text-[19px] leading-[1.85]", h1: "text-[2rem]", h2: "text-xl" },
  xl: { body: "text-[21px] leading-[1.9]", h1: "text-[2.4rem]", h2: "text-2xl" },
} as const;

// Modern paperback palette — pure white default, warm sepia option, soft dark.
const THEMES = {
  light: {
    bg: "oklch(0.985 0 0)",
    page: "oklch(1 0 0)",
    text: "oklch(0.2 0.015 260)",
    muted: "oklch(0.5 0.015 260)",
    border: "oklch(0.93 0.005 250)",
  },
  sepia: {
    bg: "oklch(0.92 0.035 78)",
    page: "oklch(0.955 0.03 80)",
    text: "oklch(0.28 0.035 50)",
    muted: "oklch(0.46 0.045 50)",
    border: "oklch(0.86 0.04 70)",
  },
  dark: {
    bg: "oklch(0.17 0.01 260)",
    page: "oklch(0.22 0.012 260)",
    text: "oklch(0.93 0.008 250)",
    muted: "oklch(0.66 0.018 250)",
    border: "oklch(0.30 0.02 260)",
  },
} as const;


function ReaderPage() {
  const { bookId } = Route.useParams();
  const store = useCmsSection<EbooksStore>(EBOOKS_KEY, EBOOKS_DEFAULT);
  // Prefer the CMS-resolved book so admin-uploaded PDFs / overrides take effect.
  const book = useMemo(
    () => resolvePublicEbooks(store).find((b) => b.id === bookId) ?? getEbookById(bookId),
    [store, bookId],
  );
  const navigate = useNavigate();
  const { user } = useLearnerSession();
  const { enabled: devBypass } = useDevBypass();
  const [prefs, setPrefs] = useReaderPrefs();
  const [state, setState] = useReaderState(user?.id ?? null, bookId);

  const [showToc, setShowToc] = useState(false);
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [selectionInfo, setSelectionInfo] = useState<{
    text: string;
    pageIndex: number;
    x: number;
    y: number;
  } | null>(null);

  // ─── PDF branch ──────────────────────────────────────────────
  // When the admin uploaded a PDF for this ebook, bypass the chapters reader
  // and serve the file inside a polished viewer.
  if (book?.pdfDataUrl) {
    return <PdfReaderView book={book} userIsAuthed={!!user || devBypass} />;
  }


  const pageRef = useRef<HTMLDivElement>(null);

  // Avoid SSR/CSR hydration mismatch from localStorage-driven state.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Immersive auto-hide chrome (top toolbar + bottom counter).
  // Visible on mouse move, tap, scroll, or keyboard nav; hides after 2.5s of inactivity.
  const [chromeVisible, setChromeVisible] = useState(true);
  useEffect(() => {
    if (!mounted) return;
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      setChromeVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setChromeVisible(false), 2500);
    };
    show();
    const events: (keyof WindowEventMap)[] = ["mousemove", "keydown", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, show, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, show));
    };
  }, [mounted]);

  const flat = useMemo(() => (book ? flattenPages(book) : []), [book]);
  const total = flat.length;
  const savedPage = total > 0 ? Math.min(Math.max(state.currentPage, 0), total - 1) : 0;
  const current = mounted ? savedPage : 0;
  const freePages = Math.max(1, Math.min(book?.freePages ?? 0, total || 1));
  const isLocked = !!book && !user && !devBypass && current >= freePages;

  // Self-heal stale localStorage if the saved page is out of range for the new book content.
  useEffect(() => {
    if (total > 0 && state.currentPage > total - 1) {
      setState((s) => ({ ...s, currentPage: 0 }));
    }
  }, [total, state.currentPage, setState]);

  const leftPage = flat[current] ?? flat[0];

  // Page-flip animation state
  const [flipDir, setFlipDir] = useState<"next" | "prev" | null>(null);
  const flipKey = current; // re-mount PageView on page change to trigger animation

  const goPrev = useCallback(() => {
    setFlipDir("prev");
    setState((s) => ({ ...s, currentPage: Math.max(0, s.currentPage - 1) }));
  }, [setState]);

  const goNext = useCallback(() => {
    setFlipDir("next");
    setState((s) => {
      const next = total > 0 ? Math.min(total - 1, s.currentPage + 1) : 0;
      if (!user && !devBypass && next >= freePages) {
        return { ...s, currentPage: Math.max(0, freePages - 1) };
      }
      return { ...s, currentPage: next };
    });
  }, [setState, total, user, devBypass, freePages]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") {
        setShowToc(false);
        setShowFontPanel(false);
        setShowHighlights(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const isBookmarked = state.bookmarks.includes(current);
  const toggleBookmark = () => {
    setState((s) => ({
      ...s,
      bookmarks: s.bookmarks.includes(current)
        ? s.bookmarks.filter((p) => p !== current)
        : [...s.bookmarks, current].sort((a, b) => a - b),
    }));
  };

  // Text selection -> highlight popover
  const handleMouseUp = (pageIndex: number) => () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelectionInfo(null);
      return;
    }
    const text = sel.toString().trim();
    if (text.length < 3) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelectionInfo({
      text,
      pageIndex,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const addHighlight = (color: Highlight["color"]) => {
    if (!selectionInfo) return;
    const h: Highlight = {
      id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      pageIndex: selectionInfo.pageIndex,
      text: selectionInfo.text,
      color,
      createdAt: Date.now(),
    };
    setState((s) => ({ ...s, highlights: [...s.highlights, h] }));
    setSelectionInfo(null);
    window.getSelection()?.removeAllRanges();
  };

  const deleteHighlight = (id: string) => {
    setState((s) => ({ ...s, highlights: s.highlights.filter((h) => h.id !== id) }));
  };

  const theme = THEMES[prefs.theme];
  const fs = FONT_SIZES[prefs.fontSize];

  if (!book) return null;
  if (!leftPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
        <div>
          <h1 className="text-2xl font-black">This sample is still loading</h1>
          <p className="mt-2 text-sm font-medium text-foreground/70">
            Please go back to the library and open the book again.
          </p>
          <Link to="/ebooks" className="mt-5 inline-flex rounded-md border border-border px-4 py-2 text-sm font-bold">
            Back to library
          </Link>
        </div>
      </div>
    );
  }
  const progressPct = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: theme.bg, color: theme.text }}
    >
      {/* Top bar — auto-hide */}
      <header
        className="fixed left-0 right-0 top-0 z-40 border-b backdrop-blur-md transition-all duration-300"
        style={{
          borderColor: theme.border,
          background: `${theme.bg}f5`,
          transform: chromeVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: chromeVisible ? 1 : 0,
          pointerEvents: chromeVisible ? "auto" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate({ to: "/ebooks" })}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold opacity-75 hover:opacity-100"
              style={{ color: theme.text }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Library</span>
            </button>
            <div className="hidden h-5 w-px sm:block" style={{ background: theme.border }} />
            <div className="min-w-0">
              <p
                className="truncate font-bold leading-tight"
                style={{ fontFamily: "'Lora', Georgia, serif" }}
              >
                {book.title}
              </p>
              <p className="truncate text-[11px] font-semibold" style={{ color: theme.muted }}>
                {flat[current]?.chapterTitle}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <IconBtn theme={theme} onClick={() => setShowToc(true)} title="Contents">
              <List className="h-4 w-4" />
            </IconBtn>
            <IconBtn theme={theme} onClick={() => setShowFontPanel((v) => !v)} title="Font & theme">
              <Type className="h-4 w-4" />
            </IconBtn>
            <IconBtn theme={theme} onClick={() => setShowHighlights(true)} title="Highlights">
              <Highlighter className="h-4 w-4" />
            </IconBtn>
            <IconBtn theme={theme} onClick={toggleBookmark} title="Bookmark">
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" style={{ color: "oklch(0.65 0.18 50)" }} />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </IconBtn>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full" style={{ background: theme.border }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progressPct}%`, background: "oklch(0.55 0.18 30)" }}
          />
        </div>
      </header>

      {/* Font / theme panel */}
      {showFontPanel && (
        <div className="fixed right-4 top-16 z-50">
          <div
            className="rounded-xl border p-4 shadow-xl"
            style={{ background: theme.page, borderColor: theme.border, color: theme.text }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wider opacity-60">Font size</p>
            <div className="flex gap-1">
              {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setPrefs({ fontSize: sz })}
                  className="rounded-md px-3 py-1.5 text-sm font-bold transition-colors"
                  style={{
                    background: prefs.fontSize === sz ? "oklch(0.55 0.18 30)" : "transparent",
                    color: prefs.fontSize === sz ? "white" : theme.text,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  A
                  <span style={{ fontSize: sz === "sm" ? "10px" : sz === "md" ? "12px" : sz === "lg" ? "14px" : "16px" }}>
                    {sz === "sm" ? "" : sz === "md" ? "" : ""}
                  </span>
                </button>
              ))}
            </div>
            <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wider opacity-60">Theme</p>
            <div className="flex gap-1">
              <ThemeBtn active={prefs.theme === "light"} onClick={() => setPrefs({ theme: "light" })} icon={<Sun className="h-4 w-4" />} label="Light" theme={theme} />
              <ThemeBtn active={prefs.theme === "sepia"} onClick={() => setPrefs({ theme: "sepia" })} icon={<Coffee className="h-4 w-4" />} label="Sepia" theme={theme} />
              <ThemeBtn active={prefs.theme === "dark"} onClick={() => setPrefs({ theme: "dark" })} icon={<Moon className="h-4 w-4" />} label="Dark" theme={theme} />
            </div>
          </div>
        </div>
      )}

      {/* Reader area — full viewport, centered paperback column */}
      <div
        className="relative mx-auto flex items-stretch justify-center"
        style={{
          width: "min(680px, 100vw - 1.5rem)",
          minHeight: "100dvh",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
        }}
      >
        <div className="relative w-full" style={{ perspective: "2400px" }}>
          {/* Corner-peel page wrapper — re-keyed per page to retrigger animation */}
          <div
            key={flipKey}
            className="h-full"
            style={{
              animation: flipDir
                ? `${flipDir === "next" ? "page-peel-next" : "page-peel-prev"} 700ms cubic-bezier(0.22, 0.61, 0.36, 1) both`
                : undefined,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            onAnimationEnd={() => setFlipDir(null)}
          >
            <PageView
              page={leftPage}
              theme={theme}
              fs={fs}
              bookTitle={book.title}
              pageNumber={current + 1}
              totalPages={total}
              highlights={state.highlights.filter((h) => h.pageIndex === leftPage.index)}
              onMouseUp={handleMouseUp(leftPage.index)}
            />
          </div>

          {/* Edge overlay arrows — auto-hide with chrome */}
          <ArrowButton
            side="left"
            theme={theme}
            visible={chromeVisible && current !== 0}
            onClick={goPrev}
            disabled={current === 0}
            ariaLabel="Previous page"
          />
          <ArrowButton
            side="right"
            theme={theme}
            visible={chromeVisible && current < total - 1 && !isLocked}
            onClick={goNext}
            disabled={current >= total - 1 || isLocked}
            ariaLabel="Next page"
          />
        </div>

        {/* Locked overlay */}
        {isLocked && (
          <div
            className="absolute inset-x-4 bottom-20 rounded-xl border p-6 text-center"
            style={{ background: theme.page, borderColor: theme.border }}
          >
            <Lock className="mx-auto h-8 w-8" style={{ color: "oklch(0.55 0.18 30)" }} />
            <h3 className="mt-3 text-xl font-black" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              You've reached the end of the free preview
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm font-semibold" style={{ color: theme.muted }}>
              Sign in to keep reading {book.title} — plus unlock highlights, bookmarks and progress sync.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-bold text-white"
                style={{ background: "oklch(0.55 0.18 30)" }}
              >
                Create free account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-bold"
                style={{ border: `1px solid ${theme.border}`, color: theme.text }}
              >
                Sign in
              </Link>
            </div>
          </div>
        )}

        {/* Page number lives inside the page footer (printed-book style) */}
      </div>

      {/* Highlight popover */}
      {selectionInfo && (
        <div
          className="fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg border p-1.5 shadow-xl"
          style={{
            left: selectionInfo.x,
            top: selectionInfo.y,
            background: theme.page,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center gap-1">
            <button
              onClick={() => addHighlight("yellow")}
              className="h-6 w-6 rounded-full"
              style={{ background: "oklch(0.92 0.15 95)" }}
              title="Yellow"
            />
            <button
              onClick={() => addHighlight("green")}
              className="h-6 w-6 rounded-full"
              style={{ background: "oklch(0.88 0.13 145)" }}
              title="Green"
            />
            <button
              onClick={() => addHighlight("pink")}
              className="h-6 w-6 rounded-full"
              style={{ background: "oklch(0.88 0.10 0)" }}
              title="Pink"
            />
          </div>
        </div>
      )}

      {/* TOC sidebar */}
      {showToc && (
        <SidePanel theme={theme} title="Contents" onClose={() => setShowToc(false)}>
          <div className="space-y-1">
            {book.chapters.map((ch, ci) => {
              const startPage = book.chapters.slice(0, ci).reduce((acc, c) => acc + c.pages.length, 0);
              const isActive = leftPage.chapterIndex === ci;
              return (
                <button
                  key={ci}
                  onClick={() => {
                    setState((s) => ({ ...s, currentPage: startPage }));
                    setShowToc(false);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors"
                  style={{
                    background: isActive ? "oklch(0.55 0.18 30 / 0.1)" : "transparent",
                    color: isActive ? "oklch(0.55 0.18 30)" : theme.text,
                  }}
                >
                  <span className="opacity-50">Ch. {ci + 1}</span>{" "}
                  <span>{ch.title}</span>
                  <p className="mt-0.5 text-xs opacity-50">{ch.pages.length} pages</p>
                </button>
              );
            })}
          </div>
          {state.bookmarks.length > 0 && (
            <>
              <p className="mt-6 mb-2 text-xs font-black uppercase tracking-wider opacity-60">
                Bookmarks
              </p>
              <div className="space-y-1">
                {state.bookmarks.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setState((s) => ({ ...s, currentPage: p }));
                      setShowToc(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-xs font-semibold"
                    style={{ background: "transparent", color: theme.text }}
                  >
                    <span>Page {p + 1}</span>
                    <span className="opacity-50">{flat[p]?.chapterTitle}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </SidePanel>
      )}

      {/* Highlights panel */}
      {showHighlights && (
        <SidePanel theme={theme} title="Highlights & Notes" onClose={() => setShowHighlights(false)}>
          {state.highlights.length === 0 ? (
            <p className="text-sm font-semibold opacity-60">
              Select any text in the book to highlight it.
            </p>
          ) : (
            <div className="space-y-3">
              {state.highlights.map((h) => (
                <div
                  key={h.id}
                  className="rounded-md border p-3"
                  style={{ borderColor: theme.border }}
                >
                  <div
                    className="mb-1.5 inline-block rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase"
                    style={{
                      background:
                        h.color === "yellow"
                          ? "oklch(0.92 0.15 95)"
                          : h.color === "green"
                            ? "oklch(0.88 0.13 145)"
                            : "oklch(0.88 0.10 0)",
                      color: "oklch(0.20 0.05 60)",
                    }}
                  >
                    Page {h.pageIndex + 1}
                  </div>
                  <p className="text-sm font-medium italic">"{h.text}"</p>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setState((s) => ({ ...s, currentPage: h.pageIndex }));
                        setShowHighlights(false);
                      }}
                      className="text-xs font-bold underline opacity-70 hover:opacity-100"
                    >
                      Jump to page
                    </button>
                    <button
                      onClick={() => deleteHighlight(h.id)}
                      className="opacity-50 hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SidePanel>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  theme,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  theme: typeof THEMES[keyof typeof THEMES];
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-black/5"
      style={{ color: theme.text }}
    >
      {children}
    </button>
  );
}

function ArrowButton({
  side,
  theme,
  visible,
  onClick,
  disabled,
  ariaLabel,
}: {
  side: "left" | "right";
  theme: typeof THEMES[keyof typeof THEMES];
  visible: boolean;
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="group absolute top-1/2 z-20 -translate-y-1/2 transition-all duration-300 ease-out disabled:pointer-events-none"
      style={{
        [side]: "0.5rem",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: `translateY(-50%) ${visible ? "translateX(0)" : `translateX(${side === "left" ? "-8px" : "8px"})`}`,
      }}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-200 ease-out group-hover:scale-110 group-active:scale-95"
        style={{
          background: theme.page,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          boxShadow:
            "0 8px 24px -10px oklch(0.2 0.05 260 / 0.35), 0 2px 6px -2px oklch(0.2 0.05 260 / 0.15)",
        }}
      >
        <Icon className="h-5 w-5 opacity-80 transition-opacity group-hover:opacity-100" strokeWidth={2.25} />
      </span>
    </button>
  );
}

function ThemeBtn({
  active,
  onClick,
  icon,
  label,
  theme,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  theme: typeof THEMES[keyof typeof THEMES];
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-1 rounded-md px-3 py-2 text-[11px] font-bold transition-colors"
      style={{
        background: active ? "oklch(0.55 0.18 30)" : "transparent",
        color: active ? "white" : theme.text,
        border: `1px solid ${theme.border}`,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function PageView({
  page,
  theme,
  fs,
  bookTitle,
  pageNumber,
  totalPages,
  highlights,
  onMouseUp,
  locked,
}: {
  page: { content: string; index: number; chapterTitle: string };
  theme: typeof THEMES[keyof typeof THEMES];
  fs: typeof FONT_SIZES[keyof typeof FONT_SIZES];
  bookTitle: string;
  pageNumber: number;
  totalPages: number;
  highlights: Highlight[];
  onMouseUp: () => void;
  locked?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Auto-shrink: measure intrinsic content vs available card area, scale down to fit.
  useEffect(() => {
    if (!cardRef.current || !innerRef.current) return;
    const card = cardRef.current;
    const inner = innerRef.current;

    let raf = 0;
    let lastScale = -1;
    const measure = () => {
      raf = 0;
      inner.style.transform = "scale(1)";
      inner.style.width = "100%";
      const cardH = card.clientHeight;
      const cardW = card.clientWidth;
      const innerH = inner.scrollHeight;
      const innerW = inner.scrollWidth;
      if (cardH === 0 || innerH === 0) return;
      const heightScale = cardH / innerH;
      const widthScale = cardW / Math.max(innerW, 1);
      const fit = Math.min(1, heightScale, widthScale);
      const next = Math.max(0.6, fit);
      const rounded = Math.round(next * 1000) / 1000;
      if (Math.abs(rounded - lastScale) < 0.002) return;
      lastScale = rounded;
      setScale(rounded);
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(card);
    ro.observe(inner);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [page.content, fs]);

  const lines = page.content.split("\n");

  const renderText = (text: string): React.ReactNode => {
    if (highlights.length === 0) return text;
    type Node = string | React.ReactElement;
    let result: Node[] = [text];
    highlights.forEach((h, i) => {
      const next: Node[] = [];
      result.forEach((part) => {
        if (typeof part !== "string") {
          next.push(part);
          return;
        }
        const idx = part.indexOf(h.text);
        if (idx === -1) {
          next.push(part);
          return;
        }
        const color =
          h.color === "yellow"
            ? "oklch(0.92 0.15 95 / 0.6)"
            : h.color === "green"
              ? "oklch(0.88 0.13 145 / 0.6)"
              : "oklch(0.88 0.10 0 / 0.6)";
        next.push(part.slice(0, idx));
        next.push(
          <mark
            key={`${h.id}-${i}`}
            style={{ background: color, color: "inherit", padding: "1px 2px", borderRadius: 2 }}
          >
            {h.text}
          </mark>,
        );
        next.push(part.slice(idx + h.text.length));
      });
      result = next;
    });
    return <>{result.map((n, i) => (typeof n === "string" ? <span key={i}>{n}</span> : n))}</>;
  };

  // Modern paperback page with printed-book header (title + chapter) and footer (page number).
  return (
    <div
      ref={cardRef}
      onMouseUp={onMouseUp}
      className="relative flex flex-col overflow-hidden"
      style={{
        background: theme.page,
        boxShadow:
          "0 1px 0 oklch(0.2 0.05 260 / 0.04), 0 18px 40px -22px oklch(0.2 0.05 260 / 0.3), 0 2px 8px -2px oklch(0.2 0.05 260 / 0.1)",
        borderRadius: "6px",
        height: "calc(100dvh - 1.5rem)",
        maxHeight: "calc(100dvh - 1.5rem)",
        // Generous A4 book margins, with extra room reserved for in-page header/footer.
        padding: "clamp(1.25rem, 4vh, 1.75cm) clamp(1.25rem, 5vw, 2cm)",
      }}
    >
      {/* In-page running header — book title (left) + chapter (right) */}
      <header
        className="flex shrink-0 items-baseline justify-between gap-4 pb-3"
        style={{
          borderBottom: `1px solid ${theme.border}`,
          fontFamily: "'Lora', Georgia, serif",
          color: theme.muted,
        }}
      >
        <span
          className="truncate text-[10px] font-semibold uppercase tracking-[0.18em]"
          title={bookTitle}
        >
          {bookTitle}
        </span>
        <span
          className="truncate text-[10px] font-semibold italic tracking-wide"
          title={page.chapterTitle}
        >
          {page.chapterTitle}
        </span>
      </header>

      {/* Page body — fills remaining vertical space */}
      <div className="relative flex-1 overflow-hidden pt-4">
        {locked ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Lock className="h-10 w-10 opacity-40" />
            <p className="mt-4 text-sm font-bold uppercase tracking-wider opacity-50">
              Locked — sign in to read
            </p>
          </div>
        ) : (
          <article
            ref={innerRef}
            className="origin-top-left will-change-transform"
            style={{
              fontFamily: "'Lora', Georgia, 'Times New Roman', serif",
              color: theme.text,
              transform: `scale(${scale})`,
              width: `${100 / scale}%`,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility",
            }}
          >
            {lines.map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h1
                    key={i}
                    className={`${fs.h1} mb-3 font-bold leading-[1.2] tracking-tight`}
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    {line.slice(2)}
                  </h1>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className={`${fs.h2} mb-5 mt-1 font-semibold italic`}
                    style={{
                      color: theme.muted,
                      fontFamily: "'Lora', Georgia, serif",
                    }}
                  >
                    {line.slice(3)}
                  </h2>
                );
              }
              if (line.trim() === "") return <div key={i} style={{ height: "0.6em" }} />;
              return (
                <p
                  key={i}
                  className={`${fs.body} mb-4`}
                  style={{ textAlign: "justify", hyphens: "auto" }}
                >
                  {renderText(line)}
                </p>
              );
            })}
          </article>
        )}
      </div>

      {/* In-page running footer — centered page number */}
      <footer
        className="flex shrink-0 items-center justify-center pt-3"
        style={{
          borderTop: `1px solid ${theme.border}`,
          fontFamily: "'Lora', Georgia, serif",
          color: theme.muted,
        }}
      >
        <span className="text-[11px] font-semibold tracking-[0.2em]">
          · {pageNumber} ·
        </span>
        <span className="ml-2 text-[10px] opacity-60">/ {totalPages}</span>
      </footer>
    </div>
  );
}

function SidePanel({
  title,
  children,
  onClose,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  theme: typeof THEMES[keyof typeof THEMES];
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <aside
        className="fixed right-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto p-6 shadow-2xl"
        style={{ background: theme.page, color: theme.text }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-black" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
