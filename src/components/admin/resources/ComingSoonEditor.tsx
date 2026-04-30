// Generic editor for resources that haven't launched yet.
// Lets admins prep launch copy + ETA before flipping the public Coming Soon tag.

import { useEffect, useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/admin/EditorShell";
import { useCmsEditor } from "@/lib/admin/cms-store";
import {
  COMING_SOON_KEY_PREFIX,
  COMING_SOON_DEFAULT,
  type ComingSoonDraft,
} from "@/lib/admin/resources-tree";
import { logActivity } from "@/lib/admin/activity-log";

export function ComingSoonEditor({
  resourceId,
  label,
}: {
  resourceId: string;
  label: string;
}) {
  const storageKey = COMING_SOON_KEY_PREFIX + resourceId;
  const { value, update, reset } = useCmsEditor<ComingSoonDraft>(
    storageKey,
    COMING_SOON_DEFAULT,
  );

  const [draft, setDraft] = useState<ComingSoonDraft>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  const onSave = () => {
    update(draft);
    logActivity({
      kind: "prompt-edited",
      message: `Updated launch draft for ${label}`,
      area: `Content / Resources / ${label}`,
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Coming soon · launch draft
          </div>
          <h2 className="mt-1 font-display text-xl font-extrabold">{label}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Prep launch copy now. Toggle <strong>Ready to launch</strong> when
            this should appear as a live link in the public Resources menu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
          <Button size="sm" onClick={onSave} disabled={!isDirty}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isDirty ? "Save changes" : "Saved"}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
        <div>
          <div className="text-sm font-bold">Ready to launch</div>
          <p className="text-xs text-muted-foreground">
            When on, the public mega menu treats this resource as live.
          </p>
        </div>
        <Switch
          checked={draft.ready}
          onCheckedChange={(checked) => setDraft({ ...draft, ready: checked })}
        />
      </div>

      <Field label="Headline" hint="Short, punchy — shown on the public landing.">
        <Input
          value={draft.headline}
          onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
          placeholder={`${label} — coming soon`}
        />
      </Field>

      <Field label="Public description" hint="One or two sentences shown under the headline.">
        <Textarea
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={3}
          placeholder={`Tell visitors what to expect from ${label}.`}
        />
      </Field>

      <Field label="Target launch date" hint="Optional. Used for the roadmap badge.">
        <Input
          type="date"
          value={draft.launchDate ?? ""}
          onChange={(e) => setDraft({ ...draft, launchDate: e.target.value })}
        />
      </Field>

      <Field label="Internal notes / draft body" hint="For the team — won't be shown publicly until launch.">
        <Textarea
          value={draft.body}
          onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          rows={10}
          placeholder="Outline modules, planned content, contributors…"
        />
      </Field>
    </div>
  );
}
