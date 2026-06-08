// Kindle-style fit-to-width PDF reader.
// - Pages render at exact container width via pdf.js (react-pdf) — no zoom needed.
// - Horizontal swipe with CSS scroll-snap; one page per snap.
// - Minimal auto-hiding top bar (back, title, contents). Bottom hairline progress + page count.
// - Tap the page to toggle chrome. Sepia / Night themes via a canvas CSS filter.

import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Coffee, Download, List, Lock, Moon, Sun, X } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Ebook } from "@/data/ebooks";
import { useLearnerSession } from "@/lib/learner-auth";
import { useReaderPrefs, useReaderState } from "@/lib/ebook-storage";

// Lazy-load react-pdf on the client only — pdf.js touches DOMMatrix at module
// load, which crashes SSR. Dynamic import keeps it out of the server bundle path.
const PdfPagesScroller = lazy(() => import("./PdfPagesScroller"));

type Props = { book: Ebook; userIsAuthed: boolean };

const THEME_BG = {
  light: "oklch(0.96 0.004 250)",
  sepia: "oklch(0.92 0.035 78)",
  dark: "oklch(0.15 0.01 260)",
} as const;

const THEME_PAGE_FILTER = {
  light: "none",
  sepia: "sepia(0.35) saturate(0.95) brightness(0.98)",
  dark: "invert(0.92) hue-rotate(180deg) brightness(0.96) contrast(0.95)",
} as const;

const THEME_INK = {
  light: "oklch(0.2 0.015 260)",
  sepia: "oklch(0.28 0.035 50)",
  dark: "oklch(0.92 0.005 250)",
} as const;

export function PdfReaderView({ book, userIsAuthed }: Props) {
  const { user } = useLearnerSession();
  const [prefs, setPrefs] = useReaderPrefs();
  const [savedState, setSavedState] = useReaderState(user?.id ?? null, book.id);
  const [mounted, setMounted] = useState(false);
  const [blobSrc, setBlobSrc] = useState<string>("");
  const [numPages, setNumPages] = useState(0);
  const [page, setPageState] = useState(Math.max(1, savedState.currentPage + 1));
  const [chromeVisible, setChromeVisible] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const skipScrollPersist = useRef(false);

  const isLocked = !userIsAuthed && (book.freePages ?? 0) === 0;

  useEffect(() => setMounted(true), []);

  // Build a stable blob URL from the data URL (avoids huge data: src reloads).
  useEffect(() => {
    if (!book.pdfDataUrl) {
      setBlobSrc("");
      return;
    }
    try {
      const [, base64 = ""] = book.pdfDataUrl.split(",");
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      setBlobSrc(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setBlobSrc("");
    }
  }, [book.pdfDataUrl]);

  // Track container width so pages always render at exactly the viewport width.
  useEffect(() => {
    if (!sizerRef.current) return;
    const el = sizerRef.current;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted]);

  // Persist current page.
  const setPage = useCallback(
    (next: number) => {
      setPageState((_) => Math.max(1, Math.min(numPages || 1, next)));
    },
    [numPages],
  );
  useEffect(() => {
    setSavedState((s) => ({ ...s, currentPage: page - 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Update current page on horizontal scroll (snap settles).
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc || !containerWidth) return;
    let raf = 0;
    const onScroll = () => {
      if (skipScrollPersist.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(sc.scrollLeft / containerWidth);
        setPage(idx + 1);
      });
    };
    sc.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      sc.removeEventListener("scroll", onScroll);
    };
  }, [containerWidth, setPage]);

  // Restore scroll position after pages render / width changes.
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc || !containerWidth || !numPages) return;
    skipScrollPersist.current = true;
    sc.scrollTo({ left: (page - 1) * containerWidth, behavior: "auto" });
    const t = setTimeout(() => (skipScrollPersist.current = false), 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth, numPages]);

  const scrollToPage = useCallback(
    (n: number) => {
      const sc = scrollerRef.current;
      if (!sc || !containerWidth) return;
      sc.scrollTo({ left: (n - 1) * containerWidth, behavior: "smooth" });
    },
    [containerWidth],
  );

  const goPrev = useCallback(() => scrollToPage(Math.max(1, page - 1)), [page, scrollToPage]);
  const goNext = useCallback(() => scrollToPage(Math.min(numPages || 1, page + 1)), [page, numPages, scrollToPage]);

  // Auto-hide chrome.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setChromeVisible(false), 2800);
    };
    arm();
    return () => clearTimeout(timer);
  }, [chromeVisible]);

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowLeft") {
        setChromeVisible(true);
        goPrev();
      } else if (e.key === "ArrowRight") {
        setChromeVisible(true);
        goNext();
      } else if (e.key === "Escape") setShowToc(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (isLocked) return <LockedView book={book} />;

  const theme = prefs.theme;
  const ink = THEME_INK[theme];
  const bg = THEME_BG[theme];
  const filter = THEME_PAGE_FILTER[theme];
  const pct = numPages ? (page / numPages) * 100 : 0;

  const pageWidth = Math.max(280, containerWidth);

  const fileProp = useMemo(() => (blobSrc ? blobSrc : undefined), [blobSrc]);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: bg, color: ink }}>
      {/* Top bar — auto-hide, Kindle style */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 px-3 py-2.5 transition-all duration-300"
        style={{
          background: theme === "dark" ? "oklch(0.18 0.01 260 / 0.88)" : "oklch(1 0 0 / 0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${theme === "dark" ? "oklch(0.28 0.01 260)" : "oklch(0.9 0.005 250)"}`,
          color: ink,
          transform: chromeVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: chromeVisible ? 1 : 0,
          pointerEvents: chromeVisible ? "auto" : "none",
        }}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <Link to="/ebooks" className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-semibold opacity-80 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button onClick={() => setShowToc(true)} className="rounded-md p-1.5 opacity-80 hover:opacity-100" aria-label="Contents">
            <List className="h-4 w-4" />
          </button>
          <p className="ml-1 truncate text-sm font-bold leading-tight">{book.title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <ThemeBtn active={theme === "light"} onClick={() => setPrefs({ theme: "light" })} icon={<Sun className="h-4 w-4" />} />
          <ThemeBtn active={theme === "sepia"} onClick={() => setPrefs({ theme: "sepia" })} icon={<Coffee className="h-4 w-4" />} />
          <ThemeBtn active={theme === "dark"} onClick={() => setPrefs({ theme: "dark" })} icon={<Moon className="h-4 w-4" />} />
          {book.pdfDataUrl && (
            <a
              href={book.pdfDataUrl}
              download={book.pdfFileName ?? `${book.title}.pdf`}
              className="ml-1 rounded-md p-1.5 opacity-80 hover:opacity-100"
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      </header>

      {/* Page stage */}
      <div ref={sizerRef} className="relative flex flex-1 flex-col" onClick={() => setChromeVisible((v) => !v)}>
        {mounted && fileProp ? (
          <div
            ref={scrollerRef}
            className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            <Suspense fallback={<LoadingShim ink={ink} />}>
              <PdfPagesScroller
                file={fileProp}
                numPages={numPages}
                pageWidth={pageWidth}
                theme={theme}
                onLoadSuccess={({ numPages: n }) => setNumPages(n)}
                loadingNode={<LoadingShim ink={ink} />}
                errorNode={<ErrorShim ink={ink} />}
              />
            </Suspense>
          </div>
        ) : (
          <LoadingShim ink={ink} />
        )}

        {/* Side tap-arrows (desktop) */}
        <button
          onClick={(e) => { e.stopPropagation(); setChromeVisible(true); goPrev(); }}
          disabled={page <= 1}
          aria-label="Previous page"
          className="fixed left-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 shadow-lg backdrop-blur hover:bg-white disabled:opacity-30 sm:flex"
          style={{ borderColor: "oklch(0.88 0.005 250)", color: "oklch(0.2 0.015 260)" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setChromeVisible(true); goNext(); }}
          disabled={!numPages || page >= numPages}
          aria-label="Next page"
          className="fixed right-3 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border bg-white/90 shadow-lg backdrop-blur hover:bg-white disabled:opacity-30 sm:flex"
          style={{ borderColor: "oklch(0.88 0.005 250)", color: "oklch(0.2 0.015 260)" }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Apply theme filter via overlay style on canvases */}
        <style>{`
          .react-pdf__Page__canvas { filter: ${filter}; transition: filter 200ms ease; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { scrollbar-width: none; }
        `}</style>
      </div>

      {/* Bottom hairline progress + page count — auto-hide */}
      <footer
        className="fixed inset-x-0 bottom-0 z-40 transition-all duration-300"
        style={{
          transform: chromeVisible ? "translateY(0)" : "translateY(100%)",
          opacity: chromeVisible ? 1 : 0,
          pointerEvents: chromeVisible ? "auto" : "none",
        }}
      >
        <div
          className="px-4 pb-2 pt-3"
          style={{
            background: theme === "dark" ? "oklch(0.18 0.01 260 / 0.88)" : "oklch(1 0 0 / 0.85)",
            backdropFilter: "blur(10px)",
            borderTop: `1px solid ${theme === "dark" ? "oklch(0.28 0.01 260)" : "oklch(0.9 0.005 250)"}`,
            color: ink,
          }}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <input
              type="range"
              min={1}
              max={Math.max(1, numPages)}
              value={page}
              onChange={(e) => { const n = Number(e.target.value); setChromeVisible(true); scrollToPage(n); }}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, ${ink} 0%, ${ink} ${pct}%, ${theme === "dark" ? "oklch(0.35 0.01 260)" : "oklch(0.85 0.005 250)"} ${pct}%, ${theme === "dark" ? "oklch(0.35 0.01 260)" : "oklch(0.85 0.005 250)"} 100%)`,
              }}
              aria-label="Page"
            />
            <span className="text-[11px] font-bold tabular-nums opacity-80">
              {page} / {numPages || "…"}
            </span>
          </div>
        </div>
      </footer>

      {/* TOC drawer (page list) */}
      {showToc && (
        <>
          <div onClick={() => setShowToc(false)} className="fixed inset-0 z-40 bg-black/30" />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[85vw] flex-col border-r bg-white shadow-2xl"
            style={{ borderColor: "oklch(0.88 0.005 250)", color: "oklch(0.2 0.015 260)" }}
          >
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "oklch(0.92 0.005 250)" }}>
              <p className="text-sm font-black uppercase tracking-wider">Pages</p>
              <button onClick={() => setShowToc(false)} className="rounded-md p-1.5 hover:bg-black/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <ul className="grid grid-cols-4 gap-2">
                {Array.from({ length: numPages || 0 }, (_, i) => i + 1).map((n) => (
                  <li key={n}>
                    <button
                      onClick={() => { scrollToPage(n); setShowToc(false); }}
                      className="aspect-[3/4] w-full rounded-md border text-xs font-bold tabular-nums hover:bg-black/5"
                      style={{
                        borderColor: n === page ? "oklch(0.55 0.18 30)" : "oklch(0.9 0.005 250)",
                        background: n === page ? "oklch(0.96 0.04 30)" : "white",
                        color: n === page ? "oklch(0.45 0.18 30)" : "oklch(0.3 0.015 260)",
                      }}
                    >
                      {n}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

function ThemeBtn({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md transition"
      style={{
        background: active ? "oklch(0.55 0.18 30)" : "transparent",
        color: active ? "white" : "currentColor",
        opacity: active ? 1 : 0.7,
      }}
    >
      {icon}
    </button>
  );
}

function LoadingShim({ ink }: { ink: string }) {
  return (
    <div className="flex flex-1 items-center justify-center text-sm font-semibold" style={{ color: ink, opacity: 0.6 }}>
      Loading your book…
    </div>
  );
}

function ErrorShim({ ink }: { ink: string }) {
  return (
    <div className="flex flex-1 items-center justify-center text-sm font-semibold" style={{ color: ink, opacity: 0.7 }}>
      We couldn't open this PDF. Please go back and try again.
    </div>
  );
}

function LockedView({ book }: { book: Ebook }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <Link to="/ebooks" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Library
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md">
          <Lock className="mx-auto h-10 w-10" style={{ color: "oklch(0.55 0.18 30)" }} />
          <h1 className="mt-4 font-display text-2xl font-black">Sign in to read {book.title}</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            This e-book is part of the BigIELTS library. Create a free account to start reading.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-bold text-white" style={{ background: "oklch(0.55 0.18 30)" }}>
              Create free account
            </Link>
            <Link to="/login" className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-bold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
