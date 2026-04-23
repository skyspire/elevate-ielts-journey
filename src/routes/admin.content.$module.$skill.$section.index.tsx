import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, FileQuestion } from "lucide-react";
import { findModule, findSection, findSkill } from "@/lib/admin/content-tree";
import { Crumbs } from "./admin.content.index";

export const Route = createFileRoute("/admin/content/$module/$skill/$section/")({
  component: SectionHub,
  loader: ({ params }) => {
    const mod = findModule(params.module);
    const skill = findSkill(params.module, params.skill);
    const section = findSection(params.module, params.skill, params.section);
    if (!mod || !skill || !section) throw notFound();
    return { mod, skill, section };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-2xl font-extrabold">Section not found</h1>
      <Link to="/admin/content" className="mt-4 inline-block text-sm font-semibold underline">
        Back to Content
      </Link>
    </div>
  ),
});

function SectionHub() {
  const { mod, skill, section } = Route.useLoaderData();
  const params = Route.useParams();

  return (
    <div className="mx-auto max-w-5xl">
      <Crumbs
        trail={[
          { label: "Content", to: "/admin/content" },
          { label: mod.label },
          { label: skill.label },
          { label: section.label },
        ]}
      />
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {mod.shortLabel} — {skill.label} — {section.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{section.blurb}</p>
        </div>
        <Link
          to="/admin/content/$module/$skill"
          params={{ module: params.module, skill: params.skill }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>

      <div className="mt-2 mb-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Pick a question type to edit
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {section.questionTypes.map((qt) => (
          <Link
            key={qt.id}
            to="/admin/content/$module/$skill/$section/$type"
            params={{
              module: params.module,
              skill: params.skill,
              section: params.section,
              type: qt.id,
            }}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground/70 group-hover:bg-foreground group-hover:text-background">
              <FileQuestion className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-display text-sm font-extrabold text-foreground">
                {qt.label}
              </div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground">{qt.hint}</div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
