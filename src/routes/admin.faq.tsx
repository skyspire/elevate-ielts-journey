import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { EditorShell } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { FAQ_KEY, FAQ_DEFAULT, type FaqContent } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/faq")({
  component: FaqEditor,
});

function FaqEditor() {
  const { value, update, reset } = useCmsEditor<FaqContent>(FAQ_KEY, FAQ_DEFAULT);
  const [draft, setDraft] = useState<FaqContent>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.items.length) return;
    const next = [...draft.items];
    [next[i], next[j]] = [next[j], next[i]];
    setDraft({ ...draft, items: next });
  };

  return (
    <EditorShell
      title="FAQ"
      description="Frequently asked questions shown on the homepage."
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => reset()}
    >
      <div className="space-y-4">
        {draft.items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Question {i + 1}
              </span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" onClick={() => move(i, -1)}>
                  <GripVertical className="h-4 w-4 -rotate-90" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => move(i, 1)}>
                  <GripVertical className="h-4 w-4 rotate-90" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) })}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <Input
              className="mb-2"
              placeholder="Question"
              value={item.q}
              onChange={(e) => {
                const next = [...draft.items];
                next[i] = { ...item, q: e.target.value };
                setDraft({ ...draft, items: next });
              }}
            />
            <Textarea
              rows={3}
              placeholder="Answer"
              value={item.a}
              onChange={(e) => {
                const next = [...draft.items];
                next[i] = { ...item, a: e.target.value };
                setDraft({ ...draft, items: next });
              }}
            />
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() =>
          setDraft({ ...draft, items: [...draft.items, { q: "New question?", a: "Answer here." }] })
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        Add question
      </Button>
    </EditorShell>
  );
}
