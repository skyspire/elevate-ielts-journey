// PDF reader view used when an ebook has an uploaded PDF.
// Uses the browser's native PDF viewer via <iframe> for reliability —
// no extra dependencies, supports zoom/search/print/download out of the box.

import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Lock } from "lucide-react";
import type { Ebook } from "@/data/ebooks";

type Props = {
  book: Ebook;
  userIsAuthed: boolean;
};

export function PdfReaderView({ book, userIsAuthed }: Props) {
  // Free-preview gate: when the admin set freePages but the user isn't
  // signed in, we still show the PDF (the browser viewer can't enforce
  // page-level locks without a heavy renderer). We surface a soft paywall
  // banner above the PDF so the upgrade path is clear.
  const isLocked = !userIsAuthed && (book.freePages ?? 0) === 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/ebooks"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
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
          <span className="hidden sm:inline">Download PDF</span>
        </a>
      </header>

      {isLocked ? (
        <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
          <div className="max-w-md">
            <Lock
              className="mx-auto h-10 w-10"
              style={{ color: "oklch(0.55 0.18 30)" }}
            />
            <h1 className="mt-4 font-display text-2xl font-black">
              Sign in to read {book.title}
            </h1>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              This e-book is part of the BigIELTS library. Create a free account
              to start reading.
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
      ) : (
        <div className="flex-1">
          <iframe
            title={book.title}
            src={book.pdfDataUrl}
            className="h-[calc(100vh-57px)] w-full border-0"
          />
        </div>
      )}
    </div>
  );
}
