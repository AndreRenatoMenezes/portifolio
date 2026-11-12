"use client";

import { useSyncExternalStore } from "react";

/**
 * Estado do visitante (som, fada, gemas e tema), guardado no localStorage.
 * O tema inicial é aplicado antes da pintura pelo script inline do layout.
 */
export type Theme = "day" | "night" | "temple";
export type Consent = "granted" | "denied" | null;
/** `consent` é `undefined` só no servidor/hidratação (ainda não sabemos); `null` = visitante não escolheu. */
export type Prefs = { sound: boolean; fairy: boolean; gems: string[]; theme: Theme; consent?: Consent };

export const GEM_IDS = ["hero", "inventory", "about", "contact", "footer"] as const;
export type GemId = (typeof GEM_IDS)[number];

const PREFS_KEY = "portfolio-prefs";
export const THEME_KEY = "portfolio-theme";

const serverSnapshot: Prefs = { sound: false, fairy: true, gems: [], theme: "day" };
let state: Prefs | null = null;
const listeners = new Set<() => void>();

function load(): Prefs {
  let saved: Partial<Prefs> = {};
  let storedTheme: string | null = null;
  try {
    saved = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}");
    storedTheme = localStorage.getItem(THEME_KEY);
  } catch {}
  const candidate = storedTheme ?? saved.theme ?? document.documentElement.dataset.theme;
  const theme: Theme =
    candidate === "day" || candidate === "night" || candidate === "temple" ? candidate : "day";
  document.documentElement.dataset.theme = theme;
  return {
    sound: saved.sound ?? false,
    fairy: saved.fairy ?? true,
    gems: Array.isArray(saved.gems) ? saved.gems.filter((g) => GEM_IDS.includes(g as GemId)) : [],
    theme,
    consent: saved.consent === "granted" || saved.consent === "denied" ? saved.consent : null,
  };
}

function getSnapshot(): Prefs {
  if (!state) state = load();
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setPrefs(patch: Partial<Prefs>) {
  state = { ...getSnapshot(), ...patch };
  try {
    const { sound, fairy, gems, consent } = state;
    localStorage.setItem(PREFS_KEY, JSON.stringify({ sound, fairy, gems, consent }));
    if (patch.theme) localStorage.setItem(THEME_KEY, patch.theme);
  } catch {}
  if (patch.theme) document.documentElement.dataset.theme = patch.theme;
  listeners.forEach((l) => l());
}

export const usePrefs = () => useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
export const readPrefs = getSnapshot;

export const toggleSound = () => setPrefs({ sound: !getSnapshot().sound });
export const toggleFairy = () => setPrefs({ fairy: !getSnapshot().fairy });

/** Escolha do aviso de cookies (só existe uma categoria opcional: analytics). */
export function setConsent(consent: "granted" | "denied") {
  // Sem localStorage não dá para guardar (nem provar) o aceite: o GA fica desligado nesta visita
  // e o aviso volta na próxima (spec 003, CA-05).
  let canStore = true;
  try {
    localStorage.setItem("portfolio-probe", "1");
    localStorage.removeItem("portfolio-probe");
  } catch {
    canStore = false;
  }
  setPrefs({ consent: canStore ? consent : "denied" });
}
/** "Preferências de cookies" no rodapé: mostra o aviso de novo. */
export const reopenConsent = () => setPrefs({ consent: null });

export const templeUnlocked = (p: Prefs) => p.gems.length >= GEM_IDS.length;

/** Ciclo dia -> noite -> (templo, se desbloqueado) -> dia. */
export function cycleTheme() {
  const p = getSnapshot();
  const next: Theme =
    p.theme === "day" ? "night" : p.theme === "night" && templeUnlocked(p) ? "temple" : "day";
  setPrefs({ theme: next });
}

/** Retorna "new" | "all" | "dup" para o chamador decidir a mensagem. */
export function collectGem(id: GemId): "new" | "all" | "dup" {
  const p = getSnapshot();
  if (p.gems.includes(id)) return "dup";
  const gems = [...p.gems, id];
  setPrefs({ gems });
  return gems.length >= GEM_IDS.length ? "all" : "new";
}

/* ---------- Mensagens (balão da fada / toast) ---------- */
type MessageListener = (text: string) => void;
const messageListeners = new Set<MessageListener>();

export function say(text: string) {
  messageListeners.forEach((l) => l(text));
}

export function onMessage(listener: MessageListener) {
  messageListeners.add(listener);
  return () => {
    messageListeners.delete(listener);
  };
}

/* ---------- Efeitos globais (ex.: chuva de estrelas) ---------- */
export const STARFALL_EVENT = "portfolio:starfall";
