// Warm, green + bluish lead-magnet section: free e-book in exchange for contact details.
// - Book mockup on the left, form on the right.
// - No dark colors per project preference; soft mint/sky gradient + emerald CTA.
// - Persists leads to localStorage via lib/ebook-leads.

import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { saveLead, markClaimed, hasClaimedFreeEbook } from "@/lib/ebook-leads";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 IN +91" },
  { code: "+44", label: "🇬🇧 UK +44" },
  { code: "+1", label: "🇺🇸 US +1" },
  { code: "+61", label: "🇦🇺 AU +61" },
  { code: "+1c", label: "🇨🇦 CA +1" },
  { code: "+971", label: "🇦🇪 AE +971" },
  { code: "+966", label: "🇸🇦 SA +966" },
  { code: "+92", label: "🇵🇰 PK +92" },
  { code: "+880", label: "🇧🇩 BD +880" },
  { code: "+977", label: "🇳🇵 NP +977" },
  { code: "+94", label: "🇱🇰 LK +94" },
  { code: "+234", label: "🇳🇬 NG +234" },
  { code: "+27", label: "🇿🇦 ZA +27" },
  { code: "+86", label: "🇨🇳 CN +86" },
  { code: "+49", label: "🇩🇪 DE +49" },
  { code: "+33", label: "🇫🇷 FR +33" },
];

const BANDS = ["6.0", "6.5", "7.0", "7.5", "8.0", "8.5+"];

type Variant = "default" | "compact";

export function FreeEbookCta({ variant = "default" }: { variant?: Variant }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cc, setCc] = useState("+91");
  const [phone, setPhone] = useState("");
  const [band, setBand] = useState("7.0");
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(() => hasClaimedFreeEbook());

  const isCompact = variant === "compact";

  const canSubmit = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const phoneOk = phone.replace(/\D/g, "").length >= 6;
    return name.trim().length >= 2 && emailOk && phoneOk;
  }, [name, email, phone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      saveLead({
        name: name.trim(),
        email: email.trim(),
        countryCode: cc.replace(/c$/, ""),
        phone: phone.trim(),
        whatsappOptIn,
        targetBand: band,
      });
      markClaimed();
      setDone(true);
      setSubmitting(false);
      toast.success("Your free e-book is on the way!", {
        description: `We just sent the download link to ${email.trim()}.`,
      });
    }, 500);
  };

  return (
    <section
      aria-label="Free IELTS e-book"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.97 0.04 175) 0%, oklch(0.96 0.045 210) 55%, oklch(0.95 0.05 165) 100%)",
      }}
    >
      {/* Soft blurred orbs for warm atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.92 0.12 175 / 0.55), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.9 0.13 215 / 0.55), transparent 65%)" }}
      />
      {/* Hairline top + bottom for clean separation */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "oklch(0.86 0.04 195 / 0.6)" }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "oklch(0.86 0.04 195 / 0.6)" }} />

      <div className={`container-page relative ${isCompact ? "py-12" : "py-20 md:py-24"}`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* LEFT — Book mockup */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative">
              {/* eyebrow chip-free badge using underline + dot */}
              <div
                className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: "oklch(0.42 0.13 175)" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Free download · No credit card
              </div>

              {/* Book cover mockup */}
              <div className="relative mx-auto" style={{ width: 280, maxWidth: "100%" }}>
                {/* Shadow / desk surface */}
                <div
                  aria-hidden
                  className="absolute -bottom-6 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-full blur-2xl"
                  style={{ background: "oklch(0.55 0.08 200 / 0.35)" }}
                />
                {/* Back stack */}
                <div
                  aria-hidden
                  className="absolute -right-3 top-3 h-full w-full rounded-r-md rounded-l-sm"
                  style={{
                    background: "oklch(0.86 0.07 200)",
                    transform: "rotate(2.5deg)",
                    boxShadow: "0 20px 40px -20px oklch(0.4 0.08 200 / 0.45)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute -left-3 top-1 h-full w-full rounded-l-md rounded-r-sm"
                  style={{
                    background: "oklch(0.9 0.07 165)",
                    transform: "rotate(-2deg)",
                    boxShadow: "0 20px 40px -20px oklch(0.4 0.08 175 / 0.45)",
                  }}
                />
                {/* Front cover */}
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-l-sm rounded-r-md"
                  style={{
                    background:
                      "linear-gradient(160deg, oklch(0.55 0.13 195) 0%, oklch(0.45 0.14 175) 60%, oklch(0.4 0.12 210) 100%)",
                    boxShadow:
                      "0 30px 60px -25px oklch(0.3 0.08 200 / 0.55), inset 4px 0 0 0 oklch(1 0 0 / 0.12), inset -1px 0 0 0 oklch(0 0 0 / 0.15)",
                  }}
                >
                  {/* Spine highlight */}
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-2"
                    style={{
                      background:
                        "linear-gradient(to right, oklch(0 0 0 / 0.22), oklch(1 0 0 / 0.18), transparent)",
                    }}
                  />
                  {/* Gloss */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 30%, oklch(1 0 0 / 0.14) 45%, transparent 60%)",
                    }}
                  />

                  {/* Cover content */}
                  <div className="relative flex h-full flex-col justify-between p-6 text-white">
                    <div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-[0.3em]"
                        style={{ color: "oklch(0.95 0.06 180)" }}
                      >
                        BigIELTS · Free Guide
                      </div>
                      <div className="mt-1 h-px w-10" style={{ background: "oklch(0.95 0.06 180 / 0.7)" }} />
                    </div>

                    <div>
                      <h3
                        className="font-display text-3xl font-extrabold leading-[1.05]"
                        style={{ letterSpacing: "-0.01em" }}
                      >
                        The IELTS<br />Band 8<br />Blueprint
                      </h3>
                      <p
                        className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em]"
                        style={{ color: "oklch(0.95 0.06 180 / 0.85)" }}
                      >
                        Writing · Speaking · Strategy
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <BookOpen className="h-5 w-5 opacity-80" />
                      <div
                        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: "oklch(0.95 0.06 180 / 0.85)" }}
                      >
                        96 pages · PDF
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust line under book */}
              <div
                className="mt-10 flex items-center gap-2 text-sm font-medium"
                style={{ color: "oklch(0.36 0.06 200)" }}
              >
                <CheckCircle2 className="h-4 w-4" style={{ color: "oklch(0.55 0.15 165)" }} />
                Downloaded by 42,000+ test-takers this year
              </div>
            </div>
          </div>

          {/* RIGHT — Headline + form */}
          <div>
            <h2
              className="font-display text-3xl font-extrabold leading-[1.1] md:text-[2.6rem]"
              style={{ color: "oklch(0.22 0.05 210)", letterSpacing: "-0.015em" }}
            >
              Get the <span style={{ color: "oklch(0.48 0.14 175)" }}>Band 8 Blueprint</span>
              <br />
              — free, today.
            </h2>
            <p
              className="mt-4 max-w-lg text-base leading-relaxed"
              style={{ color: "oklch(0.4 0.04 215)" }}
            >
              A 96-page playbook written by our IELTS specialists. Real Task 1 &amp; Task 2 templates,
              speaking part 2 frameworks, and the exact vocabulary that scores Band 8+.
            </p>

            {done ? (
              <div
                className="mt-8 rounded-2xl border bg-white/80 p-6 shadow-sm backdrop-blur"
                style={{ borderColor: "oklch(0.85 0.06 175 / 0.6)" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                    style={{ background: "oklch(0.55 0.15 165)", color: "white" }}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold" style={{ color: "oklch(0.22 0.05 210)" }}>
                      Check your inbox.
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "oklch(0.4 0.04 215)" }}>
                      Your free copy of <span className="font-semibold">The IELTS Band 8 Blueprint</span> is on
                      its way. Make sure to whitelist us so it doesn't land in spam.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDone(false)}
                      className="mt-3 text-xs font-bold uppercase tracking-wider underline"
                      style={{ color: "oklch(0.48 0.14 175)" }}
                    >
                      Send to another email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-2xl border bg-white/85 p-6 shadow-[0_30px_60px_-30px_oklch(0.4_0.08_200/0.4)] backdrop-blur"
                style={{ borderColor: "oklch(0.86 0.05 190 / 0.6)" }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="fe-name" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.36 0.06 200)" }}>
                      Full name
                    </Label>
                    <Input
                      id="fe-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Priya Ramaswamy"
                      autoComplete="name"
                      required
                      className="mt-1.5 h-11 border-[oklch(0.86_0.04_190)] bg-white focus-visible:ring-[oklch(0.55_0.13_175)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="fe-email" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.36 0.06 200)" }}>
                      Email address
                    </Label>
                    <Input
                      id="fe-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="mt-1.5 h-11 border-[oklch(0.86_0.04_190)] bg-white focus-visible:ring-[oklch(0.55_0.13_175)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.36 0.06 200)" }}>
                      WhatsApp / mobile number
                    </Label>
                    <div className="mt-1.5 flex gap-2">
                      <Select value={cc} onValueChange={setCc}>
                        <SelectTrigger className="h-11 w-[130px] border-[oklch(0.86_0.04_190)] bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        autoComplete="tel"
                        required
                        className="h-11 flex-1 border-[oklch(0.86_0.04_190)] bg-white focus-visible:ring-[oklch(0.55_0.13_175)]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.36 0.06 200)" }}>
                      Your target band
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {BANDS.map((b) => {
                        const active = band === b;
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBand(b)}
                            className="rounded-full border px-3.5 py-1.5 text-sm font-semibold transition"
                            style={
                              active
                                ? {
                                    background: "oklch(0.48 0.14 175)",
                                    color: "white",
                                    borderColor: "oklch(0.48 0.14 175)",
                                  }
                                : {
                                    background: "white",
                                    color: "oklch(0.36 0.06 200)",
                                    borderColor: "oklch(0.86 0.05 190)",
                                  }
                            }
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm" style={{ color: "oklch(0.36 0.06 200)" }}>
                  <input
                    type="checkbox"
                    checked={whatsappOptIn}
                    onChange={(e) => setWhatsappOptIn(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[oklch(0.7_0.04_200)] accent-[oklch(0.48_0.14_175)]"
                  />
                  <span className="leading-snug">
                    Send me weekly band-boosting tips on WhatsApp. I can unsubscribe any time.
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="mt-5 h-12 w-full text-[15px] font-semibold text-white shadow-lg transition hover:opacity-95"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.15 165) 0%, oklch(0.5 0.14 195) 100%)",
                    boxShadow: "0 18px 35px -15px oklch(0.45 0.14 180 / 0.6)",
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {submitting ? "Preparing your e-book…" : "Send me the free e-book"}
                </Button>

                <p
                  className="mt-3 text-center text-[11px]"
                  style={{ color: "oklch(0.5 0.03 215)" }}
                >
                  We respect your privacy. No spam, ever. Unsubscribe with one click.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
