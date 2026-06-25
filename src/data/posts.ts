export type Post = {
  slug: string;
  title: string;
  category: string;
  image: string;
  readMin: number;
  author: string;
  excerpt: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "writing-task-2-band-8-structure",
    title: "The Band 8 Writing Task 2 structure that actually works",
    category: "Writing",
    readMin: 6,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=70",
    excerpt:
      "A simple four-paragraph structure that consistently scores Band 8 — what to write, in what order, and why it works.",
    body: [
      "Most Band 8 essays are not won by clever vocabulary or rare grammar. They are won by a structure so clear that the examiner never has to work to follow your argument. If your reader can predict what each paragraph will do before they read it, you have already covered half of Task Response and most of Coherence and Cohesion.",
      "The structure we use with our highest-scoring students has four paragraphs: an introduction, two body paragraphs, and a conclusion. Each paragraph has one job and only one job. The introduction paraphrases the question and states your position in a single sentence. There is no background, no hook, no rhetorical question. Examiners are not impressed by warm-ups — they want a clear position fast.",
      "The first body paragraph develops your strongest reason. Begin with a topic sentence that names the idea in plain language. Then explain why the idea is true, give a specific example, and finish with a sentence that links the example back to the question. The order matters: claim, reason, example, link. Skip any of those four moves and the paragraph loses focus.",
      "The second body paragraph does the same with your second-strongest reason. Resist the urge to fit a third idea here. Two well-developed ideas beat three shallow ones every time, because Task Response rewards depth, not breadth. If you find yourself running out of things to say, push harder on the example: name a place, a year, a study, or a person. Specific examples are what move an essay from Band 6.5 to Band 8.",
      "The conclusion is one sentence — sometimes two. Restate your position in different words and, if it fits, suggest a small implication. Do not introduce a new idea. Do not apologise for the length. The examiner has now read your full argument; the conclusion just confirms it.",
      "Practise this structure on five essays before changing anything. Most students improve a full band simply by writing more clearly, not by writing more cleverly. Once the structure is automatic, your attention can move to the things that actually push you higher — precise vocabulary, varied sentence forms, and natural cohesion.",
    ],
  },
  {
    slug: "speaking-part-2-fluency-fix",
    title: "How to stop freezing in Speaking Part 2",
    category: "Speaking",
    readMin: 5,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=70",
    excerpt:
      "Why your mind goes blank in the long-turn — and a 60-second planning method that fixes it.",
    body: [
      "Freezing in Part 2 is almost never a vocabulary problem. It is a planning problem. You have one minute to prepare, and most students spend that minute trying to remember impressive words instead of building a story they can actually tell.",
      "The fix is a three-line plan. On the paper they give you, write three short notes: where, who, what happened. That is enough to talk for two minutes if you trust yourself to expand each line as you go.",
      "When the examiner says begin, start with the where. Set the scene in two sentences — the place, the weather, the time of day. Then move to the who and add one specific detail about that person. Then tell the what happened in a clear order, and end with how you felt. That is your structure.",
    ],
  },
  {
    slug: "reading-true-false-not-given",
    title: "True / False / Not Given — a decision tree that never fails",
    category: "Reading",
    readMin: 7,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1600&q=70",
    excerpt:
      "Stop guessing on True/False/Not Given. Use this two-question decision tree to get them right every time.",
    body: [
      "True/False/Not Given questions are not about understanding the passage — they are about matching the claim in the question against the exact information in the passage, and nothing more.",
      "Ask two questions in order. First: does the passage say this? If yes, the answer is True. If no, ask the second question: does the passage say the opposite? If yes, False. If neither, Not Given. That is the whole method.",
    ],
  },
  {
    slug: "listening-map-labelling",
    title: "Map labelling questions: a 4-step reading order",
    category: "Listening",
    readMin: 4,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=70",
    excerpt: "Read the map in the right order and map labelling becomes one of the easier question types.",
    body: [
      "Before the audio starts, find the starting point on the map — it is usually marked. Then trace a likely route with your finger so your eyes are not lost when the speaker begins giving directions.",
      "Listen for the direction words first, the landmarks second, and the labels last. That order matches how the speaker actually talks.",
    ],
  },
  {
    slug: "vocabulary-c1-academic",
    title: "30 C1 academic collocations that examiners notice",
    category: "Vocabulary",
    readMin: 8,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=70",
    excerpt:
      "Thirty natural academic phrases that lift your Lexical Resource score without sounding forced.",
    body: [
      "Examiners do not reward rare words. They reward natural ones used precisely. The phrases below appear in real academic writing and they all collocate — meaning the words sit together the way native writers actually use them.",
      "Pick five of these for your next essay. Do not try to fit all thirty into one piece of writing — that is the fastest way to sound unnatural.",
    ],
  },
  {
    slug: "study-plan-30-days",
    title: "A realistic 30-day IELTS study plan for working adults",
    category: "Study habits",
    readMin: 9,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=70",
    excerpt:
      "An honest 30-day plan built around 45 minutes a day — not a fantasy schedule you cannot follow.",
    body: [
      "Most IELTS plans assume you have three free hours a day. You do not. This plan is built around 45 focused minutes on weekdays and a longer session on the weekend.",
      "Week one is diagnostic: one full timed paper, then identify your two weakest skills. Week two and three target those two skills with short daily drills. Week four is exam simulation.",
    ],
  },
  {
    slug: "writing-task-1-overview",
    title: "Writing Task 1: the overview sentence that boosts your band",
    category: "Writing",
    readMin: 5,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=70",
    excerpt: "One sentence decides whether your Task 1 sits at Band 6 or Band 7. Here is how to write it.",
    body: [
      "The overview is the single most important sentence in Task 1. Without it, you cannot score above Band 5 for Task Achievement — no matter how detailed the rest of your report is.",
      "A good overview names the two or three biggest trends in the chart, with no numbers. Save the data for the body paragraphs.",
    ],
  },
  {
    slug: "speaking-pronunciation-stress",
    title: "Word stress: the smallest fix with the biggest payoff",
    category: "Speaking",
    readMin: 4,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1600&q=70",
    excerpt:
      "If your vocabulary is fine but your Speaking score is stuck, word stress is almost always the reason.",
    body: [
      "English is a stress-timed language. Native listeners follow the stressed syllables and almost ignore the rest. When stress moves to the wrong syllable, the listener has to slow down and decode — and your fluency score drops.",
      "Pick ten words you use often and check the stress on each one. Fixing those ten words alone usually moves Pronunciation by half a band.",
    ],
  },
  {
    slug: "exam-day-checklist",
    title: "The exam-day checklist that calms your nerves",
    category: "Exam day",
    readMin: 3,
    author: "IELTS team",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=70",
    excerpt: "A short checklist for the night before and the morning of the test.",
    body: [
      "The night before, do not study new material. Pack your ID, your confirmation, and a bottle of water. Sleep at your normal time — not earlier.",
      "On the morning of the test, eat something familiar, leave early, and arrive with twenty minutes to spare. Your brain settles when your body is not rushed.",
    ],
  },
];

export type Palette = {
  cardBg: string;
  shadow: string;
  imgBg: string;
  chipBg: string;
  chipText: string;
  title: string;
  heart: string;
};

export const PALETTES: Palette[] = [
  { cardBg: "#f5f3ff", shadow: "#e9d5ff", imgBg: "#ddd6fe", chipBg: "#ede9fe", chipText: "#6d28d9", title: "#3b0764", heart: "#7c3aed" },
  { cardBg: "#fff1f2", shadow: "#fecdd3", imgBg: "#fecdd3", chipBg: "#ffe4e6", chipText: "#be123c", title: "#4c0519", heart: "#e11d48" },
  { cardBg: "#ecfdf5", shadow: "#a7f3d0", imgBg: "#a7f3d0", chipBg: "#d1fae5", chipText: "#047857", title: "#022c22", heart: "#059669" },
  { cardBg: "#fefce8", shadow: "#fde68a", imgBg: "#fde68a", chipBg: "#fef3c7", chipText: "#a16207", title: "#422006", heart: "#ca8a04" },
  { cardBg: "#f0f9ff", shadow: "#bae6fd", imgBg: "#bae6fd", chipBg: "#e0f2fe", chipText: "#0369a1", title: "#0c2340", heart: "#0284c7" },
  { cardBg: "#fff7ed", shadow: "#fed7aa", imgBg: "#fed7aa", chipBg: "#ffedd5", chipText: "#c2410c", title: "#431407", heart: "#ea580c" },
];

export function paletteFor(slug: string): Palette {
  const idx = POSTS.findIndex((p) => p.slug === slug);
  return PALETTES[(idx >= 0 ? idx : 0) % PALETTES.length];
}
