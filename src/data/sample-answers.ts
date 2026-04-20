// Sample Band 8-9 model answers, keyed by question id (e.g. "opinion-1").
// Question ids must match those generated in writing-samples.tsx.

export type AnswerParagraph = {
  heading: string;
  body: string;
};

export type VocabItem = {
  term: string;
  meaning: string;
};

export type StructureStep = {
  label: string;
  detail: string;
};

export type SampleAnswer = {
  bandScore: string;
  wordCount: number;
  paragraphs: AnswerParagraph[];
  structure: StructureStep[];
  vocabulary: VocabItem[];
  tips: string[];
};

export const sampleAnswers: Record<string, SampleAnswer> = {
  "opinion-1": {
    bandScore: "8.5",
    wordCount: 318,
    paragraphs: [
      {
        heading: "Introduction",
        body: "University education has long been considered a gateway to better career opportunities and personal development. Some people argue that it should be provided free of cost to all students. I largely agree with this view, as it can promote equal opportunities and benefit society as a whole, although certain challenges must also be acknowledged.",
      },
      {
        heading: "Equal Access to Education",
        body: "One of the strongest arguments in favor of free university education is that it ensures equal access for all individuals, regardless of their financial background. Many talented students are unable to pursue higher education simply because they cannot afford tuition fees. By removing this financial barrier, governments can create a more level playing field where ability and determination, rather than wealth, determine success. This not only benefits individuals but also helps society by allowing skilled and capable people to contribute in fields such as healthcare, engineering, and education.",
      },
      {
        heading: "Economic Benefits for Society",
        body: "In addition, free higher education can lead to long-term economic growth. When more people are educated, the workforce becomes more skilled and productive. This often results in higher innovation, better job performance, and increased tax contributions in the future. In this sense, funding education can be seen as an investment rather than an expense, as governments may eventually recover the cost through a stronger economy.",
      },
      {
        heading: "Financial Challenges and Drawbacks",
        body: "However, making university education completely free is not without drawbacks. One major concern is the financial burden on governments. Providing free education for all students requires significant public funding, which may lead to higher taxes or reduced spending in other important areas such as healthcare or infrastructure. Moreover, if students do not have to pay for their education, some may not value it as much, potentially leading to lower motivation or higher dropout rates.",
      },
      {
        heading: "Conclusion",
        body: "Despite these challenges, I believe the advantages outweigh the disadvantages. Governments can adopt balanced approaches, such as offering free education with certain conditions or focusing on students from lower-income backgrounds. This ensures that the system remains sustainable while still promoting fairness. In conclusion, free university education can create equal opportunities and drive economic progress, even though it may place pressure on public finances. With careful planning and implementation, it can serve as a powerful tool for both individual success and societal development.",
      },
    ],
    structure: [
      {
        label: "Introduction",
        detail: "Paraphrase the topic, state your clear position (largely agree), and preview both sides.",
      },
      {
        label: "Body 1 — Main supporting argument",
        detail: "Equal access: removes financial barriers, levels the playing field, benefits society.",
      },
      {
        label: "Body 2 — Second supporting argument",
        detail: "Economic growth: skilled workforce, innovation, education as an investment.",
      },
      {
        label: "Body 3 — Counter-argument (concession)",
        detail: "Acknowledge drawbacks: financial burden on governments, possible loss of student motivation.",
      },
      {
        label: "Conclusion",
        detail: "Restate position, propose a balanced solution, and finish with a forward-looking statement.",
      },
    ],
    vocabulary: [
      { term: "a gateway to", meaning: "an opportunity that leads to something" },
      { term: "level playing field", meaning: "a fair situation with equal opportunity" },
      { term: "financial barrier", meaning: "a money-related obstacle" },
      { term: "long-term economic growth", meaning: "sustained improvement in an economy over time" },
      { term: "tax contributions", meaning: "money paid to the government as tax" },
      { term: "an investment rather than an expense", meaning: "spending that pays back later, not just a cost" },
      { term: "financial burden", meaning: "a heavy money-related responsibility" },
      { term: "dropout rates", meaning: "the percentage of students who quit studies" },
      { term: "advantages outweigh the disadvantages", meaning: "benefits are greater than the drawbacks" },
      { term: "sustainable", meaning: "able to be maintained over time" },
    ],
    tips: [
      "State your position clearly in the introduction — examiners reward an unambiguous stance.",
      "Use one body paragraph per main idea and start each with a strong topic sentence.",
      "Include a concession paragraph (acknowledging the other side) — it shows critical thinking and lifts coherence.",
      "Use linking phrases like 'In addition', 'However', and 'In conclusion' to guide the reader smoothly.",
    ],
  },
};
