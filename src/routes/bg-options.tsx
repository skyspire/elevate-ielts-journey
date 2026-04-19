import { createFileRoute, Link } from "@tanstack/react-router";
import bg1 from "@/assets/bg-option-1-paper.jpg";
import bg2 from "@/assets/bg-option-2-tinted.jpg";
import bg3 from "@/assets/bg-option-3-doodles.jpg";
import bg4 from "@/assets/bg-option-4-mixed.jpg";
import bg5 from "@/assets/bg-option-5-torn.jpg";
import bg6 from "@/assets/bg-option-6-hybrid.jpg";

export const Route = createFileRoute("/bg-options")({
  component: BgOptions,
});

const options = [
  { n: 1, img: bg1, title: "Pure Paper & Ink", desc: "Cream paper with subtle ruled lines everywhere. Most cohesive." },
  { n: 2, img: bg2, title: "Tinted Paper Per Section", desc: "Each section a different tinted paper (cream, mint, beige, peach, kraft)." },
  { n: 3, img: bg3, title: "Paper + Doodle Accents", desc: "Cream paper with scattered doodles — most playful, study-vibe." },
  { n: 4, img: bg4, title: "Mixed Paper Textures", desc: "Alternating ruled / dot grid / graph / plain paper." },
  { n: 5, img: bg5, title: "Torn Paper Edges", desc: "Cream throughout, sections separated by hand-torn paper edges." },
  { n: 6, img: bg6, title: "Hybrid Paper + White", desc: "Big sections on paper, breathing room with clean white." },
];

function BgOptions() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container-page">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Background Style Options</h1>
          <Link to="/" className="text-sm font-bold text-brand underline">← Back to site</Link>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {options.map((o) => (
            <div key={o.n} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <img
                src={o.img}
                alt={`Option ${o.n}: ${o.title}`}
                width={768}
                height={512}
                loading="lazy"
                className="h-64 w-full object-cover"
              />
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Option {o.n}</div>
                <h2 className="mt-1 font-display text-xl font-extrabold">{o.title}</h2>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
