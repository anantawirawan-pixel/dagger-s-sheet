import type { Party } from "@/types/character";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PartyState {
  parties: Party[];

  createParty: (name: string, memberIds: string[]) => Party;
  updateParty: (id: string, updates: Partial<Party>) => void;
  deleteParty: (id: string) => void;
  updatePartyNotes: (partyId: string, notes: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const usePartyStore = create<PartyState>()(
  persist(
    (set) => ({
      parties: [],

      createParty: (name, memberIds) => {
        const newParty: Party = {
          id: generateId(),
          name,
          memberIds,
        };
        set((state) => ({
          parties: [...state.parties, newParty],
        }));
        return newParty;
      },

      updateParty: (id, updates) =>
        set((state) => ({
          parties: state.parties.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      deleteParty: (id) =>
        set((state) => ({
          parties: state.parties.filter((p) => p.id !== id),
        })),

      updatePartyNotes: (partyId, notes) =>
        set((state) => ({
          parties: state.parties.map((p) =>
            p.id === partyId ? { ...p, notes } : p,
          ),
        })),
    }),
    {
      name: "daggerheart-parties",
      version: 1,
    },
  ),
);
