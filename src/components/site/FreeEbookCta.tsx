// Lead-magnet section with a human, magazine-editorial feel.
// - Real photo flat-lay of the book (replaces fake CSS mockup)
// - Magazine-style headline: tiny uppercase eyebrow + big Playfair serif + italic subhead
// - Handwritten Caveat margin notes ("free!", "start here →") doodled around the form
// - Subtle coffee ring + paper grain on the form card to feel like a real desk
// - Warm green/blue palette per project preference (no dark colors)

import { useMemo, useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
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
import flatlayPhoto from "@/assets/free-ebook-flatlay.jpg";

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

const HANDWRITING = '"Caveat", "Inter", cursive';
const SERIF = '"Playfair Display", Georgia, serif';

// Subtle paper grain — inline SVG so we don't ship another asset.
const PAPER_GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.32  0 0 0 0 0.28  0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>\")";

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
      {/* Paper grain layer over the whole section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{ backgroundImage: PAPER_GRAIN, backgroundSize: "160px 160px" }}
      />
      {/* Warm orbs */}
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
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "oklch(0.86 0.04 195 / 0.6)" }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "oklch(0.86 0.04 195 / 0.6)" }} />

      <div className={`relative ${isCompact ? "" : ""}`}>
        <div className="grid items-stretch lg:grid-cols-2">
          {/* LEFT — Full-bleed photo column, fills full section height */}
          <div
            className="relative min-h-[420px] overflow-hidden lg:min-h-[760px]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.93 0.06 180), oklch(0.9 0.07 210))",
            }}
          >
            <img
              src={flatlayPhoto}
              alt="The IELTS Band 8 Blueprint hardcover book on a warm linen flat-lay with coffee and reading glasses"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Soft edge fade into the form side on large screens */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 lg:block"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.97 0.04 175 / 0.85))",
              }}
            />
            {/* Handwritten note top-left */}
            <div
              className="absolute left-5 top-5 -rotate-[7deg] rounded-md bg-white/85 px-3 py-1.5 text-[1.35rem] leading-none shadow-sm backdrop-blur"
              style={{ fontFamily: HANDWRITING, color: "oklch(0.45 0.14 30)" }}
            >
              psst — it's actually free
            </div>
            {/* Scribbled arrow + caption bottom-right */}
            <div
              className="absolute bottom-6 right-6 flex items-end gap-2 rotate-[4deg] rounded-md bg-white/85 px-3 py-2 shadow-sm backdrop-blur"
              style={{ fontFamily: HANDWRITING, color: "oklch(0.45 0.14 30)" }}
            >
              <svg width="56" height="34" viewBox="0 0 64 40" fill="none" aria-hidden>
                <path
                  d="M2 6 C 18 28, 40 36, 58 30 M50 22 L 58 30 L 50 38"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span className="text-[1.25rem] leading-none">96 pages of band 8+ gold</span>
            </div>
          </div>

          {/* RIGHT — Magazine headline + form */}
          <div
            className={`relative flex items-center px-6 sm:px-10 lg:px-14 ${
              isCompact ? "py-12" : "py-16 md:py-20"
            }`}
          >
            <div className="w-full max-w-xl">

            {/* Eyebrow */}
            <div
              className="mb-3 text-[11px] font-bold uppercase"
              style={{
                letterSpacing: "0.32em",
                color: "oklch(0.45 0.13 175)",
              }}
            >
              Free · Pull-out guide · No.&nbsp;01
            </div>

            {/* Magazine headline (serif) */}
            <h2
              className="text-[2.4rem] leading-[1.02] md:text-[3rem]"
              style={{
                fontFamily: SERIF,
                fontWeight: 800,
                color: "oklch(0.22 0.05 210)",
                letterSpacing: "-0.015em",
              }}
            >
              The Band&nbsp;8{" "}
              <span style={{ position: "relative", color: "oklch(0.42 0.14 180)" }}>
                Blueprint
                {/* hand-drawn underline */}
                <svg
                  aria-hidden
                  viewBox="0 0 220 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full"
                >
                  <path
                    d="M2 9 C 50 2, 120 14, 218 5"
                    fill="none"
                    stroke="oklch(0.55 0.16 30)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              ,
              <br />
              delivered to your inbox.
            </h2>

            {/* Italic subhead */}
            <p
              className="mt-5 max-w-lg text-[1.05rem] italic leading-relaxed"
              style={{
                fontFamily: SERIF,
                color: "oklch(0.36 0.04 215)",
                fontWeight: 400,
              }}
            >
              A 96-page playbook from our IELTS specialists — real Task&nbsp;1 &amp; Task&nbsp;2
              templates, Speaking Part&nbsp;2 frameworks, and the exact vocabulary that scores
              Band&nbsp;8+.
            </p>

            {done ? (
              <div
                className="mt-8 rounded-2xl border bg-white/85 p-6 shadow-sm backdrop-blur"
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
                    <p
                      className="text-xl"
                      style={{ fontFamily: SERIF, fontWeight: 800, color: "oklch(0.22 0.05 210)" }}
                    >
                      Check your inbox.
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "oklch(0.4 0.04 215)" }}>
                      Your free copy of <span className="font-semibold">The IELTS Band 8 Blueprint</span> is
                      on its way. Whitelist us so it doesn't land in spam.
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
              <div className="relative mt-9">
                {/* Margin scribble pointing at the form */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-16 top-3 hidden -rotate-[14deg] text-[1.4rem] leading-none lg:block"
                  style={{ fontFamily: HANDWRITING, color: "oklch(0.45 0.14 30)" }}
                >
                  start
                  <br />
                  here ↓
                </span>

                <form
                  onSubmit={handleSubmit}
                  className="relative rounded-2xl border bg-[oklch(0.99_0.01_90)] p-6 backdrop-blur"
                  style={{
                    borderColor: "oklch(0.86 0.05 190 / 0.7)",
                    boxShadow: "0 30px 60px -30px oklch(0.4 0.08 200 / 0.4)",
                    backgroundImage: PAPER_GRAIN,
                    backgroundBlendMode: "multiply",
                    backgroundSize: "160px 160px",
                  }}
                >
                  {/* Coffee ring — top-right corner of the card */}
                  <svg
                    aria-hidden
                    viewBox="0 0 120 120"
                    className="pointer-events-none absolute -right-4 -top-6 h-24 w-24 opacity-70"
                  >
                    <defs>
                      <radialGradient id="ring" cx="50%" cy="50%" r="50%">
                        <stop offset="78%" stopColor="transparent" />
                        <stop offset="82%" stopColor="oklch(0.5 0.08 60 / 0.55)" />
                        <stop offset="92%" stopColor="oklch(0.45 0.09 55 / 0.35)" />
                        <stop offset="100%" stopColor="transparent" />
                      </radialGradient>
                    </defs>
                    <circle cx="60" cy="60" r="55" fill="url(#ring)" />
                    <path
                      d="M22 60 Q 35 38, 60 36"
                      stroke="oklch(0.45 0.09 55 / 0.4)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label
                        htmlFor="fe-name"
                        className="text-[10px] font-bold"
                        style={{
                          fontFamily: SERIF,
                          color: "oklch(0.32 0.06 200)",
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                        }}
                      >
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
                      <Label
                        htmlFor="fe-email"
                        className="text-[10px] font-bold"
                        style={{
                          fontFamily: SERIF,
                          color: "oklch(0.32 0.06 200)",
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                        }}
                      >
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
                      <Label
                        className="text-[10px] font-bold"
                        style={{
                          fontFamily: SERIF,
                          color: "oklch(0.32 0.06 200)",
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                        }}
                      >
                        WhatsApp / mobile
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
                      <Label
                        className="text-[10px] font-bold"
                        style={{
                          fontFamily: SERIF,
                          color: "oklch(0.32 0.06 200)",
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                        }}
                      >
                        Your target band
                      </Label>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
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
                        <span
                          aria-hidden
                          className="ml-2 -rotate-[6deg] text-[1.1rem] leading-none"
                          style={{ fontFamily: HANDWRITING, color: "oklch(0.45 0.14 30)" }}
                        >
                          ← honest answer please :)
                        </span>
                      </div>
                    </div>
                  </div>

                  <label
                    className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm"
                    style={{ color: "oklch(0.36 0.06 200)" }}
                  >
                    <input
                      type="checkbox"
                      checked={whatsappOptIn}
                      onChange={(e) => setWhatsappOptIn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-[oklch(0.7_0.04_200)] accent-[oklch(0.48_0.14_175)]"
                    />
                    <span className="leading-snug">
                      Send me weekly band-boosting tips on WhatsApp. Unsubscribe any time.
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

                  <p className="mt-3 text-center text-[11px]" style={{ color: "oklch(0.5 0.03 215)" }}>
                    No spam, ever. One-click unsubscribe.
                  </p>
                </form>

                {/* Trust line — handwritten */}
                <p
                  className="mt-5 text-center text-[1.15rem] leading-snug"
                  style={{ fontFamily: HANDWRITING, color: "oklch(0.4 0.08 200)" }}
                >
                  downloaded by <span style={{ color: "oklch(0.45 0.14 30)" }}>42,000+</span>{" "}
                  test-takers this year ✶
                </p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

