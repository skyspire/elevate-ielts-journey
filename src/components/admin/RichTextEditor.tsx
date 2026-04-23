// Quill-based rich text editor. Lazy-loaded on client only — Quill touches
// `document` at import time and would crash SSR otherwise.
//
// Renders to/from HTML strings. Stored alongside paragraph body so the existing
// data shape stays compatible (a plain-text fallback is generated for word count).

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Approximate min height in px */
  minHeight?: number;
};

const TOOLBAR = [
  [{ header: [false, 2, 3] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ color: [] as string[] }, { background: [] as string[] }],
  ["blockquote", "link"],
  ["clean"],
];

export function RichTextEditor({ value, onChange, placeholder, minHeight = 200 }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      // Lazy-load Quill + its CSS only on client.
      const [{ default: Quill }] = await Promise.all([
        import("quill"),
        import("quill/dist/quill.snow.css"),
      ]);
      if (cancelled || !editorRef.current) return;

      const q = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: { toolbar: TOOLBAR },
      });
      quillRef.current = q;
      // Seed initial value
      if (value) {
        q.clipboard.dangerouslyPasteHTML(value);
      }
      const handler = () => {
        const html = editorRef.current?.querySelector(".ql-editor")?.innerHTML ?? "";
        // Treat Quill's empty placeholder as ""
        if (html === "<p><br></p>") {
          onChange("");
        } else {
          onChange(html);
        }
      };
      q.on("text-change", handler);
      cleanup = () => q.off("text-change", handler);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      quillRef.current = null;
    };
    // We deliberately only init once; value sync is one-way (component owns the source).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If parent resets value (e.g. revert), push it into Quill.
  useEffect(() => {
    const q = quillRef.current as { root: HTMLElement; clipboard: { dangerouslyPasteHTML(html: string): void } } | null;
    if (!q || !ready) return;
    const current = q.root.innerHTML;
    const incoming = value || "";
    if (current !== incoming && current !== "<p><br></p>" + "" && incoming !== current) {
      // Avoid jitter: only update if meaningfully different.
      if (incoming.trim() === "" && (current === "<p><br></p>" || current === "")) return;
      q.root.innerHTML = "";
      if (incoming) q.clipboard.dangerouslyPasteHTML(incoming);
    }
  }, [value, ready]);

  return (
    <div ref={wrapperRef} className="rich-text-editor rounded-md border border-input bg-background">
      <div ref={editorRef} style={{ minHeight }} />
      {!ready && (
        <div className="px-3 py-6 text-xs text-muted-foreground">Loading editor…</div>
      )}
    </div>
  );
}

/** Strip HTML tags for plain-text word counting. */
export function htmlToText(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
}

export function countWords(html: string): number {
  return htmlToText(html).split(/\s+/).filter(Boolean).length;
}
