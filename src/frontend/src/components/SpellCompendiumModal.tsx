import { HomebrewSpellCreator } from "@/components/HomebrewSpellCreator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DOMAIN_CARDS } from "@/data/domainCards";
import {
  DOMAIN_ACCENT_HEX,
  DOMAIN_CHIP_COLORS,
  DOMAIN_COLORS,
  SPELLS,
  type Spell,
  type SpellDomain,
} from "@/data/spells";
import { useClickSound } from "@/hooks/useClickSound";
import { useHomebrewSpellStore } from "@/stores/useHomebrewSpellStore";
import type { HomebrewSpell } from "@/types/character";
import { Check, Filter, Sparkles, Trash2, X } from "lucide-react";
import type React from "react";
import { type CSSProperties, useMemo, useState } from "react";

const ALL_DOMAINS: SpellDomain[] = [
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

// A unified display type merging SRD Spell and HomebrewSpell
type DisplaySpell =
  | Spell
  | (HomebrewSpell & { domain: SpellDomain; tags: string[] });

interface Props {
  alreadyKnown: string[];
  onToggle: (spell: Spell, nowKnown: boolean) => void;
  onClose: () => void;
  characterDomainCardIds?: string[];
}

export function SpellCompendiumModal({
  alreadyKnown,
  onToggle,
  onClose,
  characterDomainCardIds,
}: Props) {
  const [search, setSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState<SpellDomain | "All">("All");
  const [showHomebrewCreator, setShowHomebrewCreator] = useState(false);
  const [editingSpell, setEditingSpell] = useState<HomebrewSpell | null>(null);
  const [castingSpellId, setCastingSpellId] = useState<string | null>(null);
  const [showRelevantOnly, setShowRelevantOnly] = useState(false);
  const { play: playSound } = useClickSound();
  const { spells: homebrewSpells, deleteSpell } = useHomebrewSpellStore();

  const allSpells: DisplaySpell[] = useMemo(() => {
    const hb: DisplaySpell[] = homebrewSpells.map((s) => ({
      ...s,
      domain: s.domain as SpellDomain,
    }));
    return [...(SPELLS as DisplaySpell[]), ...hb];
  }, [homebrewSpells]);

  const characterDomains = useMemo<Set<string>>(() => {
    if (!characterDomainCardIds || characterDomainCardIds.length === 0)
      return new Set();
    const domains = new Set<string>();
    for (const cardId of characterDomainCardIds) {
      const card = DOMAIN_CARDS.find((c) => c.id === cardId);
      if (card?.domain) domains.add(card.domain);
    }
    return domains;
  }, [characterDomainCardIds]);

  const filtered = useMemo(() => {
    return allSpells.filter((s) => {
      const matchesDomain = activeDomain === "All" || s.domain === activeDomain;
      const matchesSearch =
        !search.trim() ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        (s.tags ?? []).some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesRelevant =
        !showRelevantOnly ||
        characterDomains.size === 0 ||
        characterDomains.has(s.domain);
      return matchesDomain && matchesSearch && matchesRelevant;
    });
  }, [search, activeDomain, allSpells, showRelevantOnly, characterDomains]);

  function handleToggle(spell: DisplaySpell) {
    const isKnown = alreadyKnown.includes(spell.name);
    playSound("spell");
    const spellForCallback: Spell = {
      id: spell.id,
      name: spell.name,
      domain: spell.domain as SpellDomain,
      level: spell.level,
      description: spell.description,
      tags: spell.tags ?? [],
    };
    // Add the spell immediately, then fire the visual effect
    onToggle(spellForCallback, !isKnown);
    setCastingSpellId(spell.id);
    setTimeout(() => setCastingSpellId(null), 450);
  }

  function handleDeleteHomebrew(id: string) {
    playSound("generic");
    deleteSpell(id);
  }

  function handleEditHomebrew(spell: HomebrewSpell) {
    setEditingSpell(spell);
    setShowHomebrewCreator(true);
  }

  return (
    <div
      data-ocid="spell_compendium.modal"
      className="fixed inset-0 z-50 flex flex-col modal-overlay-bg"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border/50 bg-[oklch(0.18_0.07_262/0.7)] backdrop-blur-sm">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground tracking-wide">
            Spell Compendium
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} spell{filtered.length !== 1 ? "s" : ""} ·{" "}
            {alreadyKnown.length} known
            {homebrewSpells.length > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="text-amber-500 dark:text-amber-400">
                  {homebrewSpells.length} homebrew
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-ocid="spell_compendium.brew_spell_button"
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingSpell(null);
              setShowHomebrewCreator(true);
              playSound("spell");
            }}
            className="h-8 gap-1.5 text-xs border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          >
            <Sparkles className="size-3.5" />
            Brew Spell
          </Button>
          <Button
            data-ocid="spell_compendium.close_button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close spell compendium"
          >
            <X className="size-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-border/50 bg-[oklch(0.16_0.06_262/0.5)]">
        <Input
          data-ocid="spell_compendium.search_input"
          placeholder="Search spells by name, description, or tag…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Domain filter chips + Relevant toggle */}
      <div className="px-4 py-2 border-b border-border/40 bg-[oklch(0.15_0.06_262/0.4)] overflow-x-auto">
        <div className="flex gap-2 min-w-max items-center">
          <button
            type="button"
            data-ocid="spell_compendium.filter.relevant_only"
            onClick={() => {
              setShowRelevantOnly((v) => !v);
              playSound("domain");
            }}
            className={[
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
              showRelevantOnly
                ? "bg-primary/20 text-primary border-primary/60 ring-1 ring-primary/40"
                : "bg-muted text-muted-foreground border-border hover:border-primary/40",
            ].join(" ")}
            aria-pressed={showRelevantOnly}
            title={
              characterDomainCardIds && characterDomainCardIds.length > 0
                ? "Filter to character's domains"
                : "No domain cards selected"
            }
          >
            <Filter className="size-3" />
            Relevant only
          </button>
          <span className="text-border/60 select-none" aria-hidden>
            |
          </span>
          <button
            type="button"
            data-ocid="spell_compendium.filter.all"
            onClick={() => {
              setActiveDomain("All");
              playSound("domain");
            }}
            className={[
              "px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
              activeDomain === "All"
                ? "bg-foreground text-background border-foreground"
                : "bg-muted text-muted-foreground border-border hover:border-foreground/40",
            ].join(" ")}
          >
            All
          </button>
          {ALL_DOMAINS.map((domain) => (
            <button
              key={domain}
              type="button"
              data-ocid={`spell_compendium.filter.${domain.toLowerCase()}`}
              onClick={() => {
                setActiveDomain(domain);
                playSound("domain");
              }}
              className={[
                "px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                activeDomain === domain
                  ? `${DOMAIN_CHIP_COLORS[domain]} ring-1 ring-offset-1 ring-current`
                  : "bg-muted text-muted-foreground border-border hover:border-foreground/40",
              ].join(" ")}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Spell grid */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.length === 0 && (
            <div
              data-ocid="spell_compendium.empty_state"
              className="col-span-full flex flex-col items-center justify-center py-16 text-center"
            >
              <span className="text-4xl mb-3">✨</span>
              <p className="text-muted-foreground text-sm">
                No spells match your search.
              </p>
            </div>
          )}
          {filtered.map((spell) => {
            const isKnown = alreadyKnown.includes(spell.name);
            const isHb = (spell as HomebrewSpell).isHomebrew === true;
            return (
              <SpellCard
                key={spell.id}
                spell={spell}
                isKnown={isKnown}
                isCasting={castingSpellId === spell.id}
                onToggle={handleToggle}
                isHomebrew={isHb}
                onDeleteHomebrew={
                  isHb ? () => handleDeleteHomebrew(spell.id) : undefined
                }
                onEditHomebrew={
                  isHb
                    ? () => handleEditHomebrew(spell as HomebrewSpell)
                    : undefined
                }
              />
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer Done */}
      <div className="px-4 py-4 border-t border-border/50 bg-[oklch(0.18_0.07_262/0.7)] backdrop-blur-sm">
        <Button
          data-ocid="spell_compendium.done_button"
          className="w-full"
          onClick={onClose}
        >
          Done — {alreadyKnown.length} spell
          {alreadyKnown.length !== 1 ? "s" : ""} known
        </Button>
      </div>
      {/* Homebrew spell creator overlay */}
      <HomebrewSpellCreator
        isOpen={showHomebrewCreator}
        editingSpell={editingSpell}
        onClose={() => {
          setShowHomebrewCreator(false);
          setEditingSpell(null);
        }}
        onSave={() => {
          setShowHomebrewCreator(false);
          setEditingSpell(null);
        }}
      />
    </div>
  );
}

interface SpellCardProps {
  spell: DisplaySpell;
  isKnown: boolean;
  isCasting?: boolean;
  onToggle: (spell: DisplaySpell) => void;
  isHomebrew?: boolean;
  onDeleteHomebrew?: () => void;
  onEditHomebrew?: () => void;
}

function SpellCard({
  spell,
  isKnown,
  isCasting,
  onToggle,
  isHomebrew,
  onDeleteHomebrew,
  onEditHomebrew,
}: SpellCardProps) {
  const accentHex = DOMAIN_ACCENT_HEX[spell.domain];
  return (
    <button
      type="button"
      data-ocid={`spell_compendium.spell.${spell.id}`}
      onClick={() =>
        isHomebrew && onEditHomebrew ? onEditHomebrew() : onToggle(spell)
      }
      style={{
        borderColor: isKnown ? accentHex : undefined,
        boxShadow: isKnown ? `0 0 14px ${accentHex}50` : undefined,
        // Feed the domain accent color into the animation keyframe
        ...(isCasting
          ? ({ "--spell-cast-color": accentHex } as CSSProperties)
          : {}),
      }}
      className={[
        "relative flex flex-col gap-2 rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isCasting ? "spell-cast-anim" : "",
        isKnown
          ? "bg-primary/5 ring-1 ring-primary/20"
          : isHomebrew
            ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60 hover:bg-amber-500/10"
            : "border-border/60 bg-[oklch(0.2_0.07_262/0.6)] hover:border-primary/40 hover:bg-[oklch(0.22_0.08_262/0.7)]",
      ].join(" ")}
      aria-pressed={isKnown}
      aria-label={`${isHomebrew ? "Edit" : isKnown ? "Remove" : "Learn"} ${spell.name}`}
    >
      {/* Domain accent top strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: accentHex }}
      />
      {/* Selection indicator */}
      <span
        className={[
          "absolute top-2.5 right-2.5 size-5 rounded-full border-2 flex items-center justify-center transition-all duration-150",
          isKnown
            ? "bg-primary border-primary text-primary-foreground"
            : "border-border bg-background",
        ].join(" ")}
      >
        {isKnown && <Check className="size-3" />}
      </span>

      {/* Homebrew delete button */}
      {isHomebrew && onDeleteHomebrew && (
        <button
          type="button"
          data-ocid={`spell_compendium.spell.${spell.id}.delete_button`}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteHomebrew();
          }}
          className="absolute top-2 right-2 size-5 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label={`Delete homebrew spell ${spell.name}`}
        >
          <Trash2 className="size-3" />
        </button>
      )}

      {/* Name + badges */}
      <div className="flex items-start gap-2 pr-7">
        {isHomebrew && (spell as HomebrewSpell).artUrl && (
          <div className="size-10 rounded-md overflow-hidden border border-amber-500/30 shrink-0">
            <img
              src={(spell as HomebrewSpell).artUrl}
              alt={spell.name}
              className="size-full object-cover"
            />
          </div>
        )}
        <span className="font-display text-sm font-semibold text-foreground leading-snug">
          {spell.name}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge
          variant="outline"
          className={[
            "text-[10px] px-1.5 py-0 border",
            DOMAIN_COLORS[spell.domain],
          ].join(" ")}
        >
          {spell.domain}
        </Badge>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          Lvl {spell.level}
        </Badge>
        {isHomebrew && (
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-amber-500/50 text-amber-500 dark:text-amber-400"
          >
            Homebrew
          </Badge>
        )}
        {(spell.tags ?? []).slice(0, 2).map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-[10px] px-1.5 py-0"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {spell.description}
      </p>
    </button>
  );
}
