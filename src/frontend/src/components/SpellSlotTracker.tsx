import { Button } from "@/components/ui/button";
import {
  DOMAIN_ACCENT_HEX,
  DOMAIN_CHIP_COLORS,
  type SpellDomain,
} from "@/data/spells";
import { cn } from "@/lib/utils";
import { useCharacterStore } from "@/store/useCharacterStore";
import type { DomainCard } from "@/types/character";
import { Minus, Plus, Sparkles } from "lucide-react";

interface SpellSlotTrackerProps {
  characterId: string;
  domainCards: DomainCard[];
  /** domainSpellSlots from the character object */
  domainSpellSlots: Record<string, { total: number; used: number }>;
}

/**
 * Per-domain spell slot tracker.
 * One row per unique domain present in the character's selected domain cards.
 * Each row shows:
 *  - Domain name chip (accent-colored)
 *  - Clickable slot circles (filled = used, empty = available)
 *  - +/- buttons to adjust the total slot count (1–10)
 */
export function SpellSlotTracker({
  characterId,
  domainCards,
  domainSpellSlots,
}: SpellSlotTrackerProps) {
  const updateSpellSlot = useCharacterStore((s) => s.updateSpellSlot);
  const setSpellSlotTotal = useCharacterStore((s) => s.setSpellSlotTotal);

  // Deduplicate domains from the character's selected cards
  const domains = Array.from(new Set(domainCards.map((c) => c.domain)));

  if (domains.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-2 py-6 text-center"
        data-ocid="spell_slot_tracker.empty_state"
      >
        <Sparkles className="size-7 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">
          Select domain cards to unlock spell slot tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" data-ocid="spell_slot_tracker">
      {domains.map((domain) => {
        const slot = domainSpellSlots[domain] ?? { total: 3, used: 0 };
        const accentHex = DOMAIN_ACCENT_HEX[domain as SpellDomain] ?? "#7C3AED";
        const chipClass = DOMAIN_CHIP_COLORS[domain as SpellDomain] ?? "";
        const available = slot.total - slot.used;

        return (
          <div
            key={domain}
            className="flex flex-col gap-2 rounded-lg border border-border/50 bg-card/40 p-3"
            style={{ borderColor: `${accentHex}33` }}
            data-ocid={`spell_slot_tracker.domain.${domain.toLowerCase()}`}
          >
            {/* Domain label + total adjuster */}
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                  chipClass,
                )}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: accentHex }}
                />
                {domain}
              </span>

              {/* Total count adjuster */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mr-1">
                  Slots
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-5 rounded text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setSpellSlotTotal(characterId, domain, slot.total - 1)
                  }
                  disabled={slot.total <= 1}
                  data-ocid={`spell_slot_tracker.${domain.toLowerCase()}.decrease_total`}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-4 text-center text-xs font-bold tabular-nums text-foreground">
                  {slot.total}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-5 rounded text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setSpellSlotTotal(characterId, domain, slot.total + 1)
                  }
                  disabled={slot.total >= 10}
                  data-ocid={`spell_slot_tracker.${domain.toLowerCase()}.increase_total`}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            {/* Slot flame balls */}
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: slot.total }).map((_, i) => {
                const isUsed = i < slot.used;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={
                      isUsed
                        ? `Mark slot ${i + 1} available`
                        : `Mark slot ${i + 1} used`
                    }
                    onClick={() =>
                      updateSpellSlot(
                        characterId,
                        domain,
                        isUsed ? slot.used - 1 : slot.used + 1,
                      )
                    }
                    className={cn(
                      "text-lg leading-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded",
                      isUsed ? "opacity-30 grayscale" : "",
                    )}
                    style={
                      isUsed
                        ? undefined
                        : {
                            filter: `drop-shadow(0 0 5px ${accentHex}cc)`,
                          }
                    }
                    data-ocid={`spell_slot_tracker.${domain.toLowerCase()}.slot.${i + 1}`}
                  >
                    🔥
                  </button>
                );
              })}
            </div>

            {/* Available count */}
            <p className="text-[10px] text-muted-foreground">
              <span
                className="font-semibold tabular-nums"
                style={{ color: accentHex }}
              >
                {available}
              </span>
              &nbsp;of {slot.total} available
            </p>
          </div>
        );
      })}
    </div>
  );
}
