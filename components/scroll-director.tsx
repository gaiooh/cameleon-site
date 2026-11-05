"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scene } from "@/lib/scene-store";

// Liga a página à cena 3D:
// - rolagem suave (Lenis), que deixa as transições do camaleão cinematográficas;
// - converte a posição da rolagem em "qual cena estamos" (sceneProgress);
// - registra a posição do cursor para os olhos do camaleão.
export function ScrollDirector() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene.reducedMotion = reduced;

    const sections = () => Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    let centers: number[] = [];
    const measure = () => {
      centers = sections().map((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2;
      });
    };

    const update = () => {
      if (centers.length === 0) return;
      const y = window.scrollY + window.innerHeight / 2;
      let progress = 0;
      if (y <= centers[0]) progress = 0;
      else if (y >= centers[centers.length - 1]) progress = centers.length - 1;
      else {
        const i = centers.findIndex((c, k) => y >= c && y < centers[k + 1]);
        progress = i + (y - centers[i]) / (centers[i + 1] - centers[i]);
      }
      scene.sceneProgress = progress;
    };

    measure();
    update();

    const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      update();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // links internos (#servicos) também rolam suavemente
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || !lenis) return;
      const target = document.querySelector(link.getAttribute("href")!);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -40, duration: 1.6 });
      history.replaceState(null, "", link.getAttribute("href"));
    };

    const onPointer = (event: PointerEvent) => {
      scene.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      scene.pointer.active = true;
      scene.pointer.lastMove = performance.now() / 1000;
    };

    const resize = new ResizeObserver(() => {
      measure();
      update();
    });
    resize.observe(document.body);

    document.addEventListener("click", onClick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      resize.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return null;
}
