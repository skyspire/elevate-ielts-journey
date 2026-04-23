// Inline editor for a Writing model answer (band score, paragraphs, word count,
// optional Task 1 image). Paragraph bodies use a Quill rich-text editor.

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Save, RotateCcw, X, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCmsEditor } from "@/lib/admin/cms-store";
import {
  WRITING_ANSWERS_KEY,
  WRITING_ANSWERS_DEFAULT,
  type WritingAnswersOverrides,
  computeWordCount,
} from "@/lib/admin/writing-answers";
import { sampleAnswers, type AnswerParagraph } from "@/data/sample-answers";
import { RichTextEditor, countWords } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { logActivity } from "@/lib/admin/activity-log";

type WritingAnswerEditorProps = {
  questionId: string;
  questionTitle: string;
  /** When true, show the Task 1 image uploader. */
  showImage?: boolean;
  /** Where the prompt lives — used for activity log breadcrumb. */
  area?: string;
  /** Optional close callback (renders an X in the header). */
  onClose?: () => void;
};

const EMPTY_PARAGRAPHS: AnswerParagraph[] = [
  { heading: "Introduction", body: "" },
  { heading: "Body 1", body: "" },
  { heading: "Body 2", body: "" },
  { heading: "Conclusion", body: "" },
];

export function WritingAnswerEditor({
  questionId,
  questionTitle,
  showImage = false,
  area,
  onClose,
}: WritingAnswerEditorProps) {
  const { value: overrides, update, reset } = useCmsEditor<WritingAnswersOverrides>(
    WRITING_ANSWERS_KEY,
    WRITING_ANSWERS_DEFAULT,
  );

  const baseAnswer = sampleAnswers[questionId];
  const ov = overrides[questionId];

  const initialParagraphs = useMemo<AnswerParagraph[]>(() => {
    if (ov?.paragraphs) return ov.paragraphs;
    if (baseAnswer?.paragraphs) return baseAnswer.paragraphs;
    return EMPTY_PARAGRAPHS;
  }, [ov, baseAnswer]);

  const initialBandScore = ov?.bandScore ?? baseAnswer?.bandScore ?? "8.5";
  const initialImage = ov?.imageDataUrl;

  const [bandScore, setBandScore] = useState(initialBandScore);
  const [paragraphs, setParagraphs] = useState<AnswerParagraph[]>(initialParagraphs);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(initialImage);

  useEffect(() => {
    setBandScore(initialBandScore);
    setParagraphs(initialParagraphs);
    setImageDataUrl(initialImage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const wordCount = computeWordCount(paragraphs);

  const isDirty =
    bandScore !== initialBandScore ||
    JSON.stringify(paragraphs) !== JSON.stringify(initialParagraphs) ||
    (imageDataUrl ?? "") !== (initialImage ?? "");

  const save = () => {
    update({
      ...overrides,
      [questionId]: {
        bandScore,
        wordCount,
        paragraphs,
        imageDataUrl,
      },
    });
    logActivity({
      kind: "answer-edited",
      message: `Updated model answer for "${truncate(questionTitle)}"`,
      area,
    });
  };

  const onResetThis = () => {
    const next = { ...overrides };
    delete next[questionId];
    if (Object.keys(next).length === 0) {
      reset();
    } else {
      update(next);
    }
    setBandScore(baseAnswer?.bandScore ?? "8.5");
    setParagraphs(baseAnswer?.paragraphs ?? EMPTY_PARAGRAPHS);
    setImageDataUrl(undefined);
    logActivity({
      kind: "answer-reset",
      message: `Reset model answer for "${truncate(questionTitle)}"`,
      area,
    });
  };

  const updateParagraph = (i: number, patch: Partial<AnswerParagraph>) => {
    setParagraphs((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  };

  const removeParagraph = (i: number) =>
    setParagraphs((prev) => prev.filter((_, idx) => idx !== i));

  const addParagraph = () =>
    setParagraphs((prev) => [...prev, { heading: `Body ${prev.length}`, body: "" }]);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= paragraphs.length) return;
    setParagraphs((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const previewSearch = {
    title: questionTitle,
    module: "academic" as const,
    task: "task2" as const,
    category: questionId.split("-")[0],
    topic: "",
    difficulty: "Medium" as const,
  };

  return (
    <div className="rounded-xl border border-foreground/15 bg-muted/30 p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
              <Sparkles className="h-3 w-3" />
              Model Answer
            </span>
            {!baseAnswer && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                New
              </span>
            )}
          </div>
          <p className="mt-1 max-w-xl text-xs text-muted-foreground">
            Rich text editor — bold, italic, headings, lists, colors, links.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button asChild variant="outline" size="sm">
            <Link
              to="/writing-samples/$questionId"
              params={{ questionId }}
              search={previewSearch}
              target="_blank"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={onResetThis}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
          <Button size="sm" onClick={save} disabled={!isDirty}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isDirty ? "Save answer" : "Saved"}
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} title="Close">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Meta row — band score + word count */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Band score
          </label>
          <Input
            value={bandScore}
            onChange={(e) => setBandScore(e.target.value)}
            placeholder="8.5"
            className="bg-background"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Word count (auto)
          </label>
          <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground">
            {wordCount} words
          </div>
        </div>
      </div>

      {/* Optional Task 1 image */}
      {showImage && (
        <div className="mb-4">
          <ImageUploader
            value={imageDataUrl}
            onChange={setImageDataUrl}
            label="Question image (chart / map / diagram)"
            hint="PNG / JPG up to 600KB — visible above the answer on the public page."
          />
        </div>
      )}

      {/* Paragraphs */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Paragraphs ({paragraphs.length})
          </div>
        </div>
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-3"
            >
              <div className="mb-2 flex items-start gap-2">
                <span className="mt-1.5 inline-flex h-5 w-6 shrink-0 items-center justify-center rounded bg-foreground/10 text-[10px] font-bold text-foreground">
                  {i + 1}
                </span>
                <Input
                  value={p.heading}
                  onChange={(e) => updateParagraph(i, { heading: e.target.value })}
                  placeholder="Heading (e.g. Introduction)"
                  className="flex-1 bg-background font-semibold"
                />
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    title="Move up"
                  >
                    ↑
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => move(i, 1)}
                    disabled={i === paragraphs.length - 1}
                    title="Move down"
                  >
                    ↓
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeParagraph(i)}
                    title="Delete paragraph"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
              <RichTextEditor
                value={p.body}
                onChange={(html) => updateParagraph(i, { body: html })}
                placeholder="Paragraph body…"
                minHeight={140}
              />
              <div className="mt-1 text-right text-[11px] text-muted-foreground">
                {countWords(p.body)} words
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addParagraph} className="mt-3">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add paragraph
        </Button>
      </div>

      {baseAnswer && (baseAnswer.structure.length > 0 || baseAnswer.vocabulary.length > 0) && (
        <p className="mt-4 rounded-md border border-border/60 bg-background/50 px-3 py-2 text-[11px] text-muted-foreground">
          Note: the existing answer also has structure tips, vocabulary, and writing tips. Those
          fields are preserved and not yet editable here — they remain as-is on the public page.
        </p>
      )}
    </div>
  );
}

function truncate(s: string, n = 60) {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}
