import { Footprints, Shield, X } from "lucide-react";
import React from "react";
import { ARMOR } from "../data/armor";

interface ArmorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentArmorId: string | undefined;
  onSelect: (armorId: string) => void;
}

export function ArmorPicker({
  isOpen,
  onClose,
  currentArmorId,
  onSelect,
}: ArmorPickerProps) {
  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay-bg fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      <div
        className="modal-content-bg card-fantasy rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        aria-label="Equip Armor"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-foreground">Equip Armor</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {ARMOR.map((armor) => {
            const isEquipped = armor.id === currentArmorId;
            return (
              <button
                key={armor.id}
                type="button"
                onClick={() => onSelect(armor.id)}
                className={`card-fantasy rounded-lg p-4 w-full text-left cursor-pointer transition-all hover:ring-2 hover:ring-primary/60 ${isEquipped ? "ring-2 ring-primary shadow-[0_0_12px_2px_oklch(0.6_0.18_264/0.5)]" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-base text-foreground">
                    {armor.name}
                  </span>
                  {isEquipped && (
                    <span className="text-xs text-primary font-semibold">
                      Equipped
                    </span>
                  )}
                </div>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Score {armor.score}
                  </span>
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5" /> Evasion{" "}
                    {armor.evasionMod >= 0 ? "+" : ""}
                    {armor.evasionMod}
                  </span>
                  {armor.agilityPenalty !== 0 && (
                    <span>Agility {armor.agilityPenalty}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
