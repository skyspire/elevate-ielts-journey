import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Type,
  CreditCard,
  HelpCircle,
  Mail,
  Layout,
  BookOpen,
  MessageSquare,
  Library,
  Users,
  LogOut,
  ExternalLink,
  Database,
  BarChart3,
} from "lucide-react";
import { useSession, canManageUsers } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — BigIELTS" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

type NavItem = {
  to:
    | "/admin"
    | "/admin/login"
    | "/admin/hero"
    | "/admin/stats"
    | "/admin/pricing"
    | "/admin/faq"
    | "/admin/footer"
    | "/admin/contact"
    | "/admin/writing"
    | "/admin/speaking"
    | "/admin/vocabulary"
    | "/admin/users"
    | "/admin/data";
  label: string;
  icon: typeof LayoutDashboard;
  group: string;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "Overview", exact: true },
  { to: "/admin/hero", label: "Hero Section", icon: Type, group: "Homepage" },
  { to: "/admin/stats", label: "Stats", icon: BarChart3, group: "Homepage" },
  { to: "/admin/pricing", label: "Pricing", icon: CreditCard, group: "Homepage" },
  { to: "/admin/faq", label: "FAQ", icon: HelpCircle, group: "Homepage" },
  { to: "/admin/footer", label: "Footer", icon: Layout, group: "Site" },
  { to: "/admin/contact", label: "Contact Page", icon: Mail, group: "Site" },
  { to: "/admin/writing", label: "Writing Prompts", icon: BookOpen, group: "Content" },
  { to: "/admin/speaking", label: "Speaking Topics", icon: MessageSquare, group: "Content" },
  { to: "/admin/vocabulary", label: "Vocabulary", icon: Library, group: "Content" },
  { to: "/admin/users", label: "Admin Users", icon: Users, group: "System" },
  { to: "/admin/data", label: "Import / Export", icon: Database, group: "System" },
];

function AdminLayout() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated (except on the login route itself)
  useEffect(() => {
    if (!user && location.pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    }
  }, [user, location.pathname, navigate]);

  // The login page renders its own shell — no sidebar
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Redirecting to login…</p>
      </div>
    );
  }

  const grouped = NAV.reduce<Record<string, NavItem[]>>((acc, item) => {
    if (item.to === "/admin/users" && !canManageUsers(user)) return acc;
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="border-b border-border px-5 py-4">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-bold leading-tight text-foreground">Admin</div>
              <div className="text-[11px] font-medium leading-tight text-muted-foreground">
                BigIELTS CMS
              </div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-5">
              <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {group}
              </div>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        activeOptions={{ exact: item.exact }}
                        className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        activeProps={{
                          className:
                            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-semibold bg-foreground text-background hover:bg-foreground hover:text-background",
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-border px-3 py-3">
          <div className="rounded-md bg-muted px-2.5 py-2">
            <div className="text-xs font-bold text-foreground">{user.name}</div>
            <div className="text-[11px] text-muted-foreground">{user.email}</div>
            <div className="mt-1 inline-flex rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
              {user.role}
            </div>
          </div>
          <Link
            to="/"
            className="mt-2 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Site
          </Link>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <Link to="/admin" className="text-sm font-bold">
            BigIELTS Admin
          </Link>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            className="text-xs font-semibold text-muted-foreground"
          >
            Sign out
          </button>
        </div>
        <div className="flex flex-wrap gap-1 border-b border-border bg-card px-3 py-2 lg:hidden">
          {NAV.filter((n) => n.to !== "/admin/users" || canManageUsers(user)).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="rounded-md px-2.5 py-1 text-xs font-semibold text-muted-foreground"
              activeProps={{
                className: "rounded-md px-2.5 py-1 text-xs font-semibold bg-foreground text-background",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
