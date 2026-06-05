import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "daggerheart-sound-pref";

function getStoredPref(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

function setStoredPref(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {
    // ignore
  }
}

function playBellTone(
  ctx: AudioContext,
  frequency: number,
  volume: number,
  when: number,
  duration: number,
) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, when);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(volume, when + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(when);
  osc.stop(when + duration);
}

function playShake(ctx: AudioContext) {
  const t = ctx.currentTime;
  // Soft descending chime cluster — gentle shake cue
  const notes = [
    { freq: 1480, vol: 0.18, delay: 0, dur: 0.35 },
    { freq: 1109, vol: 0.14, delay: 0.06, dur: 0.3 },
    { freq: 987, vol: 0.1, delay: 0.12, dur: 0.25 },
  ];
  for (const n of notes) {
    playBellTone(ctx, n.freq, n.vol, t + n.delay, n.dur);
    // Add 2nd partial for metallic bell shimmer
    playBellTone(ctx, n.freq * 2.756, n.vol * 0.35, t + n.delay, n.dur * 0.6);
  }
}

function playLand(ctx: AudioContext) {
  const t = ctx.currentTime;
  // Rich ascending bell chord — satisfying landing chime
  const partials = [
    // Fundamental
    { freq: 523.25, vol: 0.5, dur: 1.4 }, // C5
    { freq: 659.25, vol: 0.38, dur: 1.2 }, // E5
    { freq: 783.99, vol: 0.28, dur: 1.0 }, // G5
    // Bell harmonics (inharmonic partials give metallic quality)
    { freq: 523.25 * 2.756, vol: 0.18, dur: 0.7 },
    { freq: 659.25 * 2.756, vol: 0.12, dur: 0.55 },
  ];
  for (const p of partials) {
    playBellTone(ctx, p.freq, p.vol, t, p.dur);
  }
}

export function useDiceSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() =>
    getStoredPref(),
  );
  const [isAudioAvailable, setIsAudioAvailable] = useState<boolean>(true);

  useEffect(() => {
    setIsAudioAvailable(
      typeof window !== "undefined" && "AudioContext" in window,
    );
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      setStoredPref(next);
      return next;
    });
  }, []);

  const playDiceRoll = useCallback(() => {
    if (!isSoundEnabled || !isAudioAvailable) return;

    try {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      playShake(ctx);
      setTimeout(() => {
        if (ctxRef.current) {
          playLand(ctxRef.current);
        }
      }, 400);
    } catch {
      // AudioContext may be blocked; silently fail
    }
  }, [isSoundEnabled, isAudioAvailable]);

  return { playDiceRoll, isSoundEnabled, toggleSound, isAudioAvailable };
}
