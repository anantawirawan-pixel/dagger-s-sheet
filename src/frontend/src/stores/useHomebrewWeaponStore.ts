import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WeaponDamageDie =
  | "d4"
  | "d6"
  | "d8"
  | "d10"
  | "d12"
  | "2d4"
  | "2d6"
  | "2d8"
  | "2d10"
  | "2d12";

export type HomebrewWeaponSlot = "primary" | "secondary" | "both";
export type HomebrewWeaponRange = "melee" | "ranged" | "thrown";
export type HomebrewWeaponTier = 1 | 2 | 3 | 4;

export interface HomebrewWeapon {
  id: string;
  name: string;
  damageDie: string; // e.g. "d6", "2d8"
  tier: HomebrewWeaponTier;
  slot: HomebrewWeaponSlot;
  range: HomebrewWeaponRange;
  properties: string[];
  description?: string;
  createdAt: number;
}

function generateId(): string {
  return `homebrew-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface HomebrewWeaponState {
  weapons: HomebrewWeapon[];
  addHomebrewWeapon: (
    weapon: Omit<HomebrewWeapon, "id" | "createdAt">,
  ) => HomebrewWeapon;
  updateHomebrewWeapon: (
    id: string,
    updates: Partial<Omit<HomebrewWeapon, "id" | "createdAt">>,
  ) => void;
  deleteHomebrewWeapon: (id: string) => void;
}

export const useHomebrewWeaponStore = create<HomebrewWeaponState>()(
  persist(
    (set) => ({
      weapons: [],

      addHomebrewWeapon: (weapon) => {
        const newWeapon: HomebrewWeapon = {
          ...weapon,
          id: generateId(),
          createdAt: Date.now(),
        };
        set((state) => ({ weapons: [...state.weapons, newWeapon] }));
        return newWeapon;
      },

      updateHomebrewWeapon: (id, updates) => {
        set((state) => ({
          weapons: state.weapons.map((w) =>
            w.id === id ? { ...w, ...updates } : w,
          ),
        }));
      },

      deleteHomebrewWeapon: (id) => {
        set((state) => ({
          weapons: state.weapons.filter((w) => w.id !== id),
        }));
      },
    }),
    {
      name: "dagger-foundry-homebrew-weapons",
    },
  ),
);
