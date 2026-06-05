export interface TraitSet {
  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;
}

export interface AncestryFeature {
  name: string;
  description: string;
}

export interface Ancestry {
  id: string;
  name: string;
  description: string;
  features: AncestryFeature[];
}

export interface CommunityFeature {
  name: string;
  description: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  feature: CommunityFeature;
}

export interface SubclassFeature {
  name: string;
  description: string;
  level: number;
}

export interface Subclass {
  id: string;
  name: string;
  description: string;
  features: SubclassFeature[];
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  evasion: number;
  baseHP: number;
  domains: string[];
  subclasses: Subclass[];
}

export type DomainCardType = "reaction" | "action" | "feature" | "spell";

export interface DomainCard {
  id: string;
  name: string;
  domain: string;
  level: number;
  type: DomainCardType;
  description: string;
}

export interface ArmorItem {
  id: string;
  name: string;
  score: number;
  evasionMod: number;
  agilityPenalty: number;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  weight: number;
  quantity: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
  description: string;
}

export interface SpellSlot {
  level: number;
  max: number;
  used: number;
}

/** Per-domain spell slot tracker keyed by domain name (e.g. "Arcana") */
export interface DomainSpellSlot {
  total: number;
  used: number;
}

export interface LevelUpRecord {
  level: number;
  proficiencyIncrease: boolean;
  hpIncrease: number;
  evasionIncrease: number;
  armorThresholdIncrease: number;
  domainCardChoice: boolean;
  experienceIncrease: number;
  unlock: string;
}

export interface DiceRoll {
  die: number;
  result: number;
  modifier: number;
  total: number;
  timestamp: number;
  label?: string;
  hopeResult?: number;
  fearResult?: number;
}

export interface HomebrewSpell {
  id: string;
  name: string;
  domain: string;
  level: number;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  components: string;
  tags: string[];
  isHomebrew: true;
  createdAt: number;
  artUrl?: string;
}

export interface DamageThresholds {
  minor: number;
  major: number;
  severe: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  proficiency: number;
  ancestryId: string;
  communityId: string;
  classId: string;
  subclassId: string;
  traits: TraitSet;
  hitPoints: number;
  maxHitPoints: number;
  hope: number;
  maxHope: number;
  fear: number;
  maxFear: number;
  stress: number;
  maxStress: number;
  armorId: string;
  evasion: number;
  armorThreshold: number;
  spendableArmor: number;
  damageThresholds: DamageThresholds;
  equipment: EquipmentItem[];
  domainCards: string[];
  spellSlots: SpellSlot[];
  /** Domain-keyed spell slot tracker — auto-populated from selected domain cards */
  domainSpellSlots: Record<string, DomainSpellSlot>;
  knownSpells: string[];
  equippedWeaponIds?: string[];
  features: string[];
  experiences: string[];
  notes: string;
  gold?: number;
  inventoryItems?: InventoryItem[];
  levelUpHistory: LevelUpRecord[];
  diceHistory?: DiceRoll[];
  combatTracker?: CombatTracker;
  portraitDataUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Party {
  id: string;
  name: string;
  memberIds: string[];
  notes?: string;
}

/** A single condition with optional auto-removal duration (null = permanent, number = turns remaining) */
export interface ConditionEntry {
  name: string;
  duration: number | null;
}

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  conditions: ConditionEntry[];
  isActive: boolean;
}

export interface CombatTracker {
  combatants: Combatant[];
  round: number;
  /** Current turn count across all rounds, increments each time a combatant's turn ends */
  turnCount: number;
  activeCombatantId: string | null;
}

export type ViewState = "list" | "create" | "sheet" | "parties" | "homebrew";
