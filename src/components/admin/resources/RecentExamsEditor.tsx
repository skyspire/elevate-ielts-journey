// Recent Exams editor — wraps PromptListEditor for each IELTS skill.

import { useState } from "react";
import { PromptListEditor } from "@/components/admin/PromptListEditor";
import {
  RECENT_EXAMS_KEY,
  RECENT_EXAMS_DEFAULT,
  EXAM_SKILLS,
  type ExamSkillKey,
} from "@/lib/admin/resources-tree";

export function RecentExamsEditor() {
  const [skill, setSkill] = useState<ExamSkillKey>("writing");

  return (
    <div className="space-y-4">
      <SkillTabs value={skill} onChange={setSkill} />
      <PromptListEditor
        key={skill}
        title={`Recent Exams — ${cap(skill)}`}
        description="Verified questions from real test-takers, grouped by skill."
        breadcrumb={["Content", "Resources", "Recent Exams", cap(skill)]}
        storageKey={RECENT_EXAMS_KEY}
        categoryKey={skill}
        defaultRecord={RECENT_EXAMS_DEFAULT}
        placeholder={`Type a ${skill} question or task seen in a recent exam…`}
      />
    </div>
  );
}

export function SkillTabs({
  value,
  onChange,
}: {
  value: ExamSkillKey;
  onChange: (v: ExamSkillKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
      {EXAM_SKILLS.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onChange(s.key)}
          className={
            value === s.key
              ? "rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background"
              : "rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          }
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
