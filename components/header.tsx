import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/contact";

const links = [
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Como funciona" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  return (
    // o degradê escuro mantém o logo legível quando o texto passa por baixo
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-void via-void/70 to-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#inicio" aria-label="Cameleon, voltar ao início">
          <Logo />
        </a>
        <nav aria-label="Principal" className="glass hidden rounded-full px-2 py-1.5 md:block">
          <ul className="flex items-center text-sm text-dim">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="block rounded-full px-4 py-1.5 transition-colors hover:bg-white/5 hover:text-text">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="h-10 px-5 text-sm">
          Fale comigo
        </ButtonLink>
      </div>
    </header>
  );
}
