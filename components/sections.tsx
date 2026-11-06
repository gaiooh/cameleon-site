import { ThemePicker } from "@/components/theme-picker";
import { ButtonLink } from "@/components/ui/button";
import { contact, whatsappUrl } from "@/lib/contact";

// Cada seção tem data-scene: é isso que diz ao camaleão em que "cena" estamos.
// O texto fica sempre do lado oposto ao camaleão (ver components/three/choreography.ts).
// No celular, o camaleão fica em cima e o texto vai para a metade de baixo.

const sectionBase = "relative flex min-h-svh items-end px-5 pb-16 sm:px-8 md:items-center md:pb-0";

// Em telas em pé, textos longos ganham um painel de vidro para continuarem
// legíveis quando passam por cima do camaleão.
const readablePanel = "portrait:glass-dense portrait:rounded-3xl portrait:p-6";

export function Hero() {
  return (
    <section id="inicio" data-scene aria-labelledby="hero-title" className={`${sectionBase} pt-28`}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.3rem,6.4vw,5.6rem)] leading-[0.95] font-light tracking-[-0.04em] [font-stretch:88%]"
          >
            Sua marca, viva em cada lugar onde aparece.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-dim">
            A Cameleon cria a identidade visual da sua empresa e adapta ela ao site, às redes
            sociais e ao Google Maps. Muda a cor, nunca a essência.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Pedir um orçamento
            </ButtonLink>
            <ButtonLink href="#servicos" variant="ghost">
              Conhecer os serviços
            </ButtonLink>
          </div>
          <ThemePicker className="mt-12" />
        </div>
      </div>
      <div aria-hidden className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-xs text-dim md:flex">
        Role para explorar
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-text/60 to-transparent" />
      </div>
    </section>
  );
}

export function Manifesto() {
  return (
    <section data-scene aria-label="Manifesto" className="relative flex min-h-[130svh] items-center px-5 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-display text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.08] font-light tracking-[-0.025em]">
          Hoje, sua empresa está espalhada por dezenas de lugares.
        </p>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-dim sm:text-xl">
          Em cada um, ela parece um pouco diferente. O cliente não reconhece a marca e segue em
          frente. A Cameleon junta as peças e dá a ela uma só identidade.
        </p>
      </div>
    </section>
  );
}

const services = [
  {
    id: "site",
    title: "Site profissional",
    text: "Rápido, bonito no celular e fácil de achar no Google. Mostra quem você é e leva o cliente direto para o WhatsApp ou para o agendamento.",
    items: ["Design feito para o seu negócio", "Pensado primeiro para o celular", "Textos para quem ainda não conhece você"],
  },
  {
    id: "redes",
    title: "Redes sociais repaginadas",
    text: "Seu Instagram ganha cara de marca: foto de perfil, bio, destaques e modelos de post que deixam o feed reconhecível de longe.",
    items: ["Bio e destaques reorganizados", "Modelos de post e stories editáveis", "Cores e fontes iguais às do site"],
  },
  {
    id: "maps",
    title: "Perfil completo no Google Maps",
    text: "Quando alguém procura “perto de mim”, seu perfil aparece completo: horários certos, fotos boas, categoria correta e avaliações respondidas.",
    items: ["Informações conferidas e atualizadas", "Fotos e capa no padrão da marca", "Orientação para conseguir mais avaliações"],
  },
];

export function Services() {
  return (
    <div id="servicos">
      {services.map((service, index) => (
        <section key={service.id} data-scene aria-labelledby={`${service.id}-title`} className={sectionBase}>
          <div className="mx-auto flex w-full max-w-7xl md:justify-end">
            <article className="glass w-full max-w-md rounded-3xl p-7 sm:p-9">
              {index === 0 && <p className="mb-6 text-sm text-dim">O que a Cameleon faz</p>}
              <h2
                id={`${service.id}-title`}
                className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.02] font-normal tracking-[-0.025em]"
              >
                {service.title}
              </h2>
              <p className="mt-4 leading-relaxed text-dim">{service.text}</p>
              <ul className="mt-6 space-y-2.5 border-t border-hairline pt-6">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.95rem]">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      ))}
    </div>
  );
}

// Aqui a numeração faz sentido: as etapas acontecem nessa ordem.
const steps = [
  {
    title: "Reunião de alinhamento",
    text: "Conversamos sobre os objetivos da sua empresa e os valores que ela quer transmitir. É daqui que sai a direção de todo o projeto.",
  },
  { title: "Diagnóstico", text: "Estudo o negócio, o público e quem são os concorrentes na sua região." },
  { title: "Adaptação", text: "Defino cores, fontes e o jeito de falar que combinam com a sua empresa." },
  { title: "Criação", text: "Monto o site, repagino as redes e completo o perfil no Google Maps." },
  { title: "Acompanhamento", text: "Nos primeiros 30 dias, ajusto o que for preciso e ensino a manter tudo em dia." },
];

export function Process() {
  return (
    <section id="processo" data-scene aria-labelledby="processo-title" className={sectionBase}>
      <div className="mx-auto w-full max-w-7xl">
        <div className={`max-w-lg ${readablePanel}`}>
          <h2
            id="processo-title"
            className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none font-light tracking-[-0.03em]"
          >
            Como funciona
          </h2>
          <ol className="mt-10 space-y-7">
            {steps.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4">
                <span className="pt-0.5 font-display text-sm text-accent tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-dim">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// Princípios, não etapas: por isso não levam número.
const principles = [
  {
    title: "Primeiro o resultado, depois o enfeite.",
    text: "Cada tela leva o visitante a uma ação clara: chamar no WhatsApp, pedir orçamento ou agendar.",
  },
  {
    title: "Identidade que gera confiança.",
    text: "Uma marca igual em todo lugar passa profissionalismo. E cliente confiante decide mais rápido.",
  },
  {
    title: "Decisões guiadas por dados.",
    text: "Acompanho cliques, mensagens e buscas no Google para ajustar o que converte e cortar o que não converte.",
  },
];

export function About() {
  return (
    <section id="sobre" data-scene aria-labelledby="sobre-title" className={`${sectionBase} md:py-24`}>
      <div className="mx-auto flex w-full max-w-7xl md:justify-end">
        <div className={`max-w-xl ${readablePanel}`}>
          <p className="text-sm text-dim">Quem está por trás da Cameleon</p>
          <h2
            id="sobre-title"
            className="mt-4 font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] font-light tracking-[-0.035em]"
          >
            Prazer, eu sou o Gabriel.
          </h2>
          <p className="mt-6 text-xl leading-snug sm:text-2xl">
            Desenvolvedor especialista em conversão. Renovo a identidade da sua marca para que ela
            seja lembrada, e escolhida.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-dim">
            Design bonito que não traz cliente é só decoração. Da cor do botão ao texto do seu
            perfil no Google, cada decisão tem um objetivo: transformar quem passa pela sua marca em
            contato, orçamento e venda.
          </p>

          <ul className="mt-10 space-y-6 border-l border-hairline pl-6">
            {principles.map((principle) => (
              <li key={principle.title} className="relative">
                <span
                  aria-hidden
                  className="absolute top-2 -left-[1.6rem] size-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]"
                />
                <h3 className="text-lg font-medium">{principle.title}</h3>
                <p className="mt-1 leading-relaxed text-dim">{principle.text}</p>
              </li>
            ))}
          </ul>

          <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-10">
            Quero converter mais clientes
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section
      id="contato"
      data-scene
      aria-labelledby="contato-title"
      className="relative flex min-h-svh items-end px-5 pb-24 sm:px-8"
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <h2
          id="contato-title"
          className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.95] font-light tracking-[-0.04em]"
        >
          Pronto para mudar de cor?
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-dim">
          Conte o que sua empresa faz e onde ela aparece hoje. Respondo em até um dia útil com uma
          proposta.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Conversar no WhatsApp
          </ButtonLink>
          <ButtonLink href={`mailto:${contact.email}`} variant="ghost">
            Enviar um e-mail
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
