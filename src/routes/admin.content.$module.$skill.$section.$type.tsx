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
  findQuestionType,
  findSection,
  findSkill,
} from "@/lib/admin/content-tree";
import { task2Prompts, task1GeneralPrompts } from "@/data/writing-prompts";
import { speakingTopicsByCategory } from "@/data/speaking-topics";

export const Route = createFileRoute("/admin/content/$module/$skill/$section/$type")({
  component: QuestionTypeEditor,
  loader: ({ params }) => {
    const skill = findSkill(params.skill);
    const section = findSection(params.skill, params.section);
    const type = findQuestionType(params.skill, params.section, params.type);
    if (!skill || !section || !type) throw notFound();
    return { skill, section, type };
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

// Combined defaults for the writing prompts record (Task 1 + Task 2 keys)
const WRITING_DEFAULTS: Record<string, string[]> = {
  ...task2Prompts,
  ...task1GeneralPrompts,
  // Academic Task 1 keys are not in writing-prompts.ts yet — start empty so
  // admins can add them. The public Task 1 page will fall back to placeholders.
  graphs: [],
  process: [],
};

function QuestionTypeEditor() {
  const { skill, section, type } = Route.useLoaderData();
  const params = Route.useParams();

  const breadcrumb = [
    "Content",
    "IELTS Academic",
    skill.label,
    section.label,
    type.label,
  ];

  const title = `${skill.label} · ${section.label} · ${type.label}`;
  const description = type.hint;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/admin/content/$skill/$section"
        params={{ skill: params.skill, section: params.section }}
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
