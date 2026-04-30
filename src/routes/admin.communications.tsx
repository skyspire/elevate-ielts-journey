import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Megaphone,
  Mail,
  Send,
  Trash2,
  Plus,
  Inbox,
  PlayCircle,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  type Announcement,
  type AudienceFilter,
  type EmailTemplate,
  audienceLabel,
  audienceSize,
  blankAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getOutbox,
  getTemplates,
  runAutoReminders,
  saveTemplates,
  upsertAnnouncement,
  useCommsData,
  sendInboxMessage,
  getInboxFor,
  deleteInboxMessage,
  sendTemplatedEmail,
} from "@/lib/admin/comms-store";
import { ALL_PLANS, getLearnerRows, planLabel, type PlanKey } from "@/lib/admin/subscribers-store";
import { useSession } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/communications")({
  head: () => ({
    meta: [{ title: "Communications — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: CommsPage,
});

function CommsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Communications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Broadcast announcements, edit email templates, and message learners directly. Emails are
          logged to a mock outbox (no real mail is sent in the prototype).
        </p>
      </div>
      <Tabs defaultValue="announce">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="announce">
            <Megaphone className="mr-1.5 h-3.5 w-3.5" /> Announcements
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Mail className="mr-1.5 h-3.5 w-3.5" /> Email templates
          </TabsTrigger>
          <TabsTrigger value="inbox">
            <Inbox className="mr-1.5 h-3.5 w-3.5" /> Per-learner inbox
          </TabsTrigger>
          <TabsTrigger value="outbox">
            <Send className="mr-1.5 h-3.5 w-3.5" /> Outbox
          </TabsTrigger>
        </TabsList>
        <TabsContent value="announce" className="mt-5">
          <AnnouncementsTab />
        </TabsContent>
        <TabsContent value="templates" className="mt-5">
          <TemplatesTab />
        </TabsContent>
        <TabsContent value="inbox" className="mt-5">
          <InboxTab />
        </TabsContent>
        <TabsContent value="outbox" className="mt-5">
          <OutboxTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ───────── Announcements ─────────

function AnnouncementsTab() {
  const list = useCommsData(getAnnouncements);
  const [editing, setEditing] = useState<Announcement | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing(blankAnnouncement())}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> New announcement
        </Button>
      </div>
      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{a.title || "(untitled)"}</span>
                  <Badge variant={a.publishedAt ? "default" : "secondary"} className="text-[9px]">
                    {a.publishedAt ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant="outline" className="text-[9px]">
                    {audienceLabel(a.audience)} · {audienceSize(a.audience)}
                  </Badge>
                </div>
                <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.body}</div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(a)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm("Delete this announcement?")) deleteAnnouncement(a.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <AnnouncementDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(a) => {
            upsertAnnouncement(a);
            setEditing(null);
            toast.success("Saved.");
          }}
        />
      )}
    </div>
  );
}

function AnnouncementDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: Announcement;
  onClose: () => void;
  onSave: (a: Announcement) => void;
}) {
  const [a, setA] = useState<Announcement>(initial);
  const setAud = (patch: Partial<AudienceFilter>) =>
    setA({ ...a, audience: { ...a.audience, ...patch } });
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Announcement</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} />
          </div>
          <div>
            <Label>Body</Label>
            <Textarea
              rows={5}
              value={a.body}
              onChange={(e) => setA({ ...a, body: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Variant</Label>
              <Select
                value={a.variant ?? "info"}
                onValueChange={(v) => setA({ ...a, variant: v as Announcement["variant"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="promo">Promo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Audience</Label>
              <Select
                value={a.audience.segment}
                onValueChange={(v) => setAud({ segment: v as AudienceFilter["segment"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All learners</SelectItem>
                  <SelectItem value="active">Active subs</SelectItem>
                  <SelectItem value="trialing">On trial</SelectItem>
                  <SelectItem value="expired">Expired / free</SelectItem>
                  <SelectItem value="plan">Specific plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {a.audience.segment === "plan" && (
              <div>
                <Label>Plan</Label>
                <Select
                  value={a.audience.plan ?? "free"}
                  onValueChange={(v) => setAud({ plan: v as PlanKey })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_PLANS.map((p) => (
                      <SelectItem key={p} value={p}>{planLabel(p)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Will reach <b>{audienceSize(a.audience)}</b> learner(s).
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={() => onSave({ ...a, publishedAt: undefined })}>
            Save draft
          </Button>
          <Button onClick={() => onSave({ ...a, publishedAt: Date.now() })}>
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ───────── Templates ─────────

function TemplatesTab() {
  const list = useCommsData(getTemplates);
  const [draft, setDraft] = useState<EmailTemplate[]>(list);
  const dirty = JSON.stringify(draft) !== JSON.stringify(list);

  const update = (key: string, patch: Partial<EmailTemplate>) =>
    setDraft((d) => d.map((t) => (t.key === key ? { ...t, ...patch } : t)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Use <code>{"{{name}}"}</code>, <code>{"{{plan}}"}</code>, <code>{"{{days}}"}</code>,{" "}
          <code>{"{{expiresAt}}"}</code>, <code>{"{{currency}}"}</code>, <code>{"{{amount}}"}</code> in
          subjects/bodies.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const r = runAutoReminders();
              toast.success(`Auto-reminders run · ${r.sent} email(s) sent.`);
            }}
          >
            <PlayCircle className="mr-1.5 h-3.5 w-3.5" /> Run reminders now
          </Button>
          <Button size="sm" disabled={!dirty} onClick={() => { saveTemplates(draft); toast.success("Saved."); }}>
            Save
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {draft.map((t) => (
          <div key={t.key} className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="font-bold">{t.label}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  key: {t.key}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Enabled</Label>
                <Switch
                  checked={t.enabled}
                  onCheckedChange={(v) => update(t.key, { enabled: v })}
                />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Subject</Label>
                <Input
                  value={t.subject}
                  onChange={(e) => update(t.key, { subject: e.target.value })}
                />
              </div>
              {t.triggerDaysBefore != null && (
                <div>
                  <Label className="text-xs">Trigger days before expiry</Label>
                  <Input
                    type="number"
                    value={t.triggerDaysBefore}
                    onChange={(e) =>
                      update(t.key, { triggerDaysBefore: Number(e.target.value) || 0 })
                    }
                  />
                </div>
              )}
            </div>
            <div className="mt-2">
              <Label className="text-xs">Body</Label>
              <Textarea
                rows={5}
                value={t.body}
                onChange={(e) => update(t.key, { body: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────── Inbox (per-learner) ─────────

function InboxTab() {
  const { user: me } = useSession();
  const rows = useCommsData(getLearnerRows);
  const [userId, setUserId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const messages = useCommsData(() => (userId ? getInboxFor(userId) : []));

  const send = () => {
    if (!userId) return toast.error("Pick a learner.");
    if (!subject.trim() || !body.trim()) return toast.error("Subject and body required.");
    sendInboxMessage({
      userId,
      fromAdmin: me?.name ?? "Admin",
      subject,
      body,
    });
    setSubject("");
    setBody("");
    toast.success("Message sent.");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="font-bold">Send a private note</div>
        <div>
          <Label>Learner</Label>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              {rows.map((r) => (
                <SelectItem key={r.user.id} value={r.user.id}>
                  {r.user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div>
          <Label>Body</Label>
          <Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <Button onClick={send}>
          <Send className="mr-1.5 h-3.5 w-3.5" /> Send
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 font-bold">Existing messages {userId && `(${messages.length})`}</div>
        {!userId ? (
          <div className="text-sm text-muted-foreground">Pick a learner to view messages.</div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">No messages.</div>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm">{m.subject}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteInboxMessage(m.userId, m.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {m.fromAdmin} · {new Date(m.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 whitespace-pre-wrap text-sm">{m.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────── Outbox ─────────

function OutboxTab() {
  const list = useCommsData(getOutbox);
  const rows = useCommsData(getLearnerRows);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const preview = list.find((o) => o.id === previewId) ?? null;

  // Quick "send template now" UI
  const [tplKey, setTplKey] = useState("welcome");
  const [userId, setUserId] = useState("");
  const templates = useCommsData(getTemplates);
  const sendNow = () => {
    const r = rows.find((x) => x.user.id === userId);
    if (!r) return toast.error("Pick a learner.");
    const e = sendTemplatedEmail({
      templateKey: tplKey,
      to: r.user.email,
      vars: {
        name: r.user.name,
        plan: r.sub.plan,
        days: "0",
        expiresAt: r.sub.expiresAt ? new Date(r.sub.expiresAt).toLocaleDateString() : "",
      },
      reason: `manual: ${tplKey}`,
    });
    if (e) toast.success("Sent (mock).");
    else toast.error("Template missing or disabled.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 font-bold">Send template manually</div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Select value={tplKey} onValueChange={setTplKey}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={userId} onValueChange={setUserId}>
            <SelectTrigger><SelectValue placeholder="Learner" /></SelectTrigger>
            <SelectContent>
              {rows.map((r) => (
                <SelectItem key={r.user.id} value={r.user.id}>{r.user.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={sendNow}>Send</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Template</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Reason</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Outbox is empty. Run reminders or send a template manually.
                </td>
              </tr>
            ) : (
              list.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-xs">{new Date(o.sentAt).toLocaleString()}</td>
                  <td className="px-3 py-2 text-xs">{o.to}</td>
                  <td className="px-3 py-2 text-xs">{o.templateKey}</td>
                  <td className="px-3 py-2 text-xs">{o.subject}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{o.reason}</td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setPreviewId(o.id)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {preview && (
        <Dialog open onOpenChange={() => setPreviewId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{preview.subject}</DialogTitle>
            </DialogHeader>
            <div className="text-xs text-muted-foreground">
              To: {preview.to} · {new Date(preview.sentAt).toLocaleString()}
            </div>
            <pre className="mt-3 whitespace-pre-wrap rounded bg-muted p-3 text-sm">
              {preview.body}
            </pre>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// silence unused-imports lint when audience size shows zero
useMemo;
