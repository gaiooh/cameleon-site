// Cada tema é uma "pele" do camaleão e também a cor do site inteiro.
// base: cor do corpo | pattern: cor das listras e manchas | glow: brilhos (olho, crista)
export type Theme = {
  id: string;
  name: string;
  base: string;
  pattern: string;
  glow: string;
  accent: string; // cor de destaque da interface (texto e botões)
  accentInk: string; // texto em cima do accent
};

export const themes: Theme[] = [
  {
    id: "aurora",
    name: "Aurora",
    base: "#5b3cf0",
    pattern: "#22d3ee",
    glow: "#f0d9ff",
    accent: "#a78bfa",
    accentInk: "#0b0618",
  },
  {
    id: "selva",
    name: "Selva",
    base: "#0f9d6b",
    pattern: "#b6f23a",
    glow: "#fdf6b2",
    accent: "#7ee08a",
    accentInk: "#04140a",
  },
  {
    id: "oceano",
    name: "Oceano",
    base: "#1d4ed8",
    pattern: "#2dd4bf",
    glow: "#dff6ff",
    accent: "#60c8f5",
    accentInk: "#020c18",
  },
  {
    id: "solar",
    name: "Solar",
    base: "#e8590c",
    pattern: "#f43f8e",
    glow: "#ffe8a3",
    accent: "#fb9a5b",
    accentInk: "#1a0800",
  },
  {
    id: "orquidea",
    name: "Orquídea",
    base: "#b0249f",
    pattern: "#6d6cf6",
    glow: "#ffd6f2",
    accent: "#f08ad8",
    accentInk: "#1a0414",
  },
];
