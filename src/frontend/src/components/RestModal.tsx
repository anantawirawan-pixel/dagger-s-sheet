import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/character";
import {
  CheckCircle2,
  Clock,
  Moon,
  Shield,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";

interface RestModalProps {
  isOpen: boolean;
  restType: "short" | "long";
  character: Character;
  onConfirm: () => void;
  onClose: () => void;
}

/** Per Daggerheart SRD: proficiency bonus = floor(level / 4) + 1 */
function getProficiencyBonus(level: number): number {
  return Math.floor(level / 4) + 1;
}

/** How many HP slots will be cleared on a short rest */
function shortRestHPCleared(character: Character): number {
  const prof = getProficiencyBonus(character.level);
  const markedHP = character.maxHitPoints - character.hitPoints;
  return Math.min(prof, markedHP);
}

export default function RestModal({
  isOpen,
  restType,
  character,
  onConfirm,
  onClose,
}: RestModalProps) {
  const isShort = restType === "short";
  const prof = getProficiencyBonus(character.level);
  const hpCleared = isShort ? shortRestHPCleared(character) : 0;
  const currentMarkedHP = character.maxHitPoints - character.hitPoints;
  const currentStress = character.stress;
  const currentHope = character.hope;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto sm:max-w-lg",
          "border-2 modal-content-bg shadow-2xl",
          isShort ? "border-blue-500/50" : "border-primary/50",
        )}
        data-ocid="rest_modal.dialog"
      >
        {/* Header */}
        <DialogHeader>
          <DialogTitle
            className={cn(
              "flex items-center gap-2.5 text-xl font-semibold",
              isShort ? "text-blue-400" : "text-primary",
            )}
          >
            {isShort ? (
              <Moon className="size-6 text-blue-400" />
            ) : (
              <Sun className="size-6 text-primary" />
            )}
            {isShort ? "Short Rest" : "Long Rest"}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {isShort
              ? "Takes approximately 1 hour in-world"
              : "Takes approximately 8 hours in-world"}
          </DialogDescription>
        </DialogHeader>

        {/* Recovery Summary */}
        <div className="space-y-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            What will be restored
          </p>

          <div className="space-y-2">
            {/* HP Recovery */}
            {isShort ? (
              <RecoveryRow
                icon={
                  <span className="text-base leading-none text-red-400">♥</span>
                }
                label="Hit Points"
                detail={
                  currentMarkedHP === 0
                    ? "Already fully healed"
                    : `Clear ${hpCleared} of ${currentMarkedHP} marked slot${currentMarkedHP !== 1 ? "s" : ""} (Proficiency ${prof})`
                }
                from={
                  currentMarkedHP > 0
                    ? `${character.hitPoints}/${character.maxHitPoints} HP`
                    : undefined
                }
                to={
                  currentMarkedHP > 0
                    ? `${Math.min(character.hitPoints + hpCleared, character.maxHitPoints)}/${character.maxHitPoints} HP`
                    : undefined
                }
                noChange={currentMarkedHP === 0}
              />
            ) : (
              <RecoveryRow
                icon={
                  <span className="text-base leading-none text-red-400">♥</span>
                }
                label="Hit Points"
                detail="Fully restored"
                from={
                  currentMarkedHP > 0
                    ? `${character.hitPoints}/${character.maxHitPoints} HP`
                    : undefined
                }
                to={
                  currentMarkedHP > 0
                    ? `${character.maxHitPoints}/${character.maxHitPoints} HP`
                    : undefined
                }
                noChange={currentMarkedHP === 0}
              />
            )}

            {/* Stress Recovery */}
            <RecoveryRow
              icon={<Zap className="size-4 text-yellow-400" />}
              label="Stress"
              detail="All stress cleared"
              from={currentStress > 0 ? `${currentStress} stress` : undefined}
              to={currentStress > 0 ? "0 stress" : undefined}
              noChange={currentStress === 0}
            />

            {/* Armor Recovery */}
            <RecoveryRow
              icon={<Shield className="size-4 text-emerald-400" />}
              label="Armor Score"
              detail="Armor score restored to full"
              from={undefined}
              to={undefined}
              noChange={false}
              note="All spent armor slots refreshed"
            />

            {/* Hope — Long Rest only */}
            {!isShort && (
              <RecoveryRow
                icon={<Sparkles className="size-4 text-amber-400" />}
                label="Hope"
                detail="Reset to 2 (standard starting hope)"
                from={currentHope !== 2 ? `${currentHope} hope` : undefined}
                to={currentHope !== 2 ? "2 hope" : undefined}
                noChange={currentHope === 2}
              />
            )}

            {/* Spell Slots — Long Rest only */}
            {!isShort && (
              <RecoveryRow
                icon={<Sparkles className="size-4 text-purple-400" />}
                label="Spell Slots"
                detail="All domain spell slots replenished"
                from={undefined}
                to={undefined}
                noChange={false}
              />
            )}

            {/* Limited abilities — Long Rest only */}
            {!isShort && (
              <RecoveryRow
                icon={<CheckCircle2 className="size-4 text-violet-400" />}
                label="Limited-Use Abilities"
                detail="All daily ability uses refreshed"
                from={undefined}
                to={undefined}
                noChange={false}
                note="Class features and domain card abilities reset"
              />
            )}
          </div>

          {/* Flavour note */}
          <div
            className={cn(
              "mt-4 rounded-lg border p-3 text-xs leading-relaxed text-muted-foreground",
              isShort
                ? "border-blue-500/20 bg-blue-500/5"
                : "border-primary/20 bg-primary/5",
            )}
          >
            {isShort ? (
              <>
                <span className="font-medium text-blue-400">Short Rest</span> —
                Your party finds a moment to catch their breath. You tend
                wounds, calm your nerves, and ready your armor before pressing
                on.
              </>
            ) : (
              <>
                <span className="font-medium text-primary">Long Rest</span> —
                Your party settles in for a full night's reprieve. Wounds close,
                hope is rekindled, and your full power returns with the dawn.
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="rest_modal.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={cn(
              "gap-2 font-semibold transition-smooth",
              isShort
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            data-ocid="rest_modal.confirm_button"
          >
            {isShort ? <Moon className="size-4" /> : <Sun className="size-4" />}
            Begin {isShort ? "Short" : "Long"} Rest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

interface RecoveryRowProps {
  icon: React.ReactNode;
  label: string;
  detail: string;
  from?: string;
  to?: string;
  noChange: boolean;
  note?: string;
}

function RecoveryRow({
  icon,
  label,
  detail,
  from,
  to,
  noChange,
  note,
}: RecoveryRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 transition-colors",
        noChange
          ? "border-border/40 bg-[oklch(0.2_0.07_262/0.3)] opacity-60"
          : "border-border/60 bg-[oklch(0.2_0.07_262/0.5)]",
      )}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {noChange && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              Already full
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
        {from && to && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded bg-muted/60 px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {from}
            </span>
            <span className="text-xs text-muted-foreground">→</span>
            <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-xs font-medium text-primary">
              {to}
            </span>
          </div>
        )}
        {note && (
          <p className="mt-1 text-[11px] italic text-muted-foreground/70">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
