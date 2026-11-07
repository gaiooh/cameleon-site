// Portfólio da Cameleon.
// Para adicionar um projeto, copie um dos objetos abaixo, troque os dados e salve.
// A seção "Projetos selecionados" e a página /projetos/[slug] são geradas sozinhas.

export type Service = "identidade" | "site" | "redes" | "maps";

export const serviceLabels: Record<Service, string> = {
  identidade: "Identidade visual",
  site: "Site profissional",
  redes: "Redes sociais",
  maps: "Google Maps",
};

// Imagens de um projeto:
// - "photo": um arquivo de imagem real (coloque em public/projetos/<slug>/)
// - "concept": uma ilustração gerada pelo próprio site com as cores do projeto,
//   usada enquanto não há imagens reais.
export type ProjectMedia =
  | { kind: "photo"; src: string; alt: string; width: number; height: number; caption?: string }
  | { kind: "concept"; view: "showcase" | "site" | "social" | "maps"; caption?: string };

export type Project = {
  slug: string; // parte final do endereço: /projetos/<slug>
  name: string;
  segment: string;
  /** "conceito" = demonstrativo, sem cliente real. "real" = trabalho entregue. */
  status: "conceito" | "real";
  summary: string; // uma frase, aparece no card
  services: Service[];
  palette: {
    background: string; // fundo do site do projeto
    surface: string; // cartões e áreas claras
    ink: string; // texto
    accent: string; // cor de destaque
  };
  /** Frases que aparecem nas ilustrações conceito (títulos do site fictício). */
  copy: { headline: string; cta: string; items: [string, string, string] };
  challenge: string;
  solution: string;
  /** Em projetos conceito, descreva o resultado ESPERADO, nunca números inventados. */
  result: string;
  media: ProjectMedia[]; // a primeira imagem é a capa do card
};

export const projects: Project[] = [
  {
    slug: "padaria-trigo-bom",
    name: "Padaria Trigo Bom",
    segment: "Padaria de bairro",
    status: "conceito",
    summary: "Uma padaria tradicional que precisava ser encontrada por quem acabou de se mudar para o bairro.",
    services: ["identidade", "site", "maps"],
    palette: { background: "#f6efe3", surface: "#fffaf2", ink: "#2b1d0e", accent: "#d9861c" },
    copy: {
      headline: "Pão quente, todo dia, às 6h.",
      cta: "Ver cardápio",
      items: ["Pão de fermentação natural", "Café coado na hora", "Encomendas para festas"],
    },
    challenge:
      "Padarias de bairro dependem de quem passa na porta. Um morador novo, porém, procura no Google Maps antes de sair de casa, e um perfil sem fotos e com horário errado faz a padaria parecer fechada.",
    solution:
      "Uma identidade quente, com tons de trigo e um laranja de forno, aplicada em um site de uma página com cardápio e encomendas pelo WhatsApp, e em um perfil completo no Google Maps com fotos, horários e categoria corretos.",
    result:
      "Projeto conceito, sem resultados medidos. O objetivo é que a padaria apareça completa nas buscas por “padaria perto de mim” e que as encomendas cheguem direto pelo WhatsApp.",
    media: [
      { kind: "concept", view: "showcase", caption: "Site em desktop e celular com a nova identidade" },
      { kind: "concept", view: "site", caption: "Página inicial com cardápio e encomendas" },
      { kind: "concept", view: "maps", caption: "Perfil no Google Maps com fotos e horários" },
    ],
  },
  {
    slug: "clinica-respira",
    name: "Clínica Respira",
    segment: "Clínica de fisioterapia respiratória",
    status: "conceito",
    summary: "Uma clínica que precisava transmitir calma e confiança antes da primeira consulta.",
    services: ["identidade", "site", "maps"],
    palette: { background: "#eaf4f2", surface: "#ffffff", ink: "#0f2e2b", accent: "#1f8f84" },
    copy: {
      headline: "Respirar melhor começa aqui.",
      cta: "Agendar avaliação",
      items: ["Fisioterapia respiratória", "Reabilitação pós-covid", "Atendimento infantil"],
    },
    challenge:
      "Quem procura uma clínica está preocupado e compara opções rapidamente. Sites frios e cheios de termos técnicos afastam o paciente antes mesmo do primeiro contato.",
    solution:
      "Uma identidade em verde-água, com bastante espaço em branco e textos simples. O site explica cada tratamento em linguagem clara e leva ao agendamento em dois toques.",
    result:
      "Projeto conceito, sem resultados medidos. O objetivo é reduzir as dúvidas do paciente antes da consulta e facilitar o agendamento pelo celular.",
    media: [
      { kind: "concept", view: "showcase", caption: "Site em desktop e celular com a nova identidade" },
      { kind: "concept", view: "site", caption: "Página de tratamentos com agendamento" },
      { kind: "concept", view: "social", caption: "Modelos de post educativos para o Instagram" },
    ],
  },
  {
    slug: "agulha-fina-tattoo",
    name: "Agulha Fina Tattoo",
    segment: "Estúdio de tatuagem",
    status: "conceito",
    summary: "Um estúdio com trabalho autoral que precisava de um Instagram à altura da própria arte.",
    services: ["identidade", "redes", "site"],
    palette: { background: "#121012", surface: "#1d1a1d", ink: "#f3ece6", accent: "#d63c6b" },
    copy: {
      headline: "Arte que fica na pele.",
      cta: "Ver portfólio",
      items: ["Fine line", "Blackwork", "Projetos autorais"],
    },
    challenge:
      "No Instagram, o trabalho do estúdio se misturava a fotos sem padrão e stories sem identidade. O cliente ideal não conseguia entender o estilo do estúdio de relance.",
    solution:
      "Uma identidade escura e contrastante, com um magenta de destaque. Criamos modelos de post e destaques organizados por estilo, e um site-portfólio para quem quer ver os trabalhos com calma.",
    result:
      "Projeto conceito, sem resultados medidos. O objetivo é que o feed comunique o estilo do estúdio em poucos segundos e leve os orçamentos para um único canal.",
    media: [
      { kind: "concept", view: "showcase", caption: "Site-portfólio em desktop e celular" },
      { kind: "concept", view: "social", caption: "Feed organizado com modelos de post" },
      { kind: "concept", view: "site", caption: "Página de estilos e orçamento" },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
