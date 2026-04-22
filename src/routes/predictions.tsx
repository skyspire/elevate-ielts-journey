import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Prediction Questions for Your Next IELTS Exam — BigIELTS" },
      {
        name: "description",
        content:
          "AI-ranked IELTS topics most likely to appear in your next exam, based on 12 months of question rotation patterns.",
      },
      { property: "og:title", content: "IELTS Prediction Questions — BigIELTS" },
      {
        property: "og:description",
        content:
          "Predicted topics for the next IELTS sitting, ranked by likelihood and updated weekly.",
      },
    ],
  }),
  component: PredictionsPage,
});

function PredictionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            style={{
              background: "oklch(0.95 0.05 295)",
              color: "oklch(0.42 0.2 295)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-ranked weekly
          </span>
          <h1 className="mt-5 font-display text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Predictions for your next exam
          </h1>
          <p className="mt-6 text-lg font-semibold text-foreground/75">
            Topics most likely to appear in your upcoming IELTS sitting, ranked from
            12 months of question rotation patterns. Coming soon.
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
