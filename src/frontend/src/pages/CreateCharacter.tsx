import { CharacterPortrait } from "@/components/CharacterPortrait";
import { HomebrewAncestryCreator } from "@/components/HomebrewAncestryCreator";
import { HomebrewCommunityCreator } from "@/components/HomebrewCommunityCreator";
import { Layout } from "@/components/Layout";
import { SelectableCard } from "@/components/SelectableCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ANCESTRIES } from "@/data/ancestries";
import { ARMOR } from "@/data/armor";
import { CLASSES } from "@/data/classes";
import { COMMUNITIES } from "@/data/communities";
import { DOMAIN_CARDS } from "@/data/domainCards";
import { useClickSound } from "@/hooks/useClickSound";
import { useCharacterStore } from "@/store/useCharacterStore";
import { useHomebrewAncestryStore } from "@/stores/useHomebrewAncestryStore";
import { useHomebrewCommunityStore } from "@/stores/useHomebrewCommunityStore";
import type { DomainSpellSlot } from "@/types/character";
import type {
  Ancestry,
  Character,
  Community,
  TraitSet,
} from "@/types/character";
import { ArrowLeft, Check, ChevronRight, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TraitAssigner } from "../components/TraitAssigner";

const STEPS = [
  "Name & Description",
  "Ancestry",
  "Community",
  "Class",
  "Subclass",
  "Traits",
  "Domain Cards",
  "Equipment",
  "Review",
] as const;

type _StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const DEFAULT_TRAITS: TraitSet = {
  agility: 0,
  strength: 0,
  finesse: 0,
  instinct: 0,
  presence: 0,
  knowledge: 0,
};

const STORAGE_KEY = "daggerheart-create-draft";

interface DraftState {
  step: number;
  name: string;
  description: string;
  playerName: string;
  ancestryId: string;
  communityId: string;
  classId: string;
  subclassId: string;
  traits: TraitSet;
  domainCardIds: string[];
  armorId: string;
  weapons: string;
  portraitDataUrl: string;
}

function loadDraft(): DraftState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

function saveDraft(state: DraftState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function CreateCharacter() {
  const setView = useCharacterStore((s) => s.setView);
  const createCharacter = useCharacterStore((s) => s.createCharacter);
  const { play: playSound } = useClickSound();

  const draft = loadDraft();

  const [step, setStep] = useState<number>(draft?.step ?? 0);
  const [name, setName] = useState(draft?.name ?? "");
  const [description, setDescription] = useState(draft?.description ?? "");
  const [playerName, setPlayerName] = useState(draft?.playerName ?? "");
  const [ancestryId, setAncestryId] = useState(draft?.ancestryId ?? "");
  const [communityId, setCommunityId] = useState(draft?.communityId ?? "");
  const [classId, setClassId] = useState(draft?.classId ?? "");
  const [subclassId, setSubclassId] = useState(draft?.subclassId ?? "");
  const [traits, setTraits] = useState<TraitSet>(
    draft?.traits ?? { ...DEFAULT_TRAITS },
  );
  const [domainCardIds, setDomainCardIds] = useState<string[]>(
    draft?.domainCardIds ?? [],
  );
  const [armorId, setArmorId] = useState(draft?.armorId ?? "gambeson");
  const [weapons, setWeapons] = useState(draft?.weapons ?? "");
  const [portraitDataUrl, setPortraitDataUrl] = useState(
    draft?.portraitDataUrl ?? "",
  );

  const { homebrewAncestries } = useHomebrewAncestryStore();
  const { homebrewCommunities } = useHomebrewCommunityStore();
  const [showHomebrewAncestryModal, setShowHomebrewAncestryModal] =
    useState(false);
  const [showHomebrewCommunityModal, setShowHomebrewCommunityModal] =
    useState(false);

  const allAncestries: Ancestry[] = [
    ...ANCESTRIES,
    ...homebrewAncestries.map((hb) => ({
      id: hb.id,
      name: hb.name,
      description: hb.description,
      features: [{ name: hb.featureName, description: hb.feature }],
      isHomebrew: true as const,
    })),
  ];

  const allCommunities: Community[] = [
    ...COMMUNITIES,
    ...homebrewCommunities.map((hb) => ({
      id: hb.id,
      name: hb.name,
      description: hb.description,
      feature: { name: hb.featureName, description: hb.feature },
      isHomebrew: true as const,
    })),
  ];

  const selectedClass = CLASSES.find((c) => c.id === classId);
  const selectedAncestry = allAncestries.find((a) => a.id === ancestryId);
  const selectedCommunity = allCommunities.find((c) => c.id === communityId);
  const selectedSubclass = selectedClass?.subclasses.find(
    (s) => s.id === subclassId,
  );

  const classDomainCards = selectedClass
    ? DOMAIN_CARDS.filter((c) => selectedClass.domains.includes(c.domain))
    : [];

  const traitValuesUsed = Object.values(traits);
  const traitValuesValid =
    traitValuesUsed.length === 6 &&
    [...traitValuesUsed].sort((a, b) => b - a).join(",") === "2,1,1,0,0,-1";

  const debouncedSave = useCallback(() => {
    const state: DraftState = {
      step,
      name,
      description,
      playerName,
      ancestryId,
      communityId,
      classId,
      subclassId,
      traits,
      domainCardIds,
      armorId,
      weapons,
      portraitDataUrl,
    };
    saveDraft(state);
  }, [
    step,
    name,
    description,
    playerName,
    ancestryId,
    communityId,
    classId,
    subclassId,
    traits,
    domainCardIds,
    armorId,
    weapons,
    portraitDataUrl,
  ]);

  useEffect(() => {
    const timer = setTimeout(debouncedSave, 300);
    return () => clearTimeout(timer);
  }, [debouncedSave]);

  useEffect(() => {
    const handleScroll = () =>
      document.documentElement.style.setProperty(
        "--parallax-offset",
        `${window.scrollY * 0.05}px`,
      );
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function nextStep() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }

  function prevStep() {
    if (step > 0) setStep((s) => s - 1);
  }

  function goToStep(index: number) {
    if (index >= 0 && index < STEPS.length) setStep(index);
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return name.trim().length > 0;
      case 1:
        return !!ancestryId;
      case 2:
        return !!communityId;
      case 3:
        return !!classId;
      case 4:
        return !!subclassId;
      case 5:
        return traitValuesValid;
      case 6:
        return domainCardIds.length === 2;
      case 7:
        return !!armorId;
      case 8:
        return true;
      default:
        return false;
    }
  };

  function toggleDomainCard(cardId: string) {
    setDomainCardIds((prev) => {
      if (prev.includes(cardId)) {
        return prev.filter((id) => id !== cardId);
      }
      if (prev.length >= 2) return prev;
      playSound("domain");
      return [...prev, cardId];
    });
  }

  function handleCreate() {
    if (!name || !ancestryId || !communityId || !classId || !subclassId) return;

    const cls = CLASSES.find((c) => c.id === classId)!;
    const armor = ARMOR.find((a) => a.id === armorId) || ARMOR[0];
    const evasion = cls.evasion + armor.evasionMod;
    const maxHP = cls.baseHP + traits.strength * 2;

    const characterData: Omit<Character, "id" | "createdAt" | "updatedAt"> = {
      name,
      level: 1,
      ancestryId,
      communityId,
      classId,
      subclassId,
      traits,
      hitPoints: maxHP,
      maxHitPoints: maxHP,
      hope: 5,
      maxHope: 6,
      fear: 0,
      maxFear: 6,
      stress: 0,
      maxStress: 6,
      armorId,
      evasion,
      equipment: [
        {
          id: "weapon-1",
          name: weapons.trim() || "Starting Weapon",
          quantity: 1,
          description: "Starting weapon.",
        },
      ],
      domainCards: domainCardIds,
      spellSlots: [
        { level: 1, max: 4, used: 0 },
        { level: 2, max: 2, used: 0 },
        { level: 3, max: 2, used: 0 },
      ],
      knownSpells: [],
      features: [],
      experiences: [],
      notes: description,
      proficiency: 1,
      armorThreshold: armor.score,
      spendableArmor: armor.score,
      damageThresholds: {
        minor: Math.floor(armor.score / 3),
        major: Math.floor((armor.score / 3) * 2),
        severe: armor.score,
      },
      levelUpHistory: [],
      domainSpellSlots: {} as Record<string, DomainSpellSlot>,
      portraitDataUrl: portraitDataUrl || undefined,
    };

    createCharacter(characterData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            data-ocid="create.back_button"
            variant="ghost"
            size="icon"
            onClick={() => {
              if (step === 0) setView("list");
              else prevStep();
            }}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h2 className="section-title text-lg">Create Character</h2>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <button
              key={`step-${i}`}
              type="button"
              data-ocid={`create.progress.step.${i + 1}`}
              onClick={() => goToStep(i)}
              className={`h-1.5 flex-1 rounded-full transition-smooth ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>

        {/* Step 1: Name & Description */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <CharacterPortrait
                portraitDataUrl={portraitDataUrl || undefined}
                characterName={name || "Character"}
                variant="full"
                onUpload={(url) => setPortraitDataUrl(url)}
                onRemove={() => setPortraitDataUrl("")}
              />
            </div>
            <Card className="card-fantasy">
              <CardHeader>
                <CardTitle className="text-sm font-display">
                  Character Name
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-xs text-muted-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    data-ocid="create.name_input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter character name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="playerName"
                    className="text-xs text-muted-foreground"
                  >
                    Player Name
                  </Label>
                  <Input
                    id="playerName"
                    data-ocid="create.player_name_input"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="description"
                    className="text-xs text-muted-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    data-ocid="create.description_input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your character's appearance and personality..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Homebrew Ancestry Modal */}
        {showHomebrewAncestryModal && (
          <div
            data-ocid="homebrew-ancestry.modal"
            className="modal-overlay-bg fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget)
                setShowHomebrewAncestryModal(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowHomebrewAncestryModal(false);
            }}
          >
            <div className="modal-content-bg w-full max-w-md max-h-[80vh] overflow-y-auto rounded-xl border border-primary/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title text-sm">
                  Homebrew Ancestries
                </span>
                <Button
                  type="button"
                  data-ocid="homebrew-ancestry.close_button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setShowHomebrewAncestryModal(false)}
                >
                  ✕
                </Button>
              </div>
              <HomebrewAncestryCreator />
            </div>
          </div>
        )}

        {/* Step 2: Ancestry */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Choose Ancestry
              </Label>
              <Button
                type="button"
                data-ocid="create.homebrew_ancestry_button"
                variant="outline"
                size="sm"
                className="text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => {
                  playSound("generic");
                  setShowHomebrewAncestryModal(true);
                }}
              >
                <span className="text-[9px] rounded bg-purple-700/80 text-white px-1 py-0.5 font-bold mr-0.5">
                  HB
                </span>
                Create Homebrew
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allAncestries.map((a) => {
                const hbEntry = homebrewAncestries.find((hb) => hb.id === a.id);
                const artUrl = hbEntry?.artUrl;
                return (
                  <SelectableCard
                    key={a.id}
                    data-ocid={`create.ancestry.${a.id}`}
                    selected={ancestryId === a.id}
                    selectionType="ancestry"
                    className="ancestry-card-epic"
                    onClick={() => setAncestryId(a.id)}
                  >
                    <div className="px-4 pt-3 pb-1">
                      <div className="flex items-center gap-2">
                        {artUrl && (
                          <img
                            src={artUrl}
                            alt={a.name}
                            className="size-10 rounded-md object-cover shrink-0 border border-primary/20"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                        )}
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="text-sm font-display font-bold text-foreground truncate">
                            {a.name}
                          </p>
                          {(a as Ancestry & { isHomebrew?: boolean })
                            .isHomebrew && (
                            <span className="text-[9px] rounded bg-purple-700/80 text-white px-1 py-0.5 font-semibold shrink-0">
                              HB
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 pb-3">
                      <p className="text-xs text-muted-foreground">
                        {a.description}
                      </p>
                      {ancestryId === a.id && (
                        <div className="mt-2 flex flex-col gap-1">
                          {a.features.slice(0, 2).map((f) => (
                            <p key={f.name} className="text-xs text-primary">
                              <strong>{f.name}:</strong> {f.description}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </SelectableCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Homebrew Community Modal */}
        {showHomebrewCommunityModal && (
          <div
            data-ocid="homebrew-community.modal"
            className="modal-overlay-bg fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget)
                setShowHomebrewCommunityModal(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowHomebrewCommunityModal(false);
            }}
          >
            <div className="modal-content-bg w-full max-w-md max-h-[80vh] overflow-y-auto rounded-xl border border-secondary/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title text-sm">
                  Homebrew Communities
                </span>
                <Button
                  type="button"
                  data-ocid="homebrew-community.close_button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setShowHomebrewCommunityModal(false)}
                >
                  ✕
                </Button>
              </div>
              <HomebrewCommunityCreator />
            </div>
          </div>
        )}

        {/* Step 3: Community */}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Choose Community
              </Label>
              <Button
                type="button"
                data-ocid="create.homebrew_community_button"
                variant="outline"
                size="sm"
                className="text-xs gap-1 border-secondary/30 text-secondary hover:bg-secondary/10"
                onClick={() => {
                  playSound("generic");
                  setShowHomebrewCommunityModal(true);
                }}
              >
                <span className="text-[9px] rounded bg-purple-700/80 text-white px-1 py-0.5 font-bold mr-0.5">
                  HB
                </span>
                Create Homebrew
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allCommunities.map((c) => (
                <SelectableCard
                  key={c.id}
                  data-ocid={`create.community.${c.id}`}
                  selected={communityId === c.id}
                  selectionType="community"
                  onClick={() => setCommunityId(c.id)}
                >
                  <div className="px-4 pt-3 pb-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-display font-bold text-foreground">
                        {c.name}
                      </p>
                      {(c as Community & { isHomebrew?: boolean })
                        .isHomebrew && (
                        <span className="text-[9px] rounded bg-purple-700/80 text-white px-1 py-0.5 font-semibold">
                          HB
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="text-xs text-muted-foreground">
                      {c.description}
                    </p>
                    {communityId === c.id && (
                      <p className="mt-2 text-xs text-primary">
                        <strong>{c.feature.name}:</strong>{" "}
                        {c.feature.description}
                      </p>
                    )}
                  </div>
                </SelectableCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Class */}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            <Label className="text-xs text-muted-foreground">
              Choose Class
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CLASSES.map((c) => (
                <SelectableCard
                  key={c.id}
                  data-ocid={`create.class.${c.id}`}
                  selected={classId === c.id}
                  selectionType="class"
                  className="class-card-epic"
                  onClick={() => {
                    setClassId(c.id);
                    setSubclassId("");
                    setDomainCardIds([]);
                  }}
                >
                  <div className="px-4 pt-3 pb-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-display font-bold text-foreground">
                        {c.name}
                      </p>
                      <span className="text-xs text-primary">
                        HP {c.baseHP}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="text-xs text-muted-foreground">
                      {c.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Evasion {c.evasion} &middot; Domains:{" "}
                      {c.domains.join(", ")}
                    </p>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Subclass */}
        {step === 4 && selectedClass && (
          <div className="flex flex-col gap-3">
            <Label className="text-xs text-muted-foreground">
              Choose Subclass for {selectedClass.name}
            </Label>
            <div className="grid gap-2">
              {selectedClass.subclasses.map((s) => (
                <SelectableCard
                  key={s.id}
                  data-ocid={`create.subclass.${s.id}`}
                  selected={subclassId === s.id}
                  selectionType="subclass"
                  onClick={() => setSubclassId(s.id)}
                >
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-sm font-display font-bold text-foreground">
                      {s.name}
                    </p>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="text-xs text-muted-foreground">
                      {s.description}
                    </p>
                    <div className="mt-2 flex flex-col gap-1">
                      {s.features.map((f) => (
                        <p key={f.name} className="text-xs text-primary">
                          <strong>
                            {f.name} (Lvl {f.level}):
                          </strong>{" "}
                          {f.description}
                        </p>
                      ))}
                    </div>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Traits */}
        {step === 5 && (
          <div className="flex flex-col gap-4">
            <Card className="card-fantasy">
              <CardHeader>
                <CardTitle className="text-sm font-display">
                  Assign Traits
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Assign each value exactly once: +2, +1, +1, 0, 0, -1
                </p>
              </CardHeader>
              <CardContent>
                <TraitAssigner
                  traits={traits}
                  onChange={(newTraits) => setTraits(newTraits)}
                />
                {!traitValuesValid && (
                  <p className="text-xs text-destructive mt-3">
                    Each value (+2, +1, +1, 0, 0, -1) must be used exactly once.
                  </p>
                )}
                {traitValuesValid && (
                  <p className="text-xs text-primary flex items-center gap-1 mt-3">
                    <Check className="size-3" /> All traits assigned correctly
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 7: Domain Cards */}
        {step === 6 && selectedClass && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Choose 2 Domain Cards ({domainCardIds.length}/2 selected)
              </Label>
            </div>
            {selectedClass.domains.map((domain) => (
              <div key={domain} className="flex flex-col gap-2">
                <h3 className="section-title text-xs">{domain}</h3>
                <div className="grid gap-2">
                  {classDomainCards
                    .filter((c) => c.domain === domain)
                    .map((card) => {
                      const isSelected = domainCardIds.includes(card.id);
                      return (
                        <SelectableCard
                          key={card.id}
                          data-ocid={`create.domaincard.${card.id}`}
                          selected={isSelected}
                          selectionType="domain"
                          onClick={() => toggleDomainCard(card.id)}
                        >
                          <div className="px-4 pt-3 pb-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-display font-bold text-foreground">
                                {card.name}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {card.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-primary">
                              {card.domain} L{card.level}
                            </p>
                          </div>
                          <div className="px-4 pb-3">
                            <p className="text-xs text-muted-foreground">
                              {card.description}
                            </p>
                          </div>
                        </SelectableCard>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 8: Equipment */}
        {step === 7 && (
          <div className="flex flex-col gap-3">
            <Label className="text-xs text-muted-foreground">
              Choose Armor
            </Label>
            <div className="grid gap-2">
              {ARMOR.map((a) => (
                <SelectableCard
                  key={a.id}
                  data-ocid={`create.armor.${a.id}`}
                  selected={armorId === a.id}
                  selectionType="armor"
                  onClick={() => setArmorId(a.id)}
                >
                  <div className="px-4 pt-3 pb-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-display font-bold text-foreground">
                        {a.name}
                      </p>
                      <span className="text-xs text-primary">
                        Score {a.score}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <p className="text-xs text-muted-foreground">
                      {a.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Evasion{" "}
                      {a.evasionMod >= 0 ? `+${a.evasionMod}` : a.evasionMod}
                      {a.agilityPenalty !== 0 &&
                        ` · Agility ${a.agilityPenalty}`}
                    </p>
                  </div>
                </SelectableCard>
              ))}
            </div>

            <Card className="card-fantasy mt-2">
              <CardHeader>
                <CardTitle className="text-sm font-display">
                  Starting Weapons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  data-ocid="create.weapons_input"
                  value={weapons}
                  onChange={(e) => setWeapons(e.target.value)}
                  placeholder="e.g. Longsword, Shortbow, Dagger"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 9: Review */}
        {step === 8 && (
          <div className="flex flex-col gap-3">
            <Card className="card-fantasy">
              <CardHeader>
                <CardTitle className="text-sm font-display">
                  Character Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">Name:</strong>{" "}
                  {name || "—"}
                </p>
                {playerName && (
                  <p>
                    <strong className="text-foreground">Player:</strong>{" "}
                    {playerName}
                  </p>
                )}
                <p>
                  <strong className="text-foreground">Ancestry:</strong>{" "}
                  {selectedAncestry?.name ?? "—"}
                </p>
                <p>
                  <strong className="text-foreground">Community:</strong>{" "}
                  {selectedCommunity?.name ?? "—"}
                </p>
                <p>
                  <strong className="text-foreground">Class:</strong>{" "}
                  {selectedClass?.name ?? "—"} ({selectedSubclass?.name ?? "—"})
                </p>
                <p>
                  <strong className="text-foreground">Armor:</strong>{" "}
                  {ARMOR.find((a) => a.id === armorId)?.name ?? "—"}
                </p>
                <p>
                  <strong className="text-foreground">Weapons:</strong>{" "}
                  {weapons || "—"}
                </p>
                <div>
                  <strong className="text-foreground">Traits:</strong>{" "}
                  {Object.entries(traits).map(([k, v]) => (
                    <span key={k} className="mr-2">
                      {k.charAt(0).toUpperCase() + k.slice(1)}{" "}
                      {v >= 0 ? `+${v}` : v}
                    </span>
                  ))}
                </div>
                <div>
                  <strong className="text-foreground">Domain Cards:</strong>{" "}
                  {domainCardIds.length > 0
                    ? domainCardIds
                        .map(
                          (id) => DOMAIN_CARDS.find((c) => c.id === id)?.name,
                        )
                        .join(", ")
                    : "—"}
                </div>
                {description && (
                  <p>
                    <strong className="text-foreground">Description:</strong>{" "}
                    {description}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-between mt-2">
          {step < STEPS.length - 1 ? (
            <Button
              data-ocid="create.next_button"
              onClick={nextStep}
              disabled={!canProceed()}
              className="ml-auto"
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          ) : (
            <Button
              data-ocid="create.finalize_button"
              onClick={handleCreate}
              disabled={!canProceed()}
              className="ml-auto"
            >
              <Save className="size-4 mr-1" />
              Finalize Character
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
