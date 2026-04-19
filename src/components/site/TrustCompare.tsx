import { Check, X, Star } from "lucide-react";

type Tint = "mint" | "peach" | "lilac" | "sky" | "butter" | "rose";

const tintStyles: Record<Tint, { bg: string; ring: string; avatar: string; avatarText: string }> = {
  mint:   { bg: "oklch(0.96 0.04 165)", ring: "oklch(0.5 0.1 165 / 0.12)",  avatar: "oklch(0.78 0.12 165)", avatarText: "oklch(0.25 0.05 165)" },
  peach:  { bg: "oklch(0.95 0.045 55)", ring: "oklch(0.55 0.12 55 / 0.14)", avatar: "oklch(0.8 0.13 55)",   avatarText: "oklch(0.3 0.06 55)" },
  lilac:  { bg: "oklch(0.95 0.04 300)", ring: "oklch(0.5 0.1 300 / 0.13)",  avatar: "oklch(0.78 0.12 300)", avatarText: "oklch(0.28 0.06 300)" },
  sky:    { bg: "oklch(0.95 0.04 240)", ring: "oklch(0.5 0.12 240 / 0.14)", avatar: "oklch(0.78 0.13 240)", avatarText: "oklch(0.25 0.06 240)" },
  butter: { bg: "oklch(0.96 0.05 95)",  ring: "oklch(0.55 0.12 95 / 0.13)", avatar: "oklch(0.82 0.13 95)",  avatarText: "oklch(0.3 0.06 95)" },
  rose:   { bg: "oklch(0.95 0.035 20)", ring: "oklch(0.55 0.12 20 / 0.13)", avatar: "oklch(0.8 0.12 20)",   avatarText: "oklch(0.3 0.06 20)" },
};

type Testimonial = { quote: string; name: string; band: string; type: string; tint: Tint };

const compareRows = [
  { books: "Outdated content from years ago", platform: "Latest updated questions every month" },
  { books: "Static, generic sample answers", platform: "Regularly updated Band 8+ model answers" },
  { books: "Unstructured, random ordering", platform: "Topic-wise organized for focused practice" },
  { books: "Expensive — 40-60 CAD per book", platform: "Affordable plans starting at 7 CAD" },
  { books: "No predictions or trend insights", platform: "Hand-picked predictions for upcoming exams" },
];

const testimonials: Testimonial[] = [
  { quote: "Jumped from band 6.5 to 8.0 in six weeks. The sample answers changed how I write Task 2.", name: "Aarav S.", band: "8.0", type: "Academic", tint: "sky" },
  { quote: "Two of my actual Speaking Part 2 cards were word-for-word from the prediction list.", name: "Priya M.", band: "7.5", type: "General", tint: "peach" },
  { quote: "Topic-wise practice made prep finally feel structured. No more random questions.", name: "Daniel K.", band: "7.5", type: "Academic", tint: "mint" },
  { quote: "The Writing Task 1 templates are gold. Hit band 8 on my first attempt.", name: "Mei L.", band: "8.0", type: "Academic", tint: "lilac" },
  { quote: "BigIELTS predictions are scary accurate. Saved me weeks of guesswork.", name: "Carlos R.", band: "7.0", type: "General", tint: "butter" },
  { quote: "From 6.0 to 7.5 in two months. The model answers are far better than any book.", name: "Fatima Z.", band: "7.5", type: "Academic", tint: "rose" },
  { quote: "Speaking section anxiety gone. I rehearsed real cue cards before the test.", name: "Tomás B.", band: "7.0", type: "General", tint: "mint" },
  { quote: "Reading practice questions matched the real exam style perfectly.", name: "Ngozi A.", band: "8.5", type: "Academic", tint: "sky" },
  { quote: "Affordable plan, premium quality. Way smarter than buying five books.", name: "Hiroshi T.", band: "7.5", type: "Academic", tint: "peach" },
  { quote: "The band 9 sample answers helped me understand what examiners actually want.", name: "Sara P.", band: "8.0", type: "Academic", tint: "lilac" },
  { quote: "Got my target score for PR. Couldn't have done it without BigIELTS.", name: "Rajiv N.", band: "7.0", type: "General", tint: "butter" },
  { quote: "Daily practice on the topic-wise section pushed my Writing from 6.5 to 8.", name: "Elena K.", band: "8.0", type: "Academic", tint: "rose" },
  { quote: "Listening predictions hit. I felt I'd already heard those audios before.", name: "Yusuf D.", band: "7.5", type: "General", tint: "sky" },
  { quote: "Cleanest IELTS prep platform I've used. No fluff, just what works.", name: "Amelia W.", band: "8.0", type: "Academic", tint: "mint" },
  { quote: "Cracked Speaking band 8 thanks to the part 3 follow-up question bank.", name: "Kofi M.", band: "8.0", type: "General", tint: "peach" },
  { quote: "Worth every dollar. Better than my 800 CAD coaching class.", name: "Linh V.", band: "7.5", type: "Academic", tint: "lilac" },
  { quote: "The updated questions every month kept me ahead of the trends.", name: "Diego F.", band: "7.0", type: "General", tint: "butter" },
  { quote: "Hit 7.5 overall on first try. The structured approach really works.", name: "Anika J.", band: "7.5", type: "Academic", tint: "rose" },
  { quote: "Loved how I could drill weak topics instead of random sets.", name: "Marcus O.", band: "8.0", type: "Academic", tint: "sky" },
  { quote: "Writing Task 2 ideas section is a lifesaver for non-native thinkers.", name: "Beatriz S.", band: "7.5", type: "Academic", tint: "mint" },
  { quote: "Speaking cue card predictions matched 3 out of 4 in my exam.", name: "Omar H.", band: "7.0", type: "General", tint: "peach" },
  { quote: "Finally a platform that respects my time. Quick, focused, effective.", name: "Wei Z.", band: "8.0", type: "Academic", tint: "lilac" },
  { quote: "Improved from 5.5 to 7 in Writing. The band descriptors are crystal clear.", name: "Isabela R.", band: "7.0", type: "General", tint: "butter" },
  { quote: "Got into my dream uni in Toronto. BigIELTS made the difference.", name: "Sanjay K.", band: "7.5", type: "Academic", tint: "rose" },
  { quote: "I trusted the predictions and they delivered. Band 8 secured.", name: "Chiara M.", band: "8.0", type: "Academic", tint: "sky" },
  { quote: "Reading speed jumped after two weeks of topic drills here.", name: "Ahmed B.", band: "7.5", type: "General", tint: "mint" },
  { quote: "The 1-month plan is the best 12 CAD I've ever spent on prep.", name: "Júlia C.", band: "7.0", type: "General", tint: "peach" },
  { quote: "Coherent, modern, and actually fun to use. Big upgrade from PDFs.", name: "Noah G.", band: "8.0", type: "Academic", tint: "lilac" },
  { quote: "From band 6 to 8 in Listening. The variety of audios is unmatched.", name: "Reem A.", band: "8.0", type: "Academic", tint: "butter" },
  { quote: "Speaking part 2 became my strongest section. Thank you BigIELTS!", name: "Ethan P.", band: "7.5", type: "General", tint: "rose" },
  { quote: "I recommended it to my whole study group. Three of us got 7.5+.", name: "Layla F.", band: "7.5", type: "Academic", tint: "sky" },
  { quote: "Writing samples taught me cohesion better than any tutor.", name: "Pavel I.", band: "8.0", type: "Academic", tint: "mint" },
];

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const s = tintStyles[t.tint];
  return (
    <div
      className="flex w-[300px] flex-shrink-0 flex-col rounded-2xl border p-5 transition-transform duration-300 hover:-translate-y-1 sm:w-[340px]"
      style={{ background: s.bg, borderColor: s.ring }}
    >
      <div className="flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
        ))}
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-foreground/85">"{t.quote}"</p>
      <div className="mt-4 flex items-center gap-3 border-t pt-3" style={{ borderColor: s.ring }}>
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-display text-xs font-extrabold"
          style={{ background: s.avatar, color: s.avatarText }}
        >
          {getInitials(t.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[13px] font-extrabold tracking-tight text-foreground">
            {t.name}
          </div>
          <div className="truncate text-[11px] font-semibold uppercase tracking-wider text-foreground/55">
            Band {t.band} · {t.type}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction }: { items: Testimonial[]; direction: "left" | "right" }) {
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-5 ${animClass}`}>
        {[...items, ...items].map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export function TrustCompare() {
  const half = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, half);
  const rowB = testimonials.slice(half);

  return (
    <section className="bg-paper-white py-20 sm:py-28">
      <div className="container-page">
        {/* Testimonials */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-foreground/65">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" strokeWidth={0} />
            4.9 average · 30+ student reviews
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            What Students Say
          </h2>
          <p className="mt-4 text-base font-medium text-foreground/65 sm:text-lg">
            Real results from learners who walked into the exam already prepared.
          </p>
        </div>
      </div>

      {/* Full-bleed marquee */}
      <div className="marquee-pause relative mt-12 space-y-5 sm:mt-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[oklch(1_0_0)] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[oklch(1_0_0)] to-transparent sm:w-32" />
        <MarqueeRow items={rowA} direction="left" />
        <MarqueeRow items={rowB} direction="right" />
      </div>

      <div className="container-page">

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
