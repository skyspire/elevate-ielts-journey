import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ShieldAlert, Mail, Scale, FileWarning } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — BigIELTS" },
      {
        name: "description",
        content:
          "Read the Terms and Conditions governing the use of BigIELTS.com — a Skyspire Academy Private Limited platform.",
      },
      { property: "og:title", content: "Terms and Conditions — BigIELTS" },
      {
        property: "og:description",
        content:
          "Legally binding terms for users of BigIELTS.com, including subscription, refund, anti-piracy, and enforcement policies.",
      },
    ],
  }),
  component: TermsPage,
});

/* ----------------------------- Helpers ----------------------------- */

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <h2
      id={`section-${number}`}
      className="scroll-mt-24 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
    >
      <span className="mr-3 inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-brand-soft px-2 text-base font-extrabold text-brand">
        {number}
      </span>
      {title}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 font-display text-lg font-bold text-foreground sm:text-xl">
      <span className="text-brand">▸</span> {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-base leading-relaxed text-foreground/80">{children}</p>;
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-base leading-relaxed text-foreground/80">
          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Numbered({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-3 space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-base leading-relaxed text-foreground/80">
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
            {i + 1}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ol>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 border-t border-foreground/10 pt-10 first:mt-0 first:border-t-0 first:pt-0">
      <SectionTitle number={number} title={title} />
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Callout({
  tone = "warning",
  icon: Icon,
  children,
}: {
  tone?: "warning" | "info";
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const styles =
    tone === "warning"
      ? "border-destructive/30 bg-destructive/5 text-destructive-foreground"
      : "border-brand/30 bg-brand-soft text-foreground";
  return (
    <div className={`mt-4 flex gap-3 rounded-xl border p-4 ${styles}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div className="text-sm font-medium leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

/* ----------------------------- Page ----------------------------- */

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-page py-16 sm:py-20">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            <Scale className="h-3.5 w-3.5" /> Legal
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-base font-medium text-muted-foreground sm:text-lg">
            Effective Date: <span className="text-foreground">Apr 22, 2026</span> · Website:{" "}
            <span className="text-foreground">BigIELTS.com</span>
          </p>
        </div>

        {/* Content */}
        <article className="mx-auto mt-14 max-w-3xl">
          <Section number="1" title="Preamble">
            <P>
              These Terms and Conditions (“Terms”) constitute a legally binding agreement between
              you (“User”, “you”, “your”) and <strong>Skyspire Academy Private Limited</strong>, a
              company incorporated under the laws of India, having its registered office at:
            </P>
            <div className="mt-4 rounded-xl border border-foreground/10 bg-muted/40 p-4 text-base leading-relaxed text-foreground/85">
              Skyspire Academy, Village Gurha, PO Bara Pind,
              <br />
              City Goraya, District Jalandhar, Punjab – 144418, India
            </div>
            <P>
              (Hereinafter referred to as the “Company”, “we”, “us”, or “our”).
            </P>
            <P>
              By accessing, browsing, registering on, or using the website{" "}
              <strong>BigIELTS.com</strong> (the “Platform”), you expressly acknowledge that you
              have read, understood, and agreed to be bound by these Terms.
            </P>
          </Section>

          <Section number="2" title="Definitions">
            <P>For the purposes of these Terms:</P>
            <Bullets
              items={[
                <>
                  <strong>“Platform”</strong> means BigIELTS.com and all associated services
                </>,
                <>
                  <strong>“Content”</strong> includes but is not limited to eBooks, PDFs, digital
                  resources, study materials, and proprietary educational content
                </>,
                <>
                  <strong>“Services”</strong> refers to all offerings provided via the Platform
                </>,
                <>
                  <strong>“Subscription”</strong> refers to recurring paid access to Services
                </>,
                <>
                  <strong>“User Account”</strong> means a registered account required for access
                </>,
                <>
                  <strong>“Intellectual Property”</strong> includes copyrights, trademarks, and
                  proprietary materials
                </>,
              ]}
            />
          </Section>

          <Section number="3" title="Acceptance of Terms">
            <P>By using the Platform, you:</P>
            <Bullets
              items={[
                "Confirm your legal capacity to enter into binding agreements",
                "Agree to comply with all applicable laws and regulations",
                "Accept these Terms in their entirety",
              ]}
            />
            <P>If you do not agree, you must immediately cease use of the Platform.</P>
          </Section>

          <Section number="4" title="Eligibility">
            <P>Use of the Platform is restricted to individuals who:</P>
            <Bullets
              items={[
                "Are at least 18 years of age, or",
                "Are accessing under the supervision of a legal guardian",
              ]}
            />
            <P>
              The Company reserves the right to restrict access if eligibility criteria are not met.
            </P>
          </Section>

          <Section number="5" title="Account Registration and Security">
            <SubTitle>5.1 Mandatory Registration</SubTitle>
            <P>
              Access to Services requires the creation of a User Account. Guest access is not
              permitted.
            </P>

            <SubTitle>5.2 User Obligations</SubTitle>
            <P>You agree to:</P>
            <Bullets
              items={[
                "Provide accurate and complete information",
                "Maintain confidentiality of login credentials",
                "Accept responsibility for all activities conducted under your account",
              ]}
            />

            <SubTitle>5.3 Unauthorized Access</SubTitle>
            <P>
              You must immediately notify the Company of any unauthorized use of your account.
            </P>
          </Section>

          <Section number="6" title="Nature of Services">
            <P>
              The Platform provides digital educational resources for IELTS preparation, including
              subscription-based and downloadable materials.
            </P>
            <P>All Services are delivered electronically. No physical goods are provided.</P>
          </Section>

          <Section number="7" title="Subscriptions, Fees, and Payment">
            <SubTitle>7.1 Pricing</SubTitle>
            <P>
              All prices are displayed on the Platform and are subject to change at the sole
              discretion of the Company.
            </P>

            <SubTitle>7.2 Payment Processing</SubTitle>
            <P>
              Payments are processed via third-party gateways, including Razorpay. The Company does
              not store payment credentials.
            </P>

            <SubTitle>7.3 Subscription Renewal</SubTitle>
            <P>
              Subscriptions may renew automatically unless canceled prior to the renewal date.
            </P>

            <SubTitle>7.4 Billing Authorization</SubTitle>
            <P>By purchasing, you authorize the Company to charge applicable fees.</P>
          </Section>

          <Section number="8" title="Strict No Refund Policy">
            <P>Due to the nature of digital content:</P>
            <Bullets
              items={[
                <>
                  <strong>All transactions are final and non-refundable</strong>
                </>,
                "No refunds shall be issued under any circumstances, including but not limited to:",
              ]}
            />
            <ul className="ml-7 mt-2 space-y-2">
              {[
                "User dissatisfaction",
                "Accidental purchase",
                "Partial usage",
                "Technical issues not attributable to the Company",
              ].map((it) => (
                <li
                  key={it}
                  className="flex gap-3 text-base leading-relaxed text-foreground/80"
                >
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <Callout icon={FileWarning}>
              By proceeding with a purchase, you expressly waive any right to claim a refund.
            </Callout>
          </Section>

          <Section number="9" title="License and Permitted Use">
            <P>
              The Company grants a limited, revocable, non-exclusive, non-transferable license to
              access Content strictly for personal, non-commercial use.
            </P>

            <SubTitle>9.1 Restrictions</SubTitle>
            <P>Users shall not:</P>
            <Bullets
              items={[
                "Copy, reproduce, distribute, or exploit Content",
                "Share account credentials",
                "Upload or publish Content externally",
                "Print or replicate materials in any form",
              ]}
            />
            <P>Any violation constitutes a breach of these Terms.</P>
          </Section>

          <Section number="10" title="Intellectual Property Rights">
            <P>
              All Content is owned by or licensed to the Company and is protected under applicable
              intellectual property laws.
            </P>
            <P>
              Certain materials may be developed with the assistance of publicly available sources
              or AI tools. However, the compilation, structure, and presentation remain proprietary.
            </P>
            <P>
              <strong>Unauthorized use shall result in legal action.</strong>
            </P>
          </Section>

          <Section number="11" title="Anti-Piracy and Enforcement">
            <P>The Company enforces strict anti-piracy measures.</P>
            <P>In the event of unauthorized distribution:</P>
            <Bullets
              items={[
                "Immediate account termination may occur",
                "Legal proceedings may be initiated",
                "Monetary damages may be claimed",
              ]}
            />
            <P>
              Users acknowledge that violations may result in civil and criminal liability.
            </P>
          </Section>

          <Section number="12" title="User Conduct">
            <P>Users agree not to:</P>
            <Bullets
              items={[
                "Engage in unlawful activities",
                "Attempt to disrupt or hack the Platform",
                "Exploit system vulnerabilities",
                "Abuse discounts or promotional systems",
              ]}
            />
          </Section>

          <Section number="13" title="Disclaimer of Warranties">
            <P>
              The Platform and Services are provided on an{" "}
              <strong>“as-is” and “as-available”</strong> basis.
            </P>
            <P>The Company makes no warranties, including but not limited to:</P>
            <Bullets
              items={[
                "Accuracy or completeness of Content",
                "Fitness for a particular purpose",
                "Uninterrupted or error-free operation",
              ]}
            />
          </Section>

          <Section number="14" title="Disclaimer of Results">
            <P>The Company does not guarantee:</P>
            <Bullets
              items={["IELTS scores or band improvements", "Academic or professional outcomes"]}
            />
            <P>Performance depends on individual effort and external factors.</P>
          </Section>

          <Section number="15" title="Limitation of Liability">
            <P>To the fullest extent permitted by law:</P>
            <Bullets
              items={[
                "The Company shall not be liable for indirect, incidental, or consequential damages",
                "Liability shall not exceed the amount paid by the User",
                "The Company is not responsible for data loss, interruptions, or third-party failures",
              ]}
            />
          </Section>

          <Section number="16" title="Termination">
            <P>
              The Company reserves the right to suspend or terminate User accounts without prior
              notice for:
            </P>
            <Bullets
              items={[
                "Breach of Terms",
                "Fraudulent or suspicious activity",
                "Unauthorized Content usage",
              ]}
            />
            <P>
              <strong>No refunds shall be issued upon termination.</strong>
            </P>
          </Section>

          <Section number="17" title="Promotions and Abuse">
            <P>Promotional offers are subject to change.</P>
            <P>Any misuse, including:</P>
            <Bullets
              items={["Exploiting loopholes", "Unauthorized use of discount codes"]}
            />
            <P>may result in account suspension.</P>
          </Section>

          <Section number="18" title="Third-Party Services">
            <P>The Platform may integrate third-party services.</P>
            <P>
              The Company is not liable for the actions, policies, or failures of such services.
            </P>
          </Section>

          <Section number="19" title="Force Majeure">
            <P>
              The Company shall not be liable for failure to perform obligations due to events
              beyond its control, including but not limited to:
            </P>
            <Bullets
              items={[
                "Natural disasters",
                "Government actions",
                "Internet or infrastructure failures",
              ]}
            />
          </Section>

          <Section number="20" title="Indemnification">
            <P>
              You agree to indemnify and hold harmless the Company against any claims, damages, or
              liabilities arising from:
            </P>
            <Bullets
              items={[
                "Violation of these Terms",
                "Misuse of the Platform",
                "Infringement of intellectual property",
              ]}
            />
          </Section>

          <Section number="21" title="Modification of Terms">
            <P>The Company reserves the right to amend these Terms at any time.</P>
            <P>Continued use constitutes acceptance of revised Terms.</P>
          </Section>

          <Section number="22" title="Governing Law and Jurisdiction">
            <P>These Terms shall be governed by the laws of India.</P>
            <P>
              All disputes shall be subject to the exclusive jurisdiction of courts located in
              Punjab, India.
            </P>
          </Section>

          <Section number="23" title="Severability">
            <P>
              If any provision is deemed invalid, the remaining provisions shall remain in full
              force and effect.
            </P>
          </Section>

          <Section number="24" title="Entire Agreement">
            <P>These Terms constitute the entire agreement between the User and the Company.</P>
          </Section>

          <Section number="25" title="Contact Information">
            <P>For any queries:</P>
            <a
              href="mailto:bigielts@gmail.com"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              <Mail className="h-4 w-4" /> bigielts@gmail.com
            </a>
          </Section>

          {/* Legal Disclaimer Header */}
          <div className="mt-20 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Legal Disclaimer & Policy
              </h2>
            </div>
            <p className="mt-3 text-sm font-medium text-foreground/70">
              The following provisions form an integral part of these Terms and apply with full
              legal force.
            </p>
          </div>

          <Section number="26" title="Anti-Piracy Legal Notice and Enforcement">
            <SubTitle>26.1 Ownership and Protection of Content</SubTitle>
            <P>
              All Content made available on the Platform, including but not limited to eBooks, PDFs,
              study materials, compilations, designs, layouts, and proprietary educational
              resources, constitutes the intellectual property of{" "}
              <strong>Skyspire Academy Private Limited</strong> and is protected under applicable
              copyright, intellectual property, and information technology laws in India and
              internationally.
            </P>
            <P>
              Any unauthorized access, use, reproduction, distribution, or exploitation of such
              Content shall be deemed a material breach of these Terms and a violation of applicable
              law.
            </P>

            <SubTitle>26.2 Zero-Tolerance Policy</SubTitle>
            <P>
              The Company enforces a strict <strong>zero-tolerance policy</strong> against piracy,
              infringement, and unauthorized dissemination of Content.
            </P>
            <P>Users are strictly prohibited from:</P>
            <Bullets
              items={[
                "Sharing purchased or accessed Content with any third party",
                "Uploading Content to any digital or physical medium, including but not limited to cloud storage platforms, messaging applications, forums, or websites",
                "Selling, sublicensing, or redistributing Content in any form",
                "Reproducing, modifying, reverse-engineering, or extracting Content",
                "Allowing multiple individuals to access a single User Account",
              ]}
            />
            <Callout icon={ShieldAlert}>
              No exceptions, defenses, or justifications shall be accepted for violations of this
              clause.
            </Callout>

            <SubTitle>26.3 Monitoring, Detection, and Tracking Mechanisms</SubTitle>
            <P>
              The Company reserves the right to implement and utilize advanced monitoring systems,
              including but not limited to:
            </P>
            <Bullets
              items={[
                "Digital watermarking and embedded identifiers",
                "Content fingerprinting technologies",
                "IP address logging and geolocation tracking",
                "Device recognition and session monitoring",
                "Behavioral analytics and anomaly detection",
              ]}
            />
            <P>
              Users expressly acknowledge and consent to such monitoring for the purpose of
              protecting intellectual property rights.
            </P>
            <P>
              The Company may embed unique identifiers within Content that enable tracing of
              unauthorized distribution back to the originating User Account.
            </P>

            <SubTitle>26.4 Immediate Enforcement Actions</SubTitle>
            <P>In the event of suspected or confirmed violation of this Clause:</P>
            <P>The Company shall have the unrestricted right to:</P>
            <Bullets
              items={[
                "Suspend or permanently terminate the User Account without prior notice",
                "Revoke all access to purchased or subscribed Content",
                "Block associated devices, IP addresses, or identifiers",
                "Preserve and document evidence of infringement",
              ]}
            />
            <P>
              Such actions may be undertaken immediately and without obligation to provide
              explanation or prior warning.
            </P>

            <SubTitle>26.5 Legal Proceedings and Remedies</SubTitle>
            <P>
              The Company reserves the right to initiate civil and/or criminal proceedings against
              any User engaged in piracy or unauthorized use.
            </P>
            <P>Such proceedings may include, but are not limited to:</P>
            <Numbered
              items={[
                "Filing complaints under the Indian Copyright Act, 1957",
                "Initiating action under the Information Technology Act, 2000",
                "Seeking injunctive relief to restrain further infringement",
                "Pursuing claims for damages, including compensatory, statutory, and punitive damages",
              ]}
            />
            <P>
              Users acknowledge that infringement may result in legal liability extending beyond
              contractual breach.
            </P>

            <SubTitle>26.6 Financial Liability and Damages</SubTitle>
            <P>Users found to be in violation of this Clause shall be liable for:</P>
            <Bullets
              items={[
                "Direct and indirect financial losses suffered by the Company",
                "Legal costs, including attorney fees and litigation expenses",
                "Compensation for reputational and commercial harm",
              ]}
            />
            <P>
              The Company reserves the right to quantify and recover such damages to the fullest
              extent permitted by law.
            </P>

            <SubTitle>26.7 Criminal Liability</SubTitle>
            <P>
              Unauthorized distribution, reproduction, or commercial exploitation of copyrighted
              Content may constitute a <strong>criminal offense</strong> under applicable laws.
            </P>
            <P>Users acknowledge that such actions may result in:</P>
            <Bullets
              items={[
                "Criminal prosecution",
                "Monetary penalties and fines",
                "Other legal consequences as prescribed under law",
              ]}
            />

            <SubTitle>26.8 No Warning Policy</SubTitle>
            <P>
              The Company operates a strict <strong>no-warning enforcement model</strong>.
            </P>
            <P>Upon detection of any violation:</P>
            <Bullets
              items={[
                "Immediate action may be taken without prior notification",
                "Access may be revoked without opportunity for remedy",
              ]}
            />
            <P>Users waive any claim to prior notice in such circumstances.</P>

            <SubTitle>26.9 User Acknowledgment and Undertaking</SubTitle>
            <P>By accessing or purchasing Content from the Platform, you expressly:</P>
            <Bullets
              items={[
                "Acknowledge the proprietary nature of the Content",
                "Agree not to engage in any form of piracy or unauthorized distribution",
                "Accept full legal responsibility for any breach of this Clause",
                "Consent to monitoring and enforcement measures undertaken by the Company",
              ]}
            />

            <SubTitle>26.10 Reporting Violations</SubTitle>
            <P>
              Users and third parties may report suspected piracy or unauthorized distribution by
              contacting:
            </P>
            <a
              href="mailto:bigielts@gmail.com"
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              <Mail className="h-4 w-4" /> bigielts@gmail.com
            </a>
            <P>
              The Company reserves the right to investigate and take appropriate action based on
              such reports.
            </P>

            <SubTitle>26.11 Survival of Rights</SubTitle>
            <P>
              The provisions of this Clause shall survive termination of the User Account and/or
              cessation of use of the Platform.
            </P>
            <P>
              All rights, remedies, and protections available to the Company under this Clause
              shall remain enforceable indefinitely.
            </P>

            <SubTitle>26.12 Final Legal Notice</SubTitle>
            <Callout icon={ShieldAlert}>
              Users are hereby expressly cautioned that unauthorized use or distribution of Content
              is <strong>not merely a contractual violation</strong> but may constitute a serious
              legal offense.
            </Callout>
            <P>The Company actively enforces its rights.</P>
            <Bullets
              items={[
                "Detection mechanisms are in place.",
                "Legal remedies will be pursued without hesitation.",
              ]}
            />
          </Section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
