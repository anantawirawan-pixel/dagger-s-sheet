import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  Character,
  CombatTracker,
  ConditionEntry,
} from "@/types/character";
import {
  ChevronDown,
  Crosshair,
  Plus,
  RotateCcw,
  SkipForward,
  Swords,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface CombatTabProps {
  character: Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
}

const CONDITIONS: { name: string; color: string }[] = [
  {
    name: "Stunned",
    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  },
  {
    name: "Frightened",
    color: "bg-orange-500/20 text-orange-300 border-orange-500/50",
  },
  {
    name: "Prone",
    color: "bg-zinc-500/20   text-zinc-300   border-zinc-500/50",
  },
  {
    name: "Poisoned",
    color: "bg-green-500/20  text-green-300  border-green-500/50",
  },
  {
    name: "Restrained",
    color: "bg-blue-500/20   text-blue-300   border-blue-500/50",
  },
  {
    name: "Burning",
    color: "bg-red-500/20    text-red-300    border-red-500/50",
  },
  {
    name: "Slowed",
    color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
  },
  {
    name: "Weakened",
    color: "bg-rose-500/20   text-rose-300   border-rose-500/50",
  },
  {
    name: "Blinded",
    color: "bg-slate-500/20  text-slate-300  border-slate-500/50",
  },
  {
    name: "Charmed",
    color: "bg-pink-500/20   text-pink-300   border-pink-500/50",
  },
];

function getTracker(character: Character): CombatTracker {
  return (
    character.combatTracker ?? {
      combatants: [],
      round: 1,
      turnCount: 0,
      activeCombatantId: null,
    }
  );
}

function setTracker(
  character: Character,
  updateCharacter: CombatTabProps["updateCharacter"],
  tracker: CombatTracker,
) {
  updateCharacter(character.id, { combatTracker: tracker });
}

/* ---- Per-combatant condition row with add dropdown ---- */
function ConditionRow({
  combatantId,
  active,
  idx,
  onAdd,
  onRemove,
}: {
  combatantId: string;
  active: ConditionEntry[];
  idx: number;
  onAdd: (id: string, name: string, duration: number | null) => void;
  onRemove: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pendingDuration, setPendingDuration] = useState<
    Record<string, string>
  >({});

  const activeNames = active.map((c) => c.name);

  return (
    <div className="flex flex-wrap gap-1.5 items-center mt-1">
      {active.map((cond) => {
        const def = CONDITIONS.find((c) => c.name === cond.name);
        const durationLabel =
          cond.duration === null ? "∞" : String(cond.duration);
        return (
          <span
            key={cond.name}
            className={cn(
              "inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full border font-medium",
              def?.color ?? "bg-muted/30 text-muted-foreground border-border",
            )}
          >
            {cond.name}
            <span className="ml-0.5 font-mono opacity-75 text-[9px]">
              {durationLabel}
            </span>
            <button
              data-ocid={`combat.condition.remove.${cond.name.toLowerCase()}.${idx + 1}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(combatantId, cond.name);
              }}
              className="ml-0.5 rounded-full hover:opacity-70 focus:outline-none"
              aria-label={`Remove ${cond.name}`}
            >
              <X className="size-2.5" />
            </button>
          </span>
        );
      })}

      <div className="relative">
        <button
          data-ocid={`combat.condition.add.${idx + 1}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors duration-150"
          aria-label="Add condition"
        >
          <Plus className="size-2.5" />
          <ChevronDown className="size-2.5" />
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 rounded-lg border border-border bg-card shadow-lg p-2 min-w-[200px]">
            <p className="text-[10px] text-muted-foreground mb-1.5 font-semibold uppercase tracking-wide">
              Conditions
            </p>
            <div className="flex flex-col gap-1.5">
              {CONDITIONS.map((c) => {
                const isActive = activeNames.includes(c.name);
                return (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <button
                      data-ocid={`combat.condition.chip.${c.name.toLowerCase()}.${idx + 1}`}
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          onRemove(combatantId, c.name);
                        } else {
                          const raw = pendingDuration[c.name];
                          const dur =
                            raw && raw.trim() !== "" ? Number(raw) : null;
                          onAdd(combatantId, c.name, dur);
                        }
                      }}
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border transition-all duration-150 cursor-pointer flex-1 text-left",
                        isActive
                          ? c.color
                          : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {c.name}
                    </button>
                    {!isActive && (
                      <input
                        type="number"
                        min="1"
                        placeholder="∞"
                        value={pendingDuration[c.name] ?? ""}
                        onChange={(e) =>
                          setPendingDuration((p) => ({
                            ...p,
                            [c.name]: e.target.value,
                          }))
                        }
                        className="w-10 text-[10px] rounded border border-border bg-muted/30 text-foreground px-1 py-0.5 focus:outline-none focus:border-primary/50"
                        aria-label={`${c.name} duration in turns`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] text-muted-foreground mt-1.5 opacity-60">
              Leave blank for permanent
            </p>
            <button
              type="button"
              className="mt-1 text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CombatTab({ character, updateCharacter }: CombatTabProps) {
  const tracker = getTracker(character);
  const selfConditions: ConditionEntry[] =
    (tracker as CombatTracker & { selfConditions?: ConditionEntry[] })
      .selfConditions ?? [];
  function endTurn() {
    const nextSelfConditions = selfConditions
      .map((cond) =>
        cond.duration === null
          ? cond
          : { ...cond, duration: cond.duration - 1 },
      )
      .filter((cond) => cond.duration === null || cond.duration > 0);
    const next: CombatTracker = {
      ...tracker,
      turnCount: (tracker.turnCount ?? 0) + 1,
    };
    updateCharacter(character.id, {
      combatTracker: {
        ...next,
        selfConditions: nextSelfConditions,
      } as CombatTracker,
    });
  }

  function nextRound() {
    const next: CombatTracker = {
      ...tracker,
      round: tracker.round + 1,
    };
    setTracker(character, updateCharacter, next);
  }

  function resetCombat() {
    const next: CombatTracker = {
      combatants: [],
      round: 1,
      turnCount: 0,
      activeCombatantId: null,
    };
    updateCharacter(character.id, {
      combatTracker: { ...next, selfConditions: [] } as CombatTracker,
    });
  }

  function addSelfCondition(name: string, duration: number | null) {
    const updated = selfConditions.some((c) => c.name === name)
      ? selfConditions
      : [...selfConditions, { name, duration }];
    updateCharacter(character.id, {
      combatTracker: { ...tracker, selfConditions: updated } as CombatTracker,
    });
  }

  function removeSelfCondition(name: string) {
    updateCharacter(character.id, {
      combatTracker: {
        ...tracker,
        selfConditions: selfConditions.filter((c) => c.name !== name),
      } as CombatTracker,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Round & Turn Controls */}
      <Card className="card-fantasy border-primary/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Swords className="size-4 text-primary" />
              Combat Tracker
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Round</span>
                <span className="font-display text-lg font-bold text-primary">
                  {tracker.round}
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Turn</span>
                <span className="font-display text-lg font-bold text-secondary">
                  {tracker.turnCount ?? 0}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              data-ocid="combat.end_turn_button"
              size="sm"
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={endTurn}
            >
              <SkipForward className="size-4 mr-1" />
              End Turn
            </Button>
            <Button
              data-ocid="combat.next_round_button"
              size="sm"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={nextRound}
            >
              <Crosshair className="size-4 mr-1" />
              Next Round
            </Button>
            <Button
              data-ocid="combat.reset_button"
              variant="outline"
              size="sm"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={resetCombat}
            >
              <RotateCcw className="size-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Self Conditions */}
      <Card className="card-fantasy">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display">My Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <ConditionRow
            combatantId="self"
            active={selfConditions}
            idx={0}
            onAdd={(_id, name, dur) => addSelfCondition(name, dur)}
            onRemove={(_id, name) => removeSelfCondition(name)}
          />
          {selfConditions.length === 0 && (
            <p className="text-xs text-muted-foreground italic mt-1">
              No active conditions. Use the + button to add one.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
