import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClickSound } from "@/hooks/useClickSound";
import {
  type HomebrewAncestryEntry,
  useHomebrewAncestryStore,
} from "@/stores/useHomebrewAncestryStore";
import {
  Edit2,
  FlaskConical,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

interface FormState {
  name: string;
  description: string;
  featureName: string;
  feature: string;
  artUrl: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  featureName: "",
  feature: "",
  artUrl: "",
};

function AncestryForm({
  initial,
  onSave,
  onCancel,
  saveLabel,
}: {
  initial: FormState;
  onSave: (form: FormState) => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [uploadState, setUploadState] = useState<
    "idle" | "uploading" | "error"
  >("idle");
  const [uploadError, setUploadError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isValid =
    form.name.trim().length > 0 &&
    form.featureName.trim().length > 0 &&
    form.feature.trim().length > 0;

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
      setForm((f) => ({ ...f, artUrl: dataUrl }));
      setUploadState("idle");
    } catch {
      setUploadError("Upload failed. Please try again.");
      setUploadState("error");
    }
  }

  return (
    <Card className="card-fantasy border-primary/30 shadow-[0_0_16px_oklch(var(--primary)/0.12)] bg-[oklch(0.16_0.07_262/0.9)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          <FlaskConical className="size-4 text-primary" />
          {saveLabel === "Save Changes"
            ? "Edit Ancestry"
            : "Forge New Ancestry"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="anc-name" className="text-xs text-muted-foreground">
            Ancestry Name
          </Label>
          <Input
            id="anc-name"
            data-ocid="homebrew-ancestry.name_input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Sylvanfolk, Ashborn…"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="anc-desc" className="text-xs text-muted-foreground">
            Description
          </Label>
          <Textarea
            id="anc-desc"
            data-ocid="homebrew-ancestry.description_input"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Describe your ancestry's origins and traits…"
            rows={2}
            className="resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="anc-feat-name"
            className="text-xs text-muted-foreground"
          >
            Feature Name
          </Label>
          <Input
            id="anc-feat-name"
            data-ocid="homebrew-ancestry.feature_name_input"
            value={form.featureName}
            onChange={(e) =>
              setForm((f) => ({ ...f, featureName: e.target.value }))
            }
            placeholder="e.g. Ember Soul, Root Sense…"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="anc-feat" className="text-xs text-muted-foreground">
            Feature Description
          </Label>
          <Textarea
            id="anc-feat"
            data-ocid="homebrew-ancestry.feature_input"
            value={form.feature}
            onChange={(e) =>
              setForm((f) => ({ ...f, feature: e.target.value }))
            }
            placeholder="Describe what this ancestry feature does…"
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Art Upload */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">
            Ancestry Art
            <span className="ml-1.5 opacity-60 normal-case font-normal">
              (optional)
            </span>
          </Label>
          {form.artUrl ? (
            <div className="flex items-center gap-3">
              <div className="relative size-16 rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_8px_oklch(var(--primary)/0.15)] shrink-0">
                <img
                  src={form.artUrl}
                  alt="Ancestry art preview"
                  className="size-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setForm((f) => ({ ...f, artUrl: "" }));
                  setUploadState("idle");
                  setUploadError("");
                }}
                className="h-7 text-xs gap-1 border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                <X className="size-3" /> Remove
              </Button>
            </div>
          ) : (
            <button
              type="button"
              data-ocid="homebrew-ancestry.art_upload"
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
                "flex flex-col items-center justify-center gap-2 w-full h-20 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer",
                isDragOver
                  ? "border-primary/60 bg-primary/10"
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
                    Drop image or click to browse
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
              data-ocid="homebrew-ancestry.art_upload.error_state"
            >
              {uploadError}
            </p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            data-ocid="homebrew-ancestry.save_button"
            size="sm"
            className="flex-1"
            disabled={!isValid}
            onClick={() => onSave(form)}
          >
            {saveLabel}
          </Button>
          <Button
            type="button"
            data-ocid="homebrew-ancestry.cancel_button"
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function HomebrewAncestryCreator() {
  const { homebrewAncestries, addAncestry, updateAncestry, removeAncestry } =
    useHomebrewAncestryStore();
  const { play } = useClickSound();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingEntry: HomebrewAncestryEntry | null = editingId
    ? (homebrewAncestries.find((a) => a.id === editingId) ?? null)
    : null;

  function handleSave(form: FormState) {
    play("ancestry");
    if (editingId) {
      updateAncestry(editingId, {
        name: form.name.trim(),
        description: form.description.trim(),
        featureName: form.featureName.trim(),
        feature: form.feature.trim(),
        artUrl: form.artUrl || undefined,
      });
      setEditingId(null);
    } else {
      addAncestry({
        name: form.name.trim(),
        description: form.description.trim(),
        featureName: form.featureName.trim(),
        feature: form.feature.trim(),
        artUrl: form.artUrl || undefined,
      });
      setShowForm(false);
    }
  }

  const isFormOpen = showForm || editingId !== null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title text-base flex items-center gap-2">
            <FlaskConical className="size-4 text-primary" />
            Homebrew Ancestries
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Craft custom ancestries to expand character origins.
          </p>
        </div>
        {!isFormOpen && (
          <Button
            type="button"
            data-ocid="homebrew-ancestry.add_button"
            size="sm"
            onClick={() => {
              play("generic");
              setEditingId(null);
              setShowForm(true);
            }}
            className="gap-1.5"
          >
            <Plus className="size-3.5" />
            New
          </Button>
        )}
      </div>

      {isFormOpen && (
        <AncestryForm
          initial={
            editingEntry
              ? {
                  name: editingEntry.name,
                  description: editingEntry.description,
                  featureName: editingEntry.featureName,
                  feature: editingEntry.feature,
                  artUrl: editingEntry.artUrl ?? "",
                }
              : { ...EMPTY_FORM }
          }
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          saveLabel={editingEntry ? "Save Changes" : "Create Ancestry"}
        />
      )}

      {homebrewAncestries.length === 0 && !isFormOpen ? (
        <div
          data-ocid="homebrew-ancestry.empty_state"
          className="flex flex-col items-center justify-center py-10 text-center"
        >
          <FlaskConical className="size-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground font-medium mb-1">
            No homebrew ancestries yet
          </p>
          <p className="text-xs text-muted-foreground/70">
            Forge your first custom ancestry.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {homebrewAncestries.map((entry, i) => (
            <Card
              key={entry.id}
              data-ocid={`homebrew-ancestry.item.${i + 1}`}
              className={`card-fantasy transition-smooth bg-[oklch(0.18_0.07_262/0.6)] ${
                editingId === entry.id ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 shrink-0">
                    {entry.artUrl && (
                      <div className="size-10 rounded-md overflow-hidden border border-primary/20 shrink-0">
                        <img
                          src={entry.artUrl}
                          alt={entry.name}
                          className="size-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-display font-bold text-foreground">
                        {entry.name}
                      </p>
                      <span className="text-[9px] rounded bg-purple-700/80 text-white px-1 py-0.5 font-semibold tracking-wide">
                        HB
                      </span>
                    </div>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {entry.description}
                      </p>
                    )}
                    <p className="text-xs text-primary mt-1">
                      <strong>{entry.featureName}:</strong> {entry.feature}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      type="button"
                      data-ocid={`homebrew-ancestry.edit_button.${i + 1}`}
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => {
                        play("generic");
                        setEditingId(entry.id);
                        setShowForm(false);
                      }}
                    >
                      <Edit2 className="size-3" />
                    </Button>
                    <Button
                      type="button"
                      data-ocid={`homebrew-ancestry.delete_button.${i + 1}`}
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => {
                        play("generic");
                        removeAncestry(entry.id);
                      }}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
