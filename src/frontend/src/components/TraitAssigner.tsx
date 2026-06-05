import type { TraitSet } from "@/types/character";
import { RotateCcw } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

const TRAIT_ORDER: Array<keyof TraitSet> = [
  "agility",
  "strength",
  "finesse",
  "instinct",
  "presence",
  "knowledge",
];

const _TRAIT_DESCRIPTIONS: Record<keyof TraitSet, string> = {
  agility: "Speed, dodging, and quick reflexes",
  strength: "Raw power, lifting, and melee force",
  finesse: "Precision, dexterity, and delicate tasks",
  instinct: "Awareness, survival, and gut reactions",
  presence: "Charisma, leadership, and social grace",
  knowledge: "Lore, memory, and arcane understanding",
};

const MODIFIER_POOL: number[] = [2, 1, 1, 0, 0, -1];

function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

function chipColorClass(value: number): string {
  if (value === 2) return "text-amber-400 border-amber-400/40";
  if (value === 1) return "text-amber-300 border-amber-300/40";
  if (value === -1) return "text-red-400 border-red-400/40";
  return "text-slate-300 border-slate-500/40";
}

interface TraitAssignerProps {
  traits: TraitSet;
  onChange: (traits: TraitSet) => void;
  readOnly?: boolean;
}

export function TraitAssigner({
  traits,
  onChange,
  readOnly = false,
}: TraitAssignerProps) {
  const [editingTrait, setEditingTrait] = useState<keyof TraitSet | null>(null);
  const [editValue, setEditValue] = useState("");

  const assignments = useMemo(() => {
    const pool = [...MODIFIER_POOL];
    const map: Record<string, number> = {};
    for (const trait of TRAIT_ORDER) {
      const value = traits[trait];
      const idx = pool.indexOf(value);
      if (idx !== -1) {
        map[trait] = idx;
        pool[idx] = Number.NaN;
      }
    }
    return map;
  }, [traits]);

  const usedIndices = useMemo(
    () => new Set(Object.values(assignments)),
    [assignments],
  );

  const handleAssign = useCallback(
    (trait: keyof TraitSet, poolIndex: number) => {
      const currentIndex = assignments[trait];
      if (currentIndex === poolIndex) return;
      const newTraits: TraitSet = { ...traits };
      for (const t of TRAIT_ORDER) {
        if (t === trait) continue;
        if (assignments[t] === poolIndex) {
          if (currentIndex !== undefined) {
            newTraits[t] = MODIFIER_POOL[currentIndex] as number;
          } else {
            newTraits[t] = 0;
          }
        }
      }
      newTraits[trait] = MODIFIER_POOL[poolIndex] as number;
      onChange(newTraits);
    },
    [traits, assignments, onChange],
  );

  const handleReset = useCallback(() => {
    onChange({
      agility: 0,
      strength: 0,
      finesse: 0,
      instinct: 0,
      presence: 0,
      knowledge: 0,
    });
  }, [onChange]);

  const allAssigned = TRAIT_ORDER.every((t) => t in assignments);

  const availablePool = MODIFIER_POOL.filter((_, i) => !usedIndices.has(i));

  const handleEditStart = (trait: keyof TraitSet) => {
    if (readOnly) return;
    setEditingTrait(trait);
    setEditValue(String(traits[trait]));
  };

  const handleEditCommit = (trait: keyof TraitSet) => {
    const parsed = Number.parseInt(editValue, 10);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.max(-5, Math.min(10, parsed));
      onChange({ ...traits, [trait]: clamped });
    }
    setEditingTrait(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Pool indicator */}
      {!readOnly && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-display uppercase tracking-widest text-muted-foreground">
              Modifier Pool
            </span>
            <div className="flex gap-1">
              {availablePool.map((val, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-bold border ${chipColorClass(val)}`}
                >
                  {formatModifier(val)}
                </span>
              ))}
              {availablePool.length === 0 && (
                <span className="text-[10px] text-primary font-semibold">
                  All assigned
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            data-ocid="traitassigner.reset_button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-smooth"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        </div>
      )}

      {/* Trait card grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {TRAIT_ORDER.map((trait) => {
          const assignedIndex = assignments[trait];
          const assignedValue =
            assignedIndex !== undefined
              ? MODIFIER_POOL[assignedIndex]
              : undefined;
          const modDisplay =
            assignedValue !== undefined ? formatModifier(assignedValue) : "—";
          const isEditing = editingTrait === trait;

          return (
            <div
              key={trait}
              data-ocid={`traitassigner.row.${trait}`}
              className="trait-card-shield group"
            >
              {/* Trait name */}
              <div className="trait-card-name">{trait.toUpperCase()}</div>

              {/* Modifier — large center */}
              <div
                className={`trait-card-modifier ${
                  assignedValue === 2
                    ? "text-amber-400"
                    : assignedValue === 1
                      ? "text-amber-300"
                      : assignedValue === -1
                        ? "text-red-400"
                        : "text-foreground"
                }`}
              >
                {modDisplay}
              </div>

              {/* Score */}
              <div className="trait-card-score">
                {isEditing ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEditCommit(trait)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditCommit(trait);
                      if (e.key === "Escape") setEditingTrait(null);
                    }}
                    className="w-12 text-center bg-transparent border-b border-primary text-foreground text-sm font-bold outline-none"
                    data-ocid={`traitassigner.score_input.${trait}`}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEditStart(trait)}
                    disabled={readOnly}
                    className={`trait-card-score-btn ${readOnly ? "cursor-default" : "hover:text-primary cursor-pointer"}`}
                    data-ocid={`traitassigner.score_btn.${trait}`}
                    title={readOnly ? undefined : "Click to edit score"}
                  >
                    {traits[trait]}
                  </button>
                )}
              </div>

              {/* Modifier chips (edit mode) */}
              {!readOnly && (
                <div className="trait-card-chips">
                  {MODIFIER_POOL.map((val, poolIndex) => {
                    const isAssignedHere = assignedIndex === poolIndex;
                    const isUsedElsewhere =
                      !isAssignedHere && usedIndices.has(poolIndex);
                    return (
                      <button
                        key={poolIndex}
                        type="button"
                        data-ocid={`traitassigner.chip.${trait}.value_${val}.idx_${poolIndex}`}
                        onClick={() => handleAssign(trait, poolIndex)}
                        disabled={isUsedElsewhere}
                        className={`
                          w-7 h-5 rounded text-[9px] font-bold border transition-smooth
                          ${
                            isAssignedHere
                              ? "bg-primary text-primary-foreground border-primary shadow-[0_0_6px_oklch(var(--primary)/0.6)]"
                              : isUsedElsewhere
                                ? "opacity-20 cursor-not-allowed bg-muted/20 border-border"
                                : `bg-card/60 hover:bg-muted ${chipColorClass(val)}`
                          }
                        `}
                      >
                        {formatModifier(val)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!readOnly && allAssigned && (
        <p className="text-center text-[11px] text-primary flex items-center justify-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          All modifiers assigned
        </p>
      )}
    </div>
  );
}
