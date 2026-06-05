import type { ArmorItem } from "@/types/character";

export const ARMOR: ArmorItem[] = [
  {
    id: "gambeson",
    name: "Gambeson",
    score: 3,
    evasionMod: 1,
    agilityPenalty: 0,
    description:
      "A padded cloth armor worn beneath other protection. Light and flexible.",
  },
  {
    id: "leather",
    name: "Leather",
    score: 3,
    evasionMod: 0,
    agilityPenalty: 0,
    description:
      "Hardened leather armor that offers basic protection without hindering movement.",
  },
  {
    id: "chainmail",
    name: "Chainmail",
    score: 4,
    evasionMod: -1,
    agilityPenalty: 0,
    description:
      "Interlocking metal rings providing solid protection at the cost of some mobility.",
  },
  {
    id: "full-plate",
    name: "Full Plate",
    score: 4,
    evasionMod: -2,
    agilityPenalty: -1,
    description:
      "Heavy plate armor offering maximum protection but severely limiting agility.",
  },
];
