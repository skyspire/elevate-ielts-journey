// Speaking Samples — generated questions per topic.
// Each topic produces a set of Part 1/3-style or Part 2 cue-card-style questions
// derived from its label. Cue Card categories use a longer cue-card prompt
// followed by examiner follow-up questions.

import { speakingTopicsByCategory } from "./speaking-topics";

export type SpeakingQuestion = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

const cueCardCategoryIds = new Set([
  "person",
  "place",
  "object",
  "event",
  "experience",
  "activity",
]);

export function isCueCardCategory(categoryId: string): boolean {
  return cueCardCategoryIds.has(categoryId);
}

// ───────── Question banks ─────────

// Part 1 / 3 — six questions, each topic-aware.
const generalTemplates = (topic: string): string[] => [
  `Let's talk about ${topic.toLowerCase()}. How important is ${topic.toLowerCase()} in your daily life?`,
  `What do you like most about ${topic.toLowerCase()}?`,
  `Has your interest in ${topic.toLowerCase()} changed over the years?`,
  `Do most people in your country pay attention to ${topic.toLowerCase()}? Why?`,
  `What are the advantages and disadvantages of ${topic.toLowerCase()} in modern life?`,
  `How do you think ${topic.toLowerCase()} will change in the future?`,
];

// Part 2 — one cue card + standard follow-ups.
const cueCardTemplate = (topic: string): string[] => [
  `Describe ${articlePrefix(topic)}. You should say:\n• what it is / who it is\n• when and where you experienced it\n• who was with you\n• and explain why it was memorable.`,
  `Do you think ${topic.toLowerCase()} is something most people experience? Why or why not?`,
  `How has ${topic.toLowerCase()} changed in recent years?`,
  `What are the positives and negatives of ${topic.toLowerCase()}?`,
  `Do younger and older people have different opinions about ${topic.toLowerCase()}?`,
];

function articlePrefix(label: string): string {
  // Lowercase article-aware phrasing for cue cards
  const lower = label.toLowerCase();
  if (/^(an?|the|your|a )/.test(lower)) return lower;
  const startsWithVowel = /^[aeiou]/.test(lower);
  return `${startsWithVowel ? "an" : "a"} ${lower}`;
}

export function getSpeakingQuestions(
  categoryId: string,
  topicId: string,
): SpeakingQuestion[] {
  const topic = (speakingTopicsByCategory[categoryId] ?? []).find(
    (t) => t.id === topicId,
  );
  if (!topic) return [];

  const prompts = isCueCardCategory(categoryId)
    ? cueCardTemplate(topic.label)
    : generalTemplates(topic.label);

  const difficulties: SpeakingQuestion["difficulty"][] = ["Easy", "Medium", "Hard"];
  return prompts.map((title, i) => ({
    id: `${topicId}-${i + 1}`,
    title,
    difficulty: difficulties[i % difficulties.length],
  }));
}

export function getTopic(categoryId: string, topicId: string) {
  return (speakingTopicsByCategory[categoryId] ?? []).find((t) => t.id === topicId);
}
