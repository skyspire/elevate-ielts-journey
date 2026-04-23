import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Mail, MapPin, Clock, Building2, ArrowRight } from "lucide-react";

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

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* ───────────── Hero ───────────── */}
        <section className="border-b border-foreground/10 bg-muted/30">
          <div className="container-page py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand">
                <Mail className="h-3.5 w-3.5" />
                Contact Us
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                We'd love to hear from you
              </h1>
              <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
                Questions, feedback, or support requests — our team is here to help.
                Reach out and we'll respond within{" "}
                <span className="font-bold text-foreground">2–3 business days</span>.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────── Main Grid ───────────── */}
        <section className="container-page py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
            {/* LEFT — Company card (sticky-feel, primary identity) */}
            <aside className="lg:col-span-1">
              <div className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
                  <Building2 className="h-6 w-6 text-brand" />
                </div>
                <h2 className="mt-5 font-display text-xl font-extrabold text-foreground">
                  BigIELTS.com
                </h2>
                <p className="mt-1.5 text-sm font-semibold text-foreground/60">
                  Operated by Skyspire Academy Private Limited
                </p>

                <div className="my-6 h-px w-full bg-foreground/10" />

                <p className="text-sm font-semibold leading-relaxed text-foreground/70">
                  An independent IELTS preparation platform helping learners
                  prepare smarter with recent questions and Band 8–9 sample
                  answers.
                </p>

                <a
                  href="mailto:bigielts@gmail.com"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-extrabold text-brand-foreground transition-colors hover:bg-brand/90"
                >
                  Email Support
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </aside>

            {/* RIGHT — Detail cards */}
            <div className="grid gap-6 lg:col-span-2">
              {/* Email */}
              <article className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                    <Mail className="h-6 w-6 text-brand" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-extrabold text-foreground sm:text-xl">
                        Email
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">
                        Primary channel
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground/60">
                      For inquiries, account help, billing, and partnerships.
                    </p>
                    <a
                      href="mailto:bigielts@gmail.com"
                      className="mt-4 inline-flex items-center gap-2 break-all text-base font-extrabold text-brand hover:underline"
                    >
                      bigielts@gmail.com
                    </a>
                  </div>
                </div>
              </article>

              {/* Support Hours */}
              <article className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                    <Clock className="h-6 w-6 text-brand" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-extrabold text-foreground sm:text-xl">
                        Support Hours
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">
                        IST (GMT +5:30)
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground/60">
                      We aim to respond within 2–3 business days.
                    </p>

                    <div className="mt-5 overflow-hidden rounded-xl border border-foreground/10">
                      <div className="flex items-center justify-between bg-muted/40 px-4 py-3">
                        <span className="text-sm font-bold text-foreground">
                          Monday – Friday
                        </span>
                        <span className="text-sm font-extrabold text-brand">
                          10:00 AM – 6:00 PM
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-foreground/10 px-4 py-3">
                        <span className="text-sm font-bold text-foreground">
                          Saturday & Sunday
                        </span>
                        <span className="text-sm font-bold text-foreground/50">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Registered Address */}
              <article className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                    <MapPin className="h-6 w-6 text-brand" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-extrabold text-foreground sm:text-xl">
                        Registered Address
                      </h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">
                        India
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground/60">
                      Skyspire Academy Private Limited
                    </p>
                    <address className="mt-4 not-italic text-base leading-relaxed text-foreground/80">
                      Skyspire Academy
                      <br />
                      Village Gurha, PO Bara Pind
                      <br />
                      City Goraya, District Jalandhar
                      <br />
                      Punjab, India – 144418
                    </address>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* Response note */}
          <div className="mx-auto mt-10 max-w-6xl rounded-2xl border border-foreground/10 bg-muted/40 p-6 sm:p-7">
            <p className="text-sm font-semibold leading-relaxed text-foreground/75">
              <span className="font-extrabold text-foreground">Response time:</span>{" "}
              We respond to all email inquiries within{" "}
              <span className="font-extrabold text-foreground">2–3 business days</span>.
              For time-sensitive matters, please add{" "}
              <span className="rounded-md bg-brand-soft px-1.5 py-0.5 font-extrabold text-brand">
                URGENT
              </span>{" "}
              in your email subject line so our team can prioritise it.
            </p>
          </div>
        </section>
      </main>

      <Footer variant="light" />
    </div>
  );
}
