// Dados usados na Política de Privacidade (/privacidade).
// PREENCHA antes de publicar o site. Campos `null` simplesmente não aparecem
// na página: nada é inventado. O e-mail de contato vem de lib/contact.ts.
export const privacy = {
  /** Data da última revisão do texto. Atualize sempre que mudar a política. */
  updatedAt: "2026-11-08",
  /** Nome completo da pessoa ou razão social da empresa responsável. */
  controllerName: null as string | null,
  /** CPF ou CNPJ do responsável (opcional, mas recomendado). */
  controllerDocument: null as string | null,
  /** Nome do encarregado de dados (opcional para agentes de pequeno porte). */
  dpoName: null as string | null,
};

export function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(isoDate));
}
