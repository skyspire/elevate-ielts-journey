import { GraduationCap } from "lucide-react";

const cols = [
  {
    title: "Navigate",
    links: [{ label: "Home", to: "/" }, { label: "Recent Questions", to: "#" }, { label: "Vocabulary", to: "#" }, { label: "E-books", to: "#" }],
  },
  {
    title: "IELTS",
    links: [{ label: "Academic Writing", to: "#" }, { label: "Academic Speaking", to: "#" }, { label: "General Writing", to: "#" }, { label: "General Speaking", to: "#" }],
  },
  {
    title: "Account",
    links: [{ label: "Sign In", to: "#" }, { label: "Sign Up", to: "#" }, { label: "My Subscription", to: "#" }, { label: "Billing", to: "#" }],
  },
  {
    title: "Support",
    links: [{ label: "FAQ", to: "/faq" }, { label: "Contact", to: "/contact" }, { label: "Terms of Service", to: "/terms" }, { label: "Privacy Policy", to: "/privacy" }],
  },
];

type FooterProps = {
  variant?: "dark" | "light";
};

export function Footer({ variant = "dark" }: FooterProps) {
  const isLight = variant === "light";

  return (
    <footer
      className={isLight ? "bg-background text-foreground" : "bg-navy text-navy-foreground"}
      style={isLight ? { borderTop: "1px solid oklch(0.93 0.01 250)" } : undefined}
    >
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: isLight ? "oklch(0.97 0.01 250)" : "oklch(1 0 0 / 0.10)",
                }}
              >
                <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">BigIELTS.com</span>
            </div>
            <p
              className="mt-4 max-w-sm text-sm font-medium"
              style={{ color: isLight ? "oklch(0.45 0.02 260)" : "oklch(0.95 0.01 250 / 0.70)" }}
            >
              Recent IELTS Writing & Speaking questions with Band 8–9 sample answers — built to help
              you prepare smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <h4
                  className="font-display text-sm font-extrabold uppercase tracking-wider"
                  style={{ color: isLight ? "oklch(0.22 0.03 260)" : "oklch(0.98 0.005 250)" }}
                >
                  {c.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.to}
                        className="text-sm font-semibold transition-colors hover:underline"
                        style={{ color: isLight ? "oklch(0.45 0.02 260)" : "oklch(0.95 0.01 250 / 0.70)" }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-14 pt-8"
          style={{ borderTop: `1px solid ${isLight ? "oklch(0.93 0.01 250)" : "oklch(1 0 0 / 0.10)"}` }}
        >
          <p
            className="mx-auto max-w-4xl text-center text-xs font-semibold leading-relaxed"
            style={{ color: isLight ? "oklch(0.52 0.02 260)" : "oklch(0.95 0.01 250 / 0.55)" }}
          >
            Disclaimer: BigIELTS.com is an independent IELTS preparation resource and is{" "}
            <span style={{ color: isLight ? "oklch(0.26 0.03 260)" : "oklch(0.95 0.01 250 / 0.80)" }}>
              not affiliated with, endorsed by, or connected to IELTS, the British Council, IDP
              Education, or Cambridge Assessment English
            </span>
            . All trademarks belong to their respective owners. Content on this site is provided for
            educational purposes only.
          </p>
          <p
            className="mt-4 text-center text-xs font-bold"
            style={{ color: isLight ? "oklch(0.55 0.02 260)" : "oklch(0.95 0.01 250 / 0.50)" }}
          >
            © {new Date().getFullYear()} BigIELTS.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
