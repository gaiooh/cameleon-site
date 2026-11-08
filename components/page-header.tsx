import Link from "next/link";
import { Logo } from "@/components/logo";

type PageHeaderProps = {
  /** Link do lado direito (ex.: "Todos os projetos", "Voltar ao site"). */
  backHref: string;
  backLabel: string;
};

// Cabeçalho das páginas internas: logo levando à home e um link de volta.
// A home tem o próprio cabeçalho, com o menu de seções.
export function PageHeader({ backHref, backLabel }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-void via-void/80 to-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="Cameleon, página inicial">
          <Logo />
        </Link>
        <Link href={backHref} className="text-sm text-dim transition-colors hover:text-text">
          {backLabel}
        </Link>
      </div>
    </header>
  );
}
