import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Upload, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { exportAll, importAll, resetAll } from "@/lib/admin/cms-store";

export const Route = createFileRoute("/admin/data")({
  component: DataPage,
});

function DataPage() {
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const handleExport = () => {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bigielts-cms-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (typeof parsed !== "object" || !parsed) throw new Error("Expected an object");
      importAll(parsed as Record<string, unknown>);
      setStatus({ kind: "ok", msg: "Imported successfully." });
      setImportText("");
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Invalid JSON" });
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Import / Export</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Back up your CMS edits to a JSON file, restore them on another browser, or reset to
          defaults.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold">Export</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Download all your CMS overrides as a single JSON file.
          </p>
          <Button className="mt-4" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Download CMS data
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold">Import</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste an exported JSON file to restore CMS overrides. This will overwrite matching
            sections.
          </p>
          <Textarea
            placeholder='{"hero": {...}, "faq": {...}}'
            className="mt-3 min-h-[200px] font-mono text-xs"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          {status && (
            <div
              className={`mt-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                status.kind === "err"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {status.kind === "err" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {status.msg}
            </div>
          )}
          <Button className="mt-3" onClick={handleImport} disabled={!importText.trim()}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>

        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-destructive">Danger zone</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Clear all CMS overrides and revert every section to its hardcoded default.
          </p>
          <Button
            variant="destructive"
            className="mt-4"
            onClick={() => {
              if (confirm("This will delete ALL your CMS edits. Continue?")) {
                resetAll();
                setStatus({ kind: "ok", msg: "All CMS data cleared." });
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Reset everything
          </Button>
        </div>
      </div>
    </div>
  );
}
