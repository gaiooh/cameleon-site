import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollDirector } from "@/components/scroll-director";
import { Contact, Hero, Manifesto, Process, Services } from "@/components/sections";
import { SceneCanvas } from "@/components/three/scene-canvas";

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-text focus:px-4 focus:py-2 focus:text-void"
      >
        Pular para o conteúdo
      </a>
      {/* camaleão 3D: fica fixo atrás de todo o conteúdo */}
      <SceneCanvas />
      <ScrollDirector />
      <Header />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
