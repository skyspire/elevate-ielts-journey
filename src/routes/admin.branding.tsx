import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import {
  BRANDING_KEY,
  BRANDING_DEFAULT,
  THEME_FONT_OPTIONS,
  LOGO_SIZE_OPTIONS,
  type Branding,
  type LogoSize,
} from "@/lib/admin/site-settings";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { logActivity } from "@/lib/admin/activity-log";

export const Route = createFileRoute("/admin/branding")({
  component: BrandingPage,
});

function BrandingPage() {
  const { value, update, reset } = useCmsEditor<Branding>(BRANDING_KEY, BRANDING_DEFAULT);
  const [draft, setDraft] = useState<Branding>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  return (
    <EditorShell
      title="Theme & Branding"
      description="Adjust the public site's primary color, font and logo wordmark."
      isDirty={isDirty}
      onSave={() => {
        update(draft);
        logActivity({ kind: "settings-edited", message: "Updated branding (color/font/logo)" });
      }}
      onReset={() => {
        reset();
        setDraft(BRANDING_DEFAULT);
      }}
    >
      <Field label="Logo wordmark">
        <Input
          value={draft.logoText}
          onChange={(e) => setDraft({ ...draft, logoText: e.target.value })}
          placeholder="BigIELTS.com"
        />
      </Field>
      <Field label="Logo size" hint="Controls the wheel mark size in the header.">
        <select
          value={draft.logoSize ?? "md"}
          onChange={(e) => setDraft({ ...draft, logoSize: e.target.value as LogoSize })}
          className="h-9 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm"
        >
          {LOGO_SIZE_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Primary color" hint="Used for buttons, accents and links.">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={draft.primaryHex}
            onChange={(e) => setDraft({ ...draft, primaryHex: e.target.value })}
            className="h-10 w-16 cursor-pointer rounded-md border border-border bg-card"
          />
          <Input
            value={draft.primaryHex}
            onChange={(e) => setDraft({ ...draft, primaryHex: e.target.value })}
            placeholder="#3b6df7"
            className="max-w-[160px] font-mono"
          />
          <span
            className="ml-2 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-bold text-white"
            style={{ background: draft.primaryHex }}
          >
            Preview
          </span>
        </div>
      </Field>
      <Field label="Font family">
        <select
          value={draft.fontKey}
          onChange={(e) => setDraft({ ...draft, fontKey: e.target.value })}
          className="h-9 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm"
        >
          {THEME_FONT_OPTIONS.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </Field>
      <p className="mt-4 rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
        Branding changes apply to the public site immediately after saving (refresh the public tab if needed).
      </p>
    </EditorShell>
  );
}
