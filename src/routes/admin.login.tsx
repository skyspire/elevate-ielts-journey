import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, getUsers } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const user = login(email, password);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    navigate({ to: "/admin" });
  };

  const demoUsers = getUsers();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Admin Sign In</h1>
          <p className="mt-1 text-sm text-muted-foreground">BigIELTS Content Management</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@bigielts.com"
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-card/50 p-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Prototype demo accounts
          </div>
          <ul className="space-y-1.5 text-xs">
            {demoUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-foreground">{u.email}</div>
                  <div className="text-muted-foreground">
                    Password: <code className="rounded bg-muted px-1">{u.password}</code> · {u.role}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-foreground underline-offset-2 hover:underline"
                  onClick={() => {
                    setEmail(u.email);
                    setPassword(u.password);
                  }}
                >
                  Use
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            ⚠️ This is a local-only prototype. No real authentication or persistence.
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
