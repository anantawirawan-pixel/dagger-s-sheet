import type { Community } from "@/types/character";

export const COMMUNITIES: Community[] = [
  {
    id: "highborne",
    name: "Highborne",
    description:
      "Born into privilege and power, the Highborne navigate courts and councils with natural authority.",
    feature: {
      name: "Noble Upbringing",
      description:
        "Your noble upbringing grants you social advantage. You have advantage on Presence checks when dealing with nobility, officials, or those of high social standing.",
    },
  },
  {
    id: "loreborne",
    name: "Loreborne",
    description:
      "Raised among scrolls, libraries, and academies, the Loreborne are walking repositories of knowledge.",
    feature: {
      name: "Vast Scholarly Knowledge",
      description:
        "Your vast scholarly knowledge gives you advantage on Knowledge checks to recall information about history, magic, creatures, or legends.",
    },
  },
  {
    id: "orderborne",
    name: "Orderborne",
    description:
      "Trained in barracks and battlefields, the Orderborne live by discipline, duty, and chain of command.",
    feature: {
      name: "Military Discipline",
      description:
        "Your military and guard discipline and training grant you advantage on saves against being frightened, and you can use a bonus action to grant an ally within 30 feet advantage on their next attack roll.",
    },
  },
  {
    id: "ridgeborne",
    name: "Ridgeborne",
    description:
      "Hardened by mountain winds and stone, the Ridgeborne are as unyielding as the peaks they call home.",
    feature: {
      name: "Stone Sense",
      description:
        "Your mountain survival and stone sense let you navigate difficult mountain terrain without penalty, and you have advantage on Instinct checks to detect structural weaknesses or hidden passages in stone.",
    },
  },
  {
    id: "seaborne",
    name: "Seaborne",
    description:
      "Children of the tide and wind, the Seaborne know the sea's moods better than their own.",
    feature: {
      name: "Nautical Expertise",
      description:
        "Your nautical expertise and water affinity grant you a swim speed equal to your walking speed, and you have advantage on Agility checks to maintain balance on unstable surfaces or aboard ships.",
    },
  },
  {
    id: "slyborne",
    name: "Slyborne",
    description:
      "Thriving in the shadows of civilization, the Slyborne know every back alley and secret deal.",
    feature: {
      name: "Street Cunning",
      description:
        "Your underworld connections and street cunning give you advantage on Instinct checks to gather information in urban environments, and you can always find a fence or black market contact in any settlement.",
    },
  },
  {
    id: "underborne",
    name: "Underborne",
    description:
      "Born beneath the surface world, the Underborne are at home in tunnels, caves, and endless dark.",
    feature: {
      name: "Darkvision",
      description:
        "Your life underground grants darkvision out to 120 feet and tunnel sense. You have advantage on Instinct checks to navigate underground and detect hidden passages or traps in tunnels.",
    },
  },
  {
    id: "wanderborne",
    name: "Wanderborne",
    description:
      "Never staying in one place long, the Wanderborne carry their homes on their backs and their stories in their hearts.",
    feature: {
      name: "Nomadic Adaptability",
      description:
        "Your nomadic lifestyle grants adaptability. You cannot become lost by non-magical means, and you have advantage on Knowledge checks to identify edible plants, safe water, or weather patterns.",
    },
  },
  {
    id: "wildborne",
    name: "Wildborne",
    description:
      "Raised by beasts and forests, the Wildborne speak the language of the untamed world.",
    feature: {
      name: "Animal Kinship",
      description:
        "Your upbringing in nature grants animal kinship. You can communicate simple ideas with beasts, and you have advantage on Presence checks to calm or befriend animals.",
    },
  },
];
