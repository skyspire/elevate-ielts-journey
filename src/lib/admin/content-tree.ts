// Single source of truth for the admin Content tree.
// Mirrors the public Writing Samples and Speaking Samples pages so that admins
// pick exactly the same categories visitors browse.
//
// Tree:
//   Content
//     └─ IELTS Academic
//         ├─ Writing
//         │    ├─ Task 1   ─ Graphs & Charts, Processes & Maps
//         │    └─ Task 2   ─ 7 essay types (Opinion, Discussion, ...)
//         └─ Speaking
//              ├─ Part 1       ─ 6 general categories
//              └─ Part 2 & 3   ─ 14 cue card categories

export type ContentDataKind = "writing-prompts" | "speaking-topics";

export type QuestionType = {
  /** Stable id used as the route slug AND as the data key in the underlying data store. */
  id: string;
  label: string;
  hint: string;
  /** Which underlying data set this question type lives in. */
  dataKind: ContentDataKind;
};

export type ContentSection = {
  id: string;
  label: string;
  /** Short tagline shown in the section hub. */
  blurb: string;
  questionTypes: QuestionType[];
};

export type ContentSkill = {
  id: "writing" | "speaking";
  label: string;
  blurb: string;
  sections: ContentSection[];
};

export type ContentModule = {
  id: "academic";
  label: string;
  blurb: string;
  skills: ContentSkill[];
};

// ───────── Writing — Task 1 ─────────
// Mirrors categoriesByModuleTask.academic.task1 in writing-samples.index.tsx
const writingTask1: QuestionType[] = [
  { id: "graphs", label: "Graphs & Charts", hint: "Bar, line, pie, table", dataKind: "writing-prompts" },
  { id: "process", label: "Processes & Maps", hint: "Diagrams & map changes", dataKind: "writing-prompts" },
];

// ───────── Writing — Task 2 ─────────
// Mirrors task2Essays in writing-samples.index.tsx
const writingTask2: QuestionType[] = [
  { id: "opinion", label: "Opinion Essay", hint: "Agree / Disagree", dataKind: "writing-prompts" },
  { id: "discussion", label: "Discussion Essay", hint: "Discuss both views + opinion", dataKind: "writing-prompts" },
  { id: "advdis", label: "Advantages & Disadvantages", hint: "Weigh pros and cons", dataKind: "writing-prompts" },
  { id: "problem", label: "Problem & Solution", hint: "Identify problems, propose solutions", dataKind: "writing-prompts" },
  { id: "direct", label: "Direct Question", hint: "Two-part question", dataKind: "writing-prompts" },
  { id: "posneg", label: "Positive or Negative Development", hint: "Evaluate a development", dataKind: "writing-prompts" },
  { id: "cause", label: "Cause and Effect", hint: "Reasons and results", dataKind: "writing-prompts" },
];

// ───────── Speaking — Part 1 (general questions) ─────────
// Mirrors categoriesByMode.general in speaking-samples.index.tsx
const speakingPart1: QuestionType[] = [
  { id: "things", label: "Things", hint: "Objects, gifts, items", dataKind: "speaking-topics" },
  { id: "activities", label: "Activities", hint: "Hobbies & routines", dataKind: "speaking-topics" },
  { id: "places", label: "Places", hint: "Hometown, cities, spaces", dataKind: "speaking-topics" },
  { id: "people", label: "People", hint: "Family, friends, role models", dataKind: "speaking-topics" },
  { id: "experiences", label: "Experiences", hint: "Memories & moments", dataKind: "speaking-topics" },
  { id: "future-plans", label: "Future Plans", hint: "Goals & aspirations", dataKind: "speaking-topics" },
];

// ───────── Speaking — Part 2 & 3 (cue cards) ─────────
// Mirrors categoriesByMode.cuecards in speaking-samples.index.tsx
const speakingPart23: QuestionType[] = [
  { id: "cc-people", label: "People", hint: "Friends, mentors, family", dataKind: "speaking-topics" },
  { id: "cc-places", label: "Places & Locations", hint: "Cities, rooms, spaces", dataKind: "speaking-topics" },
  { id: "cc-buildings", label: "Buildings & Structures", hint: "Landmarks & architecture", dataKind: "speaking-topics" },
  { id: "cc-objects", label: "Objects & Things", hint: "Gifts, gadgets, possessions", dataKind: "speaking-topics" },
  { id: "cc-events", label: "Events & Experiences", hint: "Memorable moments", dataKind: "speaking-topics" },
  { id: "cc-activities", label: "Activities", hint: "Hobbies & routines", dataKind: "speaking-topics" },
  { id: "cc-study-work", label: "Study & Work", hint: "School, jobs, careers", dataKind: "speaking-topics" },
  { id: "cc-opinions", label: "Opinions & Abstract", hint: "Ideas, values, choices", dataKind: "speaking-topics" },
  { id: "cc-future", label: "Future & Hypothetical", hint: "Plans & possibilities", dataKind: "speaking-topics" },
  { id: "cc-media", label: "Media & Entertainment", hint: "Films, music, shows", dataKind: "speaking-topics" },
  { id: "cc-travel", label: "Travel & Tourism", hint: "Trips, holidays, places", dataKind: "speaking-topics" },
  { id: "cc-lifestyle", label: "Habits & Lifestyle", hint: "Routines & wellbeing", dataKind: "speaking-topics" },
  { id: "cc-tech", label: "Technology & Innovation", hint: "Apps, gadgets, AI", dataKind: "speaking-topics" },
  { id: "cc-society", label: "Society & Culture", hint: "Traditions & change", dataKind: "speaking-topics" },
];

export const CONTENT_TREE: ContentModule = {
  id: "academic",
  label: "IELTS Academic",
  blurb: "Writing & Speaking content as it appears on bigielts.com.",
  skills: [
    {
      id: "writing",
      label: "Writing",
      blurb: "Task 1 (charts, processes, maps) and Task 2 (essays).",
      sections: [
        { id: "task1", label: "Task 1", blurb: "Academic charts, processes & maps.", questionTypes: writingTask1 },
        { id: "task2", label: "Task 2", blurb: "Essay prompts across 7 question types.", questionTypes: writingTask2 },
      ],
    },
    {
      id: "speaking",
      label: "Speaking",
      blurb: "Part 1 (general questions) and Part 2 & 3 (cue cards + follow-ups).",
      sections: [
        { id: "part1", label: "Part 1", blurb: "General questions across 6 categories.", questionTypes: speakingPart1 },
        { id: "part23", label: "Part 2 & 3", blurb: "Cue cards & follow-ups across 14 themes.", questionTypes: speakingPart23 },
      ],
    },
  ],
};

// ───────── Lookup helpers ─────────
export function findSkill(skillId: string): ContentSkill | undefined {
  return CONTENT_TREE.skills.find((s) => s.id === skillId);
}

export function findSection(skillId: string, sectionId: string): ContentSection | undefined {
  return findSkill(skillId)?.sections.find((sec) => sec.id === sectionId);
}

export function findQuestionType(
  skillId: string,
  sectionId: string,
  typeId: string,
): QuestionType | undefined {
  return findSection(skillId, sectionId)?.questionTypes.find((q) => q.id === typeId);
}
