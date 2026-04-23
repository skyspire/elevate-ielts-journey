// Shared admin editor primitives — Section header + Save toolbar.

import { ReactNode } from "react";
import { Save, RotateCcw, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type EditorShellProps = {
  title: string;
  description?: string;
  previewHref?: string;
  isDirty: boolean;
  onSave: () => void;
  onReset: () => void;
  children: ReactNode;
};

export function EditorShell({
  title,
  description,
  previewHref,
  isDirty,
  onSave,
  onReset,
  children,
}: EditorShellProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {previewHref && (
            <Button asChild variant="outline" size="sm">
              <Link to="/" hash={previewHref.replace(/^.*#/, "")}>
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset to default
          </Button>
          <Button size="sm" onClick={onSave} disabled={!isDirty}>
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isDirty ? "Save changes" : "Saved"}
          </Button>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>
    </div>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
