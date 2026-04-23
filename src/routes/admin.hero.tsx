import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { HERO_KEY, HERO_DEFAULT, type HeroContent } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/hero")({
  component: HeroEditor,
});

function HeroEditor() {
  const { value, update, reset } = useCmsEditor<HeroContent>(HERO_KEY, HERO_DEFAULT);
  const [draft, setDraft] = useState<HeroContent>(value);

  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  return (
    <EditorShell
      title="Hero Section"
      description="The main headline area shown at the top of the homepage."
      previewHref="/"
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => reset()}
    >
      <Field label="Eyebrow (handwritten)">
        <Input value={draft.eyebrow} onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Headline — start">
          <Input
            value={draft.headlinePrefix}
            onChange={(e) => setDraft({ ...draft, headlinePrefix: e.target.value })}
          />
        </Field>
        <Field label="Highlight word">
          <Input
            value={draft.headlineHighlight}
            onChange={(e) => setDraft({ ...draft, headlineHighlight: e.target.value })}
          />
        </Field>
        <Field label="Headline — end">
          <Input
            value={draft.headlineSuffix}
            onChange={(e) => setDraft({ ...draft, headlineSuffix: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Subline">
        <Textarea
          rows={3}
          value={draft.subline}
          onChange={(e) => setDraft({ ...draft, subline: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary CTA">
          <Input
            value={draft.primaryCta}
            onChange={(e) => setDraft({ ...draft, primaryCta: e.target.value })}
          />
        </Field>
        <Field label="Secondary CTA">
          <Input
            value={draft.secondaryCta}
            onChange={(e) => setDraft({ ...draft, secondaryCta: e.target.value })}
          />
        </Field>
      </div>
    </EditorShell>
  );
}
