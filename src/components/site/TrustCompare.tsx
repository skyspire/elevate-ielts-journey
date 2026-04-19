import { Check, X, Quote } from "lucide-react";

const testimonials = [
  {
    quote: (
      <>
        Jumped from <strong>band 6.5 to 8.0</strong> in just six weeks. The sample answers
        completely changed how I write Task 2.
      </>
    ),
    name: "Aarav S.",
    detail: "Achieved Band 8.0 · Academic",
  },
  {
    quote: (
      <>
        Two of my actual <strong>Speaking Part 2 cue cards</strong> were word-for-word from
        the prediction list. Felt like I'd already taken the test.
      </>
    ),
    name: "Priya M.",
    detail: "Achieved Band 7.5 · General",
  },
  {
    quote: (
      <>
        Topic-wise practice made prep <strong>finally feel structured</strong>. No more
        random questions — I knew exactly what to drill each day.
      </>
    ),
    name: "Daniel K.",
    detail: "Achieved Band 7.5 · Academic",
  },
];

const compareRows = [
  { books: "Outdated content from years ago", platform: "Latest updated questions every month" },
  { books: "Static, generic sample answers", platform: "Regularly updated Band 8+ model answers" },
  { books: "Unstructured, random ordering", platform: "Topic-wise organized for focused practice" },
  { books: "Expensive — 40-60 CAD per book", platform: "Affordable plans starting at 7 CAD" },
  { books: "No predictions or trend insights", platform: "Hand-picked predictions for upcoming exams" },
];

export function TrustCompare() {
  return (
    <section className="bg-paper-white py-20 sm:py-28">
      <div className="container-page">
        {/* Testimonials */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            What Students Say
          </h2>
          <p className="mt-4 text-base font-medium text-foreground/65 sm:text-lg">
            Real results from learners who walked into the exam already prepared.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="group relative flex flex-col rounded-3xl border border-foreground/8 bg-white p-7 shadow-[0_2px_12px_-4px_oklch(0.3_0.04_60_/_0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_oklch(0.3_0.04_60_/_0.18)]"
            >
              <Quote
                aria-hidden
                className="absolute right-6 top-6 h-8 w-8 text-foreground/8"
                strokeWidth={2.5}
              />
              <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground/85 sm:text-base">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-foreground/8 pt-4">
                <div className="font-display text-sm font-extrabold tracking-tight text-foreground">
                  {t.name}
                </div>
                <div className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-foreground/55">
                  {t.detail}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Comparison */}
        <div className="mx-auto mt-24 max-w-2xl text-center sm:mt-32">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Why Not Just Use Books?
          </h2>
          <p className="mt-4 text-base font-medium text-foreground/65 sm:text-lg">
            A smarter, faster way to prepare — built for how the IELTS actually works today.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl sm:mt-16">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Books column */}
            <div className="rounded-3xl border border-foreground/8 bg-white p-7 sm:p-8">
              <div className="flex items-center gap-3 border-b border-foreground/8 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5">
                  <X className="h-5 w-5 text-foreground/50" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-lg font-extrabold tracking-tight text-foreground/70 sm:text-xl">
                  Traditional IELTS Books
                </h3>
              </div>
              <ul className="mt-5 space-y-4">
                {compareRows.map((row, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <X
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-foreground/35"
                      strokeWidth={2.5}
                    />
                    <span className="text-[15px] leading-relaxed text-foreground/60 line-through decoration-foreground/20">
                      {row.books}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Platform column */}
            <div
              className="relative rounded-3xl border-2 bg-white p-7 shadow-[0_12px_32px_-12px_oklch(0.45_0.18_250_/_0.25)] sm:p-8"
              style={{ borderColor: "oklch(0.45 0.18 250 / 0.5)" }}
            >
              <span
                className="absolute -top-3 left-7 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md"
                style={{ background: "oklch(0.45 0.18 250)" }}
              >
                ★ Recommended
              </span>
              <div className="flex items-center gap-3 border-b border-foreground/8 pb-5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: "oklch(0.45 0.18 250 / 0.12)" }}
                >
                  <Check
                    className="h-5 w-5"
                    strokeWidth={3}
                    style={{ color: "oklch(0.45 0.18 250)" }}
                  />
                </div>
                <h3 className="font-display text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                  Our Platform
                </h3>
              </div>
              <ul className="mt-5 space-y-4">
                {compareRows.map((row, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-5 w-5 flex-shrink-0"
                      strokeWidth={3}
                      style={{ color: "oklch(0.45 0.18 250)" }}
                    />
                    <span className="text-[15px] font-medium leading-relaxed text-foreground/90">
                      {row.platform}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
