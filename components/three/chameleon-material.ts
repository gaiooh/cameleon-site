import * as THREE from "three";
import { ANATOMY } from "@/components/three/chameleon-geometry";

// Shaders são pequenos programas que rodam na placa de vídeo, um para cada
// partícula ao mesmo tempo. É isso que permite animar ~45 mil pontos a 60 fps.

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform mat3 uHeadRot;
  uniform mat3 uEyeRotL;
  uniform mat3 uEyeRotR;
  uniform vec3 uNeck;
  uniform vec3 uEyeL;
  uniform vec3 uEyeR;
  uniform vec2 uTailCenter;
  uniform vec2 uBlink;
  uniform float uDisperse;
  uniform float uWave;
  uniform vec4 uPattern;
  uniform float uBreath;
  uniform vec3 uLightPos;
  uniform vec3 uBaseA;
  uniform vec3 uBaseB;
  uniform vec3 uPatA;
  uniform vec3 uPatB;
  uniform vec3 uGlowA;
  uniform vec3 uGlowB;

  attribute vec3 aNormal;
  attribute vec4 aData;
  attribute float aExtra;
  attribute vec3 aDir;

  varying vec3 vColor;
  varying float vAlpha;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }

  mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    float part = aData.x;
    float param = aData.y;
    float rnd = aData.z;
    float headW = aData.w;

    bool isEyeL = abs(part - 2.0) < 0.5;
    bool isEyeR = abs(part - 3.0) < 0.5;
    bool isEye = isEyeL || isEyeR;
    bool isTail = abs(part - 4.0) < 0.5;
    bool isBranch = abs(part - 6.0) < 0.5;
    bool isDetail = abs(part - 7.0) < 0.5;

    vec3 rest = position;
    vec3 p = position;
    vec3 n = aNormal;

    // 1. Olhos giram nas órbitas, cada um com sua própria rotação
    if (isEyeL) { p = uEyeL + uEyeRotL * (p - uEyeL); n = uEyeRotL * n; }
    if (isEyeR) { p = uEyeR + uEyeRotR * (p - uEyeR); n = uEyeRotR * n; }

    // 2. Respiração: o tronco expande e contrai
    if (part < 0.5 || (isDetail && param < 0.82)) {
      float torso = smoothstep(0.25, 0.42, param) * (1.0 - smoothstep(0.68, 0.84, param));
      p += aNormal * uBreath * torso;
    }

    // 3. Cauda enrola e desenrola devagar
    if (isTail) {
      float u = aExtra;
      vec2 q = p.xy - uTailCenter;
      q = rot2(sin(uTime * 0.55) * 0.07 * u + sin(uTime * 1.3 + u * 6.0) * 0.015 * u) * q;
      p.xy = q + uTailCenter;
    }

    // 4. Cabeça (e um pouco do pescoço) gira a partir da nuca
    if (headW > 0.0) {
      vec3 hp = uNeck + uHeadRot * (p - uNeck);
      p = mix(p, hp, headW);
      n = normalize(mix(n, uHeadRot * n, headW));
    }

    // 5. Brilho trêmulo: as partículas nunca ficam totalmente paradas
    p += aDir * 0.006 * sin(uTime * 2.0 + rnd * 40.0);

    // 6. Dispersão: o corpo se desfaz em poeira, da cauda para a cabeça
    float stagger = (1.0 - param) * 0.6 + rnd * 0.4;
    float d = clamp((uDisperse - stagger * 0.3) / 0.7, 0.0, 1.0);
    d = d * d * (3.0 - 2.0 * d);
    // destino: uma nuvem densa que gira devagar, como uma galáxia
    vec3 cloud = aDir * (1.4 + 2.4 * sqrt(rnd));
    cloud.y *= 0.65;
    cloud.xz = rot2(uTime * 0.06 + rnd * 0.4) * cloud.xz;
    cloud += vec3(sin(uTime * 0.3 + rnd * 6.28), cos(uTime * 0.25 + rnd * 9.0), sin(uTime * 0.2 + rnd * 3.0)) * 0.12;
    p = mix(p, cloud, d);

    vec4 world = modelMatrix * vec4(p, 1.0);
    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;

    // ---------- luz ----------
    vec3 N = normalize(mat3(modelMatrix) * n);
    vec3 L = normalize(uLightPos - world.xyz);
    vec3 V = normalize(cameraPosition - world.xyz);
    float facing = dot(N, V);
    float wrapLight = max((dot(N, L) + 0.3) / 1.3, 0.0);
    float rim = pow(1.0 - abs(facing), 2.4);
    float front = smoothstep(-0.35, 0.35, facing); // o lado de trás fica na sombra
    float light = 0.05 + 1.15 * pow(wrapLight, 1.4);

    // ---------- pele ----------
    float t = uTime * 0.06;
    float stripes = smoothstep(0.35, 0.75, 0.5 + 0.5 * sin(rest.x * 8.5 + sin(rest.y * 3.0 + t * 6.0) * 1.4));
    float spots = smoothstep(0.55, 0.72, noise(rest * 4.2 + vec3(t, 0.0, t)));
    float scales = smoothstep(0.45, 0.85, noise(rest * 16.0 + t));
    // pulsos de luz que viajam da cabeça para a cauda, como bioluminescência
    float pulses = smoothstep(0.82, 1.0, sin(rest.x * 5.0 + uTime * 1.8 + noise(rest * 2.0) * 2.0));
    float m = clamp(dot(uPattern, vec4(stripes, spots, scales, pulses)), 0.0, 1.0);
    // barriga mais clara e dorso mais escuro, como no animal de verdade
    float belly = smoothstep(-0.25, -0.75, aNormal.y) * (1.0 - step(5.5, part));

    // A cor nova percorre o corpo como uma onda, do focinho até a cauda
    float dist = 1.0 - param;
    float frontLine = uWave * 1.4 - 0.2;
    float k = 1.0 - smoothstep(frontLine - 0.18, frontLine, dist + rnd * 0.05);
    float edge = clamp(1.0 - abs(dist - frontLine + 0.09) / 0.1, 0.0, 1.0) * step(0.0, uWave) * step(uWave, 1.0);

    vec3 base = mix(uBaseA, uBaseB, k);
    vec3 pat = mix(uPatA, uPatB, k);
    vec3 glow = mix(uGlowA, uGlowB, k);

    // o desenho da pele aparece por contraste: fundo mais escuro, desenho mais claro
    vec3 skin = mix(base * 0.6, pat * 1.15, m);
    skin = mix(skin, mix(skin, glow, 0.35), belly);
    vec3 col = skin * (light * front + 0.04);
    col += glow * rim * 0.45 * front;
    col += pat * pulses * uPattern.w * 0.5 * front;

    float size = uSize * (0.55 + rnd * 0.9);
    float alpha = 0.62 + 0.38 * sin(uTime * (1.5 + rnd * 2.0) + rnd * 30.0);

    if (isDetail) {
      // crista brilha mais; a linha da boca é discreta
      bool mouth = param > 0.82;
      col = mix(col, glow * (0.3 + light), mouth ? 0.25 : 0.55);
      size *= mouth ? 0.8 : 1.1;
      alpha *= mouth ? 0.6 : 1.0;
    }

    if (isEye) {
      float blink = isEyeL ? uBlink.x : uBlink.y;
      // anéis concêntricos na pálpebra, apontando para a pupila
      vec3 eyeCenter = isEyeL ? uEyeL : uEyeR;
      float ridge = 0.5 + 0.5 * sin(dot(normalize(rest - eyeCenter), isEyeL ? vec3(0.4, 0.13, 0.9) : vec3(0.4, 0.13, -0.9)) * 22.0);
      if (aExtra > 0.9) {
        // pupila: um reflexo pequeno e intenso no centro escuro
        col = glow * 2.0;
        size *= 1.15 * (1.0 - blink);
        alpha = step(0.4, rnd);
      } else if (aExtra > 0.4) {
        // íris escura em volta do reflexo
        col = base * 0.12;
        size *= 1.0 - blink * 0.8;
      } else {
        col = mix(base, pat, ridge * 0.6) * (light * front + 0.06);
        col += glow * rim * 0.08;
      }
    }

    if (isBranch) {
      col = mix(vec3(0.07, 0.065, 0.09), base * 0.3, 0.45) * (0.5 + light * 0.7);
      size *= 0.8;
      alpha *= 0.55;
    }

    col += glow * edge * 1.1;

    // na nuvem, cada partícula brilha com uma cor da paleta
    col = mix(col, mix(base, pat, rnd) * 0.85 + glow * 0.15 * step(0.92, rnd), d);
    size *= 1.0 + d * 0.5;
    alpha *= 1.0 - d * 0.2;

    vColor = col;
    vAlpha = alpha;
    gl_PointSize = size * uPixelRatio * (8.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = pow(1.0 - r * 2.0, 1.6);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

export function createChameleonMaterial() {
  const color = () => new THREE.Color();
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 2.4 },
      uPixelRatio: { value: 1 },
      uHeadRot: { value: new THREE.Matrix3() },
      uEyeRotL: { value: new THREE.Matrix3() },
      uEyeRotR: { value: new THREE.Matrix3() },
      uNeck: { value: ANATOMY.neck.clone() },
      uEyeL: { value: ANATOMY.eyeL.clone() },
      uEyeR: { value: ANATOMY.eyeR.clone() },
      uTailCenter: { value: ANATOMY.tailCenter.clone() },
      uBlink: { value: new THREE.Vector2() },
      uDisperse: { value: 0 },
      uWave: { value: 2 },
      uPattern: { value: new THREE.Vector4(0, 0, 0.6, 0.25) },
      uBreath: { value: 0 },
      uLightPos: { value: new THREE.Vector3(2, 3, 5) },
      uBaseA: { value: color() },
      uBaseB: { value: color() },
      uPatA: { value: color() },
      uPatB: { value: color() },
      uGlowA: { value: color() },
      uGlowB: { value: color() },
    },
  });
}
