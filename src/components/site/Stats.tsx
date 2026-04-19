import { PenLine, Mic, BookOpen, Users } from "lucide-react";
import { WashiTape } from "./PaperAccents";

const stats = [
  { value: "1300+", label: "Writing Questions", icon: <PenLine className="h-5 w-5" /> },
  { value: "4500+", label: "Speaking Questions", icon: <Mic className="h-5 w-5" /> },
  { value: "170+", label: "Cue Cards", icon: <BookOpen className="h-5 w-5" /> },
  { value: "4000+", label: "Active Users", icon: <Users className="h-5 w-5" /> },
];

export function Stats() {
  return (
    <section className="relative bg-paper-white py-20 sm:py-28">
      <WashiTape position="top-left" color="mint" />
      <WashiTape position="top-right" color="peach" />
      <div className="container-page">
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                {s.icon}
              </span>
              <div className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <WashiTape position="bottom-left" color="lilac" />
      <WashiTape position="bottom-right" color="kraft" />
    </section>
  );
}
