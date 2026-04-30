import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Download, Trash2, RotateCcw, Shield, Database } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  exportBackup,
  getSessionControls,
  getTrash,
  importBackup,
  importLearnersCsv,
  parseCsv,
  purgeFromTrash,
  restoreFromTrash,
  saveSessionControls,
  useOpsData,
  type SessionControls,
} from "@/lib/admin/ops-store";
import { getLearnerRows } from "@/lib/admin/subscribers-store";

export const Route = createFileRoute("/admin/ops")({
  head: () => ({
    meta: [{ title: "Operations — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: OpsPage,
});

function OpsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Operations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bulk import, backup &amp; restore, trash bin, and session security.
        </p>
      </div>
      <Tabs defaultValue="import">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="import"><Upload className="mr-1.5 h-3.5 w-3.5" /> CSV import</TabsTrigger>
          <TabsTrigger value="backup"><Database className="mr-1.5 h-3.5 w-3.5" /> Backup / restore</TabsTrigger>
          <TabsTrigger value="trash"><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Trash bin</TabsTrigger>
          <TabsTrigger value="session"><Shield className="mr-1.5 h-3.5 w-3.5" /> Session</TabsTrigger>
        </TabsList>
        <TabsContent value="import" className="mt-5"><ImportTab /></TabsContent>
        <TabsContent value="backup" className="mt-5"><BackupTab /></TabsContent>
        <TabsContent value="trash" className="mt-5"><TrashTab /></TabsContent>
        <TabsContent value="session" className="mt-5"><SessionTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function ImportTab() {
  const [text, setText] = useState("");
  const onFile = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setText(String(r.result ?? ""));
    r.readAsText(f);
  };
  const run = () => {
    const rows = parseCsv(text);
    if (rows.length === 0) return toast.error("No rows parsed.");
    const r = importLearnersCsv(rows);
    toast.success(`Created ${r.created}, updated ${r.updated}, skipped ${r.skipped}.`);
  };
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">
        Headers: <code>email, name, password, country, source, plan, status, expiresAt, tags</code>{" "}
        (tags pipe-separated). Email + name required; the rest optional.
      </p>
      <Input type="file" accept=".csv,text/csv" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      <textarea
        className="h-48 w-full rounded-md border border-border bg-background p-2 font-mono text-xs"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Or paste CSV here…"
      />
      <Button onClick={run}><Upload className="mr-1.5 h-3.5 w-3.5" /> Import</Button>
    </div>
  );
}

function BackupTab() {
  const [text, setText] = useState("");
  const download = () => {
    const b = exportBackup();
    const blob = new Blob([JSON.stringify(b, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bigielts-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const onFile = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setText(String(r.result ?? ""));
    r.readAsText(f);
  };
  const run = (mode: "merge" | "replace") => {
    try {
      const b = JSON.parse(text);
      if (mode === "replace" && !confirm("Replace ALL existing data? This wipes current learners, subs, etc.")) return;
      importBackup(b, mode);
      toast.success("Restored.");
    } catch {
      toast.error("Invalid JSON.");
    }
  };
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-2 font-bold">Export</div>
        <p className="mb-3 text-xs text-muted-foreground">
          Downloads a JSON file with all admin data (learners, subscriptions, billing, comms,
          coupons, gifts, settings, content overrides).
        </p>
        <Button onClick={download}><Download className="mr-1.5 h-3.5 w-3.5" /> Download backup</Button>
      </div>
      <div className="space-y-2 rounded-xl border border-border bg-card p-5">
        <div className="font-bold">Restore</div>
        <Input type="file" accept=".json,application/json" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        <textarea
          className="h-32 w-full rounded-md border border-border bg-background p-2 font-mono text-xs"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Or paste backup JSON here…"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => run("merge")}>Merge</Button>
          <Button variant="destructive" onClick={() => run("replace")}>Replace all</Button>
        </div>
      </div>
    </div>
  );
}

function TrashTab() {
  const trash = useOpsData(getTrash);
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <th className="px-3 py-2">Learner</th>
            <th className="px-3 py-2">Deleted</th>
            <th className="px-3 py-2">Auto-purge</th>
            <th className="px-3 py-2 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {trash.length === 0 ? (
            <tr><td colSpan={4} className="px-3 py-8 text-center text-sm text-muted-foreground">Trash is empty.</td></tr>
          ) : (
            trash.map((t) => {
              const purgeIn = Math.max(0, Math.ceil((t.deletedAt + 30 * 86400000 - Date.now()) / 86400000));
              return (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">
                    <div className="font-semibold">{t.user.name}</div>
                    <div className="text-xs text-muted-foreground">{t.user.email}</div>
                  </td>
                  <td className="px-3 py-2 text-xs">{new Date(t.deletedAt).toLocaleString()}</td>
                  <td className="px-3 py-2 text-xs">in {purgeIn} day(s)</td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => { restoreFromTrash(t.id); toast.success("Restored."); }}>
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Restore
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm("Permanently delete?")) purgeFromTrash(t.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function SessionTab() {
  const saved = useOpsData(getSessionControls);
  const [s, setS] = useState<SessionControls>(saved);
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);
  const rows = useOpsData(getLearnerRows);
  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <div className="font-bold">Admin session</div>
        <div>
          <Label>Auto-logout after (minutes, 0 = never)</Label>
          <Input
            type="number"
            value={s.adminTimeoutMinutes}
            onChange={(e) => setS({ ...s, adminTimeoutMinutes: Number(e.target.value) || 0 })}
          />
        </div>
        <Button disabled={!dirty} onClick={() => { saveSessionControls(s); toast.success("Saved."); }}>Save</Button>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-2 font-bold">Force-logout / require password reset</div>
        <p className="mb-3 text-xs text-muted-foreground">
          Use these to immediately invalidate a learner's session or require them to reset their password on next login.
        </p>
        <div className="text-xs text-muted-foreground">
          Per-learner controls are available in <b>Accounts → Learners → Edit → Account</b>.
          {" "}({rows.length} learner accounts.)
        </div>
      </div>
    </div>
  );
}
