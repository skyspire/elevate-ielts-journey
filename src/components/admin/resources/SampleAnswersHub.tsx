// Band 8+ Sample Answers — these live inside the existing Writing & Speaking
// content trees, so this hub just deep-links the admin into the right place.

import { Link } from "@tanstack/react-router";
import { ChevronRight, BookOpen, MessageSquare } from "lucide-react";
import { CONTENT_MODULES } from "@/lib/admin/content-tree";

export function SampleAnswersHub() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Sample answers are attached to the Writing & Speaking prompts they
        belong to. Pick a module below to open the prompt list and add or edit
        answers inline.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CONTENT_MODULES.map((mod) =>
          mod.skills.map((skill) => {
            const Icon = skill.id === "writing" ? BookOpen : MessageSquare;
            return (
              <Link
                key={`${mod.id}-${skill.id}`}
                to="/admin/content/$module/$skill"
                params={{ module: mod.id, skill: skill.id }}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-extrabold">
                    {mod.shortLabel} · {skill.label}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{skill.blurb}</p>
                </div>
                <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          }),
        )}
      </div>
    </div>
  );
}
