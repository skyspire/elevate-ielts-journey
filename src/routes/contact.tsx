import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Mail, MapPin, Clock, Building2 } from "lucide-react";
import { useCmsSection } from "@/lib/admin/cms-store";
import { CONTACT_KEY, CONTACT_DEFAULT } from "@/lib/admin/defaults";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — BigIELTS" },
      {
        name: "description",
        content:
          "Get in touch with BigIELTS.com — operated by Skyspire Academy Private Limited. Email, registered address, and support hours.",
      },
      { property: "og:title", content: "Contact — BigIELTS" },
      {
        property: "og:description",
        content:
          "Reach the BigIELTS.com support team. Email, address, and weekday support hours (IST).",
      },
    ],
  }),
  component: ContactPage,
});

function Row({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Mail;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
          <Icon className="h-6 w-6 text-brand" />
        </div>
        <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="mt-5">{children}</div>
    </article>
  );
}

function ContactPage() {
  const c = useCmsSection(CONTACT_KEY, CONTACT_DEFAULT);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          {/* Heading */}
          <header className="text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
              Questions, feedback, or support requests — our team is here to help.
              We respond to all inquiries within{" "}
              <span className="font-bold text-foreground">2–3 business days</span>.
            </p>
          </header>

          {/* Stack of cards */}
          <div className="mt-12 space-y-6">
            {/* Company */}
            <Row icon={Building2} title="BigIELTS.com">
              <p className="text-base font-semibold text-foreground/80">
                Operated by Skyspire Academy Private Limited
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/70">
                An independent IELTS preparation platform helping learners
                prepare smarter with recent questions and Band 8–9 sample
                answers.
              </p>
            </Row>

            {/* Email */}
            <Row icon={Mail} title="Email">
              <p className="text-base leading-relaxed text-foreground/70">
                For inquiries, account help, billing, and partnerships.
              </p>
              <a
                href="mailto:bigielts@gmail.com"
                className="mt-4 inline-flex break-all text-lg font-extrabold text-brand hover:underline"
              >
                bigielts@gmail.com
              </a>
            </Row>

            {/* Address */}
            <Row icon={MapPin} title="Registered Address">
              <address className="not-italic text-base leading-relaxed text-foreground/80">
                Skyspire Academy
                <br />
                Village Gurha, PO Bara Pind
                <br />
                City Goraya, District Jalandhar
                <br />
                Punjab, India – 144418
              </address>
            </Row>

            {/* Support Hours */}
            <Row icon={Clock} title="Support Hours">
              <p className="text-base leading-relaxed text-foreground/70">
                All times in Indian Standard Time (IST).
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border border-foreground/10">
                <div className="flex items-center justify-between bg-muted/40 px-5 py-4">
                  <span className="text-base font-bold text-foreground">
                    Monday – Friday
                  </span>
                  <span className="text-base font-extrabold text-brand">
                    10:00 AM – 6:00 PM
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-foreground/10 px-5 py-4">
                  <span className="text-base font-bold text-foreground">
                    Saturday & Sunday
                  </span>
                  <span className="text-base font-bold text-foreground/50">
                    Closed
                  </span>
                </div>
              </div>
            </Row>
          </div>

          {/* Response note */}
          <div className="mt-10 rounded-2xl border border-foreground/10 bg-muted/40 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-foreground/75">
              <span className="font-extrabold text-foreground">Response time:</span>{" "}
              We respond to all email inquiries within 2–3 business days.
              For time-sensitive matters, please mention{" "}
              <span className="font-extrabold text-foreground">URGENT</span>{" "}
              in your email subject line so our team can prioritise it.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
