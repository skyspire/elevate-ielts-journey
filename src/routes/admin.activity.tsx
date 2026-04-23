import { createFileRoute } from "@tanstack/react-router";
import { Activity, Trash2 } from "lucide-react";
import { useActivityLog, clearActivityLog } from "@/lib/admin/activity-log";
import { timeAgo } from "@/lib/admin/prompt-meta";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const log = useActivityLog();
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Activity Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last {log.length} CMS event{log.length === 1 ? "" : "s"}, newest first. Stored locally.
          </p>
        </div>
        {log.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => clearActivityLog()}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Clear log
          </Button>
        )}
      </div>

      {log.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing yet. Edits to prompts, answers, and settings will show up here.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {log.map((e, i) => (
            <li key={i} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 font-bold uppercase tracking-wider text-foreground">
                      {e.kind.replace(/-/g, " ")}
                    </span>
                    {e.area && (
                      <span className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-medium text-muted-foreground">
                        {e.area}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{e.message}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(e.ts)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
