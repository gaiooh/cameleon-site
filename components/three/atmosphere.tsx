"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp } from "@/components/three/chameleon-controller";
import { scene } from "@/lib/scene-store";
import { themes } from "@/lib/themes";

// Poeira luminosa flutuando em várias profundidades: dá a sensação de espaço.
const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uScroll;
  attribute vec3 aSeed;
  varying float vAlpha;
  varying float vMix;

  void main() {
    vec3 p = position;
    // sobe devagar e reaparece embaixo; a rolagem empurra um pouco (paralaxe)
    p.y = mod(p.y + uTime * (0.05 + aSeed.x * 0.08) + uScroll * (0.3 + aSeed.y * 0.6) + 7.0, 14.0) - 7.0;
    p.x += sin(uTime * 0.2 + aSeed.z * 20.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + aSeed.y * 2.6) * uPixelRatio * (8.0 / -mv.z);
    vAlpha = (0.25 + 0.55 * aSeed.z) * (0.6 + 0.4 * sin(uTime * (0.8 + aSeed.x * 2.0) + aSeed.y * 30.0));
    vMix = aSeed.x;
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = pow(1.0 - r * 2.0, 2.0) * vAlpha;
    gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a);
  }
`;

// Brilho volumétrico atrás do camaleão: um disco de luz suave.
const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    float r = length(c);
    float glow = exp(-r * r * 14.0) * smoothstep(0.5, 0.25, r); // chega a zero antes da borda do quadrado
    vec3 col = mix(uColorA, uColorB, smoothstep(0.05, 0.4, r));
    gl_FragColor = vec4(col, glow * uStrength);
  }
`;

class AtmosphereController {
  readonly object = new THREE.Group();
  private dustGeometry = new THREE.BufferGeometry();
  private dust: THREE.ShaderMaterial;
  private halo: THREE.ShaderMaterial;
  private haloMesh: THREE.Mesh;
  private targetA = new THREE.Color();
  private targetB = new THREE.Color();

  constructor(dustCount: number) {
    const positions = new Float32Array(dustCount * 3);
    const seeds = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      positions.set([(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 14, -9 + Math.random() * 11], i * 3);
      seeds.set([Math.random(), Math.random(), Math.random()], i * 3);
    }
    this.dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.dustGeometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));

    const theme = themes[scene.themeIndex];
    const colors = () => ({
      uColorA: { value: new THREE.Color(theme.base) },
      uColorB: { value: new THREE.Color(theme.pattern) },
    });
    const shared = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };

    this.dust = new THREE.ShaderMaterial({
      ...shared,
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uScroll: { value: 0 }, ...colors() },
    });
    this.halo = new THREE.ShaderMaterial({
      ...shared,
      vertexShader: haloVertex,
      fragmentShader: haloFragment,
      uniforms: { uTime: { value: 0 }, uStrength: { value: 0.3 }, ...colors() },
    });

    const dustPoints = new THREE.Points(this.dustGeometry, this.dust);
    dustPoints.frustumCulled = false;
    this.haloMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.halo);
    this.haloMesh.position.set(1.6, 0, -2);
    this.haloMesh.scale.setScalar(7.5);
    this.object.add(dustPoints, this.haloMesh);
  }

  update(time: number, delta: number, pixelRatio: number, chameleon: THREE.Object3D | undefined) {
    const dt = Math.min(delta, 1 / 20);
    const t = time * (scene.reducedMotion ? 0.4 : 1);
    const theme = themes[scene.themeIndex];
    this.targetA.set(theme.base);
    this.targetB.set(theme.pattern);
    const k = 1 - Math.exp(-1.5 * dt);
    for (const material of [this.dust, this.halo]) {
      material.uniforms.uColorA.value.lerp(this.targetA, k);
      material.uniforms.uColorB.value.lerp(this.targetB, k);
      material.uniforms.uTime.value = t;
    }
    this.dust.uniforms.uPixelRatio.value = pixelRatio;
    this.dust.uniforms.uScroll.value = scene.sceneProgress;

    // o halo acompanha o camaleão pela tela, sempre de frente para a câmera
    if (chameleon) {
      const mesh = this.haloMesh;
      mesh.position.x = damp(mesh.position.x, chameleon.position.x, 3, dt);
      mesh.position.y = damp(mesh.position.y, chameleon.position.y + 0.1, 3, dt);
      mesh.scale.setScalar(damp(mesh.scale.x, chameleon.scale.x * 7.5, 3, dt));
      const dispersed = (chameleon.userData.disperse as number | undefined) ?? 0;
      const opacity = (chameleon.userData.opacity as number | undefined) ?? 1;
      this.halo.uniforms.uStrength.value = 0.3 * (1 - dispersed * 0.6) * opacity;
    }
  }

  dispose() {
    this.dustGeometry.dispose();
    this.haloMesh.geometry.dispose();
    this.dust.dispose();
    this.halo.dispose();
  }
}

export function Atmosphere({ dustCount }: { dustCount: number }) {
  const group = useRef<THREE.Group>(null);
  const controller = useRef<AtmosphereController | null>(null);

  useEffect(() => {
    const c = new AtmosphereController(dustCount);
    group.current?.add(c.object);
    controller.current = c;
    return () => {
      c.object.removeFromParent();
      c.dispose();
      controller.current = null;
    };
  }, [dustCount]);

  useFrame(({ clock, gl, scene: root }, delta) => {
    controller.current?.update(clock.elapsedTime, delta, gl.getPixelRatio(), root.getObjectByName("chameleon"));
  });

  return <group ref={group} />;
}
