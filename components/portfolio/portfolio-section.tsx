import Link from "next/link";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { projects, serviceLabels, type Project } from "@/lib/projects";

export function StatusBadge({ project }: { project: Project }) {
  if (project.status === "real") return null;
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-text">
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      Projeto conceito
    </span>
  );
}

export function ServiceTags({ project }: { project: Project }) {
  return (
    <ul aria-label="Serviços realizados" className="flex flex-wrap gap-2">
      {project.services.map((service) => (
        <li key={service} className="rounded-full border border-hairline px-3 py-1 text-xs text-dim">
          {serviceLabels[service]}
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ project, featured }: { project: Project; featured: boolean }) {
  return (
    <Link href={`/projetos/${project.slug}`} className="group block rounded-3xl focus-visible:outline-offset-8">
      <div className="relative overflow-hidden rounded-2xl border border-hairline bg-void transition-[border-color,box-shadow] duration-500 group-hover:border-text/25 group-hover:shadow-[0_30px_80px_-30px_var(--accent)]">
        {/* zoom lento da imagem: a única animação do card */}
        <div className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <ProjectMedia
            project={project}
            media={project.media[0]}
            sizes={featured ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          />
        </div>
      </div>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <StatusBadge project={project} />
          <h3 className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-normal tracking-[-0.02em]">
            {project.name}
          </h3>
          <p className="mt-1 text-dim">{project.segment}</p>
        </div>
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full border border-hairline transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
        >
          <svg viewBox="0 0 20 20" className="size-4 transition-transform duration-300 group-hover:-rotate-45">
            <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <p className="mt-3 max-w-xl leading-relaxed text-dim">{project.summary}</p>
      <div className="mt-5">
        <ServiceTags project={project} />
      </div>
    </Link>
  );
}

// Ritmo do grid: um projeto em destaque (largura total) e depois dois lado a lado,
// com o segundo um pouco mais baixo. O padrão se repete com novos projetos.
const layout = ["md:col-span-12", "md:col-span-7", "md:col-span-5 md:mt-32"];

export function Portfolio() {
  return (
    <section id="projetos" data-scene aria-labelledby="projetos-title" className="relative px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2
            id="projetos-title"
            className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none font-light tracking-[-0.03em]"
          >
            Projetos selecionados
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-dim">
            Exemplos de como a Cameleon adapta uma marca ao site, às redes e ao Google Maps.
          </p>
          <p className="mt-3 text-sm text-dim/80">
            Os projetos abaixo são conceitos demonstrativos, criados para mostrar o processo. Não
            representam clientes reais.
          </p>
        </div>

        <ul className="mt-16 grid gap-x-10 gap-y-20 md:grid-cols-12">
          {projects.map((project, index) => (
            <li key={project.slug} className={layout[index % layout.length]}>
              <ProjectCard project={project} featured={index % layout.length === 0} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
