import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { CONTACT_KEY, CONTACT_DEFAULT, type ContactContent } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/contact")({
  component: ContactEditor,
});

function ContactEditor() {
  const { value, update, reset } = useCmsEditor<ContactContent>(CONTACT_KEY, CONTACT_DEFAULT);
  const [draft, setDraft] = useState<ContactContent>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  return (
    <EditorShell
      title="Contact Page"
      description="Contact information shown on /contact."
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => reset()}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand name">
          <Input value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
        </Field>
        <Field label="Legal entity">
          <Input value={draft.legalName} onChange={(e) => setDraft({ ...draft, legalName: e.target.value })} />
        </Field>
      </div>
      <Field label="Description">
        <Textarea
          rows={3}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <Input
            type="email"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
        </Field>
        <Field label="Response time">
          <Input
            value={draft.responseTime}
            onChange={(e) => setDraft({ ...draft, responseTime: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Address">
        <Textarea
          rows={2}
          value={draft.address}
          onChange={(e) => setDraft({ ...draft, address: e.target.value })}
        />
      </Field>
      <Field label="Support hours">
        <Input value={draft.hours} onChange={(e) => setDraft({ ...draft, hours: e.target.value })} />
      </Field>
    </EditorShell>
  );
}
