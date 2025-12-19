import { useSettingsStore } from "../store/settingsStore";

type SfxKind = "confirm" | "error" | "soft";

type SfxTone = {
  frequency: number;
  duration: number;
  gain: number;
  type: OscillatorType;
};

const tones: Record<SfxKind, SfxTone> = {
  confirm: { frequency: 520, duration: 0.1, gain: 0.035, type: "triangle" },
  error: { frequency: 220, duration: 0.14, gain: 0.04, type: "sine" },
  soft: { frequency: 360, duration: 0.08, gain: 0.025, type: "sine" },
};

let audioContext: AudioContext | null = null;
let lastPlayedAt = 0;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContextCtor();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {
      // ignore resume errors
    });
  }
  return audioContext;
}

function playTone({ frequency, duration, gain, type }: SfxTone) {
  const nowMs = Date.now();
  if (nowMs - lastPlayedAt < 80) return;
  lastPlayedAt = nowMs;

  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);

  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.linearRampToValueAtTime(gain, now + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(envelope);
  envelope.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

export function playSfx(kind: SfxKind) {
  const { soundEnabled } = useSettingsStore.getState();
  if (!soundEnabled) return;
  playTone(tones[kind]);
}
