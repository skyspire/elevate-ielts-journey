import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { PRICING_KEY, PRICING_DEFAULT, type PricingContent } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/pricing")({
  component: PricingEditor,
});

function PricingEditor() {
  const { value, update, reset } = useCmsEditor<PricingContent>(PRICING_KEY, PRICING_DEFAULT);
  const [draft, setDraft] = useState<PricingContent>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  return (
    <EditorShell
      title="Pricing"
      description="Plan names, durations, popular badge, included features, and footnote."
      previewHref="/#pricing"
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => reset()}
    >
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Plans
      </div>
      <div className="space-y-4">
        {draft.plans.map((plan, i) => (
          <div key={plan.key} className="rounded-lg border border-border p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Plan name
                </label>
                <Input
                  value={plan.name}
                  onChange={(e) => {
                    const next = [...draft.plans];
                    next[i] = { ...plan, name: e.target.value };
                    setDraft({ ...draft, plans: next });
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                  Days of access
                </label>
                <Input
                  value={plan.days}
                  onChange={(e) => {
                    const next = [...draft.plans];
                    next[i] = { ...plan, days: e.target.value };
                    setDraft({ ...draft, plans: next });
                  }}
                />
              </div>
              <div className="flex items-end gap-3 pb-1">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={plan.popular}
                    onCheckedChange={(checked) => {
                      const next = draft.plans.map((p, j) =>
                        j === i ? { ...p, popular: checked } : { ...p, popular: false },
                      );
                      setDraft({ ...draft, plans: next });
                    }}
                  />
                  <span className="text-xs font-semibold">Most popular</span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Plan key: <code className="rounded bg-muted px-1">{plan.key}</code> · Edit prices per
              currency in{" "}
              <span className="font-semibold">src/lib/currency.ts</span> (price overrides not yet
              wired in this prototype).
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Included features
      </div>
      <div className="space-y-2">
        {draft.features.map((f, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={f}
              onChange={(e) => {
                const next = [...draft.features];
                next[i] = e.target.value;
                setDraft({ ...draft, features: next });
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setDraft({ ...draft, features: draft.features.filter((_, j) => j !== i) })}
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
        onClick={() => setDraft({ ...draft, features: [...draft.features, "New feature"] })}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add feature
      </Button>

      <div className="mt-6">
        <Field label="Footnote (under pricing cards)">
          <Input value={draft.footnote} onChange={(e) => setDraft({ ...draft, footnote: e.target.value })} />
        </Field>
      </div>
    </EditorShell>
  );
}
