import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getMaintenance, setMaintenance, useMaintenance } from "@/lib/admin/maintenance-store";

export const Route = createFileRoute("/admin/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance — Admin" }, { name: "robots", content: "noindex" }] }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const cfg = useMaintenance();
  const [draft, setDraft] = useState(cfg);

  // re-sync if external change
  if (draft !== cfg && draft.message === getMaintenance().message && draft.enabled === cfg.enabled) {
    // no-op
  }

  function save() {
    setMaintenance(draft);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Maintenance mode</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          When enabled, learners see a maintenance screen instead of the site. Admins can keep
          working as normal.
        </p>
      </header>

      <div
        className={`rounded-lg border p-4 ${
          cfg.enabled
            ? "border-amber-300 bg-amber-50 text-amber-900"
            : "border-border bg-card text-foreground"
        }`}
      >
        <div className="text-sm font-bold">
          Currently: {cfg.enabled ? "MAINTENANCE MODE ACTIVE" : "Site is live"}
        </div>
        {cfg.enabled && cfg.estimatedEndsAt && (
          <div className="mt-1 text-xs">
            Estimated end: {new Date(cfg.estimatedEndsAt).toLocaleString()}
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={draft.enabled}
            onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold">Enable maintenance mode</span>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={draft.allowAdmins}
            onChange={(e) => setDraft({ ...draft, allowAdmins: e.target.checked })}
            className="h-4 w-4"
          />
          <span className="text-sm">Allow signed-in admins to bypass</span>
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Message shown to learners
          </span>
          <textarea
            value={draft.message}
            onChange={(e) => setDraft({ ...draft, message: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-border bg-background p-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Estimated end (optional)
          </span>
          <input
            type="datetime-local"
            value={draft.estimatedEndsAt ? draft.estimatedEndsAt.slice(0, 16) : ""}
            onChange={(e) =>
              setDraft({
                ...draft,
                estimatedEndsAt: e.target.value ? new Date(e.target.value).toISOString() : "",
              })
            }
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          />
        </label>

        <div className="flex gap-2">
          <button
            onClick={save}
            className="rounded-md bg-foreground px-4 py-2 text-xs font-bold text-background"
          >
            Save changes
          </button>
          <button
            onClick={() => setDraft(getMaintenance())}
            className="rounded-md border border-border bg-muted px-4 py-2 text-xs font-bold"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
