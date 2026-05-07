// Per-topic content editor — opens for a single topic.
// - Part 1 categories: list of Q&A pairs (question, answer, vocab[], tip).
// - Part 2 (cc-*) categories: cue prompt + sample answer + follow-ups list.
// Bulk paste + CSV/JSON import for fast data entry.

import { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ClipboardPaste,
  FileUp,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCmsEditor } from "@/lib/admin/cms-store";
import {
  SPEAKING_CONTENT_KEY,
  SPEAKING_CONTENT_DEFAULT,
  contentKey,
  makeId,
  type Part1Qa,
  type Part2CueCard,
  type Part2FollowUp,
  type SpeakingContentMap,
  type TopicContent,
} from "@/data/speaking-content";

type Props = {
  categoryId: string;
  topicId: string;
  topicLabel: string;
  isCueCard: boolean;
  onClose: () => void;
};

export function TopicContentEditor({
  categoryId,
  topicId,
  topicLabel,
  isCueCard,
  onClose,
}: Props) {
  const { value, update } = useCmsEditor<SpeakingContentMap>(
    SPEAKING_CONTENT_KEY,
    SPEAKING_CONTENT_DEFAULT,
  );
  const key = contentKey(categoryId, topicId);
  const initial: TopicContent = value[key] ?? {};

  const [draft, setDraft] = useState<TopicContent>(() =>
    JSON.parse(JSON.stringify(initial)),
  );
  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial],
  );

  const save = () => {
    update({ ...value, [key]: draft });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40">
      <div className="flex h-full w-full max-w-3xl flex-col bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {isCueCard ? "Part 2 Cue Card" : "Part 1 Topic"} · {categoryId}
            </p>
            <h2 className="font-display text-lg font-extrabold tracking-tight">
              {topicLabel}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={save} disabled={!isDirty}>
              {isDirty ? "Save changes" : "Saved"}
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isCueCard ? (
            <Part2Editor
              value={draft.part2}
              onChange={(part2) => setDraft((d) => ({ ...d, part2 }))}
              topicLabel={topicLabel}
            />
          ) : (
            <Part1Editor
              value={draft.part1 ?? []}
              onChange={(part1) => setDraft((d) => ({ ...d, part1 }))}
              topicLabel={topicLabel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── Part 1 Q&A editor ───────── */

function Part1Editor({
  value,
  onChange,
  topicLabel,
}: {
  value: Part1Qa[];
  onChange: (next: Part1Qa[]) => void;
  topicLabel: string;
}) {
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const add = () =>
    onChange([
      ...value,
      { id: makeId("q"), question: "", answer: "", vocab: [], tip: "" },
    ]);

  const updateAt = (i: number, patch: Partial<Part1Qa>) => {
    const next = value.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => {
    const next = value.slice();
    next.splice(i, 1);
    onChange(next);
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  // Bulk paste format:
  //   Q: question text
  //   A: answer text (can span multiple lines)
  //   V: vocab1, vocab2, vocab3
  //   T: examiner tip
  //   --- (separator between pairs)
  const applyBulk = () => {
    const blocks = bulkText
      .split(/^---+\s*$/m)
      .map((b) => b.trim())
      .filter(Boolean);
    const additions: Part1Qa[] = [];
    for (const block of blocks) {
      const qa: Part1Qa = { id: makeId("q"), question: "", answer: "", vocab: [], tip: "" };
      const lines = block.split("\n");
      let mode: "q" | "a" | "v" | "t" | null = null;
      const buf: Record<string, string[]> = { q: [], a: [], v: [], t: [] };
      for (const raw of lines) {
        const m = /^([QAVT]):\s*(.*)$/.exec(raw.trim());
        if (m) {
          mode = m[1].toLowerCase() as "q" | "a" | "v" | "t";
          if (m[2]) buf[mode].push(m[2]);
        } else if (mode) {
          buf[mode].push(raw);
        }
      }
      qa.question = buf.q.join(" ").trim();
      qa.answer = buf.a.join("\n").trim();
      qa.vocab = buf.v.join(",").split(",").map((s) => s.trim()).filter(Boolean);
      qa.tip = buf.t.join(" ").trim();
      if (qa.question || qa.answer) additions.push(qa);
    }
    if (additions.length) onChange([...value, ...additions]);
    setBulkText("");
    setBulkOpen(false);
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    let imported: Part1Qa[] = [];
    if (file.name.toLowerCase().endsWith(".json")) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          imported = parsed.map((r) => ({
            id: makeId("q"),
            question: String(r.question ?? r.q ?? ""),
            answer: String(r.answer ?? r.a ?? ""),
            vocab: Array.isArray(r.vocab)
              ? r.vocab.map(String)
              : typeof r.vocab === "string"
                ? r.vocab.split(",").map((s: string) => s.trim()).filter(Boolean)
                : [],
            tip: String(r.tip ?? ""),
          }));
        }
      } catch {
        // ignore parse error
      }
    } else {
      // CSV: question,answer,vocab(|sep),tip — supports quoted fields.
      const rows = parseCsv(text);
      imported = rows
        .filter((cols, idx) => idx > 0 || !/^question/i.test(cols[0] ?? ""))
        .map((cols) => ({
          id: makeId("q"),
          question: cols[0] ?? "",
          answer: cols[1] ?? "",
          vocab: (cols[2] ?? "")
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean),
          tip: cols[3] ?? "",
        }))
        .filter((r) => r.question || r.answer);
    }
    if (imported.length) onChange([...value, ...imported]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {value.length} question{value.length === 1 ? "" : "s"} for{" "}
          <span className="font-semibold text-foreground">{topicLabel}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
            <FileUp className="mr-1.5 h-3.5 w-3.5" />
            Import CSV/JSON
          </Button>
          <Button size="sm" variant="outline" onClick={() => setBulkOpen((o) => !o)}>
            <ClipboardPaste className="mr-1.5 h-3.5 w-3.5" />
            Bulk paste
          </Button>
          <Button size="sm" onClick={add}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Q&A
          </Button>
        </div>
      </div>

      {bulkOpen && (
        <div className="mb-4 rounded-lg border border-border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">
            Paste blocks separated by <code>---</code>. Each block uses Q:, A:, V:
            (comma-separated vocab), T: (tip).
          </p>
          <Textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={`Q: Do you like watches?\nA: Yes, I've been fascinated by watches since...\nV: time-piece, statement accessory, sentimental value\nT: Add a personal anecdote for naturalness.\n---\nQ: What kind of watches are popular in your country?\nA: ...`}
            className="min-h-[180px] font-mono text-xs"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setBulkOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={applyBulk}>
              Add to topic
            </Button>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {value.map((qa, i) => (
          <li key={qa.id} className="rounded-lg border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Q{String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-1">
                <IconBtn onClick={() => move(i, -1)} disabled={i === 0} label="Up">
                  <ArrowUp className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  label="Down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn onClick={() => remove(i)} label="Delete" danger>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconBtn>
              </div>
            </div>
            <Field label="Question">
              <Input
                value={qa.question}
                onChange={(e) => updateAt(i, { question: e.target.value })}
                placeholder="e.g. Do you wear a watch?"
              />
            </Field>
            <Field label="Sample Answer (Band 8+)">
              <Textarea
                value={qa.answer}
                onChange={(e) => updateAt(i, { answer: e.target.value })}
                className="min-h-[100px]"
                placeholder="Model answer..."
              />
            </Field>
            <Field label="Vocab / Key Phrases (comma separated)">
              <Input
                value={qa.vocab.join(", ")}
                onChange={(e) =>
                  updateAt(i, {
                    vocab: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="time-piece, statement accessory, sentimental value"
              />
            </Field>
            <Field label="Examiner Tip">
              <Input
                value={qa.tip}
                onChange={(e) => updateAt(i, { tip: e.target.value })}
                placeholder="e.g. Extend with a reason and a personal example."
              />
            </Field>
          </li>
        ))}
        {value.length === 0 && (
          <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No questions yet — add one, paste in bulk, or import CSV/JSON.
          </li>
        )}
      </ul>
    </div>
  );
}

/* ───────── Part 2 Cue Card editor ───────── */

function Part2Editor({
  value,
  onChange,
  topicLabel,
}: {
  value: Part2CueCard | undefined;
  onChange: (next: Part2CueCard) => void;
  topicLabel: string;
}) {
  const card: Part2CueCard = value ?? {
    cuePrompt: `Describe ${topicLabel.toLowerCase()}.\nYou should say:\n• what it is / who it is\n• when and where\n• who was with you\n• and explain why it was memorable.`,
    sampleAnswer: "",
    followUps: [],
  };

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const setField = (patch: Partial<Part2CueCard>) => onChange({ ...card, ...patch });

  const addFu = () =>
    setField({
      followUps: [...card.followUps, { id: makeId("fu"), question: "", answer: "" }],
    });

  const updateFu = (i: number, patch: Partial<Part2FollowUp>) => {
    const next = card.followUps.slice();
    next[i] = { ...next[i], ...patch };
    setField({ followUps: next });
  };

  const removeFu = (i: number) => {
    const next = card.followUps.slice();
    next.splice(i, 1);
    setField({ followUps: next });
  };

  const moveFu = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= card.followUps.length) return;
    const next = card.followUps.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setField({ followUps: next });
  };

  // Bulk paste follow-ups: Q: line then A: line(s), separated by ---
  const applyBulk = () => {
    const blocks = bulkText
      .split(/^---+\s*$/m)
      .map((b) => b.trim())
      .filter(Boolean);
    const additions: Part2FollowUp[] = [];
    for (const block of blocks) {
      const lines = block.split("\n");
      let mode: "q" | "a" | null = null;
      const buf: Record<string, string[]> = { q: [], a: [] };
      for (const raw of lines) {
        const m = /^([QA]):\s*(.*)$/.exec(raw.trim());
        if (m) {
          mode = m[1].toLowerCase() as "q" | "a";
          if (m[2]) buf[mode].push(m[2]);
        } else if (mode) {
          buf[mode].push(raw);
        }
      }
      const q = buf.q.join(" ").trim();
      const a = buf.a.join("\n").trim();
      if (q || a) additions.push({ id: makeId("fu"), question: q, answer: a });
    }
    if (additions.length) setField({ followUps: [...card.followUps, ...additions] });
    setBulkText("");
    setBulkOpen(false);
  };

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-2 font-display text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
          Cue Card Prompt
        </h3>
        <Textarea
          value={card.cuePrompt}
          onChange={(e) => setField({ cuePrompt: e.target.value })}
          className="min-h-[140px] font-mono text-sm"
        />
      </section>

      <section>
        <h3 className="mb-2 font-display text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
          Band 8+ Sample Long-Turn Answer
        </h3>
        <Textarea
          value={card.sampleAnswer}
          onChange={(e) => setField({ sampleAnswer: e.target.value })}
          className="min-h-[200px]"
          placeholder="Write the 1.5–2 minute model answer..."
        />
      </section>

      <section>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Part 3 Follow-Up Q&A · {card.followUps.length}
          </h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setBulkOpen((o) => !o)}>
              <ClipboardPaste className="mr-1.5 h-3.5 w-3.5" />
              Bulk paste
            </Button>
            <Button size="sm" onClick={addFu}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add follow-up
            </Button>
          </div>
        </div>

        {bulkOpen && (
          <div className="mb-3 rounded-lg border border-border bg-muted/30 p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Blocks separated by <code>---</code>, each with Q: and A:.
            </p>
            <Textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`Q: Why do people enjoy this?\nA: There are several reasons...\n---\nQ: How has this changed in recent years?\nA: ...`}
              className="min-h-[160px] font-mono text-xs"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setBulkOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={applyBulk}>
                Add follow-ups
              </Button>
            </div>
          </div>
        )}

        <ul className="space-y-3">
          {card.followUps.map((fu, i) => (
            <li key={fu.id} className="rounded-lg border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  FU{String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex gap-1">
                  <IconBtn onClick={() => moveFu(i, -1)} disabled={i === 0} label="Up">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn
                    onClick={() => moveFu(i, 1)}
                    disabled={i === card.followUps.length - 1}
                    label="Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn onClick={() => removeFu(i)} label="Delete" danger>
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconBtn>
                </div>
              </div>
              <Field label="Question">
                <Input
                  value={fu.question}
                  onChange={(e) => updateFu(i, { question: e.target.value })}
                />
              </Field>
              <Field label="Sample Answer">
                <Textarea
                  value={fu.answer}
                  onChange={(e) => updateFu(i, { answer: e.target.value })}
                  className="min-h-[90px]"
                />
              </Field>
            </li>
          ))}
          {card.followUps.length === 0 && (
            <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No follow-ups yet.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

/* ───────── Helpers ───────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`h-7 w-7 ${danger ? "text-destructive hover:bg-destructive/10" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

// Tiny CSV parser supporting quoted fields with embedded commas.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQ = false;
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQ = true;
    } else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n" || c === "\r") {
      if (cur !== "" || row.length) {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      }
      if (c === "\r" && text[i + 1] === "\n") i++;
    } else {
      cur += c;
    }
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}
