import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HomebrewAncestryEntry {
  id: string;
  name: string;
  description: string;
  featureName: string;
  feature: string;
  isHomebrew: true;
  artUrl?: string;
}

function generateId(): string {
  return `homebrew-ancestry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface HomebrewAncestryState {
  homebrewAncestries: HomebrewAncestryEntry[];
  addAncestry: (
    entry: Omit<HomebrewAncestryEntry, "id" | "isHomebrew">,
  ) => void;
  updateAncestry: (
    id: string,
    updates: Partial<Omit<HomebrewAncestryEntry, "id" | "isHomebrew">>,
  ) => void;
  removeAncestry: (id: string) => void;
}

export const useHomebrewAncestryStore = create<HomebrewAncestryState>()(
  persist(
    (set) => ({
      homebrewAncestries: [],

      addAncestry: (entry) => {
        const newEntry: HomebrewAncestryEntry = {
          ...entry,
          id: generateId(),
          isHomebrew: true,
        };
        set((state) => ({
          homebrewAncestries: [...state.homebrewAncestries, newEntry],
        }));
      },

      updateAncestry: (id, updates) => {
        set((state) => ({
          homebrewAncestries: state.homebrewAncestries.map((a) =>
            a.id === id ? { ...a, ...updates } : a,
          ),
        }));
      },

      removeAncestry: (id) => {
        set((state) => ({
          homebrewAncestries: state.homebrewAncestries.filter(
            (a) => a.id !== id,
          ),
        }));
      },
    }),
    {
      name: "homebrew-ancestries",
    },
  ),
);
