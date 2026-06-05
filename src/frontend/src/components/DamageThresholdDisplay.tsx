import { cn } from "@/lib/utils";

interface Props {
  minor: number;
  major: number;
  severe: number;
  currentDamage?: number;
}

function getActiveTier(
  damage: number,
  minor: number,
  major: number,
  severe: number,
): "none" | "minor" | "major" | "severe" {
  if (damage >= severe) return "severe";
  if (damage >= major) return "major";
  if (damage >= minor) return "minor";
  return "none";
}

interface ThresholdBadgeProps {
  label: string;
  value: number;
  isActive: boolean;
  tier: "minor" | "major" | "severe";
  pulseClass: string;
  ocid: string;
}

const TIER_STYLES = {
  minor: {
    border: "3px solid oklch(0.72 0.18 85 / 0.70)",
    activeBorder: "3px solid oklch(0.72 0.18 85 / 1)",
    bg: "linear-gradient(160deg, oklch(0.20 0.04 240 / 0.95) 0%, oklch(0.18 0.05 220 / 0.98) 40%, oklch(0.15 0.06 200 / 1) 100%), repeating-linear-gradient(45deg, transparent, transparent 3px, oklch(0.10 0.03 220 / 0.12) 3px, oklch(0.10 0.03 220 / 0.12) 4px)",
    activeBg:
      "linear-gradient(160deg, oklch(0.25 0.08 85 / 0.30) 0%, oklch(0.18 0.05 220 / 0.95) 100%)",
    ornament: "oklch(0.72 0.18 85 / 0.6)",
    activeOrnament: "oklch(0.72 0.18 85)",
    text: "oklch(0.85 0.15 85)",
    activeText: "oklch(0.92 0.18 85)",
    shadow:
      "0 0 0 1px oklch(0.72 0.18 85 / 0.20), 2px 4px 10px rgba(0,0,0,0.5)",
    activeShadow:
      "0 0 14px oklch(0.72 0.18 85 / 0.50), 0 0 0 1px oklch(0.72 0.18 85 / 0.40), 2px 4px 10px rgba(0,0,0,0.5)",
  },
  major: {
    border: "3px solid oklch(0.65 0.20 42 / 0.70)",
    activeBorder: "3px solid oklch(0.65 0.20 42 / 1)",
    bg: "linear-gradient(160deg, oklch(0.20 0.04 240 / 0.95) 0%, oklch(0.17 0.05 220 / 0.98) 40%, oklch(0.14 0.07 200 / 1) 100%), repeating-linear-gradient(45deg, transparent, transparent 3px, oklch(0.10 0.03 220 / 0.12) 3px, oklch(0.10 0.03 220 / 0.12) 4px)",
    activeBg:
      "linear-gradient(160deg, oklch(0.25 0.10 42 / 0.30) 0%, oklch(0.17 0.05 220 / 0.95) 100%)",
    ornament: "oklch(0.65 0.20 42 / 0.6)",
    activeOrnament: "oklch(0.65 0.20 42)",
    text: "oklch(0.80 0.18 42)",
    activeText: "oklch(0.90 0.20 42)",
    shadow:
      "0 0 0 1px oklch(0.65 0.20 42 / 0.20), 2px 4px 10px rgba(0,0,0,0.5)",
    activeShadow:
      "0 0 14px oklch(0.65 0.20 42 / 0.50), 0 0 0 1px oklch(0.65 0.20 42 / 0.40), 2px 4px 10px rgba(0,0,0,0.5)",
  },
  severe: {
    border: "3px solid oklch(0.55 0.22 22 / 0.70)",
    activeBorder: "3px solid oklch(0.55 0.22 22 / 1)",
    bg: "linear-gradient(160deg, oklch(0.18 0.04 240 / 0.95) 0%, oklch(0.15 0.05 210 / 0.98) 40%, oklch(0.12 0.08 0 / 1) 100%), repeating-linear-gradient(45deg, transparent, transparent 3px, oklch(0.10 0.03 220 / 0.12) 3px, oklch(0.10 0.03 220 / 0.12) 4px)",
    activeBg:
      "linear-gradient(160deg, oklch(0.22 0.12 22 / 0.35) 0%, oklch(0.15 0.05 210 / 0.95) 100%)",
    ornament: "oklch(0.55 0.22 22 / 0.6)",
    activeOrnament: "oklch(0.55 0.22 22)",
    text: "oklch(0.75 0.20 22)",
    activeText: "oklch(0.88 0.22 22)",
    shadow:
      "0 0 0 1px oklch(0.55 0.22 22 / 0.20), 2px 4px 10px rgba(0,0,0,0.5)",
    activeShadow:
      "0 0 14px oklch(0.55 0.22 22 / 0.55), 0 0 0 1px oklch(0.55 0.22 22 / 0.40), 2px 4px 10px rgba(0,0,0,0.5)",
  },
} as const;

function ThresholdBadge({
  label,
  value,
  isActive,
  tier,
  pulseClass,
  ocid,
}: ThresholdBadgeProps) {
  const s = TIER_STYLES[tier];
  return (
    <div
      data-ocid={ocid}
      className={cn(
        "relative flex flex-col items-center gap-1 px-4 py-3 min-w-[80px] transition-all duration-300",
        isActive && pulseClass,
      )}
      style={{
        border: isActive ? s.activeBorder : s.border,
        background: isActive ? s.activeBg : s.bg,
        boxShadow: isActive ? s.activeShadow : s.shadow,
        borderRadius: "6px",
      }}
    >
      {/* Corner ornaments */}
      <span
        aria-hidden="true"
        className="absolute top-[3px] left-[4px] text-[9px] leading-none select-none pointer-events-none"
        style={{ color: isActive ? s.activeOrnament : s.ornament }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="absolute top-[3px] right-[4px] text-[9px] leading-none select-none pointer-events-none"
        style={{ color: isActive ? s.activeOrnament : s.ornament }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-[3px] left-[4px] text-[9px] leading-none select-none pointer-events-none"
        style={{ color: isActive ? s.activeOrnament : s.ornament }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-[3px] right-[4px] text-[9px] leading-none select-none pointer-events-none"
        style={{ color: isActive ? s.activeOrnament : s.ornament }}
      >
        ✦
      </span>

      <span
        className="text-[9px] font-bold uppercase select-none"
        style={{
          letterSpacing: "0.15em",
          color: isActive ? s.activeText : s.text,
          textShadow: isActive
            ? `0 0 8px ${s.activeOrnament}, 1px 1px 2px rgba(0,0,0,0.8)`
            : "1px 1px 3px rgba(0,0,0,0.9)",
          opacity: 0.9,
        }}
      >
        {label}
      </span>
      <span
        className="text-xl font-display font-bold leading-none select-none"
        style={{
          color: isActive ? s.activeText : s.text,
          textShadow: isActive
            ? `0 0 12px ${s.activeOrnament}, 1px 2px 4px rgba(0,0,0,0.9)`
            : "1px 2px 4px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function DamageThresholdDisplay({
  minor,
  major,
  severe,
  currentDamage,
}: Props) {
  const takenDamage = currentDamage ?? 0;
  const activeTier =
    currentDamage !== undefined
      ? getActiveTier(takenDamage, minor, major, severe)
      : "none";

  return (
    <div data-ocid="damage_threshold.section" className="flex flex-col gap-2">
      {/* Medieval section header */}
      <div className="flex items-center gap-2">
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.50 0.12 280 / 0.50))",
          }}
        />
        <span
          className="text-[9px] font-bold uppercase select-none"
          style={{
            letterSpacing: "0.20em",
            color: "oklch(0.65 0.12 280 / 0.80)",
            textShadow:
              "0 0 6px oklch(0.65 0.12 280 / 0.40), 1px 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          ⚜ Damage Thresholds ⚜
        </span>
        <div
          className="flex-1 h-px"
          style={{
            background:
              "linear-gradient(to left, transparent, oklch(0.50 0.12 280 / 0.50))",
          }}
        />
      </div>

      <div className="flex items-center gap-1.5">
        <ThresholdBadge
          label="Minor"
          value={minor}
          isActive={activeTier === "minor"}
          tier="minor"
          pulseClass="threshold-pulse-minor"
          ocid="damage_threshold.minor"
        />
        <span
          aria-hidden="true"
          className="text-muted-foreground/50 font-mono text-sm select-none px-0.5"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
        >
          ›
        </span>
        <ThresholdBadge
          label="Major"
          value={major}
          isActive={activeTier === "major"}
          tier="major"
          pulseClass="threshold-pulse-major"
          ocid="damage_threshold.major"
        />
        <span
          aria-hidden="true"
          className="text-muted-foreground/50 font-mono text-sm select-none px-0.5"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
        >
          ›
        </span>
        <ThresholdBadge
          label="Severe"
          value={severe}
          isActive={activeTier === "severe"}
          tier="severe"
          pulseClass="threshold-pulse-severe"
          ocid="damage_threshold.severe"
        />
      </div>
      {currentDamage !== undefined && activeTier !== "none" && (
        <p
          data-ocid="damage_threshold.active_label"
          className={cn("text-xs font-bold px-3 py-1.5 w-fit")}
          style={{
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            borderRadius: "4px",
            border:
              activeTier === "minor"
                ? "2px solid oklch(0.72 0.18 85 / 0.70)"
                : activeTier === "major"
                  ? "2px solid oklch(0.65 0.20 42 / 0.70)"
                  : "2px solid oklch(0.55 0.22 22 / 0.70)",
            background:
              activeTier === "minor"
                ? "oklch(0.72 0.18 85 / 0.12)"
                : activeTier === "major"
                  ? "oklch(0.65 0.20 42 / 0.12)"
                  : "oklch(0.55 0.22 22 / 0.12)",
            color:
              activeTier === "minor"
                ? "oklch(0.85 0.15 85)"
                : activeTier === "major"
                  ? "oklch(0.80 0.18 42)"
                  : "oklch(0.75 0.20 22)",
            textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
            boxShadow:
              activeTier === "minor"
                ? "0 0 8px oklch(0.72 0.18 85 / 0.30)"
                : activeTier === "major"
                  ? "0 0 8px oklch(0.65 0.20 42 / 0.30)"
                  : "0 0 8px oklch(0.55 0.22 22 / 0.35)",
          }}
        >
          {activeTier === "minor" && "✦ Minor Damage"}
          {activeTier === "major" && "⚔ Major Damage"}
          {activeTier === "severe" && "☠ Severe Damage"}
        </p>
      )}
    </div>
  );
}
