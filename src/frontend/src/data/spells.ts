import type React from "react";

// Daggerheart SRD Spell Compendium — all 9 domains

export type SpellDomain =
  | "Arcana"
  | "Blade"
  | "Bone"
  | "Codex"
  | "Grace"
  | "Midnight"
  | "Sage"
  | "Splendor"
  | "Valor";

export interface Spell {
  id: string;
  name: string;
  domain: SpellDomain;
  level: number; // 1–9, corresponds to domain card tier
  description: string;
  tags?: string[];
}

// ─── Domain accent palette — single source of truth ─────────────────────────
// Each domain has a distinct accent hex color used for borders, glows, chips,
// and card highlights across SpellCompendiumModal, LevelUpModal,
// FeatureCard (DomainCardItem), and HomebrewSpellCreator.

export const DOMAIN_ACCENT_HEX: Record<SpellDomain, string> = {
  Arcana: "#7C3AED", // arcane blue-violet
  Blade: "#DC2626", // crimson red
  Bone: "#9CA3AF", // bone white/gray
  Codex: "#D97706", // amber gold
  Grace: "#EC4899", // rose pink
  Midnight: "#6366F1", // indigo glow (deep #312E81 bg, #6366F1 accent)
  Sage: "#16A34A", // forest green
  Splendor: "#EAB308", // radiant gold
  Valor: "#2563EB", // steel blue
};

/** Tailwind chip classes — badge/filter buttons with light-mode aware styles */
export const DOMAIN_CHIP_COLORS: Record<SpellDomain, string> = {
  Arcana:
    "bg-violet-100 text-violet-700 border-violet-400 dark:bg-violet-600/20 dark:text-violet-300 dark:border-violet-500/60",
  Blade:
    "bg-red-100 text-red-700 border-red-400 dark:bg-red-600/20 dark:text-red-300 dark:border-red-500/60",
  Bone: "bg-gray-100 text-gray-600 border-gray-400 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-400/60",
  Codex:
    "bg-amber-100 text-amber-700 border-amber-400 dark:bg-amber-600/20 dark:text-amber-300 dark:border-amber-500/60",
  Grace:
    "bg-pink-100 text-pink-700 border-pink-400 dark:bg-pink-600/20 dark:text-pink-300 dark:border-pink-500/60",
  Midnight:
    "bg-indigo-100 text-indigo-700 border-indigo-400 dark:bg-indigo-600/20 dark:text-indigo-300 dark:border-indigo-500/60",
  Sage: "bg-green-100 text-green-700 border-green-400 dark:bg-green-600/20 dark:text-green-300 dark:border-green-500/60",
  Splendor:
    "bg-yellow-100 text-yellow-700 border-yellow-400 dark:bg-yellow-600/20 dark:text-yellow-300 dark:border-yellow-500/60",
  Valor:
    "bg-blue-100 text-blue-700 border-blue-400 dark:bg-blue-600/20 dark:text-blue-300 dark:border-blue-500/60",
};

/** Full card colors — used for spell/domain card background + border in dark and light modes */
export const DOMAIN_COLORS: Record<SpellDomain, string> = {
  Arcana:
    "bg-violet-500/15 text-violet-300 border-violet-500/50 dark:bg-violet-600/10 dark:border-violet-500/40",
  Blade:
    "bg-red-500/15 text-red-300 border-red-500/50 dark:bg-red-600/10 dark:border-red-500/40",
  Bone: "bg-gray-500/15 text-gray-400 border-gray-400/50 dark:bg-gray-500/10 dark:border-gray-400/40",
  Codex:
    "bg-amber-500/15 text-amber-600 border-amber-500/50 dark:bg-amber-600/10 dark:text-amber-300 dark:border-amber-500/40",
  Grace:
    "bg-pink-500/15 text-pink-600 border-pink-500/50 dark:bg-pink-600/10 dark:text-pink-300 dark:border-pink-500/40",
  Midnight:
    "bg-indigo-500/15 text-indigo-600 border-indigo-500/50 dark:bg-indigo-600/10 dark:text-indigo-300 dark:border-indigo-500/40",
  Sage: "bg-green-500/15 text-green-700 border-green-500/50 dark:bg-green-600/10 dark:text-green-300 dark:border-green-500/40",
  Splendor:
    "bg-yellow-500/15 text-yellow-600 border-yellow-500/50 dark:bg-yellow-600/10 dark:text-yellow-300 dark:border-yellow-500/40",
  Valor:
    "bg-blue-500/15 text-blue-600 border-blue-500/50 dark:bg-blue-600/10 dark:text-blue-300 dark:border-blue-500/40",
};

/** Inline glow styles keyed by domain for CSS box-shadow using accent hex */
export function domainGlowStyle(
  domain: SpellDomain,
  opacity = 0.35,
): React.CSSProperties {
  const hex = DOMAIN_ACCENT_HEX[domain];
  return {
    boxShadow: `0 0 14px 2px ${hex}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`,
  };
}

/** Selected state classes for domain buttons (unselected hover + selected glow) */
export const DOMAIN_SELECTED_COLORS: Record<SpellDomain, string> = {
  Arcana:
    "bg-violet-500/20 border-violet-500/80 text-violet-200 shadow-[0_0_12px_#7C3AED60]",
  Blade:
    "bg-red-500/20 border-red-500/80 text-red-200 shadow-[0_0_12px_#DC262660]",
  Bone: "bg-gray-400/20 border-gray-400/80 text-gray-200 shadow-[0_0_12px_#9CA3AF60]",
  Codex:
    "bg-amber-500/20 border-amber-500/80 text-amber-200 shadow-[0_0_12px_#D9770660]",
  Grace:
    "bg-pink-500/20 border-pink-500/80 text-pink-200 shadow-[0_0_12px_#EC489960]",
  Midnight:
    "bg-indigo-500/20 border-indigo-500/80 text-indigo-200 shadow-[0_0_12px_#6366F160]",
  Sage: "bg-green-500/20 border-green-500/80 text-green-200 shadow-[0_0_12px_#16A34A60]",
  Splendor:
    "bg-yellow-500/20 border-yellow-500/80 text-yellow-200 shadow-[0_0_12px_#EAB30860]",
  Valor:
    "bg-blue-500/20 border-blue-500/80 text-blue-200 shadow-[0_0_12px_#2563EB60]",
};

/** Unselected hover classes for domain buttons */
export const DOMAIN_HOVER_COLORS: Record<SpellDomain, string> = {
  Arcana: "hover:border-violet-500/40 hover:text-violet-400",
  Blade: "hover:border-red-500/40 hover:text-red-400",
  Bone: "hover:border-gray-400/40 hover:text-gray-400",
  Codex: "hover:border-amber-500/40 hover:text-amber-400",
  Grace: "hover:border-pink-500/40 hover:text-pink-400",
  Midnight: "hover:border-indigo-500/40 hover:text-indigo-400",
  Sage: "hover:border-green-500/40 hover:text-green-400",
  Splendor: "hover:border-yellow-500/40 hover:text-yellow-400",
  Valor: "hover:border-blue-500/40 hover:text-blue-400",
};

export const SPELLS: Spell[] = [
  // ─── ARCANA ───────────────────────────────────────────────────────────────
  {
    id: "arcana-1",
    name: "Force Bolt",
    domain: "Arcana",
    level: 1,
    description:
      "You hurl a crackling bolt of pure arcane energy at a target within Far range. Make a Spellcast Roll against their Difficulty. On a success, deal 2d6+Spellcast magic damage.",
    tags: ["ranged", "damage", "magic"],
  },
  {
    id: "arcana-2",
    name: "Arcane Shield",
    domain: "Arcana",
    level: 1,
    description:
      "You conjure a shimmering barrier of magical force around yourself or an ally within Close range. The target gains +3 to their Armor Score until the start of your next turn.",
    tags: ["defensive", "reaction"],
  },
  {
    id: "arcana-3",
    name: "Mage Hand",
    domain: "Arcana",
    level: 1,
    description:
      "You conjure a floating spectral hand within Very Far range that can manipulate objects, open unlocked doors, retrieve items, or perform simple tasks. The hand persists for 10 minutes.",
    tags: ["utility", "exploration"],
  },
  {
    id: "arcana-4",
    name: "Mirror Image",
    domain: "Arcana",
    level: 2,
    description:
      "Three illusory duplicates of yourself appear in your space. Whenever a creature targets you with an attack, roll a d4. On a 2–4, one duplicate is destroyed instead of you taking damage. The spell ends when all duplicates are gone.",
    tags: ["defensive", "illusion"],
  },
  {
    id: "arcana-5",
    name: "Counterspell",
    domain: "Arcana",
    level: 3,
    description:
      "As a reaction, when a creature within Far range casts a spell, you attempt to interrupt it. Make a Spellcast Roll contested by the caster. On a success, the spell fails and has no effect.",
    tags: ["reaction", "counter", "defensive"],
  },
  {
    id: "arcana-6",
    name: "Arcane Torrent",
    domain: "Arcana",
    level: 4,
    description:
      "You release a torrent of raw magical energy in a Close burst around you. All creatures in the area must make an Agility Save against your Spellcast. On a failure, they take 4d8+Spellcast magic damage and are Restrained until end of their next turn.",
    tags: ["area", "damage", "control"],
  },
  {
    id: "arcana-7",
    name: "Arcane Eye",
    domain: "Arcana",
    level: 5,
    description:
      "You create an invisible magical sensor that floats through the air. You can see through it up to a Far distance and move it up to Very Far per turn for up to 1 hour. The eye can pass through gaps but cannot enter a sealed space.",
    tags: ["utility", "exploration", "detection"],
  },
  {
    id: "arcana-8",
    name: "Disintegrate",
    domain: "Arcana",
    level: 6,
    description:
      "A green ray of energy lances out from your finger toward a creature or object within Far range. Make a Spellcast Roll against their Difficulty. On a success, the target takes 10d6+40 magic damage. A creature reduced to 0 HP by this spell is turned to dust.",
    tags: ["ranged", "damage", "powerful"],
  },
  {
    id: "arcana-9",
    name: "Wish",
    domain: "Arcana",
    level: 9,
    description:
      "The mightiest of arcane spells, wish bends reality itself to your will. You can duplicate any spell of level 8 or lower, or create one of the following effects: grant up to 10 creatures immunity to a spell, create a non-magical item of value up to 25,000 gold, or speak a request to the GM for a miraculous effect. Casting wish without duplicating a spell causes you to take 3d6 Stress and reduces your max Spellcast by 1d3 until you complete a long rest.",
    tags: ["powerful", "reality-altering"],
  },
  {
    id: "arcana-10",
    name: "Ley Line Tap",
    domain: "Arcana",
    level: 2,
    description:
      "You tap into the invisible rivers of magical energy flowing through the world. Regain 1d6 Stress and gain a Hope token. If cast in an area of strong magical resonance, regain 2d6 Stress instead.",
    tags: ["recovery", "hope"],
  },
  {
    id: "arcana-11",
    name: "Spell Vault",
    domain: "Arcana",
    level: 3,
    description:
      "You store a spell of level 3 or lower into a crystalline orb you can hold in one hand. The next creature to touch the orb or that you throw it at triggers the stored spell as if you had cast it. The orb lasts for 24 hours.",
    tags: ["utility", "trap"],
  },
  {
    id: "arcana-12",
    name: "Arcane Pulse",
    domain: "Arcana",
    level: 7,
    description:
      "You emit a devastating wave of pure arcane force. All creatures within Very Close range take 6d10+Spellcast magic damage and are knocked Prone and Vulnerable until the end of their next turn. Structures and objects in the area are severely damaged.",
    tags: ["area", "damage", "powerful"],
  },

  // ─── BLADE ────────────────────────────────────────────────────────────────
  {
    id: "blade-1",
    name: "Blade Ward",
    domain: "Blade",
    level: 1,
    description:
      "You invoke a protective ward, reading the flow of battle. Until the start of your next turn, you have resistance to physical damage from weapon attacks, reducing all such damage by half.",
    tags: ["defensive", "self"],
  },
  {
    id: "blade-2",
    name: "True Strike",
    domain: "Blade",
    level: 1,
    description:
      "You glimpse an opening in a foe's defenses. Your next attack roll against the target before the end of your next turn ignores the target's Evasion bonus and deals an additional 1d6 damage.",
    tags: ["offensive", "precision"],
  },
  {
    id: "blade-3",
    name: "Whirlwind Strike",
    domain: "Blade",
    level: 2,
    description:
      "You spin in a devastating arc, weapon trailing energy. Make a single Attack Roll against all creatures within Very Close range. On a success, deal your weapon's damage die + Agility to each hit target.",
    tags: ["area", "melee", "damage"],
  },
  {
    id: "blade-4",
    name: "Blade Song",
    domain: "Blade",
    level: 2,
    description:
      "Your weapon sings with magical resonance. For the next minute, your weapon attacks deal an extra 1d6 magic damage and your movement does not provoke opportunity attacks.",
    tags: ["buff", "melee"],
  },
  {
    id: "blade-5",
    name: "Duelist's Riposte",
    domain: "Blade",
    level: 3,
    description:
      "When a creature misses you with a melee attack, you can use your reaction to immediately make one weapon attack against them. This attack deals an additional 2d6 damage and forces the target to make an Agility Save or drop one held item.",
    tags: ["reaction", "melee", "counter"],
  },
  {
    id: "blade-6",
    name: "Sundering Strike",
    domain: "Blade",
    level: 4,
    description:
      "You channel destructive energy into a powerful blow. On a successful attack, deal triple your weapon die in damage and the target's Armor Score is reduced by 2 until they receive magical healing or take a rest.",
    tags: ["offensive", "debuff"],
  },
  {
    id: "blade-7",
    name: "Bladestorm",
    domain: "Blade",
    level: 5,
    description:
      "You unleash a storm of magically conjured blades in a Close cone. All creatures in the cone take 6d8 physical damage and must succeed a Strength Save or be Staggered until the end of their next turn.",
    tags: ["area", "damage", "control"],
  },
  {
    id: "blade-8",
    name: "Killing Edge",
    domain: "Blade",
    level: 6,
    description:
      "You suffuse your weapon with lethal energy. Your next weapon attack auto-succeeds and deals maximum damage. If the target is below half HP, they must make a Death Threshold check.",
    tags: ["offensive", "powerful"],
  },
  {
    id: "blade-9",
    name: "Avatar of War",
    domain: "Blade",
    level: 8,
    description:
      "You become an instrument of martial perfection for 1 minute. You gain +5 to all Attack Rolls, your weapon attacks deal an additional 3d10 damage, and you can make two attack actions instead of one on your turn.",
    tags: ["buff", "self", "powerful"],
  },
  {
    id: "blade-10",
    name: "Parry",
    domain: "Blade",
    level: 1,
    description:
      "When you are hit by a melee attack, you can use your reaction to add your Proficiency to your Armor Score against that attack only. If this causes the attack to miss, you may immediately move up to Very Close without provoking attacks.",
    tags: ["defensive", "reaction"],
  },
  {
    id: "blade-11",
    name: "Phantom Strike",
    domain: "Blade",
    level: 3,
    description:
      "Your weapon phases through mundane armor as if it weren't there. Your next attack ignores non-magical Armor Score entirely. Deal your weapon die + Finesse damage, and the target cannot take reactions until your next turn.",
    tags: ["offensive", "piercing"],
  },
  {
    id: "blade-12",
    name: "Thousand Cuts",
    domain: "Blade",
    level: 7,
    description:
      "With supernatural speed you deliver a flurry of precise strikes against a single target. Make five separate Attack Rolls. For each hit, deal 2d6 damage. Any target hit by three or more strikes is Marked until the end of combat.",
    tags: ["offensive", "multi-strike"],
  },

  // ─── BONE ─────────────────────────────────────────────────────────────────
  {
    id: "bone-1",
    name: "Raise Skeleton",
    domain: "Bone",
    level: 1,
    description:
      "You utter a necromantic word over the bones of a fallen creature within Close range. The creature rises as a skeleton under your command for 1 hour. The skeleton uses your Spellcast for attacks and has HP equal to half your max.",
    tags: ["necromancy", "summon", "minion"],
  },
  {
    id: "bone-2",
    name: "Chill Touch",
    domain: "Bone",
    level: 1,
    description:
      "A skeletal hand of ghostly energy reaches out to grasp a creature within Close range. Make a Spellcast Roll. On a success, deal 2d8+Spellcast necrotic damage and the target cannot regain HP until the start of your next turn.",
    tags: ["melee", "damage", "debuff"],
  },
  {
    id: "bone-3",
    name: "Bone Spear",
    domain: "Bone",
    level: 2,
    description:
      "You conjure a razor-sharp spear of bone and hurl it at a creature within Far range. Make a Spellcast Roll. On a success, deal 3d8+Spellcast physical damage and the target is Immobilized until the end of their next turn.",
    tags: ["ranged", "damage", "control"],
  },
  {
    id: "bone-4",
    name: "Death's Embrace",
    domain: "Bone",
    level: 2,
    description:
      "You channel the essence of death to repair your body or the body of a touched undead creature. Restore HP equal to 3d8 + your Spellcast Modifier. If cast on an undead, restore double the HP.",
    tags: ["healing", "undead"],
  },
  {
    id: "bone-5",
    name: "Necrotic Shroud",
    domain: "Bone",
    level: 3,
    description:
      "Black necrotic energy envelops you. For 1 minute, creatures that hit you in melee take 2d6 necrotic damage, and your undead minions within Close range gain +2 to their Attack Rolls.",
    tags: ["defensive", "buff", "aura"],
  },
  {
    id: "bone-6",
    name: "Animate Horde",
    domain: "Bone",
    level: 4,
    description:
      "You raise up to four undead skeletons or zombies from corpses within Close range simultaneously. Each serves you for 1 hour and follows simple commands. All share your Spellcast Modifier for attacks.",
    tags: ["necromancy", "summon", "minion"],
  },
  {
    id: "bone-7",
    name: "Finger of Death",
    domain: "Bone",
    level: 5,
    description:
      "You point your finger and utter a word of necromantic power at a creature within Far range. Make a Spellcast Roll against their Difficulty. On a success, deal 7d8+30 necrotic damage. A humanoid killed by this spell rises as a zombie under your control at the start of your next turn.",
    tags: ["ranged", "damage", "powerful", "necromancy"],
  },
  {
    id: "bone-8",
    name: "Bone Cage",
    domain: "Bone",
    level: 3,
    description:
      "Bones erupt from the ground to form a cage around a target within Far range. The target must make an Agility Save against your Spellcast or be Restrained for up to 1 minute. The cage has HP equal to your Spellcast x5.",
    tags: ["control", "ranged"],
  },
  {
    id: "bone-9",
    name: "Life Drain",
    domain: "Bone",
    level: 4,
    description:
      "A shadowy tendril of necrotic energy lashes out to a creature within Close range. Make a Spellcast Roll. On a success, deal 4d8+Spellcast necrotic damage and you regain HP equal to half the damage dealt.",
    tags: ["melee", "damage", "lifesteal"],
  },
  {
    id: "bone-10",
    name: "Bone Armor",
    domain: "Bone",
    level: 2,
    description:
      "You conjure layered bones that fuse around a willing creature you touch. The target gains +4 Armor Score and immunity to critical hits for 1 hour. The bones crumble when the armor absorbs 20 damage.",
    tags: ["defensive", "buff", "touch"],
  },
  {
    id: "bone-11",
    name: "Plague Bearer",
    domain: "Bone",
    level: 6,
    description:
      "You curse a creature within Close range with a spreading undead plague. The creature takes 4d6 necrotic damage per round and spreads the curse to adjacent creatures who fail an Instinct Save. The plague lasts until cured with a Remove Curse spell.",
    tags: ["damage", "debuff", "spreading"],
  },
  {
    id: "bone-12",
    name: "Lich's Phylactery",
    domain: "Bone",
    level: 9,
    description:
      "You perform a dark ritual to anchor your soul to an object you enchant as a phylactery. If you are reduced to 0 HP, your body reforms at the phylactery's location within 1d6 days with half your maximum HP. The ritual takes 1 hour and costs 1 Hope permanently.",
    tags: ["powerful", "ritual", "necromancy"],
  },

  // ─── CODEX ────────────────────────────────────────────────────────────────
  {
    id: "codex-1",
    name: "Identify",
    domain: "Codex",
    level: 1,
    description:
      "You study a magic item or enchanted object you touch for 1 minute. You learn all of its magical properties, how to activate them, and any curses it carries. This spell removes the Unidentified condition from the target.",
    tags: ["utility", "knowledge"],
  },
  {
    id: "codex-2",
    name: "Comprehend Languages",
    domain: "Codex",
    level: 1,
    description:
      "For 1 hour, you understand the spoken and written meaning of any language. While active you can read arcane tomes and ancient runes as if fluent. You cannot speak languages you do not already know.",
    tags: ["utility", "knowledge", "exploration"],
  },
  {
    id: "codex-3",
    name: "Mind Spike",
    domain: "Codex",
    level: 2,
    description:
      "You drive a lance of psychic energy into the mind of a creature within Far range. Make a Spellcast Roll against their Difficulty. On a success, deal 3d8+Spellcast psychic damage and you immediately learn the creature's surface thoughts.",
    tags: ["ranged", "damage", "detection"],
  },
  {
    id: "codex-4",
    name: "Lore Recall",
    domain: "Codex",
    level: 1,
    description:
      "You reach into the vast repository of your arcane knowledge. Ask the GM any one question about the history, nature, or weaknesses of a creature, place, or object you can see. The GM must answer truthfully to the best of the world's knowledge.",
    tags: ["utility", "knowledge"],
  },
  {
    id: "codex-5",
    name: "Arcane Script",
    domain: "Codex",
    level: 2,
    description:
      "You inscribe a magical message or glyph on a surface. The message can be invisible (revealed by magic or the right password) and can trigger a spell of level 3 or lower when activated. The inscription lasts until triggered or until you dispel it.",
    tags: ["utility", "trap", "exploration"],
  },
  {
    id: "codex-6",
    name: "Mind Reading",
    domain: "Codex",
    level: 3,
    description:
      "For up to 1 minute, you can read the surface thoughts of any creature within Close range that fails an Instinct Save. With concentration, you can delve deeper to access memories. The target feels a presence if they succeed their Save.",
    tags: ["detection", "concentration"],
  },
  {
    id: "codex-7",
    name: "Dominate Mind",
    domain: "Codex",
    level: 5,
    description:
      "You attempt to seize control of a humanoid creature within Far range. Make a Spellcast Roll contested by their Instinct. On a success, the creature obeys your spoken commands for 1 hour. Each time you issue a command that harms its allies, it may re-attempt the contested roll.",
    tags: ["control", "powerful", "concentration"],
  },
  {
    id: "codex-8",
    name: "Rift of Knowledge",
    domain: "Codex",
    level: 6,
    description:
      "You tear open a temporary rift to the Library Plane. For 10 minutes you have access to near-omniscient knowledge: you may ask the GM up to five questions of any nature and receive accurate answers. The rift also counts as a safe short rest for the party.",
    tags: ["powerful", "utility", "knowledge"],
  },
  {
    id: "codex-9",
    name: "Psychic Fortress",
    domain: "Codex",
    level: 4,
    description:
      "You erect an impenetrable psychic barrier around your mind and the minds of up to six willing creatures you designate within Very Close range. For 8 hours, all targets are immune to mind-reading, domination, and psychic damage.",
    tags: ["defensive", "buff", "group"],
  },
  {
    id: "codex-10",
    name: "Spell Scribe",
    domain: "Codex",
    level: 3,
    description:
      "You observe a spell being cast within Far range and attempt to record it. Make a Spellcast Roll with a Difficulty set by the GM based on the spell's complexity. On a success, you transcribe the spell into your codex and can cast it once before the entry fades.",
    tags: ["utility", "reaction"],
  },
  {
    id: "codex-11",
    name: "Foresight",
    domain: "Codex",
    level: 7,
    description:
      "You gain a brief but detailed vision of a possible future. For the next 8 hours, you cannot be Surprised, you gain advantage on Initiative, and once per round you may reroll any one d12 used for your attacks or saves and take the higher result.",
    tags: ["divination", "buff", "powerful"],
  },
  {
    id: "codex-12",
    name: "Mindshard",
    domain: "Codex",
    level: 4,
    description:
      "You fragment a creature's mind with layered psychic trauma. Target within Far range takes 5d6 psychic damage and is Dazed for 1 minute, halving their movement and costing them 1 additional action to cast spells. A successful Instinct Save halves the damage and negates the Daze.",
    tags: ["damage", "control", "ranged"],
  },

  // ─── GRACE ────────────────────────────────────────────────────────────────
  {
    id: "grace-1",
    name: "Healing Word",
    domain: "Grace",
    level: 1,
    description:
      "You speak a word infused with restorative magic. A creature within Far range regains 1d6 + your Spellcast Modifier HP. You may cast this spell as a bonus action.",
    tags: ["healing", "bonus-action"],
  },
  {
    id: "grace-2",
    name: "Bless",
    domain: "Grace",
    level: 1,
    description:
      "Divine light fills up to three willing creatures you can see within Close range. Each target adds 1d4 to their Attack Rolls and Saves for 1 minute. Concentration ends the spell early.",
    tags: ["buff", "group", "concentration"],
  },
  {
    id: "grace-3",
    name: "Cure Wounds",
    domain: "Grace",
    level: 1,
    description:
      "You channel healing energy through your touch into a creature's body. Restore 1d8+Spellcast HP to the target. This spell cannot restore HP to undead or constructs, but removes the Bleeding condition.",
    tags: ["healing", "touch"],
  },
  {
    id: "grace-4",
    name: "Lesser Restoration",
    domain: "Grace",
    level: 2,
    description:
      "Your touch cures a creature of one Condition: Blinded, Deafened, Paralyzed, Poisoned, or Frightened. This spell can also end one curse of level 4 or lower.",
    tags: ["healing", "utility", "touch"],
  },
  {
    id: "grace-5",
    name: "Prayer of Healing",
    domain: "Grace",
    level: 2,
    description:
      "At the end of a short rest, you lead a prayer that restores 2d8+Spellcast HP to up to six willing creatures you can see within Close range. This spell requires a 10-minute casting time.",
    tags: ["healing", "ritual", "group"],
  },
  {
    id: "grace-6",
    name: "Divine Aegis",
    domain: "Grace",
    level: 3,
    description:
      "A shimmering dome of divine energy descends over up to six creatures within Close range. For 1 minute, all targets inside have +3 Armor Score and resistance to magical damage. Creatures outside cannot enter the dome; those inside can leave freely.",
    tags: ["defensive", "group", "concentration"],
  },
  {
    id: "grace-7",
    name: "Revivify",
    domain: "Grace",
    level: 3,
    description:
      "You touch a creature that died within the last minute and pour divine energy into them. The creature returns to life with 1 HP. This spell cannot restore a creature whose body is destroyed, though you may attempt with a harder Difficulty.",
    tags: ["healing", "powerful", "touch"],
  },
  {
    id: "grace-8",
    name: "Mass Cure Wounds",
    domain: "Grace",
    level: 5,
    description:
      "A wave of healing energy washes out from you. Up to six creatures of your choice within Close range each regain 3d8+Spellcast HP.",
    tags: ["healing", "area", "group"],
  },
  {
    id: "grace-9",
    name: "Hallow",
    domain: "Grace",
    level: 5,
    description:
      "You imbue a 60-foot radius area with divine energy. The area is protected from the following effects while the spell lasts (24 hours): undead cannot enter, fear effects are suppressed, and fiends cannot use planar travel. You may add one additional effect from a list of divine blessings.",
    tags: ["utility", "defensive", "ritual"],
  },
  {
    id: "grace-10",
    name: "Celestial Form",
    domain: "Grace",
    level: 7,
    description:
      "You channel the power of a celestial being, transforming for 1 minute. You gain wings (fly speed equal to double your movement), all your healing spells restore double HP, and your weapon attacks deal an additional 2d8 radiant damage.",
    tags: ["buff", "transformation", "powerful"],
  },
  {
    id: "grace-11",
    name: "Sanctuary",
    domain: "Grace",
    level: 1,
    description:
      "You ward a creature within Close range. Any creature that attempts to attack or target the warded creature with a harmful spell must succeed an Instinct Save or be compelled to choose a different target. The ward ends if the warded creature makes an attack or casts a harmful spell.",
    tags: ["defensive", "protection"],
  },
  {
    id: "grace-12",
    name: "Divine Intervention",
    domain: "Grace",
    level: 9,
    description:
      "You call upon your deity to directly intervene in mortal affairs. Describe the intervention you desire — the GM narrates how the divine responds. Effects can be extraordinarily powerful: smiting all enemies in sight, instantly ending any curse, or transporting the party to safety. This spell can only be cast once per long rest.",
    tags: ["powerful", "ritual", "divine"],
  },

  // ─── MIDNIGHT ─────────────────────────────────────────────────────────────
  {
    id: "midnight-1",
    name: "Shadow Step",
    domain: "Midnight",
    level: 1,
    description:
      "You dissolve into shadow and reform in a patch of dim light or darkness up to Far range away. You may take one object or willing creature of your size or smaller with you.",
    tags: ["movement", "utility", "teleport"],
  },
  {
    id: "midnight-2",
    name: "Darkness",
    domain: "Midnight",
    level: 1,
    description:
      "Magical darkness pours from a point you choose within Far range. The darkness forms a 15-foot radius sphere that blocks all light sources, including magical ones, for 10 minutes. You and creatures you designate can see through it normally.",
    tags: ["utility", "control", "area"],
  },
  {
    id: "midnight-3",
    name: "Umbral Grasp",
    domain: "Midnight",
    level: 2,
    description:
      "Shadows coalesce into tendrils that reach for a creature within Far range. Make a Spellcast Roll. On a success, deal 3d6+Spellcast cold damage and the target is Restrained in place by shadow-tendrils until they succeed a Strength Save at the end of their turn.",
    tags: ["ranged", "damage", "control"],
  },
  {
    id: "midnight-4",
    name: "Shadow Clone",
    domain: "Midnight",
    level: 3,
    description:
      "You create a shadow copy of yourself in your space. The clone shares your statistics but has only 1 HP. While the clone is active you may swap positions with it as a free action once per turn. When the clone is destroyed it explodes in shadow, Blinding all adjacent creatures.",
    tags: ["utility", "defensive", "deception"],
  },
  {
    id: "midnight-5",
    name: "Veil of Night",
    domain: "Midnight",
    level: 2,
    description:
      "You wrap yourself or a willing creature you touch in magical shadow, granting Invisibility for 1 hour. The concealment ends early if the target makes an attack or casts a spell that affects others.",
    tags: ["stealth", "buff", "utility"],
  },
  {
    id: "midnight-6",
    name: "Shadow Realm",
    domain: "Midnight",
    level: 5,
    description:
      "You banish a creature within Close range into a pocket of shadow space. Make a Spellcast Roll contested by their Instinct. On a success, the creature is removed from the field for 1 minute or until they succeed a Instinct Save at end of each of their turns.",
    tags: ["control", "powerful", "banishment"],
  },
  {
    id: "midnight-7",
    name: "Darkness Wave",
    domain: "Midnight",
    level: 4,
    description:
      "You unleash a pulse of absolute darkness that ripples outward in a Close burst. All creatures in the area take 4d8+Spellcast cold damage, are Blinded until end of their next turn, and their next attack Roll is made at Disadvantage.",
    tags: ["area", "damage", "debuff"],
  },
  {
    id: "midnight-8",
    name: "Nightmare",
    domain: "Midnight",
    level: 6,
    description:
      "You invade a sleeping creature's dreams anywhere on the same plane. You can send a message, observe their subconscious fears, or torment them: the target wakes with 3d6 Stress and gains no benefit from that rest. Creatures that succeed an Instinct Save only take half the Stress.",
    tags: ["control", "powerful", "detection"],
  },
  {
    id: "midnight-9",
    name: "Eclipse",
    domain: "Midnight",
    level: 8,
    description:
      "You draw a veil of shadow across a one-mile radius centered on you. For 10 minutes, all light is reduced to dim darkness in the area, all Midnight spells cost 1 less Stress to cast, and enemies without Darkvision make all Attack Rolls and Saves at Disadvantage.",
    tags: ["area", "powerful", "buff"],
  },
  {
    id: "midnight-10",
    name: "Creeping Shadow",
    domain: "Midnight",
    level: 1,
    description:
      "Your shadow detaches and extends across the ground up to Very Far range. You can see through your shadow's perspective and it can carry small objects. The shadow has no substance and cannot attack, but creatures standing on it are considered under Difficult Terrain.",
    tags: ["utility", "detection", "exploration"],
  },
  {
    id: "midnight-11",
    name: "Heart of Darkness",
    domain: "Midnight",
    level: 7,
    description:
      "You envelop a creature's heart in shadow. Make a Spellcast Roll against their Difficulty. On a success, the creature is Frightened of you and takes 3d10 psychic damage at the start of each of their turns for 1 minute. While the spell persists, you can see and hear through their senses.",
    tags: ["control", "damage", "concentration"],
  },
  {
    id: "midnight-12",
    name: "Shadow Armor",
    domain: "Midnight",
    level: 3,
    description:
      "Shadows solidify around you into a protective second skin. For 1 hour, your Armor Score increases by 3 and attackers who hit you must succeed an Instinct Save or become Frightened until the end of their next turn.",
    tags: ["defensive", "self", "buff"],
  },

  // ─── SAGE ─────────────────────────────────────────────────────────────────
  {
    id: "sage-1",
    name: "Thorn Whip",
    domain: "Sage",
    level: 1,
    description:
      "You conjure a vine-like whip of magical thorns and lash it at a creature within Close range. Make a Spellcast Roll. On a success, deal 1d6+Spellcast physical damage and pull the target up to 10 feet toward you.",
    tags: ["melee", "damage", "control"],
  },
  {
    id: "sage-2",
    name: "Speak with Animals",
    domain: "Sage",
    level: 1,
    description:
      "For 10 minutes, you can communicate with beasts in a language of impressions, emotions, and simple concepts. Beasts will not blindly obey you, but friendly beasts will help if they can.",
    tags: ["utility", "social", "exploration"],
  },
  {
    id: "sage-3",
    name: "Entangle",
    domain: "Sage",
    level: 1,
    description:
      "Grasping weeds and vines sprout in a 20-foot square originating from a point within Far range for 1 minute. All creatures in the area when cast must succeed an Agility Save or be Restrained. Restrained creatures can retry the Save at end of each turn.",
    tags: ["area", "control", "concentration"],
  },
  {
    id: "sage-4",
    name: "Wild Shape",
    domain: "Sage",
    level: 2,
    description:
      "You magically assume the shape of a beast that you have seen at least once. Choose a beast form with a Challenge Rating up to your level divided by 3. You retain your mental stats but gain the beast's physical stats, HP, and special senses. You can remain transformed for 1 hour per use.",
    tags: ["transformation", "utility"],
  },
  {
    id: "sage-5",
    name: "Barkskin",
    domain: "Sage",
    level: 2,
    description:
      "You touch a willing creature, causing their skin to toughen like bark. For 1 hour, their Armor Score cannot drop below 16, and they gain resistance to physical damage from non-magical weapons.",
    tags: ["defensive", "buff", "touch"],
  },
  {
    id: "sage-6",
    name: "Conjure Animals",
    domain: "Sage",
    level: 3,
    description:
      "You summon 2d4 beasts of CR 1/2 or lower to assist you. Summoned creatures appear within Close range in unoccupied spaces and act on your initiative, following your commands. They remain for 1 hour or until reduced to 0 HP.",
    tags: ["summon", "group", "concentration"],
  },
  {
    id: "sage-7",
    name: "Sunbeam",
    domain: "Sage",
    level: 6,
    description:
      "A blazing beam of sunlight fills a line 60-foot long and 5-feet wide from a direction you choose. All creatures in the line must make an Agility Save. On a failure, they take 6d8 radiant damage and are Blinded until your next turn. Undead have Disadvantage on this Save.",
    tags: ["area", "damage", "line", "radiant"],
  },
  {
    id: "sage-8",
    name: "Nature's Wrath",
    domain: "Sage",
    level: 4,
    description:
      "You call upon the primal fury of nature. Lightning strikes down from clear sky onto up to three targets you can see within Very Far range. Each target takes 5d10 lightning damage and must succeed a Strength Save or be Knocked Prone.",
    tags: ["area", "damage", "lightning"],
  },
  {
    id: "sage-9",
    name: "Regrowth",
    domain: "Sage",
    level: 5,
    description:
      "You infuse a creature or area with vibrant natural energy. Touched creature regains all HP and all Conditions are removed. Alternatively, you can restore a destroyed natural environment up to the size of a town square, regrowing trees, purifying water, and displacing corrupted creatures.",
    tags: ["healing", "powerful", "restoration"],
  },
  {
    id: "sage-10",
    name: "Verdant Guardian",
    domain: "Sage",
    level: 7,
    description:
      "You call forth an immense treant to serve you. The treant has 120 HP, AC 16, and can make two attacks per turn, each dealing 3d10+6 physical damage. It obeys your spoken commands and lasts for 1 hour.",
    tags: ["summon", "powerful"],
  },
  {
    id: "sage-11",
    name: "Vine Bridge",
    domain: "Sage",
    level: 2,
    description:
      "Massive vines grow rapidly to form a sturdy bridge or rope across a gap up to 60 feet wide. The bridge holds up to 10 creatures at once and lasts for 8 hours. You can also use this to create a rope bridge between two trees or structures.",
    tags: ["utility", "exploration", "construction"],
  },
  {
    id: "sage-12",
    name: "One with the Wild",
    domain: "Sage",
    level: 9,
    description:
      "You merge your consciousness with the natural world. For 1 hour, you can see through the eyes of any beast, plant, or body of water in the region, sense disturbances in the natural order, and speak directly to the land itself, asking it questions and receiving truthful impressions in return.",
    tags: ["powerful", "detection", "divination"],
  },

  // ─── SPLENDOR ─────────────────────────────────────────────────────────────
  {
    id: "splendor-1",
    name: "Radiant Lance",
    domain: "Splendor",
    level: 1,
    description:
      "You hurl a javelin of concentrated radiant light at a creature within Far range. Make a Spellcast Roll. On a success, deal 2d8+Spellcast radiant damage. Undead and fiends take an extra 1d8 damage from this attack.",
    tags: ["ranged", "damage", "radiant"],
  },
  {
    id: "splendor-2",
    name: "Faerie Fire",
    domain: "Splendor",
    level: 1,
    description:
      "You outline objects and creatures in a 20-foot cube within Far range with blue, green, or violet light for 1 minute. Affected creatures shed dim light and all attacks against them have Advantage. Invisible creatures in the area become visible.",
    tags: ["utility", "control", "area"],
  },
  {
    id: "splendor-3",
    name: "Inspiration",
    domain: "Splendor",
    level: 1,
    description:
      "You speak words of divine encouragement to a creature within Close range that can hear you. They gain a Bardic Inspiration die (d6) they can add to any one attack, save, or skill check in the next 10 minutes.",
    tags: ["buff", "social"],
  },
  {
    id: "splendor-4",
    name: "Crown of Stars",
    domain: "Splendor",
    level: 3,
    description:
      "Seven star-like motes of radiant magic orbit your head for 1 hour. As a bonus action, you can fling a mote at a creature within Far range dealing 4d12 radiant damage. Once all seven motes are spent the spell ends.",
    tags: ["damage", "bonus-action", "ranged"],
  },
  {
    id: "splendor-5",
    name: "Starfall",
    domain: "Splendor",
    level: 4,
    description:
      "Brilliant meteors streak down onto a point you can see within Very Far range, creating a 20-foot radius explosion. All creatures in the area take 5d8+Spellcast radiant damage and must make an Agility Save or be Knocked Prone and Stunned until end of their next turn.",
    tags: ["area", "damage", "powerful"],
  },
  {
    id: "splendor-6",
    name: "Blinding Glory",
    domain: "Splendor",
    level: 2,
    description:
      "You blaze with intense divine light. All creatures within Close range that can see you must make an Instinct Save or be Blinded until the end of their next turn. You can choose up to three creatures to be unaffected.",
    tags: ["area", "control", "debuff"],
  },
  {
    id: "splendor-7",
    name: "Holy Aura",
    domain: "Splendor",
    level: 8,
    description:
      "You radiate a protective divine light. You and up to ten friendly creatures within Close range are sheathed in golden light. They have Advantage on all Saves, gain +4 Armor Score, and when an undead or fiend hits a sheathed creature in melee they take 5d10 radiant damage.",
    tags: ["buff", "group", "powerful", "concentration"],
  },
  {
    id: "splendor-8",
    name: "Prismatic Spray",
    domain: "Splendor",
    level: 7,
    description:
      "Eight shimmering rays of light shoot from your hand in a 60-foot cone. Each creature in the area is struck by a different-colored ray determined by rolling 1d8. Effects range from fire damage to paralysis to banishment to instantaneous death.",
    tags: ["area", "damage", "powerful", "random"],
  },
  {
    id: "splendor-9",
    name: "Solar Flare",
    domain: "Splendor",
    level: 5,
    description:
      "You concentrate divine solar energy into a searing beam and unleash it in a 100-foot line. All creatures in the line take 8d8 fire + 4d8 radiant damage, or half on a successful Agility Save. The line creates a lasting trail of sacred flame for 1 round.",
    tags: ["line", "damage", "powerful"],
  },
  {
    id: "splendor-10",
    name: "Aura of Courage",
    domain: "Splendor",
    level: 2,
    description:
      "You emanate an aura of divine courage. While you are conscious, friendly creatures within Very Close range cannot become Frightened, and those already Frightened may reroll their Instinct Save with Advantage.",
    tags: ["aura", "buff", "passive"],
  },
  {
    id: "splendor-11",
    name: "Beacon of Hope",
    domain: "Splendor",
    level: 3,
    description:
      "Divine hope radiates from you. For 1 minute, you and friendly creatures within Close range maximize their HP recovery from healing spells, and each creature in the aura gains 1 Hope token.",
    tags: ["healing", "buff", "group", "hope"],
  },
  {
    id: "splendor-12",
    name: "Avatar of Splendor",
    domain: "Splendor",
    level: 9,
    description:
      "You transform into a living embodiment of divine radiance for 1 minute. You grow to Large size, all your spells deal double damage, radiant light shines 100 feet around you (damaging undead for 3d10 per round), and your words carry divine authority — creatures that hear you must succeed a Wisdom Save to act against your wishes.",
    tags: ["transformation", "powerful", "powerful"],
  },

  // ─── VALOR ────────────────────────────────────────────────────────────────
  {
    id: "valor-1",
    name: "Heroic Strike",
    domain: "Valor",
    level: 1,
    description:
      "You channel heroic resolve into a powerful blow. On your next attack this turn, add your Proficiency score as bonus damage and, if the attack hits, you or an adjacent ally immediately regain 1d6 HP.",
    tags: ["offensive", "healing", "melee"],
  },
  {
    id: "valor-2",
    name: "Battle Cry",
    domain: "Valor",
    level: 1,
    description:
      "You loose a rallying cry that steels your companions' nerves. Up to four creatures within Close range that can hear you gain Advantage on their next Attack Roll and immunity to the Frightened condition until the start of your next turn.",
    tags: ["buff", "group", "social"],
  },
  {
    id: "valor-3",
    name: "Shield Bash",
    domain: "Valor",
    level: 1,
    description:
      "You slam your shield — or your armored body — into a creature within Very Close range. Make a Strength Attack Roll. On a success, deal 1d6+Strength physical damage and the target is knocked Prone and pushed up to 10 feet back.",
    tags: ["melee", "damage", "control"],
  },
  {
    id: "valor-4",
    name: "Stand Firm",
    domain: "Valor",
    level: 2,
    description:
      "You plant your feet and become an immovable anchor. Until the start of your next turn, you cannot be moved, knocked Prone, or have your Armor Score reduced by any effect. Allies within Very Close range gain +2 to their Armor Score.",
    tags: ["defensive", "buff", "self"],
  },
  {
    id: "valor-5",
    name: "Mark of Valor",
    domain: "Valor",
    level: 2,
    description:
      "You declare a creature within Far range as your Marked quarry. Until combat ends or the target is defeated, you gain +2 to Attack Rolls against them and they have Disadvantage on Attack Rolls against creatures other than you.",
    tags: ["offensive", "taunt", "control"],
  },
  {
    id: "valor-6",
    name: "Inspiring Presence",
    domain: "Valor",
    level: 3,
    description:
      "Your heroic example inspires those who fight beside you. Friendly creatures within Close range gain a pool of 3d6 Inspiration Dice. Once per turn they can expend one die as a free action to add it to any damage roll or HP recovered.",
    tags: ["buff", "group", "passive"],
  },
  {
    id: "valor-7",
    name: "Unbreakable Will",
    domain: "Valor",
    level: 4,
    description:
      "When you would drop to 0 HP, you may immediately take a free action. You return to 1 HP, remove all Conditions, and your next attack in this moment deals double damage. This ability may be used once per short rest.",
    tags: ["defensive", "powerful", "reaction"],
  },
  {
    id: "valor-8",
    name: "Rallying Charge",
    domain: "Valor",
    level: 3,
    description:
      "You charge at a target up to Far range away, moving through any intervening space. When you arrive, make an Attack Roll. On a success, deal 3d8+Strength damage and all allies within Close range of your final position may immediately move up to their speed as a free action.",
    tags: ["movement", "damage", "offensive"],
  },
  {
    id: "valor-9",
    name: "Champion's Resolve",
    domain: "Valor",
    level: 6,
    description:
      "You enter a state of perfect martial focus for 1 minute. All your attacks automatically succeed (deal full damage without rolling), you gain +6 Armor Score, and at the start of each of your turns you regain 2d8+Constitution HP.",
    tags: ["buff", "powerful", "self"],
  },
  {
    id: "valor-10",
    name: "Legendary Blow",
    domain: "Valor",
    level: 8,
    description:
      "You gather every ounce of heroic might into a single devastating strike. Make an Attack Roll with Advantage. On a success, deal 10d10+Strength damage. The target must make a Constitution Save against your Attack Roll or be Stunned until the end of their next turn.",
    tags: ["offensive", "powerful", "melee"],
  },
  {
    id: "valor-11",
    name: "No Retreat",
    domain: "Valor",
    level: 2,
    description:
      "When a creature within Very Close range attempts to move away from you, you can use your reaction to immediately make one Attack Roll against them before they move. On a success, their movement is reduced to 0 for that action.",
    tags: ["reaction", "melee", "control"],
  },
  {
    id: "valor-12",
    name: "Oath of Defiance",
    domain: "Valor",
    level: 5,
    description:
      "You swear a mighty oath against a single creature within sight. For 1 hour, you deal +4d6 bonus damage on all attacks against them, they have Disadvantage on Saves against your abilities, and you cannot be Frightened by them. The oath ends only when one of you falls.",
    tags: ["buff", "offensive", "concentration"],
  },
];

// Helper — group spells by domain
export function getSpellsByDomain(domain: SpellDomain): Spell[] {
  return SPELLS.filter((s) => s.domain === domain);
}

// Helper — group spells by level
export function getSpellsByLevel(level: number): Spell[] {
  return SPELLS.filter((s) => s.level === level);
}

export const ALL_DOMAINS: SpellDomain[] = [
  "Arcana",
  "Blade",
  "Bone",
  "Codex",
  "Grace",
  "Midnight",
  "Sage",
  "Splendor",
  "Valor",
];
