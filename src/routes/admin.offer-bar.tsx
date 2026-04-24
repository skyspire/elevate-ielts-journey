import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { OFFER_BAR_KEY, OFFER_BAR_DEFAULT, type OfferBar } from "@/lib/admin/site-settings";

export const Route = createFileRoute("/admin/offer-bar")({
  component: OfferBarEditor,
});

function OfferBarEditor() {
  const { value, update, reset } = useCmsEditor<OfferBar>(OFFER_BAR_KEY, OFFER_BAR_DEFAULT);
  const [draft, setDraft] = useState<OfferBar>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  const handleSave = () => {
    // Bump version so dismissed bars reappear for everyone on next visit.
    update({ ...draft, version: draft.version + 1 });
  };

  return (
    <EditorShell
      title="Top sticky offer bar"
      description="The thin dark bar pinned to the top of every public page. Use it for a single, professional reassurance or offer line."
      previewHref="/"
      isDirty={isDirty}
      onSave={handleSave}
      onReset={() => reset()}
    >
      <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div>
          <div className="text-sm font-bold">Show offer bar on the site</div>
          <div className="text-xs text-muted-foreground">
            Toggle off to hide everywhere without losing your content.
          </div>
        </div>
        <Switch
          checked={draft.enabled}
          onCheckedChange={(checked) => setDraft({ ...draft, enabled: checked })}
        />
      </div>

      <Field label="Message (one short line)">
        <Input
          value={draft.message}
          placeholder="Try 6 Band-9 samples free — no credit card needed."
          onChange={(e) => setDraft({ ...draft, message: e.target.value })}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA label (optional)">
          <Input
            value={draft.ctaLabel ?? ""}
            placeholder="Start free"
            onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
          />
        </Field>
        <Field label="CTA link (optional)">
          <Input
            value={draft.ctaHref ?? ""}
            placeholder="/signup"
            onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })}
          />
        </Field>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div>
          <div className="text-sm font-bold">Allow visitors to dismiss</div>
          <div className="text-xs text-muted-foreground">
            If on, the bar shows an X. Dismissed bars reappear when you save changes here.
          </div>
        </div>
        <Switch
          checked={draft.dismissible}
          onCheckedChange={(checked) => setDraft({ ...draft, dismissible: checked })}
        />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-foreground p-3 text-center text-[13px] font-medium text-background">
        <div className="text-[10px] font-bold uppercase tracking-wider text-background/60">
          Live preview
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <span>{draft.message || "—"}</span>
          {draft.ctaLabel && draft.ctaHref && (
            <span className="rounded-full bg-background px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
              {draft.ctaLabel}
            </span>
          )}
        </div>
      </div>

      <p className="mt-6 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
        <strong>Tip:</strong> Keep the message under ~70 characters so it fits on one line on mobile. Saving auto-bumps the version so dismissed bars reappear for returning visitors.
      </p>
    </EditorShell>
  );
}
