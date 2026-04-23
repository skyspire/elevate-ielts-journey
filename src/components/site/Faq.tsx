import { useState } from "react";
import { Plus } from "lucide-react";
import { useCmsSection } from "@/lib/admin/cms-store";
import { FAQ_KEY, FAQ_DEFAULT } from "@/lib/admin/defaults";

/**
 * Faq — editorial accordion. Big questions, generous spacing, no pills.
 */

export function Faq() {
  const { items: faqs } = useCmsSection(FAQ_KEY, FAQ_DEFAULT);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden bg-paper-white py-24 sm:py-32">
      {/* faint warm corner wash so it doesn't feel sterile */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 100% 0%, oklch(0.97 0.025 75 / 0.6), transparent 55%)," +
            "radial-gradient(ellipse at 0% 100%, oklch(0.96 0.03 250 / 0.5), transparent 55%)",
        }}
      />

      <div className="container-page relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Left — headline */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-3xl font-black leading-[1.02] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Questions
              <br />
              we hear
              <br />
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute inset-x-[-8px] bottom-2 -z-0 h-[28%] -rotate-1 rounded-sm"
                  style={{
                    background:
                      "linear-gradient(120deg, oklch(0.88 0.14 145 / 0.65), oklch(0.9 0.12 175 / 0.6))",
                  }}
                />
                <span className="relative z-10">every day.</span>
              </span>
            </h2>
            <p className="mt-5 max-w-md font-display text-base font-medium leading-relaxed text-foreground/65 sm:text-lg">
              Real answers, written plainly. If something here isn't covered,
              email us — a human replies.
            </p>
          </div>

          {/* Right — accordion */}
          <div>
            <ul className="border-t border-foreground/15">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                const lines = f.a.split("\n").map((l) => l.trim()).filter(Boolean);
                const lead = lines.find((l) => !l.startsWith("- ")) ?? "";
                const bullets = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
                return (
                  <li
                    key={f.q}
                    className="border-b border-foreground/15"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-base font-extrabold leading-snug tracking-tight text-foreground sm:text-lg">
                        {f.q}
                      </span>
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-foreground bg-foreground text-background"
                            : "border-foreground/25 bg-background text-foreground/70 group-hover:border-foreground group-hover:text-foreground"
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    </button>
                    <div
                      className="grid overflow-hidden transition-[grid-template-rows] duration-400 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                      }}
                    >
                      <div className="min-h-0">
                        <div className="pb-5 pr-12">
                          {lead && (
                            <p className="border-l-2 border-foreground/80 pl-4 font-display text-sm font-semibold leading-relaxed text-foreground sm:text-base">
                              {lead}
                            </p>
                          )}
                          {bullets.length > 0 && (
                            <ul className="mt-4 space-y-2 pl-4">
                              {bullets.map((b) => (
                                <li
                                  key={b}
                                  className="flex gap-3 font-display text-sm font-medium leading-relaxed text-foreground/70"
                                >
                                  <span
                                    aria-hidden
                                    className="mt-[0.65rem] h-px w-3 shrink-0 bg-foreground/40"
                                  />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
