// Speaking Samples — runtime model answer generator.
// For each topic we synthesize a Band 8+ structured response with an
// introduction, two to three idea paragraphs, and a concise conclusion.
// This mirrors the natural flow of an IELTS speaking response and lets
// the Flip Expansion View render content for any topic without a manual bank.

export type SpeakingAnswerSection = {
  heading: string;
  body: string;
};

export type SpeakingModelAnswer = {
  bandScore: string;
  sections: SpeakingAnswerSection[];
};

export function getSpeakingModelAnswer(
  topicLabel: string,
  isCueCard: boolean,
): SpeakingModelAnswer {
  const t = topicLabel.toLowerCase();

  if (isCueCard) {
    return {
      bandScore: "8.5",
      sections: [
        {
          heading: "Introduction",
          body: `I'd like to talk about ${t}, which is something that has genuinely shaped the way I see the world. It's not a topic I think about every day, but when I do reflect on it, I realise just how much of an impression it has left on me.`,
        },
        {
          heading: "What it is and when I experienced it",
          body: `My experience with ${t} goes back a few years now. At the time I wasn't really expecting it to mean very much, but looking back it stands out as one of those moments that quietly changed my perspective. I remember the setting clearly — the atmosphere, the people around me, even the small details that you don't usually pay attention to.`,
        },
        {
          heading: "Why it stayed with me",
          body: `What made ${t} so memorable for me was the emotional response it triggered. There's a difference between something you simply see or do and something that genuinely moves you, and this fell firmly into the second category. I felt a real sense of connection, and that's something I think a lot of people are searching for in their own way.`,
        },
        {
          heading: "Conclusion",
          body: `So overall, ${t} is something I look back on with a lot of appreciation. It taught me that the experiences which mean the most are rarely the loudest or the most obvious — they're usually the quieter ones that catch you off guard. I'd happily revisit it if I had the chance.`,
        },
      ],
    };
  }

  return {
    bandScore: "8.0",
    sections: [
      {
        heading: "Introduction",
        body: `When it comes to ${t}, I think it plays a bigger role in modern life than most people give it credit for. It's one of those things that quietly shapes our routines, our preferences, and even our relationships, often without us really noticing.`,
      },
      {
        heading: "Personal perspective",
        body: `Personally, I'd say ${t} matters to me because it adds variety and meaning to my day-to-day life. I've come to appreciate it more as I've grown older, partly because I now understand the effort and thought that goes into it, and partly because I've seen how it can bring people together.`,
      },
      {
        heading: "Wider view",
        body: `On a broader level, attitudes towards ${t} have shifted quite noticeably in recent years. Younger generations tend to engage with it differently — they're more open, more experimental, and definitely more influenced by social media and global trends. That's not necessarily a bad thing; it just means the experience keeps evolving.`,
      },
      {
        heading: "Conclusion",
        body: `So to sum up, ${t} is something I see as both personal and cultural. It reflects who we are as individuals and where society is heading. I expect it to keep changing, but I think the core appeal will stay the same — and that's exactly what makes it worth talking about.`,
      },
    ],
  };
}
