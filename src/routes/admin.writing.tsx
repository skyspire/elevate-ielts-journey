import { createFileRoute } from "@tanstack/react-router";
import { JsonEditorPage } from "@/components/admin/JsonEditorPage";
import { task2Prompts } from "@/data/writing-prompts";
import { WRITING_PROMPTS_KEY } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/writing")({
  component: WritingEditor,
});

function WritingEditor() {
  return (
    <JsonEditorPage
      title="Writing Prompts"
      description="Task 2 essay prompts grouped by category."
      storageKey={WRITING_PROMPTS_KEY}
      defaultValue={task2Prompts}
      hint="Top-level keys are category IDs (opinion, discussion, etc.). Each value is an array of prompt strings."
    />
  );
}
