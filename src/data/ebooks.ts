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
    freePages: 5,
    chapters: [
      {
        title: "Introduction: How examiners read",
        pages: [
          `# How examiners actually read your essay\n## Page 1 — The 90-second first impression\n\nIELTS Writing examiners are not lingering over your prose. On a typical exam day they will mark dozens of Task 2 essays back-to-back, and the average essay receives no more than 90 to 120 seconds of close attention before a band score is provisionally assigned.\n\nThis matters more than candidates realise. Examiners are trained to look for specific signals in a fixed order: a clear position, a logical structure, accurate task response, lexical range, and grammatical control. If those signals are missing in the first paragraph, the rest of the essay is read defensively — the examiner is now looking for reasons not to award a higher band.\n\nThe practical implication is that the first 60 words of your essay carry disproportionate weight. A confident, on-topic introduction that paraphrases the question and states a clear position will set the examiner's expectation at Band 7 or above. A vague, off-topic opening will set the ceiling at Band 6, and you will spend the rest of the essay clawing back marks.\n\nThis chapter explains what those signals look like, how examiners weight the four marking criteria against each other, and where most candidates lose half a band before they have written their second paragraph.`,
          `# How examiners actually read your essay\n## Page 2 — The four criteria, weighted honestly\n\nTask 2 is marked against four equally weighted criteria: Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Each is worth 25% of your Writing band score, but in practice they are not independent — weakness in one almost always pulls the others down.\n\nTask Response is the criterion most candidates underestimate. It rewards a fully developed answer to the exact question asked, with a clear position maintained throughout. Drift off-topic in body paragraph two and you will be capped at 6.0 here regardless of how elegant your sentences are.\n\nCoherence and Cohesion is about logical flow, not the number of linking words you use. Overusing "moreover", "furthermore" and "in addition" actively hurts this score. The examiner wants to see ideas that progress naturally, with cohesion devices used only when they add meaning.\n\nLexical Resource rewards range and precision. A candidate who uses ten common words accurately will score higher than one who reaches for "plethora" and "myriad" and uses them incorrectly. Collocation matters more than vocabulary lists.\n\nGrammatical Range and Accuracy is the most forgiving criterion. A Band 7 essay can contain two or three minor errors per paragraph. What it cannot contain is the same error repeated, or basic mistakes in tense, articles, and subject-verb agreement.`,
          `# How examiners actually read your essay\n## Page 3 — Why most candidates plateau at 6.5\n\nThere is a well-documented plateau at Band 6.5 that affects roughly 40% of repeat test-takers. These are candidates who have read the public band descriptors, drilled vocabulary lists, and practised dozens of essays — yet their score will not move.\n\nThe cause is almost always the same. They have learned to write fluently in English but have not internalised what Task 2 is testing. They treat the essay as a chance to display vocabulary and complex grammar, when the examiner is actually testing whether they can construct a sustained, logical argument that directly addresses the prompt.\n\nThe symptoms are predictable. The introduction restates the question without taking a position. Body paragraphs contain three or four ideas instead of one developed point. Examples are generic ("for example, in many countries...") rather than specific. The conclusion introduces a new idea or simply repeats the introduction in different words.\n\nThe fix is structural, not lexical. Before you write a single word, you need a thesis you can defend in 250 words, two body paragraphs each anchored to one main idea, and a concrete example for each. Vocabulary upgrades come last, not first. The next chapter shows you how to plan an essay in five minutes that will already place you at Band 7 before you have written a sentence.`,
        ],
      },
      {
        title: "The five-minute essay plan",
        pages: [
          `# The five-minute essay plan\n## Page 1 — Why planning is non-negotiable\n\nThe single biggest difference between a Band 6.5 candidate and a Band 8 candidate is not vocabulary. It is the five minutes spent planning before writing. Candidates who plan score, on average, 0.8 bands higher than candidates who start writing immediately — and that is true even when their underlying English level is identical.\n\nThe reason is simple. Without a plan, you will discover the structure of your argument as you write it. You will notice in paragraph three that your real opinion contradicts what you said in the introduction. You will run out of ideas at the 220-word mark and pad the rest with repetition. You will write a conclusion that does not match the body. Each of these is a Band 6 marker.\n\nWith a plan — even a rough one — your introduction promises a structure, your body paragraphs deliver it, and your conclusion confirms it. The examiner sees a controlled, deliberate piece of writing. That alone moves you from Band 6.5 to Band 7.0 on Coherence and Task Response.\n\nThe plan does not need to be elegant. Mine is usually six lines of mixed English and shorthand. What it needs to do is force you to commit to a thesis and two supporting ideas before your pen touches the answer sheet.`,
          `# The five-minute essay plan\n## Page 2 — The five-minute method, step by step\n\nMinute 1 — Decode the question. Underline the topic, the task verb (Discuss, To what extent, What are the causes), and any qualifying phrase ("in your country", "in recent years"). Misreading the task verb is the most common cause of a Band 5 Task Response score.\n\nMinute 2 — Decide your position. For opinion essays, write "AGREE" or "DISAGREE" at the top of your plan and commit to it. Hedged "partly agree" essays are harder to write well and rarely score above 6.5. For discussion essays, decide which side you lean towards.\n\nMinute 3 — Generate two main ideas. One sentence each. These will become your two body paragraphs. Reject any idea you cannot support with a specific example. "Technology helps education" is not an idea — it is a topic. "Online video lectures let students from rural areas access top universities" is an idea.\n\nMinute 4 — Attach a concrete example to each idea. Country, statistic, named institution, dated event. Generic examples ("in some countries...") are Band 6. Specific examples ("South Korea's Khan Academy partnership reaching 2.3 million rural students since 2019") are Band 8.\n\nMinute 5 — Sketch your introduction. Two sentences: one paraphrasing the question, one stating your thesis. If you cannot write your thesis in one clear sentence at this stage, your position is not clear enough — go back to minute 2.`,
        ],
      },
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
