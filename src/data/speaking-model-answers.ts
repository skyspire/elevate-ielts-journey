// Speaking Samples — runtime model answer generator.
// For cue cards we synthesize THREE distinct Band 8+ structured responses
// so learners can compare different angles, tones, and idea structures.
// Each answer follows a natural IELTS speaking flow:
//   Introduction → Idea paragraphs → Conclusion.

export type SpeakingAnswerSection = {
  heading: string;
  body: string;
};

export type SpeakingAnswerVariant = {
  label: string; // e.g. "Personal & Reflective"
  bandScore: string;
  sections: SpeakingAnswerSection[];
};

export type SpeakingModelAnswer = {
  bandScore: string;
  // Single answer (kept for backwards compatibility with non-cue contexts)
  sections: SpeakingAnswerSection[];
  // Cue cards expose three switchable variants
  variants?: SpeakingAnswerVariant[];
};

export function getSpeakingModelAnswer(
  topicLabel: string,
  isCueCard: boolean,
): SpeakingModelAnswer {
  const t = topicLabel.toLowerCase();

  if (isCueCard) {
    const variants: SpeakingAnswerVariant[] = [
      {
        label: "Personal & Reflective",
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
      },
      {
        label: "Descriptive & Vivid",
        bandScore: "8.5",
        sections: [
          {
            heading: "Introduction",
            body: `One thing that immediately springs to mind when I think about ${t} is just how rich the imagery around it is. It's the kind of subject that's easier to picture than to describe, but I'll do my best to paint that scene properly.`,
          },
          {
            heading: "Setting the scene",
            body: `Whenever I think about ${t}, I find myself returning to a very specific mental snapshot — the colours, the sounds, the texture of the moment. There's a warmth to it that's hard to put into words, and yet it feels almost cinematic in how clearly it plays back in my head.`,
          },
          {
            heading: "What makes it stand out",
            body: `What really distinguishes ${t} for me is the layering of small sensory details. It's not one big thing — it's the combination of sights, smells, and ambient sound that build a kind of atmosphere you genuinely want to step inside. That's quite rare, and I think that's why it stays with people.`,
          },
          {
            heading: "Conclusion",
            body: `So to wrap up, ${t} is something I'd describe as quietly magnetic. It doesn't shout for attention, but once you notice it properly, it's almost impossible to look away. That's the mark of something genuinely worth talking about.`,
          },
        ],
      },
      {
        label: "Analytical & Thoughtful",
        bandScore: "9.0",
        sections: [
          {
            heading: "Introduction",
            body: `${t.charAt(0).toUpperCase() + t.slice(1)} is one of those subjects that rewards a bit of unpacking. On the surface it seems quite simple, but there's actually a surprising amount going on underneath if you take the time to look properly.`,
          },
          {
            heading: "The deeper meaning",
            body: `If I think about why ${t} resonates with so many people, I'd argue it touches on something quite universal — a sense of identity, belonging, or meaning, depending on the angle you take. We all interpret it slightly differently, and that's part of what makes it such an interesting talking point.`,
          },
          {
            heading: "How my view has evolved",
            body: `My own perspective on ${t} has shifted noticeably over the years. I used to take it more or less at face value, but the more I've experienced of life, the more I've come to see the nuances. It's no longer a fixed idea for me — it's something I keep re-examining, and I quite enjoy that ongoing process.`,
          },
          {
            heading: "Conclusion",
            body: `So in conclusion, ${t} is far more layered than it first appears. The reason it remains relevant — for me and probably for a lot of others — is that it grows alongside us. It evolves as our understanding deepens, and I suspect that's exactly why it's worth talking about at length.`,
          },
        ],
      },
    ];

    return {
      bandScore: variants[0].bandScore,
      sections: variants[0].sections,
      variants,
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
