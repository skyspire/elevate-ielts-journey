// Side-by-side diff for two strings (default vs current). Word-level.

import { diffArrays } from "@/lib/admin/text-diff";

type Props = {
  defaultText: string;
  currentText: string;
};

export function TextDiff({ defaultText, currentText }: Props) {
  const parts = diffArrays(defaultText, currentText);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DiffPane title="Default" tone="muted">
        {parts.map((p, i) =>
          p.removed ? (
            <span key={i} className="rounded bg-red-500/15 px-0.5 text-red-700 dark:text-red-300">
              {p.value}
            </span>
          ) : p.added ? null : (
            <span key={i}>{p.value}</span>
          ),
        )}
      </DiffPane>
      <DiffPane title="Current" tone="card">
        {parts.map((p, i) =>
          p.added ? (
            <span key={i} className="rounded bg-emerald-500/20 px-0.5 text-emerald-800 dark:text-emerald-300">
              {p.value}
            </span>
          ) : p.removed ? null : (
            <span key={i}>{p.value}</span>
          ),
        )}
      </DiffPane>
    </div>
  );
}

function DiffPane({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "muted" | "card";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border border-border p-3 text-sm leading-relaxed ${
        tone === "muted" ? "bg-muted/40" : "bg-card"
      }`}
    >
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="whitespace-pre-wrap break-words font-mono text-[13px]">{children}</div>
    </div>
  );
}
