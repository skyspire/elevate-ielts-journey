import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Type,
  CreditCard,
  HelpCircle,
  Mail,
  Layout,
  BookOpen,
  MessageSquare,
  Library,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { useSession } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const cards = [
  { to: "/admin/hero" as const, title: "Hero Section", desc: "Headline, subline, and CTAs.", icon: Type, color: "oklch(0.62 0.17 255)" },
  { to: "/admin/stats" as const, title: "Stats", desc: "Counters shown under hero.", icon: BarChart3, color: "oklch(0.6 0.16 230)" },
  { to: "/admin/pricing" as const, title: "Pricing", desc: "Plans, prices, features.", icon: CreditCard, color: "oklch(0.55 0.18 30)" },
  { to: "/admin/faq" as const, title: "FAQ", desc: "Frequently asked questions.", icon: HelpCircle, color: "oklch(0.6 0.2 295)" },
  { to: "/admin/footer" as const, title: "Footer", desc: "Columns, links, disclaimer.", icon: Layout, color: "oklch(0.55 0.14 165)" },
  { to: "/admin/contact" as const, title: "Contact Page", desc: "Email, address, hours.", icon: Mail, color: "oklch(0.62 0.16 35)" },
  { to: "/admin/writing" as const, title: "Writing Prompts", desc: "Task 2 essay prompts by category.", icon: BookOpen, color: "oklch(0.5 0.16 200)" },
  { to: "/admin/speaking" as const, title: "Speaking Topics", desc: "Topic catalog by category.", icon: MessageSquare, color: "oklch(0.55 0.16 320)" },
  { to: "/admin/vocabulary" as const, title: "Vocabulary", desc: "Categories, lists, words.", icon: Library, color: "oklch(0.6 0.16 130)" },
];

function AdminDashboard() {
  const { user } = useSession();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit any section of BigIELTS.com — changes save instantly to your browser.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
          View live site
        </Link>
      </div>

      <div className="rounded-xl border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        <strong>Prototype mode:</strong> All edits are saved to your browser's localStorage only.
        They won't sync across devices or be visible to real visitors. This is for previewing
        content changes before handing them to your developers.
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: c.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-display text-base font-extrabold text-foreground group-hover:underline">
                {c.title}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
