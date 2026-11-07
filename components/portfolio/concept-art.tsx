import type { Project } from "@/lib/projects";

// Ilustrações "conceito": mini-sites desenhados com HTML e CSS nas cores de cada
// projeto. Tudo é medido em "cqw" (porcentagem da largura do container), então a
// ilustração encolhe e cresce por inteiro, como se fosse uma imagem.

type ArtProps = { project: Project };

const mix = (color: string, amount: number, base: string) =>
  `color-mix(in oklab, ${color} ${amount}%, ${base})`;

// Ilustração abstrata que faz o papel de "foto" dentro do mini-site.
function Artwork({ project, className = "" }: ArtProps & { className?: string }) {
  const { accent, surface, background } = project.palette;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `radial-gradient(circle at 30% 25%, ${mix(accent, 70, surface)}, ${accent} 55%, ${mix(accent, 60, "#000")})` }}
    >
      <div className="absolute inset-[22%] rounded-full border-[0.5cqw] opacity-60" style={{ borderColor: surface }} />
      <div className="absolute right-[12%] bottom-[14%] size-[34%] rounded-full" style={{ background: mix(surface, 85, background) }} />
      <div className="absolute top-[14%] left-[16%] size-[14%] rounded-full opacity-80" style={{ background: surface }} />
    </div>
  );
}

const Line = ({ width, color }: { width: string; color: string }) => (
  <div className="h-[0.9cqw] rounded-full" style={{ width, background: color }} />
);

// Precisa estar dentro de um elemento @container (a "janela"), para medir por ela.
function BrowserBar({ project }: ArtProps) {
  return (
    <div className="flex items-center gap-[1.4cqw] bg-[#1b1a20] px-[2cqw] py-[1.4cqw]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-[1.3cqw] rounded-full bg-white/20" />
      ))}
      <span className="ml-[1.5cqw] flex-1 truncate rounded-full bg-white/10 px-[2cqw] py-[0.5cqw] text-[1.5cqw] text-white/50">
        {project.slug}.com.br
      </span>
    </div>
  );
}

// Página do site em tamanho desktop. "long" acrescenta as seções de baixo.
function MiniSite({ project, long = false, startAtMenu = false }: ArtProps & { long?: boolean; startAtMenu?: boolean }) {
  const { palette: p, copy } = project;
  const muted = mix(p.ink, 18, p.background);

  const hero = (
    <div key="hero" className="grid grid-cols-[1.15fr_1fr] items-center gap-[4cqw] px-[5cqw] pt-[3cqw] pb-[6cqw]">
      <div>
        <div className="text-[1.6cqw] font-semibold" style={{ color: p.accent }}>
          {project.segment}
        </div>
        <div className="mt-[1.2cqw] font-display text-[5.6cqw] leading-[0.95] font-bold tracking-[-0.03em]">
          {copy.headline}
        </div>
        <div className="mt-[2.6cqw] space-y-[1cqw]">
          <Line width="92%" color={muted} />
          <Line width="70%" color={muted} />
        </div>
        <span
          className="mt-[3cqw] inline-block rounded-full px-[2.6cqw] py-[1.3cqw] text-[1.6cqw] font-semibold"
          style={{ background: p.ink, color: p.background }}
        >
          {copy.cta}
        </span>
      </div>
      <Artwork project={project} className="aspect-square rounded-full" />
    </div>
  );

  const menu = (
    <div key="menu" className="px-[5cqw] pt-[3cqw] pb-[6cqw]">
      <div className="font-display text-[3.6cqw] font-bold tracking-[-0.02em]">O que oferecemos</div>
      <div className="mt-[3cqw] grid grid-cols-3 gap-[2.4cqw]">
        {copy.items.map((item, i) => (
          <div key={item} className="rounded-[1.6cqw] p-[1.6cqw]" style={{ background: i === 1 ? p.accent : p.surface }}>
            <Artwork project={project} className="aspect-[4/3] rounded-[1.2cqw]" />
            <div className="mt-[1.4cqw] text-[1.6cqw] leading-tight font-semibold" style={{ color: i === 1 ? p.surface : p.ink }}>
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const band = (
    <div key="band" className="mx-[5cqw] mb-[6cqw] rounded-[2cqw] px-[4cqw] py-[4cqw]" style={{ background: p.ink, color: p.background }}>
      <div className="font-display text-[3.4cqw] leading-none font-bold">Vamos conversar?</div>
      <div className="mt-[1.8cqw] w-1/2 space-y-[1cqw]">
        <Line width="100%" color={mix(p.background, 30, p.ink)} />
        <Line width="65%" color={mix(p.background, 30, p.ink)} />
      </div>
    </div>
  );

  const sections = long ? (startAtMenu ? [menu, band, hero] : [hero, menu, band]) : [hero];

  return (
    <div className="@container w-full" style={{ background: p.background, color: p.ink }}>
      <div className="flex items-center justify-between px-[5cqw] py-[2.8cqw] text-[1.5cqw]">
        <span className="text-[2cqw] font-bold tracking-tight">{project.name}</span>
        <span className="flex gap-[2.6cqw] opacity-60">
          <span>Início</span>
          <span>Serviços</span>
          <span>Contato</span>
        </span>
        <span className="rounded-full px-[1.8cqw] py-[0.8cqw] font-semibold" style={{ background: p.accent, color: p.surface }}>
          {copy.cta}
        </span>
      </div>
      {sections}
    </div>
  );
}

// Versão celular do mesmo site.
function MiniPhone({ project }: ArtProps) {
  const { palette: p, copy } = project;
  const muted = mix(p.ink, 18, p.background);
  return (
    <div className="overflow-hidden rounded-[2.4cqw] border-[0.7cqw] border-[#0c0b10] shadow-[0_3cqw_6cqw_-1cqw_rgba(0,0,0,0.6)]">
      <div className="@container" style={{ background: p.background, color: p.ink }}>
        <div className="flex items-center justify-between px-[7cqw] pt-[8cqw] pb-[5cqw]">
          <span className="text-[6cqw] font-bold tracking-tight">{project.name.split(" ")[0]}</span>
          <span className="space-y-[1.6cqw]">
            <span className="block h-[1cqw] w-[7cqw] rounded-full" style={{ background: p.ink }} />
            <span className="block h-[1cqw] w-[7cqw] rounded-full" style={{ background: p.ink }} />
          </span>
        </div>
        <div className="px-[7cqw]">
          <div className="text-[4.5cqw] font-semibold" style={{ color: p.accent }}>
            {project.segment}
          </div>
          <div className="mt-[2cqw] font-display text-[11cqw] leading-[0.95] font-bold tracking-[-0.03em]">{copy.headline}</div>
          <div className="mt-[5cqw] space-y-[2.4cqw]">
            <Line width="95%" color={muted} />
            <Line width="70%" color={muted} />
          </div>
          <span
            className="mt-[6cqw] block rounded-full py-[3.6cqw] text-center text-[4.5cqw] font-semibold"
            style={{ background: p.ink, color: p.background }}
          >
            {copy.cta}
          </span>
          <Artwork project={project} className="mx-auto mt-[8cqw] aspect-square w-[80%] rounded-full" />
          <div className="mt-[8cqw] space-y-[3cqw] pb-[10cqw]">
            {copy.items.map((item) => (
              <div key={item} className="flex items-center gap-[4cqw] rounded-[4cqw] p-[3cqw]" style={{ background: p.surface }}>
                <Artwork project={project} className="size-[14cqw] shrink-0 rounded-[3cqw]" />
                <span className="text-[4.5cqw] leading-tight font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fundo escuro com um brilho na cor do projeto, como uma vitrine.
const stage = (accent: string) => ({
  background: `radial-gradient(120% 90% at 50% 110%, ${mix(accent, 32, "#0a0910")}, #09080d 62%)`,
});

function Showcase({ project }: ArtProps) {
  return (
    <div className="@container relative aspect-[16/10] overflow-hidden" style={stage(project.palette.accent)}>
      <div className="@container absolute top-[7%] left-[5%] w-[43%] overflow-hidden rounded-[0.9cqw] shadow-[0_2cqw_5cqw_rgba(0,0,0,0.55)]">
        <BrowserBar project={project} />
        <MiniSite project={project} long />
      </div>
      <div className="@container absolute top-[17%] right-[5%] w-[43%] overflow-hidden rounded-[0.9cqw] shadow-[0_2cqw_5cqw_rgba(0,0,0,0.55)]">
        <BrowserBar project={project} />
        <MiniSite project={project} long startAtMenu />
      </div>
      <div className="absolute top-[24%] left-1/2 w-[19%] -translate-x-1/2">
        <MiniPhone project={project} />
      </div>
    </div>
  );
}

function SiteView({ project }: ArtProps) {
  return (
    <div className="@container relative aspect-[4/3] overflow-hidden" style={stage(project.palette.accent)}>
      <div className="@container absolute top-[9%] left-[8%] w-[84%] overflow-hidden rounded-[1cqw] shadow-[0_3cqw_6cqw_rgba(0,0,0,0.55)]">
        <BrowserBar project={project} />
        <MiniSite project={project} long />
      </div>
    </div>
  );
}

function SocialView({ project }: ArtProps) {
  const { palette: p, copy } = project;
  const tiles = Array.from({ length: 9 }, (_, i) => i);
  return (
    <div className="@container relative aspect-[4/3] overflow-hidden" style={stage(p.accent)}>
      {/* modelo de post solto ao lado do celular */}
      <div
        className="absolute top-[18%] left-[9%] flex aspect-square w-[30%] -rotate-6 flex-col justify-between rounded-[1.6cqw] p-[2.4cqw] shadow-[0_3cqw_6cqw_rgba(0,0,0,0.5)]"
        style={{ background: p.accent, color: p.surface }}
      >
        <span className="text-[1.6cqw] font-semibold opacity-80">{project.name}</span>
        <span className="font-display text-[3.4cqw] leading-[0.95] font-bold tracking-[-0.02em]">{copy.items[0]}</span>
      </div>
      <div className="absolute top-[8%] left-1/2 w-[34%] -translate-x-[10%] overflow-hidden rounded-[2.4cqw] border-[0.7cqw] border-[#0c0b10] shadow-[0_3cqw_6cqw_rgba(0,0,0,0.6)]">
        <div className="@container px-[5cqw] pt-[7cqw] pb-[4cqw]" style={{ background: p.background, color: p.ink }}>
          <div className="flex items-center gap-[4cqw]">
            <div
              className="grid size-[20cqw] place-items-center rounded-full text-[6cqw] font-bold"
              style={{ background: p.accent, color: p.surface, boxShadow: `0 0 0 1.4cqw ${p.background}, 0 0 0 2.4cqw ${p.accent}` }}
            >
              {project.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[5cqw] font-bold">@{project.slug.replace(/-/g, "")}</div>
              <div className="truncate text-[4cqw] opacity-60">{project.segment}</div>
            </div>
          </div>
          <div className="mt-[5cqw] flex gap-[3cqw]">
            {copy.items.map((item) => (
              <div key={item} className="flex flex-1 flex-col items-center gap-[1.5cqw]">
                <div className="size-[13cqw] rounded-full border-[0.8cqw]" style={{ borderColor: p.accent }} />
                <span className="w-full truncate text-center text-[3cqw] opacity-70">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-[5cqw] grid grid-cols-3 gap-[1cqw]">
            {tiles.map((i) => (
              <div
                key={i}
                className="grid aspect-square place-items-center"
                style={{ background: i % 4 === 0 ? p.accent : i % 2 === 0 ? p.surface : mix(p.accent, 22, p.surface) }}
              >
                <div
                  className={`size-[45%] ${i % 3 === 0 ? "rounded-full" : i % 3 === 1 ? "rounded-[2cqw] rotate-45" : "rounded-t-full"}`}
                  style={{ background: i % 4 === 0 ? p.surface : p.accent, opacity: 0.85 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MapsView({ project }: ArtProps) {
  const { palette: p } = project;
  return (
    <div className="@container relative aspect-[4/3] overflow-hidden" style={{ background: "#e4e8e1" }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        <rect x="250" y="20" width="120" height="80" rx="10" fill="#cfdfc6" />
        <rect x="30" y="200" width="90" height="70" rx="10" fill="#cfdfc6" />
        <path d="M-10 150 C90 120 160 180 260 140 S380 90 420 110" stroke="#fff" strokeWidth="18" fill="none" />
        <path d="M150 -10 L190 310" stroke="#fff" strokeWidth="12" />
        <path d="M320 -10 L280 310" stroke="#fff" strokeWidth="10" />
        <path d="M-10 60 L410 45" stroke="#fff" strokeWidth="7" />
        <path d="M-10 250 L410 235" stroke="#fff" strokeWidth="7" />
      </svg>
      <svg viewBox="0 0 24 32" className="absolute top-[30%] left-[58%] h-[13%] -translate-x-1/2 drop-shadow-lg">
        <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 32 12 32s12-11.5 12-20.3C24 5.2 18.6 0 12 0z" fill={p.accent} />
        <circle cx="12" cy="11.5" r="4.5" fill="#fff" />
      </svg>
      <div className="absolute bottom-[7%] left-[6%] w-[52%] rounded-[2cqw] bg-white p-[3cqw] text-[#1d1d1f] shadow-[0_2cqw_5cqw_rgba(0,0,0,0.25)]">
        <div className="aspect-[16/7] overflow-hidden rounded-[1.4cqw]">
          <Artwork project={project} className="size-full" />
        </div>
        <div className="mt-[2cqw] text-[3cqw] leading-tight font-bold">{project.name}</div>
        <div className="mt-[0.6cqw] text-[1.9cqw] text-[#5f6368]">{project.segment}</div>
        <div className="mt-[0.6cqw] text-[1.9cqw]">
          <span className="font-semibold text-[#188038]">Aberto agora</span>
          <span className="text-[#5f6368]">, horários atualizados</span>
        </div>
        <div className="mt-[2.4cqw] grid grid-cols-4 gap-[1.4cqw] text-center text-[1.6cqw] text-[#5f6368]">
          {["Rotas", "Ligar", "Site", "Salvar"].map((action, i) => (
            <div key={action} className="flex flex-col items-center gap-[0.8cqw]">
              <span className="size-[5cqw] rounded-full" style={{ background: i === 0 ? p.accent : mix(p.accent, 18, "#fff") }} />
              {action}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const views = { showcase: Showcase, site: SiteView, social: SocialView, maps: MapsView };

export function ConceptArt({ project, view }: ArtProps & { view: keyof typeof views }) {
  const View = views[view];
  return <View project={project} />;
}
