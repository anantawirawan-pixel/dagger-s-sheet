import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HomebrewCommunityEntry {
  id: string;
  name: string;
  description: string;
  featureName: string;
  feature: string;
  isHomebrew: true;
}

function generateId(): string {
  return `homebrew-community-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface HomebrewCommunityState {
  homebrewCommunities: HomebrewCommunityEntry[];
  addCommunity: (
    entry: Omit<HomebrewCommunityEntry, "id" | "isHomebrew">,
  ) => void;
  updateCommunity: (
    id: string,
    updates: Partial<Omit<HomebrewCommunityEntry, "id" | "isHomebrew">>,
  ) => void;
  removeCommunity: (id: string) => void;
}

export const useHomebrewCommunityStore = create<HomebrewCommunityState>()(
  persist(
    (set) => ({
      homebrewCommunities: [],

      addCommunity: (entry) => {
        const newEntry: HomebrewCommunityEntry = {
          ...entry,
          id: generateId(),
          isHomebrew: true,
        };
        set((state) => ({
          homebrewCommunities: [...state.homebrewCommunities, newEntry],
        }));
      },

      updateCommunity: (id, updates) => {
        set((state) => ({
          homebrewCommunities: state.homebrewCommunities.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        }));
      },

      removeCommunity: (id) => {
        set((state) => ({
          homebrewCommunities: state.homebrewCommunities.filter(
            (c) => c.id !== id,
          ),
        }));
      },
    }),
    {
      name: "homebrew-communities",
    },
  ),
);
