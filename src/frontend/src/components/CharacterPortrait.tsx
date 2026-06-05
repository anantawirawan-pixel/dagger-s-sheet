import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, UserCircle2 } from "lucide-react";
import { useRef } from "react";

interface CharacterPortraitProps {
  portraitDataUrl?: string;
  characterName?: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  /** compact = small avatar in sheet header; full = large editable block */
  variant?: "compact" | "full";
  /** For compact variant: 'large' renders size-24 with bigger icon; default renders size-12 */
  size?: "default" | "large";
  /** Class string to override container sizing */
  className?: string;
}

export function CharacterPortrait({
  portraitDataUrl,
  characterName = "Character",
  onUpload,
  onRemove,
  variant = "full",
  size = "default",
  className,
}: CharacterPortraitProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") onUpload(result);
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  }

  if (variant === "compact") {
    const defaultSize = size === "large" ? "size-24" : "size-12";
    return (
      <div className={`relative shrink-0 group ${className ?? defaultSize}`}>
        {portraitDataUrl ? (
          <img
            src={portraitDataUrl}
            alt={`${characterName} portrait`}
            className="size-full rounded-full object-cover border-2 border-primary/60 shadow-md"
          />
        ) : (
          <div className="size-full rounded-full bg-muted border-2 border-primary/30 flex items-center justify-center">
            <UserCircle2
              className={
                size === "large"
                  ? "size-10 text-muted-foreground"
                  : "size-6 text-muted-foreground"
              }
            />
          </div>
        )}
        {/* Hover overlay — click to swap or clear */}
        <button
          type="button"
          data-ocid="portrait.upload_button"
          aria-label="Upload portrait"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ImagePlus
            className={
              size === "large" ? "size-6 text-white" : "size-4 text-white"
            }
          />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFile}
        />
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
      <button
        type="button"
        data-ocid="portrait.dropzone"
        className="relative group w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-primary/40 bg-muted/40 hover:border-primary/70 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
        aria-label="Upload character portrait"
      >
        {portraitDataUrl ? (
          <img
            src={portraitDataUrl}
            alt={`${characterName} portrait`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="size-8 opacity-60" />
            <span className="text-xs">Upload Portrait</span>
          </div>
        )}
        {/* Upload-on-hover overlay when image present */}
        {portraitDataUrl && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <ImagePlus className="size-6 text-white" />
            <span className="text-xs text-white">Change</span>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          data-ocid="portrait.upload_button"
          variant="outline"
          size="sm"
          className="text-xs gap-1"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-3" />
          {portraitDataUrl ? "Change" : "Upload"}
        </Button>
        {portraitDataUrl && (
          <Button
            type="button"
            data-ocid="portrait.delete_button"
            variant="ghost"
            size="sm"
            className="text-xs gap-1 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="size-3" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
