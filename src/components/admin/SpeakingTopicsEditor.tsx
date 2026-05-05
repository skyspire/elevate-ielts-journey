// Per-category list editor for Speaking Part 1 / Cue Card topics.
// - Add / rename / delete / reorder
// - Bulk paste (one label per line)
// - Single shared store: editing here updates both Academic & General Speaking
//   (the public site reads one source of truth for topics).

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ClipboardPaste,
  Plus,
  Trash2,
} from "lucide-react";
import { EditorShell } from "@/components/admin/EditorShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { SPEAKING_TOPICS_KEY } from "@/lib/admin/defaults";
import {
  speakingTopicsByCategory,
  type SpeakingTopic,
} from "@/data/speaking-topics";

type CatGroup = { id: string; label: string };

const GENERAL_CATEGORIES: CatGroup[] = [
  { id: "things", label: "Things" },
  { id: "activities", label: "Activities" },
  { id: "places", label: "Places" },
  { id: "people", label: "People" },
  { id: "experiences", label: "Experiences" },
  { id: "future-plans", label: "Future Plans" },
];

const CUE_CARD_CATEGORIES: CatGroup[] = [
  { id: "cc-people", label: "People" },
  { id: "cc-places", label: "Places & Locations" },
  { id: "cc-buildings", label: "Buildings & Structures" },
  { id: "cc-objects", label: "Objects & Things" },
  { id: "cc-events", label: "Events & Experiences" },
  { id: "cc-activities", label: "Activities" },
  { id: "cc-study-work", label: "Study & Work" },
  { id: "cc-opinions", label: "Opinions & Abstract" },
  { id: "cc-future", label: "Future & Hypothetical" },
  { id: "cc-media", label: "Media & Entertainment" },
  { id: "cc-travel", label: "Travel & Tourism" },
  { id: "cc-lifestyle", label: "Habits & Lifestyle" },
  { id: "cc-tech", label: "Technology & Innovation" },
  { id: "cc-society", label: "Society & Culture" },
];

const ALL_CATS = [...GENERAL_CATEGORIES, ...CUE_CARD_CATEGORIES];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureUniqueId(base: string, existing: Set<string>): string {
  let id = base || "topic";
  let n = 2;
  while (existing.has(id)) id = `${base || "topic"}-${n++}`;
  return id;
}

export function SpeakingTopicsEditor() {
  const { value, update, reset } = useCmsEditor<
    Record<string, SpeakingTopic[]>
  >(SPEAKING_TOPICS_KEY, speakingTopicsByCategory);

  // Local working copy so we batch into one Save.
  const [draft, setDraft] = useState<Record<string, SpeakingTopic[]>>(() =>
    deepClone(value),
  );
  const [activeCat, setActiveCat] = useState<string>(ALL_CATS[0].id);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(value),
    [draft, value],
  );

  const list = draft[activeCat] ?? [];
  const ids = useMemo(() => new Set(list.map((t) => t.id)), [list]);

  const setList = (next: SpeakingTopic[]) =>
    setDraft((d) => ({ ...d, [activeCat]: next }));

  const addOne = () => {
    const label = "New Topic";
    const id = ensureUniqueId(slugify(label), ids);
    setList([...list, { id, label }]);
  };

  const renameAt = (index: number, label: string) => {
    const next = list.slice();
    next[index] = { ...next[index], label };
    setList(next);
  };

  const removeAt = (index: number) => {
    const next = list.slice();
    next.splice(index, 1);
    setList(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const next = list.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setList(next);
  };

  const applyBulk = () => {
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) {
      setBulkOpen(false);
      return;
    }
    const seen = new Set(ids);
    const additions: SpeakingTopic[] = [];
    for (const label of lines) {
      // Skip duplicates by label (case-insensitive).
      if (list.some((t) => t.label.toLowerCase() === label.toLowerCase())) continue;
      const id = ensureUniqueId(slugify(label), seen);
      seen.add(id);
      additions.push({ id, label });
    }
    setList([...list, ...additions]);
    setBulkText("");
    setBulkOpen(false);
  };

  return (
    <EditorShell
      title="Speaking Topics"
      description="Manage topics shown under each Speaking category. Both Academic and General IELTS share the same topic list."
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => {
        reset();
        setDraft(deepClone(speakingTopicsByCategory));
      }}
    >
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Sidebar: category picker */}
        <div className="space-y-4">
          <CatGroupBlock
            title="Part 1 — General Questions"
            cats={GENERAL_CATEGORIES}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            counts={draft}
          />
          <CatGroupBlock
            title="Part 2 — Cue Cards"
            cats={CUE_CARD_CATEGORIES}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            counts={draft}
          />
        </div>

        {/* Right pane: editor */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-display text-base font-extrabold">
                {ALL_CATS.find((c) => c.id === activeCat)?.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {list.length} topic{list.length === 1 ? "" : "s"} · synced to both
                Academic & General
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkOpen((o) => !o)}
              >
                <ClipboardPaste className="mr-1.5 h-3.5 w-3.5" />
                Bulk paste
              </Button>
              <Button size="sm" onClick={addOne}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add topic
              </Button>
            </div>
          </div>

          {bulkOpen && (
            <div className="mb-4 rounded-lg border border-border bg-muted/30 p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Paste one topic per line. Duplicates are skipped automatically.
              </p>
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={"Bags\nWatches\nUmbrellas\n…"}
                className="min-h-[140px] font-mono text-xs"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBulkText("");
                    setBulkOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={applyBulk}>
                  Add to category
                </Button>
              </div>
            </div>
          )}

          <ul className="space-y-1.5">
            {list.map((t, i) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5"
              >
                <span className="w-8 text-center text-[11px] font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <Input
                  value={t.label}
                  onChange={(e) => renameAt(i, e.target.value)}
                  className="h-8 text-sm"
                />
                <span className="hidden text-[10px] text-muted-foreground sm:inline">
                  {t.id}
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => move(i, 1)}
                    disabled={i === list.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => removeAt(i)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
            {list.length === 0 && (
              <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No topics yet — add one or bulk paste a list.
              </li>
            )}
          </ul>
        </div>
      </div>
    </EditorShell>
  );
}

function CatGroupBlock({
  title,
  cats,
  activeCat,
  setActiveCat,
  counts,
}: {
  title: string;
  cats: CatGroup[];
  activeCat: string;
  setActiveCat: (id: string) => void;
  counts: Record<string, SpeakingTopic[]>;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-0.5">
        {cats.map((c) => {
          const active = c.id === activeCat;
          const n = counts[c.id]?.length ?? 0;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setActiveCat(c.id)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "hover:bg-muted/60"
                }`}
              >
                <span className="truncate">{c.label}</span>
                <span
                  className={`ml-2 shrink-0 rounded-full px-1.5 text-[10px] font-bold ${
                    active
                      ? "bg-background/20 text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {n}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}
