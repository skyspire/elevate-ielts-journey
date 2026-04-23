import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { STATS_KEY, STATS_DEFAULT, type StatsContent } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/stats")({
  component: StatsEditor,
});

function StatsEditor() {
  const { value, update, reset } = useCmsEditor<StatsContent>(STATS_KEY, STATS_DEFAULT);
  const [draft, setDraft] = useState<StatsContent>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  return (
    <EditorShell
      title="Stats"
      description="Counters shown beneath the hero on the homepage."
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => reset()}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow">
          <Input value={draft.eyebrow} onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })} />
        </Field>
        <Field label="Heading">
          <Input value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} />
        </Field>
      </div>
      <div className="mb-2 mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Stat items
      </div>
      <div className="space-y-3">
        {draft.items.map((item, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2 rounded-lg border border-border p-3">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Number</label>
              <Input
                type="number"
                value={item.target}
                onChange={(e) => {
                  const next = [...draft.items];
                  next[i] = { ...item, target: parseInt(e.target.value || "0", 10) };
                  setDraft({ ...draft, items: next });
                }}
              />
            </div>
            <div className="w-20">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Suffix</label>
              <Input
                value={item.suffix}
                onChange={(e) => {
                  const next = [...draft.items];
                  next[i] = { ...item, suffix: e.target.value };
                  setDraft({ ...draft, items: next });
                }}
              />
            </div>
            <div className="flex-[2] min-w-[200px]">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Label</label>
              <Input
                value={item.label}
                onChange={(e) => {
                  const next = [...draft.items];
                  next[i] = { ...item, label: e.target.value };
                  setDraft({ ...draft, items: next });
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) })}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() =>
          setDraft({
            ...draft,
            items: [...draft.items, { target: 0, suffix: "+", label: "New stat" }],
          })
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        Add stat
      </Button>
    </EditorShell>
  );
}
