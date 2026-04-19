import { Check, X, Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  city: string;
  country: string;
  band: string;
  type: "Academic" | "General";
};

const compareRows = [
  { books: "Outdated content from years ago", platform: "Latest updated questions every month" },
  { books: "Static, generic sample answers", platform: "Regularly updated Band 8+ model answers" },
  { books: "Unstructured, random ordering", platform: "Topic-wise organized for focused practice" },
  { books: "Expensive — 40-60 CAD per book", platform: "Affordable plans starting at 7 CAD" },
  { books: "No predictions or trend insights", platform: "Hand-picked predictions for upcoming exams" },
];

const testimonials: Testimonial[] = [
  { quote: "Jumped from band 6.5 to 8.0 in six weeks. The sample answers changed how I write Task 2.", name: "Aarav Sharma", city: "Mumbai", country: "India", band: "8.0", type: "Academic" },
  { quote: "Two of my actual Speaking Part 2 cards were word-for-word from the prediction list.", name: "Priya Mehta", city: "Toronto", country: "Canada", band: "7.5", type: "General" },
  { quote: "Topic-wise practice made prep finally feel structured. No more random questions.", name: "Daniel Kim", city: "Seoul", country: "South Korea", band: "7.5", type: "Academic" },
  { quote: "The Writing Task 1 templates are gold. Hit band 8 on my first attempt.", name: "Mei Lin", city: "Shanghai", country: "China", band: "8.0", type: "Academic" },
  { quote: "BigIELTS predictions are scary accurate. Saved me weeks of guesswork.", name: "Carlos Rivera", city: "Mexico City", country: "Mexico", band: "7.0", type: "General" },
  { quote: "From 6.0 to 7.5 in two months. The model answers are far better than any book.", name: "Fatima Zahra", city: "Casablanca", country: "Morocco", band: "7.5", type: "Academic" },
  { quote: "Speaking section anxiety gone. I rehearsed real cue cards before the test.", name: "Tomás Becker", city: "Berlin", country: "Germany", band: "7.0", type: "General" },
  { quote: "Reading practice questions matched the real exam style perfectly.", name: "Ngozi Adeyemi", city: "Lagos", country: "Nigeria", band: "8.5", type: "Academic" },
  { quote: "Affordable plan, premium quality. Way smarter than buying five books.", name: "Hiroshi Tanaka", city: "Osaka", country: "Japan", band: "7.5", type: "Academic" },
  { quote: "The band 9 sample answers helped me understand what examiners actually want.", name: "Sara Patel", city: "London", country: "United Kingdom", band: "8.0", type: "Academic" },
  { quote: "Got my target score for PR. Couldn't have done it without BigIELTS.", name: "Rajiv Nair", city: "Vancouver", country: "Canada", band: "7.0", type: "General" },
  { quote: "Daily practice on the topic-wise section pushed my Writing from 6.5 to 8.", name: "Elena Kovac", city: "Zagreb", country: "Croatia", band: "8.0", type: "Academic" },
  { quote: "Listening predictions hit. I felt I'd already heard those audios before.", name: "Yusuf Demir", city: "Istanbul", country: "Turkey", band: "7.5", type: "General" },
  { quote: "Cleanest IELTS prep platform I've used. No fluff, just what works.", name: "Amelia Walsh", city: "Dublin", country: "Ireland", band: "8.0", type: "Academic" },
  { quote: "Cracked Speaking band 8 thanks to the part 3 follow-up question bank.", name: "Kofi Mensah", city: "Accra", country: "Ghana", band: "8.0", type: "General" },
  { quote: "Worth every dollar. Better than my 800 CAD coaching class.", name: "Linh Vu", city: "Hanoi", country: "Vietnam", band: "7.5", type: "Academic" },
  { quote: "The updated questions every month kept me ahead of the trends.", name: "Diego Fernandez", city: "Buenos Aires", country: "Argentina", band: "7.0", type: "General" },
  { quote: "Hit 7.5 overall on first try. The structured approach really works.", name: "Anika Joshi", city: "Pune", country: "India", band: "7.5", type: "Academic" },
  { quote: "Loved how I could drill weak topics instead of random sets.", name: "Marcus Olsen", city: "Oslo", country: "Norway", band: "8.0", type: "Academic" },
  { quote: "Writing Task 2 ideas section is a lifesaver for non-native thinkers.", name: "Beatriz Silva", city: "Lisbon", country: "Portugal", band: "7.5", type: "Academic" },
  { quote: "Speaking cue card predictions matched 3 out of 4 in my exam.", name: "Omar Hassan", city: "Cairo", country: "Egypt", band: "7.0", type: "General" },
  { quote: "Finally a platform that respects my time. Quick, focused, effective.", name: "Wei Zhang", city: "Singapore", country: "Singapore", band: "8.0", type: "Academic" },
  { quote: "Improved from 5.5 to 7 in Writing. The band descriptors are crystal clear.", name: "Isabela Rocha", city: "São Paulo", country: "Brazil", band: "7.0", type: "General" },
  { quote: "Got into my dream uni in Toronto. BigIELTS made the difference.", name: "Sanjay Kapoor", city: "Delhi", country: "India", band: "7.5", type: "Academic" },
  { quote: "I trusted the predictions and they delivered. Band 8 secured.", name: "Chiara Moretti", city: "Milan", country: "Italy", band: "8.0", type: "Academic" },
  { quote: "Reading speed jumped after two weeks of topic drills here.", name: "Ahmed Bakr", city: "Dubai", country: "UAE", band: "7.5", type: "General" },
  { quote: "The 1-month plan is the best 12 CAD I've ever spent on prep.", name: "Júlia Costa", city: "Porto", country: "Portugal", band: "7.0", type: "General" },
  { quote: "Coherent, modern, and actually fun to use. Big upgrade from PDFs.", name: "Noah Green", city: "Sydney", country: "Australia", band: "8.0", type: "Academic" },
  { quote: "From band 6 to 8 in Listening. The variety of audios is unmatched.", name: "Reem Alami", city: "Amman", country: "Jordan", band: "8.0", type: "Academic" },
  { quote: "Speaking part 2 became my strongest section. Thank you BigIELTS!", name: "Ethan Park", city: "Auckland", country: "New Zealand", band: "7.5", type: "General" },
  { quote: "I recommended it to my whole study group. Three of us got 7.5+.", name: "Layla Farouk", city: "Beirut", country: "Lebanon", band: "7.5", type: "Academic" },
  { quote: "Writing samples taught me cohesion better than any tutor.", name: "Pavel Ivanov", city: "Prague", country: "Czechia", band: "8.0", type: "Academic" },
];

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="group relative flex w-[320px] flex-shrink-0 flex-col rounded-xl border border-foreground/10 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_-4px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_12px_24px_-8px_rgba(15,23,42,0.10)] sm:w-[360px]">
      <Quote className="h-5 w-5 text-foreground/15" strokeWidth={2} />
      <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/80">
        {t.quote}
      </p>
      <div className="mt-5 flex items-center gap-3 border-t border-foreground/8 pt-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.04] font-display text-[12px] font-bold tracking-tight text-foreground/70 ring-1 ring-inset ring-foreground/10">
          {getInitials(t.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[14px] font-bold tracking-tight text-foreground">
            {t.name}
          </div>
          <div className="truncate text-[12px] font-medium text-foreground/50">
            {t.city}, {t.country}
          </div>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
          <div className="font-display text-[15px] font-extrabold leading-none tracking-tight text-foreground">
            {t.band}
          </div>
          <div className="text-[11px] font-medium text-foreground/50">
            {t.type}
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-foreground/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Trusted by 30+ verified students worldwide
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
