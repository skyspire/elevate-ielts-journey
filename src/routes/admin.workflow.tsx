import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { exportAll } from "@/lib/admin/cms-store";
import {
  addSchedule,
  deleteSchedule,
  deleteVersion,
  getStatus,
  pushVersion,
  rollbackVersion,
  setStatus,
  useScheduleTicker,
  useWorkflow,
  type WorkflowStatus,
} from "@/lib/admin/workflow-store";
import { getSection } from "@/lib/admin/cms-store";
import { useSession } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/workflow")({
  head: () => ({ meta: [{ title: "Workflow — Admin" }, { name: "robots", content: "noindex" }] }),
  component: WorkflowPage,
});

function WorkflowPage() {
  useScheduleTicker();
  const { user } = useSession();
  const wf = useWorkflow();

  const sectionKeys = useMemo(() => {
    return Object.keys(exportAll()).sort();
  }, [wf.tick]);

  const [tab, setTab] = useState<"schedule" | "status" | "versions">("schedule");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Content workflow</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Schedule publishing, manage draft → review → published status, and roll back to any
          previous version.
        </p>
      </header>

      <div className="flex gap-1 rounded-md bg-muted p-1 text-xs font-semibold">
        {(["schedule", "status", "versions"] as const).map((t) => (
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

      {tab === "schedule" && (
        <ScheduleTab sectionKeys={sectionKeys} userName={user?.name} schedules={wf.schedules} />
      )}
      {tab === "status" && <StatusTab sectionKeys={sectionKeys} userName={user?.name} />}
      {tab === "versions" && <VersionsTab sectionKeys={sectionKeys} userName={user?.name} />}
    </div>
  );
}

// ─────────────────── Schedule

function ScheduleTab({
  sectionKeys,
  userName,
  schedules,
}: {
  sectionKeys: string[];
  userName?: string;
  schedules: ReturnType<typeof useWorkflow>["schedules"];
}) {
  const [key, setKey] = useState(sectionKeys[0] ?? "");
  const [publishAt, setPublishAt] = useState(new Date(Date.now() + 3600_000).toISOString().slice(0, 16));
  const [expireAt, setExpireAt] = useState("");
  const [payloadText, setPayloadText] = useState("");
  const [error, setError] = useState("");

  function loadCurrent() {
    if (!key) return;
    setPayloadText(JSON.stringify(getSection(key, null), null, 2));
    setError("");
  }
  function submit() {
    setError("");
    try {
      const payload = payloadText ? JSON.parse(payloadText) : getSection(key, null);
      addSchedule({
        key,
        payload,
        publishAt: new Date(publishAt).getTime(),
        expireAt: expireAt ? new Date(expireAt).getTime() : undefined,
        expirePayload: expireAt ? getSection(key, null) : undefined,
        createdBy: userName,
      });
      setPayloadText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-bold text-foreground">Schedule a change</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Section">
            <select
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            >
              {sectionKeys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Publish at">
            <input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            />
          </Field>
          <Field label="Auto-expire at (optional)">
            <input
              type="datetime-local"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            />
          </Field>
          <div className="flex items-end">
            <button
              type="button"
              onClick={loadCurrent}
              className="rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-semibold"
            >
              Load current value
            </button>
          </div>
        </div>
        <Field label="Payload JSON (leave blank to publish current value)">
          <textarea
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-border bg-background p-2 font-mono text-xs"
            placeholder="{ ... }"
          />
        </Field>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        <button
          onClick={submit}
          disabled={!key}
          className="mt-3 rounded-md bg-foreground px-4 py-2 text-xs font-bold text-background disabled:opacity-50"
        >
          Schedule
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3 text-sm font-bold">Upcoming & history</div>
        {schedules.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No scheduled changes.</p>
        ) : (
          <ul className="divide-y divide-border">
            {schedules
              .slice()
              .sort((a, b) => b.publishAt - a.publishAt)
              .map((s) => (
                <li key={`${s.key}-${s.publishAt}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{s.key}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Publish: {new Date(s.publishAt).toLocaleString()}
                      {s.expireAt && <> · Expire: {new Date(s.expireAt).toLocaleString()}</>}
                      {s.createdBy && <> · by {s.createdBy}</>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        s.expired
                          ? "bg-muted text-muted-foreground"
                          : s.applied
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {s.expired ? "Expired" : s.applied ? "Live" : "Pending"}
                    </span>
                    <button
                      onClick={() => deleteSchedule(s.key, s.publishAt)}
                      className="text-xs font-semibold text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─────────────────── Status

function StatusTab({ sectionKeys, userName }: { sectionKeys: string[]; userName?: string }) {
  const [filter, setFilter] = useState("");
  const visible = sectionKeys.filter((k) => k.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div className="space-y-3">
      <input
        placeholder="Filter sections…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
      />
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Section</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Change to</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((k) => {
              const status = getStatus(k);
              return (
                <tr key={k} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-[12px]">{k}</td>
                  <td className="px-3 py-2">
                    <StatusPill status={status} />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={status}
                      onChange={(e) => setStatus(k, e.target.value as WorkflowStatus, userName)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value="draft">Draft</option>
                      <option value="in-review">In review</option>
                      <option value="published">Published</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: WorkflowStatus }) {
  const map: Record<WorkflowStatus, string> = {
    draft: "bg-muted text-muted-foreground",
    "in-review": "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${map[status]}`}>
      {status}
    </span>
  );
}

// ─────────────────── Versions

function VersionsTab({ sectionKeys, userName }: { sectionKeys: string[]; userName?: string }) {
  const wf = useWorkflow();
  const [key, setKey] = useState(sectionKeys[0] ?? "");
  const versions = wf.versions.filter((v) => v.key === key);

  function snapshotNow() {
    if (!key) return;
    pushVersion(key, getSection(key, null), { takenBy: userName, label: "manual" });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <Field label="Section">
          <select
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          >
            {sectionKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
        <button
          onClick={snapshotNow}
          className="rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background"
        >
          Snapshot current value
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3 text-sm font-bold">
          Version history{" "}
          <span className="text-muted-foreground">({versions.length})</span>
        </div>
        {versions.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No versions yet. Snapshots are also auto-saved before scheduled publishes and rollbacks.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {versions.map((v) => (
              <li key={v.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{new Date(v.takenAt).toLocaleString()}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {v.label ?? "snapshot"}
                      {v.takenBy && <> · by {v.takenBy}</>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (confirm("Roll back to this version? Current value will be saved as a snapshot first.")) {
                          rollbackVersion(v.id);
                        }
                      }}
                      className="rounded-md bg-foreground px-3 py-1 text-xs font-bold text-background"
                    >
                      Rollback
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this version?")) deleteVersion(v.id);
                      }}
                      className="text-xs font-semibold text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-[11px] font-semibold text-muted-foreground">
                    Preview snapshot
                  </summary>
                  <pre className="mt-2 max-h-48 overflow-auto rounded-md bg-muted p-2 font-mono text-[11px]">
                    {JSON.stringify(v.snapshot, null, 2)}
                  </pre>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
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
