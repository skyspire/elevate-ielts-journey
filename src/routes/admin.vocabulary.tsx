import { createFileRoute } from "@tanstack/react-router";
import { JsonEditorPage } from "@/components/admin/JsonEditorPage";
import { vocabulary } from "@/data/vocabulary";
import { VOCABULARY_KEY } from "@/lib/admin/defaults";

export const Route = createFileRoute("/admin/vocabulary")({
  component: VocabularyEditor,
});

function VocabularyEditor() {
  return (
    <JsonEditorPage
      title="Vocabulary"
      description="Categories → topic lists → words."
      storageKey={VOCABULARY_KEY}
      defaultValue={vocabulary}
      hint="Each category has { key, title, slug, tagline, lists }. Each list has { slug, title, blurb, words }."
    />
  );
}
