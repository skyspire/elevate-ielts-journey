import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Folder,
  Settings as SettingsIcon,
} from "lucide-react";
import { useSession, canManageUsers } from "@/lib/admin/auth";
import { CONTENT_MODULES } from "@/lib/admin/content-tree";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — BigIELTS" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Avoid SSR/CSR hydration mismatch: useSession reads from localStorage which
  // is null on the server. Wait for first client mount before branching on it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user && location.pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    }
  }, [mounted, user, location.pathname, navigate]);

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading admin…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
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
          <SidebarTree canUsers={canManageUsers(user)} currentPath={location.pathname} />
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

      {/* Mobile top bar + drawer trigger */}
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
        <MobileNav canUsers={canManageUsers(user)} />

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ───────── Sidebar tree ─────────

function SidebarTree({ canUsers, currentPath }: { canUsers: boolean; currentPath: string }) {
  return (
    <div className="space-y-5">
      {/* Overview */}
      <Section label="Overview">
        <Leaf to="/admin" exact icon={LayoutDashboard} label="Dashboard" />
      </Section>

      {/* Content — the big nested tree */}
      <Section label="Content">
        {CONTENT_MODULES.map((mod) => {
          const moduleBasePath = `/admin/content/${mod.id}`;
          const moduleOpen = currentPath.startsWith(moduleBasePath);
          return (
            <Group
              key={mod.id}
              icon={GraduationCap}
              label={mod.label}
              to="/admin/content/$module"
              params={{ module: mod.id }}
              defaultOpen={moduleOpen}
            >
              {mod.skills.map((skill) => {
                const SkillIcon = skill.id === "writing" ? BookOpen : MessageSquare;
                const skillBasePath = `${moduleBasePath}/${skill.id}`;
                const skillOpen = currentPath.startsWith(skillBasePath);
                return (
                  <Group
                    key={skill.id}
                    icon={SkillIcon}
                    label={skill.label}
                    to="/admin/content/$module/$skill"
                    params={{ module: mod.id, skill: skill.id }}
                    defaultOpen={skillOpen}
                    indent
                    indentLevel={1}
                  >
                    {skill.sections.map((section) => {
                      const sectionPath = `${skillBasePath}/${section.id}`;
                      const sectionOpen = currentPath.startsWith(sectionPath);
                      return (
                        <Group
                          key={section.id}
                          icon={Folder}
                          label={section.label}
                          to="/admin/content/$module/$skill/$section"
                          params={{ module: mod.id, skill: skill.id, section: section.id }}
                          defaultOpen={sectionOpen}
                          indent
                          indentLevel={2}
                        >
                          {section.questionTypes.map((qt) => (
                            <TypeLeaf
                              key={qt.id}
                              moduleId={mod.id}
                              skill={skill.id}
                              section={section.id}
                              type={qt.id}
                              label={qt.label}
                            />
                          ))}
                        </Group>
                      );
                    })}
                  </Group>
                );
              })}
            </Group>
          );
        })}

        <Leaf to="/admin/vocabulary" icon={Library} label="Vocabulary" />
      </Section>

      {/* Site / Homepage */}
      <Section label="Site">
        <Leaf to="/admin/hero" icon={Type} label="Hero Section" />
        <Leaf to="/admin/homepage" icon={Layout} label="Homepage Layout" />
        <Leaf to="/admin/stats" icon={BarChart3} label="Stats" />
        <Leaf to="/admin/pricing" icon={CreditCard} label="Pricing" />
        <Leaf to="/admin/faq" icon={HelpCircle} label="FAQ" />
        <Leaf to="/admin/footer" icon={Layout} label="Footer" />
        <Leaf to="/admin/contact" icon={Mail} label="Contact Page" />
        <Leaf to="/admin/banner" icon={SettingsIcon} label="Announcement Banner" />
        <Leaf to="/admin/branding" icon={SettingsIcon} label="Theme & Branding" />
        <Leaf to="/admin/seo" icon={SettingsIcon} label="Per-page SEO" />
      </Section>

      {/* System */}
      <Section label="System">
        <Leaf to="/admin/activity" icon={SettingsIcon} label="Activity Log" />
        {canUsers && <Leaf to="/admin/users" icon={Users} label="Admin Users" />}
        <Leaf to="/admin/data" icon={Database} label="Import / Export" />
        <Leaf to="/admin/writing" icon={SettingsIcon} label="Writing JSON (advanced)" />
        <Leaf to="/admin/speaking" icon={SettingsIcon} label="Speaking JSON (advanced)" />
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

type LeafProps = {
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
    | "/admin/data"
    | "/admin/content"
    | "/admin/activity"
    | "/admin/branding"
    | "/admin/homepage"
    | "/admin/seo"
    | "/admin/banner";
  icon: typeof LayoutDashboard;
  label: string;
  exact?: boolean;
  indentLevel?: number;
};

function Leaf({ to, icon: Icon, label, exact, indentLevel = 0 }: LeafProps) {
  return (
    <li style={{ paddingLeft: indentLevel * 12 }}>
      <Link
        to={to}
        activeOptions={{ exact }}
        className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        activeProps={{
          className:
            "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-semibold bg-foreground text-background hover:bg-foreground hover:text-background",
        }}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </Link>
    </li>
  );
}

// Typed link to /admin/content/$module/$skill/$section/$type
function TypeLeaf({
  moduleId,
  skill,
  section,
  type,
  label,
}: {
  moduleId: string;
  skill: string;
  section: string;
  type: string;
  label: string;
}) {
  return (
    <li style={{ paddingLeft: 48 }}>
      <Link
        to="/admin/content/$module/$skill/$section/$type"
        params={{ module: moduleId, skill, section, type }}
        className="flex items-center gap-2 rounded-md px-2.5 py-1 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        activeProps={{
          className:
            "flex items-center gap-2 rounded-md px-2.5 py-1 text-[13px] font-semibold bg-foreground/10 text-foreground",
        }}
      >
        <span className="h-1 w-1 rounded-full bg-current opacity-50" />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}

type GroupProps = {
  icon: typeof LayoutDashboard;
  label: string;
  to:
    | "/admin/content"
    | "/admin/content/$module"
    | "/admin/content/$module/$skill"
    | "/admin/content/$module/$skill/$section";
  params?: Record<string, string>;
  defaultOpen?: boolean;
  indent?: boolean;
  indentLevel?: number;
  children: React.ReactNode;
};

function Group({
  icon: Icon,
  label,
  to,
  params,
  defaultOpen = false,
  indentLevel = 0,
  children,
}: GroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  // Re-sync if defaultOpen flips (route changed)
  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  return (
    <li>
      <div
        className="flex items-center gap-1 rounded-md pr-1 hover:bg-muted/60"
        style={{ paddingLeft: indentLevel * 12 }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-7 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
          aria-expanded={open}
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <Link
          to={to as string}
          params={params as never}
          className="flex flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-sm font-semibold text-foreground/80 hover:text-foreground"
          activeProps={{
            className:
              "flex flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-sm font-bold text-foreground",
          }}
          activeOptions={{ exact: true }}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="truncate">{label}</span>
        </Link>
      </div>
      {open && <ul className="mt-0.5 space-y-0.5">{children}</ul>}
    </li>
  );
}

// ───────── Mobile nav (simpler — flat chip strip) ─────────

function MobileNav({ canUsers }: { canUsers: boolean }) {
  const items: { to: LeafProps["to"]; label: string; exact?: boolean }[] = [
    { to: "/admin", label: "Dashboard", exact: true },
    { to: "/admin/content", label: "Content" },
    { to: "/admin/vocabulary", label: "Vocabulary" },
    { to: "/admin/hero", label: "Hero" },
    { to: "/admin/stats", label: "Stats" },
    { to: "/admin/pricing", label: "Pricing" },
    { to: "/admin/faq", label: "FAQ" },
    { to: "/admin/footer", label: "Footer" },
    { to: "/admin/contact", label: "Contact" },
    { to: "/admin/data", label: "Data" },
  ];
  if (canUsers) items.push({ to: "/admin/users", label: "Users" });

  return (
    <div className="flex flex-wrap gap-1 border-b border-border bg-card px-3 py-2 lg:hidden">
      {items.map((item) => (
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
  );
}
