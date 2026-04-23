import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, BookOpen, MessageSquare, GraduationCap } from "lucide-react";
import { CONTENT_TREE } from "@/lib/admin/content-tree";

export const Route = createFileRoute("/admin/content/")({
  component: ContentHub,
});

function ContentHub() {
  return (
    <div className="mx-auto max-w-5xl">
      <Header />

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight">
              {CONTENT_TREE.label}
            </h2>
            <p className="text-sm text-muted-foreground">{CONTENT_TREE.blurb}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CONTENT_TREE.skills.map((skill) => {
            const Icon = skill.id === "writing" ? BookOpen : MessageSquare;
            const totalTypes = skill.sections.reduce(
              (n, s) => n + s.questionTypes.length,
              0,
            );
            return (
              <Link
                key={skill.id}
                to="/admin/content/$skill"
                params={{ skill: skill.id }}
                className="group rounded-xl border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
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
                  {skill.sections.map((s) => (
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
    </div>
  );
}

function Header() {
  return (
    <div>
      <Crumbs trail={[{ label: "Content" }]} />
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage everything that appears on the public Writing & Speaking sample pages.
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
          {c.to && i < trail.length - 1 ? (
            // We can't easily do typed Link with arbitrary `to` here — fall back to text.
            <span className="text-muted-foreground">{c.label}</span>
          ) : (
            <span className={i === trail.length - 1 ? "font-bold text-foreground" : "text-muted-foreground"}>
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
