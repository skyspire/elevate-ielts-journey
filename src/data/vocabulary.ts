/**
 * Vocabulary data — Categories → Topic Lists → Words.
 *
 * Designed to be replaced 1:1 by an admin-uploaded backend later
 * (every entity has a stable `slug`). For now this is an in-memory
 * mock dataset with a small but realistic set of entries so the
 * UI feels alive across all five categories.
 */

export type Module = "academic" | "general";

export type CategoryKey =
  | "dictionary"
  | "phrasal"
  | "idioms"
  | "collocations"
  | "slangs";

export type Word = {
  id: string;
  /** The headword / phrase shown in the list. */
  term: string;
  /** Phonetic transcription, optional. */
  ipa?: string;
  /** Part of speech (noun, verb, idiom, etc.). */
  pos?: string;
  /** Short, learner-friendly definition. */
  meaning: string;
  /** A single example sentence in IELTS-appropriate register. */
  example: string;
  /** Optional one-line examiner / usage tip. */
  tip?: string;
};

export type TopicList = {
  slug: string;
  title: string;
  /** One-line description of the list. */
  blurb: string;
  /** Number shown next to the title (real count derived from words.length). */
  words: Word[];
};

export type Category = {
  key: CategoryKey;
  title: string;
  /** Used as the URL segment, e.g. /vocabulary/dictionary. */
  slug: CategoryKey;
  /** Short copy shown under the page title. */
  tagline: string;
  /** Topic lists belonging to this category. */
  lists: TopicList[];
};

/* ------------------------------------------------------------------ */
/* Helpers — keeps the data section below compact and readable.        */
/* ------------------------------------------------------------------ */

const w = (
  term: string,
  meaning: string,
  example: string,
  extras: Partial<Pick<Word, "ipa" | "pos" | "tip">> = {},
): Word => ({
  id: term.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  term,
  meaning,
  example,
  ...extras,
});

/* ------------------------------------------------------------------ */
/* DICTIONARY WORDS                                                    */
/* ------------------------------------------------------------------ */

const dictionary: Category = {
  key: "dictionary",
  slug: "dictionary",
  title: "Dictionary Words",
  tagline:
    "High-band academic vocabulary, grouped by IELTS topic — meanings, examples, and examiner tips.",
  lists: [
    {
      slug: "environment",
      title: "Environment",
      blurb: "Words for climate, pollution, and sustainability essays.",
      words: [
        w("Sustainable", "Able to continue without harming the environment.", "Governments must invest in sustainable energy sources to curb emissions.", { pos: "adj", tip: "Use in Task 2 introductions on climate." }),
        w("Deforestation", "The clearing of forests on a large scale.", "Deforestation in the Amazon has accelerated species extinction.", { pos: "noun" }),
        w("Mitigate", "To make something less severe.", "Planting trees can mitigate the effects of urban heat.", { pos: "verb", tip: "Stronger than 'reduce' — use sparingly." }),
        w("Carbon footprint", "The total greenhouse gases produced by an activity.", "Cycling to work cuts your daily carbon footprint considerably.", { pos: "noun phrase" }),
        w("Renewable", "From a source that is not depleted by use.", "Solar and wind are the most viable renewable resources.", { pos: "adj" }),
        w("Biodiversity", "The variety of plant and animal life in a habitat.", "Protecting wetlands preserves remarkable biodiversity.", { pos: "noun" }),
        w("Emission", "The release of gas, especially into the atmosphere.", "Vehicle emissions remain the chief contributor to urban smog.", { pos: "noun" }),
        w("Conservation", "The protection of nature and wildlife.", "Conservation efforts have brought several species back from the brink.", { pos: "noun" }),
        w("Pollutant", "A substance that contaminates the environment.", "Industrial pollutants seep into rivers and damage ecosystems.", { pos: "noun" }),
        w("Eco-friendly", "Not harmful to the environment.", "Many shoppers now prefer eco-friendly packaging.", { pos: "adj" }),
        w("Greenhouse gas", "A gas that traps heat in the atmosphere.", "Methane is a far more potent greenhouse gas than CO₂.", { pos: "noun phrase" }),
        w("Habitat", "The natural home of an animal or plant.", "Coral reefs are a critical habitat for marine life.", { pos: "noun" }),
      ],
    },
    {
      slug: "education",
      title: "Education",
      blurb: "For schooling, learning, and academic-life essays.",
      words: [
        w("Curriculum", "The subjects studied in a school or course.", "The curriculum should balance academic and life skills.", { pos: "noun" }),
        w("Pedagogy", "The method and practice of teaching.", "Modern pedagogy emphasises student-led inquiry.", { pos: "noun", tip: "A clear Band 8+ word." }),
        w("Tuition", "Teaching, especially privately or for a fee.", "Private tuition can widen the gap between rich and poor students.", { pos: "noun" }),
        w("Literacy", "The ability to read and write.", "Adult literacy programmes transform employment prospects.", { pos: "noun" }),
        w("Vocational", "Relating to a job or trade skill.", "Vocational training prepares graduates for the labour market.", { pos: "adj" }),
        w("Cognitive", "Relating to thinking and understanding.", "Reading aloud supports children's cognitive development.", { pos: "adj" }),
        w("Enrolment", "The number of people registered.", "University enrolment has risen for the fifth year running.", { pos: "noun" }),
        w("Holistic", "Considering the whole person.", "A holistic education nurtures both mind and character.", { pos: "adj" }),
        w("Truancy", "Staying away from school without permission.", "Truancy rates dropped after the new mentoring scheme.", { pos: "noun" }),
        w("Scholarship", "A grant supporting a student's studies.", "She won a full scholarship to study abroad.", { pos: "noun" }),
      ],
    },
    {
      slug: "technology",
      title: "Technology",
      blurb: "Internet, AI, and digital-life vocabulary.",
      words: [
        w("Innovation", "A new idea, method, or product.", "Continuous innovation is essential to remain competitive.", { pos: "noun" }),
        w("Automation", "The use of machines to perform tasks.", "Automation has reshaped manufacturing employment.", { pos: "noun" }),
        w("Cybersecurity", "Protection against digital attacks.", "Banks invest heavily in cybersecurity to safeguard customers.", { pos: "noun" }),
        w("Algorithm", "A set of rules used by computers to solve problems.", "Social-media algorithms shape the content we see.", { pos: "noun" }),
        w("Digital literacy", "Skill in using digital tools effectively.", "Digital literacy is now as vital as reading and writing.", { pos: "noun phrase" }),
        w("Surveillance", "Close observation of people or activity.", "Mass surveillance raises serious privacy concerns.", { pos: "noun" }),
        w("Artificial intelligence", "Machine systems that mimic human reasoning.", "Artificial intelligence is transforming medical diagnostics.", { pos: "noun phrase" }),
        w("Obsolete", "No longer in use; outdated.", "Within a decade, today's smartphones will look obsolete.", { pos: "adj" }),
        w("Disruptive", "Causing radical change in an industry.", "Streaming services have proved highly disruptive to broadcast TV.", { pos: "adj" }),
        w("Interface", "How a user interacts with a system.", "A clean interface makes the app accessible to older users.", { pos: "noun" }),
      ],
    },
    {
      slug: "health",
      title: "Health & Lifestyle",
      blurb: "Wellbeing, fitness, and public-health vocabulary.",
      words: [
        w("Sedentary", "Involving little physical activity.", "A sedentary lifestyle increases the risk of heart disease.", { pos: "adj" }),
        w("Obesity", "The condition of being severely overweight.", "Childhood obesity has reached alarming levels.", { pos: "noun" }),
        w("Nutritious", "Containing substances needed for good health.", "School canteens should serve more nutritious meals.", { pos: "adj" }),
        w("Wellbeing", "The state of being comfortable, healthy, or happy.", "Workplace wellbeing programmes lift productivity.", { pos: "noun" }),
        w("Immunity", "The body's ability to resist infection.", "Vaccines build long-term immunity against disease.", { pos: "noun" }),
        w("Chronic", "Persisting for a long time.", "Chronic stress can lead to serious health problems.", { pos: "adj" }),
        w("Vaccination", "Treatment given to produce immunity.", "Mass vaccination has eradicated several deadly diseases.", { pos: "noun" }),
        w("Mental health", "Emotional and psychological wellbeing.", "Schools should make mental health support widely available.", { pos: "noun phrase" }),
      ],
    },
    {
      slug: "society",
      title: "Society & Culture",
      blurb: "For social-issue and cultural-change essays.",
      words: [
        w("Demographic", "Relating to the structure of a population.", "An ageing demographic places strain on healthcare systems.", { pos: "adj/noun" }),
        w("Inequality", "Lack of equality, especially in opportunity.", "Income inequality has widened in many developed nations.", { pos: "noun" }),
        w("Migration", "Movement of people from one place to another.", "Economic migration has reshaped many European cities.", { pos: "noun" }),
        w("Globalisation", "The integration of world economies and cultures.", "Globalisation has blurred national cultural boundaries.", { pos: "noun" }),
        w("Heritage", "Inherited traditions and monuments.", "UNESCO works to preserve world heritage sites.", { pos: "noun" }),
        w("Stereotype", "A widely held but oversimplified idea.", "Media often reinforces gender stereotypes.", { pos: "noun" }),
        w("Integration", "Combining people of different groups into society.", "Successful integration requires effort from both sides.", { pos: "noun" }),
        w("Marginalised", "Treated as insignificant or peripheral.", "Policies must protect marginalised communities.", { pos: "adj" }),
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* PHRASAL VERBS                                                       */
/* ------------------------------------------------------------------ */

const phrasal: Category = {
  key: "phrasal",
  slug: "phrasal",
  title: "Phrasal Verbs",
  tagline: "Natural multi-word verbs that lift Speaking and informal Writing.",
  lists: [
    {
      slug: "everyday",
      title: "Everyday Conversation",
      blurb: "Phrasal verbs you'll need in Speaking Part 1.",
      words: [
        w("Get up", "To rise from bed.", "I usually get up at six on weekdays.", { pos: "phrasal verb" }),
        w("Run out of", "To use up the supply of something.", "We've run out of milk again.", { pos: "phrasal verb" }),
        w("Look after", "To take care of.", "She looks after her younger brother after school.", { pos: "phrasal verb" }),
        w("Give up", "To stop doing or trying something.", "He finally gave up smoking last year.", { pos: "phrasal verb" }),
        w("Find out", "To discover information.", "I only found out about the meeting this morning.", { pos: "phrasal verb" }),
        w("Put off", "To postpone.", "Let's not put off the decision any longer.", { pos: "phrasal verb" }),
        w("Pick up", "To collect or learn casually.", "Could you pick up some bread on your way home?", { pos: "phrasal verb" }),
        w("Hang out", "To spend time relaxing.", "We often hang out at the café on weekends.", { pos: "phrasal verb" }),
      ],
    },
    {
      slug: "work-study",
      title: "Work & Study",
      blurb: "Useful for Speaking Part 2 about jobs and studying.",
      words: [
        w("Carry out", "To perform or complete a task.", "Researchers carried out the experiment over six months.", { pos: "phrasal verb" }),
        w("Catch up on", "To do work you missed.", "I need to catch up on my reading this weekend.", { pos: "phrasal verb" }),
        w("Take on", "To accept responsibility for.", "She took on a leadership role at her company.", { pos: "phrasal verb" }),
        w("Set up", "To establish or organise.", "They set up a new office in Dubai last year.", { pos: "phrasal verb" }),
        w("Look into", "To investigate.", "The manager promised to look into the issue.", { pos: "phrasal verb" }),
        w("Bring up", "To mention or raise a topic.", "She brought up an interesting point during the meeting.", { pos: "phrasal verb" }),
      ],
    },
    {
      slug: "feelings",
      title: "Feelings & Reactions",
      blurb: "Useful when describing experiences in Part 2.",
      words: [
        w("Cheer up", "To become happier.", "A short walk always cheers me up.", { pos: "phrasal verb" }),
        w("Calm down", "To become less angry or excited.", "Take a deep breath and calm down.", { pos: "phrasal verb" }),
        w("Get over", "To recover from.", "It took her a while to get over the disappointment.", { pos: "phrasal verb" }),
        w("Look forward to", "To anticipate with pleasure.", "I'm really looking forward to my holiday.", { pos: "phrasal verb" }),
        w("Put up with", "To tolerate.", "I can't put up with that noise any longer.", { pos: "phrasal verb" }),
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* IDIOMS                                                              */
/* ------------------------------------------------------------------ */

const idioms: Category = {
  key: "idioms",
  slug: "idioms",
  title: "Idioms",
  tagline: "Subtle expressions that signal Band 8+ fluency in Speaking.",
  lists: [
    {
      slug: "common",
      title: "Common Idioms",
      blurb: "Universally useful — great for Speaking Part 3.",
      words: [
        w("A piece of cake", "Very easy to do.", "The exam was a piece of cake.", { pos: "idiom" }),
        w("Hit the books", "To study hard.", "I'd better hit the books before the test.", { pos: "idiom" }),
        w("Once in a blue moon", "Very rarely.", "We see each other once in a blue moon nowadays.", { pos: "idiom" }),
        w("Under the weather", "Slightly unwell.", "I'm feeling a bit under the weather today.", { pos: "idiom" }),
        w("Cost an arm and a leg", "To be very expensive.", "That new phone costs an arm and a leg.", { pos: "idiom" }),
        w("Break the ice", "To start a conversation in an awkward setting.", "He told a joke to break the ice at the meeting.", { pos: "idiom" }),
      ],
    },
    {
      slug: "success",
      title: "Success & Effort",
      blurb: "Show off range when describing achievements.",
      words: [
        w("Go the extra mile", "To make a special effort.", "Great teachers always go the extra mile for their students.", { pos: "idiom" }),
        w("Hit the nail on the head", "To say something exactly right.", "You hit the nail on the head with that comment.", { pos: "idiom" }),
        w("Bite the bullet", "To force yourself to do something difficult.", "I finally bit the bullet and quit my job.", { pos: "idiom" }),
        w("On cloud nine", "Extremely happy.", "She was on cloud nine when she got the offer.", { pos: "idiom" }),
        w("Jump on the bandwagon", "To join a popular trend.", "Many companies jumped on the AI bandwagon last year.", { pos: "idiom" }),
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* COLLOCATIONS                                                        */
/* ------------------------------------------------------------------ */

const collocations: Category = {
  key: "collocations",
  slug: "collocations",
  title: "Collocations",
  tagline: "Word partnerships examiners reward in Writing Task 2.",
  lists: [
    {
      slug: "make-do",
      title: "Make / Do",
      blurb: "The two most-confused verbs in English collocations.",
      words: [
        w("Make a decision", "To decide.", "We need to make a decision by Friday.", { pos: "verb + noun" }),
        w("Make progress", "To advance or improve.", "The student is making remarkable progress.", { pos: "verb + noun" }),
        w("Make an effort", "To try.", "Please make an effort to arrive on time.", { pos: "verb + noun" }),
        w("Do research", "To investigate a topic.", "I'm doing research on renewable energy.", { pos: "verb + noun" }),
        w("Do business", "To trade.", "Our company does business with several Asian markets.", { pos: "verb + noun" }),
        w("Do harm", "To cause damage.", "Plastic waste does enormous harm to marine life.", { pos: "verb + noun" }),
      ],
    },
    {
      slug: "strong",
      title: "Strong Collocations",
      blurb: "High-impact pairings that elevate Task 2 essays.",
      words: [
        w("Heavy traffic", "A lot of vehicles on the road.", "Heavy traffic delayed our journey by an hour.", { pos: "adj + noun" }),
        w("Strong evidence", "Convincing proof.", "There is strong evidence that the policy works.", { pos: "adj + noun" }),
        w("Take into account", "To consider.", "The judge took the circumstances into account.", { pos: "verb phrase" }),
        w("Pay attention", "To listen or watch carefully.", "Students must pay attention during the lecture.", { pos: "verb + noun" }),
        w("Raise awareness", "To inform people about an issue.", "Charities raise awareness of climate change.", { pos: "verb + noun" }),
        w("Reach a conclusion", "To finally decide.", "The committee reached a unanimous conclusion.", { pos: "verb + noun" }),
      ],
    },
    {
      slug: "academic",
      title: "Academic Writing",
      blurb: "Polished pairings perfect for Task 2 body paragraphs.",
      words: [
        w("Pose a threat", "To create a danger.", "Climate change poses a serious threat to coastal cities.", { pos: "verb + noun" }),
        w("Play a role", "To contribute to.", "Education plays a vital role in social mobility.", { pos: "verb + noun" }),
        w("Address an issue", "To deal with a problem.", "Governments must address the issue of housing affordability.", { pos: "verb + noun" }),
        w("Draw a conclusion", "To form a judgement.", "From the data we can draw a clear conclusion.", { pos: "verb + noun" }),
        w("Bear in mind", "To remember to consider.", "Bear in mind that the figures may change.", { pos: "verb phrase" }),
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* SLANGS                                                              */
/* ------------------------------------------------------------------ */

const slangs: Category = {
  key: "slangs",
  slug: "slangs",
  title: "Slangs",
  tagline: "Authentic informal language — recognise it, and know when to avoid it.",
  lists: [
    {
      slug: "british",
      title: "British Slang",
      blurb: "Hear it on UK TV and the IELTS Listening test.",
      words: [
        w("Knackered", "Very tired.", "I was completely knackered after the hike.", { pos: "adj", tip: "Speaking only — never write this in Task 2." }),
        w("Cheeky", "Slightly rude in a playful way.", "He's a cheeky little boy.", { pos: "adj" }),
        w("Gutted", "Very disappointed.", "I was gutted when my team lost.", { pos: "adj" }),
        w("Quid", "A British pound.", "It only cost me ten quid.", { pos: "noun" }),
        w("Mate", "Friend.", "Thanks, mate — I really appreciate it.", { pos: "noun" }),
      ],
    },
    {
      slug: "american",
      title: "American Slang",
      blurb: "Common US informal phrases.",
      words: [
        w("Hang out", "Spend time relaxing.", "We're going to hang out at Sam's place.", { pos: "verb" }),
        w("Awesome", "Very good.", "That movie was absolutely awesome!", { pos: "adj" }),
        w("Bucks", "Dollars.", "It cost me twenty bucks.", { pos: "noun" }),
        w("Chill", "To relax.", "We just chilled at home all weekend.", { pos: "verb" }),
        w("No worries", "It's okay / don't worry.", "No worries — I'll handle it.", { pos: "phrase" }),
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export const vocabulary: Record<CategoryKey, Category> = {
  dictionary,
  phrasal,
  idioms,
  collocations,
  slangs,
};

export const categoryOrder: CategoryKey[] = [
  "dictionary",
  "phrasal",
  "idioms",
  "collocations",
  "slangs",
];

export function getCategory(slug: string): Category | undefined {
  return (vocabulary as Record<string, Category>)[slug];
}

export function totalWords(cat: Category): number {
  return cat.lists.reduce((n, l) => n + l.words.length, 0);
}
