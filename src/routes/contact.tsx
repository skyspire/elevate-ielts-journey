import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Mail, MapPin, Clock, Phone } from "lucide-react";

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

      <main className="container-page py-16 sm:py-20">
        {/* Heading */}
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand">
            <Phone className="h-3.5 w-3.5" />
            Get in touch
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Contact Information
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/70 sm:text-lg">
            <span className="font-semibold text-foreground">BigIELTS.com</span> — operated by{" "}
            <span className="font-semibold text-foreground">Skyspire Academy Private Limited</span>.
            We're here to help with your questions, feedback, and support requests.
          </p>
        </header>

        {/* Cards */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:mt-16 md:grid-cols-2">
          {/* Email */}
          <div className="group rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
              <Mail className="h-6 w-6 text-brand" />
            </div>
            <h2 className="mt-5 font-display text-xl font-extrabold text-foreground">Email</h2>
            <p className="mt-2 text-sm font-medium text-foreground/60">
              For general inquiries and support
            </p>
            <a
              href="mailto:bigielts@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-base font-bold text-brand hover:underline"
            >
              bigielts@gmail.com
            </a>
          </div>

          {/* Support Hours */}
          <div className="group rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
              <Clock className="h-6 w-6 text-brand" />
            </div>
            <h2 className="mt-5 font-display text-xl font-extrabold text-foreground">
              Support Hours
            </h2>
            <p className="mt-2 text-sm font-medium text-foreground/60">All times in IST</p>
            <div className="mt-4 space-y-2 text-base">
              <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
                <span className="font-semibold text-foreground">Monday – Friday</span>
                <span className="font-bold text-brand">10:00 AM – 6:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Saturday & Sunday</span>
                <span className="font-bold text-foreground/50">Closed</span>
              </div>
            </div>
          </div>

          {/* Registered Address — full width */}
          <div className="group rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md sm:p-8 md:col-span-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
              <MapPin className="h-6 w-6 text-brand" />
            </div>
            <h2 className="mt-5 font-display text-xl font-extrabold text-foreground">
              Registered Address
            </h2>
            <p className="mt-2 text-sm font-medium text-foreground/60">
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

        {/* Footer note */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-foreground/10 bg-muted/40 p-6 text-center sm:p-8">
          <p className="text-sm font-semibold leading-relaxed text-foreground/70">
            We aim to respond to all email inquiries within{" "}
            <span className="font-bold text-foreground">1–2 business days</span>. For urgent matters,
            please mention <span className="font-bold text-foreground">"URGENT"</span> in your email
            subject line.
          </p>
        </div>
      </main>

      <Footer variant="light" />
    </div>
  );
}
