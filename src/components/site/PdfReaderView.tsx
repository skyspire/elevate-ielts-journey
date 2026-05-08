// Polished PDF reader: single page centred on greyish backdrop,
// collapsible chapters/outline sidebar, floating side arrows, footer with
// scrubbable progress bar + page x/y.

import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  List,
  Lock,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { Ebook } from "@/data/ebooks";

// Use the worker bundled with pdfjs-dist (Vite-friendly URL import).
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

export function PdfReaderView({ book, userIsAuthed }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [showToc, setShowToc] = useState(false);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);

  const isLocked = !userIsAuthed && (book.freePages ?? 0) === 0;

  // Track stage width so the page sizes itself nicely on mobile + desktop.
  useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setContainerWidth(Math.min(e.contentRect.width - 32, 980));
      }
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
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
                  const ref = dest[0];
                  const idx = await pdf.getPageIndex(ref);
                  pageNumber = idx + 1;
                }
              }
            } catch {
              /* skip unresolvable */
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

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") setShowToc(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (isLocked) {
    return <LockedView book={book} />;
  }

  const pct = numPages > 0 ? (page / numPages) * 100 : 0;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "oklch(0.94 0.005 250)", color: "oklch(0.2 0.015 260)" }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 py-2.5"
        style={{
          borderColor: "oklch(0.88 0.005 250)",
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
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
            className="rounded-md p-2 hover:bg-black/5"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-xs font-bold tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(2.4, s + 0.15))}
            className="rounded-md p-2 hover:bg-black/5"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <a
            href={book.pdfDataUrl}
            download={book.pdfFileName ?? `${book.title}.pdf`}
            className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </header>

      {/* Stage */}
      <div ref={stageRef} className="relative flex flex-1 items-start justify-center overflow-auto px-4 py-6 pb-24">
        <Document
          file={book.pdfDataUrl}
          onLoadSuccess={onLoad}
          loading={
            <div className="py-20 text-sm font-semibold text-muted-foreground">
              Loading PDF…
            </div>
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
              style={{ boxShadow: "0 14px 40px -18px oklch(0.2 0.02 260 / 0.35), 0 2px 6px oklch(0.2 0.02 260 / 0.08)" }}
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

        {/* Floating side arrows */}
        <button
          aria-label="Previous page"
          onClick={goPrev}
          disabled={page <= 1}
          className="fixed left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-white/90 p-3 shadow-lg backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-30 hover:bg-white sm:left-6"
          style={{ borderColor: "oklch(0.88 0.005 250)" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          aria-label="Next page"
          onClick={goNext}
          disabled={page >= numPages}
          className="fixed right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-white/90 p-3 shadow-lg backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-30 hover:bg-white sm:right-6"
          style={{ borderColor: "oklch(0.88 0.005 250)" }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Footer — scrubbable progress + page x/y */}
      <footer
        className="fixed inset-x-0 bottom-0 z-30 border-t px-4 py-3"
        style={{
          background: "oklch(0.97 0.003 250 / 0.95)",
          borderColor: "oklch(0.88 0.005 250)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button
            onClick={goPrev}
            disabled={page <= 1}
            className="rounded-md p-1.5 hover:bg-black/5 disabled:opacity-30"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <input
            type="range"
            min={1}
            max={Math.max(1, numPages)}
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
            style={{
              background: `linear-gradient(to right, oklch(0.55 0.18 30) 0%, oklch(0.55 0.18 30) ${pct}%, oklch(0.85 0.005 250) ${pct}%, oklch(0.85 0.005 250) 100%)`,
            }}
          />
          <button
            onClick={goNext}
            disabled={page >= numPages}
            className="rounded-md p-1.5 hover:bg-black/5 disabled:opacity-30"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="min-w-[70px] text-right text-xs font-bold tabular-nums text-muted-foreground">
            {page} / {numPages || "—"}
          </div>
        </div>
      </footer>

      {/* TOC drawer */}
      {showToc && (
        <>
          <div
            onClick={() => setShowToc(false)}
            className="fixed inset-0 z-40 bg-black/30"
          />
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
                  This PDF doesn't have an embedded table of contents. Use the footer
                  bar or arrow keys to jump pages.
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
          <h1 className="mt-4 font-display text-2xl font-black">
            Sign in to read {book.title}
          </h1>
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
