// Client-only react-pdf renderer. Lazy-loaded from PdfReaderView so pdf.js
// (which references DOMMatrix at module load) never runs on the server.
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
}

type Props = {
  file: string;
  numPages: number;
  pageWidth: number;
  theme: "light" | "sepia" | "dark";
  onLoadSuccess: (info: { numPages: number }) => void;
  loadingNode: React.ReactNode;
  errorNode: React.ReactNode;
};

export default function PdfPagesScroller({
  file,
  numPages,
  pageWidth,
  theme,
  onLoadSuccess,
  loadingNode,
  errorNode,
}: Props) {
  return (
    <Document
      file={file}
      onLoadSuccess={onLoadSuccess}
      loading={loadingNode}
      error={errorNode}
      className="flex"
    >
      {Array.from({ length: numPages }, (_, i) => (
        <div
          key={i}
          className="flex shrink-0 snap-center snap-always items-center justify-center"
          style={{ width: pageWidth, height: "100dvh" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Page
            pageNumber={i + 1}
            width={pageWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<div style={{ width: pageWidth, height: "70vh" }} />}
            canvasBackground={theme === "dark" ? "#1b1b22" : "#ffffff"}
            className="shadow-[0_8px_30px_-12px_oklch(0_0_0/0.35)]"
          />
        </div>
      ))}
    </Document>
  );
}
