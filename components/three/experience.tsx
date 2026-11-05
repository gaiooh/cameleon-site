"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { Atmosphere } from "@/components/three/atmosphere";
import { Chameleon } from "@/components/three/chameleon";
import { scene } from "@/lib/scene-store";

// A câmera acompanha o cursor bem de leve: dá profundidade (paralaxe).
function CameraRig() {
  const look = useRef(new THREE.Vector3());
  useFrame(({ camera }, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const k = 1 - Math.exp(-1.6 * dt);
    const strength = scene.reducedMotion ? 0 : 1;
    camera.position.x += (scene.pointer.x * 0.35 * strength - camera.position.x) * k;
    camera.position.y += (scene.pointer.y * 0.22 * strength - camera.position.y) * k;
    camera.lookAt(look.current);
  });
  return null;
}

export default function Experience() {
  // Celulares recebem menos partículas para manter a fluidez.
  const isSmall = typeof window !== "undefined" && window.innerWidth < 768;
  const particles = isSmall ? 22000 : 46000;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 35, near: 0.1, far: 50 }}
      dpr={[1, isSmall ? 1.5 : 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
    >
      <color attach="background" args={["#030307"]} />
      <CameraRig />
      <Atmosphere dustCount={isSmall ? 700 : 1800} />
      <Chameleon particles={particles} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.05} luminanceThreshold={0.12} luminanceSmoothing={0.3} radius={0.72} />
        <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
