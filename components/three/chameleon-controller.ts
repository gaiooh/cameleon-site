import * as THREE from "three";
import { ANATOMY, createChameleonGeometry } from "@/components/three/chameleon-geometry";
import { createChameleonMaterial } from "@/components/three/chameleon-material";
import { getPoses } from "@/components/three/choreography";
import { scene } from "@/lib/scene-store";
import { themes } from "@/lib/themes";

// O "cérebro" do camaleão: decide para onde ele olha, quando pisca, como respira
// e onde fica na tela. É uma classe comum (sem React) porque roda 60 vezes por
// segundo e mexe direto nos objetos 3D.

// Aproxima "current" de "target" de forma suave, independente do FPS.
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));

// Mola: dá aquele "peso" orgânico ao movimento da cabeça (acelera e assenta).
type Spring = { value: number; velocity: number };
function stepSpring(s: Spring, target: number, stiffness: number, damping: number, dt: number) {
  const force = (target - s.value) * stiffness - s.velocity * damping;
  s.velocity += force * dt;
  s.value += s.velocity * dt;
}

const easeInOut = (t: number) => t * t * (3 - 2 * t);
const MAX_EYE_ANGLE = THREE.MathUtils.degToRad(80);
const EYE_MIDPOINT = new THREE.Vector3().addVectors(ANATOMY.eyeL, ANATOMY.eyeR).multiplyScalar(0.5);

// Cada olho tem a própria "mente": alvo, velocidade e piscadas independentes.
class Eye {
  quat = new THREE.Quaternion();
  target = new THREE.Quaternion();
  idleDir: THREE.Vector3;
  nextSaccade: number;
  blinkStart = -10;
  nextBlink: number;

  constructor(
    public center: THREE.Vector3,
    public rest: THREE.Vector3,
    seed: number,
  ) {
    this.idleDir = rest.clone();
    this.nextSaccade = 0.5 + seed;
    this.nextBlink = 2 + seed * 3;
  }

  blinkAmount(time: number) {
    const t = time - this.blinkStart;
    if (t < 0 || t > 0.26) return 0;
    if (t < 0.07) return easeInOut(t / 0.07);
    if (t < 0.11) return 1;
    return 1 - easeInOut((t - 0.11) / 0.15);
  }
}

export type FrameInfo = {
  time: number;
  delta: number;
  camera: THREE.Camera;
  width: number;
  height: number;
  pixelRatio: number;
};

export class ChameleonController {
  readonly object = new THREE.Group();
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;

  private shownTheme = scene.themeIndex;
  private waveStart = -10;
  private introStart = -1;
  private headYaw: Spring = { value: 0, velocity: 0 };
  private headPitch: Spring = { value: 0, velocity: 0 };
  private headRoll: Spring = { value: 0, velocity: 0 };
  private attentionUntil = 0;
  private nextAttention = 3;
  private eyeL = new Eye(ANATOMY.eyeL, ANATOMY.eyeForwardL, 0);
  private eyeR = new Eye(ANATOMY.eyeR, ANATOMY.eyeForwardR, 0.7);
  private pattern = new THREE.Vector4(0, 0, 0.6, 0.25);
  private pos = new THREE.Vector3(1.6, -0.1, 0);
  private rotY = -2.72;
  private scale = 1;
  private light = new THREE.Vector3(2, 3, 5);

  // objetos reutilizáveis (criar objetos a cada quadro deixaria tudo lento)
  private lastPointer = new THREE.Vector2();
  private ray = new THREE.Raycaster();
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2.5);
  private ndc = new THREE.Vector2();
  private world = new THREE.Vector3();
  private local = new THREE.Vector3();
  private headLocal = new THREE.Vector3();
  private dir = new THREE.Vector3();
  private inv = new THREE.Matrix4();
  private headQuat = new THREE.Quaternion();
  private headQuatInv = new THREE.Quaternion();
  private euler = new THREE.Euler();
  private mat4 = new THREE.Matrix4();
  private jitter = new THREE.Vector3();

  constructor(particles: number) {
    this.geometry = createChameleonGeometry(particles);
    this.material = createChameleonMaterial();
    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.object.name = "chameleon";
    this.object.add(points);

    const theme = themes[scene.themeIndex];
    const u = this.material.uniforms;
    for (const [a, b, hex] of [
      ["uBaseA", "uBaseB", theme.base],
      ["uPatA", "uPatB", theme.pattern],
      ["uGlowA", "uGlowB", theme.glow],
    ] as const) {
      u[a].value.set(hex);
      u[b].value.set(hex);
    }
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }

  update({ time, delta, camera, width, height, pixelRatio }: FrameInfo) {
    const dt = Math.min(delta, 1 / 20); // evita saltos quando a aba volta do segundo plano
    const u = this.material.uniforms;
    const calm = scene.reducedMotion ? 0.35 : 1;
    const g = this.object;

    u.uTime.value = time * (scene.reducedMotion ? 0.4 : 1);
    u.uPixelRatio.value = pixelRatio;
    u.uSize.value = width < 700 ? 2.9 : 2.4;
    if (this.introStart < 0) this.introStart = time;

    this.updateTheme(time);
    this.updatePose(time, dt, width / height, calm);

    // respiração: inspira mais devagar do que expira
    const phase = (time * 0.32) % 1;
    const breath = phase < 0.45 ? easeInOut(phase / 0.45) : 1 - easeInOut((phase - 0.45) / 0.55);
    u.uBreath.value = breath * 0.035;

    // ---------- para onde olhar ----------
    const pointer = scene.pointer;
    const pointerFresh = pointer.active && performance.now() / 1000 - pointer.lastMove < 3.5;
    this.ndc.set(pointer.x, pointer.y);
    this.ray.setFromCamera(this.ndc, camera);
    const hasTarget = pointerFresh && this.ray.ray.intersectPlane(this.plane, this.world) !== null;

    // a luz segue o cursor: o brilho "escorrega" pelo corpo
    const lx = hasTarget ? this.world.x * 0.9 : Math.sin(time * 0.2) * 3;
    const ly = hasTarget ? this.world.y * 0.9 + 1.5 : 2.5;
    this.light.set(damp(this.light.x, lx, 2, dt), damp(this.light.y, ly, 2, dt), 5);
    u.uLightPos.value.copy(this.light);

    // alvo no espaço do próprio camaleão
    this.inv.copy(g.matrixWorld).invert();
    if (hasTarget) this.local.copy(this.world).applyMatrix4(this.inv);

    this.updateHead(time, dt, hasTarget, calm);
    this.updateEyes(time, dt, hasTarget, calm);
  }

  // A cor nova corre pelo corpo como uma onda, do focinho até a cauda.
  private updateTheme(time: number) {
    const u = this.material.uniforms;
    if (scene.themeIndex !== this.shownTheme) {
      for (const [a, b] of [["uBaseA", "uBaseB"], ["uPatA", "uPatB"], ["uGlowA", "uGlowB"]] as const) {
        u[a].value.copy(u[b].value);
      }
      const next = themes[scene.themeIndex];
      u.uBaseB.value.set(next.base);
      u.uPatB.value.set(next.pattern);
      u.uGlowB.value.set(next.glow);
      this.shownTheme = scene.themeIndex;
      this.waveStart = time;
    }
    const wave = (time - this.waveStart) / (scene.reducedMotion ? 0.6 : 1.8);
    u.uWave.value = wave >= 1 ? 2 : Math.max(0, wave);
  }

  // Coreografia da rolagem: posição, giro, tamanho, dispersão e pele.
  private updatePose(time: number, dt: number, aspect: number, calm: number) {
    const u = this.material.uniforms;
    const poses = getPoses(aspect);
    const lerp = THREE.MathUtils.lerp;
    const progress = THREE.MathUtils.clamp(scene.sceneProgress, 0, poses.length - 1);
    const i = Math.min(Math.floor(progress), poses.length - 2);
    // a pose "segura" no meio de cada seção e só muda nas transições
    const f = THREE.MathUtils.smoothstep(progress - i, 0.15, 0.85);
    const a = poses[i];
    const b = poses[i + 1];

    this.pos.set(
      damp(this.pos.x, lerp(a.x, b.x, f), 2.6, dt),
      damp(this.pos.y, lerp(a.y, b.y, f), 2.6, dt),
      damp(this.pos.z, lerp(a.z, b.z, f), 2.6, dt),
    );
    this.rotY = damp(this.rotY, lerp(a.rotY, b.rotY, f), 2.2, dt);
    this.scale = damp(this.scale, lerp(a.scale, b.scale, f), 2.6, dt);

    // na abertura o camaleão se forma a partir da poeira
    const intro = 1 - easeInOut(THREE.MathUtils.clamp((time - this.introStart - 0.2) / 2.4, 0, 1));
    const disperse = Math.max(lerp(a.disperse, b.disperse, f), intro);
    const current = u.uDisperse.value as number;
    u.uDisperse.value = intro > 0 ? disperse : damp(current, disperse, 3, dt);
    this.object.userData.disperse = u.uDisperse.value;

    const keys = ["x", "y", "z", "w"] as const;
    keys.forEach((key, k) => {
      this.pattern[key] = damp(this.pattern[key], lerp(a.pattern[k], b.pattern[k], f), 2, dt);
    });
    u.uPattern.value.copy(this.pattern);

    // balanço leve sobre o galho
    const sway = Math.sin(time * 0.8) * 0.025 * calm;
    this.object.position.set(this.pos.x, this.pos.y + Math.sin(time * 0.9) * 0.03 * calm, this.pos.z);
    this.object.rotation.set(sway * 0.4, this.rotY, sway);
    this.object.scale.setScalar(this.scale);
    this.object.updateMatrixWorld();
  }

  // De tempos em tempos (ou quando o cursor mexe rápido) ele vira a cabeça para você.
  private updateHead(time: number, dt: number, hasTarget: boolean, calm: number) {
    const speed = this.ndc.distanceTo(this.lastPointer) / Math.max(dt, 0.001);
    this.lastPointer.copy(this.ndc);
    if (hasTarget && (time > this.nextAttention || speed > 6)) {
      if (time > this.attentionUntil) this.attentionUntil = time + 2 + Math.random() * 2;
      this.nextAttention = time + 5 + Math.random() * 4;
    }
    const attentive = hasTarget && time < this.attentionUntil;

    // parado, a cabeça faz micro-movimentos que nunca se repetem igual
    let yaw = Math.sin(time * 0.37) * 0.08 + Math.sin(time * 0.91) * 0.03;
    let pitch = Math.sin(time * 0.29 + 1) * 0.05;
    if (attentive) {
      this.dir.copy(this.local).sub(EYE_MIDPOINT);
      yaw = THREE.MathUtils.clamp(Math.atan2(-this.dir.z, Math.max(this.dir.x, 0.4)), -0.65, 0.65);
      pitch = THREE.MathUtils.clamp(Math.atan2(this.dir.y, Math.hypot(this.dir.x, this.dir.z)), -0.35, 0.4);
    }
    const roll = Math.sin(time * 0.53) * 0.04;
    stepSpring(this.headYaw, yaw * calm, 26, 9, dt);
    stepSpring(this.headPitch, pitch * calm, 26, 9, dt);
    stepSpring(this.headRoll, roll * calm, 18, 7, dt);

    this.euler.set(this.headRoll.value, this.headYaw.value, this.headPitch.value, "YZX");
    this.headQuat.setFromEuler(this.euler);
    this.material.uniforms.uHeadRot.value.setFromMatrix4(this.mat4.makeRotationFromQuaternion(this.headQuat));
    this.headQuatInv.copy(this.headQuat).invert();
    if (hasTarget) {
      this.headLocal.copy(this.local).sub(ANATOMY.neck).applyQuaternion(this.headQuatInv).add(ANATOMY.neck);
    }
  }

  private updateEyes(time: number, dt: number, hasTarget: boolean, calm: number) {
    const u = this.material.uniforms;
    const pairs = [
      [this.eyeL, u.uEyeRotL, "x", this.eyeR],
      [this.eyeR, u.uEyeRotR, "y", this.eyeL],
    ] as const;

    for (const [eye, uniform, blinkKey, other] of pairs) {
      if (hasTarget) {
        this.dir.copy(this.headLocal).sub(eye.center).normalize();
      } else {
        // sem cursor: cada olho passeia sozinho, em saltos rápidos (sacadas)
        if (time > eye.nextSaccade) {
          this.jitter.set((Math.random() - 0.3) * 1.4, (Math.random() - 0.5) * 1.1, (Math.random() - 0.5) * 0.9);
          eye.idleDir.copy(eye.rest).add(this.jitter).normalize();
          eye.nextSaccade = time + 0.6 + Math.random() * 2.2;
        }
        this.dir.copy(eye.idleDir);
      }
      // limita o ângulo: o olho gira muito, mas não dá a volta completa
      const angle = eye.rest.angleTo(this.dir);
      if (angle > MAX_EYE_ANGLE) {
        this.dir.lerpVectors(eye.rest, this.dir, MAX_EYE_ANGLE / angle).normalize();
      }
      eye.target.setFromUnitVectors(eye.rest, this.dir);
      // movimento rápido e decidido, como nos olhos reais
      eye.quat.slerp(eye.target, 1 - Math.exp(-(hasTarget ? 14 : 20) * dt * calm));
      uniform.value.setFromMatrix4(this.mat4.makeRotationFromQuaternion(eye.quat));

      // piscadas: às vezes juntas, às vezes um olho só
      if (time > eye.nextBlink) {
        eye.blinkStart = time;
        eye.nextBlink = time + 2.5 + Math.random() * 4.5;
        if (Math.random() < 0.55) {
          other.blinkStart = time + 0.03;
          other.nextBlink = Math.max(other.nextBlink, time + 1.5);
        }
      }
      u.uBlink.value[blinkKey] = eye.blinkAmount(time);
    }
  }
}
