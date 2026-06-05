import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface StatTrackerProps {
  label: string;
  current: number;
  max: number;
  onChange: (value: number) => void;
  variant?: "circle" | "square" | "diamond";
  type?: "hp" | "stress" | "hope" | "armor";
  className?: string;
}

function typeSlotClass(type: StatTrackerProps["type"]): string {
  if (type === "hp") return "hp-slot";
  if (type === "stress") return "stress-slot";
  if (type === "hope") return "hope-slot";
  return "";
}

export function StatTracker({
  label,
  current,
  max,
  onChange,
  variant = "circle",
  type,
  className,
}: StatTrackerProps) {
  const slotTypeClass = typeSlotClass(type);
  function handleSlotClick(slotIndex: number) {
    const slotValue = slotIndex + 1;
    if (current === slotValue) {
      onChange(slotValue - 1);
    } else {
      onChange(slotValue);
    }
  }

  if (variant === "diamond") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="flex items-center justify-between">
          <span className="tracker-label text-sm text-foreground">
            {label} {current}/{max}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              data-ocid={`tracker.${label.toLowerCase().replace(/\s+/g, "_")}.decrease`}
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => onChange(Math.max(0, current - 1))}
              disabled={current <= 0}
              aria-label={`Decrease ${label}`}
            >
              <Minus className="size-3" />
            </Button>
            <Button
              type="button"
              data-ocid={`tracker.${label.toLowerCase().replace(/\s+/g, "_")}.increase`}
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => onChange(Math.min(max, current + 1))}
              disabled={current >= max}
              aria-label={`Increase ${label}`}
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>
        <div className="stat-tracker">
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={`${label}-slot-${i}`}
              data-ocid={`tracker.${label.toLowerCase().replace(/\s+/g, "_")}.slot.${i + 1}`}
              className={cn(
                "stat-slot",
                variant,
                slotTypeClass,
                i < current ? "filled" : "empty",
              )}
              aria-label={`${label} slot ${i + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <span className="tracker-label text-sm text-foreground">
          {label} {current}/{max}
        </span>
      </div>
      <div className="stat-tracker">
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={`${label}-slot-${i}`}
            type="button"
            data-ocid={`tracker.${label.toLowerCase().replace(/\s+/g, "_")}.slot.${i + 1}`}
            className={cn(
              "stat-slot",
              variant,
              slotTypeClass,
              i < current ? "filled" : "empty",
            )}
            onClick={() => handleSlotClick(i)}
            aria-label={`${label} slot ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
