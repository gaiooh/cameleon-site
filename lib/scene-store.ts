import { themes } from "@/lib/themes";

// "Quadro de avisos" compartilhado entre a página (HTML) e a cena 3D.
// A cena lê esses valores 60 vezes por segundo, sem passar pelo React,
// o que evita re-renderizações e mantém a animação fluida.
export const scene = {
  themeIndex: 0,
  /** Posição contínua da rolagem em "cenas": 0 = topo, 1 = segunda seção... */
  sceneProgress: 0,
  /** Cursor em coordenadas de -1 a 1; lastMove em segundos (performance.now). */
  pointer: { x: 0, y: 0, active: false, lastMove: 0 },
  reducedMotion: false,
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeTheme(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getThemeIndex() {
  return scene.themeIndex;
}

export function setTheme(index: number) {
  if (index === scene.themeIndex) return;
  scene.themeIndex = index;

  const theme = themes[index];
  const root = document.documentElement;
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-ink", theme.accentInk);
  root.style.setProperty("--glow-a", theme.base);
  root.style.setProperty("--glow-b", theme.pattern);
  listeners.forEach((listener) => listener());
}
