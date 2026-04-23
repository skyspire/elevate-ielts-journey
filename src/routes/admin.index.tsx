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
  GraduationCap,
} from "lucide-react";
import { useSession } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const cards = [
  { to: "/admin/content" as const, title: "Content — Academic & General Training", desc: "Writing (Task 1, 2) & Speaking (Part 1, 2 & 3) for both IELTS modules.", icon: GraduationCap, color: "oklch(0.45 0.18 265)", featured: true },
  { to: "/admin/vocabulary" as const, title: "Vocabulary", desc: "Categories, lists, words.", icon: Library, color: "oklch(0.6 0.16 130)" },
  { to: "/admin/hero" as const, title: "Hero Section", desc: "Headline, subline, and CTAs.", icon: Type, color: "oklch(0.62 0.17 255)" },
  { to: "/admin/stats" as const, title: "Stats", desc: "Counters shown under hero.", icon: BarChart3, color: "oklch(0.6 0.16 230)" },
  { to: "/admin/pricing" as const, title: "Pricing", desc: "Plans, prices, features.", icon: CreditCard, color: "oklch(0.55 0.18 30)" },
  { to: "/admin/faq" as const, title: "FAQ", desc: "Frequently asked questions.", icon: HelpCircle, color: "oklch(0.6 0.2 295)" },
  { to: "/admin/footer" as const, title: "Footer", desc: "Columns, links, disclaimer.", icon: Layout, color: "oklch(0.55 0.14 165)" },
  { to: "/admin/contact" as const, title: "Contact Page", desc: "Email, address, hours.", icon: Mail, color: "oklch(0.62 0.16 35)" },
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
          const featured = "featured" in c && c.featured;
          return (
            <Link
              key={c.to}
              to={c.to}
              className={`group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                featured
                  ? "border-foreground/40 shadow-sm sm:col-span-2 lg:col-span-3"
                  : "border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex shrink-0 items-center justify-center rounded-lg text-white ${
                    featured ? "h-14 w-14" : "h-10 w-10"
                  }`}
                  style={{ backgroundColor: c.color }}
                >
                  <Icon className={featured ? "h-7 w-7" : "h-5 w-5"} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-display font-extrabold text-foreground group-hover:underline ${
                      featured ? "text-xl" : "text-base"
                    }`}
                  >
                    {c.title}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                  {featured && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
                      Start here
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
