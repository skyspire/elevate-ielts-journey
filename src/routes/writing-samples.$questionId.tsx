import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Clock,
  FileText,
  GraduationCap,
  Sparkles,
  Award,
  Hash,
  ListOrdered,
  Lightbulb,
  PenLine,
  MessageSquare,
  Trash2,
  Send,
} from "lucide-react";
import { z } from "zod";
import { sampleAnswers } from "@/data/sample-answers";
import { getSiblingQuestions, type SiblingQuestion } from "@/data/question-helpers";
import {
  addComment,
  deleteComment,
  getComments,
  isBookmarked,
  toggleBookmark,
  type Comment,
} from "@/lib/engagement-storage";

const searchSchema = z.object({
  module: z.enum(["academic", "general"]).optional().default("general"),
  task: z.enum(["task1", "task2"]).optional().default("task1"),
  category: z.string().optional().default(""),
  title: z.string().optional().default(""),
  topic: z.string().optional().default(""),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional().default("Medium"),
});

export const Route = createFileRoute("/writing-samples/$questionId")({
  validateSearch: searchSchema,
  head: ({ match }) => ({
    meta: [
      { title: `${match.search.title || "Sample Question"} — BandPath` },
      {
        name: "description",
        content:
          "View an IELTS Writing sample question with the full Band 8+ model answer, structure breakdown, vocabulary highlights and exam tips.",
      },
    ],
  }),
  component: QuestionDetailPage,
});

function QuestionDetailPage() {
  const search = Route.useSearch();
  const { questionId } = Route.useParams();
  const module = search.module ?? "general";
  const task = search.task ?? "task1";
  const category = search.category || "Sample";
  const title = search.title || "Sample Question";
  const topic = search.topic || "General";
  const difficulty = search.difficulty ?? "Medium";

  const answer = sampleAnswers[questionId];

  // Sibling navigation (prev/next + related)
  const siblings = useMemo(() => getSiblingQuestions(questionId), [questionId]);
  const related = useMemo(() => {
    if (!siblings.all.length) return [] as SiblingQuestion[];
    const others = siblings.all.filter((q) => q.id !== questionId);
    return others.slice(0, 3);
  }, [siblings.all, questionId]);

  // Always start at the top when this page opens
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [questionId]);

  const isAcademic = module === "academic";
  const accentText = isAcademic ? "text-brand" : "text-[oklch(0.42_0.10_160)]";
  const accentBg = isAcademic ? "bg-brand" : "bg-[oklch(0.55_0.10_160)]";
  const accentChip = isAcademic
    ? "bg-brand-soft text-brand border-brand/30"
    : "bg-[oklch(0.94_0.04_160)] text-[oklch(0.38_0.10_160)] border-[oklch(0.62_0.10_160)]/30";

  const diffTone =
    difficulty === "Easy"
      ? "bg-[oklch(0.94_0.05_160)] text-[oklch(0.38_0.10_160)]"
      : difficulty === "Medium"
      ? "bg-[oklch(0.95_0.05_85)] text-[oklch(0.42_0.11_75)]"
      : "bg-[oklch(0.94_0.05_30)] text-[oklch(0.42_0.13_40)]";

  const wordCount = task === "task1" ? "150 words · 20 min" : "250 words · 40 min";

  return (
    <div className="min-h-screen bg-paper-cream">
      <header className="sticky top-0 z-40 border-b border-foreground/8 bg-paper-cream/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-soft">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight">BandPath</span>
          </Link>

          <Link
            to="/writing-samples"
            search={{ module }}
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Writing Samples
          </Link>
        </div>
      </header>

      <main className="relative py-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-paper-ruled opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
            <Link to="/dashboard" className="hover:text-foreground/80">Dashboard</Link>
            <span>/</span>
            <Link to="/writing-samples" search={{ module }} className="hover:text-foreground/80">
              Writing Samples
            </Link>
            <span>/</span>
            <span className={accentText}>{category}</span>
          </div>

          {/* Hero */}
          <div className="mt-5 text-center">
            <div className={`mx-auto inline-flex items-center gap-2 rounded-full border ${accentChip} px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em]`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accentBg}`} />
              IELTS {isAcademic ? "Academic" : "General"} · {task === "task1" ? "Task 1" : "Task 2"}
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/60">
                <BookOpen className="h-3.5 w-3.5" />
                {topic}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${diffTone}`}>
                {difficulty}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/60">
                <Clock className="h-3.5 w-3.5" />
                {wordCount}
              </span>
            </div>

            {/* Bookmark button */}
            <div className="mt-5 flex justify-center">
              <BookmarkButton questionId={questionId} accentBg={accentBg} accentText={accentText} />
            </div>
          </div>

          {/* Question card */}
          <div className="mt-10 rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
              <FileText className="h-3.5 w-3.5" />
              Question
            </div>
            <p className="mt-3 font-display text-lg font-semibold leading-relaxed text-foreground sm:text-xl">
              {title}
            </p>
          </div>

          {answer ? (
            <>
              {/* Answer meta strip */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border ${accentChip} px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]`}>
                  <Award className="h-3.5 w-3.5" />
                  Band {answer.bandScore}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/60">
                  <Hash className="h-3.5 w-3.5" />
                  {answer.wordCount} words
                </span>
              </div>

              {/* Sample Answer */}
              <section className="mt-6 rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
                  <PenLine className="h-3.5 w-3.5" />
                  Sample Answer
                </div>
                <div className="mt-5 space-y-6">
                  {answer.paragraphs.map((p) => (
                    <div key={p.heading}>
                      <h3 className={`font-display text-base font-extrabold tracking-tight ${accentText}`}>
                        {p.heading}
                      </h3>
                      <p className="mt-2 text-[15px] font-medium leading-[1.75] text-foreground/85">
                        {p.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Structure breakdown */}
              <section className="mt-6 rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
                  <ListOrdered className="h-3.5 w-3.5" />
                  Structure breakdown
                </div>
                <ol className="mt-5 space-y-4">
                  {answer.structure.map((s, i) => (
                    <li key={s.label} className="flex gap-4">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${accentBg} text-[12px] font-extrabold text-white`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display text-[15px] font-extrabold tracking-tight text-foreground">
                          {s.label}
                        </p>
                        <p className="mt-1 text-[14px] font-medium leading-relaxed text-foreground/70">
                          {s.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Vocabulary */}
              <section className="mt-6 rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
                  <BookOpen className="h-3.5 w-3.5" />
                  Key vocabulary
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {answer.vocabulary.map((v) => (
                    <li
                      key={v.term}
                      className="rounded-xl border border-foreground/8 bg-paper-cream p-3.5"
                    >
                      <p className={`font-display text-[14px] font-extrabold tracking-tight ${accentText}`}>
                        {v.term}
                      </p>
                      <p className="mt-1 text-[13px] font-medium leading-relaxed text-foreground/70">
                        {v.meaning}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tips */}
              <section className="mt-6 rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Examiner tips
                </div>
                <ul className="mt-5 space-y-3">
                  {answer.tips.map((t) => (
                    <li key={t} className="flex gap-3">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accentBg}`} />
                      <p className="text-[14px] font-medium leading-relaxed text-foreground/80">
                        {t}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-foreground/15 bg-white/60 p-6 text-center sm:p-8">
              <span className={`inline-flex items-center gap-1.5 rounded-full ${accentChip} border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]`}>
                <Sparkles className="h-3.5 w-3.5" />
                Coming soon
              </span>
              <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight text-foreground">
                Band 8+ model answer
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[14px] font-medium leading-relaxed text-foreground/65">
                A full sample answer with structure breakdown, vocabulary highlights and examiner notes will be available here shortly.
              </p>
            </div>
          )}

          {/* Comments / Q&A */}
          <CommentsSection questionId={questionId} accentBg={accentBg} accentText={accentText} accentChip={accentChip} />

          {/* Prev / Next */}
          {(siblings.prev || siblings.next) && (
            <nav className="mt-10 grid gap-3 sm:grid-cols-2">
              {siblings.prev ? (
                <PrevNextCard
                  direction="prev"
                  question={siblings.prev}
                  module={module}
                  task={task}
                  category={siblings.categoryLabel}
                />
              ) : (
                <div />
              )}
              {siblings.next ? (
                <PrevNextCard
                  direction="next"
                  question={siblings.next}
                  module={module}
                  task={task}
                  category={siblings.categoryLabel}
                />
              ) : (
                <div />
              )}
            </nav>
          )}

          {/* Related questions */}
          {related.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
                <Sparkles className="h-3.5 w-3.5" />
                More from {siblings.categoryLabel}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {related.map((q) => (
                  <RelatedCard
                    key={q.id}
                    question={q}
                    module={module}
                    task={task}
                    category={siblings.categoryLabel}
                    accentText={accentText}
                  />
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              to="/writing-samples"
              search={{ module }}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-5 py-2.5 text-sm font-bold text-foreground/70 shadow-soft transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all questions
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// ───────── Bookmark button ─────────
function BookmarkButton({
  questionId,
  accentBg,
  accentText,
}: {
  questionId: string;
  accentBg: string;
  accentText: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(questionId));
  }, [questionId]);

  const onClick = () => {
    const next = toggleBookmark(questionId);
    setSaved(next);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] shadow-soft transition-all hover:-translate-y-0.5 ${
        saved
          ? `${accentBg} border-transparent text-white`
          : `border-foreground/15 bg-white ${accentText} hover:border-foreground/25`
      }`}
    >
      {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
      {saved ? "Saved" : "Save for later"}
    </button>
  );
}

// ───────── Comments section ─────────
function CommentsSection({
  questionId,
  accentBg,
  accentText,
  accentChip,
}: {
  questionId: string;
  accentBg: string;
  accentText: string;
  accentChip: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setComments(getComments(questionId));
  }, [questionId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    addComment(questionId, author, trimmed);
    setComments(getComments(questionId));
    setBody("");
  };

  const handleDelete = (id: string) => {
    deleteComment(questionId, id);
    setComments(getComments(questionId));
  };

  return (
    <section className="mt-10 rounded-2xl border border-foreground/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/50">
          <MessageSquare className="h-3.5 w-3.5" />
          Comments &amp; doubts
        </div>
        <span className={`inline-flex items-center rounded-full border ${accentChip} px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.18em]`}>
          {comments.length} {comments.length === 1 ? "reply" : "replies"}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={40}
          className="w-full rounded-xl border border-foreground/10 bg-paper-cream px-3.5 py-2.5 text-[14px] font-medium text-foreground placeholder:text-foreground/40 focus:border-foreground/25 focus:outline-none"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ask a doubt or share a thought about this answer…"
          rows={3}
          maxLength={1000}
          className="w-full rounded-xl border border-foreground/10 bg-paper-cream px-3.5 py-2.5 text-[14px] font-medium text-foreground placeholder:text-foreground/40 focus:border-foreground/25 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold text-foreground/40">
            Stored locally in your browser
          </span>
          <button
            type="submit"
            disabled={!body.trim()}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white shadow-soft transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${accentBg}`}
          >
            <Send className="h-3.5 w-3.5" />
            Post
          </button>
        </div>
      </form>

      {/* List */}
      {comments.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-foreground/8 bg-paper-cream p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-display text-[13px] font-extrabold tracking-tight ${accentText}`}>
                      {c.author}
                    </span>
                    <span className="text-[11px] font-semibold text-foreground/40">
                      {formatTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-[14px] font-medium leading-relaxed text-foreground/85">
                    {c.body}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  aria-label="Delete comment"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-foreground/35 transition-colors hover:bg-foreground/5 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-center text-[13px] font-medium text-foreground/50">
          No comments yet — be the first to start the discussion.
        </p>
      )}
    </section>
  );
}

function formatTime(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}

// ───────── Prev / Next card ─────────
function PrevNextCard({
  direction,
  question,
  module,
  task,
  category,
}: {
  direction: "prev" | "next";
  question: SiblingQuestion;
  module: "academic" | "general";
  task: "task1" | "task2";
  category: string;
}) {
  const isPrev = direction === "prev";
  return (
    <Link
      to="/writing-samples/$questionId"
      params={{ questionId: question.id }}
      search={{
        module,
        task,
        category,
        title: question.title,
        topic: question.topic,
        difficulty: question.difficulty,
      }}
      className={`group flex items-start gap-3 rounded-2xl border border-foreground/10 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-card ${
        isPrev ? "" : "sm:flex-row-reverse sm:text-right"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/5 text-foreground/60 transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
        {isPrev ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-foreground/45">
          {isPrev ? "Previous" : "Next"}
        </p>
        <p className="mt-1 line-clamp-2 font-display text-[14px] font-bold leading-snug tracking-tight text-foreground">
          {question.title}
        </p>
      </div>
    </Link>
  );
}

// ───────── Related card ─────────
function RelatedCard({
  question,
  module,
  task,
  category,
  accentText,
}: {
  question: SiblingQuestion;
  module: "academic" | "general";
  task: "task1" | "task2";
  category: string;
  accentText: string;
}) {
  return (
    <Link
      to="/writing-samples/$questionId"
      params={{ questionId: question.id }}
      search={{
        module,
        task,
        category,
        title: question.title,
        topic: question.topic,
        difficulty: question.difficulty,
      }}
      className="group flex h-full flex-col rounded-2xl border border-foreground/10 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-card"
    >
      <span className={`text-[10.5px] font-extrabold uppercase tracking-[0.2em] ${accentText}`}>
        {question.topic}
      </span>
      <p className="mt-2 line-clamp-3 font-display text-[14px] font-bold leading-snug tracking-tight text-foreground">
        {question.title}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-foreground/50 transition-colors group-hover:text-foreground">
        Read
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
