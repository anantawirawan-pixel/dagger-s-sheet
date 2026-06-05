import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DOMAIN_ACCENT_HEX,
  DOMAIN_COLORS,
  DOMAIN_HOVER_COLORS,
  DOMAIN_SELECTED_COLORS,
  type SpellDomain,
} from "@/data/spells";
import { useClickSound } from "@/hooks/useClickSound";
import { useHomebrewSpellStore } from "@/stores/useHomebrewSpellStore";
import type { HomebrewSpell } from "@/types/character";
import { ImageIcon, Loader2, Sparkles, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const DOMAINS: SpellDomain[] = [
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

interface FormState {
  name: string;
  domain: SpellDomain | "";
  level: number;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  components: string;
  tags: string;
  artUrl: string;
}

const DEFAULT_FORM: FormState = {
  name: "",
  domain: "",
  level: 1,
  castingTime: "",
  range: "",
  duration: "",
  description: "",
  components: "",
  tags: "",
  artUrl: "",
};

function fieldFromSpell(spell: HomebrewSpell): FormState {
  return {
    name: spell.name,
    domain: spell.domain as SpellDomain | "",
    level: spell.level,
    castingTime: spell.castingTime,
    range: spell.range,
    duration: spell.duration,
    description: spell.description,
    components: spell.components,
    tags: spell.tags.join(", "),
    artUrl: spell.artUrl ?? "",
  };
}

interface Props {
  isOpen: boolean;
  editingSpell?: HomebrewSpell | null;
  onClose: () => void;
  onSave: (spell: Omit<HomebrewSpell, "id" | "isHomebrew">) => void;
}

export function HomebrewSpellCreator({
  isOpen,
  editingSpell,
  onClose,
  onSave,
}: Props) {
  const { addSpell, updateSpell } = useHomebrewSpellStore();
  const { play } = useClickSound();

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "error"
  >("idle");
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form when editingSpell changes
  useEffect(() => {
    if (isOpen) {
      setForm(
        editingSpell ? fieldFromSpell(editingSpell) : { ...DEFAULT_FORM },
      );
      setErrors({});
      setUploadState("idle");
      setUploadError("");
    }
  }, [isOpen, editingSpell]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.domain) next.domain = "Domain is required";
    if (form.level < 1 || form.level > 9) next.level = "Level must be 1–9";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    play("spell");

    const spellData: Omit<HomebrewSpell, "id" | "isHomebrew"> = {
      name: form.name.trim(),
      domain: form.domain as SpellDomain,
      level: form.level,
      castingTime: form.castingTime.trim() || "Action",
      range: form.range.trim() || "Self",
      duration: form.duration.trim() || "Instantaneous",
      description: form.description.trim(),
      components: form.components.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      createdAt: editingSpell?.createdAt ?? Date.now(),
      artUrl: form.artUrl || undefined,
    };

    if (editingSpell) {
      updateSpell(editingSpell.id, spellData);
    } else {
      addSpell(spellData);
    }

    onSave(spellData);
    onClose();
  }

  function handleClose() {
    play("generic");
    onClose();
  }

  async function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      setUploadState("error");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Image must be under 4 MB.");
      setUploadState("error");
      return;
    }
    setUploadState("uploading");
    setUploadError("");
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("Read failed"));
        reader.readAsDataURL(file);
      });
      set("artUrl", dataUrl);
      setUploadState("idle");
    } catch {
      setUploadError("Upload failed. Please try again.");
      setUploadState("error");
    }
  }

  const isEditing = !!editingSpell;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="hb-spell-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[oklch(0.1_0.05_260/0.75)] backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            key="hb-spell-modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            data-ocid="homebrew_spell.dialog"
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-primary/40 modal-content-bg shadow-[0_0_60px_oklch(0.1_0.06_260/0.7)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(0.35_0.1_262/0.4)]">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shadow-[0_0_8px_oklch(var(--primary)/0.2)]">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground leading-tight">
                    {isEditing ? "Edit Spell" : "Brew a Spell"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    {isEditing
                      ? "Update your custom spell"
                      : "Craft a new homebrew spell for your grimoire"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-ocid="homebrew_spell.close_button"
                onClick={handleClose}
                className="size-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="hbs-name"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Spell Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hbs-name"
                  data-ocid="homebrew_spell.name_input"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Voidfire Lance, Phantom Step…"
                  className={`text-sm transition-shadow focus:shadow-[0_0_0_2px_oklch(var(--primary)/0.35)] ${errors.name ? "border-destructive" : ""}`}
                />
                {errors.name && (
                  <p
                    className="text-[11px] text-destructive"
                    data-ocid="homebrew_spell.name.field_error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Domain picker */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Domain <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {DOMAINS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      data-ocid={`homebrew_spell.domain.${d.toLowerCase()}`}
                      onClick={() => {
                        play("domain");
                        set("domain", d);
                      }}
                      className={`text-xs rounded-full px-3 py-1 border font-medium transition-smooth ${
                        form.domain === d
                          ? DOMAIN_SELECTED_COLORS[d]
                          : `border-border/50 bg-card/50 text-muted-foreground ${DOMAIN_HOVER_COLORS[d]}`
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                {errors.domain && (
                  <p
                    className="text-[11px] text-destructive"
                    data-ocid="homebrew_spell.domain.field_error"
                  >
                    {errors.domain}
                  </p>
                )}
              </div>

              {/* Level + Casting Time row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="hbs-level"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Level (1–9) <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-1.5">
                    {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((lv) => (
                      <button
                        key={lv}
                        type="button"
                        data-ocid={`homebrew_spell.level.${lv}`}
                        onClick={() => set("level", lv)}
                        className={`size-8 rounded text-xs font-bold border transition-smooth ${
                          form.level === lv
                            ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_8px_oklch(var(--primary)/0.2)]"
                            : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {lv}
                      </button>
                    ))}
                  </div>
                  {errors.level && (
                    <p
                      className="text-[11px] text-destructive"
                      data-ocid="homebrew_spell.level.field_error"
                    >
                      {errors.level}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="hbs-cast"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Casting Time
                  </Label>
                  <Input
                    id="hbs-cast"
                    data-ocid="homebrew_spell.casting_time_input"
                    value={form.castingTime}
                    onChange={(e) => set("castingTime", e.target.value)}
                    placeholder="Action, Reaction, 1 minute…"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Range + Duration row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="hbs-range"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Range
                  </Label>
                  <Input
                    id="hbs-range"
                    data-ocid="homebrew_spell.range_input"
                    value={form.range}
                    onChange={(e) => set("range", e.target.value)}
                    placeholder="Self, Touch, 30 feet…"
                    className="text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="hbs-dur"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    Duration
                  </Label>
                  <Input
                    id="hbs-dur"
                    data-ocid="homebrew_spell.duration_input"
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="Instantaneous, 1 hour, Concentration…"
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Components */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="hbs-comp"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Components
                </Label>
                <Input
                  id="hbs-comp"
                  data-ocid="homebrew_spell.components_input"
                  value={form.components}
                  onChange={(e) => set("components", e.target.value)}
                  placeholder="V, S, M (a pinch of ash)…"
                  className="text-sm"
                />
              </div>

              {/* Effect Description */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="hbs-desc"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Effect Description
                </Label>
                <Textarea
                  id="hbs-desc"
                  data-ocid="homebrew_spell.description_input"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe what the spell does, any rolls required, and its effects…"
                  className="text-sm resize-none min-h-[100px] focus:shadow-[0_0_0_2px_oklch(var(--primary)/0.35)] transition-shadow"
                  rows={4}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="hbs-tags"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Tags
                  <span className="ml-1.5 text-muted-foreground/60 normal-case font-normal">
                    (comma-separated)
                  </span>
                </Label>
                <Input
                  id="hbs-tags"
                  data-ocid="homebrew_spell.tags_input"
                  value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="fire, evocation, ranged…"
                  className="text-sm"
                />
                {form.tags.trim() && (
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {form.tags
                      .split(",")
                      .map((t) => t.trim().toLowerCase())
                      .filter(Boolean)
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>

              {/* Spell Art Upload */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Spell Art
                  <span className="ml-1.5 text-muted-foreground/60 normal-case font-normal">
                    (optional)
                  </span>
                </Label>
                {form.artUrl ? (
                  <div className="relative flex items-start gap-3">
                    <div className="relative size-20 rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_12px_oklch(var(--primary)/0.15)] shrink-0">
                      <img
                        src={form.artUrl}
                        alt="Spell art preview"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      <p className="text-xs text-muted-foreground">
                        Art uploaded ✓
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          set("artUrl", "");
                          setUploadState("idle");
                          setUploadError("");
                        }}
                        className="h-7 text-xs gap-1 border-destructive/40 text-destructive hover:bg-destructive/10"
                      >
                        <X className="size-3" /> Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid="homebrew_spell.art_upload"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileSelect(file);
                    }}
                    className={[
                      "relative flex flex-col items-center justify-center gap-2 w-full h-24 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer",
                      isDragOver
                        ? "border-primary/60 bg-primary/10 scale-[1.01]"
                        : "border-border/50 bg-card/30 hover:border-primary/40 hover:bg-primary/5",
                    ].join(" ")}
                  >
                    {uploadState === "uploading" ? (
                      <>
                        <Loader2 className="size-5 text-primary animate-spin" />
                        <span className="text-xs text-muted-foreground">
                          Uploading…
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="size-4 text-muted-foreground" />
                          <Upload className="size-4 text-muted-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Drop image here or click to browse
                        </span>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                    e.target.value = "";
                  }}
                />
                {uploadState === "error" && uploadError && (
                  <p
                    className="text-[11px] text-destructive"
                    data-ocid="homebrew_spell.art_upload.error_state"
                  >
                    {uploadError}
                  </p>
                )}
              </div>

              {/* Preview card when domain is selected */}
              {form.domain && form.name.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-lg border p-3 ${DOMAIN_COLORS[form.domain as SpellDomain]} bg-card/40`}
                  style={{
                    borderColor: `${DOMAIN_ACCENT_HEX[form.domain as SpellDomain]}60`,
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-display font-bold text-foreground">
                      {form.name.trim()}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 border-primary/40 text-primary"
                    >
                      Homebrew
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0"
                    >
                      {form.domain} · Lvl {form.level}
                    </Badge>
                  </div>
                  {form.description.trim() && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 italic">
                      {form.description.trim()}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-[oklch(0.35_0.1_262/0.4)] bg-[oklch(0.12_0.05_260/0.5)]">
              <Button
                type="button"
                data-ocid="homebrew_spell.cancel_button"
                variant="outline"
                onClick={handleClose}
                className="min-w-[80px]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="homebrew_spell.save_button"
                onClick={handleSave}
                className="min-w-[120px] gap-2 bg-primary/90 hover:bg-primary text-primary-foreground shadow-[0_0_12px_oklch(var(--primary)/0.3)] hover:shadow-[0_0_18px_oklch(var(--primary)/0.45)] transition-shadow"
              >
                <Sparkles className="size-3.5" />
                {isEditing ? "Save Changes" : "Inscribe Spell"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
