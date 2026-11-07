"use client";

import { readPrefs } from "@/lib/store";

/**
 * Sons sintetizados com Web Audio (nenhum arquivo de áudio, nenhuma música de terceiros).
 * Só tocam com o som ligado.
 */
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (!readPrefs().sound) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = "triangle", gain = 0.12) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  const t = ac.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  amp.gain.setValueAtTime(0, t);
  amp.gain.linearRampToValueAtTime(gain, t + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(amp).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

/** Clique curto ao mover o cursor do inventário. */
export const playCursor = () => tone(880, 0, 0.06, "square", 0.04);

/** Letra da caixa de diálogo. */
export const playBlip = () => tone(520 + Math.random() * 60, 0, 0.04, "square", 0.025);

/** Arpejo ascendente ao abrir um item. */
export function playItemGet() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.35));
}

/** Brilho ao coletar gema. */
export function playGem() {
  [1318.5, 1760].forEach((f, i) => tone(f, i * 0.07, 0.25, "sine", 0.1));
}

/** Notas do "instrumento" (teclas ↑ ↓ ← → A). Escala pentatônica original. */
const NOTES: Record<string, number> = { a: 293.66, down: 349.23, right: 440, left: 493.88, up: 587.33 };
export const playNote = (key: keyof typeof NOTES) => tone(NOTES[key], 0, 0.45, "sine", 0.14);
