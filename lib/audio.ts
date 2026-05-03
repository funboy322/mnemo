/**
 * Synthesized sound effects via Web Audio API. Zero asset files.
 *
 * Three sounds:
 *   sfx.correct() — bright two-note ding (E5 → G5)
 *   sfx.wrong()   — short low thud (C3, sine)
 *   sfx.complete() — ascending arpeggio (C5 E5 G5 C6)
 *
 * Respects a global mute toggle persisted in localStorage. The toggle
 * defaults to ON (sound enabled). Calling sfx.* before a user gesture
 * is a no-op (browsers block audio without interaction).
 */

const MUTE_KEY = "curio.audio.muted";

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  return ctx;
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTE_KEY, value ? "1" : "0");
}

function tone(freq: number, durationMs: number, type: OscillatorType = "sine", startDelayMs = 0, gain = 0.15) {
  const c = getCtx();
  if (!c || isMuted()) return;
  const start = c.currentTime + startDelayMs / 1000;
  const end = start + durationMs / 1000;

  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);

  const g = c.createGain();
  // Quick attack, soft release
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, end);

  osc.connect(g);
  g.connect(c.destination);
  osc.start(start);
  osc.stop(end + 0.05);
}

export const sfx = {
  correct() {
    // Bright two-note ascending: E5 → G5
    tone(659.25, 90, "triangle", 0, 0.18);
    tone(783.99, 130, "triangle", 70, 0.16);
  },
  wrong() {
    // Short muted thud
    tone(146.83, 200, "sine", 0, 0.2);
    tone(110, 150, "sine", 60, 0.12);
  },
  complete() {
    // C major arpeggio C5 E5 G5 C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone(f, 220, "triangle", i * 90, 0.18));
  },
  tap() {
    tone(440, 40, "sine", 0, 0.06);
  },
};

/** Some browsers require resuming the AudioContext after a user gesture. */
export function unlockAudio() {
  const c = getCtx();
  if (c && c.state === "suspended") {
    c.resume().catch(() => {});
  }
}
