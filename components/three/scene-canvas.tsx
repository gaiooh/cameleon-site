"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// O 3D só existe no navegador: carregamos sem renderização no servidor (ssr: false)
// e em um pacote separado, para o texto da página aparecer antes.
const Experience = dynamic(() => import("@/components/three/experience"), { ssr: false });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const noop = () => () => {};

export function SceneCanvas() {
  // false no servidor; no navegador, verifica se a placa de vídeo está disponível
  const webgl = useSyncExternalStore(noop, supportsWebGL, () => false);

  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      {webgl ? (
        <Experience />
      ) : (
        // sem WebGL: um brilho estático no lugar da cena
        <div className="size-full bg-[radial-gradient(circle_at_70%_45%,var(--glow-a),transparent_45%)] opacity-40" />
      )}
    </div>
  );
}
