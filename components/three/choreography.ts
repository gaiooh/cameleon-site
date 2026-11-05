// Onde o camaleão fica e como ele se comporta em cada seção da página.
// A cena interpola suavemente entre uma pose e outra conforme a rolagem.
// rotY: 0 = de perfil olhando para a direita | ~-2.7 = olhando para a esquerda
// pattern: força de cada desenho da pele [listras, manchas, escamas, anéis]
export type Pose = {
  x: number;
  y: number;
  z: number;
  rotY: number;
  scale: number;
  disperse: number;
  pattern: [number, number, number, number];
};

const desktop: Pose[] = [
  // 0. início: à direita, olhando para o texto
  { x: 1.6, y: -0.1, z: 0, rotY: -2.72, scale: 1, disperse: 0, pattern: [0, 0, 0.6, 0.25] },
  // 1. manifesto: vira poeira espalhada, como as informações da empresa
  { x: 0, y: 0, z: -1, rotY: -1.2, scale: 1.1, disperse: 1, pattern: [0, 0, 0.6, 0.25] },
  // 2-4. serviços: à esquerda, com uma pele diferente para cada serviço
  { x: -1.25, y: -0.15, z: 0, rotY: -0.4, scale: 0.8, disperse: 0, pattern: [1, 0, 0.2, 0] },
  { x: -1.25, y: -0.1, z: 0, rotY: -0.65, scale: 0.8, disperse: 0, pattern: [0, 1, 0.25, 0] },
  { x: -1.25, y: -0.15, z: 0, rotY: -0.25, scale: 0.8, disperse: 0, pattern: [0, 0, 0.2, 1] },
  // 5. processo: volta para a direita
  { x: 1.45, y: 0, z: 0, rotY: -2.55, scale: 0.8, disperse: 0, pattern: [0.4, 0.45, 0.4, 0] },
  // 6. contato: centralizado, acima do texto
  { x: 0.25, y: 1.15, z: 0, rotY: -2.45, scale: 0.68, disperse: 0, pattern: [0, 0, 0.5, 0.55] },
];

// No celular o camaleão fica na metade de cima e o texto embaixo.
const mobile: Pose[] = desktop.map((pose, i) => ({
  ...pose,
  x: i === 1 ? 0 : 0.12,
  y: i === 1 ? 0 : 1.75,
  z: pose.z - 0.5,
  scale: i === 1 ? 0.8 : 0.5,
}));

export function getPoses(aspect: number) {
  return aspect < 0.9 ? mobile : desktop;
}
