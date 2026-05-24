import { useCmsSection } from "@/lib/admin/cms-store";
import { FOOTER_KEY, FOOTER_DEFAULT } from "@/lib/admin/defaults";
import brandLogo from "@/assets/bigielts-logo.png";

type FooterProps = {
  variant?: "dark" | "light";
};

export function Footer({ variant = "dark" }: FooterProps) {
  const isLight = variant === "light";
  const content = useCmsSection(FOOTER_KEY, FOOTER_DEFAULT);

  return (
    <footer
      className={isLight ? "bg-background text-foreground" : "bg-navy text-navy-foreground"}
      style={isLight ? { borderTop: "1px solid oklch(0.93 0.01 250)" } : undefined}
    >
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center">
              <img
                src={brandLogo}
                alt="BigIELTS.com"
                style={{ height: 36 }}
                className="w-auto object-contain"
              />
            </div>
            <p
              className="mt-4 max-w-sm text-sm font-medium"
              style={{ color: isLight ? "oklch(0.45 0.02 260)" : "oklch(0.95 0.01 250 / 0.70)" }}
            >
              {content.tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {content.columns.map((c) => (
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
            {content.disclaimer}
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
