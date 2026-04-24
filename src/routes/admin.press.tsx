import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { PRESS_KEY, PRESS_DEFAULT, type PressContent } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/press")({
  component: PressEditor,
});

function PressEditor() {
  const { value, update, reset } = useCmsEditor<PressContent>(PRESS_KEY, PRESS_DEFAULT);
  const [draft, setDraft] = useState<PressContent>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.logos.length) return;
    const next = [...draft.logos];
    [next[i], next[j]] = [next[j], next[i]];
    setDraft({ ...draft, logos: next });
  };

  return (
    <EditorShell
      title="Press / Featured-in strip"
      description="The social-proof bar of community names shown below the hero. Wordmarks only — no image uploads."
      previewHref="/"
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => reset()}
    >
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div>
          <div className="text-sm font-bold">Show this section on the homepage</div>
          <div className="text-xs text-muted-foreground">Toggle off to hide the strip without losing your content.</div>
        </div>
        <Switch
          checked={draft.enabled}
          onCheckedChange={(checked) => setDraft({ ...draft, enabled: checked })}
        />
      </div>

      <Field label="Eyebrow text (small caps headline above logos)">
        <Input
          value={draft.eyebrow}
          onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
        />
      </Field>

      <div className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Logos / wordmarks
      </div>

      <div className="space-y-2">
        {draft.logos.map((logo, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-3">
            <div className="flex flex-col gap-1 pt-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                disabled={i === 0}
                aria-label="Move up"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Name (wordmark)
                </label>
                <Input
                  value={logo.name}
                  placeholder="e.g. r/IELTS"
                  onChange={(e) => {
                    const next = [...draft.logos];
                    next[i] = { ...logo, name: e.target.value };
                    setDraft({ ...draft, logos: next });
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Kind (small caption, optional)
                </label>
                <Input
                  value={logo.kind ?? ""}
                  placeholder="e.g. subreddit, YouTube"
                  onChange={(e) => {
                    const next = [...draft.logos];
                    next[i] = { ...logo, kind: e.target.value };
                    setDraft({ ...draft, logos: next });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setDraft({ ...draft, logos: draft.logos.filter((_, j) => j !== i) })}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => move(i, 1)}
                disabled={i === draft.logos.length - 1}
                aria-label="Move down"
              >
                <GripVertical className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() =>
          setDraft({ ...draft, logos: [...draft.logos, { name: "New wordmark", kind: "" }] })
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        Add logo
      </Button>

      <p className="mt-6 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
        <strong>Tip:</strong> Use real community names you've genuinely been featured in or where your audience hangs out. Honest beats flashy — keep it to 5–7 names.
      </p>
    </EditorShell>
  );
}
