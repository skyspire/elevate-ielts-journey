// Friendly list editor for a single question type (one category key) inside a
// Record<string, Item[]> CMS section.
//
// Used for:
//   • Writing prompts (Item = string)   — PromptListEditor
//   • Speaking topics (Item = { id, label }) — TopicListEditor (unchanged)
//
// Advanced controls in PromptListEditor:
//   • Draft / Published per item with last-edited timestamp
//   • Duplicate (template) → inserts a copy below the source
//   • "View on site" link per prompt
//   • Per-item reset to default
//   • Last-10 version history with restore
//   • Diff vs default (modal)
//   • Inline rich-text answer editor + Task 1 image upload
//   • Activity log on every mutation

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Pencil,
  X,
  Check,
  AlertCircle,
  FileText,
  ChevronDown,
  Copy,
  ExternalLink,
  RotateCcw,
  History,
  GitCompare,
  Eye,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { EditorShell } from "@/components/admin/EditorShell";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCmsEditor, useCmsSection, getSection, setSection } from "@/lib/admin/cms-store";
import { WritingAnswerEditor } from "@/components/admin/WritingAnswerEditor";
import {
  WRITING_ANSWERS_KEY,
  WRITING_ANSWERS_DEFAULT,
  type WritingAnswersOverrides,
} from "@/lib/admin/writing-answers";
import { sampleAnswers } from "@/data/sample-answers";
import {
  PROMPT_META_KEY,
  PROMPT_META_DEFAULT,
  type PromptMetaStore,
  type PromptStatus,
  applyPromptChange,
  promptIdOf,
  timeAgo,
} from "@/lib/admin/prompt-meta";
import { logActivity } from "@/lib/admin/activity-log";
import { TextDiff } from "@/components/admin/TextDiff";

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
  /** When true, the answer editor shows a Task 1 image uploader. */
  showAnswerImage?: boolean;
  /** Optional preview link config — admin can open the public page for this prompt. */
  previewModule?: "academic" | "general";
  previewTask?: "task1" | "task2";
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
  showAnswerImage = false,
  previewModule = "academic",
  previewTask = "task2",
}: StringListEditorProps) {
  const { value: record, update, reset } = useCmsEditor<Record<string, string[]>>(
    storageKey,
    defaultRecord,
  );
  const answerOverrides = useCmsSection<WritingAnswersOverrides>(
    WRITING_ANSWERS_KEY,
    WRITING_ANSWERS_DEFAULT,
  );
  const metaStore = useCmsSection<PromptMetaStore>(PROMPT_META_KEY, PROMPT_META_DEFAULT);

  const original = useMemo(() => record[categoryKey] ?? [], [record, categoryKey]);
  const defaults = useMemo(() => defaultRecord[categoryKey] ?? [], [defaultRecord, categoryKey]);
  const [items, setItems] = useState<string[]>(original);
  const [draft, setDraft] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [openAnswerIndex, setOpenAnswerIndex] = useState<number | null>(null);
  const isTask1 = enableAnswers && showAnswerImage;

  // Modals
  const [diffFor, setDiffFor] = useState<{ index: number; current: string; original: string } | null>(null);
  const [historyFor, setHistoryFor] = useState<{ index: number; id: string } | null>(null);

  const areaPath = breadcrumb.join(" / ");

  useEffect(() => {
    setItems(record[categoryKey] ?? []);
    setEditingIndex(null);
  }, [record, categoryKey]);

  const isDirty = JSON.stringify(items) !== JSON.stringify(original);

  const persistMeta = (next: PromptMetaStore) => {
    setSection(PROMPT_META_KEY, next);
  };

  const save = () => {
    update({ ...record, [categoryKey]: items });
    logActivity({
      kind: "prompt-edited",
      message: `Saved ${items.length} prompt${items.length === 1 ? "" : "s"} in ${categoryKey}`,
      area: areaPath,
    });
  };

  const onReset = () => {
    setItems(defaults);
    logActivity({
      kind: "answer-reset",
      message: `Reset all prompts in ${categoryKey} to default`,
      area: areaPath,
    });
  };

  const addItem = () => {
    const text = draft.trim();
    if (!text) return;
    const newIndex = items.length;
    const next = [...items, text];
    setItems(next);
    setDraft("");
    // Persist the new item's meta entry immediately so timestamp is recorded.
    const id = promptIdOf(categoryKey, newIndex);
    persistMeta(
      applyPromptChange(getSection(PROMPT_META_KEY, PROMPT_META_DEFAULT), id, {
        snapshot: { prompt: text },
        action: "created",
      }),
    );
    logActivity({
      kind: "prompt-added",
      message: `Added prompt: "${truncate(text)}"`,
      area: areaPath,
    });
    // Task 1: jump straight into the answer editor so admin can upload the
    // chart/map image and write the model answer in one flow.
    if (isTask1) setOpenAnswerIndex(newIndex);
  };

  const removeItem = (i: number) => {
    const removed = items[i];
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    logActivity({
      kind: "prompt-deleted",
      message: `Deleted prompt: "${truncate(removed ?? "")}"`,
      area: areaPath,
    });
  };

  const duplicateItem = (i: number) => {
    setItems((prev) => {
      const next = [...prev];
      next.splice(i + 1, 0, `${prev[i]} (copy)`);
      return next;
    });
    logActivity({
      kind: "prompt-duplicated",
      message: `Duplicated prompt: "${truncate(items[i] ?? "")}"`,
      area: areaPath,
    });
  };

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditValue(items[i]);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const text = editValue.trim();
    if (!text) return;
    const id = promptIdOf(categoryKey, editingIndex);
    setItems((prev) => prev.map((p, i) => (i === editingIndex ? text : p)));
    persistMeta(
      applyPromptChange(getSection(PROMPT_META_KEY, PROMPT_META_DEFAULT), id, {
        snapshot: { prompt: text },
        action: "edited",
      }),
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

  const resetSinglePrompt = (i: number) => {
    if (i >= defaults.length) return;
    const id = promptIdOf(categoryKey, i);
    setItems((prev) => prev.map((p, idx) => (idx === i ? defaults[i] : p)));
    persistMeta(
      applyPromptChange(getSection(PROMPT_META_KEY, PROMPT_META_DEFAULT), id, {
        snapshot: { prompt: defaults[i] },
        action: "restored",
      }),
    );
    logActivity({
      kind: "answer-reset",
      message: `Reset prompt #${i + 1} to default`,
      area: areaPath,
    });
  };

  const setStatus = (i: number, status: PromptStatus) => {
    const id = promptIdOf(categoryKey, i);
    persistMeta(
      applyPromptChange(getSection(PROMPT_META_KEY, PROMPT_META_DEFAULT), id, {
        status,
        action: "status-changed",
      }),
    );
    logActivity({
      kind: "status-changed",
      message: `Marked prompt #${i + 1} as ${status}`,
      area: areaPath,
    });
  };

  const restoreFromHistory = (id: string, snapshot: { prompt: string }) => {
    const idx = parseInt(id.split("-").pop() || "0", 10) - 1;
    if (idx < 0 || idx >= items.length) return;
    setItems((prev) => prev.map((p, i) => (i === idx ? snapshot.prompt : p)));
    persistMeta(
      applyPromptChange(getSection(PROMPT_META_KEY, PROMPT_META_DEFAULT), id, {
        snapshot: { prompt: snapshot.prompt },
        action: "restored",
      }),
    );
    logActivity({
      kind: "prompt-edited",
      message: `Restored prompt #${idx + 1} from history`,
      area: areaPath,
    });
    setHistoryFor(null);
  };

  return (
    <EditorShell
      title={title}
      description={description}
      isDirty={isDirty}
      onSave={save}
      onReset={() => {
        onReset();
        reset();
      }}
    >
      <Breadcrumb path={breadcrumb} count={items.length} unit="prompts" />

      {/* Add new */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {isTask1 ? "Step 1 — Write the question" : "Add a new prompt"}
        </div>
        {isTask1 && (
          <p className="mb-3 text-xs text-muted-foreground">
            After saving the question, the answer editor opens automatically so you can
            <strong className="mx-1 font-semibold text-foreground">
              upload the chart / map image
            </strong>
            and
            <strong className="mx-1 font-semibold text-foreground">write the full model answer</strong>
            in one flow.
          </p>
        )}
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
            {isTask1 ? "Add question & open answer editor" : "Add prompt"}
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
            const questionId = promptIdOf(categoryKey, i);
            const meta = metaStore[questionId];
            const status: PromptStatus = meta?.status ?? "published";
            const hasOverride = !!answerOverrides[questionId];
            const hasDefault = !!sampleAnswers[questionId];
            const answerStatus: "custom" | "default" | "missing" = hasOverride
              ? "custom"
              : hasDefault
              ? "default"
              : "missing";
            const defaultPrompt = defaults[i];
            const hasDefaultPrompt = typeof defaultPrompt === "string";
            const promptDiffers = hasDefaultPrompt && defaultPrompt !== item;
            const historyCount = meta?.history?.length ?? 0;

            return (
              <li key={i} className="space-y-2">
                <div
                  className={`group flex items-start gap-2 rounded-lg border bg-card p-3 transition-colors ${
                    status === "draft"
                      ? "border-amber-400/60 bg-amber-50/40 dark:bg-amber-500/5"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  <ReorderHandle
                    index={i}
                    total={items.length}
                    onUp={() => move(i, -1)}
                    onDown={() => move(i, 1)}
                  />
                  {/* Task 1: inline thumbnail of the uploaded chart/map */}
                  {isTask1 && answerOverrides[questionId]?.imageDataUrl && (
                    <img
                      src={answerOverrides[questionId]!.imageDataUrl}
                      alt="Question visual"
                      className="h-16 w-20 shrink-0 rounded-md border border-border object-cover"
                    />
                  )}
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
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <StatusBadge status={status} />
                          {enableAnswers && <AnswerStatusBadge status={answerStatus} />}
                          {isTask1 && !answerOverrides[questionId]?.imageDataUrl && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                              No image
                            </span>
                          )}
                          {promptDiffers && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                              Edited
                            </span>
                          )}
                          {meta?.lastEditedAt && (
                            <span className="text-[10px] font-medium text-muted-foreground">
                              Edited {timeAgo(meta.lastEditedAt)}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
                    {editing ? (
                      <div className="flex gap-1">
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
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center justify-end gap-1">
                          {/* Status toggle */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setStatus(i, status === "published" ? "draft" : "published")
                            }
                            title={status === "published" ? "Move to draft" : "Publish"}
                            className="h-7 text-[11px]"
                          >
                            {status === "published" ? "Unpublish" : "Publish"}
                          </Button>
                          {/* Preview */}
                          <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            title="Preview on site"
                          >
                            <Link
                              to="/writing-samples/$questionId"
                              params={{ questionId }}
                              search={{
                                title: item,
                                module: previewModule,
                                task: previewTask,
                                category: categoryKey,
                                topic: "",
                                difficulty: "Medium",
                              }}
                              target="_blank"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          {enableAnswers && (
                            <Button
                              size="sm"
                              variant={answerOpen ? "default" : "outline"}
                              onClick={() =>
                                setOpenAnswerIndex((cur) => (cur === i ? null : i))
                              }
                              title={answerOpen ? "Hide answer editor" : "Edit model answer"}
                              className="h-7"
                            >
                              <FileText className="mr-1 h-3.5 w-3.5" />
                              Answer
                              <ChevronDown
                                className={`ml-0.5 h-3 w-3 transition-transform ${
                                  answerOpen ? "rotate-180" : ""
                                }`}
                              />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(i)}
                            title="Edit prompt"
                            className="h-7 w-7"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => duplicateItem(i)}
                            title="Duplicate"
                            className="h-7 w-7"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          {promptDiffers && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setDiffFor({ index: i, current: item, original: defaultPrompt! })
                              }
                              title="View diff vs default"
                              className="h-7 w-7"
                            >
                              <GitCompare className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {historyCount > 0 && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setHistoryFor({ index: i, id: questionId })}
                              title={`History (${historyCount})`}
                              className="h-7 w-7"
                            >
                              <History className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {hasDefaultPrompt && promptDiffers && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => resetSinglePrompt(i)}
                              title="Reset to default"
                              className="h-7 w-7"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(i)}
                            title="Delete"
                            className="h-7 w-7"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {enableAnswers && answerOpen && (
                  <WritingAnswerEditor
                    questionId={questionId}
                    questionTitle={item}
                    showImage={showAnswerImage}
                    area={areaPath}
                    onClose={() => setOpenAnswerIndex(null)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Diff modal */}
      <Dialog open={!!diffFor} onOpenChange={(open) => !open && setDiffFor(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Diff vs default</DialogTitle>
            <DialogDescription>
              Red = removed from default · Green = added in your edit.
            </DialogDescription>
          </DialogHeader>
          {diffFor && <TextDiff defaultText={diffFor.original} currentText={diffFor.current} />}
        </DialogContent>
      </Dialog>

      {/* History modal */}
      <Dialog open={!!historyFor} onOpenChange={(open) => !open && setHistoryFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version history</DialogTitle>
            <DialogDescription>
              Last {(historyFor && metaStore[historyFor.id]?.history.length) || 0} edits — pick
              one to restore the prompt to that revision.
            </DialogDescription>
          </DialogHeader>
          {historyFor && (
            <div className="max-h-96 overflow-y-auto rounded-md border border-border">
              {(metaStore[historyFor.id]?.history ?? []).map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 border-b border-border p-3 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-foreground/10 px-2 py-0.5 font-bold uppercase tracking-wider text-foreground">
                        {h.action}
                      </span>
                      <span className="text-muted-foreground">{timeAgo(h.ts)}</span>
                    </div>
                    <p className="line-clamp-3 whitespace-pre-wrap text-sm text-foreground">
                      {h.prompt}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      restoreFromHistory(historyFor.id, { prompt: h.prompt })
                    }
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                    Restore
                  </Button>
                </div>
              ))}
              {(metaStore[historyFor.id]?.history ?? []).length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">No edits yet.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </EditorShell>
  );
}

// ───────── Topic list editor (Speaking) — unchanged ─────────

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
    const existing = new Set(items.filter((_, i) => i !== ignoreIndex).map((t) => t.id));
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
    setItems((prev) => prev.map((t, i) => (i === editingIndex ? { id: t.id, label } : t)));
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

function StatusBadge({ status }: { status: PromptStatus }) {
  if (status === "draft") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
        Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
      Published
    </span>
  );
}

function AnswerStatusBadge({ status }: { status: "custom" | "default" | "missing" }) {
  const map = {
    custom: {
      label: "Custom answer",
      className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    },
    default: {
      label: "Default answer",
      className: "bg-foreground/8 text-foreground/70 border-border",
    },
    missing: {
      label: "No answer yet",
      className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    },
  } as const;
  const { label, className } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}

// Unused — kept for backwards compat with prior imports if any.
export const _unused_ExternalLink = ExternalLink;

function truncate(s: string, n = 60) {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}
