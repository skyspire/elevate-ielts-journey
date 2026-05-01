// Renders a fullscreen maintenance page when maintenance mode is active.
// Admin routes and signed-in admins (when allowAdmins=true) bypass it.

import { useLocation } from "@tanstack/react-router";
import { useMaintenance } from "@/lib/admin/maintenance-store";
import { useSession } from "@/lib/admin/auth";

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const cfg = useMaintenance();
  const location = useLocation();
  const { user } = useSession();

  const isAdminPath = location.pathname.startsWith("/admin");
  const adminBypass = cfg.allowAdmins && !!user;

  if (!cfg.enabled || isAdminPath || adminBypass) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4m0 4h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">We'll be right back</h1>
        <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{cfg.message}</p>
        {cfg.estimatedEndsAt && (
          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            Estimated end: {new Date(cfg.estimatedEndsAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
