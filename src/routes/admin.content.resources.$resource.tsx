import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { findResource } from "@/lib/admin/resources-tree";
import { Crumbs } from "./admin.content.index";
import { RecentExamsEditor } from "@/components/admin/resources/RecentExamsEditor";
import { PredictionsEditor } from "@/components/admin/resources/PredictionsEditor";
import { EbooksEditor } from "@/components/admin/resources/EbooksEditor";
import { SampleAnswersHub } from "@/components/admin/resources/SampleAnswersHub";
import { VocabularyResourceEditor } from "@/components/admin/resources/VocabularyResourceEditor";
import { ComingSoonEditor } from "@/components/admin/resources/ComingSoonEditor";

export const Route = createFileRoute("/admin/content/resources/$resource")({
  component: ResourcePage,
  loader: ({ params }) => {
    const r = findResource(params.resource);
    if (!r) throw notFound();
    return { r };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-2xl font-extrabold">Resource not found</h1>
      <Link
        to="/admin/content/resources"
        className="mt-4 inline-block text-sm font-semibold underline"
      >
        Back to Resources
      </Link>
    </div>
  ),
});

function ResourcePage() {
  const { r } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-5xl">
      <Crumbs
        trail={[
          { label: "Content", to: "/admin/content" },
          { label: "Resources", to: "/admin/content/resources" } as never,
          { label: r.label },
        ]}
      />
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{r.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{r.blurb}</p>
        </div>
        <Link
          to="/admin/content/resources"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>

      <div className="mt-6">
        {r.editor === "prompt-list" && r.id === "recent-exams" && <RecentExamsEditor />}
        {r.editor === "prompt-list" && r.id === "predictions" && <PredictionsEditor />}
        {r.editor === "ebooks" && <EbooksEditor />}
        {r.editor === "sample-answers" && <SampleAnswersHub />}
        {r.editor === "vocabulary" && <VocabularyResourceEditor />}
        {r.editor === "coming-soon" && <ComingSoonEditor resourceId={r.id} label={r.label} />}
      </div>
    </div>
  );
}
