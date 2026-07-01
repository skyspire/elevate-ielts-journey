import { Lock } from "lucide-react";

type Props = {
  tag: string;
  type: string;
  title: string;
  date: string;
  band?: string;
  locked?: boolean;
  // Pastel fill palette from parent
  fill?: string;
  accent?: string;
  ink?: string;
  ring?: string;
};

export function QuestionCard({
  tag,
  type,
  title,
  date,
  band = "Band 8.5",
  locked = true,
  fill = "#f5efe2",
  accent = "#e8dcbf",
  ink = "#2a2a2a",
  ring = "#d9c99a",
}: Props) {
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: fill,
        borderColor: ring,
        boxShadow: `0 10px 24px -18px ${ring}`,
      }}
    >
      {/* Tag banner */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ backgroundColor: accent, color: ink }}
      >
        <span className="text-sm font-extrabold uppercase tracking-wide">{tag}</span>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: "rgba(255,255,255,0.55)", color: ink }}
        >
          {type}
        </span>
      </div>

      {locked && (
        <div
          className="absolute right-4 top-20 z-10 flex h-9 w-9 items-center justify-center rounded-2xl border"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            borderColor: ring,
          }}
        >
          <Lock className="h-3.5 w-3.5" style={{ color: ink }} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 pb-8">
        <h3
          className="font-display text-xl font-extrabold leading-snug tracking-tight"
          style={{ color: ink }}
        >
          {title}
        </h3>
      </div>

      {/* Footer split */}
      <div className="mt-auto flex w-full" style={{ backgroundColor: accent }}>
        <div
          className="flex-1 border-r py-4 text-center"
          style={{ borderColor: "rgba(0,0,0,0.08)" }}
        >
          <span
            className="font-display text-[13px] font-extrabold tracking-tight"
            style={{ color: ink }}
          >
            {date}
          </span>
        </div>
        <div className="flex-1 py-4 text-center">
          <span
            className="font-display text-[13px] font-extrabold tracking-tight"
            style={{ color: ink }}
          >
            {band}
          </span>
        </div>
      </div>
    </article>
  );
}
