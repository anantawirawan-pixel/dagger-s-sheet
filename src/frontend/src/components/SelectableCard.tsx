import { useClickSound } from "@/hooks/useClickSound";
import type { ClickSoundType } from "@/hooks/useClickSound";
import { cn } from "@/lib/utils";
import { type CSSProperties, useEffect, useRef, useState } from "react";

export type SelectionType =
  | "default"
  | "ancestry"
  | "community"
  | "class"
  | "subclass"
  | "domain"
  | "armor"
  | "weapon"
  | "weapon-primary"
  | "weapon-secondary"
  | "feat"
  | "spell"
  | "item";

const FLASH_CLASS: Record<SelectionType, string> = {
  default: "card-selected",
  ancestry: "card-selected-ancestry",
  community: "card-selected-community",
  class: "card-selected-class",
  subclass: "card-selected-subclass",
  domain: "card-selected-domain",
  armor: "card-selected-armor",
  weapon: "card-selected-domain",
  "weapon-primary": "card-selected-weapon-primary",
  "weapon-secondary": "card-selected-weapon-secondary",
  feat: "card-selected-subclass",
  spell: "card-selected-ancestry",
  item: "card-selected",
};

const GLOW_CLASS: Record<SelectionType, string> = {
  default: "card-selected-glow",
  ancestry: "card-selected-glow-ancestry",
  community: "card-selected-glow-community",
  class: "card-selected-glow-class",
  subclass: "card-selected-glow-subclass",
  domain: "card-selected-glow-domain",
  armor: "card-selected-glow-armor",
  weapon: "card-selected-glow-domain",
  "weapon-primary": "card-selected-glow-weapon-primary",
  "weapon-secondary": "card-selected-glow-weapon-secondary",
  feat: "card-selected-glow-subclass",
  spell: "card-selected-glow-ancestry",
  item: "card-selected-glow",
};

// Map SelectionType -> ClickSoundType for distinct audio tones
const SOUND_MAP: Record<SelectionType, ClickSoundType> = {
  default: "generic",
  ancestry: "ancestry",
  community: "community",
  class: "class",
  subclass: "subclass",
  domain: "domain",
  armor: "armor",
  weapon: "weapon",
  "weapon-primary": "weapon",
  "weapon-secondary": "weapon",
  feat: "feat",
  spell: "spell",
  item: "item",
};

interface SelectableCardProps {
  selected: boolean;
  selectionType?: SelectionType;
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  "data-ocid"?: string;
}

/**
 * A card wrapper that flashes a distinct glow color when clicked,
 * then maintains a steady glow while selected.
 *
 * Plays the flash keyframe animation on each new selection,
 * then applies the persistent glow class after the flash completes.
 */
export function SelectableCard({
  selected,
  selectionType = "default",
  onClick,
  className,
  style,
  children,
  "data-ocid": dataOcid,
}: SelectableCardProps) {
  const [flashing, setFlashing] = useState(false);
  const prevSelected = useRef(selected);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { play } = useClickSound();

  // When selection state becomes true (just selected), trigger flash + sound
  useEffect(() => {
    if (selected && !prevSelected.current) {
      setFlashing(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setFlashing(false), 600);
    }
    prevSelected.current = selected;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [selected]);

  const flashCls = flashing ? FLASH_CLASS[selectionType] : "";
  const glowCls = selected && !flashing ? GLOW_CLASS[selectionType] : "";

  function handleClick() {
    // Play sound only on new selection, not deselect
    if (!selected) {
      play(SOUND_MAP[selectionType]);
    }
    onClick();
  }

  return (
    <button
      type="button"
      tabIndex={0}
      data-ocid={dataOcid}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        "card-fantasy cursor-pointer transition-smooth w-full text-left",
        flashCls,
        glowCls,
        className,
      )}
      style={style}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}
