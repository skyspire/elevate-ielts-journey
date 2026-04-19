import { GraduationCap } from "lucide-react";

const cols = [
  {
    title: "Navigate",
    links: ["Home", "Recent Questions", "Vocabulary", "E-books"],
  },
  {
    title: "IELTS",
    links: ["Academic Writing", "Academic Speaking", "General Writing", "General Speaking"],
  },
  {
    title: "Account",
    links: ["Sign In", "Sign Up", "My Subscription", "Billing"],
  },
  {
    title: "Support",
    links: ["FAQ", "Contact", "Terms of Service", "Privacy Policy"],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">BandPath</span>
            </div>
            <p className="mt-4 max-w-sm text-sm font-medium text-white/70">
              Recent IELTS Writing & Speaking questions with Band 8–9 sample answers — built to help
              you prepare smarter, not harder.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="font-display text-sm font-extrabold uppercase tracking-wider text-white">
                  {c.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm font-semibold text-white/70 transition-colors hover:text-white"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-xs font-semibold leading-relaxed text-white/55">
            Disclaimer: BandPath is an independent IELTS preparation resource and is{" "}
            <span className="text-white/80">
              not affiliated with, endorsed by, or connected to IELTS, the British Council, IDP
              Education, or Cambridge Assessment English
            </span>
            . All trademarks belong to their respective owners. Content on this site is provided for
            educational purposes only.
          </p>
          <p className="mt-4 text-xs font-bold text-white/50">
            © {new Date().getFullYear()} BandPath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
