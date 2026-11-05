import * as THREE from "three";

// O camaleão é "esculpido" com matemática: cada parte do corpo é uma superfície
// (tubos, elipses, esferas) e espalhamos partículas sobre ela.
// Coordenadas: o camaleão olha para +x, o alto é +y e as laterais são ±z.

export const PART = {
  body: 0,
  head: 1,
  eyeL: 2,
  eyeR: 3,
  tail: 4,
  legs: 5,
  branch: 6,
  detail: 7, // crista, linha da boca: brilham mais
} as const;

// Pontos de referência usados também pela animação (olhos, pescoço, cauda).
export const ANATOMY = {
  neck: new THREE.Vector3(0.95, -0.02, 0),
  eyeL: new THREE.Vector3(1.36, 0.11, 0.27),
  eyeR: new THREE.Vector3(1.36, 0.11, -0.27),
  eyeRadius: 0.155,
  eyeForwardL: new THREE.Vector3(0.45, 0.15, 1).normalize(),
  eyeForwardR: new THREE.Vector3(0.45, 0.15, -1).normalize(),
  tailCenter: new THREE.Vector2(-1.55, -0.8),
};

// Gerador aleatório com semente: o camaleão sai sempre igual.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Emit = (
  p: THREE.Vector3,
  n: THREE.Vector3,
  part: number,
  param: number,
  headWeight: number,
  extra?: number,
) => void;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// ---------- corpo ----------
const bodyHeight = (s: number) => 0.54 * Math.pow(Math.sin(Math.PI * (0.08 + 0.84 * s)), 0.6);
const bodyCenterY = (s: number) => 0.13 * Math.sin(Math.PI * s) - 0.05;
const bodyX = (s: number) => -1.2 + 2.2 * s;

function sampleBody(count: number, rand: () => number, emit: Emit) {
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  let made = 0;
  while (made < count) {
    const s = rand();
    const h = bodyHeight(s);
    if (rand() * 0.54 > h) continue; // mais partículas onde o corpo é mais largo
    const w = h * 0.52;
    const theta = rand() * Math.PI * 2;
    const c = Math.cos(theta);
    const yScale = c < 0 ? 0.85 : 1; // barriga mais achatada
    p.set(bodyX(s), bodyCenterY(s) + h * c * yScale, w * Math.sin(theta));
    n.set(0, c / (h * yScale), Math.sin(theta) / w).normalize();
    emit(p, n, PART.body, 0.25 + 0.55 * s, smoothstep(0.82, 1, s) * 0.7);
    made++;
  }
}

// Crista dorsal em "serrilhado", do pescoço até a cauda
function sampleCrest(count: number, rand: () => number, emit: Emit) {
  const p = new THREE.Vector3();
  const n = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < count; i++) {
    const s = 0.04 + rand() * 0.9;
    const tooth = 1 - ((s * 34) % 1);
    const h = bodyHeight(s) + 0.035 + 0.05 * tooth * (1 - s * 0.5);
    p.set(bodyX(s), bodyCenterY(s) + h * (0.97 + rand() * 0.03), (rand() - 0.5) * 0.03);
    emit(p, n, PART.detail, 0.25 + 0.55 * s, smoothstep(0.82, 1, s) * 0.7);
  }
}

// ---------- cabeça com capacete (casque) ----------
const headX = (t: number) => 0.95 + 0.95 * t;
const headTop = (t: number) =>
  0.09 + 0.46 * Math.pow(1 - t, 0.8) + 0.33 * Math.exp(-Math.pow((t - 0.08) / 0.16, 2));
const headBottom = (t: number) => 0.055 + 0.37 * Math.pow(1 - t, 0.9);
const headWidth = (t: number) => 0.37 * Math.pow(1 - t, 0.7) + 0.02;
const HEAD_Y = -0.02;

function sampleHead(count: number, rand: () => number, emit: Emit) {
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  let made = 0;
  while (made < count) {
    const t = rand();
    const top = headTop(t);
    const bottom = headBottom(t);
    const w = headWidth(t);
    if (rand() * 0.9 * 0.36 > (top + bottom) * w) continue;
    const theta = rand() * Math.PI * 2;
    const c = Math.cos(theta);
    const sn = Math.sin(theta);
    const ry = c >= 0 ? top : bottom;
    // o capacete é fino: quanto mais alto, mais estreito
    const narrow = c > 0 ? 1 - 0.55 * Math.pow(c, 2) * smoothstep(0.35, 0.8, top) : 1;
    p.set(headX(t), HEAD_Y + ry * c, w * sn * narrow);
    n.set(0.25 * (1 - t), c / ry, sn / (w * narrow)).normalize();
    emit(p, n, PART.head, 0.82 + 0.18 * t, 1);
    made++;
  }
}

// Linha da boca: um fio brilhante de cada lado do rosto
function sampleMouth(count: number, rand: () => number, emit: Emit) {
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const t = 0.25 + rand() * 0.75;
    const side = rand() < 0.5 ? 1 : -1;
    const curve = -0.05 - 0.07 * Math.sin(Math.PI * (t - 0.25) / 0.75) * (1 - t);
    p.set(headX(t), HEAD_Y + curve, side * headWidth(t) * 1.01);
    n.set(0, 0, side);
    emit(p, n, PART.detail, 0.82 + 0.18 * t, 1);
  }
}

// ---------- olhos em torreta ----------
function sampleEye(count: number, rand: () => number, emit: Emit, side: 1 | -1) {
  const center = side === 1 ? ANATOMY.eyeL : ANATOMY.eyeR;
  const forward = side === 1 ? ANATOMY.eyeForwardL : ANATOMY.eyeForwardR;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  let made = 0;
  while (made < count) {
    // direção aleatória na esfera
    const u = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    n.set(r * Math.cos(a), u, r * Math.sin(a));
    const facing = n.dot(forward);
    if (facing < -0.35) continue; // a parte de trás fica escondida dentro da cabeça
    // a torreta é um cone arredondado: estica na direção do olhar
    const stretch = 1 + 0.25 * Math.max(0, facing);
    p.copy(n).multiplyScalar(ANATOMY.eyeRadius * stretch).add(center);
    // extra: 1 = pupila, 0.5 = anel da íris, 0 = pálpebra granulada
    const extra = facing > 0.93 ? 1 : facing > 0.8 ? 0.5 : 0;
    emit(p, n, side === 1 ? PART.eyeL : PART.eyeR, 0.92, 1, extra);
    made++;
  }
}

// ---------- cauda em espiral ----------
const TAIL_TURNS = 2.6 * Math.PI;
const TAIL_R0 = 0.83;
const TAIL_PHI0 = 1.134;
const TAIL_K = Math.log(TAIL_R0 / 0.1) / TAIL_TURNS;

function tailCenterline(u: number, out: THREE.Vector3) {
  const phi = TAIL_PHI0 + u * TAIL_TURNS;
  const r = TAIL_R0 * Math.exp(-TAIL_K * (phi - TAIL_PHI0));
  return out.set(
    ANATOMY.tailCenter.x + r * Math.cos(phi),
    ANATOMY.tailCenter.y + r * Math.sin(phi),
    0,
  );
}

function sampleTail(count: number, rand: () => number, emit: Emit) {
  const c = new THREE.Vector3();
  const c2 = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const side = new THREE.Vector3();
  const zAxis = new THREE.Vector3(0, 0, 1);
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  let made = 0;
  while (made < count) {
    const u = rand();
    const radius = 0.235 * Math.pow(1 - u, 1.15) + 0.022;
    // o comprimento do trecho diminui com a espiral; compensamos a densidade
    const segment = Math.exp(-TAIL_K * u * TAIL_TURNS);
    if (rand() > (radius / 0.257) * (0.35 + 0.65 * segment)) continue;
    tailCenterline(u, c);
    tailCenterline(Math.min(1, u + 0.002), c2);
    tangent.subVectors(c2, c).normalize();
    side.set(-tangent.y, tangent.x, 0);
    const a = rand() * Math.PI * 2;
    n.copy(side).multiplyScalar(Math.cos(a)).addScaledVector(zAxis, Math.sin(a) * 0.8).normalize();
    p.copy(c).addScaledVector(side, Math.cos(a) * radius).addScaledVector(zAxis, Math.sin(a) * radius * 0.8);
    emit(p, n, PART.tail, 0.25 * (1 - u), 0, u);
    made++;
  }
}

// ---------- patas ----------
const LEGS: THREE.Vector3[][] = [1, -1].flatMap((z) => [
  // dianteira: ombro, cotovelo, mão
  [new THREE.Vector3(0.72, -0.22, 0.2 * z), new THREE.Vector3(0.98, -0.55, 0.42 * z), new THREE.Vector3(0.86, -0.98, 0.2 * z)],
  // traseira: quadril, joelho, pé
  [new THREE.Vector3(-0.82, -0.22, 0.2 * z), new THREE.Vector3(-1.05, -0.58, 0.42 * z), new THREE.Vector3(-0.9, -0.98, 0.18 * z)],
]);

function sampleLegs(count: number, rand: () => number, emit: Emit) {
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const axis = new THREE.Vector3();
  const ortho1 = new THREE.Vector3();
  const ortho2 = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const leg = LEGS[Math.floor(rand() * LEGS.length)];
    const front = leg[0].x > 0;
    const param = front ? 0.72 : 0.3;
    if (rand() < 0.16) {
      // pé que agarra o galho: pequeno "punho"
      const u = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      n.set(r * Math.cos(a), u, r * Math.sin(a));
      p.copy(leg[2]).addScaledVector(n, 0.085).add(new THREE.Vector3(0, -0.03, 0));
      emit(p, n, PART.legs, param, 0);
      continue;
    }
    const seg = rand() < 0.5 ? 0 : 1;
    const a0 = leg[seg];
    const a1 = leg[seg + 1];
    const t = rand();
    axis.subVectors(a1, a0).normalize();
    ortho1.set(0, 0, 1).cross(axis).normalize();
    ortho2.crossVectors(axis, ortho1);
    const radius = (seg === 0 ? 0.095 : 0.07) * (1 - t * 0.25);
    const ang = rand() * Math.PI * 2;
    n.copy(ortho1).multiplyScalar(Math.cos(ang)).addScaledVector(ortho2, Math.sin(ang));
    p.lerpVectors(a0, a1, t).addScaledVector(n, radius);
    emit(p, n, PART.legs, param, 0);
  }
}

// ---------- galho ----------
function sampleBranch(count: number, rand: () => number, emit: Emit) {
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    const x = -3.6 + rand() * 7.2;
    const y = -1.1 + 0.05 * Math.sin(x * 0.8);
    const radius = 0.085 + 0.02 * Math.sin(x * 3.1);
    const a = rand() * Math.PI * 2;
    n.set(0, Math.cos(a), Math.sin(a));
    p.set(x, y + Math.cos(a) * radius, Math.sin(a) * radius);
    // as pontas do galho somem aos poucos
    const fade = 1 - smoothstep(2.4, 3.6, Math.abs(x));
    if (rand() > fade) continue;
    emit(p, n, PART.branch, 0.5, 0);
  }
}

export function createChameleonGeometry(total: number) {
  const rand = mulberry32(7);
  const positions: number[] = [];
  const normals: number[] = [];
  const data: number[] = []; // parte, parâmetro da coluna, aleatório, peso da cabeça
  const extras: number[] = []; // olho: pupila/íris | cauda: posição ao longo dela
  const dirs: number[] = []; // direção aleatória para a dispersão

  const emit: Emit = (p, n, part, param, headWeight, extra = 0) => {
    positions.push(p.x, p.y, p.z);
    normals.push(n.x, n.y, n.z);
    data.push(part, param, rand(), headWeight);
    extras.push(extra);
    const u = rand() * 2 - 1;
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    dirs.push(r * Math.cos(a), u, r * Math.sin(a));
  };

  sampleBody(Math.round(total * 0.33), rand, emit);
  sampleCrest(Math.round(total * 0.035), rand, emit);
  sampleHead(Math.round(total * 0.17), rand, emit);
  sampleMouth(Math.round(total * 0.02), rand, emit);
  sampleEye(Math.round(total * 0.035), rand, emit, 1);
  sampleEye(Math.round(total * 0.035), rand, emit, -1);
  sampleTail(Math.round(total * 0.15), rand, emit);
  sampleLegs(Math.round(total * 0.1), rand, emit);
  sampleBranch(Math.round(total * 0.12), rand, emit);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aNormal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("aData", new THREE.Float32BufferAttribute(data, 4));
  geometry.setAttribute("aExtra", new THREE.Float32BufferAttribute(extras, 1));
  geometry.setAttribute("aDir", new THREE.Float32BufferAttribute(dirs, 3));
  // As partículas se mexem na placa de vídeo; uma esfera folgada evita que
  // o Three.js esconda o camaleão por achar que ele saiu da tela.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 8);
  return geometry;
}
