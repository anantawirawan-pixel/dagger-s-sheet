import { HomebrewWeaponCreator } from "@/components/HomebrewWeaponCreator";
import { Layout } from "@/components/Layout";
import { CharacterList } from "@/pages/CharacterList";
import { CharacterSheet } from "@/pages/CharacterSheet";
import { CreateCharacter } from "@/pages/CreateCharacter";
import PartyManagement from "@/pages/PartyManagement";
import { useCharacterStore } from "@/store/useCharacterStore";
import { FlaskConical } from "lucide-react";

export default function App() {
  const view = useCharacterStore((s) => s.view);
  const setView = useCharacterStore((s) => s.setView);

  // Homebrew page is a top-level view alongside list/create/sheet/parties
  if (view === "homebrew") {
    return (
      <div className="min-h-screen bg-background text-foreground font-body">
        <Layout>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              data-ocid="homebrew.back_button"
              onClick={() => setView("list")}
              className="self-start text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-smooth"
            >
              ← Back to Characters
            </button>
            <HomebrewWeaponCreator />
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {view === "list" && (
        <CharacterList
          homebrewButton={
            <HomebrewNavButton onClick={() => setView("homebrew")} />
          }
        />
      )}
      {view === "create" && <CreateCharacter />}
      {view === "sheet" && <CharacterSheet />}
      {view === "parties" && <PartyManagement />}
    </div>
  );
}

function HomebrewNavButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      data-ocid="homebrew.nav_button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/8 text-primary hover:bg-primary/15 px-3 py-1.5 text-xs font-medium transition-smooth"
    >
      <FlaskConical className="size-3.5" />
      Homebrew
    </button>
  );
}
