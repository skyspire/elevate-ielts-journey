import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ChevronRight, MessageSquare } from "lucide-react";
import { findModule, type ContentSection, type ContentSkill } from "@/lib/admin/content-tree";
import { Crumbs } from "./admin.content.index";

export const Route = createFileRoute("/admin/content/$module/")({
  component: ModuleHub,
  loader: ({ params }) => {
    const mod = findModule(params.module);
    if (!mod) throw notFound();
    return { mod };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-2xl font-extrabold">Module not found</h1>
      <Link to="/admin/content" className="mt-4 inline-block text-sm font-semibold underline">
        Back to Content
      </Link>
    </div>
  ),
});

function ModuleHub() {
  const { mod } = Route.useLoaderData();
  const params = Route.useParams();

  return (
    <div className="mx-auto max-w-5xl">
      <Crumbs trail={[{ label: "Content", to: "/admin/content" }, { label: mod.label }]} />
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{mod.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mod.blurb}</p>
        </div>
        <Link
          to="/admin/content"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {mod.skills.map((skill: ContentSkill) => {
          const Icon = skill.id === "writing" ? BookOpen : MessageSquare;
          const totalTypes = skill.sections.reduce(
            (n: number, s: ContentSection) => n + s.questionTypes.length,
            0,
          );
          return (
            <Link
              key={skill.id}
              to="/admin/content/$module/$skill"
              params={{ module: params.module, skill: skill.id }}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="font-display text-base font-extrabold text-foreground">
                {skill.label}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{skill.blurb}</p>
              <div className="mt-3 flex gap-2">
                {skill.sections.map((s: ContentSection) => (
                  <span
                    key={s.id}
                    className="rounded-full bg-foreground/5 px-2 py-0.5 text-[11px] font-bold text-foreground/80"
                  >
                    {s.label}
                  </span>
                ))}
                <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {totalTypes} types
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
