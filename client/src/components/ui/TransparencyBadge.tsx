// ⁘[ TRANSPARENCY SCORE BADGE ]⁘

interface Props {
  score: number;
  size?: "sm" | "md";
}

export function TransparencyBadge({ score, size = "md" }: Props) {
  const color =
    score >= 80 ? "text-brand-300 border-brand-500/40 bg-brand-500/15" :
    score >= 50 ? "text-text-muted border-border bg-surface-alt" :
    "text-text-muted/60 border-border/50 bg-surface";

  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${color} ${sizeClass}`}
      title={`Transparency Score: ${score}%`}
    >
      <span className="opacity-70">◈</span>
      {score}%
    </span>
  );
}
