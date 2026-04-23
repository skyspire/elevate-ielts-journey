import { createFileRoute } from "@tanstack/react-router";
import { JsonEditorPage } from "@/components/admin/JsonEditorPage";
import { speakingTopicsByCategory } from "@/data/speaking-topics";
import { SPEAKING_TOPICS_KEY } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/speaking")({
  component: SpeakingEditor,
});

function SpeakingEditor() {
  return (
    <JsonEditorPage
      title="Speaking Topics"
      description="Topic catalog for Speaking Samples, grouped by category."
      storageKey={SPEAKING_TOPICS_KEY}
      defaultValue={speakingTopicsByCategory}
      hint="Top-level keys are category IDs. Each topic has { id, label }."
    />
  );
}
