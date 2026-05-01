import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  affiliateStats,
  createAffiliate,
  deleteAffiliate,
  recordConversion,
  recordPayout,
  saveReferralSettings,
  updateAffiliate,
  updateConversion,
  useReferrals,
  type Affiliate,
  type Conversion,
} from "@/lib/admin/referrals-store";

export const Route = createFileRoute("/admin/referrals")({
  head: () => ({ meta: [{ title: "Referrals — Admin" }, { name: "robots", content: "noindex" }] }),
  component: ReferralsPage,
});

function ReferralsPage() {
  const { affiliates, conversions, payouts, settings } = useReferrals();
  const [tab, setTab] = useState<"affiliates" | "conversions" | "payouts" | "settings">(
    "affiliates",
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Referral / Affiliate program</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate share links, track clicks → signups → paid conversions, and log commission
          payouts.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Affiliates" value={affiliates.length} />
        <Stat label="Conversions" value={conversions.length} />
        <Stat
          label="Revenue"
          value={`$${conversions.reduce((s, c) => s + c.amount, 0).toFixed(2)}`}
        />
        <Stat
          label="Commission paid"
          value={`$${payouts.reduce((s, p) => s + p.amount, 0).toFixed(2)}`}
        />
      </div>

      <div className="flex gap-1 rounded-md bg-muted p-1 text-xs font-semibold">
        {(["affiliates", "conversions", "payouts", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded px-3 py-1.5 capitalize transition-colors ${
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "affiliates" && <AffiliatesTab affiliates={affiliates} defaultPct={settings.defaultCommissionPercent} />}
      {tab === "conversions" && <ConversionsTab conversions={conversions} affiliates={affiliates} />}
      {tab === "payouts" && <PayoutsTab affiliates={affiliates} />}
      {tab === "settings" && <SettingsTab settings={settings} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}

// ───────── Affiliates

function AffiliatesTab({ affiliates, defaultPct }: { affiliates: Affiliate[]; defaultPct: number }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pct, setPct] = useState(defaultPct);

  function add() {
    if (!name.trim() || !email.trim()) return;
    createAffiliate({
      name: name.trim(),
      email: email.trim(),
      commissionPercent: pct,
      status: "active",
    });
    setName("");
    setEmail("");
    toast.success("Affiliate created");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-bold">Add affiliate</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            placeholder="Commission %"
          />
          <button onClick={add} className="rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background">
            Create + generate code
          </button>
        </div>
      </div>

      {affiliates.length === 0 ? (
        <p className="text-sm text-muted-foreground">No affiliates yet.</p>
      ) : (
        <ul className="space-y-3">
          {affiliates.map((a) => {
            const stats = affiliateStats(a.code);
            const link = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${a.code}`;
            return (
              <li key={a.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground">{a.email}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-bold">{a.code}</code>
                      <span className="text-[11px] text-muted-foreground">{a.commissionPercent}% commission</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          a.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        toast.success("Link copied");
                      }}
                      className="rounded-md border border-border bg-muted px-3 py-1 text-xs font-semibold"
                    >
                      Copy link
                    </button>
                    <button
                      onClick={() => updateAffiliate(a.id, { status: a.status === "active" ? "paused" : "active" })}
                      className="rounded-md border border-border px-3 py-1 text-xs font-semibold"
                    >
                      {a.status === "active" ? "Pause" : "Activate"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete affiliate ${a.name}?`)) deleteAffiliate(a.id);
                      }}
                      className="rounded-md border border-destructive/40 px-3 py-1 text-xs font-semibold text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-6">
                  <Mini label="Clicks" value={stats.clicks} />
                  <Mini label="Signups" value={stats.signups} />
                  <Mini label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
                  <Mini label="Earned" value={`$${stats.earned.toFixed(2)}`} />
                  <Mini label="Paid" value={`$${stats.paidOut.toFixed(2)}`} />
                  <Mini label="Owed" value={`$${stats.balance.toFixed(2)}`} highlight />
                </div>
                <div className="mt-2 truncate text-[11px] text-muted-foreground">{link}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Mini({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-md p-2 text-center ${highlight ? "bg-amber-50" : "bg-muted/50"}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}

// ───────── Conversions

function ConversionsTab({ conversions, affiliates }: { conversions: Conversion[]; affiliates: Affiliate[] }) {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("0");
  const [plan, setPlan] = useState("");

  function add() {
    if (!code.trim() || !amount) return;
    recordConversion({
      code: code.trim(),
      email: email.trim() || undefined,
      amount: Number(amount),
      plan: plan || undefined,
    });
    setEmail("");
    setAmount("0");
    setPlan("");
    toast.success("Conversion logged");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-bold">Log conversion (manual)</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <select value={code} onChange={(e) => setCode(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm">
            <option value="">Select affiliate…</option>
            {affiliates.map((a) => (
              <option key={a.id} value={a.code}>{a.code} — {a.name}</option>
            ))}
          </select>
          <input placeholder="Customer email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <input placeholder="Plan" value={plan} onChange={(e) => setPlan(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <input type="number" min={0} step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <button onClick={add} className="rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background">Log</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Plan</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Commission</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {conversions.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-sm text-muted-foreground">No conversions yet.</td></tr>
            )}
            {conversions.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-3 py-2 text-[12px]">{new Date(c.ts).toLocaleString()}</td>
                <td className="px-3 py-2 font-mono text-[12px]">{c.code}</td>
                <td className="px-3 py-2 text-[12px]">{c.email ?? "—"}</td>
                <td className="px-3 py-2 text-[12px]">{c.plan ?? "—"}</td>
                <td className="px-3 py-2 text-[12px]">${c.amount.toFixed(2)}</td>
                <td className="px-3 py-2 text-[12px] font-bold">${c.commission.toFixed(2)}</td>
                <td className="px-3 py-2">
                  <select
                    value={c.status}
                    onChange={(e) => updateConversion(c.id, { status: e.target.value as Conversion["status"] })}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="void">Void</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ───────── Payouts

function PayoutsTab({ affiliates }: { affiliates: Affiliate[] }) {
  const { payouts } = useReferrals();
  const [affiliateId, setAffiliateId] = useState("");
  const [amount, setAmount] = useState("0");
  const [method, setMethod] = useState("PayPal");
  const [reference, setReference] = useState("");

  function add() {
    if (!affiliateId || !amount) return;
    recordPayout({ affiliateId, amount: Number(amount), method, reference });
    setAmount("0");
    setReference("");
    toast.success("Payout logged");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-bold">Log payout</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <select value={affiliateId} onChange={(e) => setAffiliateId(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm">
            <option value="">Select affiliate…</option>
            {affiliates.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
          </select>
          <input type="number" min={0} step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm">
            <option>PayPal</option>
            <option>Bank transfer</option>
            <option>Wise</option>
            <option>Stripe</option>
            <option>Other</option>
          </select>
          <input placeholder="Reference / txn id" value={reference} onChange={(e) => setReference(e.target.value)} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <button onClick={add} className="rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background">Log payout</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Affiliate</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Method</th>
              <th className="px-3 py-2">Reference</th>
            </tr>
          </thead>
          <tbody>
            {payouts.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-sm text-muted-foreground">No payouts yet.</td></tr>
            )}
            {payouts.map((p) => {
              const a = affiliates.find((x) => x.id === p.affiliateId);
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-3 py-2 text-[12px]">{new Date(p.ts).toLocaleString()}</td>
                  <td className="px-3 py-2 text-[12px]">{a?.name ?? p.affiliateId}</td>
                  <td className="px-3 py-2 text-[12px] font-bold">${p.amount.toFixed(2)}</td>
                  <td className="px-3 py-2 text-[12px]">{p.method}</td>
                  <td className="px-3 py-2 text-[12px]">{p.reference ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ───────── Settings

function SettingsTab({ settings }: { settings: ReturnType<typeof useReferrals>["settings"] }) {
  const [draft, setDraft] = useState(settings);
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Default commission %">
          <input type="number" min={0} max={100} value={draft.defaultCommissionPercent} onChange={(e) => setDraft({ ...draft, defaultCommissionPercent: Number(e.target.value) })} className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
        </Field>
        <Field label="Cookie window (days)">
          <input type="number" min={1} max={365} value={draft.cookieDays} onChange={(e) => setDraft({ ...draft, cookieDays: Number(e.target.value) })} className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
        </Field>
        <Field label="Minimum payout ($)">
          <input type="number" min={0} step="0.01" value={draft.payoutThreshold} onChange={(e) => setDraft({ ...draft, payoutThreshold: Number(e.target.value) })} className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
        </Field>
        <Field label="Program terms URL">
          <input value={draft.termsUrl} onChange={(e) => setDraft({ ...draft, termsUrl: e.target.value })} className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
        </Field>
      </div>
      <button
        onClick={() => {
          saveReferralSettings(draft);
          toast.success("Settings saved");
        }}
        className="rounded-md bg-foreground px-4 py-2 text-xs font-bold text-background"
      >
        Save settings
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
