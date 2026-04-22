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

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-display text-xl font-extrabold leading-snug tracking-tight text-foreground">
          {title}
        </h3>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {date}
            <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-secondary-foreground">
              {band}
            </span>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-all group-hover:bg-brand group-hover:text-brand-foreground">
            {locked ? <Lock className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-4 w-4" />}
          </span>
        </div>
      </div>
    </article>
  );
}
