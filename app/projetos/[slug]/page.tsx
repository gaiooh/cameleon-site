import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { ServiceTags, StatusBadge } from "@/components/portfolio/portfolio-section";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { ButtonLink } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/contact";
import { getProject, projects } from "@/lib/projects";

// Gera uma página estática para cada projeto da lista, na hora do build.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const concept = project.status === "conceito" ? " (projeto conceito)" : "";
  return {
    title: `${project.name}${concept} — Cameleon`,
    description: project.summary,
  };
}

// As partes fixas (cabeçalho e rodapé) aparecem na hora. O conteúdo depende do
// endereço (qual projeto), por isso fica dentro de <Suspense> com um esqueleto
// de carregamento enquanto é preparado.
export default function ProjectPage({ params }: PageProps<"/projetos/[slug]">) {
  return (
    <div className="relative min-h-svh overflow-x-clip">
      <PageHeader backHref="/#projetos" backLabel="Todos os projetos" />

      <main className="px-5 sm:px-8">
        <Suspense fallback={<ProjectSkeleton />}>
          <ProjectContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando projeto" className="mx-auto max-w-7xl animate-pulse pt-16 pb-24">
      <div className="h-6 w-36 rounded-full bg-white/5" />
      <div className="mt-8 h-20 w-2/3 rounded-2xl bg-white/5" />
      <div className="mt-14 aspect-[16/10] rounded-2xl bg-white/5" />
    </div>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/projetos/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const [cover, ...gallery] = project.media;
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const isConcept = project.status === "conceito";

  const story = [
    { title: "O desafio", text: project.challenge },
    { title: "A solução", text: project.solution },
    { title: isConcept ? "Resultado esperado" : "Resultado", text: project.result },
  ];

  return (
    <>
      {/* brilho de fundo na cor do projeto, no lugar da cena 3D da página inicial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[50rem]"
        style={{
          background: `radial-gradient(80rem 40rem at 70% -10%, color-mix(in oklab, ${project.palette.accent} 22%, transparent), transparent 70%)`,
        }}
      />

        <article className="mx-auto max-w-7xl">
          <div className="grid gap-10 pt-10 pb-14 md:grid-cols-12 md:pt-16">
            <div className="md:col-span-7">
              <StatusBadge project={project} />
              <p className="mt-6 text-dim">{project.segment}</p>
              <h1 className="mt-2 font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.92] font-light tracking-[-0.045em] [font-stretch:88%]">
                {project.name}
              </h1>
            </div>
            <div className="flex flex-col justify-end gap-6 md:col-span-5">
              <p className="text-lg leading-relaxed text-dim">{project.summary}</p>
              <ServiceTags project={project} />
            </div>
          </div>

          <figure className="overflow-hidden rounded-2xl border border-hairline">
            <ProjectMedia project={project} media={cover} priority sizes="(min-width: 1280px) 1280px, 100vw" />
          </figure>
          {isConcept && (
            <p className="mt-4 text-sm text-dim">
              Este é um projeto conceito: a empresa e as imagens são demonstrativas e não representam um
              cliente real.
            </p>
          )}

          <div className="grid gap-12 py-20 md:grid-cols-3 md:gap-10 md:py-28">
            {story.map((block) => (
              <section key={block.title} aria-labelledby={`${block.title}-title`} className="border-t border-hairline pt-6">
                <h2 id={`${block.title}-title`} className="text-xl font-medium">
                  {block.title}
                </h2>
                <p className="mt-3 leading-relaxed text-dim">{block.text}</p>
              </section>
            ))}
          </div>

          {gallery.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2">
              {gallery.map((media, i) => (
                <figure key={i}>
                  <div className="overflow-hidden rounded-2xl border border-hairline">
                    <ProjectMedia project={project} media={media} sizes="(min-width: 768px) 50vw, 100vw" />
                  </div>
                  {media.caption && <figcaption className="mt-3 text-sm text-dim">{media.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          <div className="glass mt-24 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:p-10 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none font-light tracking-[-0.03em]">
                Quer um projeto assim para a sua empresa?
              </h2>
              <p className="mt-3 text-dim">Conte o que você faz e eu mostro como a sua marca pode converter mais.</p>
            </div>
            <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
              Conversar no WhatsApp
            </ButtonLink>
          </div>

          {next !== project && (
            <Link href={`/projetos/${next.slug}`} className="group mt-16 mb-24 flex items-end justify-between gap-6 border-t border-hairline pt-8">
              <span>
                <span className="text-sm text-dim">Próximo projeto</span>
                <span className="mt-2 block font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-none font-light tracking-[-0.03em] transition-colors group-hover:text-accent">
                  {next.name}
                </span>
              </span>
              <svg aria-hidden viewBox="0 0 20 20" className="mb-2 size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </article>
    </>
  );
}
