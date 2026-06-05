import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CLASSES } from "@/data/classes";
import { DOMAIN_CARDS } from "@/data/domainCards";
import { LEVEL_PROGRESSION } from "@/data/levelProgression";
import { DOMAIN_ACCENT_HEX } from "@/data/spells";
import { cn } from "@/lib/utils";
import { useCharacterStore } from "@/store/useCharacterStore";
import type { Character, DomainCard } from "@/types/character";
import {
  ArrowUp,
  Brain,
  Crown,
  Heart,
  Shield,
  Sparkles,
  Star,
  Swords,
  Zap,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

interface LevelUpModalProps {
  character: Character;
  open?: boolean;
  onClose?: () => void;
}

export default function LevelUpModal({
  character,
  open: controlledOpen,
  onClose,
}: LevelUpModalProps) {
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);
  const [internalOpen, setInternalOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(value);
    if (!value && onClose) onClose();
  };

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const currentLevel = character.level;
  const nextLevel = currentLevel + 1;
  const isMaxLevel = currentLevel >= 10;

  const progression = useMemo(
    () => LEVEL_PROGRESSION.find((p) => p.level === nextLevel),
    [nextLevel],
  );

  const characterClass = useMemo(
    () => CLASSES.find((c) => c.id === character.classId),
    [character.classId],
  );

  const availableCards = useMemo(() => {
    if (!progression?.domainCardChoice || !characterClass) return [];
    const classDomains = characterClass.domains;
    return DOMAIN_CARDS.filter(
      (card) =>
        classDomains.includes(card.domain) &&
        !character.domainCards.includes(card.id),
    );
  }, [progression, characterClass, character.domainCards]);

  const subclass = useMemo(
    () => characterClass?.subclasses.find((s) => s.id === character.subclassId),
    [characterClass, character.subclassId],
  );

  const unlockFeature = useMemo(() => {
    if (!progression?.unlock) return null;
    if (progression.unlock === "specialization" && subclass) {
      return {
        type: "specialization" as const,
        title: "Specialization Unlocked",
        subtitle: subclass.name,
        description:
          subclass.features[0]?.description ??
          "New specialization features are now available.",
      };
    }
    if (progression.unlock === "mastery" && subclass) {
      return {
        type: "mastery" as const,
        title: "Mastery Unlocked",
        subtitle: subclass.name,
        description:
          subclass.features[1]?.description ??
          "New mastery features are now available.",
      };
    }
    return null;
  }, [progression, subclass]);

  const computedChanges = useMemo(() => {
    if (!progression) return null;
    return {
      newLevel: nextLevel,
      newProficiency: progression.proficiencyIncrease
        ? character.proficiency + 1
        : character.proficiency,
      newEvasion: character.evasion + progression.evasionIncrease,
      newArmorThreshold:
        character.armorThreshold + progression.armorThresholdIncrease,
      newMaxHP: character.maxHitPoints + progression.hpIncrease,
      newExperiences: character.experiences as string[],
      newDomainCards: selectedCardId
        ? [...character.domainCards, selectedCardId]
        : character.domainCards,
      newHistory: [
        ...character.levelUpHistory,
        {
          level: nextLevel,
          proficiencyIncrease: progression.proficiencyIncrease,
          hpIncrease: progression.hpIncrease,
          evasionIncrease: progression.evasionIncrease,
          armorThresholdIncrease: progression.armorThresholdIncrease,
          domainCardChoice: progression.domainCardChoice,
          experienceIncrease: progression.experienceIncrease,
          unlock: progression.unlock,
        },
      ],
    };
  }, [progression, character, nextLevel, selectedCardId]);

  const canApply = useMemo(() => {
    if (!progression) return false;
    if (progression.domainCardChoice && !selectedCardId) return false;
    return true;
  }, [progression, selectedCardId]);

  function handleApply() {
    if (!computedChanges || confirming) return;
    setConfirming(true);
    setTimeout(() => {
      updateCharacter(character.id, {
        level: computedChanges.newLevel,
        proficiency: computedChanges.newProficiency,
        evasion: computedChanges.newEvasion,
        armorThreshold: computedChanges.newArmorThreshold,
        maxHitPoints: computedChanges.newMaxHP,
        hitPoints: Math.min(
          character.hitPoints + (progression?.hpIncrease ?? 0),
          computedChanges.newMaxHP,
        ),
        experiences: computedChanges.newExperiences,
        domainCards: computedChanges.newDomainCards,
        levelUpHistory: computedChanges.newHistory,
      });
      setSelectedCardId(null);
      setConfirming(false);
      setOpen(false);
    }, 900);
  }

  if (isMaxLevel && controlledOpen === undefined) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        className="modal-content-bg max-h-[90vh] overflow-y-auto border sm:max-w-2xl"
        data-ocid="levelup.dialog"
      >
        {/* Epic header banner */}
        <div
          className="relative -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg px-6 pt-6 pb-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.1 265 / 0.98), oklch(0.22 0.12 285 / 0.95))",
            borderBottom: "1px solid oklch(0.45 0.18 270 / 0.4)",
          }}
        >
          <div className="pointer-events-none absolute top-2 right-4 select-none text-2xl opacity-20">
            ✦
          </div>
          <div className="pointer-events-none absolute bottom-2 left-4 select-none text-xl opacity-15">
            ✧
          </div>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-full border-2 shadow-lg"
                style={{
                  borderColor: "oklch(0.75 0.22 285 / 0.7)",
                  background: "oklch(0.2 0.1 275 / 0.8)",
                  boxShadow: "0 0 20px oklch(0.55 0.22 285 / 0.5)",
                }}
              >
                <Sparkles
                  className="size-6"
                  style={{ color: "oklch(0.85 0.18 285)" }}
                />
              </div>
              <div>
                <DialogTitle
                  className="font-display text-2xl font-black tracking-wide"
                  style={{ color: "oklch(0.97 0.03 275)" }}
                >
                  Level Up!
                </DialogTitle>
                <DialogDescription
                  className="mt-0.5 text-sm font-semibold"
                  style={{ color: "oklch(0.8 0.08 270)" }}
                >
                  {character.name} · Level {currentLevel}{" "}
                  <span style={{ color: "oklch(0.85 0.18 285)" }}>
                    → Level {nextLevel}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-1">
          {/* Stat Increases */}
          <section>
            <SectionHeader
              icon={<Zap className="size-4" />}
              label="Stat Increases"
            />
            <hr className="divider-ornate mt-2 mb-3" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatChange
                icon={
                  <Heart
                    className="size-4"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                  />
                }
                label="Max HP"
                current={character.maxHitPoints}
                next={computedChanges?.newMaxHP ?? character.maxHitPoints}
                increase={progression?.hpIncrease ?? 0}
                accentColor="oklch(0.65 0.22 25)"
              />
              <StatChange
                icon={
                  <Swords
                    className="size-4"
                    style={{ color: "oklch(0.78 0.15 85)" }}
                  />
                }
                label="Proficiency"
                current={character.proficiency}
                next={computedChanges?.newProficiency ?? character.proficiency}
                increase={progression?.proficiencyIncrease ? 1 : 0}
                accentColor="oklch(0.78 0.15 85)"
              />
              <StatChange
                icon={
                  <Shield
                    className="size-4"
                    style={{ color: "oklch(0.65 0.2 175)" }}
                  />
                }
                label="Evasion"
                current={character.evasion}
                next={computedChanges?.newEvasion ?? character.evasion}
                increase={progression?.evasionIncrease ?? 0}
                accentColor="oklch(0.65 0.2 175)"
              />
              <StatChange
                icon={
                  <Star
                    className="size-4"
                    style={{ color: "oklch(0.6 0.22 260)" }}
                  />
                }
                label="Armor"
                current={character.armorThreshold}
                next={
                  computedChanges?.newArmorThreshold ?? character.armorThreshold
                }
                increase={progression?.armorThresholdIncrease ?? 0}
                accentColor="oklch(0.6 0.22 260)"
              />
            </div>
          </section>

          {/* Experience gain */}
          {progression && progression.experienceIncrease > 0 && (
            <section>
              <SectionHeader
                icon={<Brain className="size-4" />}
                label="Experience"
              />
              <hr className="divider-ornate mt-2 mb-3" />
              <div
                className="rounded-xl border px-4 py-3"
                style={{
                  background: "oklch(0.19 0.08 280 / 0.6)",
                  borderColor: "oklch(0.55 0.2 285 / 0.4)",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.92 0.06 275)" }}
                >
                  +{progression.experienceIncrease} new experience slot
                  {progression.experienceIncrease > 1 ? "s" : ""} added.
                </p>
                <p
                  className="mt-1 text-xs"
                  style={{ color: "oklch(0.74 0.06 270)" }}
                >
                  Write in a new experience that can help your character during
                  ability checks.
                </p>
              </div>
            </section>
          )}

          {/* Specialization / Mastery unlock */}
          {unlockFeature && (
            <section>
              <hr className="divider-ornate mb-3" />
              {unlockFeature.type === "specialization" ? (
                <SpecializationCard feature={unlockFeature} />
              ) : (
                <MasteryCard feature={unlockFeature} />
              )}
            </section>
          )}

          {/* Domain Card Choice */}
          {progression?.domainCardChoice && (
            <section>
              <SectionHeader
                icon={<Star className="size-4" />}
                label="Choose a Domain Card"
              />
              <hr className="divider-ornate mt-2 mb-3" />
              {availableCards.length > 0 ? (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {availableCards.map((card) => (
                    <CardOption
                      key={card.id}
                      card={card}
                      selected={selectedCardId === card.id}
                      onSelect={() => setSelectedCardId(card.id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-xl border px-4 py-3 text-sm font-medium"
                  style={{
                    background: "oklch(0.19 0.06 262 / 0.5)",
                    borderColor: "oklch(0.35 0.08 262 / 0.5)",
                    color: "oklch(0.75 0.06 270)",
                  }}
                >
                  No additional domain cards available for your class domains.
                </div>
              )}
            </section>
          )}
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={confirming}
            className="border-border/50 font-semibold"
            style={{ color: "oklch(0.8 0.06 270)" }}
            data-ocid="levelup.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!canApply || confirming}
            className={cn(
              "gap-2 font-black tracking-wide text-white transition-all duration-300",
              confirming && "scale-105",
            )}
            style={{
              background: confirming
                ? "linear-gradient(135deg, oklch(0.55 0.2 155), oklch(0.45 0.18 165))"
                : "linear-gradient(135deg, oklch(0.5 0.22 285), oklch(0.45 0.22 260))",
              boxShadow: confirming
                ? "0 0 28px oklch(0.55 0.2 155 / 0.7), 0 0 56px oklch(0.45 0.18 165 / 0.35)"
                : "0 0 16px oklch(0.5 0.22 285 / 0.4)",
              border: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            data-ocid="levelup.confirm_button"
          >
            {confirming ? (
              <>
                <Sparkles className="size-4 animate-spin" />
                Ascending…
              </>
            ) : (
              <>
                <ArrowUp className="size-4" />
                Ascend to Level {nextLevel}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatChange({
  icon,
  label,
  current,
  next,
  increase,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  current: number;
  next: number;
  increase: number;
  accentColor: string;
}) {
  const hasIncrease = increase > 0;
  return (
    <div
      className="rounded-xl border px-3 py-3 text-center"
      style={{
        background: "oklch(0.19 0.08 265 / 0.65)",
        borderColor: hasIncrease
          ? accentColor.replace(")", " / 0.5)")
          : "oklch(0.32 0.08 262 / 0.5)",
        boxShadow: hasIncrease
          ? `0 0 12px ${accentColor.replace(")", " / 0.2)")}`
          : "none",
      }}
    >
      <div
        className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider"
        style={{ color: "oklch(0.78 0.07 270)" }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-2 flex items-baseline justify-center gap-1">
        <span className="text-sm" style={{ color: "oklch(0.62 0.06 270)" }}>
          {current}
        </span>
        <span className="text-xs" style={{ color: "oklch(0.55 0.05 270)" }}>
          →
        </span>
        <span
          className="font-display text-2xl font-black"
          style={{ color: hasIncrease ? accentColor : "oklch(0.9 0.04 270)" }}
        >
          {next}
        </span>
      </div>
      {hasIncrease && (
        <div
          className="mx-auto mt-1 w-fit rounded-full px-2 py-0.5 text-xs font-bold"
          style={{
            background: accentColor.replace(")", " / 0.15)"),
            color: accentColor,
          }}
        >
          +{increase}
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  icon,
  label,
}: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-widest"
      style={{ color: "oklch(0.88 0.1 275)" }}
    >
      <span style={{ color: "oklch(0.7 0.18 285)" }}>{icon}</span>
      {label}
    </div>
  );
}

type UnlockFeature = {
  type: "specialization" | "mastery";
  title: string;
  subtitle: string;
  description: string;
};

function SpecializationCard({ feature }: { feature: UnlockFeature }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border-2 p-5"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.2 0.1 80 / 0.55), oklch(0.22 0.12 70 / 0.45))",
        borderColor: "oklch(0.78 0.15 85 / 0.7)",
        boxShadow:
          "0 0 32px oklch(0.78 0.15 85 / 0.3), inset 0 1px 0 oklch(0.85 0.12 85 / 0.15)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 80% 0%, oklch(0.85 0.18 85 / 0.1) 0%, transparent 60%)",
        }}
      />
      <div className="flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border-2"
          style={{
            borderColor: "oklch(0.78 0.15 85 / 0.6)",
            background: "oklch(0.22 0.1 80 / 0.7)",
            boxShadow: "0 0 16px oklch(0.78 0.15 85 / 0.4)",
          }}
        >
          <Crown className="size-5" style={{ color: "oklch(0.88 0.18 85)" }} />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="font-display text-xs font-black uppercase tracking-[0.15em]"
            style={{ color: "oklch(0.82 0.15 85)" }}
          >
            {feature.title}
          </div>
          <div
            className="mt-0.5 font-display text-lg font-black"
            style={{ color: "oklch(0.96 0.05 80)" }}
          >
            {feature.subtitle}
          </div>
          <p
            className="mt-1.5 text-sm leading-relaxed"
            style={{ color: "oklch(0.88 0.05 75)" }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function MasteryCard({ feature }: { feature: UnlockFeature }) {
  return (
    <div
      className="animate-glow-pulse relative overflow-hidden rounded-2xl border-2 p-5"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.1 290 / 0.65), oklch(0.2 0.12 280 / 0.55))",
        borderColor: "oklch(0.65 0.22 290 / 0.8)",
        boxShadow:
          "0 0 40px oklch(0.55 0.22 290 / 0.4), inset 0 1px 0 oklch(0.7 0.15 290 / 0.2)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, oklch(0.65 0.22 290 / 0.12) 0%, transparent 60%)",
        }}
      />
      <div className="flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border-2"
          style={{
            borderColor: "oklch(0.65 0.22 290 / 0.7)",
            background: "oklch(0.2 0.12 285 / 0.8)",
            boxShadow:
              "0 0 20px oklch(0.55 0.22 290 / 0.5), inset 0 0 8px oklch(0.65 0.22 290 / 0.15)",
          }}
        >
          <Sparkles
            className="size-5"
            style={{ color: "oklch(0.78 0.22 290)" }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="font-display text-xs font-black uppercase tracking-[0.15em]"
            style={{ color: "oklch(0.75 0.2 290)" }}
          >
            {feature.title}
          </div>
          <div
            className="mt-0.5 font-display text-lg font-black"
            style={{ color: "oklch(0.96 0.04 275)" }}
          >
            {feature.subtitle}
          </div>
          <p
            className="mt-1.5 text-sm leading-relaxed"
            style={{ color: "oklch(0.88 0.05 275)" }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function CardOption({
  card,
  selected,
  onSelect,
}: {
  card: DomainCard;
  selected: boolean;
  onSelect: () => void;
}) {
  const accentHex =
    DOMAIN_ACCENT_HEX[card.domain as keyof typeof DOMAIN_ACCENT_HEX];
  const accent = accentHex ?? "#6366f1";
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-xl border-2 p-4 text-left transition-smooth hover:brightness-110 active:scale-[0.99]"
      style={{
        borderColor: selected ? accent : `${accent}55`,
        boxShadow: selected
          ? `0 0 18px ${accent}60, inset 0 1px 0 ${accent}20`
          : "none",
        background: selected ? `${accent}18` : "oklch(0.19 0.07 262 / 0.6)",
      }}
      data-ocid={`levelup.card_option.${card.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div
            className="font-display text-sm font-bold"
            style={{ color: "oklch(0.95 0.04 275)" }}
          >
            {card.name}
          </div>
          <div
            className="mt-0.5 text-xs font-semibold uppercase tracking-wide"
            style={{ color: accent }}
          >
            {card.domain} · {card.type} · Level {card.level}
          </div>
        </div>
        <div
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-smooth"
          style={{
            borderColor: selected ? accent : "oklch(0.4 0.08 270)",
            background: selected ? accent : "transparent",
            boxShadow: selected ? `0 0 8px ${accent}80` : "none",
          }}
        />
      </div>
      <p
        className="mt-2 text-xs leading-relaxed"
        style={{ color: "oklch(0.77 0.05 270)" }}
      >
        {card.description}
      </p>
    </button>
  );
}
