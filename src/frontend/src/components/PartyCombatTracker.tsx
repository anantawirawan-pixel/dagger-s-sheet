import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type PartyCombatant,
  usePartyCombatStore,
} from "@/store/usePartyCombatStore";
import type { Character, ConditionEntry } from "@/types/character";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  SkipForward,
  Skull,
  Sparkles,
  Swords,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

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

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function HpBar({ hp, maxHp }: { hp: number; maxHp: number }) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  let barColor = "bg-emerald-500";
  if (pct <= 25) barColor = "bg-red-500";
  else if (pct <= 50) barColor = "bg-amber-500";
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-0.5">
        <span className="text-muted-foreground">
          <Heart className="size-3 inline mr-0.5" />
          HP
        </span>
        <span className="font-mono">
          {hp}/{maxHp}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            barColor,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ConditionBadge({
  name,
  duration,
  active,
  onClick,
  onRemove,
}: {
  name: string;
  duration?: number | null;
  active: boolean;
  onClick: () => void;
  onRemove?: () => void;
}) {
  const def = CONDITIONS.find((c) => c.name === name);
  const color = def?.color ?? "bg-muted text-muted-foreground border-border";
  const durationLabel =
    duration === undefined || duration === null ? "∞" : String(duration);
  if (active && onRemove) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] border font-medium",
          color,
        )}
      >
        {name}
        <span className="font-mono opacity-75 text-[9px] ml-0.5">
          {durationLabel}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full hover:opacity-70 focus:outline-none"
          aria-label={`Remove ${name}`}
        >
          <X className="size-2.5" />
        </button>
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] border transition-all duration-200 cursor-pointer",
        active
          ? color
          : "bg-transparent text-muted-foreground border-border opacity-60 hover:opacity-100",
      )}
    >
      {name}
    </button>
  );
}

function QuickActions({
  combatant,
  onUpdate,
}: {
  combatant: PartyCombatant;
  onUpdate: (updates: Partial<PartyCombatant>) => void;
}) {
  const toggleCondition = useCallback(
    (name: string) => {
      const existing = combatant.conditions.find((c) => c.name === name);
      const next: ConditionEntry[] = existing
        ? combatant.conditions.filter((c) => c.name !== name)
        : [...combatant.conditions, { name, duration: null }];
      onUpdate({ conditions: next });
    },
    [combatant.conditions, onUpdate],
  );

  return (
    <div className="mt-3 pt-3 border-t border-border space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2"
          onClick={() => onUpdate({ hp: Math.max(0, combatant.hp - 1) })}
        >
          <Minus className="size-3" />
        </Button>
        <span className="text-xs font-mono w-16 text-center">
          <Heart className="size-3 inline mr-0.5 text-red-400" />
          {combatant.hp}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2"
          onClick={() =>
            onUpdate({ hp: Math.min(combatant.maxHp, combatant.hp + 1) })
          }
        >
          <Plus className="size-3" />
        </Button>

        {combatant.maxStress !== undefined && (
          <>
            <div className="w-px h-5 bg-border mx-1" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() =>
                onUpdate({ stress: Math.max(0, (combatant.stress ?? 0) - 1) })
              }
            >
              <Minus className="size-3" />
            </Button>
            <span className="text-xs font-mono w-16 text-center">
              <Skull className="size-3 inline mr-0.5 text-purple-400" />
              {combatant.stress ?? 0}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() =>
                onUpdate({
                  stress: Math.min(
                    combatant.maxStress ?? 6,
                    (combatant.stress ?? 0) + 1,
                  ),
                })
              }
            >
              <Plus className="size-3" />
            </Button>
          </>
        )}

        {combatant.hope !== undefined && (
          <>
            <div className="w-px h-5 bg-border mx-1" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() =>
                onUpdate({ hope: Math.max(0, (combatant.hope ?? 0) - 1) })
              }
            >
              <Minus className="size-3" />
            </Button>
            <span className="text-xs font-mono w-16 text-center">
              <Sparkles className="size-3 inline mr-0.5 text-amber-400" />
              {combatant.hope ?? 0}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() =>
                onUpdate({ hope: Math.min(6, (combatant.hope ?? 0) + 1) })
              }
            >
              <Plus className="size-3" />
            </Button>
          </>
        )}

        {combatant.armorSlots !== undefined && (
          <>
            <div className="w-px h-5 bg-border mx-1" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() =>
                onUpdate({
                  armorUsed: Math.max(0, (combatant.armorUsed ?? 0) - 1),
                })
              }
            >
              <Minus className="size-3" />
            </Button>
            <span className="text-xs font-mono w-16 text-center">
              <Shield className="size-3 inline mr-0.5 text-blue-400" />
              {combatant.armorUsed ?? 0}/{combatant.armorSlots}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={() =>
                onUpdate({
                  armorUsed: Math.min(
                    combatant.armorSlots ?? 0,
                    (combatant.armorUsed ?? 0) + 1,
                  ),
                })
              }
            >
              <Plus className="size-3" />
            </Button>
          </>
        )}
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Conditions</p>
        <div className="flex flex-wrap gap-1.5">
          {CONDITIONS.map((c) => {
            const entry = combatant.conditions.find((e) => e.name === c.name);
            return (
              <ConditionBadge
                key={c.name}
                name={c.name}
                duration={entry?.duration}
                active={!!entry}
                onClick={() => toggleCondition(c.name)}
                onRemove={entry ? () => toggleCondition(c.name) : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PartyConditionAdder({
  combatant,
  index,
  onUpdate,
}: {
  combatant: PartyCombatant;
  index: number;
  onUpdate: (updates: Partial<PartyCombatant>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pendingDuration, setPendingDuration] = useState<
    Record<string, string>
  >({});

  const toggle = useCallback(
    (name: string, duration: number | null) => {
      const existing = combatant.conditions.find((c) => c.name === name);
      const next: ConditionEntry[] = existing
        ? combatant.conditions.filter((c) => c.name !== name)
        : [...combatant.conditions, { name, duration }];
      onUpdate({ conditions: next });
    },
    [combatant.conditions, onUpdate],
  );
  return (
    <div className="relative inline-block mt-1.5">
      <button
        data-ocid={`party.combat.condition.add.${index + 1}`}
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
              const isActive = combatant.conditions.some(
                (e) => e.name === c.name,
              );
              return (
                <div key={c.name} className="flex items-center gap-1.5">
                  <button
                    data-ocid={`party.combat.condition.chip.${c.name.toLowerCase()}.${index + 1}`}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        toggle(c.name, null);
                      } else {
                        const raw = pendingDuration[c.name];
                        const dur =
                          raw && raw.trim() !== "" ? Number(raw) : null;
                        toggle(c.name, dur);
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
  );
}

function AddNpcForm({
  onAdd,
  onCancel,
}: {
  onAdd: (npc: Omit<PartyCombatant, "id" | "type">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [maxHp, setMaxHp] = useState("20");
  const [initiative, setInitiative] = useState("");
  const [autoRoll, setAutoRoll] = useState(true);

  const handleSubmit = () => {
    const hpVal = Number.parseInt(maxHp, 10) || 1;
    const initVal = autoRoll ? rollD20() : Number.parseInt(initiative, 10) || 0;
    onAdd({
      name: name.trim() || "Unknown NPC",
      initiative: initVal,
      hp: hpVal,
      maxHp: hpVal,
      conditions: [] as ConditionEntry[],
      isActive: true,
    });
    setName("");
    setMaxHp("20");
    setInitiative("");
    setAutoRoll(true);
  };

  return (
    <div className="mt-3 p-3 rounded-lg border border-border bg-card space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Add NPC</p>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Goblin"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Max HP</Label>
          <Input
            type="number"
            value={maxHp}
            onChange={(e) => setMaxHp(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={autoRoll}
            onChange={(e) => setAutoRoll(e.target.checked)}
            className="rounded border-border"
          />
          Auto-roll initiative
        </label>
        {!autoRoll && (
          <div className="flex-1">
            <Input
              type="number"
              value={initiative}
              onChange={(e) => setInitiative(e.target.value)}
              placeholder="Initiative"
              className="w-24"
            />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={handleSubmit}>
          <Plus className="size-3.5 mr-1" />
          Add
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function PartyCombatTracker({
  partyId,
  characters,
}: {
  partyId: string;
  characters: Character[];
}) {
  const session = usePartyCombatStore((s) => s.sessions[partyId]);
  const startCombat = usePartyCombatStore((s) => s.startCombat);
  const addNpc = usePartyCombatStore((s) => s.addNpc);
  const removeCombatant = usePartyCombatStore((s) => s.removeCombatant);
  const updateCombatant = usePartyCombatStore((s) => s.updateCombatant);
  const nextTurn = usePartyCombatStore((s) => s.nextTurn);
  const prevTurn = usePartyCombatStore((s) => s.prevTurn);
  const resetCombat = usePartyCombatStore((s) => s.resetCombat);
  const endCombat = usePartyCombatStore((s) => s.endCombat);
  const rollInitiativeAll = usePartyCombatStore((s) => s.rollInitiativeAll);
  const endTurn = usePartyCombatStore((s) => s.endTurn);

  const [showAddNpc, setShowAddNpc] = useState(false);

  const activeCombatants = useMemo(
    () => session?.combatants.filter((c) => c.isActive) ?? [],
    [session],
  );

  const currentCombatant = useMemo(() => {
    if (!session || activeCombatants.length === 0) return null;
    return activeCombatants[session.currentTurnIndex] ?? null;
  }, [session, activeCombatants]);

  if (!session || !session.isActive) {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crosshair className="size-4 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Combat Tracker
            </p>
          </div>
        </div>
        <Button
          data-ocid={`party.combat.start_button.${partyId}`}
          type="button"
          onClick={() => startCombat(partyId, characters)}
        >
          <Swords className="size-4 mr-1.5" />
          Start Combat
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="size-4 text-primary" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Combat Tracker
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            Round {session.round}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Turn {session.turnCount ?? 0}
          </span>
          <Button
            data-ocid={`party.combat.roll_initiative.${partyId}`}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => rollInitiativeAll(partyId)}
          >
            <Sparkles className="size-3.5 mr-1" />
            Re-roll Initiative
          </Button>
          <Button
            data-ocid={`party.combat.reset_button.${partyId}`}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => resetCombat(partyId, characters)}
          >
            <RotateCcw className="size-3.5 mr-1" />
            Reset
          </Button>
          <Button
            data-ocid={`party.combat.end_turn.${partyId}`}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => endTurn(partyId)}
          >
            <SkipForward className="size-3.5 mr-1" />
            End Turn
          </Button>
          <Button
            data-ocid={`party.combat.end_button.${partyId}`}
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => endCombat(partyId)}
          >
            End Combat
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {session.combatants.map((c, index) => {
          const isCurrent = currentCombatant?.id === c.id;
          return (
            <Card
              key={c.id}
              data-ocid={`party.combat.combatant.${index + 1}`}
              className={cn(
                "transition-all duration-300",
                isCurrent
                  ? "border-primary/60 shadow-[0_0_12px_oklch(var(--primary)/0.25)]"
                  : "border-border",
              )}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 min-w-[2rem]">
                    <span className="text-xs font-mono text-muted-foreground w-5 text-right">
                      {c.initiative}
                    </span>
                    {c.type === "character" ? (
                      <User className="size-3.5 text-primary" />
                    ) : (
                      <Skull className="size-3.5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">
                        {c.name}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                          ACTIVE TURN
                        </span>
                      )}
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium border",
                          c.type === "character"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {c.type === "character" ? "PC" : "NPC"}
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <HpBar hp={c.hp} maxHp={c.maxHp} />
                    </div>
                    {c.conditions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.conditions.map((entry) => {
                          const def = CONDITIONS.find(
                            (x) => x.name === entry.name,
                          );
                          const durationLabel =
                            entry.duration !== null
                              ? ` (${entry.duration}t)`
                              : "";
                          return (
                            <span
                              key={entry.name}
                              className={cn(
                                "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] border font-medium",
                                def?.color ??
                                  "bg-muted text-muted-foreground border-border",
                              )}
                            >
                              {entry.name}
                              {durationLabel}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateCombatant(partyId, c.id, {
                                    conditions: c.conditions.filter(
                                      (e) => e.name !== entry.name,
                                    ),
                                  });
                                }}
                                className="ml-0.5 hover:opacity-70 focus:outline-none"
                                aria-label={`Remove ${entry.name}`}
                              >
                                <X className="size-2.5" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <PartyConditionAdder
                      combatant={c}
                      index={index}
                      onUpdate={(updates) =>
                        updateCombatant(partyId, c.id, updates)
                      }
                    />
                  </div>

                  <Button
                    data-ocid={`party.combat.remove_button.${index + 1}`}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeCombatant(partyId, c.id)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>

                {isCurrent && (
                  <QuickActions
                    combatant={c}
                    onUpdate={(updates) =>
                      updateCombatant(partyId, c.id, updates)
                    }
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showAddNpc ? (
        <AddNpcForm
          onAdd={(npc) => {
            addNpc(partyId, npc);
            setShowAddNpc(false);
          }}
          onCancel={() => setShowAddNpc(false)}
        />
      ) : (
        <Button
          data-ocid={`party.combat.add_npc_button.${partyId}`}
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => setShowAddNpc(true)}
        >
          <Plus className="size-3.5 mr-1" />
          Add NPC
        </Button>
      )}

      <div className="flex items-center justify-between mt-4">
        <Button
          data-ocid={`party.combat.prev_turn.${partyId}`}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => prevTurn(partyId)}
        >
          <ChevronLeft className="size-4 mr-1" />
          Prev Turn
        </Button>
        <span className="text-xs text-muted-foreground">
          {currentCombatant
            ? `${currentCombatant.name}'s turn`
            : "No active combatant"}
        </span>
        <Button
          data-ocid={`party.combat.next_turn.${partyId}`}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => nextTurn(partyId)}
        >
          Next Turn
          <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
