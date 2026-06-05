import type { Character, ConditionEntry } from "@/types/character";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PartyCombatant {
  id: string;
  name: string;
  type: "character" | "npc";
  initiative: number;
  hp: number;
  maxHp: number;
  stress?: number;
  maxStress?: number;
  hope?: number;
  armorSlots?: number;
  armorUsed?: number;
  evasion?: number;
  conditions: ConditionEntry[];
  isActive: boolean;
  characterId?: string;
}

export interface PartyCombatSession {
  partyId: string;
  combatants: PartyCombatant[];
  currentTurnIndex: number;
  round: number;
  turnCount: number;
  isActive: boolean;
}

interface PartyCombatState {
  sessions: Record<string, PartyCombatSession>;
  activePartyId: string | null;

  startCombat: (partyId: string, characters: Character[]) => void;
  addNpc: (partyId: string, npc: Omit<PartyCombatant, "id" | "type">) => void;
  removeCombatant: (partyId: string, id: string) => void;
  updateCombatant: (
    partyId: string,
    id: string,
    updates: Partial<PartyCombatant>,
  ) => void;
  nextTurn: (partyId: string) => void;
  prevTurn: (partyId: string) => void;
  endTurn: (partyId: string) => void;
  resetCombat: (partyId: string, characters: Character[]) => void;
  endCombat: (partyId: string) => void;
  rollInitiativeAll: (partyId: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function characterToCombatant(char: Character): PartyCombatant {
  const agility = char.traits.agility ?? 0;
  const initiative = rollD20() + agility;
  return {
    id: generateId(),
    name: char.name,
    type: "character",
    initiative,
    hp: char.hitPoints,
    maxHp: char.maxHitPoints,
    stress: char.stress,
    maxStress: char.maxStress,
    hope: char.hope,
    armorSlots: char.armorThreshold,
    armorUsed: 0,
    evasion: char.evasion,
    conditions: [] as ConditionEntry[],
    isActive: true,
    characterId: char.id,
  };
}

function sortByInitiative(combatants: PartyCombatant[]): PartyCombatant[] {
  return [...combatants].sort((a, b) => b.initiative - a.initiative);
}

export const usePartyCombatStore = create<PartyCombatState>()(
  persist(
    (set, _get) => ({
      sessions: {},
      activePartyId: null,

      startCombat: (partyId, characters) => {
        const combatants = sortByInitiative(
          characters.map(characterToCombatant),
        );
        const session: PartyCombatSession = {
          partyId,
          combatants,
          currentTurnIndex: 0,
          round: 1,
          turnCount: 0,
          isActive: true,
        };
        set((state) => ({
          sessions: { ...state.sessions, [partyId]: session },
          activePartyId: partyId,
        }));
      },

      addNpc: (partyId, npc) => {
        set((state) => {
          const session = state.sessions[partyId];
          if (!session) return state;
          const newNpc: PartyCombatant = {
            ...npc,
            id: generateId(),
            type: "npc",
            conditions: [],
            isActive: true,
          };
          const combatants = sortByInitiative([...session.combatants, newNpc]);
          return {
            sessions: {
              ...state.sessions,
              [partyId]: { ...session, combatants },
            },
          };
        });
      },

      removeCombatant: (partyId, id) => {
        set((state) => {
          const session = state.sessions[partyId];
          if (!session) return state;
          const combatants = session.combatants.filter((c) => c.id !== id);
          const activeCombatants = combatants.filter((c) => c.isActive);
          let currentTurnIndex = session.currentTurnIndex;
          if (currentTurnIndex >= activeCombatants.length) {
            currentTurnIndex = 0;
          }
          return {
            sessions: {
              ...state.sessions,
              [partyId]: { ...session, combatants, currentTurnIndex },
            },
          };
        });
      },

      updateCombatant: (partyId, id, updates) => {
        set((state) => {
          const session = state.sessions[partyId];
          if (!session) return state;
          const combatants = session.combatants.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          );
          return {
            sessions: {
              ...state.sessions,
              [partyId]: { ...session, combatants },
            },
          };
        });
      },

      nextTurn: (partyId) => {
        set((state) => {
          const session = state.sessions[partyId];
          if (!session || !session.isActive) return state;
          const activeCombatants = session.combatants.filter((c) => c.isActive);
          if (activeCombatants.length === 0) return state;
          let nextIndex = session.currentTurnIndex + 1;
          let nextRound = session.round;
          if (nextIndex >= activeCombatants.length) {
            nextIndex = 0;
            nextRound += 1;
          }
          return {
            sessions: {
              ...state.sessions,
              [partyId]: {
                ...session,
                currentTurnIndex: nextIndex,
                round: nextRound,
              },
            },
          };
        });
      },

      prevTurn: (partyId) => {
        set((state) => {
          const session = state.sessions[partyId];
          if (!session || !session.isActive) return state;
          const activeCombatants = session.combatants.filter((c) => c.isActive);
          if (activeCombatants.length === 0) return state;
          let prevIndex = session.currentTurnIndex - 1;
          let prevRound = session.round;
          if (prevIndex < 0) {
            prevIndex = activeCombatants.length - 1;
            prevRound = Math.max(1, prevRound - 1);
          }
          return {
            sessions: {
              ...state.sessions,
              [partyId]: {
                ...session,
                currentTurnIndex: prevIndex,
                round: prevRound,
              },
            },
          };
        });
      },

      resetCombat: (partyId, characters) => {
        const combatants = sortByInitiative(
          characters.map(characterToCombatant),
        );
        const session: PartyCombatSession = {
          partyId,
          combatants,
          currentTurnIndex: 0,
          round: 1,
          turnCount: 0,
          isActive: true,
        };
        set((state) => ({
          sessions: { ...state.sessions, [partyId]: session },
        }));
      },

      endCombat: (partyId) => {
        set((state) => {
          const { [partyId]: _removed, ...rest } = state.sessions;
          return {
            sessions: rest,
            activePartyId:
              state.activePartyId === partyId ? null : state.activePartyId,
          };
        });
      },

      endTurn: (partyId) => {
        set((state) => {
          const session = state.sessions[partyId];
          if (!session || !session.isActive) return state;
          const activeCombatants = session.combatants.filter((c) => c.isActive);
          if (activeCombatants.length === 0) return state;
          let nextIndex = session.currentTurnIndex + 1;
          let nextRound = session.round;
          if (nextIndex >= activeCombatants.length) {
            nextIndex = 0;
            nextRound += 1;
          }
          const combatants = session.combatants.map((c) => ({
            ...c,
            conditions: c.conditions
              .map((cond) =>
                cond.duration === null
                  ? cond
                  : { ...cond, duration: cond.duration - 1 },
              )
              .filter((cond) => cond.duration === null || cond.duration > 0),
          }));
          return {
            sessions: {
              ...state.sessions,
              [partyId]: {
                ...session,
                combatants,
                currentTurnIndex: nextIndex,
                round: nextRound,
                turnCount: (session.turnCount ?? 0) + 1,
              },
            },
          };
        });
      },

      rollInitiativeAll: (partyId) => {
        set((state) => {
          const session = state.sessions[partyId];
          if (!session) return state;
          const combatants = sortByInitiative(
            session.combatants.map((c) => ({
              ...c,
              initiative: rollD20() + (c.evasion ?? 0),
            })),
          );
          return {
            sessions: {
              ...state.sessions,
              [partyId]: { ...session, combatants, currentTurnIndex: 0 },
            },
          };
        });
      },
    }),
    {
      name: "daggerheart-party-combat",
      version: 1,
    },
  ),
);
