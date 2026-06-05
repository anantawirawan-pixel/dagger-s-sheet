import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useRef, useState } from "react";

interface ExperienceSectionProps {
  experiences: string[];
  onChange: (experiences: string[]) => void;
}

export function ExperienceSection({
  experiences,
  onChange,
}: ExperienceSectionProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...experiences, trimmed]);
    setDraft("");
    inputRef.current?.focus();
  }

  function handleRemove(index: number) {
    onChange(experiences.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <section
      data-ocid="experience.section"
      className="relative rounded-xl p-4 border border-purple-500/40 bg-card/80 shadow-[0_0_18px_2px_oklch(var(--color-purple)/0.15)] backdrop-blur-sm"
    >
      {/* Ornate corner accents */}
      <span className="pointer-events-none absolute top-1.5 left-1.5 size-3 border-t-2 border-l-2 border-purple-400/60 rounded-tl" />
      <span className="pointer-events-none absolute top-1.5 right-1.5 size-3 border-t-2 border-r-2 border-purple-400/60 rounded-tr" />
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-3 border-b-2 border-l-2 border-purple-400/60 rounded-bl" />
      <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-3 border-b-2 border-r-2 border-purple-400/60 rounded-br" />

      <p className="mb-2.5 font-display text-sm font-semibold tracking-widest uppercase text-purple-300 drop-shadow-[0_0_6px_oklch(0.65_0.28_295/0.7)]">
        ✦ Character Experiences
      </p>

      {/* Chip list */}
      {experiences.length > 0 && (
        <ul data-ocid="experience.list" className="mb-3 flex flex-wrap gap-2">
          {experiences.map((exp, i) => (
            <li
              key={`exp-${i}-${exp}`}
              data-ocid={`experience.item.${i + 1}`}
              className="flex items-center gap-1.5 rounded-full border border-purple-500/50 bg-purple-950/60 px-3 py-1 text-sm text-purple-200 shadow-[0_0_8px_oklch(0.55_0.22_285/0.2)] max-w-[90%]"
            >
              <span className="min-w-0 break-words leading-snug">{exp}</span>
              <button
                type="button"
                aria-label={`Remove experience: ${exp}`}
                data-ocid={`experience.delete_button.${i + 1}`}
                onClick={() => handleRemove(i)}
                className="ml-0.5 flex shrink-0 items-center justify-center rounded-full p-0.5 text-purple-400 transition-colors hover:bg-purple-500/30 hover:text-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {experiences.length === 0 && (
        <p
          data-ocid="experience.empty_state"
          className="mb-3 text-xs italic text-muted-foreground/60"
        >
          No experiences yet. Add one below — they can help during ability
          checks.
        </p>
      )}

      {/* Add row */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          data-ocid="experience.input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Grew up in the taverns of Stonesborough…"
          className={
            "flex-1 min-w-0 bg-background/60 border border-purple-500/30 text-foreground " +
            "placeholder:text-muted-foreground/50 rounded-lg font-body text-sm " +
            "focus-visible:ring-2 focus-visible:ring-purple-500/70 focus-visible:ring-offset-1 " +
            "focus-visible:border-purple-400 transition-all duration-200"
          }
        />
        <Button
          type="button"
          data-ocid="experience.add_button"
          onClick={handleAdd}
          disabled={!draft.trim()}
          className="shrink-0 bg-purple-700/80 text-white hover:bg-purple-600/90 border border-purple-500/50 font-semibold px-4 transition-all duration-200 disabled:opacity-40"
        >
          Add
        </Button>
      </div>

      <p className="mt-1.5 text-xs text-muted-foreground/70 font-body italic">
        Experiences are narrative notes that can invoke advantage or bonuses
        during relevant ability checks.
      </p>
    </section>
  );
}
