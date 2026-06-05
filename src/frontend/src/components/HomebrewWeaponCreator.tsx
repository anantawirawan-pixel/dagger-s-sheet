import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClickSound } from "@/hooks/useClickSound";
import {
  type HomebrewWeapon,
  type HomebrewWeaponRange,
  type HomebrewWeaponSlot,
  type HomebrewWeaponTier,
  type WeaponDamageDie,
  useHomebrewWeaponStore,
} from "@/stores/useHomebrewWeaponStore";
import { Edit2, FlaskConical, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

const DAMAGE_DICE: WeaponDamageDie[] = [
  "d4",
  "d6",
  "d8",
  "d10",
  "d12",
  "2d4",
  "2d6",
  "2d8",
  "2d10",
  "2d12",
];
const TIERS: HomebrewWeaponTier[] = [1, 2, 3, 4];
const SLOTS: HomebrewWeaponSlot[] = ["primary", "secondary", "both"];
const RANGES: HomebrewWeaponRange[] = ["melee", "ranged", "thrown"];

const RANGE_COLORS: Record<HomebrewWeaponRange, string> = {
  melee: "text-[oklch(0.7_0.25_50)]",
  ranged: "text-[oklch(0.55_0.18_220)]",
  thrown: "text-[oklch(0.6_0.18_165)]",
};

const TIER_COLORS: Record<HomebrewWeaponTier, string> = {
  1: "border-border/60",
  2: "border-[oklch(0.6_0.18_165/0.5)]",
  3: "border-[oklch(0.55_0.18_280/0.5)]",
  4: "border-[oklch(0.7_0.25_50/0.6)]",
};

interface FormState {
  name: string;
  damageDie: WeaponDamageDie;
  tier: HomebrewWeaponTier;
  slot: HomebrewWeaponSlot;
  range: HomebrewWeaponRange;
  properties: string[];
  description: string;
}

const DEFAULT_FORM: FormState = {
  name: "",
  damageDie: "d6",
  tier: 1,
  slot: "both",
  range: "melee",
  properties: [],
  description: "",
};

function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  function addTag(raw: string) {
    const trimmed = raw.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-wrap gap-1.5 min-h-[38px] rounded-md border border-input bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-primary/50">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-primary/15 text-primary text-[11px] font-medium rounded px-1.5 py-0.5"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-primary/60 hover:text-primary transition-colors"
            aria-label={`Remove ${tag}`}
          >
            <X className="size-2.5" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (inputValue.trim()) addTag(inputValue);
        }}
        placeholder={tags.length === 0 ? "Type and press Enter or comma…" : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        data-ocid="homebrew.property_input"
      />
    </div>
  );
}

function SelectField<T extends string | number>({
  label,
  value,
  options,
  onChange,
  ocid,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  ocid: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            data-ocid={`${ocid}.${String(opt.value)}`}
            onClick={() => onChange(opt.value)}
            className={`text-xs rounded px-2.5 py-1 border transition-smooth ${
              value === opt.value
                ? "border-primary/60 bg-primary/15 text-primary font-semibold shadow-[0_0_8px_oklch(var(--primary)/0.2)]"
                : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function WeaponFormCard({
  editingWeapon,
  onSave,
  onCancel,
}: {
  editingWeapon: HomebrewWeapon | null;
  onSave: (form: FormState) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    editingWeapon
      ? {
          name: editingWeapon.name,
          damageDie: editingWeapon.damageDie as WeaponDamageDie,
          tier: editingWeapon.tier,
          slot: editingWeapon.slot,
          range: editingWeapon.range,
          properties: [...editingWeapon.properties],
          description: editingWeapon.description ?? "",
        }
      : { ...DEFAULT_FORM },
  );

  const isValid = form.name.trim().length > 0;

  return (
    <Card className="card-fantasy border-primary/30 shadow-[0_0_16px_oklch(var(--primary)/0.12)] bg-[oklch(0.16_0.07_262/0.9)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
          <FlaskConical className="size-4 text-primary" />
          {editingWeapon ? "Edit Weapon" : "Forge a New Weapon"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="hb-name"
            className="text-xs font-medium text-muted-foreground"
          >
            Weapon Name
          </Label>
          <Input
            id="hb-name"
            data-ocid="homebrew.name_input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Wraithblade, Ember Axe…"
            className="text-sm"
          />
        </div>

        {/* Damage Die + Tier row */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Damage Die"
            value={form.damageDie}
            options={DAMAGE_DICE.map((d) => ({ value: d, label: d }))}
            onChange={(v) => setForm((f) => ({ ...f, damageDie: v }))}
            ocid="homebrew.damage_die"
          />
          <SelectField
            label="Tier"
            value={form.tier}
            options={TIERS.map((t) => ({ value: t, label: String(t) }))}
            onChange={(v) => setForm((f) => ({ ...f, tier: v }))}
            ocid="homebrew.tier"
          />
        </div>

        {/* Slot */}
        <SelectField
          label="Slot"
          value={form.slot}
          options={SLOTS.map((s) => ({
            value: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
          }))}
          onChange={(v) => setForm((f) => ({ ...f, slot: v }))}
          ocid="homebrew.slot"
        />

        {/* Range */}
        <SelectField
          label="Range"
          value={form.range}
          options={RANGES.map((r) => ({
            value: r,
            label: r.charAt(0).toUpperCase() + r.slice(1),
          }))}
          onChange={(v) => setForm((f) => ({ ...f, range: v }))}
          ocid="homebrew.range"
        />

        {/* Properties */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">
            Properties
            <span className="ml-1 text-muted-foreground/60">
              (press Enter or comma to add)
            </span>
          </Label>
          <TagInput
            tags={form.properties}
            onChange={(tags) => setForm((f) => ({ ...f, properties: tags }))}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="hb-desc"
            className="text-xs font-medium text-muted-foreground"
          >
            Description{" "}
            <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <Textarea
            id="hb-desc"
            data-ocid="homebrew.description_input"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Lore or special rules for this weapon…"
            className="text-sm resize-none"
            rows={2}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            data-ocid="homebrew.save_button"
            size="sm"
            className="flex-1"
            disabled={!isValid}
            onClick={() => onSave(form)}
          >
            {editingWeapon ? "Save Changes" : "Forge Weapon"}
          </Button>
          <Button
            type="button"
            data-ocid="homebrew.cancel_button"
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function HomebrewWeaponCreator() {
  const {
    weapons,
    addHomebrewWeapon,
    updateHomebrewWeapon,
    deleteHomebrewWeapon,
  } = useHomebrewWeaponStore();
  const { play } = useClickSound();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingWeapon = editingId
    ? (weapons.find((w) => w.id === editingId) ?? null)
    : null;

  function handleSave(form: FormState) {
    play("weapon");
    if (editingId) {
      updateHomebrewWeapon(editingId, {
        name: form.name.trim(),
        damageDie: form.damageDie,
        tier: form.tier,
        slot: form.slot,
        range: form.range,
        properties: form.properties,
        description: form.description.trim() || undefined,
      });
      setEditingId(null);
    } else {
      addHomebrewWeapon({
        name: form.name.trim(),
        damageDie: form.damageDie,
        tier: form.tier,
        slot: form.slot,
        range: form.range,
        properties: form.properties,
        description: form.description.trim() || undefined,
      });
      setShowForm(false);
    }
  }

  function handleDelete(id: string) {
    play("weapon");
    deleteHomebrewWeapon(id);
  }

  function handleEdit(id: string) {
    play("generic");
    setEditingId(id);
    setShowForm(false);
  }

  function handleAdd() {
    play("generic");
    setEditingId(null);
    setShowForm(true);
  }

  const isFormOpen = showForm || editingId !== null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title text-lg flex items-center gap-2">
            <FlaskConical className="size-5 text-primary" />
            Weapon Forge
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Craft custom weapons to use alongside SRD equipment.
          </p>
        </div>
        {!isFormOpen && (
          <Button
            type="button"
            data-ocid="homebrew.add_button"
            size="sm"
            onClick={handleAdd}
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            New Weapon
          </Button>
        )}
      </div>

      {/* Form */}
      {isFormOpen && (
        <WeaponFormCard
          editingWeapon={editingWeapon}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}

      {/* Weapon Grid */}
      {weapons.length === 0 && !isFormOpen ? (
        <div
          data-ocid="homebrew.empty_state"
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <FlaskConical className="size-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground font-medium mb-1">
            No homebrew weapons yet
          </p>
          <p className="text-xs text-muted-foreground/70">
            Forge your first custom weapon to wield in battle.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {weapons.map((weapon, i) => (
            <Card
              key={weapon.id}
              data-ocid={`homebrew.item.${i + 1}`}
              className={`card-fantasy transition-smooth border bg-[oklch(0.18_0.07_262/0.6)] ${
                TIER_COLORS[weapon.tier]
              } ${editingId === weapon.id ? "opacity-50 pointer-events-none" : ""}`}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-display font-bold text-foreground truncate">
                        {weapon.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 border-primary/40 text-primary"
                      >
                        Homebrew
                      </Badge>
                    </div>
                    <p
                      className={`text-xs font-medium capitalize mt-0.5 ${RANGE_COLORS[weapon.range]}`}
                    >
                      {weapon.range} · Tier {weapon.tier}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge
                      variant="secondary"
                      className="text-xs font-mono px-1.5 py-0"
                    >
                      {weapon.damageDie}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 py-0 border-border/40 text-muted-foreground capitalize"
                    >
                      {weapon.slot}
                    </Badge>
                  </div>
                </div>

                {weapon.properties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {weapon.properties.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] text-muted-foreground bg-muted/50 rounded px-1 py-0.5"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}

                {weapon.description && (
                  <p className="text-[11px] text-muted-foreground/80 mt-1.5 italic line-clamp-2">
                    {weapon.description}
                  </p>
                )}

                <div className="flex gap-1.5 mt-2.5">
                  <Button
                    type="button"
                    data-ocid={`homebrew.edit_button.${i + 1}`}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => handleEdit(weapon.id)}
                  >
                    <Edit2 className="size-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    data-ocid={`homebrew.delete_button.${i + 1}`}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(weapon.id)}
                  >
                    <Trash2 className="size-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
