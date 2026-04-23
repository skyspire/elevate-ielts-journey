import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { findModule, findSkill } from "@/lib/admin/content-tree";
import { Crumbs } from "./admin.content.index";

export const Route = createFileRoute("/admin/content/$module/$skill/")({
  component: SkillHub,
  loader: ({ params }) => {
    const mod = findModule(params.module);
    const skill = findSkill(params.module, params.skill);
    if (!mod || !skill) throw notFound();
    return { mod, skill };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-2xl font-extrabold">Skill not found</h1>
      <Link to="/admin/content" className="mt-4 inline-block text-sm font-semibold text-foreground underline">
        Back to Content
      </Link>
    </div>
  ),
});

function SkillHub() {
  const { mod, skill } = Route.useLoaderData();
  const params = Route.useParams();

  return (
    <div className="mx-auto max-w-5xl">
      <Crumbs
        trail={[
          { label: "Content", to: "/admin/content" },
          { label: mod.label },
          { label: skill.label },
        ]}
      />
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {mod.shortLabel} — {skill.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{skill.blurb}</p>
        </div>
        <Link
          to="/admin/content/$module"
          params={{ module: params.module }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {skill.sections.map((section) => (
          <Link
            key={section.id}
            to="/admin/content/$module/$skill/$section"
            params={{ module: params.module, skill: params.skill, section: section.id }}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="font-display text-lg font-extrabold text-foreground">
                {section.label}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-sm text-muted-foreground">{section.blurb}</p>
            <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {section.questionTypes.length} question types
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
