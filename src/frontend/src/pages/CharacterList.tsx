import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANCESTRIES } from "@/data/ancestries";
import { CLASSES } from "@/data/classes";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Plus, Trash2, User, Users } from "lucide-react";
import type * as React from "react";

export function CharacterList({
  homebrewButton,
}: { homebrewButton?: React.ReactNode }) {
  const characters = useCharacterStore((s) => s.characters);
  const setView = useCharacterStore((s) => s.setView);
  const setActiveCharacter = useCharacterStore((s) => s.setActiveCharacter);
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter);

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title text-lg">Your Characters</h2>
          <div className="flex items-center gap-2">
            {homebrewButton}
            <Button
              data-ocid="party.view_button"
              variant="outline"
              size="sm"
              onClick={() => setView("parties")}
            >
              <Users className="size-4 mr-1" />
              Parties
            </Button>
            <Button
              data-ocid="character.create_button"
              onClick={() => setView("create")}
              size="sm"
            >
              <Plus className="size-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {characters.length === 0 ? (
          <div
            data-ocid="character.empty_state"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <User className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm mb-4">
              No characters yet. Create your first Daggerheart hero!
            </p>
            <Button
              data-ocid="character.empty_create_button"
              onClick={() => setView("create")}
            >
              <Plus className="size-4 mr-1" />
              Create Character
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {characters.map((char, index) => {
              const cls = CLASSES.find((c) => c.id === char.classId);
              const anc = ANCESTRIES.find((a) => a.id === char.ancestryId);
              return (
                <Card
                  key={char.id}
                  data-ocid={`character.item.${index + 1}`}
                  className="card-fantasy cursor-pointer transition-smooth hover:border-primary/50"
                  onClick={() => setActiveCharacter(char.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-display font-bold">
                        {char.name}
                      </CardTitle>
                      <Button
                        data-ocid={`character.delete_button.${index + 1}`}
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCharacter(char.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Level {char.level} {cls?.name} &middot; {anc?.name}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>
                        HP {char.hitPoints}/{char.maxHitPoints}
                      </span>
                      <span>
                        Hope {char.hope}/{char.maxHope}
                      </span>
                      <span>
                        Stress {char.stress}/{char.maxStress}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
