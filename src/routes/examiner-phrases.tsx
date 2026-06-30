import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/examiner-phrases")({
  head: () => ({
    meta: [
      { title: "Examiner Phrases — What IELTS Examiners Actually Say" },
      {
        name: "description",
        content:
          "Decode the exact phrases IELTS examiners use in the Speaking test. See the plain-English meaning and exactly what to do in response.",
      },
      { property: "og:title", content: "Examiner Phrases — IELTS Speaking Decoded" },
      {
        property: "og:description",
        content:
          "The exact sentences examiners say, what they really mean, and how to respond — so you never freeze in the Speaking test.",
      },
    ],
  }),
  component: ExaminerPhrasesPage,
});

type Phrase = {
  phrase: string;
  meaning: string;
  doThis: string;
  avoid?: string;
};

type Section = {
  id: string;
  title: string;
  subtitle: string;
  tone: { bg: string; border: string; chip: string };
  phrases: Phrase[];
};

const sections: Section[] = [
  {
    id: "intro",
    title: "Opening & ID check",
    subtitle: "The very first minute of your test.",
    tone: {
      bg: "oklch(0.97 0.03 75)",
      border: "oklch(0.85 0.07 75)",
      chip: "oklch(0.92 0.06 75)",
    },
    phrases: [
      {
        phrase: "Good morning. My name is … Can you tell me your full name, please?",
        meaning: "Standard greeting and ID confirmation. Not scored.",
        doThis: "Say your full name clearly and naturally. A short, polite reply is enough.",
        avoid: "Don't launch into a rehearsed introduction speech — they didn't ask for one.",
      },
      {
        phrase: "And what shall I call you?",
        meaning: "What short name or nickname should I use during the test?",
        doThis: "Give a short form: \"Please call me Sam.\" One sentence.",
      },
      {
        phrase: "Can I see your identification, please?",
        meaning: "Show your passport / ID. Still not scored.",
        doThis: "Hand it over calmly. Smile. Wait for the next question.",
      },
    ],
  },
  {
    id: "part1",
    title: "Part 1 — Familiar topics",
    subtitle: "Short questions about you, your life and routines.",
    tone: {
      bg: "oklch(0.96 0.04 145)",
      border: "oklch(0.82 0.08 145)",
      chip: "oklch(0.9 0.07 145)",
    },
    phrases: [
      {
        phrase: "Let's talk about your hometown.",
        meaning: "I'm changing topic. The next 3–4 questions will all be about your hometown.",
        doThis: "Get ready for short, personal answers. 2–3 sentences each, with a reason or example.",
      },
      {
        phrase: "Do you work or are you a student?",
        meaning: "Tell me your current situation so I can pick follow-up questions.",
        doThis: "Pick one clearly and add a small detail: \"I'm a student — I'm studying marketing at university.\"",
        avoid: "Don't say \"both\" without explaining; it confuses the follow-ups.",
      },
      {
        phrase: "Why is that?",
        meaning: "Give me the reason behind your last answer.",
        doThis: "Start with \"Because…\" or \"The main reason is…\" and add one supporting detail.",
      },
      {
        phrase: "Can you explain that a bit more?",
        meaning: "Your answer was too short or unclear. Extend it.",
        doThis: "Add an example, a contrast, or a personal experience. Aim for 2 more sentences.",
      },
    ],
  },
  {
    id: "part2",
    title: "Part 2 — The long turn",
    subtitle: "The cue-card section. 1 minute to prepare, 1–2 minutes to speak.",
    tone: {
      bg: "oklch(0.96 0.04 35)",
      border: "oklch(0.82 0.1 35)",
      chip: "oklch(0.9 0.08 35)",
    },
    phrases: [
      {
        phrase: "Now I'm going to give you a topic and I'd like you to talk about it for one to two minutes.",
        meaning: "Part 2 is starting. You'll get a card with a topic and prompts.",
        doThis: "Listen, take the card and pencil, and breathe. Don't start talking yet.",
      },
      {
        phrase: "You have one minute to think about what you're going to say. You can make some notes if you wish.",
        meaning: "Use the full 60 seconds to plan. Notes are encouraged.",
        doThis: "Jot 4–5 keywords for each bullet on the card. Plan an opening line and an ending.",
        avoid: "Don't sit silent or wave the pencil away — planning improves your score.",
      },
      {
        phrase: "All right? Remember you have one to two minutes for this. Don't worry if I stop you. I'll tell you when the time is up. Can you start speaking now, please?",
        meaning: "Begin. I will cut you off at 2 minutes — that's normal, not a bad sign.",
        doThis: "Start with a clear opener (\"I'd like to talk about…\"). Cover all bullets. Keep speaking until stopped.",
      },
      {
        phrase: "Thank you. Thank you, that's the end of Part 2.",
        meaning: "Stop talking. We're moving on.",
        doThis: "Stop mid-sentence if needed. Hand back the card and pencil.",
      },
    ],
  },
  {
    id: "part3",
    title: "Part 3 — Discussion",
    subtitle: "Abstract questions linked to your Part 2 topic.",
    tone: {
      bg: "oklch(0.96 0.04 295)",
      border: "oklch(0.82 0.09 295)",
      chip: "oklch(0.9 0.07 295)",
    },
    phrases: [
      {
        phrase: "We've been talking about … and I'd like to discuss with you one or two more general questions related to this.",
        meaning: "Part 3 is starting. Questions get broader and more abstract.",
        doThis: "Shift gear: longer answers, opinions, comparisons, future predictions. 3–5 sentences each.",
      },
      {
        phrase: "What do you think?",
        meaning: "Give your opinion, not just facts.",
        doThis: "Use \"I think / In my opinion / Personally, I'd say…\" then a reason and an example.",
      },
      {
        phrase: "Why do you think that is?",
        meaning: "Explain the cause behind what you just said.",
        doThis: "Use cause language: \"This is mainly because…\", \"One reason is…\", \"It comes down to…\"",
      },
      {
        phrase: "Do you think this will change in the future?",
        meaning: "Predict. Speculate. Use future forms.",
        doThis: "Use \"will probably / is likely to / I'd expect…\" and give a reason for your prediction.",
      },
      {
        phrase: "Some people say … . How do you feel about that?",
        meaning: "React to an opposing view. Agree, disagree, or partly agree.",
        doThis: "Take a clear position first, then justify: \"I'd partly agree with that, because…\"",
        avoid: "Don't sit on the fence with no reasoning. Examiners want a developed view.",
      },
      {
        phrase: "Thank you. That is the end of the Speaking test.",
        meaning: "We're done. The test has ended.",
        doThis: "Smile, say thank you, and leave calmly. Don't ask for feedback — they can't give any.",
      },
    ],
  },
  {
    id: "recovery",
    title: "When something goes wrong",
    subtitle: "Phrases examiners use if you struggle — and how to recover.",
    tone: {
      bg: "oklch(0.96 0.03 250)",
      border: "oklch(0.82 0.08 250)",
      chip: "oklch(0.9 0.06 250)",
    },
    phrases: [
      {
        phrase: "Sorry, could you say that again?",
        meaning: "I didn't catch what you said. Please repeat.",
        doThis: "Repeat your sentence more slowly and clearly. Don't change the whole answer.",
      },
      {
        phrase: "Let me repeat the question.",
        meaning: "You misunderstood. I'll say it again — listen for the key word.",
        doThis: "Listen for the question word (why, how, what kind). Don't panic; this is not a penalty.",
      },
      {
        phrase: "Let's move on to the next question.",
        meaning: "I've heard enough on this one. Stop and wait for the new question.",
        doThis: "Stop talking immediately. Don't keep going — it eats into your other answers.",
      },
      {
        phrase: "We need to move on now.",
        meaning: "You're running long. I'm cutting this section short.",
        doThis: "Wrap up in one short sentence and be ready for the next prompt.",
      },
    ],
  },
];

function ExaminerPhrasesPage() {
  // open state keyed by section.id + index
  const [open, setOpen] = useState<Record<string, boolean>>({ "intro-0": true });

  return (
    <div className="min-h-screen bg-paper-white">
      <Header />

      {/* Hero */}
      <section className="border-b border-foreground/10 bg-paper-white">
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Examiner phrases, decoded.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-display text-base font-medium leading-relaxed text-foreground/65 sm:text-lg">
              The exact sentences IELTS examiners say in the Speaking test — with the plain-English
              meaning and exactly what you should do in response. Tap any phrase to expand.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky section nav */}
      <nav className="sticky top-[64px] z-30 border-b border-foreground/10 bg-paper-white/90 backdrop-blur">
        <div className="container-page flex gap-2 overflow-x-auto py-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="shrink-0 rounded-full border border-foreground/15 px-4 py-2 font-display text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <main className="container-page space-y-16 py-16 sm:space-y-20 sm:py-20">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-36">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-1 font-display text-sm font-medium text-foreground/60 sm:text-base">
                  {s.subtitle}
                </p>
              </div>
            </div>

            <ul className="grid gap-4">
              {s.phrases.map((p, i) => {
                const key = `${s.id}-${i}`;
                const isOpen = !!open[key];
                return (
                  <li
                    key={key}
                    className="overflow-hidden rounded-3xl border transition-shadow"
                    style={{
                      backgroundColor: s.tone.bg,
                      borderColor: s.tone.border,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen((o) => ({ ...o, [key]: !isOpen }))}
                      aria-expanded={isOpen}
                      className="group flex w-full items-start justify-between gap-6 px-6 py-5 text-left sm:px-8 sm:py-6"
                    >
                      <span className="font-display text-lg font-extrabold leading-snug tracking-tight text-foreground sm:text-xl">
                        "{p.phrase}"
                      </span>
                      <span
                        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/25 bg-background/70 transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <Plus className="h-4 w-4" strokeWidth={3} />
                      </span>
                    </button>

                    <div
                      className="grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="min-h-0">
                        <div className="space-y-5 px-6 pb-7 sm:px-8 sm:pb-8">
                          <Detail
                            chipBg={s.tone.chip}
                            label="What it means"
                            body={p.meaning}
                          />
                          <Detail
                            chipBg={s.tone.chip}
                            label="What to do"
                            body={p.doThis}
                          />
                          {p.avoid && (
                            <Detail
                              chipBg={s.tone.chip}
                              label="Avoid"
                              body={p.avoid}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}

function Detail({
  label,
  body,
  chipBg,
}: {
  label: string;
  body: string;
  chipBg: string;
}) {
  return (
    <div>
      <span
        className="inline-block rounded-full px-3 py-1 font-display text-[11px] font-extrabold uppercase tracking-wider text-foreground"
        style={{ backgroundColor: chipBg }}
      >
        {label}
      </span>
      <p className="mt-2 font-display text-base font-medium leading-relaxed text-foreground/85 sm:text-[17px]">
        {body}
      </p>
    </div>
  );
}
