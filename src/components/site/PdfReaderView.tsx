// Polished PDF reader: cool-grey paper-textured backdrop, single page centered,
// full clickable side strips for prev/next, dark-grey footer with scrubber,
// jump-to-page, zoom, and fullscreen. TOC drawer pulled from the PDF outline.

import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  List,
  Lock,
  Maximize2,
  Minimize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { Ebook } from "@/data/ebooks";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type OutlineItem = {
  title: string;
  pageNumber: number | null;
  items: OutlineItem[];
};

type Props = {
  book: Ebook;
  userIsAuthed: boolean;
};

// Cool-grey paper background — subtle dual-layer noise + faint fibre lines.
const PAPER_BG = `
  radial-gradient(oklch(0.78 0.005 250 / 0.18) 1px, transparent 1px),
  radial-gradient(oklch(0.65 0.005 250 / 0.10) 1px, transparent 1px),
  linear-gradient(180deg, oklch(0.93 0.004 250), oklch(0.90 0.005 250))
`;
const PAPER_BG_SIZE = "5px 5px, 13px 13px, 100% 100%";
const PAPER_BG_POS = "0 0, 2px 4px, 0 0";

export function PdfReaderView({ book, userIsAuthed }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [showToc, setShowToc] = useState(false);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [pageInput, setPageInput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);

  const isLocked = !userIsAuthed && (book.freePages ?? 0) === 0;

  useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        // Reserve room for the side strips and footer.
        setContainerWidth(Math.min(e.contentRect.width - 140, 920));
      }
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const onLoad = useCallback(async (pdf: any) => {
    pdfDocRef.current = pdf;
    setNumPages(pdf.numPages);
    try {
      const raw = await pdf.getOutline();
      if (raw && raw.length > 0) {
        const flatten = async (items: any[]): Promise<OutlineItem[]> => {
          const out: OutlineItem[] = [];
          for (const it of items) {
            let pageNumber: number | null = null;
            try {
              if (it.dest) {
                const dest = typeof it.dest === "string" ? await pdf.getDestination(it.dest) : it.dest;
                if (dest) {
                  const idx = await pdf.getPageIndex(dest[0]);
                  pageNumber = idx + 1;
                }
              }
            } catch {
              /* skip */
            }
            out.push({
              title: it.title,
              pageNumber,
              items: it.items?.length ? await flatten(it.items) : [],
            });
          }
          return out;
        };
        setOutline(await flatten(raw));
      }
    } catch {
      /* outline optional */
    }
  }, []);

  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(numPages || p, p + 1)),
    [numPages],
  );
  const jumpTo = (n: number) => {
    if (!numPages) return;
    setPage(Math.max(1, Math.min(numPages, n)));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") setShowToc(false);
      else if (e.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (isLocked) return <LockedView book={book} />;

  const pct = numPages > 0 ? (page / numPages) * 100 : 0;

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen flex-col"
      style={{ color: "oklch(0.2 0.015 260)" }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 py-2.5"
        style={{
          borderColor: "oklch(0.82 0.005 250)",
          background: "oklch(0.97 0.003 250 / 0.92)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/ebooks"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-black/5 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
          <button
            onClick={() => setShowToc(true)}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-black/5 hover:text-foreground"
            title="Contents"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Contents</span>
          </button>
          <div className="hidden h-5 w-px bg-border sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight">{book.title}</p>
            <p className="truncate text-[11px] font-semibold text-muted-foreground">
              {book.author} · {book.band}
            </p>
          </div>
        </div>
        <a
          href={book.pdfDataUrl}
          download={book.pdfFileName ?? `${book.title}.pdf`}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-muted"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Download</span>
        </a>
      </header>

      {/* Stage with paper texture */}
      <div
        ref={stageRef}
        className="relative flex flex-1 overflow-auto pb-20"
        style={{
          backgroundImage: PAPER_BG,
          backgroundSize: PAPER_BG_SIZE,
          backgroundPosition: PAPER_BG_POS,
        }}
      >
        {/* Left clickable strip */}
        <button
          onClick={goPrev}
          disabled={page <= 1}
          aria-label="Previous page"
          className="group sticky top-0 z-10 hidden h-[calc(100vh-120px)] w-[70px] shrink-0 items-center justify-center self-start transition disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full border bg-white/80 shadow-md backdrop-blur transition group-hover:bg-white group-hover:shadow-lg group-active:scale-95"
            style={{ borderColor: "oklch(0.85 0.005 250)" }}
          >
            <ChevronLeft className="h-5 w-5" />
          </span>
        </button>

        {/* Page column */}
        <div className="flex flex-1 items-start justify-center px-3 py-6 sm:px-0">
          <Document
            file={book.pdfDataUrl}
            onLoadSuccess={onLoad}
            loading={
              <div className="py-20 text-sm font-semibold text-muted-foreground">Loading PDF…</div>
            }
            error={
              <div className="py-20 text-sm font-semibold text-muted-foreground">
                Couldn't load this PDF.
              </div>
            }
          >
            {numPages > 0 && containerWidth > 0 && (
              <div
                className="overflow-hidden rounded-md bg-white"
                style={{
                  boxShadow:
                    "0 18px 50px -22px oklch(0.2 0.02 260 / 0.45), 0 4px 12px oklch(0.2 0.02 260 / 0.12)",
                }}
              >
                <Page
                  pageNumber={page}
                  width={containerWidth * scale}
                  renderAnnotationLayer
                  renderTextLayer
                />
              </div>
            )}
          </Document>
        </div>

        {/* Right clickable strip */}
        <button
          onClick={goNext}
          disabled={page >= numPages}
          aria-label="Next page"
          className="group sticky top-0 z-10 hidden h-[calc(100vh-120px)] w-[70px] shrink-0 items-center justify-center self-start transition disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
        >
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full border bg-white/80 shadow-md backdrop-blur transition group-hover:bg-white group-hover:shadow-lg group-active:scale-95"
            style={{ borderColor: "oklch(0.85 0.005 250)" }}
          >
            <ChevronRight className="h-5 w-5" />
          </span>
        </button>

        {/* Mobile floating arrows */}
        <button
          onClick={goPrev}
          disabled={page <= 1}
          aria-label="Previous"
          className="fixed left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-white/90 p-2.5 shadow-lg backdrop-blur disabled:opacity-30 sm:hidden"
          style={{ borderColor: "oklch(0.85 0.005 250)" }}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={goNext}
          disabled={page >= numPages}
          aria-label="Next"
          className="fixed right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-white/90 p-2.5 shadow-lg backdrop-blur disabled:opacity-30 sm:hidden"
          style={{ borderColor: "oklch(0.85 0.005 250)" }}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Footer — dark grey, 40% opacity, full controls */}
      <footer
        className="fixed inset-x-0 bottom-0 z-30 border-t px-3 py-2.5 text-white"
        style={{
          background: "oklch(0.28 0.012 260 / 0.55)",
          borderColor: "oklch(0.18 0.012 260 / 0.5)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-2 sm:gap-3">
          {/* Prev/next */}
          <button
            onClick={goPrev}
            disabled={page <= 1}
            className="rounded-md p-1.5 transition hover:bg-white/15 disabled:opacity-30"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goNext}
            disabled={page >= numPages}
            className="rounded-md p-1.5 transition hover:bg-white/15 disabled:opacity-30"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Scrubber */}
          <input
            type="range"
            min={1}
            max={Math.max(1, numPages)}
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
            style={{
              background: `linear-gradient(to right, oklch(0.78 0.16 50) 0%, oklch(0.78 0.16 50) ${pct}%, oklch(0.95 0 0 / 0.25) ${pct}%, oklch(0.95 0 0 / 0.25) 100%)`,
            }}
          />

          {/* Jump-to-page */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(pageInput, 10);
              if (!isNaN(n)) jumpTo(n);
              setPageInput("");
            }}
            className="hidden items-center gap-1 sm:flex"
          >
            <input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/[^\d]/g, ""))}
              placeholder={`${page}`}
              className="h-7 w-12 rounded-md border bg-white/10 px-2 text-center text-xs font-bold tabular-nums text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/40"
              style={{ borderColor: "oklch(0.95 0 0 / 0.25)" }}
              aria-label="Jump to page"
            />
            <span className="text-[11px] font-bold tabular-nums text-white/70">/ {numPages || "—"}</span>
          </form>

          {/* Page counter (mobile) */}
          <div className="text-xs font-bold tabular-nums text-white/85 sm:hidden">
            {page}/{numPages || "—"}
          </div>

          {/* Zoom */}
          <div className="ml-1 flex items-center gap-0.5 rounded-md border bg-white/5" style={{ borderColor: "oklch(0.95 0 0 / 0.2)" }}>
            <button
              onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
              className="rounded-md p-1.5 hover:bg-white/15"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-9 text-center text-[10px] font-bold tabular-nums text-white/85">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2.4, s + 0.15))}
              className="rounded-md p-1.5 hover:bg-white/15"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="rounded-md p-1.5 hover:bg-white/15"
            aria-label="Fullscreen"
            title="Fullscreen (F)"
          >
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
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "oklch(0.92 0.005 250)" }}
            >
              <p className="text-sm font-black uppercase tracking-wider">Contents</p>
              <button onClick={() => setShowToc(false)} className="rounded-md p-1.5 hover:bg-black/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {outline.length === 0 ? (
                <p className="px-3 py-4 text-xs font-semibold text-muted-foreground">
                  This PDF doesn't have an embedded table of contents. Use the footer scrubber or
                  arrow keys to jump pages.
                </p>
              ) : (
                <OutlineList
                  items={outline}
                  currentPage={page}
                  onJump={(p) => {
                    setPage(p);
                    setShowToc(false);
                  }}
                />
              )}
            </div>
          </aside>
        </>
      )}
    </div>
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
                <span className="shrink-0 text-[10px] font-bold tabular-nums text-muted-foreground">
                  {it.pageNumber}
                </span>
              )}
            </button>
            {it.items.length > 0 && (
              <OutlineList
                items={it.items}
                currentPage={currentPage}
                onJump={onJump}
                depth={depth + 1}
              />
            )}
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
        <Link
          to="/ebooks"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
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
            <Link
              to="/signup"
              className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-bold text-white"
              style={{ background: "oklch(0.55 0.18 30)" }}
            >
              Create free account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-bold"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
