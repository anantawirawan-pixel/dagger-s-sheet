import { useCallback, useEffect, useRef, useState } from "react";

export type ClickSoundType =
  | "ancestry"
  | "community"
  | "class"
  | "subclass"
  | "feat"
  | "spell"
  | "spell_cast"
  | "domain"
  | "weapon"
  | "item"
  | "armor"
  | "hope"
  | "stress"
  | "generic";

const STORAGE_KEY_ENABLED = "daggerheart-click-sound-enabled";
const STORAGE_KEY_VOLUME = "daggerheart-click-sound-volume";

// Distinct frequencies for each selection type — ascending pitch ladder
const TONE_MAP: Record<
  ClickSoundType,
  { freq: number; freq2: number; dur: number }
> = {
  // Highest — bright ethereal tinkle
  ancestry: { freq: 1760, freq2: 2217, dur: 0.18 },
  // High-mid — silvery chime
  community: { freq: 1480, freq2: 1865, dur: 0.16 },
  // Mid-high — noble bell
  class: { freq: 1174, freq2: 1480, dur: 0.2 },
  // Mid — arcane resonance
  subclass: { freq: 1046, freq2: 1318, dur: 0.18 },
  // Mid-low — feat unlock shimmer
  feat: { freq: 880, freq2: 1108, dur: 0.22 },
  // Mid-low — spell activation pulse
  spell: { freq: 783, freq2: 987, dur: 0.2 },
  // Cast — rich resonant arcane burst (two-chord bell + shimmer)
  spell_cast: { freq: 523, freq2: 1046, dur: 0.45 },
  // Lower-mid — domain card deep ring
  domain: { freq: 659, freq2: 830, dur: 0.22 },
  // Low — weapon equip thud-bell
  weapon: { freq: 523, freq2: 659, dur: 0.25 },
  // Low — armor metal clink
  armor: { freq: 440, freq2: 554, dur: 0.22 },
  // Low-mid — item click
  item: { freq: 587, freq2: 740, dur: 0.16 },
  // Generic — neutral tap
  generic: { freq: 698, freq2: 880, dur: 0.14 },
  // Hope — bright sparkling star-jingle (handled by playHopeSound)
  hope: { freq: 1200, freq2: 2000, dur: 0.3 },
  // Stress — ominous scary jingle (handled by playStressSound)
  stress: { freq: 180, freq2: 190, dur: 0.8 },
};

function getStoredEnabled(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY_ENABLED);
    return v !== "false";
  } catch {
    return true;
  }
}

function getStoredVolume(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY_VOLUME);
    if (v !== null) {
      const n = Number.parseFloat(v);
      if (!Number.isNaN(n)) return Math.min(1, Math.max(0, n));
    }
  } catch {
    // ignore
  }
  return 0.45;
}

function setStoredEnabled(v: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY_ENABLED, String(v));
  } catch {
    /* ignore */
  }
}

function setStoredVolume(v: number) {
  try {
    localStorage.setItem(STORAGE_KEY_VOLUME, String(v));
  } catch {
    /* ignore */
  }
}

function playHopeSound(ctx: AudioContext, volume: number) {
  // Bright sparkling star-jingle: 4 oscillators staggered 30ms each
  const freqs = [1200, 1600, 2000, 2400];
  freqs.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.03;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    const pan = ctx.createStereoPanner();
    pan.pan.setValueAtTime(i % 2 === 0 ? -0.3 : 0.3, t);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume * 0.55, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(pan);
    pan.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  });
}

function playStressSound(ctx: AudioContext, volume: number) {
  // Ominous scary stress jingle: low tremolo between two close frequencies
  // with minor-chord undertone and short decay
  const voices: [number, OscillatorType][] = [
    [180, "sawtooth"],
    [190, "triangle"],
    [270, "sawtooth"], // minor 3rd above root for dissonance
  ];
  voices.forEach(([freq, oscType], i) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = oscType;
    osc.frequency.setValueAtTime(freq, t);
    // Tremolo LFO — slightly different rate per voice for beating effect
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(5 + i * 1.5, t);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.2, t);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume * 0.38, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.78);
    lfo.start(t);
    lfo.stop(t + 0.78);
  });
}

function playClickTone(
  ctx: AudioContext,
  type: ClickSoundType,
  volume: number,
) {
  if (type === "hope") {
    playHopeSound(ctx, volume);
    return;
  }
  if (type === "stress") {
    playStressSound(ctx, volume);
    return;
  }

  const t = ctx.currentTime;
  const tone = TONE_MAP[type];

  // Primary partial
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(tone.freq, t);

  // Inharmonic upper partial for bell shimmer
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(tone.freq2, t);

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0, t);
  gain1.gain.linearRampToValueAtTime(volume, t + 0.005);
  gain1.gain.exponentialRampToValueAtTime(0.0001, t + tone.dur);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, t);
  gain2.gain.linearRampToValueAtTime(volume * 0.4, t + 0.005);
  gain2.gain.exponentialRampToValueAtTime(0.0001, t + tone.dur * 0.6);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc1.start(t);
  osc1.stop(t + tone.dur + 0.01);
  osc2.start(t);
  osc2.stop(t + tone.dur + 0.01);
}

export function useClickSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(() => getStoredEnabled());
  const [volume, setVolumeState] = useState<number>(() => getStoredVolume());
  const [isAudioAvailable, setIsAudioAvailable] = useState(true);

  useEffect(() => {
    setIsAudioAvailable(
      typeof window !== "undefined" && "AudioContext" in window,
    );
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      setStoredEnabled(next);
      return next;
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    setStoredVolume(clamped);
  }, []);

  const play = useCallback(
    (type: ClickSoundType = "generic") => {
      if (!isEnabled || !isAudioAvailable) return;
      try {
        if (!ctxRef.current) {
          ctxRef.current = new AudioContext();
        }
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") ctx.resume();
        playClickTone(ctx, type, volume);
      } catch {
        // Silently fail if AudioContext is blocked
      }
    },
    [isEnabled, isAudioAvailable, volume],
  );

  return {
    play,
    isEnabled,
    toggleEnabled,
    volume,
    setVolume,
    isAudioAvailable,
  };
}
