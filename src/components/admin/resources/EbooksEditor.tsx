// Full-control E-books library editor.
// Replaces the raw JSON editor.
//
// Features:
//   • List view with cover preview, title/category/status, file size
//   • Add new, edit, delete, duplicate, drag-to-reorder (up/down buttons)
//   • Bulk actions: publish / unpublish / delete / category change
//   • Per-ebook form: all metadata, cover image upload, PDF upload,
//     marketing fields (tagline, what's-inside, featured, isNew),
//     status, publish date, price, SEO fields
//
// Storage: localStorage via cms-store. PDFs are capped at 3 MB each because
// localStorage has a hard ~5 MB total cap. For real production use, the user
// should switch to Lovable Cloud Storage.

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  X,
  FileText,
  Star,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/admin/EditorShell";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FileUploader } from "@/components/admin/FileUploader";
import { useCmsEditor } from "@/lib/admin/cms-store";
import {
  EBOOKS_KEY,
  EBOOKS_DEFAULT,
  blankEbook,
  resolveEbooks,
  type EbooksStore,
} from "@/lib/admin/ebooks-store";
import type { Ebook, EbookCategory } from "@/data/ebooks";
import { logActivity } from "@/lib/admin/activity-log";

const CATEGORIES: EbookCategory[] = [
  "Writing",
  "Speaking",
  "Reading",
  "Listening",
  "Vocabulary",
  "Grammar",
];

export function EbooksEditor() {
  const { value: store, update, reset } = useCmsEditor<EbooksStore>(
    EBOOKS_KEY,
    EBOOKS_DEFAULT,
  );

  const list = useMemo(() => resolveEbooks(store), [store]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Ebook | null>(null);
  const [editingIsNew, setEditingIsNew] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Helpers
  const isCustom = (id: string) => store.custom.some((c) => c.id === id);
  const isHidden = (id: string) => store.hidden.includes(id);

  const persist = (next: EbooksStore, message: string) => {
    try {
      update(next);
      setStorageWarning(null);
      logActivity({
        kind: "prompt-edited",
        message,
        area: "Content / Resources / E-books",
      });
    } catch (err) {
      setStorageWarning(
        "Browser storage is full. Remove a PDF or switch to Lovable Cloud Storage.",
      );
      console.error(err);
    }
  };

  // ───────── Mutations ─────────

  const openNew = () => {
    setEditing(blankEbook());
    setEditingIsNew(true);
  };

  const openEdit = (book: Ebook) => {
    setEditing(structuredClone(book));
    setEditingIsNew(false);
  };

  const saveEdit = () => {
    if (!editing) return;
    if (editingIsNew) {
      persist(
        { ...store, custom: [...store.custom, editing] },
        `Created e-book "${editing.title}"`,
      );
    } else if (isCustom(editing.id)) {
      persist(
        {
          ...store,
          custom: store.custom.map((c) => (c.id === editing.id ? editing : c)),
        },
        `Updated e-book "${editing.title}"`,
      );
    } else {
      persist(
        {
          ...store,
          overrides: { ...store.overrides, [editing.id]: editing },
        },
        `Updated e-book "${editing.title}"`,
      );
    }
    setEditing(null);
  };

  const deleteOne = (id: string) => {
    if (!confirm("Delete this ebook? This cannot be undone.")) return;
    if (isCustom(id)) {
      persist(
        { ...store, custom: store.custom.filter((c) => c.id !== id) },
        "Deleted e-book",
      );
    } else {
      // Default ebooks can't be removed from source — hide them instead.
      persist(
        { ...store, hidden: [...new Set([...store.hidden, id])] },
        "Hid default e-book",
      );
    }
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const restoreHidden = (id: string) => {
    persist(
      { ...store, hidden: store.hidden.filter((x) => x !== id) },
      "Restored hidden e-book",
    );
  };

  const duplicate = (book: Ebook) => {
    const copy: Ebook = {
      ...structuredClone(book),
      id: `ebook-${Date.now().toString(36)}`,
      title: `${book.title} (copy)`,
      status: "draft",
    };
    persist(
      { ...store, custom: [...store.custom, copy] },
      `Duplicated e-book "${book.title}"`,
    );
  };

  const move = (id: string, dir: -1 | 1) => {
    const ids = list.map((b) => b.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    persist({ ...store, order: ids }, "Reordered e-books");
  };

  const setStatus = (id: string, status: "draft" | "published") => {
    const book = list.find((b) => b.id === id);
    if (!book) return;
    if (isCustom(id)) {
      persist(
        {
          ...store,
          custom: store.custom.map((c) => (c.id === id ? { ...c, status } : c)),
        },
        `${status === "published" ? "Published" : "Unpublished"} "${book.title}"`,
      );
    } else {
      persist(
        {
          ...store,
          overrides: {
            ...store.overrides,
            [id]: { ...store.overrides[id], status },
          },
        },
        `${status === "published" ? "Published" : "Unpublished"} "${book.title}"`,
      );
    }
  };

  // ───────── Bulk actions ─────────

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () =>
    setSelected(selected.size === list.length ? new Set() : new Set(list.map((b) => b.id)));

  const bulkSetStatus = (status: "draft" | "published") => {
    const next: EbooksStore = { ...store };
    for (const id of selected) {
      if (isCustom(id)) {
        next.custom = next.custom.map((c) => (c.id === id ? { ...c, status } : c));
      } else {
        next.overrides = {
          ...next.overrides,
          [id]: { ...next.overrides[id], status },
        };
      }
    }
    persist(next, `Bulk ${status} of ${selected.size} e-books`);
    setSelected(new Set());
  };

  const bulkDelete = () => {
    if (!confirm(`Delete ${selected.size} e-book(s)? This cannot be undone.`)) return;
    const next: EbooksStore = { ...store };
    for (const id of selected) {
      if (isCustom(id)) {
        next.custom = next.custom.filter((c) => c.id !== id);
      } else {
        next.hidden = [...new Set([...next.hidden, id])];
      }
    }
    persist(next, `Bulk deleted ${selected.size} e-books`);
    setSelected(new Set());
  };

  const bulkSetCategory = (category: EbookCategory) => {
    const next: EbooksStore = { ...store };
    for (const id of selected) {
      if (isCustom(id)) {
        next.custom = next.custom.map((c) => (c.id === id ? { ...c, category } : c));
      } else {
        next.overrides = {
          ...next.overrides,
          [id]: { ...next.overrides[id], category },
        };
      }
    }
    persist(next, `Bulk set category "${category}" on ${selected.size} e-books`);
    setSelected(new Set());
  };

  // ───────── Render ─────────

  const totalSize = useMemo(() => {
    return list.reduce((n, b) => n + (b.pdfSizeBytes ?? 0) + estimateImageBytes(b.coverImageDataUrl), 0);
  }, [list]);

  return (
    <div className="space-y-4">
      {/* Header / toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div>
          <h2 className="font-display text-lg font-extrabold">E-book library</h2>
          <p className="text-xs text-muted-foreground">
            {list.length} ebooks · {(totalSize / (1024 * 1024)).toFixed(2)} MB stored in browser
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset all
          </Button>
          <Button size="sm" onClick={openNew}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> New e-book
          </Button>
        </div>
      </div>

      {/* Storage warning */}
      <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong>Heads up:</strong> e-books are stored in this browser only.
          PDFs are capped at 3 MB each and the total site storage is ~5 MB.
          For real production use with full-size PDFs, ask to enable
          Lovable Cloud Storage.
        </div>
      </div>

      {storageWarning && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{storageWarning}</div>
        </div>
      )}

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-foreground/5 p-3">
          <span className="text-xs font-bold">{selected.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => bulkSetStatus("published")}>
            <Eye className="mr-1.5 h-3.5 w-3.5" /> Publish
          </Button>
          <Button size="sm" variant="outline" onClick={() => bulkSetStatus("draft")}>
            <EyeOff className="mr-1.5 h-3.5 w-3.5" /> Unpublish
          </Button>
          <select
            onChange={(e) => {
              if (e.target.value) {
                bulkSetCategory(e.target.value as EbookCategory);
                e.target.value = "";
              }
            }}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold"
            defaultValue=""
          >
            <option value="" disabled>
              Set category…
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button size="sm" variant="outline" onClick={bulkDelete}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
          </Button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      )}

      {/* List */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <input
            type="checkbox"
            checked={selected.size === list.length && list.length > 0}
            onChange={selectAll}
            className="h-4 w-4 rounded border-border"
          />
          <span className="flex-1">E-book</span>
          <span className="hidden w-24 text-right sm:inline">Category</span>
          <span className="hidden w-20 text-right sm:inline">PDF</span>
          <span className="w-20 text-right">Status</span>
          <span className="w-32 text-right">Actions</span>
        </div>
        {list.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No e-books yet. Click <strong>New e-book</strong> to add one.
          </div>
        )}
        {list.map((book, i) => {
          const status = book.status ?? "published";
          const checked = selected.has(book.id);
          return (
            <div
              key={book.id}
              className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/30"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleSelect(book.id)}
                className="h-4 w-4 rounded border-border"
              />

              {/* Cover thumb */}
              <div
                className="h-14 w-10 shrink-0 overflow-hidden rounded-sm shadow-sm"
                style={{ background: book.coverGradient }}
              >
                {book.coverImageDataUrl && (
                  <img
                    src={book.coverImageDataUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-bold">{book.title}</p>
                  {book.featured && <Star className="h-3 w-3 fill-amber-400 text-amber-500" />}
                  {book.isNew && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                      New
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {book.author} · {book.band}
                </p>
              </div>

              <span className="hidden w-24 truncate text-right text-xs font-semibold text-muted-foreground sm:inline">
                {book.category}
              </span>

              <span className="hidden w-20 truncate text-right text-xs font-semibold text-muted-foreground sm:inline">
                {book.pdfDataUrl ? (
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {fmtBytes(book.pdfSizeBytes)}
                  </span>
                ) : (
                  <span className="text-amber-600">No PDF</span>
                )}
              </span>

              <span className="w-20 text-right">
                <span
                  className={
                    status === "published"
                      ? "rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700"
                      : "rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  }
                >
                  {status}
                </span>
              </span>

              <div className="flex w-32 items-center justify-end gap-0.5">
                <IconBtn label="Move up" onClick={() => move(book.id, -1)} disabled={i === 0}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn
                  label="Move down"
                  onClick={() => move(book.id, 1)}
                  disabled={i === list.length - 1}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Duplicate" onClick={() => duplicate(book)}>
                  <Copy className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Edit" onClick={() => openEdit(book)}>
                  <Pencil className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Delete" onClick={() => deleteOne(book.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconBtn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden default ebooks */}
      {store.hidden.length > 0 && (
        <div className="rounded-xl border border-dashed border-border p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Hidden defaults
          </p>
          <div className="flex flex-wrap gap-2">
            {store.hidden.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => restoreHidden(id)}
                className="rounded-full bg-muted px-3 py-1 text-xs font-semibold hover:bg-foreground hover:text-background"
              >
                Restore {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit dialog */}
      {editing && (
        <EbookFormDialog
          book={editing}
          isNew={editingIsNew}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

// ───────── Helpers ─────────

function fmtBytes(bytes?: number) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function estimateImageBytes(dataUrl?: string) {
  if (!dataUrl) return 0;
  // base64 expands by ~4/3 — reverse it for an estimate.
  return Math.round((dataUrl.length * 3) / 4);
}

function IconBtn({
  children,
  onClick,
  label,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

// ───────── Per-ebook form ─────────

function EbookFormDialog({
  book,
  isNew,
  onChange,
  onCancel,
  onSave,
}: {
  book: Ebook;
  isNew: boolean;
  onChange: (b: Ebook) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const [tab, setTab] = useState<"details" | "files" | "marketing" | "publishing" | "seo">("details");
  const set = <K extends keyof Ebook>(k: K, v: Ebook[K]) => onChange({ ...book, [k]: v });

  // What's-inside list helpers
  const [bullet, setBullet] = useState("");
  const addBullet = () => {
    const t = bullet.trim();
    if (!t) return;
    set("whatsInside", [...(book.whatsInside ?? []), t]);
    setBullet("");
  };
  const removeBullet = (i: number) => {
    set("whatsInside", (book.whatsInside ?? []).filter((_, idx) => idx !== i));
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "New e-book" : `Edit “${book.title}”`}</DialogTitle>
          <DialogDescription>
            Manage every field for this ebook. Switch tabs for files, marketing, publishing & SEO.
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {(["details", "files", "marketing", "publishing", "seo"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={
                tab === t
                  ? "rounded-md bg-foreground px-3 py-1.5 text-xs font-bold capitalize text-background"
                  : "rounded-md px-3 py-1.5 text-xs font-semibold capitalize text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* DETAILS */}
        {tab === "details" && (
          <div className="space-y-3 pt-2">
            <Field label="Title">
              <Input value={book.title} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Subtitle">
              <Input value={book.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Author">
                <Input value={book.author} onChange={(e) => set("author", e.target.value)} />
              </Field>
              <Field label="Band">
                <Input
                  value={book.band}
                  onChange={(e) => set("band", e.target.value)}
                  placeholder="e.g. Band 7–9"
                />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Category">
                <select
                  value={book.category}
                  onChange={(e) => set("category", e.target.value as EbookCategory)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Page count">
                <Input
                  type="number"
                  value={book.pageCount}
                  onChange={(e) => set("pageCount", parseInt(e.target.value || "0", 10))}
                />
              </Field>
            </div>
            <Field label="Description" hint="Shown on the book detail / library card.">
              <Textarea
                value={book.description}
                onChange={(e) => set("description", e.target.value)}
                rows={5}
              />
            </Field>
          </div>
        )}

        {/* FILES */}
        {tab === "files" && (
          <div className="space-y-4 pt-2">
            <ImageUploader
              label="Cover image"
              hint="JPG/PNG up to 600 KB. Replaces the gradient on the library card."
              value={book.coverImageDataUrl}
              onChange={(v) => set("coverImageDataUrl", v)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Cover gradient (CSS)" hint="Used when no cover image is uploaded.">
                <Input
                  value={book.coverGradient}
                  onChange={(e) => set("coverGradient", e.target.value)}
                />
              </Field>
              <Field label="Cover accent (oklch)">
                <Input
                  value={book.coverAccent}
                  onChange={(e) => set("coverAccent", e.target.value)}
                />
              </Field>
            </div>

            <FileUploader
              label="PDF file"
              value={book.pdfDataUrl}
              fileName={book.pdfFileName}
              sizeBytes={book.pdfSizeBytes}
              onChange={(d) => {
                if (!d) {
                  onChange({
                    ...book,
                    pdfDataUrl: undefined,
                    pdfFileName: undefined,
                    pdfSizeBytes: undefined,
                  });
                } else {
                  onChange({
                    ...book,
                    pdfDataUrl: d.dataUrl,
                    pdfFileName: d.fileName,
                    pdfSizeBytes: d.sizeBytes,
                  });
                }
              }}
            />

            <Field label="Free preview pages" hint="How many PDF pages are unlocked before the paywall.">
              <Input
                type="number"
                value={book.freePages}
                onChange={(e) => set("freePages", parseInt(e.target.value || "0", 10))}
              />
            </Field>
          </div>
        )}

        {/* MARKETING */}
        {tab === "marketing" && (
          <div className="space-y-3 pt-2">
            <Field label="Tagline" hint="Short sales line shown above the description.">
              <Input
                value={book.tagline ?? ""}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="e.g. The fastest path to a Band 8 essay."
              />
            </Field>

            <Field label="What's inside" hint="Bullet list shown on the detail page.">
              <div className="space-y-2">
                {(book.whatsInside ?? []).map((b, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2">
                    <span className="flex-1 text-sm">{b}</span>
                    <button
                      type="button"
                      onClick={() => removeBullet(i)}
                      className="text-destructive hover:underline"
                      aria-label="Remove bullet"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={bullet}
                    onChange={(e) => setBullet(e.target.value)}
                    placeholder="Add a bullet…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBullet();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={addBullet}>
                    Add
                  </Button>
                </div>
              </div>
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <SwitchRow
                icon={<Star className="h-4 w-4" />}
                label="Featured"
                description="Pin to the top of the library."
                checked={!!book.featured}
                onChange={(v) => set("featured", v)}
              />
              <SwitchRow
                icon={<Sparkles className="h-4 w-4" />}
                label="Mark as new"
                description="Adds a NEW badge for two weeks."
                checked={!!book.isNew}
                onChange={(v) => set("isNew", v)}
              />
            </div>

            <Field label="Sort order" hint="Lower numbers appear first. Manual reorder overrides this.">
              <Input
                type="number"
                value={book.sortOrder ?? 0}
                onChange={(e) => set("sortOrder", parseInt(e.target.value || "0", 10))}
              />
            </Field>
          </div>
        )}

        {/* PUBLISHING */}
        {tab === "publishing" && (
          <div className="space-y-3 pt-2">
            <SwitchRow
              icon={<Eye className="h-4 w-4" />}
              label="Published"
              description="When off, this ebook is a draft and hidden from the public library."
              checked={(book.status ?? "published") === "published"}
              onChange={(v) => set("status", v ? "published" : "draft")}
            />
            <Field label="Publish date">
              <Input
                type="date"
                value={book.publishedAt?.slice(0, 10) ?? ""}
                onChange={(e) => set("publishedAt", e.target.value)}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Price" hint="0 = free.">
                <Input
                  type="number"
                  step="0.01"
                  value={book.price ?? 0}
                  onChange={(e) => set("price", parseFloat(e.target.value || "0"))}
                />
              </Field>
              <Field label="Currency">
                <Input
                  value={book.currency ?? "USD"}
                  onChange={(e) => set("currency", e.target.value)}
                  placeholder="USD"
                />
              </Field>
            </div>
          </div>
        )}

        {/* SEO */}
        {tab === "seo" && (
          <div className="space-y-3 pt-2">
            <Field label="SEO title" hint="Used in <title> on the public detail page.">
              <Input
                value={book.seoTitle ?? ""}
                onChange={(e) => set("seoTitle", e.target.value)}
                placeholder={book.title}
              />
            </Field>
            <Field
              label="SEO description"
              hint="Meta description (≤160 characters) for search engines & link previews."
            >
              <Textarea
                value={book.seoDescription ?? ""}
                onChange={(e) => set("seoDescription", e.target.value)}
                rows={3}
              />
            </Field>
          </div>
        )}

        <div className="mt-2 flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSave}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> {isNew ? "Create" : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SwitchRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-muted-foreground">{icon}</span>
        <div>
          <div className="text-sm font-bold">{label}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
