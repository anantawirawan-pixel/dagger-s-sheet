import type { CharacterClass } from "@/types/character";

export const CLASSES: CharacterClass[] = [
  {
    id: "bard",
    name: "Bard",
    description:
      "Wandering storytellers and musicians who weave magic through performance, inspiring allies and unraveling foes with wit and song.",
    evasion: 10,
    baseHP: 5,
    domains: ["Grace", "Codex"],
    subclasses: [
      {
        id: "troubadour",
        name: "Troubadour",
        description:
          "A bard who travels from town to town, collecting tales and spreading hope through stirring ballads and sharp satire.",
        features: [
          {
            name: "Ballad of Courage",
            description:
              "As an action, sing a rousing ballad. All allies within 30 feet gain Hope equal to your Presence modifier.",
            level: 1,
          },
          {
            name: "Cutting Remark",
            description:
              "When an enemy within 60 feet makes an attack roll, use your reaction to impose disadvantage by mocking their technique.",
            level: 1,
          },
        ],
      },
      {
        id: "wordsmith",
        name: "Wordsmith",
        description:
          "A scholar of ancient languages and hidden meanings, using the power of true names and forgotten verses to reshape reality.",
        features: [
          {
            name: "Lorekeeper's Recall",
            description:
              "You have advantage on Knowledge checks to identify creatures, artifacts, or magical effects.",
            level: 1,
          },
          {
            name: "Verse of Binding",
            description:
              "As an action, speak a binding verse. A target within 30 feet must make a Knowledge save or be restrained until the end of your next turn.",
            level: 1,
          },
        ],
      },
    ],
  },
  {
    id: "druid",
    name: "Druid",
    description:
      "Guardians of the natural world who draw power from the land itself, communing with spirits and commanding the raw forces of nature.",
    evasion: 10,
    baseHP: 6,
    domains: ["Sage", "Arcana"],
    subclasses: [
      {
        id: "warden-of-elements",
        name: "Warden of Elements",
        description:
          "A druid who has forged a pact with elemental spirits, wielding fire, ice, and storm as extensions of their will.",
        features: [
          {
            name: "Elemental Attunement",
            description:
              "Choose fire, ice, or storm. Your spells of that element deal extra damage equal to your Instinct modifier.",
            level: 1,
          },
          {
            name: "Spirit of the Land",
            description:
              "As a reaction when you or an ally within 30 feet takes damage, summon a minor elemental to absorb half the damage.",
            level: 1,
          },
        ],
      },
      {
        id: "warden-of-renewal",
        name: "Warden of Renewal",
        description:
          "A healer and protector who channels the endless cycle of growth and decay to mend wounds and purify corruption.",
        features: [
          {
            name: "Renewal Touch",
            description:
              "As an action, touch a creature to restore hit points equal to 1d8 + your Instinct modifier + your level.",
            level: 1,
          },
          {
            name: "Purify",
            description:
              "As an action, cleanse a creature within 30 feet of one poison, disease, or curse affecting them.",
            level: 1,
          },
        ],
      },
    ],
  },
  {
    id: "guardian",
    name: "Guardian",
    description:
      "Stalwart defenders who stand between harm and the innocent, turning aside blows with shield and unwavering resolve.",
    evasion: 9,
    baseHP: 7,
    domains: ["Valor", "Blade"],
    subclasses: [
      {
        id: "stalwart",
        name: "Stalwart",
        description:
          "An immovable bulwark who protects allies by intercepting attacks and absorbing punishment that would fell lesser warriors.",
        features: [
          {
            name: "Shield Ally",
            description:
              "As a reaction when an ally within 5 feet is hit, move to intercept and take the damage instead.",
            level: 1,
          },
          {
            name: "Unyielding",
            description:
              "When reduced to 0 HP, you may choose to remain at 1 HP instead. Once per long rest.",
            level: 1,
          },
        ],
      },
      {
        id: "vengeance",
        name: "Vengeance",
        description:
          "A guardian who turns the pain of loss into righteous fury, striking down those who prey upon the weak.",
        features: [
          {
            name: "Vengeful Strike",
            description:
              "When an ally within 30 feet is reduced to 0 HP, your next attack against the attacker deals extra damage equal to your level.",
            level: 1,
          },
          {
            name: "Oath of Retribution",
            description:
              "As a bonus action, mark a creature. You have advantage on attacks against it and it has disadvantage on attacks against your allies.",
            level: 1,
          },
        ],
      },
    ],
  },
  {
    id: "ranger",
    name: "Ranger",
    description:
      "Masters of the wild who track prey across any terrain, blending survival instinct with deadly precision.",
    evasion: 12,
    baseHP: 6,
    domains: ["Bone", "Sage"],
    subclasses: [
      {
        id: "beastbound",
        name: "Beastbound",
        description:
          "A ranger who has formed a deep spiritual bond with a beast companion, fighting as one seamless unit.",
        features: [
          {
            name: "Beast Companion",
            description:
              "You gain a beast companion that acts on your turn. It has HP equal to your level × 3 and uses your Agility for attacks.",
            level: 1,
          },
          {
            name: "Shared Senses",
            description:
              "As an action, see through your companion's eyes and hear what it hears for up to 1 minute.",
            level: 1,
          },
        ],
      },
      {
        id: "wayfinder",
        name: "Wayfinder",
        description:
          "An explorer who reads the hidden paths of the world, never lost and always one step ahead of danger.",
        features: [
          {
            name: "Pathfinder",
            description:
              "You cannot become lost by non-magical means. You and allies traveling with you ignore difficult terrain.",
            level: 1,
          },
          {
            name: "Ambush Tactics",
            description:
              "When you attack a creature that hasn't acted yet in combat, your attack deals extra damage equal to your Agility modifier + your level.",
            level: 1,
          },
        ],
      },
    ],
  },
  {
    id: "rogue",
    name: "Rogue",
    description:
      "Shadow-dwelling operatives who strike from unseen angles, masters of deception, stealth, and precise lethal blows.",
    evasion: 12,
    baseHP: 6,
    domains: ["Midnight", "Grace"],
    subclasses: [
      {
        id: "nightwalker",
        name: "Nightwalker",
        description:
          "A rogue who moves through darkness as if it were daylight, striking from shadows and vanishing without a trace.",
        features: [
          {
            name: "Shadow Meld",
            description:
              "As a bonus action, become heavily obscured until the start of your next turn while in dim light or darkness.",
            level: 1,
          },
          {
            name: "Silent Takedown",
            description:
              "When you hit a creature that is surprised or unaware of you, the attack deals extra damage equal to your Finesse modifier × 2.",
            level: 1,
          },
        ],
      },
      {
        id: "syndicate",
        name: "Syndicate",
        description:
          "A connected operative with eyes and ears in every city, using influence, blackmail, and coded networks to achieve their goals.",
        features: [
          {
            name: "Informant Network",
            description:
              "When entering a settlement, you automatically learn one secret, rumor, or piece of valuable information.",
            level: 1,
          },
          {
            name: "Silver Tongue",
            description:
              "You have advantage on Presence checks to deceive, persuade, or gather information from criminals and officials.",
            level: 1,
          },
        ],
      },
    ],
  },
  {
    id: "seraph",
    name: "Seraph",
    description:
      "Celestial warriors touched by divine light, wielding radiant power and soaring above the battlefield on wings of faith.",
    evasion: 9,
    baseHP: 7,
    domains: ["Splendor", "Valor"],
    subclasses: [
      {
        id: "divine-wielder",
        name: "Divine Wielder",
        description:
          "A seraph who channels celestial fury through weapon and word, smiting the wicked with blinding radiance.",
        features: [
          {
            name: "Radiant Smite",
            description:
              "As a bonus action, imbue your weapon with radiant light. Your next attack deals extra radiant damage equal to your Strength modifier + your level.",
            level: 1,
          },
          {
            name: "Blinding Light",
            description:
              "As an action, unleash a burst of radiant energy. Creatures of your choice within 15 feet must make a Strength save or be blinded until the end of your next turn.",
            level: 1,
          },
        ],
      },
      {
        id: "winged-sentinel",
        name: "Winged Sentinel",
        description:
          "A protector who soars above the fray, shielding allies from on high and descending like a meteor upon threats.",
        features: [
          {
            name: "Aerial Guardian",
            description:
              "You gain a fly speed equal to your walking speed. While flying, allies within 10 feet gain +1 to AC.",
            level: 1,
          },
          {
            name: "Diving Strike",
            description:
              "When you fly at least 20 feet straight toward a target and hit it with a melee attack, the attack deals extra damage equal to your Strength modifier + your level.",
            level: 1,
          },
        ],
      },
    ],
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    description:
      "Innate spellcasters whose bloodline carries ancient magic, channeling raw arcane power through instinct and will alone.",
    evasion: 10,
    baseHP: 6,
    domains: ["Arcana", "Midnight"],
    subclasses: [
      {
        id: "elemental-origin",
        name: "Elemental Origin",
        description:
          "A sorcerer descended from elemental beings, their very presence warping the air, earth, fire, or water around them.",
        features: [
          {
            name: "Elemental Surge",
            description:
              "Choose an element. You gain resistance to that damage type. When casting a spell of that element, add your Instinct modifier to damage.",
            level: 1,
          },
          {
            name: "Primal Manifestation",
            description:
              "As an action, surround yourself with your chosen element for 1 minute. Hostile creatures that start their turn within 5 feet take damage equal to your Instinct modifier.",
            level: 1,
          },
        ],
      },
      {
        id: "primal-origin",
        name: "Primal Origin",
        description:
          "A sorcerer whose magic stems from the untamed wilds, channeling the chaotic power of beasts, storms, and ancient forests.",
        features: [
          {
            name: "Wild Magic",
            description:
              "When you roll a natural 1 or 20 on a spell attack, roll on the Wild Surge table for an additional effect.",
            level: 1,
          },
          {
            name: "Beast Within",
            description:
              "As a bonus action, gain claws and fangs for 1 minute. Your unarmed strikes deal 1d8 damage and use your Instinct modifier.",
            level: 1,
          },
        ],
      },
    ],
  },
  {
    id: "warrior",
    name: "Warrior",
    description:
      "Seasoned combatants who have honed their bodies into weapons, mastering technique, endurance, and the art of war.",
    evasion: 11,
    baseHP: 6,
    domains: ["Blade", "Bone"],
    subclasses: [
      {
        id: "call-of-the-brave",
        name: "Call of the Brave",
        description:
          "A warrior who inspires through deeds of valor, turning the tide of battle with sheer courage and indomitable spirit.",
        features: [
          {
            name: "Rallying Cry",
            description:
              "As an action, let out a battle cry. All allies within 30 feet who can hear you gain temporary hit points equal to your Strength modifier + your level.",
            level: 1,
          },
          {
            name: "Second Wind",
            description:
              "As a bonus action, regain hit points equal to 1d10 + your level. Once per short rest.",
            level: 1,
          },
        ],
      },
      {
        id: "call-of-the-slayer",
        name: "Call of the Slayer",
        description:
          "A relentless hunter who studies their prey and strikes with devastating precision, ending fights before they begin.",
        features: [
          {
            name: "Hunter's Focus",
            description:
              "As a bonus action, study a creature. For 1 minute, your attacks against it deal extra damage equal to your Strength modifier.",
            level: 1,
          },
          {
            name: "Crippling Blow",
            description:
              "When you score a critical hit, the target's speed is halved and it has disadvantage on attack rolls until the end of your next turn.",
            level: 1,
          },
        ],
      },
    ],
  },
  {
    id: "wizard",
    name: "Wizard",
    description:
      "Scholarly mages who unlock the secrets of the universe through study, inscribing spells into memory and bending reality through intellect.",
    evasion: 11,
    baseHP: 5,
    domains: ["Codex", "Splendor"],
    subclasses: [
      {
        id: "school-of-knowledge",
        name: "School of Knowledge",
        description:
          "A wizard devoted to the accumulation and preservation of all learning, using vast intellect to outthink any foe.",
        features: [
          {
            name: "Encyclopedic Memory",
            description:
              "You have advantage on all Knowledge checks. Once per short rest, you can automatically succeed on a Knowledge check.",
            level: 1,
          },
          {
            name: "Tactical Analysis",
            description:
              "As an action, study a creature within 60 feet. You learn its current HP, AC, and one resistance or vulnerability.",
            level: 1,
          },
        ],
      },
      {
        id: "school-of-war",
        name: "School of War",
        description:
          "A battle mage who applies arcane theory to the art of combat, turning spellcraft into a weapon of mass destruction.",
        features: [
          {
            name: "Battle Mage",
            description:
              "When you cast a spell while wielding a weapon, you can make a weapon attack as a bonus action.",
            level: 1,
          },
          {
            name: "Arcane Arsenal",
            description:
              "As an action, imbue a weapon with arcane energy for 1 minute. It deals extra force damage equal to your Knowledge modifier.",
            level: 1,
          },
        ],
      },
    ],
  },
];
