import { ArrowUpRight, Calendar, Lock } from "lucide-react";

type Props = {
  tag: string;
  tagTone?: "blue" | "mint" | "peach" | "lilac";
  type: "Writing Task 1" | "Writing Task 2" | "Speaking Part 1" | "Speaking Part 2" | "Speaking Part 3";
  title: string;
  date: string;
  band?: string;
  locked?: boolean;
};

const toneMap: Record<NonNullable<Props["tagTone"]>, string> = {
  blue: "bg-brand-soft text-brand",
  mint: "bg-mint text-foreground",
  peach: "bg-peach text-foreground",
  lilac: "bg-lilac text-foreground",
};

export function QuestionCard({
  tag,
  tagTone = "blue",
  type,
  title,
  date,
  band = "Band 8.5",
  locked = true,
}: Props) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Tag banner — full-width, prominent */}
      <div className={`flex items-center justify-between px-5 py-3.5 ${toneMap[tagTone]}`}>
        <span className="text-sm font-extrabold uppercase tracking-wide">{tag}</span>
        <span className="rounded-full bg-background/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
          {type}
        </span>
      </div>

      {/* Floating lock badge */}
      {locked && (
        <div className="absolute right-4 top-20 z-10 flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-background/90 shadow-sm backdrop-blur-sm">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      )}
      {!locked && (
        <div className="absolute right-4 top-20 z-10 flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-background/90 shadow-sm backdrop-blur-sm transition-all group-hover:bg-brand group-hover:text-brand-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 pb-8">
        <h3 className="font-display text-xl font-extrabold leading-snug tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      {/* Pastel-blue dual-tab footer */}
      <div className="mt-auto flex w-full">
        <div className="flex-1 border-r border-sky-200/60 bg-[#e0f2fe] py-4 text-center">
          <span className="font-display text-[13px] font-extrabold tracking-tight text-[#0c4a6e]">
            {date}
          </span>
        </div>
        <div className="flex-1 bg-[#e0f2fe] py-4 text-center">
          <span className="font-display text-[13px] font-extrabold tracking-tight text-[#0c4a6e]">
            {band}
          </span>
        </div>
      </div>
    </article>
  );
}
