// Generic JSON editor — used for the bulk content sources (writing prompts, speaking topics, vocabulary).
// Lets the user paste/edit raw JSON with validation. Good enough for a prototype.

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { EditorShell } from "@/components/admin/EditorShell";
import { Textarea } from "@/components/ui/textarea";
import { useCmsEditor } from "@/lib/admin/cms-store";

type JsonEditorPageProps<T> = {
  title: string;
  description: string;
  storageKey: string;
  defaultValue: T;
  hint?: string;
};

export function JsonEditorPage<T>({
  title,
  description,
  storageKey,
  defaultValue,
  hint,
}: JsonEditorPageProps<T>) {
  const { value, update, reset } = useCmsEditor<T>(storageKey, defaultValue);
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<T | null>(value);

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  useEffect(() => {
    try {
      setParsed(JSON.parse(text) as T);
      setError(null);
    } catch (e) {
      setParsed(null);
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, [text]);

  const isDirty = text !== JSON.stringify(value, null, 2);

  return (
    <EditorShell
      title={title}
      description={description}
      isDirty={isDirty && !error}
      onSave={() => parsed && update(parsed)}
      onReset={() => reset()}
    >
      {hint && (
        <p className="mb-3 text-xs text-muted-foreground">{hint}</p>
      )}
      <div
        className={`mb-3 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold ${
          error
            ? "bg-destructive/10 text-destructive"
            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        }`}
      >
        {error ? (
          <>
            <AlertCircle className="h-3.5 w-3.5" /> JSON error: {error}
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" /> Valid JSON
          </>
        )}
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[60vh] font-mono text-xs leading-relaxed"
        spellCheck={false}
      />
    </EditorShell>
  );
}
