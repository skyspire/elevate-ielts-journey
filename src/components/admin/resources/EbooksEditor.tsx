import { JsonEditorPage } from "@/components/admin/JsonEditorPage";
import { ebooks } from "@/data/ebooks";
import { EBOOKS_KEY } from "@/lib/admin/resources-tree";

export function EbooksEditor() {
  return (
    <JsonEditorPage
      title="E-books"
      description="Library of PDF guides shown on the public /ebooks page."
      storageKey={EBOOKS_KEY}
      defaultValue={ebooks}
      hint="Each entry has { id, title, subtitle, author, category, band, pageCount, coverGradient, coverAccent, description, freePages, chapters }."
    />
  );
}
