import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Tag,
  Gift as GiftIcon,
  Percent,
  Trash2,
  Plus,
  Sparkles,
  Copy,
  History,
  Wand2,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  type Coupon,
  type Gift,
  type SalePricing,
  COUPON_PRESETS,
  blankCoupon,
  buildCouponShareUrl,
  bulkGenerateCoupons,
  createGift,
  deleteCoupon,
  deleteGift,
  getCoupons,
  getGifts,
  getRedemptionsForCode,
  getSale,
  isSaleActive,
  saveSale,
  upsertCoupon,
  useMoneyData,
} from "@/lib/admin/money-store";
import { ALL_PLANS, planLabel, type PlanKey } from "@/lib/admin/subscribers-store";

export const Route = createFileRoute("/admin/monetization")({
  head: () => ({
    meta: [{ title: "Monetization — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: MonetizationPage,
});

function MonetizationPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Monetization</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Coupons, gift subscriptions, and time-limited sale pricing.
        </p>
      </div>
      <Tabs defaultValue="coupons">
        <TabsList>
          <TabsTrigger value="coupons">
            <Tag className="mr-1.5 h-3.5 w-3.5" /> Coupons
          </TabsTrigger>
          <TabsTrigger value="gifts">
            <GiftIcon className="mr-1.5 h-3.5 w-3.5" /> Gift subs
          </TabsTrigger>
          <TabsTrigger value="sale">
            <Percent className="mr-1.5 h-3.5 w-3.5" /> Sale pricing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="coupons" className="mt-5">
          <CouponsTab />
        </TabsContent>
        <TabsContent value="gifts" className="mt-5">
          <GiftsTab />
        </TabsContent>
        <TabsContent value="sale" className="mt-5">
          <SaleTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ───────── Coupons ─────────

function CouponsTab() {
  const list = useMoneyData(getCoupons);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [historyFor, setHistoryFor] = useState<Coupon | null>(null);

  const copyShare = async (code: string) => {
    const url = buildCouponShareUrl(code);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied.", { description: url });
    } catch {
      toast.message("Share link", { description: url });
    }
  };
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch {
      toast.message(code);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick presets */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          <div className="font-bold">Quick presets</div>
          <span className="text-xs text-muted-foreground">One-click templates — edit after creating.</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COUPON_PRESETS.map((p) => (
            <Button
              key={p.label}
              size="sm"
              variant="outline"
              title={p.description}
              onClick={() => {
                const c = p.build();
                if (list.some((x) => x.code === c.code)) {
                  toast.error(`${c.code} already exists.`);
                  return;
                }
                upsertCoupon(c);
                toast.success(`Created ${c.code}`);
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setBulkOpen(true)}>
          <Layers className="mr-1.5 h-3.5 w-3.5" /> Bulk generate
        </Button>
        <Button size="sm" onClick={() => setEditing(blankCoupon())}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New coupon
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2">Plan</th>
              <th className="px-3 py-2">Rules</th>
              <th className="px-3 py-2">Window</th>
              <th className="px-3 py-2">Used</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No coupons yet.
                </td>
              </tr>
            ) : (
              list.map((c) => (
                <tr key={c.code} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-mono font-bold">
                    <button
                      className="hover:underline"
                      onClick={() => copyCode(c.code)}
                      title="Click to copy"
                    >
                      {c.code}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-xs">{c.type}</td>
                  <td className="px-3 py-2 text-xs">
                    {c.type === "percent" ? `${c.value}%` : c.type === "trial-extend" ? `${c.value} days` : c.value}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {c.appliesTo === "all" ? "All" : planLabel(c.appliesTo as PlanKey)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {c.singleUse && <Badge variant="secondary" className="text-[9px]">single-use</Badge>}
                      {c.oncePerUser && <Badge variant="secondary" className="text-[9px]">1/user</Badge>}
                      {c.newUsersOnly && <Badge variant="secondary" className="text-[9px]">new users</Badge>}
                      {c.firstPurchaseOnly && <Badge variant="secondary" className="text-[9px]">1st purchase</Badge>}
                      {c.stackableWithSale && <Badge variant="secondary" className="text-[9px]">stackable</Badge>}
                      {c.minOrderAmount ? <Badge variant="secondary" className="text-[9px]">min ${c.minOrderAmount}</Badge> : null}
                      {c.allowedEmails && c.allowedEmails.length > 0 && (
                        <Badge variant="secondary" className="text-[9px]">{c.allowedEmails.length} emails</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {c.startsAt ? new Date(c.startsAt).toLocaleDateString() : "—"} →{" "}
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "∞"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {c.redeemedCount}
                    {c.maxRedemptions ? ` / ${c.maxRedemptions}` : ""}
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={c.enabled ? "default" : "secondary"} className="text-[9px]">
                      {c.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="ghost" title="Copy share link" onClick={() => copyShare(c.code)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" title="Redemption history" onClick={() => setHistoryFor(c)}>
                      <History className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(c)}>Edit</Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete ${c.code}?`)) deleteCoupon(c.code);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editing && (
        <CouponDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(c) => {
            upsertCoupon(c);
            setEditing(null);
            toast.success("Saved.");
          }}
        />
      )}
      {bulkOpen && <BulkGenerateDialog onClose={() => setBulkOpen(false)} />}
      {historyFor && <RedemptionHistoryDialog coupon={historyFor} onClose={() => setHistoryFor(null)} />}
    </div>
  );
}

function CouponDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: Coupon;
  onClose: () => void;
  onSave: (c: Coupon) => void;
}) {
  const [c, setC] = useState<Coupon>(initial);
  const dateValue = (t?: number) => (t ? new Date(t).toISOString().slice(0, 10) : "");
  const allowedEmailsText = (c.allowedEmails ?? []).join(", ");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-lg">
        <div className="mb-3 font-display text-lg font-extrabold">
          {initial.code ? `Edit ${initial.code}` : "New coupon"}
        </div>
        <div className="space-y-3">
          <div>
            <Label>Code</Label>
            <Input
              value={c.code}
              onChange={(e) => setC({ ...c, code: e.target.value.toUpperCase() })}
              placeholder="LAUNCH20"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Type</Label>
              <Select value={c.type} onValueChange={(v) => setC({ ...c, type: v as Coupon["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">% off</SelectItem>
                  <SelectItem value="fixed">Fixed amount off</SelectItem>
                  <SelectItem value="trial-extend">Extra trial days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input
                type="number"
                value={c.value}
                onChange={(e) => setC({ ...c, value: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Plan</Label>
              <Select
                value={c.appliesTo}
                onValueChange={(v) => setC({ ...c, appliesTo: v as Coupon["appliesTo"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All plans</SelectItem>
                  {ALL_PLANS.map((p) => (
                    <SelectItem key={p} value={p}>{planLabel(p)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Max redemptions (total)</Label>
              <Input
                type="number"
                value={c.maxRedemptions ?? ""}
                placeholder="∞"
                onChange={(e) =>
                  setC({ ...c, maxRedemptions: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
            <div>
              <Label>Starts</Label>
              <Input
                type="date"
                value={dateValue(c.startsAt)}
                onChange={(e) =>
                  setC({ ...c, startsAt: e.target.value ? new Date(e.target.value).getTime() : undefined })
                }
              />
            </div>
            <div>
              <Label>Expires</Label>
              <Input
                type="date"
                value={dateValue(c.expiresAt)}
                onChange={(e) =>
                  setC({ ...c, expiresAt: e.target.value ? new Date(e.target.value).getTime() : undefined })
                }
              />
            </div>
            <div>
              <Label>Min order amount</Label>
              <Input
                type="number"
                value={c.minOrderAmount ?? ""}
                placeholder="0"
                onChange={(e) =>
                  setC({ ...c, minOrderAmount: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>
          </div>

          {/* Restriction toggles */}
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Restrictions
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ToggleRow
                label="Single-use total"
                hint="Code can only be redeemed once across all users."
                checked={!!c.singleUse}
                onChange={(v) => setC({ ...c, singleUse: v })}
              />
              <ToggleRow
                label="Once per user"
                hint="Each user can only redeem this code once."
                checked={!!c.oncePerUser}
                onChange={(v) => setC({ ...c, oncePerUser: v })}
              />
              <ToggleRow
                label="New users only"
                hint="Only accounts created during this redemption."
                checked={!!c.newUsersOnly}
                onChange={(v) => setC({ ...c, newUsersOnly: v })}
              />
              <ToggleRow
                label="First purchase only"
                hint="Block users who already have a billing entry."
                checked={!!c.firstPurchaseOnly}
                onChange={(v) => setC({ ...c, firstPurchaseOnly: v })}
              />
              <ToggleRow
                label="Stackable with sale"
                hint="Allow this code on top of an active site sale."
                checked={!!c.stackableWithSale}
                onChange={(v) => setC({ ...c, stackableWithSale: v })}
              />
            </div>
            <div className="mt-3">
              <Label>Allowed emails (comma-separated, optional)</Label>
              <Textarea
                rows={2}
                value={allowedEmailsText}
                placeholder="alice@example.com, bob@example.com"
                onChange={(e) => {
                  const emails = e.target.value
                    .split(/[,\s]+/)
                    .map((s) => s.toLowerCase().trim())
                    .filter(Boolean);
                  setC({ ...c, allowedEmails: emails.length ? emails : undefined });
                }}
              />
            </div>
          </div>

          <div>
            <Label>Note (internal)</Label>
            <Input value={c.note ?? ""} onChange={(e) => setC({ ...c, note: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={c.enabled} onCheckedChange={(v) => setC({ ...c, enabled: v })} />
            <Label>Enabled</Label>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(c)} disabled={!c.code}>Save</Button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-border/60 bg-background px-3 py-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}

function BulkGenerateDialog({ onClose }: { onClose: () => void }) {
  const [prefix, setPrefix] = useState("PROMO");
  const [count, setCount] = useState(10);
  const [type, setType] = useState<Coupon["type"]>("percent");
  const [value, setValue] = useState(20);
  const [appliesTo, setAppliesTo] = useState<Coupon["appliesTo"]>("all");
  const [expiresInDays, setExpiresInDays] = useState<number | "">(30);

  const generate = () => {
    if (!count || count < 1) return toast.error("Count must be at least 1.");
    if (count > 500) return toast.error("Max 500 codes per batch.");
    const created = bulkGenerateCoupons({
      prefix,
      count,
      template: {
        type,
        value,
        appliesTo,
        enabled: true,
        oncePerUser: true,
        expiresAt: expiresInDays ? Date.now() + Number(expiresInDays) * 86400000 : undefined,
      },
    });
    toast.success(`Generated ${created.length} codes.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-lg">
        <div className="mb-3 font-display text-lg font-extrabold">Bulk generate codes</div>
        <p className="mb-3 text-xs text-muted-foreground">
          Creates N unique single-use codes (1 redemption each), in the format <code>PREFIX-XXXXXX</code>.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Prefix</Label>
            <Input value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} />
          </div>
          <div>
            <Label>How many</Label>
            <Input type="number" value={count} onChange={(e) => setCount(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label>Discount type</Label>
            <Select value={type} onValueChange={(v) => setType(v as Coupon["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">% off</SelectItem>
                <SelectItem value="fixed">Fixed amount off</SelectItem>
                <SelectItem value="trial-extend">Extra trial days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Value</Label>
            <Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} />
          </div>
          <div>
            <Label>Applies to</Label>
            <Select value={appliesTo} onValueChange={(v) => setAppliesTo(v as Coupon["appliesTo"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                {ALL_PLANS.map((p) => (
                  <SelectItem key={p} value={p}>{planLabel(p)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Expires in (days)</Label>
            <Input
              type="number"
              value={expiresInDays}
              placeholder="never"
              onChange={(e) => setExpiresInDays(e.target.value ? Number(e.target.value) : "")}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={generate}>Generate</Button>
        </div>
      </div>
    </div>
  );
}

function RedemptionHistoryDialog({
  coupon,
  onClose,
}: {
  coupon: Coupon;
  onClose: () => void;
}) {
  const rows = useMemo(() => getRedemptionsForCode(coupon.code), [coupon.code]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-lg">
        <div className="mb-3 font-display text-lg font-extrabold">
          Redemption history — <span className="font-mono">{coupon.code}</span>
        </div>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No redemptions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-2 py-2">When</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Plan</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-2 py-2 text-xs">{new Date(r.redeemedAt).toLocaleString()}</td>
                  <td className="px-2 py-2 text-xs">{r.email || "—"}</td>
                  <td className="px-2 py-2 text-xs">{planLabel(r.plan)}</td>
                  <td className="px-2 py-2 text-xs">{r.amount != null ? r.amount : "—"}</td>
                  <td className="px-2 py-2 text-xs">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

// ───────── Gifts ─────────

function GiftsTab() {
  const list = useMoneyData(getGifts);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<PlanKey>("monthly");
  const [days, setDays] = useState(30);
  const [note, setNote] = useState("");

  const create = () => {
    if (!email) return toast.error("Email required.");
    createGift({ email, plan, days, note });
    setEmail("");
    setNote("");
    toast.success("Gift created. It will activate when this email signs up or is matched.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 font-bold">Gift a subscription</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Input placeholder="Recipient email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select value={plan} onValueChange={(v) => setPlan(v as PlanKey)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ALL_PLANS.map((p) => (
                <SelectItem key={p} value={p}>{planLabel(p)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="number" value={days} onChange={(e) => setDays(Number(e.target.value) || 0)} />
          <Input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button onClick={create}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Gift
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Plan</th>
              <th className="px-3 py-2">Days</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No gifts yet.
                </td>
              </tr>
            ) : (
              list.map((g: Gift) => (
                <tr key={g.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-sm">{g.email}</td>
                  <td className="px-3 py-2 text-xs">{planLabel(g.plan)}</td>
                  <td className="px-3 py-2 text-xs">{g.days}</td>
                  <td className="px-3 py-2">
                    <Badge variant={g.claimedAt ? "default" : "secondary"} className="text-[9px]">
                      {g.claimedAt ? "Claimed" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {new Date(g.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="ghost" onClick={() => deleteGift(g.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ───────── Sale pricing ─────────

function SaleTab() {
  const saved = useMoneyData(getSale);
  const [s, setS] = useState<SalePricing>(saved);
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);
  const dateValue = (t?: number) => (t ? new Date(t).toISOString().slice(0, 10) : "");
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold">Site-wide promotional pricing</div>
            <div className="text-xs text-muted-foreground">
              Currently {isSaleActive(saved) ? "ACTIVE" : "INACTIVE"}.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label>Enabled</Label>
          <Switch checked={s.enabled} onCheckedChange={(v) => setS({ ...s, enabled: v })} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Discount %</Label>
          <Input
            type="number"
            value={s.discountPercent}
            onChange={(e) => setS({ ...s, discountPercent: Number(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label>Applies to</Label>
          <Select
            value={s.appliesTo}
            onValueChange={(v) => setS({ ...s, appliesTo: v as SalePricing["appliesTo"] })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              {ALL_PLANS.map((p) => (
                <SelectItem key={p} value={p}>{planLabel(p)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Starts</Label>
          <Input
            type="date"
            value={dateValue(s.startsAt)}
            onChange={(e) =>
              setS({ ...s, startsAt: e.target.value ? new Date(e.target.value).getTime() : undefined })
            }
          />
        </div>
        <div>
          <Label>Ends</Label>
          <Input
            type="date"
            value={dateValue(s.endsAt)}
            onChange={(e) =>
              setS({ ...s, endsAt: e.target.value ? new Date(e.target.value).getTime() : undefined })
            }
          />
        </div>
      </div>
      <div>
        <Label>Banner text</Label>
        <Textarea
          rows={2}
          value={s.bannerText ?? ""}
          onChange={(e) => setS({ ...s, bannerText: e.target.value })}
          placeholder="Use {discount} for the percentage."
        />
      </div>
      <div className="flex justify-end">
        <Button disabled={!dirty} onClick={() => { saveSale(s); toast.success("Saved."); }}>
          Save
        </Button>
      </div>
    </div>
  );
}
