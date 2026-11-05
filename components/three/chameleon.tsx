"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { ChameleonController } from "@/components/three/chameleon-controller";

// Ponte entre o React e o controlador: cria o camaleão ao montar,
// atualiza a cada quadro e libera a memória da placa de vídeo ao sair.
export function Chameleon({ particles }: { particles: number }) {
  const group = useRef<THREE.Group>(null);
  const controller = useRef<ChameleonController | null>(null);

  useEffect(() => {
    const c = new ChameleonController(particles);
    group.current?.add(c.object);
    controller.current = c;
    return () => {
      c.object.removeFromParent();
      c.dispose();
      controller.current = null;
    };
  }, [particles]);

  useFrame(({ clock, camera, size, gl }, delta) => {
    controller.current?.update({
      time: clock.elapsedTime,
      delta,
      camera,
      width: size.width,
      height: size.height,
      pixelRatio: gl.getPixelRatio(),
    });
  });

  return <group ref={group} />;
}
