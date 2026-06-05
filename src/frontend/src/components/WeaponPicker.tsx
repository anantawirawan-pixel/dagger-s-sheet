import { Badge } from "@/components/ui/badge";
import { TIER_NAMES, WEAPONS, WEAPON_TIERS, type Weapon } from "@/data/weapons";
import {
  type HomebrewWeapon,
  useHomebrewWeaponStore,
} from "@/stores/useHomebrewWeaponStore";
import { Check, FlaskConical } from "lucide-react";
import { useState } from "react";
import { SelectableCard } from "./SelectableCard";

interface WeaponPickerProps {
  equippedIds: string[];
  onToggle: (id: string) => void;
}

type FilterCategory = "all" | "melee" | "ranged" | "thrown";

type AnyWeapon = Weapon | (HomebrewWeapon & { isHomebrew: true });

function toWeaponCard(w: HomebrewWeapon): AnyWeapon {
  return { ...w, isHomebrew: true as const };
}

function WeaponCard({
  weapon,
  selected,
  onClick,
  ocid,
}: {
  weapon: AnyWeapon;
  selected: boolean;
  onClick: () => void;
  ocid: string;
}) {
  const rangeColor: Record<string, string> = {
    melee: "text-[oklch(0.7_0.25_50)]",
    ranged: "text-[oklch(0.55_0.18_220)]",
    thrown: "text-[oklch(0.6_0.18_165)]",
  };
  const isHomebrew = "isHomebrew" in weapon && weapon.isHomebrew;

  return (
    <SelectableCard
      selected={selected}
      selectionType="weapon-primary"
      onClick={onClick}
      data-ocid={ocid}
      className="relative"
    >
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-display font-bold text-foreground truncate">
                {weapon.name}
              </p>
              {isHomebrew && (
                <Badge
                  variant="outline"
                  className="text-[9px] px-1 py-0 border-primary/40 text-primary shrink-0 flex items-center gap-0.5"
                >
                  <FlaskConical className="size-2" />
                  Homebrew
                </Badge>
              )}
            </div>
            <p
              className={`text-xs font-medium capitalize mt-0.5 ${rangeColor[weapon.range] ?? "text-muted-foreground"}`}
            >
              {weapon.range}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge
              variant="secondary"
              className="text-xs font-mono px-1.5 py-0"
            >
              {weapon.damageDie}
            </Badge>
            {selected && (
              <div className="rounded-full p-0.5 bg-[oklch(0.7_0.25_50/0.25)] text-[oklch(0.7_0.25_50)]">
                <Check className="size-2.5" />
              </div>
            )}
          </div>
        </div>
        {weapon.properties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {weapon.properties.slice(0, 3).map((p) => (
              <span
                key={p}
                className="text-[10px] text-muted-foreground bg-muted/50 rounded px-1 py-0.5"
              >
                {p}
              </span>
            ))}
            {weapon.properties.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{weapon.properties.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </SelectableCard>
  );
}

export function WeaponPicker({ equippedIds, onToggle }: WeaponPickerProps) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [expandedTiers, setExpandedTiers] = useState<Set<number>>(new Set([1]));

  const homebrewWeapons = useHomebrewWeaponStore((s) => s.weapons);

  function toggleTier(tier: number) {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  }

  function filterWeapons<T extends { range: string }>(weapons: T[]): T[] {
    return weapons.filter((w) =>
      filterCategory === "all" ? true : w.range === filterCategory,
    );
  }

  const categoryFilters: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "All" },
    { value: "melee", label: "Melee" },
    { value: "ranged", label: "Ranged" },
    { value: "thrown", label: "Thrown" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Category filter */}
      <div className="flex gap-1">
        {categoryFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            data-ocid={`create.weapon_filter.${f.value}`}
            onClick={() => setFilterCategory(f.value)}
            className={`flex-1 text-[10px] font-medium py-1 rounded transition-smooth ${
              filterCategory === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tiers */}
      <div className="flex flex-col gap-2">
        {WEAPON_TIERS.map((tier) => {
          const srdWeapons = filterWeapons(
            WEAPONS.filter((w) => w.tier === tier),
          );
          const hbWeapons = filterWeapons(
            homebrewWeapons.filter((w) => w.tier === tier).map(toWeaponCard),
          );
          const tierWeapons: AnyWeapon[] = [...srdWeapons, ...hbWeapons];
          if (tierWeapons.length === 0) return null;
          const isExpanded = expandedTiers.has(tier);

          return (
            <div
              key={tier}
              className="rounded-lg border border-border/50 overflow-hidden"
            >
              <button
                type="button"
                data-ocid={`create.weapon_tier.${tier}`}
                onClick={() => toggleTier(tier)}
                className="w-full flex items-center justify-between px-3 py-2 bg-[oklch(0.18_0.07_262/0.6)] hover:bg-[oklch(0.22_0.08_262/0.7)] transition-smooth"
              >
                <span className="text-xs font-display font-bold text-foreground">
                  {TIER_NAMES[tier]}
                </span>
                <div className="flex items-center gap-2">
                  {hbWeapons.length > 0 && (
                    <span className="text-[10px] text-primary/70 flex items-center gap-0.5">
                      <FlaskConical className="size-2.5" />
                      {hbWeapons.length}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {tierWeapons.length} weapons
                  </span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                    {
                      equippedIds.filter((id) =>
                        tierWeapons.some((w) => w.id === id),
                      ).length
                    }{" "}
                    equipped
                  </Badge>
                  <span
                    className={`text-xs text-muted-foreground transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2">
                  {tierWeapons.map((weapon) => (
                    <WeaponCard
                      key={weapon.id}
                      weapon={weapon}
                      selected={equippedIds.includes(weapon.id)}
                      onClick={() => onToggle(weapon.id)}
                      ocid={`create.weapon.${weapon.id}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Tap any weapon to equip or unequip — no limit on selection
      </p>
    </div>
  );
}
