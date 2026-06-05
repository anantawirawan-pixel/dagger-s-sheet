import PartyCombatTracker from "@/components/PartyCombatTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CLASSES } from "@/data/classes";
import { useCharacterStore } from "@/store/useCharacterStore";
import { usePartyCombatStore } from "@/store/usePartyCombatStore";
import { usePartyStore } from "@/store/usePartyStore";
import type { Character, Party } from "@/types/character";
import { exportPartyRosterToPDF } from "@/utils/exportPdf";
import {
  ArrowLeft,
  FileText,
  Heart,
  Pencil,
  Plus,
  Scroll,
  Shield,
  Swords,
  Trash2,
  Users,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function getClassName(char: Character): string {
  return CLASSES.find((c) => c.id === char.classId)?.name ?? "Unknown";
}

function PartySummary({
  party,
  characters,
}: { party: Party; characters: Character[] }) {
  const members = characters.filter((c) => party.memberIds.includes(c.id));
  const avgLevel =
    members.length > 0
      ? Math.round(
          members.reduce((sum, m) => sum + m.level, 0) / members.length,
        )
      : 0;
  const classComp = Array.from(new Set(members.map(getClassName))).join(", ");
  const totalMaxHP = members.reduce((sum, m) => sum + m.maxHitPoints, 0);

  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
      <span className="inline-flex items-center gap-1">
        <Users className="size-3.5" />
        {members.length} members
      </span>
      <span className="inline-flex items-center gap-1">
        <Swords className="size-3.5" />
        Avg Lvl {avgLevel}
      </span>
      <span className="inline-flex items-center gap-1">
        <Heart className="size-3.5" />
        {totalMaxHP} HP
      </span>
      {classComp && (
        <span className="inline-flex items-center gap-1">
          <Shield className="size-3.5" />
          {classComp}
        </span>
      )}
    </div>
  );
}

function PrintRosterButton({
  party,
  characters,
}: {
  party: Party;
  characters: Character[];
}) {
  const members = characters.filter((c) => party.memberIds.includes(c.id));
  if (members.length === 0) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    exportPartyRosterToPDF(party, characters);
  };

  return (
    <Button
      data-ocid={`party.print_button.${party.id}`}
      variant="outline"
      size="sm"
      type="button"
      onClick={handleClick}
      className="mt-2"
    >
      <FileText className="size-4 mr-1" />
      Print Roster
    </Button>
  );
}

function CampaignNotesSection({
  party,
  onUpdateNotes,
}: {
  party: Party;
  onUpdateNotes: (partyId: string, notes: string) => void;
}) {
  const [draft, setDraft] = useState(party.notes ?? "");
  const [savedFlash, setSavedFlash] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(party.notes ?? "");
  }, [party.notes]);

  const debouncedSave = useCallback(
    (next: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onUpdateNotes(party.id, next);
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
      }, 300);
    },
    [party.id, onUpdateNotes],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setDraft(next);
    debouncedSave(next);
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Scroll className="size-4 text-primary" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Campaign Notes
          </p>
        </div>
        <span
          className={`text-xs text-primary transition-opacity duration-500 ${savedFlash ? "opacity-100" : "opacity-0"}`}
        >
          Saved
        </span>
      </div>
      <textarea
        data-ocid={`party.notes_textarea.${party.id}`}
        value={draft}
        onChange={handleChange}
        rows={8}
        placeholder="Write your campaign notes here... NPCs encountered, quests, lore discovered..."
        className="w-full rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[8rem]"
      />
    </div>
  );
}

function MemberList({
  party,
  characters,
  onCharacterClick,
}: {
  party: Party;
  characters: Character[];
  onCharacterClick: (id: string) => void;
}) {
  const members = characters.filter((c) => party.memberIds.includes(c.id));
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground mt-2">
        No members in this party.
      </p>
    );
  }
  return (
    <ul className="mt-2 space-y-1">
      {members.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            onClick={() => onCharacterClick(m.id)}
            className="text-sm text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            {m.name} — Lvl {m.level} {getClassName(m)}
          </button>
        </li>
      ))}
    </ul>
  );
}

function CharacterChecklist({
  allCharacters,
  selectedIds,
  onToggle,
}: {
  allCharacters: Character[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {allCharacters.map((char) => (
        <div key={char.id} className="flex items-center gap-2">
          <Checkbox
            id={`char-${char.id}`}
            checked={selectedIds.includes(char.id)}
            onCheckedChange={() => onToggle(char.id)}
          />
          <Label htmlFor={`char-${char.id}`} className="text-sm cursor-pointer">
            {char.name} — Lvl {char.level} {getClassName(char)}
          </Label>
        </div>
      ))}
    </div>
  );
}

function CreatePartyDialog({
  allCharacters,
  onCreate,
}: {
  allCharacters: Character[];
  onCreate: (name: string, memberIds: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Party name is required.");
      return;
    }
    if (selectedIds.length === 0) {
      setError("Select at least one character.");
      return;
    }
    onCreate(trimmed, selectedIds);
    setName("");
    setSelectedIds([]);
    setError("");
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setName("");
      setSelectedIds([]);
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button data-ocid="party.create_button" size="sm">
          <Plus className="size-4 mr-1" />
          Create Party
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Party</DialogTitle>
          <DialogDescription>
            Name your party and choose its members.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="party-name">Party Name</Label>
            <Input
              id="party-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Iron Vanguard"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Members</Label>
            <div className="mt-1">
              <CharacterChecklist
                allCharacters={allCharacters}
                selectedIds={selectedIds}
                onToggle={toggle}
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            data-ocid="party.create_confirm_button"
            type="button"
            onClick={handleSubmit}
          >
            Create Party
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditPartyDialog({
  party,
  allCharacters,
  onUpdate,
  onDelete,
}: {
  party: Party;
  allCharacters: Character[];
  onUpdate: (id: string, updates: Partial<Party>) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(party.name);
  const [selectedIds, setSelectedIds] = useState<string[]>(party.memberIds);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Party name is required.");
      return;
    }
    if (selectedIds.length === 0) {
      setError("Select at least one character.");
      return;
    }
    onUpdate(party.id, { name: trimmed, memberIds: selectedIds });
    setError("");
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setName(party.name);
      setSelectedIds(party.memberIds);
      setError("");
      setShowDeleteConfirm(false);
    }
  };

  const handleDelete = () => {
    onDelete(party.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          data-ocid={`party.edit_button.${party.id}`}
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={(e) => e.stopPropagation()}
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Party</DialogTitle>
          <DialogDescription>Update name and members.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`edit-party-name-${party.id}`}>Party Name</Label>
            <Input
              id={`edit-party-name-${party.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Members</Label>
            <div className="mt-1">
              <CharacterChecklist
                allCharacters={allCharacters}
                selectedIds={selectedIds}
                onToggle={toggle}
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2">
          <div>
            {!showDeleteConfirm ? (
              <Button
                data-ocid={`party.delete_button.${party.id}`}
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="size-4 mr-1" />
                Delete
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Confirm?</span>
                <Button
                  data-ocid={`party.confirm_delete_button.${party.id}`}
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={handleDelete}
                >
                  Yes
                </Button>
                <Button
                  data-ocid={`party.cancel_delete_button.${party.id}`}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <Button
            data-ocid={`party.save_button.${party.id}`}
            type="button"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PartyManagement() {
  const characters = useCharacterStore((s) => s.characters);
  const setView = useCharacterStore((s) => s.setView);
  const setActiveCharacter = useCharacterStore((s) => s.setActiveCharacter);
  const parties = usePartyStore((s) => s.parties);
  const createParty = usePartyStore((s) => s.createParty);
  const updateParty = usePartyStore((s) => s.updateParty);
  const deleteParty = usePartyStore((s) => s.deleteParty);
  const updatePartyNotes = usePartyStore((s) => s.updatePartyNotes);

  const [expandedPartyId, setExpandedPartyId] = useState<string | null>(null);

  const sortedParties = useMemo(
    () => [...parties].sort((a, b) => a.name.localeCompare(b.name)),
    [parties],
  );

  const handleBack = () => setView("list");

  const handleCharacterClick = (id: string) => {
    setActiveCharacter(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedPartyId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              data-ocid="party.back_button"
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={handleBack}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="section-title text-xl">Parties</h1>
          </div>
          <CreatePartyDialog
            allCharacters={characters}
            onCreate={(name, memberIds) => createParty(name, memberIds)}
          />
        </div>

        {sortedParties.length === 0 ? (
          <div
            data-ocid="party.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Users className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm mb-4">
              No parties yet. Assemble your first adventuring group!
            </p>
            <CreatePartyDialog
              allCharacters={characters}
              onCreate={(name, memberIds) => createParty(name, memberIds)}
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedParties.map((party, index) => {
              const isExpanded = expandedPartyId === party.id;
              return (
                <Card
                  key={party.id}
                  data-ocid={`party.item.${index + 1}`}
                  className="card-fantasy transition-smooth"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleExpand(party.id)}
                        className="text-left bg-transparent border-0 p-0 cursor-pointer"
                      >
                        <CardTitle className="text-base font-display font-bold hover:text-primary transition-colors">
                          {party.name}
                        </CardTitle>
                      </button>
                      <EditPartyDialog
                        party={party}
                        allCharacters={characters}
                        onUpdate={updateParty}
                        onDelete={deleteParty}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PartySummary party={party} characters={characters} />
                    <PrintRosterButton party={party} characters={characters} />
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Members
                        </p>
                        <MemberList
                          party={party}
                          characters={characters}
                          onCharacterClick={handleCharacterClick}
                        />
                        <CampaignNotesSection
                          party={party}
                          onUpdateNotes={updatePartyNotes}
                        />
                        <PartyCombatTracker
                          partyId={party.id}
                          characters={characters.filter((c) =>
                            party.memberIds.includes(c.id),
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
