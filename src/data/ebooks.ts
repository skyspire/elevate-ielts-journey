// Sample IELTS e-book data with paginated content for the Kindle-style reader.
export type EbookCategory = "Writing" | "Speaking" | "Reading" | "Listening" | "Vocabulary" | "Grammar";

export type EbookChapter = {
  title: string;
  // Each string is a "page" of content (markdown-ish plain text).
  pages: string[];
};

export type Ebook = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: EbookCategory;
  band: string; // e.g. "Band 7-9"
  pageCount: number;
  coverGradient: string; // CSS gradient
  coverAccent: string; // small accent color (oklch string)
  description: string;
  freePages: number; // how many pages unlocked before paywall
  chapters: EbookChapter[];
};

const lorem = (seed: string, paragraphs = 3): string[] => {
  const base = [
    `In IELTS ${seed}, the examiner is looking for clarity, range and control. Your answer should feel natural — not memorised — and should directly address the question that was asked. A common mistake among Band 6 candidates is to drift away from the prompt while trying to demonstrate "advanced" vocabulary. Stay on topic.`,
    `Begin by paraphrasing the question in your own words. This signals to the examiner that you have understood the task and gives you a moment to plan. A simple two-sentence introduction is more than enough — there is no need for a flashy hook.`,
    `Use linking devices sparingly and accurately. Overusing connectors like "moreover", "furthermore" and "in addition" makes your writing feel mechanical. Instead, vary your sentence structure: combine short, punchy sentences with longer, more complex ones to demonstrate range.`,
    `When you give an example, make it specific. "For instance, in Singapore, the government's car-quota system has reduced traffic congestion by roughly 20% over the past decade" is far stronger than "for example, in some countries traffic is bad."`,
    `Finally, leave two minutes at the end to proofread. Most candidates lose easy marks to small grammatical slips — subject-verb agreement, articles, and prepositions — that they would catch on a careful read-through.`,
  ];
  return Array.from({ length: paragraphs }, (_, i) => base[i % base.length]);
};

const makeChapter = (title: string, seed: string, pageCount = 4): EbookChapter => ({
  title,
  pages: Array.from({ length: pageCount }, (_, i) => {
    const paras = lorem(seed, 3 + (i % 2));
    return `# ${title}\n## Page ${i + 1}\n\n${paras.join("\n\n")}`;
  }),
});

export const ebooks: Ebook[] = [
  {
    id: "task2-frameworks",
    title: "Task 2 Frameworks",
    subtitle: "Band 9 essay structures decoded",
    author: "James Whitfield, ex-IELTS examiner",
    category: "Writing",
    band: "Band 7–9",
    pageCount: 184,
    coverGradient: "linear-gradient(135deg, oklch(0.45 0.18 30), oklch(0.35 0.15 25))",
    coverAccent: "oklch(0.85 0.15 80)",
    description:
      "Six battle-tested essay structures for every Task 2 question type — opinion, discussion, problem/solution, advantages/disadvantages, double-question and direct.",
    freePages: 4,
    chapters: [
      makeChapter("Introduction: How examiners read", "Task 2 introductions", 3),
      makeChapter("The Opinion Essay", "opinion essays", 4),
      makeChapter("The Discussion Essay", "discussion essays", 4),
      makeChapter("Problem & Solution", "problem-solution essays", 4),
      makeChapter("Double Question", "double-question essays", 3),
    ],
  },
  {
    id: "graph-vocabulary",
    title: "Graph Vocabulary",
    subtitle: "180 phrases for Task 1 academic",
    author: "Priya Iyer",
    category: "Writing",
    band: "Band 6.5–8.5",
    pageCount: 96,
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.16 220), oklch(0.32 0.13 230))",
    coverAccent: "oklch(0.85 0.12 200)",
    description:
      "Stop saying 'increased significantly' on every line. Master the phrasebook for trends, comparisons, and projections.",
    freePages: 4,
    chapters: [
      makeChapter("Trends going up", "upward trends", 3),
      makeChapter("Trends going down", "downward trends", 3),
      makeChapter("Stable & fluctuating", "stable and fluctuating data", 3),
      makeChapter("Comparing values", "comparisons", 3),
    ],
  },
  {
    id: "speaking-part2",
    title: "Speaking Part 2",
    subtitle: "Cue cards that win Band 8",
    author: "Marcus Lin",
    category: "Speaking",
    band: "Band 7–9",
    pageCount: 142,
    coverGradient: "linear-gradient(135deg, oklch(0.40 0.15 145), oklch(0.30 0.12 150))",
    coverAccent: "oklch(0.85 0.14 130)",
    description:
      "A repeatable two-minute story framework, plus 60 cue-card walkthroughs across people, places, objects and experiences.",
    freePages: 4,
    chapters: [
      makeChapter("The 2-minute story arc", "Speaking Part 2 storytelling", 4),
      makeChapter("Talking about people", "describing people", 4),
      makeChapter("Talking about places", "describing places", 3),
      makeChapter("Talking about objects", "describing objects", 3),
    ],
  },
  {
    id: "pronunciation",
    title: "Pronunciation Lab",
    subtitle: "Sound natural, not robotic",
    author: "Dr. Hannah Reid",
    category: "Speaking",
    band: "All bands",
    pageCount: 118,
    coverGradient: "linear-gradient(135deg, oklch(0.40 0.16 305), oklch(0.30 0.13 310))",
    coverAccent: "oklch(0.85 0.13 320)",
    description:
      "The four pronunciation features examiners actually grade: stress, intonation, chunking and individual sounds.",
    freePages: 4,
    chapters: [
      makeChapter("Word stress patterns", "word stress", 3),
      makeChapter("Sentence stress", "sentence stress", 3),
      makeChapter("Intonation that lifts you", "intonation", 3),
      makeChapter("Tricky individual sounds", "vowel sounds", 3),
    ],
  },
  {
    id: "reading-skim",
    title: "Skim, Scan, Decide",
    subtitle: "Reading speed for Band 8+",
    author: "Olufemi Adebayo",
    category: "Reading",
    band: "Band 7–9",
    pageCount: 132,
    coverGradient: "linear-gradient(135deg, oklch(0.40 0.16 50), oklch(0.30 0.14 45))",
    coverAccent: "oklch(0.85 0.14 70)",
    description:
      "A timing-first approach to all 14 question types in IELTS Academic Reading, with worked examples on real Cambridge passages.",
    freePages: 4,
    chapters: [
      makeChapter("The 60-minute clock", "Reading timing", 3),
      makeChapter("True/False/Not Given", "TFNG questions", 4),
      makeChapter("Matching headings", "matching headings", 4),
      makeChapter("Summary completion", "summary completion", 3),
    ],
  },
  {
    id: "listening-traps",
    title: "Listening Traps",
    subtitle: "Avoid the 12 classic mistakes",
    author: "Sofia Rinaldi",
    category: "Listening",
    band: "Band 6–8.5",
    pageCount: 104,
    coverGradient: "linear-gradient(135deg, oklch(0.40 0.16 195), oklch(0.30 0.13 200))",
    coverAccent: "oklch(0.85 0.13 180)",
    description:
      "Distractors, paraphrases, and number-format pitfalls — annotated transcripts of the moments where most candidates lose marks.",
    freePages: 4,
    chapters: [
      makeChapter("Section 1 — form filling", "Listening section 1", 3),
      makeChapter("Section 2 — the monologue", "Listening section 2", 3),
      makeChapter("Section 3 — academic chat", "Listening section 3", 3),
      makeChapter("Section 4 — the lecture", "Listening section 4", 3),
    ],
  },
  {
    id: "vocab-c1",
    title: "C1 Topic Vocabulary",
    subtitle: "1,000 words across 20 themes",
    author: "Editorial Team",
    category: "Vocabulary",
    band: "Band 7–9",
    pageCount: 220,
    coverGradient: "linear-gradient(135deg, oklch(0.40 0.16 280), oklch(0.30 0.13 285))",
    coverAccent: "oklch(0.85 0.12 270)",
    description:
      "Education, environment, technology, health, work — the topics that come up every single test, with collocations and example sentences.",
    freePages: 4,
    chapters: [
      makeChapter("Education", "education vocabulary", 4),
      makeChapter("Environment", "environment vocabulary", 4),
      makeChapter("Technology", "technology vocabulary", 4),
      makeChapter("Health", "health vocabulary", 3),
    ],
  },
  {
    id: "grammar-band8",
    title: "Grammar for Band 8",
    subtitle: "The 12 structures that count",
    author: "Editorial Team",
    category: "Grammar",
    band: "Band 6.5–9",
    pageCount: 156,
    coverGradient: "linear-gradient(135deg, oklch(0.40 0.16 10), oklch(0.30 0.13 15))",
    coverAccent: "oklch(0.85 0.14 30)",
    description:
      "Conditionals, relative clauses, inversion, cleft sentences, and the modal verbs that lift Writing and Speaking from a 6.5 to an 8.",
    freePages: 4,
    chapters: [
      makeChapter("Conditionals in real exam answers", "conditionals", 4),
      makeChapter("Relative clauses that flow", "relative clauses", 3),
      makeChapter("Inversion for emphasis", "inversion", 3),
      makeChapter("Cleft sentences", "cleft sentences", 3),
    ],
  },
];

export function getEbookById(id: string): Ebook | undefined {
  return ebooks.find((b) => b.id === id);
}

// Flatten all chapter pages into one ordered array of pages, preserving chapter info.
export type FlatPage = {
  index: number; // 0-based
  chapterIndex: number;
  chapterTitle: string;
  content: string;
};

export function flattenPages(book: Ebook): FlatPage[] {
  const out: FlatPage[] = [];
  let i = 0;
  book.chapters.forEach((ch, ci) => {
    ch.pages.forEach((content) => {
      out.push({ index: i, chapterIndex: ci, chapterTitle: ch.title, content });
      i++;
    });
  });
  return out;
}
