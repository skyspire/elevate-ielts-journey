import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSplitLayout } from "@/components/site/AuthSplitLayout";
import { SocialAuthButtons } from "@/components/site/SocialAuthButtons";
import { signupLearner } from "@/lib/learner-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — BigIELTS" },
      {
        name: "description",
        content:
          "Join 120,000+ IELTS test-takers. Free account: Band 8–9 sample answers, recent exam questions, vocabulary, and weekly predictions.",
      },
    ],
  }),
  component: SignupPage,
});

function passwordChecks(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
  };
}

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checks = useMemo(() => passwordChecks(password), [password]);
  const strong = checks.length && checks.upper && checks.number;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!strong) {
      setError("Please meet all password requirements.");
      return;
    }
    if (!agree) {
      setError("You must agree to the terms to continue.");
      return;
    }
    const result = signupLearner({ name, email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success(`Welcome aboard, ${result.user.name}!`, {
      description: "Your free account is ready.",
    });
    navigate({ to: "/" });
  };

  return (
    <AuthSplitLayout
      title="Start your IELTS journey"
      subtitle="Create a free account — unlock Band 8–9 sample answers, vocabulary, and weekly predictions."
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SocialAuthButtons mode="signup" />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          or with email
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Priya Ramaswamy"
            required
            autoComplete="name"
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="mt-1.5 h-11"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password strength checklist */}
          <ul className="mt-2 grid grid-cols-3 gap-1.5 text-[11px]">
            {[
              { ok: checks.length, label: "8+ characters" },
              { ok: checks.upper, label: "1 uppercase" },
              { ok: checks.number, label: "1 number" },
            ].map((c) => (
              <li
                key={c.label}
                className={`flex items-center gap-1 rounded-md px-2 py-1 transition ${
                  c.ok
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                <Check className={`h-3 w-3 ${c.ok ? "opacity-100" : "opacity-30"}`} />
                {c.label}
              </li>
            ))}
          </ul>
        </div>

        <label className="flex cursor-pointer select-none items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
          />
          <span className="leading-snug">
            I agree to the{" "}
            <Link to="/terms" className="font-semibold text-foreground hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-semibold text-foreground hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="h-11 w-full text-[15px] font-semibold">
          Create my free account
        </Button>

        <p className="rounded-md border border-dashed border-border bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
          ⚠️ <strong className="text-foreground">Prototype:</strong> data lives in your browser
          only. To activate real authentication (Google, Apple, magic link, password reset), enable
          Lovable Cloud.
        </p>
      </form>
    </AuthSplitLayout>
  );
}
