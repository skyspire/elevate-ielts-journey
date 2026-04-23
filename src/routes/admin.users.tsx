import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EditorShell } from "@/components/admin/EditorShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AdminUser,
  type AdminRole,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  useSession,
  canManageUsers,
} from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/users")({
  component: UsersEditor,
});

function UsersEditor() {
  const { user: me } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("editor");

  useEffect(() => {
    setUsers(getUsers());
    const onChange = () => setUsers(getUsers());
    window.addEventListener("admin:users-changed", onChange);
    return () => window.removeEventListener("admin:users-changed", onChange);
  }, []);

  if (!canManageUsers(me)) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="font-display text-xl font-extrabold">Not authorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Only owners and admins can manage users.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Admin Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage admin accounts and roles. Prototype-only — passwords stored in plain text in
          localStorage.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Existing users
        </div>
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="min-w-[180px] flex-1">
                <div className="text-sm font-bold">{u.name}</div>
                <div className="text-xs text-muted-foreground">{u.email}</div>
              </div>
              <Select
                value={u.role}
                onValueChange={(v) => updateUser(u.id, { role: v as AdminRole })}
                disabled={u.id === me?.id}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                disabled={u.id === me?.id}
                onClick={() => {
                  if (confirm(`Delete ${u.email}?`)) deleteUser(u.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Invite a new admin
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="new-name">Name</Label>
            <Input id="new-name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="new-email">Email</Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-password">Password</Label>
            <Input
              id="new-password"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={newRole} onValueChange={(v) => setNewRole(v as AdminRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="mt-4"
          onClick={() => {
            if (!newEmail || !newPassword || !newName) return;
            createUser({ email: newEmail, name: newName, password: newPassword, role: newRole });
            setNewEmail("");
            setNewName("");
            setNewPassword("");
            setNewRole("editor");
          }}
        >
          <Plus className="mr-1 h-4 w-4" />
          Create user
        </Button>
      </div>
    </div>
  );
}
