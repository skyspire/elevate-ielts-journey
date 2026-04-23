import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { FOOTER_KEY, FOOTER_DEFAULT, type FooterContent } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/footer")({
  component: FooterEditor,
});

function FooterEditor() {
  const { value, update, reset } = useCmsEditor<FooterContent>(FOOTER_KEY, FOOTER_DEFAULT);
  const [draft, setDraft] = useState<FooterContent>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  return (
    <EditorShell
      title="Footer"
      description="Tagline, navigation columns, and disclaimer text."
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => reset()}
    >
      <Field label="Tagline">
        <Textarea
          rows={2}
          value={draft.tagline}
          onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
        />
      </Field>

      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Columns
      </div>
      <div className="space-y-4">
        {draft.columns.map((col, ci) => (
          <div key={ci} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-between">
              <Input
                className="max-w-xs font-bold"
                value={col.title}
                onChange={(e) => {
                  const next = [...draft.columns];
                  next[ci] = { ...col, title: e.target.value };
                  setDraft({ ...draft, columns: next });
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDraft({ ...draft, columns: draft.columns.filter((_, j) => j !== ci) })
                }
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="space-y-2">
              {col.links.map((link, li) => (
                <div key={li} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const next = [...draft.columns];
                      const links = [...col.links];
                      links[li] = { ...link, label: e.target.value };
                      next[ci] = { ...col, links };
                      setDraft({ ...draft, columns: next });
                    }}
                  />
                  <Input
                    placeholder="/path or https://"
                    value={link.to}
                    onChange={(e) => {
                      const next = [...draft.columns];
                      const links = [...col.links];
                      links[li] = { ...link, to: e.target.value };
                      next[ci] = { ...col, links };
                      setDraft({ ...draft, columns: next });
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const next = [...draft.columns];
                      next[ci] = { ...col, links: col.links.filter((_, j) => j !== li) };
                      setDraft({ ...draft, columns: next });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                const next = [...draft.columns];
                next[ci] = { ...col, links: [...col.links, { label: "New link", to: "/" }] };
                setDraft({ ...draft, columns: next });
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add link
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() =>
          setDraft({
            ...draft,
            columns: [...draft.columns, { title: "New column", links: [] }],
          })
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        Add column
      </Button>

      <div className="mt-6">
        <Field label="Disclaimer">
          <Textarea
            rows={4}
            value={draft.disclaimer}
            onChange={(e) => setDraft({ ...draft, disclaimer: e.target.value })}
          />
        </Field>
      </div>
    </EditorShell>
  );
}
