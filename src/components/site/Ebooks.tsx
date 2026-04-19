import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";

const ebooks = [
  {
    tag: "Bundle",
    tone: "bg-brand-soft text-brand",
    title: "IELTS Writing Question Bank 2026",
    desc: "300+ recent Writing Task 1 & 2 questions with full Band 9 answers.",
    price: "19 CAD",
    pages: "240 pages",
  },
  {
    tag: "Monthly Pack",
    tone: "bg-mint text-foreground",
    title: "April 2026 Exam Pack",
    desc: "All reported Writing & Speaking questions for the month.",
    price: "9 CAD",
    pages: "80 pages",
  },
  {
    tag: "Vocabulary",
    tone: "bg-peach text-foreground",
    title: "Band 9 Vocabulary Builder",
    desc: "Topic-grouped advanced vocabulary with collocations & examples.",
    price: "14 CAD",
    pages: "160 pages",
  },
];

export function Ebooks() {
  return (
    <section className="bg-paper-peach py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
          <SectionHeader
            align="left"
            eyebrow="E-books"
            title="Question bundles & monthly exam packs"
            description="Downloadable PDFs to study offline. Sold separately from subscriptions."
          />
          <Button variant="outline" className="rounded-full font-bold">
            Browse library
          </Button>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ebooks.map((b) => (
            <article
              key={b.title}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className={`px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide ${b.tone}`}>
                {b.tag}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h4 className="font-display text-xl font-extrabold tracking-tight">{b.title}</h4>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{b.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Download className="h-3.5 w-3.5" />
                  PDF · {b.pages}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <span className="font-display text-2xl font-extrabold tracking-tight">
                    {b.price}
                  </span>
                  <Button className="rounded-full bg-brand font-bold text-brand-foreground hover:bg-brand/90">
                    Preview & Buy
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
