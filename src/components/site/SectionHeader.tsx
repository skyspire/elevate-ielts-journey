type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "center" }: Props) {
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base font-medium text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}
