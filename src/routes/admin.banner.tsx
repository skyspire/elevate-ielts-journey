import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  BANNER_KEY,
  BANNER_DEFAULT,
  type AnnouncementBanner,
} from "@/lib/admin/site-settings";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { logActivity } from "@/lib/admin/activity-log";

export const Route = createFileRoute("/admin/banner")({
  component: BannerPage,
});

const TONES: AnnouncementBanner["tone"][] = ["neutral", "brand", "success", "warning"];

function BannerPage() {
  const { value, update, reset } = useCmsEditor<AnnouncementBanner>(
    BANNER_KEY,
    BANNER_DEFAULT,
  );
  const [draft, setDraft] = useState<AnnouncementBanner>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  return (
    <EditorShell
      title="Announcement Banner"
      description="Show a dismissible banner at the top of the public site."
      isDirty={isDirty}
      onSave={() => {
        update({ ...draft, version: draft.version + 1 });
        logActivity({
          kind: "settings-edited",
          message: draft.enabled ? "Published announcement banner" : "Hid announcement banner",
        });
      }}
      onReset={() => {
        reset();
        setDraft(BANNER_DEFAULT);
      }}
    >
      <div className="mb-5 flex items-center justify-between rounded-lg border border-border bg-card p-3">
        <div>
          <div className="text-sm font-bold text-foreground">Show banner on the site</div>
          <p className="text-xs text-muted-foreground">
            Bumps the version on save so dismissed banners reappear when content changes.
          </p>
        </div>
        <Switch
          checked={draft.enabled}
          onCheckedChange={(v) => setDraft({ ...draft, enabled: v })}
        />
      </div>

      <Field label="Message">
        <Input
          value={draft.message}
          onChange={(e) => setDraft({ ...draft, message: e.target.value })}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="CTA label (optional)">
          <Input
            value={draft.ctaLabel ?? ""}
            onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
          />
        </Field>
        <Field label="CTA href (optional)">
          <Input
            value={draft.ctaHref ?? ""}
            onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })}
            placeholder="/writing-samples"
          />
        </Field>
      </div>
      <Field label="Tone">
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setDraft({ ...draft, tone: t })}
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                draft.tone === t
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
    </EditorShell>
  );
}
