import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock } from "lucide-react";
import { RESOURCES } from "@/lib/admin/resources-tree";
import { Crumbs } from "./admin.content.index";

export const Route = createFileRoute("/admin/content/resources/")({
  head: () => ({
    meta: [
      { title: "Resources — Content — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResourcesHub,
});

function ResourcesHub() {
  const live = RESOURCES.filter((r) => r.status === "live");
  const soon = RESOURCES.filter((r) => r.status === "coming-soon");

  return (
    <div className="mx-auto max-w-5xl">
      <Crumbs trail={[{ label: "Content", to: "/admin/content" }, { label: "Resources" }]} />
      <div className="mt-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Resources</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage everything that appears under the public Resources menu.
        </p>
      </div>

      <SectionTitle>Live</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {live.map((r) => (
          <ResourceCard key={r.id} item={r} />
        ))}
      </div>

      <SectionTitle>Coming soon</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {soon.map((r) => (
          <ResourceCard key={r.id} item={r} />
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 mt-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  );
}

function ResourceCard({ item }: { item: (typeof RESOURCES)[number] }) {
  const Icon = item.icon;
  const isSoon = item.status === "coming-soon";
  return (
    <Link
      to="/admin/content/resources/$resource"
      params={{ resource: item.id }}
      className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
      <div className="font-display text-base font-extrabold text-foreground">{item.label}</div>
      <p className="mt-1 text-sm text-muted-foreground">{item.blurb}</p>
      {isSoon && (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
          <Clock className="h-3 w-3" />
          Coming soon
        </span>
      )}
    </Link>
  );
}
