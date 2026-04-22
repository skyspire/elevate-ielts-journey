export function ValueStatement() {
  return (
    <section className="bg-white py-24 sm:py-36">
      <div className="container-page">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <span className="text-[oklch(0.55_0.18_30)]">One</span>{" "}
            <span className="text-foreground">Subscription.</span>
            <br />
            <span className="text-[oklch(0.45_0.18_265)]">Unlimited</span>{" "}
            <span className="text-foreground">Access.</span>
          </h2>

          {/* Tagline pill */}
          <div className="mt-8 flex justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2 font-display text-sm font-bold tracking-wide sm:text-base"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.97 0.04 30 / 0.6) 0%, oklch(0.96 0.04 265 / 0.6) 100%)",
                borderColor: "oklch(0.85 0.06 45)",
              }}
            >
              <span className="text-[oklch(0.55_0.18_30)]">IELTS Academic</span>
              <span className="text-foreground/40">+</span>
              <span className="text-[oklch(0.45_0.18_265)]">IELTS General</span>
              <span className="text-foreground/60">— full access, one plan</span>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-foreground/60 sm:text-lg">
            Hundreds of{" "}
            <span className="font-bold text-[oklch(0.55_0.18_30)]">recent</span>{" "}
            IELTS Writing and Speaking questions with{" "}
            <span className="font-bold text-[oklch(0.45_0.18_265)]">
              Band 8–9
            </span>{" "}
            sample answers and{" "}
            <span className="font-bold text-foreground">vocabulary support</span>{" "}
            — all in one place.
          </p>
        </div>
      </div>
    </section>
  );
}
