import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, GraduationCap } from "lucide-react";
import { CONTENT_MODULES } from "@/lib/admin/content-tree";

export const Route = createFileRoute("/admin/content/")({
  component: ContentHub,
});

function ContentHub() {
  return (
    <div className="mx-auto max-w-5xl">
      <Header />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CONTENT_MODULES.map((mod) => {
          const totalTypes = mod.skills.reduce(
            (n, s) => n + s.sections.reduce((m, sec) => m + sec.questionTypes.length, 0),
            0,
          );
          return (
            <Link
              key={mod.id}
              to="/admin/content/$module"
              params={{ module: mod.id }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                  <GraduationCap className="h-6 w-6" />
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="font-display text-lg font-extrabold text-foreground">
                {mod.label}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{mod.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mod.skills.flatMap((skill) =>
                  skill.sections.map((sec) => (
                    <span
                      key={`${skill.id}-${sec.id}`}
                      className="rounded-full bg-foreground/5 px-2 py-0.5 text-[11px] font-bold text-foreground/80"
                    >
                      {skill.label} · {sec.label}
                    </span>
                  )),
                )}
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

function Header() {
  return (
    <div>
      <Crumbs trail={[{ label: "Content" }]} />
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick a module — Academic or General Training — to manage Writing & Speaking content.
      </p>
    </div>
  );
}

export function Crumbs({ trail }: { trail: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs">
      <Link to="/admin" className="text-muted-foreground hover:text-foreground">
        Admin
      </Link>
      {trail.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          <span className={i === trail.length - 1 ? "font-bold text-foreground" : "text-muted-foreground"}>
            {c.label}
          </span>
        </span>
      ))}
    </nav>
  );
}
