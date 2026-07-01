import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { QuestionCard } from "./QuestionCard";
import { AccessNote } from "./AccessNote";
import { Button } from "@/components/ui/button";

type ModuleKey = "writing" | "speaking" | "reading" | "listening";

const palette: Record<
  ModuleKey,
  { label: string; icon: string; active: string; soft: string; ink: string; ring: string }
> = {
  writing: {
    label: "Writing",
    icon: "✍️",
    active: "#c8ebd4", // mint
    soft: "#e6f5ec",
    ink: "#1f3b2a",
    ring: "#9ed7b3",
  },
  speaking: {
    label: "Speaking",
    icon: "🎙",
    active: "#fbd7be", // peach
    soft: "#fdeadd",
    ink: "#4a2a17",
    ring: "#f2b98f",
  },
  reading: {
    label: "Reading",
    icon: "📖",
    active: "#dfd0f2", // lilac
    soft: "#ece2f8",
    ink: "#2f2246",
    ring: "#c4aee5",
  },
  listening: {
    label: "Listening",
    icon: "🎧",
    active: "#fbe8b0", // butter
    soft: "#fdf3d3",
    ink: "#4a3a10",
    ring: "#efd27a",
  },
};

const questions: Record<
  ModuleKey,
  { tag: string; type: string; title: string; date: string }[]
> = {
  writing: [
    {
      tag: "Environment",
      type: "Writing Task 2",
      title:
        "Some people believe individuals can do little to protect the environment. To what extent do you agree?",
      date: "April 2026",
    },
    {
      tag: "Education",
      type: "Writing Task 2",
      title:
        "Many universities now offer online courses. Are the benefits greater than the drawbacks?",
      date: "March 2026",
    },
    {
      tag: "Bar Chart",
      type: "Writing Task 1",
      title:
        "The chart below shows household spending on leisure activities in four countries in 2024.",
      date: "March 2026",
    },
  ],
  speaking: [
    {
      tag: "Hometown",
      type: "Speaking Part 1",
      title: "Describe your hometown and what you like most about it.",
      date: "April 2026",
    },
    {
      tag: "Memorable Trip",
      type: "Speaking Part 2",
      title:
        "Describe a journey that did not go as planned. You should say where, when, who and why.",
      date: "April 2026",
    },
    {
      tag: "Technology",
      type: "Speaking Part 3",
      title: "How has technology changed the way people communicate in your country?",
      date: "March 2026",
    },
  ],
  reading: [
    {
      tag: "History",
      type: "Academic Reading",
      title: "The origins of the printing press and its impact on European society.",
      date: "April 2026",
    },
    {
      tag: "Science",
      type: "Academic Reading",
      title: "How coral reefs adapt to rising ocean temperatures — a decade of research.",
      date: "March 2026",
    },
    {
      tag: "Workplace",
      type: "General Reading",
      title: "Notice to employees: revised policy on flexible working arrangements.",
      date: "March 2026",
    },
  ],
  listening: [
    {
      tag: "Conversation",
      type: "Listening Section 1",
      title: "Two friends discuss booking a weekend cabin — dates, prices and amenities.",
      date: "April 2026",
    },
    {
      tag: "Lecture",
      type: "Listening Section 4",
      title: "A university lecture on the psychology of habit formation and behaviour change.",
      date: "April 2026",
    },
    {
      tag: "Announcement",
      type: "Listening Section 2",
      title: "Museum tour guide explains the layout, exhibits and visitor rules.",
      date: "March 2026",
    },
  ],
};

export function LatestQuestions() {
  const [active, setActive] = useState<ModuleKey>("writing");
  const modules: ModuleKey[] = ["writing", "speaking", "reading", "listening"];

  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "#faf7f0" }}>
      <div className="container-page">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeader
            align="left"
            eyebrow="Latest exam questions"
            title="Fresh from recent test sittings"
            description="Updated each month with verified questions reported by real test-takers."
          />
          <Button variant="outline" className="rounded-full font-bold">
            View all questions
          </Button>
        </div>

        <div className="mt-10">
          <AccessNote />
        </div>

        {/* Big pastel pill tabs */}
        <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
          {modules.map((m) => {
            const p = palette[m];
            const isActive = active === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setActive(m)}
                aria-pressed={isActive}
                className="group inline-flex items-center gap-3 rounded-full border-2 px-6 py-4 font-display text-base font-extrabold tracking-tight transition-all duration-300 sm:px-8 sm:py-5 sm:text-lg"
                style={{
                  backgroundColor: isActive ? p.active : "#ffffff",
                  borderColor: isActive ? p.ring : "#e8e2d4",
                  color: isActive ? p.ink : "#2a2a2a",
                  boxShadow: isActive
                    ? `0 8px 22px -12px ${p.ring}`
                    : "0 2px 0 0 #eee6d4",
                  transform: isActive ? "translateY(-1px)" : "none",
                }}
              >
                <span className="text-xl sm:text-2xl" aria-hidden>
                  {p.icon}
                </span>
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Question cards — filled in active pastel */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {questions[active].map((q) => (
            <QuestionCard
              key={q.title}
              tag={q.tag}
              type={q.type}
              title={q.title}
              date={q.date}
              fill={palette[active].soft}
              accent={palette[active].active}
              ink={palette[active].ink}
              ring={palette[active].ring}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
