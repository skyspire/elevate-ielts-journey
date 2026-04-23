import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.1l6.6 4.8C14.7 15 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5c-7.6 0-14.2 4.3-17.7 10.6z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5.2 0 9.8-2 13.3-5.2l-6.1-5.2c-2 1.4-4.5 2.2-7.2 2.2-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.7 39.1 16.3 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.1 5.2c-.4.4 6.6-4.8 6.6-14.6 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.42 2.21-1.13 3-.76.84-1.99 1.5-3.18 1.41-.14-1.11.42-2.27 1.11-3 .77-.81 2.08-1.42 3.2-1.41zM21 17.42c-.55 1.27-.81 1.83-1.52 2.95-.99 1.55-2.39 3.49-4.13 3.5-1.55.02-1.95-1.01-4.05-1-2.1.01-2.54 1.02-4.09 1-1.74-.01-3.07-1.76-4.06-3.31C.42 17.27.13 12.05 2.39 9.27c1.6-1.96 4.13-3.11 6.5-3.11 2.42 0 3.94 1.32 5.94 1.32 1.94 0 3.12-1.32 5.92-1.32 2.12 0 4.36 1.16 5.96 3.16-5.24 2.87-4.39 10.36-1.71 8.1z" />
    </svg>
  );
}

export function SocialAuthButtons({ mode }: { mode: "login" | "signup" }) {
  const [magicLoading, setMagicLoading] = useState(false);
  const verb = mode === "login" ? "Sign in" : "Sign up";

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={() =>
          toast.info("Demo only", {
            description: "Google sign-in needs a real backend. Enable Lovable Cloud to activate.",
          })
        }
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-muted/60"
      >
        <GoogleIcon className="h-4 w-4" />
        {verb} with Google
      </button>
      <button
        type="button"
        onClick={() =>
          toast.info("Demo only", {
            description: "Apple sign-in needs a real backend. Enable Lovable Cloud to activate.",
          })
        }
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-foreground bg-foreground text-sm font-semibold text-background transition hover:bg-foreground/90"
      >
        <AppleIcon className="h-4 w-4" />
        {verb} with Apple
      </button>
      <button
        type="button"
        disabled={magicLoading}
        onClick={() => {
          setMagicLoading(true);
          setTimeout(() => {
            setMagicLoading(false);
            toast.success("Magic link sent (demo)", {
              description: "In production, we'd email you a one-tap sign-in link.",
            });
          }, 900);
        }}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-background text-sm font-semibold text-foreground transition hover:bg-muted/40"
      >
        {magicLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}
        {magicLoading ? "Sending magic link…" : "Email me a magic link"}
      </button>
    </div>
  );
}
