// Friendly list editor for a single question type (one category key)
// inside a Record<string, Item[]> CMS section.
//
// Used for:
//   • Writing prompts (Item = string)
//   • Speaking topics (Item = { id, label })
//
// Scoping to a single category means an admin sees ONLY the prompts for the
// question type they picked from the nav — not the whole JSON blob.

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, GripVertical, Pencil, X, Check, AlertCircle, FileText, ChevronDown } from "lucide-react";
import { EditorShell } from "@/components/admin/EditorShell";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCmsEditor, useCmsSection } from "@/lib/admin/cms-store";
import { WritingAnswerEditor } from "@/components/admin/WritingAnswerEditor";
import {
  WRITING_ANSWERS_KEY,
  WRITING_ANSWERS_DEFAULT,
  type WritingAnswersOverrides,
} from "@/lib/admin/writing-answers";
import { sampleAnswers } from "@/data/sample-answers";

// ───────── Generic prompt list editor ─────────

type StringListEditorProps = {
  title: string;
  description: string;
  /** Path: e.g. "Content > Academic > Writing > Task 2 > Opinion Essay" */
  breadcrumb: string[];
  /** CMS storage key for the WHOLE record (e.g. WRITING_PROMPTS_KEY). */
  storageKey: string;
  /** The category key inside the record this editor manages. */
  categoryKey: string;
  /** Default value for the entire record (so missing keys still work). */
  defaultRecord: Record<string, string[]>;
  /** Placeholder for the new-item textarea. */
  placeholder?: string;
  /** When true, each row gets an "Edit answer" toggle that opens the WritingAnswerEditor. */
  enableAnswers?: boolean;
};

export function PromptListEditor({
  title,
  description,
  breadcrumb,
  storageKey,
  categoryKey,
  defaultRecord,
  placeholder = "Type a new prompt…",
  enableAnswers = false,
}: StringListEditorProps) {
  const { value: record, update, reset } = useCmsEditor<Record<string, string[]>>(
    storageKey,
    defaultRecord,
  );
  const answerOverrides = useCmsSection<WritingAnswersOverrides>(
    WRITING_ANSWERS_KEY,
    WRITING_ANSWERS_DEFAULT,
  );
  const original = useMemo(() => record[categoryKey] ?? [], [record, categoryKey]);
  const [items, setItems] = useState<string[]>(original);
  const [draft, setDraft] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [openAnswerIndex, setOpenAnswerIndex] = useState<number | null>(null);

  // Re-sync local state if the underlying record changes (e.g. import).
  useEffect(() => {
    setItems(record[categoryKey] ?? []);
    setEditingIndex(null);
  }, [record, categoryKey]);

  const isDirty = JSON.stringify(items) !== JSON.stringify(original);

  const save = () => {
    update({ ...record, [categoryKey]: items });
  };

  const onReset = () => {
    setItems(defaultRecord[categoryKey] ?? []);
  };

  const addItem = () => {
    const text = draft.trim();
    if (!text) return;
    setItems((prev) => [...prev, text]);
    setDraft("");
  };

  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditValue(items[i]);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const text = editValue.trim();
    if (!text) return;
    setItems((prev) => prev.map((p, i) => (i === editingIndex ? text : p)));
    setEditingIndex(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <EditorShell
      title={title}
      description={description}
      isDirty={isDirty}
      onSave={save}
      onReset={() => {
        onReset();
        // also clear the saved override so default truly comes back
        reset();
      }}
    >
      <Breadcrumb path={breadcrumb} count={items.length} unit="prompts" />

      {/* Add new */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Add a new prompt
        </div>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="bg-background"
        />
        <div className="mt-2 flex justify-end">
          <Button size="sm" onClick={addItem} disabled={!draft.trim()}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add prompt
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            All prompts
          </div>
          {items.length === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" />
              No prompts yet
            </div>
          )}
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => {
            const editing = editingIndex === i;
            const answerOpen = openAnswerIndex === i;
            const questionId = `${categoryKey}-${i + 1}`;
            const hasOverride = !!answerOverrides[questionId];
            const hasDefault = !!sampleAnswers[questionId];
            const answerStatus: "custom" | "default" | "missing" = hasOverride
              ? "custom"
              : hasDefault
              ? "default"
              : "missing";
            return (
              <li key={i} className="space-y-2">
                <div className="group flex items-start gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/20">
                  <ReorderHandle
                    index={i}
                    total={items.length}
                    onUp={() => move(i, -1)}
                    onDown={() => move(i, 1)}
                  />
                  <div className="min-w-0 flex-1">
                    {editing ? (
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        rows={3}
                        autoFocus
                      />
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                          <span className="mr-2 inline-flex h-5 w-6 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
                            {i + 1}
                          </span>
                          {item}
                        </p>
                        {enableAnswers && (
                          <AnswerStatusBadge status={answerStatus} />
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                    {editing ? (
                      <>
                        <Button size="icon" variant="ghost" onClick={commitEdit} title="Save">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingIndex(null)}
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {enableAnswers && (
                          <Button
                            size="sm"
                            variant={answerOpen ? "default" : "outline"}
                            onClick={() =>
                              setOpenAnswerIndex((cur) => (cur === i ? null : i))
                            }
                            title={answerOpen ? "Hide answer editor" : "Edit model answer"}
                          >
                            <FileText className="mr-1.5 h-3.5 w-3.5" />
                            Answer
                            <ChevronDown
                              className={`ml-1 h-3 w-3 transition-transform ${
                                answerOpen ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => startEdit(i)} title="Edit prompt">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(i)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {enableAnswers && answerOpen && (
                  <WritingAnswerEditor
                    questionId={questionId}
                    questionTitle={item}
                    onClose={() => setOpenAnswerIndex(null)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </EditorShell>
  );
}

// ───────── Topic list editor (Speaking) ─────────

export type TopicItem = { id: string; label: string };

type TopicListEditorProps = {
  title: string;
  description: string;
  breadcrumb: string[];
  storageKey: string;
  categoryKey: string;
  defaultRecord: Record<string, TopicItem[]>;
};

export function TopicListEditor({
  title,
  description,
  breadcrumb,
  storageKey,
  categoryKey,
  defaultRecord,
}: TopicListEditorProps) {
  const { value: record, update, reset } = useCmsEditor<Record<string, TopicItem[]>>(
    storageKey,
    defaultRecord,
  );
  const original = useMemo(() => record[categoryKey] ?? [], [record, categoryKey]);
  const [items, setItems] = useState<TopicItem[]>(original);
  const [draftLabel, setDraftLabel] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");

  useEffect(() => {
    setItems(record[categoryKey] ?? []);
    setEditingIndex(null);
  }, [record, categoryKey]);

  const isDirty = JSON.stringify(items) !== JSON.stringify(original);

  const slugify = (label: string) =>
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const ensureUniqueId = (id: string, ignoreIndex?: number) => {
    const existing = new Set(
      items.filter((_, i) => i !== ignoreIndex).map((t) => t.id),
    );
    let candidate = id || "topic";
    let n = 2;
    while (existing.has(candidate)) candidate = `${id}-${n++}`;
    return candidate;
  };

  const addItem = () => {
    const label = draftLabel.trim();
    if (!label) return;
    const id = ensureUniqueId(slugify(label));
    setItems((prev) => [...prev, { id, label }]);
    setDraftLabel("");
  };

  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditLabel(items[i].label);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const label = editLabel.trim();
    if (!label) return;
    setItems((prev) =>
      prev.map((t, i) => (i === editingIndex ? { id: t.id, label } : t)),
    );
    setEditingIndex(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const save = () => update({ ...record, [categoryKey]: items });

  return (
    <EditorShell
      title={title}
      description={description}
      isDirty={isDirty}
      onSave={save}
      onReset={() => {
        setItems(defaultRecord[categoryKey] ?? []);
        reset();
      }}
    >
      <Breadcrumb path={breadcrumb} count={items.length} unit="topics" />

      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Add a new topic
        </div>
        <div className="flex gap-2">
          <Input
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            placeholder="e.g. A Memorable Trip"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
            className="bg-background"
          />
          <Button onClick={addItem} disabled={!draftLabel.trim()}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          A URL-friendly id is generated automatically from the label.
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          All topics
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item, i) => {
            const editing = editingIndex === i;
            return (
              <li
                key={item.id}
                className="group flex items-center gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/20"
              >
                <ReorderHandle
                  index={i}
                  total={items.length}
                  onUp={() => move(i, -1)}
                  onDown={() => move(i, 1)}
                />
                <div className="min-w-0 flex-1">
                  {editing ? (
                    <Input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") setEditingIndex(null);
                      }}
                    />
                  ) : (
                    <>
                      <div className="truncate text-sm font-semibold text-foreground">
                        {item.label}
                      </div>
                      <div className="truncate text-[11px] font-mono text-muted-foreground">
                        {item.id}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                  {editing ? (
                    <>
                      <Button size="icon" variant="ghost" onClick={commitEdit}>
                        <Check className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingIndex(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(i)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => removeItem(i)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </EditorShell>
  );
}

// ───────── Shared bits ─────────

function Breadcrumb({
  path,
  count,
  unit,
}: {
  path: string[];
  count: number;
  unit: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2">
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {path.map((seg, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className={
                i === path.length - 1
                  ? "font-bold text-foreground"
                  : "text-muted-foreground"
              }
            >
              {seg}
            </span>
            {i < path.length - 1 && <span className="text-muted-foreground/50">›</span>}
          </span>
        ))}
      </div>
      <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
        {count} {unit}
      </span>
    </div>
  );
}

function ReorderHandle({
  index,
  total,
  onUp,
  onDown,
}: {
  index: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 pt-0.5 text-muted-foreground/60">
      <button
        type="button"
        onClick={onUp}
        disabled={index === 0}
        title="Move up"
        className="rounded p-0.5 hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <GripVertical className="h-3 w-3 -rotate-90" />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={index === total - 1}
        title="Move down"
        className="rounded p-0.5 hover:bg-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <GripVertical className="h-3 w-3 rotate-90" />
      </button>
    </div>
  );
}
