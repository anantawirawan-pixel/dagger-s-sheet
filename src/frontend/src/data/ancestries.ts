import type { Ancestry } from "@/types/character";

export const ANCESTRIES: Ancestry[] = [
  {
    id: "clank",
    name: "Clank",
    description:
      "Mechanical constructs given life by artifice or accident, clanks are living machines of metal, wood, and magic.",
    features: [
      {
        name: "Constructed Resilience",
        description:
          "You do not need to eat, breathe, or sleep. You have advantage on saves against poison and disease.",
      },
      {
        name: "Integrated Tool",
        description:
          "Choose one set of tools. They are built into your body and cannot be disarmed or lost.",
      },
    ],
  },
  {
    id: "drakona",
    name: "Drakona",
    description:
      "Descendants of ancient dragons, drakona carry draconic blood that manifests in scales, horns, and a breath of elemental fury.",
    features: [
      {
        name: "Draconic Heritage",
        description:
          "Choose fire, ice, lightning, or acid. You have resistance to that damage type.",
      },
      {
        name: "Breath Weapon",
        description:
          "As an action, exhale destructive energy in a 15-foot cone. Creatures must make an Agility save or take 2d6 damage of your chosen type.",
      },
    ],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    description:
      "Stout and resilient, dwarves are master craftsmen and tunnelers with an unbreakable connection to stone and forge.",
    features: [
      {
        name: "Stoneheart",
        description:
          "You have advantage on saves against being moved against your will. You can sense the direction of true north while underground.",
      },
      {
        name: "Forge-Born",
        description:
          "You have proficiency with one set of artisan's tools of your choice. Items you craft take half the usual time.",
      },
    ],
  },
  {
    id: "elf",
    name: "Elf",
    description:
      "Elegant and long-lived, elves possess keen senses, an affinity for magic, and a deep connection to the natural world.",
    features: [
      {
        name: "Fey Sight",
        description:
          "You can see in dim light within 60 feet as if it were bright light. You have advantage on checks to perceive hidden creatures.",
      },
      {
        name: "Trance",
        description:
          "You do not sleep. Instead, you meditate deeply for 4 hours a day, gaining the benefits of a long rest in half the time.",
      },
    ],
  },
  {
    id: "faerie",
    name: "Faerie",
    description:
      "Tiny, winged creatures of pure magic, faeries are mischievous, curious, and surprisingly powerful despite their diminutive size.",
    features: [
      {
        name: "Winged",
        description:
          "You have a fly speed equal to your walking speed. You can hover in place.",
      },
      {
        name: "Fey Magic",
        description:
          "You know one cantrip from the Grace or Splendor domain. You can cast it at will.",
      },
    ],
  },
  {
    id: "faun",
    name: "Faun",
    description:
      "Goat-legged folk of the wild places, fauns are joyful, musical, and deeply attuned to the rhythms of nature.",
    features: [
      {
        name: "Sure-Footed",
        description:
          "You have advantage on Agility checks to maintain balance or resist being knocked prone. Difficult terrain does not slow you.",
      },
      {
        name: "Nature's Rhythm",
        description:
          "You have advantage on Presence checks to perform music, dance, or tell stories. You can cast Charm Person once per short rest.",
      },
    ],
  },
  {
    id: "firbolg",
    name: "Firbolg",
    description:
      "Gentle giant-kin who dwell in ancient forests, firbolgs are reclusive caretakers of the wild with a gift for magic and stealth.",
    features: [
      {
        name: "Hidden Step",
        description:
          "As a bonus action, you can magically turn invisible until the start of your next turn or until you attack. Once per short rest.",
      },
      {
        name: "Powerful Build",
        description:
          "You count as one size larger for carrying capacity and pushing, dragging, or lifting.",
      },
    ],
  },
  {
    id: "fungril",
    name: "Fungril",
    description:
      "Mushroom folk who sprout from the damp places of the world, fungrils are resilient, communal, and surprisingly wise.",
    features: [
      {
        name: "Spore Cloud",
        description:
          "As a reaction when hit by a melee attack, release a cloud of spores. The attacker must make a Strength save or be poisoned until the end of their next turn.",
      },
      {
        name: "Regeneration",
        description:
          "When you take a short rest and spend at least one Hit Die, you regain additional hit points equal to your Instinct modifier.",
      },
    ],
  },
  {
    id: "galapa",
    name: "Galapa",
    description:
      "Turtle-folk with sturdy shells and patient wisdom, galapas are natural defenders who outlast any storm through sheer endurance.",
    features: [
      {
        name: "Shell Defense",
        description:
          "As a bonus action, withdraw into your shell. You gain +2 AC but your speed becomes 0 until the start of your next turn.",
      },
      {
        name: "Longevity",
        description:
          "You have advantage on saves against disease and poison. You require half as much food and water as other ancestries.",
      },
    ],
  },
  {
    id: "giant",
    name: "Giant",
    description:
      "Towering humanoids of immense strength, giants are feared and respected in equal measure for their raw physical power.",
    features: [
      {
        name: "Titan's Strength",
        description:
          "You have advantage on Strength checks to lift, push, or break objects. Your carrying capacity is doubled.",
      },
      {
        name: "Thunderous Voice",
        description:
          "As an action, unleash a thunderous shout. Creatures of your choice within 15 feet must make a Strength save or be pushed 10 feet and knocked prone.",
      },
    ],
  },
  {
    id: "goblin",
    name: "Goblin",
    description:
      "Small, cunning, and endlessly resourceful, goblins survive through wit, speed, and an uncanny knack for finding trouble.",
    features: [
      {
        name: "Nimble Escape",
        description: "As a bonus action, you can Disengage or Hide.",
      },
      {
        name: "Scavenger's Eye",
        description:
          "You have advantage on Instinct checks to find hidden objects, traps, or secret doors.",
      },
    ],
  },
  {
    id: "halfling",
    name: "Halfling",
    description:
      "Small, cheerful, and remarkably lucky, halflings find joy in simple pleasures and have a knack for being exactly where they need to be.",
    features: [
      {
        name: "Lucky",
        description:
          "When you roll a 1 on a d20, you may reroll the die and must use the new roll.",
      },
      {
        name: "Brave",
        description: "You have advantage on saves against being frightened.",
      },
    ],
  },
  {
    id: "human",
    name: "Human",
    description:
      "Ambitious and adaptable, humans thrive in every corner of the world, building empires and forging destinies through sheer determination.",
    features: [
      {
        name: "Versatile",
        description:
          "You gain proficiency in one additional skill of your choice.",
      },
      {
        name: "Determined",
        description:
          "When you fail an ability check, attack roll, or save, you can add a d4 to the result. Once per short rest.",
      },
    ],
  },
  {
    id: "infernis",
    name: "Infernis",
    description:
      "Touched by infernal heritage, infernis bear the smoldering legacy of the lower planes in their eyes, skin, and burning will.",
    features: [
      {
        name: "Hellfire Resistance",
        description:
          "You have resistance to fire damage. You can see in magical darkness out to 60 feet.",
      },
      {
        name: "Infernal Legacy",
        description:
          "You know the Hellfire Bolt cantrip. At 3rd level, you learn to cast Scorching Ray once per long rest.",
      },
    ],
  },
  {
    id: "katari",
    name: "Katari",
    description:
      "Cat-folk of grace and mystery, katari are agile hunters with sharp senses and an independent spirit that refuses to be tamed.",
    features: [
      {
        name: "Feline Agility",
        description:
          "Your walking speed increases by 5 feet. When you move on your turn in combat, you can double your speed until the end of your turn. Once per short rest.",
      },
      {
        name: "Cat's Claws",
        description:
          "Your claws are natural weapons dealing 1d6 + Agility slashing damage. You have advantage on Agility checks to climb.",
      },
    ],
  },
  {
    id: "orc",
    name: "Orc",
    description:
      "Fierce and proud, orcs are warriors born with a fire in their blood, turning pain into strength and battle into art.",
    features: [
      {
        name: "Relentless Endurance",
        description:
          "When reduced to 0 HP but not killed outright, you can drop to 1 HP instead. Once per long rest.",
      },
      {
        name: "Savage Attacks",
        description:
          "When you score a critical hit with a melee weapon, you roll one additional damage die.",
      },
    ],
  },
  {
    id: "ribbet",
    name: "Ribbet",
    description:
      "Frog-folk of the wetlands and rivers, ribbets are amphibious, long-tongued, and surprisingly adept at leaping into and out of danger.",
    features: [
      {
        name: "Amphibious",
        description:
          "You can breathe air and water. You have a swim speed equal to your walking speed.",
      },
      {
        name: "Long Leap",
        description:
          "Your long jump is up to 20 feet and your high jump is up to 10 feet, with or without a running start.",
      },
    ],
  },
  {
    id: "simiah",
    name: "Simiah",
    description:
      "Ape and monkey-folk of the jungle canopies, simiahs are agile climbers with prehensile tails and an infectious curiosity.",
    features: [
      {
        name: "Prehensile Tail",
        description:
          "You can use your tail to hold and manipulate objects. You have advantage on Agility checks to climb or maintain grip.",
      },
      {
        name: "Mimicry",
        description:
          "You can perfectly mimic sounds and voices you have heard. You have advantage on Presence checks to deceive using mimicry.",
      },
    ],
  },
  {
    id: "mixed-ancestry",
    name: "Mixed Ancestry",
    description:
      "Born of two worlds, those of mixed ancestry blend the traits of their parents into something entirely unique.",
    features: [
      {
        name: "Dual Heritage",
        description:
          "Choose two ancestries. You gain one feature from each. Work with your GM to determine your appearance and cultural background.",
      },
      {
        name: "Adaptable",
        description:
          "You gain proficiency in one skill of your choice. You can speak, read, and write one additional language.",
      },
    ],
  },
];
