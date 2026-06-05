import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDiceSound } from "@/hooks/useDiceSound";
import { cn } from "@/lib/utils";
import type { DiceRoll } from "@/types/character";
import { Dices, History, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface DiceRollerProps {
  characterId: string;
  diceHistory: DiceRoll[];
  onRoll: (roll: DiceRoll) => void;
  compact?: boolean;
}

const DICE_TYPES = [4, 6, 8, 10, 12, 20] as const;

// Die face labels — cycling for cube display
const DIE_FACES: Record<number, string[]> = {
  4: ["I", "II", "III", "IV"],
  6: ["1", "2", "3", "4", "5", "6"],
  8: ["1", "2", "3", "4", "5", "6", "7", "8"],
  10: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  12: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  20: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
  ],
};

const DIE_COLORS: Record<
  number,
  {
    border: string;
    glow: string;
    face: string;
    gradientFrom: string;
    gradientTo: string;
    shadowColor: string;
    glowHex: string;
  }
> = {
  4: {
    border: "border-emerald-500/60",
    glow: "shadow-emerald-500/40",
    face: "text-emerald-300",
    gradientFrom: "oklch(0.55 0.18 162 / 0.85)",
    gradientTo: "oklch(0.28 0.10 162 / 0.95)",
    shadowColor: "oklch(0.55 0.18 162 / 0.55)",
    glowHex: "#34d399",
  },
  6: {
    border: "border-amber-500/60",
    glow: "shadow-amber-500/40",
    face: "text-amber-300",
    gradientFrom: "oklch(0.72 0.20 80 / 0.85)",
    gradientTo: "oklch(0.38 0.14 60 / 0.95)",
    shadowColor: "oklch(0.72 0.20 80 / 0.55)",
    glowHex: "#fbbf24",
  },
  8: {
    border: "border-sky-500/60",
    glow: "shadow-sky-500/40",
    face: "text-sky-300",
    gradientFrom: "oklch(0.65 0.18 220 / 0.85)",
    gradientTo: "oklch(0.30 0.12 220 / 0.95)",
    shadowColor: "oklch(0.65 0.18 220 / 0.55)",
    glowHex: "#38bdf8",
  },
  10: {
    border: "border-violet-500/60",
    glow: "shadow-violet-500/40",
    face: "text-violet-300",
    gradientFrom: "oklch(0.60 0.22 295 / 0.85)",
    gradientTo: "oklch(0.28 0.14 295 / 0.95)",
    shadowColor: "oklch(0.60 0.22 295 / 0.55)",
    glowHex: "#a78bfa",
  },
  12: {
    border: "border-rose-500/60",
    glow: "shadow-rose-500/40",
    face: "text-rose-300",
    gradientFrom: "oklch(0.60 0.22 15 / 0.85)",
    gradientTo: "oklch(0.28 0.14 10 / 0.95)",
    shadowColor: "oklch(0.60 0.22 15 / 0.55)",
    glowHex: "#fb7185",
  },
  20: {
    border: "border-primary/70",
    glow: "shadow-primary/40",
    face: "text-primary",
    gradientFrom: "oklch(0.60 0.25 260 / 0.85)",
    gradientTo: "oklch(0.28 0.18 260 / 0.95)",
    shadowColor: "oklch(0.60 0.25 260 / 0.55)",
    glowHex: "#818cf8",
  },
};

const getDieClipPath = (sides: number): string => {
  switch (sides) {
    case 4:
      return "polygon(50% 0%, 0% 100%, 100% 100%)";
    case 8:
      return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
    case 10:
      return "polygon(50% 0%, 100% 38%, 50% 100%, 0% 38%)";
    case 12:
      return "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";
    case 20:
      return "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
    default:
      return "";
  }
};

const FACE_TRANSFORMS = [
  "rotateY(0deg) translateZ(32px)",
  "rotateY(180deg) translateZ(32px)",
  "rotateY(90deg) translateZ(32px)",
  "rotateY(-90deg) translateZ(32px)",
  "rotateX(90deg) translateZ(32px)",
  "rotateX(-90deg) translateZ(32px)",
];

// 12-sided prism: 12 faces arranged around Y-axis at 30deg steps
// translateZ = r where r = side_length / (2 * tan(π/12)) ≈ half-width / 0.268 ≈ 26/0.268 ≈ 97px
// We use a smaller translateZ (26px) matching the die container size for a tight fit
const HOPE_FEAR_TRANSFORMS = [
  "rotateY(0deg) translateZ(26px)",
  "rotateY(30deg) translateZ(26px)",
  "rotateY(60deg) translateZ(26px)",
  "rotateY(90deg) translateZ(26px)",
  "rotateY(120deg) translateZ(26px)",
  "rotateY(150deg) translateZ(26px)",
  "rotateY(180deg) translateZ(26px)",
  "rotateY(210deg) translateZ(26px)",
  "rotateY(240deg) translateZ(26px)",
  "rotateY(270deg) translateZ(26px)",
  "rotateY(300deg) translateZ(26px)",
  "rotateY(330deg) translateZ(26px)",
];

// ── Single cube face ──────────────────────────────────────────────────────────
interface CubeFaceProps {
  label: string;
  transform: string;
  isRolling: boolean;
  isResult: boolean;
  colorClass: string;
}

const CubeFace: React.FC<CubeFaceProps> = ({
  label,
  transform,
  isRolling,
  isResult,
  colorClass,
}) => (
  <div
    className={cn(
      "absolute inset-0 flex items-center justify-center",
      "border rounded-lg text-sm font-display font-bold",
      "transition-all duration-200",
      isRolling
        ? "bg-amber-950/80 border-amber-500/50 text-amber-200"
        : isResult
          ? `bg-card/95 border-primary/60 ${colorClass}`
          : `bg-card/70 border-border/50 ${colorClass}`,
    )}
    style={{
      transform,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    }}
    aria-hidden="true"
  >
    {isResult ? (
      <span
        className={cn(
          "animate-[resultReveal_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
          colorClass,
        )}
      >
        {label}
      </span>
    ) : (
      label
    )}
  </div>
);

// ── 3D Dice Component ─────────────────────────────────────────────────────────
interface Dice3DProps {
  sides: number;
  isRolling: boolean;
  result: number | null;
}

const Dice3D: React.FC<Dice3DProps> = ({ sides, isRolling, result }) => {
  const colors = DIE_COLORS[sides] ?? DIE_COLORS[6];
  const faces = DIE_FACES[sides] ?? DIE_FACES[6];
  const cubeFaces = Array.from(
    { length: 6 },
    (_, i) => faces[i % faces.length],
  );
  const resultFace = result !== null ? String(result) : null;

  return (
    <div
      className="relative"
      style={{
        perspective: "220px",
        perspectiveOrigin: "50% 50%",
        width: "64px",
        height: "64px",
      }}
    >
      <div
        className={cn(
          "relative w-full h-full",
          isRolling &&
            "animate-[diceRoll3d_1.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]",
          !isRolling &&
            result !== null &&
            "animate-[diceLand_0.35s_ease-out_forwards]",
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {cubeFaces.map((face, i) => (
          <CubeFace
            key={i}
            label={i === 0 ? (resultFace ?? face) : face}
            transform={FACE_TRANSFORMS[i]}
            isRolling={isRolling}
            isResult={i === 0 && !isRolling && result !== null}
            colorClass={colors.face}
          />
        ))}
      </div>
      {isRolling && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none animate-[diceGlowPulse_0.6s_ease-in-out_infinite]"
          style={{
            boxShadow:
              "0 0 20px oklch(0.75 0.22 70 / 0.6), 0 0 40px oklch(0.75 0.22 70 / 0.35)",
          }}
        />
      )}
    </div>
  );
};

// ── Hope/Fear face helper ─────────────────────────────────────────────────────
interface HopeFearFaceProps {
  faceIndex: number;
  value: string;
  isResult: boolean;
  isRolling: boolean;
  colorClass: string;
  bgClass: string;
  resultBgClass: string;
}

const HopeFearFace: React.FC<HopeFearFaceProps> = ({
  faceIndex,
  value,
  isResult,
  isRolling,
  colorClass,
  bgClass,
  resultBgClass,
}) => (
  <div
    className={cn(
      "absolute inset-0 flex items-center justify-center",
      "border rounded-lg text-xs font-display font-bold",
      isRolling
        ? bgClass
        : isResult
          ? resultBgClass
          : "bg-card/70 border-border/50",
      isResult ? colorClass : isRolling ? "text-amber-100" : colorClass,
    )}
    style={{
      transform: HOPE_FEAR_TRANSFORMS[faceIndex],
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
    }}
    aria-hidden="true"
  >
    {isResult ? (
      <span
        className={cn(
          "animate-[resultReveal_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]",
          colorClass,
        )}
      >
        {value}
      </span>
    ) : (
      value
    )}
  </div>
);

// ── Mini 3D cube for Hope/Fear ────────────────────────────────────────────────
interface HopeFearCubeProps {
  isRolling: boolean;
  result: number | null;
  colorClass: string;
  bgClass: string;
  resultBgClass: string;
  delayMs?: number;
}

const HopeFearCube: React.FC<HopeFearCubeProps> = ({
  isRolling,
  result,
  colorClass,
  bgClass,
  resultBgClass,
  delayMs = 0,
}) => {
  // Use all 12 faces of the d12 (dodecahedron approximated as 12-sided prism)
  const faces = DIE_FACES[12]; // ["1".."12"]

  return (
    <div style={{ perspective: "180px", width: "52px", height: "52px" }}>
      <div
        className={cn(
          "relative w-full h-full",
          isRolling &&
            "animate-[diceRoll3d_1.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]",
          !isRolling &&
            result !== null &&
            "animate-[diceLand_0.35s_ease-out_forwards]",
        )}
        style={{
          transformStyle: "preserve-3d",
          animationDelay: delayMs ? `${delayMs}ms` : undefined,
        }}
      >
        {faces.map((face, i) => (
          <HopeFearFace
            key={i}
            faceIndex={i}
            value={
              i === 0 && !isRolling && result !== null ? String(result) : face
            }
            isResult={i === 0 && !isRolling && result !== null}
            isRolling={isRolling}
            colorClass={colorClass}
            bgClass={bgClass}
            resultBgClass={resultBgClass}
          />
        ))}
      </div>
    </div>
  );
};

export const DiceRoller: React.FC<DiceRollerProps> = ({
  characterId,
  diceHistory,
  onRoll,
  compact = false,
}) => {
  const { playDiceRoll, isSoundEnabled, toggleSound, isAudioAvailable } =
    useDiceSound();
  const [modifier, setModifier] = useState(0);
  const [rollingDie, setRollingDie] = useState<number | null>(null);
  const [rollingHopeFear, setRollingHopeFear] = useState(false);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [dieResults, setDieResults] = useState<Record<string, number | null>>(
    {},
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleRoll = useCallback(
    (die: number) => {
      if (rollingDie !== null || rollingHopeFear) return;
      setRollingDie(die);
      setDieResults((prev) => ({ ...prev, [die]: null }));
      playDiceRoll();
      timerRef.current = setTimeout(() => {
        const result = Math.floor(Math.random() * die) + 1;
        const total = result + modifier;
        const entry: DiceRoll = {
          die,
          result,
          modifier,
          total,
          timestamp: Date.now(),
        };
        setDieResults((prev) => ({ ...prev, [die]: result }));
        setLastRoll(entry);
        setRollingDie(null);
        onRoll(entry);
      }, 1700);
    },
    [rollingDie, rollingHopeFear, modifier, playDiceRoll, onRoll],
  );

  const handleHopeFear = useCallback(() => {
    if (rollingDie !== null || rollingHopeFear) return;
    setRollingHopeFear(true);
    setDieResults((prev) => ({ ...prev, hope: null, fear: null }));
    playDiceRoll();
    timerRef.current = setTimeout(() => {
      const hopeResult = Math.floor(Math.random() * 12) + 1;
      const fearResult = Math.floor(Math.random() * 12) + 1;
      const total = hopeResult + fearResult;
      const entry: DiceRoll = {
        die: 12,
        result: hopeResult,
        modifier: 0,
        total,
        timestamp: Date.now(),
        label: "Hope & Fear",
        hopeResult,
        fearResult,
      };
      setDieResults((prev) => ({
        ...prev,
        hope: hopeResult,
        fear: fearResult,
      }));
      setLastRoll(entry);
      setRollingHopeFear(false);
      onRoll(entry);
    }, 1700);
  }, [rollingDie, rollingHopeFear, playDiceRoll, onRoll]);

  const handleClear = useCallback(() => {
    setLastRoll(null);
    setDieResults({});
    onRoll({ die: 0, result: 0, modifier: 0, total: 0, timestamp: -1 });
  }, [onRoll]);

  const isRolling = rollingDie !== null || rollingHopeFear;

  return (
    <Card
      className={cn("card-fantasy border-primary/30", compact && "compact")}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <Dices className="size-4 text-primary" />
            Dice Roller
          </CardTitle>
          {isAudioAvailable && (
            <Button
              data-ocid="dice.sound_toggle"
              variant="ghost"
              size="icon"
              type="button"
              className="size-7"
              onClick={toggleSound}
              aria-label={
                isSoundEnabled ? "Mute dice sounds" : "Enable dice sounds"
              }
            >
              {isSoundEnabled ? (
                <Volume2 className="size-4 text-primary" />
              ) : (
                <VolumeX className="size-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Modifier */}
        <div className="flex items-center gap-3">
          <Label className="text-xs text-muted-foreground whitespace-nowrap">
            Modifier
          </Label>
          <Input
            data-ocid="dice.modifier_input"
            type="number"
            min={-10}
            max={10}
            value={modifier}
            onChange={(e) => setModifier(Number(e.target.value))}
            className="w-20 text-center"
            disabled={isRolling}
          />
        </div>

        {/* 3D Dice Grid */}
        <div className="grid grid-cols-3 gap-3 py-1">
          {DICE_TYPES.map((die) => {
            const colors = DIE_COLORS[die];
            const isThisRolling = rollingDie === die;
            const result =
              (dieResults[die] as number | null | undefined) ?? null;
            return (
              <button
                key={die}
                type="button"
                data-ocid={`dice.d${die}_button`}
                aria-label={`Roll d${die}`}
                disabled={isRolling}
                onClick={() => handleRoll(die)}
                style={{
                  clipPath: getDieClipPath(die),
                  minWidth: "72px",
                  minHeight: "72px",
                  background: isThisRolling
                    ? "linear-gradient(135deg, oklch(0.72 0.20 80 / 0.9) 0%, oklch(0.38 0.14 60 / 0.95) 100%)"
                    : `linear-gradient(135deg, ${colors.gradientFrom} 0%, ${colors.gradientTo} 100%)`,
                  boxShadow: isThisRolling
                    ? "0 0 24px oklch(0.72 0.20 80 / 0.7), 4px 8px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : `4px 6px 14px rgba(0,0,0,0.55), 2px 3px 6px ${colors.shadowColor}, inset 0 1px 0 rgba(255,255,255,0.15), inset -1px -1px 0 rgba(0,0,0,0.2)`,
                  transform: isThisRolling
                    ? "perspective(200px) rotateX(0deg) rotateY(0deg) scale(0.95)"
                    : "perspective(200px) rotateX(5deg) rotateY(-5deg)",
                  transition: "all 0.2s ease",
                }}
                className={cn(
                  "group flex flex-col items-center gap-1 rounded-xl p-2",
                  "border transition-all duration-200 cursor-pointer select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isThisRolling
                    ? "border-amber-500/60"
                    : result !== null
                      ? colors.border
                      : "border-border/40",
                  isRolling &&
                    !isThisRolling &&
                    "opacity-40 cursor-not-allowed",
                  !isRolling &&
                    "hover:[box-shadow:6px_10px_20px_rgba(0,0,0,0.7),_3px_5px_10px_var(--tw-shadow-color),_inset_0_1px_0_rgba(255,255,255,0.25)] hover:[transform:perspective(200px)_rotateX(8deg)_rotateY(-8deg)_translateY(-2px)]",
                )}
              >
                <Dice3D
                  sides={die}
                  isRolling={isThisRolling}
                  result={isThisRolling ? null : result}
                />
                <span
                  className={cn(
                    "text-xs font-display font-bold tracking-wider transition-colors duration-300",
                    isThisRolling ? "text-amber-300" : "text-muted-foreground",
                  )}
                >
                  d{die}
                </span>
              </button>
            );
          })}
        </div>

        {/* Hope & Fear Dice */}
        <button
          type="button"
          data-ocid="dice.hope_fear_button"
          aria-label="Roll Hope and Fear dice (2d12)"
          disabled={isRolling}
          onClick={handleHopeFear}
          style={{
            clipPath: getDieClipPath(12),
            minWidth: "64px",
            minHeight: "64px",
          }}
          className={cn(
            "w-full rounded-xl border px-3 py-3 transition-all duration-200",
            "bg-gradient-to-r from-amber-950/50 to-rose-950/50",
            "border-amber-500/40 hover:border-amber-400/70",
            "hover:from-amber-900/60 hover:to-rose-900/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            rollingHopeFear &&
              "border-amber-400/70 from-amber-900/60 to-rose-900/60",
            isRolling && !rollingHopeFear && "opacity-40 cursor-not-allowed",
          )}
        >
          <div className="flex items-center justify-center gap-4">
            {/* Hope die */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-display text-amber-300 tracking-wider">
                ✦ HOPE
              </span>
              <HopeFearCube
                isRolling={rollingHopeFear}
                result={(dieResults.hope ?? null) as number | null}
                colorClass="text-amber-300"
                bgClass="bg-amber-950/80 border-amber-500/40"
                resultBgClass="bg-card/95 border-amber-500/60"
              />
              {!rollingHopeFear && dieResults.hope != null && (
                <span className="font-display text-lg font-bold text-amber-300 animate-[resultReveal_0.4s_ease-out_forwards]">
                  {dieResults.hope as number}
                </span>
              )}
            </div>

            <div className="text-muted-foreground text-sm font-display">/</div>

            {/* Fear die */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-display text-rose-400 tracking-wider">
                ✦ FEAR
              </span>
              <HopeFearCube
                isRolling={rollingHopeFear}
                result={(dieResults.fear ?? null) as number | null}
                colorClass="text-rose-400"
                bgClass="bg-rose-950/80 border-rose-500/40"
                resultBgClass="bg-card/95 border-rose-500/60"
                delayMs={80}
              />
              {!rollingHopeFear && dieResults.fear != null && (
                <span className="font-display text-lg font-bold text-rose-400 animate-[resultReveal_0.4s_ease-out_0.05s_forwards]">
                  {dieResults.fear as number}
                </span>
              )}
            </div>

            {/* Sum */}
            {!rollingHopeFear &&
              dieResults.hope != null &&
              dieResults.fear != null && (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs text-muted-foreground font-display tracking-wide">
                    SUM
                  </span>
                  <span className="font-display text-2xl font-bold text-primary">
                    {(dieResults.hope as number) + (dieResults.fear as number)}
                  </span>
                </div>
              )}

            {rollingHopeFear && (
              <span className="text-xs text-amber-300/60 font-display tracking-wide animate-pulse">
                Rolling…
              </span>
            )}
          </div>
          {!rollingHopeFear && dieResults.hope == null && (
            <p className="text-center text-xs text-muted-foreground mt-2 font-display tracking-wide">
              Hope & Fear (2d12)
            </p>
          )}
        </button>

        {/* Last result summary */}
        {lastRoll && lastRoll.timestamp !== -1 && (
          <div
            className={cn(
              "text-center py-3 rounded-lg border transition-all duration-300",
              lastRoll.label === "Hope & Fear"
                ? "bg-gradient-to-r from-amber-950/40 to-rose-950/40 border-amber-700/30"
                : "bg-primary/10 border-primary/20",
            )}
          >
            {lastRoll.label === "Hope & Fear" ? (
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs text-muted-foreground font-display tracking-wide">
                  Hope & Fear — total
                </span>
                <span className="font-display text-3xl font-bold text-primary">
                  {lastRoll.total}
                </span>
                <span className="text-xs text-muted-foreground">
                  <span className="text-amber-300">{lastRoll.hopeResult}</span>
                  {" + "}
                  <span className="text-rose-400">{lastRoll.fearResult}</span>
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs text-muted-foreground">
                  d{lastRoll.die} result
                </span>
                <span className="font-display text-3xl font-bold text-primary">
                  {lastRoll.total}
                </span>
                {lastRoll.modifier !== 0 && (
                  <span className="text-xs text-muted-foreground">
                    {lastRoll.result} {lastRoll.modifier >= 0 ? "+" : ""}
                    {lastRoll.modifier} = {lastRoll.total}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Roll History */}
        {diceHistory.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Last 5 Rolls
                </span>
              </div>
              <Button
                data-ocid="dice.clear_button"
                variant="ghost"
                size="sm"
                type="button"
                className="h-6 text-xs text-muted-foreground hover:text-destructive"
                onClick={handleClear}
              >
                <RotateCcw className="size-3 mr-1" />
                Clear
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              {diceHistory.slice(0, 5).map((entry, idx) => (
                <div
                  key={`${characterId}-${entry.timestamp}-${idx}`}
                  data-ocid={`dice.history.item.${idx + 1}`}
                  className={cn(
                    "flex items-center justify-between text-xs py-1 px-2 rounded",
                    entry.label === "Hope & Fear"
                      ? "bg-gradient-to-r from-amber-950/50 to-rose-950/50 border border-amber-800/30"
                      : "bg-muted/40",
                  )}
                >
                  <span className="text-muted-foreground">
                    {entry.label ?? `d${entry.die}`}
                  </span>
                  {entry.label === "Hope & Fear" ? (
                    <span className="font-bold">
                      <span className="text-amber-300">{entry.hopeResult}</span>
                      <span className="text-muted-foreground mx-1">+</span>
                      <span className="text-rose-400">{entry.fearResult}</span>
                      <span className="text-muted-foreground mx-1">=</span>
                      <span className="text-primary">{entry.total}</span>
                    </span>
                  ) : (
                    <span className="text-foreground font-bold">
                      {entry.result} + {entry.modifier} = {entry.total}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
