import Image from "next/image";
import { ConceptArt } from "@/components/portfolio/concept-art";
import type { Project, ProjectMedia as Media } from "@/lib/projects";

// Mostra uma imagem do projeto, seja foto real ou ilustração conceito.
// O texto alternativo descreve a imagem para quem usa leitor de tela.
export function ProjectMedia({
  project,
  media,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  priority = false,
}: {
  project: Project;
  media: Media;
  sizes?: string;
  priority?: boolean;
}) {
  if (media.kind === "photo") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full"
      />
    );
  }

  const label = `Ilustração conceito: ${media.caption ?? project.name}`;
  return (
    <div role="img" aria-label={label}>
      <div aria-hidden>
        <ConceptArt project={project} view={media.view} />
      </div>
    </div>
  );
}
