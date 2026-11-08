import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { contact } from "@/lib/contact";
import { formatDate, privacy } from "@/lib/privacy";

export const metadata: Metadata = {
  title: "Política de Privacidade — Cameleon",
  description:
    "Como a Cameleon trata dados pessoais, de acordo com a LGPD: o que o site coleta (quase nada), o que acontece quando você entra em contato e como exercer seus direitos.",
};

// O texto foi escrito a partir do que o site realmente faz hoje:
// sem formulários, sem cookies, sem analytics e sem scripts de terceiros.
// Se algo disso mudar (ex.: adicionar Google Analytics ou um formulário),
// esta página PRECISA ser atualizada junto.

const highlights = [
  { label: "Formulários", value: "Nenhum", note: "O site não pede seus dados." },
  { label: "Cookies", value: "Nenhum", note: "Nem de rastreamento, nem de publicidade." },
  { label: "Analytics", value: "Nenhum", note: "Não medimos nem perfilamos visitas." },
];

const sections = [
  { id: "responsavel", title: "Quem é responsável", content: <Controller /> },
  { id: "site", title: "O que o site coleta", content: <SiteData /> },
  { id: "contato", title: "Quando você entra em contato", content: <ContactData /> },
  { id: "cookies", title: "Cookies e links externos", content: <Cookies /> },
  { id: "armazenamento", title: "Armazenamento e prazos", content: <Storage /> },
  { id: "compartilhamento", title: "Com quem os dados são compartilhados", content: <Sharing /> },
  { id: "direitos", title: "Seus direitos", content: <Rights /> },
  { id: "solicitacoes", title: "Como fazer uma solicitação", content: <Requests /> },
  { id: "alteracoes", title: "Mudanças nesta política", content: <Changes /> },
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-svh overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]"
        style={{
          background:
            "radial-gradient(70rem 32rem at 80% -10%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)",
        }}
      />
      <PageHeader backHref="/" backLabel="Voltar ao site" />

      <main className="px-5 sm:px-8">
        <div className="mx-auto max-w-7xl pt-10 pb-24 md:pt-16">
          <p className="text-sm text-accent">Política de Privacidade</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6.5vw,5.4rem)] leading-[0.95] font-light tracking-[-0.045em] [font-stretch:88%]">
            Seus dados, sem camuflagem.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dim">
            Esta página explica, em linguagem direta, como a Cameleon trata dados pessoais, seguindo a Lei
            Geral de Proteção de Dados (Lei nº 13.709/2018, a LGPD).
          </p>
          <p className="mt-4 text-sm text-dim">
            Última atualização: <time dateTime={privacy.updatedAt}>{formatDate(privacy.updatedAt)}</time>
          </p>

          <dl className="glass mt-12 grid rounded-3xl sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label} className="border-hairline p-6 not-last:border-b sm:not-last:border-r sm:not-last:border-b-0 sm:p-8">
                <dt className="text-sm text-dim">{item.label}</dt>
                <dd className="mt-2 font-display text-3xl font-light tracking-[-0.03em]">{item.value}</dd>
                <dd className="mt-1 text-sm text-dim">{item.note}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <nav aria-label="Seções da política" className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-sm text-dim">Nesta página</p>
                <ol className="mt-4 grid gap-1 text-sm">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex gap-3 rounded-lg py-1.5 text-dim transition-colors hover:text-text"
                      >
                        <span aria-hidden className="w-5 tabular-nums text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <article className="lg:col-span-8">
              {sections.map((section, index) => (
                <PolicySection key={section.id} id={section.id} number={index + 1} title={section.title}>
                  {section.content}
                </PolicySection>
              ))}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

type PolicySectionProps = {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
};

function PolicySection({ id, number, title, children }: PolicySectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 border-t border-hairline py-10 first:border-t-0 first:pt-0"
    >
      <h2 id={`${id}-title`} className="flex items-baseline gap-4 text-2xl font-medium tracking-[-0.01em]">
        <span aria-hidden className="text-base tabular-nums text-accent">
          {String(number).padStart(2, "0")}
        </span>
        {title}
      </h2>
      <div className="mt-5 space-y-4 leading-relaxed text-dim [&_strong]:font-medium [&_strong]:text-text">
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="relative pl-5">
          <span aria-hidden className="absolute top-[0.7em] left-0 size-1.5 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function EmailLink() {
  return (
    <a href={`mailto:${contact.email}`} className="text-text underline decoration-accent underline-offset-4 hover:text-accent">
      {contact.email}
    </a>
  );
}

/* ---------- Conteúdo de cada seção ---------- */

function Controller() {
  return (
    <>
      <p>
        O responsável pelo tratamento dos dados (o “controlador”, nos termos da LGPD) é a{" "}
        <strong>Cameleon</strong>
        {privacy.controllerName && <>, operada por <strong>{privacy.controllerName}</strong></>}
        {privacy.controllerDocument && <>, inscrita sob o nº {privacy.controllerDocument}</>}.
      </p>
      <p>
        {privacy.dpoName ? (
          <>
            O encarregado pela proteção de dados é <strong>{privacy.dpoName}</strong>, que atende pelo e-mail{" "}
            <EmailLink />.
          </>
        ) : (
          <>
            Para qualquer assunto sobre seus dados pessoais, o canal de atendimento é o e-mail <EmailLink />.
          </>
        )}
      </p>
    </>
  );
}

function SiteData() {
  return (
    <>
      <p>
        <strong>Navegar por este site não exige nenhum dado seu.</strong> Não há formulários, cadastro, login,
        cookies, ferramentas de analytics, pixels de publicidade ou scripts de terceiros. As fontes e imagens
        são servidas pelo próprio site, sem chamadas a serviços externos.
      </p>
      <p>Mesmo assim, duas coisas técnicas acontecem e você deve saber:</p>
      <List
        items={[
          <>
            <strong>Registros do servidor.</strong> Como em qualquer site, o serviço de hospedagem registra
            automaticamente informações técnicas de cada acesso, como endereço IP, data e hora, página
            acessada e tipo de navegador. Esses registros servem para manter o site funcionando e protegido
            contra ataques. A Cameleon não os usa para identificar visitantes nem para marketing.
          </>,
          <>
            <strong>Cor escolhida para o camaleão.</strong> Ao trocar a cor do tema, a escolha fica apenas na
            memória da aba aberta e desaparece ao recarregar a página. Nada é gravado no seu aparelho nem
            enviado para servidores.
          </>,
        ]}
      />
    </>
  );
}

function ContactData() {
  return (
    <>
      <p>
        Os únicos dados pessoais que chegam à Cameleon são os que <strong>você decide enviar</strong> ao clicar
        em “Conversar no WhatsApp”, “Enviar um e-mail” ou ao falar pelo Instagram. Normalmente são:
      </p>
      <List
        items={[
          "seu nome e o nome da sua empresa;",
          "seu número de telefone (no WhatsApp) ou endereço de e-mail;",
          "o conteúdo da mensagem: o que sua empresa faz, links, imagens ou arquivos que você compartilhar.",
        ]}
      />
      <p>Esses dados são usados somente para:</p>
      <List
        items={[
          "responder ao seu contato e tirar dúvidas;",
          "preparar e enviar uma proposta de serviço;",
          "executar o projeto, caso você contrate, e cumprir obrigações legais ligadas a ele (como emissão de documentos fiscais).",
        ]}
      />
      <p>
        A base legal é o <strong>art. 7º, inciso V, da LGPD</strong>: tratamento necessário para procedimentos
        preliminares e para a execução de contrato, a pedido do próprio titular. Quando houver obrigação legal
        ou regulatória, também o <strong>inciso II</strong>. Seus dados não são usados para enviar propaganda
        sem que você peça.
      </p>
      <p>
        Pedimos que não envie dados sensíveis (como informações de saúde, religião ou biometria): eles não são
        necessários para os serviços da Cameleon.
      </p>
    </>
  );
}

function Cookies() {
  return (
    <>
      <p>
        <strong>Este site não usa cookies</strong> nem tecnologias parecidas (como armazenamento local ou
        pixels de rastreamento). Por isso não há banner de cookies: não há nada a aceitar ou recusar.
      </p>
      <p>
        Os botões de WhatsApp, e-mail e Instagram levam você para fora do site. A partir daí vale a política
        de privacidade de cada plataforma (por exemplo, a do WhatsApp e a do Instagram, ambos da Meta, ou a do
        seu provedor de e-mail), que pode usar cookies próprios. A Cameleon não controla esses serviços.
      </p>
    </>
  );
}

function Storage() {
  return (
    <>
      <p>
        As conversas ficam guardadas nas contas de WhatsApp, e-mail e Instagram usadas pela Cameleon para
        atender clientes, protegidas por senha e com acesso restrito a quem trabalha no seu atendimento.
      </p>
      <p>
        Os dados são mantidos apenas pelo tempo necessário para responder ao seu contato e, se houver
        contratação, durante o projeto e pelo prazo exigido por lei para documentos fiscais e contratuais.
        Contatos que não viram projeto são apagados quando deixam de ser necessários, ou antes, se você
        pedir.
      </p>
    </>
  );
}

function Sharing() {
  return (
    <>
      <p>
        <strong>A Cameleon não vende, aluga nem cede seus dados.</strong> Eles só passam por terceiros nestes
        casos:
      </p>
      <List
        items={[
          <>
            <strong>Serviços usados na comunicação</strong>: WhatsApp, Instagram, o provedor de e-mail e o
            serviço de hospedagem do site processam os dados para que a conversa e o site funcionem. Alguns
            deles podem guardar informações em servidores fora do Brasil, conforme suas próprias políticas.
          </>,
          <>
            <strong>Autoridades públicas</strong>, quando houver ordem judicial ou obrigação legal.
          </>,
          <>
            <strong>Contabilidade</strong>, apenas os dados necessários para emitir documentos fiscais, se você
            contratar um serviço.
          </>,
        ]}
      />
    </>
  );
}

function Rights() {
  return (
    <>
      <p>
        O art. 18 da LGPD garante a você, como titular dos dados, o direito de pedir a qualquer momento:
      </p>
      <List
        items={[
          "a confirmação de que tratamos dados seus;",
          "o acesso aos dados que temos sobre você;",
          "a correção de dados incompletos, inexatos ou desatualizados;",
          "a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei;",
          "a portabilidade dos dados a outro fornecedor de serviço;",
          "a eliminação dos dados, ressalvadas as hipóteses em que a lei exige a guarda;",
          "a informação sobre com quem seus dados foram compartilhados;",
          "a revisão ou oposição a um tratamento que considere irregular.",
        ]}
      />
      <p>
        Se entender que seus direitos não foram respeitados, você também pode reclamar à{" "}
        <a
          href="https://www.gov.br/anpd"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text underline decoration-accent underline-offset-4 hover:text-accent"
        >
          Autoridade Nacional de Proteção de Dados (ANPD)
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
        .
      </p>
    </>
  );
}

function Requests() {
  return (
    <>
      <p>
        Para pedir acesso, correção ou exclusão dos seus dados, ou exercer qualquer outro direito, envie um
        e-mail para <EmailLink /> com:
      </p>
      <List
        items={[
          "seu nome e o telefone ou e-mail usado no contato com a Cameleon;",
          "o que você deseja (por exemplo: “quero saber quais dados vocês têm” ou “quero que apaguem minha conversa”).",
        ]}
      />
      <p>
        Para proteger você, podemos pedir uma confirmação simples de identidade antes de atender. O pedido não
        tem custo. A confirmação de existência e o acesso aos dados são respondidos em até{" "}
        <strong>15 dias</strong>, como prevê o art. 19 da LGPD; os demais pedidos, no menor prazo possível.
      </p>
    </>
  );
}

function Changes() {
  return (
    <p>
      Esta política pode mudar se o site ganhar novas funções (por exemplo, um formulário de contato). A data
      no topo da página sempre indica a versão em vigor, e mudanças importantes serão destacadas aqui.
    </p>
  );
}
