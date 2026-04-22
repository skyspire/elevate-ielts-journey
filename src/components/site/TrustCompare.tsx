import { Check, X } from "lucide-react";

type Testimonial = {
  quote: string;
  highlight: string;
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
  { quote: "Jumped from band 6.5 to 8.0 in six weeks. The sample answers changed how I write Task 2.", highlight: "6.5 to 8.0 in six weeks", name: "Aarav Sharma", city: "Mumbai", country: "India", band: "8.0", type: "Academic" },
  { quote: "Two of my actual Speaking Part 2 cards were word-for-word from the prediction list.", highlight: "word-for-word from the prediction list", name: "Priya Mehta", city: "Toronto", country: "Canada", band: "7.5", type: "General" },
  { quote: "Topic-wise practice made prep finally feel structured. No more random questions.", highlight: "finally feel structured", name: "Daniel Kim", city: "Seoul", country: "South Korea", band: "7.5", type: "Academic" },
  { quote: "The Writing Task 1 templates are gold. Hit band 8 on my first attempt.", highlight: "band 8 on my first attempt", name: "Mei Lin", city: "Shanghai", country: "China", band: "8.0", type: "Academic" },
  { quote: "BigIELTS predictions are scary accurate. Saved me weeks of guesswork.", highlight: "scary accurate", name: "Carlos Rivera", city: "Mexico City", country: "Mexico", band: "7.0", type: "General" },
  { quote: "From 6.0 to 7.5 in two months. The model answers are far better than any book.", highlight: "6.0 to 7.5 in two months", name: "Fatima Zahra", city: "Casablanca", country: "Morocco", band: "7.5", type: "Academic" },
  { quote: "Speaking section anxiety gone. I rehearsed real cue cards before the test.", highlight: "anxiety gone", name: "Tomás Becker", city: "Berlin", country: "Germany", band: "7.0", type: "General" },
  { quote: "Reading practice questions matched the real exam style perfectly.", highlight: "matched the real exam", name: "Ngozi Adeyemi", city: "Lagos", country: "Nigeria", band: "8.5", type: "Academic" },
  { quote: "Affordable plan, premium quality. Way smarter than buying five books.", highlight: "smarter than buying five books", name: "Hiroshi Tanaka", city: "Osaka", country: "Japan", band: "7.5", type: "Academic" },
  { quote: "The band 9 sample answers helped me understand what examiners actually want.", highlight: "what examiners actually want", name: "Sara Patel", city: "London", country: "United Kingdom", band: "8.0", type: "Academic" },
  { quote: "Got my target score for PR. Couldn't have done it without BigIELTS.", highlight: "target score for PR", name: "Rajiv Nair", city: "Vancouver", country: "Canada", band: "7.0", type: "General" },
  { quote: "Daily practice on the topic-wise section pushed my Writing from 6.5 to 8.", highlight: "Writing from 6.5 to 8", name: "Elena Kovac", city: "Zagreb", country: "Croatia", band: "8.0", type: "Academic" },
  { quote: "Listening predictions hit. I felt I'd already heard those audios before.", highlight: "Listening predictions hit", name: "Yusuf Demir", city: "Istanbul", country: "Turkey", band: "7.5", type: "General" },
  { quote: "Cleanest IELTS prep platform I've used. No fluff, just what works.", highlight: "just what works", name: "Amelia Walsh", city: "Dublin", country: "Ireland", band: "8.0", type: "Academic" },
  { quote: "Cracked Speaking band 8 thanks to the part 3 follow-up question bank.", highlight: "Cracked Speaking band 8", name: "Kofi Mensah", city: "Accra", country: "Ghana", band: "8.0", type: "General" },
  { quote: "Worth every dollar. Better than my 800 CAD coaching class.", highlight: "Better than my 800 CAD coaching class", name: "Linh Vu", city: "Hanoi", country: "Vietnam", band: "7.5", type: "Academic" },
  { quote: "The updated questions every month kept me ahead of the trends.", highlight: "ahead of the trends", name: "Diego Fernandez", city: "Buenos Aires", country: "Argentina", band: "7.0", type: "General" },
  { quote: "Hit 7.5 overall on first try. The structured approach really works.", highlight: "7.5 overall on first try", name: "Anika Joshi", city: "Pune", country: "India", band: "7.5", type: "Academic" },
  { quote: "Loved how I could drill weak topics instead of random sets.", highlight: "drill weak topics", name: "Marcus Olsen", city: "Oslo", country: "Norway", band: "8.0", type: "Academic" },
  { quote: "Writing Task 2 ideas section is a lifesaver for non-native thinkers.", highlight: "lifesaver for non-native thinkers", name: "Beatriz Silva", city: "Lisbon", country: "Portugal", band: "7.5", type: "Academic" },
  { quote: "Speaking cue card predictions matched 3 out of 4 in my exam.", highlight: "matched 3 out of 4", name: "Omar Hassan", city: "Cairo", country: "Egypt", band: "7.0", type: "General" },
  { quote: "Finally a platform that respects my time. Quick, focused, effective.", highlight: "Quick, focused, effective", name: "Wei Zhang", city: "Singapore", country: "Singapore", band: "8.0", type: "Academic" },
  { quote: "Improved from 5.5 to 7 in Writing. The band descriptors are crystal clear.", highlight: "5.5 to 7 in Writing", name: "Isabela Rocha", city: "São Paulo", country: "Brazil", band: "7.0", type: "General" },
  { quote: "Got into my dream uni in Toronto. BigIELTS made the difference.", highlight: "dream uni in Toronto", name: "Sanjay Kapoor", city: "Delhi", country: "India", band: "7.5", type: "Academic" },
  { quote: "I trusted the predictions and they delivered. Band 8 secured.", highlight: "Band 8 secured", name: "Chiara Moretti", city: "Milan", country: "Italy", band: "8.0", type: "Academic" },
  { quote: "Reading speed jumped after two weeks of topic drills here.", highlight: "Reading speed jumped", name: "Ahmed Bakr", city: "Dubai", country: "UAE", band: "7.5", type: "General" },
  { quote: "The 1-month plan is the best 12 CAD I've ever spent on prep.", highlight: "best 12 CAD I've ever spent", name: "Júlia Costa", city: "Porto", country: "Portugal", band: "7.0", type: "General" },
  { quote: "Coherent, modern, and actually fun to use. Big upgrade from PDFs.", highlight: "Big upgrade from PDFs", name: "Noah Green", city: "Sydney", country: "Australia", band: "8.0", type: "Academic" },
  { quote: "From band 6 to 8 in Listening. The variety of audios is unmatched.", highlight: "band 6 to 8 in Listening", name: "Reem Alami", city: "Amman", country: "Jordan", band: "8.0", type: "Academic" },
  { quote: "Speaking part 2 became my strongest section. Thank you BigIELTS!", highlight: "my strongest section", name: "Ethan Park", city: "Auckland", country: "New Zealand", band: "7.5", type: "General" },
  { quote: "I recommended it to my whole study group. Three of us got 7.5+.", highlight: "Three of us got 7.5+", name: "Layla Farouk", city: "Beirut", country: "Lebanon", band: "7.5", type: "Academic" },
  { quote: "Writing samples taught me cohesion better than any tutor.", highlight: "better than any tutor", name: "Pavel Ivanov", city: "Prague", country: "Czechia", band: "8.0", type: "Academic" },
];

// Paper tints + washi tape colors rotated per card for variety
const paperPalettes = [
  { paper: "oklch(0.985 0.006 90)",  tape: "oklch(0.85 0.13 75 / 0.75)",  stamp: "oklch(0.55 0.16 25)"  }, // cream + amber tape, red stamp
  { paper: "oklch(0.985 0.008 145)", tape: "oklch(0.78 0.13 165 / 0.7)",  stamp: "oklch(0.5 0.15 165)" }, // ivory + mint tape
  { paper: "oklch(0.98 0.008 60)",   tape: "oklch(0.82 0.14 55 / 0.7)",   stamp: "oklch(0.55 0.16 35)" }, // manila + peach tape
  { paper: "oklch(0.985 0.006 280)", tape: "oklch(0.78 0.11 295 / 0.7)",  stamp: "oklch(0.45 0.18 285)" }, // paper + lilac tape
  { paper: "oklch(0.985 0.007 220)", tape: "oklch(0.78 0.12 235 / 0.7)",  stamp: "oklch(0.45 0.18 240)" }, // paper + sky tape
  { paper: "oklch(0.985 0.008 100)", tape: "oklch(0.85 0.14 95 / 0.75)",  stamp: "oklch(0.5 0.16 50)"  }, // paper + butter tape
];

// Highlighter colors rotated to feel like a real marker set
const highlighterColors = [
  "oklch(0.92 0.16 95 / 0.55)",  // yellow
  "oklch(0.88 0.16 145 / 0.5)",  // green
  "oklch(0.88 0.13 60 / 0.55)",  // orange
  "oklch(0.88 0.12 320 / 0.5)",  // pink
];

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("");
}

function renderQuoteWithHighlight(quote: string, highlight: string, color: string) {
  const idx = quote.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return quote;
  const before = quote.slice(0, idx);
  const match = quote.slice(idx, idx + highlight.length);
  const after = quote.slice(idx + highlight.length);
  return (
    <>
      {before}
      <span
        className="rounded-[2px] px-0.5"
        style={{
          background: `linear-gradient(180deg, transparent 55%, ${color} 55%, ${color} 92%, transparent 92%)`,
        }}
      >
        {match}
      </span>
      {after}
    </>
  );
}

// SVG noise for grainy paper texture (data URL)
const grainSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.18  0 0 0 0 0.16  0 0 0 0 0.14  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`
)}`;

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  const palette = paperPalettes[index % paperPalettes.length];
  const highlight = highlighterColors[index % highlighterColors.length];
  const rotations = ["-rotate-[0.6deg]", "rotate-[0.4deg]", "-rotate-[0.3deg]", "rotate-[0.7deg]", "rotate-0"];
  const rotation = rotations[index % rotations.length];

  return (
    <div className={`relative w-[320px] flex-shrink-0 transition-all duration-300 hover:-translate-y-1 hover:rotate-0 sm:w-[360px] ${rotation}`}>
      {/* Solid double-line vintage frame card */}
      <div
        className="relative flex flex-col rounded-xl border border-foreground/15 px-6 pb-6 pt-9 shadow-[0_2px_4px_rgba(15,23,42,0.05),0_18px_32px_-14px_rgba(15,23,42,0.18)]"
        style={{
          background: palette.paper,
          backgroundImage: `url("${grainSvg}")`,
          backgroundSize: "180px 180px",
        }}
      >
        {/* Inner second line — completes the double-line vintage frame */}
        <div
          className="pointer-events-none absolute inset-[5px] rounded-[8px] border border-foreground/12"
          aria-hidden
        />
        {/* Washi tape strip */}
        <div
          className="absolute -top-1 left-1/2 z-10 h-5 w-24 -translate-x-1/2 -rotate-2 rounded-[2px] shadow-sm"
          style={{
            background: palette.tape,
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 8px)",
          }}
        />

        {/* Margin band score stamp */}
        <div
          className="absolute right-4 top-7 flex h-14 w-14 -rotate-[8deg] items-center justify-center rounded-full border-[2.5px] font-display text-[15px] font-extrabold leading-none"
          style={{ color: palette.stamp, borderColor: palette.stamp, background: "transparent" }}
        >
          <span className="flex flex-col items-center gap-0.5">
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-80">Band</span>
            <span>{t.band}</span>
          </span>
        </div>

        <p className="relative z-10 mt-1 max-w-[78%] font-serif text-[15px] leading-[1.65] text-foreground/85">
          <span className="mr-0.5 font-display text-2xl leading-none text-foreground/30">“</span>
          {renderQuoteWithHighlight(t.quote, t.highlight, highlight)}
          <span className="ml-0.5 font-display text-2xl leading-none text-foreground/30">”</span>
        </p>

        <div className="relative z-10 mt-5 flex items-end justify-between border-t border-dashed border-foreground/15 pt-3">
          <div className="min-w-0">
            <div className="truncate font-display text-[14px] font-bold tracking-tight text-foreground">
              {t.name}
            </div>
            <div className="truncate text-[12px] font-medium text-foreground/55">
              {t.city}, {t.country}
            </div>
          </div>
          <div className="flex-shrink-0 text-[11px] font-medium italic text-foreground/55">
            {t.type}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction, offset = 0 }: { items: Testimonial[]; direction: "left" | "right"; offset?: number }) {
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  return (
    <div className="overflow-hidden py-3">
      <div className={`flex w-max gap-6 ${animClass}`}>
        {[...items, ...items].map((t, i) => (
          <TestimonialCard key={i} t={t} index={i + offset} />
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
    <section className="bg-paper-white pt-10 pb-20 sm:pt-12 sm:pb-28">
      <div className="container-page">
        {/* Testimonials */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            What Students Say
          </h2>
          <div className="mt-5 flex flex-col items-center gap-2.5">
            <p className="text-base font-medium text-foreground/70 sm:text-lg">
              Real results from learners who walked into the exam{" "}
              <span className="relative inline-block font-bold text-foreground">
                <span
                  aria-hidden
                  className="absolute inset-x-[-3px] bottom-0.5 -z-0 h-[45%] -rotate-1 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(120deg, oklch(0.85 0.14 90 / 0.7), oklch(0.88 0.12 60 / 0.65))",
                  }}
                />
                <span className="relative z-10">already prepared</span>
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed marquee */}
      <div className="marquee-pause relative mt-12 space-y-5 sm:mt-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[oklch(1_0_0)] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[oklch(1_0_0)] to-transparent sm:w-32" />
        <MarqueeRow items={rowA} direction="left" offset={0} />
        <MarqueeRow items={rowB} direction="right" offset={3} />
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
