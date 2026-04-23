// Image picker that emits a base64 data-URL.
// Used for Writing Task 1 question images (charts, maps) so admins can upload
// without a backend. Hard cap at ~600KB to keep localStorage viable.

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X } from "lucide-react";

type Props = {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
  hint?: string;
  maxKb?: number;
};

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  hint = "PNG / JPG up to 600KB. Stored inline (base64).",
  maxKb = 600,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setError(null);
    const kb = Math.round(file.size / 1024);
    if (kb > maxKb) {
      setError(`File is ${kb}KB — please choose one under ${maxKb}KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") onChange(result);
    };
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
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <img src={value} alt="Question reference" className="block max-h-64 w-full object-contain" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <ImageIcon className="h-6 w-6" />
          <span className="font-semibold">Click to upload</span>
          <span className="text-xs">{hint}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p>
      )}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="mt-2 w-full"
      >
        {value ? "Replace image" : "Choose image"}
      </Button>
    </div>
  );
}
