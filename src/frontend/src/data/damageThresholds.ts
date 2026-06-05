import { ARMOR } from "@/data/armor";
import type { Character, DamageThresholds } from "@/types/character";

/**
 * Calculate damage thresholds per Daggerheart SRD.
 *
 * Major threshold = character level + proficiency + armor bonus.
 * Minor threshold = floor(major / 2).
 * Severe threshold = ceil(major * 1.5).
 *
 * Armor bonus: score of equipped armor item (3 for light, 4 for heavy).
 * Minimum minor = 2, minimum major = 4, minimum severe = 6.
 */
export function calculateDamageThresholds(
  character: Character,
): DamageThresholds {
  const { level, proficiency, armorId } = character;

  // Base major threshold from level + proficiency bonus
  const baseMajor = level + proficiency;

  // Armor score bonus from equipped armor
  const armorItem = ARMOR.find((a) => a.id === armorId);
  const armorBonus = armorItem ? armorItem.score : 0;

  const major = Math.max(4, baseMajor + armorBonus);
  const minor = Math.max(2, Math.floor(major / 2));
  const severe = Math.max(6, Math.ceil(major * 1.5));

  return { minor, major, severe };
}

/**
 * Format a threshold label for display alongside the HP tracker.
 */
export function formatThresholdLabel(thresholds: DamageThresholds): string {
  return `Minor ${thresholds.minor} / Major ${thresholds.major} / Severe ${thresholds.severe}`;
}
