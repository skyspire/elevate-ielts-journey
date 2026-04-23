import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  SEO_KEY,
  SEO_DEFAULT,
  SEO_ROUTES,
  type SeoOverrides,
} from "@/lib/admin/site-settings";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { logActivity } from "@/lib/admin/activity-log";

export const Route = createFileRoute("/admin/seo")({
  component: SeoPage,
});

function SeoPage() {
  const { value, update, reset } = useCmsEditor<SeoOverrides>(SEO_KEY, SEO_DEFAULT);
  const [draft, setDraft] = useState<SeoOverrides>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  const setField = (path: string, key: "title" | "description" | "ogImage", v: string) => {
    setDraft((prev) => ({ ...prev, [path]: { ...prev[path], [key]: v } }));
  };

  return (
    <EditorShell
      title="Per-page SEO"
      description="Override title, meta description and og:image on each public route."
      isDirty={isDirty}
      onSave={() => {
        update(draft);
        logActivity({ kind: "settings-edited", message: "Updated per-page SEO overrides" });
      }}
      onReset={() => {
        reset();
        setDraft(SEO_DEFAULT);
      }}
    >
      <div className="space-y-6">
        {SEO_ROUTES.map((r) => {
          const ov = draft[r.path] ?? {};
          return (
            <div key={r.path} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="font-display text-base font-extrabold text-foreground">
                    {r.label}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">{r.path}</div>
                </div>
              </div>
              <Field label="Title" hint={`Default: ${r.defaultTitle}`}>
                <Input
                  value={ov.title ?? ""}
                  onChange={(e) => setField(r.path, "title", e.target.value)}
                  placeholder={r.defaultTitle}
                />
              </Field>
              <Field label="Meta description" hint={`Default: ${r.defaultDesc}`}>
                <Textarea
                  rows={2}
                  value={ov.description ?? ""}
                  onChange={(e) => setField(r.path, "description", e.target.value)}
                  placeholder={r.defaultDesc}
                />
              </Field>
              <Field label="OG image URL" hint="Absolute URL — appears when the page is shared.">
                <Input
                  value={ov.ogImage ?? ""}
                  onChange={(e) => setField(r.path, "ogImage", e.target.value)}
                  placeholder="https://…/share-image.jpg"
                />
              </Field>
            </div>
          );
        })}
      </div>
    </EditorShell>
  );
}
