import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  PERMISSION_MODULES,
  disableTotp,
  enableTotp,
  generateTotpSecret,
  setUserPermission,
  useAdminUsersWithPerms,
  type PermissionAction,
  type PermissionModule,
} from "@/lib/admin/permissions-store";
import { useSession } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/permissions")({
  head: () => ({ meta: [{ title: "Permissions — Admin" }, { name: "robots", content: "noindex" }] }),
  component: PermsPage,
});

function PermsPage() {
  const { user: me } = useSession();
  const { users, matrix, totp } = useAdminUsersWithPerms();

  if (me?.role !== "owner" && me?.role !== "admin") {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm">
        Only owners or admins can manage permissions.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Permissions & 2FA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Owners always have full access. Use the matrix below to grant editors fine-grained
          view/edit access per module, and require TOTP-style 2FA per admin.
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-muted/50 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">User</th>
              {PERMISSION_MODULES.map((m) => (
                <th key={m.id} className="px-2 py-2 text-center" title={m.label}>
                  {m.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border align-top">
                <td className="px-3 py-2">
                  <div className="font-bold">{u.name}</div>
                  <div className="text-[11px] text-muted-foreground">{u.email}</div>
                  <div className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">
                    {u.role}
                  </div>
                </td>
                {PERMISSION_MODULES.map((m) => {
                  const granted: PermissionAction[] =
                    u.role === "owner"
                      ? ["view", "edit"]
                      : u.role === "admin" && m.id !== "users"
                        ? ["view", "edit"]
                        : (matrix[u.id]?.[m.id as PermissionModule] ?? []);
                  const disabled = u.role === "owner" || (u.role === "admin" && m.id !== "users");
                  return (
                    <td key={m.id} className="px-2 py-2 text-center">
                      <select
                        disabled={disabled}
                        value={
                          granted.includes("edit") ? "edit" : granted.includes("view") ? "view" : "none"
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          const next: PermissionAction[] =
                            v === "edit" ? ["view", "edit"] : v === "view" ? ["view"] : [];
                          setUserPermission(u.id, m.id as PermissionModule, next);
                        }}
                        className="rounded border border-border bg-background px-1 py-0.5 text-[11px] disabled:opacity-50"
                      >
                        <option value="none">—</option>
                        <option value="view">View</option>
                        <option value="edit">Edit</option>
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3 text-sm font-bold">Two-factor (TOTP)</div>
        <ul className="divide-y divide-border">
          {users.map((u) => {
            const enrolled = !!totp[u.id]?.enabled;
            return <TotpRow key={u.id} userId={u.id} name={u.name} enrolled={enrolled} secret={totp[u.id]?.secret} />;
          })}
        </ul>
      </div>
    </div>
  );
}

function TotpRow({
  userId,
  name,
  enrolled,
  secret,
}: {
  userId: string;
  name: string;
  enrolled: boolean;
  secret?: string;
}) {
  const [reveal, setReveal] = useState<string | null>(null);
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-2.5">
      <div>
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-[11px] text-muted-foreground">
          {enrolled ? "TOTP enabled" : "Not enrolled"}
        </div>
        {reveal && (
          <div className="mt-1 font-mono text-[11px]">
            Secret: <span className="rounded bg-muted px-1.5 py-0.5">{reveal}</span>
            <span className="ml-2 text-muted-foreground">
              (Mock: code = last 6 chars of secret)
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {enrolled ? (
          <>
            <button
              onClick={() => setReveal(secret ?? "")}
              className="rounded-md border border-border bg-muted px-3 py-1 text-xs font-semibold"
            >
              Reveal secret
            </button>
            <button
              onClick={() => {
                if (confirm("Disable 2FA for this admin?")) disableTotp(userId);
              }}
              className="rounded-md border border-destructive/40 px-3 py-1 text-xs font-semibold text-destructive"
            >
              Disable
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              const s = generateTotpSecret();
              enableTotp(userId, s);
              setReveal(s);
            }}
            className="rounded-md bg-foreground px-3 py-1 text-xs font-bold text-background"
          >
            Enable 2FA
          </button>
        )}
      </div>
    </li>
  );
}
