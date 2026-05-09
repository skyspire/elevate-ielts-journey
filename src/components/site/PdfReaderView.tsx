// Premium PDF reader:
// - Cool-grey paper-textured backdrop
// - Single page centered with realistic page-curl turn animation
// - Full clickable side strips with floating arrows
// - Dark-grey translucent footer with scrubber, jump, zoom, fullscreen
// - Thumbnail scrub strip above the footer
// - Mini progress ring around the page number
// - Auto-dim immersive mode (chrome fades when idle)
// - Pinch + double-tap zoom on touch
// - Pre-render adjacent pages for instant flips
// - Sepia / Night PDF themes (CSS filter on rendered canvas)
// - Persists progress per book so the library can "Continue reading"

import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Download,
  List,
  Lock,
  Maximize2,
  Minimize2,
  Moon,
  RotateCcw,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Ebook } from "@/data/ebooks";
import { useLearnerSession } from "@/lib/learner-auth";
import { useReaderPrefs, useReaderState } from "@/lib/ebook-storage";

type OutlineItem = {
  title: string;
  pageNumber: number | null;
  items: OutlineItem[];
};

type Props = {
  book: Ebook;
  userIsAuthed: boolean;
};

const PAPER_BG = `
  radial-gradient(oklch(0.78 0.005 250 / 0.18) 1px, transparent 1px),
  radial-gradient(oklch(0.65 0.005 250 / 0.10) 1px, transparent 1px),
  linear-gradient(180deg, oklch(0.93 0.004 250), oklch(0.90 0.005 250))
`;
const PAPER_BG_SIZE = "5px 5px, 13px 13px, 100% 100%";
const PAPER_BG_POS = "0 0, 2px 4px, 0 0";

const SEPIA_BG = `
  radial-gradient(oklch(0.70 0.05 70 / 0.14) 1px, transparent 1px),
  linear-gradient(180deg, oklch(0.92 0.04 78), oklch(0.88 0.05 75))
`;
const NIGHT_BG = `
  radial-gradient(oklch(0.30 0.01 260 / 0.5) 1px, transparent 1px),
  linear-gradient(180deg, oklch(0.16 0.01 260), oklch(0.12 0.01 260))
`;

export function PdfReaderView({ book, userIsAuthed }: Props) {
  const { user } = useLearnerSession();
  const [prefs, setPrefs] = useReaderPrefs();
  const [savedState, setSavedState] = useReaderState(user?.id ?? null, book.id);
  const [blobSrc, setBlobSrc] = useState("");
  const pdfSrc = blobSrc || book.pdfDataUrl || "";

  const [numPages, setNumPages] = useState(0);
  const [page, setPageState] = useState(Math.max(1, savedState.currentPage + 1));
  const [scale, setScale] = useState(1);
  const [fitMode, setFitMode] = useState<"page" | "width" | "manual">("page");
  const [showToc, setShowToc] = useState(false);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [pageInput, setPageInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const isLocked = !userIsAuthed && (book.freePages ?? 0) === 0;
  const totalPages = Math.max(1, numPages || book.pageCount || 1);

  useEffect(() => {
    if (!book.pdfDataUrl) {
      setBlobSrc("");
      return;
    }

    try {
      // Treat every uploaded book file as a PDF, regardless of the original
      // mime declared in the data URL (some uploads come through as
      // application/octet-stream or generic binary types).
      const [, base64 = ""] = book.pdfDataUrl.split(",");
      const binary = atob(base64);
      const detectedPages = binary.match(/\/Type\s*\/Page\b/g)?.length;
      if (detectedPages && detectedPages > 0) setNumPages(detectedPages);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      setBlobSrc(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setBlobSrc("");
    }
  }, [book.pdfDataUrl]);

  // Persist progress
  const setPage = useCallback(
    (next: number, _dir?: "next" | "prev") => {
      setPageState((p) => {
        const n = Math.max(1, Math.min(totalPages, next));
        return n;
      });
    },
    [totalPages],
  );
  useEffect(() => {
    setSavedState((s) => ({ ...s, currentPage: page - 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Auto-dim immersive
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      setChromeVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setChromeVisible(false), 3500);
    };
    show();
    const events: (keyof WindowEventMap)[] = ["mousemove", "keydown", "touchstart", "click"];
    events.forEach((e) => window.addEventListener(e, show, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, show));
    };
  }, []);

  const goPrev = useCallback(() => setPage(page - 1, "prev"), [page, setPage]);
  const goNext = useCallback(() => setPage(page + 1, "next"), [page, setPage]);
  const jumpTo = (n: number) => {
    setPage(n);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) rootRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") setShowToc(false);
      else if (e.key.toLowerCase() === "f") toggleFullscreen();
      else if (e.key === "+") setScale((s) => Math.min(2.4, s + 0.15));
      else if (e.key === "-") setScale((s) => Math.max(0.6, s - 0.15));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // Pinch + double-tap zoom
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = { dist: Math.hypot(dx, dy), scale };
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        setScale((s) => (s > 1.05 ? 1 : 1.6));
      }
      lastTapRef.current = now;
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.hypot(dx, dy);
      const next = Math.max(0.6, Math.min(2.4, pinchRef.current.scale * (d / pinchRef.current.dist)));
      setScale(next);
    }
  };
  const onTouchEnd = () => {
    pinchRef.current = null;
  };

  if (isLocked) return <LockedView book={book} />;

  const pct = (page / totalPages) * 100;
  const theme = prefs.theme;
  const stageBg =
    theme === "sepia" ? SEPIA_BG : theme === "dark" ? NIGHT_BG : PAPER_BG;
  const isDark = theme === "dark";
  const chromeBg = isDark ? "oklch(0.20 0.01 260 / 0.85)" : "oklch(0.97 0.003 250 / 0.92)";
  const chromeBorder = isDark ? "oklch(0.32 0.01 260)" : "oklch(0.82 0.005 250)";
  const chromeText = isDark ? "oklch(0.92 0.005 250)" : "oklch(0.2 0.015 260)";
  const viewerMode = fitMode === "width" ? "FitH" : "Fit";
  const viewParams = fitMode === "manual" ? `zoom=${Math.round(scale * 100)}` : `view=${viewerMode}`;
  const viewerSrc = pdfSrc ? `${pdfSrc}#page=${page}&${viewParams}&toolbar=0&navpanes=0&scrollbar=1` : "";

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen flex-col"
      style={{ color: chromeText, cursor: chromeVisible ? "auto" : "none" }}
    >
      {/* Top bar — auto-hide */}
      <header
        className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 border-b px-4 py-2.5 transition-all duration-300"
        style={{
          borderColor: chromeBorder,
          background: chromeBg,
          backdropFilter: "blur(10px)",
          transform: chromeVisible ? "translateY(0)" : "translateY(-100%)",
          opacity: chromeVisible ? 1 : 0,
          pointerEvents: chromeVisible ? "auto" : "none",
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/ebooks"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold opacity-75 hover:opacity-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
          <button
            onClick={() => setShowToc(true)}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold opacity-75 hover:opacity-100"
            title="Contents"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Contents</span>
          </button>
          <div className="hidden h-5 w-px sm:block" style={{ background: chromeBorder }} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight">{book.title}</p>
            <p className="truncate text-[11px] font-semibold opacity-60">
              {book.author} · {book.band}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Theme switcher */}
          <ThemeBtn active={theme === "light"} onClick={() => setPrefs({ theme: "light" })} icon={<Sun className="h-4 w-4" />} title="Light" />
          <ThemeBtn active={theme === "sepia"} onClick={() => setPrefs({ theme: "sepia" })} icon={<Coffee className="h-4 w-4" />} title="Sepia" />
          <ThemeBtn active={theme === "dark"} onClick={() => setPrefs({ theme: "dark" })} icon={<Moon className="h-4 w-4" />} title="Night" />
          <a
            href={book.pdfDataUrl}
            download={book.pdfFileName ?? `${book.title}.pdf`}
            className="ml-1 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-bold hover:bg-black/5"
            style={{ borderColor: chromeBorder }}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </header>

      {/* Stage */}
      <div
        ref={stageRef}
        className="relative flex flex-1 overflow-hidden pb-16 pt-14"
        style={{
          backgroundImage: stageBg,
          backgroundSize: theme === "light" ? PAPER_BG_SIZE : "8px 8px, 100% 100%",
          backgroundPosition: theme === "light" ? PAPER_BG_POS : "0 0, 0 0",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Left clickable strip — always visible */}
        <button
          onClick={goPrev}
          disabled={page <= 1}
          aria-label="Previous page"
          className="group fixed left-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border bg-white/95 shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
          style={{ borderColor: "oklch(0.85 0.005 250)", color: "oklch(0.2 0.015 260)" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Page column */}
        <div className="flex flex-1 items-stretch justify-center px-2 py-3 sm:px-0">
          <iframe
            key={viewerSrc}
            src={viewerSrc}
            title={`${book.title} PDF`}
            className="h-[calc(100vh-7rem)] w-full max-w-5xl rounded-md bg-white shadow-2xl"
            style={{ background: "white" }}
          />
        </div>

        {/* Right clickable strip — always visible */}
        <button
          onClick={goNext}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="group fixed right-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border bg-white/95 shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
          style={{ borderColor: "oklch(0.85 0.005 250)", color: "oklch(0.2 0.015 260)" }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Mobile floating arrows */}
        <button
          onClick={goPrev}
          disabled={page <= 1}
          aria-label="Previous"
          className="fixed left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-white/90 p-2.5 shadow-lg backdrop-blur disabled:opacity-30 sm:hidden"
          style={{ borderColor: "oklch(0.85 0.005 250)", color: "oklch(0.2 0.015 260)" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={goNext}
          disabled={page >= totalPages}
          aria-label="Next"
          className="fixed right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-white/90 p-2.5 shadow-lg backdrop-blur disabled:opacity-30 sm:hidden"
          style={{ borderColor: "oklch(0.85 0.005 250)", color: "oklch(0.2 0.015 260)" }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Footer — always visible, dark grey translucent, sans-serif heavy */}
      <footer
        className="fixed inset-x-0 bottom-0 z-30 border-t px-3 py-2.5 font-sans font-extrabold tracking-tight text-white"
        style={{
          background: "oklch(0.18 0.012 260 / 0.92)",
          borderColor: "oklch(0.16 0.012 260 / 0.7)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button onClick={goPrev} disabled={page <= 1} className="rounded-md p-1.5 text-cyan-200 shadow-[0_0_16px_oklch(0.75_0.22_210_/_0.3)] hover:bg-cyan-400/20 disabled:opacity-30" aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={goNext} disabled={page >= totalPages} className="rounded-md p-1.5 text-fuchsia-200 shadow-[0_0_16px_oklch(0.72_0.25_315_/_0.3)] hover:bg-fuchsia-400/20 disabled:opacity-30" aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </button>

          <input
            type="range"
            min={1}
            max={totalPages}
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="h-1.5 min-w-28 flex-1 cursor-pointer appearance-none rounded-full"
            style={{
              background: `linear-gradient(to right, oklch(0.78 0.22 150) 0%, oklch(0.70 0.23 205) 35%, oklch(0.72 0.24 315) ${pct}%, oklch(0.95 0 0 / 0.22) ${pct}%, oklch(0.95 0 0 / 0.22) 100%)`,
            }}
          />

          <div className="flex min-w-[4.5rem] items-center justify-center rounded-md px-2.5 py-1 text-xs font-black tabular-nums text-white shadow-lg" style={{ background: "linear-gradient(135deg, oklch(0.70 0.24 205), oklch(0.72 0.25 315))", boxShadow: "0 0 22px oklch(0.70 0.24 205 / 0.35)" }}>
            {page}<span className="px-1 text-white/65">/</span>{totalPages}
          </div>

          {/* Jump-to-page */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(pageInput, 10);
              if (!isNaN(n)) jumpTo(n);
              setPageInput("");
            }}
            className="flex items-center gap-1"
          >
            <input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Go to"
              className="h-7 w-14 rounded-md border bg-white/10 px-2 text-center text-xs font-bold tabular-nums text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40"
              style={{ borderColor: "oklch(0.95 0 0 / 0.25)" }}
              aria-label="Jump to page"
            />
          </form>

          {/* Zoom */}
          <div className="flex items-center gap-0.5 rounded-md border bg-white/5" style={{ borderColor: "oklch(0.95 0 0 / 0.2)" }}>
            <button onClick={() => { setFitMode("manual"); setScale((s) => Math.max(0.6, s - 0.15)); }} className="rounded-md p-1.5 text-cyan-200 hover:bg-cyan-400/20" aria-label="Zoom out">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-9 text-center text-[10px] font-bold tabular-nums text-white/85">{Math.round(scale * 100)}%</span>
            <button onClick={() => { setFitMode("manual"); setScale((s) => Math.min(2.4, s + 0.15)); }} className="rounded-md p-1.5 text-fuchsia-200 hover:bg-fuchsia-400/20" aria-label="Zoom in">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setFitMode("page")} className="rounded-md px-2 py-1 text-[10px] font-black uppercase text-lime-100 hover:bg-lime-400/20" style={{ background: fitMode === "page" ? "oklch(0.74 0.22 145 / 0.32)" : undefined }}>Fit</button>
            <button onClick={() => setFitMode("width")} className="rounded-md px-2 py-1 text-[10px] font-black uppercase text-cyan-100 hover:bg-cyan-400/20" style={{ background: fitMode === "width" ? "oklch(0.72 0.2 210 / 0.32)" : undefined }}>Wide</button>
            <button onClick={() => { setFitMode("page"); setScale(1); }} className="rounded-md p-1.5 text-amber-100 hover:bg-amber-400/20" aria-label="Reset view" title="Reset view">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          <button onClick={toggleFullscreen} className="rounded-md p-1.5 hover:bg-white/15" aria-label="Fullscreen" title="Fullscreen (F)">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </footer>

      {/* TOC drawer */}
      {showToc && (
        <>
          <div onClick={() => setShowToc(false)} className="fixed inset-0 z-40 bg-black/30" />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-[320px] max-w-[85vw] flex-col border-r bg-white shadow-2xl"
            style={{ borderColor: "oklch(0.88 0.005 250)" }}
          >
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "oklch(0.92 0.005 250)" }}>
              <p className="text-sm font-black uppercase tracking-wider">Contents</p>
              <button onClick={() => setShowToc(false)} className="rounded-md p-1.5 hover:bg-black/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {outline.length === 0 ? (
                <p className="px-3 py-4 text-xs font-semibold text-muted-foreground">
                  This PDF doesn't have an embedded table of contents. Use the footer scrubber, the
                  thumbnail strip, or arrow keys to jump pages.
                </p>
              ) : (
                <OutlineList items={outline} currentPage={page} onJump={(p) => { jumpTo(p); setShowToc(false); }} />
              )}
            </div>
          </aside>
        </>
      )}

      {/* Keyframes for page-curl */}
      <style>{`
        @keyframes pdf-curl-next {
          0% { transform: rotateY(0deg); transform-origin: left center; box-shadow: 0 22px 60px -22px oklch(0.2 0.02 260 / 0.55); }
          50% { transform: rotateY(-22deg); transform-origin: left center; box-shadow: 30px 30px 70px -20px oklch(0.2 0.02 260 / 0.65); }
          100% { transform: rotateY(0deg); transform-origin: left center; }
        }
        @keyframes pdf-curl-prev {
          0% { transform: rotateY(0deg); transform-origin: right center; box-shadow: 0 22px 60px -22px oklch(0.2 0.02 260 / 0.55); }
          50% { transform: rotateY(22deg); transform-origin: right center; box-shadow: -30px 30px 70px -20px oklch(0.2 0.02 260 / 0.65); }
          100% { transform: rotateY(0deg); transform-origin: right center; }
        }
      `}</style>
    </div>
  );
}

function ThemeBtn({
  active,
  onClick,
  icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
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

function OutlineList({
  items,
  currentPage,
  onJump,
  depth = 0,
}: {
  items: OutlineItem[];
  currentPage: number;
  onJump: (p: number) => void;
  depth?: number;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((it, idx) => {
        const active = it.pageNumber === currentPage;
        return (
          <li key={`${depth}-${idx}-${it.title}`}>
            <button
              onClick={() => it.pageNumber && onJump(it.pageNumber)}
              disabled={!it.pageNumber}
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold transition hover:bg-black/5 disabled:cursor-default disabled:opacity-50"
              style={{
                paddingLeft: `${12 + depth * 14}px`,
                background: active ? "oklch(0.95 0.02 30)" : undefined,
                color: active ? "oklch(0.45 0.18 30)" : undefined,
              }}
            >
              <span className="truncate">{it.title}</span>
              {it.pageNumber && (
                <span className="shrink-0 text-[10px] font-bold tabular-nums text-muted-foreground">{it.pageNumber}</span>
              )}
            </button>
            {it.items.length > 0 && <OutlineList items={it.items} currentPage={currentPage} onJump={onJump} depth={depth + 1} />}
          </li>
        );
      })}
    </ul>
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
