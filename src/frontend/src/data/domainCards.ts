import type { DomainCard } from "@/types/character";

export const DOMAIN_CARDS: DomainCard[] = [
  // Arcana
  {
    id: "arcana-1",
    name: "Arcane Shield",
    domain: "Arcana",
    level: 1,
    type: "reaction",
    description:
      "When you or an ally within 30 feet is hit by an attack, you can use your reaction to impose disadvantage on the attack roll.",
  },
  {
    id: "arcana-2",
    name: "Mystic Bolt",
    domain: "Arcana",
    level: 1,
    type: "action",
    description:
      "As an action, hurl a bolt of arcane energy at a target within 120 feet. The target takes 2d8 force damage.",
  },
  {
    id: "arcana-3",
    name: "Spellweave",
    domain: "Arcana",
    level: 2,
    type: "feature",
    description:
      "When you cast a spell, you can choose one creature within 30 feet to gain temporary hit points equal to your proficiency bonus.",
  },
  {
    id: "arcana-4",
    name: "Arcane Surge",
    domain: "Arcana",
    level: 2,
    type: "action",
    description:
      "As an action, unleash a surge of raw magic in a 15-foot cone. Creatures must make a Dex save or take 3d6 force damage.",
  },
  {
    id: "arcana-5",
    name: "Leyline Tap",
    domain: "Arcana",
    level: 3,
    type: "feature",
    description:
      "Once per long rest, you can regain a spell slot of 2nd level or lower as a bonus action.",
  },
  {
    id: "arcana-6",
    name: "Counterspell",
    domain: "Arcana",
    level: 3,
    type: "reaction",
    description:
      "When a creature within 60 feet casts a spell, you can use your reaction to interrupt it. The caster must succeed on a spellcasting check or the spell fails.",
  },

  // Blade
  {
    id: "blade-1",
    name: "Parry",
    domain: "Blade",
    level: 1,
    type: "reaction",
    description:
      "When a creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC against that attack.",
  },
  {
    id: "blade-2",
    name: "Cleave",
    domain: "Blade",
    level: 1,
    type: "action",
    description:
      "As an action, make a melee attack against two adjacent creatures within your reach.",
  },
  {
    id: "blade-3",
    name: "Blade Dance",
    domain: "Blade",
    level: 2,
    type: "feature",
    description:
      "When you take the Attack action, you can move up to half your speed between attacks without provoking opportunity attacks.",
  },
  {
    id: "blade-4",
    name: "Whirlwind Strike",
    domain: "Blade",
    level: 2,
    type: "action",
    description:
      "As an action, make a melee attack against every creature within 5 feet of you.",
  },
  {
    id: "blade-5",
    name: "Blade Mastery",
    domain: "Blade",
    level: 3,
    type: "feature",
    description:
      "Your weapon attacks score a critical hit on a roll of 19 or 20.",
  },
  {
    id: "blade-6",
    name: "Executioner's Blow",
    domain: "Blade",
    level: 3,
    type: "action",
    description:
      "As an action, make a melee attack with advantage. On a hit, the target takes an extra 2d10 damage.",
  },

  // Bone
  {
    id: "bone-1",
    name: "Grim Harvest",
    domain: "Bone",
    level: 1,
    type: "feature",
    description:
      "When you reduce a creature to 0 HP, you regain hit points equal to your proficiency bonus.",
  },
  {
    id: "bone-2",
    name: "Withering Touch",
    domain: "Bone",
    level: 1,
    type: "action",
    description:
      "As an action, touch a creature. It must make a Con save or take 2d8 necrotic damage and its speed is halved until your next turn.",
  },
  {
    id: "bone-3",
    name: "Death Ward",
    domain: "Bone",
    level: 2,
    type: "reaction",
    description:
      "When you or an ally within 30 feet would drop to 0 HP, you can use your reaction to instead drop to 1 HP.",
  },
  {
    id: "bone-4",
    name: "Raise Dead",
    domain: "Bone",
    level: 2,
    type: "action",
    description:
      "As an action, raise a corpse within 30 feet as a skeleton or zombie under your control for 1 minute.",
  },
  {
    id: "bone-5",
    name: "Soul Drain",
    domain: "Bone",
    level: 3,
    type: "action",
    description:
      "As an action, target a creature within 60 feet. It must make a Con save or take 4d8 necrotic damage. You heal for half the damage dealt.",
  },
  {
    id: "bone-6",
    name: "Undying",
    domain: "Bone",
    level: 3,
    type: "feature",
    description:
      "When you would die, you can choose to instead drop to 1 HP and become immune to all damage until the end of your next turn. Once per long rest.",
  },

  // Codex
  {
    id: "codex-1",
    name: "Lorekeeper",
    domain: "Codex",
    level: 1,
    type: "feature",
    description:
      "You have advantage on Intelligence checks to recall information about creatures, history, or magic.",
  },
  {
    id: "codex-2",
    name: "Tactical Analysis",
    domain: "Codex",
    level: 1,
    type: "action",
    description:
      "As an action, study a creature within 60 feet. You learn its AC, current HP, and one vulnerability or resistance.",
  },
  {
    id: "codex-3",
    name: "Codex Recall",
    domain: "Codex",
    level: 2,
    type: "feature",
    description:
      "Once per short rest, you can replace one skill check with your Intelligence modifier + proficiency bonus.",
  },
  {
    id: "codex-4",
    name: "Ancient Words",
    domain: "Codex",
    level: 2,
    type: "action",
    description:
      "As an action, speak a word of power. Creatures of your choice within 30 feet must make a Wis save or be stunned until the end of your next turn.",
  },
  {
    id: "codex-5",
    name: "Encyclopedic Mind",
    domain: "Codex",
    level: 3,
    type: "feature",
    description:
      "You gain proficiency in all Intelligence-based skills. If already proficient, you gain expertise.",
  },
  {
    id: "codex-6",
    name: "True Name",
    domain: "Codex",
    level: 3,
    type: "action",
    description:
      "As an action, speak a creature's true name. It must make a Cha save or be charmed by you for 1 minute.",
  },

  // Grace
  {
    id: "grace-1",
    name: "Soothing Light",
    domain: "Grace",
    level: 1,
    type: "action",
    description:
      "As an action, restore 1d8 + your spellcasting modifier hit points to a creature within 30 feet.",
  },
  {
    id: "grace-2",
    name: "Blessing",
    domain: "Grace",
    level: 1,
    type: "action",
    description:
      "As an action, bless up to three creatures within 30 feet. They add a d4 to attack rolls and saves for 1 minute.",
  },
  {
    id: "grace-3",
    name: "Sanctuary",
    domain: "Grace",
    level: 2,
    type: "reaction",
    description:
      "When a creature within 30 feet is targeted by an attack, you can use your reaction to impose disadvantage on the attack.",
  },
  {
    id: "grace-4",
    name: "Mass Healing",
    domain: "Grace",
    level: 2,
    type: "action",
    description:
      "As an action, up to six creatures within 30 feet regain hit points equal to 1d8 + your spellcasting modifier.",
  },
  {
    id: "grace-5",
    name: "Revive",
    domain: "Grace",
    level: 3,
    type: "action",
    description:
      "As an action, touch a creature that has died within the last minute. It returns to life with 1 hit point.",
  },
  {
    id: "grace-6",
    name: "Divine Aura",
    domain: "Grace",
    level: 3,
    type: "feature",
    description:
      "You and friendly creatures within 10 feet gain resistance to necrotic and radiant damage.",
  },

  // Midnight
  {
    id: "midnight-1",
    name: "Shadow Step",
    domain: "Midnight",
    level: 1,
    type: "action",
    description:
      "As an action, teleport up to 30 feet to an unoccupied space you can see that is in dim light or darkness.",
  },
  {
    id: "midnight-2",
    name: "Veil of Shadows",
    domain: "Midnight",
    level: 1,
    type: "reaction",
    description:
      "When you are targeted by an attack, you can use your reaction to become heavily obscured until the start of your next turn.",
  },
  {
    id: "midnight-3",
    name: "Darkvision",
    domain: "Midnight",
    level: 2,
    type: "feature",
    description:
      "You gain darkvision out to 120 feet. If you already have darkvision, its range increases by 60 feet.",
  },
  {
    id: "midnight-4",
    name: "Nightmare",
    domain: "Midnight",
    level: 2,
    type: "action",
    description:
      "As an action, target a creature within 60 feet. It must make a Wis save or be frightened of you for 1 minute.",
  },
  {
    id: "midnight-5",
    name: "Umbral Form",
    domain: "Midnight",
    level: 3,
    type: "feature",
    description:
      "As a bonus action, you can become incorporeal for 1 minute. You can move through creatures and objects.",
  },
  {
    id: "midnight-6",
    name: "Consume Light",
    domain: "Midnight",
    level: 3,
    type: "action",
    description:
      "As an action, magical and nonmagical light within 30 feet is extinguished for 1 minute.",
  },

  // Sage
  {
    id: "sage-1",
    name: "Insight",
    domain: "Sage",
    level: 1,
    type: "feature",
    description:
      "You have advantage on Insight checks, and you can use your reaction to add your proficiency bonus to an ally's Wisdom check.",
  },
  {
    id: "sage-2",
    name: "Guidance",
    domain: "Sage",
    level: 1,
    type: "action",
    description:
      "As an action, touch a willing creature. Once within the next minute, it can add a d4 to one ability check.",
  },
  {
    id: "sage-3",
    name: "Precognition",
    domain: "Sage",
    level: 2,
    type: "reaction",
    description:
      "When a creature you can see makes an attack roll, you can use your reaction to impose advantage or disadvantage on the roll.",
  },
  {
    id: "sage-4",
    name: "Commune",
    domain: "Sage",
    level: 2,
    type: "action",
    description:
      "As an action, you can mentally ask a single question and receive a truthful answer from a higher power.",
  },
  {
    id: "sage-5",
    name: "Foresight",
    domain: "Sage",
    level: 3,
    type: "feature",
    description:
      "You cannot be surprised, and attack rolls against you have disadvantage.",
  },
  {
    id: "sage-6",
    name: "Mind Blank",
    domain: "Sage",
    level: 3,
    type: "action",
    description:
      "As an action, you become immune to psychic damage and any effect that would sense your emotions or read your thoughts for 24 hours.",
  },

  // Splendor
  {
    id: "splendor-1",
    name: "Dazzling Display",
    domain: "Splendor",
    level: 1,
    type: "action",
    description:
      "As an action, each creature of your choice within 30 feet must make a Wis save or be charmed by you for 1 minute.",
  },
  {
    id: "splendor-2",
    name: "Inspiring Presence",
    domain: "Splendor",
    level: 1,
    type: "feature",
    description:
      "Friendly creatures within 10 feet gain a +1 bonus to attack rolls and saving throws.",
  },
  {
    id: "splendor-3",
    name: "Grand Entrance",
    domain: "Splendor",
    level: 2,
    type: "feature",
    description:
      "When you enter combat, all enemies within 60 feet must make a Wis save or be frightened until the end of your next turn.",
  },
  {
    id: "splendor-4",
    name: "Mesmerize",
    domain: "Splendor",
    level: 2,
    type: "action",
    description:
      "As an action, target a creature within 30 feet. It must make a Wis save or be incapacitated and its speed becomes 0.",
  },
  {
    id: "splendor-5",
    name: "Radiant Aura",
    domain: "Splendor",
    level: 3,
    type: "feature",
    description:
      "You shed bright light in a 30-foot radius. Hostile creatures that start their turn in the light take 2d6 radiant damage.",
  },
  {
    id: "splendor-6",
    name: "Commanding Voice",
    domain: "Splendor",
    level: 3,
    type: "action",
    description:
      "As an action, issue a command to all creatures within 60 feet. They must make a Cha save or obey your command.",
  },

  // Valor
  {
    id: "valor-1",
    name: "Heroic Strike",
    domain: "Valor",
    level: 1,
    type: "action",
    description:
      "As an action, make a weapon attack with advantage. On a hit, add your proficiency bonus to the damage.",
  },
  {
    id: "valor-2",
    name: "Rally",
    domain: "Valor",
    level: 1,
    type: "action",
    description:
      "As an action, choose up to three creatures within 30 feet. They each gain temporary hit points equal to your level + Cha modifier.",
  },
  {
    id: "valor-3",
    name: "Hold the Line",
    domain: "Valor",
    level: 2,
    type: "reaction",
    description:
      "When a creature within 5 feet of you moves, you can use your reaction to make an opportunity attack with advantage.",
  },
  {
    id: "valor-4",
    name: "Inspire Courage",
    domain: "Valor",
    level: 2,
    type: "feature",
    description:
      "As a bonus action, grant an ally within 30 feet advantage on their next attack roll, ability check, or save.",
  },
  {
    id: "valor-5",
    name: "Last Stand",
    domain: "Valor",
    level: 3,
    type: "feature",
    description:
      "When reduced to 0 HP, you can choose to remain conscious and continue fighting until the end of your next turn.",
  },
  {
    id: "valor-6",
    name: "Legendary Might",
    domain: "Valor",
    level: 3,
    type: "action",
    description:
      "As an action, you and all allies within 30 feet gain advantage on all attack rolls and saves until the end of your next turn.",
  },
];
