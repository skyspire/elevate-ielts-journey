import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Lock, Mail, ShieldCheck, FileWarning } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — BigIELTS" },
      {
        name: "description",
        content:
          "Learn how BigIELTS.com collects, uses, stores, and protects your personal information.",
      },
      { property: "og:title", content: "Privacy Policy — BigIELTS" },
      {
        property: "og:description",
        content:
          "Privacy practices for BigIELTS.com — data collection, processing, retention, security, and user rights.",
      },
    ],
  }),
  component: PrivacyPage,
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
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 flex gap-3 rounded-xl border border-brand/30 bg-brand-soft p-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
      <div className="text-sm font-medium leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

function MailLink() {
  return (
    <a
      href="mailto:bigielts@gmail.com"
      className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
    >
      <Mail className="h-4 w-4" />
      <span>bigielts@gmail.com</span>
    </a>
  );
}

/* ----------------------------- Page ----------------------------- */

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-page py-16 sm:py-20">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            <Lock className="h-3.5 w-3.5" /> Privacy
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base font-medium text-muted-foreground sm:text-lg">
            Effective Date: <span className="text-foreground">Apr 22, 2026</span> · Website:{" "}
            <span className="text-foreground">BigIELTS.com</span>
          </p>
        </div>

        {/* Content */}
        <article className="mx-auto mt-14 max-w-3xl">
          <Section number="1" title="Introduction">
            <P>
              This Privacy Policy (“Policy”) describes how{" "}
              <strong>Skyspire Academy Private Limited</strong> (“Company”, “we”, “us”, or “our”)
              collects, uses, processes, stores, and protects personal information of users (“User”,
              “you”, “your”) when accessing or using <strong>BigIELTS.com</strong> (the “Platform”).
            </P>
            <P>
              By accessing or using the Platform, you acknowledge that you have read, understood,
              and agreed to this Policy.
            </P>
          </Section>

          <Section number="2" title="Scope of Policy">
            <P>
              This Policy applies to all users of the Platform, including visitors, registered
              users, and subscribers, and governs all personal data collected through website usage,
              account creation, and transactions.
            </P>
          </Section>

          <Section number="3" title="Information We Collect">
            <SubTitle>3.1 Personal Information</SubTitle>
            <P>We may collect:</P>
            <Bullets
              items={[
                "Full name",
                "Email address",
                "Account login credentials",
                "Any information provided through communication with us",
              ]}
            />

            <SubTitle>3.2 Technical Information</SubTitle>
            <P>We may automatically collect:</P>
            <Bullets
              items={[
                "IP address",
                "Device and browser information",
                "Operating system",
                "Pages visited and session activity",
                "Login timestamps and usage patterns",
              ]}
            />

            <SubTitle>3.3 Payment Information</SubTitle>
            <P>
              Payments are processed through secure third-party payment gateways (e.g.,{" "}
              <strong>Razorpay</strong>).
            </P>
            <Callout icon={ShieldCheck}>
              We do not store full credit/debit card or banking details.
            </Callout>
          </Section>

          <Section number="4" title="Purpose of Data Collection">
            <P>We collect and use information for:</P>
            <Bullets
              items={[
                "Creating and managing user accounts",
                "Providing access to purchased or subscribed content",
                "Processing payments and subscriptions",
                "Communicating service updates and support responses",
                "Preventing fraud, piracy, and unauthorized access",
                "Improving Platform performance and user experience",
                "Complying with legal obligations",
              ]}
            />
          </Section>

          <Section number="5" title="Legal Basis for Processing">
            <P>We process your data based on:</P>
            <Bullets
              items={[
                "Your consent",
                "Contractual necessity",
                "Legal compliance",
                "Legitimate business interests including security and fraud prevention",
              ]}
            />
          </Section>

          <Section number="6" title="Consent and Withdrawal">
            <P>
              By using the Platform, you consent to the collection and processing of your data as
              described in this Policy.
            </P>
            <P>
              You may withdraw consent at any time by contacting us at <MailLink />, but such
              withdrawal may limit or restrict access to certain Services.
            </P>
          </Section>

          <Section number="7" title="Data Sharing and Disclosure">
            <P>
              <strong>We do not sell, rent, or trade personal data.</strong>
            </P>
            <P>We may share data only in the following cases:</P>

            <SubTitle>7.1 Service Providers</SubTitle>
            <P>Trusted third parties such as:</P>
            <Bullets
              items={[
                "Payment processors (Razorpay)",
                "Hosting providers",
                "Analytics and security tools",
              ]}
            />

            <SubTitle>7.2 Legal Requirements</SubTitle>
            <P>When required by law, regulation, or valid legal request.</P>

            <SubTitle>7.3 Business Changes</SubTitle>
            <P>In case of merger, acquisition, or restructuring.</P>
          </Section>

          <Section number="8" title="No Sale of Personal Data">
            <P>
              The Company does not sell, rent, or trade user personal data for commercial purposes.
            </P>
          </Section>

          <Section number="9" title="Data Retention">
            <P>We retain personal data only as long as necessary for:</P>
            <Bullets
              items={[
                "Service provision",
                "Legal compliance",
                "Dispute resolution",
                "Fraud and security protection",
              ]}
            />
            <P>Some data may be retained for statutory or regulatory obligations.</P>
          </Section>

          <Section number="10" title="Account Deletion and Data Erasure">
            <P>
              Users may request deletion of their account by contacting: <MailLink />
            </P>
            <P>We may retain certain data where required for:</P>
            <Bullets
              items={[
                "Legal compliance",
                "Security enforcement",
                "Fraud prevention",
                "Dispute handling",
              ]}
            />
          </Section>

          <Section number="11" title="Data Security">
            <P>We implement reasonable technical and organizational safeguards, including:</P>
            <Bullets
              items={[
                "Secure servers",
                "Access controls",
                "Encryption practices where applicable",
                "Monitoring systems for unauthorized activity",
              ]}
            />
            <Callout icon={FileWarning}>
              However, no digital system is completely secure, and we cannot guarantee absolute
              protection.
            </Callout>
          </Section>

          <Section number="12" title="Data Breach Notification">
            <P>
              In the event of a data breach affecting personal data, we will take reasonable steps
              to:
            </P>
            <Bullets
              items={[
                "Investigate and mitigate the breach",
                "Restore system security",
                "Notify affected users where legally required",
              ]}
            />
          </Section>

          <Section number="13" title="Cookies and Tracking Technologies">
            <P>We use cookies and similar technologies to:</P>
            <Bullets
              items={[
                "Improve user experience",
                "Track platform performance",
                "Analyze user behavior",
              ]}
            />
            <P>Users may disable cookies through browser settings.</P>
          </Section>

          <Section number="14" title="Do Not Track Signals">
            <P>The Platform does not respond to “Do Not Track” browser signals.</P>
          </Section>

          <Section number="15" title="Automated Processing">
            <P>We may use automated systems to:</P>
            <Bullets
              items={[
                "Detect fraud or suspicious activity",
                "Prevent piracy and unauthorized access",
                "Enforce platform security policies",
              ]}
            />
            <P>Such systems may result in account restriction or termination.</P>
          </Section>

          <Section number="16" title="Third-Party Links">
            <P>
              The Platform may contain links to external websites. We are not responsible for their
              privacy practices or content.
            </P>
          </Section>

          <Section number="17" title="Children’s Privacy">
            <P>
              The Platform is not intended for individuals under 18 without supervision. We do not
              knowingly collect data from minors.
            </P>
          </Section>

          <Section number="18" title="International Data Transfer">
            <P>
              If you access the Platform outside India, you acknowledge that your data may be
              transferred to and processed in India.
            </P>
          </Section>

          <Section number="19" title="Grievance Redressal">
            <P>
              In accordance with applicable laws, including the{" "}
              <strong>Information Technology Act, 2000</strong> and rules made thereunder, the
              Company designates the following contact for grievance redressal:
            </P>
            <div className="mt-4 rounded-xl border border-foreground/10 bg-muted/40 p-4 text-base leading-relaxed text-foreground/85">
              <p className="font-semibold text-foreground">
                Grievance Officer / Compliance Contact
              </p>
              <p className="mt-1">Skyspire Academy Private Limited – Compliance Desk</p>
              <p className="mt-2">
                <MailLink />
              </p>
            </div>
            <P>
              The designated contact shall address user grievances, complaints, and concerns within
              a reasonable timeframe as required under applicable law.
            </P>
          </Section>

          <Section number="20" title="Changes to This Policy">
            <P>
              We reserve the right to modify this Policy at any time. Updates will be posted on this
              page with a revised effective date.
            </P>
            <P>Continued use of the Platform constitutes acceptance of the updated Policy.</P>
          </Section>

          <Section number="21" title="Contact Information">
            <P>
              For any questions regarding this Privacy Policy: <MailLink />
            </P>
          </Section>

          {/* Final Statement */}
          <div className="mt-20 rounded-2xl border border-foreground/10 bg-muted/40 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-brand" />
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                Final Statement
              </h2>
            </div>
            <P>
              We treat user data with seriousness and responsibility. While we implement safeguards
              to protect information, users are advised to use the Platform responsibly and maintain
              security of their own credentials.
            </P>
          </div>
        </article>
      </main>

      <Footer variant="light" />
    </div>
  );
}
