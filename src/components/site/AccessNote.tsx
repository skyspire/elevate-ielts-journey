import { Sparkles } from "lucide-react";

export function AccessNote() {
  return (
    <div className="mx-auto mb-8 flex max-w-2xl items-center justify-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground shadow-soft sm:text-sm">
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand" />
      <span>
        Free after sign up · 3 Writing + 3 Speaking samples. Subscribe for full library.
      </span>
    </div>
  );
}
