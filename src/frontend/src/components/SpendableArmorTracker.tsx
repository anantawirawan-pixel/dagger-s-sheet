import { useClickSound } from "@/hooks/useClickSound";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  max?: number;
  onChange: (newValue: number) => void;
}

function ShieldIcon({ value }: { value: number }) {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="64"
        height="72"
        viewBox="0 0 64 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="drop-shadow-[0_0_8px_oklch(0.72_0.17_70/0.7)]"
      >
        {/* Shield body */}
        <path
          d="M32 4 L60 14 L60 34 C60 52 44 64 32 70 C20 64 4 52 4 34 L4 14 Z"
          fill="oklch(0.22 0.02 50)"
          stroke="oklch(0.72 0.17 70)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner ornamental edge */}
        <path
          d="M32 10 L54 18 L54 34 C54 49 40 60 32 65 C24 60 10 49 10 34 L10 18 Z"
          fill="none"
          stroke="oklch(0.72 0.17 70 / 0.35)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Top center knot */}
        <circle
          cx="32"
          cy="14"
          r="3"
          fill="oklch(0.72 0.17 70)"
          opacity="0.7"
        />
      </svg>
      {/* Value label centered on shield */}
      <span
        className="absolute font-display font-bold text-xl leading-none"
        style={{
          color: "oklch(0.92 0.01 60)",
          textShadow: "0 1px 4px oklch(0 0 0 / 0.6)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function SpendableArmorTracker({ value, max = 6, onChange }: Props) {
  const { play } = useClickSound();

  function handleDecrease() {
    if (value <= 0) return;
    play("armor");
    onChange(value - 1);
  }

  function handleIncrease() {
    if (value >= max) return;
    play("armor");
    onChange(value + 1);
  }

  return (
    <div
      data-ocid="armor_spend.section"
      className="flex flex-col items-center gap-2"
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        Armor Score
      </span>

      <div className="flex items-center gap-3">
        {/* Minus button */}
        <button
          type="button"
          data-ocid="armor_spend.decrease_button"
          onClick={handleDecrease}
          disabled={value <= 0}
          aria-label="Decrease armor score"
          className={cn(
            "size-8 rounded-full border flex items-center justify-center",
            "font-bold text-lg leading-none transition-all duration-200",
            "border-border bg-card/60 text-foreground",
            "hover:border-primary/60 hover:bg-primary/10 hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:opacity-30 disabled:cursor-not-allowed",
          )}
        >
          −
        </button>

        {/* Shield */}
        <ShieldIcon value={value} />

        {/* Plus button */}
        <button
          type="button"
          data-ocid="armor_spend.increase_button"
          onClick={handleIncrease}
          disabled={value >= max}
          aria-label="Increase armor score"
          className={cn(
            "size-8 rounded-full border flex items-center justify-center",
            "font-bold text-lg leading-none transition-all duration-200",
            "border-border bg-card/60 text-foreground",
            "hover:border-primary/60 hover:bg-primary/10 hover:text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:opacity-30 disabled:cursor-not-allowed",
          )}
        >
          +
        </button>
      </div>

      {/* Pip row */}
      <div
        data-ocid="armor_spend.pips"
        className="flex items-center gap-1.5"
        aria-label={`Armor score ${value} of ${max}`}
      >
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={`armor-pip-${i}`}
            type="button"
            data-ocid={`armor_spend.pip.${i + 1}`}
            onClick={() => {
              const next = i < value ? i : i + 1;
              play("armor");
              onChange(next);
            }}
            aria-label={`Set armor score to ${i + 1}`}
            className={cn(
              "size-3 rounded-full border transition-all duration-200",
              i < value
                ? "bg-primary border-primary shadow-[0_0_5px_1px_oklch(0.72_0.17_70/0.5)]"
                : "bg-transparent border-border hover:border-primary/50",
            )}
          />
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground">
        {value} / {max}
      </p>
    </div>
  );
}
