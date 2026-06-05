import type { HomebrewSpell } from "@/types/character";
import { create } from "zustand";
import { persist } from "zustand/middleware";

function generateId(): string {
  return `homebrew-spell-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface HomebrewSpellState {
  spells: HomebrewSpell[];
  addSpell: (
    spell: Omit<HomebrewSpell, "id" | "isHomebrew" | "createdAt"> & {
      createdAt?: number;
    },
  ) => HomebrewSpell;
  updateSpell: (
    id: string,
    updates: Partial<Omit<HomebrewSpell, "id" | "isHomebrew">>,
  ) => void;
  deleteSpell: (id: string) => void;
}

export const useHomebrewSpellStore = create<HomebrewSpellState>()(
  persist(
    (set) => ({
      spells: [],

      addSpell: (spell) => {
        const newSpell: HomebrewSpell = {
          ...spell,
          id: generateId(),
          isHomebrew: true,
          createdAt: spell.createdAt ?? Date.now(),
        };
        set((state) => ({ spells: [...state.spells, newSpell] }));
        return newSpell;
      },

      updateSpell: (id, updates) => {
        set((state) => ({
          spells: state.spells.map((s) =>
            s.id === id ? { ...s, ...updates } : s,
          ),
        }));
      },

      deleteSpell: (id) => {
        set((state) => ({
          spells: state.spells.filter((s) => s.id !== id),
        }));
      },
    }),
    {
      name: "dagger-foundry-homebrew-spells",
    },
  ),
);
