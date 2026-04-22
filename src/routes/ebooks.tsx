import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/ebooks")({
  head: () => ({
    meta: [
      { title: "IELTS E-Books for Serious Study — BigIELTS" },
      {
        name: "description",
        content:
          "Deep-dive IELTS e-books written by Band 9 examiners — frameworks, vocabulary, pronunciation, grammar.",
      },
      { property: "og:title", content: "IELTS E-Books — BigIELTS" },
      {
        property: "og:description",
        content:
          "Deep-dive PDF guides from Band 9 examiners covering Writing, Speaking, Reading, and Listening.",
      },
    ],
  }),
  component: EbooksPage,
});

function EbooksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "oklch(0.95 0.05 35)",
              color: "oklch(0.45 0.17 30)",
            }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            12 titles · PDF
          </span>
          <h1 className="mt-5 font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            E-books for serious study
          </h1>
          <p className="mt-6 text-lg font-semibold text-foreground/75">
            Deep-dive guides written by Band 9 examiners — Task 2 frameworks, graph
            vocabulary, Speaking Part 2, pronunciation, grammar. Coming soon.
          </p>
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center rounded-md px-5 py-2.5 font-bold text-white"
              style={{ backgroundColor: "oklch(0.20 0.01 250)" }}
            >
              Back home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
