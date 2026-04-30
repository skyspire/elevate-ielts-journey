// Generic file picker that emits a base64 data-URL.
// Used for uploading PDFs (and other binary docs) without a backend.
//
// IMPORTANT: localStorage caps total site storage at ~5MB on most browsers.
// We hard-cap at 3MB per file to keep the editor usable, but if you start
// uploading multiple PDFs the editor will eventually fail to save. For real
// production use, switch this to Lovable Cloud Storage.

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, X, FileText } from "lucide-react";

type Props = {
  value?: string;
  fileName?: string;
  sizeBytes?: number;
  onChange: (data: { dataUrl: string; fileName: string; sizeBytes: number } | undefined) => void;
  label?: string;
  hint?: string;
  /** Hard cap in KB. Default 3072 (3 MB). */
  maxKb?: number;
  /** File MIME or extension filter passed to <input accept>. */
  accept?: string;
};

function fmtSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileUploader({
  value,
  fileName,
  sizeBytes,
  onChange,
  label = "File",
  hint = "PDF up to 3 MB. Stored in this browser only — for real ebooks, enable Lovable Cloud Storage.",
  maxKb = 3072,
  accept = "application/pdf,.pdf",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = (file: File) => {
    setError(null);
    const kb = Math.round(file.size / 1024);
    if (kb > maxKb) {
      const mb = (maxKb / 1024).toFixed(1);
      setError(
        `File is ${(file.size / (1024 * 1024)).toFixed(2)} MB — please choose one under ${mb} MB. For larger PDFs, ask to enable Lovable Cloud Storage.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onChange({ dataUrl: result, fileName: file.name, sizeBytes: file.size });
      }
    };
    reader.onerror = () => setError("Could not read this file. Try another one.");
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive hover:underline"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-foreground/5 text-foreground">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{fileName ?? "Uploaded file"}</p>
            <p className="text-xs text-muted-foreground">{fmtSize(sizeBytes)} · stored inline</p>
            <a
              href={value}
              download={fileName}
              className="mt-1 inline-block text-xs font-semibold text-primary hover:underline"
            >
              Download
            </a>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <FileUp className="h-6 w-6" />
          <span className="font-semibold">Click to upload</span>
          <span className="text-xs">{hint}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />

      {error && <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p>}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="mt-2 w-full"
      >
        {value ? "Replace file" : "Choose file"}
      </Button>
    </div>
  );
}
