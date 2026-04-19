type Props = {
  used?: number;
  total?: number;
  label?: string;
};

/**
 * Subtle quota indicator. Prototype: signed-out users see "Sign up · 3 free".
 * Once auth is wired, swap `used`/`total` from the user's session.
 */
export function FreeQuotaBadge({ used = 0, total = 3, label = "free samples" }: Props) {
  const remaining = Math.max(0, total - used);
  return (
    <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-bold text-muted-foreground md:flex">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      <span>
        {remaining} of {total} {label} left
      </span>
    </div>
  );
}
