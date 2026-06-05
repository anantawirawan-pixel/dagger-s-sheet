import { CampaignJournal } from "@/components/CampaignJournal";
import { CharacterPortrait } from "@/components/CharacterPortrait";
import { DamageThresholdDisplay } from "@/components/DamageThresholdDisplay";
import { ExperienceSection } from "@/components/ExperienceSection";
import { DomainCardItem, FeatureCard } from "@/components/FeatureCard";
import { HomebrewAncestryCreator } from "@/components/HomebrewAncestryCreator";
import { HomebrewCommunityCreator } from "@/components/HomebrewCommunityCreator";
import { Layout } from "@/components/Layout";
import LevelUpModal from "@/components/LevelUpModal";
import RestModal from "@/components/RestModal";
import { SpellCastAnimation } from "@/components/SpellCastAnimation";
import { SpellCompendiumModal } from "@/components/SpellCompendiumModal";
import { SpellSlotTracker } from "@/components/SpellSlotTracker";
import { SpendableArmorTracker } from "@/components/SpendableArmorTracker";
import { StatTracker } from "@/components/StatTracker";
import { WeaponDisplay } from "@/components/WeaponDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ANCESTRIES } from "@/data/ancestries";
import { ARMOR } from "@/data/armor";
import { CLASSES } from "@/data/classes";
import { COMMUNITIES } from "@/data/communities";
import { calculateDamageThresholds } from "@/data/damageThresholds";
import { DOMAIN_CARDS } from "@/data/domainCards";
import type { Spell } from "@/data/spells";
import { DOMAIN_ACCENT_HEX, SPELLS } from "@/data/spells";
import { useClickSound } from "@/hooks/useClickSound";
import { useCharacterStore } from "@/store/useCharacterStore";
import type { Character, SpellSlot } from "@/types/character";
import { exportCharacterCardToImage } from "@/utils/exportImage";
import { exportCharacterToPDF } from "@/utils/exportPdf";
import {
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Camera,
  Download,
  Flame,
  Footprints,
  Heart,
  Home,
  Lock,
  Moon,
  Package,
  Plus,
  Shield,
  Skull,
  Sparkles,
  Star,
  Sun,
  Sword,
  Trash2,
  User,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ArmorPicker } from "../components/ArmorPicker";
import { TraitAssigner } from "../components/TraitAssigner";

export function CharacterSheet() {
  const activeId = useCharacterStore((s) => s.activeCharacterId);
  const characters = useCharacterStore((s) => s.characters);
  const updateCharacter = useCharacterStore((s) => s.updateCharacter);
  const setActiveCharacter = useCharacterStore((s) => s.setActiveCharacter);
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter);
  const setSpendableArmor = useCharacterStore((s) => s.setSpendableArmor);
  const performShortRest = useCharacterStore((s) => s.performShortRest);
  const performLongRest = useCharacterStore((s) => s.performLongRest);

  const character = characters.find((c) => c.id === activeId);

  const [activeTab, setActiveTab] = useState("main");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showEditOrigins, setShowEditOrigins] = useState(false);
  const [showSpellCompendium, setShowSpellCompendium] = useState(false);
  const [showArmorPicker, setShowArmorPicker] = useState(false);
  const [restModalOpen, setRestModalOpen] = useState<false | "short" | "long">(
    false,
  );
  const [castingSpellName, setCastingSpellName] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardRefEl = cardRef as React.RefObject<HTMLDivElement>;
  const { play: playSound } = useClickSound();

  // Parallax scroll effect
  useEffect(() => {
    function handleScroll() {
      document.documentElement.style.setProperty(
        "--parallax-offset",
        `${window.scrollY * 0.05}px`,
      );
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!character) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <User className="size-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm mb-4">
            No character selected.
          </p>
          <Button onClick={() => setActiveCharacter(null)}>Back to List</Button>
        </div>
      </Layout>
    );
  }

  const cls = CLASSES.find((c) => c.id === character.classId);
  const ancestry = ANCESTRIES.find((a) => a.id === character.ancestryId);
  const community = COMMUNITIES.find((c) => c.id === character.communityId);
  const subclass = cls?.subclasses.find((s) => s.id === character.subclassId);
  const armor = ARMOR.find((a) => a.id === character.armorId);

  const _classDomainCards = DOMAIN_CARDS.filter((c) =>
    cls?.domains.includes(c.domain),
  );

  const characterDomainCards = DOMAIN_CARDS.filter((c) =>
    character.domainCards.includes(c.id),
  );

  const knownSpells = character.knownSpells;
  const maxPrepared =
    (character.level || 1) + (character.domainCards?.length || 0);

  function updateField<K extends keyof Character>(
    field: K,
    value: Character[K],
  ) {
    if (!character) return;
    updateCharacter(character.id, { [field]: value } as Partial<Character>);
  }

  function handleSpellToggle(spell: Spell, nowKnown: boolean) {
    if (!character) return;
    if (nowKnown) {
      if (!character.knownSpells.includes(spell.name)) {
        updateField("knownSpells", [...character.knownSpells, spell.name]);
      }
    } else {
      updateField(
        "knownSpells",
        character.knownSpells.filter((s) => s !== spell.name),
      );
    }
  }

  function removeSpell(spell: string) {
    if (!character) return;
    updateField(
      "knownSpells",
      character.knownSpells.filter((s) => s !== spell),
    );
  }

  return (
    <Layout>
      {showSpellCompendium && (
        <SpellCompendiumModal
          alreadyKnown={character.knownSpells}
          onToggle={handleSpellToggle}
          onClose={() => setShowSpellCompendium(false)}
          characterDomainCardIds={characterDomainCards.map((c) => c.id)}
        />
      )}
      {castingSpellName !== null &&
        (() => {
          const castingSpell = SPELLS.find((s) => s.name === castingSpellName);
          const domainOfCastingSpell = castingSpell?.domain ?? "Arcana";
          return (
            <SpellCastAnimation
              domain={domainOfCastingSpell}
              onComplete={() => setCastingSpellName(null)}
            />
          );
        })()}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              data-ocid="sheet.back_button"
              variant="ghost"
              size="icon"
              onClick={() => setActiveCharacter(null)}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                {character.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Level {character.level} {cls?.name} &middot; {ancestry?.name}
              </p>
            </div>
          </div>
          <Button
            data-ocid="sheet.export_button"
            variant="ghost"
            size="icon"
            onClick={() => {
              const cls = CLASSES.find((c) => c.id === character.classId);
              const ancestry = ANCESTRIES.find(
                (a) => a.id === character.ancestryId,
              );
              const community = COMMUNITIES.find(
                (c) => c.id === character.communityId,
              );
              const subclass = cls?.subclasses.find(
                (s) => s.id === character.subclassId,
              );
              const cards = DOMAIN_CARDS.filter((c) =>
                character.domainCards.includes(c.id),
              );
              exportCharacterToPDF(
                character,
                cls?.name ?? "",
                subclass?.name ?? "",
                ancestry?.name ?? "",
                community?.name ?? "",
                cards,
              );
            }}
          >
            <Download className="size-4" />
          </Button>
          <Button
            data-ocid="sheet.export_image_button"
            variant="ghost"
            size="icon"
            onClick={() =>
              exportCharacterCardToImage(cardRefEl.current, character.name)
            }
          >
            <Camera className="size-4" />
          </Button>
          {character.level < 10 ? (
            <Button
              data-ocid="sheet.levelup_button"
              variant="default"
              size="sm"
              className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowLevelUp(true)}
            >
              <ArrowUp className="size-4" />
              Level Up
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground px-2">
              Max Level
            </span>
          )}
          <Button
            data-ocid="sheet.delete_button"
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => deleteCharacter(character.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* Core Trackers */}
        <Card className="card-fantasy">
          <CardContent className="pt-4 flex flex-col gap-3">
            {/* Portrait + HP side-by-side */}
            <div className="flex flex-row items-start gap-3 sm:gap-4">
              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <CharacterPortrait
                  portraitDataUrl={character.portraitDataUrl}
                  characterName={character.name}
                  variant="compact"
                  size="large"
                  onUpload={(url) => updateField("portraitDataUrl", url)}
                  onRemove={() => updateField("portraitDataUrl", undefined)}
                />
                <span className="text-xs text-muted-foreground text-center leading-tight max-w-[6rem] truncate">
                  {character.name}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-blue-400 mb-1.5 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" fill="currentColor" />
                  <span>Hit Points</span>
                  <span className="ml-auto text-muted-foreground font-normal">
                    {character.hitPoints}/{character.maxHitPoints}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: character.maxHitPoints }).map(
                    (_, i) => (
                      <button
                        key={`hp-${i}`}
                        type="button"
                        aria-label={
                          i < character.hitPoints
                            ? `Remove HP ${i + 1}`
                            : `Add HP ${i + 1}`
                        }
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-full transition-all duration-150"
                        onClick={() => {
                          const newVal = i < character.hitPoints ? i : i + 1;
                          updateField("hitPoints", newVal);
                        }}
                      >
                        <Heart
                          className="w-5 h-5 transition-all duration-150"
                          style={
                            i < character.hitPoints
                              ? {
                                  color: "#3b82f6",
                                  fill: "#3b82f6",
                                  filter: "drop-shadow(0 0 4px #3b82f6)",
                                }
                              : { color: "#3b82f630", fill: "transparent" }
                          }
                        />
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
            {/* Damage Thresholds below HP tracker */}
            <DamageThresholdDisplay
              {...calculateDamageThresholds(character)}
              currentDamage={character.maxHitPoints - character.hitPoints}
            />
            {/* Hope tokens — Gothic bordered container */}
            <div
              className="rounded-lg border-2 border-purple-500/70 bg-purple-900/30 dark:bg-purple-900/40 p-3"
              style={{ boxShadow: "0 0 8px rgba(139,92,246,0.3)" }}
            >
              <div className="flex items-center gap-1 text-xs font-semibold mb-2">
                <Star
                  className="w-3.5 h-3.5 text-yellow-300"
                  fill="currentColor"
                />
                <span className="text-yellow-900 dark:text-yellow-200 font-display tracking-widest uppercase text-[10px]">
                  Hope
                </span>
                <span className="ml-auto text-purple-300/60 text-[10px]">
                  ✦
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: character.maxHope }).map((_, i) => (
                  <button
                    key={`hope-${i}`}
                    type="button"
                    aria-label={
                      i < character.hope
                        ? `Spend hope token ${i + 1}`
                        : `Gain hope token ${i + 1}`
                    }
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-full transition-all duration-150"
                    onClick={() => {
                      const newVal = i < character.hope ? i : i + 1;
                      updateField("hope", newVal);
                      playSound("hope");
                    }}
                  >
                    <Star
                      className="w-5 h-5 transition-all duration-150"
                      style={
                        i < character.hope
                          ? {
                              color: "#fde047",
                              fill: "#fde047",
                              filter: "drop-shadow(0 0 6px #fde047)",
                            }
                          : {
                              color: "transparent",
                              fill: "transparent",
                              stroke: "#fde04760",
                            }
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Stress tokens — Gothic bordered container */}
            <div
              className="rounded-lg border-2 border-purple-500/70 bg-purple-900/30 dark:bg-purple-900/40 p-3"
              style={{ boxShadow: "0 0 8px rgba(139,92,246,0.3)" }}
            >
              <div className="flex items-center gap-1 text-xs font-semibold mb-2">
                <span className="shocked-brain-icon text-base leading-none">
                  🧠
                </span>
                <span className="text-purple-900 dark:text-purple-200 font-display tracking-widest uppercase text-[10px]">
                  ✦ Stress ✦
                </span>
                <span className="ml-auto text-purple-300/60 text-[10px]">
                  ✦
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: character.maxStress }).map((_, i) => (
                  <button
                    key={`stress-${i}`}
                    type="button"
                    aria-label={
                      i < character.stress
                        ? `Remove stress ${i + 1}`
                        : `Add stress ${i + 1}`
                    }
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded transition-all duration-150"
                    onClick={() => {
                      const newVal = i < character.stress ? i : i + 1;
                      updateField("stress", newVal);
                      playSound("stress");
                    }}
                  >
                    <span
                      className="text-xl leading-none select-none"
                      style={
                        i < character.stress
                          ? {
                              opacity: 1,
                              filter: "drop-shadow(0 0 5px #a855f7)",
                            }
                          : { opacity: 0.2 }
                      }
                    >
                      💀
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Spendable Armor Tracker */}
            <SpendableArmorTracker
              value={character.spendableArmor ?? 0}
              max={character.armorThreshold || 6}
              onChange={(v) => setSpendableArmor(character.id, v)}
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold border border-border rounded-lg px-2.5 py-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-foreground">{armor?.name ?? "None"}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold border border-border rounded-lg px-2.5 py-1.5">
                <Footprints className="w-4 h-4 text-green-400" />
                <span className="text-foreground">
                  Evasion {character.evasion}
                </span>
              </span>
            </div>
            {/* Rest Buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                data-ocid="sheet.short_rest_button"
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-blue-500 border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                onClick={() => {
                  playSound("generic");
                  setRestModalOpen("short");
                }}
              >
                <Moon className="size-3.5" />
                Short Rest
              </Button>
              <Button
                data-ocid="sheet.long_rest_button"
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-primary border-primary/40 hover:bg-primary/10"
                onClick={() => {
                  playSound("generic");
                  setRestModalOpen("long");
                }}
              >
                <Sun className="size-3.5" />
                Long Rest
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Desktop left sidebar ── */}
        <nav
          aria-label="Section navigation"
          className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-16 bg-slate-900/95 border-r border-purple-500/30 z-40"
        >
          {(
            [
              {
                id: "main",
                icon: <User className="size-5" />,
                label: "Details",
                ocid: "sheet.tab.main",
              },
              {
                id: "abilities",
                icon: <Sparkles className="size-5" />,
                label: "Features",
                ocid: "sheet.tab.abilities",
              },
              {
                id: "equipment",
                icon: <Package className="size-5" />,
                label: "Gear",
                ocid: "sheet.tab.equipment",
              },
              {
                id: "spells",
                icon: <Flame className="size-5" />,
                label: "Spells",
                ocid: "sheet.tab.spells",
              },
              {
                id: "journal",
                icon: <BookOpen className="size-5" />,
                label: "Journal",
                ocid: "sheet.tab.journal",
              },
            ] as { id: string; icon: ReactNode; label: string; ocid: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={tab.ocid}
              aria-label={tab.label}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={[
                "flex flex-col items-center justify-center w-full py-3 gap-1 text-xs transition-colors duration-150",
                activeTab === tab.id
                  ? "bg-purple-700/50 border-l-2 border-purple-400 text-purple-200"
                  : "text-slate-400 hover:text-purple-300 border-l-2 border-transparent",
              ].join(" ")}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "abilities") playSound("feat");
                else if (tab.id === "spells") playSound("spell");
                else if (tab.id === "equipment") playSound("item");
                else if (tab.id === "combat") playSound("weapon");
                else playSound("generic");
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Mobile bottom bar ── */}
        <nav
          aria-label="Section navigation"
          className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-sm border-t border-purple-500/30 z-40 justify-around items-center"
        >
          {(
            [
              {
                id: "main",
                icon: <User className="size-5" />,
                label: "Details",
                ocid: "sheet.tab.main.mobile",
              },
              {
                id: "abilities",
                icon: <Sparkles className="size-5" />,
                label: "Features",
                ocid: "sheet.tab.abilities.mobile",
              },
              {
                id: "equipment",
                icon: <Package className="size-5" />,
                label: "Gear",
                ocid: "sheet.tab.equipment.mobile",
              },
              {
                id: "spells",
                icon: <Flame className="size-5" />,
                label: "Spells",
                ocid: "sheet.tab.spells.mobile",
              },
              {
                id: "journal",
                icon: <BookOpen className="size-5" />,
                label: "Journal",
                ocid: "sheet.tab.journal.mobile",
              },
            ] as { id: string; icon: ReactNode; label: string; ocid: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={tab.ocid}
              aria-label={tab.label}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={[
                "flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-[10px] transition-colors duration-150",
                activeTab === tab.id ? "text-purple-200" : "text-slate-400",
              ].join(" ")}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === "abilities") playSound("feat");
                else if (tab.id === "spells") playSound("spell");
                else if (tab.id === "equipment") playSound("item");
                else if (tab.id === "combat") playSound("weapon");
                else playSound("generic");
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* ── Tab content ── */}
        <div className="md:pl-16 pb-16 md:pb-0">
          {activeTab === "main" && (
            <div className="flex flex-col gap-3 mt-3">
              <Card className="card-fantasy">
                <CardHeader>
                  <CardTitle className="text-sm font-display">Traits</CardTitle>
                </CardHeader>
                <CardContent>
                  <TraitAssigner
                    traits={character.traits}
                    onChange={(traits) =>
                      updateCharacter(character.id, { traits })
                    }
                  />
                </CardContent>
              </Card>

              <Card className="card-fantasy">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-display">
                    Class & Origins
                  </CardTitle>
                  <button
                    type="button"
                    data-ocid="sheet.edit_origins_button"
                    onClick={() => setShowEditOrigins(true)}
                    className="text-xs border border-blue-500/40 text-blue-400 hover:text-blue-300 px-2 py-1 rounded"
                  >
                    Edit Origins
                  </button>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="class-badge inline-block text-blue-400 font-display font-bold text-sm"
                      style={{ textShadow: "0 0 8px rgba(59,130,246,0.6)" }}
                    >
                      {cls?.name}
                    </span>
                    {subclass?.name && (
                      <span className="text-xs text-muted-foreground pl-1">
                        {subclass.name} — {subclass.description}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground pl-1">
                      {cls?.description}
                    </span>
                  </div>
                  <hr className="divider-ornate" />
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="ancestry-badge inline-block text-purple-400 font-display font-bold text-sm"
                      style={{ textShadow: "0 0 8px rgba(147,51,234,0.6)" }}
                    >
                      {ancestry?.name}
                    </span>
                    <span className="text-xs text-muted-foreground pl-1">
                      {ancestry?.description}
                    </span>
                  </div>
                  {community && (
                    <>
                      <hr className="divider-ornate" />
                      <p>
                        <strong className="text-foreground">
                          {community.name}
                        </strong>{" "}
                        — {community.description}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="card-fantasy">
                <CardHeader>
                  <CardTitle className="text-sm font-display">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    data-ocid="sheet.notes_input"
                    value={character.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Character notes..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "abilities" && (
            <div className="flex flex-col gap-3 mt-3">
              {/* Level + XP Section */}
              <Card className="card-fantasy border-primary/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-display">
                      Level
                    </CardTitle>
                    <Badge
                      variant="default"
                      className="text-lg px-3 py-1 bg-primary text-primary-foreground"
                    >
                      {character.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">
                        Proficiency
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        +
                        {character.level <= 4
                          ? 1
                          : character.level <= 8
                            ? 2
                            : 3}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">
                        Evasion
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {character.evasion}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">
                        Armor Threshold
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {character.armorThreshold}
                      </div>
                    </div>
                  </div>
                  {/* Experiences */}
                  <ExperienceSection
                    experiences={
                      Array.isArray(character.experiences)
                        ? character.experiences
                        : []
                    }
                    onChange={(val: string[]) =>
                      updateCharacter(character.id, { experiences: val })
                    }
                  />
                </CardContent>
              </Card>

              {/* Class Features Section */}
              <div className="flex items-center gap-2 mt-1">
                <Sword className="size-4 text-primary" />
                <h3 className="section-title text-sm">Class Features</h3>
              </div>
              {subclass?.features.map((f, idx) => {
                const levelReq = f.level ?? (idx === 0 ? 1 : idx === 1 ? 3 : 7);
                const isLocked = character.level < levelReq;
                const isFoundation = levelReq === 1;
                const isSpec = levelReq === 3;
                const isMastery = levelReq === 7;
                const label = isFoundation
                  ? "Foundation"
                  : isSpec
                    ? "Specialization"
                    : isMastery
                      ? "Mastery"
                      : `Level ${levelReq}`;
                return (
                  <FeatureCard
                    key={f.name}
                    title={f.name}
                    subtitle={`${subclass.name} — ${label}`}
                    description={f.description}
                    icon={
                      isLocked ? (
                        <Lock className="size-4" />
                      ) : isSpec ? (
                        <Sparkles className="size-4" />
                      ) : isMastery ? (
                        <Star className="size-4" />
                      ) : (
                        <Sword className="size-4" />
                      )
                    }
                    locked={isLocked}
                    levelRequirement={isLocked ? levelReq : undefined}
                  />
                );
              })}

              {/* Ancestry Features Section */}
              <div className="flex items-center gap-2 mt-1">
                <User className="size-4 text-primary" />
                <h3 className="section-title text-sm">Ancestry Features</h3>
              </div>
              {ancestry?.features.map((f) => (
                <FeatureCard
                  key={f.name}
                  title={f.name}
                  subtitle={`${ancestry.name}`}
                  description={f.description}
                  icon={<User className="size-4" />}
                />
              ))}

              {/* Community Features Section */}
              <div className="flex items-center gap-2 mt-1">
                <Home className="size-4 text-primary" />
                <h3 className="section-title text-sm">Community Feature</h3>
              </div>
              {community && (
                <FeatureCard
                  title={community.feature.name}
                  subtitle={community.name}
                  description={community.feature.description}
                  icon={<Home className="size-4" />}
                />
              )}

              {/* Domain Cards */}
              {characterDomainCards.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles className="size-4 text-primary" />
                    <h3 className="section-title text-sm">Domain Cards</h3>
                  </div>
                  <div className="grid gap-2">
                    {characterDomainCards.map((card) => (
                      <DomainCardItem key={card.id} card={card} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "equipment" && (
            <div className="flex flex-col gap-3 mt-3">
              {/* Weapons */}
              <WeaponDisplay
                equippedWeaponIds={character.equippedWeaponIds ?? []}
                onChangeWeapons={(ids) =>
                  updateCharacter(character.id, { equippedWeaponIds: ids })
                }
              />

              <Card className="card-fantasy">
                <CardHeader>
                  <CardTitle className="text-sm font-display flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Armor
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {armor ? (
                    <>
                      <p className="text-sm font-semibold text-foreground">
                        {armor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {armor.description}
                      </p>
                      <StatTracker
                        label="Armor Score"
                        current={armor.score}
                        max={armor.score}
                        onChange={() => {}}
                        variant="square"
                      />
                      <p className="text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Footprints className="w-3 h-3" />
                          Evasion modifier:{" "}
                          {armor.evasionMod >= 0
                            ? `+${armor.evasionMod}`
                            : armor.evasionMod}
                          {armor.agilityPenalty !== 0 &&
                            ` · Agility: ${armor.agilityPenalty}`}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No armor equipped
                    </p>
                  )}
                  <Button
                    data-ocid="sheet.armor.equip_button"
                    variant="outline"
                    size="sm"
                    type="button"
                    className="w-full gap-2 border-primary/40 hover:bg-primary/10"
                    onClick={() => {
                      playSound("armor");
                      setShowArmorPicker(true);
                    }}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    {armor ? "Swap Armor" : "Equip Armor"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "spells" && (
            <div className="flex flex-col gap-3 mt-3">
              {/* Spell Slots + Known Spells side by side */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Spell Slots card */}
                <div className="w-full md:w-1/2">
                  <div
                    className="rounded-lg border-2 border-purple-500/60 h-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(29,8,74,0.88), rgba(49,10,80,0.88))",
                      backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(139,92,246,0.04) 0px, rgba(139,92,246,0.04) 1px, transparent 1px, transparent 8px)",
                      boxShadow: "0 0 12px rgba(139,92,246,0.2)",
                    }}
                  >
                    <div className="px-4 pt-4 pb-2">
                      <h3 className="text-xs font-display uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                        <span className="text-purple-400">◆</span> Spell Slots
                      </h3>
                    </div>
                    <div className="px-4 pb-4">
                      <SpellSlotTracker
                        characterId={character.id}
                        domainCards={characterDomainCards}
                        domainSpellSlots={character.domainSpellSlots ?? {}}
                      />
                    </div>
                  </div>
                </div>

                {/* Known Spells card */}
                <div className="w-full md:w-1/2">
                  <div
                    className="rounded-lg border-2 border-purple-500/60 h-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(29,8,74,0.88), rgba(49,10,80,0.88))",
                      backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(139,92,246,0.04) 0px, rgba(139,92,246,0.04) 1px, transparent 1px, transparent 8px)",
                      boxShadow: "0 0 12px rgba(139,92,246,0.2)",
                    }}
                  >
                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                      <h3 className="text-xs font-display uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                        <span className="text-purple-400">◆</span> Known Spells
                      </h3>
                      <div
                        data-ocid="sheet.spells.prepared_counter"
                        className="flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-900/40 px-2 py-0.5"
                      >
                        <Flame className="size-3 text-purple-300" />
                        <span className="text-xs font-semibold font-display text-purple-200">
                          {knownSpells.length}
                        </span>
                        <span className="text-xs text-purple-400">/</span>
                        <span className="text-xs font-semibold font-display text-indigo-200">
                          {maxPrepared}
                        </span>
                        <span className="text-xs text-purple-400/70">
                          prepared
                        </span>
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex flex-col gap-2">
                      {character.knownSpells.map((spell, idx) => {
                        const spellData = SPELLS.find((s) => s.name === spell);
                        const accentHex = spellData?.domain
                          ? (DOMAIN_ACCENT_HEX[spellData.domain] ?? "#a855f7")
                          : "#a855f7";
                        return (
                          <div
                            key={spell}
                            data-ocid={`sheet.spell.item.${idx + 1}`}
                            className="flex items-center justify-between py-1 border-b border-purple-500/20 last:border-0"
                          >
                            <span className="text-sm text-indigo-100 flex-1 min-w-0 truncate">
                              {spell}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                data-ocid={`sheet.spell.cast.${idx + 1}`}
                                variant="ghost"
                                size="icon"
                                className="size-6"
                                style={{ color: accentHex }}
                                onClick={() => {
                                  playSound("spell_cast");
                                  setCastingSpellName(spell);
                                }}
                                title="Cast spell"
                                aria-label={`Cast ${spell}`}
                              >
                                <Flame className="size-3" />
                              </Button>
                              <Button
                                data-ocid={`sheet.spell.remove.${idx + 1}`}
                                variant="ghost"
                                size="icon"
                                className="size-6 text-destructive"
                                onClick={() => removeSpell(spell)}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      <Button
                        data-ocid="sheet.spell.open_compendium_button"
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full gap-2 border-purple-500/40 hover:bg-purple-900/30 text-purple-300"
                        onClick={() => {
                          playSound("spell");
                          setShowSpellCompendium(true);
                        }}
                      >
                        <Plus className="size-4" />
                        Browse Spell Compendium
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "journal" && (
            <div className="flex flex-col gap-3 mt-3">
              <CampaignJournal
                characterId={character.id}
                characterName={character.name}
              />
            </div>
          )}
        </div>
      </div>
      <LevelUpModal
        character={character}
        open={showLevelUp}
        onClose={() => setShowLevelUp(false)}
      />
      {restModalOpen && (
        <RestModal
          isOpen={true}
          restType={restModalOpen}
          character={character}
          onConfirm={() => {
            if (restModalOpen === "short") performShortRest(character.id);
            else performLongRest(character.id);
            setRestModalOpen(false);
          }}
          onClose={() => setRestModalOpen(false)}
        />
      )}
      <ArmorPicker
        isOpen={showArmorPicker}
        onClose={() => setShowArmorPicker(false)}
        currentArmorId={character.armorId}
        onSelect={(id) => {
          updateField("armorId", id);
          setShowArmorPicker(false);
        }}
      />

      {/* Edit Origins Modal */}
      {showEditOrigins && (
        <div
          data-ocid="sheet.edit_origins.modal"
          className="modal-overlay-bg fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowEditOrigins(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowEditOrigins(false);
          }}
        >
          <div
            className="modal-content-bg rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 m-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Manage Origins</h2>
              <button
                type="button"
                data-ocid="sheet.edit_origins.close_button"
                onClick={() => setShowEditOrigins(false)}
                className="text-muted-foreground hover:text-foreground text-xl"
              >
                ×
              </button>
            </div>
            <Tabs defaultValue="ancestries">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ancestries">
                  Homebrew Ancestries
                </TabsTrigger>
                <TabsTrigger value="communities">
                  Homebrew Communities
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ancestries">
                <HomebrewAncestryCreator />
              </TabsContent>
              <TabsContent value="communities">
                <HomebrewCommunityCreator />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Hidden character card for image export */}
      <div
        ref={cardRef}
        className="fixed -left-[9999px] top-0 w-[400px] p-6 rounded-xl border-2 border-primary/60 bg-[#1a1a2e] text-[#f5e6c8]"
        style={{ fontFamily: "var(--font-display), serif" }}
      >
        <div className="text-center mb-4">
          {character.portraitDataUrl && (
            <div className="flex justify-center mb-3">
              <img
                src={character.portraitDataUrl}
                alt={`${character.name} portrait`}
                className="size-20 rounded-full object-cover border-2 border-[#d4a843]/60"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-[#d4a843] mb-1">
            {character.name}
          </h1>
          <p className="text-sm text-[#c9b896]">
            {cls?.name} — {subclass?.name}
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#d4a843] text-[#1a1a2e] text-xs font-bold">
            Level {character.level}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-[#16213e] rounded-lg p-3 text-center">
            <div className="text-[#d4a843] text-xs font-bold uppercase tracking-wider">
              Ancestry
            </div>
            <div className="text-[#f5e6c8] mt-1">{ancestry?.name}</div>
          </div>
          <div className="bg-[#16213e] rounded-lg p-3 text-center">
            <div className="text-[#d4a843] text-xs font-bold uppercase tracking-wider">
              Community
            </div>
            <div className="text-[#f5e6c8] mt-1">{community?.name}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#16213e] rounded-lg p-2 text-center">
            <div className="text-[#d4a843] text-xs font-bold">HP</div>
            <div className="text-[#f5e6c8] text-sm font-bold">
              {character.hitPoints}/{character.maxHitPoints}
            </div>
          </div>
          <div className="bg-[#16213e] rounded-lg p-2 text-center">
            <div className="text-[#d4a843] text-xs font-bold">Evasion</div>
            <div className="text-[#f5e6c8] text-sm font-bold">
              {character.evasion}
            </div>
          </div>
          <div className="bg-[#16213e] rounded-lg p-2 text-center">
            <div className="text-[#d4a843] text-xs font-bold">Proficiency</div>
            <div className="text-[#f5e6c8] text-sm font-bold">
              +{character.proficiency}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#16213e] rounded-lg p-2 text-center">
            <div className="text-[#d4a843] text-xs font-bold">Armor</div>
            <div className="text-[#f5e6c8] text-sm font-bold">
              {armor?.name ?? "None"}
            </div>
          </div>
          <div className="bg-[#16213e] rounded-lg p-2 text-center">
            <div className="text-[#d4a843] text-xs font-bold">Stress</div>
            <div className="text-[#f5e6c8] text-sm font-bold">
              {character.stress}/{character.maxStress}
            </div>
          </div>
          <div className="bg-[#16213e] rounded-lg p-2 text-center">
            <div className="text-[#d4a843] text-xs font-bold">Hope</div>
            <div className="text-[#f5e6c8] text-sm font-bold">
              {character.hope}/{character.maxHope}
            </div>
          </div>
        </div>

        {characterDomainCards.length > 0 && (
          <div className="mb-4">
            <div className="text-[#d4a843] text-xs font-bold uppercase tracking-wider mb-2 text-center">
              Domain Cards
            </div>
            <div className="flex flex-col gap-1">
              {characterDomainCards.slice(0, 3).map((card) => (
                <div
                  key={card.id}
                  className="bg-[#16213e] rounded px-3 py-1.5 text-sm text-[#f5e6c8]"
                >
                  {card.name}
                </div>
              ))}
              {characterDomainCards.length > 3 && (
                <div className="text-xs text-[#c9b896] text-center italic">
                  +{characterDomainCards.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-2 pt-3 border-t border-[#d4a843]/30">
          <p className="text-xs text-[#c9b896] italic">Dagger's Sheet</p>
        </div>
      </div>
    </Layout>
  );
}
