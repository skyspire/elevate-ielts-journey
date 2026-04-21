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

/**
 * A single Band 8+ answer (essay or letter). The billboard reader expects
 * exactly three variants per question — these surface as the
 * "Answer 1 / Answer 2 / Answer 3" tabs in the footer pager. Variants give
 * learners three different ways the same prompt can be tackled.
 */
export type AnswerVariant = {
  bandScore: string;
  wordCount: number;
  paragraphs: AnswerParagraph[];
};

export type SampleAnswer = {
  /** Default variant (back-compat — equals variants[0]). */
  bandScore: string;
  wordCount: number;
  paragraphs: AnswerParagraph[];
  /** Three answer variants surfaced through the footer pager tabs. */
  variants?: [AnswerVariant, AnswerVariant, AnswerVariant];
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
      { label: "Introduction", detail: "Paraphrase the topic, state your clear position (largely agree), and preview both sides." },
      { label: "Body 1 — Main supporting argument", detail: "Equal access: removes financial barriers, levels the playing field, benefits society." },
      { label: "Body 2 — Second supporting argument", detail: "Economic growth: skilled workforce, innovation, education as an investment." },
      { label: "Body 3 — Counter-argument (concession)", detail: "Acknowledge drawbacks: financial burden on governments, possible loss of student motivation." },
      { label: "Conclusion", detail: "Restate position, propose a balanced solution, and finish with a forward-looking statement." },
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

  // ───────── GT Task 1 — Formal letter sample (with 3 variants) ─────────
  "formal-1": {
    bandScore: "8.5",
    wordCount: 178,
    paragraphs: [
      {
        heading: "Opening",
        body: "Dear Sir or Madam,\n\nI am writing to express my dissatisfaction with a kitchen blender I purchased from your store on 3 March, and to request a prompt resolution to a problem that has so far gone unanswered.",
      },
      {
        heading: "The problem",
        body: "On unpacking the appliance and testing it the same evening, I discovered that the motor produced an unusually loud noise and the blades stopped rotating after only a few seconds. I tried using it on a different power outlet and with a lighter load, but the fault persisted. The blender is, in effect, unusable.",
      },
      {
        heading: "What happened when I called",
        body: "I telephoned your customer service line on 5 March and explained the issue in full. Although the staff member promised that a replacement would be arranged within two working days, I have not received any further communication, and my emails have also gone unanswered.",
      },
      {
        heading: "Action requested",
        body: "I would therefore be grateful if you could either replace the appliance with a working unit or provide a full refund of £79.99. I also hope you will look into why my earlier complaint was not acted upon.\n\nI look forward to hearing from you within the next seven days.\n\nYours faithfully,\nJordan Bennett",
      },
    ],
    variants: [
      // ── Variant 1 — Standard formal complaint ──────────────────────
      {
        bandScore: "8.5",
        wordCount: 178,
        paragraphs: [
          {
            heading: "Opening",
            body: "Dear Sir or Madam,\n\nI am writing to express my dissatisfaction with a kitchen blender I purchased from your store on 3 March, and to request a prompt resolution to a problem that has so far gone unanswered.",
          },
          {
            heading: "The problem",
            body: "On unpacking the appliance and testing it the same evening, I discovered that the motor produced an unusually loud noise and the blades stopped rotating after only a few seconds. I tried using it on a different power outlet and with a lighter load, but the fault persisted. The blender is, in effect, unusable.",
          },
          {
            heading: "What happened when I called",
            body: "I telephoned your customer service line on 5 March and explained the issue in full. Although the staff member promised that a replacement would be arranged within two working days, I have not received any further communication, and my emails have also gone unanswered.",
          },
          {
            heading: "Action requested",
            body: "I would therefore be grateful if you could either replace the appliance with a working unit or provide a full refund of £79.99. I also hope you will look into why my earlier complaint was not acted upon.\n\nI look forward to hearing from you within the next seven days.\n\nYours faithfully,\nJordan Bennett",
          },
        ],
      },
      // ── Variant 2 — More assertive, escalation-focused ─────────────
      {
        bandScore: "8.5",
        wordCount: 184,
        paragraphs: [
          {
            heading: "Opening",
            body: "Dear Mr Patel,\n\nI am writing to formally complain about a faulty food processor purchased from your branch on 2 April, and about the unsatisfactory response I received when I attempted to resolve the matter by telephone.",
          },
          {
            heading: "Nature of the fault",
            body: "From the very first use, the appliance vibrated excessively and emitted a burning smell, which forced me to switch it off at the wall. A subsequent attempt the following day produced sparks from the base, at which point I stopped using it entirely on safety grounds.",
          },
          {
            heading: "Earlier contact with the shop",
            body: "I rang your store on 4 April and was told that someone would call me back within twenty-four hours. To date, no one has done so, despite two follow-up calls and an email sent on 9 April. I find this lack of response wholly unacceptable for a product that is potentially dangerous.",
          },
          {
            heading: "Action requested",
            body: "I therefore expect a full refund and the collection of the faulty unit at your expense within seven working days. Should I not hear from you, I will refer the matter to Trading Standards.\n\nYours sincerely,\nAmara Singh",
          },
        ],
      },
      // ── Variant 3 — Polite & solution-oriented tone ───────────────
      {
        bandScore: "8.0",
        wordCount: 172,
        paragraphs: [
          {
            heading: "Opening",
            body: "Dear Sir or Madam,\n\nI hope this letter finds you well. I am writing to bring to your attention an issue with a coffee machine I bought from your shop last week, and to ask for your help in putting things right.",
          },
          {
            heading: "Describing the issue",
            body: "Soon after I started using the machine, I noticed that water was leaking from the base whenever I brewed a cup. I followed the setup instructions carefully and even watched your online tutorial, but the leak continued and has now begun to damage my kitchen counter.",
          },
          {
            heading: "My earlier phone call",
            body: "I called your store on Monday morning and spoke briefly with a sales assistant, who said the manager would return my call. Unfortunately, I have not heard anything since, and I am beginning to feel that my concern has been overlooked.",
          },
          {
            heading: "How you can help",
            body: "I would be very grateful if you could arrange for either a replacement or a refund at your earliest convenience. A short phone call confirming the next steps would also be much appreciated.\n\nYours faithfully,\nNoah Williams",
          },
        ],
      },
    ],
    structure: [
      { label: "Opening", detail: "State the purpose clearly: what you are writing about and what outcome you want." },
      { label: "Describe the problem", detail: "Give specific details (date, fault, what you tried)." },
      { label: "Explain prior contact", detail: "Show what you've already done and why it didn't work." },
      { label: "Action requested", detail: "Be polite but firm — name the resolution and a reasonable timeframe." },
      { label: "Sign off", detail: "Use 'Yours faithfully' (unknown name) or 'Yours sincerely' (named recipient)." },
    ],
    vocabulary: [
      { term: "express my dissatisfaction", meaning: "say I am unhappy in a formal way" },
      { term: "the fault persisted", meaning: "the problem continued" },
      { term: "in effect, unusable", meaning: "essentially impossible to use" },
      { term: "wholly unacceptable", meaning: "completely not acceptable" },
      { term: "at your earliest convenience", meaning: "as soon as you can" },
      { term: "look into", meaning: "investigate" },
      { term: "refer the matter to", meaning: "pass the issue to a higher authority" },
    ],
    tips: [
      "Use 'Dear Sir or Madam' + 'Yours faithfully' when the recipient's name is unknown.",
      "Cover all three bullet points — examiners deduct marks if any is missing.",
      "Match register to the situation: formal complaint = neutral, polite, no contractions.",
      "Aim for ~150–180 words. Going far over costs you time without earning extra marks.",
    ],
  },

  // ───────── GT Task 1 — Informal letter sample (with 3 variants) ──────
  "informal-1": {
    bandScore: "8.5",
    wordCount: 174,
    paragraphs: [
      {
        heading: "Opening",
        body: "Hi Sam,\n\nThanks so much for inviting me over next month — I honestly can't wait! It's been ages since we've had a proper catch-up, and your messages about the new neighbourhood have made me even more excited about the trip.",
      },
      {
        heading: "Travel plans",
        body: "I've finally booked everything: I'll be flying in on the evening of 14 May and heading back home on the 22nd. My flight lands at around 9 pm local time, so don't worry about picking me up — I'll grab a taxi straight to yours. If anything changes I'll send you the new details right away.",
      },
      {
        heading: "Things I'd love to do",
        body: "While I'm there I'd really love to visit that little coastal town you keep raving about, and maybe spend a lazy afternoon at the food market you mentioned. Of course, the most important thing for me is just hanging out, cooking together, and watching ridiculous films like the old days.",
      },
      {
        heading: "Sign off",
        body: "Let me know if there's anything you'd like me to bring over — I'm happy to pack a few of those biscuits you love.\n\nCan't wait to see you!\nLots of love,\nAlex",
      },
    ],
    variants: [
      // ── Variant 1 — Warm everyday tone ──────────────────────────────
      {
        bandScore: "8.5",
        wordCount: 174,
        paragraphs: [
          {
            heading: "Opening",
            body: "Hi Sam,\n\nThanks so much for inviting me over next month — I honestly can't wait! It's been ages since we've had a proper catch-up, and your messages about the new neighbourhood have made me even more excited about the trip.",
          },
          {
            heading: "Travel plans",
            body: "I've finally booked everything: I'll be flying in on the evening of 14 May and heading back home on the 22nd. My flight lands at around 9 pm local time, so don't worry about picking me up — I'll grab a taxi straight to yours. If anything changes I'll send you the new details right away.",
          },
          {
            heading: "Things I'd love to do",
            body: "While I'm there I'd really love to visit that little coastal town you keep raving about, and maybe spend a lazy afternoon at the food market you mentioned. Of course, the most important thing for me is just hanging out, cooking together, and watching ridiculous films like the old days.",
          },
          {
            heading: "Sign off",
            body: "Let me know if there's anything you'd like me to bring over — I'm happy to pack a few of those biscuits you love.\n\nCan't wait to see you!\nLots of love,\nAlex",
          },
        ],
      },
      // ── Variant 2 — Bubbly, very enthusiastic ──────────────────────
      {
        bandScore: "8.0",
        wordCount: 168,
        paragraphs: [
          {
            heading: "Opening",
            body: "Hey Maya!\n\nI'm SO excited about coming to stay with you — thank you a million times for the invite! Honestly, I've been counting down the days since you first mentioned it.",
          },
          {
            heading: "Travel plans",
            body: "Quick update on my journey: I'm taking the overnight train and should arrive at the central station at around 7:30 in the morning on Saturday the 6th. I'll be there for about ten days, leaving on the 16th. Don't get up early to meet me — I can easily walk to your place from the station.",
          },
          {
            heading: "Things I'd love to do",
            body: "I really want to do all the silly tourist stuff with you — the giant ferris wheel, that night market you keep posting about, and ideally a day trip to the lake if the weather's nice. And of course at least one slow Sunday breakfast that lasts three hours.",
          },
          {
            heading: "Sign off",
            body: "Let me know if you fancy anything specific from back home — I can throw it in my bag.\n\nSee you very soon!\nLove,\nPriya",
          },
        ],
      },
      // ── Variant 3 — Calmer, more reflective tone ──────────────────
      {
        bandScore: "8.0",
        wordCount: 170,
        paragraphs: [
          {
            heading: "Opening",
            body: "Dear Lucas,\n\nIt was so lovely to get your invitation last week. Thank you for thinking of me — a quiet trip out to see you is exactly what I need at the moment, and I'm really looking forward to it.",
          },
          {
            heading: "Travel plans",
            body: "I've now sorted out the details. I'll be driving up on Friday 12 July and plan to arrive at your place in the late afternoon, traffic permitting. I should be heading home again on the morning of the 19th, so we'll have a full week together.",
          },
          {
            heading: "Things I'd love to do",
            body: "I'd really enjoy a couple of long walks along the coast, and maybe an evening at that quiet bookshop café you mentioned in your last email. More than anything, though, I just want a chance to slow down, talk properly, and catch up on everything that's happened this year.",
          },
          {
            heading: "Sign off",
            body: "Let me know if there's anything I can pick up for you on the way.\n\nTake care, and see you very soon.\nWarm wishes,\nElena",
          },
        ],
      },
    ],
    structure: [
      { label: "Opening", detail: "Friendly greeting + thank them / acknowledge the invitation." },
      { label: "Travel plans", detail: "Cover the practical bullet point: dates, arrival, transport." },
      { label: "What you want to do", detail: "Suggest specific activities — keep the tone warm and personal." },
      { label: "Sign off", detail: "Close warmly: 'Lots of love', 'See you soon', 'Take care'." },
    ],
    vocabulary: [
      { term: "I can't wait", meaning: "I'm very excited" },
      { term: "have a proper catch-up", meaning: "spend real time talking together" },
      { term: "rave about", meaning: "talk enthusiastically about" },
      { term: "hang out", meaning: "spend casual time together" },
      { term: "drop me a line", meaning: "send me a message" },
      { term: "fancy", meaning: "feel like having (informal)" },
      { term: "sort out the details", meaning: "organise the practical arrangements" },
    ],
    tips: [
      "Use a friendly opener like 'Hi' or 'Hey' — never 'Dear Sir or Madam' for a friend.",
      "Use contractions ('I'm', 'can't', 'we'll') — they make the tone naturally informal.",
      "Cover all three bullet points clearly — one short paragraph each works well.",
      "Sign off warmly: 'Lots of love', 'Take care', 'See you soon' + your first name only.",
    ],
  },
};
