/**
 * LearnersWorld — Option 5: Continent grid spread.
 *
 * No geographic map. A magazine-style grid where each cell is a region card:
 *   - paper texture background (rotates through the site's washi/paper palette)
 *   - oversized region name in display type
 *   - learner count rendered HUGE (the hero number of the card)
 *   - avatar cluster of recent learners
 *   - a sample country list
 *
 * Editorial. No pills. No micro-text noise.
 */

type Region = {
  name: string;
  count: string; // formatted, e.g. "1,240"
  countries: string[];
  /** Initials shown in the avatar cluster */
  avatars: { initials: string; tone: string }[];
  /** Background paper utility class from styles.css */
  paper: string;
  /** Hand-written caption above the region name */
  scribble: string;
  /** Slight tilt for the card */
  tilt: string;
};

const regions: Region[] = [
  {
    name: "South Asia",
    count: "3,820",
    countries: ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal"],
    avatars: [
      { initials: "AS", tone: "oklch(0.7 0.15 35)" },
      { initials: "PR", tone: "oklch(0.7 0.14 175)" },
      { initials: "RK", tone: "oklch(0.7 0.15 290)" },
      { initials: "AJ", tone: "oklch(0.7 0.14 95)" },
    ],
    paper: "bg-paper-cream",
    scribble: "the powerhouse",
    tilt: "lg:-rotate-[0.4deg]",
  },
  {
    name: "Europe",
    count: "1,640",
    countries: ["UK", "Germany", "Portugal", "Italy", "Ireland", "Czechia"],
    avatars: [
      { initials: "SP", tone: "oklch(0.7 0.14 250)" },
      { initials: "EK", tone: "oklch(0.7 0.15 35)" },
      { initials: "CM", tone: "oklch(0.7 0.14 165)" },
      { initials: "PI", tone: "oklch(0.7 0.15 295)" },
    ],
    paper: "bg-paper-sage",
    scribble: "old continent",
    tilt: "lg:rotate-[0.3deg]",
  },
  {
    name: "North America",
    count: "1,210",
    countries: ["Canada", "United States", "Mexico"],
    avatars: [
      { initials: "RN", tone: "oklch(0.7 0.14 30)" },
      { initials: "PM", tone: "oklch(0.7 0.15 250)" },
      { initials: "CR", tone: "oklch(0.7 0.14 95)" },
    ],
    paper: "bg-paper-rose",
    scribble: "PR & study visas",
    tilt: "lg:-rotate-[0.3deg]",
  },
  {
    name: "East Asia",
    count: "980",
    countries: ["China", "South Korea", "Japan", "Vietnam", "Singapore"],
    avatars: [
      { initials: "ML", tone: "oklch(0.7 0.15 30)" },
      { initials: "DK", tone: "oklch(0.7 0.14 250)" },
      { initials: "HT", tone: "oklch(0.7 0.15 290)" },
      { initials: "WZ", tone: "oklch(0.7 0.14 165)" },
    ],
    paper: "bg-paper-mint",
    scribble: "rising fast",
    tilt: "lg:rotate-[0.4deg]",
  },
  {
    name: "Middle East",
    count: "740",
    countries: ["UAE", "Saudi Arabia", "Jordan", "Lebanon", "Egypt"],
    avatars: [
      { initials: "AB", tone: "oklch(0.7 0.15 95)" },
      { initials: "RA", tone: "oklch(0.7 0.14 35)" },
      { initials: "OH", tone: "oklch(0.7 0.15 250)" },
      { initials: "LF", tone: "oklch(0.7 0.14 295)" },
    ],
    paper: "bg-paper-peach",
    scribble: "ambitious crowd",
    tilt: "lg:-rotate-[0.5deg]",
  },
  {
    name: "Africa",
    count: "560",
    countries: ["Nigeria", "Ghana", "Morocco", "Kenya", "South Africa"],
    avatars: [
      { initials: "NA", tone: "oklch(0.7 0.14 165)" },
      { initials: "KM", tone: "oklch(0.7 0.15 35)" },
      { initials: "FZ", tone: "oklch(0.7 0.14 295)" },
    ],
    paper: "bg-paper-cream",
    scribble: "growing daily",
    tilt: "lg:rotate-[0.2deg]",
  },
  {
    name: "Oceania",
    count: "310",
    countries: ["Australia", "New Zealand"],
    avatars: [
      { initials: "NG", tone: "oklch(0.7 0.14 250)" },
      { initials: "EP", tone: "oklch(0.7 0.15 165)" },
    ],
    paper: "bg-paper-dots",
    scribble: "down under",
    tilt: "lg:-rotate-[0.2deg]",
  },
  {
    name: "Latin America",
    count: "420",
    countries: ["Brazil", "Argentina", "Mexico", "Colombia"],
    avatars: [
      { initials: "IR", tone: "oklch(0.7 0.14 95)" },
      { initials: "DF", tone: "oklch(0.7 0.15 290)" },
      { initials: "BS", tone: "oklch(0.7 0.14 30)" },
    ],
    paper: "bg-paper-rose",
    scribble: "always on the move",
    tilt: "lg:rotate-[0.5deg]",
  },
];

function AvatarCluster({ items }: { items: Region["avatars"] }) {
  return (
    <div className="flex -space-x-2">
      {items.map((a, i) => (
        <div
          key={i}
          className="flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-background font-display text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm"
          style={{ background: a.tone }}
        >
          {a.initials}
        </div>
      ))}
    </div>
  );
}

function RegionCard({ r }: { r: Region }) {
  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-foreground/12 p-7 shadow-[0_2px_4px_rgba(15,23,42,0.04),0_18px_40px_-22px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_4px_8px_rgba(15,23,42,0.06),0_28px_60px_-20px_rgba(15,23,42,0.25)] sm:p-8 ${r.paper} ${r.tilt}`}
    >
      {/* Top row — handwritten caption + avatar cluster */}
      <div className="relative flex items-start justify-between gap-4">
        <span className="font-handwriting text-xl text-foreground/55 sm:text-2xl">
          {r.scribble}
        </span>
        <AvatarCluster items={r.avatars} />
      </div>

      {/* The hero of the card — count, then name */}
      <div className="relative mt-10">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-6xl font-black leading-none tracking-tight text-foreground sm:text-7xl">
            {r.count}
          </span>
          <span className="font-display text-base font-bold uppercase tracking-[0.18em] text-foreground/55">
            learners
          </span>
        </div>
        <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          {r.name}
        </h3>
      </div>

      {/* Country list — large editorial type, no pills */}
      <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-foreground/15 pt-5 font-display text-base font-bold tracking-tight text-foreground/70 sm:text-lg">
        {r.countries.map((c, i) => (
          <span key={c} className="inline-flex items-center gap-5">
            <span className="transition-colors group-hover:text-foreground">
              {c}
            </span>
            {i < r.countries.length - 1 && (
              <span
                aria-hidden
                className="h-1 w-1 rounded-full bg-foreground/30"
              />
            )}
          </span>
        ))}
      </div>
    </article>
  );
}

export function LearnersWorld() {
  return (
    <section className="relative overflow-hidden bg-paper-white py-24 sm:py-32">
      {/* faint warm wash so the white doesn't feel sterile */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, oklch(0.97 0.025 75 / 0.55), transparent 55%)," +
            "radial-gradient(ellipse at 100% 100%, oklch(0.96 0.03 250 / 0.4), transparent 55%)",
        }}
      />

      <div className="container-page relative">
        {/* Editorial header — big type, hand-written eyebrow, no pills */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-handwriting text-3xl text-foreground/55 sm:text-4xl">
            from every corner of the world
          </p>
          <h2 className="mt-3 font-display text-5xl font-black leading-[1] tracking-tight text-foreground sm:text-7xl md:text-[88px]">
            <span className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-x-[-10px] bottom-2 -z-0 h-[26%] -rotate-1 rounded-sm"
                style={{
                  background:
                    "linear-gradient(120deg, oklch(0.85 0.14 90 / 0.7), oklch(0.88 0.12 60 / 0.65))",
                }}
              />
              <span className="relative z-10">9,680+ learners.</span>
            </span>
            <br />
            One prep platform.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-display text-xl font-medium leading-relaxed text-foreground/65">
            Students in 47 countries study with BigIELTS — from morning commutes
            in Mumbai to late-night sessions in Toronto.
          </p>
        </div>

        {/* The grid — 1 / 2 / 3 columns */}
        <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {regions.map((r) => (
            <RegionCard key={r.name} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
