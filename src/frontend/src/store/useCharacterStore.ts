import type {
  Character,
  DomainSpellSlot,
  InventoryItem,
  ViewState,
} from "@/types/character";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CharacterState {
  characters: Character[];
  activeCharacterId: string | null;
  view: ViewState;

  setView: (view: ViewState) => void;
  setActiveCharacter: (id: string | null) => void;
  createCharacter: (
    character: Omit<Character, "id" | "createdAt" | "updatedAt">,
  ) => Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setSpendableArmor: (characterId: string, value: number) => void;
  updateSpellSlot: (characterId: string, domain: string, used: number) => void;
  setSpellSlotTotal: (
    characterId: string,
    domain: string,
    total: number,
  ) => void;
  performShortRest: (characterId: string) => void;
  performLongRest: (characterId: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, _get) => ({
      characters: [],
      activeCharacterId: null,
      view: "list",

      setView: (view) => set({ view }),

      setActiveCharacter: (id) =>
        set({
          activeCharacterId: id,
          view: id ? "sheet" : "list",
        }),

      createCharacter: (character) => {
        const now = Date.now();
        const newCharacter: Character = {
          ...character,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          characters: [...state.characters, newCharacter],
          activeCharacterId: newCharacter.id,
          view: "sheet",
        }));
        return newCharacter;
      },

      updateCharacter: (id, updates) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c,
          ),
        })),

      deleteCharacter: (id) =>
        set((state) => {
          const remaining = state.characters.filter((c) => c.id !== id);
          const nextActive =
            state.activeCharacterId === id
              ? remaining.length > 0
                ? remaining[0].id
                : null
              : state.activeCharacterId;
          return {
            characters: remaining,
            activeCharacterId: nextActive,
            view: nextActive ? "sheet" : "list",
          };
        }),

      setSpendableArmor: (characterId, value) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === characterId
              ? {
                  ...c,
                  spendableArmor: Math.max(0, Math.min(6, value)),
                  updatedAt: Date.now(),
                }
              : c,
          ),
        })),

      updateSpellSlot: (characterId, domain, used) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            const current = c.domainSpellSlots ?? {};
            const slot = current[domain] ?? { total: 3, used: 0 };
            const clamped = Math.max(0, Math.min(slot.total, used));
            return {
              ...c,
              domainSpellSlots: {
                ...current,
                [domain]: { ...slot, used: clamped },
              },
              updatedAt: Date.now(),
            };
          }),
        })),

      setSpellSlotTotal: (characterId, domain, total) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            const current = c.domainSpellSlots ?? {};
            const slot = current[domain] ?? { total: 3, used: 0 };
            const newTotal = Math.max(1, Math.min(10, total));
            return {
              ...c,
              domainSpellSlots: {
                ...current,
                [domain]: {
                  total: newTotal,
                  used: Math.min(slot.used, newTotal),
                },
              },
              updatedAt: Date.now(),
            };
          }),
        })),

      performShortRest: (characterId) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            // Per Daggerheart SRD: short rest restores up to proficiency bonus HP,
            // resets stress to 0, and restores all spendable armor.
            const hpRestored = Math.min(
              c.proficiency,
              c.maxHitPoints - c.hitPoints,
            );
            return {
              ...c,
              hitPoints: c.hitPoints + hpRestored,
              stress: 0,
              spendableArmor: c.armorThreshold ?? 0,
              updatedAt: Date.now(),
            };
          }),
        })),

      performLongRest: (characterId) =>
        set((state) => ({
          characters: state.characters.map((c) => {
            if (c.id !== characterId) return c;
            // Per Daggerheart SRD: long rest restores full HP, all trackers to baseline,
            // resets Hope to 2 (starting value), clears stress, restores spendable armor,
            // and replenishes all domain spell slots.
            const rechargedSlots: Record<string, DomainSpellSlot> = {};
            for (const [domain, slot] of Object.entries(
              c.domainSpellSlots ?? {},
            )) {
              rechargedSlots[domain] = { ...slot, used: 0 };
            }
            return {
              ...c,
              hitPoints: c.maxHitPoints,
              stress: 0,
              hope: 2,
              spendableArmor: c.armorThreshold ?? 0,
              domainSpellSlots: rechargedSlots,
              updatedAt: Date.now(),
            };
          }),
        })),
    }),
    {
      name: "daggerheart-characters",
      version: 1,
    },
  ),
);
