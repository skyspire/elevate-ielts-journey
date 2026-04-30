import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { EditorShell, Field } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCmsEditor } from "@/lib/admin/cms-store";
import {
  PRICING_KEY,
  PRICING_DEFAULT,
  type PricingContent,
  type PricingPlan,
} from "@/lib/admin/defaults";
import {
  CURRENCIES,
  CURRENCY_GROUPS,
  PRICES,
  formatPrice,
  type CurrencyCode,
  type PlanKey,
} from "@/lib/currency";

export const Route = createFileRoute("/admin/pricing")({
  component: PricingEditor,
});

function PricingEditor() {
  const { value, update, reset } = useCmsEditor<PricingContent>(
    PRICING_KEY,
    PRICING_DEFAULT,
  );
  const [draft, setDraft] = useState<PricingContent>(value);
  const [previewCurrency, setPreviewCurrency] = useState<CurrencyCode>("USD");
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  const setPlan = (i: number, patch: Partial<PricingPlan>) => {
    const next = [...draft.plans];
    next[i] = { ...next[i], ...patch };
    setDraft({ ...draft, plans: next });
  };

  const setOverride = (
    i: number,
    field: "priceOverrides" | "originalPriceOverrides",
    code: CurrencyCode,
    raw: string,
  ) => {
    const plan = draft.plans[i];
    const current = { ...(plan[field] || {}) };
    const num = Number(raw);
    if (!raw.trim() || Number.isNaN(num) || num <= 0) {
      delete current[code];
    } else {
      current[code] = num;
    }
    setPlan(i, { [field]: current } as Partial<PricingPlan>);
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...draft.plans];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    next.forEach((p, idx) => (p.order = idx));
    setDraft({ ...draft, plans: next });
  };

  const sortedPlans = useMemo(
    () =>
      draft.plans
        .map((p, i) => ({ p, i }))
        .sort((a, b) => (a.p.order ?? 0) - (b.p.order ?? 0)),
    [draft.plans],
  );

  return (
    <EditorShell
      title="Pricing & Subscriptions"
      description="Edit plan names, per-currency prices, original (strikethrough) prices, discount badges, descriptions, order, and visibility."
      previewHref="/#pricing"
      isDirty={isDirty}
      onSave={() => update(draft)}
      onReset={() => reset()}
    >
      {/* Preview currency selector */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Preview currency
        </span>
        <Select
          value={previewCurrency}
          onValueChange={(v) => setPreviewCurrency(v as CurrencyCode)}
        >
          <SelectTrigger className="h-9 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_GROUPS.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.codes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {CURRENCIES[code].flag} {CURRENCIES[code].label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-[11px] text-muted-foreground">
          Empty price field = uses default for that currency.
        </span>
      </div>

      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Plans
      </div>
      <div className="space-y-5">
        {sortedPlans.map(({ p: plan, i }, idx) => {
          const planKey = plan.key as PlanKey;
          const defaultPrice = PRICES[planKey][previewCurrency];
          const overridePrice = plan.priceOverrides?.[previewCurrency];
          const effective = overridePrice ?? defaultPrice;
          const originalOverride = plan.originalPriceOverrides?.[previewCurrency];
          return (
            <div
              key={plan.key}
              className={`rounded-xl border p-4 ${
                plan.visible === false
                  ? "border-dashed border-border/50 bg-muted/20 opacity-70"
                  : "border-border"
              }`}
            >
              {/* Header row */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                  style={{
                    background: `color-mix(in oklab, ${plan.accent} 18%, transparent)`,
                    color: plan.accent,
                  }}
                >
                  {plan.key}
                </span>
                <span className="text-sm font-bold">{plan.name}</span>
                <span className="ml-auto flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    disabled={idx === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    disabled={idx === sortedPlans.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                </span>
              </div>

              {/* Basics */}
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Plan name">
                  <Input
                    value={plan.name}
                    onChange={(e) => setPlan(i, { name: e.target.value })}
                  />
                </Field>
                <Field label="Days of access">
                  <Input
                    value={plan.days}
                    onChange={(e) => setPlan(i, { days: e.target.value })}
                  />
                </Field>
                <Field label="Accent color (oklch / hex)">
                  <Input
                    value={plan.accent}
                    onChange={(e) => setPlan(i, { accent: e.target.value })}
                  />
                </Field>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Field label="Tagline (small text above price)">
                  <Input
                    value={plan.tagline ?? ""}
                    placeholder="e.g. Best for short bursts"
                    onChange={(e) => setPlan(i, { tagline: e.target.value })}
                  />
                </Field>
                <Field label="Badge (overrides 'Most popular')">
                  <Input
                    value={plan.badge ?? ""}
                    placeholder="e.g. Best value"
                    onChange={(e) => setPlan(i, { badge: e.target.value })}
                  />
                </Field>
                <Field label="CTA button label">
                  <Input
                    value={plan.ctaLabel ?? ""}
                    placeholder={`Choose ${plan.name}`}
                    onChange={(e) => setPlan(i, { ctaLabel: e.target.value })}
                  />
                </Field>
              </div>

              <div className="mt-3">
                <Field label="Description (small text under price block)">
                  <Textarea
                    rows={2}
                    value={plan.description ?? ""}
                    onChange={(e) => setPlan(i, { description: e.target.value })}
                  />
                </Field>
              </div>

              {/* Toggles */}
              <div className="mt-3 flex flex-wrap items-center gap-5 rounded-lg bg-muted/30 px-3 py-2">
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <Switch
                    checked={plan.popular}
                    onCheckedChange={(checked) => {
                      const next = draft.plans.map((p, j) =>
                        j === i
                          ? { ...p, popular: checked }
                          : { ...p, popular: false },
                      );
                      setDraft({ ...draft, plans: next });
                    }}
                  />
                  Most popular
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <Switch
                    checked={plan.visible !== false}
                    onCheckedChange={(checked) => setPlan(i, { visible: checked })}
                  />
                  Visible on site
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">Discount %</span>
                  <Input
                    type="number"
                    className="h-8 w-20"
                    value={plan.discountPercent ?? ""}
                    onChange={(e) =>
                      setPlan(i, {
                        discountPercent: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="mt-4 rounded-lg border border-border/70 bg-background p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Price · {previewCurrency}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Default: {formatPrice(defaultPrice, previewCurrency)} · Effective:{" "}
                    <span className="font-bold text-foreground">
                      {formatPrice(effective, previewCurrency)}
                    </span>
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={`Price override (${previewCurrency})`}>
                    <Input
                      type="number"
                      placeholder={String(defaultPrice)}
                      value={overridePrice ?? ""}
                      onChange={(e) =>
                        setOverride(i, "priceOverrides", previewCurrency, e.target.value)
                      }
                    />
                  </Field>
                  <Field label={`Original / strikethrough price (${previewCurrency})`}>
                    <Input
                      type="number"
                      placeholder="(none)"
                      value={originalOverride ?? ""}
                      onChange={(e) =>
                        setOverride(
                          i,
                          "originalPriceOverrides",
                          previewCurrency,
                          e.target.value,
                        )
                      }
                    />
                  </Field>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground">
                    Set overrides for other currencies (
                    {Object.keys(plan.priceOverrides ?? {}).length} set)
                  </summary>
                  <div className="mt-2 grid max-h-72 gap-2 overflow-y-auto pr-2 sm:grid-cols-2">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                      <div
                        key={code}
                        className="flex items-center gap-2 rounded border border-border/60 px-2 py-1.5"
                      >
                        <span className="w-12 text-[11px] font-bold">
                          {CURRENCIES[code].flag} {code}
                        </span>
                        <Input
                          type="number"
                          className="h-8"
                          placeholder={String(PRICES[planKey][code])}
                          value={plan.priceOverrides?.[code] ?? ""}
                          onChange={(e) =>
                            setOverride(i, "priceOverrides", code, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Included features (shown under all plans)
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
              onClick={() =>
                setDraft({
                  ...draft,
                  features: draft.features.filter((_, j) => j !== i),
                })
              }
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
          setDraft({ ...draft, features: [...draft.features, "New feature"] })
        }
      >
        <Plus className="mr-1 h-4 w-4" />
        Add feature
      </Button>

      <div className="mt-6">
        <Field label="Footnote (under pricing cards)">
          <Input
            value={draft.footnote}
            onChange={(e) => setDraft({ ...draft, footnote: e.target.value })}
          />
        </Field>
      </div>
    </EditorShell>
  );
}
