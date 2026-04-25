// ⁘[ RATING STARS ]⁘

interface Props {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  onChange?: (value: number) => void;
}

const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };

export function Rating({ value, max = 5, size = "md", onChange }: Props) {
  return (
    <div className="flex gap-1" role="group" aria-label={`Rating: ${value} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < value;
        return (
          <button
            key={i}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(i + 1)}
            className={`${sizes[size]} transition-colors duration-150 ${
              onChange ? "cursor-pointer hover:text-brand-300" : "cursor-default"
            } ${filled ? "text-brand-500" : "text-text-muted/30"}`}
            aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
