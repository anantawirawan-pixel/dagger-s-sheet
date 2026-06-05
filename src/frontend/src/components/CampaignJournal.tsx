import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface CampaignJournalProps {
  characterId: string;
  characterName: string;
}

function storageKey(characterId: string) {
  return `dagger-foundry:journal:${characterId}`;
}

function loadEntries(characterId: string): JournalEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(characterId));
    if (!raw) return [];
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

function saveEntries(characterId: string, entries: JournalEntry[]) {
  localStorage.setItem(storageKey(characterId), JSON.stringify(entries));
}

export function CampaignJournal({
  characterId,
  characterName,
}: CampaignJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(() =>
    loadEntries(characterId),
  );
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftContent, setDraftContent] = useState("");

  // Reload entries when characterId changes
  useEffect(() => {
    setEntries(loadEntries(characterId));
    setShowNew(false);
    setEditingId(null);
  }, [characterId]);

  function persist(next: JournalEntry[]) {
    setEntries(next);
    saveEntries(characterId, next);
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function openNew() {
    setDraftTitle("");
    setDraftDate(todayStr());
    setDraftContent("");
    setEditingId(null);
    setShowNew(true);
  }

  function openEdit(entry: JournalEntry) {
    setDraftTitle(entry.title);
    setDraftDate(entry.date);
    setDraftContent(entry.content);
    setEditingId(entry.id);
    setShowNew(false);
  }

  function cancelDraft() {
    setShowNew(false);
    setEditingId(null);
  }

  function saveNew() {
    if (!draftTitle.trim() && !draftContent.trim()) return;
    const entry: JournalEntry = {
      id: `je-${Date.now()}`,
      date: draftDate || todayStr(),
      title: draftTitle.trim() || "Untitled Entry",
      content: draftContent.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const next = [entry, ...entries];
    persist(next);
    setShowNew(false);
  }

  function saveEdit() {
    const next = entries.map((e) =>
      e.id === editingId
        ? {
            ...e,
            title: draftTitle.trim() || "Untitled Entry",
            date: draftDate || todayStr(),
            content: draftContent.trim(),
            updatedAt: Date.now(),
          }
        : e,
    );
    persist(next);
    setEditingId(null);
  }

  function deleteEntry(id: string) {
    persist(entries.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
  }

  const isEditing = showNew || editingId !== null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">
            Journal for <span className="text-primary">{characterName}</span>
          </h3>
        </div>
        {!isEditing && (
          <Button
            data-ocid="journal.new_entry_button"
            size="sm"
            className="gap-1.5 font-display"
            onClick={openNew}
          >
            <Plus className="size-4" />
            New Entry
          </Button>
        )}
      </div>

      {/* New Entry Form */}
      {showNew && (
        <Card className="card-fantasy border-primary/40 animate-fade-in">
          <CardContent className="pt-4 flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                data-ocid="journal.entry_title_input"
                placeholder="Session title…"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="flex-1 font-display text-sm"
              />
              <Input
                data-ocid="journal.entry_date_input"
                type="date"
                value={draftDate}
                onChange={(e) => setDraftDate(e.target.value)}
                className="w-36 text-sm"
              />
            </div>
            <Textarea
              data-ocid="journal.entry_content_textarea"
              placeholder="What happened this session? Note NPCs met, quests advanced, loot gained, and anything that might help during ability checks…"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              rows={6}
              className="text-sm resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                data-ocid="journal.entry_cancel_button"
                type="button"
                variant="outline"
                size="sm"
                onClick={cancelDraft}
                className="gap-1"
              >
                <X className="size-3.5" /> Cancel
              </Button>
              <Button
                data-ocid="journal.entry_save_button"
                type="button"
                size="sm"
                onClick={saveNew}
                className="gap-1"
              >
                <Save className="size-3.5" /> Save Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      {entries.length === 0 && !showNew ? (
        <div
          data-ocid="journal.empty_state"
          className="flex flex-col items-center justify-center py-12 text-center gap-3"
        >
          <BookOpen className="size-10 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm max-w-xs">
            No journal entries yet. Record your first session to track quests,
            NPCs, and notes that aid your ability checks.
          </p>
          <Button
            data-ocid="journal.empty_state_new_button"
            size="sm"
            variant="outline"
            onClick={openNew}
            className="gap-1.5"
          >
            <Plus className="size-4" /> Add First Entry
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry, idx) => (
            <Card
              key={entry.id}
              data-ocid={`journal.entry.${idx + 1}`}
              className="card-fantasy transition-all duration-200"
            >
              <CardContent className="pt-3 pb-3">
                {editingId === entry.id ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Input
                        data-ocid="journal.edit_title_input"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        className="flex-1 font-display text-sm"
                      />
                      <Input
                        data-ocid="journal.edit_date_input"
                        type="date"
                        value={draftDate}
                        onChange={(e) => setDraftDate(e.target.value)}
                        className="w-36 text-sm"
                      />
                    </div>
                    <Textarea
                      data-ocid="journal.edit_content_textarea"
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      rows={5}
                      className="text-sm resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        data-ocid="journal.edit_cancel_button"
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelDraft}
                        className="gap-1"
                      >
                        <X className="size-3.5" /> Cancel
                      </Button>
                      <Button
                        data-ocid="journal.edit_save_button"
                        type="button"
                        size="sm"
                        onClick={saveEdit}
                        className="gap-1"
                      >
                        <Save className="size-3.5" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm text-foreground truncate">
                          {entry.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            `${entry.date}T00:00:00`,
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          data-ocid={`journal.edit_button.${idx + 1}`}
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-primary"
                          onClick={() => openEdit(entry)}
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          data-ocid={`journal.delete_button.${idx + 1}`}
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    {entry.content && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words line-clamp-4">
                        {entry.content}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
