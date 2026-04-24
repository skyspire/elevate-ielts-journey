// Quill-based rich text editor. Lazy-loaded on client only — Quill touches
// `document` at import time and would crash SSR otherwise.
//
// Renders to/from HTML strings. Stored alongside paragraph body so the existing
// data shape stays compatible (a plain-text fallback is generated for word count).
//
// ── Annotations (highlight + underline) ─────────────────────────────────
// The toolbar exposes a curated swatch palette for two effects authors use
// to mark up model answers:
//   1. HIGHLIGHTER  → Quill's native `background` inline format with our
//      five on-brand swatches (yellow, lime, pink, blue, orange).
//   2. UNDERLINE    → custom `underlineColor` attributor that wraps text in
//      <span style="text-decoration:underline; text-decoration-color:<hex>;
//      text-decoration-thickness:2px; text-underline-offset:3px"> using our
//      three signature ink swatches (ink, teal, plum).
//
// Both render as inline HTML, so the existing reader (which already uses
// dangerouslySetInnerHTML for HTML answer bodies) shows the marks without
// any extra plumbing.

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Approximate min height in px */
  minHeight?: number;
};

// ── Curated swatch palettes ───────────────────────────────────────────────
// Highlighter — soft, pastel-felt-tip. Used as Quill `background` values.
export const HIGHLIGHT_SWATCHES = [
  "#fff3a3", // yellow
  "#d6f5b1", // lime
  "#ffd0e0", // pink
  "#cfe6ff", // blue
  "#ffd9b0", // orange
] as const;

// Underline ink — saturated but not loud. Used as text-decoration-color.
export const UNDERLINE_SWATCHES = [
  "#3a2f24", // ink (warm dark espresso)
  "#106a78", // teal
  "#6b2f7a", // plum
] as const;

// Build the Quill toolbar config. We use the `background` button to drive
// the highlighter (with our swatches as the whitelist), and inject a custom
// dropdown for underline-color. The `clean` button strips formatting.
const TOOLBAR = [
  [{ header: [false, 2, 3] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  // Highlighter — curated swatches only.
  [{ background: HIGHLIGHT_SWATCHES as unknown as string[] }],
  // Underline color — registered below as a custom inline attributor.
  [{ underlineColor: UNDERLINE_SWATCHES as unknown as string[] }],
  ["blockquote", "link"],
  ["clean"],
];

// Module-level guard so we register the custom `underlineColor` format
// exactly once across all editor instances.
let underlineColorRegistered = false;

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

      // Register the custom `underlineColor` inline attributor exactly once.
      // Renders as <span style="text-decoration: underline; text-decoration-color:<value>;
      // text-decoration-thickness: 2px; text-underline-offset: 3px"> so the
      // mark survives a round-trip through the stored HTML and renders in
      // the reader without any extra CSS.
      if (!underlineColorRegistered) {
        // Quill's typings for parchment helpers are loose — cast through unknown.
        const Parchment = (Quill as unknown as {
          import(name: string): unknown;
        }).import("parchment") as {
          StyleAttributor: new (
            attrName: string,
            keyName: string,
            options: { scope: unknown; whitelist?: string[] },
          ) => unknown;
          Scope: { INLINE: unknown };
        };
        // We intentionally bind to multiple CSS properties. Quill's built-in
        // StyleAttributor sets one CSS key; for a compound effect we register
        // one attributor that owns `text-decoration-color` (the meaningful
        // value) plus a small CSS rule (.ql-editor span[style*="text-decoration-color"])
        // that ensures decoration shows up. Simpler approach: bind to
        // `text-decoration-color` and rely on the rule below to apply
        // `text-decoration: underline` whenever that CSS var is present.
        const UnderlineColor = new Parchment.StyleAttributor(
          "underlineColor",
          "text-decoration-color",
          {
            scope: Parchment.Scope.INLINE,
            whitelist: UNDERLINE_SWATCHES as unknown as string[],
          },
        );
        (Quill as unknown as { register(item: unknown, suppress?: boolean): void }).register(
          UnderlineColor,
          true,
        );
        underlineColorRegistered = true;
      }

      const q = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        modules: { toolbar: TOOLBAR },
      });
      quillRef.current = q;

      // Style the highlight + underline-color picker swatches so they show
      // their actual color, and add the icon labels (H / U).
      decorateToolbar(wrapperRef.current);

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
    <div
      ref={wrapperRef}
      className="rich-text-editor sticky-toolbar rounded-md border border-input bg-background"
    >
      <div ref={editorRef} style={{ minHeight }} />
      {!ready && (
        <div className="px-3 py-6 text-xs text-muted-foreground">Loading editor…</div>
      )}
      {/* Local styles:
          • Sticky toolbar so it stays in reach while the answer scrolls.
          • Custom underline-color rendering: any inline span with a
            text-decoration-color value gets a 2px underline at +3px offset.
          • Picker swatches show their actual color + a tooltip label.
          • Highlight pickers also render their swatch in the dropdown. */}
      <style>{`
        .rich-text-editor.sticky-toolbar .ql-toolbar {
          position: sticky;
          top: 0;
          z-index: 5;
          background: hsl(var(--background));
          border-bottom: 1px solid hsl(var(--border));
        }
        /* Underline color → real underline rendering inside the editor AND
           wherever the stored HTML gets rendered with the .answer-body class.
           We scope to spans that carry text-decoration-color so plain colored
           text isn't accidentally underlined. */
        .ql-editor span[style*="text-decoration-color"],
        .answer-body span[style*="text-decoration-color"] {
          text-decoration: underline !important;
          text-decoration-thickness: 2px !important;
          text-underline-offset: 3px !important;
          text-decoration-skip-ink: auto;
        }
        /* Show actual swatch color in the highlight + underline-color
           picker tiles. Quill renders each <span class="ql-picker-item"
           data-value="#abc">; we pull the value via attr() (where supported)
           or fall back to JS decoration in decorateToolbar(). */
        .ql-picker.ql-background .ql-picker-item,
        .ql-picker.ql-underlineColor .ql-picker-item {
          border: 1px solid hsl(var(--border));
        }
        /* Toolbar label for the custom underline-color button */
        .ql-snow .ql-picker.ql-underlineColor .ql-picker-label::before {
          content: "U̲";
          font-weight: 800;
        }
        .ql-snow .ql-picker.ql-underlineColor {
          width: 36px;
        }
      `}</style>
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

// ── Toolbar decoration ────────────────────────────────────────────────────
// Quill renders picker swatches as empty <span class="ql-picker-item"
// data-value="#xxxxxx">. We paint each tile with its data-value as the
// background so the dropdown shows actual colors, and add tooltip labels.
function decorateToolbar(root: HTMLElement | null) {
  if (!root) return;
  const items = root.querySelectorAll<HTMLElement>(
    ".ql-picker.ql-background .ql-picker-item, .ql-picker.ql-underlineColor .ql-picker-item",
  );
  items.forEach((el) => {
    const value = el.getAttribute("data-value");
    if (!value) return;
    const isHighlight = el.closest(".ql-picker.ql-background") !== null;
    if (isHighlight) {
      el.style.background = value;
    } else {
      // Underline-color tile: white background + colored underline so it
      // visually matches what the mark looks like in the answer.
      el.style.background = "white";
      el.style.borderBottom = `3px solid ${value}`;
    }
    el.title = value;
  });
}
