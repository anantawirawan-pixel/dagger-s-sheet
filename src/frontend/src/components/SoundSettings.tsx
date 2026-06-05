import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useClickSound } from "@/hooks/useClickSound";
import { useDiceSound } from "@/hooks/useDiceSound";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

/**
 * Compact sound settings panel: click-sound toggle + volume slider,
 * and dice-sound toggle. Drops into the header or a settings popover.
 */
export function SoundSettings() {
  const {
    isEnabled: clickEnabled,
    toggleEnabled: toggleClick,
    volume,
    setVolume,
    isAudioAvailable,
  } = useClickSound();

  const { isSoundEnabled: diceEnabled, toggleSound: toggleDice } =
    useDiceSound();

  const [open, setOpen] = useState(false);

  if (!isAudioAvailable) return null;

  return (
    <div className="relative">
      {/* Trigger button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        data-ocid="sound.settings_button"
        className="rounded-md border border-primary/40 text-primary hover:bg-primary/10 p-2 transition-smooth size-9"
        onClick={() => setOpen((p) => !p)}
        aria-label="Sound settings"
        title="Sound settings"
      >
        {clickEnabled || diceEnabled ? (
          <Volume2 className="size-4" />
        ) : (
          <VolumeX className="size-4" />
        )}
      </Button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            role="presentation"
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-primary/30 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 flex flex-col gap-4 animate-in fade-in-0 zoom-in-95 duration-150">
            <p className="text-xs font-display font-bold text-foreground tracking-wide uppercase">
              Sound Settings
            </p>

            {/* Click sounds row */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Bell className="size-3" />
                  Selection Sounds
                </Label>
                <Button
                  type="button"
                  data-ocid="sound.click_toggle"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={toggleClick}
                  aria-label={
                    clickEnabled
                      ? "Mute selection sounds"
                      : "Enable selection sounds"
                  }
                >
                  {clickEnabled ? (
                    <Bell className="size-4 text-primary" />
                  ) : (
                    <BellOff className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {clickEnabled && (
                <div className="flex items-center gap-2">
                  <VolumeX className="size-3 text-muted-foreground shrink-0" />
                  <Slider
                    data-ocid="sound.click_volume_slider"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[volume]}
                    onValueChange={([v]) => setVolume(v)}
                    className="flex-1"
                    aria-label="Click sound volume"
                  />
                  <Volume2 className="size-3 text-muted-foreground shrink-0" />
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Dice sounds row */}
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Volume2 className="size-3" />
                Dice Sounds
              </Label>
              <Button
                type="button"
                data-ocid="sound.dice_toggle"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={toggleDice}
                aria-label={
                  diceEnabled ? "Mute dice sounds" : "Enable dice sounds"
                }
              >
                {diceEnabled ? (
                  <Volume2 className="size-4 text-primary" />
                ) : (
                  <VolumeX className="size-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
