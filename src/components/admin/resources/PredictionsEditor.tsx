import { useState } from "react";
import { PromptListEditor } from "@/components/admin/PromptListEditor";
import {
  PREDICTIONS_KEY,
  PREDICTIONS_DEFAULT,
  type ExamSkillKey,
} from "@/lib/admin/resources-tree";
import { SkillTabs } from "./RecentExamsEditor";

export function PredictionsEditor() {
  const [skill, setSkill] = useState<ExamSkillKey>("writing");

  return (
    <div className="space-y-4">
      <SkillTabs value={skill} onChange={setSkill} />
      <PromptListEditor
        key={skill}
        title={`Predictions — ${cap(skill)}`}
        description="AI-ranked topics most likely to appear in the next sitting."
        breadcrumb={["Content", "Resources", "Predictions", cap(skill)]}
        storageKey={PREDICTIONS_KEY}
        categoryKey={skill}
        defaultRecord={PREDICTIONS_DEFAULT}
        placeholder={`Type a predicted ${skill} topic or question…`}
      />
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
