import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useCallback } from "react";
import {
  Users,
  Crown,
  CreditCard,
  Receipt,
  Settings as SettingsIcon,
  LayoutDashboard,
  Trash2,
  Pencil,
  UserCheck,
  Ban,
  Download,
  Plus,
  X,
  Gift,
  Lock,
  Unlock,
  LogIn,
  Search,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  useSession,
  canManageUsers,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type AdminUser,
  type AdminRole,
} from "@/lib/admin/auth";
import {
  type LearnerUser,
  updateLearner,
  deleteLearner,
  impersonateLearner,
  adminCreateLearner,
} from "@/lib/learner-auth";
import {
  ALL_PLANS,
  type PlanKey,
  type SubStatus,
  type SubscriberProfile,
  type Subscription,
  type BillingEntry,
  planLabel,
  getProfile,
  upsertProfile,
  getSub,
  upsertSub,
  assignPlan,
  grantTrial,
  cancelSub,
  extendSub,
  isSubActive,
  getBilling,
  getBillingForUser,
  addBillingEntry,
  deleteBillingEntry,
  getSubscribersSettings,
  saveSubscribersSettings,
  getLearnerRows,
  getDashboardStats,
  exportLearnersCsv,
  useSubscribersData,
} from "@/lib/admin/subscribers-store";
import { resolveEbooks } from "@/lib/admin/ebooks-store";
import { ebooks as defaultEbooks } from "@/data/ebooks";

export const Route = createFileRoute("/admin/accounts")({
  head: () => ({
    meta: [{ title: "Accounts — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const { user: me } = useSession();

  if (!me) return null;
  const canManage = canManageUsers(me);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full control of subscribers, admin team, subscriptions, and billing.
        </p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="learners">
            <Users className="mr-1.5 h-3.5 w-3.5" /> Learners
          </TabsTrigger>
          {canManage && (
            <TabsTrigger value="admins">
              <Crown className="mr-1.5 h-3.5 w-3.5" /> Admin Team
            </TabsTrigger>
          )}
          <TabsTrigger value="subs">
            <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Subscriptions
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Receipt className="mr-1.5 h-3.5 w-3.5" /> Billing
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="mr-1.5 h-3.5 w-3.5" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-5">
          <DashboardTab />
        </TabsContent>
        <TabsContent value="learners" className="mt-5">
          <LearnersTab canDestructive={canManage} />
        </TabsContent>
        {canManage && (
          <TabsContent value="admins" className="mt-5">
            <AdminTeamTab meId={me.id} />
          </TabsContent>
        )}
        <TabsContent value="subs" className="mt-5">
          <SubscriptionsTab />
        </TabsContent>
        <TabsContent value="billing" className="mt-5">
          <BillingTab />
        </TabsContent>
        <TabsContent value="settings" className="mt-5">
          <SubsSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ───────── Dashboard ─────────

function DashboardTab() {
  const stats = useSubscribersData(getDashboardStats);
  const cards = [
    { label: "Total learners", value: stats.total },
    { label: "Active subscribers", value: stats.active },
    { label: "On trial", value: stats.trialing },
    { label: "Cancelled this month", value: stats.cancelledThisMonth },
    { label: "Churn rate", value: `${stats.churn}%` },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {c.label}
            </div>
            <div className="mt-1 font-display text-2xl font-extrabold">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Revenue this month (manual entries)
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {Object.entries(stats.monthRevenueByCcy).length === 0 ? (
            <span className="text-sm text-muted-foreground">No billing entries this month.</span>
          ) : (
            Object.entries(stats.monthRevenueByCcy).map(([c, v]) => (
              <div key={c} className="rounded-lg bg-muted px-3 py-1.5 text-sm font-bold">
                {c} {v.toFixed(2)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ───────── Learners tab (full control) ─────────

function LearnersTab({ canDestructive }: { canDestructive: boolean }) {
  const rows = useSubscribersData(getLearnerRows);
  const [q, setQ] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | PlanKey>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | SubStatus>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (planFilter !== "all" && r.sub.plan !== planFilter) return false;
      if (statusFilter !== "all" && r.sub.status !== statusFilter) return false;
      if (!ql) return true;
      return (
        r.user.email.toLowerCase().includes(ql) ||
        r.user.name.toLowerCase().includes(ql) ||
        r.profile.tags.join(" ").toLowerCase().includes(ql) ||
        r.profile.country.toLowerCase().includes(ql)
      );
    });
  }, [rows, q, planFilter, statusFilter]);

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allSelected = filtered.length > 0 && filtered.every((r) => selected.has(r.user.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((r) => r.user.id)));
  };

  const bulkDelete = () => {
    if (!confirm(`Delete ${selected.size} learner(s)? This cannot be undone.`)) return;
    selected.forEach((id) => deleteLearner(id));
    setSelected(new Set());
    toast.success("Deleted.");
  };
  const bulkBlock = (blocked: boolean) => {
    selected.forEach((id) => {
      const p = getProfile(id);
      upsertProfile({ ...p, blocked });
    });
    setSelected(new Set());
    toast.success(blocked ? "Blocked." : "Unblocked.");
  };
  const bulkAssignPlan = (plan: PlanKey) => {
    selected.forEach((id) => assignPlan(id, plan, plan === "biweekly" ? 14 : plan === "monthly" ? 30 : plan === "quarterly" ? 90 : undefined));
    setSelected(new Set());
    toast.success(`Assigned ${planLabel(plan)}.`);
  };

  const exportCsv = () => {
    const csv = exportLearnersCsv();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learners-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by email, name, country, tag…"
            className="pl-8"
          />
        </div>
        <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as "all" | PlanKey)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            {ALL_PLANS.map((p) => (
              <SelectItem key={p} value={p}>
                {planLabel(p)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | SubStatus)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trialing">Trialing</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> CSV
        </Button>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New learner
        </Button>
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
          <span className="text-xs font-bold">{selected.size} selected</span>
          <Select onValueChange={(v) => bulkAssignPlan(v as PlanKey)}>
            <SelectTrigger className="h-8 w-40">
              <SelectValue placeholder="Assign plan…" />
            </SelectTrigger>
            <SelectContent>
              {ALL_PLANS.map((p) => (
                <SelectItem key={p} value={p}>
                  {planLabel(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => bulkBlock(true)}>
            <Ban className="mr-1.5 h-3.5 w-3.5" /> Block
          </Button>
          <Button variant="outline" size="sm" onClick={() => bulkBlock(false)}>
            <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Unblock
          </Button>
          {canDestructive && (
            <Button variant="destructive" size="sm" onClick={bulkDelete}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
            </Button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="px-3 py-2">Learner</th>
              <th className="px-3 py-2">Plan</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Expires</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">Joined</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No learners match.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.user.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(r.user.id)}
                      onChange={() => toggle(r.user.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{r.user.name}</div>
                    <div className="text-xs text-muted-foreground">{r.user.email}</div>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {r.profile.blocked && (
                        <Badge variant="destructive" className="text-[9px]">Blocked</Badge>
                      )}
                      {r.profile.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[9px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">{planLabel(r.sub.plan)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={r.sub.status} />
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {r.sub.expiresAt ? new Date(r.sub.expiresAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-xs">{r.profile.country || "—"}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {new Date(r.user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(r.user.id)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {createOpen && <NewLearnerDialog onClose={() => setCreateOpen(false)} />}
      {editingId && (
        <LearnerEditDialog
          userId={editingId}
          canDestructive={canDestructive}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: SubStatus }) {
  const variant: Record<SubStatus, string> = {
    active: "bg-emerald-100 text-emerald-700",
    trialing: "bg-blue-100 text-blue-700",
    paused: "bg-amber-100 text-amber-700",
    cancelled: "bg-rose-100 text-rose-700",
    expired: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${variant[status]}`}
    >
      {status}
    </span>
  );
}

function NewLearnerDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const submit = () => {
    if (!email || !name || !password) {
      toast.error("Fill all fields.");
      return;
    }
    const r = adminCreateLearner({ email, name, password });
    if (!r.ok) {
      toast.error(r.error);
      return;
    }
    toast.success("Learner created.");
    onClose();
  };
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create learner</DialogTitle>
          <DialogDescription>Add a learner account manually.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="text" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LearnerEditDialog({
  userId,
  canDestructive,
  onClose,
}: {
  userId: string;
  canDestructive: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  // re-read each render via useSubscribersData so dialog stays in sync
  const data = useSubscribersData(() => {
    const rows = getLearnerRows();
    return rows.find((r) => r.user.id === userId) ?? null;
  });
  const [tagInput, setTagInput] = useState("");
  const [resourceInput, setResourceInput] = useState("");
  const settings = getSubscribersSettings();

  // resolved ebooks for the unlock picker
  const ebooks = useMemo(
    () => resolveEbooks({ order: [], hidden: [], overrides: {}, custom: [] }).concat(defaultEbooks).filter((e, i, a) => a.findIndex((x) => x.id === e.id) === i),
    [],
  );

  if (!data) return null;
  const { user, profile, sub } = data;

  const updateUserField = (patch: Partial<LearnerUser>) => updateLearner(user.id, patch);
  const updateProfile = (patch: Partial<SubscriberProfile>) =>
    upsertProfile({ ...profile, ...patch });
  const updateSubField = (patch: Partial<Subscription>) => upsertSub({ ...sub, ...patch });

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (profile.tags.includes(v)) return;
    updateProfile({ tags: [...profile.tags, v] });
    setTagInput("");
  };
  const removeTag = (t: string) =>
    updateProfile({ tags: profile.tags.filter((x) => x !== t) });

  const toggleUnlock = (resourceId: string) => {
    const has = profile.resourceUnlocks.includes(resourceId);
    updateProfile({
      resourceUnlocks: has
        ? profile.resourceUnlocks.filter((x) => x !== resourceId)
        : [...profile.resourceUnlocks, resourceId],
    });
  };

  const addCustomUnlock = () => {
    const v = resourceInput.trim();
    if (!v || profile.resourceUnlocks.includes(v)) return;
    updateProfile({ resourceUnlocks: [...profile.resourceUnlocks, v] });
    setResourceInput("");
  };

  const billing = getBillingForUser(user.id);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="account">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="sub">Subscription</TabsTrigger>
            <TabsTrigger value="unlocks">Resource access</TabsTrigger>
            <TabsTrigger value="billing">Billing ({billing.length})</TabsTrigger>
            <TabsTrigger value="meta">Tags & notes</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input
                  value={user.name}
                  onChange={(e) => updateUserField({ name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={user.email}
                  onChange={(e) => updateUserField({ email: e.target.value })}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  value={user.password}
                  onChange={(e) => updateUserField({ password: e.target.value })}
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  value={profile.country}
                  onChange={(e) => updateProfile({ country: e.target.value })}
                />
              </div>
              <div>
                <Label>Signup source</Label>
                <Input
                  value={profile.source}
                  onChange={(e) => updateProfile({ source: e.target.value })}
                  placeholder="organic, google, referral…"
                />
              </div>
              <div>
                <Label>Last login</Label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {profile.lastLoginAt
                    ? new Date(profile.lastLoginAt).toLocaleString()
                    : "Never tracked"}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateProfile({ lastLoginAt: Date.now() })}
                  >
                    Mark now
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateProfile({ verifiedAt: Date.now() })}
              >
                <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                {profile.verifiedAt ? "Re-verify" : "Mark verified"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateProfile({ blocked: !profile.blocked })}
              >
                {profile.blocked ? (
                  <>
                    <Unlock className="mr-1.5 h-3.5 w-3.5" /> Unblock
                  </>
                ) : (
                  <>
                    <Lock className="mr-1.5 h-3.5 w-3.5" /> Block
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  impersonateLearner(user.id);
                  toast.success(`Now logged in as ${user.email}`);
                  navigate({ to: "/dashboard" });
                }}
              >
                <LogIn className="mr-1.5 h-3.5 w-3.5" /> Login as
              </Button>
              {canDestructive && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (!confirm(`Delete ${user.email}?`)) return;
                    deleteLearner(user.id);
                    toast.success("Deleted.");
                    onClose();
                  }}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sub" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Plan</Label>
                <Select
                  value={sub.plan}
                  onValueChange={(v) => updateSubField({ plan: v as PlanKey })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_PLANS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {planLabel(p)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={sub.status}
                  onValueChange={(v) => updateSubField({ status: v as SubStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trialing">Trialing</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Started</Label>
                <Input
                  type="date"
                  value={sub.startedAt ? new Date(sub.startedAt).toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    updateSubField({
                      startedAt: e.target.value ? new Date(e.target.value).getTime() : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label>Expires</Label>
                <Input
                  type="date"
                  value={sub.expiresAt ? new Date(sub.expiresAt).toISOString().slice(0, 10) : ""}
                  onChange={(e) =>
                    updateSubField({
                      expiresAt: e.target.value ? new Date(e.target.value).getTime() : undefined,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => extendSub(user.id, 7)}>
                <Calendar className="mr-1.5 h-3.5 w-3.5" /> +7 days
              </Button>
              <Button size="sm" variant="outline" onClick={() => extendSub(user.id, 30)}>
                <Calendar className="mr-1.5 h-3.5 w-3.5" /> +30 days
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => grantTrial(user.id, settings.defaultTrialDays)}
              >
                <Gift className="mr-1.5 h-3.5 w-3.5" />
                Grant {settings.defaultTrialDays}-day trial
              </Button>
              <Button size="sm" variant="destructive" onClick={() => cancelSub(user.id)}>
                Cancel subscription
              </Button>
            </div>
            <div>
              <Label>Admin note</Label>
              <Textarea
                value={sub.adminNote ?? ""}
                onChange={(e) => updateSubField({ adminNote: e.target.value })}
                rows={2}
              />
            </div>
          </TabsContent>

          <TabsContent value="unlocks" className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Unlock specific resources for this learner regardless of their plan.
            </p>
            <div>
              <Label className="mb-2 block">E-books</Label>
              <div className="space-y-1 rounded-lg border border-border p-2 max-h-64 overflow-y-auto">
                {ebooks.slice(0, 30).map((b) => {
                  const id = `ebook:${b.id}`;
                  const has = profile.resourceUnlocks.includes(id);
                  return (
                    <label
                      key={b.id}
                      className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted text-sm"
                    >
                      <input type="checkbox" checked={has} onChange={() => toggleUnlock(id)} />
                      <span className="flex-1 truncate">{b.title}</span>
                      <Badge variant="outline" className="text-[9px]">
                        {b.category}
                      </Badge>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Custom resource id</Label>
              <div className="flex gap-2">
                <Input
                  value={resourceInput}
                  onChange={(e) => setResourceInput(e.target.value)}
                  placeholder="e.g. section:writing-task-2"
                />
                <Button size="sm" onClick={addCustomUnlock}>
                  Add
                </Button>
              </div>
              {profile.resourceUnlocks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.resourceUnlocks.map((id) => (
                    <Badge key={id} variant="secondary" className="gap-1">
                      {id}
                      <button onClick={() => toggleUnlock(id)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-4 space-y-3">
            <BillingForUser userId={user.id} />
          </TabsContent>

          <TabsContent value="meta" className="mt-4 space-y-3">
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="vip, refund-risk, beta…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>
              {profile.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="gap-1">
                      {t}
                      <button onClick={() => removeTag(t)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={profile.notes}
                onChange={(e) => updateProfile({ notes: e.target.value })}
                rows={5}
                placeholder="Internal notes about this learner…"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BillingForUser({ userId }: { userId: string }) {
  const list = useSubscribersData(() => getBillingForUser(userId));
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [method, setMethod] = useState("manual");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  const submit = () => {
    const a = Number(amount);
    if (!a || a <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    addBillingEntry({ userId, amount: a, currency, method, reference, note });
    setAmount("");
    setReference("");
    setNote("");
    toast.success("Entry added.");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Currency" value={currency} onChange={(e) => setCurrency(e.target.value.toUpperCase())} />
        <Input placeholder="Method" value={method} onChange={(e) => setMethod(e.target.value)} />
        <Input placeholder="Reference" value={reference} onChange={(e) => setReference(e.target.value)} />
        <Button size="sm" onClick={submit}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
        </Button>
      </div>
      <Input placeholder="Optional note" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="rounded-lg border border-border">
        {list.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            No billing entries yet.
          </div>
        ) : (
          list.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between border-b border-border px-3 py-2 last:border-0 text-sm"
            >
              <div>
                <div className="font-bold">
                  {e.currency} {e.amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {e.method} · {e.reference || "—"} ·{" "}
                  {new Date(e.createdAt).toLocaleDateString()}
                </div>
                {e.note && <div className="text-xs italic">{e.note}</div>}
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteBillingEntry(e.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ───────── Admin team tab ─────────

function AdminTeamTab({ meId }: { meId: string }) {
  const [users, setUsers] = useState<AdminUser[]>(() => getUsers());
  const refresh = useCallback(() => setUsers(getUsers()), []);
  // simple subscribe
  useMemoSubscribe("admin:users-changed", refresh);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");

  const add = () => {
    if (!email || !name || !password) {
      toast.error("Fill all fields.");
      return;
    }
    createUser({ email, name, password, role });
    setEmail("");
    setName("");
    setPassword("");
    toast.success("Admin added.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 text-sm font-bold">Add admin team member</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={add}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Password</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">
                  <Input
                    value={u.name}
                    onChange={(e) => updateUser(u.id, { name: e.target.value })}
                    className="h-8"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={u.email}
                    onChange={(e) => updateUser(u.id, { email: e.target.value })}
                    className="h-8"
                  />
                </td>
                <td className="px-3 py-2">
                  <Select
                    value={u.role}
                    onValueChange={(v) => updateUser(u.id, { role: v as AdminRole })}
                  >
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={u.password}
                    onChange={(e) => updateUser(u.id, { password: e.target.value })}
                    className="h-8"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  {u.id !== meId && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Delete ${u.email}?`)) deleteUser(u.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Tiny hook to re-render on a window event
function useMemoSubscribe(eventName: string, fn: () => void) {
  const [, set] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    if (typeof window === "undefined") return;
    const h = () => {
      fn();
      set((n) => n + 1);
    };
    window.addEventListener(eventName, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(eventName, h);
      window.removeEventListener("storage", h);
    };
  }, []);
}

// ───────── Subscriptions tab (focused on subs only) ─────────

function SubscriptionsTab() {
  const rows = useSubscribersData(getLearnerRows);
  const active = rows.filter((r) => isSubActive(r.sub));
  const expiring = rows
    .filter((r) => r.sub.expiresAt && r.sub.expiresAt > Date.now() && r.sub.expiresAt < Date.now() + 7 * 86400000)
    .sort((a, b) => (a.sub.expiresAt ?? 0) - (b.sub.expiresAt ?? 0));
  const cancelled = rows.filter((r) => r.sub.status === "cancelled");

  const Section = ({ title, list }: { title: string; list: typeof rows }) => (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title} · {list.length}
      </div>
      {list.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">None.</div>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {list.slice(0, 50).map((r) => (
              <tr key={r.user.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">
                  <div className="font-semibold">{r.user.name}</div>
                  <div className="text-xs text-muted-foreground">{r.user.email}</div>
                </td>
                <td className="px-3 py-2 text-sm">{planLabel(r.sub.plan)}</td>
                <td className="px-3 py-2"><StatusBadge status={r.sub.status} /></td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {r.sub.expiresAt ? new Date(r.sub.expiresAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Section title="Active subscriptions" list={active} />
      <Section title="Expiring within 7 days" list={expiring} />
      <Section title="Recently cancelled" list={cancelled} />
    </div>
  );
}

// ───────── Billing tab (global) ─────────

function BillingTab() {
  const list = useSubscribersData(getBilling);
  const rows = useSubscribersData(getLearnerRows);
  const userMap = useMemo(() => {
    const m: Record<string, string> = {};
    rows.forEach((r) => (m[r.user.id] = r.user.email));
    return m;
  }, [rows]);

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2">When</th>
            <th className="px-3 py-2">Learner</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Method</th>
            <th className="px-3 py-2">Reference</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted-foreground">
                No billing entries yet. Add them from a learner's profile.
              </td>
            </tr>
          ) : (
            list.map((e: BillingEntry) => (
              <tr key={e.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 text-xs">{new Date(e.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 text-xs">{userMap[e.userId] ?? e.userId}</td>
                <td className="px-3 py-2 font-bold">
                  {e.currency} {e.amount.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-xs">{e.method}</td>
                <td className="px-3 py-2 text-xs">{e.reference || "—"}</td>
                <td className="px-3 py-2 text-right">
                  <Button size="sm" variant="ghost" onClick={() => deleteBillingEntry(e.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ───────── Settings tab ─────────

function SubsSettingsTab() {
  const [s, setS] = useState(() => getSubscribersSettings());
  const save = () => {
    saveSubscribersSettings(s);
    toast.success("Saved.");
  };
  return (
    <div className="max-w-md space-y-3 rounded-xl border border-border bg-card p-5">
      <div>
        <Label>Default trial length (days)</Label>
        <Input
          type="number"
          value={s.defaultTrialDays}
          onChange={(e) => setS({ ...s, defaultTrialDays: Number(e.target.value) || 0 })}
        />
      </div>
      <Button onClick={save}>Save settings</Button>
    </div>
  );
}
