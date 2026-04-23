// Per question-type editor.
// Picks the right editor (prompt list vs topic list) based on dataKind.

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  PromptListEditor,
  TopicListEditor,
} from "@/components/admin/PromptListEditor";
import {
  WRITING_PROMPTS_KEY,
  SPEAKING_TOPICS_KEY,
} from "@/lib/admin/defaults";
import {
  findModule,
  findQuestionType,
  findSection,
  findSkill,
} from "@/lib/admin/content-tree";
import { task2Prompts, task1GeneralPrompts } from "@/data/writing-prompts";
import { speakingTopicsByCategory } from "@/data/speaking-topics";

export const Route = createFileRoute("/admin/content/$module/$skill/$section/$type")({
  component: QuestionTypeEditor,
  loader: ({ params }) => {
    const mod = findModule(params.module);
    const skill = findSkill(params.module, params.skill);
    const section = findSection(params.module, params.skill, params.section);
    const type = findQuestionType(params.module, params.skill, params.section, params.type);
    if (!mod || !skill || !section || !type) throw notFound();
    return { mod, skill, section, type };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="font-display text-2xl font-extrabold">Question type not found</h1>
      <Link to="/admin/content" className="mt-4 inline-block text-sm font-semibold underline">
        Back to Content
      </Link>
    </div>
  ),
});

// Combined defaults for the writing prompts record.
// task2Prompts: keyed by essay type (opinion, discussion, …) — shared by both modules.
// task1GeneralPrompts: keyed by formal / informal — General Training Task 1.
// Academic Task 1 keys (graphs, process) start empty so admins can fill them in.
const WRITING_DEFAULTS: Record<string, string[]> = {
  ...task2Prompts,
  ...task1GeneralPrompts,
  graphs: [],
  process: [],
};

function QuestionTypeEditor() {
  const { mod, skill, section, type } = Route.useLoaderData();
  const params = Route.useParams();

  const breadcrumb = [
    "Content",
    mod.label,
    skill.label,
    section.label,
    type.label,
  ];

  const title = `${mod.shortLabel} · ${skill.label} · ${section.label} · ${type.label}`;
  const description = type.hint;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/admin/content/$module/$skill/$section"
        params={{ module: params.module, skill: params.skill, section: params.section }}
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {section.label}
      </Link>

      {type.dataKind === "writing-prompts" ? (
        <PromptListEditor
          title={title}
          description={description}
          breadcrumb={breadcrumb}
          storageKey={WRITING_PROMPTS_KEY}
          categoryKey={type.id}
          defaultRecord={WRITING_DEFAULTS}
          placeholder="Type the full essay prompt or letter brief…"
          enableAnswers
          showAnswerImage={params.section === "task1"}
          previewModule={params.module as "academic" | "general"}
          previewTask={params.section as "task1" | "task2"}
        />
      ) : (
        <TopicListEditor
          title={title}
          description={description}
          breadcrumb={breadcrumb}
          storageKey={SPEAKING_TOPICS_KEY}
          categoryKey={type.id}
          defaultRecord={speakingTopicsByCategory}
        />
      )}
    </div>
  );
}
