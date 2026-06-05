import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useClickSound } from "@/hooks/useClickSound";
import {
  type HomebrewCommunityEntry,
  useHomebrewCommunityStore,
} from "@/stores/useHomebrewCommunityStore";
import { Edit2, FlaskConical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface FormState {
  name: string;
  description: string;
  featureName: string;
  feature: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  featureName: "",
  feature: "",
};

function CommunityForm({
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
  const isValid =
    form.name.trim().length > 0 &&
    form.featureName.trim().length > 0 &&
    form.feature.trim().length > 0;

  return (
    <Card className="card-fantasy border-secondary/30 shadow-[0_0_16px_oklch(var(--secondary)/0.12)] bg-[oklch(0.16_0.07_280/0.9)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          <FlaskConical className="size-4 text-secondary" />
          {saveLabel === "Save Changes"
            ? "Edit Community"
            : "Forge New Community"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="com-name" className="text-xs text-muted-foreground">
            Community Name
          </Label>
          <Input
            id="com-name"
            data-ocid="homebrew-community.name_input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Thornvale, The Ashen Circle…"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="com-desc" className="text-xs text-muted-foreground">
            Description
          </Label>
          <Textarea
            id="com-desc"
            data-ocid="homebrew-community.description_input"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Describe your community's culture and background…"
            rows={2}
            className="resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="com-feat-name"
            className="text-xs text-muted-foreground"
          >
            Feature Name
          </Label>
          <Input
            id="com-feat-name"
            data-ocid="homebrew-community.feature_name_input"
            value={form.featureName}
            onChange={(e) =>
              setForm((f) => ({ ...f, featureName: e.target.value }))
            }
            placeholder="e.g. Ember Kinship, Wanderer's Eye…"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="com-feat" className="text-xs text-muted-foreground">
            Feature Description
          </Label>
          <Textarea
            id="com-feat"
            data-ocid="homebrew-community.feature_input"
            value={form.feature}
            onChange={(e) =>
              setForm((f) => ({ ...f, feature: e.target.value }))
            }
            placeholder="Describe what this community feature does…"
            rows={2}
            className="resize-none"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            data-ocid="homebrew-community.save_button"
            size="sm"
            className="flex-1"
            disabled={!isValid}
            onClick={() => onSave(form)}
          >
            {saveLabel}
          </Button>
          <Button
            type="button"
            data-ocid="homebrew-community.cancel_button"
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

export function HomebrewCommunityCreator() {
  const {
    homebrewCommunities,
    addCommunity,
    updateCommunity,
    removeCommunity,
  } = useHomebrewCommunityStore();
  const { play } = useClickSound();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingEntry: HomebrewCommunityEntry | null = editingId
    ? (homebrewCommunities.find((c) => c.id === editingId) ?? null)
    : null;

  function handleSave(form: FormState) {
    play("community");
    if (editingId) {
      updateCommunity(editingId, {
        name: form.name.trim(),
        description: form.description.trim(),
        featureName: form.featureName.trim(),
        feature: form.feature.trim(),
      });
      setEditingId(null);
    } else {
      addCommunity({
        name: form.name.trim(),
        description: form.description.trim(),
        featureName: form.featureName.trim(),
        feature: form.feature.trim(),
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
            <FlaskConical className="size-4 text-secondary" />
            Homebrew Communities
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Craft custom communities to expand character origins.
          </p>
        </div>
        {!isFormOpen && (
          <Button
            type="button"
            data-ocid="homebrew-community.add_button"
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
        <CommunityForm
          initial={
            editingEntry
              ? {
                  name: editingEntry.name,
                  description: editingEntry.description,
                  featureName: editingEntry.featureName,
                  feature: editingEntry.feature,
                }
              : { ...EMPTY_FORM }
          }
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
          saveLabel={editingEntry ? "Save Changes" : "Create Community"}
        />
      )}

      {homebrewCommunities.length === 0 && !isFormOpen ? (
        <div
          data-ocid="homebrew-community.empty_state"
          className="flex flex-col items-center justify-center py-10 text-center"
        >
          <FlaskConical className="size-8 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground font-medium mb-1">
            No homebrew communities yet
          </p>
          <p className="text-xs text-muted-foreground/70">
            Forge your first custom community.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {homebrewCommunities.map((entry, i) => (
            <Card
              key={entry.id}
              data-ocid={`homebrew-community.item.${i + 1}`}
              className={`card-fantasy transition-smooth bg-[oklch(0.18_0.08_280/0.6)] ${
                editingId === entry.id ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
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
                      data-ocid={`homebrew-community.edit_button.${i + 1}`}
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
                      data-ocid={`homebrew-community.delete_button.${i + 1}`}
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => {
                        play("generic");
                        removeCommunity(entry.id);
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
