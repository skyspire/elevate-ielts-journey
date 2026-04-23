import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EditorShell } from "@/components/admin/EditorShell";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  HOMEPAGE_LAYOUT_KEY,
  HOMEPAGE_DEFAULT,
  type HomepageSection,
} from "@/lib/admin/site-settings";
import { useCmsEditor } from "@/lib/admin/cms-store";
import { logActivity } from "@/lib/admin/activity-log";

export const Route = createFileRoute("/admin/homepage")({
  component: HomepagePage,
});

function HomepagePage() {
  const { value, update, reset } = useCmsEditor<HomepageSection[]>(
    HOMEPAGE_LAYOUT_KEY,
    HOMEPAGE_DEFAULT,
  );
  const [draft, setDraft] = useState<HomepageSection[]>(value);
  useEffect(() => setDraft(value), [value]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(value);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.length) return;
    const next = [...draft];
    [next[i], next[j]] = [next[j], next[i]];
    setDraft(next);
  };

  const toggle = (i: number) =>
    setDraft((prev) => prev.map((s, idx) => (idx === i ? { ...s, visible: !s.visible } : s)));

  return (
    <EditorShell
      title="Homepage Layout"
      description="Show, hide and reorder sections on the public homepage."
      isDirty={isDirty}
      onSave={() => {
        update(draft);
        logActivity({ kind: "settings-edited", message: "Updated homepage section layout" });
      }}
      onReset={() => {
        reset();
        setDraft(HOMEPAGE_DEFAULT);
      }}
    >
      <ul className="space-y-2">
        {draft.map((s, i) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
          >
            <div className="flex flex-col gap-0.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => move(i, -1)}
                disabled={i === 0}
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => move(i, 1)}
                disabled={i === draft.length - 1}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-foreground">{s.label}</div>
              <div className="text-[11px] font-mono text-muted-foreground">{s.id}</div>
            </div>
            <Switch checked={s.visible} onCheckedChange={() => toggle(i)} />
          </li>
        ))}
      </ul>
    </EditorShell>
  );
}
