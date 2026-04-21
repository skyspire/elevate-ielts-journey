import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  ArrowLeft,
  MessageCircle,
  ClipboardList,
  Mic,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Calendar,
  type LucideProps,
} from "lucide-react";
import { z } from "zod";
import type { ComponentType } from "react";
import { Footer } from "@/components/site/Footer";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
});

export const Route = createFileRoute("/speaking-samples/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Speaking Samples — BigIELTS.com" },
      {
        name: "description",
        content:
          "Browse Band 8+ IELTS Speaking samples. Choose between General Questions (Part 1 & 3) or Cue Cards & Follow-Ups (Part 2), and explore model answers with examiner-style follow-ups.",
      },
      { property: "og:title", content: "Speaking Samples — BigIELTS.com" },
      {
        property: "og:description",
        content:
          "Band 8+ IELTS Speaking samples organised by part and theme.",
      },
    ],
  }),
  component: SpeakingSamplesPage,
});

type Module = "academic" | "general";
type Mode = "general" | "cuecards";

type Category = {
  id: string;
  label: string;
  hint: string;
  icon: ComponentType<LucideProps>;
};

const categoriesByMode: Record<Mode, Category[]> = {
  general: [
    { id: "hometown", label: "Hometown & Home", hint: "Part 1 favourites", icon: MessageCircle },
    { id: "work-study", label: "Work & Study", hint: "Daily life questions", icon: MessageCircle },
    { id: "hobbies", label: "Hobbies & Free Time", hint: "Personal preferences", icon: MessageCircle },
    { id: "technology", label: "Technology & Society", hint: "Part 3 abstract themes", icon: MessageCircle },
    { id: "environment", label: "Environment", hint: "Discussion topics", icon: MessageCircle },
    { id: "education-p3", label: "Education", hint: "Opinion & analysis", icon: MessageCircle },
  ],
  cuecards: [
    { id: "person", label: "Describe a Person", hint: "Friend, mentor, family", icon: ClipboardList },
    { id: "place", label: "Describe a Place", hint: "City, room, building", icon: ClipboardList },
    { id: "object", label: "Describe an Object", hint: "Gift, possession, tool", icon: ClipboardList },
    { id: "event", label: "Describe an Event", hint: "Memorable moments", icon: ClipboardList },
    { id: "experience", label: "Describe an Experience", hint: "Trips, achievements", icon: ClipboardList },
    { id: "activity", label: "Describe an Activity", hint: "Skills & habits", icon: ClipboardList },
  ],
};

// ───────── Sample prompts ─────────
type Tone = "blue" | "mint" | "peach" | "lilac";
type Question = {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tone: Tone;
};

const TONES: Tone[] = ["blue", "mint", "peach", "lilac"];

const samplePrompts: Record<string, string[]> = {
  hometown: [
    "Where is your hometown and what is it best known for?",
    "What do you like most about your hometown?",
    "How has your hometown changed in the last ten years?",
    "Would you like to live in your hometown in the future? Why or why not?",
    "Do many tourists visit your hometown? What do they usually do there?",
    "Is your hometown a good place for young people to grow up?",
  ],
  "work-study": [
    "Do you work or are you a student? Tell me about it.",
    "Why did you choose this job / field of study?",
    "What is the most interesting part of your work or studies?",
    "Do you prefer working alone or with other people?",
    "What would you like to do in the future?",
  ],
  hobbies: [
    "What do you like to do in your free time?",
    "Have your hobbies changed since you were a child?",
    "Do you prefer indoor or outdoor activities?",
    "Is there a new hobby you would like to try?",
    "Do people in your country have enough free time?",
  ],
  technology: [
    "How has technology changed the way people communicate in your country?",
    "Do you think people rely too much on smartphones today?",
    "What are the advantages and disadvantages of working from home?",
    "Should children be allowed to use social media? Why?",
    "How might technology change education in the next 20 years?",
  ],
  environment: [
    "What are the biggest environmental problems in your country?",
    "Whose responsibility is it to protect the environment — governments or individuals?",
    "How can cities be made more environmentally friendly?",
    "Do you think electric cars will solve pollution problems?",
  ],
  "education-p3": [
    "Should university education be free for everyone?",
    "What skills should schools teach that they currently do not?",
    "Is it better to study online or in a traditional classroom?",
    "How important is it to learn a foreign language at school?",
  ],
  person: [
    "Describe a person who has had a strong influence on your life. You should say who they are, how you know them, what they are like, and why they have influenced you.",
    "Describe a teacher you remember well from your school days.",
    "Describe a family member you are close to.",
    "Describe a person you admire who is not a celebrity.",
    "Describe a friend you would like to travel with.",
  ],
  place: [
    "Describe a place you visited that you found particularly peaceful. You should say where it is, when you went there, who you were with, and why it felt peaceful.",
    "Describe your favourite room in your home.",
    "Describe a city you would like to live in.",
    "Describe a building in your country that is important to you.",
    "Describe a beautiful natural place you have visited.",
  ],
  object: [
    "Describe a gift you received that was important to you. You should say what it was, who gave it to you, when you received it, and why it was important.",
    "Describe a piece of technology you find useful.",
    "Describe a book you have read more than once.",
    "Describe an item of clothing you wear often.",
    "Describe an object you would like to own in the future.",
  ],
  event: [
    "Describe a celebration you remember well. You should say what was being celebrated, where it took place, who was there, and why you remember it.",
    "Describe a time you were surprised by something.",
    "Describe an important decision you made.",
    "Describe a public event you attended.",
    "Describe a journey that did not go as planned.",
  ],
  experience: [
    "Describe a time you learned a new skill. You should say what it was, when and how you learned it, who taught you, and how you felt afterwards.",
    "Describe a memorable trip you took.",
    "Describe a time you helped someone.",
    "Describe an achievement you are proud of.",
    "Describe a challenging experience you overcame.",
  ],
  activity: [
    "Describe an outdoor activity you enjoy. You should say what it is, where you do it, who you do it with, and why you enjoy it.",
    "Describe a sport you would like to learn.",
    "Describe a daily routine you enjoy.",
    "Describe a creative activity you do in your free time.",
    "Describe something you do to relax.",
  ],
};

const TOPICS = ["Daily life", "Society", "Personal", "Culture", "Future", "Memory", "Work", "Travel"] as const;

const makeQuestions = (categoryId: string): Question[] => {
  const prompts = samplePrompts[categoryId] ?? [];
  return prompts.map((statement, i) => ({
    id: `${categoryId}-${i + 1}`,
    title: statement,
    topic: TOPICS[i % TOPICS.length],
    difficulty: (["Easy", "Medium", "Hard"] as const)[i % 3],
    tone: TONES[i % TONES.length],
  }));
};

function SpeakingSamplesPage() {
  const search = Route.useSearch();
  const module: Module = search.module ?? "general";
  const [mode, setMode] = useState<Mode | null>(null);
  const fallbackCategories = categoriesByMode["general"];
  const categories = mode ? categoriesByMode[mode] : fallbackCategories;
  const [categoryId, setCategoryId] = useState<string>(fallbackCategories[0].id);

  const onModeChange = (next: Mode) => {
    setMode(next);
    setCategoryId(categoriesByMode[next][0].id);
  };

  // Speaking samples uses a sage/teal accent to feel distinct from Writing Samples
  const accentText = "text-[oklch(0.42_0.10_165)]";
  const accentChip =
    "bg-[oklch(0.94_0.04_165)] text-[oklch(0.38_0.10_165)] border-[oklch(0.55_0.10_165)]/30";
  const accentRing =
    "ring-[oklch(0.55_0.10_165)]/45 border-[oklch(0.55_0.10_165)]/45";

  const activeCategory = categories.find((c) => c.id === categoryId) ?? categories[0];
  const questions = makeQuestions(activeCategory.id);

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.014_165)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-[oklch(0.985_0.014_165)]/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">BigIELTS.com</span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="relative pt-10 sm:pt-14">
        {/* Soft sage ruled overlay for the hero zone */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0, transparent 39px, oklch(0.45 0.08 165 / 0.10) 39px, oklch(0.45 0.08 165 / 0.10) 40px)",
          }}
        />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6">
          {/* Massive eyebrow */}
          <div className="mt-4 text-center">
            <h2
              className={`relative inline-block font-display font-black leading-[0.95] tracking-[-0.02em] ${accentText}`}
              style={{ fontSize: "clamp(2.25rem, 8vw, 5rem)" }}
            >
              {/* Mic doodle */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className={`absolute -left-5 -top-2 h-5 w-5 sm:-left-10 sm:-top-4 sm:h-7 sm:w-7 ${accentText} opacity-70`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
              </svg>

              IELTS{" "}
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute inset-x-[-6px] bottom-[6%] -z-10 h-[58%] -rotate-1 bg-[oklch(0.88_0.10_165)] opacity-70"
                  style={{ clipPath: "polygon(1% 8%, 99% 2%, 100% 92%, 0% 98%)" }}
                />
                <span className="relative">Speaking</span>

                <svg
                  aria-hidden
                  viewBox="0 0 300 22"
                  preserveAspectRatio="none"
                  className={`absolute -bottom-3 left-0 h-3 w-full ${accentText}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14 C 60 4, 140 20, 210 8 S 290 14, 296 10" />
                </svg>
              </span>
            </h2>

            <h1 className="mt-8 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Speaking Samples
              <br />
              <span className="text-foreground/55">Choose your format.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium leading-relaxed text-foreground/65 sm:text-base">
              Pick a question style, then a theme. We'll show you Band 8+ model answers with examiner follow-ups.
            </p>
          </div>

          {/* Step 1 — Big format toggle (General vs Cue Cards) */}
          <div className="mt-14 sm:mt-20">
            <FormatTogglePair mode={mode} onChange={onModeChange} />
          </div>

          {/* Steps 2 & 3 — gated until format is chosen */}
          {mode && (
            <>
              {/* Step 2 — Theme chips */}
              <div className="mt-16 flex flex-wrap justify-center gap-2.5 sm:mt-20">
                {categories.map((c) => {
                  const active = categoryId === c.id;
                  const Icon = c.icon;
                  const activeClasses =
                    "bg-[oklch(0.50_0.10_165)] text-white border-[oklch(0.50_0.10_165)] shadow-soft";
                  const restingClasses =
                    "bg-card text-foreground/75 border-border hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground hover:shadow-soft";
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-[14px] font-bold tracking-tight transition-all duration-200 ${
                        active ? activeClasses : restingClasses
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                      {c.label}
                    </button>
                  );
                })}
              </div>

              {/* Step 3 — Questions list with sage paper-dots background */}
              <div className="relative mt-16 left-1/2 right-1/2 -mx-[50vw] w-screen bg-paper-sage pb-20 sm:mt-20 sm:pb-28">
                <div className="relative mx-auto w-full max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {questions.map((q, i) => (
                      <SpeakingQuestionCard
                        key={q.id}
                        index={i + 1}
                        q={q}
                        category={activeCategory.label}
                        mode={mode}
                        accentChip={accentChip}
                        accentRing={accentRing}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ───────── Format toggle (the hero CTA) ─────────
function FormatTogglePair({
  mode,
  onChange,
}: {
  mode: Mode | null;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
      <FormatCard
        active={mode === "general"}
        onClick={() => onChange("general")}
        icon={MessageCircle}
        eyebrow="Part 1 & Part 3"
        title="General Questions"
        subtitle="Short, conversational questions about you and abstract opinion topics."
      />
      <FormatCard
        active={mode === "cuecards"}
        onClick={() => onChange("cuecards")}
        icon={ClipboardList}
        eyebrow="Part 2"
        title="Cue Cards & Follow-Ups"
        subtitle="Long-turn descriptions from a topic card, plus examiner follow-up prompts."
      />
    </div>
  );
}

function FormatCard({
  active,
  onClick,
  icon: Icon,
  eyebrow,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: ComponentType<LucideProps>;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border bg-white p-6 text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-card sm:p-7 ${
        active
          ? "ring-2 ring-inset ring-[oklch(0.55_0.10_165)]/55 border-[oklch(0.55_0.10_165)]/55"
          : "border-foreground/10"
      }`}
    >
      {/* Decorative corner doodle */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.92_0.06_165)] opacity-60 transition-transform duration-500 group-hover:scale-125"
      />

      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft transition-colors ${
          active
            ? "bg-[oklch(0.50_0.10_165)] text-white"
            : "bg-[oklch(0.94_0.04_165)] text-[oklch(0.40_0.10_165)]"
        }`}
      >
        <Icon className="h-7 w-7" strokeWidth={2.3} />
      </span>

      <div className="relative">
        <div className="font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
          {eyebrow}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h3>
          {active && (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[oklch(0.40_0.10_165)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Selected
            </span>
          )}
        </div>
        <p className="mt-3 max-w-sm text-[14px] font-medium leading-relaxed text-foreground/65">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

// ───────── Question card (mirrors Writing Samples styling, with mic affordance) ─────────
function SpeakingQuestionCard({
  index,
  q,
  category,
  mode,
  accentChip,
  accentRing,
}: {
  index: number;
  q: Question;
  category: string;
  mode: Mode;
  accentChip: string;
  accentRing: string;
}) {
  // First card unlocked, rest gated — preserves the "preview/unlock" layered feel
  const isUnlocked = index === 1;
  void accentRing;

  return (
    <article
      className={`group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-foreground/10 bg-white p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card ${
        !isUnlocked ? "opacity-95" : ""
      }`}
    >
      {/* Top row: index + badges */}
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/40">
          Q{String(index).padStart(2, "0")}
        </span>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accentChip}`}>
            <Mic className="h-3 w-3" strokeWidth={2.6} />
            {mode === "cuecards" ? "Part 2" : "Part 1 / 3"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground/60">
            {q.difficulty}
          </span>
        </div>
      </div>

      {/* Question text */}
      <p className="font-display text-[15px] font-bold leading-snug tracking-tight text-foreground">
        {q.title}
      </p>

      {/* Footer */}
      <div className="mt-1 flex items-center justify-between gap-2 border-t border-foreground/8 pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground/55">
          <Calendar className="h-3.5 w-3.5" />
          {category}
        </span>

        {isUnlocked ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.50_0.10_165)] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            View answer
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.6} />
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-foreground/55">
            <Lock className="h-3.5 w-3.5" />
            Pro
          </span>
        )}
      </div>
    </article>
  );
}
