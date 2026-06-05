import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WEAPONS, type Weapon } from "@/data/weapons";
import {
  type HomebrewWeapon,
  useHomebrewWeaponStore,
} from "@/stores/useHomebrewWeaponStore";
import { Plus, Sword, Target, X } from "lucide-react";
import { useState } from "react";
import { WeaponPicker } from "./WeaponPicker";

const TIER_COLORS: Record<number, string> = {
  1: "bg-muted text-muted-foreground",
  2: "bg-secondary/20 text-secondary-foreground border-secondary/40",
  3: "bg-primary/20 text-primary border-primary/40",
  4: "bg-accent/30 text-accent-foreground border-accent/50",
};

const TIER_LABELS: Record<number, string> = {
  1: "Tier I",
  2: "Tier II",
  3: "Tier III",
  4: "Tier IV",
};

function RangeIcon({ range }: { range: Weapon["range"] }) {
  if (range === "ranged") return <Target className="size-3" />;
  if (range === "thrown") return <Target className="size-3 rotate-45" />;
  return <Sword className="size-3" />;
}

function WeaponCard({
  weapon,
  compact = false,
}: { weapon: Weapon; compact?: boolean }) {
  const tierCls = TIER_COLORS[weapon.tier] ?? TIER_COLORS[1];
  return (
    <div className={compact ? "flex flex-col gap-1" : "flex flex-col gap-2"}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={
            compact
              ? "font-display text-sm font-bold text-foreground"
              : "font-display text-base font-bold text-foreground"
          }
        >
          {weapon.name}
        </span>
        <Badge variant="outline" className={`text-xs px-1.5 py-0 ${tierCls}`}>
          {TIER_LABELS[weapon.tier]}
        </Badge>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="secondary"
          className="text-xs gap-1 px-2 py-0.5 font-mono font-bold"
        >
          {weapon.damageDie}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
          <RangeIcon range={weapon.range} />
          {weapon.range}
        </span>
      </div>
      {!compact && weapon.properties.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {weapon.properties.map((p) => (
            <span
              key={p}
              className="text-[10px] bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface WeaponDisplayProps {
  equippedWeaponIds: string[];
  onChangeWeapons: (ids: string[]) => void;
}

export function WeaponDisplay({
  equippedWeaponIds,
  onChangeWeapons,
}: WeaponDisplayProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const homebrewWeapons = useHomebrewWeaponStore((s) => s.weapons);

  function resolveWeapon(id: string): Weapon | HomebrewWeapon | undefined {
    return (
      (WEAPONS.find((w) => w.id === id) as Weapon | undefined) ??
      homebrewWeapons.find((w) => w.id === id)
    );
  }

  function handleToggle(id: string) {
    if (equippedWeaponIds.includes(id)) {
      onChangeWeapons(equippedWeaponIds.filter((eid) => eid !== id));
    } else {
      onChangeWeapons([...equippedWeaponIds, id]);
    }
  }

  function handleRemove(id: string) {
    onChangeWeapons(equippedWeaponIds.filter((eid) => eid !== id));
  }

  const equippedWeapons = equippedWeaponIds
    .map((id) => resolveWeapon(id))
    .filter((w): w is Weapon | HomebrewWeapon => w !== undefined);

  return (
    <Card className="card-fantasy">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          <Sword className="size-4 text-primary" />
          Weapons
          <span className="ml-auto text-xs text-muted-foreground font-normal">
            {equippedWeapons.length} equipped
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {pickerOpen ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm font-bold text-foreground">
                Select Weapons
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6"
                onClick={() => setPickerOpen(false)}
              >
                <X className="size-3" />
              </Button>
            </div>
            <WeaponPicker
              equippedIds={equippedWeaponIds}
              onToggle={handleToggle}
            />
          </div>
        ) : (
          <>
            {equippedWeapons.length > 0 ? (
              <ScrollArea className="max-h-72">
                <div className="flex flex-col gap-2 pr-2">
                  {equippedWeapons.map((weapon) => (
                    <div
                      key={weapon.id}
                      data-ocid={`weapons.equipped.${weapon.id}`}
                      className="rounded-lg border border-primary/30 bg-primary/5 p-3 flex items-start gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <WeaponCard weapon={weapon as Weapon} compact={false} />
                      </div>
                      <Button
                        type="button"
                        data-ocid={`weapons.remove.${weapon.id}`}
                        variant="ghost"
                        size="icon"
                        className="size-6 text-destructive shrink-0 mt-0.5"
                        onClick={() => handleRemove(weapon.id)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div
                data-ocid="weapons.empty_state"
                className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center text-xs text-muted-foreground"
              >
                No weapons equipped — tap Add Weapon to select
              </div>
            )}
            <Button
              type="button"
              data-ocid="weapons.add_button"
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => setPickerOpen(true)}
            >
              <Plus className="size-3.5" />
              Add Weapon
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
